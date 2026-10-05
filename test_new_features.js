const fs = require('fs');
const assert = require('assert');

console.log("=== Testing Seva Setu New Feature Updates ===");

// 1. Verify index.html Modal Z-Indexes & Emergency Triage Element
const html = fs.readFileSync('frontend/index.html', 'utf8');

// Check emergency triage container
assert(html.includes('id="emergency-triage-col"'), "emergency-triage-col element must exist");
assert(html.includes('class="w-full lg:w-2/5 hidden" id="emergency-triage-col"'), "emergency-triage-col must have hidden class initially");

// Check z-indices of modals
const bookingModalMatch = html.match(/id="modal-service-booking"[^>]*class="([^"]*)"/);
assert(bookingModalMatch, "modal-service-booking must exist");
assert(bookingModalMatch[1].includes('z-[100]'), "modal-service-booking must have z-[100]");

const subGatewayMatch = html.match(/id="modal-subscription-gateway"[^>]*class="([^"]*)"/);
assert(subGatewayMatch, "modal-subscription-gateway must exist");
assert(subGatewayMatch[1].includes('z-[200]'), "modal-subscription-gateway must have z-[200] to show in front of service booking modal");

const subSuccessMatch = html.match(/id="modal-subscription-success"[^>]*class="([^"]*)"/);
assert(subSuccessMatch, "modal-subscription-success must exist");
assert(subSuccessMatch[1].includes('z-[210]'), "modal-subscription-success must have z-[210]");

console.log("✓ Requirement 1 & 2 HTML assertions passed (Emergency triage hidden by default, Modal stacking z-200 > z-100)");

// Check NGO Status Bar & Artisan Actions
assert(html.includes('id="ngo-portal-status-bar"'), "ngo-portal-status-bar must exist");
assert(html.includes('id="ngo-unverified-state"'), "ngo-unverified-state must exist");
assert(html.includes('id="ngo-verified-state"'), "ngo-verified-state must exist");
assert(html.includes('id="ngo-bar-org-name"'), "ngo-bar-org-name must exist");
assert(html.includes('id="artisan-quick-chips"'), "artisan-quick-chips must exist in search col");
assert(html.includes('id="btn-quick-pottery"'), "btn-quick-pottery must exist in ngo-verified-state");
assert(html.includes('id="btn-quick-blacksmith"'), "btn-quick-blacksmith must exist in ngo-verified-state");
assert(html.includes('id="btn-quick-painting"'), "btn-quick-painting must exist in ngo-verified-state");
assert(html.includes('resetNgoVerification()'), "resetNgoVerification must be wired in HTML");

console.log("✓ Requirement 3 HTML assertions passed (NGO status bar, 1-click artisan buttons & quick chips exist)");

// 2. Verify app.js Services, Workers, and Sub-services Catalog
const appJs = fs.readFileSync('frontend/app.js', 'utf8');

// Check services
assert(appJs.includes('id: "pottery"'), "pottery service must exist in SERVICES");
assert(appJs.includes('id: "blacksmith"'), "blacksmith service must exist in SERVICES");
assert(appJs.includes('id: "painting"'), "painting service must exist in SERVICES");
assert(appJs.includes('isArtisan: true'), "Artisan services must be marked with isArtisan: true");

// Check workers
assert(appJs.includes('Ram Dayal') && appJs.includes('skill: "pottery"'), "Ram Dayal (pottery) must exist in WORKERS");
assert(appJs.includes('Kishan Luhar') && appJs.includes('skill: "blacksmith"'), "Kishan Luhar (blacksmith) must exist in WORKERS");
assert(appJs.includes('Manoj Painter') && appJs.includes('skill: "painting"'), "Manoj Painter (painting) must exist in WORKERS");

// Check worker personas
assert(appJs.includes('ramdayal:') && appJs.includes('kishan:') && appJs.includes('manoj:'), "Artisan personas must exist in WORKER_PERSONAS");

// Check SUB_SERVICES_CATALOG
assert(appJs.includes('earthen_pots_tandoor'), "Pottery sub-service earthen_pots_tandoor must exist");
assert(appJs.includes('decorative_terracotta'), "Pottery sub-service decorative_terracotta must exist");
assert(appJs.includes('clay_water_dispenser'), "Pottery sub-service clay_water_dispenser must exist");
assert(appJs.includes('gate_grill_welding'), "Blacksmith sub-service gate_grill_welding must exist");
assert(appJs.includes('tool_sharpening_forging'), "Blacksmith sub-service tool_sharpening_forging must exist");
assert(appJs.includes('shutter_channel_fix'), "Blacksmith sub-service shutter_channel_fix must exist");
assert(appJs.includes('room_wall_paint'), "Painting sub-service room_wall_paint must exist");
assert(appJs.includes('waterproof_dampproof'), "Painting sub-service waterproof_dampproof must exist");
assert(appJs.includes('texture_stencil'), "Painting sub-service texture_stencil must exist");

console.log("✓ Requirement 4 assertions passed (Pottery, Blacksmith, Painting services, sub-services & workers all present)");

// Check window exports
assert(appJs.includes('window.resetNgoVerification = resetNgoVerification'), "resetNgoVerification must be exported to window");
assert(appJs.includes('window.updateSubscriberGatingUI = updateSubscriberGatingUI'), "updateSubscriberGatingUI must be exported to window");
assert(appJs.includes('window.submitNgoVerification = submitNgoVerification'), "submitNgoVerification must be exported to window");

console.log("✓ Window exports verified");

// 3. Verify backend pricing and seed data
const pricingPy = fs.readFileSync('backend/pricing.py', 'utf8');
assert(pricingPy.includes('"pottery"'), "pottery must exist in backend/pricing.py TRADE_RATES");
assert(pricingPy.includes('"blacksmith"'), "blacksmith must exist in backend/pricing.py TRADE_RATES");
assert(pricingPy.includes('"painting"'), "painting must exist in backend/pricing.py TRADE_RATES");

const seedPy = fs.readFileSync('backend/seed_data.py', 'utf8');
assert(seedPy.includes('"Ram Dayal"') && seedPy.includes('"pottery"'), "Ram Dayal must exist in backend/seed_data.py");
assert(seedPy.includes('"Kishan Luhar"') && seedPy.includes('"blacksmith"'), "Kishan Luhar must exist in backend/seed_data.py");
assert(seedPy.includes('"Manoj Painter"') && seedPy.includes('"painting"'), "Manoj Painter must exist in backend/seed_data.py");

console.log("✓ Backend pricing & seed data verified");

console.log("\n=======================================================");
console.log(" ALL NEW FEATURE SPECIFICATION TESTS PASSED (100%)!");
console.log("=======================================================");
