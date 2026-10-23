// scribe.rocks/app: the link the iOS app shares. iPhones and iPads go to the
// App Store (which offers "Open" when Scriberocks is installed); everyone
// else stays on scribe.rocks. Link previews (iMessage thumbnails) come from
// the Open Graph tags in index.html.
export const APP_STORE_URL = "https://apps.apple.com/app/id6448929626";

/** iPhone, iPod or iPad (iPadOS reports a Mac user agent, but with touch). */
export function isAppleMobile(userAgent, maxTouchPoints = 0) {
  if (/iPhone|iPad|iPod/.test(userAgent)) return true;
  return /Macintosh/.test(userAgent) && maxTouchPoints > 1;
}

/** Where to send a visitor to `path`, or null to show the site. */
export function appLinkTarget(path, userAgent, maxTouchPoints = 0) {
  if (path.replace(/\/+$/, "") !== "/app") return null;
  return isAppleMobile(userAgent, maxTouchPoints) ? APP_STORE_URL : "/";
}
