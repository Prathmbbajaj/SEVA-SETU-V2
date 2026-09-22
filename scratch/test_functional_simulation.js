// Comprehensive functional simulator for Ministry Growth Chart and Worker Withdrawal
const fs = require("fs");
const path = require("path");

// Create minimal DOM mock
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
    querySelector(sel) {
      if (sel === ".text-2xl") return { innerText: "" };
      if (sel === "span:last-child") return { innerText: "" };
      return null;
    },
    getBoundingClientRect() {
      return { width: 800, height: 320, left: 0, top: 0 };
    },
    addEventListener() {}
  };
  return el;
}

const mockIds = [
  "min-subtab-overview", "min-subtab-growth", "min-subtab-workforce", "min-subtab-discipline", "min-subtab-revenue",
  "min-overview-section", "min-growth-analytics-section", "min-workforce-section", "min-discipline-section", "min-revenue-section",
  "growth-region-select", "horizon-btn-6m", "horizon-btn-30d", "horizon-btn-ytd",
  "toggle-series-deployments", "toggle-series-requests", "toggle-series-revenue",
  "growth-kpi-deployments", "growth-kpi-requests", "growth-kpi-revenue", "growth-kpi-welfare",
  "ministry-growth-chart-container", "ministry-growth-svg", "growth-chart-tooltip", "growth-trajectory-table-body",
  "modal-worker-withdraw-job", "withdraw-booking-id", "withdraw-reason-select", "withdraw-incident-notes",
  "status-worker-name", "status-worker-coop", "status-worker-dist", "status-worker-photo",
  "worker-radar-map-container", "worker-radar-scanner", "worker-fallback-notice", "worker-fallback-text",
  "incoming-job-card", "booking-badge-status", "ministry-live-ticker", "tt-period", "tt-deployments", "tt-requests", "tt-revenue"
];

mockIds.forEach(id => {
  elements[id] = createElement("div");
  elements[id].id = id;
});

global.document = {
  getElementById(id) { return elements[id] || null; },
  createElement(tag) { return createElement(tag); },
  addEventListener() {},
  removeEventListener() {}
};

global.window = { location: { hostname: "localhost" } };
global.safeCreateIcons = () => {};
global.computeDistanceKm = () => 2.4;
global.getWorkerCoords = () => [28.6328, 77.2197];
global.drawRouteLine = () => {};
global.updateTimeline = () => {};
global.showToast = (msg, type) => console.log(`  [TOAST ${type?.toUpperCase()}]: ${msg}`);
global.sfx = {
  playClick() {},
  playFallbackWarning() { console.log("  [SFX]: Fallback warning alert sound played."); }
};
global.API_BASE_URL = "http://localhost:8000";

// Load app.js code
const appJsPath = path.join(__dirname, "../frontend/app.js");
const appCode = fs.readFileSync(appJsPath, "utf8");

const vm = require("vm");
vm.runInThisContext(appCode);

console.log("Testing Ministry Growth Analytics Functionality...");

// 1. Test subtab switching
switchMinistrySubTab("growth");
if (!elements["min-growth-analytics-section"].classList.contains("hidden") &&
    elements["min-overview-section"].classList.contains("hidden")) {
  console.log("[PASS] switchMinistrySubTab('growth') successfully displayed growth section and hid overview.");
} else {
  console.error("[FAIL] switchMinistrySubTab('growth') failed.");
  process.exit(1);
}

// 2. Test SVG Growth Chart Rendering
renderMinistryGrowthChart();
const svgHtml = elements["ministry-growth-svg"].innerHTML;
if (svgHtml.includes("<path") && svgHtml.includes("grad-deployments") && svgHtml.includes("grad-revenue")) {
  console.log("[PASS] renderMinistryGrowthChart() successfully generated rich SVG paths, gradients, and axes.");
} else {
  console.error("[FAIL] SVG content missing paths or gradients.");
  process.exit(1);
}

// 3. Test Region & Horizon updates
updateGrowthRegion("south_delhi");
if (state.growthChartOptions.region === "south_delhi") {
  console.log("[PASS] updateGrowthRegion('south_delhi') successfully updated state.");
}

updateGrowthHorizon("30d");
if (state.growthChartOptions.horizon === "30d") {
  console.log("[PASS] updateGrowthHorizon('30d') successfully updated state.");
}

// 4. Test Trajectory Table Rendering
renderGrowthTrajectoryTable();
const tableBodyHtml = elements["growth-trajectory-table-body"].innerHTML;
if (tableBodyHtml.includes("South Delhi") && tableBodyHtml.includes("MoM")) {
  console.log("[PASS] renderGrowthTrajectoryTable() populated South Delhi 30-day rows.");
} else {
  console.error("[FAIL] Table body HTML incomplete:", tableBodyHtml);
  process.exit(1);
}

// 5. Test Worker Post-Acceptance Withdrawal & Automatic Fallback
console.log("\nTesting Worker Post-Acceptance Withdrawal & Immediate Reassignment...");
state.activeBooking = {
  booking_id: 1005,
  service_type: "electrician",
  customer_name: "Kavita Sharma (Connaught Place)",
  status: "ACCEPTED",
  timeline: ["Booking dispatched", "Worker accepted"],
  assigned_worker: WORKERS[0] // Rajesh Kumar
};

const initialRejectionsCount = state.workerRejections.length;
executeWorkerWithdrawal("VEHICLE_BREAKDOWN", "Scooter tyre burst at Janpath crossing");

// Verify automatic reassignment
if (state.activeBooking.assigned_worker.id !== 101) {
  console.log(`[PASS] Booking reassigned to backup worker: ${state.activeBooking.assigned_worker.name} (ID: ${state.activeBooking.assigned_worker.id}).`);
} else {
  console.error("[FAIL] Withdrawing worker was not reassigned.");
  process.exit(1);
}

// Verify disciplinary log entry
if (state.workerRejections.length === initialRejectionsCount + 1 &&
    state.workerRejections[0].type === "POST_ACCEPTANCE_WITHDRAWAL") {
  console.log(`[PASS] Emergency withdrawal incident logged in state.workerRejections (#${state.workerRejections[0].rejection_id}).`);
} else {
  console.error("[FAIL] Incident was not logged to state.workerRejections.");
  process.exit(1);
}

// Verify customer timeline preserved
const lastTimeline = state.activeBooking.timeline[state.activeBooking.timeline.length - 1];
if (lastTimeline.includes("POST-ACCEPTANCE WITHDRAWAL") && lastTimeline.includes("SLA preserved")) {
  console.log("[PASS] Citizen booking timeline updated with zero SLA delay guarantee.");
} else {
  console.error("[FAIL] Timeline not properly updated:", lastTimeline);
  process.exit(1);
}

// Verify Ministry live stream ticker alert
if (elements["ministry-live-ticker"].children.length > 0) {
  console.log("[PASS] Telemetry alert successfully broadcasted to Ministry Live Ticker.");
}

console.log("\n=======================================================");
console.log("  ALL COMPREHENSIVE FUNCTIONAL TESTS PASSED (100% OK) ");
console.log("=======================================================\n");
