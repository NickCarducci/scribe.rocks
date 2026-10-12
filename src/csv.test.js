import { test } from "node:test";
import assert from "node:assert/strict";
import { escapeField, rocksToCSV } from "./csv.js";

test("escapes like the iOS export", () => {
  assert.equal(escapeField("plain"), "plain");
  assert.equal(escapeField("a,b"), '"a,b"');
  assert.equal(escapeField('say "hi"'), '"say ""hi"""');
  assert.equal(escapeField("line\nbreak"), '"line\nbreak"');
});

test("writes header and status", () => {
  const d = new Date("2026-10-12T00:00:00Z");
  const csv = rocksToCSV([{ text: "x", createdAt: d, updatedAt: d, isDiamond: true }]);
  assert.equal(csv, "created_at,updated_at,status,text\n2026-10-12T00:00:00.000Z,2026-10-12T00:00:00.000Z,diamond,x\n");
});
