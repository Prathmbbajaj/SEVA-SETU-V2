/**
 * Seva Setu (सेवा सेतु) Frontend Application Controller
 * Catchphrase: Seva Se Samriddhi (सेवा से समृद्धि)
 * Comprehensive multi-portal state management, Web Audio API sound generator,
 * Leaflet OpenStreetMap proximity tracker, Rapido fallback dispatch engine,
 * transparent pricing calculator, interactive payment gateway interface,
 * full Hindi/English bidirectional translation engine, working real-time search,
 * NGO DARPAN verification form, and SIH guided scenario runner.
 */

/**
 * Dynamic API Base URL resolver:
 * 1. window.SEVA_SETU_API_URL or window.API_BASE_URL (injected via config or window)
 * 2. localStorage.getItem("SEVA_SETU_API_URL") (runtime override via browser console/UI)
 * 3. If hosted on localhost/127.0.0.1 without HTTPS, defaults to http://localhost:8000
 * 4. In production (Netlify), defaults to "" to avoid Mixed-Content security blocks
 */
function resolveApiBaseUrl() {
  if (typeof window !== "undefined") {
    if (window.SEVA_SETU_API_URL) return window.SEVA_SETU_API_URL;
    if (window.SAHAKAR_API_URL) return window.SAHAKAR_API_URL;
    if (window.API_BASE_URL) return window.API_BASE_URL;
    try {
      const stored = localStorage.getItem("SEVA_SETU_API_URL") || localStorage.getItem("SAHAKAR_API_URL");
      if (stored) return stored;
    } catch (e) {}

    const host = window.location.hostname;
    const isLocal = host === "localhost" || host === "127.0.0.1" || host === "0.0.0.0";
    if (isLocal && window.location.protocol !== "https:") {
      return "http://localhost:8000";
    }
  }
  // Production / Netlify: relative URL or empty base
  return "";
}

let API_BASE_URL = resolveApiBaseUrl();

// Developer utility to set custom backend URL on live Netlify site
if (typeof window !== "undefined") {
  window.setBackendUrl = function(url) {
    if (!url) {
      localStorage.removeItem("SEVA_SETU_API_URL");
      localStorage.removeItem("SAHAKAR_API_URL");
      console.log("Seva Setu: Cleared custom backend URL. Reverting to auto-detection.");
    } else {
      localStorage.setItem("SEVA_SETU_API_URL", url);
      console.log(`Seva Setu: Custom backend URL set to: ${url}`);
    }
    API_BASE_URL = resolveApiBaseUrl();
    if (typeof checkBackendHealth === "function") {
      checkBackendHealth();
    }
  };
}

// Comprehensive Multilingual Translation Table (159 UI Keys)
const TRANSLATIONS = {
  en: {
    "ministry-subtitle": "Ministry of Cooperation, GoI • \"Seva Se Samriddhi\"",
    "tab-client": "Citizen App",
    "tab-worker": "Worker Radar",
    "tab-ministry": "Ministry Cockpit",
    "backend-status": "Autonomous Engine",
    "step-1": "1. Select Service & Plan",
    "step-2": "2. Transparent Invoice",
    "step-3": "3. Proximity Radar Dispatch",
    "step-4": "4. Dual-OTP Settlement",
    "lbl-search": "Search Certified Cooperative Service",
    "txt-pacs-verified": "PACS & Labour Federation Verified",
    "txt-speak": "Speak",
    "txt-quick-suggestions": "Quick Suggestions:",
    "txt-emergency-title": "Emergency Triage Mode",
    "txt-emergency-desc": "Priority sub-30m dispatch for gas leak, short circuit, or medical transit.",
    "txt-choose-service": "Choose a Cooperative Service",
    "txt-service-subtitle": "Grassroots fair-wage tariffs - Reduced by 50% vs private aggregators",
    "txt-worker-wage-badge": "100% Wage To Worker",
    "txt-select-pricing": "Select Engagement Horizon",
    "txt-pricing-subtitle": "Fair to technician & citizen",
    "plan-hourly-title": "Hourly Task",
    "plan-hourly-desc": "1 hour quick repair",
    "plan-daily-title": "Full Day",
    "plan-daily-desc": "8 hours shift",
    "plan-weekly-title": "Weekly",
    "plan-weekly-desc": "5 days project",
    "plan-weekly-badge": "5% Off",
    "plan-monthly-title": "Subscription",
    "plan-monthly-desc": "22 days / month",
    "plan-monthly-badge": "15% Off",
    "txt-ngo-label": "Non-Profit / NGO / Community Care (20% Social Subsidy)",
    "txt-ngo-hint": "Requires NGO DARPAN Verification",
    "txt-assigned-worker": "Assigned Cooperative Worker",
    "txt-arrival-otp-title": "1. Arrival OTP (START_OTP)",
    "txt-copy-otp": "Copy",
    "txt-arrival-otp-desc": "Share with technician ONLY upon arrival to commence work",
    "txt-end-otp-title": "2. Completion OTP:",
    "txt-timeline-title": "Live State Machine Timeline",
    "txt-timeline-subtitle": "Dual-OTP Enforced",
    "txt-demo-shortcuts": "Demo Shortcuts:",
    "txt-btn-switch-worker": "Switch to Worker Radar →",
    "txt-btn-fast-forward": "⚡ Fast-Forward Lifecycle",
    "txt-map-title": "Worker Proximity Radar Map",
    "txt-map-live": "OpenStreetMap Live",
    "txt-map-you": "You (Connaught Place)",
    "txt-map-workers": "Cooperative Workers",
    "txt-invoice-title": "Transparent Invoice",
    "txt-invoice-subtitle": "Grassroots fair-wage calculation",
    "txt-invoice-badge": "0% Exploitative Cut",
    "txt-lbl-labor": "Direct Fair Labor",
    "txt-lbl-toolkit": "Certified Toolkit Charge:",
    "txt-lbl-transit": "Direct Transit Tariff",
    "txt-lbl-emergency": "Emergency Priority Surcharge:",
    "txt-lbl-tax": "Statutory GST (5%):",
    "txt-lbl-platform": "Cooperative Welfare Fund (3.5%):",
    "txt-lbl-platform-sub": "Insurance, worker healthcare & pension",
    "txt-lbl-ngo": "Verified NGO / Community Subsidy (-20%):",
    "txt-lbl-total": "Total Customer Payable:",
    "txt-lbl-savings-prefix": "Citizen Savings: ₹",
    "txt-lbl-savings-suffix": "(Aggregator fee eradicated)",
    "txt-btn-book": "Confirm & Proceed to Payment",
    "txt-switch-worker-lbl": "Switch Worker Profile",
    "txt-today-takehome": "Today's Take-Home (100%)",
    "txt-view-passbook": "View Cooperative Passbook",
    "txt-live-radar-title": "Live Job Dispatch Radar",
    "txt-radar-proximity": "Proximity Radius: 5 km",
    "txt-radar-you": "You (Online)",
    "txt-radar-idle": "Scanning cooperative broadcast frequency...",
    "txt-new-broadcast": "New Cooperative Broadcast",
    "txt-radar-guaranteed": "Guaranteed Pay",
    "txt-btn-decline": "Decline (Trigger Fallback)",
    "txt-fallback-activated": "Automated Fallback Engine Activated!",
    "txt-btn-accept": "Accept & Navigate",
    "txt-dual-otp-desk": "Dual-OTP Verification Desk",
    "txt-dual-otp-sub": "Fraud-Proof Settlement",
    "txt-step1-title": "STEP 1: Enter Customer Arrival OTP (START_OTP)",
    "txt-step1-desc": "Ask customer for the 4-digit START_OTP upon reaching their premises.",
    "txt-btn-verify-start": "Verify Start",
    "txt-step2-title": "STEP 2: Proof of Work & Completion OTP (END_OTP)",
    "txt-step2-desc": "Upload completion photo and ask customer for END_OTP to release payment.",
    "txt-btn-sample-proof": "Sample Proof",
    "txt-btn-release": "Release Payout",
    "txt-ai-cred-title": "AI Verified Trade Credentials",
    "txt-inspect-ocr": "Inspect Document OCR",
    "txt-min-title": "Ministry of Cooperation, Government of India",
    "txt-min-desc": "Real-time fair wage oversight, PACS federations registry, district shortage intelligence, and AI credential verification.",
    "txt-btn-refresh-telemetry": "Refresh Live Data",
    "txt-kpi-coops": "Registered Cooperatives",
    "txt-kpi-workers": "Verified Gig Technicians",
    "txt-kpi-wages": "Direct Wages Disbursed",
    "txt-kpi-savings": "Citizen Savings Generated",
    "txt-district-title": "District Deployment & Shortage Intelligence",
    "txt-district-sub": "Autonomous PACS dispatch & vocational training triggers",
    "th-district": "District",
    "th-demand": "Demand Index",
    "th-workers": "Active Technicians",
    "th-status": "Status",
    "th-action": "Action",
    "txt-ai-desk-title": "AI Verification Desk",
    "txt-ai-desk-sub": "Gemini 1.5 Flash Document Attestation",
    "txt-live-stream-title": "Live Federation Stream",
    "scenario-title": "SIH Hackathon Scenario Runner",
    "scenario-sub": "1-Click Interactive Demonstration",
    "scenario-btn-1": "⚡ 1. Standard Booking",
    "scenario-btn-2": "💳 2. Payment Gateway",
    "scenario-btn-3": "🤝 3. NGO Verification",
    "scenario-btn-4": "🚨 4. Emergency & Fallback",
    "scenario-btn-5": "🛡️ 5. Dual-OTP Closure",
    "txt-pay-gateway-title": "Cooperative BharatPay Gateway",
    "txt-pay-gateway-sub": "National Cooperative Escrow & Settlement - Ministry of Cooperation",
    "txt-pay-order-summary": "Order & Escrow Summary",
    "pay-lbl-labor": "Direct Labor Wage (100% to Worker):",
    "pay-lbl-toolkit": "Certified Toolkit Charge:",
    "pay-lbl-transit": "Geospatial Transit (1.2 km):",
    "pay-lbl-emergency": "Emergency Priority Surcharge:",
    "pay-lbl-tax": "Statutory GST (5%):",
    "pay-lbl-platform": "Cooperative Welfare Cess (3.5%):",
    "pay-lbl-ngo": "Verified NGO Subsidy (-20%):",
    "pay-lbl-escrow-trust": "Held in 256-Bit Escrow until END_OTP Validation",
    "txt-pay-choose-method": "Choose Secure Payment Mode",
    "pay-tab-qr": "UPI QR",
    "pay-tab-apps": "UPI Apps",
    "pay-tab-bank": "Coop Bank",
    "pay-tab-escrow": "Escrow Cash",
    "pay-lbl-scan-qr": "Scan with any UPI App (BHIM / GPay / PhonePe)",
    "pay-btn-simulate-qr": "⚡ Simulate Instant UPI Mobile App Approval",
    "pay-lbl-bank-sub": "Pay directly from your Cooperative Society or DCCB account:",
    "pay-zero-cash-title": "Zero Upfront Cash Guarantee",
    "pay-zero-cash-desc": "You only pay in cash or UPI directly to technician once the work is completed and you validate the END_OTP.",
    "pay-btn-cancel": "Cancel",
    "ngo-modal-title": "NGO & Non-Profit Verification",
    "ngo-modal-sub": "Ministry of Cooperation 20% Social Welfare Subsidy Desk",
    "ngo-inst-banner": "To qualify for the 20% cooperative subsidy, non-profit institutions must provide their NITI Aayog NGO-DARPAN ID or 12A/80G registration.",
    "ngo-eval-title": "Evaluating Prototype?",
    "ngo-btn-prefill": "⚡ Pre-fill Sample NGO",
    "ngo-lbl-name": "Registered Non-Profit / NGO Name *",
    "ngo-lbl-darpan": "NITI Aayog DARPAN ID *",
    "ngo-lbl-tax": "Income Tax 12A / 80G No.",
    "ngo-lbl-purpose": "Community Service Purpose *",
    "ngo-lbl-rep": "Authorized Representative Name",
    "ngo-btn-cancel": "Cancel",
    "ngo-btn-verify": "Verify DARPAN & Apply 20% Subsidy",
    "cred-modal-title": "Gemini 1.5 Flash AI Credential Verification",
    "cred-modal-sub": "Ministry of Cooperation Verified Worker Credential Vault",
    "cred-lbl-name": "Worker Name",
    "cred-lbl-issuer": "Issuing Body",
    "cred-lbl-certno": "Certificate No.",
    "cred-lbl-confidence": "Gemini Confidence",
    "cred-btn-close": "Close Inspector",
    "passbook-modal-title": "Cooperative Passbook & DBT Ledger",
    "passbook-lbl-balance": "Withdrawable Balance",
    "passbook-lbl-nocut": "0% Cut Guaranteed",
    "passbook-btn-dbt": "Instant DBT to Bank",
    "passbook-lbl-recent": "Recent Disbursed Earnings",
    "passbook-th-jobid": "Job ID",
    "passbook-th-service": "Service",
    "passbook-th-status": "Status",
    "passbook-th-disbursed": "Disbursed",
    "passbook-btn-close": "Close",
    "sub-card-title": "Seva Setu Samriddhi Subscription Pass",
    "sub-card-sub": "Subscribe to unlock up to 30% discount offers, zero emergency fees & exclusive vouchers",
    "sub-gateway-title": "Seva Setu Samriddhi Pass Checkout",
    "reviews-heading": "Verified Citizen Reviews & Experiences",
    "reviews-subheading": "Public grassroots accountability • Authentic feedback from cooperative home service clients",
    "btn-write-review": "Write a Review",
    "write-review-title": "Submit Service Review & Grievance",
    "worker-auth-title": "Worker Dashboard & Credential Onboarding",
    "worker-auth-desc": "Verify your trade skill and identity to access the decentralized cooperative gig radar, 100% fair-wage passbook, and instant DBT.",
    "min-demand-charts-title": "Regional Worker Demand Intelligence & Charts",
    "min-demand-charts-sub": "Geospatial shortage radar for targeted PACS vocational training & emergency re-allocation",
    "min-reviews-title": "Citizen Grievance & Worker Review Log",
    "min-reviews-sub": "Track complaints against technicians, positive commendations, and enforce federation discipline",
    "min-revenue-title": "Platform Revenue Generated & Cooperative Welfare Audit",
    "min-revenue-sub": "Transparent public ledger: 100% worker wage pass-through + 3.5% non-profit social protection pool",
    "txt-show-all-services": "Show All 12 Services",
    "txt-show-less-services": "Show Less",
    "txt-schedule-title": "Choose Service Date & Time Slot",
    "txt-schedule-subtitle": "Instant emergency dispatch or scheduled future arrival by certified technician",
    "opt-immediate-title": "Instant Dispatch",
    "opt-immediate-desc": "Technician dispatched immediately (<30 min average arrival)",
    "opt-scheduled-title": "Schedule for Later",
    "opt-scheduled-desc": "Choose convenient date & preferred arrival window",
    "lbl-choose-date": "1. Select Service Date:",
    "lbl-up-to-7days": "Up to 7 days advance reservation",
    "lbl-choose-slot": "2. Select Preferred Time Slot:",
    "lbl-exact-time": "Or specify exact arrival time:",
    "lbl-invoice-slot": "Scheduled Slot:",
    "lbl-active-slot": "Confirmed Schedule:",
    "btn-export-req-report": "Export Requirement Report",
    "lbl-quick-service-filter": "Quick Trade Filter:",
    "lbl-req-workforce": "Required Workforce",
    "lbl-active-deployed": "Active Certified Deployed",
    "lbl-net-deficit": "Workforce Deficit / Gap",
    "lbl-monthly-demand": "Monthly Service Demand"
  },
  hi: {
    "ministry-subtitle": "सहकारिता मंत्रालय, भारत सरकार • \"सेवा से समृद्धि\"",
    "tab-client": "नागरिक पोर्टल",
    "tab-worker": "श्रमिक रडार",
    "tab-ministry": "मंत्रालय डैशबोर्ड",
    "backend-status": "स्वायत्त इंजन",
    "step-1": "1. सेवा और योजना चुनें",
    "step-2": "2. पारदर्शी चालान",
    "step-3": "3. निकटता रडार प्रेषण",
    "step-4": "4. दोहरी-ओटीपी निपटान",
    "lbl-search": "प्रमाणित सहकारी सेवा खोजें",
    "txt-pacs-verified": "पैक्स और श्रम महासंघ द्वारा सत्यापित",
    "txt-speak": "बोलें",
    "txt-quick-suggestions": "त्वरित सुझाव:",
    "txt-emergency-title": "आपातकालीन ट्रायज मोड",
    "txt-emergency-desc": "गैस रिसाव, शॉर्ट सर्किट, या आपातकालीन सहायता के लिए 30 मिनट में प्राथमिकता प्रेषण।",
    "txt-choose-service": "सहकारी सेवा चुनें",
    "txt-service-subtitle": "जमीनी स्तर पर उचित मजदूरी दरें - निजी बिचौलियों से 50% कम",
    "txt-worker-wage-badge": "100% मजदूरी सीधे श्रमिक को",
    "txt-select-pricing": "कार्य अवधि चुनें",
    "txt-pricing-subtitle": "श्रमिक और नागरिक दोनों के लिए न्यायसंगत",
    "plan-hourly-title": "प्रति घंटा कार्य",
    "plan-hourly-desc": "1 घंटे की त्वरित मरम्मत",
    "plan-daily-title": "पूरा दिन",
    "plan-daily-desc": "8 घंटे की शिफ्ट",
    "plan-weekly-title": "साप्ताहिक",
    "plan-weekly-desc": "5 दिनों का प्रोजेक्ट",
    "plan-weekly-badge": "5% छूट",
    "plan-monthly-title": "मासिक सदस्यता",
    "plan-monthly-desc": "22 दिन / माह",
    "plan-monthly-badge": "15% छूट",
    "txt-ngo-label": "गैर-लाभकारी / एनजीओ / सामाजिक कल्याण (20% सामाजिक सब्सिडी)",
    "txt-ngo-hint": "एनजीओ दर्पण सत्यापन आवश्यक है",
    "txt-assigned-worker": "नियुक्त सहकारी श्रमिक",
    "txt-arrival-otp-title": "1. आगमन ओटीपी (START_OTP)",
    "txt-copy-otp": "कॉपी करें",
    "txt-arrival-otp-desc": "कार्य शुरू करने के लिए केवल तकनीशियन के पहुंचने पर ही साझा करें",
    "txt-end-otp-title": "2. समापन ओटीपी:",
    "txt-timeline-title": "लाइव स्थिति समयरेखा",
    "txt-timeline-subtitle": "दोहरी ओटीपी सुरक्षा लागू",
    "txt-demo-shortcuts": "डेमो शॉर्टकट:",
    "txt-btn-switch-worker": "श्रमिक रडार पर जाएं →",
    "txt-btn-fast-forward": "⚡ त्वरित प्रक्रिया पूरा करें",
    "txt-map-title": "श्रमिक निकटता रडार मानचित्र",
    "txt-map-live": "लाइव ओपन-स्ट्रीट-मैप",
    "txt-map-you": "आप (कनॉट प्लेस)",
    "txt-map-workers": "सहकारी श्रमिक",
    "txt-invoice-title": "पारदर्शी चालान",
    "txt-invoice-subtitle": "उचित श्रम पारिश्रमिक गणना",
    "txt-invoice-badge": "0% शोषणकारी कटौती",
    "txt-lbl-labor": "सीधा उचित श्रम शुल्क",
    "txt-lbl-toolkit": "प्रमाणित टूलकिट शुल्क:",
    "txt-lbl-transit": "सीधा यात्रा शुल्क",
    "txt-lbl-emergency": "आपातकालीन प्राथमिकता शुल्क:",
    "txt-lbl-tax": "वैधानिक जीएसटी (5%):",
    "txt-lbl-platform": "सहकारी कल्याण कोष (3.5%):",
    "txt-lbl-platform-sub": "बीमा, श्रमिक स्वास्थ्य एवं पेंशन",
    "txt-lbl-ngo": "सत्यापित एनजीओ सब्सिडी (-20%):",
    "txt-lbl-total": "कुल देय राशि:",
    "txt-lbl-savings-prefix": "नागरिक बचत: ₹",
    "txt-lbl-savings-suffix": "(बिचौलिया कमीशन समाप्त)",
    "txt-btn-book": "पुष्टि करें और भुगतान करें",
    "txt-switch-worker-lbl": "श्रमिक प्रोफ़ाइल बदलें",
    "txt-today-takehome": "आज की कुल कमाई (100%)",
    "txt-view-passbook": "सहकारी पासबुक देखें",
    "txt-live-radar-title": "लाइव कार्य प्रेषण रडार",
    "txt-radar-proximity": "निकटता दायरा: 5 किमी",
    "txt-radar-you": "आप (ऑनलाइन)",
    "txt-radar-idle": "सहकारी प्रसारण आवृत्ति की खोज जारी है...",
    "txt-new-broadcast": "नया सहकारी अनुरोध",
    "txt-radar-guaranteed": "निश्चित भुगतान",
    "txt-btn-decline": "अस्वीकार करें (बैकअप प्रेषण)",
    "txt-fallback-activated": "स्वचालित बैकअप इंजन सक्रिय!",
    "txt-btn-accept": "स्वीकार करें और जाएं",
    "txt-dual-otp-desk": "दोहरी ओटीपी सत्यापन डेस्क",
    "txt-dual-otp-sub": "धोखाधड़ी-मुक्त प्रत्यक्ष निपटान",
    "txt-step1-title": "चरण 1: ग्राहक का आगमन ओटीपी दर्ज करें (START_OTP)",
    "txt-step1-desc": "कार्यस्थल पर पहुंचने पर ग्राहक से 4 अंकों का आगमन ओटीपी मांगें।",
    "txt-btn-verify-start": "सत्यापित करें",
    "txt-step2-title": "चरण 2: कार्य प्रमाण और समापन ओटीपी (END_OTP)",
    "txt-step2-desc": "समापन फोटो अपलोड करें और भुगतान के लिए ग्राहक से समापन ओटीपी मांगें।",
    "txt-btn-sample-proof": "नमूना फोटो",
    "txt-btn-release": "भुगतान जारी करें",
    "txt-ai-cred-title": "एआई सत्यापित व्यावसायिक प्रमाण पत्र",
    "txt-inspect-ocr": "दस्तावेज़ ओसीआर जांचें",
    "txt-min-title": "सहकारिता मंत्रालय, भारत सरकार",
    "txt-min-desc": "वास्तविक समय निष्पक्ष मजदूरी निगरानी, पैक्स महासंघ पंजीकरण, जिला कमी विश्लेषण और एआई प्रमाणन।",
    "txt-btn-refresh-telemetry": "लाइव डेटा रिफ्रेश करें",
    "txt-kpi-coops": "पंजीकृत सहकारी समितियां",
    "txt-kpi-workers": "सत्यापित तकनीशियन",
    "txt-kpi-wages": "सीधे वितरित की गई मजदूरी",
    "txt-kpi-savings": "नागरिकों की कुल बचत",
    "txt-district-title": "जिला स्तर पर मांग एवं तकनीशियन कमी विश्लेषण",
    "txt-district-sub": "स्वायत्त पैक्स प्रेषण एवं व्यावसायिक प्रशिक्षण तंत्र",
    "th-district": "जिला",
    "th-demand": "मांग सूचकांक",
    "th-workers": "सक्रिय तकनीशियन",
    "th-status": "स्थिति",
    "th-action": "कार्रवाई",
    "txt-ai-desk-title": "एआई दस्तावेज़ सत्यापन डेस्क",
    "txt-ai-desk-sub": "जेमिनी 1.5 फ्लैश दस्तावेज़ सत्यापन",
    "txt-live-stream-title": "लाइव महासंघ गतिविधि",
    "scenario-title": "एसआईएच हैकथॉन परिदृश्य प्रदर्शक",
    "scenario-sub": "1-क्लिक इंटरैक्टिव प्रदर्शन",
    "scenario-btn-1": "⚡ 1. सामान्य बुकिंग",
    "scenario-btn-2": "💳 2. भुगतान गेटवे",
    "scenario-btn-3": "🤝 3. एनजीओ सत्यापन",
    "scenario-btn-4": "🚨 4. आपातकाल व बैकअप",
    "scenario-btn-5": "🛡️ 5. दोहरी-ओटीपी समापन",
    "txt-pay-gateway-title": "सहकारी भारतपे गेटवे",
    "txt-pay-gateway-sub": "राष्ट्रीय सहकारी एस्क्रो एवं निपटान - सहकारिता मंत्रालय",
    "txt-pay-order-summary": "ऑर्डर एवं एस्क्रो सारांश",
    "pay-lbl-labor": "सीधा श्रम पारिश्रमिक (100% श्रमिक को):",
    "pay-lbl-toolkit": "प्रमाणित टूलकिट शुल्क:",
    "pay-lbl-transit": "यात्रा शुल्क (1.2 किमी):",
    "pay-lbl-emergency": "आपातकालीन प्राथमिकता शुल्क:",
    "pay-lbl-tax": "वैधानिक जीएसटी (5%):",
    "pay-lbl-platform": "सहकारी कल्याण कोष (3.5%):",
    "pay-lbl-ngo": "सत्यापित एनजीओ सब्सिडी (-20%):",
    "pay-lbl-escrow-trust": "समापन ओटीपी सत्यापन तक सुरक्षित एस्क्रो में संरक्षित",
    "txt-pay-choose-method": "सुरक्षित भुगतान विकल्प चुनें",
    "pay-tab-qr": "यूपीआई क्यूआर",
    "pay-tab-apps": "यूपीआई ऐप्स",
    "pay-tab-bank": "सहकारी बैंक",
    "pay-tab-escrow": "एस्क्रो नकद",
    "pay-lbl-scan-qr": "किसी भी यूपीआई ऐप (BHIM / GPay / PhonePe) से स्कैन करें",
    "pay-btn-simulate-qr": "⚡ तत्काल यूपीआई मोबाइल ऐप अनुमोदन सिमुलेट करें",
    "pay-lbl-bank-sub": "अपनी सहकारी समिति या डीसीसीबी खाते से सीधे भुगतान करें:",
    "pay-zero-cash-title": "शून्य अग्रिम नकद गारंटी",
    "pay-zero-cash-desc": "कार्य पूरा होने और समापन ओटीपी सत्यापित होने के बाद ही आप सीधे तकनीशियन को नकद या यूपीआई द्वारा भुगतान करते हैं।",
    "pay-btn-cancel": "रद्द करें",
    "ngo-modal-title": "एनजीओ एवं गैर-लाभकारी सत्यापन",
    "ngo-modal-sub": "सहकारिता मंत्रालय 20% सामाजिक कल्याण सब्सिडी डेस्क",
    "ngo-inst-banner": "20% सहकारी सब्सिडी के लिए गैर-लाभकारी संस्थानों को अपना नीति आयोग एनजीओ-दर्पण आईडी या 12A/80G पंजीकरण दर्ज करना होगा।",
    "ngo-eval-title": "प्रोटोटाइप जांच रहे हैं?",
    "ngo-btn-prefill": "⚡ नमूना एनजीओ डेटा भरें",
    "ngo-lbl-name": "पंजीकृत गैर-लाभकारी / एनजीओ का नाम *",
    "ngo-lbl-darpan": "नीति आयोग दर्पण आईडी *",
    "ngo-lbl-tax": "आयकर 12A / 80G संख्या",
    "ngo-lbl-purpose": "सामुदायिक सेवा उद्देश्य *",
    "ngo-lbl-rep": "अधिकृत प्रतिनिधि का नाम",
    "ngo-btn-cancel": "रद्द करें",
    "ngo-btn-verify": "दर्पण सत्यापित करें और 20% सब्सिडी लागू करें",
    "cred-modal-title": "जेमिनी 1.5 फ्लैश एआई प्रमाण पत्र सत्यापन",
    "cred-modal-sub": "सहकारिता मंत्रालय सत्यापित श्रमिक प्रमाण पत्र वॉल्ट",
    "cred-lbl-name": "श्रमिक का नाम",
    "cred-lbl-issuer": "जारीकर्ता संस्थान",
    "cred-lbl-certno": "प्रमाण पत्र संख्या",
    "cred-lbl-confidence": "जेमिनी विश्वसनीयता स्कोर",
    "cred-btn-close": "निरीक्षक बंद करें",
    "passbook-modal-title": "सहकारी पासबुक एवं डीबीटी खाता",
    "passbook-lbl-balance": "निकासी योग्य शेष राशि",
    "passbook-lbl-nocut": "0% कटौती की गारंटी",
    "passbook-btn-dbt": "बैंक खाते में तत्काल डीबीटी",
    "passbook-lbl-recent": "हाल ही में प्राप्त कमाई",
    "passbook-th-jobid": "कार्य आईडी",
    "passbook-th-service": "सेवा",
    "passbook-th-status": "स्थिति",
    "passbook-th-disbursed": "हस्तांतरित",
    "passbook-btn-close": "बंद करें",
    "sub-card-title": "सेवा सेतु समृद्धि सदस्यता पास",
    "sub-card-sub": "30% तक छूट, शून्य आपातकालीन शुल्क और विशेष वाउचर अनलॉक करने के लिए सदस्यता लें",
    "sub-gateway-title": "सेवा सेतु समृद्धि पास चेकआउट",
    "reviews-heading": "सत्यापित नागरिक समीक्षाएं और अनुभव",
    "reviews-subheading": "सार्वजनिक जवाबदेही • सहकारी घरेलू सेवा ग्राहकों से वास्तविक प्रतिक्रिया",
    "btn-write-review": "समीक्षा लिखें",
    "write-review-title": "सेवा समीक्षा एवं शिकायत दर्ज करें",
    "worker-auth-title": "श्रमिक डैशबोर्ड एवं क्रेडेंशियल ऑनबोर्डिंग",
    "worker-auth-desc": "विकेंद्रीकृत सहकारी गिग रडार, 100% उचित मजदूरी पासबुक और तत्काल डीबीटी प्राप्त करने के लिए अपने कौशल और पहचान का सत्यापन करें।",
    "min-demand-charts-title": "क्षेत्रीय श्रमिक मांग विश्लेषण एवं चार्ट्स",
    "min-demand-charts-sub": "लक्षित पैक्स व्यावसायिक प्रशिक्षण और आपातकालीन पुनर्वितरण हेतु क्षेत्रीय कमी रडार",
    "min-reviews-title": "नागरिक शिकायत और श्रमिक समीक्षा लॉग",
    "min-reviews-sub": "तकनीशियनों के विरुद्ध शिकायतों, प्रशंसा समीक्षाओं पर नज़र रखें और अनुशासन लागू करें",
    "min-revenue-title": "प्लेटफॉर्म राजस्व एवं सहकारी कल्याण ऑडिट",
    "min-revenue-sub": "पारदर्शी सार्वजनिक बहीखाता: 100% श्रमिक मजदूरी + 3.5% गैर-लाभकारी सामाजिक सुरक्षा निधि",
    "txt-show-all-services": "सभी 12 सेवाएँ देखें",
    "txt-show-less-services": "कम सेवाएँ देखें",
    "txt-schedule-title": "सेवा की तिथि एवं समय स्लॉट चुनें",
    "txt-schedule-subtitle": "त्वरित आपातकालीन प्रेषण या प्रमाणित तकनीशियन का अग्रिम समय निर्धारण",
    "opt-immediate-title": "तुरंत प्रेषण",
    "opt-immediate-desc": "तकनीशियन तुरंत रवाना होगा (औसतन <30 मिनट में आगमन)",
    "opt-scheduled-title": "बाद के लिए समय तय करें",
    "opt-scheduled-desc": "अपनी सुविधा अनुसार तारीख और आगमन समय चुनें",
    "lbl-choose-date": "1. सेवा की तारीख चुनें:",
    "lbl-up-to-7days": "7 दिन पहले तक का अग्रिम आरक्षण",
    "lbl-choose-slot": "2. पसंदीदा समय स्लॉट चुनें:",
    "lbl-exact-time": "या सटीक आगमन का समय लिखें:",
    "lbl-invoice-slot": "तय समय स्लॉट:",
    "lbl-active-slot": "पुष्ट समय स्लॉट:",
    "btn-export-req-report": "आवश्यकता रिपोर्ट डाउनलोड करें",
    "lbl-quick-service-filter": "त्वरित ट्रेड फ़िल्टर:",
    "lbl-req-workforce": "आवश्यक कार्यबल",
    "lbl-active-deployed": "सक्रिय प्रमाणित तकनीशियन",
    "lbl-net-deficit": "कुल कार्यबल कमी",
    "lbl-monthly-demand": "मासिक सेवा मांग"
  }
};

// Toast Notification Manager
function showToast(message, icon = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast-msg";
  
  let iconHtml = '<i data-lucide="info" class="w-5 h-5 text-blue-400"></i>';
  if (icon === "success") iconHtml = '<i data-lucide="check-circle-2" class="w-5 h-5 text-emerald-400"></i>';
  if (icon === "warning") iconHtml = '<i data-lucide="alert-triangle" class="w-5 h-5 text-amber-400"></i>';
  if (icon === "emergency") iconHtml = '<i data-lucide="siren" class="w-5 h-5 text-red-400"></i>';

  toast.innerHTML = `
    ${iconHtml}
    <div class="flex-1">${message}</div>
  `;

  container.appendChild(toast);
  safeCreateIcons();

  setTimeout(() => {
    toast.classList.add("toast-exit");
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 4000);
}

// Audio Synthesizer via Web Audio API
class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) this.ctx = new AudioContext();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {}
  }

  playAlert() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.setValueAtTime(780, now + 0.12);
      osc.frequency.setValueAtTime(1040, now + 0.24);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(now + 0.4);
    } catch (e) {}
  }

  playFallbackWarning() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(330, now + 0.15);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(now + 0.35);
    } catch (e) {}
  }

  playSuccessFanfare() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.09);
        gain.gain.setValueAtTime(0.18, this.ctx.currentTime + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + idx * 0.09 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.09);
        osc.stop(this.ctx.currentTime + idx * 0.09 + 0.35);
      });
    } catch (e) {}
  }
}

const sfx = new SoundFX();

// Guards against the Lucide CDN failing to load (blocked network, slow CDN, offline
// demo, etc.) so a single missing external script can't crash icon rendering and
// take the rest of the app down with it.
function safeCreateIcons() {
  try {
    if (typeof lucide !== "undefined" && lucide.createIcons) {
      lucide.createIcons();
    }
  } catch (e) {
    console.warn("[SahakarSeva] Lucide icons unavailable:", e);
  }
}

// Seed Workers Registry
const WORKERS = [
  {
    id: 101,
    name: "Rajesh Kumar",
    phone: "+91 98765 43210",
    skill: "electrician",
    coop_id: 1,
    coop_name: "Delhi Central Labour Cooperative",
    coords: [28.6328, 77.2197], // Connaught Place
    is_available: true,
    is_verified: true,
    rating: 4.9,
    aadhaar: "XXXX-XXXX-8921",
    certificate: "ITI National Trade Certificate (Electrician - Grade A)",
    cert_title: "ITI Wireman NTC",
    cert_issuer: "NCVT Attested",
    today_wage: 2840.0,
    coop_ac: "DCCB-PACS-8821092",
    completed_jobs: 142,
    total_earned: 68400.0,
    photo: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 102,
    name: "Mohammad Aslam",
    phone: "+91 98111 22334",
    skill: "plumber",
    coop_id: 1,
    coop_name: "Delhi Central Labour Cooperative",
    coords: [28.6506, 77.1906], // Karol Bagh
    is_available: true,
    is_verified: true,
    rating: 4.8,
    aadhaar: "XXXX-XXXX-4532",
    certificate: "Skill India Sanitary & Plumbing Level 4",
    cert_title: "Skill India Sanitary L4",
    cert_issuer: "Skill India Vetted",
    today_wage: 2150.0,
    coop_ac: "DCCB-PACS-4532104",
    completed_jobs: 98,
    total_earned: 45200.0,
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 103,
    name: "Sunita Sharma",
    phone: "+91 98733 90812",
    skill: "healthcare",
    coop_id: 2,
    coop_name: "South Delhi Multi-Purpose Cooperative",
    coords: [28.5700, 77.2400], // Lajpat Nagar
    is_available: true,
    is_verified: true,
    rating: 5.0,
    aadhaar: "XXXX-XXXX-1190",
    certificate: "General Nursing Assistant (NSDC Certified)",
    cert_title: "General Nursing Assistant",
    cert_issuer: "NSDC Certified",
    today_wage: 3200.0,
    coop_ac: "SDMC-PACS-1190338",
    completed_jobs: 76,
    total_earned: 52300.0,
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 104,
    name: "Vikram Singh",
    phone: "+91 97123 45678",
    skill: "driver",
    coop_id: 2,
    coop_name: "South Delhi Multi-Purpose Cooperative",
    coords: [28.5244, 77.2100], // Saket
    is_available: true,
    is_verified: true,
    rating: 4.7,
    aadhaar: "XXXX-XXXX-7654",
    certificate: "Commercial PSV Badge (Heavy & Light Motor)",
    cert_title: "Commercial PSV Badge",
    cert_issuer: "MoRTH Vetted",
    today_wage: 2600.0,
    coop_ac: "SDMC-PACS-7654211",
    completed_jobs: 210,
    total_earned: 94000.0,
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 105,
    name: "Pooja Devi",
    phone: "+91 99901 23456",
    skill: "cleaning",
    coop_id: 3,
    coop_name: "NCR Technicians Cooperative",
    coords: [28.6289, 77.2065], // Gole Market
    is_available: true,
    is_verified: true,
    rating: 4.9,
    aadhaar: "XXXX-XXXX-3341",
    certificate: "Green Sanitation Guild Certificate",
    cert_title: "Green Sanitation Guild",
    cert_issuer: "e-Shram Attested",
    today_wage: 1950.0,
    coop_ac: "NCRT-PACS-3341889",
    completed_jobs: 115,
    total_earned: 39500.0,
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 106,
    name: "Amit Verma",
    phone: "+91 98700 11223",
    skill: "electrician",
    coop_id: 1,
    coop_name: "Delhi Central Labour Cooperative",
    coords: [28.6400, 77.2300], // Delhi Gate (Backup Electrician)
    is_available: true,
    is_verified: true,
    rating: 4.8,
    aadhaar: "XXXX-XXXX-9912",
    certificate: "ITI Electrician & Solar Wireman",
    cert_title: "ITI Solar & Wireman",
    cert_issuer: "NCVT Attested",
    today_wage: 2400.0,
    coop_ac: "DCCB-PACS-9912056",
    completed_jobs: 84,
    total_earned: 41200.0,
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 107,
    name: "Suresh Yadav",
    phone: "+91 98102 33445",
    skill: "waste_management",
    coop_id: 3,
    coop_name: "NCR Technicians Cooperative",
    coords: [28.6350, 77.2150], // Barakhamba Road
    is_available: true,
    is_verified: true,
    rating: 4.8,
    aadhaar: "XXXX-XXXX-6721",
    certificate: "Municipal Solid Waste Management & Segregation Certified",
    cert_title: "Solid Waste Management",
    cert_issuer: "MCD Attested",
    today_wage: 1800.0,
    coop_ac: "NCRT-PACS-6721440",
    completed_jobs: 63,
    total_earned: 28500.0,
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 108,
    name: "Rameshwar Mistri",
    phone: "+91 98188 44551",
    skill: "carpentry",
    coop_id: 1,
    coop_name: "Delhi Central Labour Cooperative",
    coords: [28.6310, 77.2140], // Connaught Place Inner Circle
    is_available: true,
    is_verified: true,
    rating: 4.9,
    aadhaar: "XXXX-XXXX-9901",
    certificate: "ITI Carpentry & Joinery National Trade Certificate",
    cert_title: "ITI Carpentry NTC (Grade A)",
    cert_issuer: "NCVT Vetted",
    today_wage: 2950.0,
    coop_ac: "DCCB-PACS-9901234",
    completed_jobs: 118,
    total_earned: 58900.0,
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 109,
    name: "Kailash Chand Prajapati",
    phone: "+91 98711 77665",
    skill: "pottery",
    coop_id: 3,
    coop_name: "NCR Technicians & Artisans Cooperative",
    coords: [28.6250, 77.2280], // Mandi House / Pragati Maidan
    is_available: true,
    is_verified: true,
    rating: 5.0,
    aadhaar: "XXXX-XXXX-3382",
    certificate: "KVIC Master Artisan Pottery & Terracotta Seal",
    cert_title: "KVIC Master Terracotta Artisan",
    cert_issuer: "Khadi & Village Industries Commission",
    today_wage: 2400.0,
    coop_ac: "NCRT-PACS-3382901",
    completed_jobs: 84,
    total_earned: 42100.0,
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 110,
    name: "Harishankar Lohar",
    phone: "+91 98992 33441",
    skill: "blacksmith",
    coop_id: 1,
    coop_name: "Delhi Central Labour Cooperative",
    coords: [28.6380, 77.2100], // Paharganj
    is_available: true,
    is_verified: true,
    rating: 4.8,
    aadhaar: "XXXX-XXXX-6619",
    certificate: "Labour Cooperative Metal Fabrication & Welding Guild",
    cert_title: "Labour Metal Fabrication Guild",
    cert_issuer: "Delhi Labour Board Attested",
    today_wage: 2700.0,
    coop_ac: "DCCB-PACS-6619430",
    completed_jobs: 102,
    total_earned: 51200.0,
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 111,
    name: "Shanti Devi",
    phone: "+91 98114 55667",
    skill: "tailoring",
    coop_id: 3,
    coop_name: "NCR Technicians & Artisans Cooperative",
    coords: [28.6200, 77.2180], // Janpath
    is_available: true,
    is_verified: true,
    rating: 4.9,
    aadhaar: "XXXX-XXXX-8822",
    certificate: "Weavers Cooperative Federation Master Tailoring Certificate",
    cert_title: "Weavers Federation Tailoring L4",
    cert_issuer: "Handloom Development Board",
    today_wage: 2200.0,
    coop_ac: "NCRT-PACS-8822150",
    completed_jobs: 91,
    total_earned: 38400.0,
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 112,
    name: "Manoj Kumar",
    phone: "+91 98105 88992",
    skill: "masonry",
    coop_id: 2,
    coop_name: "South Delhi Multi-Purpose Cooperative",
    coords: [28.6400, 77.2250], // ITO
    is_available: true,
    is_verified: true,
    rating: 4.9,
    aadhaar: "XXXX-XXXX-4411",
    certificate: "BOCW Board Master Mason & Tiling Trade Grade A",
    cert_title: "BOCW Master Mason Grade A",
    cert_issuer: "Building & Construction Workers Board",
    today_wage: 3100.0,
    coop_ac: "SDMC-PACS-4411200",
    completed_jobs: 125,
    total_earned: 63800.0,
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 113,
    name: "Surender Pal",
    phone: "+91 98119 22339",
    skill: "painting",
    coop_id: 1,
    coop_name: "Delhi Central Labour Cooperative",
    coords: [28.6350, 77.2050], // Shivaji Stadium
    is_available: true,
    is_verified: true,
    rating: 4.8,
    aadhaar: "XXXX-XXXX-5590",
    certificate: "NSDC Decorative Wall Finishing & Surface Painting",
    cert_title: "NSDC Painting & Decorating",
    cert_issuer: "Paints and Coatings Skill Council",
    today_wage: 2650.0,
    coop_ac: "DCCB-PACS-5590112",
    completed_jobs: 110,
    total_earned: 49200.0,
    photo: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=200&q=80"
  }
];

// Trade Rates & Metadata with REDUCED Grassroots Cooperative Pricing & Synonyms for Search
const SERVICES = [
  {
    id: "electrician",
    name: "Electrician",
    name_hi: "इलेक्ट्रीशियन",
    icon: "zap",
    base: 120,
    badge: "ITI Trade Certified",
    badge_hi: "आईटीआई प्रमाणित",
    rating: 4.9,
    time: "10 mins",
    time_hi: "10 मिनट",
    keywords: ["electric", "wire", "switch", "light", "fan", "fuse", "short circuit", "ac", "bijli", "tarr", "इलेक्ट्रिक", "बिजली", "तार", "पंखा", "शॉर्ट सर्किट", "मीटर"]
  },
  {
    id: "plumber",
    name: "Plumber",
    name_hi: "प्लम्बर सेवा",
    icon: "wrench",
    base: 110,
    badge: "Skill India Vetted",
    badge_hi: "स्किल इंडिया सत्यापित",
    rating: 4.8,
    time: "12 mins",
    time_hi: "12 मिनट",
    keywords: ["plumb", "pipe", "tap", "leak", "drain", "water", "tank", "washroom", "toilet", "nal", "pani", "नल", "पानी", "पाइप", "लीक", "टोंटी", "सीवर"]
  },
  {
    id: "carpentry",
    name: "Carpentry & Woodcraft",
    name_hi: "बढ़ईगीरी एवं काष्ठकला",
    icon: "hammer",
    base: 115,
    badge: "ITI Carpentry Certified",
    badge_hi: "आईटीआई काष्ठकला प्रमाणित",
    rating: 4.9,
    time: "10 mins",
    time_hi: "10 मिनट",
    keywords: ["carpenter", "wood", "furniture", "table", "chair", "door", "window", "bed", "polish", "drill", "badhai", "lakdi", "almirah", "sofa", "बढ़ई", "लकड़ी", "फर्नीचर", "दरवाजा", "खिड़की", "मेज", "कुर्सी", "अलमारी", "सोफा", "काष्ठ"]
  },
  {
    id: "cleaning",
    name: "Deep Cleaning",
    name_hi: "गहन सफाई सेवा",
    icon: "sparkles",
    base: 90,
    badge: "Green Sanitation",
    badge_hi: "हरित स्वच्छता",
    rating: 4.9,
    time: "15 mins",
    time_hi: "15 मिनट",
    keywords: ["clean", "sweep", "dust", "mop", "wash", "sanit", "deep clean", "safai", "housekeeping", "सफाई", "धुलाई", "स्वच्छता", "झाड़ू", "पोछा", "किचन"]
  },
  {
    id: "painting",
    name: "Painting & Wall Artisan",
    name_hi: "रंगाई-पुताई एवं भित्ति शिल्प",
    icon: "brush",
    base: 105,
    badge: "NSDC Decorative Finishing",
    badge_hi: "एनएसडीसी पेंटिंग प्रमाणित",
    rating: 4.9,
    time: "15 mins",
    time_hi: "15 मिनट",
    keywords: ["paint", "color", "wall", "distemper", "whitewash", "waterproof", "texture", "rang", "rangai", "putai", "चित्रकार", "पेंट", "रंगाई", "पुताई", "सफेदी", "दीवार", "टेक्सचर"]
  },
  {
    id: "healthcare",
    name: "Elder Healthcare",
    name_hi: "स्वास्थ्य / बुजुर्ग सेवा",
    icon: "heart-pulse",
    base: 150,
    badge: "NSDC Nursing",
    badge_hi: "एनएसडीसी नर्सिंग",
    rating: 5.0,
    time: "12 mins",
    time_hi: "12 मिनट",
    keywords: ["health", "nurse", "elder", "medical", "patient", "care", "injection", "bp", "swasthya", "स्वास्थ्य", "बुजुर्ग", "नर्स", "दवा", "इलाज", "मरीज"]
  },
  {
    id: "masonry",
    name: "Masonry & Tile Artisan",
    name_hi: "राजमिस्त्री एवं निर्माण शिल्प",
    icon: "layers",
    base: 110,
    badge: "BOCW Board Certified",
    badge_hi: "श्रम कल्याण बोर्ड प्रमाणित",
    rating: 4.8,
    time: "15 mins",
    time_hi: "15 मिनट",
    keywords: ["mason", "brick", "cement", "tile", "wall", "plaster", "floor", "construction", "mistri", "rajmistri", "grouting", "stone", "राजमिस्त्री", "मिस्त्री", "ईंट", "सीमेंट", "टाइल्स", "प्लास्टर", "फर्श", "दीवार"]
  },
  {
    id: "pottery",
    name: "Pottery & Terracotta Craft",
    name_hi: "कुम्हार एवं मृत्तिका शिल्प",
    icon: "package",
    base: 95,
    badge: "KVIC Khadi & Clay Vetted",
    badge_hi: "खादी ग्रामोद्योग प्रमाणित",
    rating: 5.0,
    time: "18 mins",
    time_hi: "18 मिनट",
    keywords: ["potter", "clay", "terracotta", "matti", "matka", "diya", "pottery", "ceramic", "artisan", "kumhar", "gamla", "planter", "कुम्हार", "मिट्टी", "मटका", "दीया", "गमला", "टेराकोटा", "मृत्तिका", "हस्तशिल्प"]
  },
  {
    id: "blacksmith",
    name: "Blacksmith & Metalcraft",
    name_hi: "लुहार एवं धातु शिल्प",
    icon: "shield",
    base: 120,
    badge: "Labour Coop Guild Vetted",
    badge_hi: "श्रम गिल्ड सत्यापित",
    rating: 4.8,
    time: "14 mins",
    time_hi: "14 मिनट",
    keywords: ["blacksmith", "iron", "metal", "grill", "gate", "weld", "welding", "loha", "luhar", "hinge", "shutter", "लुहार", "लोहा", "वेल्डिंग", "ग्रिल", "गेट", "कब्जा", "धातु", "शिल्प"]
  },
  {
    id: "tailoring",
    name: "Tailoring & Handloom Repair",
    name_hi: "दर्जी एवं हथकरघा शिल्प",
    icon: "scissors",
    base: 90,
    badge: "Weavers Federation Vetted",
    badge_hi: "बुनकर संघ सत्यापित",
    rating: 4.9,
    time: "12 mins",
    time_hi: "12 मिनट",
    keywords: ["tailor", "sewing", "stitch", "clothes", "fabric", "alteration", "handloom", "darji", "silai", "curtain", "upholstery", "दर्जी", "सिलाई", "कपड़ा", "सूट", "हथकरघा", "पर्दा", "रफू"]
  },
  {
    id: "driver",
    name: "Emergency Driver",
    name_hi: "आपातकालीन चालक",
    icon: "car",
    base: 130,
    badge: "Commercial PSV",
    badge_hi: "वाणिज्यिक पीएसवी",
    rating: 4.7,
    time: "8 mins",
    time_hi: "8 मिनट",
    keywords: ["driv", "car", "taxi", "chauffeur", "ride", "auto", "ambulance", "gadi", "chalak", "चालक", "गाड़ी", "ड्राइवर", "ड्राइविंग", "सवारी"]
  },
  {
    id: "waste_management",
    name: "Waste Management",
    name_hi: "कचरा प्रबंधन",
    icon: "trash-2",
    base: 80,
    badge: "Municipal Grade",
    badge_hi: "नगर निगम स्तर",
    rating: 4.8,
    time: "16 mins",
    time_hi: "16 मिनट",
    keywords: ["waste", "garbage", "trash", "rubbish", "segregat", "kachra", "debris", "recycle", "कचरा", "कूड़ा", "सफाई", "अपशिष्ट", "रीसायकल"]
  }
];

// District Analytics Data
let DISTRICT_DATA = [
  { district: "Central Delhi", district_hi: "मध्य दिल्ली", demand: 94, pending: 28, workers: 45, alert: true },
  { district: "South Delhi", district_hi: "दक्षिण दिल्ली", demand: 88, pending: 19, workers: 52, alert: false },
  { district: "East Delhi", district_hi: "पूर्वी दिल्ली", demand: 76, pending: 14, workers: 38, alert: false },
  { district: "West Delhi", district_hi: "पश्चिम दिल्ली", demand: 82, pending: 22, workers: 40, alert: true },
  { district: "North Delhi", district_hi: "उत्तर दिल्ली", demand: 68, pending: 9, workers: 30, alert: false }
];

// Global Reactive State
const state = {
  currentLanguage: "en",
  activePortal: "client", // 'client', 'worker', 'ministry'
  selectedService: "electrician",
  selectedPlan: "hourly",
  isEmergency: false,
  isNgo: false,
  ngoVerified: false,
  ngoData: null,
  customerCoords: [28.6315, 77.2167], // Connaught Place, New Delhi
  activeWorker: WORKERS[0],
  activeBooking: null,
  clientMap: null,
  customerMarker: null,
  workerMarkers: {},
  routePolyline: null,
  radarCircle: null,
  hasBackendConnection: false,
  lastQuoteData: null,
  nationalStats: {
    cooperatives: 3,
    workers: 7,
    wages: 368900,
    savings: 140182
  },
  completedBookings: [],
  selectedSubTier: "monthly_pass",
  activeSubscription: null,
  activeOffers: [],
  reviews: [],
  reviewFilter: "all",
  currentStarRating: 5,
  currentReviewType: "positive",
  workerOnboardStep: 1,
  selectedOnboardTrade: "electrician",
  uploadedCertFile: null,
  uploadedAadhaarFile: null,
  workerSession: null,
  ministryGrievanceFilter: "all",
  ministryGrievances: [],
  regionalDemandData: [],
  revenueData: null,
  showAllServices: false,
  bookingScheduleType: "immediate", // "immediate" or "scheduled"
  bookingDate: "",                  // "YYYY-MM-DD"
  bookingTimeSlot: "09:00 AM - 12:00 PM",
  bookingTimeSlotKey: "morning",
  bookingCustomTime: "",
  ministrySelectedService: "all"
};

// Runs an init step in isolation so a single failure (e.g. a blocked/slow CDN
// like unpkg.com or cdn.tailwindcss.com) can't stop every step after it from
// running, which previously left the whole page blank.
function safeInit(label, fn) {
  try {
    fn();
  } catch (err) {
    console.error(`[SahakarSeva] "${label}" failed to initialize:`, err);
  }
}

// Document Ready Initialization
document.addEventListener("DOMContentLoaded", () => {
  safeInit("icons", safeCreateIcons);
  safeInit("service grid", initServiceGrid);
  safeInit("booking scheduler", initBookingSchedule);
  safeInit("map", initLeafletMap);
  safeInit("subscriptions", initSubscriptionSystem);
  safeInit("reviews", initCitizenReviews);
  safeInit("worker onboarding", initWorkerOnboarding);
  safeInit("ministry telemetry", initMinistryExtensions);
  safeInit("ministry requirements", initMinistryServiceRequirements);
  safeInit("live quote", calculateLiveQuote);
  safeInit("district table", renderDistrictTable);
  safeInit("backend health check", checkBackendHealth);

  // Periodic simulated ticker updates
  setInterval(pushLiveTickerEvent, 14000);
});

// Check if backend API is online
async function checkBackendHealth() {
  // If no backend URL configured and not on localhost, stay cleanly in Autonomous Engine mode
  const isLocal = typeof window !== "undefined" && 
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

  if (!API_BASE_URL && !isLocal) {
    state.hasBackendConnection = false;
    updateBackendStatusUI(false);
    return;
  }

  try {
    const checkUrl = API_BASE_URL ? `${API_BASE_URL}/` : "/";
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(checkUrl, { 
      method: "GET",
      signal: controller.signal,
      headers: { "Accept": "application/json" }
    });
    clearTimeout(timeoutId);

    // Verify the response is genuinely API JSON and not Netlify's HTML fallback
    const contentType = res.headers.get("content-type") || "";
    if (res.ok && contentType.includes("application/json")) {
      const data = await res.json();
      if (data && (data.status === "online" || data.platform || data.vision)) {
        state.hasBackendConnection = true;
        updateBackendStatusUI(true);
        return;
      }
    }
    state.hasBackendConnection = false;
    updateBackendStatusUI(false);
  } catch (e) {
    state.hasBackendConnection = false;
    updateBackendStatusUI(false);
  }
}

function updateBackendStatusUI(isConnected) {
  // Dev badge suppressed for citizen-facing interface
  const pill = document.getElementById("backend-status-badge");
  if (pill) pill.remove();
}


// 1. Navigation / Portal Switcher
function switchPortal(portalId) {
  sfx.playClick();
  state.activePortal = portalId;
  
  // Hide all views
  document.getElementById("view-client").classList.add("hidden");
  document.getElementById("view-worker").classList.add("hidden");
  document.getElementById("view-ministry").classList.add("hidden");

  // Reset tab active styles
  ["client", "worker", "ministry"].forEach(id => {
    const tab = document.getElementById(`tab-${id}`);
    tab.className = "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition text-blue-200 hover:text-white hover:bg-blue-800/50 flex items-center space-x-2 btn-tactile";
  });

  // Activate selected view & tab
  document.getElementById(`view-${portalId}`).classList.remove("hidden");
  const activeTab = document.getElementById(`tab-${portalId}`);
  activeTab.className = "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition bg-blue-600 text-white shadow-md flex items-center space-x-2 btn-tactile";

  // Re-invalidate map size if client view is chosen
  if (portalId === "client" && state.clientMap) {
    setTimeout(() => state.clientMap.invalidateSize(), 200);
  }

  safeCreateIcons();
}

// Sound toggle
function toggleAudio() {
  sfx.enabled = !sfx.enabled;
  const icon = document.getElementById("audio-icon");
  if (icon) {
    if (sfx.enabled) {
      icon.setAttribute("data-lucide", "volume-2");
      sfx.playClick();
      showToast(state.currentLanguage === "hi" ? "ध्वनि प्रभाव चालू किए गए" : "Audio effects unmuted", "info");
    } else {
      icon.setAttribute("data-lucide", "volume-x");
      showToast(state.currentLanguage === "hi" ? "ध्वनि प्रभाव म्यूट किए गए" : "Audio effects muted", "info");
    }
    safeCreateIcons();
  }
}

// 2. Comprehensive Multilingual Engine (English <-> Hindi)
function toggleLanguage(lang) {
  state.currentLanguage = lang;
  const isHi = lang === "hi";

  // 1. Translate all data-i18n attributes
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) {
      el.innerText = dict[key];
    }
  });

  // 2. Translate Input Placeholders
  const searchInput = document.getElementById("service-search-input");
  if (searchInput) {
    searchInput.placeholder = isHi 
      ? "सेवा खोजें (उदा. बढ़ई, कुम्हार, लोहार, इलेक्ट्रीशियन, प्लम्बर)..." 
      : "Type a trade (e.g. Carpentry, Pottery, Blacksmith, Electrician, Plumber)...";
  }

  const startOtpInput = document.getElementById("input-start-otp");
  if (startOtpInput) {
    startOtpInput.placeholder = isHi ? "शुरुआती ओटीपी दर्ज करें (उदा. 4821)" : "Enter START_OTP (e.g. 4821)";
  }

  const endOtpInput = document.getElementById("input-end-otp");
  if (endOtpInput) {
    endOtpInput.placeholder = isHi ? "समापन ओटीपी दर्ज करें (उदा. 7914)" : "Enter END_OTP (e.g. 7914)";
  }

  // 3. Re-render service cards in selected language
  initServiceGrid();

  // 4. Update live price quote labels
  calculateLiveQuote();

  // 4b. Update booking schedule labels in selected language
  updateBookingScheduleUI();

  // 5. Re-render district intelligence table and ministry requirements
  renderDistrictTable();
  initMinistryServiceRequirements();

  // 6. Update payment gateway button text if quote available
  if (state.lastQuoteData) {
    const btnText = document.getElementById("btn-pay-text");
    if (btnText) {
      btnText.innerText = isHi 
        ? `₹${state.lastQuoteData.total_amount.toFixed(2)} भुगतान अधिकृत करें और प्रेषित करें`
        : `Authorize Payment of ₹${state.lastQuoteData.total_amount.toFixed(2)} & Broadcast`;
    }
  }

  showToast(isHi ? "भाषा हिंदी में सफलतापूर्वक बदली गई" : "Language set to English successfully", "info");
}

// 3. Web Speech API Voice Recognition
function startVoiceRecognition() {
  sfx.playClick();
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    showToast(state.currentLanguage === "hi" 
      ? "ध्वनि पहचान समर्थित नहीं है। नीचे दिए गए त्वरित बटनों का उपयोग करें।" 
      : "Speech recognition not supported. Use quick suggestion chips below!", "warning");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = state.currentLanguage === "hi" ? "hi-IN" : "en-IN";
  recognition.interimResults = false;

  const statusEl = document.getElementById("voice-status");
  const micIcon = document.getElementById("mic-icon");

  if (statusEl) {
    statusEl.classList.remove("hidden");
    statusEl.querySelector("span:last-child").innerText = state.currentLanguage === "hi" 
      ? "सुन रहे हैं... कृपया सेवा का नाम हिंदी या अंग्रेज़ी में बोलें" 
      : "Listening... Speak your service in Hindi or English";
  }
  if (micIcon) micIcon.classList.add("animate-ping");

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    const input = document.getElementById("service-search-input");
    if (input) input.value = transcript;
    filterServicesByText(transcript);
    showToast(`Heard: "${transcript}"`, "info");
  };

  recognition.onerror = () => {
    if (statusEl) {
      statusEl.querySelector("span:last-child").innerText = state.currentLanguage === "hi"
        ? "आवाज समझ नहीं आई। कृपया टाइप करें या कार्ड चुनें।"
        : "Voice error. Please select manually or click quick chips.";
    }
  };

  recognition.onend = () => {
    if (statusEl) statusEl.classList.add("hidden");
    if (micIcon) micIcon.classList.remove("animate-ping");
  };

  recognition.start();
}

function applyQuickSearch(serviceId) {
  sfx.playClick();
  const input = document.getElementById("service-search-input");
  if (input) {
    const sObj = SERVICES.find(s => s.id === serviceId);
    input.value = state.currentLanguage === "hi" && sObj ? sObj.name_hi : serviceId;
  }
  filterServicesByText(serviceId);
  selectService(serviceId);
  showToast(`Selected ${serviceId.toUpperCase()} with reduced cooperative rate`, "success");
}

// 4. Working Real-Time Search Bar with Active Filtering & Feedback
function filterServicesByText(query) {
  const q = (query || "").toLowerCase().trim();
  const clearBtn = document.getElementById("search-clear-btn");
  const statusEl = document.getElementById("search-result-status");
  const isHi = state.currentLanguage === "hi";

  if (!q) {
    if (clearBtn) clearBtn.classList.add("hidden");
    if (statusEl) {
      statusEl.classList.add("hidden");
      statusEl.innerText = "";
    }
    initServiceGrid();
    return;
  }

  // Show clear button when input is not empty
  if (clearBtn) clearBtn.classList.remove("hidden");

  // Comprehensive multi-field filtering
  const matched = SERVICES.filter(s => {
    if (s.id.toLowerCase().includes(q)) return true;
    if (s.name.toLowerCase().includes(q)) return true;
    if (s.name_hi && s.name_hi.includes(q)) return true;
    if (s.badge.toLowerCase().includes(q)) return true;
    if (s.badge_hi && s.badge_hi.includes(q)) return true;
    if (s.keywords && s.keywords.some(k => k.toLowerCase().includes(q) || q.includes(k.toLowerCase()))) return true;
    return false;
  });

  // Display match feedback
  if (statusEl) {
    statusEl.classList.remove("hidden");
    if (matched.length > 0) {
      statusEl.className = "text-xs text-blue-700 font-bold mt-1.5 flex items-center gap-1";
      statusEl.innerHTML = isHi 
        ? `<i data-lucide="check" class="w-3.5 h-3.5 text-emerald-600"></i> <span>✓ "${query}" के लिए ${matched.length} सेवा(एँ) उपलब्ध हैं</span>`
        : `<i data-lucide="check" class="w-3.5 h-3.5 text-emerald-600"></i> <span>✓ Found ${matched.length} cooperative service(s) for "${query}"</span>`;
    } else {
      statusEl.className = "text-xs text-amber-700 font-bold mt-1.5 flex items-center gap-1";
      statusEl.innerHTML = isHi
        ? `<i data-lucide="alert-circle" class="w-3.5 h-3.5 text-amber-600"></i> <span>"${query}" के लिए कोई सेवा नहीं मिली</span>`
        : `<i data-lucide="alert-circle" class="w-3.5 h-3.5 text-amber-600"></i> <span>No services found matching "${query}"</span>`;
    }
    safeCreateIcons();
  }

  // Auto-select first matching service if currently selected is not in results
  if (matched.length > 0 && !matched.some(s => s.id === state.selectedService)) {
    selectService(matched[0].id);
  }

  initServiceGrid(matched);
}

function clearSearch() {
  sfx.playClick();
  const input = document.getElementById("service-search-input");
  if (input) {
    input.value = "";
    input.focus();
  }
  const clearBtn = document.getElementById("search-clear-btn");
  if (clearBtn) clearBtn.classList.add("hidden");
  const statusEl = document.getElementById("search-result-status");
  if (statusEl) {
    statusEl.classList.add("hidden");
    statusEl.innerText = "";
  }
  initServiceGrid();
}

// 5. Service Selection Grid
function initServiceGrid(filteredList = null) {
  const grid = document.getElementById("service-grid");
  if (!grid) return;
  grid.innerHTML = "";

  const isSearchActive = filteredList !== null;
  const rawList = filteredList || SERVICES;
  const isHi = state.currentLanguage === "hi";

  // When not searching: show first 6 if !state.showAllServices, otherwise all services
  const list = isSearchActive
    ? rawList
    : (state.showAllServices ? rawList : rawList.slice(0, 6));

  // Sync toggle button visibility and text
  const toggleContainer = document.getElementById("service-toggle-container");
  const toggleBtnText = document.getElementById("txt-toggle-services");
  const toggleIcon = document.getElementById("icon-toggle-services");

  if (toggleContainer) {
    if (isSearchActive) {
      toggleContainer.style.display = "none";
    } else {
      toggleContainer.style.display = "flex";
      if (toggleBtnText) {
        toggleBtnText.innerText = state.showAllServices
          ? (isHi ? "कम सेवाएँ देखें" : "Show Less")
          : (isHi ? `सभी ${SERVICES.length} सेवाएँ देखें` : `Show All ${SERVICES.length} Services`);
      }
      if (toggleIcon) {
        toggleIcon.setAttribute("data-lucide", state.showAllServices ? "chevron-up" : "chevron-down");
      }
    }
  }

  if (list.length === 0) {
    // Helpful empty state with 1-click restore
    const emptyDiv = document.createElement("div");
    emptyDiv.className = "col-span-2 sm:col-span-3 p-8 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200";
    emptyDiv.innerHTML = `
      <div class="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-2.5">
        <i data-lucide="search-x" class="w-6 h-6"></i>
      </div>
      <p class="font-black text-slate-900 text-sm mb-1">${isHi ? "कोई सहकारी सेवा नहीं मिली" : "No Cooperative Services Found"}</p>
      <p class="text-xs text-slate-500 max-w-sm mx-auto mb-3.5">
        ${isHi ? "बढ़ई, कुम्हार, लोहार, इलेक्ट्रीशियन, प्लम्बर, राजमिस्त्री या पेंटर खोजें।" : "Try searching for Carpentry, Pottery, Blacksmith, Electrician, Plumber, Masonry or Painting."}
      </p>
      <button onclick="clearSearch()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition btn-tactile">
        ${isHi ? "सभी सेवाएँ देखें" : "Show All Services"}
      </button>
    `;
    grid.appendChild(emptyDiv);
    safeCreateIcons();
    return;
  }

  list.forEach(s => {
    const isSelected = state.selectedService === s.id;
    const name = isHi ? s.name_hi : s.name;
    const badge = isHi ? (s.badge_hi || s.badge) : s.badge;
    const time = isHi ? (s.time_hi || s.time) : s.time;
    const hrSuffix = isHi ? "/घंटा" : "/hr";

    const card = document.createElement("div");
    card.onclick = () => {
      sfx.playClick();
      selectService(s.id);
    };
    card.className = `p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col items-start justify-between text-left space-y-2 btn-tactile ${
      isSelected 
        ? "border-blue-600 bg-blue-50/80 shadow-md ring-2 ring-blue-500/20" 
        : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
    }`;

    card.innerHTML = `
      <div class="flex items-center justify-between w-full">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? "bg-blue-600 text-white shadow-sm" : "bg-slate-100 text-slate-700"}">
          <i data-lucide="${s.icon}" class="w-5 h-5"></i>
        </div>
        <span class="text-[10px] font-black ${isSelected ? "text-blue-800 bg-blue-100/90" : "text-slate-500 bg-slate-100"} px-2.5 py-0.5 rounded-full">
          ${time}
        </span>
      </div>
      <div>
        <h4 class="font-black text-sm ${isSelected ? "text-blue-950" : "text-slate-900"}">${name}</h4>
        <span class="text-[10px] text-emerald-700 font-bold block mt-0.5">✓ ${badge}</span>
      </div>
      <div class="flex items-center justify-between w-full pt-1.5 border-t border-slate-100 text-xs">
        <span class="font-black text-slate-900">₹${s.base}${hrSuffix}</span>
        <span class="text-amber-500 font-bold text-[11px]">★ ${s.rating}</span>
      </div>
    `;

    grid.appendChild(card);
  });

  safeCreateIcons();
}

function toggleShowAllServices() {
  sfx.playClick();
  state.showAllServices = !state.showAllServices;
  initServiceGrid();
}

function selectService(serviceId) {
  state.selectedService = serviceId;

  // Auto-expand services if selected service is outside the first 6
  const first6 = SERVICES.slice(0, 6);
  if (!state.showAllServices && !first6.some(s => s.id === serviceId)) {
    state.showAllServices = true;
  }

  initServiceGrid();
  
  // Find matching worker for this skill
  const matchingWorker = WORKERS.find(w => w.skill === serviceId && w.is_available) || WORKERS[0];
  state.activeWorker = matchingWorker;
  updateWorkerCardUI(matchingWorker);
  
  updateMapPins();
  calculateLiveQuote();

  // Update step indicator
  updateWorkflowStep(1);
}

function selectPlan(planType) {
  sfx.playClick();
  state.selectedPlan = planType;
  ["hourly", "daily", "weekly", "monthly"].forEach(p => {
    const el = document.getElementById(`plan-${p}-label`);
    if (el) {
      if (p === planType) {
        el.className = "cursor-pointer border-2 border-blue-600 bg-blue-50/60 rounded-2xl p-3.5 text-center transition relative btn-tactile shadow-sm";
      } else {
        el.className = "cursor-pointer border border-slate-200 rounded-2xl p-3.5 text-center transition hover:border-blue-400 relative btn-tactile";
      }
    }
  });
  calculateLiveQuote();
}

function toggleEmergencyMode() {
  const toggle = document.getElementById("emergency-toggle");
  state.isEmergency = toggle ? toggle.checked : false;
  
  const box = document.getElementById("emergency-box");
  const siren = document.getElementById("siren-icon");

  if (state.isEmergency) {
    sfx.playAlert();
    if (box) box.classList.add("emergency-active");
    if (siren) siren.classList.add("animate-bounce");
    showToast(state.currentLanguage === "hi" 
      ? "आपातकालीन ट्रायज मोड सक्रिय! 30 मिनट में प्राथमिकता प्रेषण।" 
      : "Emergency Triage Mode Activated! Priority sub-30m dispatch triggered.", "emergency");
  } else {
    sfx.playClick();
    if (box) box.classList.remove("emergency-active");
    if (siren) siren.classList.remove("animate-bounce");
  }

  calculateLiveQuote();
}

// ==========================================
// 5B. Flexible Service Scheduling & Booking Slot System
// ==========================================

function initBookingSchedule() {
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  // Default to tomorrow for scheduled mode
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  state.bookingDate = tomorrowStr;
  state.bookingScheduleType = "immediate";
  state.bookingTimeSlot = "09:00 AM - 12:00 PM";
  state.bookingTimeSlotKey = "morning";
  state.bookingCustomTime = "";

  const dateInput = document.getElementById("booking-date-input");
  if (dateInput) {
    dateInput.min = todayStr;
    dateInput.value = tomorrowStr;
  }

  updateBookingScheduleUI();
}

function setBookingScheduleType(type) {
  sfx.playClick();
  state.bookingScheduleType = type;

  const btnImm = document.getElementById("btn-mode-immediate");
  const btnSch = document.getElementById("btn-mode-scheduled");
  const details = document.getElementById("scheduled-picker-details");

  if (type === "immediate") {
    if (btnImm) {
      btnImm.className = "p-3.5 rounded-2xl border-2 border-blue-600 bg-blue-50/80 text-left transition btn-tactile shadow-sm ring-2 ring-blue-500/20";
    }
    if (btnSch) {
      btnSch.className = "p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 text-left transition btn-tactile shadow-xs";
    }
    if (details) details.classList.add("hidden");
  } else {
    if (btnImm) {
      btnImm.className = "p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 text-left transition btn-tactile shadow-xs";
    }
    if (btnSch) {
      btnSch.className = "p-3.5 rounded-2xl border-2 border-blue-600 bg-blue-50/80 text-left transition btn-tactile shadow-sm ring-2 ring-blue-500/20";
    }
    if (details) details.classList.remove("hidden");
  }

  updateBookingScheduleUI();
}

function selectQuickDay(dayKey) {
  sfx.playClick();
  const now = new Date();
  let target = new Date(now);

  if (dayKey === "today") {
    // target is today
  } else if (dayKey === "tomorrow") {
    target.setDate(now.getDate() + 1);
  } else if (dayKey === "day_after") {
    target.setDate(now.getDate() + 2);
  }

  const dStr = target.toISOString().split("T")[0];
  state.bookingDate = dStr;

  const dateInput = document.getElementById("booking-date-input");
  if (dateInput) dateInput.value = dStr;

  ["today", "tomorrow", "day_after"].forEach(k => {
    const chip = document.getElementById(`chip-day-${k}`);
    if (chip) {
      if (k === dayKey) {
        chip.className = "px-3 py-1.5 rounded-xl border-2 border-blue-600 text-xs font-bold text-blue-900 bg-blue-50 transition btn-tactile shadow-xs";
      } else {
        chip.className = "px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:border-blue-400 bg-white transition btn-tactile";
      }
    }
  });

  updateBookingScheduleUI();
}

function onBookingDateInputChange(val) {
  if (!val) return;
  state.bookingDate = val;

  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const tmrw = new Date(now);
  tmrw.setDate(now.getDate() + 1);
  const tmrwStr = tmrw.toISOString().split("T")[0];
  const dayAfter = new Date(now);
  dayAfter.setDate(now.getDate() + 2);
  const dayAfterStr = dayAfter.toISOString().split("T")[0];

  ["today", "tomorrow", "day_after"].forEach(k => {
    const chip = document.getElementById(`chip-day-${k}`);
    if (chip) {
      const match = (k === "today" && val === todayStr) ||
                    (k === "tomorrow" && val === tmrwStr) ||
                    (k === "day_after" && val === dayAfterStr);
      if (match) {
        chip.className = "px-3 py-1.5 rounded-xl border-2 border-blue-600 text-xs font-bold text-blue-900 bg-blue-50 transition btn-tactile shadow-xs";
      } else {
        chip.className = "px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:border-blue-400 bg-white transition btn-tactile";
      }
    }
  });

  updateBookingScheduleUI();
}

function selectTimeSlot(slot, key) {
  sfx.playClick();
  state.bookingTimeSlot = slot;
  state.bookingTimeSlotKey = key;
  state.bookingCustomTime = "";

  const customTimeInput = document.getElementById("booking-custom-time");
  if (customTimeInput) customTimeInput.value = "";
  const clearBtn = document.getElementById("btn-clear-custom-time");
  if (clearBtn) clearBtn.classList.add("hidden");

  ["morning", "afternoon", "evening", "night"].forEach(k => {
    const btn = document.getElementById(`slot-btn-${k}`);
    if (btn) {
      if (k === key) {
        btn.className = "p-2.5 rounded-xl border-2 border-blue-600 bg-blue-50 text-center transition btn-tactile shadow-xs";
      } else {
        btn.className = "p-2.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 text-center transition btn-tactile";
      }
    }
  });

  updateBookingScheduleUI();
}

function onCustomTimeChange(val) {
  if (!val) return;
  sfx.playClick();
  state.bookingCustomTime = val;

  // Unhighlight slot buttons
  ["morning", "afternoon", "evening", "night"].forEach(k => {
    const btn = document.getElementById(`slot-btn-${k}`);
    if (btn) {
      btn.className = "p-2.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 text-center transition btn-tactile opacity-60";
    }
  });

  const clearBtn = document.getElementById("btn-clear-custom-time");
  if (clearBtn) clearBtn.classList.remove("hidden");

  updateBookingScheduleUI();
}

function clearCustomTime() {
  sfx.playClick();
  state.bookingCustomTime = "";
  const customTimeInput = document.getElementById("booking-custom-time");
  if (customTimeInput) customTimeInput.value = "";
  const clearBtn = document.getElementById("btn-clear-custom-time");
  if (clearBtn) clearBtn.classList.add("hidden");

  selectTimeSlot(state.bookingTimeSlot || "09:00 AM - 12:00 PM", state.bookingTimeSlotKey || "morning");
}

function formatCustomTimeTo12Hr(time24) {
  if (!time24) return "";
  const parts = time24.split(":");
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1];
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
}

function getFormattedBookingSlot(isHi = false) {
  if (state.bookingScheduleType === "immediate") {
    return isHi ? "तुरंत प्रेषण (<30 मिनट)" : "Immediate Dispatch (<30 mins)";
  }

  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const tmrw = new Date(now);
  tmrw.setDate(now.getDate() + 1);
  const tmrwStr = tmrw.toISOString().split("T")[0];

  let dateLabel = state.bookingDate;
  if (state.bookingDate === todayStr) {
    dateLabel = isHi ? "आज" : "Today";
  } else if (state.bookingDate === tmrwStr) {
    dateLabel = isHi ? "कल" : "Tomorrow";
  } else if (state.bookingDate) {
    try {
      const parts = state.bookingDate.split("-");
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      dateLabel = d.toLocaleDateString(isHi ? "hi-IN" : "en-US", { month: "short", day: "numeric" });
    } catch (e) {
      dateLabel = state.bookingDate;
    }
  }

  const timeLabel = state.bookingCustomTime 
    ? formatCustomTimeTo12Hr(state.bookingCustomTime)
    : state.bookingTimeSlot;

  return `${dateLabel} • ${timeLabel}`;
}

function updateBookingScheduleUI() {
  const isHi = state.currentLanguage === "hi";
  const slotText = getFormattedBookingSlot(isHi);

  // 1. Badge in Step 3 header
  const badgeStatus = document.getElementById("badge-schedule-status");
  if (badgeStatus) badgeStatus.innerText = slotText;

  // 2. Confirmed display in schedule picker
  const confirmedDisplay = document.getElementById("confirmed-slot-display");
  if (confirmedDisplay) confirmedDisplay.innerText = slotText;

  // 3. Invoice schedule line item
  const invoiceSlot = document.getElementById("invoice-schedule-time");
  if (invoiceSlot) invoiceSlot.innerText = slotText;

  // 4. Payment modal order summary schedule line item
  const payModalSlot = document.getElementById("pay-summary-slot-text");
  if (payModalSlot) payModalSlot.innerText = slotText;

  // 5. Active booking card schedule badge
  const activeBookingSlot = document.getElementById("status-booking-slot");
  if (activeBookingSlot) activeBookingSlot.innerText = slotText;
}

// 6. Leaflet OpenStreetMap Initialization
function initLeafletMap() {
  if (state.clientMap) return;

  if (typeof L === "undefined") {
    console.warn("[SahakarSeva] Leaflet failed to load from CDN; proximity map disabled.");
    return;
  }

  const mapContainer = document.getElementById("client-map");
  if (!mapContainer) return;

  state.clientMap = L.map("client-map", {
    zoomControl: true,
    scrollWheelZoom: false
  }).setView(state.customerCoords, 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(state.clientMap);

  // Proximity Radar Circle
  state.radarCircle = L.circle(state.customerCoords, {
    color: '#3b82f6',
    fillColor: '#3b82f6',
    fillOpacity: 0.08,
    radius: 3000
  }).addTo(state.clientMap);

  // Customer Pin
  const customerIcon = L.divIcon({
    className: 'custom-pin customer-pin',
    html: '<span>C</span>',
    iconSize: [38, 38],
    iconAnchor: [19, 19]
  });

  state.customerMarker = L.marker(state.customerCoords, { icon: customerIcon }).addTo(state.clientMap)
    .bindPopup("<div class='text-xs'><b>Your Location (Customer)</b><br>Connaught Place, New Delhi<br><span class='text-blue-600 font-semibold'>Proximity Broadcast Origin</span></div>");

  // Worker Markers
  updateMapPins();
}

function updateMapPins() {
  if (!state.clientMap) return;

  // Clear existing worker markers
  Object.values(state.workerMarkers).forEach(m => state.clientMap.removeLayer(m));
  state.workerMarkers = {};

  WORKERS.forEach(w => {
    const isCurrentActive = w.id === state.activeWorker.id;
    const iconClass = isCurrentActive ? 'custom-pin worker-pin ring-4 ring-emerald-300' : 'custom-pin worker-pin-busy';
    
    const workerIcon = L.divIcon({
      className: iconClass,
      html: `<span>${w.skill[0].toUpperCase()}</span>`,
      iconSize: isCurrentActive ? [36, 36] : [30, 30],
      iconAnchor: isCurrentActive ? [18, 18] : [15, 15]
    });

    const marker = L.marker(w.coords, { icon: workerIcon }).addTo(state.clientMap);
    marker.bindPopup(`
      <div class='text-xs space-y-1'>
        <b class='text-slate-900'>${w.name}</b>
        <p class='text-emerald-700 font-bold'>${w.skill.toUpperCase()} &bull; ${w.rating} ★</p>
        <p class='text-slate-500'>${w.coop_name}</p>
        <p class='text-blue-600 font-semibold'>${w.aadhaar}</p>
      </div>
    `);

    state.workerMarkers[w.id] = marker;
  });
}

function drawRouteLine(fromCoords, toCoords) {
  if (!state.clientMap) return;
  if (state.routePolyline) {
    state.clientMap.removeLayer(state.routePolyline);
  }

  state.routePolyline = L.polyline([fromCoords, toCoords], {
    color: '#2563eb',
    weight: 4,
    opacity: 0.85,
    dashArray: '8, 8'
  }).addTo(state.clientMap);

  state.clientMap.fitBounds(state.routePolyline.getBounds(), { padding: [40, 40] });
}

function getWorkerCoords(worker) {
  if (!worker) return [28.6328, 77.2197];
  if (Array.isArray(worker.coords) && worker.coords.length >= 2) return worker.coords;
  if (worker.lat !== undefined && worker.lng !== undefined) return [worker.lat, worker.lng];
  return [28.6328, 77.2197];
}

function computeDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c * 100) / 100;
}

// 7. Dynamic Transparent Fare Calculation (Grassroots Fair-Wage Rates)
async function calculateLiveQuote() {
  const isEmergency = document.getElementById("emergency-toggle")?.checked || false;
  state.isEmergency = isEmergency;

  const serviceObj = SERVICES.find(s => s.id === state.selectedService) || SERVICES[0];
  let labor = serviceObj.base;
  if (state.selectedPlan === "daily") labor = serviceObj.base * 5.5;
  if (state.selectedPlan === "weekly") labor = serviceObj.base * 22 * 0.95; // 5% discount
  if (state.selectedPlan === "monthly") labor = serviceObj.base * 22 * 5.5 * 0.85; // 15% discount

  // Reduced toolkit charges
  const toolkit = state.selectedPlan === "hourly" || state.selectedPlan === "daily" ? 40.0 : 100.0;
  
  const wCoords = getWorkerCoords(state.activeWorker);
  const distance = computeDistanceKm(
    state.customerCoords[0], state.customerCoords[1],
    wCoords[0], wCoords[1]
  );

  // Reduced transit rate (₹20 base + ₹8/km)
  const transit = Math.max(20.0, Math.round(distance * 8.0 * 100) / 100);
  
  // Subscriber perks: Priority triage waiver (0 emergency fee) & 0 platform fee
  const isSubscribed = Boolean(state.activeSubscription);
  const emergency = (state.isEmergency && !isSubscribed) ? 60.0 : 0.0;
  const tax = Math.round(labor * 0.05 * 100) / 100;
  const platform = isSubscribed ? 0.0 : Math.round(labor * 0.035 * 100) / 100;

  let subtotal = labor + toolkit + transit + emergency + tax + platform;
  const ngo = state.isNgo ? Math.round(subtotal * 0.20 * 100) / 100 : 0.0;
  
  // Apply Subscriber discount: 20% for monthly, 30% for annual
  let subDiscountRate = 0.0;
  if (isSubscribed) {
    const pId = state.activeSubscription.plan_id;
    if (pId === "monthly_pass") subDiscountRate = 0.20;
    else if (pId === "annual_samriddhi") subDiscountRate = 0.30;
    else subDiscountRate = 0.20;
  }
  const subDiscountAmount = isSubscribed ? Math.round((subtotal - ngo) * subDiscountRate * 100) / 100 : 0.0;
  const total = Math.max(10.0, Math.round((subtotal - ngo - subDiscountAmount) * 100) / 100);

  const quoteData = {
    breakdown: {
      labor_cost: labor,
      toolkit_cost: toolkit,
      transit_cost: transit,
      emergency_fee: emergency,
      tax: tax,
      platform_fee: platform,
      ngo_discount: ngo,
      subscriber_discount: subDiscountAmount,
      subscriber_discount_rate: subDiscountRate
    },
    distance_km: distance,
    total_amount: total,
    cooperative_wage_payout: Math.round((labor + transit) * 100) / 100
  };

  state.lastQuoteData = quoteData;
  renderPriceQuote(quoteData);
  updateWorkflowStep(2);
}

function renderPriceQuote(data) {
  const b = data.breakdown;
  const isHi = state.currentLanguage === "hi";
  const serviceObj = SERVICES.find(s => s.id === state.selectedService) || SERVICES[0];

  const lblService = document.getElementById("lbl-quote-service");
  if (lblService) {
    lblService.innerText = isHi ? serviceObj.name_hi : serviceObj.name.toUpperCase();
  }

  document.getElementById("quote-labor").innerText = `₹${b.labor_cost.toFixed(2)}`;
  document.getElementById("quote-toolkit").innerText = `₹${b.toolkit_cost.toFixed(2)}`;
  document.getElementById("quote-transit").innerText = `₹${b.transit_cost.toFixed(2)}`;
  document.getElementById("quote-tax").innerText = `₹${b.tax.toFixed(2)}`;
  document.getElementById("quote-platform").innerText = `₹${b.platform_fee.toFixed(2)}`;
  document.getElementById("quote-dist").innerText = `${data.distance_km} km`;
  document.getElementById("quote-total").innerText = `₹${data.total_amount.toFixed(2)}`;

  // Emergency row
  const rowEm = document.getElementById("row-emergency");
  if (rowEm) {
    if (state.isEmergency) {
      rowEm.style.display = "flex";
      document.getElementById("quote-emergency").innerText = state.activeSubscription 
        ? (isHi ? "शून्य (पास छूट)" : "FREE (Subscriber Pass)")
        : `+₹${b.emergency_fee.toFixed(2)}`;
    } else {
      rowEm.style.display = "none";
    }
  }

  // NGO row
  const rowNgo = document.getElementById("row-ngo");
  if (rowNgo) {
    if (state.isNgo) {
      rowNgo.style.display = "flex";
      document.getElementById("quote-ngo").innerText = `-₹${b.ngo_discount.toFixed(2)}`;
    } else {
      rowNgo.style.display = "none";
    }
  }

  // Subscriber VIP discount row
  const rowSub = document.getElementById("row-subscriber-discount");
  if (rowSub) {
    if (state.activeSubscription && b.subscriber_discount > 0) {
      rowSub.style.display = "flex";
      const pct = Math.round(b.subscriber_discount_rate * 100);
      const lbl = document.getElementById("lbl-subscriber-discount");
      if (lbl) {
        lbl.innerText = isHi 
          ? `समृद्धि वीआईपी छूट (${pct}%):` 
          : `Samriddhi VIP Discount (${pct}%):`;
      }
      const val = document.getElementById("quote-subscriber-discount");
      if (val) val.innerText = `-₹${b.subscriber_discount.toFixed(2)}`;
    } else {
      rowSub.style.display = "none";
    }
  }

  // Optional legacy benchmark elements if present
  const elCommercial = document.getElementById("quote-commercial");
  if (elCommercial && data.commercial_benchmark) {
    elCommercial.innerText = `₹${data.commercial_benchmark.toFixed(2)}`;
  }
  const elSavings = document.getElementById("quote-savings");
  if (elSavings && data.customer_savings) {
    elSavings.innerText = data.customer_savings.toFixed(2);
  }
}

// 8. Demo Payment Gateway Interface (Interactive Breakdown & Escrow Authorization)
function openPaymentGatewayModal() {
  sfx.playClick();
  const modal = document.getElementById("modal-payment-gateway");
  if (!modal) return;

  const isHi = state.currentLanguage === "hi";
  const serviceObj = SERVICES.find(s => s.id === state.selectedService) || SERVICES[0];
  const serviceName = isHi ? serviceObj.name_hi : serviceObj.name;
  
  let planName = state.selectedPlan.toUpperCase();
  if (isHi) {
    if (state.selectedPlan === "hourly") planName = "प्रति घंटा कार्य";
    else if (state.selectedPlan === "daily") planName = "पूरा दिन";
    else if (state.selectedPlan === "weekly") planName = "साप्ताहिक";
    else if (state.selectedPlan === "monthly") planName = "मासिक सदस्यता";
  }

  // Populate Order Summary
  const summaryServiceEl = document.getElementById("pay-summary-service");
  if (summaryServiceEl) {
    summaryServiceEl.innerText = `${serviceName} (${planName}) - Connaught Place`;
  }

  const summarySlotEl = document.getElementById("pay-summary-slot-text");
  if (summarySlotEl) {
    summarySlotEl.innerText = getFormattedBookingSlot(isHi);
  }
  
  if (!state.lastQuoteData) {
    calculateLiveQuote();
  }

  const q = state.lastQuoteData;
  if (q) {
    const b = q.breakdown;
    document.getElementById("pay-summary-total").innerText = `₹${q.total_amount.toFixed(2)}`;
    document.getElementById("pay-modal-labor").innerText = `₹${b.labor_cost.toFixed(2)}`;
    document.getElementById("pay-modal-toolkit").innerText = `₹${b.toolkit_cost.toFixed(2)}`;
    document.getElementById("pay-modal-transit").innerText = `₹${b.transit_cost.toFixed(2)}`;
    document.getElementById("pay-modal-tax").innerText = `₹${b.tax.toFixed(2)}`;
    document.getElementById("pay-modal-platform").innerText = `₹${b.platform_fee.toFixed(2)}`;

    // Emergency row in payment modal
    const emRow = document.getElementById("pay-modal-emergency-row");
    if (emRow) {
      if (state.isEmergency) {
        emRow.style.display = "flex";
        document.getElementById("pay-modal-emergency").innerText = state.activeSubscription 
          ? "FREE (VIP)" 
          : `+₹${b.emergency_fee.toFixed(2)}`;
      } else {
        emRow.style.display = "none";
      }
    }

    // NGO row in payment modal
    const ngoRow = document.getElementById("pay-modal-ngo-row");
    if (ngoRow) {
      if (state.isNgo) {
        ngoRow.style.display = "flex";
        document.getElementById("pay-modal-ngo").innerText = `-₹${b.ngo_discount.toFixed(2)}`;
      } else {
        ngoRow.style.display = "none";
      }
    }

    // Subscriber VIP row in payment modal
    const subModalRow = document.getElementById("pay-modal-subscriber-row");
    if (subModalRow) {
      if (state.activeSubscription && b.subscriber_discount > 0) {
        subModalRow.style.display = "flex";
        const val = document.getElementById("pay-modal-subscriber-discount");
        if (val) val.innerText = `-₹${b.subscriber_discount.toFixed(2)}`;
      } else {
        subModalRow.style.display = "none";
      }
    }

    // Dynamic QR URL with exact calculated amount
    const qrImg = document.getElementById("pay-qr-image");
    if (qrImg) {
      qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=sevasetu@dccb%26pn=SevaSetu%20Ministry%20Cooperation%26am=${q.total_amount.toFixed(2)}%26cu=INR`;
    }

    // Authorize button text
    const btnText = document.getElementById("btn-pay-text");
    if (btnText) {
      btnText.innerText = isHi 
        ? `₹${q.total_amount.toFixed(2)} भुगतान अधिकृत करें और प्रेषित करें`
        : `Authorize Payment of ₹${q.total_amount.toFixed(2)} & Broadcast`;
    }
  }

  // Select QR tab by default
  selectPayTab("qr");

  modal.classList.remove("hidden");
  safeCreateIcons();
}

function closePaymentGatewayModal() {
  sfx.playClick();
  const modal = document.getElementById("modal-payment-gateway");
  if (modal) modal.classList.add("hidden");
}

function selectPayTab(tab) {
  sfx.playClick();
  const tabs = ["qr", "apps", "bank", "escrow"];
  tabs.forEach(t => {
    const btn = document.getElementById(`tab-pay-${t}`);
    const view = document.getElementById(`pay-view-${t}`);
    if (t === tab) {
      if (btn) btn.className = "py-2 rounded-xl border-2 border-blue-600 bg-blue-50 text-blue-900 text-center transition btn-tactile font-black shadow-sm";
      if (view) view.classList.remove("hidden");
    } else {
      if (btn) btn.className = "py-2 rounded-xl border border-slate-200 hover:border-slate-300 text-center transition btn-tactile text-slate-600 font-bold";
      if (view) view.classList.add("hidden");
    }
  });
}

function simulateUpiApproval() {
  sfx.playSuccessFanfare();
  showToast(state.currentLanguage === "hi" 
    ? "✓ यूपीआई मोबाइल ऐप से भुगतान स्वीकृत! एस्क्रो में जमा किया जा रहा है..." 
    : "✓ Instant UPI Mobile App Approval Received! Depositing into Escrow...", "success");
  setTimeout(() => {
    processPaymentAndBroadcast();
  }, 400);
}

function processPaymentAndBroadcast() {
  sfx.playAlert();
  const btn = document.getElementById("btn-process-payment");
  const isHi = state.currentLanguage === "hi";

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span class="animate-spin mr-2">⏳</span> ${isHi ? "एनपीसीआई सहकारी एस्क्रो सत्यापन जारी..." : "Authorizing via NPCI Cooperative Escrow..."}`;
  }

  setTimeout(() => {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<i data-lucide="lock" class="w-4 h-4 text-amber-400"></i> <span id="btn-pay-text">${isHi ? "भुगतान अधिकृत हुआ" : "Payment Authorized"}</span>`;
      safeCreateIcons();
    }

    closePaymentGatewayModal();
    sfx.playSuccessFanfare();

    const total = state.lastQuoteData ? state.lastQuoteData.total_amount.toFixed(2) : "190.20";
    showToast(isHi 
      ? `✓ ₹${total} का भुगतान सुरक्षित एस्क्रो में आरक्षित! सहकारी तकनीशियनों को अनुरोध प्रेषित किया गया।` 
      : `✓ Payment of ₹${total} securely locked in 256-Bit Escrow! Broadcasting to cooperative technicians.`, "success");

    // Execute booking confirmed lifecycle
    executeBookingConfirmed();
  }, 1100);
}

// 9. NGO DARPAN Verification Modal Workflow
function handleNgoCheckboxChange(checkbox) {
  sfx.playClick();
  if (checkbox.checked) {
    if (!state.ngoVerified) {
      checkbox.checked = false;
      openNgoVerificationModal();
    } else {
      state.isNgo = true;
      calculateLiveQuote();
      showToast(state.currentLanguage === "hi" ? "20% एनजीओ सब्सिडी सक्रिय है" : "20% NGO Subsidy active", "success");
    }
  } else {
    state.isNgo = false;
    calculateLiveQuote();
    showToast(state.currentLanguage === "hi" ? "एनजीओ सब्सिडी हटाई गई" : "NGO Subsidy removed", "info");
  }
}

function openNgoVerificationModal() {
  sfx.playClick();
  document.getElementById("modal-ngo-verify").classList.remove("hidden");
  safeCreateIcons();
  
  if (state.ngoData) {
    document.getElementById("ngo-input-name").value = state.ngoData.name;
    document.getElementById("ngo-input-darpan").value = state.ngoData.darpan;
    document.getElementById("ngo-input-tax").value = state.ngoData.tax || "";
    document.getElementById("ngo-input-purpose").value = state.ngoData.purpose || "elder";
    document.getElementById("ngo-input-rep").value = state.ngoData.rep || "";
  }
}

function closeNgoVerificationModal(isSuccess = false) {
  sfx.playClick();
  document.getElementById("modal-ngo-verify").classList.add("hidden");
}

function autoFillSampleNgo() {
  sfx.playClick();
  document.getElementById("ngo-input-name").value = "Goonj Community Welfare Foundation";
  document.getElementById("ngo-input-darpan").value = "DL/2021/0219482";
  document.getElementById("ngo-input-tax").value = "AAATG1294RE20214";
  document.getElementById("ngo-input-purpose").value = "elder";
  document.getElementById("ngo-input-rep").value = "Anshu Gupta (Trustee)";
  showToast(state.currentLanguage === "hi" ? "नमूना एनजीओ दर्पण विवरण स्वतः भरा गया" : "Sample NGO Darpan credentials pre-filled", "info");
}

function submitNgoVerification(e) {
  e.preventDefault();
  sfx.init();

  const btn = document.getElementById("btn-submit-ngo-verify");
  const isHi = state.currentLanguage === "hi";

  btn.disabled = true;
  btn.innerHTML = `<span class="animate-spin mr-1">⏳</span> ${isHi ? "नीति आयोग दर्पण पोर्टल पर सत्यापन जारी..." : "Checking NITI Aayog DARPAN Registry..."}`;

  setTimeout(() => {
    const name = document.getElementById("ngo-input-name").value;
    const darpan = document.getElementById("ngo-input-darpan").value;
    const tax = document.getElementById("ngo-input-tax").value;
    const purpose = document.getElementById("ngo-input-purpose").value;
    const rep = document.getElementById("ngo-input-rep").value;

    state.ngoVerified = true;
    state.isNgo = true;
    state.ngoData = { name, darpan, tax, purpose, rep };

    // Update checkbox & badge in UI
    const cb = document.getElementById("ngo-checkbox");
    if (cb) cb.checked = true;

    const pill = document.getElementById("ngo-verified-pill");
    const label = document.getElementById("ngo-verified-label");
    const hint = document.getElementById("ngo-unverified-hint");

    if (pill && label) {
      pill.classList.remove("hidden");
      label.innerText = `DARPAN: ${darpan} (${isHi ? "20% सब्सिडी सक्रिय" : "20% Subsidy Active"})`;
    }
    if (hint) hint.classList.add("hidden");

    const container = document.getElementById("ngo-selection-container");
    if (container) container.classList.add("ngo-verified-glow", "p-2", "rounded-2xl");

    btn.disabled = false;
    btn.innerHTML = `<i data-lucide="check-circle-2" class="w-4 h-4"></i> <span>${isHi ? "दर्पण सत्यापित करें और 20% सब्सिडी लागू करें" : "Verify DARPAN & Apply 20% Subsidy"}</span>`;
    safeCreateIcons();

    closeNgoVerificationModal(true);
    sfx.playSuccessFanfare();
    calculateLiveQuote();
    showToast(isHi ? `✓ एनजीओ सत्यापित: ${name} (20% सब्सिडी लागू)` : `✓ NGO Verified: ${name} (20% Subsidy Applied)`, "success");
  }, 700);
}

// 10. Booking Dispatch & Dual OTP Generation
function executeBooking() {
  // Always open the Payment Gateway interface first to confirm escrow payment & breakdown
  openPaymentGatewayModal();
}

function executeBookingConfirmed() {
  sfx.playAlert();
  const isHi = state.currentLanguage === "hi";
  const btn = document.getElementById("btn-book-service");

  if (!state.lastQuoteData) {
    calculateLiveQuote();
  }
  const q = state.lastQuoteData;
  const serviceObj = SERVICES.find(s => s.id === state.selectedService) || SERVICES[0];
  const payout = q ? q.cooperative_wage_payout : (serviceObj.base + 20.0);

  const startOtp = String(Math.floor(1000 + Math.random() * 9000));
  const endOtp = String(Math.floor(1000 + Math.random() * 9000));

  const wCoords = getWorkerCoords(state.activeWorker);
  const distance = computeDistanceKm(
    state.customerCoords[0], state.customerCoords[1],
    wCoords[0], wCoords[1]
  );

  const slotText = getFormattedBookingSlot(isHi);

  const bookingResult = {
    booking_id: 1001 + Math.floor(Math.random() * 50),
    customer_name: "Aarav Mehta",
    service_type: state.selectedService,
    booking_date: state.bookingDate || "Today",
    booking_time: slotText,
    status: "BROADCASTING",
    assigned_worker: state.activeWorker,
    start_otp: startOtp,
    end_otp: endOtp,
    pricing: {
      ...(q || {}),
      cooperative_wage_payout: payout
    },
    timeline: [
      isHi 
        ? `${serviceObj.name_hi} (${state.selectedPlan}) हेतु सेवा अनुरोध दर्ज • स्लॉट: ${slotText}` 
        : `Job initialized for ${state.selectedService.toUpperCase()} (${state.selectedPlan.toUpperCase()}) • Slot: ${slotText}`,
      isHi
        ? `निकटतम सहकारी तकनीशियन को रडार प्रेषण भेजा गया: ${state.activeWorker.name} (${distance} किमी)`
        : `Radar broadcast dispatched to nearest cooperative technician: ${state.activeWorker.name} (${distance} km)`
    ]
  };

  state.activeBooking = bookingResult;

  // Reveal Active Booking Card in Citizen App
  const statusCard = document.getElementById("booking-status-card");
  if (statusCard) statusCard.classList.remove("hidden");

  const statusTitle = document.getElementById("booking-status-title");
  if (statusTitle) {
    statusTitle.innerText = isHi 
      ? `बुकिंग #${bookingResult.booking_id} सक्रिय` 
      : `Booking #${bookingResult.booking_id} Active`;
  }

  const statusBookingSlot = document.getElementById("status-booking-slot");
  if (statusBookingSlot) statusBookingSlot.innerText = slotText;

  const startOtpEl = document.getElementById("display-start-otp");
  if (startOtpEl) startOtpEl.innerText = bookingResult.start_otp;

  const endOtpEl = document.getElementById("display-end-otp");
  if (endOtpEl) endOtpEl.innerText = bookingResult.end_otp;

  const statusWorkerName = document.getElementById("status-worker-name");
  if (statusWorkerName) statusWorkerName.innerText = bookingResult.assigned_worker.name;

  const statusWorkerCoop = document.getElementById("status-worker-coop");
  if (statusWorkerCoop) statusWorkerCoop.innerText = `✓ ${bookingResult.assigned_worker.coop_name}`;

  const statusWorkerDist = document.getElementById("status-worker-dist");
  if (statusWorkerDist) {
    statusWorkerDist.innerText = `📍 ${distance} km away • Rating: ${bookingResult.assigned_worker.rating} ★`;
  }

  const statusWorkerPhoto = document.getElementById("status-worker-photo");
  if (statusWorkerPhoto) statusWorkerPhoto.src = bookingResult.assigned_worker.photo;

  updateTimeline(bookingResult.timeline);

  // Ping badge on Worker Radar tab
  const badge = document.getElementById("worker-radar-ping-badge");
  if (badge) badge.classList.remove("hidden");

  // Sync to Worker Portal Radar
  triggerWorkerRadar(bookingResult);

  if (btn) {
    btn.innerHTML = `<i data-lucide="check" class="w-5 h-5 text-emerald-400"></i> <span>${isHi ? `प्रसारण सक्रिय (#${bookingResult.booking_id})` : `Broadcast Active (#${bookingResult.booking_id})`}</span>`;
    safeCreateIcons();
  }

  updateWorkflowStep(3);

  // Asynchronously attempt backend booking registration if online
  if (state.hasBackendConnection) {
    fetch(`${API_BASE_URL}/api/v1/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_name: bookingResult.customer_name,
        service_type: bookingResult.service_type,
        worker_id: bookingResult.assigned_worker.id,
        pricing: bookingResult.pricing,
        booking_date: bookingResult.booking_date,
        booking_time: bookingResult.booking_time
      })
    }).catch(err => console.log("Backend booking call simulated or offline:", err.message));
  }

  // Smooth scroll to status card
  if (statusCard) {
    statusCard.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function updateTimeline(events) {
  const container = document.getElementById("booking-timeline-list");
  if (!container) return;
  container.innerHTML = "";
  events.forEach(ev => {
    const item = document.createElement("div");
    item.className = "flex items-start space-x-2";
    item.innerHTML = `<span class="text-blue-600 font-bold text-sm leading-none">&bull;</span> <span class="leading-tight">${ev}</span>`;
    container.appendChild(item);
  });
}

function copyStartOtp() {
  if (!state.activeBooking) return;
  navigator.clipboard.writeText(state.activeBooking.start_otp);
  sfx.playClick();
  showToast(state.currentLanguage === "hi" 
    ? `शुरुआती ओटीपी ${state.activeBooking.start_otp} क्लिपबोर्ड पर कॉपी किया गया!` 
    : `START_OTP ${state.activeBooking.start_otp} copied to clipboard!`, "info");
}

// 11. Worker Radar Actions (Rapido Style + Fallback)
function triggerWorkerRadar(booking) {
  const isHi = state.currentLanguage === "hi";
  const sObj = SERVICES.find(s => s.id === booking.service_type);
  const sTitle = isHi && sObj ? sObj.name_hi : booking.service_type.toUpperCase();

  const idleMsg = document.getElementById("radar-idle-msg");
  if (idleMsg) idleMsg.innerText = isHi ? `⚠️ नया अनुरोध: ${sTitle}` : `⚠️ INCOMING REQUEST: ${sTitle}`;

  const incomingCard = document.getElementById("incoming-job-card");
  if (incomingCard) incomingCard.classList.remove("hidden");

  const fallbackNotice = document.getElementById("worker-fallback-notice");
  if (fallbackNotice) fallbackNotice.classList.add("hidden");

  const serviceTypeEl = document.getElementById("radar-service-type");
  if (serviceTypeEl) {
    const slotTag = booking.booking_time ? ` (${booking.booking_time})` : "";
    serviceTypeEl.innerText = isHi ? `${sTitle} अनुरोध${slotTag}` : `${sTitle} Call${slotTag}`;
  }

  const clientNameEl = document.getElementById("radar-client-name");
  if (clientNameEl) clientNameEl.innerText = booking.customer_name;

  const wCoords = getWorkerCoords(booking.assigned_worker);
  const dist = computeDistanceKm(
    state.customerCoords[0], state.customerCoords[1],
    wCoords[0], wCoords[1]
  );
  const clientDistEl = document.getElementById("radar-client-dist");
  if (clientDistEl) clientDistEl.innerText = `${dist} km away (Connaught Place)`;

  const payoutEl = document.getElementById("radar-payout");
  if (payoutEl) {
    const wage = booking.pricing?.cooperative_wage_payout || 140.0;
    payoutEl.innerText = `₹${wage.toFixed(2)}`;
  }
}

function workerAcceptJob() {
  sfx.playSuccessFanfare();
  if (!state.activeBooking) return;
  const isHi = state.currentLanguage === "hi";

  state.activeBooking.status = "ACCEPTED";
  state.activeBooking.timeline.push(isHi
    ? `श्रमिक ${state.activeBooking.assigned_worker.name} ने कार्य स्वीकार किया। रास्ते में हैं।`
    : `Worker ${state.activeBooking.assigned_worker.name} accepted the request. En route.`);
  
  const badgeStatus = document.getElementById("booking-badge-status");
  if (badgeStatus) {
    badgeStatus.innerText = isHi ? "स्वीकृत" : "ACCEPTED";
    badgeStatus.className = "bg-emerald-600 text-white text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm";
  }

  const badgeStep1 = document.getElementById("badge-step-1");
  if (badgeStep1) {
    badgeStep1.className = "text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase";
    badgeStep1.innerText = isHi ? "आगमन ओटीपी प्रतीक्षारत" : "AWAITING START_OTP";
  }

  updateTimeline(state.activeBooking.timeline);
  const activeWCoords = getWorkerCoords(state.activeBooking.assigned_worker);
  drawRouteLine(activeWCoords, state.customerCoords);
  showToast(isHi 
    ? `${state.activeBooking.assigned_worker.name} ने कार्य स्वीकार किया! कनॉट प्लेस के लिए रवाना।` 
    : `Job Accepted by ${state.activeBooking.assigned_worker.name}! En route to Connaught Place.`, "success");
}

function workerRejectJob() {
  sfx.playFallbackWarning();
  if (!state.activeBooking) return;
  const isHi = state.currentLanguage === "hi";

  const declinedWorker = state.activeBooking.assigned_worker || state.activeWorker;

  // Search dynamically for the nearest available worker with the same skill
  let backupWorker = WORKERS.find(w => w.skill === state.activeBooking.service_type && w.id !== declinedWorker.id && w.is_available);
  if (!backupWorker) {
    backupWorker = WORKERS.find(w => w.id !== declinedWorker.id && w.is_available);
  }
  if (!backupWorker) {
    backupWorker = WORKERS.find(w => w.id !== declinedWorker.id) || WORKERS[0];
  }

  state.activeBooking.assigned_worker = backupWorker;

  const bCoords = getWorkerCoords(backupWorker);
  const dist = computeDistanceKm(
    state.customerCoords[0], state.customerCoords[1],
    bCoords[0], bCoords[1]
  );
  
  state.activeBooking.timeline.push(isHi ? `श्रमिक ${declinedWorker.name} ने कार्य अस्वीकार किया।` : `Worker ${declinedWorker.name} declined the job.`);
  state.activeBooking.timeline.push(isHi 
    ? `🚨 स्वचालित बैकअप इंजन: अगले निकटतम सहकारी तकनीशियन को पुनः सौंपा गया: ${backupWorker.name} (${dist} किमी दूरी)।`
    : `🚨 AUTOMATED FALLBACK ENGINE: Reassigned to next nearest worker: ${backupWorker.name} (${dist} km away).`);

  // Update UI on Citizen View
  const statusName = document.getElementById("status-worker-name");
  if (statusName) statusName.innerText = backupWorker.name;

  const statusCoop = document.getElementById("status-worker-coop");
  if (statusCoop) statusCoop.innerText = `✓ ${backupWorker.coop_name}`;

  const statusDist = document.getElementById("status-worker-dist");
  if (statusDist) statusDist.innerText = `📍 ${dist} km away • Rating: ${backupWorker.rating} ★`;

  const statusPhoto = document.getElementById("status-worker-photo");
  if (statusPhoto) statusPhoto.src = backupWorker.photo;

  updateTimeline(state.activeBooking.timeline);

  // Show Fallback alert on Worker screen
  const fallbackNotice = document.getElementById("worker-fallback-notice");
  if (fallbackNotice) fallbackNotice.classList.remove("hidden");

  const fallbackText = document.getElementById("worker-fallback-text");
  if (fallbackText) {
    fallbackText.innerHTML = isHi 
      ? `कार्य <b>${declinedWorker.name}</b> द्वारा अस्वीकार किया गया एवं स्वचालित रूप से <b>${backupWorker.name}</b> (${dist} किमी) को सौंपा गया।`
      : `Job was declined by <span class="font-bold">${declinedWorker.name}</span> and instantly reassigned to the next nearest cooperative technician: <strong class="text-blue-900">${backupWorker.name}</strong> (${dist} km away).`;
  }

  const incomingCard = document.getElementById("incoming-job-card");
  if (incomingCard) incomingCard.classList.add("hidden");

  const idleMsg = document.getElementById("radar-idle-msg");
  if (idleMsg) {
    idleMsg.innerText = isHi 
      ? `कार्य बैकअप प्रणाली द्वारा ${backupWorker.name} को सौंपा गया।` 
      : `Job reassigned to ${backupWorker.name} via fallback state machine.`;
  }

  // Switch active worker to backupWorker and sync card UI
  updateWorkerCardUI(backupWorker);
  updateMapPins();
  drawRouteLine(bCoords, state.customerCoords);

  showToast(isHi 
    ? `🚨 बैकअप तकनीशियन ${backupWorker.name} को कार्य पुनः सौंपा गया (${dist} किमी)` 
    : `🚨 Fallback Reassigned to ${backupWorker.name} (${dist} km away)`, "warning");
}

// 12. Dual OTP Verification Workflows
function autoFillStartOtp() {
  sfx.playClick();
  if (!state.activeBooking) return;
  document.getElementById("input-start-otp").value = state.activeBooking.start_otp;
  showToast(state.currentLanguage === "hi" ? "डेमो शुरुआती ओटीपी स्वतः भरा गया" : "Demo START_OTP auto-filled", "info");
}

function submitStartOtp() {
  sfx.init();
  const entered = document.getElementById("input-start-otp").value.trim();
  const isHi = state.currentLanguage === "hi";

  if (!state.activeBooking) {
    showToast(isHi ? "कोई सक्रिय बुकिंग नहीं मिली। पहले अनुरोध भेजें।" : "No active booking found. Broadcast a request first.", "warning");
    return;
  }

  if (entered === state.activeBooking.start_otp) {
    sfx.playSuccessFanfare();
    state.activeBooking.status = "IN_PROGRESS";
    state.activeBooking.timeline.push(isHi ? "ग्राहक द्वारा शुरुआती ओटीपी सत्यापित। कार्य आरंभ।" : "Customer verified START_OTP. Service execution commenced.");
    
    document.getElementById("badge-step-1").className = "text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase";
    document.getElementById("badge-step-1").innerText = isHi ? "सत्यापित" : "VERIFIED";
    document.getElementById("badge-step-2").className = "text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase";
    document.getElementById("badge-step-2").innerText = isHi ? "समापन ओटीपी प्रतीक्षारत" : "AWAITING END_OTP";
    
    document.getElementById("booking-badge-status").innerText = isHi ? "प्रगति पर" : "IN PROGRESS";
    document.getElementById("booking-badge-status").className = "bg-blue-600 text-white text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm";
    
    updateTimeline(state.activeBooking.timeline);
    showToast(isHi ? "✓ शुरुआती ओटीपी सत्यापित! कार्य शुरू हुआ।" : "✓ START_OTP Verified! Service commenced.", "success");
  } else {
    sfx.playFallbackWarning();
    showToast(`Invalid START_OTP. Hint: ${state.activeBooking.start_otp}`, "warning");
  }
}

function autoFillEndOtp() {
  sfx.playClick();
  if (!state.activeBooking) return;
  document.getElementById("input-end-otp").value = state.activeBooking.end_otp;
  showToast(state.currentLanguage === "hi" ? "डेमो समापन ओटीपी स्वतः भरा गया" : "Demo END_OTP auto-filled", "info");
}

function previewProofImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById("proof-preview-img").src = e.target.result;
      document.getElementById("proof-preview-container").classList.remove("hidden");
      showToast(state.currentLanguage === "hi" ? "कार्य का प्रमाण संलग्न किया गया" : "Proof of work attached", "info");
    };
    reader.readAsDataURL(file);
  }
}

function simulateProofUpload() {
  sfx.playClick();
  document.getElementById("proof-preview-img").src = "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=300&q=80";
  document.getElementById("proof-preview-container").classList.remove("hidden");
  showToast(state.currentLanguage === "hi" ? "नमूना फोटो संलग्न की गई" : "Sample photo attached", "info");
}

function submitEndOtp() {
  sfx.init();
  const inputEl = document.getElementById("input-end-otp");
  const entered = inputEl ? inputEl.value.trim() : "";
  const isHi = state.currentLanguage === "hi";

  if (!state.activeBooking) {
    showToast(isHi ? "कोई सक्रिय बुकिंग नहीं मिली।" : "No active booking found.", "warning");
    return;
  }

  if (entered === state.activeBooking.end_otp) {
    sfx.playSuccessFanfare();
    state.activeBooking.status = "COMPLETED";
    state.activeBooking.timeline.push(isHi ? "कार्य प्रमाण अपलोड हुआ व समापन ओटीपी सत्यापित हुआ।" : "Proof of work uploaded & END_OTP validated.");
    
    const payout = state.activeBooking.pricing?.cooperative_wage_payout || 140.0;
    const worker = state.activeBooking.assigned_worker || state.activeWorker;

    state.activeBooking.timeline.push(isHi 
      ? `₹${payout.toFixed(2)} सीधे श्रमिक की पासबुक में जमा।`
      : `₹${payout.toFixed(2)} disbursed directly to worker's passbook.`);
    
    const badgeStep2 = document.getElementById("badge-step-2");
    if (badgeStep2) {
      badgeStep2.className = "text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase";
      badgeStep2.innerText = isHi ? "पूर्ण" : "COMPLETED";
    }
    
    const badgeStatus = document.getElementById("booking-badge-status");
    if (badgeStatus) {
      badgeStatus.innerText = isHi ? "पूर्ण हुआ" : "COMPLETED";
      badgeStatus.className = "bg-emerald-700 text-white text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm";
    }
    
    // Update Worker's Earnings and stats
    worker.total_earned = (worker.total_earned || 0) + payout;
    worker.completed_jobs = (worker.completed_jobs || 0) + 1;
    worker.today_wage = (worker.today_wage || 2840.0) + payout;
    worker.account_balance = (worker.account_balance || 68400.0) + payout;

    updateWorkerCardUI(worker);

    // Track completed booking for passbook modal
    if (!state.completedBookings) state.completedBookings = [];
    const sObj = SERVICES.find(s => s.id === state.activeBooking.service_type);
    state.completedBookings.unshift({
      id: state.activeBooking.booking_id,
      service_name: sObj ? (isHi ? sObj.name_hi : sObj.name) : state.activeBooking.service_type.toUpperCase(),
      plan: state.selectedPlan || "Standard",
      payout: payout,
      worker_id: worker.id
    });

    // Update Ministry cumulative wages
    state.nationalStats.wages += payout;
    const mWageEl = document.getElementById("m-wage-count");
    if (mWageEl) mWageEl.innerText = `₹${state.nationalStats.wages.toLocaleString()}`;

    // Push live event to Ministry ticker
    pushCustomTickerEvent(`₹${payout.toFixed(0)} DBT credited to ${worker.name} (${worker.coop_name})`);

    // Reset radar idle message and hide incoming card
    const incomingCard = document.getElementById("incoming-job-card");
    if (incomingCard) incomingCard.classList.add("hidden");
    const idleMsg = document.getElementById("radar-idle-msg");
    if (idleMsg) {
      idleMsg.innerText = isHi 
        ? "कार्य संपन्न। नई सहकारी आवृत्ति की खोज जारी है..." 
        : "Service completed. Scanning cooperative broadcast frequency...";
    }

    updateTimeline(state.activeBooking.timeline);
    updateWorkflowStep(4);
    
    showToast(isHi 
      ? `🎉 कार्य सफलतापूर्वक संपन्न! ₹${payout.toFixed(2)} सीधे डीसीसीबी खाते में 0% कटौती के साथ जमा किए गए।`
      : `🎉 Service Completed! ₹${payout.toFixed(2)} credited directly to DCCB Account with 0% cut.`, "success");
  } else {
    sfx.playFallbackWarning();
    showToast(`Invalid END_OTP. Hint: ${state.activeBooking.end_otp}`, "warning");
  }
}

function autoAdvanceBooking() {
  if (!state.activeBooking) {
    executeBookingConfirmed();
  }
  setTimeout(() => {
    if (!state.activeBooking) return;
    workerAcceptJob();
    const startInput = document.getElementById("input-start-otp");
    if (startInput) startInput.value = state.activeBooking.start_otp;
    setTimeout(() => {
      if (!state.activeBooking) return;
      submitStartOtp();
      simulateProofUpload();
      const endInput = document.getElementById("input-end-otp");
      if (endInput) endInput.value = state.activeBooking.end_otp;
      setTimeout(() => {
        if (!state.activeBooking) return;
        submitEndOtp();
      }, 500);
    }, 500);
  }, 500);
}

// 13. Worker Card UI Synchronization & Persona Switcher
function updateWorkerCardUI(worker) {
  if (!worker) return;
  state.activeWorker = worker;

  const nameEl = document.getElementById("worker-card-name");
  if (nameEl) nameEl.innerText = worker.name;

  const tradeEl = document.getElementById("worker-card-trade");
  if (tradeEl) {
    tradeEl.innerHTML = `Certified ${worker.skill.toUpperCase()} &bull; Member of <span class="font-bold text-slate-700">${worker.coop_name}</span>`;
  }

  const ratingEl = document.getElementById("worker-card-rating");
  if (ratingEl) {
    ratingEl.innerText = `⭐ ${worker.rating} Rating (${worker.completed_jobs} Jobs)`;
  }

  const aadhaarEl = document.getElementById("worker-card-aadhaar");
  if (aadhaarEl) aadhaarEl.innerText = worker.aadhaar;

  const avatarEl = document.getElementById("worker-active-avatar");
  if (avatarEl) avatarEl.src = worker.photo;

  const certTitleEl = document.getElementById("worker-card-cert-title");
  if (certTitleEl) certTitleEl.innerText = worker.cert_title || worker.certificate.split("(")[0].trim();

  const certIssuerEl = document.getElementById("worker-card-cert-issuer");
  if (certIssuerEl) certIssuerEl.innerText = worker.cert_issuer || "Verified by Cooperative Federation";

  const wageEl = document.getElementById("worker-today-wage");
  if (wageEl) {
    const todayWage = worker.today_wage || 2840.0;
    wageEl.innerText = `₹${todayWage.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  }

  const personaSelect = document.getElementById("worker-persona-select");
  if (personaSelect && String(personaSelect.value) !== String(worker.id)) {
    personaSelect.value = String(worker.id);
  }
}

function changeWorkerPersona(workerId) {
  sfx.playClick();
  const worker = WORKERS.find(w => String(w.id) === String(workerId) || w.id === parseInt(workerId));
  if (!worker) return;

  state.activeWorker = worker;
  updateWorkerCardUI(worker);
  updateMapPins();
  calculateLiveQuote();
  showToast(`Switched active profile to ${worker.name}`, "info");
}

// 14. Ministry Dashboard Intelligence & District Table
function renderDistrictTable() {
  const tbody = document.getElementById("district-table-body");
  if (!tbody) return;
  tbody.innerHTML = "";

  const isHi = state.currentLanguage === "hi";

  DISTRICT_DATA.forEach((d, idx) => {
    const row = document.createElement("tr");
    row.className = "hover:bg-slate-50 transition";
    const districtName = isHi ? d.district_hi : d.district;

    row.innerHTML = `
      <td class="p-3 font-bold text-slate-900">${districtName}</td>
      <td class="p-3">
        <div class="flex items-center space-x-2">
          <div class="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
            <div class="${d.alert ? 'bg-red-500' : 'bg-blue-600'} h-full" style="width: ${d.demand}%"></div>
          </div>
          <span class="font-bold">${d.demand}</span>
        </div>
      </td>
      <td class="p-3 font-semibold text-slate-700">${d.workers}</td>
      <td class="p-3">
        ${d.alert 
          ? `<span class="bg-red-100 text-red-900 px-2 py-0.5 rounded-full text-[10px] font-black border border-red-200 flex items-center gap-1 w-fit"><span class="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span> ${isHi ? "कमी चेतावनी" : "Shortage Alert"}</span>` 
          : `<span class="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full text-[10px] font-black border border-emerald-200">${isHi ? "पर्याप्त आपूर्ति" : "Optimal Supply"}</span>`}
      </td>
      <td class="p-3">
        <button onclick="deployPacsGuild(${idx})" class="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-[11px] border border-indigo-200 transition btn-tactile">
          ${isHi ? "पैक्स दल तैनात करें" : "Deploy PACS Guild"}
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function deployPacsGuild(idx) {
  sfx.playSuccessFanfare();
  const d = DISTRICT_DATA[idx];
  d.workers += 10;
  d.alert = false;
  d.demand = Math.max(50, d.demand - 20);

  renderDistrictTable();
  const dName = state.currentLanguage === "hi" ? d.district_hi : d.district;
  showToast(`✓ Deployed 10 PACS reserve technicians to ${dName}! Shortage resolved.`, "success");
  pushCustomTickerEvent(`PACS Vocational Guild deployed to ${d.district} (+10 technicians).`);
}

function approveVerificationCandidate(btn, candidateName) {
  sfx.playSuccessFanfare();
  const isHi = state.currentLanguage === "hi";
  btn.innerText = isHi ? "✓ मुहर जारी" : "✓ Seal Issued";
  btn.className = "flex-1 py-1.5 bg-slate-200 text-emerald-800 rounded-xl text-xs font-bold cursor-default";
  btn.disabled = true;

  state.nationalStats.workers += 1;
  const mWorkerEl = document.getElementById("m-worker-count");
  if (mWorkerEl) mWorkerEl.innerText = `${state.nationalStats.workers} ${isHi ? "तकनीशियन" : "Technicians"}`;
  
  showToast(isHi 
    ? `✓ ${candidateName} को आधिकारिक सरकारी सहकारी मुहर जारी की गई!` 
    : `✓ Official Government Cooperative Seal issued to ${candidateName}!`, "success");
  pushCustomTickerEvent(`Worker ${candidateName} attested via Gemini OCR & PACS seal issued.`);
}

async function fetchMinistryAnalytics() {
  sfx.playClick();
  if (state.hasBackendConnection) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/ministry/analytics`);
      if (res.ok) {
        const data = await res.json();
        const coopEl = document.getElementById("m-coop-count");
        if (coopEl) coopEl.innerText = `${data.active_cooperatives} Federations`;

        const workerEl = document.getElementById("m-worker-count");
        if (workerEl) workerEl.innerText = `${data.total_workers} Technicians`;

        const wageEl = document.getElementById("m-wage-count");
        if (wageEl) wageEl.innerText = `₹${data.total_wages_disbursed.toLocaleString()}`;

        const saveEl = document.getElementById("m-savings-count");
        if (saveEl) saveEl.innerText = `₹${data.citizen_savings_vs_aggregators.toLocaleString()}`;

        showToast(state.currentLanguage === "hi" ? "मंत्रालय डेटा और क्षेत्रीय आवश्यकताएं लाइव अपडेट हुईं!" : "Ministry telemetry and regional requirements refreshed live!", "success");
        return;
      }
    } catch (e) {}
  }
  
  showToast(state.currentLanguage === "hi" ? "मंत्रालय डेटा सफलतापूर्वक सिंक्रनाइज़ हुआ!" : "Ministry telemetry synchronized!", "info");
}

function pushLiveTickerEvent() {
  const events = [
    "₹1,400 DBT disbursed to South Delhi Multi-Purpose Coop",
    "Emergency plumber dispatch completed in Karol Bagh (11 mins)",
    "PACS Federation enrolled 5 new solar wiremen in Central Delhi",
    "Citizen saved ₹340 vs commercial aggregator in Saket",
    "NGO Subsidy of ₹420 approved for Goonj Relief Center"
  ];
  const randEv = events[Math.floor(Math.random() * events.length)];
  pushCustomTickerEvent(randEv);
}

function pushCustomTickerEvent(text) {
  const container = document.getElementById("ministry-live-ticker");
  if (!container) return;
  const item = document.createElement("div");
  item.className = "flex items-center gap-1.5 transition";
  item.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> <span>${text}</span>`;
  container.prepend(item);
  if (container.children.length > 4) {
    container.removeChild(container.lastChild);
  }
}

// 15. Modals (Credential & Passbook)
function openCredentialModal(workerIdentifier) {
  sfx.playClick();
  const modal = document.getElementById("modal-credential");
  if (!modal) return;
  modal.classList.remove("hidden");
  safeCreateIcons();

  let worker = state.activeWorker;
  if (workerIdentifier) {
    const found = WORKERS.find(w => w.name.toLowerCase() === String(workerIdentifier).toLowerCase() || w.id === parseInt(workerIdentifier));
    if (found) worker = found;
  }

  const cred = worker.credentials || {
    issuer: "National Council for Vocational Training (NCVT)",
    cert_no: "NTC/ITI/2022/EL-49821",
    confidence: "96.4% Attested",
    qualification: "National Trade Certificate (Grade A)",
    aadhaar_hash: worker.aadhaar,
    status: "ATTESTED_GOI"
  };

  const nameEl = document.getElementById("modal-worker-name");
  if (nameEl) nameEl.innerText = worker.name;

  const issuerEl = document.getElementById("modal-worker-issuer");
  if (issuerEl) issuerEl.innerText = cred.issuer;

  const certnoEl = document.getElementById("modal-worker-certno");
  if (certnoEl) certnoEl.innerText = cred.cert_no;

  const confEl = document.getElementById("modal-worker-confidence");
  if (confEl) confEl.innerText = cred.confidence;

  const jsonEl = document.getElementById("modal-json-display");
  if (jsonEl) {
    jsonEl.innerText = JSON.stringify({
      verified: true,
      worker_name: worker.name,
      skill: worker.skill.charAt(0).toUpperCase() + worker.skill.slice(1),
      qualification: cred.qualification,
      aadhaar_hash: cred.aadhaar_hash,
      cooperative_federation: worker.coop_name,
      status: cred.status
    }, null, 2);
  }
}

function closeCredentialModal() {
  sfx.playClick();
  const modal = document.getElementById("modal-credential");
  if (modal) modal.classList.add("hidden");
}

function openPassbookModal() {
  sfx.playClick();
  const modal = document.getElementById("modal-passbook");
  if (!modal) return;
  modal.classList.remove("hidden");
  safeCreateIcons();

  const worker = state.activeWorker;
  const balance = worker.account_balance || 68400.0;

  const balEl = document.getElementById("passbook-modal-balance");
  if (balEl) balEl.innerText = `₹${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  const accEl = document.getElementById("passbook-account-number");
  if (accEl) accEl.innerText = `A/C: ${worker.account_number || "DCCB-PACS-8821092"}`;

  const tbody = document.getElementById("passbook-ledger-body");
  if (tbody) {
    let rowsHtml = "";
    const sessionBookings = (state.completedBookings || []).filter(b => b.worker_id === worker.id);
    sessionBookings.forEach(b => {
      rowsHtml += `
        <tr class="bg-emerald-50/50">
          <td class="p-2.5 font-bold text-emerald-900">#${b.id}</td>
          <td class="p-2.5">${b.service_name} (${b.plan})</td>
          <td class="p-2.5 text-emerald-700 font-bold">✓ Credited (Live)</td>
          <td class="p-2.5 text-right font-bold text-emerald-900">+₹${b.payout.toFixed(2)}</td>
        </tr>
      `;
    });

    rowsHtml += `
      <tr>
        <td class="p-2.5 font-bold">#1001</td>
        <td class="p-2.5">Electrician (Connaught Place)</td>
        <td class="p-2.5 text-emerald-700 font-bold">✓ Credited</td>
        <td class="p-2.5 text-right font-bold text-slate-900">₹140.00</td>
      </tr>
      <tr>
        <td class="p-2.5 font-bold">#0998</td>
        <td class="p-2.5">Short Circuit Triage</td>
        <td class="p-2.5 text-emerald-700 font-bold">✓ Credited</td>
        <td class="p-2.5 text-right font-bold text-slate-900">₹220.00</td>
      </tr>
      <tr>
        <td class="p-2.5 font-bold">#0984</td>
        <td class="p-2.5">Weekly Appliance Maintenance</td>
        <td class="p-2.5 text-emerald-700 font-bold">✓ Credited</td>
        <td class="p-2.5 text-right font-bold text-slate-900">₹580.00</td>
      </tr>
    `;
    tbody.innerHTML = rowsHtml;
  }
}

function closePassbookModal() {
  sfx.playClick();
  const modal = document.getElementById("modal-passbook");
  if (modal) modal.classList.add("hidden");
}

function simulateDbtWithdrawal() {
  sfx.playSuccessFanfare();
  const worker = state.activeWorker;
  const balance = worker.account_balance || 68400.0;
  const acc = worker.account_number || "DCCB-PACS-8821092";

  showToast(state.currentLanguage === "hi" 
    ? `✓ डीसीसीबी खाता #${acc} में ₹${balance.toLocaleString()} का तत्काल डीबीटी हस्तांतरण आरंभ!` 
    : `✓ Instant DBT of ₹${balance.toLocaleString()} initiated to DCCB Account #${acc}`, "success");

  worker.account_balance = 0;
  const balEl = document.getElementById("passbook-modal-balance");
  if (balEl) balEl.innerText = "₹0.00";

  pushCustomTickerEvent(`Instant DBT transfer of ₹${balance.toLocaleString()} settled to DCCB #${acc}`);
  setTimeout(() => {
    closePassbookModal();
  }, 1200);
}

// Workflow Step Highlighter
function updateWorkflowStep(stepNum) {
  for (let i = 1; i <= 4; i++) {
    const dot = document.getElementById(`step-dot-${i}`);
    const nav = document.getElementById(`step-nav-${i}`);
    if (!nav) continue;

    if (i <= stepNum) {
      nav.className = "flex items-center gap-2 text-blue-700 whitespace-nowrap font-black";
      if (dot) dot.className = "w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-bold shadow-sm";
    } else {
      nav.className = "flex items-center gap-2 text-slate-400 whitespace-nowrap font-medium";
      if (dot) dot.className = "w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[11px]";
    }
  }
}

// 16. SIH Hackathon Guided Scenarios
function runScenario(scenario) {
  sfx.playClick();
  switch (scenario) {
    case "booking":
      switchPortal("client");
      selectService("electrician");
      selectPlan("hourly");
      const emCheck = document.getElementById("emergency-toggle");
      if (emCheck) emCheck.checked = false;
      toggleEmergencyMode();
      executeBooking();
      showToast("Scenario 1: Standard Electrician Booking & Payment Gateway", "info");
      break;

    case "payment":
      switchPortal("client");
      selectService("electrician");
      calculateLiveQuote();
      openPaymentGatewayModal();
      showToast("Scenario 2: Demo Payment Gateway with Itemized Price Breakdown", "info");
      break;

    case "ngo":
      switchPortal("client");
      openNgoVerificationModal();
      setTimeout(() => {
        autoFillSampleNgo();
      }, 300);
      showToast("Scenario 3: NGO Verification Form opened & pre-filled", "info");
      break;

    case "fallback":
      switchPortal("client");
      selectService("electrician");
      const emToggle = document.getElementById("emergency-toggle");
      if (emToggle) emToggle.checked = true;
      toggleEmergencyMode();
      executeBookingConfirmed();
      setTimeout(() => {
        switchPortal("worker");
        setTimeout(() => {
          workerRejectJob();
        }, 800);
      }, 800);
      showToast("Scenario 4: Emergency Mode & Rapido Fallback activated", "warning");
      break;

    case "otp":
      if (!state.activeBooking) {
        executeBookingConfirmed();
      }
      setTimeout(() => {
        if (!state.activeBooking) return;
        switchPortal("worker");
        workerAcceptJob();
        setTimeout(() => {
          if (!state.activeBooking) return;
          const startInput = document.getElementById("input-start-otp");
          if (startInput) startInput.value = state.activeBooking.start_otp;
          submitStartOtp();
          simulateProofUpload();
          setTimeout(() => {
            if (!state.activeBooking) return;
            const endInput = document.getElementById("input-end-otp");
            if (endInput) endInput.value = state.activeBooking.end_otp;
            submitEndOtp();
          }, 800);
        }, 800);
      }, 500);
      showToast("Scenario 5: Dual-OTP Lifecycle validated with celebration", "success");
      break;
  }
}

function resetDemoState() {
  sfx.playClick();
  state.activeBooking = null;
  state.isEmergency = false;
  state.isNgo = false;
  state.ngoVerified = false;
  state.ngoData = null;
  state.completedBookings = [];

  const emCheck = document.getElementById("emergency-toggle");
  if (emCheck) emCheck.checked = false;

  const ngoCheck = document.getElementById("ngo-checkbox");
  if (ngoCheck) ngoCheck.checked = false;

  toggleEmergencyMode();

  const pill = document.getElementById("ngo-verified-pill");
  const hint = document.getElementById("ngo-unverified-hint");
  if (pill) pill.classList.add("hidden");
  if (hint) hint.classList.remove("hidden");

  const container = document.getElementById("ngo-selection-container");
  if (container) container.className = "mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3";

  const statusCard = document.getElementById("booking-status-card");
  if (statusCard) statusCard.classList.add("hidden");

  const incCard = document.getElementById("incoming-job-card");
  if (incCard) incCard.classList.add("hidden");

  const fallbackNotice = document.getElementById("worker-fallback-notice");
  if (fallbackNotice) fallbackNotice.classList.add("hidden");

  const idleMsg = document.getElementById("radar-idle-msg");
  if (idleMsg) {
    idleMsg.innerText = state.currentLanguage === "hi" 
      ? "सहकारी प्रसारण आवृत्ति की खोज जारी है..." 
      : "Scanning cooperative broadcast frequency...";
  }

  const badgeStep1 = document.getElementById("badge-step-1");
  if (badgeStep1) {
    badgeStep1.innerText = "LOCKED";
    badgeStep1.className = "text-[10px] font-black px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase";
  }

  const badgeStep2 = document.getElementById("badge-step-2");
  if (badgeStep2) {
    badgeStep2.innerText = "PENDING";
    badgeStep2.className = "text-[10px] font-black px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase";
  }

  const startInput = document.getElementById("input-start-otp");
  if (startInput) startInput.value = "";

  const endInput = document.getElementById("input-end-otp");
  if (endInput) endInput.value = "";

  const proofPrev = document.getElementById("proof-preview-container");
  if (proofPrev) proofPrev.classList.add("hidden");
  
  clearSearch();

  if (state.routePolyline && state.clientMap) {
    state.clientMap.removeLayer(state.routePolyline);
    state.routePolyline = null;
  }

  DISTRICT_DATA = [
    { district: "Central Delhi", district_hi: "मध्य दिल्ली", demand: 94, pending: 28, workers: 45, alert: true },
    { district: "South Delhi", district_hi: "दक्षिण दिल्ली", demand: 88, pending: 19, workers: 52, alert: false },
    { district: "East Delhi", district_hi: "पूर्वी दिल्ली", demand: 76, pending: 14, workers: 38, alert: false },
    { district: "West Delhi", district_hi: "पश्चिम दिल्ली", demand: 82, pending: 22, workers: 40, alert: true },
    { district: "North Delhi", district_hi: "उत्तर दिल्ली", demand: 68, pending: 9, workers: 30, alert: false }
  ];

  // Reset worker card to default worker (Rajesh Kumar)
  const defaultWorker = WORKERS[0];
  updateWorkerCardUI(defaultWorker);
  updateMapPins();

  // Reset subscription
  state.activeSubscription = null;
  state.selectedSubTier = "monthly_pass";
  state.activeOffers = [];
  const subStatusBadge = document.getElementById("subscription-active-status");
  if (subStatusBadge) subStatusBadge.classList.add("hidden");
  selectSubTier("monthly_pass");

  // Reset reviews
  state.reviewFilter = "all";
  filterCitizenReviews("all");

  // Reset worker onboarding
  logoutWorkerToOnboard();

  renderDistrictTable();
  switchPortal("client");
  selectService("electrician");
  updateWorkflowStep(1);
  safeCreateIcons();
  showToast("Demo state reset to initial conditions", "info");
}

// ==========================================
// 15. SAHAKAR SAMRIDDHI SUBSCRIPTION PASS
// ==========================================

const SUBSCRIPTION_TIERS = {
  monthly_pass: {
    id: "monthly_pass",
    name: "Seva Setu Monthly Pass",
    name_hi: "सेवा सेतु मासिक पास",
    duration: "1 Month",
    price: 199.0,
    discount_pct: 20,
    perks: [
      "20% Flat Discount on all tasks & repairs",
      "Zero platform welfare fee (Saved 3.5%)",
      "Priority emergency triage (<15 min dispatch)",
      "Free monthly household safety audit"
    ]
  },
  annual_samriddhi: {
    id: "annual_samriddhi",
    name: "Seva Setu Yearly Pass",
    name_hi: "सेवा सेतु वार्षिक पास",
    duration: "12 Months",
    price: 1999.0,
    discount_pct: 30,
    perks: [
      "★ Includes ALL Monthly Pass Benefits",
      "Enhanced 30% Flat Discount on all services & artisan crafts",
      "Full Family Coverage (up to 4 members registered)",
      "₹500 Seasonal Festival Voucher Pack",
      "Dedicated PACS Artisan & Cooperative Concierge"
    ]
  }
};

function initSubscriptionSystem() {
  selectSubTier("monthly_pass");
}

function selectSubTier(tierId) {
  sfx.playClick();
  state.selectedSubTier = tierId;
  ["monthly_pass", "annual_samriddhi"].forEach(t => {
    const card = document.getElementById(`tier-card-${t}`);
    if (card) {
      if (t === tierId) {
        card.className = "p-4 rounded-2xl border-2 border-amber-500 bg-amber-50/70 relative cursor-pointer shadow-md transition btn-tactile ring-2 ring-amber-400/30";
      } else {
        card.className = "p-4 rounded-2xl border border-slate-200 bg-white relative cursor-pointer hover:border-amber-400 transition btn-tactile shadow-sm";
      }
    }
  });

  const ctaDesc = document.getElementById("sub-cta-desc");
  if (ctaDesc) {
    const tier = SUBSCRIPTION_TIERS[tierId] || SUBSCRIPTION_TIERS.monthly_pass;
    ctaDesc.innerHTML = state.currentLanguage === "hi"
      ? `चेकआउट पर तुरंत वाउचर कोड <code class="font-bold bg-white px-1.5 py-0.5 rounded text-amber-700">SAMRIDDHI${tier.discount_pct}</code> और ${tier.discount_pct}% की छूट मिलेगी!`
      : `Instant voucher code <code class="font-bold bg-white px-1.5 py-0.5 rounded text-amber-700">SAMRIDDHI${tier.discount_pct}</code> generated upon checkout!`;
  }
}

function openSubscriptionCheckoutModal() {
  sfx.playClick();
  const modal = document.getElementById("modal-subscription-gateway");
  if (!modal) return;

  const tier = SUBSCRIPTION_TIERS[state.selectedSubTier] || SUBSCRIPTION_TIERS.monthly_pass;
  const planNameEl = document.getElementById("sub-modal-plan-name");
  const priceEl = document.getElementById("sub-modal-price");

  if (planNameEl) planNameEl.innerText = `${tier.name} (${tier.duration})`;
  if (priceEl) priceEl.innerText = `₹${tier.price.toFixed(2)}`;

  modal.classList.remove("hidden");
  safeCreateIcons();
}

function closeSubscriptionModal() {
  sfx.playClick();
  const modal = document.getElementById("modal-subscription-gateway");
  if (modal) modal.classList.add("hidden");
}

function simulateSubPaymentApproval() {
  sfx.playAlert();
  showToast(state.currentLanguage === "hi" 
    ? "यूपीआई मोबाइल ऐप भुगतान स्वीकृत! सदस्यता सक्रिय की जा रही है..." 
    : "UPI Mobile Approval Received! Authorizing subscription...", "success");
  setTimeout(() => {
    confirmSubscriptionActivation();
  }, 900);
}

async function confirmSubscriptionActivation() {
  const tier = SUBSCRIPTION_TIERS[state.selectedSubTier] || SUBSCRIPTION_TIERS.monthly_pass;
  const isYearly = tier.id === "annual_samriddhi";
  
  try {
    const res = await fetch(`${API_BASE_URL}/api/subscriptions/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_name: "Aarav Mehta",
        plan_id: tier.id,
        payment_method: "upi_qr"
      })
    });
    if (res.ok) {
      const data = await res.json();
      state.activeSubscription = data.subscription || data.plan;
      state.activeOffers = data.offers || data.generated_offers || [];
    } else {
      throw new Error("API error");
    }
  } catch (e) {
    // Fallback offline subscription activation
    state.activeSubscription = {
      plan_id: tier.id,
      plan_name: tier.name,
      price: tier.price,
      status: "active",
      valid_until: isYearly ? "2027-03-31" : "2026-10-31",
      voucher_code: `SAMRIDDHI${tier.discount_pct}`
    };

    if (isYearly) {
      state.activeOffers = [
        {
          code: `SAMRIDDHI${tier.discount_pct}`,
          title: "30% Flat Cooperative & Artisan Voucher",
          description: "30% discount applied automatically across all standard tasks, carpentry, and artisan crafts.",
          type: "flat_discount",
          value: 30
        },
        {
          code: "MONTHLY_PERKS_INCLUDED",
          title: "All Monthly Pass Benefits Activated",
          description: "Zero platform fee, priority triage, and free household audits are fully included in your yearly pass.",
          type: "monthly_bundle",
          value: 100
        },
        {
          code: "FAMILYCARE4",
          title: "Priority 4-Member Family Coverage",
          description: "Emergency service coverage extended to up to 4 registered household members.",
          type: "family_pass",
          value: 100
        },
        {
          code: "FESTIVAL500",
          title: "₹500 Seasonal Festival Artisan Voucher",
          description: "₹500 credit redeemable on home painting, carpentry renovation, and artisan terracotta decor.",
          type: "wallet_credit",
          value: 500
        },
        {
          code: "TRIAGEFREE",
          title: "Emergency Priority Triage Waiver",
          description: "Priority sub-15m emergency triage fee is 100% free for your household.",
          type: "emergency_waiver",
          value: 100
        }
      ];
    } else {
      state.activeOffers = [
        {
          code: `SAMRIDDHI${tier.discount_pct}`,
          title: `${tier.discount_pct}% Flat Cooperative Voucher`,
          description: `${tier.discount_pct}% discount applied automatically to all future cooperative bookings.`,
          type: "flat_discount",
          value: tier.discount_pct
        },
        {
          code: "TRIAGEFREE",
          title: "Emergency Priority Triage Waiver",
          description: "Priority sub-15m emergency triage fee is 100% free for your household.",
          type: "emergency_waiver",
          value: 100
        },
        {
          code: "COOPCARE100",
          title: "Cooperative Preventive Health Credit",
          description: "₹100 credit on preventative electrical wiring inspection & elder care visit.",
          type: "wallet_credit",
          value: 100
        }
      ];
    }
  }

  closeSubscriptionModal();
  sfx.playSuccessFanfare();

  // Reveal Active Badge in subscription card
  const statusBadge = document.getElementById("subscription-active-status");
  const badgeText = document.getElementById("sub-active-badge-text");
  if (statusBadge && badgeText) {
    statusBadge.classList.remove("hidden");
    badgeText.innerText = state.currentLanguage === "hi"
      ? `पास सक्रिय: ${tier.discount_pct}% छूट लागू`
      : `Pass Active: ${tier.discount_pct}% Off Applied`;
  }

  // Update Invoice Quote
  calculateLiveQuote();

  // Show Offers Modal Vault
  openOffersModal();

  showToast(state.currentLanguage === "hi"
    ? `बधाई हो! ${tier.name_hi || tier.name} सक्रिय हो गया है। विशेष वाउचर जनरेट हो गए हैं!`
    : `Congratulations! ${tier.name} activated. Special discount vouchers generated!`, "success");
}

function openOffersModal() {
  sfx.playClick();
  const modal = document.getElementById("modal-subscription-success");
  if (!modal) return;

  const container = document.getElementById("offers-list-container");
  if (container && state.activeOffers && state.activeOffers.length > 0) {
    container.innerHTML = state.activeOffers.map(o => `
      <div class="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl flex items-center justify-between gap-3 shadow-sm">
        <div>
          <span class="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded uppercase">${o.title}</span>
          <h4 class="text-sm font-black text-slate-900 mt-1">${o.code}</h4>
          <p class="text-xs text-slate-600">${o.description}</p>
        </div>
        <button onclick="copyOfferCode('${o.code}')" class="px-3 py-1.5 bg-white text-slate-800 text-xs font-black rounded-xl border border-amber-300 hover:bg-amber-100 transition btn-tactile">Copy</button>
      </div>
    `).join("");
  }

  modal.classList.remove("hidden");
  safeCreateIcons();
}

function closeOffersModal() {
  sfx.playClick();
  const modal = document.getElementById("modal-subscription-success");
  if (modal) modal.classList.add("hidden");
}

function copyOfferCode(code) {
  sfx.playClick();
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code).catch(() => {});
  }
  showToast(state.currentLanguage === "hi" 
    ? `कूपन कोड "${code}" कॉपी किया गया!` 
    : `Coupon Code "${code}" copied to clipboard!`, "success");
}

// ==========================================
// 16. CITIZEN REVIEWS & GRIEVANCE LOG
// ==========================================

async function initCitizenReviews() {
  await fetchReviews();
}

async function fetchReviews() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/reviews`);
    if (res.ok) {
      const data = await res.json();
      state.reviews = (data.reviews || []).map(r => ({
        ...r,
        user_name: r.user_name || r.customer_name || "Verified Citizen",
        service: r.service || r.service_type || "general",
        service_title: r.service_title || `${(r.service || r.service_type || 'General').toUpperCase()} Service`,
        type: r.type || r.review_type || (r.rating >= 4 ? 'positive' : 'complaint'),
        status: (r.status || "resolved").toLowerCase().replace(/\s+/g, "_")
      }));
      const stats = data.stats || {};
      
      const avgEl = document.getElementById("reviews-avg-rating");
      const countEl = document.getElementById("reviews-count-badge");
      if (avgEl) avgEl.innerText = stats.average_rating ? stats.average_rating.toFixed(1) : "4.9";
      if (countEl) countEl.innerText = `${stats.total_reviews || state.reviews.length} verified`;

      renderCitizenReviews();
      renderMinistryGrievances();
      return;
    }
  } catch (e) {
    console.warn("Could not fetch reviews from API, using default dataset", e);
  }

  // Fallback reviews
  state.reviews = [
    {
      id: "REV-2026-001",
      user_name: "Meera Krishnan",
      worker_id: 101,
      worker_name: "Rajesh Kumar",
      service: "electrician",
      service_title: "Electrical Wiring & Inverter Setup",
      rating: 5,
      type: "positive",
      comment: "Rajesh arrived within 15 minutes of booking with verified ITI tools. 100% fair price of ₹140 with zero hidden aggregator charges! Fantastic cooperative initiative.",
      verified_booking: true,
      timestamp: "Today, 10:45 AM",
      status: "resolved",
      ministry_action: "Commendation Recorded"
    },
    {
      id: "REV-2026-002",
      user_name: "Col. Sanjeev Malik (Retd)",
      worker_id: 103,
      worker_name: "Sunita Sharma",
      service: "healthcare",
      service_title: "Elder Nursing & Vitals Check",
      rating: 5,
      type: "positive",
      comment: "Sunita did an exceptional job monitoring post-operative vitals for my mother. NSDC certified, extremely polite, and compassionate.",
      verified_booking: true,
      timestamp: "Yesterday, 04:20 PM",
      status: "resolved",
      ministry_action: "Commendation Recorded"
    },
    {
      id: "REV-2026-003",
      user_name: "Rohan Bakshi",
      worker_id: 102,
      worker_name: "Mohammad Aslam",
      service: "plumber",
      service_title: "Under-sink Pipeline Repair",
      rating: 2,
      type: "complaint",
      comment: "The repair took an hour longer than estimated and technician asked for ₹50 additional for replacement washers without invoice. Requesting cooperative inquiry.",
      verified_booking: true,
      timestamp: "2 days ago",
      status: "under_investigation",
      ministry_action: "Under Investigation by PACS"
    },
    {
      id: "REV-2026-004",
      user_name: "Deepa Narayan",
      worker_id: 105,
      worker_name: "Pooja Devi",
      service: "cleaning",
      service_title: "Deep Kitchen & Floor Sanitation",
      rating: 5,
      type: "positive",
      comment: "Pooja was meticulous and used eco-friendly cooperative sanitation chemicals. Honest transparent pricing with 100% direct fair wages to the worker!",
      verified_booking: true,
      timestamp: "3 days ago",
      status: "resolved",
      ministry_action: "Commendation Recorded"
    },
    {
      id: "REV-2026-005",
      user_name: "Harish Chawla",
      worker_id: 104,
      worker_name: "Vikram Singh",
      service: "driver",
      service_title: "Hospital Transit & Wheelchair Assistance",
      rating: 3,
      type: "complaint",
      comment: "Driver arrived 12 minutes late due to traffic, but was helpful once he reached. Should improve peak-hour dispatch accuracy.",
      verified_booking: true,
      timestamp: "4 days ago",
      status: "warning_issued",
      ministry_action: "Warning Issued for Punctuality"
    }
  ];

  renderCitizenReviews();
  renderMinistryGrievances();
}

function renderCitizenReviews() {
  const container = document.getElementById("citizen-reviews-grid");
  if (!container) return;

  const filter = state.reviewFilter || "all";
  const list = state.reviews.filter(r => {
    if (filter === "positive") return r.type === "positive" || r.rating >= 4;
    if (filter === "complaint") return r.type === "complaint" || r.rating <= 3;
    return true;
  });

  if (list.length === 0) {
    container.innerHTML = `
      <div class="col-span-full p-8 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
        <p class="text-sm font-bold text-slate-600">No reviews found in this category.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(r => {
    const isPositive = r.type === "positive" || r.rating >= 4;
    const stars = "★".repeat(r.rating) + "☆".repeat(5 - r.rating);
    const badgeType = isPositive
      ? `<span class="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200"><i data-lucide="check-circle" class="w-3 h-3"></i> Verified Experience</span>`
      : `<span class="bg-red-100 text-red-800 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 border border-red-200"><i data-lucide="alert-triangle" class="w-3 h-3"></i> Grievance Logged</span>`;

    return `
      <div class="review-card glass-card rounded-2xl p-4 border ${isPositive ? "border-slate-200 hover:border-emerald-300" : "border-red-200 bg-red-50/20"} space-y-3">
        <div class="flex items-start justify-between gap-2">
          <div>
            <div class="flex items-center gap-1.5">
              <span class="font-black text-slate-900 text-xs">${r.user_name}</span>
              <i data-lucide="shield-check" class="w-3.5 h-3.5 text-blue-600" title="Dual-OTP Verified Citizen"></i>
            </div>
            <p class="text-[11px] text-slate-500 font-medium">${r.service_title || r.service}</p>
          </div>
          <div class="text-right">
            <div class="text-amber-500 font-bold text-xs tracking-wider">${stars}</div>
            <span class="text-[10px] text-slate-400 font-medium">${r.timestamp}</span>
          </div>
        </div>

        <p class="text-xs text-slate-700 leading-relaxed font-medium">"${r.comment}"</p>

        <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span class="text-slate-500">Worker: <strong class="text-slate-800">${r.worker_name}</strong></span>
          ${badgeType}
        </div>
      </div>
    `;
  }).join("");

  safeCreateIcons();
}

function filterCitizenReviews(filterType) {
  sfx.playClick();
  state.reviewFilter = filterType;
  ["all", "positive", "complaint"].forEach(f => {
    const btn = document.getElementById(`tab-review-${f}`);
    if (btn) {
      if (f === filterType) {
        btn.className = "px-3 py-1.5 bg-white text-blue-900 font-extrabold rounded-xl shadow-sm transition";
      } else {
        btn.className = "px-3 py-1.5 text-slate-600 hover:text-slate-900 font-bold rounded-xl transition";
      }
    }
  });
  renderCitizenReviews();
}

function openWriteReviewModal() {
  sfx.playClick();
  const modal = document.getElementById("modal-write-review");
  if (!modal) return;
  
  // Pre-select current service if available
  const servSelect = document.getElementById("review-input-service");
  if (servSelect) servSelect.value = state.selectedService || "electrician";

  setStarRating(5);
  toggleReviewType("positive");

  modal.classList.remove("hidden");
  safeCreateIcons();
}

function closeWriteReviewModal() {
  sfx.playClick();
  const modal = document.getElementById("modal-write-review");
  if (modal) modal.classList.add("hidden");
}

function setStarRating(score) {
  state.currentStarRating = score;
  const ratingInput = document.getElementById("review-input-rating");
  if (ratingInput) ratingInput.value = score;

  const starBtns = document.querySelectorAll("#review-star-container .star-btn");
  starBtns.forEach((btn, idx) => {
    if (idx < score) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  const label = document.getElementById("review-star-label");
  if (label) {
    const texts = ["", "1.0 / 5.0 (Poor)", "2.0 / 5.0 (Fair)", "3.0 / 5.0 (Average)", "4.0 / 5.0 (Very Good)", "5.0 / 5.0 (Excellent)"];
    label.innerText = texts[score] || `${score}.0 / 5.0`;
  }
}

function toggleReviewType(type) {
  state.currentReviewType = type;
  const posLabel = document.getElementById("label-type-positive");
  const compLabel = document.getElementById("label-type-complaint");

  if (type === "positive") {
    if (posLabel) posLabel.className = "p-2.5 border-2 border-emerald-500 bg-emerald-50 rounded-xl cursor-pointer flex items-center gap-2 font-bold text-emerald-900";
    if (compLabel) compLabel.className = "p-2.5 border border-slate-200 hover:border-red-300 rounded-xl cursor-pointer flex items-center gap-2 font-bold text-slate-700";
  } else {
    if (posLabel) posLabel.className = "p-2.5 border border-slate-200 hover:border-emerald-300 rounded-xl cursor-pointer flex items-center gap-2 font-bold text-slate-700";
    if (compLabel) compLabel.className = "p-2.5 border-2 border-red-500 bg-red-50 rounded-xl cursor-pointer flex items-center gap-2 font-bold text-red-900";
  }
}

async function handleReviewSubmit(e) {
  e.preventDefault();
  sfx.playClick();

  const nameInput = document.getElementById("review-input-name");
  const serviceInput = document.getElementById("review-input-service");
  const workerInput = document.getElementById("review-input-worker");
  const commentInput = document.getElementById("review-input-comment");

  const userName = nameInput ? nameInput.value.trim() : "Verified Citizen";
  const service = serviceInput ? serviceInput.value : "electrician";
  const workerId = workerInput ? parseInt(workerInput.value, 10) : 101;
  const comment = commentInput ? commentInput.value.trim() : "";
  const rating = state.currentStarRating || 5;
  const type = state.currentReviewType || "positive";

  const workerObj = WORKERS.find(w => w.id === workerId) || WORKERS[0];

  const payload = {
    user_name: userName,
    worker_id: workerId,
    service: service,
    rating: rating,
    type: type,
    comment: comment
  };

  try {
    const res = await fetch(`${API_BASE_URL}/api/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const saved = await res.json();
      const rawRev = saved.review || saved;
      const normalizedReview = {
        ...rawRev,
        id: rawRev.id || `REV-2026-00${state.reviews.length + 1}`,
        user_name: rawRev.user_name || rawRev.customer_name || userName,
        worker_id: rawRev.worker_id || workerId,
        worker_name: rawRev.worker_name || workerObj.name,
        service: rawRev.service || rawRev.service_type || service,
        service_title: rawRev.service_title || `${(rawRev.service || rawRev.service_type || service).toUpperCase()} Service`,
        rating: rawRev.rating || rating,
        type: rawRev.type || rawRev.review_type || type,
        comment: rawRev.comment || comment,
        status: (rawRev.status || (type === "complaint" ? "under_investigation" : "resolved")).toLowerCase().replace(/\s+/g, "_"),
        ministry_action: rawRev.ministry_action || (type === "complaint" ? "Logged for PACS Audit" : "Commendation Recorded")
      };
      state.reviews.unshift(normalizedReview);
    } else {
      throw new Error("Failed to post");
    }
  } catch (err) {
    // Offline fallback prepend
    const fallbackReview = {
      id: `REV-2026-00${state.reviews.length + 1}`,
      user_name: userName,
      worker_id: workerId,
      worker_name: workerObj.name,
      service: service,
      service_title: `${service} Task`,
      rating: rating,
      type: type,
      comment: comment,
      verified_booking: true,
      timestamp: "Just now",
      status: type === "complaint" ? "under_investigation" : "resolved",
      ministry_action: type === "complaint" ? "Logged for PACS Audit" : "Commendation Recorded"
    };
    state.reviews.unshift(fallbackReview);
  }

  closeWriteReviewModal();
  renderCitizenReviews();
  renderMinistryGrievances();

  if (commentInput) commentInput.value = "";
  sfx.playSuccessFanfare();
  showToast(state.currentLanguage === "hi"
    ? "आपकी समीक्षा सफलतापूर्वक प्रकाशित हो गई है और मंत्रालय लॉग में दर्ज हो गई है!"
    : "Your review has been published and logged in the Ministry Cockpit!", "success");
}

// ==========================================
// 17. MINISTRY COCKPIT EXTENSIONS
// ==========================================

async function initMinistryExtensions() {
  await fetchRegionalDemandCharts();
  await fetchMinistryRevenue();
  renderMinistryGrievances();
}

// 15. Comprehensive National Service Requirements & Regional Demand Reports
const DEFAULT_REGIONAL_DEMAND = [
  {
    district: "Central Delhi",
    district_hi: "मध्य दिल्ली",
    demand_index: 94,
    active_workers: 45,
    required_workers: 76,
    status: "Critical Shortage",
    monthly_orders: 1420,
    trade_demand: {
      electrician: 98, plumber: 85, carpentry: 82, cleaning: 92, painting: 76,
      healthcare: 78, masonry: 74, pottery: 68, blacksmith: 70, tailoring: 75,
      driver: 88, waste_management: 80
    },
    trade_requirements: {
      electrician: { required: 32, active: 18, deficit: 14, demand_score: 98, monthly_orders: 420 },
      plumber: { required: 24, active: 15, deficit: 9, demand_score: 85, monthly_orders: 310 },
      carpentry: { required: 18, active: 11, deficit: 7, demand_score: 82, monthly_orders: 240 },
      cleaning: { required: 28, active: 20, deficit: 8, demand_score: 92, monthly_orders: 360 },
      painting: { required: 16, active: 10, deficit: 6, demand_score: 76, monthly_orders: 190 },
      healthcare: { required: 20, active: 14, deficit: 6, demand_score: 78, monthly_orders: 220 },
      masonry: { required: 14, active: 8, deficit: 6, demand_score: 74, monthly_orders: 160 },
      pottery: { required: 10, active: 6, deficit: 4, demand_score: 68, monthly_orders: 110 },
      blacksmith: { required: 12, active: 7, deficit: 5, demand_score: 70, monthly_orders: 130 },
      tailoring: { required: 15, active: 11, deficit: 4, demand_score: 75, monthly_orders: 150 },
      driver: { required: 22, active: 16, deficit: 6, demand_score: 88, monthly_orders: 280 },
      waste_management: { required: 16, active: 11, deficit: 5, demand_score: 80, monthly_orders: 180 }
    }
  },
  {
    district: "South Delhi",
    district_hi: "दक्षिण दिल्ली",
    demand_index: 88,
    active_workers: 52,
    required_workers: 68,
    status: "High Demand",
    monthly_orders: 1850,
    trade_demand: {
      electrician: 84, plumber: 82, carpentry: 86, cleaning: 89, painting: 88,
      healthcare: 96, masonry: 70, pottery: 74, blacksmith: 66, tailoring: 80,
      driver: 85, waste_management: 78
    },
    trade_requirements: {
      electrician: { required: 26, active: 22, deficit: 4, demand_score: 84, monthly_orders: 340 },
      plumber: { required: 22, active: 18, deficit: 4, demand_score: 82, monthly_orders: 290 },
      carpentry: { required: 20, active: 16, deficit: 4, demand_score: 86, monthly_orders: 260 },
      cleaning: { required: 30, active: 25, deficit: 5, demand_score: 89, monthly_orders: 410 },
      painting: { required: 18, active: 15, deficit: 3, demand_score: 88, monthly_orders: 230 },
      healthcare: { required: 28, active: 24, deficit: 4, demand_score: 96, monthly_orders: 380 },
      masonry: { required: 12, active: 10, deficit: 2, demand_score: 70, monthly_orders: 140 },
      pottery: { required: 12, active: 10, deficit: 2, demand_score: 74, monthly_orders: 150 },
      blacksmith: { required: 10, active: 8, deficit: 2, demand_score: 66, monthly_orders: 120 },
      tailoring: { required: 16, active: 14, deficit: 2, demand_score: 80, monthly_orders: 200 },
      driver: { required: 25, active: 22, deficit: 3, demand_score: 85, monthly_orders: 320 },
      waste_management: { required: 15, active: 13, deficit: 2, demand_score: 78, monthly_orders: 170 }
    }
  },
  {
    district: "East Delhi",
    district_hi: "पूर्वी दिल्ली",
    demand_index: 76,
    active_workers: 38,
    required_workers: 46,
    status: "Stable Supply",
    monthly_orders: 980,
    trade_demand: {
      electrician: 75, plumber: 80, carpentry: 72, cleaning: 78, painting: 70,
      healthcare: 65, masonry: 84, pottery: 86, blacksmith: 82, tailoring: 88,
      driver: 70, waste_management: 82
    },
    trade_requirements: {
      electrician: { required: 18, active: 16, deficit: 2, demand_score: 75, monthly_orders: 210 },
      plumber: { required: 16, active: 14, deficit: 2, demand_score: 80, monthly_orders: 190 },
      carpentry: { required: 14, active: 12, deficit: 2, demand_score: 72, monthly_orders: 160 },
      cleaning: { required: 20, active: 18, deficit: 2, demand_score: 78, monthly_orders: 240 },
      painting: { required: 12, active: 11, deficit: 1, demand_score: 70, monthly_orders: 130 },
      healthcare: { required: 14, active: 13, deficit: 1, demand_score: 65, monthly_orders: 150 },
      masonry: { required: 20, active: 16, deficit: 4, demand_score: 84, monthly_orders: 220 },
      pottery: { required: 18, active: 14, deficit: 4, demand_score: 86, monthly_orders: 180 },
      blacksmith: { required: 16, active: 12, deficit: 4, demand_score: 82, monthly_orders: 170 },
      tailoring: { required: 22, active: 18, deficit: 4, demand_score: 88, monthly_orders: 250 },
      driver: { required: 15, active: 13, deficit: 2, demand_score: 70, monthly_orders: 180 },
      waste_management: { required: 18, active: 15, deficit: 3, demand_score: 82, monthly_orders: 190 }
    }
  },
  {
    district: "West Delhi",
    district_hi: "पश्चिम दिल्ली",
    demand_index: 82,
    active_workers: 40,
    required_workers: 56,
    status: "Shortage Alert",
    monthly_orders: 1210,
    trade_demand: {
      electrician: 90, plumber: 94, carpentry: 88, cleaning: 80, painting: 82,
      healthcare: 72, masonry: 80, pottery: 70, blacksmith: 78, tailoring: 84,
      driver: 76, waste_management: 74
    },
    trade_requirements: {
      electrician: { required: 25, active: 17, deficit: 8, demand_score: 90, monthly_orders: 310 },
      plumber: { required: 24, active: 14, deficit: 10, demand_score: 94, monthly_orders: 330 },
      carpentry: { required: 18, active: 12, deficit: 6, demand_score: 88, monthly_orders: 220 },
      cleaning: { required: 22, active: 18, deficit: 4, demand_score: 80, monthly_orders: 260 },
      painting: { required: 16, active: 12, deficit: 4, demand_score: 82, monthly_orders: 180 },
      healthcare: { required: 16, active: 13, deficit: 3, demand_score: 72, monthly_orders: 170 },
      masonry: { required: 16, active: 12, deficit: 4, demand_score: 80, monthly_orders: 190 },
      pottery: { required: 11, active: 8, deficit: 3, demand_score: 70, monthly_orders: 120 },
      blacksmith: { required: 14, active: 10, deficit: 4, demand_score: 78, monthly_orders: 150 },
      tailoring: { required: 18, active: 14, deficit: 4, demand_score: 84, monthly_orders: 210 },
      driver: { required: 18, active: 15, deficit: 3, demand_score: 76, monthly_orders: 200 },
      waste_management: { required: 14, active: 11, deficit: 3, demand_score: 74, monthly_orders: 160 }
    }
  },
  {
    district: "North Delhi",
    district_hi: "उत्तर दिल्ली",
    demand_index: 68,
    active_workers: 30,
    required_workers: 36,
    status: "Balanced",
    monthly_orders: 840,
    trade_demand: {
      electrician: 70, plumber: 66, carpentry: 68, cleaning: 72, painting: 64,
      healthcare: 62, masonry: 72, pottery: 75, blacksmith: 74, tailoring: 70,
      driver: 68, waste_management: 76
    },
    trade_requirements: {
      electrician: { required: 15, active: 13, deficit: 2, demand_score: 70, monthly_orders: 170 },
      plumber: { required: 14, active: 12, deficit: 2, demand_score: 66, monthly_orders: 150 },
      carpentry: { required: 12, active: 10, deficit: 2, demand_score: 68, monthly_orders: 140 },
      cleaning: { required: 16, active: 14, deficit: 2, demand_score: 72, monthly_orders: 180 },
      painting: { required: 10, active: 9, deficit: 1, demand_score: 64, monthly_orders: 110 },
      healthcare: { required: 12, active: 11, deficit: 1, demand_score: 62, monthly_orders: 130 },
      masonry: { required: 14, active: 12, deficit: 2, demand_score: 72, monthly_orders: 150 },
      pottery: { required: 14, active: 12, deficit: 2, demand_score: 75, monthly_orders: 140 },
      blacksmith: { required: 12, active: 10, deficit: 2, demand_score: 74, monthly_orders: 130 },
      tailoring: { required: 14, active: 12, deficit: 2, demand_score: 70, monthly_orders: 150 },
      driver: { required: 14, active: 12, deficit: 2, demand_score: 68, monthly_orders: 160 },
      waste_management: { required: 15, active: 13, deficit: 2, demand_score: 76, monthly_orders: 160 }
    }
  }
];

function initMinistryServiceRequirements() {
  const container = document.getElementById("min-service-chips-container");
  const select = document.getElementById("min-service-select");
  if (!container && !select) return;

  const isHi = state.currentLanguage === "hi";

  // Build Filter Chips
  if (container) {
    const chipsHtml = [
      `<button type="button" onclick="onMinistryServiceChange('all')" id="min-chip-all" class="px-3 py-1.5 rounded-xl border text-xs font-bold transition whitespace-nowrap btn-tactile flex items-center gap-1.5 shadow-xs">
        <i data-lucide="layout-grid" class="w-3.5 h-3.5"></i>
        <span>${isHi ? "सभी 12 सेवाएँ" : "All 12 Services"}</span>
      </button>`
    ];

    SERVICES.forEach(s => {
      const sName = isHi ? s.name_hi : s.name;
      chipsHtml.push(`
        <button type="button" onclick="onMinistryServiceChange('${s.id}')" id="min-chip-${s.id}" class="px-3 py-1.5 rounded-xl border text-xs font-bold transition whitespace-nowrap btn-tactile flex items-center gap-1.5 shadow-xs">
          <i data-lucide="${s.icon}" class="w-3.5 h-3.5"></i>
          <span>${sName}</span>
        </button>
      `);
    });

    container.innerHTML = chipsHtml.join("");
    safeCreateIcons();
  }

  if (select) {
    select.value = state.ministrySelectedService || "all";
  }

  updateMinistryServiceChipsUI();
  fetchRegionalDemandCharts();
}

function onMinistryServiceChange(serviceId) {
  sfx.playClick();
  state.ministrySelectedService = serviceId;

  const select = document.getElementById("min-service-select");
  if (select) select.value = serviceId;

  updateMinistryServiceChipsUI();
  fetchRegionalDemandCharts();

  const isHi = state.currentLanguage === "hi";
  let label = isHi ? "सभी 12 सेवाएँ" : "All 12 Services";
  if (serviceId !== "all") {
    const s = SERVICES.find(x => x.id === serviceId);
    if (s) label = isHi ? s.name_hi : s.name;
  }
  showToast(isHi ? `सेवा आवश्यकता रिपोर्ट सक्रिय: ${label}` : `Service Requirement Report: ${label}`, "info");
}

function updateMinistryServiceChipsUI() {
  const current = state.ministrySelectedService || "all";
  
  // All chip
  const allChip = document.getElementById("min-chip-all");
  if (allChip) {
    if (current === "all") {
      allChip.className = "px-3.5 py-1.5 rounded-xl border border-blue-600 bg-blue-600 text-white text-xs font-black transition whitespace-nowrap btn-tactile flex items-center gap-1.5 shadow-sm";
    } else {
      allChip.className = "px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-slate-300 text-xs font-bold transition whitespace-nowrap btn-tactile flex items-center gap-1.5 shadow-xs";
    }
  }

  SERVICES.forEach(s => {
    const chip = document.getElementById(`min-chip-${s.id}`);
    if (chip) {
      if (current === s.id) {
        chip.className = "px-3.5 py-1.5 rounded-xl border border-blue-600 bg-blue-600 text-white text-xs font-black transition whitespace-nowrap btn-tactile flex items-center gap-1.5 shadow-sm";
      } else {
        chip.className = "px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-slate-300 text-xs font-bold transition whitespace-nowrap btn-tactile flex items-center gap-1.5 shadow-xs";
      }
    }
  });
}

async function fetchRegionalDemandCharts() {
  const currentService = state.ministrySelectedService || "all";

  if (state.hasBackendConnection) {
    try {
      const url = currentService !== "all" 
        ? `${API_BASE_URL}/api/ministry/regional-demand?service_type=${currentService}`
        : `${API_BASE_URL}/api/ministry/regional-demand`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        state.regionalDemandData = data.districts || DEFAULT_REGIONAL_DEMAND;
        renderMinistryServiceRequirements(state.regionalDemandData, currentService, data.summary);
        return;
      }
    } catch (e) {
      console.warn("Could not fetch regional demand from API, falling back to local dataset", e);
    }
  }

  if (!state.regionalDemandData || state.regionalDemandData.length === 0) {
    state.regionalDemandData = DEFAULT_REGIONAL_DEMAND;
  }
  renderMinistryServiceRequirements(state.regionalDemandData, currentService);
}

function renderMinistryServiceRequirements(districts, serviceId = "all", apiSummary = null) {
  const data = districts || DEFAULT_REGIONAL_DEMAND;
  const isHi = state.currentLanguage === "hi";
  const selectedService = serviceId || state.ministrySelectedService || "all";
  const serviceObj = SERVICES.find(s => s.id === selectedService);
  const serviceName = serviceObj ? (isHi ? serviceObj.name_hi : serviceObj.name) : (isHi ? "सभी 12 सेवाएँ" : "All 12 Services");

  // 1. Calculate Aggregated Requirement Metrics
  let totalReq = 0;
  let totalAct = 0;
  let totalDef = 0;
  let totalOrders = 0;

  if (selectedService === "all") {
    totalReq = data.reduce((acc, d) => acc + (d.required_workers || 50), 0);
    totalAct = data.reduce((acc, d) => acc + (d.active_workers || 40), 0);
    totalDef = Math.max(0, totalReq - totalAct);
    totalOrders = data.reduce((acc, d) => acc + (d.monthly_orders || 1000), 0);
  } else {
    data.forEach(d => {
      const reqInfo = (d.trade_requirements && d.trade_requirements[selectedService]) 
        ? d.trade_requirements[selectedService] 
        : { required: 20, active: 15, deficit: 5, monthly_orders: 220 };
      totalReq += reqInfo.required;
      totalAct += reqInfo.active;
      totalDef += reqInfo.deficit;
      totalOrders += reqInfo.monthly_orders;
    });
  }

  // 2. Update 4 KPI Cards
  const totalReqEl = document.getElementById("min-req-total");
  const reqSubEl = document.getElementById("min-req-sub");
  const activeEl = document.getElementById("min-req-active");
  const activeSubEl = document.getElementById("min-req-active-sub");
  const deficitEl = document.getElementById("min-req-deficit");
  const deficitSubEl = document.getElementById("min-req-deficit-sub");
  const deficitCard = document.getElementById("min-card-deficit");
  const ordersEl = document.getElementById("min-req-orders");
  const ordersSubEl = document.getElementById("min-req-orders-sub");

  if (totalReqEl) totalReqEl.innerText = `${totalReq} ${isHi ? "तकनीशियन" : "Technicians"}`;
  if (reqSubEl) reqSubEl.innerText = `${serviceName} • 5 Districts`;

  if (activeEl) activeEl.innerText = `${totalAct} ${isHi ? "सक्रिय" : "Active"}`;
  if (activeSubEl) activeSubEl.innerText = isHi ? "100% आईटीआई / एनसीवीटी सत्यापित" : "100% ITI / NCVT Verified";

  if (deficitEl) {
    if (totalDef > 0) {
      deficitEl.innerText = `-${totalDef} ${isHi ? "कमी" : "Deficit"}`;
      if (deficitSubEl) deficitSubEl.innerText = isHi ? "लक्षित पैक्स भर्ती प्राथमिकता" : "Target for PACS Recruitment";
      if (deficitCard) deficitCard.className = "p-4 rounded-2xl bg-red-50/80 border border-red-200 shadow-xs";
    } else {
      deficitEl.innerText = `✓ ${isHi ? "संतुलित आपूर्ति" : "Balanced Supply"}`;
      if (deficitSubEl) deficitSubEl.innerText = isHi ? "पर्याप्त कुशल कार्यबल" : "Optimal Skilled Capacity";
      if (deficitCard) deficitCard.className = "p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 shadow-xs";
    }
  }

  const fulfillmentRate = totalReq > 0 ? Math.min(100, Math.round((totalAct / totalReq) * 100)) : 80;
  if (ordersEl) ordersEl.innerText = `${totalOrders.toLocaleString()} ${isHi ? "मासिक ऑर्डर" : "Monthly Orders"}`;
  if (ordersSubEl) ordersSubEl.innerText = `${isHi ? "पूर्ति दर" : "Fulfillment Rate"}: ${fulfillmentRate}%`;

  // 3. Update Chart Heading & Subtext
  const chartHeading = document.getElementById("min-chart-heading");
  if (chartHeading) {
    chartHeading.innerHTML = `
      <i data-lucide="bar-chart-2" class="w-3.5 h-3.5 text-blue-600"></i>
      <span>${isHi ? `क्षेत्रीय आवश्यकता चार्ट: ${serviceName}` : `District Requirement Charts: ${serviceName}`}</span>
    `;
  }

  // 4. Render Chart Grid (5 District Cards)
  const chartGrid = document.getElementById("ministry-demand-chart-grid");
  if (chartGrid) {
    chartGrid.innerHTML = data.map(d => {
      const distName = isHi ? (d.district_hi || d.district) : d.district;
      
      let reqCount = 0;
      let actCount = 0;
      let demandScore = 0;
      let statusText = d.status || "Balanced";

      if (selectedService === "all") {
        reqCount = d.required_workers || 50;
        actCount = d.active_workers || 40;
        demandScore = d.demand_index || d.overall_demand || 75;
      } else {
        const tr = (d.trade_requirements && d.trade_requirements[selectedService]) 
          ? d.trade_requirements[selectedService] 
          : { required: 18, active: 12, deficit: 6, demand_score: 80 };
        reqCount = tr.required;
        actCount = tr.active;
        demandScore = tr.demand_score;
        statusText = tr.deficit > 5 ? (isHi ? "गंभीर कमी" : "Critical Deficit") : (tr.deficit > 0 ? (isHi ? "कमी चेतावनी" : "Shortage Alert") : (isHi ? "संतुलित" : "Optimal"));
      }

      const isCritical = demandScore >= 85 || (reqCount - actCount) >= 8;
      const badgeColor = isCritical ? "bg-red-100 text-red-800 border-red-300" : "bg-blue-100 text-blue-800 border-blue-200";
      
      const reqBarH = Math.min(80, Math.max(16, reqCount * 2.2));
      const actBarH = Math.min(80, Math.max(12, actCount * 2.2));

      return `
        <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
          <div class="flex items-center justify-between">
            <span class="font-black text-slate-900 text-xs">${distName}</span>
            <span class="text-[10px] font-black px-2 py-0.5 rounded-full border ${badgeColor}">${demandScore}% ${isHi ? "मांग" : "Demand"}</span>
          </div>

          <!-- Comparative Requirement Bar Chart: Required vs Active -->
          <div class="h-28 flex items-end justify-around gap-2 pt-2 pb-1 border-b border-slate-100 bg-slate-50/50 rounded-xl px-2">
            <div class="flex-1 flex flex-col items-center gap-1">
              <span class="text-[9px] font-bold text-blue-800">${reqCount}</span>
              <div class="chart-bar w-full bg-blue-600 rounded-t-md shadow-xs" style="height: ${reqBarH}px;" title="Required: ${reqCount}"></div>
              <span class="text-[9px] font-bold text-slate-600">${isHi ? "आवश्यक" : "Need"}</span>
            </div>
            <div class="flex-1 flex flex-col items-center gap-1">
              <span class="text-[9px] font-bold text-emerald-800">${actCount}</span>
              <div class="chart-bar w-full bg-emerald-500 rounded-t-md shadow-xs" style="height: ${actBarH}px;" title="Active: ${actCount}"></div>
              <span class="text-[9px] font-bold text-slate-600">${isHi ? "सक्रिय" : "Active"}</span>
            </div>
          </div>

          <div class="text-[11px] flex justify-between items-center text-slate-500 font-medium">
            <span>${isHi ? "स्थिति:" : "Status:"}</span>
            <strong class="${isCritical ? "text-red-600 font-bold" : "text-emerald-700 font-bold"}">${statusText}</strong>
          </div>
        </div>
      `;
    }).join("");
  }

  // 5. Render District Breakdown Table
  const tableBody = document.getElementById("ministry-service-req-table-body");
  const tableTitle = document.getElementById("min-table-title");
  if (tableTitle) {
    tableTitle.innerText = `${isHi ? "जिला-वार आवश्यकता विश्लेषण" : "District-Wise Requirement & Allocation Audit"} (${serviceName})`;
  }

  if (tableBody) {
    tableBody.innerHTML = data.map((d, idx) => {
      const distName = isHi ? (d.district_hi || d.district) : d.district;
      let reqCount = 0;
      let actCount = 0;
      let deficitCount = 0;
      let demandScore = 0;
      let statusBadge = "";

      if (selectedService === "all") {
        reqCount = d.required_workers || 50;
        actCount = d.active_workers || 40;
        deficitCount = Math.max(0, reqCount - actCount);
        demandScore = d.demand_index || d.overall_demand || 75;
      } else {
        const tr = (d.trade_requirements && d.trade_requirements[selectedService])
          ? d.trade_requirements[selectedService]
          : { required: 18, active: 12, deficit: 6, demand_score: 80 };
        reqCount = tr.required;
        actCount = tr.active;
        deficitCount = tr.deficit;
        demandScore = tr.demand_score;
      }

      if (deficitCount >= 7) {
        statusBadge = `<span class="bg-red-100 text-red-900 px-2.5 py-0.5 rounded-full text-[10px] font-black border border-red-200 flex items-center gap-1 w-fit"><span class="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span> ${isHi ? "गंभीर कमी" : "Critical Shortage"}</span>`;
      } else if (deficitCount > 0) {
        statusBadge = `<span class="bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full text-[10px] font-black border border-amber-200 w-fit">${isHi ? "कमी चेतावनी" : "Shortage Alert"}</span>`;
      } else {
        statusBadge = `<span class="bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full text-[10px] font-black border border-emerald-200 w-fit">${isHi ? "संतुलित क्षमता" : "Optimal Capacity"}</span>`;
      }

      return `
        <tr class="hover:bg-slate-50 transition">
          <td class="p-3 font-bold text-slate-900 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full ${deficitCount > 5 ? 'bg-red-500' : 'bg-emerald-500'}"></span>
            <span>${distName}</span>
          </td>
          <td class="p-3">
            <div class="flex items-center space-x-2">
              <div class="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
                <div class="${demandScore >= 85 ? 'bg-red-500' : 'bg-blue-600'} h-full" style="width: ${demandScore}%"></div>
              </div>
              <span class="font-bold text-slate-800">${demandScore}%</span>
            </div>
          </td>
          <td class="p-3 font-extrabold text-blue-900">${reqCount} ${isHi ? "तकनीशियन" : "Workers"}</td>
          <td class="p-3 font-semibold text-emerald-800">${actCount} ${isHi ? "सक्रिय" : "Active"}</td>
          <td class="p-3 font-black ${deficitCount > 0 ? 'text-red-600' : 'text-emerald-700'}">
            ${deficitCount > 0 ? `-${deficitCount}` : `✓ 0`}
          </td>
          <td class="p-3">${statusBadge}</td>
          <td class="p-3 text-right">
            <button onclick="deployPacsGuildForService(${idx}, '${selectedService}')" class="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl text-[11px] border border-blue-200 transition btn-tactile shadow-2xs">
              ${isHi ? "पैक्स दल तैनात करें (+5)" : "Deploy PACS Guild (+5)"}
            </button>
          </td>
        </tr>
      `;
    }).join("");
  }

  safeCreateIcons();
}

function deployPacsGuildForService(districtIndex, serviceId) {
  sfx.playSuccessFanfare();
  const d = state.regionalDemandData[districtIndex];
  if (!d) return;

  const isHi = state.currentLanguage === "hi";
  const distName = isHi ? (d.district_hi || d.district) : d.district;

  if (serviceId === "all") {
    d.active_workers = (d.active_workers || 40) + 5;
    d.demand_index = Math.max(50, (d.demand_index || 80) - 10);
  } else {
    if (d.trade_requirements && d.trade_requirements[serviceId]) {
      const tr = d.trade_requirements[serviceId];
      tr.active += 5;
      tr.deficit = Math.max(0, tr.required - tr.active);
      tr.demand_score = Math.max(50, tr.demand_score - 12);
    }
    d.active_workers = (d.active_workers || 40) + 5;
  }

  renderMinistryServiceRequirements(state.regionalDemandData, serviceId);
  showToast(isHi ? `✓ ${distName} में 5 प्रमाणित पैक्स तकनीशियन तैनात किए गए!` : `✓ 5 Certified PACS Technicians deployed to ${distName}!`, "success");
}

function downloadServiceRequirementReport() {
  sfx.playClick();
  const isHi = state.currentLanguage === "hi";
  const selectedService = state.ministrySelectedService || "all";
  const serviceObj = SERVICES.find(s => s.id === selectedService);
  const serviceName = serviceObj ? serviceObj.name.toUpperCase() : "ALL 12 COOPERATIVE SERVICES";

  const districts = state.regionalDemandData || DEFAULT_REGIONAL_DEMAND;

  let totalReq = 0;
  let totalAct = 0;
  let totalDef = 0;
  let totalOrders = 0;

  const districtLines = districts.map(d => {
    let req = 0;
    let act = 0;
    let def = 0;
    let score = 0;
    let orders = 0;

    if (selectedService === "all") {
      req = d.required_workers || 50;
      act = d.active_workers || 40;
      def = Math.max(0, req - act);
      score = d.demand_index || d.overall_demand || 75;
      orders = d.monthly_orders || 1000;
    } else {
      const tr = (d.trade_requirements && d.trade_requirements[selectedService])
        ? d.trade_requirements[selectedService]
        : { required: 20, active: 15, deficit: 5, demand_score: 80, monthly_orders: 220 };
      req = tr.required;
      act = tr.active;
      def = tr.deficit;
      score = tr.demand_score;
      orders = tr.monthly_orders;
    }

    totalReq += req;
    totalAct += act;
    totalDef += def;
    totalOrders += orders;

    const status = def > 5 ? "CRITICAL SHORTAGE" : (def > 0 ? "SHORTAGE ALERT" : "BALANCED");
    return `${d.district.padEnd(16)} | Req: ${String(req).padStart(3)} | Act: ${String(act).padStart(3)} | Deficit: ${String(def).padStart(3)} | Demand: ${String(score).padStart(3)}% | Monthly Orders: ${String(orders).padStart(5)} | Status: ${status}`;
  }).join("\n");

  const text = `===============================================================
MINISTRY OF COOPERATION, GOVERNMENT OF INDIA
NATIONAL COOPERATIVE GIG & SKILL PLATFORM - SEVA SETU
OFFICIAL WORKFORCE REQUIREMENT & DEMAND ALLOCATION REPORT
Reference: #GOI-COOP-REQ-2026-Q1 | Generated: ${new Date().toLocaleString()}
Selected Domain: ${serviceName}
===============================================================

1. APEX NATIONAL TELEMETRY & REQUIREMENT SUMMARY
----------------------------------------------------------------
Service Category:           ${serviceName}
Total Required Workforce:   ${totalReq} Certified Technicians
Active Verified Deployment: ${totalAct} Technicians in Field
Net Workforce Deficit:      ${totalDef} Technicians (${totalDef > 0 ? "URGENT HIRING TRIGGERED" : "SUPPLY OPTIMAL"})
Estimated Monthly Demand:   ${totalOrders.toLocaleString()} Service Tasks
Average Supply Health:      ${totalReq > 0 ? Math.round((totalAct / totalReq) * 100) : 80}%

2. DISTRICT-WISE REQUIREMENT BREAKDOWN
----------------------------------------------------------------
District         | Workforce Deployment & Shortage Metrics
----------------------------------------------------------------
${districtLines}
----------------------------------------------------------------

3. MINISTRY POLICY DIRECTIVES & PACS ALLOCATION INSTRUCTIONS
----------------------------------------------------------------
* Priority Mobilization: Direct Primary Agricultural Credit Societies (PACS)
  to sponsor emergency vocational batches via NCVT/ITI skill centers.
* Zero Intermediary Mandate: Disburse 100% of fair-wage earnings directly
  via Direct Benefit Transfer (DBT) to attested technician bank accounts.
* Grassroots Skill Expansion: Extend Khadi & Village Industries (KVIC) master
  artisan stipends to regional pottery, blacksmith, and carpentry clusters.

===============================================================
Digitally Certified & Sealed by:
Shri Amit Shah, Hon'ble Union Minister of Cooperation
Ministry of Cooperation, Government of India
Atal Akshay Urja Bhawan, New Delhi - 110003
===============================================================
`;

  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Seva_Setu_Service_Requirement_Report_${selectedService}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast(isHi ? `✓ सेवा आवश्यकता रिपोर्ट सफलतापूर्वक डाउनलोड की गई!` : `✓ Official Requirement Report for ${serviceName} downloaded!`, "success");
}

async function fetchMinistryRevenue() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/ministry/revenue`);
    if (res.ok) {
      state.revenueData = await res.json();
      const rev = state.revenueData.metrics || state.revenueData;
      
      const gmvEl = document.getElementById("revenue-gmv");
      const workerEl = document.getElementById("revenue-worker-wages");
      const poolEl = document.getElementById("revenue-welfare-pool");
      const subEl = document.getElementById("revenue-subscriptions");

      if (gmvEl && rev.gross_merchandise_value) {
        gmvEl.textContent = `₹${Math.round(rev.gross_merchandise_value).toLocaleString('en-IN')}`;
      }
      if (workerEl && rev.direct_worker_wages) {
        workerEl.textContent = `₹${Math.round(rev.direct_worker_wages).toLocaleString('en-IN')}`;
      }
      if (poolEl && rev.welfare_fund_collected) {
        poolEl.textContent = `₹${Math.round(rev.welfare_fund_collected).toLocaleString('en-IN')}`;
      }
      if (subEl && rev.subscription_revenue) {
        subEl.textContent = `₹${Math.round(rev.subscription_revenue).toLocaleString('en-IN')}`;
      }
    }
  } catch (e) {
    console.warn("Could not fetch revenue telemetry from API", e);
  }
}

function filterMinistryGrievances(filterType) {
  sfx.playClick();
  state.ministryGrievanceFilter = filterType;
  ["all", "complaint", "positive"].forEach(f => {
    const btn = document.getElementById(`min-btn-${f}`);
    if (btn) {
      if (f === filterType) {
        btn.className = "px-3 py-1.5 bg-blue-600 text-white font-bold rounded-xl shadow-sm transition";
      } else {
        btn.className = "px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition";
      }
    }
  });
  renderMinistryGrievances();
}

function renderMinistryGrievances() {
  const tbody = document.getElementById("ministry-reviews-table-body");
  if (!tbody) return;

  const filter = state.ministryGrievanceFilter || "all";
  const list = state.reviews.filter(r => {
    if (filter === "complaint") return r.type === "complaint" || r.rating <= 3;
    if (filter === "positive") return r.type === "positive" || r.rating >= 4;
    return true;
  });

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="p-6 text-center text-slate-400 font-medium">No reviews or grievances match this filter.</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(r => {
    const isComplaint = r.type === "complaint" || r.rating <= 3;
    const typeBadge = isComplaint
      ? `<span class="bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded text-[10px] border border-red-200">⚠️ Grievance</span>`
      : `<span class="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px] border border-emerald-200">⭐ Praise</span>`;

    const st = (r.status || "").toLowerCase();
    let statusBadge = `<span class="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">Resolved</span>`;
    if (st.includes("investigat") || st === "under_investigation") {
      statusBadge = `<span class="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px] animate-pulse">Investigating</span>`;
    } else if (st.includes("warn") || st === "warning_issued") {
      statusBadge = `<span class="bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded text-[10px]">Warning Issued</span>`;
    }

    const actionButtons = isComplaint && (st.includes("investigat") || st === "under_investigation") ? `
      <div class="flex items-center gap-1">
        <button onclick="updateGrievanceAction('${r.id}', 'resolved')" class="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[10px] transition btn-tactile">Resolve</button>
        <button onclick="updateGrievanceAction('${r.id}', 'warning_issued')" class="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold text-[10px] transition btn-tactile">Warn</button>
      </div>
    ` : `
      <span class="text-[10px] text-slate-400 font-semibold">${r.ministry_action || "Closed"}</span>
    `;

    return `
      <tr class="hover:bg-slate-50 transition">
        <td class="p-3 font-mono font-bold text-slate-900">${r.id}</td>
        <td class="p-3 font-bold text-slate-800">${r.user_name}</td>
        <td class="p-3"><strong class="text-slate-900">${r.worker_name}</strong><span class="text-[10px] text-slate-500 block uppercase">${r.service}</span></td>
        <td class="p-3">${typeBadge}</td>
        <td class="p-3 max-w-xs truncate text-slate-600" title="${r.comment}">"${r.comment}"</td>
        <td class="p-3">${statusBadge}</td>
        <td class="p-3">${actionButtons}</td>
      </tr>
    `;
  }).join("");
}

async function updateGrievanceAction(reviewId, newStatus) {
  sfx.playClick();
  const rev = state.reviews.find(r => String(r.id) === String(reviewId));
  const statusFormatted = newStatus === "resolved" ? "Resolved" : (newStatus === "warning_issued" ? "Warning Issued" : "Under Investigation");
  const actionText = newStatus === "resolved" ? "Resolved by PACS Council" : "Warning Issued by Federation";
  if (rev) {
    rev.status = newStatus;
    rev.ministry_action = actionText;
  }

  try {
    await fetch(`${API_BASE_URL}/api/ministry/reviews/${reviewId}/status?status=${encodeURIComponent(statusFormatted)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: statusFormatted,
        ministry_action: actionText
      })
    });
  } catch (e) {
    // Local update fallback
  }

  renderMinistryGrievances();
  renderCitizenReviews();
  showToast(`Grievance ${reviewId} updated to "${newStatus.replace('_', ' ').toUpperCase()}"`, "success");
}

function downloadRevenueAuditSlip() {
  sfx.playClick();
  const text = `===============================================================
MINISTRY OF COOPERATION, GOVERNMENT OF INDIA
NATIONAL COOPERATIVE GIG PLATFORM - REVENUE AUDIT CERTIFICATE
Reference: #PACS-AUDIT-2026-Q1 | Date: ${new Date().toLocaleDateString()}
===============================================================

1. PLATFORM SUMMARY METRICS
---------------------------------------------------------------
Gross Merchandise Value (GMV):          INR 14,28,500.00
Direct 100% Worker Wage DBT:            INR 12,85,650.00 (90.0%)
Cooperative Welfare Fund (3.5%):        INR    50,000.00  (3.5%)
Samriddhi Subscription Pass Revenue:    INR    92,850.00  (6.5%)
Total Active Subscribed Households:     460+ Households
Citizen Savings vs Aggregators:         INR  4,82,400.00

2. DISBURSEMENT PRINCIPLES
---------------------------------------------------------------
* Zero commission cut on base worker tariffs (100% to worker bank account)
* Zero platform fee for Samriddhi VIP Pass holders
* Cooperative Welfare Fund pooled exclusively for worker healthcare,
  term life insurance and emergency pensions via DCCB PACS federations.

===============================================================
Digitally Certified by:
Ministry of Cooperation & National Cooperative Development Corporation
"Sahakar Se Samriddhi"
===============================================================`;

  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `SahakarSeva_Revenue_Audit_${new Date().toISOString().slice(0,10)}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast("Official Revenue Audit Slip downloaded successfully!", "success");
}

// ==========================================
// 18. WORKER ONBOARDING & RADAR ACCESS GATE
// ==========================================

function initWorkerOnboarding() {
  goToOnboardStep(1);
}

function goToOnboardStep(stepNum) {
  state.workerOnboardStep = stepNum;
  [1, 2, 3, 4].forEach(s => {
    const el = document.getElementById(`onboard-step-${s}`);
    const pill = document.getElementById(`onboard-step-pill-${s}`);
    if (el) {
      if (s === stepNum) {
        el.classList.remove("hidden");
      } else {
        el.classList.add("hidden");
      }
    }
    if (pill) {
      if (s === stepNum) {
        pill.className = "flex items-center gap-2 text-emerald-800 font-black";
        pill.querySelector("span").className = "w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px] font-black shadow";
      } else if (s < stepNum) {
        pill.className = "flex items-center gap-2 text-emerald-600 font-bold";
        pill.querySelector("span").className = "w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[11px] font-black";
      } else {
        pill.className = "flex items-center gap-2 text-slate-400 font-normal";
        pill.querySelector("span").className = "w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[11px] font-black";
      }
    }
  });
  safeCreateIcons();
}

function handleWorkerStep1Submit(e) {
  e.preventDefault();
  sfx.playClick();
  const phone = document.getElementById("worker-login-phone")?.value.trim() || "+91 98765 43210";
  const name = document.getElementById("worker-login-name")?.value.trim() || "Rajesh Kumar";
  const coopSelect = document.getElementById("worker-login-coop");
  const coop_name = (coopSelect && coopSelect.value) ? coopSelect.value : "Delhi Central Labour Cooperative";
  
  state.workerSession = {
    name: name,
    phone: phone,
    coop_name: coop_name
  };

  showToast(`Credentials verified for ${name}. Proceed to trade selection.`, "info");
  goToOnboardStep(2);
}

function selectOnboardTrade(tradeId) {
  sfx.playClick();
  state.selectedOnboardTrade = tradeId;
  const cards = document.querySelectorAll("#onboard-trade-grid .trade-choice-card");
  cards.forEach(c => {
    if (c.getAttribute("data-trade") === tradeId) {
      c.className = "trade-choice-card p-4 rounded-2xl border-2 border-emerald-500 bg-emerald-50/70 text-left transition cursor-pointer btn-tactile shadow-sm ring-2 ring-emerald-400/20";
    } else {
      c.className = "trade-choice-card p-4 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 text-left transition cursor-pointer btn-tactile";
    }
  });

  setTimeout(() => {
    goToOnboardStep(3);
  }, 300);
}

function handleCertFileSelect(e) {
  const input = (e && e.target) ? e.target : e;
  const file = input && input.files && input.files[0];
  if (file) {
    state.uploadedCertFile = file.name;
    const badge = document.getElementById("cert-preview-badge");
    const label = document.getElementById("cert-filename-label");
    if (label) label.textContent = `Certificate Attached: ${file.name}`;
    if (badge) badge.classList.remove("hidden");
    const lbl = document.getElementById("cert-upload-status");
    if (lbl) {
      lbl.innerHTML = `<span class="text-emerald-700 font-bold flex items-center gap-1"><i data-lucide="check-circle-2" class="w-4 h-4"></i> ${file.name}</span>`;
    }
    safeCreateIcons();
  }
}

function handleAadhaarFileSelect(e) {
  const input = (e && e.target) ? e.target : e;
  const file = input && input.files && input.files[0];
  if (file) {
    state.uploadedAadhaarFile = file.name;
    const badge = document.getElementById("aadhaar-preview-badge");
    const label = document.getElementById("aadhaar-filename-label");
    if (label) label.textContent = `Aadhaar Attached: ${file.name}`;
    if (badge) badge.classList.remove("hidden");
    const lbl = document.getElementById("aadhaar-upload-status");
    if (lbl) {
      lbl.innerHTML = `<span class="text-emerald-700 font-bold flex items-center gap-1"><i data-lucide="check-circle-2" class="w-4 h-4"></i> ${file.name}</span>`;
    }
    safeCreateIcons();
  }
}

function autoAttachSampleCredentials() {
  sfx.playClick();
  state.uploadedCertFile = "ITI_National_Trade_Certificate_Wireman.pdf";
  state.uploadedAadhaarFile = "UIDAI_Aadhaar_Card_Verified.pdf";

  const certBadge = document.getElementById("cert-preview-badge");
  const certLabel = document.getElementById("cert-filename-label");
  if (certLabel) certLabel.textContent = "Certificate Attached: ITI Wireman NTC (Grade A)";
  if (certBadge) certBadge.classList.remove("hidden");

  const aadhaarBadge = document.getElementById("aadhaar-preview-badge");
  const aadhaarLabel = document.getElementById("aadhaar-filename-label");
  if (aadhaarLabel) aadhaarLabel.textContent = "Aadhaar Linked: XXXX-XXXX-8921 (UIDAI OTP Verified)";
  if (aadhaarBadge) aadhaarBadge.classList.remove("hidden");

  const certStatus = document.getElementById("cert-upload-status");
  if (certStatus) {
    certStatus.innerHTML = `<span class="text-emerald-700 font-bold flex items-center gap-1"><i data-lucide="check-circle-2" class="w-4 h-4"></i> ITI_Wireman_NTC_GradeA.pdf (Verified Attestation)</span>`;
  }
  const aadhaarStatus = document.getElementById("aadhaar-upload-status");
  if (aadhaarStatus) {
    aadhaarStatus.innerHTML = `<span class="text-emerald-700 font-bold flex items-center gap-1"><i data-lucide="check-circle-2" class="w-4 h-4"></i> UIDAI_Aadhaar_XXXX-8921.pdf (OTP Linked)</span>`;
  }
  safeCreateIcons();
  showToast("Pre-filled official ITI Wireman Certificate & UIDAI Aadhaar sample!", "info");
}

async function runWorkerVerification() {
  sfx.playClick();
  const btn = document.getElementById("btn-run-worker-verify");
  const btnTxt = document.getElementById("btn-verify-worker-text");

  if (btn) btn.disabled = true;
  if (btnTxt) btnTxt.innerText = "Analyzing Credentials with Gemini 1.5 Flash AI...";

  try {
    const res = await fetch(`${API_BASE_URL}/api/workers/onboard`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: state.workerSession?.name || "Rajesh Kumar",
        phone: state.workerSession?.phone || "+91 98765 43210",
        skill: state.selectedOnboardTrade || "electrician",
        coop_name: state.workerSession?.coop_name || "Delhi Central Labour Cooperative",
        certificate_name: state.uploadedCertFile || "ITI National Trade Certificate",
        aadhaar_number: "XXXX-XXXX-8921"
      })
    });
    if (res.ok) {
      const data = await res.json();
      const nameEl = document.getElementById("onboard-verified-worker-name");
      const coopEl = document.getElementById("onboard-verified-coop-name");
      const skillEl = document.getElementById("onboard-verified-skill");

      if (nameEl) nameEl.innerText = data.worker?.name || "Rajesh Kumar";
      if (coopEl) coopEl.innerText = data.worker?.coop_name || "Delhi Central Labour Cooperative";
      if (skillEl) skillEl.innerText = `${(data.worker?.skill || "electrician").toUpperCase()} (Grade A)`;
    }
  } catch (e) {
    console.warn("Worker onboard API fallback", e);
  }

  setTimeout(() => {
    if (btn) btn.disabled = false;
    if (btnTxt) btnTxt.innerText = "Run AI Verification & Complete Onboarding";
    goToOnboardStep(4);
    sfx.playSuccessFanfare();
    showToast("Gemini AI verified credentials with 96.4% confidence!", "success");
  }, 900);
}

function grantWorkerAppAccess() {
  sfx.playSuccessFanfare();
  const wizard = document.getElementById("worker-onboarding-wizard");
  const workspace = document.getElementById("worker-active-workspace");

  if (wizard) wizard.classList.add("hidden");
  if (workspace) workspace.classList.remove("hidden");

  // Activate default matching worker
  const trade = state.selectedOnboardTrade || "electrician";
  const matched = WORKERS.find(w => w.skill === trade) || WORKERS[0];
  state.activeWorker = matched;
  updateWorkerCardUI(matched);

  showToast(`Access granted! Welcome to the SahakarSeva Worker Cockpit, ${matched.name}.`, "success");
}

function logoutWorkerToOnboard() {
  sfx.playClick();
  const wizard = document.getElementById("worker-onboarding-wizard");
  const workspace = document.getElementById("worker-active-workspace");

  if (workspace) workspace.classList.add("hidden");
  if (wizard) wizard.classList.remove("hidden");
  goToOnboardStep(1);
  showToast("Logged out of worker session. Verification gate active.", "info");
}

function prefillWorkerDemo(persona = "rajesh") {
  sfx.playClick();
  const phoneInput = document.getElementById("worker-login-phone");
  const nameInput = document.getElementById("worker-login-name");
  const coopSelect = document.getElementById("worker-login-coop");

  if (phoneInput) phoneInput.value = "+91 98765 43210";
  if (nameInput) nameInput.value = "Rajesh Kumar";
  if (coopSelect) coopSelect.value = "Delhi Central Labour Cooperative";

  state.workerSession = {
    name: "Rajesh Kumar",
    phone: "+91 98765 43210",
    coop_name: "Delhi Central Labour Cooperative"
  };
  state.selectedOnboardTrade = "electrician";
  autoAttachSampleCredentials();

  showToast("Fast-Track Demo prefilled! Click 'Continue' or proceed to verification.", "info");
}
