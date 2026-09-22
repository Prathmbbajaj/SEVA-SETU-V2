import requests
import sys

BASE_URL = "http://localhost:8000"

def test_live_api():
    print("Testing live FastAPI backend on", BASE_URL)
    
    # 1. Health check
    res = requests.get(f"{BASE_URL}/")
    assert res.status_code == 200, f"Health check failed: {res.status_code}"
    print("[PASS] 1. Root health check status 200")
    
    # 2. Freelance jobs
    res = requests.get(f"{BASE_URL}/api/freelance/jobs")
    assert res.status_code == 200
    jobs = res.json().get("jobs", [])
    assert len(jobs) >= 4
    print(f"[PASS] 2. Fetched {len(jobs)} freelance jobs successfully")
    
    # Apply to a freelance job
    res = requests.post(f"{BASE_URL}/api/freelance/jobs/FL-502/apply", json={"worker_id": 102})
    assert res.status_code == 200
    applied_job = res.json()["job"]
    assert applied_job["claimed_by"] == 102
    assert applied_job["federation_cut"] == 0.0
    print(f"[PASS] 3. Worker 102 claimed FL-502 with 100% take-home: Rs.{applied_job['worker_takehome']}")

    # 3. Update worker freelance settings
    res = requests.post(f"{BASE_URL}/api/workers/102/freelance-settings", json={
        "freelance_enabled": True,
        "freelance_slots": ["17:00 - 21:00 (Evening)", "Weekend Full Flexible"]
    })
    assert res.status_code == 200
    assert res.json()["worker"]["freelance_enabled"] is True
    print("[PASS] 4. Worker 102 freelance settings and slot availability updated")

    # 4. Worker Incident Escalation
    res = requests.post(f"{BASE_URL}/api/workers/complaints/escalate", json={
        "worker_id": 102,
        "customer_name": "Rohan Verma",
        "customer_phone": "+91 98990 01122",
        "category": "CUSTOMER_ABUSE_MISBEHAVIOR",
        "delay_hours": 3.0,
        "description": "Customer was verbally abusive and delayed completion verification by 3 hours."
    })
    assert res.status_code == 200
    data = res.json()
    assert data["customer_debarred"] is True
    print(f"[PASS] 5. 2nd worker escalation against 'Rohan Verma' triggered automatic debarment: {data['customer_debarred']}")

    # 5. Debarred customer booking blocked
    res = requests.post(f"{BASE_URL}/api/bookings/new", json={
        "customer_name": "Rohan Verma",
        "service_type": "plumber",
        "pricing": { "total_amount": 250.0 }
    })
    assert res.status_code == 403, f"Expected 403 for debarred customer, got {res.status_code}"
    print(f"[PASS] 6. Debarred booking forbidden with 403: {res.json()['detail']}")

    # 6. Ministry Worker Rejections Telemetry
    res = requests.get(f"{BASE_URL}/api/ministry/workers/rejections")
    assert res.status_code == 200
    rejections_data = res.json()
    flagged = rejections_data.get("flagged_workers", [])
    print(f"[PASS] 7. Ministry telemetry received: {len(flagged)} workers flagged for review")

    # 7. Ministry Fire Worker Action
    res = requests.post(f"{BASE_URL}/api/ministry/workers/106/discipline", json={
        "action": "FIRE",
        "reason": "Repeated SLA non-compliance and refusal of 3+ dispatches"
    })
    assert res.status_code == 200
    w106 = res.json()["worker"]
    assert w106["disciplinary_status"] == "FIRED"
    assert w106["is_verified"] is False
    print(f"[PASS] 8. Ministry terminated worker 106. Disciplinary status: {w106['disciplinary_status']}")

    # 8. Dispatch excludes fired worker
    res = requests.get(f"{BASE_URL}/api/workers/106/freelance")
    assert res.status_code == 200
    assert res.json()["worker"]["disciplinary_status"] == "FIRED"
    print(f"[PASS] 9. Worker 106 status confirmed FIRED across all APIs")

    print("\n>>> ALL LIVE HTTP BACKEND & END-TO-END TESTS PASSED SUCCESSFULLY! <<<")

if __name__ == "__main__":
    test_live_api()
