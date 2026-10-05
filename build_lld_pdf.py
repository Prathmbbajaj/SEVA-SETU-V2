import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    """
    Two-pass canvas to dynamically compute and print total page count,
    running header bar, and running footer.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        
        # Omit running header on page 1 for clean cover feel
        if self._pageNumber > 1:
            # Running Header Top Accent Line
            self.setFillColor(colors.HexColor('#0f172a'))
            self.rect(36, 806, 523.27, 2, fill=True, stroke=False)
            
            self.setFont('Helvetica-Bold', 7.5)
            self.setFillColor(colors.HexColor('#1e3a8a'))
            self.drawString(36, 813, "SEVA SETU (सेवा सेतु) — LOW-LEVEL DESIGN (LLD) SPECIFICATION")
            
            self.setFont('Helvetica-Bold', 7)
            self.setFillColor(colors.HexColor('#d97706'))
            self.drawRightString(559.27, 813, "Ministry of Cooperation | Technical Blueprint (SIH 2026)")

        # Running Footer
        self.setStrokeColor(colors.HexColor('#cbd5e1'))
        self.setLineWidth(0.5)
        self.line(36, 36, 559.27, 36)

        # Footer Left
        self.setFont('Helvetica-Bold', 7)
        self.setFillColor(colors.HexColor('#d97706'))
        self.drawString(36, 26, "GOVERNMENT OF INDIA &bull; MINISTRY OF COOPERATION &bull; SIH 2026")

        # Footer Center
        self.setFont('Helvetica', 7)
        self.setFillColor(colors.HexColor('#64748b'))
        self.drawCentredString(297.63, 26, "Low-Level Design (LLD) — Architecture, PostGIS Schemas, State Machines & APIs")

        # Footer Right
        self.setFont('Helvetica-Bold', 7.5)
        self.setFillColor(colors.HexColor('#1e293b'))
        self.drawRightString(559.27, 26, f"Page {self._pageNumber} of {page_count}")

        self.restoreState()


def build_lld_pdf(filename="Seva_Setu_Low_Level_Design_LLD_Specification.pdf"):
    # Printable width: 595.27 - 72 = 523.27 pt
    # Printable height: 841.89 - 84 = 757.89 pt
    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        leftMargin=36,
        rightMargin=36,
        topMargin=42,
        bottomMargin=44
    )

    styles = getSampleStyleSheet()

    # Custom Color Palette
    c_navy = colors.HexColor('#0f172a')
    c_blue = colors.HexColor('#1e3a8a')
    c_blue_light = colors.HexColor('#eff6ff')
    c_amber = colors.HexColor('#d97706')
    c_amber_light = colors.HexColor('#fef3c7')
    c_emerald = colors.HexColor('#047857')
    c_emerald_light = colors.HexColor('#ecfdf5')
    c_crimson = colors.HexColor('#b91c1c')
    c_slate_dark = colors.HexColor('#1e293b')
    c_slate_mid = colors.HexColor('#475569')
    c_slate_light = colors.HexColor('#f8fafc')
    c_border = colors.HexColor('#cbd5e1')
    c_code_bg = colors.HexColor('#f1f5f9')

    # Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=19,
        leading=23,
        textColor=c_navy,
        alignment=TA_LEFT
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=c_amber,
        alignment=TA_LEFT
    )

    meta_style = ParagraphStyle(
        'DocMeta',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=c_slate_mid,
        alignment=TA_LEFT
    )

    h1_style = ParagraphStyle(
        'SecH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=c_navy,
        spaceBefore=11,
        spaceAfter=5,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'SecH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13,
        textColor=c_blue,
        spaceBefore=7,
        spaceAfter=3,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11.5,
        textColor=c_slate_dark,
        alignment=TA_JUSTIFY,
        spaceAfter=4
    )

    bullet_style = ParagraphStyle(
        'BulletText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11.5,
        textColor=c_slate_dark,
        leftIndent=10,
        firstLineIndent=-6,
        spaceAfter=2.5
    )

    code_style = ParagraphStyle(
        'CodeSnippet',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=7,
        leading=9.5,
        textColor=colors.HexColor('#0f172a')
    )

    callout_style = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11.5,
        textColor=colors.HexColor('#065f46')
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=10,
        textColor=colors.white,
        alignment=TA_CENTER
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7,
        leading=9.5,
        textColor=c_slate_dark
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7,
        leading=9.5,
        textColor=c_navy
    )

    story = []

    # ==================== COVER / TITLE BLOCK ====================
    story.append(Spacer(1, 4))
    story.append(Paragraph("SEVA SETU (सेवा सेतु) &bull; LOW-LEVEL DESIGN (LLD)", subtitle_style))
    story.append(Spacer(1, 2))
    story.append(Paragraph("Comprehensive Technical LLD Specification: PostGIS Schemas, State Machines, API Contracts & Algorithmic Engines", title_style))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>Governing Authority:</b> Ministry of Cooperation, Government of India &bull; <i>Theme: Sahakar Se Samriddhi</i><br/>"
        "<b>Architecture:</b> Asynchronous Micro-modular (FastAPI + PostGIS + Leaflet + Gemini AI) &bull; <b>Version:</b> 1.0.0 (SIH 2026 Production Specification)",
        meta_style
    ))
    story.append(Spacer(1, 6))
    story.append(HRFlowable(width="100%", thickness=1.5, color=c_blue, spaceAfter=8, spaceBefore=2))

    # ==================== EXECUTIVE OVERVIEW CALLOUT ====================
    lld_overview = (
        "<b>Low-Level Technical Blueprint:</b> This specification provides the complete engineering implementation model "
        "for the Seva Setu platform. It details the object-oriented domain models, the production PostgreSQL 16 + PostGIS spatial schema, "
        "the 10-state booking lifecycle state machine with en-route fallback, sequence diagrams for on-site material procurement and emergency SOS, "
        "the 4-layer decoupled pricing engine, and concurrency control using Redis Redlock and optimistic locking."
    )
    t_callout = Table([[Paragraph(lld_overview, callout_style)]], colWidths=[523.27])
    t_callout.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_emerald_light),
        ('BOX', (0,0), (-1,-1), 1, c_emerald),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 9),
        ('RIGHTPADDING', (0,0), (-1,-1), 9),
    ]))
    story.append(t_callout)
    story.append(Spacer(1, 8))

    # ==================== SECTION 1: ARCHITECTURE & COMPONENT TOPOLOGY ====================
    story.append(Paragraph("1. System Architecture & Modular Topology", h1_style))
    story.append(Paragraph(
        "Seva Setu is decomposed into independent functional micro-services coordinated through an asynchronous API Gateway. "
        "The architecture eliminates single points of failure and isolates high-frequency spatial GPS updates from the financial settlement ledger.",
        body_style
    ))

    arch_headers = [
        Paragraph("Layer / Service", table_header_style),
        Paragraph("Underlying Tech Stack", table_header_style),
        Paragraph("Core Responsibilities & State Boundaries", table_header_style)
    ]
    arch_rows = [
        arch_headers,
        [
            Paragraph("<b>Presentation Layer</b>", table_cell_bold),
            Paragraph("React 18 / Next.js 14, Tailwind CSS, Leaflet.js, Web Speech API", table_cell_style),
            Paragraph("Citizen PWA, Worker Radar HUD (one-handed touch targets), Ministry Cockpit dashboard.", table_cell_style)
        ],
        [
            Paragraph("<b>API Gateway & Auth</b>", table_cell_bold),
            Paragraph("FastAPI, Python 3.11+, PyJWT, Pydantic v2", table_cell_style),
            Paragraph("Role-Based Access Control (RBAC), rate-limiting, request validation, CORS, token verification.", table_cell_style)
        ],
        [
            Paragraph("<b>Spatial Dispatch Engine</b>", table_cell_bold),
            Paragraph("PostgreSQL 16, PostGIS, GeoPy, Redis 7 (GEORADIUS)", table_cell_style),
            Paragraph("Sub-second proximity matching, radial worker discovery, en-route hurdle fallback routing.", table_cell_style)
        ],
        [
            Paragraph("<b>Pricing & Subsidy Engine</b>", table_cell_bold),
            Paragraph("Python Async Service, Redis Cache", table_cell_style),
            Paragraph("4-Layer decoupled fare calculation, transparent breakdown generation, dynamic NGO quota check.", table_cell_style)
        ],
        [
            Paragraph("<b>AI Credential Parser</b>", table_cell_bold),
            Paragraph("Google GenAI SDK (Gemini 1.5 Flash)", table_cell_style),
            Paragraph("Multimodal document OCR of ITI, NSDC, and e-Shram certificates; confidence matching.", table_cell_style)
        ],
        [
            Paragraph("<b>Safety & SOS Service</b>", table_cell_bold),
            Paragraph("FastAPI, Telephony Bridge, Police 112 API", table_cell_style),
            Paragraph("Instant encrypted telemetry packet dispatch (Aadhaar, live GPS, vehicle registration).", table_cell_style)
        ]
    ]
    t_arch = Table(arch_rows, colWidths=[110, 150, 263.27])
    t_arch.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_navy),
        ('BOX', (0,0), (-1,-1), 1, c_border),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_slate_light])
    ]))
    story.append(t_arch)
    story.append(Spacer(1, 8))

    # ==================== SECTION 2: DATA MODELS & CLASS DIAGRAM ====================
    story.append(Paragraph("2. Domain Entities & UML Class Structure", h1_style))
    story.append(Paragraph(
        "The object model establishes clear ownership and audit boundaries. Key domain models enforce bilateral accountability:",
        body_style
    ))

    story.append(Paragraph("<b>&bull; User Class Hierarchy:</b> Base <code>User</code> class splits into <code>Citizen</code> (tracking Darpan NGO verification, subsidy quota hours, and bilateral strike counts) and <code>CooperativeWorker</code> (tracking PACS federation affiliation, 14-day rolling rejection rates, prepaid float ledger, and emergency certification badges).", bullet_style))
    story.append(Paragraph("<b>&bull; Booking Aggregate:</b> Represents the transaction core, holding pickup spatial coordinates, hashed OTP verification tokens (<code>start_otp_hash</code>, <code>end_otp_hash</code>), pre- and post-repair proof URLs, and the full rejection escalation history.", bullet_style))
    story.append(Paragraph("<b>&bull; TransparentInvoice Model:</b> Explicitly decouples Base Labor (100% worker passthrough), Toolkit Fee, Transit Tariff, Emergency Surcharge, Platform Tech Fee (3.5%), and Cooperative Welfare Cess (1.5%).", bullet_style))
    story.append(Paragraph("<b>&bull; MaterialProcurementRequest:</b> Models the on-site spare part approval pipeline with customer pre-authorization flags, damaged-part photo evidence, and wholesale merchant B2B margin tracking.", bullet_style))
    story.append(Spacer(1, 6))

    # ==================== SECTION 3: DATABASE SCHEMA (POSTGRESQL + POSTGIS DDL) ====================
    story.append(Paragraph("3. Production Database Schema (PostgreSQL 16 + PostGIS DDL)", h1_style))
    story.append(Paragraph(
        "Below is the core SQL schema defining spatial indexes and integrity constraints:",
        body_style
    ))

    sql_ddl = (
        "-- 1. Enable Spatial and UUID Extensions\n"
        "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";\n"
        "CREATE EXTENSION IF NOT EXISTS postgis;\n\n"
        "-- 2. Cooperative Federations (PACS & State Guilds)\n"
        "CREATE TABLE cooperative_federations (\n"
        "    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),\n"
        "    registration_code VARCHAR(64) UNIQUE NOT NULL,\n"
        "    name VARCHAR(255) NOT NULL,\n"
        "    district VARCHAR(100) NOT NULL, state VARCHAR(100) NOT NULL,\n"
        "    welfare_pool_balance NUMERIC(12,2) DEFAULT 0.00\n"
        ");\n\n"
        "-- 3. Cooperative Workers with PostGIS Geometry\n"
        "CREATE TABLE cooperative_workers (\n"
        "    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,\n"
        "    coop_federation_id UUID NOT NULL REFERENCES cooperative_federations(id),\n"
        "    primary_trade VARCHAR(64) NOT NULL,\n"
        "    is_verified BOOLEAN DEFAULT FALSE, is_available BOOLEAN DEFAULT FALSE,\n"
        "    rating NUMERIC(3,2) DEFAULT 5.00, rejection_rate_14d NUMERIC(4,3) DEFAULT 0.000,\n"
        "    prepaid_float_balance NUMERIC(10,2) DEFAULT 500.00,\n"
        "    current_location GEOMETRY(Point, 4326)\n"
        ");\n"
        "CREATE INDEX idx_workers_spatial ON cooperative_workers USING GIST (current_location);\n"
        "CREATE INDEX idx_workers_trade_avail ON cooperative_workers (primary_trade, is_available, is_verified);\n\n"
        "-- 4. Bookings Table with Dual OTP & State Constraints\n"
        "CREATE TABLE bookings (\n"
        "    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),\n"
        "    booking_reference VARCHAR(32) UNIQUE NOT NULL,\n"
        "    citizen_id UUID NOT NULL REFERENCES citizens(id),\n"
        "    assigned_worker_id UUID REFERENCES cooperative_workers(id),\n"
        "    service_code VARCHAR(64) NOT NULL, sub_service_name VARCHAR(128) NOT NULL,\n"
        "    urgency_tier VARCHAR(32) NOT NULL CHECK (urgency_tier IN ('P1_CRITICAL','P2_HIGH','P3_STANDARD','P4_ROUTINE')),\n"
        "    status VARCHAR(32) NOT NULL DEFAULT 'DRAFT',\n"
        "    pickup_coords GEOMETRY(Point, 4326) NOT NULL,\n"
        "    start_otp_hash CHAR(64) NOT NULL, end_otp_hash CHAR(64) NOT NULL,\n"
        "    pre_repair_photo_url TEXT, post_repair_photo_url TEXT,\n"
        "    payment_mode VARCHAR(20) NOT NULL CHECK (payment_mode IN ('CASH_ON_DELIVERY','UPI_ESCROW')),\n"
        "    rejection_history UUID[] DEFAULT '{}'\n"
        ");\n"
        "CREATE INDEX idx_bookings_status ON bookings (status);\n"
    )

    t_code = Table([[Paragraph(sql_ddl.replace("\n", "<br/>").replace(" ", "&nbsp;"), code_style)]], colWidths=[523.27])
    t_code.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_code_bg),
        ('BOX', (0,0), (-1,-1), 0.5, c_border),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 7),
        ('RIGHTPADDING', (0,0), (-1,-1), 7),
    ]))
    story.append(t_code)
    story.append(Spacer(1, 8))

    # ==================== SECTION 4: FINITE STATE MACHINE (FSM) ====================
    story.append(Paragraph("4. Finite State Machines (FSM): 10-State Booking Lifecycle", h1_style))
    story.append(Paragraph(
        "The booking state machine guarantees that requests never enter an unmonitored deadlock. "
        "Every transition is governed by explicit timeouts, cryptographic handshakes, or en-route hurdle triggers.",
        body_style
    ))

    fsm_headers = [
        Paragraph("Current State", table_header_style),
        Paragraph("Trigger / Event", table_header_style),
        Paragraph("Next State", table_header_style),
        Paragraph("System Action & Operational Fallback", table_header_style)
    ]
    fsm_rows = [
        fsm_headers,
        [
            Paragraph("<code>DRAFT</code>", table_cell_bold),
            Paragraph("Order submitted & invoice approved", table_cell_style),
            Paragraph("<code>BROADCASTING</code>", table_cell_style),
            Paragraph("Spatial query identifies top candidate; 30s acceptance timer initiated.", table_cell_style)
        ],
        [
            Paragraph("<code>BROADCASTING</code>", table_cell_bold),
            Paragraph("Worker declines or 30s timeout expires", table_cell_style),
            Paragraph("<code>REROUTING_FALLBACK</code>", table_cell_style),
            Paragraph("Logs worker rejection; auto-reassigns to next nearest qualified technician in zone.", table_cell_style)
        ],
        [
            Paragraph("<code>BROADCASTING</code>", table_cell_bold),
            Paragraph("Worker accepts offer", table_cell_style),
            Paragraph("<code>ACCEPTED</code>", table_cell_style),
            Paragraph("Redis distributed lock acquired; worker profile & vehicle details sent to citizen.", table_cell_style)
        ],
        [
            Paragraph("<code>ACCEPTED</code>", table_cell_bold),
            Paragraph("Worker starts travel", table_cell_style),
            Paragraph("<code>EN_ROUTE</code>", table_cell_style),
            Paragraph("In-app navigation active; Google Maps deep-link enabled; live coordinates stream.", table_cell_style)
        ],
        [
            Paragraph("<code>EN_ROUTE</code>", table_cell_bold),
            Paragraph("Worker reports vehicle breakdown / traffic hurdle", table_cell_style),
            Paragraph("<code>HURDLE_REROUTING</code>", table_cell_style),
            Paragraph("Mandatory reason logged; booking instantly re-escalates to next nearest guild peer.", table_cell_style)
        ],
        [
            Paragraph("<code>EN_ROUTE</code>", table_cell_bold),
            Paragraph("Worker reaches geofence (within 100m)", table_cell_style),
            Paragraph("<code>ARRIVED</code>", table_cell_style),
            Paragraph("App prompts citizen to provide START_OTP; prompts worker to input code.", table_cell_style)
        ],
        [
            Paragraph("<code>ARRIVED</code>", table_cell_bold),
            Paragraph("START_OTP verified", table_cell_style),
            Paragraph("<code>IN_PROGRESS</code>", table_cell_style),
            Paragraph("Service timer starts; pre-repair photo logged; doorstep session authenticated.", table_cell_style)
        ],
        [
            Paragraph("<code>IN_PROGRESS</code>", table_cell_bold),
            Paragraph("Worker requests spare parts", table_cell_style),
            Paragraph("<code>MATERIAL_APPROVAL</code>", table_cell_style),
            Paragraph("Photo + cost prompt sent to citizen; upon approval, procurement pass QR issued.", table_cell_style)
        ],
        [
            Paragraph("<code>IN_PROGRESS</code>", table_cell_bold),
            Paragraph("Work executed; photos captured", table_cell_style),
            Paragraph("<code>PENDING_PROOF</code>", table_cell_style),
            Paragraph("Dual completion photos uploaded (citizen + worker); END_OTP requested.", table_cell_style)
        ],
        [
            Paragraph("<code>PENDING_PROOF</code>", table_cell_bold),
            Paragraph("END_OTP validated", table_cell_style),
            Paragraph("<code>COMPLETED</code>", table_cell_style),
            Paragraph("Automated bank split: 100% labor to worker, 1.5% to PACS fund, 3.5% tech fee.", table_cell_style)
        ]
    ]
    t_fsm = Table(fsm_rows, colWidths=[90, 110, 100, 223.27])
    t_fsm.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_navy),
        ('BOX', (0,0), (-1,-1), 1, c_border),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_slate_light])
    ]))
    story.append(t_fsm)
    story.append(Spacer(1, 8))

    # ==================== SECTION 5: SEQUENCE WORKFLOWS ====================
    story.append(Paragraph("5. Critical Architectural Sequences & Handshakes", h1_style))
    story.append(Paragraph("A. The En-Route Hurdle & Zero-Downtime Fallback Sequence", h2_style))
    story.append(Paragraph(
        "1. <b>Hurdle Trigger:</b> While in <code>EN_ROUTE</code>, if the technician experiences a breakdown, they click <i>'Report Hurdle & Cancel'</i> and select a reason (Vehicle Puncture, Engine Fault, Extreme Waterlogging).<br/>"
        "2. <b>Transaction Isolation:</b> The system does not cancel the booking. It isolates the failed worker, updates their availability to <code>OFFLINE</code>, and increments their audit log.<br/>"
        "3. <b>Immediate Re-Escalation:</b> The Spatial Dispatch Service queries PostGIS excluding previously declined workers and immediately dispatches the booking to Worker #2. The citizen is notified: <i>'Technician A experienced a vehicle breakdown. Reassigned to nearest certified guild member Technician B (2.1 km away).'</i>",
        body_style
    ))

    story.append(Paragraph("B. The Dynamic On-Site Material Procurement Sequence", h2_style))
    story.append(Paragraph(
        "1. <b>In-App Request:</b> Technician identifies worn-out part, opens the material drawer, inputs item name (e.g., <i>Havells 32A Contactor</i>), estimated price (₹450), and snaps a photo of the burnt part.<br/>"
        "2. <b>Citizen Pre-Authorization:</b> The citizen's app receives an interactive push prompt displaying the photo and price. Citizen clicks <code>Approve & Escrow Pre-Authorize</code>.<br/>"
        "3. <b>Cooperative Pass Issuance:</b> The technician's app generates a <b>Digital Procurement QR</b>. The technician visits an authorized partner cooperative hardware merchant, scans the pass, and receives the part.<br/>"
        "4. <b>Settlement:</b> The partner store POS transmits an API webhook with the digital GST receipt. Citizen pays zero retail markup, and the platform retains a 4% wholesale referral margin.",
        body_style
    ))

    story.append(Paragraph("C. Emergency SOS & Police Telemetry Sequence", h2_style))
    story.append(Paragraph(
        "1. <b>One-Touch Activation:</b> Citizen presses the red SOS button. The app compiles an encrypted incident payload containing: live GPS coordinates, technician's Aadhaar hash, PACS registration number, vehicle plate, and active audio buffer.<br/>"
        "2. <b>Dual Automated Escalation:</b> The backend simultaneously initiates: (a) An automated telephony bridge to the 24/7 Seva Setu Command Center; (b) A secure webhook transmission to the Police Control Room (PCR 112 API); (c) SMS emergency broadcast to pre-registered family contacts.<br/>"
        "3. <b>Session Lock:</b> The technician's app is locked into an audit inspection state, preventing session termination until cleared by the control room.",
        body_style
    ))
    story.append(Spacer(1, 6))

    # ==================== SECTION 6: API CONTRACTS & JSON SPECIFICATIONS ====================
    story.append(Paragraph("6. RESTful API Contracts & Endpoint Specifications", h1_style))
    story.append(Paragraph("Sample Core Route Payloads:", body_style))

    api_json = (
        "// 1. POST /api/v1/bookings (Create Booking & Request Quote)\n"
        "REQUEST: {\n"
        "  \"service_code\": \"ELEC_REPAIR\", \"sub_service_name\": \"MCB_FUSE_REPLACEMENT\",\n"
        "  \"urgency_tier\": \"P1_CRITICAL\", \"pricing_horizon\": \"HOURLY\", \"payment_mode\": \"UPI_ESCROW\",\n"
        "  \"customer_latitude\": 28.6315, \"customer_longitude\": 77.2167, \"is_ngo_booking\": false\n"
        "}\n"
        "RESPONSE (201 Created): {\n"
        "  \"booking_id\": \"9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d\",\n"
        "  \"status\": \"BROADCASTING\", \"start_otp\": \"4982\", \"end_otp\": \"7134\",\n"
        "  \"transparent_invoice\": {\n"
        "    \"base_labor\": 240.00, \"toolkit_fee\": 60.00, \"transit_km\": 2.4, \"transit_tariff\": 30.00,\n"
        "    \"emergency_surcharge\": 120.00, \"gst_tax\": 12.00, \"platform_tech_fee\": 8.40,\n"
        "    \"federation_cess\": 3.60, \"total_payable\": 474.00, \"worker_guaranteed_takehome\": 390.00\n"
        "  }\n"
        "}\n\n"
        "// 2. POST /api/v1/bookings/{id}/verify-start (Doorstep Arrival Handshake)\n"
        "REQUEST:  { \"entered_otp\": \"4982\", \"worker_lat\": 28.6316, \"worker_lng\": 77.2166 }\n"
        "RESPONSE: { \"success\": true, \"new_status\": \"IN_PROGRESS\", \"geofence_verified\": true }\n"
    )

    t_api = Table([[Paragraph(api_json.replace("\n", "<br/>").replace(" ", "&nbsp;"), code_style)]], colWidths=[523.27])
    t_api.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_code_bg),
        ('BOX', (0,0), (-1,-1), 0.5, c_border),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 7),
        ('RIGHTPADDING', (0,0), (-1,-1), 7),
    ]))
    story.append(t_api)
    story.append(Spacer(1, 8))

    # ==================== SECTION 7: ALGORITHMIC PSEUDOCODE ====================
    story.append(Paragraph("7. Core Algorithmic Logic & Mathematical Formulations", h1_style))
    story.append(Paragraph("A. Geospatial Proximity & Triage Ranking Function", h2_style))
    story.append(Paragraph(
        "Candidate workers within radius $R$ are scored using a weighted multi-variable ranking function:",
        body_style
    ))

    algo_text = (
        "def calculate_worker_rank(worker: CooperativeWorker, booking: Booking) -> float:\n"
        "    dist_km = haversine(booking.pickup_coords, worker.current_location)\n"
        "    proximity_score = 100.0 / (dist_km + 1.0)\n"
        "    reliability_weight = (1.0 - worker.rejection_rate_14d) * 50.0\n"
        "    rating_weight = (worker.rating / 5.0) * 30.0\n"
        "    triage_bonus = 0.0\n"
        "    if booking.urgency_tier == UrgencyTier.P1_CRITICAL:\n"
        "        if worker.is_emergency_certified and worker.rejection_rate_14d < 0.10:\n"
        "            triage_bonus = 150.0\n"
        "        else:\n"
        "            triage_bonus = -500.0  # Exclude uncertified/unreliable workers from critical calls\n"
        "    return proximity_score + reliability_weight + rating_weight + triage_bonus\n"
    )
    t_algo = Table([[Paragraph(algo_text.replace("\n", "<br/>").replace(" ", "&nbsp;"), code_style)]], colWidths=[523.27])
    t_algo.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_code_bg),
        ('BOX', (0,0), (-1,-1), 0.5, c_border),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 7),
        ('RIGHTPADDING', (0,0), (-1,-1), 7),
    ]))
    story.append(t_algo)
    story.append(Spacer(1, 6))

    story.append(Paragraph("B. The Dynamic Subsidy Allocation Guardrail Algorithm", h2_style))
    story.append(Paragraph(
        "Prevents unbacked platform subsidies by cross-checking real-time district reserve balances and monthly institutional quotas:",
        body_style
    ))
    subsidy_algo = (
        "def evaluate_subsidy_entitlement(citizen: Citizen, bill_amount: float, district_pool_bal: float) -> tuple:\n"
        "    if not citizen.is_ngo_verified:\n"
        "        return 0.0, 'STANDARD_RATE'\n"
        "    if citizen.used_subsidy_hours_curr_month >= citizen.monthly_subsidy_quota_hours:\n"
        "        return 0.0, 'QUOTA_EXHAUSTED_STANDARD_RATE'\n"
        "    subsidy_target = bill_amount * 0.20\n"
        "    if district_pool_bal >= subsidy_target:\n"
        "        return subsidy_target, 'SUBSIDY_APPROVED_FROM_COMMERCIAL_POOL'\n"
        "    else:\n"
        "        return 0.0, 'QUEUED_FOR_OFF_PEAK_CSR_SPONSORSHIP'\n"
    )
    t_sub = Table([[Paragraph(subsidy_algo.replace("\n", "<br/>").replace(" ", "&nbsp;"), code_style)]], colWidths=[523.27])
    t_sub.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_code_bg),
        ('BOX', (0,0), (-1,-1), 0.5, c_border),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 7),
        ('RIGHTPADDING', (0,0), (-1,-1), 7),
    ]))
    story.append(t_sub)
    story.append(Spacer(1, 8))

    # ==================== SECTION 8: CONCURRENCY & SECURITY ====================
    story.append(Paragraph("8. Concurrency, Security & Anti-Fraud Specifications", h1_style))
    
    sec_headers = [
        Paragraph("Security / Concurrency Vector", table_header_style),
        Paragraph("Implementation Architecture", table_header_style),
        Paragraph("Anti-Fraud Guarantee & Protection Mechanism", table_header_style)
    ]
    sec_rows = [
        sec_headers,
        [
            Paragraph("<b>Worker Dispatch Race Conditions</b>", table_cell_bold),
            Paragraph("Redis Redlock Distributed Locking with 5-second TTL", table_cell_style),
            Paragraph("Guarantees atomic worker claim; prevents two workers from accepting the same booking.", table_cell_style)
        ],
        [
            Paragraph("<b>State Transition Integrity</b>", table_cell_bold),
            Paragraph("PostgreSQL Optimistic Row Versioning (OCC)", table_cell_style),
            Paragraph("Rejects stale state transitions; throws 409 Conflict if row version mismatches.", table_cell_style)
        ],
        [
            Paragraph("<b>False Photo Proof of Work</b>", table_cell_bold),
            Paragraph("EXIF Hardware Geolocation & Timestamp Diff", table_cell_style),
            Paragraph("Refuses END_OTP if photo coordinates deviate >250m from pickup site or <20 mins elapsed.", table_cell_style)
        ],
        [
            Paragraph("<b>OTP Theft / Brute Force</b>", table_cell_bold),
            Paragraph("SHA-256 Cryptographic Hashing with Salt", table_cell_style),
            Paragraph("Zero plaintext OTPs in database; 3 invalid attempts triggers 10-minute cooldown.", table_cell_style)
        ],
        [
            Paragraph("<b>Aadhaar Privacy Compliance</b>", table_cell_bold),
            Paragraph("UIDAI Zero-Knowledge Tokenization via Digilocker", table_cell_style),
            Paragraph("No raw 12-digit Aadhaar stored; only one-way cryptographic tokens persisted.", table_cell_style)
        ]
    ]
    t_sec = Table(sec_rows, colWidths=[120, 150, 253.27])
    t_sec.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_navy),
        ('BOX', (0,0), (-1,-1), 1, c_border),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 3.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3.5),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_slate_light])
    ]))
    story.append(t_sec)
    story.append(Spacer(1, 10))

    # Final Conclusion Box
    concl_html = (
        "<b>Low-Level Design Certification:</b> This LLD specification fulfills all technical, operational, and "
        "algorithmic requirements for Seva Setu. The architecture is fully decoupled, horizontally scalable across "
        "PostgreSQL PostGIS spatial nodes, resilient to en-route real-world network failures via fallback state machines, "
        "and mathematically guaranteed against unbacked platform subsidies."
    )
    t_concl = Table([[Paragraph(concl_html, callout_style)]], colWidths=[523.27])
    t_concl.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_blue_light),
        ('BOX', (0,0), (-1,-1), 1, c_blue),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 9),
        ('RIGHTPADDING', (0,0), (-1,-1), 9),
    ]))
    story.append(t_concl)

    # Build Document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"LLD PDF successfully generated: {filename}")

if __name__ == '__main__':
    output_filename = "Seva_Setu_Low_Level_Design_LLD_Specification.pdf"
    if len(sys.argv) > 1:
        output_filename = sys.argv[1]
    build_lld_pdf(output_filename)
