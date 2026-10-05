// Test script to verify subscription gating and schedule-only rules for normal customers
const fs = require("fs");
const path = require("path");
const vm = require("vm");

// Check HTML file directly
const html = fs.readFileSync(path.join(__dirname, "../frontend/index.html"), "utf8");

// 1. Verify 'Show 6 services' or 'btn-toggle-services' is removed from HTML
if (html.includes("btn-toggle-services") || html.includes("Show All 12 Services") || html.includes("Show All 6 Services")) {
  console.error("[FAIL] 'Show 6 services' / 'btn-toggle-services' still found in index.html");
  process.exit(1);
}
console.log("[PASS] 'Show 6 services' toggle button is confirmed removed from index.html.");

// 2. Verify emergency subscriber badge and instant dispatch subscriber badge exist in HTML
if (!html.includes("emergency-sub-badge")) {
  console.error("[FAIL] emergency-sub-badge not found in index.html");
  process.exit(1);
}
console.log("[PASS] emergency-sub-badge present in index.html.");

if (!html.includes("badge-immediate-access")) {
  console.error("[FAIL] badge-immediate-access not found in index.html");
  process.exit(1);
}
console.log("[PASS] badge-immediate-access present in index.html.");

// Build DOM Mock for app.js testing
const elements = {};
function createElement(tag) {
  const el = {
    tagName: tag.toUpperCase(),
    className: "",
    style: {},
    children: [],
    attributes: {},
    innerHTML: "",
    innerText: "",
    checked: false,
    classList: {
      _classes: new Set(),
      add(c) { this._classes.add(c); el.className = Array.from(this._classes).join(" "); },
      remove(c) { this._classes.delete(c); el.className = Array.from(this._classes).join(" "); },
      contains(c) { return this._classes.has(c); }
    },
    setAttribute(k, v) { this.attributes[k] = v; },
    getAttribute(k) { return this.attributes[k]; },
    appendChild(child) { this.children.push(child); },
    prepend(child) { this.children.unshift(child); },
    querySelector(sel) { return null; },
    querySelectorAll(sel) { return []; },
    getBoundingClientRect() { return { width: 800, height: 400, left: 0, top: 0 }; },
    addEventListener() {},
    focus() {}
  };
  return el;
}

const allMockIds = [
  "service-grid", "service-toggle-container", "txt-toggle-services", "icon-toggle-services",
  "emergency-toggle", "emergency-box", "siren-icon", "emergency-sub-badge", "txt-emergency-desc",
  "modal-subscription-gateway", "sub-modal-plan-name", "sub-modal-price",
  "btn-mode-immediate", "btn-mode-scheduled", "badge-immediate-access", "desc-immediate-mode",
  "scheduled-picker-details", "badge-schedule-status", "confirmed-slot-display",
  "invoice-schedule-time", "pay-summary-slot-text", "status-booking-slot",
  "booking-date-input", "modal-service-booking", "booking-step-1", "booking-step-2",
  "modal-payment-gateway", "btn-book-service", "citizen-debarred-alert", "citizen-debarred-alert-text",
  "pay-summary-service", "pay-summary-total", "pay-modal-labor", "pay-modal-toolkit", "pay-modal-transit",
  "pay-modal-tax", "pay-modal-platform", "pay-modal-emergency-row", "pay-modal-emergency", "pay-modal-ngo-row",
  "quote-labor", "quote-toolkit", "quote-dist", "quote-transit", "row-emergency", "quote-emergency",
  "quote-tax", "quote-platform", "row-ngo", "quote-ngo", "row-subscriber-discount", "lbl-subscriber-discount",
  "quote-subscriber-discount", "quote-total", "subscription-active-status", "sub-active-badge-text",
  "offers-list-container", "modal-subscription-success", "active-worker-card", "worker-status-name",
  "worker-status-coop", "booking-status-card", "incoming-job-card", "radar-service-type", "radar-client-name",
  "radar-client-dist", "radar-payout", "radar-idle-msg", "worker-fallback-notice", "worker-radar-ping-badge",
  "client-map"
];

allMockIds.forEach(id => {
  elements[id] = createElement("div");
});

global.window = {
  document: {
    getElementById(id) {
      if (!elements[id]) elements[id] = createElement("div");
      return elements[id];
    },
    createElement(tag) { return createElement(tag); },
    body: createElement("body"),
    addEventListener() {}
  },
  addEventListener() {},
  location: { reload() {} },
  setTimeout: (fn) => fn(),
  clearTimeout() {},
  setInterval() {},
  clearInterval() {},
  fetch: () => Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
};
global.document = global.window.document;
global.AudioContext = class {
  createOscillator() { return { connect() {}, start() {}, stop() {} }; }
  createGain() { return { gain: { setValueAtTime() {}, linearRampToValueAtTime() {} }, connect() {} }; }
};
global.webkitAudioContext = class {};
global.L = {
  map: () => ({ setView() { return this; }, addLayer() { return this; } }),
  tileLayer: () => ({ addTo() { return this; } }),
  circle: () => ({ addTo() { return this; } }),
  divIcon: () => ({})
};
global.lucide = { createIcons() {} };
global.fetch = global.window.fetch;

const appJsPath = path.join(__dirname, "../frontend/app.js");
const appCode = fs.readFileSync(appJsPath, "utf8");
vm.runInThisContext(appCode);

// TEST 1: Service grid renders all 6 services with no toggle button
initServiceGrid();
const serviceGridChildren = elements["service-grid"].children;
if (serviceGridChildren.length !== 6) {
  console.error(`[FAIL] Expected 6 services in grid, got ${serviceGridChildren.length}`);
  process.exit(1);
}
console.log(`[PASS] initServiceGrid() rendered all 6 services directly (count: ${serviceGridChildren.length}).`);

// TEST 2: Emergency Triage Mode for Non-Subscribed User is BLOCKED
const emToggle = elements["emergency-toggle"];
emToggle.checked = true;
toggleEmergencyMode();

if (state.isEmergency !== false) {
  console.error("[FAIL] state.isEmergency should remain false for non-subscribed user");
  process.exit(1);
}
if (emToggle.checked !== false) {
  console.error("[FAIL] emergency-toggle checkbox should be reset to unchecked for non-subscribed user");
  process.exit(1);
}
console.log("[PASS] Emergency Triage is strictly blocked for non-subscribed users.");

// TEST 3: Normal Customer can only book from a schedule
initBookingSchedule();
if (state.bookingScheduleType !== "scheduled") {
  console.error(`[FAIL] Default booking mode for normal customer should be 'scheduled', got ${state.bookingScheduleType}`);
  process.exit(1);
}
console.log("[PASS] Normal customer booking mode defaults to 'scheduled'.");

// TEST 4: Attempting to switch to instant dispatch as non-subscriber is BLOCKED
setBookingScheduleType("immediate", true);
if (state.bookingScheduleType !== "scheduled") {
  console.error(`[FAIL] Instant dispatch should be blocked for non-subscriber, got ${state.bookingScheduleType}`);
  process.exit(1);
}
console.log("[PASS] Instant Dispatch switch correctly blocked for non-subscribed user.");

// TEST 5: Activate Subscription Pass
state.activeSubscription = {
  plan_id: "monthly_pass",
  plan_name: "Seva Setu Samriddhi Monthly Pass",
  status: "active"
};
updateSubscriberGatingUI();

// TEST 6: Subscribed User CAN activate Emergency Triage Mode
emToggle.checked = true;
toggleEmergencyMode();
if (state.isEmergency !== true) {
  console.error("[FAIL] Subscribed user should be permitted to activate emergency triage mode");
  process.exit(1);
}
console.log("[PASS] Subscribed user successfully activated Emergency Triage Mode.");

// TEST 7: Subscribed User CAN use Instant Dispatch
setBookingScheduleType("immediate", true);
if (state.bookingScheduleType !== "immediate") {
  console.error("[FAIL] Subscribed user should be allowed to select instant dispatch");
  process.exit(1);
}
console.log("[PASS] Subscribed user successfully selected Instant Dispatch.");

console.log("\n=================================================================");
console.log("  ALL SUBSCRIPTION GATING & SCHEDULE-ONLY TESTS PASSED (100% OK) ");
console.log("=================================================================\n");
