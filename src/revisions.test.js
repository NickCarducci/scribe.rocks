import { test } from "node:test";
import assert from "node:assert/strict";

import { revisionChoices, showingRevision, when, withRevision } from "./revisions.js";

const t0 = new Date("2026-10-14T00:00:00Z");
const rock = { id: "A", text: "a", createdAt: t0, revisions: [{ text: "a", createdAt: t0, source: "written" }], revisionIndex: 0 };

test("revising appends and shows the newest", () => {
  const r = withRevision(withRevision(rock, "b", "edited", t0), "c", "suggestion", t0);
  assert.deepEqual(r.revisions.map((x) => x.text), ["a", "b", "c"]);
  assert.equal(r.text, "c");
  assert.equal(r.revisionIndex, 2);
});

test("stepping back then revising keeps all history", () => {
  const r = withRevision(showingRevision(withRevision(rock, "b", "edited", t0), 0), "c", "edited", t0);
  assert.deepEqual(r.revisions.map((x) => x.text), ["a", "b", "c"]);
  assert.equal(r.revisionIndex, 2);
});

test("unchanged or empty text adds nothing", () => {
  assert.equal(withRevision(rock, "  a ", "edited"), rock);
  assert.equal(withRevision(rock, "   ", "edited"), rock);
});

// Revisions by date (dropdown), as on iOS.
const threeVersions = () => {
  let r = { text: "one", revisions: [{ text: "one", createdAt: new Date("2026-10-01T10:00:00"), source: "written" }], revisionIndex: 0 };
  r = withRevision(r, "two", "edited", new Date("2026-10-05T10:00:00"));
  return withRevision(r, "three", "suggestion", new Date("2026-10-09T10:00:00"));
};

test("versions are newest first, latest marked", () => {
  const choices = revisionChoices(threeVersions());
  assert.deepEqual(choices.map((c) => c.index), [2, 1, 0]);
  assert.deepEqual(choices.map((c) => c.isLatest), [true, false, false]);
  assert.equal(choices[2].text, "one");
});

test("dates read as today or month and day", () => {
  const now = new Date("2026-10-09T18:00:00");
  assert.match(when(new Date("2026-10-09T10:05:00"), now), /^Today, /);
  assert.match(when(new Date("2026-10-01T10:05:00"), now), /^Oct 1, /);
});
