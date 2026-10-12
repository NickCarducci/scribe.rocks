export default function Privacy() {
  return (
    <article className="card prose">
      <h1>Privacy</h1>
      <p>
        Scriberocks is a journal. In the iPhone app, everything you write stays on your phone unless you sign in.
      </p>
      <p>
        If you sign in (with Apple, Google, an email link, or your phone number), your rocks are
        stored in your private account so they sync between the web and the iPhone app. Only you
        can read them. We keep the sign-in details your provider shares with us (such as your name,
        email, or phone number) and nothing else.
      </p>
      <p>
        On iPhone, the app may ask your device to share an age range. That stays on your phone and
        is only used to involve a parent or guardian before anyone under 18 joins a group.
      </p>
      <p>
        You can export everything as a CSV, and you can delete your account at any time from the
        Account page, which permanently deletes your synced rocks.
      </p>
    </article>
  );
}
