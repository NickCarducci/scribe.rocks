import { useState } from "react";
import { deleteAccount, friendlyError, linkProvider, providerNames, signOutUser } from "../auth.js";

const LINKABLE = ["apple.com", "google.com"];

export default function Account({ user }) {
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [, rerender] = useState(0);
  const linked = user.providerData.map((p) => p.providerId);

  const run = async (action) => {
    setError(null);
    setBusy(true);
    try {
      await action();
      rerender((n) => n + 1);
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="stack-lg">
      <div className="card stack">
        <h2>{user.displayName || user.email || user.phoneNumber || "Your account"}</h2>
        {user.displayName && (user.email || user.phoneNumber) && (
          <p className="muted">{user.email || user.phoneNumber}</p>
        )}

        <h3>Sign-in methods</h3>
        <ul className="methods">
          {linked.map((id) => (
            <li key={id}>✓ {providerNames[id] ?? id}</li>
          ))}
        </ul>
        {LINKABLE.filter((id) => !linked.includes(id)).map((id) => (
          <button key={id} className="btn btn-outline" disabled={busy} onClick={() => run(() => linkProvider(id))}>
            Add {providerNames[id]}
          </button>
        ))}
        <p className="fine">
          Add the method you use on iPhone so both open the same journal. A method already used by a
          different account can't be added.
        </p>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
      </div>

      <div className="card stack">
        <button className="btn btn-outline" disabled={busy} onClick={() => run(signOutUser)}>
          Sign out
        </button>
        <button
          className="btn btn-outline danger"
          disabled={busy}
          onClick={() =>
            window.confirm(
              "Delete your account? This permanently deletes your account and every synced rock. Rocks saved only on your iPhone stay there.",
            ) && run(deleteAccount)
          }
        >
          Delete account
        </button>
      </div>
    </section>
  );
}
