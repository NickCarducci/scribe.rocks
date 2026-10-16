import { test } from "node:test";
import assert from "node:assert/strict";

import { showingRevision, withRevision } from "./revisions.js";

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
