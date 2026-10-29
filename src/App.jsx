import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase.js";
import { completeEmailLinkIfPresent, friendlyError } from "./auth.js";
import SignIn from "./components/SignIn.jsx";
import Journal from "./components/Journal.jsx";
import Account from "./components/Account.jsx";
import Privacy from "./components/Privacy.jsx";
import PrivacyChoices from "./components/PrivacyChoices.jsx";

export default function App() {
  const [user, setUser] = useState(undefined); // undefined = still loading
  const [view, setView] = useState("journal");
  const [linkError, setLinkError] = useState(null);
  const isPrivacy = window.location.pathname.startsWith("/privacy");
  const isChoices = window.location.pathname.startsWith("/choices");

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  useEffect(() => {
    completeEmailLinkIfPresent(() =>
      window.prompt("Confirm the email address you used to sign in:"),
    ).catch((error) => setLinkError(friendlyError(error)));
  }, []);

  return (
    <div className="shell">
      <header className="masthead">
        <a href="/" className="brand">
          <img src="/favicon.png" alt="" width="28" height="28" />
          Scriberocks
        </a>
        {user && !isPrivacy && (
          <nav className="tabs" aria-label="Sections">
            <button aria-current={view === "journal"} onClick={() => setView("journal")}>
              Journal
            </button>
            <button aria-current={view === "account"} onClick={() => setView("account")}>
              Account
            </button>
          </nav>
        )}
      </header>

      <main>
        {isPrivacy ? (
          <Privacy />
        ) : isChoices ? (
          <PrivacyChoices user={user} linkError={linkError} />
        ) : user === undefined ? (
          <p className="muted center">Loading…</p>
        ) : user === null ? (
          <SignIn initialError={linkError} />
        ) : view === "account" ? (
          <Account user={user} />
        ) : (
          <Journal uid={user.uid} />
        )}
      </main>

      <footer className="footer">
        <a href="/privacy">Privacy</a>
        <a href="/choices">Privacy choices</a>
        <a href="https://apps.apple.com/app/scriberocks/id6448929626">iPhone app</a>
      </footer>
    </div>
  );
}
