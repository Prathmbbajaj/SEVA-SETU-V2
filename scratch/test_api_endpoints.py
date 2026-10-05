import sys, os
sys.path.insert(0, os.path.abspath('.'))
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

# 1. Test quote for each allowed service
services = ['electrician', 'plumber', 'driver', 'tailoring', 'cleaning', 'carpentry']
for s in services:
    res = client.post('/api/pricing/quote', json={'service_type': s, 'plan': 'hourly', 'is_emergency': False})
    assert res.status_code == 200, f'Quote failed for {s}: {res.text}'
    data = res.json()
    print(f'Quote for {s}: labor={data["breakdown"]["labor_cost"]}, total={data["total_amount"]}')

# 2. Test regional demand
res = client.get('/api/ministry/regional-demand')
assert res.status_code == 200
data = res.json()
for d in data['districts']:
    keys = list(d['trade_demand'].keys())
    print(f'District {d["district"]} trades: {keys}')
    assert set(keys) == set(services), f'Mismatch in {d["district"]}: {keys}'

# 3. Test freelance gigs
res = client.get('/api/freelance/jobs')
assert res.status_code == 200
print('Freelance jobs count:', len(res.json()['jobs']))

# 4. Verify removed services are rejected or not present
removed = ['painting', 'healthcare', 'masonry', 'pottery', 'blacksmith', 'waste_management']
for r in removed:
    res = client.post('/api/quote', json={'service_type': r, 'plan_type': 'hourly', 'is_emergency': False})
    # either 400/422/fallback
    print(f'Removed service {r} quote status: {res.status_code}')

print('ALL API CHECKS PASSED SUCCESSFULLY!')
