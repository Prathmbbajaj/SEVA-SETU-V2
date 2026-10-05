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
        
        # Running Header on page 2+
        if self._pageNumber > 1:
            self.setFillColor(colors.HexColor('#0f172a'))
            self.rect(36, 806, 523.27, 2, fill=True, stroke=False)
            
            self.setFont('Helvetica-Bold', 7.5)
            self.setFillColor(colors.HexColor('#1e3a8a'))
            self.drawString(36, 813, "SEVA SETU (सेवा सेतु) — HIGH-LEVEL DESIGN (HLD) ENGINEERING BLUEPRINT")
            
            self.setFont('Helvetica-Bold', 7)
            self.setFillColor(colors.HexColor('#d97706'))
            self.drawRightString(559.27, 813, "Ministry of Cooperation | IEEE 1016 HLD Specification (SIH 2026)")

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
        self.drawCentredString(297.63, 26, "Components, Data Flow Diagrams (DFD L0-L2), API Contracts & Capacity Modeling")

        # Footer Right
        self.setFont('Helvetica-Bold', 7.5)
        self.setFillColor(colors.HexColor('#1e293b'))
        self.drawRightString(559.27, 26, f"Page {self._pageNumber} of {page_count}")

        self.restoreState()


def build_hld_blueprint_pdf(filename="Seva_Setu_High_Level_Design_HLD_Engineering_Blueprint.pdf"):
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
    c_emerald = colors.HexColor('#047857')
    c_emerald_light = colors.HexColor('#ecfdf5')
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
        fontSize=18,
        leading=22,
        textColor=c_navy,
        alignment=TA_LEFT
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13,
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
        fontSize=11.5,
        leading=15,
        textColor=c_navy,
        spaceBefore=10,
        spaceAfter=4.5,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'SecH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12.5,
        textColor=c_blue,
        spaceBefore=6,
        spaceAfter=3,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.8,
        leading=11,
        textColor=c_slate_dark,
        alignment=TA_JUSTIFY,
        spaceAfter=3.5
    )

    bullet_style = ParagraphStyle(
        'BulletText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.8,
        leading=11,
        textColor=c_slate_dark,
        leftIndent=10,
        firstLineIndent=-6,
        spaceAfter=2
    )

    code_style = ParagraphStyle(
        'CodeSnippet',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=6.8,
        leading=9,
        textColor=colors.HexColor('#0f172a')
    )

    callout_style = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.8,
        leading=11,
        textColor=colors.HexColor('#065f46')
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.2,
        leading=9.5,
        textColor=colors.white,
        alignment=TA_CENTER
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=6.8,
        leading=9,
        textColor=c_slate_dark
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=6.8,
        leading=9,
        textColor=c_navy
    )

    story = []

    # ==================== COVER / TITLE BLOCK ====================
    story.append(Spacer(1, 4))
    story.append(Paragraph("SEVA SETU (सेवा सेतु) &bull; HIGH-LEVEL DESIGN (HLD) BLUEPRINT", subtitle_style))
    story.append(Spacer(1, 2))
    story.append(Paragraph("Comprehensive HLD Specification: Component Diagrams, DFDs (Level 0–2), API Contracts & Capacity Models", title_style))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>Governing Authority:</b> Ministry of Cooperation, Government of India &bull; <i>Theme: Sahakar Se Samriddhi</i><br/>"
        "<b>Specification Standard:</b> IEEE 1016-2009 Standard for Information Technology Systems Design Descriptions &bull; <b>Version:</b> 2.0.0",
        meta_style
    ))
    story.append(Spacer(1, 6))
    story.append(HRFlowable(width="100%", thickness=1.5, color=c_blue, spaceAfter=8, spaceBefore=2))

    # ==================== EXECUTIVE SCOPE CALLOUT ====================
    hld_scope = (
        "<b>Architectural Scope Definition:</b> In strict adherence to enterprise software engineering standards, this High-Level Design (HLD) "
        "covers the four macro-architectural pillars: <b>(1) Component Diagrams</b> defining major modular boundaries and subsystems; "
        "<b>(2) Data Flow Diagrams (DFDs)</b> detailing Level 0, Level 1, and Level 2 process flows; <b>(3) High-Level API Specifications</b> "
        "establishing inter-service interface contracts; and <b>(4) Quantitative Capacity Models</b> estimating peak QPS, network bandwidth, "
        "5-year database storage, Redis in-memory footprints, and compute cluster sizing."
    )
    t_callout = Table([[Paragraph(hld_scope, callout_style)]], colWidths=[523.27])
    t_callout.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_emerald_light),
        ('BOX', (0,0), (-1,-1), 1, c_emerald),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_callout)
    story.append(Spacer(1, 8))

    # ==================== PILLAR 1: COMPONENT DIAGRAMS ====================
    story.append(Paragraph("1. Component Diagrams & Subsystem Boundaries", h1_style))
    story.append(Paragraph(
        "Seva Setu is decomposed into eight enterprise components, isolating high-frequency geospatial ingestion from financial "
        "and governance pipelines. The architecture enforces clean separation of concerns and loose coupling.",
        body_style
    ))

    comp_headers = [
        Paragraph("Subsystem Component", table_header_style),
        Paragraph("Internal Modules", table_header_style),
        Paragraph("Collaborating Components & External Interfaces", table_header_style)
    ]
    comp_rows = [
        comp_headers,
        [
            Paragraph("<b>Ingress & Edge Component</b>", table_cell_bold),
            Paragraph("Cloudflare Edge CDN, Nginx/Traefik Reverse Proxy, FastAPI ASGI Gateway.", table_cell_style),
            Paragraph("Collaborates with all downstream services. Handles SSL termination, rate-limiting, and JWT RBAC validation.", table_cell_style)
        ],
        [
            Paragraph("<b>Identity & Verification Component</b>", table_cell_bold),
            Paragraph("Digilocker Adapter, Gemini 1.5 Flash OCR Parser, e-Shram Tokenizer.", table_cell_style),
            Paragraph("Interfaces with UIDAI, e-Shram, and S3 Encrypted Media Vault. Supplies verified worker badges to Spatial Engine.", table_cell_style)
        ],
        [
            Paragraph("<b>Geospatial Triage & Dispatch</b>", table_cell_bold),
            Paragraph("PostGIS Spatial Query Engine, Multi-Objective Ranking Math, Redis GEOSEARCH.", table_cell_style),
            Paragraph("Consumes worker GPS stream from Redis. Dispatches bookings to Worker Radar via WebSocket push hub.", table_cell_style)
        ],
        [
            Paragraph("<b>Fallback & Continuity Coordinator</b>", table_cell_bold),
            Paragraph("Rejection Ledger, En-Route Hurdle Resolver, Escalation State Machine.", table_cell_style),
            Paragraph("Listens to worker hurdle webhooks. Re-escalates bookings to next nearest guild peer without terminating session.", table_cell_style)
        ],
        [
            Paragraph("<b>Decoupled 4-Layer Pricing</b>", table_cell_bold),
            Paragraph("Unbundled Fare Calculator, Seva Subsidy Manager, Dynamic Quota Guard.", table_cell_style),
            Paragraph("Computes transparent line items. Verifies NGO Darpan IDs, checks district pool liquidity, and executes split payouts.", table_cell_style)
        ],
        [
            Paragraph("<b>Material Procurement B2B</b>", table_cell_bold),
            Paragraph("Pre-Authorization Engine, Cooperative Hardware QR Pass, POS Webhook Listener.", table_cell_style),
            Paragraph("Interfaces with Citizen App and Cooperative Hardware Merchants. Captures 4% B2B wholesale trade margins.", table_cell_style)
        ],
        [
            Paragraph("<b>Safety Command & SOS Component</b>", table_cell_bold),
            Paragraph("Active Telemetry Compiler, Telephony Bridge, Police 112 ERSS Client.", table_cell_style),
            Paragraph("Triggered by Citizen/Worker SOS. Transmits encrypted GPS, Aadhaar hash, and vehicle details to Police 112.", table_cell_style)
        ],
        [
            Paragraph("<b>Ministry Analytics Component</b>", table_cell_bold),
            Paragraph("District Deficit Aggregator, PACS Training Planner, Macro Revenue Auditor.", table_cell_style),
            Paragraph("Pulls completed booking logs from PostgreSQL. Generates district deficit heatmaps for Ministry officials.", table_cell_style)
        ]
    ]
    t_comp = Table(comp_rows, colWidths=[115, 150, 258.27])
    t_comp.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_navy),
        ('BOX', (0,0), (-1,-1), 1, c_border),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_slate_light])
    ]))
    story.append(t_comp)
    story.append(Spacer(1, 8))

    # ==================== PILLAR 2: DATA FLOW DIAGRAMS ====================
    story.append(Paragraph("2. Data Flow Diagrams (DFD Level 0, Level 1 & Level 2)", h1_style))
    
    story.append(Paragraph("A. DFD Level 0: Enterprise Context Data Flow", h2_style))
    story.append(Paragraph(
        "&bull; <b>Citizen Flow:</b> Ingests service category, sub-scope, location, and urgency tier $\rightarrow$ Receives unbundled invoice, live worker coordinates, and START_OTP.<br/>"
        "&bull; <b>Worker Guild Flow:</b> Ingests live GPS telemetry and radar accept/decline $\rightarrow$ Emits en-route hurdle cancellation or on-site spare part quotes $\rightarrow$ Receives 100% direct labor payout.<br/>"
        "&bull; <b>PACS / Cooperative Flow:</b> Performs physical tool vetting and issues credential seals $\rightarrow$ Receives 1.5% statutory welfare cess (PMSBY insurance fund).<br/>"
        "&bull; <b>Ministry Flow:</b> Ingests district deficit heatmaps and audit ledgers $\rightarrow$ Emits targeted PACS vocational training deployment orders.<br/>"
        "&bull; <b>National DPI Flow:</b> Transmits encrypted Aadhaar tokens and live emergency telemetry $\rightarrow$ Receives UIDAI verification and Police 112 ERSS dispatch confirmation.",
        body_style
    ))

    story.append(Paragraph("B. DFD Level 1: Subsystem Process Decomposition", h2_style))
    story.append(Paragraph(
        "Decomposes data transformations across seven primary persistence stores: "
        "<b>D1: Users & Worker Guild Vault</b> (Credentials, Float Balance); "
        "<b>D2: PostGIS Spatial Coordinates</b> (Active Points EPSG:4326); "
        "<b>D3: Bookings & Transparent Ledgers</b> (Invoices, States); "
        "<b>D4: B2B Material Procurements</b> (Parts Quotes, Merchant Invoices); "
        "<b>D5: Seva Subsidy Reserve Pool</b> (Surpluses, CSR Vouchers); "
        "<b>D6: Safety & Police Incident Log</b> (Encrypted Telemetry); "
        "<b>D7: National District Deficit Ledger</b> (Trade Demand Indices).",
        body_style
    ))

    story.append(Paragraph("C. DFD Level 2: Service Booking, Fallback & Material Pass Execution Flow", h2_style))
    story.append(Paragraph(
        "1. <b>Quote & Subsidy Check:</b> Citizen request triggers Process 2.1 (Sub-scope parse) $\rightarrow$ Process 2.4 checks Darpan ID and validates the Subsidy Guardrail against D5 (Liquidity Check) $\rightarrow$ Persists unbundled invoice to D3.<br/>"
        "2. <b>Spatial Matching & WebSocket Dispatch:</b> Process 3.1 executes PostGIS <code>ST_DWithin</code> on D2 $\rightarrow$ Computes Triage Ranking $\rightarrow$ Pushes broadcast to Candidate #1.<br/>"
        "3. <b>Zero-Downtime Fallback:</b> If Worker #1 declines or triggers an en-route hurdle, Process 3.6 logs the rejection in D3 and instantly re-escalates to Candidate #2 without terminating the booking.<br/>"
        "4. <b>Dynamic Material Procurement Pass:</b> On-site parts request triggers Process 4.4 (Citizen pre-auth) $\rightarrow$ Generates QR Pass $\rightarrow$ Partner store POS webhook confirms pickup in D4.<br/>"
        "5. <b>Dual OTP Settlement:</b> Process 5.2 validates END_OTP $\rightarrow$ Transfers 100% labor to worker bank, 1.5% to PACS PMSBY fund, and streams coordinates to D7 (Ministry Deficit Heatmap).",
        body_style
    ))
    story.append(Spacer(1, 6))

    # ==================== PILLAR 3: HIGH-LEVEL API SPECIFICATIONS ====================
    story.append(Paragraph("3. High-Level API Specifications & Interface Contracts", h1_style))
    story.append(Paragraph("Core Enterprise Interface Signatures:", body_style))

    api_spec = (
        "// 1. ORDER DISPATCH & QUOTE INTERFACE (POST /api/v1/orders/quote-and-dispatch)\n"
        "REQUEST: {\n"
        "  \"service_category\": \"ELECTRICIAN\", \"sub_scope_code\": \"CIRCUIT_BREAKER_TRIP_FIX\",\n"
        "  \"urgency_tier\": \"P1_CRITICAL\", \"pricing_horizon\": \"HOURLY\", \"payment_mode\": \"UPI_ESCROW\",\n"
        "  \"customer_coords\": { \"lat\": 28.6315, \"lng\": 77.2167 }, \"is_ngo\": true, \"darpan_id\": \"DL/2021/00892\"\n"
        "}\n"
        "RESPONSE (201 Created): {\n"
        "  \"order_id\": \"ord_9b1deb4d\", \"order_ref\": \"SEVA-DEL-2026-9041\", \"status\": \"BROADCASTING\",\n"
        "  \"start_otp\": \"8241\", \"end_otp\": \"5913\",\n"
        "  \"invoice\": { \"base_labor\": 240.00, \"transit\": 30.00, \"emergency_surcharge\": 120.00,\n"
        "              \"platform_fee\": 8.40, \"cess\": 3.60, \"ngo_discount\": -94.80, \"total_payable\": 379.20 }\n"
        "}\n\n"
        "// 2. EN-ROUTE HURDLE FALLBACK INTERFACE (POST /api/v1/dispatch/{order_id}/report-hurdle)\n"
        "REQUEST:  { \"worker_id\": \"wkr_101\", \"hurdle_type\": \"VEHICLE_PUNCTURE\", \"coords\": { \"lat\": 28.6322, \"lng\": 77.2210 } }\n"
        "RESPONSE: { \"hurdle_logged\": true, \"fallback_status\": \"RE_ESCALATED\", \"reassigned_worker_id\": \"wkr_106_amit\" }\n\n"
        "// 3. ON-SITE MATERIAL PRE-AUTH INTERFACE (POST /api/v1/procurement/{order_id}/pre-authorize)\n"
        "REQUEST:  { \"item_id\": \"mat_4892\", \"amount\": 450.00, \"signature\": \"sig_escrow_preauth_8829\" }\n"
        "RESPONSE: { \"status\": \"PRE_AUTHORIZED\", \"qr_pass\": \"https://vault.sevasetu.gov.in/qr/pass_9921.png\", \"b2b_margin\": 18.00 }\n"
    )

    t_api = Table([[Paragraph(api_spec.replace("\n", "<br/>").replace(" ", "&nbsp;"), code_style)]], colWidths=[523.27])
    t_api.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_code_bg),
        ('BOX', (0,0), (-1,-1), 0.5, c_border),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_api)
    story.append(Spacer(1, 8))

    # ==================== PILLAR 4: CAPACITY MODELS & SIZING ====================
    story.append(Paragraph("4. Quantitative Capacity Models & Sizing Computations", h1_style))
    story.append(Paragraph(
        "Rigorous back-of-the-envelope calculations model system requirements for nationwide deployment across 500,000 certified technicians:",
        body_style
    ))

    cap_headers = [
        Paragraph("Metric Dimension", table_header_style),
        Paragraph("Formula & Sizing Derivation", table_header_style),
        Paragraph("Provisioned Engineering Specification", table_header_style)
    ]
    cap_rows = [
        cap_headers,
        [
            Paragraph("<b>Peak Booking QPS</b>", table_cell_bold),
            Paragraph("(1,000,000 daily bookings / 86,400s) &times; 3.0 diurnal peak factor.", table_cell_style),
            Paragraph("<b>35 Bookings / Sec</b> (Readily handled by ASGI event loop).", table_cell_style)
        ],
        [
            Paragraph("<b>Peak GPS Telemetry QPS</b>", table_cell_bold),
            Paragraph("(200,000 concurrent workers / 10s ping interval) &times; 2.5 emergency surge.", table_cell_style),
            Paragraph("<b>50,000 GPS Pings / Sec</b> (Ingested into Redis Streams).", table_cell_style)
        ],
        [
            Paragraph("<b>Network Bandwidth</b>", table_cell_bold),
            Paragraph("GPS (50k &times; 250B = 100 Mbps) + Trans API (2k &times; 2.5KB = 40 Mbps).", table_cell_style),
            Paragraph("<b>140 Mbps Continuous Peak</b> (1 Gbps redundant edge pipe).", table_cell_style)
        ],
        [
            Paragraph("<b>5-Year PostgreSQL Storage</b>", table_cell_bold),
            Paragraph("1M bookings/day &times; 1.5 KB &times; 365 days &times; 1.5 index multiplier &times; 5 yrs.", table_cell_style),
            Paragraph("<b>2.75 Terabytes</b> (Hot active DB with archiving >18 months).", table_cell_style)
        ],
        [
            Paragraph("<b>5-Year Media Storage (S3)</b>", table_cell_bold),
            Paragraph("1M jobs/day &times; 2 photos &times; 200 KB &times; 365 days &times; 5 years.", table_cell_style),
            Paragraph("<b>730 Terabytes</b> (Hot S3 90 days &rarr; S3 Glacier Lifecycle).", table_cell_style)
        ],
        [
            Paragraph("<b>Redis In-Memory RAM</b>", table_cell_bold),
            Paragraph("Worker Geopoints (12.8MB) + Sessions (75MB) + Tokens (1GB) &times; 4.0 safety.", table_cell_style),
            Paragraph("<b>16.0 Gigabytes</b> (3-node Redis cluster on cache.t4g.medium).", table_cell_style)
        ],
        [
            Paragraph("<b>Compute Cluster Allocation</b>", table_cell_bold),
            Paragraph("50,000 GPS QPS (42 cores) + 35 Trans QPS (16 cores) @ 65% target CPU.", table_cell_style),
            Paragraph("<b>20 ASGI Nodes</b> (4 vCPU / 16 GB RAM each with K8s HPA).", table_cell_style)
        ]
    ]
    t_cap = Table(cap_rows, colWidths=[120, 203.27, 200])
    t_cap.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_navy),
        ('BOX', (0,0), (-1,-1), 1, c_border),
        ('GRID', (0,0), (-1,-1), 0.5, c_border),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_slate_light])
    ]))
    story.append(t_cap)
    story.append(Spacer(1, 8))

    # Final Summary Callout
    concl_html = (
        "<b>High-Level Design Certification:</b> This HLD Engineering Blueprint establishes the macro-systemic "
        "feasibility of Seva Setu. By mathematically modeling capacity across 50,000 peak GPS QPS, separating concerns "
        "into 8 decoupled components, defining formal DFD Level 0–2 flows, and specifying high-level API boundary contracts, "
        "it guarantees enterprise stability for nationwide public service deployment."
    )
    t_concl = Table([[Paragraph(concl_html, callout_style)]], colWidths=[523.27])
    t_concl.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_blue_light),
        ('BOX', (0,0), (-1,-1), 1, c_blue),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_concl)

    # Build Document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"HLD Blueprint PDF successfully generated: {filename}")

if __name__ == '__main__':
    output_filename = "Seva_Setu_High_Level_Design_HLD_Engineering_Blueprint.pdf"
    if len(sys.argv) > 1:
        output_filename = sys.argv[1]
    build_hld_blueprint_pdf(output_filename)
