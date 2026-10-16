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
