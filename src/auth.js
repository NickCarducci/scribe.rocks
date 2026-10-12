import {
  GoogleAuthProvider,
  OAuthProvider,
  RecaptchaVerifier,
  deleteUser,
  isSignInWithEmailLink,
  linkWithCredential,
  linkWithPopup,
  reauthenticateWithPopup,
  revokeAccessToken,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signInWithPhoneNumber,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase.js";
import { deleteAllData } from "./rocks.js";

const EMAIL_KEY = "scriberocks.emailForSignIn";

function provider(id) {
  if (id === "google.com") return new GoogleAuthProvider();
  const apple = new OAuthProvider("apple.com");
  apple.addScope("email");
  apple.addScope("name");
  return apple;
}

export const providerNames = {
  "apple.com": "Apple",
  "google.com": "Google",
  password: "Email link",
  emailLink: "Email link",
  phone: "Phone",
};

// When an email already belongs to an account made with another method,
// Firebase refuses the sign-in. We hold the new credential, ask the person
// to sign in the original way, then link it — one account, many methods.
let pendingLink = null;

export function pendingLinkMessage() {
  if (!pendingLink) return null;
  return `${pendingLink.email ? pendingLink.email + " already" : "That email already"} has a Scriberocks account. Sign in the way you did before, and we'll add ${providerNames[pendingLink.providerId]} to it.`;
}

async function afterSignIn(user) {
  if (!pendingLink) return;
  const { credential } = pendingLink;
  pendingLink = null;
  try {
    await linkWithCredential(user, credential);
  } catch (error) {
    if (error.code !== "auth/provider-already-linked") throw error;
  }
}

export async function signInWithProvider(id) {
  try {
    const result = await signInWithPopup(auth, provider(id));
    await afterSignIn(result.user);
  } catch (error) {
    if (error.code === "auth/account-exists-with-different-credential") {
      const credential =
        id === "google.com" ? GoogleAuthProvider.credentialFromError(error) : OAuthProvider.credentialFromError(error);
      if (credential) {
        pendingLink = { credential, providerId: id, email: error.customData?.email };
        throw new Error(pendingLinkMessage());
      }
    }
    throw error;
  }
}

// MARK: Email link (passwordless)

export async function sendEmailLink(email) {
  await sendSignInLinkToEmail(auth, email, {
    url: `${window.location.origin}/`,
    handleCodeInApp: true,
  });
  try {
    localStorage.setItem(EMAIL_KEY, email);
  } catch {
    /* storage blocked — completeEmailLink will ask for the address */
  }
}

/** Finishes sign-in when the page was opened from an emailed link. */
export async function completeEmailLinkIfPresent(askForEmail) {
  const href = window.location.href;
  if (!isSignInWithEmailLink(auth, href)) return false;
  let email = null;
  try {
    email = localStorage.getItem(EMAIL_KEY);
  } catch {
    /* ignore */
  }
  // Opened on a different device/browser: confirm the address (prevents session fixation).
  email ||= askForEmail();
  if (!email) return false;
  const result = await signInWithEmailLink(auth, email, href);
  try {
    localStorage.removeItem(EMAIL_KEY);
  } catch {
    /* ignore */
  }
  window.history.replaceState({}, document.title, "/");
  await afterSignIn(result.user);
  return true;
}

// MARK: Phone

let recaptcha = null;

export async function sendPhoneCode(phoneNumber, buttonId) {
  recaptcha ??= new RecaptchaVerifier(auth, buttonId, { size: "invisible" });
  try {
    return await signInWithPhoneNumber(auth, phoneNumber, recaptcha);
  } catch (error) {
    recaptcha.clear();
    recaptcha = null;
    throw error;
  }
}

export async function confirmPhoneCode(confirmation, code) {
  const result = await confirmation.confirm(code);
  await afterSignIn(result.user);
}

// MARK: Account

export function linkProvider(id) {
  return linkWithPopup(auth.currentUser, provider(id));
}

export function signOutUser() {
  return signOut(auth);
}

/**
 * Deletes the cloud backup and the account. Apple users re-authenticate so
 * their Apple token can be revoked (App Store guideline 5.1.1(v)).
 */
export async function deleteAccount() {
  const user = auth.currentUser;
  if (!user) return;
  const providers = user.providerData.map((p) => p.providerId);
  if (providers.includes("apple.com")) {
    const result = await reauthenticateWithPopup(user, provider("apple.com"));
    const token = OAuthProvider.credentialFromResult(result)?.accessToken;
    if (token) await revokeAccessToken(auth, token);
  } else if (providers.includes("google.com")) {
    await reauthenticateWithPopup(user, provider("google.com"));
  }
  await deleteAllData(user.uid);
  await deleteUser(user);
}

export function friendlyError(error) {
  const messages = {
    "auth/popup-closed-by-user": null,
    "auth/cancelled-popup-request": null,
    "auth/popup-blocked": "Your browser blocked the sign-in window. Allow pop-ups for this site and try again.",
    "auth/invalid-phone-number": "That phone number doesn't look right. Include your country code, like +1.",
    "auth/invalid-verification-code": "That code didn't match. Check the text message and try again.",
    "auth/code-expired": "That code expired. Send a new one.",
    "auth/invalid-action-code": "That sign-in link has expired or was already used. Send a new one.",
    "auth/invalid-email": "That email address doesn't look right.",
    "auth/too-many-requests": "Too many attempts. Wait a few minutes and try again.",
    "auth/credential-already-in-use": "That sign-in method already belongs to a different Scriberocks account.",
    "auth/requires-recent-login": "For your security, sign out and back in, then try again.",
    "auth/unauthorized-domain": "This site isn't allowed to sign in yet (add it under Firebase Auth → Authorized domains).",
    "auth/operation-not-allowed": "This sign-in method isn't turned on yet.",
  };
  if (error.code in messages) return messages[error.code];
  return error.message || "Something went wrong.";
}
