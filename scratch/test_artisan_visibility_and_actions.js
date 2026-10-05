const fs = require('fs');
const assert = require('assert');
const { JSDOM } = require('jsdom');

console.log("=== Testing Additional Visibility for Pottery, Blacksmith & Painting upon NGO Verification ===");

const html = fs.readFileSync('frontend/index.html', 'utf8');
const appJs = fs.readFileSync('frontend/app.js', 'utf8');

// 1. Static HTML assertions
assert(html.includes('id="artisan-quick-chips"'), "artisan-quick-chips element must exist");
assert(html.includes('id="btn-quick-pottery"'), "btn-quick-pottery must exist in HTML");
assert(html.includes('id="btn-quick-blacksmith"'), "btn-quick-blacksmith must exist in HTML");
assert(html.includes('id="btn-quick-painting"'), "btn-quick-painting must exist in HTML");
assert(html.includes('selectService(\'pottery\', true)'), "Pottery quick-select action must be wired");
assert(html.includes('selectService(\'blacksmith\', true)'), "Blacksmith quick-select action must be wired");
assert(html.includes('selectService(\'painting\', true)'), "Painting quick-select action must be wired");

console.log("✓ Static HTML element checks passed (Quick chips and 1-click action buttons present)");

// 2. Full JSDOM interactive simulation
const dom = new JSDOM(html, { runScripts: 'outside-only', resources: 'usable' });
const { window } = dom;

// Polyfill mocks
window.safeCreateIcons = () => {};
window.L = { 
  map: () => ({ setView: () => ({}), removeLayer: () => {}, fitBounds: () => {}, remove: () => {} }), 
  tileLayer: () => ({ addTo: () => {} }), 
  marker: () => ({ addTo: () => ({ bindPopup: () => {} }) }), 
  divIcon: () => ({}), 
  polyline: () => ({ addTo: () => ({ getBounds: () => [[0,0],[1,1]] }) }), 
  circle: () => ({ addTo: () => ({}) }) 
};
window.Audio = class { play() { return Promise.resolve(); } pause() {} };
window.AudioContext = class { 
  createOscillator() { return { type: '', frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }, connect: () => {}, start: () => {}, stop: () => {} }; } 
  createGain() { return { gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }, connect: () => {} }; } 
};
window.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve({}) });

window.eval(appJs);

// Trigger DOMContentLoaded
window.document.dispatchEvent(new window.Event('DOMContentLoaded'));

const grid = window.document.getElementById('service-grid');
const unverifiedState = window.document.getElementById('ngo-unverified-state');
const verifiedState = window.document.getElementById('ngo-verified-state');
const artisanChips = window.document.getElementById('artisan-quick-chips');

console.log("--- Initial Unverified State ---");
assert(!unverifiedState.classList.contains('hidden'), "Unverified bar must be visible initially");
assert(verifiedState.classList.contains('hidden'), "Verified bar must be hidden initially");
assert(artisanChips.classList.contains('hidden'), "Artisan quick chips must be hidden initially");

const initialCardTitles = Array.from(grid.querySelectorAll('h4')).map(h => h.textContent.trim());
console.log("Unverified card titles:", initialCardTitles);
assert(!initialCardTitles.includes('Pottery & Terracotta'), "Pottery should not be visible before NGO verification");
assert(!initialCardTitles.includes('Blacksmith & Metalcraft'), "Blacksmith should not be visible before NGO verification");
assert(!initialCardTitles.includes('Painting & Wall Artisan'), "Painting should not be visible before NGO verification");
assert(initialCardTitles.includes('Heritage Artisan Crafts'), "Teaser card should be visible before NGO verification");

console.log("✓ Initial state correctly hides artisan services");

// 3. Complete NGO Verification
console.log("\n--- Executing NGO Verification ---");
window.document.getElementById('ngo-input-name').value = 'Smile Care Welfare Mission';
window.document.getElementById('ngo-input-darpan').value = 'DL/2023/0481920';
window.submitNgoVerification({ preventDefault: () => {} });

// Wait for verification completion timeout
setTimeout(() => {
  console.log("\n--- Post-Verification State ---");
  assert(unverifiedState.classList.contains('hidden'), "Unverified bar must now be hidden");
  assert(!verifiedState.classList.contains('hidden'), "Verified bar must now be visible");
  assert(!artisanChips.classList.contains('hidden'), "Artisan quick chips must now be visible");

  // Check the verified grid
  const verifiedCardTitles = Array.from(grid.querySelectorAll('h4')).map(h => h.textContent.trim());
  console.log("Verified card titles:", verifiedCardTitles);
  assert(verifiedCardTitles.includes('Pottery & Terracotta'), "Pottery must be visible additionally");
  assert(verifiedCardTitles.includes('Blacksmith & Metalcraft'), "Blacksmith must be visible additionally");
  assert(verifiedCardTitles.includes('Painting & Wall Artisan'), "Painting must be visible additionally");

  // Check section divider
  const sectionHeader = window.document.getElementById('artisan-guilds-section-header');
  assert(sectionHeader, "artisan-guilds-section-header must exist in service grid to separate additional crafts");
  console.log("Section divider found:", sectionHeader.textContent.replace(/\s+/g, ' ').trim().slice(0, 80));

  // 4. Test 1-click quick selection from the NGO status bar
  console.log("\n--- Testing 1-Click Additional Service Selection ---");
  const potteryBtn = window.document.getElementById('btn-quick-pottery');
  assert(potteryBtn, "btn-quick-pottery must exist");
  assert(potteryBtn.getAttribute('onclick').includes("selectService('pottery', true)"), "Pottery button must call selectService('pottery', true)");
  window.eval(potteryBtn.getAttribute('onclick'));
  assert.strictEqual(window.state.selectedService, 'pottery', "Clicking pottery button must select 'pottery'");
  assert.strictEqual(window.state.activeWorker.skill, 'pottery', "Active worker skill must be 'pottery'");
  assert(window.state.activeWorker.name.includes('Ram Dayal'), "Active worker must be Ram Dayal Prajapati");
  console.log("✓ Successfully selected Pottery: Worker is", window.state.activeWorker.name);

  const blacksmithBtn = window.document.getElementById('btn-quick-blacksmith');
  assert(blacksmithBtn, "btn-quick-blacksmith must exist");
  assert(blacksmithBtn.getAttribute('onclick').includes("selectService('blacksmith', true)"), "Blacksmith button must call selectService('blacksmith', true)");
  window.eval(blacksmithBtn.getAttribute('onclick'));
  assert.strictEqual(window.state.selectedService, 'blacksmith', "Clicking blacksmith button must select 'blacksmith'");
  assert.strictEqual(window.state.activeWorker.skill, 'blacksmith', "Active worker skill must be 'blacksmith'");
  assert(window.state.activeWorker.name.includes('Kishan Luhar'), "Active worker must be Kishan Luhar");
  console.log("✓ Successfully selected Blacksmith: Worker is", window.state.activeWorker.name);

  const paintingBtn = window.document.getElementById('btn-quick-painting');
  assert(paintingBtn, "btn-quick-painting must exist");
  assert(paintingBtn.getAttribute('onclick').includes("selectService('painting', true)"), "Painting button must call selectService('painting', true)");
  window.eval(paintingBtn.getAttribute('onclick'));
  assert.strictEqual(window.state.selectedService, 'painting', "Clicking painting button must select 'painting'");
  assert.strictEqual(window.state.activeWorker.skill, 'painting', "Active worker skill must be 'painting'");
  assert(window.state.activeWorker.name.includes('Manoj Painter'), "Active worker must be Manoj Painter");
  console.log("✓ Successfully selected Painting: Worker is", window.state.activeWorker.name);

  // Also verify card click in the grid works
  const potteryCard = grid.querySelector('[data-service-id="pottery"]');
  assert(potteryCard, "Pottery card must exist in service grid");
  potteryCard.onclick({ stopPropagation: () => {} });
  assert.strictEqual(window.state.selectedService, 'pottery', "Clicking pottery card in grid must select 'pottery'");
  console.log("✓ Clicking pottery card in grid directly selects pottery");

  // 5. Test Resetting NGO Verification
  console.log("\n--- Testing Reset NGO Verification ---");
  window.resetNgoVerification();
  assert(!unverifiedState.classList.contains('hidden'), "Unverified bar must be restored");
  assert(verifiedState.classList.contains('hidden'), "Verified bar must be hidden again");
  assert(artisanChips.classList.contains('hidden'), "Artisan quick chips must be hidden again");
  assert.notStrictEqual(window.state.selectedService, 'painting', "Artisan selection must be reset to standard service");

  const resetTitles = Array.from(grid.querySelectorAll('h4')).map(h => h.textContent.trim());
  assert(!resetTitles.includes('Pottery & Terracotta'), "Pottery must not be in reset grid");
  assert(!resetTitles.includes('Blacksmith & Metalcraft'), "Blacksmith must not be in reset grid");
  assert(!resetTitles.includes('Painting & Wall Artisan'), "Painting must not be in reset grid");
  console.log("✓ Reverted cleanly to standard citizen view");

  console.log("\n=======================================================");
  console.log(" ALL ADDITIONAL ARTISAN VISIBILITY TESTS PASSED (100%)");
  console.log("=======================================================");
}, 850);
