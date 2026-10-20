import { useState } from "react";
import {
  confirmPhoneCode,
  friendlyError,
  sendEmailLink,
  sendPhoneCode,
  signInWithProvider,
} from "../auth.js";

export default function SignIn({ initialError }) {
  const [error, setError] = useState(initialError);
  const [busy, setBusy] = useState(false);
  const [method, setMethod] = useState(null); // null | "email" | "phone"

  const run = async (action) => {
    setError(null);
    setBusy(true);
    try {
      await action();
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="signin">
      <div className="hero">
        <h1>Rough notes in. Final drafts out.</h1>
        <p className="muted">
          Drop rocks — quick thoughts, first drafts — and polish them with on-device suggestions. Your
          journal syncs privately between here and the iPhone app.
        </p>
      </div>

      <div className="card stack">
        <button className="btn btn-apple" disabled={busy} onClick={() => run(() => signInWithProvider("apple.com"))}>
          <AppleLogo /> Continue with Apple
        </button>
        <button className="btn btn-outline" disabled={busy} onClick={() => run(() => signInWithProvider("google.com"))}>
          <GoogleLogo /> Continue with Google
        </button>

        <div className="divider">
          <span>or</span>
        </div>

        <div className="segmented" role="tablist">
          <button role="tab" aria-selected={method === "email"} onClick={() => setMethod("email")}>
            Email link
          </button>
          <button role="tab" aria-selected={method === "phone"} onClick={() => setMethod("phone")}>
            Phone
          </button>
        </div>

        {method === "email" && <EmailForm busy={busy} run={run} />}
        {method === "phone" && <PhoneForm busy={busy} run={run} />}

        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <p className="fine">
          On iPhone? Use the same method you signed in with there to see the same journal.
        </p>
      </div>
    </section>
  );
}

function EmailForm({ busy, run }) {
  const [email, setEmail] = useState("");
  const [sentTo, setSentTo] = useState(null);

  if (sentTo) {
    return (
      <p className="notice">
        Check <strong>{sentTo}</strong> for a sign-in link. Open it in this browser to finish.{" "}
        <button className="link" onClick={() => setSentTo(null)}>
          Use a different email
        </button>
      </p>
    );
  }
  return (
    <form
      className="stack"
      onSubmit={(e) => {
        e.preventDefault();
        run(async () => {
          await sendEmailLink(email.trim());
          setSentTo(email.trim());
        });
      }}
    >
      <label className="field">
        <span>Email</span>
        <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <button className="btn btn-primary" disabled={busy}>
        Email me a sign-in link
      </button>
    </form>
  );
}

function PhoneForm({ busy, run }) {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [confirmation, setConfirmation] = useState(null);

  if (confirmation) {
    return (
      <form
        className="stack"
        onSubmit={(e) => {
          e.preventDefault();
          run(() => confirmPhoneCode(confirmation, code.trim()));
        }}
      >
        <label className="field">
          <span>6-digit code sent to {phone}</span>
          <input
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </label>
        <button className="btn btn-primary" disabled={busy}>
          Verify
        </button>
        <button type="button" className="link" onClick={() => setConfirmation(null)}>
          Use a different number
        </button>
      </form>
    );
  }
  return (
    <form
      className="stack"
      onSubmit={(e) => {
        e.preventDefault();
        run(async () => setConfirmation(await sendPhoneCode(phone.trim(), "send-code")));
      }}
    >
      <label className="field">
        <span>Phone number</span>
        <input
          type="tel"
          required
          autoComplete="tel"
          placeholder="+1 555 555 0123"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </label>
      <button id="send-code" className="btn btn-primary" disabled={busy}>
        Text me a code
      </button>
      <p className="fine">Message and data rates may apply.</p>
    </form>
  );
}

const AppleLogo = () => (
  <svg width="16" height="16" viewBox="0 0 814 1000" aria-hidden="true" fill="currentColor">
    <path d="M788 341c-6 4-108 62-108 190 0 149 131 201 135 203-1 3-21 72-69 142-43 62-88 124-156 124s-86-40-164-40c-77 0-104 41-167 41s-106-57-156-128C45 789 0 664 0 545c0-191 124-292 246-292 65 0 119 43 160 43 39 0 100-45 174-45 28 0 129 2 208 90zM558 168c31-36 52-87 52-137 0-7-1-14-2-20-50 2-109 33-145 75-28 32-54 83-54 134 0 8 1 15 2 18 3 1 9 2 14 2 45 0 101-30 133-72z" />
  </svg>
);

const GoogleLogo = () => (
  <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.9 6.1C12.5 13.7 17.8 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.2 5.3-4.6 7l7.4 5.7c4.3-4 6.9-9.9 6.9-17.2z" />
    <path fill="#FBBC05" d="M10.6 28.6c-.5-1.4-.8-3-.8-4.6s.3-3.2.8-4.6l-7.9-6.1C1 16.6 0 20.2 0 24s1 7.4 2.7 10.7l7.9-6.1z" />
    <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.7c-2.1 1.4-4.8 2.3-8.5 2.3-6.2 0-11.5-4.2-13.4-9.9l-7.9 6.1C6.6 42.6 14.6 48 24 48z" />
  </svg>
);
