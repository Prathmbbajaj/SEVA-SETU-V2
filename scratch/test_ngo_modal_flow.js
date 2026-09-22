const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

async function runNgoFlowTest() {
  console.log("=======================================================");
  console.log("  TESTING NGO VERIFICATION POPUP OVER SERVICE BOOKING  ");
  console.log("=======================================================");

  const html = fs.readFileSync(path.join(__dirname, '../frontend/index.html'), 'utf8');

  const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    resources: 'usable',
    url: 'http://localhost:3000/'
  });

  const { window } = dom;
  const { document } = window;

  // Mock audio and leaflet
  window.Audio = class {
    play() { return Promise.resolve(); }
    pause() {}
  };
  window.L = {
    map: () => ({ setView: () => ({}), on: () => ({}) }),
    tileLayer: () => ({ addTo: () => ({}) }),
    marker: () => ({ addTo: () => ({ bindPopup: () => ({}) }) }),
    polyline: () => ({ addTo: () => ({}) }),
    icon: () => ({})
  };
  window.lucide = { createIcons: () => {} };

  // Load app.js
  const appJs = fs.readFileSync(path.join(__dirname, '../frontend/app.js'), 'utf8');
  window.eval(appJs);

  // Initialize
  if (typeof window.init === 'function') {
    window.init();
  }

  const sModal = document.getElementById("modal-service-booking");
  const ngoModal = document.getElementById("modal-ngo-verify");
  const ngoCheckbox = document.getElementById("ngo-checkbox");

  // TEST 1: Service selection opens modal-service-booking
  window.selectService("electrician", true);
  if (sModal.style.display !== "flex" || sModal.classList.contains("hidden")) {
    throw new Error("FAIL: modal-service-booking was not displayed as flex");
  }
  console.log("[PASS] selectService('electrician') opened modal-service-booking with display: flex");

  // TEST 2: Select sub-service advances to Step 2
  window.selectSubService("switch_socket_repair");
  const step2 = document.getElementById("booking-step-2");
  if (step2.classList.contains("hidden")) {
    throw new Error("FAIL: Step 2 was not revealed after selecting sub-service");
  }
  console.log("[PASS] selectSubService moved to Step 2 with hourly/daily/ngo options");

  // TEST 3: Click NGO Checkbox opens modal-ngo-verify in the SAME screen (layered on top)
  ngoCheckbox.checked = true;
  window.handleNgoCheckboxChange(ngoCheckbox);

  if (ngoModal.style.display !== "flex" || ngoModal.classList.contains("hidden")) {
    throw new Error("FAIL: modal-ngo-verify did not open with display: flex");
  }
  if (sModal.style.display !== "flex" || sModal.classList.contains("hidden")) {
    throw new Error("FAIL: modal-service-booking was closed when opening modal-ngo-verify");
  }

  const sClass = sModal.className;
  const ngoClass = ngoModal.className;
  if (!sClass.includes("z-[100]")) {
    throw new Error("FAIL: modal-service-booking lacks z-[100]");
  }
  if (!ngoClass.includes("z-[150]")) {
    throw new Error("FAIL: modal-ngo-verify lacks z-[150]");
  }
  console.log("[PASS] modal-ngo-verify is opened with z-[150] directly over modal-service-booking z-[100] without dismissing booking screen");

  // TEST 4: Escape key closes modal-ngo-verify first, keeping modal-service-booking open
  const escEvent = new window.KeyboardEvent("keydown", { key: "Escape" });
  document.dispatchEvent(escEvent);

  if (ngoModal.style.display !== "none" || !ngoModal.classList.contains("hidden")) {
    throw new Error("FAIL: Escape did not close modal-ngo-verify");
  }
  if (sModal.style.display !== "flex" || sModal.classList.contains("hidden")) {
    throw new Error("FAIL: Escape closed modal-service-booking when modal-ngo-verify was focused");
  }
  if (ngoCheckbox.checked) {
    throw new Error("FAIL: Unverified cancelled NGO checkbox was left checked");
  }
  console.log("[PASS] Escape cleanly closed modal-ngo-verify and left user on Step 2 of modal-service-booking");

  // TEST 5: Re-open NGO verification and submit credentials
  ngoCheckbox.checked = true;
  window.handleNgoCheckboxChange(ngoCheckbox);
  window.autoFillSampleNgo();

  const form = document.getElementById("ngo-verification-form");
  const submitEvent = new window.Event("submit", { bubbles: true, cancelable: true });
  form.dispatchEvent(submitEvent);

  // Wait for the 700ms verification simulation
  await new Promise(resolve => setTimeout(resolve, 900));

  if (ngoModal.style.display !== "none" || !ngoModal.classList.contains("hidden")) {
    throw new Error("FAIL: modal-ngo-verify did not close after verification");
  }
  if (sModal.style.display !== "flex" || sModal.classList.contains("hidden")) {
    throw new Error("FAIL: modal-service-booking was closed after NGO verification");
  }
  if (!ngoCheckbox.checked) {
    throw new Error("FAIL: ngoCheckbox was not checked after successful verification");
  }

  const pill = document.getElementById("ngo-verified-pill");
  if (pill.classList.contains("hidden")) {
    throw new Error("FAIL: ngo-verified-pill is still hidden");
  }

  const rowNgo = document.getElementById("row-ngo");
  if (rowNgo.style.display === "none") {
    throw new Error("FAIL: row-ngo in invoice is not displayed");
  }
  const quoteNgo = document.getElementById("quote-ngo").innerText;
  console.log(`[PASS] NGO verified successfully! 20% Subsidy line in invoice: ${quoteNgo}`);
  console.log(`[PASS] Step 2 remains open with booking state intact, total payable: ${document.getElementById("quote-total").innerText}`);

  // TEST 6: Proceed to Payment Gateway modal
  window.openPaymentGatewayModal();
  const payModal = document.getElementById("modal-payment-gateway");
  if (payModal.style.display !== "flex" || payModal.classList.contains("hidden")) {
    throw new Error("FAIL: modal-payment-gateway did not open with display: flex");
  }
  if (!payModal.className.includes("z-[150]")) {
    throw new Error("FAIL: modal-payment-gateway lacks z-[150]");
  }
  console.log("[PASS] Payment Gateway modal opened with z-[150]");

  // TEST 7: Cancel Payment Gateway returns to modal-service-booking
  window.closePaymentGatewayModal();
  if (payModal.style.display !== "none" || !payModal.classList.contains("hidden")) {
    throw new Error("FAIL: modal-payment-gateway did not close");
  }
  if (sModal.style.display !== "flex" || sModal.classList.contains("hidden")) {
    throw new Error("FAIL: Cancelling payment gateway did not return user to modal-service-booking");
  }
  console.log("[PASS] Closing payment gateway cleanly restores modal-service-booking in the same screen");

  console.log("=======================================================");
  console.log("  ALL 7 NGO MODAL WORKFLOW TESTS PASSED (100% OK)     ");
  console.log("=======================================================");
}

runNgoFlowTest().catch(err => {
  console.error("TEST FAILED:", err);
  process.exit(1);
});
