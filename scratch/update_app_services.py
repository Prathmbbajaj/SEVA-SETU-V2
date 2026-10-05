import re, json

with open('frontend/app.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update comment
code = code.replace(
    '// SPECIFIC WORK / SUB-SERVICES CATALOG (ALL 12 COOPERATIVE TRADES)',
    '// SPECIFIC WORK / SUB-SERVICES CATALOG (6 ESSENTIAL COOPERATIVE TRADES)'
)

# 2. Cut painting, healthcare, masonry, pottery, blacksmith from SUB_SERVICES_CATALOG
start_sub = code.find('  painting: [')
end_sub = code.find('  tailoring: [')
assert start_sub != -1 and end_sub != -1, f"Could not find sub catalog: {start_sub}, {end_sub}"
code = code[:start_sub] + code[end_sub:]

# 3. Update WORKER_SWITCH_PERSONAS
old_persona = '"103": { id: 103, name: "Sunita Sharma", skill: "healthcare"'
new_persona = '"103": { id: 103, name: "Sunita Sharma", skill: "tailoring"'
assert old_persona in code, "old_persona not found"
code = code.replace(old_persona, new_persona)

# 4. Update search placeholder
old_ph_1 = '"सेवा खोजें (उदा. बढ़ई, कुम्हार, लोहार, इलेक्ट्रीशियन, प्लम्बर)..."'
new_ph_1 = '"सेवा खोजें (उदा. इलेक्ट्रीशियन, प्लम्बर, बढ़ई, सफाई, सिलाई, ड्राइवर)..."'
assert old_ph_1 in code, "old_ph_1 not found"
code = code.replace(old_ph_1, new_ph_1)

old_ph_2 = '"Type a trade (e.g. Carpentry, Pottery, Blacksmith, Electrician, Plumber)..."'
new_ph_2 = '"Type a trade (e.g. Electrician, Plumber, Carpentry, Cleaning, Tailoring, Driver)..."'
assert old_ph_2 in code, "old_ph_2 not found"
code = code.replace(old_ph_2, new_ph_2)

# 5. Update empty search state
old_empty = '${isHi ? "बढ़ई, कुम्हार, लोहार, इलेक्ट्रीशियन, प्लम्बर, राजमिस्त्री या पेंटर खोजें।" : "Try searching for Carpentry, Pottery, Blacksmith, Electrician, Plumber, Masonry or Painting."}'
new_empty = '${isHi ? "इलेक्ट्रीशियन, प्लम्बर, बढ़ई, सफाई, सिलाई या ड्राइवर खोजें।" : "Try searching for Electrician, Plumber, Carpentry, Cleaning, Tailoring or Driver."}'
assert old_empty in code, "old_empty not found"
code = code.replace(old_empty, new_empty)

# 6. Offer description
old_offer = 'description: "₹500 credit redeemable on home painting, carpentry renovation, and artisan terracotta decor."'
new_offer = 'description: "₹500 credit redeemable on carpentry renovation, tailoring, and electrical home upgrades."'
assert old_offer in code, "old_offer not found"
code = code.replace(old_offer, new_offer)

# 7. Review 2
code = code.replace(
    'service: "healthcare",\n      service_title: "Elder Nursing & Vitals Check",\n      rating: 5,\n      type: "positive",\n      comment: "Sunita did an exceptional job monitoring post-operative vitals for my mother. NSDC certified, extremely polite, and compassionate."',
    'service: "tailoring",\n      service_title: "Boutique Fit & Kurta Alteration",\n      rating: 5,\n      type: "positive",\n      comment: "Sunita did an exceptional job stitching custom festival kurtas and altering suits for my family. Extremely polite, prompt, and skilled."'
)
code = code.replace(
    'service: "healthcare",\r\n      service_title: "Elder Nursing & Vitals Check",\r\n      rating: 5,\r\n      type: "positive",\r\n      comment: "Sunita did an exceptional job monitoring post-operative vitals for my mother. NSDC certified, extremely polite, and compassionate."',
    'service: "tailoring",\r\n      service_title: "Boutique Fit & Kurta Alteration",\r\n      rating: 5,\r\n      type: "positive",\r\n      comment: "Sunita did an exceptional job stitching custom festival kurtas and altering suits for my family. Extremely polite, prompt, and skilled."'
)

# 8. Report text
old_rep = 'artisan stipends to regional pottery, blacksmith, and carpentry clusters.'
new_rep = 'artisan stipends to regional tailoring and carpentry clusters.'
assert old_rep in code, "old_rep not found"
code = code.replace(old_rep, new_rep)

# 9. WORKER_PERSONAS sunita
old_sunita = '  sunita: {\n    id: 103,\n    name: "Sunita Sharma",\n    skill: "healthcare",'
new_sunita = '  sunita: {\n    id: 103,\n    name: "Sunita Sharma",\n    skill: "tailoring",'
if old_sunita not in code:
    old_sunita = old_sunita.replace('\n', '\r\n')
    new_sunita = new_sunita.replace('\n', '\r\n')
assert old_sunita in code, "old_sunita not found"
code = code.replace(old_sunita, new_sunita)

code = code.replace(
    'certificate: "General Nursing Assistant (NSDC Certified)",\n    cert_title: "General Nursing Assistant",\n    cert_issuer: "NSDC Certified"',
    'certificate: "Weavers Cooperative Federation Master Tailoring Certificate",\n    cert_title: "Weavers Federation Tailoring L4",\n    cert_issuer: "Handloom Development Board & NSDC"'
)
code = code.replace(
    'certificate: "General Nursing Assistant (NSDC Certified)",\r\n    cert_title: "General Nursing Assistant",\r\n    cert_issuer: "NSDC Certified"',
    'certificate: "Weavers Cooperative Federation Master Tailoring Certificate",\r\n    cert_title: "Weavers Federation Tailoring L4",\r\n    cert_issuer: "Handloom Development Board & NSDC"'
)

# 10. Replace 'All 12 Services' and 'सभी 12 सेवाएँ'
code = code.replace('All 12 Services', 'All 6 Services')
code = code.replace('सभी 12 सेवाएँ', 'सभी 6 सेवाएँ')

# 11. DEFAULT_REGIONAL_DEMAND: Filter trade_demand and trade_requirements across all 5 districts
allowed_trades = ['electrician', 'plumber', 'driver', 'cleaning', 'carpentry', 'tailoring']

# Parse the DEFAULT_REGIONAL_DEMAND array block
start_drd = code.find('const DEFAULT_REGIONAL_DEMAND = [')
end_drd = code.find('function initMinistryServiceRequirements()', start_drd)
drd_block = code[start_drd:end_drd]

new_drd = '''const DEFAULT_REGIONAL_DEMAND = [
  {
    district: "Central Delhi",
    district_hi: "मध्य दिल्ली",
    demand_index: 94,
    active_workers: 45,
    required_workers: 76,
    status: "Critical Shortage",
    monthly_orders: 1420,
    trade_demand: {
      electrician: 98, plumber: 85, carpentry: 82, cleaning: 92,
      tailoring: 75, driver: 88
    },
    trade_requirements: {
      electrician: { required: 32, active: 18, deficit: 14, demand_score: 98, monthly_orders: 420 },
      plumber: { required: 24, active: 15, deficit: 9, demand_score: 85, monthly_orders: 310 },
      carpentry: { required: 18, active: 11, deficit: 7, demand_score: 82, monthly_orders: 240 },
      cleaning: { required: 28, active: 20, deficit: 8, demand_score: 92, monthly_orders: 360 },
      tailoring: { required: 15, active: 11, deficit: 4, demand_score: 75, monthly_orders: 150 },
      driver: { required: 22, active: 16, deficit: 6, demand_score: 88, monthly_orders: 280 }
    }
  },
  {
    district: "South Delhi",
    district_hi: "दक्षिण दिल्ली",
    demand_index: 88,
    active_workers: 52,
    required_workers: 68,
    status: "High Demand",
    monthly_orders: 1850,
    trade_demand: {
      electrician: 84, plumber: 82, carpentry: 86, cleaning: 89,
      tailoring: 80, driver: 85
    },
    trade_requirements: {
      electrician: { required: 26, active: 22, deficit: 4, demand_score: 84, monthly_orders: 340 },
      plumber: { required: 22, active: 18, deficit: 4, demand_score: 82, monthly_orders: 290 },
      carpentry: { required: 20, active: 16, deficit: 4, demand_score: 86, monthly_orders: 260 },
      cleaning: { required: 30, active: 25, deficit: 5, demand_score: 89, monthly_orders: 410 },
      tailoring: { required: 16, active: 14, deficit: 2, demand_score: 80, monthly_orders: 200 },
      driver: { required: 25, active: 22, deficit: 3, demand_score: 85, monthly_orders: 320 }
    }
  },
  {
    district: "East Delhi",
    district_hi: "पूर्वी दिल्ली",
    demand_index: 76,
    active_workers: 38,
    required_workers: 46,
    status: "Stable Supply",
    monthly_orders: 980,
    trade_demand: {
      electrician: 75, plumber: 80, carpentry: 72, cleaning: 78,
      tailoring: 88, driver: 70
    },
    trade_requirements: {
      electrician: { required: 18, active: 16, deficit: 2, demand_score: 75, monthly_orders: 210 },
      plumber: { required: 16, active: 14, deficit: 2, demand_score: 80, monthly_orders: 190 },
      carpentry: { required: 14, active: 12, deficit: 2, demand_score: 72, monthly_orders: 160 },
      cleaning: { required: 20, active: 18, deficit: 2, demand_score: 78, monthly_orders: 240 },
      tailoring: { required: 22, active: 18, deficit: 4, demand_score: 88, monthly_orders: 250 },
      driver: { required: 15, active: 13, deficit: 2, demand_score: 70, monthly_orders: 180 }
    }
  },
  {
    district: "West Delhi",
    district_hi: "पश्चिम दिल्ली",
    demand_index: 82,
    active_workers: 40,
    required_workers: 56,
    status: "Shortage Alert",
    monthly_orders: 1210,
    trade_demand: {
      electrician: 90, plumber: 94, carpentry: 88, cleaning: 80,
      tailoring: 84, driver: 76
    },
    trade_requirements: {
      electrician: { required: 25, active: 17, deficit: 8, demand_score: 90, monthly_orders: 310 },
      plumber: { required: 24, active: 14, deficit: 10, demand_score: 94, monthly_orders: 330 },
      carpentry: { required: 18, active: 12, deficit: 6, demand_score: 88, monthly_orders: 220 },
      cleaning: { required: 22, active: 18, deficit: 4, demand_score: 80, monthly_orders: 260 },
      tailoring: { required: 18, active: 14, deficit: 4, demand_score: 84, monthly_orders: 210 },
      driver: { required: 18, active: 15, deficit: 3, demand_score: 76, monthly_orders: 200 }
    }
  },
  {
    district: "North Delhi",
    district_hi: "उत्तर दिल्ली",
    demand_index: 68,
    active_workers: 30,
    required_workers: 36,
    status: "Balanced",
    monthly_orders: 840,
    trade_demand: {
      electrician: 70, plumber: 66, carpentry: 68, cleaning: 72,
      tailoring: 70, driver: 68
    },
    trade_requirements: {
      electrician: { required: 15, active: 13, deficit: 2, demand_score: 70, monthly_orders: 170 },
      plumber: { required: 14, active: 12, deficit: 2, demand_score: 66, monthly_orders: 150 },
      carpentry: { required: 12, active: 10, deficit: 2, demand_score: 68, monthly_orders: 140 },
      cleaning: { required: 16, active: 14, deficit: 2, demand_score: 72, monthly_orders: 180 },
      tailoring: { required: 14, active: 12, deficit: 2, demand_score: 70, monthly_orders: 150 },
      driver: { required: 14, active: 12, deficit: 2, demand_score: 68, monthly_orders: 160 }
    }
  }
];

'''

code = code[:start_drd] + new_drd + code[end_drd:]

with open('frontend/app.js', 'w', encoding='utf-8') as f:
    f.write(code)

print('frontend/app.js updated successfully!')
