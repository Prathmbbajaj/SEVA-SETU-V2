// Node.js test script for verifying Seva Setu worker radar map & freelance dual-OTP booking flow
const fs = require('fs');
const path = require('path');

console.log("Starting verification test for Freelance Booking and Radar Map...");

// Create a DOM-like environment
const elements = {};
function getOrCreateElement(id) {
  if (!elements[id]) {
    elements[id] = {
      id: id,
      classList: {
        classes: new Set(),
        add: function(c) { this.classes.add(c); },
        remove: function(c) { this.classes.delete(c); },
        contains: function(c) { return this.classes.has(c); }
      },
      innerText: '',
      innerHTML: '',
      value: '',
      disabled: false,
      scrollIntoView: function() {},
      style: {},
      appendChild: function() {}
    };
  }
  return elements[id];
}

global.document = {
  getElementById: (id) => getOrCreateElement(id),
  querySelectorAll: () => [],
  createElement: (tag) => ({
    className: '',
    innerHTML: '',
    appendChild: () => {},
    classList: { add: () => {}, remove: () => {} }
  }),
  addEventListener: () => {}
};

global.window = {
  location: { hostname: 'localhost', protocol: 'http:' },
  addEventListener: () => {}
};

global.navigator = {
  clipboard: { writeText: () => Promise.resolve() }
};

// Mock Leaflet L
global.L = {
  map: () => ({
    setView: function() { return this; },
    fitBounds: function() { return this; },
    removeLayer: function() { return this; },
    invalidateSize: function() { return this; }
  }),
  tileLayer: () => ({ addTo: function() { return this; } }),
  marker: () => ({
    addTo: function() { return this; },
    bindPopup: function() { return this; }
  }),
  polyline: () => ({
    addTo: function() { return this; },
    getBounds: function() { return [[0,0],[1,1]]; }
  }),
  circle: () => ({ addTo: function() { return this; } }),
  divIcon: () => ({})
};

const vm = require('vm');
const appJsPath = path.join(__dirname, '..', 'frontend', 'app.js');
const appCode = fs.readFileSync(appJsPath, 'utf8');

try {
  vm.runInThisContext(appCode);
  console.log("✓ app.js parsed and evaluated without error.");
} catch (e) {
  console.error("✗ Failed to evaluate app.js:", e);
  process.exit(1);
}

// 1. Test Mode Switcher
console.log("\n--- TEST 1: Toggle Worker Duty Modes ---");
setWorkerDutyMode("FREELANCE", true);
console.log("Current workerDutyMode:", state.workerDutyMode);
if (state.workerDutyMode !== "FREELANCE") throw new Error("Expected FREELANCE duty mode");
if (!elements["worker-normal-job-section"].classList.contains("hidden")) throw new Error("Normal section should be hidden");
if (elements["worker-freelance-section"].classList.contains("hidden")) throw new Error("Freelance section should not be hidden");
console.log("✓ Switch to FREELANCE verified.");

setWorkerDutyMode("COOP_SHIFT", true);
console.log("Current workerDutyMode:", state.workerDutyMode);
if (state.workerDutyMode !== "COOP_SHIFT") throw new Error("Expected COOP_SHIFT duty mode");
if (elements["worker-normal-job-section"].classList.contains("hidden")) throw new Error("Normal section should not be hidden");
if (!elements["worker-freelance-section"].classList.contains("hidden")) throw new Error("Freelance section should be hidden");
console.log("✓ Switch back to COOP_SHIFT verified.");

// 2. Test Radar Map Initialization & Toggle
console.log("\n--- TEST 2: Worker Radar Map Navigation & Toggling ---");
state.activeBooking = {
  booking_id: 1001,
  customer_name: "Aarav Mehta",
  service_type: "electrician",
  assigned_worker: state.activeWorker || WORKERS[0],
  timeline: [],
  pricing: { cooperative_wage_payout: 140.0 },
  start_otp: "4821",
  end_otp: "7914"
};

workerAcceptJob();
if (elements["worker-radar-map-container"].classList.contains("hidden")) throw new Error("worker-radar-map-container should be visible");
if (!elements["worker-radar-scanner"].classList.contains("hidden")) throw new Error("worker-radar-scanner should be hidden");
console.log("✓ workerAcceptJob opened map inside worker radar.");

// Toggle back to scanner
toggleWorkerRadarView();
if (!elements["worker-radar-map-container"].classList.contains("hidden")) throw new Error("worker-radar-map-container should now be hidden");
if (elements["worker-radar-scanner"].classList.contains("hidden")) throw new Error("worker-radar-scanner should now be visible");
console.log("✓ Toggle to Scanner verified.");

// Toggle back to map
toggleWorkerRadarView();
if (elements["worker-radar-map-container"].classList.contains("hidden")) throw new Error("worker-radar-map-container should now be visible");
console.log("✓ Toggle back to Map verified.");

// 3. Test Freelance Gig Booking & Dual-OTP Flow
console.log("\n--- TEST 3: Freelance Booking Dual-OTP Flow ---");
setWorkerDutyMode("FREELANCE", true);

const initialEarned = state.activeWorker.freelance_earned || 0;
claimFreelanceJob("FL-501");

if (!state.activeFreelanceBooking) throw new Error("activeFreelanceBooking not set");
console.log("Freelance Booking:", {
  job_id: state.activeFreelanceBooking.job_id,
  fee: state.activeFreelanceBooking.freelance_fee,
  platform_fee: state.activeFreelanceBooking.platform_fee,
  federation_cut: state.activeFreelanceBooking.federation_cut,
  start_otp: state.activeFreelanceBooking.start_otp,
  end_otp: state.activeFreelanceBooking.end_otp
});

if (state.activeFreelanceBooking.platform_fee !== 20.0) throw new Error("Expected platform fee 20.0");
if (state.activeFreelanceBooking.federation_cut !== 0.0) throw new Error("Expected 0.0 federation cut");
if (elements["freelance-active-station"].classList.contains("hidden")) throw new Error("freelance-active-station should be visible");

// Step 1: Auto-Fill & Verify Start OTP
autoFillFreelanceStartOtp();
console.log("Input START_OTP value:", elements["fl-input-start-otp"].value);
if (elements["fl-input-start-otp"].value !== state.activeFreelanceBooking.start_otp) throw new Error("Start OTP autofill failed");

submitFreelanceStartOtp();
if (state.activeFreelanceBooking.status !== "IN_PROGRESS") throw new Error("Status should be IN_PROGRESS");
if (elements["fl-proof-file"].disabled !== false) throw new Error("Step 2 file input should be enabled");
if (elements["fl-input-end-otp"].disabled !== false) throw new Error("Step 3 end OTP input should be enabled");
console.log("✓ Step 1 Start OTP verified and unlocked Steps 2 & 3.");

// Step 2: Proof of Work
simulateFreelanceProof();
if (!state.activeFreelanceBooking.proof_attached) throw new Error("Proof not marked attached");
console.log("✓ Step 2 Proof of work attached.");

// Step 3: End OTP & Settlement
autoFillFreelanceEndOtp();
if (elements["fl-input-end-otp"].value !== state.activeFreelanceBooking.end_otp) throw new Error("End OTP autofill failed");

submitFreelanceEndOtp();
if (state.activeFreelanceBooking.status !== "COMPLETED") throw new Error("Status should be COMPLETED");
if (elements["fl-settlement-card"].classList.contains("hidden")) throw new Error("Settlement card should be revealed");

const expectedEarned = initialEarned + 1450.0;
if (state.activeWorker.freelance_earned !== expectedEarned) {
  throw new Error(`Expected earnings ${expectedEarned}, got ${state.activeWorker.freelance_earned}`);
}
console.log("✓ Step 3 End OTP verified and 100% earnings credited to worker freelance wallet.");

// Close station
dismissFreelanceSettlement();
if (state.activeFreelanceBooking !== null) throw new Error("activeFreelanceBooking should be null after dismissal");
if (!elements["freelance-active-station"].classList.contains("hidden")) throw new Error("freelance-active-station should be hidden");
console.log("✓ Dismiss settlement and return to board verified.");

console.log("\n==============================================");
console.log("   ALL VERIFICATION SUITE TESTS PASSED (100%) ");
console.log("==============================================");
