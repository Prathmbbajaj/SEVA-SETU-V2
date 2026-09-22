const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const htmlPath = path.join(__dirname, "../frontend/index.html");
const appJsPath = path.join(__dirname, "../frontend/app.js");

const htmlContent = fs.readFileSync(htmlPath, "utf8");
const appJsContent = fs.readFileSync(appJsPath, "utf8");

// Setup JSDOM
const dom = new JSDOM(htmlContent, {
  url: "http://localhost:3000/",
  runScripts: "dangerously",
  resources: "usable"
});

const { window } = dom;

// Mock external browser APIs
window.L = {
  map: () => ({
    setView: () => ({}),
    removeLayer: () => {},
    fitBounds: () => {},
    remove: () => {}
  }),
  tileLayer: () => ({ addTo: () => {} }),
  marker: () => ({ addTo: () => ({ bindPopup: () => {} }) }),
  divIcon: () => ({}),
  polyline: () => ({ addTo: () => ({ getBounds: () => [[0,0],[1,1]] }) })
};

window.lucide = {
  createIcons: () => {}
};

window.Audio = class {
  play() { return Promise.resolve(); }
  pause() {}
};

window.alert = (msg) => console.log("ALERT:", msg);

// Capture console errors
window.console.error = (...args) => console.log("[BROWSER ERROR]:", ...args);
window.console.warn = (...args) => console.log("[BROWSER WARN]:", ...args);

window.setInterval = () => {};
window.setTimeout = (fn) => { fn(); };

// Track unhandled errors
window.addEventListener("error", (e) => {
  console.log("[WINDOW ERROR]:", e.message, "at line", e.lineno, e.filename);
});

// Run app.js in this window
try {
  window.eval(appJsContent);
} catch (e) {
  console.log("Error evaluating app.js:", e);
}

// Fire DOMContentLoaded
console.log("Dispatching DOMContentLoaded...");
try {
  window.document.dispatchEvent(new window.Event("DOMContentLoaded"));
} catch (e) {
  console.log("Error during dispatching DOMContentLoaded:", e);
}

console.log("=== DOMContentLoaded finished ===");
console.log("SERVICES length in window:", window.SERVICES ? window.SERVICES.length : "undefined");
console.log("state in window:", window.state ? "defined, selectedService=" + window.state.selectedService : "undefined");


// 1. Inspect Service Grid
const grid = window.document.getElementById("service-grid");
console.log("Service grid child count:", grid ? grid.children.length : "NO GRID");

// 2. Check modal initial state
const modal = window.document.getElementById("modal-service-booking");
console.log("Modal found:", Boolean(modal));
console.log("Modal initial classList:", modal ? modal.className : "N/A");

// 3. Click first service card
if (grid && grid.children.length > 0) {
  const firstCard = grid.children[0];
  console.log("First card innerText:", firstCard.textContent.trim().replace(/\s+/g, ' ').substring(0, 60));
  console.log("Clicking first card...");
  firstCard.click();

  console.log("Modal classList after click:", modal.className);
  console.log("Modal has 'hidden'?:", modal.classList.contains("hidden"));
  console.log("Modal display style:", modal.style.display);

  // Check Step 1 subservices
  const subGrid = window.document.getElementById("modal-subservices-grid");
  console.log("Subservices rendered count:", subGrid ? subGrid.children.length : 0);

  if (subGrid && subGrid.children.length > 0) {
    console.log("Clicking first subservice...");
    subGrid.children[0].click();
    console.log("Step 1 hidden?:", window.document.getElementById("booking-step-1").classList.contains("hidden"));
    console.log("Step 2 hidden?:", window.document.getElementById("booking-step-2").classList.contains("hidden"));
  }
} else {
  console.log("NO CARDS IN GRID!");
}

process.exit(0);

