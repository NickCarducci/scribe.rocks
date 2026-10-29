import Account from "./Account.jsx";
import SignIn from "./SignIn.jsx";
import { useEffect, useState } from "react";
import { watchRocks } from "../rocks.js";
import { downloadCSV } from "../csv.js";

export default function PrivacyChoices({ user, linkError }) {
  const [rocks, setRocks] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.uid) return undefined;
    return watchRocks(user.uid, setRocks, (nextError) => setError(nextError.message));
  }, [user?.uid]);

  if (user === undefined) {
    return <p className="muted center">Loading…</p>;
  }

  if (user === null) {
    return (
      <section className="stack-lg">
        <article className="card prose">
          <h1>Privacy choices</h1>
          <p>
            Sign in to export your journal, manage sign-in methods, or delete
            your account and synchronized rocks.
          </p>
        </article>
        <SignIn initialError={linkError} />
      </section>
    );
  }

  return (
    <section className="stack-lg">
      <article className="card prose">
        <h1>Privacy choices</h1>
        <p>
          Manage your account below. Deleting your account removes your
          synchronized rocks and revision history from Firebase. Rocks saved
          only on an iPhone remain on that device.
        </p>
        <button className="btn btn-quiet" disabled={!rocks?.length} onClick={() => downloadCSV(rocks)}>
          Export CSV
        </button>
        {error && <p className="error" role="alert">{error}</p>}
      </article>
      <Account user={user} />
    </section>
  );
}
