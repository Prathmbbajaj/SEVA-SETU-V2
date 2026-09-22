// Comprehensive functional test for Pop-up Service Booking & Sub-Services Catalog
const fs = require("fs");
const path = require("path");
const vm = require("vm");

// Minimal DOM mock
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

const mockIds = [
  "modal-service-booking", "booking-modal-title", "booking-modal-badge", "booking-modal-subtitle",
  "booking-modal-service-icon", "booking-modal-service-icon-box",
  "step-btn-1", "step-btn-2", "step-txt-1", "step-txt-2",
  "booking-step-1", "txt-subservice-heading", "txt-subservice-subheading", "modal-subservices-grid",
  "booking-step-2", "step2-sub-icon", "step2-service-label", "step2-sub-title",
  "txt-dispatch-mode-title", "badge-schedule-status", "btn-mode-immediate", "btn-mode-scheduled",
  "scheduled-picker-details", "chip-day-today", "chip-day-tomorrow", "chip-day-day_after",
  "booking-date-input", "slot-btn-morning", "slot-btn-afternoon", "slot-btn-evening", "slot-btn-night",
  "booking-custom-time", "btn-clear-custom-time", "confirmed-slot-display",
  "plan-hourly-label", "plan-daily-label", "plan-weekly-label", "plan-monthly-label",
  "ngo-checkbox", "ngo-verified-pill", "ngo-verified-label", "ngo-unverified-hint", "ngo-selection-container",
  "transparent-invoice-box", "invoice-schedule-time", "lbl-quote-service",
  "quote-labor", "quote-toolkit", "quote-dist", "quote-transit", "row-emergency", "quote-emergency",
  "quote-tax", "quote-platform", "row-ngo", "quote-ngo", "row-subscriber-discount", "lbl-subscriber-discount",
  "quote-subscriber-discount", "quote-total", "btn-book-service",
  "modal-payment-gateway", "pay-summary-service", "pay-summary-slot-text", "pay-summary-total",
  "pay-modal-labor", "pay-modal-toolkit", "pay-modal-transit", "pay-modal-tax", "pay-modal-platform",
  "pay-modal-ngo", "pay-modal-sub-discount", "pay-row-emergency", "pay-modal-emergency",
  "pay-qr-image", "btn-pay-text", "btn-process-payment", "tab-pay-qr", "pay-view-qr",
  "services-grid", "active-worker-card", "worker-status-name", "worker-status-coop",
  "booking-status-card", "booking-status-title", "status-booking-slot", "display-start-otp", "display-end-otp",
  "status-worker-name", "status-worker-coop", "status-worker-dist", "status-worker-photo",
  "incoming-job-card", "radar-service-type", "radar-client-name", "radar-client-dist", "radar-payout",
  "radar-idle-msg", "worker-fallback-notice", "worker-radar-ping-badge", "citizen-debarred-alert", "citizen-debarred-alert-text",
  "emergency-toggle"
];

mockIds.forEach(id => {
  elements[id] = createElement("div");
  elements[id].id = id;
});

global.document = {
  getElementById(id) { return elements[id] || null; },
  createElement(tag) { return createElement(tag); },
  querySelectorAll(sel) { return []; },
  body: createElement("body"),
  addEventListener() {},
  removeEventListener() {}
};

global.window = { location: { hostname: "localhost" } };
global.safeCreateIcons = () => {};
global.computeDistanceKm = () => 1.8;
global.getWorkerCoords = () => [28.6328, 77.2197];
global.drawRouteLine = () => {};
global.updateTimeline = () => {};
global.showToast = (msg, type) => console.log(`  [TOAST ${type?.toUpperCase()}]: ${msg}`);
global.sfx = {
  playClick() {},
  playAlert() {},
  playSuccessFanfare() {},
  playFallbackWarning() {}
};
global.API_BASE_URL = "http://localhost:8000";

// Load app.js
const appJsPath = path.join(__dirname, "../frontend/app.js");
const appCode = fs.readFileSync(appJsPath, "utf8");
vm.runInThisContext(appCode);

console.log("=======================================================");
console.log("  TESTING POP-UP SERVICE BOOKING WORKFLOW");
console.log("=======================================================");

// Test 1: Verify all 12 services have entries in SUB_SERVICES_CATALOG
const requiredServices = [
  "electrician", "plumber", "carpentry", "cleaning", "painting", "healthcare",
  "masonry", "pottery", "blacksmith", "tailoring", "driver", "waste_management"
];

requiredServices.forEach(sId => {
  if (!SUB_SERVICES_CATALOG[sId] || SUB_SERVICES_CATALOG[sId].length < 4) {
    console.error(`[FAIL] Catalog missing or insufficient subservices for: ${sId}`);
    process.exit(1);
  }
});
console.log(`[PASS] SUB_SERVICES_CATALOG contains robust sub-services for all 12 certified trades.`);

// Test 2: Select Service and verify modal opens in Step 1
selectService("plumber", true);

if (state.selectedService !== "plumber") {
  console.error("[FAIL] state.selectedService not updated to plumber");
  process.exit(1);
}

const bookingModal = elements["modal-service-booking"];
if (bookingModal.classList.contains("hidden")) {
  console.error("[FAIL] modal-service-booking was not displayed when selectService was called with openModal=true");
  process.exit(1);
}
console.log("[PASS] selectService('plumber', true) successfully revealed modal-service-booking.");

// Test 3: Verify Subservices rendered in Step 1
const gridChildren = elements["modal-subservices-grid"].children;
if (gridChildren.length < 5) {
  console.error(`[FAIL] Expected at least 5 subservices rendered, got ${gridChildren.length}`);
  process.exit(1);
}
console.log(`[PASS] Rendered ${gridChildren.length} specific plumbing sub-service cards in Step 1.`);

// Test 4: Select a sub-service and verify advance to Step 2
selectSubService("tap_pipe_leakage");
if (!state.selectedSubService || state.selectedSubService.id !== "tap_pipe_leakage") {
  console.error("[FAIL] state.selectedSubService was not set to tap_pipe_leakage");
  process.exit(1);
}

if (!elements["booking-step-1"].classList.contains("hidden")) {
  console.error("[FAIL] Step 1 was not hidden after selecting subservice");
  process.exit(1);
}

if (elements["booking-step-2"].classList.contains("hidden")) {
  console.error("[FAIL] Step 2 was not revealed after selecting subservice");
  process.exit(1);
}
console.log("[PASS] selectSubService('tap_pipe_leakage') seamlessly advanced modal to Step 2.");

// Test 5: Verify Step 2 Breadcrumbs and Price Quote
if (elements["step2-sub-title"].innerText !== "Tap & Pipe Leakage Repair") {
  console.error(`[FAIL] Step 2 title unexpected: ${elements["step2-sub-title"].innerText}`);
  process.exit(1);
}
console.log("[PASS] Step 2 breadcrumb displays selected task: 'Tap & Pipe Leakage Repair'.");

// Test 6: Verify Dispatch Mode Toggling
setBookingScheduleType("scheduled");
if (state.bookingScheduleType !== "scheduled") {
  console.error("[FAIL] bookingScheduleType not set to scheduled");
  process.exit(1);
}
if (elements["scheduled-picker-details"].classList.contains("hidden")) {
  console.error("[FAIL] scheduled-picker-details was not unhidden for scheduled mode");
  process.exit(1);
}
console.log("[PASS] setBookingScheduleType('scheduled') revealed date & time slot pickers inside the modal.");

// Test 7: Verify Slot Selection
selectQuickDay("tomorrow");
selectTimeSlot("09:00 AM - 12:00 PM", "morning");
const confirmedSlot = elements["confirmed-slot-display"].innerText;
if (!confirmedSlot.includes("09:00 AM - 12:00 PM")) {
  console.error(`[FAIL] Confirmed slot display unexpected: ${confirmedSlot}`);
  process.exit(1);
}
console.log(`[PASS] Booking slot picked: ${confirmedSlot}`);

// Test 8: Open Payment Gateway from Modal
openPaymentGatewayModal();
if (!bookingModal.classList.contains("hidden")) {
  console.error("[FAIL] modal-service-booking should be hidden when payment gateway opens");
  process.exit(1);
}
if (elements["modal-payment-gateway"].classList.contains("hidden")) {
  console.error("[FAIL] modal-payment-gateway was not shown");
  process.exit(1);
}
const orderSummaryText = elements["pay-summary-service"].innerText;
if (!orderSummaryText.includes("Plumber") || !orderSummaryText.includes("Tap & Pipe Leakage")) {
  console.error(`[FAIL] Payment order summary missing sub-service: ${orderSummaryText}`);
  process.exit(1);
}
console.log(`[PASS] Payment Gateway opened cleanly with order summary: "${orderSummaryText}".`);

// Test 9: Execute Booking Confirmation
executeBookingConfirmed();
if (!state.activeBooking) {
  console.error("[FAIL] state.activeBooking was not created");
  process.exit(1);
}
if (state.activeBooking.sub_service !== "Tap & Pipe Leakage Repair") {
  console.error(`[FAIL] activeBooking.sub_service unexpected: ${state.activeBooking.sub_service}`);
  process.exit(1);
}
console.log(`[PASS] Booking #${state.activeBooking.booking_id} confirmed with sub-service: ${state.activeBooking.sub_service}.`);

// Test 10: Verify Worker Radar sync has sub-service
if (!elements["radar-service-type"].innerText.includes("Tap & Pipe Leakage")) {
  console.error(`[FAIL] Radar service type missing subservice: ${elements["radar-service-type"].innerText}`);
  process.exit(1);
}
console.log(`[PASS] Worker Radar ping received with trade + task: "${elements["radar-service-type"].innerText}".`);

console.log("\n=======================================================");
console.log("  ALL 10 POP-UP SERVICE BOOKING TESTS PASSED (100% OK) ");
console.log("=======================================================\n");
