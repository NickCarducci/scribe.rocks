export default function Privacy() {
  return (
    <article className="card prose">
      <h1>Privacy</h1>
      <p>
        Scriberocks is a journal and writing tool. ScribeSLM, the language pipeline
        inside the iPhone app, runs on your iPhone. Your writing is not sent to an
        artificial-intelligence service, and Scriberocks does not collect keystrokes.
      </p>
      <p>
        Rocks and their revision histories are stored on your iPhone. If you sign
        in, they are also synchronized to your private Firebase account so they
        can be used on the web and across supported sessions. We store the
        account details your sign-in provider shares with us, such as your name
        and email address.
      </p>
      <p>
        If you choose to join Groups, your membership and the posts you share are
        stored in Firebase so Groups, moderation, and account deletion can work.
        Group posts are associated with your account and author name.
      </p>
      <p>
        On iPhone, a declared age range stays on your device and is used for
        age-appropriate Group controls. You can export your web journal as a
        CSV and delete your account and synchronized data from the{" "}
        <a href="/choices">Privacy choices</a> page.
      </p>
    </article>
  );
}
