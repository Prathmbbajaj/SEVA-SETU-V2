"""
Seva Setu FastAPI Main Entrypoint
REST API for Customers, Workers, and Ministry of Cooperation.
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))

import uvicorn
from fastapi import FastAPI, HTTPException, Query, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Union, Any, Dict

from pricing import calculate_transparent_fare
from dispatch import (
    create_booking,
    worker_respond_to_job,
    verify_start_otp,
    complete_job_with_proof,
    BOOKINGS_DB,
    find_nearest_workers
)
from seed_data import (
    WORKERS,
    COOPERATIVES,
    DISTRICT_ANALYTICS,
    REVIEWS_DB,
    SUBSCRIPTION_PLANS,
    REGIONAL_DEMAND_DETAILED,
    REVENUE_METRICS
)
from ai_ocr import verify_worker_documents

app = FastAPI(
    title="Seva Setu API (Ministry of Cooperation)",
    description="Decentralized Cooperative Gig Platform with Fair-Wage Transparency & Priority Triage",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- Request / Response Models -----------------
class QuoteRequest(BaseModel):
    service_type: str = Field(..., json_schema_extra={"example": "electrician"})
    plan: str = Field(default="hourly", json_schema_extra={"example": "hourly"}) # hourly, daily, weekly, monthly
    customer_lat: float = Field(default=28.6315, json_schema_extra={"example": 28.6315}) # Connaught Place
    customer_lng: float = Field(default=77.2167, json_schema_extra={"example": 77.2167})
    worker_lat: float = Field(default=28.6328, json_schema_extra={"example": 28.6328})
    worker_lng: float = Field(default=77.2197, json_schema_extra={"example": 77.2197})
    is_emergency: bool = False
    is_ngo: bool = False

class BookingCreateRequest(BaseModel):
    customer_name: str = Field(..., json_schema_extra={"example": "Aarav Mehta"})
    customer_lat: Optional[float] = Field(default=28.6315, json_schema_extra={"example": 28.6315})
    customer_lng: Optional[float] = Field(default=77.2167, json_schema_extra={"example": 77.2167})
    service_type: str = Field(..., json_schema_extra={"example": "electrician"})
    plan: Optional[str] = Field(default="hourly", json_schema_extra={"example": "hourly"})
    is_emergency: Optional[bool] = False
    is_ngo: Optional[bool] = False
    booking_date: Optional[str] = Field(default=None, json_schema_extra={"example": "2026-09-07"})
    booking_time: Optional[str] = Field(default=None, json_schema_extra={"example": "10:30 AM"})
    worker_id: Optional[int] = None
    pricing: Optional[dict] = None

class WorkerResponseRequest(BaseModel):
    worker_id: int
    accept: bool # True to accept, False to reject and trigger fallback!

class StartOtpRequest(BaseModel):
    otp: str

class CompleteJobRequest(BaseModel):
    otp: str
    proof_image: Optional[str] = None

class DocumentVerifyRequest(BaseModel):
    worker_name: str
    skill: str
    doc_type: str # "aadhaar" or "trade_certificate"
    image_data: Optional[str] = None

class ReviewCreateRequest(BaseModel):
    customer_name: Optional[str] = None
    user_name: Optional[str] = None
    worker_id: Optional[int] = Field(default=None, json_schema_extra={"example": 101})
    worker_name: Optional[str] = Field(default=None, json_schema_extra={"example": "Rajesh Kumar"})
    service_type: Optional[str] = None
    service: Optional[str] = None
    rating: int = Field(default=5, ge=1, le=5)
    review_type: Optional[str] = None # positive or complaint
    type: Optional[str] = None
    comment: str = Field(..., json_schema_extra={"example": "Great electrical service!"})

class ReviewStatusUpdateRequest(BaseModel):
    status: Optional[str] = Field(default=None, json_schema_extra={"example": "Resolved"}) # Resolved, Under Investigation, Warning Issued, Compensated
    ministry_action: Optional[str] = Field(default="Ministry Action Recorded", json_schema_extra={"example": "Notice Issued to PACS Federation"})

class SubscriptionRequest(BaseModel):
    plan_id: str = Field(..., json_schema_extra={"example": "monthly_pass"})
    customer_name: Optional[str] = Field(default="Aarav Mehta", json_schema_extra={"example": "Aarav Mehta"})
    payment_method: Optional[str] = Field(default="upi", json_schema_extra={"example": "upi"})
    payment_ref: Optional[str] = Field(default="NPCI-COOP-SUBS-9921", json_schema_extra={"example": "NPCI-COOP-SUBS-9921"})

class WorkerLoginRequest(BaseModel):
    phone: str = Field(..., json_schema_extra={"example": "+91 98765 43210"})
    worker_id: Optional[int] = Field(default=None, json_schema_extra={"example": 101})

class WorkerOnboardRequest(BaseModel):
    worker_id: Optional[int] = None
    name: str = Field(default="Rajesh Kumar", json_schema_extra={"example": "Rajesh Kumar"})
    phone: str = Field(default="+91 98765 43210", json_schema_extra={"example": "+91 98765 43210"})
    skill: str = Field(default="electrician", json_schema_extra={"example": "electrician"})
    coop_name: Optional[str] = Field(default="Delhi Central Labour Cooperative")
    aadhaar: Optional[str] = None
    aadhaar_number: Optional[str] = None
    certificate_title: Optional[str] = None
    certificate_name: Optional[str] = None
    certificate_file: Optional[str] = None
    aadhaar_file: Optional[str] = None

# ----------------- API Endpoints -----------------

@app.get("/")
def root():
    return {
        "platform": "Seva Setu (सेवा सेतु)",
        "governing_body": "Ministry of Cooperation, Government of India",
        "vision": "Seva Se Samriddhi",
        "docs": "/docs",
        "status": "online"
    }

# 1. Workers Directory
@app.get("/api/workers", tags=["Workers"])
def list_workers(service: Optional[str] = None):
    if service:
        return [w for w in WORKERS if str(w.get("skill", "")).lower() == service.lower()]
    return WORKERS

# 2. Transparent Pricing Quote
@app.post("/api/pricing/quote", tags=["Pricing"])
def get_price_quote(req: QuoteRequest):
    return calculate_transparent_fare(
        service_type=req.service_type,
        plan=req.plan,
        customer_coords=(req.customer_lat, req.customer_lng),
        worker_coords=(req.worker_lat, req.worker_lng),
        is_emergency=req.is_emergency,
        is_ngo=req.is_ngo
    )

# 3. Create Booking & Broadcast (Rapido Style)
@app.post("/api/bookings/create", tags=["Bookings"])
@app.post("/api/v1/bookings", tags=["Bookings"])
def new_booking(req: BookingCreateRequest):
    result = create_booking(
        customer_name=req.customer_name,
        customer_coords=(req.customer_lat or 28.6315, req.customer_lng or 77.2167),
        service_type=req.service_type,
        plan=req.plan or "hourly",
        is_emergency=bool(req.is_emergency),
        is_ngo=bool(req.is_ngo),
        booking_date=req.booking_date,
        booking_time=req.booking_time
    )
    if not result["success"]:
        raise HTTPException(status_code=404, detail=result["message"])
    return result

# 4. Get Booking Details
@app.get("/api/bookings/{booking_id}", tags=["Bookings"])
def get_booking(booking_id: int):
    booking = BOOKINGS_DB.get(booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking

# 5. Worker Accept / Reject (Fallback Trigger)
@app.post("/api/bookings/{booking_id}/respond", tags=["Workers"])
def respond_booking(booking_id: int, req: WorkerResponseRequest):
    result = worker_respond_to_job(booking_id=booking_id, worker_id=req.worker_id, accept=req.accept)
    return result

# 6. Verify START_OTP
@app.post("/api/bookings/{booking_id}/start-otp", tags=["Bookings"])
def submit_start_otp(booking_id: int, req: StartOtpRequest):
    result = verify_start_otp(booking_id=booking_id, entered_otp=req.otp)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    return result

# 7. Complete Job with Proof & END_OTP
@app.post("/api/bookings/{booking_id}/complete", tags=["Bookings"])
def finalize_booking(booking_id: int, req: CompleteJobRequest):
    result = complete_job_with_proof(booking_id=booking_id, entered_otp=req.otp, proof_image=req.proof_image)
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    return result

# 8. AI Document Verification (Gemini 1.5 Flash)
@app.post("/api/workers/verify-credentials", tags=["AI Verification"])
def verify_document(req: DocumentVerifyRequest):
    return verify_worker_documents(
        worker_name=req.worker_name,
        skill=req.skill,
        doc_type=req.doc_type,
        image_base64_or_path=req.image_data or ""
    )

# 9. Ministry of Cooperation Analytics
@app.get("/api/ministry/analytics", tags=["Ministry Dashboard"])
def get_ministry_analytics():
    total_workers = len(WORKERS)
    verified_workers = len([w for w in WORKERS if w["is_verified"]])
    completed_bookings = [b for b in BOOKINGS_DB.values() if b["status"] == "COMPLETED"]
    
    total_wages_disbursed = sum(float(w.get("total_earned", 0.0)) for w in WORKERS)
    coop_welfare_fund = round(total_wages_disbursed * 0.035, 2)
    
    # Calculate estimated citizen savings compared to private commercial aggregators
    commercial_gap = round(total_wages_disbursed * 0.38, 2)

    return {
        "active_cooperatives": len(COOPERATIVES),
        "cooperatives": COOPERATIVES,
        "total_workers": total_workers,
        "verified_workers": verified_workers,
        "total_wages_disbursed": total_wages_disbursed,
        "coop_welfare_fund_accumulated": coop_welfare_fund,
        "citizen_savings_vs_aggregators": commercial_gap,
        "district_analytics": DISTRICT_ANALYTICS,
        "active_bookings_count": len(BOOKINGS_DB),
        "recent_bookings": list(BOOKINGS_DB.values())[-5:],
        "total_reviews": len(REVIEWS_DB),
        "avg_rating": round(sum(float(r.get("rating", 5.0)) for r in REVIEWS_DB) / len(REVIEWS_DB), 1) if REVIEWS_DB else 5.0
    }

# 10. Citizen Reviews & Grievances Desk
@app.get("/api/reviews", tags=["Reviews"])
def get_reviews(review_type: Optional[str] = None, worker_id: Optional[int] = None):
    results = REVIEWS_DB
    if review_type and review_type != "all":
        results = [r for r in results if str(r.get("review_type") or r.get("type") or "").lower() == review_type.lower()]
    if worker_id:
        results = [r for r in results if r.get("worker_id") == worker_id]
    return {
        "success": True,
        "count": len(results),
        "reviews": results,
        "stats": {
            "total_reviews": len(REVIEWS_DB),
            "average_rating": round(sum(float(r.get("rating", 5.0)) for r in REVIEWS_DB) / max(len(REVIEWS_DB), 1), 1)
        }
    }

@app.post("/api/reviews", tags=["Reviews"])
def submit_review(req: ReviewCreateRequest):
    existing_ids = [int(r["id"]) for r in REVIEWS_DB if str(r.get("id", "")).isdigit()]
    new_id = max(existing_ids, default=0) + 1
    import datetime
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    
    cust_name = req.customer_name or req.user_name or "Verified Citizen"
    serv_type = req.service_type or req.service or "electrician"
    rev_type = req.review_type or req.type or ("positive" if req.rating >= 4 else "complaint")
    
    review_item = {
        "id": new_id,
        "customer_name": cust_name,
        "user_name": cust_name,
        "worker_id": req.worker_id or 101,
        "worker_name": req.worker_name or "Cooperative Technician",
        "service_type": serv_type,
        "service": serv_type,
        "service_title": f"{serv_type.capitalize()} Service",
        "rating": req.rating,
        "review_type": rev_type,
        "type": rev_type,
        "comment": req.comment,
        "timestamp": now_str,
        "status": "Resolved" if rev_type == "positive" else "Under Investigation",
        "ministry_action": "Commendation Logged" if rev_type == "positive" else "Grievance Ticket Created"
    }
    REVIEWS_DB.insert(0, review_item)
    return {"success": True, "message": "Review submitted successfully", "review": review_item}

@app.patch("/api/ministry/reviews/{review_id}/status", tags=["Ministry Dashboard"])
def update_review_status(
    review_id: str,
    req: Optional[ReviewStatusUpdateRequest] = Body(None),
    status: Optional[str] = Query(None)
):
    target_status = None
    target_action = None
    if req and req.status:
        target_status = req.status
        target_action = req.ministry_action
    elif status:
        target_status = status

    if not target_status:
        raise HTTPException(status_code=400, detail="Status must be provided in body or query param")

    clean_id = review_id.strip()
    id_numeric = None
    import re
    num_match = re.search(r"\d+", clean_id)
    if num_match:
        id_numeric = int(num_match.group(0))

    for r in REVIEWS_DB:
        r_id_str = str(r.get("id", "")).strip()
        if (clean_id == r_id_str or 
            (id_numeric is not None and str(r.get("id")) == str(id_numeric)) or
            clean_id.endswith(r_id_str)):
            r["status"] = target_status
            r["ministry_action"] = target_action or f"Status changed to {target_status}"
            return {"success": True, "message": "Grievance status updated", "review": r}

    raise HTTPException(status_code=404, detail="Review not found")

# 11. Subscription Passes & Special Offers
@app.get("/api/subscriptions/plans", tags=["Subscriptions"])
def list_subscription_plans():
    return {
        "success": True,
        "plans": SUBSCRIPTION_PLANS
    }

@app.post("/api/subscriptions/subscribe", tags=["Subscriptions"])
def activate_subscription(req: SubscriptionRequest):
    selected_plan = next((p for p in SUBSCRIPTION_PLANS if p["id"] == req.plan_id), None)
    if not selected_plan:
        raise HTTPException(status_code=404, detail="Subscription plan not found")
    
    # Generated customized discount coupons
    offers = [
        {
            "code": "SAMRIDDHI25",
            "title": f"25% Off All Bookings ({selected_plan['name']})",
            "description": "Exclusive subscriber discount on all cooperative services",
            "valid_until": "30 Days",
            "discount_percent": selected_plan["discount_percent"]
        },
        {
            "code": "TRIAGEFREE",
            "title": "Zero Emergency Surcharge",
            "description": "Waived priority surcharge on emergency repairs",
            "valid_until": "Always Active"
        },
        {
            "code": "COOPCARE100",
            "title": "₹100 Passbook Credit",
            "description": "Instant cooperative welfare cashback for health and safety checkups",
            "valid_until": "Valid This Month"
        }
    ]
    
    return {
        "success": True,
        "message": f"Successfully subscribed to {selected_plan['name']}!",
        "customer_name": req.customer_name,
        "plan": selected_plan,
        "subscription": selected_plan,
        "payment_ref": req.payment_ref or "NPCI-ESCROW-PAID",
        "generated_offers": offers,
        "offers": offers,
        "is_subscriber": True
    }

@app.get("/api/subscriptions/offers", tags=["Subscriptions"])
def get_subscriber_offers():
    return {
        "success": True,
        "offers": [
            {
                "code": "SAMRIDDHI25",
                "title": "25% Off All Bookings (Subscriber Exclusive)",
                "description": "Auto-applied on all PAC-certified home services",
                "badge": "Active Pass"
            },
            {
                "code": "TRIAGEFREE",
                "title": "Zero Emergency Surcharge",
                "description": "100% discount on urgent dispatch fees",
                "badge": "VIP Perk"
            },
            {
                "code": "COOPCARE100",
                "title": "₹100 First Monthly Checkup Voucher",
                "description": "Redeemable for electrical inspection or sanitary check",
                "badge": "Welcome Gift"
            }
        ]
    }

# 12. Regional Demand Intelligence & Visual Analytics
@app.get("/api/ministry/regional-demand", tags=["Ministry Dashboard"])
def get_regional_demand(service_type: Optional[str] = None):
    all_districts = REGIONAL_DEMAND_DETAILED
    
    if service_type and service_type != "all":
        # Calculate specific metrics for requested service
        total_req = sum(d.get("trade_requirements", {}).get(service_type, {}).get("required", 0) for d in all_districts)
        total_act = sum(d.get("trade_requirements", {}).get(service_type, {}).get("active", 0) for d in all_districts)
        total_def = sum(d.get("trade_requirements", {}).get(service_type, {}).get("deficit", 0) for d in all_districts)
        total_orders = sum(d.get("trade_requirements", {}).get(service_type, {}).get("monthly_orders", 0) for d in all_districts)
        
        # District with highest deficit for this trade
        highest_deficit_dist = max(
            all_districts,
            key=lambda d: d.get("trade_requirements", {}).get(service_type, {}).get("deficit", 0)
        )["district"]
        
        return {
            "success": True,
            "selected_service": service_type,
            "districts": all_districts,
            "summary": {
                "service_name": service_type,
                "total_required": total_req,
                "total_active": total_act,
                "total_deficit": total_def,
                "total_monthly_demand": total_orders,
                "highest_shortage_district": highest_deficit_dist,
                "high_demand_districts": [d["district"] for d in all_districts if d["shortage"]]
            }
        }

    # Consolidated report for all services
    total_req_all = sum(d.get("required_workers", 50) for d in all_districts)
    total_act_all = sum(d.get("active_workers", 40) for d in all_districts)
    
    return {
        "success": True,
        "selected_service": "all",
        "districts": all_districts,
        "summary": {
            "service_name": "all",
            "total_required": total_req_all,
            "total_active": total_act_all,
            "total_deficit": max(0, total_req_all - total_act_all),
            "high_demand_districts": [d["district"] for d in all_districts if d["shortage"]],
            "total_monthly_demand": sum(int(d.get("monthly_orders", 0)) for d in all_districts),
            "top_deficit_trade": "electrician"
        }
    }

# 13. App Revenue & Cooperative Welfare Audit
@app.get("/api/ministry/revenue", tags=["Ministry Dashboard"])
def get_revenue_analytics():
    return {
        "success": True,
        "metrics": REVENUE_METRICS,
        "revenue_breakdown": [
            {"category": "Direct Worker DBT (Take-Home)", "amount": REVENUE_METRICS["direct_worker_wages"], "percent": 90.0},
            {"category": "Cooperative Welfare & Pension Fund (3.5%)", "amount": REVENUE_METRICS["welfare_fund_collected"], "percent": 3.5},
            {"category": "Citizen Subscriptions & Passes", "amount": REVENUE_METRICS["subscription_revenue"], "percent": 6.5}
        ]
    }

# 14. Worker Authentication, Onboarding & Access Control
@app.post("/api/workers/login", tags=["Workers"])
def worker_login(req: WorkerLoginRequest):
    # Match existing worker by phone or ID
    matched = None
    clean_req_phone = req.phone.replace(" ", "").replace("-", "")
    for w in WORKERS:
        clean_w_phone = str(w.get("phone", "")).replace(" ", "").replace("-", "")
        if clean_req_phone in clean_w_phone or clean_w_phone in clean_req_phone:
            matched = w
            break
        if req.worker_id and w["id"] == req.worker_id:
            matched = w
            break
    
    if matched:
        return {
            "success": True,
            "is_registered": True,
            "worker": matched,
            "access_granted": matched["is_verified"]
        }
    else:
        # Worker not found -> Proceed to onboarding wizard
        return {
            "success": True,
            "is_registered": False,
            "message": "New worker credentials. Please complete cooperative verification onboarding.",
            "access_granted": False
        }

@app.post("/api/workers/onboard", tags=["Workers"])
def worker_onboard(req: WorkerOnboardRequest):
    # Run AI document verification on submitted certificate
    ocr_result = verify_worker_documents(
        worker_name=req.name,
        skill=req.skill,
        doc_type="trade_certificate",
        image_base64_or_path=req.certificate_file or ""
    )
    
    existing_worker_ids = [int(w["id"]) for w in WORKERS if str(w.get("id", "")).isdigit()]
    new_id = req.worker_id or (max(existing_worker_ids, default=100) + 1)
    
    # Register or update worker profile
    worker_entry = {
        "id": new_id,
        "name": req.name,
        "phone": req.phone,
        "skill": req.skill.lower(),
        "coop_id": 1,
        "coop_name": req.coop_name or "Delhi Central Labour Coop",
        "lat": 28.6328,
        "lng": 77.2197,
        "is_available": True,
        "is_verified": ocr_result.get("verified", True),
        "rating": 5.0,
        "aadhaar": req.aadhaar,
        "certificate": req.certificate_title,
        "completed_jobs": 0,
        "total_earned": 0.0
    }
    
    # If exists, update
    existing_idx = next((i for i, w in enumerate(WORKERS) if w["id"] == new_id), None)
    if existing_idx is not None:
        WORKERS[existing_idx] = worker_entry
    else:
        WORKERS.append(worker_entry)
        
    return {
        "success": True,
        "message": f"Cooperative onboarding complete for {req.name}! Credentials verified.",
        "worker": worker_entry,
        "verification_audit": ocr_result,
        "access_granted": True
    }

@app.get("/api/workers/{worker_id}/profile", tags=["Workers"])
def get_worker_profile(worker_id: int):
    worker = next((w for w in WORKERS if w["id"] == worker_id), None)
    if not worker:
        raise HTTPException(status_code=404, detail="Worker profile not found")
    return {"success": True, "worker": worker}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

