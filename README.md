# Seva Setu (सेवा सेतु)
### Decentralized Cooperative Gig Platform with Fair-Wage Transparency & Verified Credentials
**In collaboration with the Ministry of Cooperation | "Seva Se Samriddhi" (सेवा से समृद्धि)**

---

## 🌟 Overview
**Seva Setu (सेवा सेतु)** connects citizens seeking reliable home, repair, and artisan services with certified gig technicians and craftspeople organized under Primary Agricultural Credit Societies (PACS) and District Cooperative Labour Federations. Operating under the national guiding vision **"Seva Se Samriddhi"**, Seva Setu eliminates exploitative private middleman markups by ensuring 100% direct fair wages to workers with complete itemized billing transparency.

### Key Capabilities

1. **Citizen Portal**:
   - **Essential Services & Artisan Trades**: Electrician, Plumber, Deep Cleaning, Emergency Driver, Carpentry & Woodcraft, and Tailoring & Handloom Repair.
   - **Streamlined Subscription Tiers**:
     - **Monthly Pass (₹199/mo)**: 20% flat discount, zero platform welfare cess (3.5% saved), unlimited priority emergency triage (<15 min), and monthly household safety audits.
     - **Yearly Pass (₹1,999/yr)**: **Includes ALL Monthly Pass Benefits** + enhanced 30% flat discount across all tasks & artisan crafts, 4-member family emergency coverage, dedicated PACS concierge desk, and ₹500 seasonal festival artisan vouchers.
   - **Transparent Direct Wage Bill**: Clear itemization of labor, toolkit, transit, tax, and cooperative welfare cess—with zero hidden aggregator markups.
   - **Dual-OTP Verification Desk**: Cryptographic `START_OTP` upon arrival and `END_OTP` with photographic proof upon job completion.
   - **National BharatPay Cooperative Gateway**: Instant settlement via UPI QR, BHIM, DCCB/PACS direct bank transfers, and zero-cash escrow.

2. **Worker Portal (Rapido-Style Radar)**:
   - Real-time job broadcast radar within dynamic proximity radius.
   - 1-click Accept / Reject workflow with **automated fallback engine** reassigning to the next nearest cooperative technician.
   - Direct digital passbook displaying 100% guaranteed take-home earnings with zero commission deductions.
   - Verified credential vault (Aadhaar & ITI / NSDC / KVIC trade certificates).

3. **Ministry of Cooperation Cockpit**:
   - Real-time national telemetry: Total registered cooperatives, verified technicians, cumulative wages directly disbursed, and citizen savings.
   - District-level demand & shortage heatmaps for targeted cooperative vocational training.
   - AI document verification desk (Gemini 1.5 Flash credential verification).
   - Citizen reviews & public grassroots accountability desk.

---

## 📁 Repository Structure
```
Seva Setu App/
├── backend/
│   ├── main.py              # FastAPI application & REST endpoints
│   ├── pricing.py          # Transparent fair-wage calculation engine
│   ├── dispatch.py         # Proximity query & fallback state machine
│   ├── ai_ocr.py           # Gemini 1.5 Flash certificate & Aadhaar verification
│   ├── seed_data.py        # 13 geo-located workers across 12 trades & bookings
│   └── requirements.txt    # Python backend dependencies
├── frontend/
│   ├── index.html          # Unified multi-portal interactive application
│   ├── app.js              # State management, sound effects, and API client
│   ├── style.css           # Modern Tailwind-inspired responsive styling
│   ├── _redirects          # Netlify SPA routing rules
│   └── _headers            # Security & caching headers
├── netlify.toml             # Netlify build configuration
├── verify_netlify_setup.js  # Automated deployment verification script
└── README.md
```

---

## 🚀 Quickstart Guide

### 1. Frontend (Zero Setup)
Open `frontend/index.html` directly in your browser, or deploy to Netlify in one click (see [`NETLIFY_DEPLOYMENT.md`](./NETLIFY_DEPLOYMENT.md)). The frontend includes a complete autonomous in-browser engine that runs without requiring a backend server.

### 2. Backend Setup (Optional FastAPI Server)
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
Live API documentation is available at `http://localhost:8000/docs`.
