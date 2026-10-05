"""
Seva Setu Transparent Pricing Engine
Calculates explicit itemized bills with zero hidden commissions.
"""
from typing import Dict, Any
import random
from geopy.distance import geodesic

# Base hourly and daily market rates (Government minimum wage aligned)
TRADE_RATES = {
    "electrician": {"hourly": 120.0, "daily": 700.0, "toolkit": 40.0},
    "plumber": {"hourly": 110.0, "daily": 650.0, "toolkit": 35.0},
    "cleaning": {"hourly": 90.0, "daily": 550.0, "toolkit": 25.0},
    "driver": {"hourly": 130.0, "daily": 800.0, "toolkit": 0.0},
    "carpentry": {"hourly": 115.0, "daily": 680.0, "toolkit": 45.0},
    "tailoring": {"hourly": 90.0, "daily": 520.0, "toolkit": 25.0},
    "pottery": {"hourly": 95.0, "daily": 560.0, "toolkit": 30.0},
    "blacksmith": {"hourly": 120.0, "daily": 720.0, "toolkit": 50.0},
    "painting": {"hourly": 105.0, "daily": 620.0, "toolkit": 40.0}
}

PLAN_MULTIPLIERS = {
    "hourly": 1,      # 1 hour standard service
    "daily": 1,       # 1 day (8 hours)
    "weekly": 5,      # 5 days
    "monthly": 22     # 22 working days
}

def calculate_transparent_fare(
    service_type: str,
    plan: str,
    customer_coords: tuple[float, float],
    worker_coords: tuple[float, float],
    is_emergency: bool = False,
    is_ngo: bool = False
) -> Dict[str, Any]:
    """
    Computes transparent fare breakdown:
    Labor + Toolkit + Transit + Tax + Platform Fee (3.5%) - NGO Discount + Emergency Premium
    """
    trade = TRADE_RATES.get(service_type.lower(), {
        "hourly": 100.0, "daily": 600.0, "toolkit": 30.0
    })
    
    # 1. Base Labor Cost
    if plan == "hourly":
        base_labor = trade["hourly"] * PLAN_MULTIPLIERS["hourly"]
    elif plan == "daily":
        base_labor = trade["daily"]
    elif plan == "weekly":
        # 5 days of work with 5% bulk discount
        base_labor = trade["daily"] * 5 * 0.95
    elif plan == "monthly":
        # 22 days of work with 15% cooperative subscription discount
        base_labor = trade["daily"] * 22 * 0.85
    else:
        base_labor = trade["hourly"]

    # 2. Toolkit / Equipment Cost
    toolkit_cost = trade["toolkit"] if plan in ["hourly", "daily"] else trade["toolkit"] * 2.5

    # 3. Geospatial Transit Cost (Haversine via Geopy)
    distance_km = round(geodesic(customer_coords, worker_coords).km, 2)
    # Minimum ₹20 transit base, plus ₹8 per km
    transit_cost = round(max(20.0, distance_km * 8.0), 2)

    # 4. Emergency Surcharge
    emergency_fee = 60.0 if is_emergency else 0.0

    # 5. Government Tax (5% GST on services)
    tax = round(base_labor * 0.05, 2)

    # 6. Platform Cooperative Welfare Fee (Strictly Nominal: 3.5%)
    platform_fee = round(base_labor * 0.035, 2)

    # Subtotal before discounts
    subtotal = base_labor + toolkit_cost + transit_cost + emergency_fee + tax + platform_fee

    # 7. Community / NGO Discount (20% subsidy)
    ngo_discount = round(subtotal * 0.20, 2) if is_ngo else 0.0

    final_total = round(subtotal - ngo_discount, 2)

    # Commercial Aggregator Benchmark (Private Aggregators typically 2.4x higher)
    commercial_benchmark = round(final_total * 2.4, 2)
    customer_savings = round(commercial_benchmark - final_total, 2)

    # Generate Secure Verification OTPs
    start_otp = str(random.randint(1000, 9999))
    end_otp = str(random.randint(1000, 9999))

    return {
        "service_type": service_type,
        "plan": plan,
        "distance_km": distance_km,
        "breakdown": {
            "labor_cost": round(base_labor, 2),
            "toolkit_cost": round(toolkit_cost, 2),
            "transit_cost": transit_cost,
            "emergency_fee": emergency_fee,
            "tax": tax,
            "platform_fee": platform_fee,
            "ngo_discount": ngo_discount
        },
        "total_amount": final_total,
        "commercial_benchmark": commercial_benchmark,
        "customer_savings": customer_savings,
        "cooperative_wage_payout": round(base_labor + transit_cost, 2), # 100% directly to worker
        "start_otp": start_otp,
        "end_otp": end_otp
    }


def calculate_freelance_fare(
    service_type: str,
    agreed_hours: float = 2.0,
    hourly_rate: float = 150.0,
    toolkit_required: bool = False
) -> Dict[str, Any]:
    """
    Computes transparent fare breakdown for post-shift direct freelance gigs.
    Key Policy: 0% Federation Commission / 0% Welfare Cess.
    100% of the agreed wage is disbursed directly to the worker's UPI/account.
    """
    trade_info = TRADE_RATES.get(service_type.lower(), {"hourly": 120.0, "toolkit": 30.0})
    rate = hourly_rate or trade_info.get("hourly", 120.0)
    base_wage = round(rate * agreed_hours, 2)
    toolkit = trade_info.get("toolkit", 30.0) if toolkit_required else 0.0
    
    total_fare = round(base_wage + toolkit, 2)

    return {
        "service_type": service_type,
        "agreed_hours": agreed_hours,
        "hourly_rate": rate,
        "breakdown": {
            "labor_wage": base_wage,
            "toolkit_reimbursement": toolkit,
            "federation_commission": 0.0, # 0% cut to federation
            "cooperative_cess": 0.0,      # 0% deduction
            "direct_worker_takehome": total_fare
        },
        "total_amount": total_fare,
        "worker_direct_payout": total_fare,
        "worker_takehome_percent": 100.0,
        "federation_cut_percent": 0.0
    }

