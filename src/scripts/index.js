/**
 * Main entry point for the application.
 * Initializes page-specific modules based on the current page context.
 */
import "../pages/index.css";
import { initPopupListeners } from "./popup.js"; // Corrected import from popup.js
import { initAuth } from "./auth.js";
import { initFarmer } from "./farmer.js";

// Initialize popup close listeners (common for all pages)
initPopupListeners();

// Initialize page-specific logic
if (document.querySelector(".page")) {
  initAuth();
} else if (document.querySelector(".farmer")) {
  initFarmer();
}
