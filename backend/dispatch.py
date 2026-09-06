"""
Rapido-Style Dispatch & Fallback State Machine with Dual OTP Lifecycle.
"""
from typing import List, Dict, Any, Optional
from geopy.distance import geodesic
from seed_data import WORKERS
from pricing import calculate_transparent_fare

# In-memory storage for prototype bookings and rejection tracking
BOOKINGS_DB: Dict[int, Dict[str, Any]] = {}
BOOKING_REJECTIONS: Dict[int, List[int]] = {} # booking_id -> list of worker_ids who rejected
BOOKING_COUNTER = 1000

def find_nearest_workers(
    customer_coords: tuple[float, float],
    service_type: str,
    exclude_worker_ids: Optional[List[int]] = None,
    max_radius_km: float = 25.0
) -> List[Dict[str, Any]]:
    """
    Finds and ranks all available workers matching service_type within max_radius_km,
    excluding workers who have already declined.
    """
    exclude = set(exclude_worker_ids or [])
    matches = []

    for w in WORKERS:
        if w["id"] in exclude or not w["is_available"]:
            continue
        if w["skill"].lower() != service_type.lower():
            continue

        worker_coords = (w["lat"], w["lng"])
        dist_km = round(geodesic(customer_coords, worker_coords).km, 2)
        
        if dist_km <= max_radius_km:
            match_data = dict(w)
            match_data["distance_km"] = dist_km
            matches.append(match_data)

    # Sort by closest distance first, then highest rating
    matches.sort(key=lambda x: (x["distance_km"], -x["rating"]))
    return matches

def create_booking(
    customer_name: str,
    customer_coords: tuple[float, float],
    service_type: str,
    plan: str,
    is_emergency: bool = False,
    is_ngo: bool = False,
    booking_date: Optional[str] = None,
    booking_time: Optional[str] = None
) -> Dict[str, Any]:
    """
    Initializes a new booking, finds the primary nearest worker,
    calculates transparent fare, and broadcasts the job alert.
    """
    global BOOKING_COUNTER
    BOOKING_COUNTER += 1
    booking_id = BOOKING_COUNTER

    # Find candidates
    candidates = find_nearest_workers(customer_coords, service_type)
    if not candidates:
        return {
            "success": False,
            "message": f"No available cooperative workers found for {service_type} within 25km radius."
        }

    primary_worker = candidates[0]
    worker_coords = (primary_worker["lat"], primary_worker["lng"])

    # Calculate itemized pricing
    pricing = calculate_transparent_fare(
        service_type=service_type,
        plan=plan,
        customer_coords=customer_coords,
        worker_coords=worker_coords,
        is_emergency=is_emergency,
        is_ngo=is_ngo
    )

    schedule_desc = f"{booking_date} at {booking_time}" if (booking_date and booking_time) else (booking_time or "Immediate Dispatch")

    booking_record = {
        "booking_id": booking_id,
        "customer_name": customer_name,
        "customer_lat": customer_coords[0],
        "customer_lng": customer_coords[1],
        "service_type": service_type,
        "plan": plan,
        "is_emergency": is_emergency,
        "is_ngo": is_ngo,
        "booking_date": booking_date or "Today",
        "booking_time": booking_time or "Immediate (<30 mins)",
        "status": "BROADCASTING", # BROADCASTING -> ACCEPTED -> IN_PROGRESS -> COMPLETED / CANCELLED
        "assigned_worker": primary_worker,
        "pricing": pricing,
        "start_otp": pricing["start_otp"],
        "end_otp": pricing["end_otp"],
        "start_otp_verified": False,
        "end_otp_verified": False,
        "proof_of_work_url": None,
        "timeline": [
            f"Job request initialized for {service_type.capitalize()} ({plan.capitalize()} Plan) • Slot: {schedule_desc}",
            f"Broadcast dispatched to nearest cooperative worker: {primary_worker['name']} ({primary_worker['distance_km']} km away)"
        ]
    }

    BOOKINGS_DB[booking_id] = booking_record
    BOOKING_REJECTIONS[booking_id] = []

    return {"success": True, "booking": booking_record}

def worker_respond_to_job(booking_id: int, worker_id: int, accept: bool) -> Dict[str, Any]:
    """
    Handles worker accept or reject (Rapido-style fallback engine).
    If a worker rejects (either initially or after accepting), it triggers immediate fallback
    to the next closest candidate.
    """
    booking = BOOKINGS_DB.get(booking_id)
    if not booking:
        return {"success": False, "message": "Booking not found"}

    if accept:
        booking["status"] = "ACCEPTED"
        booking["timeline"].append(f"Worker {booking['assigned_worker']['name']} accepted the job. En route to customer.")
        return {
            "success": True,
            "status": "ACCEPTED",
            "message": f"Job accepted by {booking['assigned_worker']['name']}.",
            "booking": booking
        }
    else:
        # Worker rejected -> Activate Fallback Reassignment Engine
        BOOKING_REJECTIONS[booking_id].append(worker_id)
        booking["timeline"].append(f"Worker {booking['assigned_worker']['name']} declined/cancelled the job.")
        
        customer_coords = (booking["customer_lat"], booking["customer_lng"])
        remaining_candidates = find_nearest_workers(
            customer_coords=customer_coords,
            service_type=booking["service_type"],
            exclude_worker_ids=BOOKING_REJECTIONS[booking_id]
        )

        if remaining_candidates:
            fallback_worker = remaining_candidates[0]
            booking["assigned_worker"] = fallback_worker
            booking["status"] = "BROADCASTING"
            
            # Recalculate distance & transit for the new worker
            worker_coords = (fallback_worker["lat"], fallback_worker["lng"])
            updated_pricing = calculate_transparent_fare(
                service_type=booking["service_type"],
                plan=booking["plan"],
                customer_coords=customer_coords,
                worker_coords=worker_coords,
                is_emergency=booking["is_emergency"],
                is_ngo=booking["is_ngo"]
            )
            # Retain original OTPs
            updated_pricing["start_otp"] = booking["start_otp"]
            updated_pricing["end_otp"] = booking["end_otp"]
            booking["pricing"] = updated_pricing
            
            booking["timeline"].append(
                f"🚨 FALLBACK TRIGGERED: Reassigned to next nearest worker {fallback_worker['name']} ({fallback_worker['distance_km']} km away)"
            )
            return {
                "success": True,
                "status": "FALLBACK_REASSIGNED",
                "message": f"Reassigned to next closest worker: {fallback_worker['name']}",
                "booking": booking
            }
        else:
            booking["status"] = "NO_WORKERS_AVAILABLE"
            booking["timeline"].append("No other cooperative workers available within radius.")
            return {
                "success": False,
                "status": "NO_WORKERS_AVAILABLE",
                "message": "All nearby workers are currently busy.",
                "booking": booking
            }

def verify_start_otp(booking_id: int, entered_otp: str) -> Dict[str, Any]:
    """
    Worker enters START_OTP provided by the customer upon arrival.
    Unlocks work commencement.
    """
    booking = BOOKINGS_DB.get(booking_id)
    if not booking:
        return {"success": False, "message": "Booking not found"}

    if booking["start_otp"] == entered_otp.strip():
        booking["start_otp_verified"] = True
        booking["status"] = "IN_PROGRESS"
        booking["timeline"].append("Customer verified START_OTP. Service execution in progress.")
        return {"success": True, "status": "IN_PROGRESS", "message": "START_OTP verified! Work commenced."}
    else:
        return {"success": False, "message": "Invalid START_OTP. Please ask customer to show their screen."}

def complete_job_with_proof(booking_id: int, entered_otp: str, proof_image: Optional[str] = None) -> Dict[str, Any]:
    """
    Worker uploads completion proof-of-work and enters customer's END_OTP.
    Finalizes the service, logs direct payout, and registers in Ministry records.
    """
    booking = BOOKINGS_DB.get(booking_id)
    if not booking:
        return {"success": False, "message": "Booking not found"}

    if booking["end_otp"] == entered_otp.strip():
        booking["end_otp_verified"] = True
        booking["proof_of_work_url"] = proof_image or "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80"
        booking["status"] = "COMPLETED"
        payout = booking["pricing"].get("cooperative_wage_payout", 0.0)
        booking["timeline"].append("Job successfully completed. Proof of work uploaded and END_OTP validated.")
        booking["timeline"].append(f"₹{payout} disbursed directly to worker's cooperative account.")
        
        # Credit worker's cooperative account and completed jobs count
        assigned_worker = booking.get("assigned_worker")
        if assigned_worker:
            for w in WORKERS:
                if w["id"] == assigned_worker["id"]:
                    w["total_earned"] = round(w.get("total_earned", 0.0) + payout, 2)
                    w["completed_jobs"] = w.get("completed_jobs", 0) + 1
                    break
                    
        return {
            "success": True,
            "status": "COMPLETED",
            "message": "Service successfully completed! Direct wage disbursed.",
            "booking": booking
        }
    else:
        return {"success": False, "message": "Invalid END_OTP. Please ask customer for completion OTP."}
