# SahakarSeva (सहकार सेवा) - SIH Hackathon Prototype
### Decentralized Cooperative Gig Platform with Fair-Wage Transparency & Verified Credentials
**In collaboration with the Ministry of Cooperation | "Sahakar Se Samriddhi"**

---

## 🌟 Overview
SahakarSeva bridges customers seeking reliable home & emergency services with verified gig workers certified by cooperative federations (e.g., PACS, Labour Cooperatives). 

### Key Capabilities
1. **Customer Portal**:
   - Voice & Text search with multi-lingual support.
   - Flexible pricing plans: **Hourly**, **Daily**, **Weekly**, and **Monthly Subscription** (15% discount).
   - **Emergency / Premium Triage** toggle for urgent response (elder healthcare, burst pipes, short circuits).
   - **100% Transparent Bill**: Explicit itemization of labor, toolkit, tax, transit, and a nominal 3.5% cooperative welfare platform fee.
   - **Dual OTP Verification**: `START_OTP` upon worker arrival and `END_OTP` + proof of work upon completion.

2. **Worker Portal (Rapido-Style Dispatch)**:
   - Real-time job broadcast radar within proximity radius.
   - Accept / Reject workflow with **automated fallback reassignment** to the next nearest worker if a job is cancelled.
   - Direct digital passbook showing 100% guaranteed take-home wage.
   - Credential vault (Aadhaar & ITI/NSDC trade certificate upload).

3. **Ministry of Cooperation & Federation Dashboard**:
   - Real-time analytics: Total active cooperatives, verified workers, cumulative earnings disbursed, and citizen savings.
   - District-level demand heatmaps for targeted cooperative vocational training.
   - Verification desk: AI-assisted Aadhaar and trade certificate verification.
   - Community & NGO subsidy monitoring.

---

## 📁 Repository Structure
```
DEMO AI PROJECT/
├── backend/
│   ├── main.py              # FastAPI application & REST endpoints
│   ├── pricing.py          # Transparent fair-wage calculation engine
│   ├── dispatch.py         # Proximity query & fallback state machine
│   ├── ai_ocr.py           # Gemini 1.5 Flash certificate & Aadhaar verification
│   ├── seed_data.py        # 20+ realistic geo-located workers and bookings
│   └── requirements.txt    # Python backend dependencies
├── frontend/
│   ├── index.html          # Unified multi-portal interactive prototype
│   ├── app.js              # State management, voice recognition, and API client
│   └── style.css           # Modern Tailwind-inspired responsive styling
└── README.md
```

---

## 🚀 Quickstart Guide

### 1. Backend Setup (FastAPI)
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
Swagger API documentation will be available live at: `http://localhost:8000/docs`

### 2. Frontend Setup
Open `frontend/index.html` directly in any web browser or serve via any static server (e.g., Live Server or `python -m http.server 3000`).
