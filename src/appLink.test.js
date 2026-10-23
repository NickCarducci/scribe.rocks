import { test } from "node:test";
import assert from "node:assert/strict";
import { appLinkTarget, APP_STORE_URL } from "./appLink.js";

const iPhone = "Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1";
const iPadOS = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15";
const android = "Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Mobile Safari/537.36";

test("iPhones and iPads on /app go to the App Store", () => {
  assert.equal(appLinkTarget("/app", iPhone), APP_STORE_URL);
  assert.equal(appLinkTarget("/app/", iPadOS, 5), APP_STORE_URL);
});

test("Macs and other phones on /app see the site", () => {
  assert.equal(appLinkTarget("/app", iPadOS, 0), "/");
  assert.equal(appLinkTarget("/app", android), "/");
});

test("other paths are left alone", () => {
  assert.equal(appLinkTarget("/", iPhone), null);
  assert.equal(appLinkTarget("/application", iPhone), null);
});
