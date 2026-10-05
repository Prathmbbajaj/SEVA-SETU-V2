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
            self.drawString(36, 813, "SEVA SETU (सेवा सेतु) — HIGH-LEVEL DESIGN (HLD) SPECIFICATION")
            
            self.setFont('Helvetica-Bold', 7)
            self.setFillColor(colors.HexColor('#d97706'))
            self.drawRightString(559.27, 813, "Ministry of Cooperation | Enterprise Architecture (SIH 2026)")

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
        self.drawCentredString(297.63, 26, "High-Level Design (HLD) — C4 Model, Event Bus, Microservices & DPI Integration")

        # Footer Right
        self.setFont('Helvetica-Bold', 7.5)
        self.setFillColor(colors.HexColor('#1e293b'))
        self.drawRightString(559.27, 26, f"Page {self._pageNumber} of {page_count}")

        self.restoreState()


def build_hld_pdf(filename="Seva_Setu_High_Level_Design_HLD_Specification.pdf"):
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
    story.append(Paragraph("SEVA SETU (सेवा सेतु) &bull; HIGH-LEVEL DESIGN (HLD)", subtitle_style))
    story.append(Spacer(1, 2))
    story.append(Paragraph("Enterprise High-Level Architecture: C4 Context, Containers, Event Streaming & National DPI Integration", title_style))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>Governing Authority:</b> Ministry of Cooperation, Government of India &bull; <i>Theme: Sahakar Se Samriddhi</i><br/>"
        "<b>Architectural Methodology:</b> C4 Model &bull; Asynchronous Event-Driven Microservices &bull; <b>Version:</b> 1.0.0 (SIH 2026)",
        meta_style
    ))
    story.append(Spacer(1, 6))
    story.append(HRFlowable(width="100%", thickness=1.5, color=c_blue, spaceAfter=8, spaceBefore=2))

    # ==================== EXECUTIVE CALLOUT ====================
    hld_overview = (
        "<b>High-Level Enterprise Architecture:</b> Seva Setu is designed as a sovereign, multi-tenant <b>Digital Public Infrastructure (DPI)</b>. "
        "It decouples consumer demand, cooperative labor supply, and institutional governance into autonomous, horizontally scalable layers. "
        "The architecture integrates C4 Level 1 (Enterprise Context), Level 2 (Container Topologies), asynchronous Redis/Kafka event streaming, "
        "Zero-Trust identity verification via Digilocker/UIDAI, PostGIS spatial clusters, and automated failover fallback state machines."
    )
    t_callout = Table([[Paragraph(hld_overview, callout_style)]], colWidths=[523.27])
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

    # ==================== SECTION 1: C4 LEVEL 1 SYSTEM CONTEXT ====================
    story.append(Paragraph("1. System Context Architecture (C4 Level 1: Enterprise Boundary)", h1_style))
    story.append(Paragraph(
        "Seva Setu establishes a trusted tripartite interface between the citizen, the decentralized cooperative labor force, "
        "and statutory public infrastructure. The platform coordinates transactions without extracting monopolistic commission margins.",
        body_style
    ))

    context_headers = [
        Paragraph("External Entity / Actor", table_header_style),
        Paragraph("Interface Protocol", table_header_style),
        Paragraph("Information Flow & Strategic Integration Role", table_header_style)
    ]
    context_rows = [
        context_headers,
        [
            Paragraph("<b>Citizens & NGOs</b>", table_cell_bold),
            Paragraph("HTTPS / WSS / PWA", table_cell_style),
            Paragraph("Submits service requests, selects triage urgency, receives unbundled itemized invoices, authorizes dual OTPs.", table_cell_style)
        ],
        [
            Paragraph("<b>Cooperative Workers</b>", table_cell_bold),
            Paragraph("WSS / Mobile REST API", table_cell_style),
            Paragraph("Receives proximity broadcasts, visualizes guaranteed net pay, reports en-route hurdles, submits proof-of-work.", table_cell_style)
        ],
        [
            Paragraph("<b>Ministry of Cooperation</b>", table_cell_bold),
            Paragraph("HTTPS / Next.js Admin", table_cell_style),
            Paragraph("Accesses national revenue audits, district-level workforce deficit heatmaps, and approves federation training grants.", table_cell_style)
        ],
        [
            Paragraph("<b>Primary Societies (PACS)</b>", table_cell_bold),
            Paragraph("Cooperative ERP Bridge", table_cell_style),
            Paragraph("Performs in-person physical vetting of tools, handles dispute hearings, receives 1.5% statutory welfare cess.", table_cell_style)
        ],
        [
            Paragraph("<b>UIDAI / Digilocker DPI</b>", table_cell_bold),
            Paragraph("OAuth 2.0 / REST API", table_cell_style),
            Paragraph("Performs zero-knowledge Aadhaar tokenization and fetches verifiable ITI / NSDC skill certifications.", table_cell_style)
        ],
        [
            Paragraph("<b>Emergency ERSS 112</b>", table_cell_bold),
            Paragraph("Encrypted Webhook API", table_cell_style),
            Paragraph("Receives instant emergency SOS telemetry packets (live GPS, technician ID, vehicle plate) for police intervention.", table_cell_style)
        ]
    ]
    t_context = Table(context_rows, colWidths=[110, 115, 298.27])
    t_context.setStyle(TableStyle([
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
    story.append(t_context)
    story.append(Spacer(1, 8))

    # ==================== SECTION 2: C4 LEVEL 2 CONTAINERS ====================
    story.append(Paragraph("2. Container Architecture (C4 Level 2: Subsystem Topology)", h1_style))
    story.append(Paragraph(
        "The container ecosystem is decoupled into edge routing, asynchronous micro-services, and dedicated persistence clusters:",
        body_style
    ))

    story.append(Paragraph("<b>&bull; Ingress & API Gateway:</b> An asynchronous FastAPI core fronted by an Nginx / Traefik load balancer. Handles rate limiting, JWT token validation, and request routing with non-blocking ASGI event loops.", bullet_style))
    story.append(Paragraph("<b>&bull; Geospatial Dispatch Engine:</b> PostGIS-driven cluster coupled with an in-memory Redis 7 Geospatial cache (<code>GEOSEARCH</code>). Computes candidate proximity within 5km–15km radiuses in sub-18ms latency.", bullet_style))
    story.append(Paragraph("<b>&bull; Decoupled 4-Layer Pricing Service:</b> Calculates unbundled transparent invoices, separating Worker Labor (100%), Transit Tariffs, Toolkit Allowances, 1.5% Cooperative Cess, and 3.5% Platform Tech Fees.", bullet_style))
    story.append(Paragraph("<b>&bull; Zero-Downtime Fallback Coordinator:</b> Finite state machine engine that detects worker rejections or en-route vehicle hurdles, automatically cascading requests to the next nearest guild technician.", bullet_style))
    story.append(Paragraph("<b>&bull; Material Procurement B2B Connector:</b> Mediates on-site spare part approvals between citizens, technicians, and local cooperative hardware stores, capturing a 3%–5% wholesale referral margin.", bullet_style))
    story.append(Paragraph("<b>&bull; Persistence Clusters:</b> PostgreSQL 16 (Relational & Spatial), Redis 7 (Distributed Redlock & Caching), and S3/MinIO (Encrypted storage for proof-of-work photographs and trade credentials).", bullet_style))
    story.append(Spacer(1, 6))

    # ==================== SECTION 3: SUBSYSTEM BREAKDOWN ====================
    story.append(Paragraph("3. Core Subsystems & Operational Mechanisms", h1_style))
    
    story.append(Paragraph("A. The Geospatial Triage Dispatch Subsystem", h2_style))
    story.append(Paragraph(
        "When an order is created, the spatial engine executes a two-stage filter: "
        "(1) <i>Spatial Radius Filter</i> using PostGIS <code>ST_DWithin</code> to find active certified technicians; "
        "(2) <i>Multi-Objective Scoring Function</i> sorting workers by distance, 14-day rolling reliability, customer ratings, "
        "and emergency certification bonuses. Critical P1 emergency requests bypass standard queues and route directly to technicians with 90%+ acceptance track records.",
        body_style
    ))

    story.append(Paragraph("B. The Zero-Downtime Fallback State Machine", h2_style))
    story.append(Paragraph(
        "To ensure public service continuity, the fallback engine enforces two automated recovery protocols: "
        "<br/>1. <b>Initial Broadcast Timeout:</b> Workers have 30 seconds to accept. If declined or timed out, the request escalates to the next nearest ranked technician within 15 seconds."
        "<br/>2. <b>En-Route Hurdle Protection:</b> If a traveling technician encounters an accident, flat tyre, or waterlogging, they tap <i>'Report Hurdle & Cancel'</i>. "
        "The system isolates the worker, logs the reason, and instantly re-dispatches the booking to the closest peer guild member. The citizen's service is never abandoned.",
        body_style
    ))

    story.append(Paragraph("C. On-Site Dynamic Material Procurement Workflow", h2_style))
    story.append(Paragraph(
        "When on-site repairs require spare parts (e.g., replacement MCB switches, copper tubing): "
        "<br/>&bull; Technician uploads a live photograph of the damaged part with an itemized estimate."
        "<br/>&bull; Citizen reviews and pre-authorizes the exact retail price in-app via digital escrow."
        "<br/>&bull; The app generates a <b>Digital Procurement QR Pass</b> redeemable at verified cooperative hardware merchants."
        "<br/>&bull; Merchant POS confirms part collection; citizen pays zero retail markup; platform retains a 4% B2B wholesale trade discount.",
        body_style
    ))

    story.append(Paragraph("D. Emergency SOS Command & Telemetry Subsystem", h2_style))
    story.append(Paragraph(
        "Activated via a one-touch SOS button during domestic visits or driving gigs: "
        "Instantly packages an encrypted telemetry payload (live GPS coordinates, technician Aadhaar hash, vehicle registration, and active audio buffer) "
        "and triggers dual escalation to the 24/7 Command Center and local Police Control Room (ERSS 112 API).",
        body_style
    ))

    story.append(Paragraph("E. Apex Ministry Cockpit & Deficit Heatmap Subsystem", h2_style))
    story.append(Paragraph(
        "Aggregates real-time municipal demand density against active technician supply across 15+ trade categories. "
        "Identifies localized workforce deficits (e.g., East Delhi electrical deficit >40%) and enables Ministry officials to deploy targeted "
        "vocational training cohorts and allocate PACS labor expansion grants with surgical precision.",
        body_style
    ))
    story.append(Spacer(1, 6))

    # ==================== SECTION 4: DATA FLOW & EVENT STREAMING ====================
    story.append(Paragraph("4. Asynchronous Event-Driven Messaging Architecture", h1_style))
    story.append(Paragraph(
        "High-throughput events (live GPS tracking, radar HUD broadcasts, and fallback triggers) flow through an asynchronous event bus, "
        "preventing database locks during peak booking surges.",
        body_style
    ))

    event_headers = [
        Paragraph("Event Channel / Topic", table_header_style),
        Paragraph("Publisher", table_header_style),
        Paragraph("Consumers / Subscribers", table_header_style),
        Paragraph("Action Triggered", table_header_style)
    ]
    event_rows = [
        event_headers,
        [
            Paragraph("<code>booking.requested</code>", table_cell_bold),
            Paragraph("Citizen PWA / Gateway", table_cell_style),
            Paragraph("Spatial Dispatch Service", table_cell_style),
            Paragraph("Executes PostGIS query and broadcasts job to candidate worker.", table_cell_style)
        ],
        [
            Paragraph("<code>worker.declined</code>", table_cell_bold),
            Paragraph("Worker Mobile App", table_cell_style),
            Paragraph("Fallback Coordinator", table_cell_style),
            Paragraph("Appends worker to rejection list; triggers auto-reassignment.", table_cell_style)
        ],
        [
            Paragraph("<code>worker.hurdle_reported</code>", table_cell_bold),
            Paragraph("Worker Mobile App", table_cell_style),
            Paragraph("Fallback Engine & Admin Desk", table_cell_style),
            Paragraph("Isolates failed technician; re-dispatches booking to guild peer.", table_cell_style)
        ],
        [
            Paragraph("<code>booking.otp_verified</code>", table_cell_bold),
            Paragraph("API Gateway", table_cell_style),
            Paragraph("Ledger & Settlement Service", table_cell_style),
            Paragraph("Starts service timer (START_OTP) or releases instant payout (END_OTP).", table_cell_style)
        ],
        [
            Paragraph("<code>safety.sos_triggered</code>", table_cell_bold),
            Paragraph("Citizen / Worker App", table_cell_style),
            Paragraph("ERSS 112 API, Command Center", table_cell_style),
            Paragraph("Dispatches encrypted telemetry to police; opens live audio bridge.", table_cell_style)
        ]
    ]
    t_event = Table(event_rows, colWidths=[105, 95, 115, 208.27])
    t_event.setStyle(TableStyle([
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
    story.append(t_event)
    story.append(Spacer(1, 8))

    # ==================== SECTION 5: SCALABILITY, SECURITY & COMPLIANCE ====================
    story.append(Paragraph("5. Scalability, High Availability (HA) & Security Specifications", h1_style))

    story.append(Paragraph("A. Concurrency Control & High Availability", h2_style))
    story.append(Paragraph(
        "&bull; <b>Redis Redlock (Distributed Locking):</b> Prevents race conditions where network latency causes two proximate workers to accept the exact same broadcast booking.<br/>"
        "&bull; <b>PostgreSQL Optimistic Concurrency Control (OCC):</b> Row versioning on the <code>bookings</code> table guarantees atomic state transitions, rolling back stale requests with a <code>409 Conflict</code>.<br/>"
        "&bull; <b>High Availability Topology:</b> 1 Primary Write PostgreSQL node with 2 Read Replicas (supporting 15,000 req/sec) and automated multi-zone failover delivering 99.99% system uptime.",
        body_style
    ))

    story.append(Paragraph("B. Zero-Knowledge Identity Protection & Regulatory Compliance", h2_style))
    story.append(Paragraph(
        "&bull; <b>UIDAI Compliance:</b> Raw 12-digit Aadhaar numbers are never persisted. The platform generates an irreversible <code>SHA-256(Aadhaar + Salt)</code> token verified via Digilocker OAuth2.<br/>"
        "&bull; <b>EXIF Geofencing & Photo Proof:</b> Post-repair photos are inspected for live device GPS metadata. Uploads taken outside a 250m geofence of the booking location are rejected.<br/>"
        "&bull; <b>Code on Social Security (2020) Alignment:</b> Automatically routes the 1.5% cooperative cess into PMSBY accidental insurance and PACS welfare funds, fulfilling statutory compliance.",
        body_style
    ))
    story.append(Spacer(1, 6))

    # ==================== SECTION 6: 4-PHASE NATIONWIDE SCALING ====================
    story.append(Paragraph("6. Nationwide Scaling Framework (4-Phase DPI Roadmap)", h1_style))
    
    scale_headers = [
        Paragraph("Phase & Timeline", table_header_style),
        Paragraph("Geographic Target", table_header_style),
        Paragraph("Workforce Target", table_header_style),
        Paragraph("Institutional Integration Milestones", table_header_style)
    ]
    scale_rows = [
        scale_headers,
        [
            Paragraph("<b>Phase 1: Pilot Cluster</b><br/>(Months 1 – 6)", table_cell_bold),
            Paragraph("Delhi NCR / Capital Region", table_cell_style),
            Paragraph("5,000 Technicians", table_cell_style),
            Paragraph("Deploy in 10 urban labour federations. Validate fallback state machine, dual OTP, and SOS police link.", table_cell_style)
        ],
        [
            Paragraph("<b>Phase 2: Tier-2/3 Expansion</b><br/>(Months 7 – 18)", table_cell_bold),
            Paragraph("25 Cities across 5 States", table_cell_style),
            Paragraph("50,000 Technicians", table_cell_style),
            Paragraph("Integrate with State Cooperative Boards. Launch cooperative hardware B2B network. Onboard 1,000+ NGOs.", table_cell_style)
        ],
        [
            Paragraph("<b>Phase 3: Pan-India Integration</b><br/>(Months 19 – 36)", table_cell_bold),
            Paragraph("Nationwide (All States/UTs)", table_cell_style),
            Paragraph("500,000+ Technicians", table_cell_style),
            Paragraph("Full integration with Ministry's PACS Computerization Cloud & NCDC grants. Launch PSU CSR voucher portal.", table_cell_style)
        ],
        [
            Paragraph("<b>Phase 4: National DPI</b><br/>(Months 37 – 60)", table_cell_bold),
            Paragraph("District & Block Clusters", table_cell_style),
            Paragraph("2,000,000+ Guild Members", table_cell_style),
            Paragraph("Capture institutional government maintenance contracts (Panchayats, Railways). Fulfill 'Sahakar Se Samriddhi'.", table_cell_style)
        ]
    ]
    t_scale = Table(scale_rows, colWidths=[95, 105, 95, 228.27])
    t_scale.setStyle(TableStyle([
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
    story.append(t_scale)
    story.append(Spacer(1, 8))

    # Final Summary Callout
    concl_html = (
        "<b>High-Level Design Certification:</b> The Seva Setu enterprise architecture satisfies all technical, "
        "operational, and governance requirements for a sovereign Digital Public Infrastructure (DPI). "
        "It decouples worker earnings from corporate extraction, provides zero-downtime service fallback for citizens, "
        "and equips the Ministry of Cooperation with macro-level workforce planning intelligence."
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
    print(f"HLD PDF successfully generated: {filename}")

if __name__ == '__main__':
    output_filename = "Seva_Setu_High_Level_Design_HLD_Specification.pdf"
    if len(sys.argv) > 1:
        output_filename = sys.argv[1]
    build_hld_pdf(output_filename)
