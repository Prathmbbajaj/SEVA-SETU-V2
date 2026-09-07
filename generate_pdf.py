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
    Two-pass canvas to dynamically compute and print total page count
    along with running header and running footer.
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
        
        # Omit running header on page 1 for clean cover/header feel
        if self._pageNumber > 1:
            # Running Header Top Bar
            self.setFillColor(colors.HexColor('#0f172a'))
            self.rect(36, 806, 523.27, 2, fill=True, stroke=False)
            
            self.setFont('Helvetica-Bold', 7.5)
            self.setFillColor(colors.HexColor('#1e3a8a'))
            self.drawString(36, 813, "SEVA SETU (सेवा सेतु) — 3-MINUTE OFFICIAL VIDEO SPEAKING SCRIPT")
            
            self.setFont('Helvetica-Bold', 7)
            self.setFillColor(colors.HexColor('#d97706'))
            self.drawRightString(559.27, 813, "Ministry of Cooperation | 'Seva Se Samriddhi' (SIH 2026)")

        # Running Footer
        self.setStrokeColor(colors.HexColor('#cbd5e1'))
        self.setLineWidth(0.5)
        self.line(36, 36, 559.27, 36)

        # Footer text: Left side
        self.setFont('Helvetica-Bold', 7)
        self.setFillColor(colors.HexColor('#d97706'))
        self.drawString(36, 26, "GOVERNMENT OF INDIA &bull; MINISTRY OF COOPERATION &bull; SIH 2026")

        # Footer text: Center
        self.setFont('Helvetica', 7)
        self.setFillColor(colors.HexColor('#64748b'))
        self.drawCentredString(297.63, 26, "Official Production Asset — Word-for-Word Script & Synchronization Guide")

        # Footer text: Right side (Page Number)
        self.setFont('Helvetica-Bold', 7.5)
        self.setFillColor(colors.HexColor('#1e293b'))
        self.drawRightString(559.27, 26, f"Page {self._pageNumber} of {page_count}")

        self.restoreState()


def build_pdf(filename="Seva_Setu_3Min_Video_Speaking_Script.pdf"):
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
    c_amber = colors.HexColor('#d97706')
    c_amber_light = colors.HexColor('#f59e0b')
    c_emerald = colors.HexColor('#047857')
    c_emerald_light = colors.HexColor('#10b981')
    c_slate_dark = colors.HexColor('#1e293b')
    c_slate_mid = colors.HexColor('#475569')
    c_slate_light = colors.HexColor('#f8fafc')
    c_border = colors.HexColor('#cbd5e1')
    c_indigo = colors.HexColor('#4338ca')

    # Typography Styles
    title_super = ParagraphStyle(
        'TitleSuper',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=c_amber,
        alignment=TA_LEFT,
        spaceAfter=3
    )

    title_main = ParagraphStyle(
        'TitleMain',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=c_navy,
        alignment=TA_LEFT,
        spaceAfter=3
    )

    title_sub = ParagraphStyle(
        'TitleSub',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=12.5,
        textColor=c_slate_mid,
        alignment=TA_LEFT,
        spaceAfter=7
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11.5,
        leading=14.5,
        textColor=c_navy,
        spaceBefore=8,
        spaceAfter=5,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=12.5,
        textColor=c_blue,
        spaceBefore=6,
        spaceAfter=3,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=c_slate_dark,
        spaceAfter=4
    )

    callout_style = ParagraphStyle(
        'Callout_Text',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11.5,
        textColor=colors.HexColor('#1e3a8a')
    )

    tbl_hdr = ParagraphStyle(
        'TblHdr',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.white,
        alignment=TA_LEFT
    )

    tbl_hdr_center = ParagraphStyle(
        'TblHdrCenter',
        parent=tbl_hdr,
        alignment=TA_CENTER
    )

    tbl_cell = ParagraphStyle(
        'TblCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7,
        leading=9,
        textColor=c_slate_dark
    )

    tbl_cell_bold = ParagraphStyle(
        'TblCellBold',
        parent=tbl_cell,
        fontName='Helvetica-Bold'
    )

    tbl_cell_script = ParagraphStyle(
        'TblCellScript',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7,
        leading=9.5,
        textColor=colors.HexColor('#0f172a')
    )

    tele_heading = ParagraphStyle(
        'TeleHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=c_blue,
        spaceBefore=4,
        spaceAfter=2,
        keepWithNext=True
    )

    tele_cue = ParagraphStyle(
        'TeleCue',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7,
        leading=9,
        textColor=c_amber,
        spaceAfter=2
    )

    tele_speech = ParagraphStyle(
        'TeleSpeech',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12.5,
        textColor=colors.HexColor('#090d16'),
        spaceAfter=3
    )

    story = []

    # ==================== PAGE 1: COVER & EXECUTIVE SETUP ====================
    # Tricolor Top Accent Bar
    t_tricolor = Table(
        [['', '', '']],
        colWidths=[174.42, 174.42, 174.43],
        rowHeights=[3.5]
    )
    t_tricolor.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, 0), colors.HexColor('#f59e0b')), # Saffron
        ('BACKGROUND', (1, 0), (1, 0), colors.HexColor('#ffffff')), # White
        ('BACKGROUND', (2, 0), (2, 0), colors.HexColor('#10b981')), # Green
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
    ]))
    story.append(t_tricolor)
    story.append(Spacer(1, 6))

    # Header / Title Block
    story.append(Paragraph("MINISTRY OF COOPERATION &bull; GOVERNMENT OF INDIA &bull; SMART INDIA HACKATHON 2026", title_super))
    story.append(Paragraph("SEVA SETU (सेवा सेतु) — OFFICIAL 3-MINUTE VIDEO SCRIPT", title_main))
    story.append(Paragraph(
        "<b>Word-for-Word Speaking Script, Visual Demonstration Storyboard & Synchronization Cue Sheet</b><br/>"
        "Guiding National Vision: <i>'Seva Se Samriddhi' (सेवा से समृद्धि)</i> &bull; Decentralized Platform Cooperative Gig Infrastructure",
        title_sub
    ))

    # Metadata Badges Table
    meta_data = [
        [
            Paragraph("<b>Target Duration:</b><br/>Exactly 3:00 (180s)", tbl_cell),
            Paragraph("<b>Spoken Word Count:</b><br/>406 Words", tbl_cell),
            Paragraph("<b>Speaking Pace:</b><br/>~135 words/min", tbl_cell),
            Paragraph("<b>Tone of Voice:</b><br/>Inspiring, Crisp, Authoritative", tbl_cell),
            Paragraph("<b>Production Status:</b><br/><font color='#047857'><b>Ready to Record</b></font>", tbl_cell)
        ]
    ]
    t_meta = Table(meta_data, colWidths=[104.65]*5)
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f1f5f9')),
        ('BOX', (0, 0), (-1, -1), 0.75, colors.HexColor('#cbd5e1')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#e2e8f0')),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 8))

    # Section 1: Executive Brief
    story.append(Paragraph("1. Executive Brief & Production Objectives", h1_style))
    
    callout_data = [[
        Paragraph(
            "<b>Mission & Strategic Objective:</b> This document provides the complete verbatim presentation script and live-action synchronization guide for a high-impact 3-minute video pitch of <b>Seva Setu (सेवा सेतु)</b>. Developed in collaboration with the Ministry of Cooperation under the guiding vision <i>'Seva Se Samriddhi'</i>, Seva Setu solves the dual crisis of exploitative 25-35% private platform commissions on blue-collar gig workers and excessive markups on citizens by providing a 100% fair-wage, cooperative-owned digital infrastructure across 100,000+ PACS (Primary Agricultural Credit Societies).",
            callout_style
        )
    ]]
    t_callout = Table(callout_data, colWidths=[523.27])
    t_callout.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#eff6ff')),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#93c5fd')),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(t_callout)
    story.append(Spacer(1, 8))

    # Production Specifications Grid
    guide_rows = [
        [
            Paragraph("<b>Parameter</b>", tbl_hdr),
            Paragraph("<b>Production Specification</b>", tbl_hdr),
            Paragraph("<b>Presenter Directions & Vocal Cues</b>", tbl_hdr)
        ],
        [
            Paragraph("<b>Speaking Rate</b>", tbl_cell_bold),
            Paragraph("130 – 140 words per minute.<br/>Total script: <b>406 words</b> = 2 min 55 sec of continuous speech + 5 sec intentional pauses.", tbl_cell),
            Paragraph("Deliver with an energetic, authoritative, and confident cadence. Do not rush. Let key policy and technical milestones resonate.", tbl_cell)
        ],
        [
            Paragraph("<b>Screen Capture</b>", tbl_cell_bold),
            Paragraph("1080p (1920x1080) or 4K, 60fps.<br/>Browser zoom: 100% or 110% for crisp UI readability.", tbl_cell),
            Paragraph("Keep Seva Setu running live in browser. Seamlessly switch between the 3 main portals: <i>Citizen App</i>, <i>Worker Radar</i>, and <i>Ministry Cockpit</i>.", tbl_cell)
        ],
        [
            Paragraph("<b>Audio & SFX</b>", tbl_cell_bold),
            Paragraph("High-clarity cardioid voiceover microphone.<br/>Background track: Subtle, modern acoustic-electronic pulse.", tbl_cell),
            Paragraph("Enable Web Audio sound effects in Seva Setu (top right volume toggle). Tactile clicks, emergency sirens, and radar pings reinforce authenticity.", tbl_cell)
        ],
        [
            Paragraph("<b>Key Pronunciations</b>", tbl_cell_bold),
            Paragraph("<b>Seva Setu:</b> <i>'Say-va Say-too'</i><br/><b>PACS:</b> <i>'Packs'</i><br/><b>Samriddhi:</b> <i>'Sam-rid-dhee'</i>", tbl_cell),
            Paragraph("Speak Hindi and Sanskrit-rooted terms with natural dignity and pride. Highlight phrases like <i>'Zero Aggregator Commission'</i> and <i>'100% Direct Fair Wage'</i>.", tbl_cell)
        ],
        [
            Paragraph("<b>Pacing Markers</b>", tbl_cell_bold),
            Paragraph("The script contains <b>[PAUSE 1s]</b> cues at beat boundaries.<br/>Allows visual screencast transitions without audio clipping.", tbl_cell),
            Paragraph("Breathe naturally at section breaks. Smile slightly while introducing the national vision to convey optimism and civic pride.", tbl_cell)
        ]
    ]
    t_guide = Table(guide_rows, colWidths=[95, 210, 218.27])
    t_guide.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_navy),
        ('BOX', (0, 0), (-1, -1), 0.5, c_border),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8fafc')]),
        ('TOPPADDING', (0, 0), (-1, -1), 3.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_guide)
    story.append(Spacer(1, 8))

    # Architecture Overview Callout Box on Page 1
    p1_summary = [
        [
            Paragraph("<b>3-Minute Story Arc:</b>", tbl_cell_bold),
            Paragraph("<b>0:00 - 0:30:</b> Crisis & Solution &bull; <b>0:30 - 1:05:</b> Citizen Portal & Direct Bill &bull; <b>1:05 - 1:40:</b> Worker Radar & Fallback &bull; <b>1:40 - 2:15:</b> Dual-OTP & AI OCR &bull; <b>2:15 - 2:45:</b> Ministry Cockpit & Scale &bull; <b>2:45 - 3:00:</b> Impact & Visionary Call", tbl_cell)
        ]
    ]
    t_p1_sum = Table(p1_summary, colWidths=[100, 423.27])
    t_p1_sum.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#fef3c7')),
        ('BOX', (0, 0), (-1, -1), 0.75, colors.HexColor('#f59e0b')),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(t_p1_sum)

    # ==================== PAGE 2 & 3: BEAT-BY-BEAT STORYBOARD TABLE ====================
    story.append(PageBreak()) # Clean break to start Storyboard at top of Page 2
    story.append(Paragraph("2. Beat-by-Beat Video Production Storyboard (180 Seconds)", h1_style))
    story.append(Paragraph("This production storyboard coordinates exact screen screencasts, auditory soundscapes, verbatim speaking lines, and on-screen graphics (OSGs) across all six video segments.", body_style))
    story.append(Spacer(1, 4))

    storyboard_rows = [
        [
            Paragraph("<b>Timestamp & Beat</b>", tbl_hdr_center),
            Paragraph("<b>Visual Demonstration & Screen Action</b>", tbl_hdr),
            Paragraph("<b>Audio / SFX</b>", tbl_hdr),
            Paragraph("<b>Word-for-Word Spoken Script (Verbatim)</b>", tbl_hdr),
            Paragraph("<b>On-Screen Graphics & Text</b>", tbl_hdr)
        ],
        # SCENE 1
        [
            Paragraph("<b>BEAT 1</b><br/>0:00 – 0:30<br/>(30 sec)<br/><br/><font color='#d97706'><b>The Problem & The Hook</b></font><br/><br/><i>68 words</i>", tbl_cell_bold),
            Paragraph("<b>0:00 - 0:12:</b> Quick split-screen graphic: Commercial gig aggregators highlighting '25-35% Commission Deduction' & 'Hidden Surge Fees'.<br/><br/><b>0:12 - 0:30:</b> Camera sweeps into Seva Setu live web app. Zoom in on Ministry of Cooperation header emblem & national tricolor ribbon.", tbl_cell),
            Paragraph("<b>0:00:</b> Low dramatic synth pulse.<br/><br/><b>0:08:</b> Warning buzzer on corporate commission cut.<br/><br/><b>0:15:</b> Uplifting melodic chime as Seva Setu UI loads.", tbl_cell),
            Paragraph('"Today, corporate gig platforms charge Indian households steep markups while extracting up to <b>thirty-five percent</b> in unfair commissions from hardworking blue-collar workers.<br/><br/>Welcome to <b>Seva Setu</b>—India’s decentralized cooperative gig platform, built in collaboration with the Ministry of Cooperation under the national vision <b>\'Seva Se Samriddhi\'</b>.<br/><br/>We eliminate exploitative middlemen, returning <b>one hundred percent</b> of earned wages directly to certified grassroots workers and Primary Agricultural Credit Societies."', tbl_cell_script),
            Paragraph("<b>Lower Third:</b><br/>SEVA SETU (सेवा सेतु)<br/>Cooperative Gig Platform<br/><br/><b>Stat Pill:</b><br/>0% Platform Markup<br/>100% Direct Fair Wage", tbl_cell)
        ],
        # SCENE 2
        [
            Paragraph("<b>BEAT 2</b><br/>0:30 – 1:05<br/>(35 sec)<br/><br/><font color='#1e3a8a'><b>Citizen Portal & Wage Bill</b></font><br/><br/><i>83 words</i>", tbl_cell_bold),
            Paragraph("<b>0:30 - 0:42:</b> Citizen Portal. Presenter clicks <b>Speak</b> (voice mic icon); speaks Hindi query. Search filters instantaneously.<br/><br/><b>0:42 - 0:52:</b> Scrolls through 12 trades, highlighting traditional artisans (Pottery, Blacksmithing, Carpentry) and toggles <b>Emergency Triage SOS</b>.<br/><br/><b>0:52 - 1:05:</b> Clicks service; camera zooms into <b>Transparent Direct Wage Bill</b> breakdown.", tbl_cell),
            Paragraph("<b>0:32:</b> Voice recognition listening ping.<br/><br/><b>0:45:</b> Emergency SOS siren alert sound.<br/><br/><b>0:55:</b> Tactile calculation slide sound as invoice itemizes.", tbl_cell),
            Paragraph('"On the Citizen Portal, finding help is seamless. Citizens can type or use multilingual voice search in English and Hindi to book twelve essential trades—from electricians and elder healthcare to heritage artisans like potters, blacksmiths, and handloom weavers.<br/><br/>Need urgent help? Toggle <b>Emergency Triage</b> for sub-thirty-minute arrival.<br/><br/>Every booking features our <b>Transparent Direct Wage Bill</b>: completely itemized labor, toolkit allowance, and fuel transit with a fixed <b>three-point-five percent</b> cooperative welfare cess—guaranteeing zero hidden platform markups and fifty percent citizen savings."', tbl_cell_script),
            Paragraph("<b>Callout Badge:</b><br/>12 Certified Trades<br/>Voice-First AI Search<br/><br/><b>Invoice Callout:</b><br/>Labor: 100% Direct<br/>Welfare Cess: 3.5%<br/>Aggregator Cut: ₹0.00", tbl_cell)
        ],
        # SCENE 3
        [
            Paragraph("<b>BEAT 3</b><br/>1:05 – 1:40<br/>(35 sec)<br/><br/><font color='#047857'><b>Worker Radar & Geo-Dispatch</b></font><br/><br/><i>78 words</i>", tbl_cell_bold),
            Paragraph("<b>1:05 - 1:18:</b> Click <b>Worker Radar</b> tab. Live Leaflet map with pulsing radar circles centered on technician location. An incoming job broadcast dialog pops up with sound.<br/><br/><b>1:18 - 1:30:</b> Payout displays <b>₹280 take-home (0% commission)</b>. Presenter demonstrates 1-click reject to show automated fallback reassigning to Worker #2.<br/><br/><b>1:30 - 1:40:</b> Shows Worker Digital Passbook & PACS welfare ledger.", tbl_cell),
            Paragraph("<b>1:06:</b> High-tech sonar radar audio loop.<br/><br/><b>1:12:</b> Incoming job ping sound.<br/><br/><b>1:24:</b> Swift re-routing whoosh as fallback engine kicks in.", tbl_cell),
            Paragraph('"Switching to the <b>Worker Radar</b>, our geo-dispatch engine broadcasts incoming tasks to certified cooperative technicians within dynamic proximity radii.<br/><br/>Workers see the exact transparent payout before accepting. There are no commission clawbacks—what you earn is <b>one hundred percent</b> what you keep.<br/><br/>If a technician is unavailable, our automated fallback engine instantly re-routes the task to the next closest qualified member without leaving citizens stranded.<br/><br/>Every worker is backed by a verified digital passbook and cooperative welfare coverage."', tbl_cell_script),
            Paragraph("<b>Lower Third:</b><br/>Rapido-Style Radar<br/>Automated Fallback Engine<br/><br/><b>Stat Pill:</b><br/>Radius: Dynamic 25km<br/>Commission: ZERO", tbl_cell)
        ],
        # SCENE 4
        [
            Paragraph("<b>BEAT 4</b><br/>1:40 – 2:15<br/>(35 sec)<br/><br/><font color='#4338ca'><b>Dual-OTP & AI OCR Vault</b></font><br/><br/><i>74 words</i>", tbl_cell_bold),
            Paragraph("<b>1:40 - 1:55:</b> Split screen of Citizen & Worker verification desk. Enter 4-digit <b>START_OTP</b> upon arrival. Then complete job, upload photo proof, and enter <b>END_OTP</b>.<br/><br/><b>1:55 - 2:15:</b> Navigate to <b>AI Document Verification Desk</b>. Upload ITI / Skill India certificate. <b>Gemini 1.5 Flash</b> multimodal OCR instantly extracts data and displays green verification checkmark.", tbl_cell),
            Paragraph("<b>1:44:</b> Digital keypad tap tones.<br/><br/><b>1:53:</b> Positive cash register chime (escrow unlocked).<br/><br/><b>2:04:</b> Laser document scanner shimmer sound.", tbl_cell),
            Paragraph('"Trust is secured cryptographically through our <b>Dual-OTP Workflow</b>. Upon physical arrival, the technician validates a four-digit <b>START_OTP</b>, preventing ghost billing.<br/><br/>Once work is finished, the citizen provides an <b>END_OTP</b> alongside photo completion proof, instantly unlocking escrow funds into the worker’s account.<br/><br/>Onboarding is equally rigorous: our <b>Gemini 1.5 Flash Multimodal OCR</b> automatically audits government Aadhaar and ITI or Skill India trade credentials directly against cooperative registers within seconds."', tbl_cell_script),
            Paragraph("<b>Security Graphic:</b><br/>Dual-OTP Escrow Lock<br/>Photo Proof Verification<br/><br/><b>AI Graphic:</b><br/>Gemini 1.5 Flash OCR<br/>Instant Aadhaar & ITI Audit", tbl_cell)
        ],
        # SCENE 5
        [
            Paragraph("<b>BEAT 5</b><br/>2:15 – 2:45<br/>(30 sec)<br/><br/><font color='#d97706'><b>Ministry Cockpit & Scale</b></font><br/><br/><i>71 words</i>", tbl_cell_bold),
            Paragraph("<b>2:15 - 2:30:</b> Click <b>Ministry Cockpit</b> tab. Live national telemetry: ₹4.8M wages disbursed, citizen savings tracker, district skill shortage heatmaps.<br/><br/><b>2:30 - 2:45:</b> Architecture overlay graphic displaying <b>PostGIS</b>, <b>Uber H3 Hexagons</b>, <b>Redis Streams</b>, and Autonomous Edge Resilient Engine.", tbl_cell),
            Paragraph("<b>2:16:</b> Deep telemetry sweep audio.<br/><br/><b>2:30:</b> Upbeat analytical data flow sound effect.<br/><br/><b>2:40:</b> Electronic bass roll.", tbl_cell),
            Paragraph('"For policymakers, the <b>Ministry Cockpit</b> provides real-time telemetry across registered cooperatives nationwide.<br/><br/>District heatmaps track skill shortages and service demand, enabling targeted vocational training where communities need it most.<br/><br/>Architected for nationwide scale across one hundred thousand PACS, Seva Setu uses <b>PostGIS</b> spatial indexing, <b>Uber H3</b> hexagonal grids, and <b>Redis streams</b>—backed by an autonomous edge engine that functions flawlessly even during rural connectivity dropouts."', tbl_cell_script),
            Paragraph("<b>Dashboard Telemetry:</b><br/>100,000+ PACS Network<br/>₹4.8M Direct DBT Disbursed<br/><br/><b>Tech Stack:</b><br/>PostGIS &bull; Uber H3 &bull; Redis", tbl_cell)
        ],
        # SCENE 6
        [
            Paragraph("<b>BEAT 6</b><br/>2:45 – 3:00<br/>(15 sec)<br/><br/><font color='#047857'><b>Impact & Visionary Call</b></font><br/><br/><i>32 words</i>", tbl_cell_bold),
            Paragraph("<b>2:45 - 2:54:</b> Fast dynamic collage of empowered Indian technicians, smiling artisans, and satisfied citizens using the app.<br/><br/><b>2:54 - 3:00:</b> Majestic closing title card: Seva Setu logo, Government of India emblem, BharatPay QR, and official motto: <i>'Seva Se Samriddhi'</i>.", tbl_cell),
            Paragraph("<b>2:45:</b> Inspiring orchestral crescendo.<br/><br/><b>2:57:</b> Resonant, warm concluding chime.", tbl_cell),
            Paragraph('"Seva Setu transforms vulnerable gig labor into empowered cooperative equity—delivering dignified livelihoods for workers and reliable, honest services for citizens.<br/><br/><b>Seva Setu: Empowering grassroots cooperatives. Seva Se Samriddhi!</b>"', tbl_cell_script),
            Paragraph("<b>Closing Screen:</b><br/>SEVA SETU (सेवा सेतु)<br/>Seva Se Samriddhi<br/>Ministry of Cooperation, GoI<br/>SIH 2026", tbl_cell)
        ]
    ]

    t_storyboard = Table(storyboard_rows, colWidths=[70, 115, 78, 165, 95.27], repeatRows=1)
    t_storyboard.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_navy),
        ('BOX', (0, 0), (-1, -1), 0.5, c_border),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8fafc')]),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 3.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 4.5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4.5),
    ]))
    story.append(t_storyboard)
    story.append(Spacer(1, 10))

    # ==================== PAGE 4 & 5: TELEPROMPTER SCRIPT ====================
    story.append(PageBreak()) # Clean break for Teleprompter section
    story.append(Paragraph("3. Teleprompter-Ready Continuous Speaking Script", h1_style))
    story.append(Paragraph(
        "<i>This continuous transcript is formatted specifically for the presenter or voiceover artist. It includes stage directions [IN BRACKETS], breathing pauses, pronunciation guides, and bolded anchor terms for vocal emphasis. Total spoken word count: exactly <b>406 words</b> (~2m 55s at 135 WPM).</i>",
        body_style
    ))
    story.append(Spacer(1, 6))

    tele_sections = [
        (
            "SCENE 1: THE CRISIS & THE COOPERATIVE VISION (0:00 - 0:30 | 30 Seconds | 68 Words)",
            "[ACTION: Split screen of commercial gig fee deductions -> Cut to Seva Setu live home screen with Ministry emblem]<br/>"
            "[AUDIO: Modern ambient synth pulse, soft warning buzzer -> resolving to clear GovTech chime]",
            'Today, corporate gig platforms charge Indian households steep markups while extracting up to <b>thirty-five percent</b> in unfair commissions from hardworking blue-collar workers. [PAUSE 1s]<br/><br/>'
            'Welcome to <b>Seva Setu</b> [PRONOUNCED: <i>Say-va Say-too</i>]—India’s decentralized cooperative gig platform, built in collaboration with the Ministry of Cooperation under the national vision <b>\'Seva Se Samriddhi\'</b> [PRONOUNCED: <i>Say-va Say Sam-rid-dhee</i>]. [PAUSE 1s]<br/><br/>'
            'We eliminate exploitative middlemen, returning <b>one hundred percent</b> of earned wages directly to certified grassroots workers and Primary Agricultural Credit Societies [PRONOUNCED: <i>Packs</i>].'
        ),
        (
            "SCENE 2: CITIZEN APP — VOICE SEARCH, ARTISANS & DIRECT WAGE BILL (0:30 - 1:05 | 35 Seconds | 83 Words)",
            "[ACTION: Click 'Speak' microphone icon -> Voice wave activates -> Show 12 trade categories -> Toggle Emergency Triage SOS -> Zoom into itemized bill]<br/>"
            "[AUDIO: Voice recognition chirp -> Emergency siren pulse -> Smooth slider chime]",
            'On the Citizen Portal, finding help is seamless. Citizens can type or use multilingual voice search in English and Hindi to book <b>twelve essential trades</b>—from electricians and elder healthcare to heritage artisans like potters, blacksmiths, and handloom weavers. [PAUSE 1s]<br/><br/>'
            'Need urgent help? Toggle <b>Emergency Triage</b> for sub-thirty-minute arrival. [PAUSE 1s]<br/><br/>'
            'Every booking features our <b>Transparent Direct Wage Bill</b>: completely itemized labor, toolkit allowance, and fuel transit with a fixed <b>three-point-five percent</b> cooperative welfare cess—guaranteeing zero hidden platform markups and <b>fifty percent</b> citizen savings.'
        ),
        (
            "SCENE 3: WORKER RADAR — PROXIMITY DISPATCH & FALLBACK ENGINE (1:05 - 1:40 | 35 Seconds | 78 Words)",
            "[ACTION: Click 'Worker Radar' top tab -> Radar animation sweeps on map -> Broadcast popup alerts worker -> Show ₹280 payout -> Click Decline to trigger instant fallback]<br/>"
            "[AUDIO: High-tech radar sonar ping -> Incoming broadcast tone -> Smooth re-routing sound]",
            'Switching to the <b>Worker Radar</b>, our geo-dispatch engine broadcasts incoming tasks to certified cooperative technicians within dynamic proximity radii. [PAUSE 1s]<br/><br/>'
            'Workers see the exact transparent payout before accepting. There are no commission clawbacks—what you earn is <b>one hundred percent</b> what you keep! [PAUSE 1s]<br/><br/>'
            'If a technician is unavailable, our automated fallback engine instantly re-routes the task to the next closest qualified member without leaving citizens stranded. [PAUSE 1s]<br/><br/>'
            'Every worker is backed by a verified digital passbook and cooperative welfare coverage.'
        ),
        (
            "SCENE 4: TRUST PROTOCOLS — DUAL-OTP & MULTIMODAL AI OCR (1:40 - 2:15 | 35 Seconds | 74 Words)",
            "[ACTION: Show Citizen & Worker OTP entry -> Input START_OTP -> Upload photo completion proof -> Enter END_OTP -> Switch to Gemini AI Document Verification Desk]<br/>"
            "[AUDIO: Keypad click tones -> Cash register escrow release chime -> Laser scan shimmer]",
            'Trust is secured cryptographically through our <b>Dual-OTP Workflow</b>. Upon physical arrival, the technician validates a four-digit <b>START_OTP</b>, preventing ghost billing. [PAUSE 1s]<br/><br/>'
            'Once work is finished, the citizen provides an <b>END_OTP</b> alongside photo completion proof, instantly unlocking escrow funds into the worker’s account. [PAUSE 1s]<br/><br/>'
            'Onboarding is equally rigorous: our <b>Gemini 1.5 Flash Multimodal OCR</b> automatically audits government Aadhaar and ITI or Skill India trade credentials directly against cooperative registers within seconds.'
        ),
        (
            "SCENE 5: GOVERNANCE AT SCALE — MINISTRY COCKPIT & ARCHITECTURE (2:15 - 2:45 | 30 Seconds | 71 Words)",
            "[ACTION: Click 'Ministry Cockpit' tab -> Telemetry dashboard scrolls: ₹4.8M disbursed, heatmap updates -> Transition to architectural tech stack diagram]<br/>"
            "[AUDIO: Data dashboard telemetry hum -> Sub-bass riser tone]",
            'For policymakers, the <b>Ministry Cockpit</b> provides real-time telemetry across registered cooperatives nationwide. [PAUSE 1s]<br/><br/>'
            'District heatmaps track skill shortages and service demand, enabling targeted vocational training where communities need it most. [PAUSE 1s]<br/><br/>'
            'Architected for nationwide scale across <b>one hundred thousand PACS</b>, Seva Setu uses <b>PostGIS</b> spatial indexing, <b>Uber H3</b> hexagonal grids, and <b>Redis streams</b>—backed by an autonomous edge engine that functions flawlessly even during rural connectivity dropouts.'
        ),
        (
            "SCENE 6: VISIONARY CONCLUSION & NATIONAL CALL TO ACTION (2:45 - 3:00 | 15 Seconds | 32 Words)",
            "[ACTION: Montage of smiling Indian technicians holding passbooks -> Cut to official Government of India closing slide with BharatPay QR and emblem]<br/>"
            "[AUDIO: Inspiring, majestic orchestral crescendo with warm closing cadence]",
            'Seva Setu transforms vulnerable gig labor into empowered cooperative equity—delivering dignified livelihoods for workers and reliable, honest services for citizens. [PAUSE 1s]<br/><br/>'
            '<b>Seva Setu: Empowering grassroots cooperatives. Seva Se Samriddhi!</b>"'
        )
    ]

    for title, cues, speech in tele_sections:
        t_box = [
            [Paragraph(f"<b>{title}</b>", tele_heading)],
            [Paragraph(cues, tele_cue)],
            [Paragraph(speech, tele_speech)]
        ]
        t_elem = Table(t_box, colWidths=[523.27])
        t_elem.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#fcfdfe')),
            ('BOX', (0, 0), (-1, -1), 0.75, colors.HexColor('#cbd5e1')),
            ('LINEBELOW', (0, 0), (-1, 0), 0.5, colors.HexColor('#e2e8f0')),
            ('TOPPADDING', (0, 0), (-1, -1), 3.5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 3.5),
            ('LEFTPADDING', (0, 0), (-1, -1), 7),
            ('RIGHTPADDING', (0, 0), (-1, -1), 7),
        ]))
        story.append(t_elem)
        story.append(Spacer(1, 4))

    # ==================== PAGE 6: SCREEN RECORDING SYNC CUE SHEET ====================
    story.append(PageBreak()) # Clean break for Screen Recording Guide
    story.append(Paragraph("4. Screen Recording Synchronization Cue Sheet", h1_style))
    story.append(Paragraph(
        "<i>This cue sheet coordinates the exact live browser interactions during screencasting. Have Seva Setu opened in a browser window and execute each trigger at the corresponding timestamp to achieve synchronization with the voiceover.</i>",
        body_style
    ))
    story.append(Spacer(1, 4))

    sync_rows = [
        [
            Paragraph("<b>Exact Time</b>", tbl_hdr_center),
            Paragraph("<b>Presenter Voiceover Anchor Point</b>", tbl_hdr),
            Paragraph("<b>Operator Browser Interaction (Live Demo)</b>", tbl_hdr),
            Paragraph("<b>Success Indicator on Screen</b>", tbl_hdr)
        ],
        [
            Paragraph("<b>0:00 - 0:10</b>", tbl_cell_bold),
            Paragraph('"Today, corporate gig platforms charge..."', tbl_cell),
            Paragraph("Display opening title slide or split-screen infographic.", tbl_cell),
            Paragraph("Clear comparison between 35% cut vs 0% cut.", tbl_cell)
        ],
        [
            Paragraph("<b>0:11 - 0:29</b>", tbl_cell_bold),
            Paragraph('"Welcome to Seva Setu... returning 100%..."', tbl_cell),
            Paragraph("Switch to Seva Setu browser window. Hover on top ministry header.", tbl_cell),
            Paragraph("Header shows 'Seva Se Samriddhi' & SIH 2026 badge.", tbl_cell)
        ],
        [
            Paragraph("<b>0:30 - 0:40</b>", tbl_cell_bold),
            Paragraph('"Citizens can type or use multilingual voice..."', tbl_cell),
            Paragraph("Click <b>Speak</b> button (or type 'Electrician' in search bar).", tbl_cell),
            Paragraph("Mic pulse animates; services filter in real-time.", tbl_cell)
        ],
        [
            Paragraph("<b>0:41 - 0:50</b>", tbl_cell_bold),
            Paragraph('"from electricians... to heritage artisans..."', tbl_cell),
            Paragraph("Click <b>Show All 12 Services</b> to reveal Pottery, Blacksmith, Carpentry.", tbl_cell),
            Paragraph("All 12 cooperative trades displayed with fair rates.", tbl_cell)
        ],
        [
            Paragraph("<b>0:51 - 1:04</b>", tbl_cell_bold),
            Paragraph('"Transparent Direct Wage Bill... 3.5% cess..."', tbl_cell),
            Paragraph("Toggle <b>Emergency Triage</b>, select service, scroll to invoice.", tbl_cell),
            Paragraph("Itemized bill shows: Base Labor, Fuel, Cess, 0% Markup.", tbl_cell)
        ],
        [
            Paragraph("<b>1:05 - 1:20</b>", tbl_cell_bold),
            Paragraph('"Switching to the Worker Radar... dynamic radii..."', tbl_cell),
            Paragraph("Click <b>Worker Radar</b> tab in top nav. Radar animation pulses.", tbl_cell),
            Paragraph("Leaflet map renders with technician radar waves.", tbl_cell)
        ],
        [
            Paragraph("<b>1:21 - 1:39</b>", tbl_cell_bold),
            Paragraph('"automated fallback engine instantly re-routes..."', tbl_cell),
            Paragraph("Show incoming job dialog (₹280 take-home). Click <b>Reject</b>.", tbl_cell),
            Paragraph("Fallback alert triggers; job reassigns to Worker #2.", tbl_cell)
        ],
        [
            Paragraph("<b>1:40 - 1:53</b>", tbl_cell_bold),
            Paragraph('"Trust is secured... Dual-OTP Workflow..."', tbl_cell),
            Paragraph("Demonstrate <b>START_OTP</b> entry on arrival screen.", tbl_cell),
            Paragraph("Lock unlocks, status turns to 'IN PROGRESS'.", tbl_cell)
        ],
        [
            Paragraph("<b>1:54 - 2:04</b>", tbl_cell_bold),
            Paragraph('"photo completion proof, instantly unlocking escrow..."', tbl_cell),
            Paragraph("Enter <b>END_OTP</b>, upload photo proof, click Settle.", tbl_cell),
            Paragraph("Payment settled green banner; BharatPay QR displayed.", tbl_cell)
        ],
        [
            Paragraph("<b>2:05 - 2:14</b>", tbl_cell_bold),
            Paragraph('"Gemini 1.5 Flash Multimodal OCR automatically audits..."', tbl_cell),
            Paragraph("Click <b>AI Document Desk</b>. Click sample certificate scan.", tbl_cell),
            Paragraph("Gemini OCR extracts JSON: Name, Skill, Aadhaar verified.", tbl_cell)
        ],
        [
            Paragraph("<b>2:15 - 2:30</b>", tbl_cell_bold),
            Paragraph('"For policymakers, the Ministry Cockpit..."', tbl_cell),
            Paragraph("Click <b>Ministry Cockpit</b> tab. Pan over live counters & heatmap.", tbl_cell),
            Paragraph("Live counters: ₹4.8M disbursed, district shortage alerts.", tbl_cell)
        ],
        [
            Paragraph("<b>2:31 - 2:44</b>", tbl_cell_bold),
            Paragraph('"PostGIS spatial indexing, Uber H3... Redis streams..."', tbl_cell),
            Paragraph("Scroll to Architecture section or show system architecture slide.", tbl_cell),
            Paragraph("High-concurrency flow: Redis Redlock, Edge Offline.", tbl_cell)
        ],
        [
            Paragraph("<b>2:45 - 3:00</b>", tbl_cell_bold),
            Paragraph('"Seva Setu transforms vulnerable gig labor... Samriddhi!"', tbl_cell),
            Paragraph("Transition to closing slide with GoI seal & BharatPay QR.", tbl_cell),
            Paragraph("Official logo, National motto: 'Seva Se Samriddhi'.", tbl_cell)
        ]
    ]

    t_sync = Table(sync_rows, colWidths=[65, 145, 185, 128.27])
    t_sync.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_navy),
        ('BOX', (0, 0), (-1, -1), 0.5, c_border),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8fafc')]),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_sync)
    story.append(Spacer(1, 10))

    # ==================== PAGE 7: TECHNICAL FORMULATIONS & OFFICIAL SIGN-OFF ====================
    story.append(PageBreak()) # Clean break for Technical Highlights & Sign-off
    story.append(Paragraph("5. Architectural Formulations & Defense Soundbites", h1_style))
    story.append(Paragraph(
        "<i>These mathematical formulations, system diagrams, and soundbites arm the presenter with deep technical authority during jury evaluations or post-presentation Q&A:</i>",
        body_style
    ))
    story.append(Spacer(1, 4))

    tech_points = [
        [
            Paragraph("<b>Core Pillar</b>", tbl_hdr),
            Paragraph("<b>Mathematical Model / Technical Architecture</b>", tbl_hdr),
            Paragraph("<b>Value Proposition & Constitutional Rationale</b>", tbl_hdr)
        ],
        [
            Paragraph("<b>Fair-Wage Pricing Engine</b><br/><i>(pricing.py)</i>", tbl_cell_bold),
            Paragraph("<b>Formula:</b><br/>Fare = (Labor<sub>base</sub> + Toolkit + Transit<sub>geo</sub> + Surcharge + Tax + Cess<sub>3.5%</sub>) &times; (1 - Subsidy<sub>NGO</sub>)<br/><b>Haversine Transit:</b> max(₹20, Distance<sub>km</sub> &times; ₹8/km)", tbl_cell),
            Paragraph("Ensures 100% of the labor fee goes to the worker with zero platform markups. Citizens save 50-58% compared to corporate aggregators while 3.5% builds a grassroots welfare fund.", tbl_cell)
        ],
        [
            Paragraph("<b>Rapido-Style Radar & Fallback</b><br/><i>(dispatch.py)</i>", tbl_cell_bold),
            Paragraph("Dynamic radius broadcast (up to 25km) over Redis Streams with 30s candidate timeout state machine and Redlock distributed locks.<br/><b>Score:</b> &alpha;&middot;(1/(1+D)) + &beta;&middot;(Rating/5) + &gamma;&middot;Reliability", tbl_cell),
            Paragraph("Eliminates single points of failure. If a technician rejects or misses a request within 30 seconds, the engine autonomously reassigns the booking to the next closest qualified technician.", tbl_cell)
        ],
        [
            Paragraph("<b>Dual-OTP Escrow Security</b>", tbl_cell_bold),
            Paragraph("<b>START_OTP</b> (4 digits): Cryptographic proof of arrival.<br/><b>END_OTP</b> (4 digits) + Photographic proof upload: Released to unlock instant DBT settlement to worker passbook.", tbl_cell),
            Paragraph("Completely eliminates ghost billing, arbitrary cancellations, and delayed payouts. Both citizen and technician are protected by atomic zero-cash escrow guarantees.", tbl_cell)
        ],
        [
            Paragraph("<b>Multimodal AI Credential Vault</b><br/><i>(ai_ocr.py)</i>", tbl_cell_bold),
            Paragraph("Powered by <b>Gemini 1.5 Flash Multimodal OCR</b>.<br/>Extracts name, skill trade, certificate serial number, and Aadhaar from images with strict structured JSON schema validation.", tbl_cell),
            Paragraph("Automates nationwide vocational onboarding for 100,000+ PACS without requiring manual administrative bottlenecks, verifying ITI, NSDC, and KVIC credentials in under 2 seconds.", tbl_cell)
        ],
        [
            Paragraph("<b>National Scale & Edge Resilience</b>", tbl_cell_bold),
            Paragraph("PostGIS GIST spatial indexing + <b>Uber H3 Hexagonal Grids</b> (Res 8) + Redis Streams for concurrency + Autonomous Edge-Resilient PWA engine with local heuristic fallback.", tbl_cell),
            Paragraph("Guarantees 100% offline uptime even in rural Bharat where cellular connectivity drops. The edge engine computes fares locally and syncs back when connectivity restores.", tbl_cell)
        ]
    ]

    t_tech = Table(tech_points, colWidths=[105, 205, 213.27])
    t_tech.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), c_navy),
        ('BOX', (0, 0), (-1, -1), 0.5, c_border),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8fafc')]),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 3.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_tech)
    story.append(Spacer(1, 12))

    # Concluding Official Sign-Off Block
    story.append(Paragraph("<b>Official Production Authorization & Endorsement Block:</b>", h2_style))
    sign_block = [
        [
            Paragraph("<b>Project Initiative:</b> Seva Setu (सेवा सेतु) &bull; Smart India Hackathon 2026", tbl_cell),
            Paragraph("<b>Ministry Collaboration:</b> Ministry of Cooperation, Government of India", tbl_cell)
        ],
        [
            Paragraph("<b>Target Audience:</b> SIH Evaluation Jury, Technologists, Cooperative Leaders", tbl_cell),
            Paragraph("<b>Deployment Infrastructure:</b> High-Availability Cloud Gateway + Edge PWA", tbl_cell)
        ],
        [
            Paragraph("<b>Lead Presenter:</b> Pratham Bajaj & Team Seva Setu", tbl_cell),
            Paragraph("<b>National Creed:</b> <i>'Seva Se Samriddhi' (सेवा से समृद्धि)</i>", tbl_cell)
        ]
    ]
    t_sign = Table(sign_block, colWidths=[260, 263.27])
    t_sign.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f1f5f9')),
        ('BOX', (0, 0), (-1, -1), 0.75, colors.HexColor('#94a3b8')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(t_sign)

    # Build Document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated PDF: {filename}")

if __name__ == '__main__':
    output_filename = "Seva_Setu_3Min_Video_Speaking_Script.pdf"
    build_pdf(output_filename)
