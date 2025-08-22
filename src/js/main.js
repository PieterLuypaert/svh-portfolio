import { PortfolioManager } from "./portfolioManager.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing portfolio...");
  try {
    const portfolioManager = new PortfolioManager();
    portfolioManager.init();
  } catch (error) {
    console.error("Error initializing portfolio:", error);
  }
});

// Add fallback if DOMContentLoaded already fired
if (document.readyState === "loading") {
  // Document is still loading
} else {
  // Document has already loaded
  console.log("Document already loaded, initializing portfolio...");
  try {
    const portfolioManager = new PortfolioManager();
    portfolioManager.init();
  } catch (error) {
    console.error("Error initializing portfolio:", error);
  }
}
