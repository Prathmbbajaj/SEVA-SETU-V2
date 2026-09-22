"""
Automated Test Suite for Seva Setu 3 New Features:
1. Worker Freelance Mode & Direct Payouts (0% federation cut)
2. Worker Incident Escalation & Multi-Worker Customer Debarment
3. Worker Excessive Rejection Tracking & Ministry Disciplinary Desk
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))

from fastapi.testclient import TestClient
from main import app
from seed_data import WORKERS, FREELANCE_JOBS, CUSTOMER_COMPLAINTS_DB, DEBARRED_CUSTOMERS, WORKER_REJECTIONS_LOG
from dispatch import find_nearest_workers

client = TestClient(app)

def test_freelance_platform():
    print("\n--- TEST 1: Freelance Platform & Direct Worker Payout ---")
    # 1. List freelance jobs
    res = client.get("/api/freelance/jobs")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    data = res.json()
    assert data["success"] is True
    assert data["count"] >= 4
    open_jobs = [j for j in data["jobs"] if j["status"] == "OPEN"]
    assert len(open_jobs) > 0, "Expected at least one open freelance job"
    target_job = open_jobs[0]
    job_id = target_job["id"]
    payout = target_job["direct_payout"]

    # 2. Worker 101 claims freelance gig
    worker_101 = next(w for w in WORKERS if w["id"] == 101)
    prev_freelance_earned = worker_101.get("freelance_earned", 0.0)

    apply_res = client.post(f"/api/freelance/jobs/{job_id}/apply", json={
        "worker_id": 101,
        "worker_name": "Rajesh Kumar"
    })
    assert apply_res.status_code == 200, f"Apply failed: {apply_res.text}"
    apply_data = apply_res.json()
    assert apply_data["success"] is True
    assert apply_data["job"]["status"] == "CLAIMED"
    assert apply_data["job"]["claimed_by_worker_id"] == 101

    # Verify 100% of payout went directly to worker
    new_freelance_earned = worker_101["freelance_earned"]
    assert round(new_freelance_earned - prev_freelance_earned, 2) == round(payout, 2)
    print(f"[PASS] Freelance gig #{job_id} successfully claimed by Rajesh Kumar. Rs.{payout} direct payout confirmed (0% federation cut).")

    # 3. Update worker freelance settings & custom slots
    settings_res = client.post("/api/workers/101/freelance-settings", json={
        "freelance_enabled": True,
        "freelance_slots": ["18:00 - 22:00 (Night Owl)", "Sunday Freelance Special"]
    })
    assert settings_res.status_code == 200
    assert "18:00 - 22:00 (Night Owl)" in settings_res.json()["freelance_slots"]
    print("[PASS] Worker custom freelance availability slots updated.")

def test_worker_complaint_and_debarment():
    print("\n--- TEST 2: Worker Incident Escalation & Customer Debarment ---")
    # "Rohan Verma" already has 1 complaint from Worker 101 in seed data.
    # Worker 102 (Mohammad Aslam) now files a 2nd complaint for verbal abuse and overtime delay
    escalate_res = client.post("/api/workers/complaints/escalate", json={
        "worker_id": 102,
        "worker_name": "Mohammad Aslam",
        "customer_name": "Rohan Verma",
        "customer_phone": "+91 98101 99887",
        "booking_id": 1002,
        "category": "CUSTOMER_MISBEHAVIOR",
        "description": "Customer was verbally aggressive, demanded unpaid extra repair work, and refused to provide the END OTP on time.",
        "delay_hours": 2.0,
        "severity": "CRITICAL"
    })
    assert escalate_res.status_code == 200, f"Escalate failed: {escalate_res.text}"
    data = escalate_res.json()
    assert data["success"] is True
    assert data["debarment_triggered"] is True, "Expected automatic debarment trigger when 2 distinct workers report"
    assert data["customer_debarred"] is True
    print("[PASS] 2nd independent worker escalation triggered automatic customer debarment for 'Rohan Verma'.")

    # Now verify that Rohan Verma is blocked from creating new bookings (HTTP 403 Forbidden)
    booking_attempt = client.post("/api/bookings/create", json={
        "customer_name": "Rohan Verma",
        "service_type": "electrician",
        "plan": "hourly",
        "customer_lat": 28.6315,
        "customer_lng": 77.2167
    })
    assert booking_attempt.status_code == 403, f"Expected 403 Forbidden for debarred customer, got {booking_attempt.status_code}"
    err_detail = booking_attempt.json()["detail"]
    assert "DEBARRED" in err_detail
    print(f"[PASS] Debarred customer booking blocked with 403: {err_detail[:70]}...")

    # Ministry manually reinstates Rohan Verma
    reinstate_res = client.post("/api/ministry/customers/Rohan Verma/debar", json={
        "action": "REINSTATE",
        "reason": "Written apology submitted and fine deposited."
    })
    assert reinstate_res.status_code == 200
    assert reinstate_res.json()["success"] is True
    print("[PASS] Ministry successfully reinstated customer access upon resolution.")

    # Test Service-Specific Debarment (e.g. debar only from "electrician")
    specific_debar_res = client.post("/api/ministry/customers/Rohan Verma/debar", json={
        "action": "DEBAR",
        "reason": "Repeated hazard issues with electrical wiring tasks",
        "services": ["electrician"]
    })
    assert specific_debar_res.status_code == 200
    print("[PASS] Ministry specifically debarred 'Rohan Verma' from 'electrician' only.")

    # Attempt booking electrician -> must be blocked 403
    elec_attempt = client.post("/api/bookings/create", json={
        "customer_name": "Rohan Verma",
        "service_type": "electrician",
        "plan": "hourly",
        "customer_lat": 28.6315,
        "customer_lng": 77.2167
    })
    assert elec_attempt.status_code == 403, f"Expected 403, got {elec_attempt.status_code}"
    print("[PASS] Service-specific debarment correctly blocked 'electrician' booking (403).")

    # Attempt booking plumber -> must SUCCEED (200) since debarment is specific to electrician
    plumber_attempt = client.post("/api/bookings/create", json={
        "customer_name": "Rohan Verma",
        "service_type": "plumber",
        "plan": "hourly",
        "customer_lat": 28.6315,
        "customer_lng": 77.2167
    })
    assert plumber_attempt.status_code == 200, f"Expected 200 for non-debarred service, got {plumber_attempt.status_code}"
    print("[PASS] Customer permitted to book non-debarred service 'plumber' (200 OK).")

def test_worker_rejections_and_ministry_discipline():
    print("\n--- TEST 3: Worker Rejections & Ministry Disciplinary Desk ---")
    # Worker 106 (Amit Verma) starts with 2 rejections in seed data
    worker_106 = next(w for w in WORKERS if w["id"] == 106)
    assert worker_106["rejection_count"] == 2

    # Create a booking that gets assigned to an electrician
    # We trigger a rejection response from Worker 106
    # Let's create a dummy booking in BOOKINGS_DB
    from dispatch import BOOKINGS_DB, worker_respond_to_job
    BOOKINGS_DB[9999] = {
        "booking_id": 9999,
        "customer_name": "Test Citizen",
        "customer_lat": 28.6315,
        "customer_lng": 77.2167,
        "service_type": "electrician",
        "plan": "hourly",
        "is_emergency": False,
        "is_ngo": False,
        "status": "BROADCASTING",
        "assigned_worker": worker_106,
        "pricing": {
            "start_otp": "1234",
            "end_otp": "5678",
            "cooperative_wage_payout": 140.0
        },
        "start_otp": "1234",
        "end_otp": "5678",
        "timeline": []
    }

    # Worker 106 declines the 3rd job
    rej_res = worker_respond_to_job(booking_id=9999, worker_id=106, accept=False)
    assert worker_106["rejection_count"] >= 3, f"Expected rejection_count >= 3, got {worker_106['rejection_count']}"
    assert worker_106["disciplinary_status"] == "UNDER_REVIEW"
    print(f"[PASS] Worker Amit Verma reached {worker_106['rejection_count']} rejections and was flagged as UNDER_REVIEW.")

    # Check Ministry Rejection Audit API
    audit_res = client.get("/api/ministry/workers/rejections")
    assert audit_res.status_code == 200
    audit_data = audit_res.json()
    assert audit_data["total_rejections_logged"] >= 3
    top_flagged = [w for w in audit_data["workers_summary"] if w["worker_id"] == 106][0]
    assert top_flagged["action_required"] is True
    print("[PASS] Ministry Cockpit correctly received flagged worker audit telemetry.")

    # Ministry fires Worker 106
    fire_res = client.post("/api/ministry/workers/106/discipline", json={
        "action": "FIRE",
        "reason": "Exceeded maximum allowed dispatch declines (3 rejections in 24h). Failed cooperative SLA.",
        "notes": "Cooperative license terminated."
    })
    assert fire_res.status_code == 200
    fire_data = fire_res.json()
    assert fire_data["success"] is True
    assert worker_106["disciplinary_status"] == "FIRED"
    assert worker_106["is_verified"] is False
    assert worker_106["is_available"] is False
    print("[PASS] Ministry officially fired worker 106. Cooperative license revoked.")

    # Verify fired worker is excluded from future dispatches
    candidates = find_nearest_workers(customer_coords=(28.6315, 77.2167), service_type="electrician")
    candidate_ids = [c["id"] for c in candidates]
    assert 106 not in candidate_ids, "Fired worker must not appear in dispatch candidates!"
    print("[PASS] Fired worker confirmed excluded from live dispatch radar.")

def test_growth_analytics_and_withdrawal_reassignment():
    print("\n--- TEST 4: Regional Growth Analytics & Worker Post-Acceptance Withdrawal Reassignment ---")
    # 1. Verify Ministry Regional Growth Analytics Endpoint
    res_all = client.get("/api/ministry/growth-analytics?region=all&horizon=6m")
    assert res_all.status_code == 200, f"Expected 200, got {res_all.status_code}"
    data_all = res_all.json()
    assert data_all["success"] is True
    assert data_all["region"] == "all"
    assert len(data_all["labels"]) == 6
    assert len(data_all["series"]["deployments"]) == 6
    assert len(data_all["series"]["requests"]) == 6
    assert len(data_all["series"]["revenue"]) == 6
    assert len(data_all["series"]["welfare"]) == 6
    assert "Active" in data_all["kpis"]["deployments"]
    assert len(data_all["historical_trajectory"]) == 6
    print("[PASS] Ministry Growth Analytics consolidated NCR 6m dataset verified.")

    # Test distinct region & 30d horizon
    res_cd = client.get("/api/ministry/growth-analytics?region=central_delhi&horizon=30d")
    assert res_cd.status_code == 200
    data_cd = res_cd.json()
    assert data_cd["region"] == "central_delhi"
    assert "Central Delhi" in data_cd["region_name"]
    assert len(data_cd["labels"]) == 4
    print("[PASS] Central Delhi 30-day growth horizon verified.")

    # 2. Test Worker Post-Acceptance Withdrawal & Automatic Reassignment
    # Worker 101 accepts a booking
    worker_101 = next(w for w in WORKERS if w["id"] == 101)
    init_withdrawals = worker_101.get("withdrawal_count", 0)

    # Worker 101 withdraws due to vehicle breakdown post-acceptance
    withdraw_res = client.post("/api/bookings/dispatch/respond", json={
        "booking_id": 998,
        "worker_id": 101,
        "action": "WITHDRAW",
        "reason": "VEHICLE_BREAKDOWN",
        "notes": "Tyre puncture on Barakhamba Road while en route",
        "reassigned_worker_id": 102
    })
    assert withdraw_res.status_code == 200, f"Expected 200, got {withdraw_res.text}"
    w_data = withdraw_res.json()
    assert w_data["success"] is True
    assert w_data["status"] == "FALLBACK_REASSIGNED"
    assert w_data["reassigned_worker"]["id"] == 102
    assert "VEHICLE_BREAKDOWN" in w_data["incident_report"]["reason"]
    print(f"[PASS] Post-acceptance withdrawal successfully auto-reassigned from Worker 101 to {w_data['reassigned_worker']['name']}.")

    # Verify Worker 101 disciplinary metrics updated
    assert worker_101["withdrawal_count"] == init_withdrawals + 1
    assert worker_101["disciplinary_status"] == "UNDER_REVIEW"
    print("[PASS] Withdrawing worker disciplinary status updated to UNDER_REVIEW and logged.")

    # Verify incident report appears in Ministry Disciplinary Audit Log
    rejections_res = client.get("/api/ministry/workers/rejections")
    assert rejections_res.status_code == 200
    rej_data = rejections_res.json()
    incident_types = [r.get("type") for r in rej_data["rejections_log"]]
    assert "POST_ACCEPTANCE_WITHDRAWAL" in incident_types
    print("[PASS] Official late-withdrawal incident report registered in Ministry Disciplinary Log.")

if __name__ == "__main__":
    test_freelance_platform()
    test_worker_complaint_and_debarment()
    test_worker_rejections_and_ministry_discipline()
    test_growth_analytics_and_withdrawal_reassignment()
    print("\n==============================================")
    print("  ALL 4 FEATURE TEST SUITES PASSED (100% OK)  ")
    print("==============================================")

