// Revision history helpers (pure). Mirrors Rock.revise / Rock.show in the iOS app.

/** Pure: a new revision at the end of history, shown. History is never truncated. */
export function withRevision(rock, text, source, at = new Date()) {
  const trimmed = text.trim();
  if (!trimmed || trimmed === rock.text) return rock;
  const revisions = [...rock.revisions, { text: trimmed, createdAt: at, source }];
  return { ...rock, text: trimmed, revisions, revisionIndex: revisions.length - 1 };
}

/** Pure: show another revision (‹ ›). */
export function showingRevision(rock, index) {
  if (index < 0 || index >= rock.revisions.length) return rock;
  return { ...rock, text: rock.revisions[index].text, revisionIndex: index };
}

/** Saved versions, newest first (mirrors RockEditorViewModel.revisionChoices on iOS). */
export function revisionChoices(rock) {
  const last = rock.revisions.length - 1;
  return rock.revisions.map((r, index) => ({ index, date: r.createdAt, isLatest: index === last, text: r.text })).reverse();
}

/** "Today, 5:19 PM" or "Oct 12, 3:04 PM". */
export function when(date, now = new Date()) {
  const time = date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  return date.toDateString() === now.toDateString()
    ? `Today, ${time}`
    : `${date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}, ${time}`;
}
