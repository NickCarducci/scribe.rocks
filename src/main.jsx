import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";
import { appLinkTarget } from "./appLink.js";

// scribe.rocks/app (shared from the iOS app): iPhones and iPads go to the App Store.
const target = appLinkTarget(location.pathname, navigator.userAgent, navigator.maxTouchPoints);
if (target && target !== "/") location.replace(target);
else if (target) history.replaceState(null, "", "/");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
