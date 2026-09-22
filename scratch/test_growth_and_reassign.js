// Automated Verification Script for Frontend Growth Analytics & Worker Withdrawal
const fs = require("fs");
const path = require("path");

const htmlPath = path.join(__dirname, "../frontend/index.html");
const jsPath = path.join(__dirname, "../frontend/app.js");

const html = fs.readFileSync(htmlPath, "utf8");
const js = fs.readFileSync(jsPath, "utf8");

console.log("Checking Frontend Assets Integrity...\n");

// 1. Verify Sub-navigation Bar
const requiredSubtabIds = [
  "min-subtab-overview",
  "min-subtab-growth",
  "min-subtab-workforce",
  "min-subtab-discipline",
  "min-subtab-revenue"
];

requiredSubtabIds.forEach(id => {
  if (html.includes(`id="${id}"`)) {
    console.log(`[PASS] Found sub-navigation tab: #${id}`);
  } else {
    console.error(`[FAIL] Missing sub-navigation tab: #${id}`);
    process.exit(1);
  }
});

// 2. Verify Growth Analytics Section & SVG Container
const requiredGrowthElements = [
  "min-growth-analytics-section",
  "growth-region-select",
  "horizon-btn-6m",
  "horizon-btn-30d",
  "horizon-btn-ytd",
  "toggle-series-deployments",
  "toggle-series-requests",
  "toggle-series-revenue",
  "growth-kpi-deployments",
  "growth-kpi-requests",
  "growth-kpi-revenue",
  "growth-kpi-welfare",
  "ministry-growth-chart-container",
  "ministry-growth-svg",
  "growth-chart-tooltip",
  "growth-trajectory-table-body"
];

requiredGrowthElements.forEach(id => {
  if (html.includes(`id="${id}"`)) {
    console.log(`[PASS] Found growth analytics element: #${id}`);
  } else {
    console.error(`[FAIL] Missing growth analytics element: #${id}`);
    process.exit(1);
  }
});

// 3. Verify Worker Withdrawal Elements
const requiredWithdrawElements = [
  "modal-worker-withdraw-job",
  "withdraw-reason-select",
  "withdraw-incident-notes",
  "openWorkerWithdrawModal()",
  "closeWorkerWithdrawModal()",
  "handleWorkerWithdrawSubmit(event)"
];

requiredWithdrawElements.forEach(elem => {
  if (html.includes(elem)) {
    console.log(`[PASS] Found worker withdrawal element/handler: ${elem}`);
  } else {
    console.error(`[FAIL] Missing worker withdrawal element/handler: ${elem}`);
    process.exit(1);
  }
});

// 4. Verify JavaScript Functions
const requiredJsFunctions = [
  "switchMinistrySubTab",
  "initMinistryGrowthAnalytics",
  "updateGrowthRegion",
  "updateGrowthHorizon",
  "toggleGrowthSeries",
  "renderMinistryGrowthChart",
  "renderGrowthTrajectoryTable",
  "openWorkerWithdrawModal",
  "closeWorkerWithdrawModal",
  "handleWorkerWithdrawSubmit",
  "executeWorkerWithdrawal"
];

requiredJsFunctions.forEach(fn => {
  if (js.includes(`function ${fn}`) || js.includes(`${fn} =`)) {
    console.log(`[PASS] Found JavaScript function: ${fn}()`);
  } else {
    console.error(`[FAIL] Missing JavaScript function: ${fn}()`);
    process.exit(1);
  }
});

console.log("\n=======================================================");
console.log("  ALL FRONTEND INTEGRATION CHECKS PASSED (100% OK)    ");
console.log("=======================================================\n");
