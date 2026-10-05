"""
Seed data for Seva Setu Prototype: Cooperatives, Workers, and Sample Metrics.
"""
from typing import List, Dict, Any

COOPERATIVES: List[Dict[str, Any]] = [
    {
        "id": 1,
        "name": "Delhi Central Labour Cooperative Federation",
        "reg_no": "DL/PACS/2021/8892",
        "district": "Central Delhi",
        "state": "Delhi",
        "active_workers": 240
    },
    {
        "id": 2,
        "name": "South Delhi Multi-Purpose Cooperative Society",
        "reg_no": "DL/PACS/2019/4321",
        "district": "South Delhi",
        "state": "Delhi",
        "active_workers": 185
    },
    {
        "id": 3,
        "name": "NCR Technicians & Artisans Cooperative",
        "reg_no": "NCR/COOP/2022/1045",
        "district": "East Delhi",
        "state": "Delhi",
        "active_workers": 130
    }
]

# Workers with real coordinates around Central & South Delhi
WORKERS: List[Dict[str, Any]] = [
    {
        "id": 101,
        "name": "Rajesh Kumar",
        "phone": "+91 98765 43210",
        "skill": "electrician",
        "trade": "Electrician",
        "coop_id": 1,
        "coop_name": "Delhi Central Labour Coop",
        "coop_ac": "COOP-DL-2024-001",
        "lat": 28.6328,
        "lng": 77.2197, # Connaught Place
        "coords": [28.6328, 77.2197],
        "is_available": True,
        "is_verified": True,
        "rating": 4.9,
        "aadhaar": "XXXX-XXXX-8921",
        "certificate": "ITI National Trade Certificate (Electrician - Grade A)",
        "cert_title": "ITI Electrician National Trade Certificate (Grade A)",
        "cert_issuer": "National Council for Vocational Training (NCVT)",
        "completed_jobs": 142,
        "total_earned": 68400.0,
        "today_wage": 2840.0,
        "photo": "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": 102,
        "name": "Mohammad Aslam",
        "phone": "+91 98111 22334",
        "skill": "plumber",
        "trade": "Plumber",
        "coop_id": 1,
        "coop_name": "Delhi Central Labour Coop",
        "coop_ac": "COOP-DL-2024-002",
        "lat": 28.6506,
        "lng": 77.1906, # Karol Bagh
        "coords": [28.6506, 77.1906],
        "is_available": True,
        "is_verified": True,
        "rating": 4.8,
        "aadhaar": "XXXX-XXXX-4532",
        "certificate": "Skill India Sanitary & Plumbing Level 4",
        "cert_title": "Sanitary & Advanced Plumbing Guild Certificate",
        "cert_issuer": "Indian Plumbing Skills Council (IPSC)",
        "completed_jobs": 98,
        "total_earned": 45200.0,
        "today_wage": 1950.0,
        "photo": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": 103,
        "name": "Sunita Sharma",
        "phone": "+91 98733 90812",
        "skill": "tailoring",
        "trade": "Tailoring & Apparel",
        "coop_id": 2,
        "coop_name": "South Delhi Multi-Purpose Coop",
        "coop_ac": "COOP-DL-2024-003",
        "lat": 28.5700,
        "lng": 77.2400, # Lajpat Nagar
        "coords": [28.5700, 77.2400],
        "is_available": True,
        "is_verified": True,
        "rating": 5.0,
        "aadhaar": "XXXX-XXXX-1190",
        "certificate": "Weavers Cooperative Federation Master Tailoring Certificate",
        "cert_title": "Weavers Federation Tailoring L4",
        "cert_issuer": "Handloom Development Board & NSDC",
        "completed_jobs": 76,
        "total_earned": 52300.0,
        "today_wage": 2400.0,
        "photo": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": 104,
        "name": "Vikram Singh",
        "phone": "+91 97123 45678",
        "skill": "driver",
        "trade": "Driver",
        "coop_id": 2,
        "coop_name": "South Delhi Multi-Purpose Coop",
        "coop_ac": "COOP-DL-2024-004",
        "lat": 28.5244,
        "lng": 77.2100, # Saket
        "coords": [28.5244, 77.2100],
        "is_available": True,
        "is_verified": True,
        "rating": 4.7,
        "aadhaar": "XXXX-XXXX-7654",
        "certificate": "Commercial PSV Badge (Heavy & Light Motor)",
        "cert_title": "Commercial PSV Transport Badge",
        "cert_issuer": "Delhi Transport Department & NSDC",
        "completed_jobs": 210,
        "total_earned": 94000.0,
        "today_wage": 3100.0,
        "photo": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": 105,
        "name": "Pooja Devi",
        "phone": "+91 99901 23456",
        "skill": "cleaning",
        "trade": "Cleaning",
        "coop_id": 3,
        "coop_name": "NCR Technicians Coop",
        "coop_ac": "COOP-DL-2024-005",
        "lat": 28.6289,
        "lng": 77.2065, # Gole Market
        "coords": [28.6289, 77.2065],
        "is_available": True,
        "is_verified": True,
        "rating": 4.9,
        "aadhaar": "XXXX-XXXX-3341",
        "certificate": "Green Sanitation Guild Certificate",
        "cert_title": "Eco-Sanitation & Deep Cleaning Guild Master",
        "cert_issuer": "National Skill Development Corporation (NSDC)",
        "completed_jobs": 115,
        "total_earned": 39500.0,
        "today_wage": 1800.0,
        "photo": "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": 106,
        "name": "Amit Verma",
        "phone": "+91 98700 11223",
        "skill": "electrician",
        "trade": "Electrician",
        "coop_id": 1,
        "coop_name": "Delhi Central Labour Coop",
        "coop_ac": "COOP-DL-2024-006",
        "lat": 28.6400,
        "lng": 77.2300, # Delhi Gate (Backup Electrician)
        "coords": [28.6400, 77.2300],
        "is_available": True,
        "is_verified": True,
        "rating": 4.8,
        "aadhaar": "XXXX-XXXX-9912",
        "certificate": "ITI Electrician & Solar Wireman",
        "cert_title": "ITI Electrician & Solar Wireman NTC",
        "cert_issuer": "National Council for Vocational Training (NCVT)",
        "completed_jobs": 84,
        "total_earned": 41200.0,
        "today_wage": 2100.0,
        "photo": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": 108,
        "name": "Rameshwar Mistri",
        "phone": "+91 98188 44551",
        "skill": "carpentry",
        "trade": "Carpentry",
        "coop_id": 1,
        "coop_name": "Delhi Central Labour Coop",
        "coop_ac": "COOP-DL-2024-008",
        "lat": 28.6310,
        "lng": 77.2140,
        "coords": [28.6310, 77.2140],
        "is_available": True,
        "is_verified": True,
        "rating": 4.9,
        "aadhaar": "XXXX-XXXX-9901",
        "certificate": "ITI Carpentry & Joinery National Trade Certificate",
        "cert_title": "ITI Carpentry NTC (Grade A)",
        "cert_issuer": "NCVT Attested",
        "completed_jobs": 118,
        "total_earned": 58900.0,
        "today_wage": 2950.0,
        "photo": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": 111,
        "name": "Shanti Devi",
        "phone": "+91 98114 55667",
        "skill": "tailoring",
        "trade": "Tailoring & Handloom",
        "coop_id": 3,
        "coop_name": "NCR Technicians & Artisans Cooperative",
        "coop_ac": "COOP-DL-2024-011",
        "lat": 28.6200,
        "lng": 77.2180,
        "coords": [28.6200, 77.2180],
        "is_available": True,
        "is_verified": True,
        "rating": 4.9,
        "aadhaar": "XXXX-XXXX-8822",
        "certificate": "Weavers Cooperative Federation Master Tailoring Certificate",
        "cert_title": "Weavers Federation Tailoring L4",
        "cert_issuer": "Handloom Development Board",
        "completed_jobs": 91,
        "total_earned": 38400.0,
        "today_wage": 2200.0,
        "photo": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": 107,
        "name": "Ram Dayal",
        "phone": "+91 98119 88776",
        "skill": "pottery",
        "trade": "Pottery & Terracotta",
        "coop_id": 3,
        "coop_name": "NCR Technicians & Artisans Cooperative",
        "coop_ac": "COOP-DL-2024-007",
        "lat": 28.6180,
        "lng": 77.2250, # Crafts Museum / Pragati Maidan
        "coords": [28.6180, 77.2250],
        "is_available": True,
        "is_verified": True,
        "rating": 5.0,
        "aadhaar": "XXXX-XXXX-6721",
        "certificate": "KVIC Master Terracotta Artisan & Khadi Board Guild Attested",
        "cert_title": "KVIC Master Terracotta Artisan",
        "cert_issuer": "Khadi & Village Industries Commission (KVIC)",
        "completed_jobs": 124,
        "total_earned": 59200.0,
        "today_wage": 2100.0,
        "photo": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": 109,
        "name": "Kishan Luhar",
        "phone": "+91 98101 33445",
        "skill": "blacksmith",
        "trade": "Blacksmith & Metalcraft",
        "coop_id": 1,
        "coop_name": "Delhi Central Labour Cooperative",
        "coop_ac": "COOP-DL-2024-009",
        "lat": 28.6450,
        "lng": 77.2100, # Paharganj
        "coords": [28.6450, 77.2100],
        "is_available": True,
        "is_verified": True,
        "rating": 4.8,
        "aadhaar": "XXXX-XXXX-5519",
        "certificate": "Labour Cooperative Guild Master Blacksmith & Arc Welding Attested",
        "cert_title": "Master Blacksmith & Arc Welder",
        "cert_issuer": "Labour Cooperative Guild & NCVT",
        "completed_jobs": 108,
        "total_earned": 62400.0,
        "today_wage": 2750.0,
        "photo": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    },
    {
        "id": 110,
        "name": "Manoj Painter",
        "phone": "+91 98711 77889",
        "skill": "painting",
        "trade": "Painting & Wall Artisan",
        "coop_id": 2,
        "coop_name": "South Delhi Multi-Purpose Cooperative",
        "coop_ac": "COOP-DL-2024-010",
        "lat": 28.5800,
        "lng": 77.2200, # Defence Colony
        "coords": [28.5800, 77.2200],
        "is_available": True,
        "is_verified": True,
        "rating": 4.9,
        "aadhaar": "XXXX-XXXX-4482",
        "certificate": "NSDC Decorative Finishing & Surface Coating Guild Master",
        "cert_title": "NSDC Decorative Finishing Master",
        "cert_issuer": "National Skill Development Corporation (NSDC)",
        "completed_jobs": 136,
        "total_earned": 66800.0,
        "today_wage": 2450.0,
        "photo": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
    }
]

DISTRICT_ANALYTICS: List[Dict[str, Any]] = [
    {"district": "Central Delhi", "demand_score": 94, "pending_requests": 28, "active_workers": 45, "shortage_alert": True},
    {"district": "South Delhi", "demand_score": 88, "pending_requests": 19, "active_workers": 52, "shortage_alert": False},
    {"district": "East Delhi", "demand_score": 76, "pending_requests": 14, "active_workers": 38, "shortage_alert": False},
    {"district": "West Delhi", "demand_score": 82, "pending_requests": 22, "active_workers": 40, "shortage_alert": True},
    {"district": "North Delhi", "demand_score": 68, "pending_requests": 9, "active_workers": 30, "shortage_alert": False}
]

REVIEWS_DB: List[Dict[str, Any]] = [
    {
        "id": 1,
        "customer_name": "Aarav Mehta",
        "user_name": "Aarav Mehta",
        "worker_id": 101,
        "worker_name": "Rajesh Kumar",
        "service_type": "electrician",
        "service": "electrician",
        "service_title": "Electrical Wiring & Fuse Triage",
        "rating": 5,
        "review_type": "positive",
        "type": "positive",
        "comment": "Exceptional electrical repair in Connaught Place! Arrived in under 12 minutes, verified via START_OTP, and fixed the main distribution fuse. 100% transparent pricing without hidden cuts.",
        "timestamp": "2026-09-04 14:30",
        "status": "Resolved",
        "ministry_action": "Commendation Logged"
    },
    {
        "id": 2,
        "customer_name": "Priyanka Verma",
        "user_name": "Priyanka Verma",
        "worker_id": 103,
        "worker_name": "Sunita Sharma",
        "service_type": "tailoring",
        "service": "tailoring",
        "service_title": "Custom Fabric Fitting & Alteration",
        "rating": 5,
        "review_type": "positive",
        "type": "positive",
        "comment": "Outstanding custom tailoring and fabric alteration. Certified handloom credential verified right on the platform. Grateful to South Delhi Multi-Purpose Coop!",
        "timestamp": "2026-09-04 11:15",
        "status": "Resolved",
        "ministry_action": "Commendation Logged"
    },
    {
        "id": 3,
        "customer_name": "Vikram Sethi",
        "user_name": "Vikram Sethi",
        "worker_id": 102,
        "worker_name": "Mohammad Aslam",
        "service_type": "plumber",
        "service": "plumber",
        "service_title": "Under-sink Pipeline Repair",
        "rating": 2,
        "review_type": "complaint",
        "type": "complaint",
        "comment": "Technician arrived 25 minutes late due to traffic and initially lacked a specialized Teflon seal for high-pressure kitchen tap. Had to fetch replacement parts.",
        "timestamp": "2026-09-03 16:45",
        "status": "Under Investigation",
        "ministry_action": "Notice Sent to Federation"
    },
    {
        "id": 4,
        "customer_name": "Kavita Rao",
        "user_name": "Kavita Rao",
        "worker_id": 105,
        "worker_name": "Pooja Devi",
        "service_type": "cleaning",
        "service": "cleaning",
        "service_title": "Deep Kitchen & Floor Sanitation",
        "rating": 5,
        "review_type": "positive",
        "type": "positive",
        "comment": "Immaculate deep cleaning of our community hall before the cooperative meeting. Eco-friendly cleaning materials used throughout.",
        "timestamp": "2026-09-03 09:20",
        "status": "Resolved",
        "ministry_action": "Commendation Logged"
    },
    {
        "id": 5,
        "customer_name": "Rohan Deshmukh",
        "user_name": "Rohan Deshmukh",
        "worker_id": 104,
        "worker_name": "Vikram Singh",
        "service_type": "driver",
        "service": "driver",
        "service_title": "Hospital Transit & Assistance",
        "rating": 3,
        "review_type": "complaint",
        "type": "complaint",
        "comment": "Vehicle AC cooling was weak during the trip. Driver was courteous, but cooperative inspection standard should mandate periodic maintenance checks.",
        "timestamp": "2026-09-02 18:10",
        "status": "Warning Issued",
        "ministry_action": "Vehicle Inspection Mandated"
    }
]

SUBSCRIPTION_PLANS: List[Dict[str, Any]] = [
    {
        "id": "monthly_pass",
        "name": "Seva Setu Monthly Pass",
        "duration": "Monthly",
        "price": 199,
        "discount_percent": 20,
        "benefits": [
            "20% Flat Discount on all Services & Repairs",
            "Zero Platform Welfare Cess (Saved 3.5%)",
            "Unlimited Priority Emergency Triage (<15 min)",
            "Free Monthly Household Safety & Wiring Audit"
        ],
        "badge": "Popular Choice"
    },
    {
        "id": "annual_samriddhi",
        "name": "Seva Setu Yearly Pass",
        "duration": "Annual",
        "price": 1999,
        "discount_percent": 30,
        "benefits": [
            "★ Includes ALL Monthly Pass Benefits (Zero Cess, Priority Triage, Safety Audits)",
            "Enhanced 30% Flat Discount across all Cooperatives & Artisan Trades",
            "Free Family Member Coverage (up to 4 Members)",
            "Dedicated PACS Artisan & Cooperative Concierge Desk",
            "₹500 Seasonal Festival Artisan & Tool Voucher"
        ],
        "badge": "Best Value (Save ₹389)"
    }
]

REGIONAL_DEMAND_DETAILED: List[Dict[str, Any]] = [
    {
        "district": "Central Delhi",
        "overall_demand": 94,
        "demand_index": 94,
        "active_workers": 45,
        "required_workers": 76,
        "shortage": True,
        "status": "Critical Shortage",
        "trade_demand": {
            "electrician": 98,
            "plumber": 85,
            "driver": 88,
            "cleaning": 92,
            "carpentry": 82,
            "tailoring": 75
        },
        "trades": {
            "electrician": 98,
            "plumber": 85,
            "driver": 88,
            "cleaning": 92,
            "carpentry": 82,
            "tailoring": 75
        },
        "trade_requirements": {
            "electrician": {"required": 32, "active": 18, "deficit": 14, "demand_score": 98, "monthly_orders": 420},
            "plumber": {"required": 24, "active": 15, "deficit": 9, "demand_score": 85, "monthly_orders": 310},
            "driver": {"required": 22, "active": 16, "deficit": 6, "demand_score": 88, "monthly_orders": 280},
            "cleaning": {"required": 28, "active": 20, "deficit": 8, "demand_score": 92, "monthly_orders": 360},
            "carpentry": {"required": 18, "active": 11, "deficit": 7, "demand_score": 82, "monthly_orders": 240},
            "tailoring": {"required": 15, "active": 11, "deficit": 4, "demand_score": 75, "monthly_orders": 150}
        },
        "monthly_orders": 1420
    },
    {
        "district": "South Delhi",
        "overall_demand": 88,
        "demand_index": 88,
        "active_workers": 52,
        "required_workers": 68,
        "shortage": False,
        "status": "High Demand",
        "trade_demand": {
            "electrician": 84,
            "plumber": 82,
            "driver": 85,
            "cleaning": 89,
            "carpentry": 86,
            "tailoring": 80
        },
        "trades": {
            "electrician": 84,
            "plumber": 82,
            "driver": 85,
            "cleaning": 89,
            "carpentry": 86,
            "tailoring": 80
        },
        "trade_requirements": {
            "electrician": {"required": 26, "active": 22, "deficit": 4, "demand_score": 84, "monthly_orders": 340},
            "plumber": {"required": 22, "active": 18, "deficit": 4, "demand_score": 82, "monthly_orders": 290},
            "driver": {"required": 25, "active": 22, "deficit": 3, "demand_score": 85, "monthly_orders": 320},
            "cleaning": {"required": 30, "active": 25, "deficit": 5, "demand_score": 89, "monthly_orders": 410},
            "carpentry": {"required": 20, "active": 16, "deficit": 4, "demand_score": 86, "monthly_orders": 260},
            "tailoring": {"required": 16, "active": 14, "deficit": 2, "demand_score": 80, "monthly_orders": 200}
        },
        "monthly_orders": 1850
    },
    {
        "district": "East Delhi",
        "overall_demand": 76,
        "demand_index": 76,
        "active_workers": 38,
        "required_workers": 46,
        "shortage": False,
        "status": "Stable Supply",
        "trade_demand": {
            "electrician": 75,
            "plumber": 80,
            "driver": 70,
            "cleaning": 78,
            "carpentry": 72,
            "tailoring": 88
        },
        "trades": {
            "electrician": 75,
            "plumber": 80,
            "driver": 70,
            "cleaning": 78,
            "carpentry": 72,
            "tailoring": 88
        },
        "trade_requirements": {
            "electrician": {"required": 18, "active": 16, "deficit": 2, "demand_score": 75, "monthly_orders": 210},
            "plumber": {"required": 16, "active": 14, "deficit": 2, "demand_score": 80, "monthly_orders": 190},
            "driver": {"required": 15, "active": 13, "deficit": 2, "demand_score": 70, "monthly_orders": 180},
            "cleaning": {"required": 20, "active": 18, "deficit": 2, "demand_score": 78, "monthly_orders": 240},
            "carpentry": {"required": 14, "active": 12, "deficit": 2, "demand_score": 72, "monthly_orders": 160},
            "tailoring": {"required": 22, "active": 18, "deficit": 4, "demand_score": 88, "monthly_orders": 250}
        },
        "monthly_orders": 980
    },
    {
        "district": "West Delhi",
        "overall_demand": 82,
        "demand_index": 82,
        "active_workers": 40,
        "required_workers": 56,
        "shortage": True,
        "status": "Shortage Alert",
        "trade_demand": {
            "electrician": 90,
            "plumber": 94,
            "driver": 76,
            "cleaning": 80,
            "carpentry": 88,
            "tailoring": 84
        },
        "trades": {
            "electrician": 90,
            "plumber": 94,
            "driver": 76,
            "cleaning": 80,
            "carpentry": 88,
            "tailoring": 84
        },
        "trade_requirements": {
            "electrician": {"required": 25, "active": 17, "deficit": 8, "demand_score": 90, "monthly_orders": 310},
            "plumber": {"required": 24, "active": 14, "deficit": 10, "demand_score": 94, "monthly_orders": 330},
            "driver": {"required": 18, "active": 15, "deficit": 3, "demand_score": 76, "monthly_orders": 200},
            "cleaning": {"required": 22, "active": 18, "deficit": 4, "demand_score": 80, "monthly_orders": 260},
            "carpentry": {"required": 18, "active": 12, "deficit": 6, "demand_score": 88, "monthly_orders": 220},
            "tailoring": {"required": 18, "active": 14, "deficit": 4, "demand_score": 84, "monthly_orders": 210}
        },
        "monthly_orders": 1210
    },
    {
        "district": "North Delhi",
        "overall_demand": 68,
        "demand_index": 68,
        "active_workers": 30,
        "required_workers": 36,
        "shortage": False,
        "status": "Balanced",
        "trade_demand": {
            "electrician": 70,
            "plumber": 66,
            "driver": 68,
            "cleaning": 72,
            "carpentry": 68,
            "tailoring": 70
        },
        "trades": {
            "electrician": 70,
            "plumber": 66,
            "driver": 68,
            "cleaning": 72,
            "carpentry": 68,
            "tailoring": 70
        },
        "trade_requirements": {
            "electrician": {"required": 15, "active": 13, "deficit": 2, "demand_score": 70, "monthly_orders": 170},
            "plumber": {"required": 14, "active": 12, "deficit": 2, "demand_score": 66, "monthly_orders": 150},
            "driver": {"required": 14, "active": 12, "deficit": 2, "demand_score": 68, "monthly_orders": 160},
            "cleaning": {"required": 16, "active": 14, "deficit": 2, "demand_score": 72, "monthly_orders": 180},
            "carpentry": {"required": 12, "active": 10, "deficit": 2, "demand_score": 68, "monthly_orders": 140},
            "tailoring": {"required": 14, "active": 12, "deficit": 2, "demand_score": 70, "monthly_orders": 150}
        },
        "monthly_orders": 840
    }
]

REVENUE_METRICS: Dict[str, Any] = {
    "gross_merchandise_value": 1428500.0,
    "direct_worker_wages": 1285650.0,
    "welfare_fund_collected": 50000.0,
    "subscription_revenue": 92850.0,
    "citizen_savings_vs_aggregators": 542830.0,
    "monthly_growth_rate": 18.4,
    "avg_worker_monthly_income": 36400.0,
    "zero_middleman_guarantee": "100% Direct DBT"
}

# ----------------- Worker Freelancing Marketplace (Post-Shift Hours) -----------------
# Open freelance gigs posted by citizens for off-duty hours with 100% direct worker payout (0% federation cut)
FREELANCE_JOBS: List[Dict[str, Any]] = [
    {
        "id": 501,
        "title": "Evening Smart Meter & Inverter Checkup",
        "skill": "electrician",
        "customer_name": "Kavita Rao",
        "customer_phone": "+91 98222 11223",
        "address": "B-42, Defence Colony, South Delhi",
        "time_slot": "18:00 - 20:30 (Post-Shift)",
        "date": "Today (Evening)",
        "direct_payout": 450.0,
        "cooperative_cess": 0.0,
        "worker_takehome_pct": 100,
        "description": "Urgent inverter tripping checkup needed after office hours. 100% direct payment via UPI upon completion.",
        "status": "OPEN",
        "claimed_by_worker_id": None,
        "claimed_by_worker_name": None
    },
    {
        "id": 502,
        "title": "Late Evening Kitchen Sink Trap Replacement",
        "skill": "plumber",
        "customer_name": "Siddharth Malhotra",
        "customer_phone": "+91 98100 44556",
        "address": "Block C, Greater Kailash 1",
        "time_slot": "19:00 - 21:00 (Post-Shift)",
        "date": "Today (Evening)",
        "direct_payout": 380.0,
        "cooperative_cess": 0.0,
        "worker_takehome_pct": 100,
        "description": "Kitchen pipe leaking into under-sink cabinet. Looking for an experienced plumber available post 7 PM.",
        "status": "OPEN",
        "claimed_by_worker_id": None,
        "claimed_by_worker_name": None
    },
    {
        "id": 503,
        "title": "Evening Formal Suit & Fabric Alteration",
        "skill": "tailoring",
        "customer_name": "Anita Deshmukh",
        "customer_phone": "+91 98711 77889",
        "address": "Flat 204, Vasant Kunj Sector C",
        "time_slot": "20:00 - 21:30 (Post-Shift)",
        "date": "Today (Evening)",
        "direct_payout": 450.0,
        "cooperative_cess": 0.0,
        "worker_takehome_pct": 100,
        "description": "Urgent custom hemming and fitting needed for formal dress post office hours. 100% direct payment via UPI upon completion.",
        "status": "OPEN",
        "claimed_by_worker_id": None,
        "claimed_by_worker_name": None
    },
    {
        "id": 504,
        "title": "Weekend Acoustic Studio Partition Installation",
        "skill": "carpentry",
        "customer_name": "Sameer Joshi",
        "customer_phone": "+91 99555 33221",
        "address": "Hauz Khas Village",
        "time_slot": "Saturday (Weekend Flexible)",
        "date": "Saturday Slot",
        "direct_payout": 1200.0,
        "cooperative_cess": 0.0,
        "worker_takehome_pct": 100,
        "description": "Freelance project to erect an acoustic ply wall panel for a home recording studio.",
        "status": "OPEN",
        "claimed_by_worker_id": None,
        "claimed_by_worker_name": None
    }
]

# ----------------- Worker Complaints & Customer Incident Escalations -----------------
CUSTOMER_COMPLAINTS_DB: List[Dict[str, Any]] = [
    {
        "id": 901,
        "customer_name": "Rohan Verma",
        "customer_phone": "+91 98101 99887",
        "worker_id": 101,
        "worker_name": "Rajesh Kumar",
        "booking_id": 1001,
        "category": "OVERTIME_DELAY",
        "category_title": "Severe Uncompensated Delay / Job Exceeded Plan",
        "description": "Customer booked 1-hour electrical repair, entered START OTP, but held the technician for over 4.5 hours with multiple non-contracted tasks and refused to pay for overtime.",
        "delay_hours": 3.5,
        "severity": "HIGH",
        "timestamp": "2026-09-15 17:40",
        "status": "ESCALATED_TO_MINISTRY",
        "ministry_action": "Initial Warning Issued to Citizen Account"
    }
]

# ----------------- Debarred / Blacklisted Customers -----------------
# Customers barred from booking services due to multiple escalations from distinct workers
DEBARRED_CUSTOMERS: Dict[str, Dict[str, Any]] = {
    "Vikas Malhotra": {
        "customer_name": "Vikas Malhotra",
        "customer_phone": "+91 98110 00112",
        "reporting_workers": [101, 102],
        "reporting_worker_names": ["Rajesh Kumar", "Mohammad Aslam"],
        "reason": "Repeated verbal abuse and refusal of END OTP validation after completed work",
        "services": ["ALL"],
        "debarred_at": "2026-09-14 11:20",
        "status": "DEBARRED",
        "appeal_status": "NONE"
    },
    "Rohan Verma": {
        "customer_name": "Rohan Verma",
        "customer_phone": "+91 98990 01122",
        "reporting_workers": [101],
        "reporting_worker_names": ["Rajesh Kumar"],
        "reason": "Severe delay and overtime without compensation during electrical job",
        "services": ["electrician"],
        "debarred_at": "2026-09-15 18:30",
        "status": "DEBARRED",
        "appeal_status": "NONE"
    }
}

# ----------------- Worker Excessive Rejection Audit Log -----------------
WORKER_REJECTIONS_LOG: List[Dict[str, Any]] = [
    {
        "id": 801,
        "worker_id": 106,
        "worker_name": "Amit Verma",
        "booking_id": 998,
        "service_type": "electrician",
        "timestamp": "2026-09-16 09:15",
        "reason": "Declined automated cooperative broadcast (outside preferred sector)",
        "severity": "NORMAL"
    },
    {
        "id": 802,
        "worker_id": 106,
        "worker_name": "Amit Verma",
        "booking_id": 999,
        "service_type": "electrician",
        "timestamp": "2026-09-16 11:30",
        "reason": "Declined automated cooperative broadcast",
        "severity": "WARNING"
    }
]

# Initialize default fields for all workers
for _w in WORKERS:
    _w.setdefault("freelance_enabled", True)
    _w.setdefault("freelance_slots", ["17:00 - 21:00 (Evening)", "Weekend Flexible"])
    _w.setdefault("freelance_earned", 0.0)
    _w.setdefault("rejection_count", 0)
    _w.setdefault("disciplinary_status", "ACTIVE")
    _w.setdefault("disciplinary_history", [])

# Seed Amit Verma (id: 106) with 2 prior rejections for immediate demonstration
for _w in WORKERS:
    if _w.get("id") == 106:
        _w["rejection_count"] = 2
        _w["disciplinary_status"] = "WARNING_ISSUED"


