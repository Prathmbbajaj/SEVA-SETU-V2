"""
Seed data for SahakarSeva Prototype: Cooperatives, Workers, and Sample Metrics.
"""

COOPERATIVES = [
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
WORKERS = [
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
        "skill": "healthcare",
        "trade": "Healthcare",
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
        "certificate": "General Nursing Assistant (NSDC Certified)",
        "cert_title": "General Duty Nursing Assistant Certificate",
        "cert_issuer": "Healthcare Sector Skill Council (HSSC)",
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
        "id": 107,
        "name": "Suresh Yadav",
        "phone": "+91 98102 33445",
        "skill": "waste_management",
        "trade": "Waste Management",
        "coop_id": 3,
        "coop_name": "NCR Technicians Coop",
        "coop_ac": "COOP-DL-2024-007",
        "lat": 28.6350,
        "lng": 77.2150, # Barakhamba Road
        "coords": [28.6350, 77.2150],
        "is_available": True,
        "is_verified": True,
        "rating": 4.8,
        "aadhaar": "XXXX-XXXX-6721",
        "certificate": "Municipal Solid Waste Management & Segregation Certified",
        "cert_title": "Municipal Solid Waste Management & Segregation",
        "cert_issuer": "Urban Local Bodies Skills Guild",
        "completed_jobs": 63,
        "total_earned": 28500.0,
        "today_wage": 1600.0,
        "photo": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
    }
]

DISTRICT_ANALYTICS = [
    {"district": "Central Delhi", "demand_score": 94, "pending_requests": 28, "active_workers": 45, "shortage_alert": True},
    {"district": "South Delhi", "demand_score": 88, "pending_requests": 19, "active_workers": 52, "shortage_alert": False},
    {"district": "East Delhi", "demand_score": 76, "pending_requests": 14, "active_workers": 38, "shortage_alert": False},
    {"district": "West Delhi", "demand_score": 82, "pending_requests": 22, "active_workers": 40, "shortage_alert": True},
    {"district": "North Delhi", "demand_score": 68, "pending_requests": 9, "active_workers": 30, "shortage_alert": False}
]

REVIEWS_DB = [
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
        "service_type": "healthcare",
        "service": "healthcare",
        "service_title": "Elder Nursing & Vitals Check",
        "rating": 5,
        "review_type": "positive",
        "type": "positive",
        "comment": "Outstanding nursing and elder care for my grandmother. Certified NSDC credential verified right on the platform. Grateful to South Delhi Multi-Purpose Coop!",
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

SUBSCRIPTION_PLANS = [
    {
        "id": "monthly_pass",
        "name": "Cooperative Citizen Pass",
        "duration": "Monthly",
        "price": 199,
        "discount_percent": 20,
        "benefits": [
            "20% Flat Discount on all Services",
            "Zero Platform Welfare Cess (Saved 3.5%)",
            "Unlimited Priority Emergency Triage (<15 min)",
            "Free Quarterly Home Safety Audit"
        ],
        "badge": "Popular Choice"
    },
    {
        "id": "annual_samriddhi",
        "name": "Sahakar Samriddhi Pass",
        "duration": "Annual",
        "price": 999,
        "discount_percent": 30,
        "benefits": [
            "30% Flat Discount across all Cooperatives",
            "Free Family Member Coverage (up to 4)",
            "Dedicated PACS Priority Concierge",
            "₹500 Seasonal Diagnostic Toolkit Voucher"
        ],
        "badge": "Best Value (Save ₹2,400)"
    },
    {
        "id": "elder_care_pass",
        "name": "Seniors & Care Pass",
        "duration": "Quarterly",
        "price": 499,
        "discount_percent": 25,
        "benefits": [
            "25% Discount on Nursing & Healthcare",
            "SOS Emergency Ambulance Driver on Standby",
            "Weekly Vitals & Medication Check-in",
            "Government Subsidy Linked"
        ],
        "badge": "Ministry Subsidized"
    }
]

REGIONAL_DEMAND_DETAILED = [
    {
        "district": "Central Delhi",
        "overall_demand": 94,
        "demand_index": 94,
        "active_workers": 45,
        "shortage": True,
        "status": "Critical Shortage",
        "trade_demand": {
            "electrician": 98,
            "plumber": 85,
            "healthcare": 78,
            "cleaning": 92,
            "driver": 88
        },
        "trades": {
            "electrician": 98,
            "plumber": 85,
            "healthcare": 78,
            "cleaning": 92,
            "driver": 88
        },
        "monthly_orders": 1420
    },
    {
        "district": "South Delhi",
        "overall_demand": 88,
        "demand_index": 88,
        "active_workers": 52,
        "shortage": False,
        "status": "High Demand",
        "trade_demand": {
            "electrician": 84,
            "plumber": 82,
            "healthcare": 96,
            "cleaning": 89,
            "driver": 85
        },
        "trades": {
            "electrician": 84,
            "plumber": 82,
            "healthcare": 96,
            "cleaning": 89,
            "driver": 85
        },
        "monthly_orders": 1850
    },
    {
        "district": "East Delhi",
        "overall_demand": 76,
        "demand_index": 76,
        "active_workers": 38,
        "shortage": False,
        "status": "Stable Supply",
        "trade_demand": {
            "electrician": 75,
            "plumber": 80,
            "healthcare": 65,
            "cleaning": 78,
            "driver": 70
        },
        "trades": {
            "electrician": 75,
            "plumber": 80,
            "healthcare": 65,
            "cleaning": 78,
            "driver": 70
        },
        "monthly_orders": 980
    },
    {
        "district": "West Delhi",
        "overall_demand": 82,
        "demand_index": 82,
        "active_workers": 40,
        "shortage": True,
        "status": "Shortage Alert",
        "trade_demand": {
            "electrician": 90,
            "plumber": 94,
            "healthcare": 72,
            "cleaning": 80,
            "driver": 76
        },
        "trades": {
            "electrician": 90,
            "plumber": 94,
            "healthcare": 72,
            "cleaning": 80,
            "driver": 76
        },
        "monthly_orders": 1210
    },
    {
        "district": "North Delhi",
        "overall_demand": 68,
        "demand_index": 68,
        "active_workers": 30,
        "shortage": False,
        "status": "Balanced",
        "trade_demand": {
            "electrician": 70,
            "plumber": 66,
            "healthcare": 62,
            "cleaning": 72,
            "driver": 68
        },
        "trades": {
            "electrician": 70,
            "plumber": 66,
            "healthcare": 62,
            "cleaning": 72,
            "driver": 68
        },
        "monthly_orders": 840
    }
]

REVENUE_METRICS = {
    "gross_merchandise_value": 1428500.0,
    "direct_worker_wages": 1285650.0,
    "welfare_fund_collected": 50000.0,
    "subscription_revenue": 92850.0,
    "citizen_savings_vs_aggregators": 542830.0,
    "monthly_growth_rate": 18.4,
    "avg_worker_monthly_income": 36400.0,
    "zero_middleman_guarantee": "100% Direct DBT"
}

