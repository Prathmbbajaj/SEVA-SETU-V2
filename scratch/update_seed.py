import json

with open('backend/seed_data.py', 'r', encoding='utf-8') as f:
    code = f.read()

start = code.find('REGIONAL_DEMAND_DETAILED: List[Dict[str, Any]] = [')
eq_pos = code.find('=', start)
start_bracket = code.find('[', eq_pos)
end = code.find('REVENUE_METRICS: Dict[str, Any] = {')
end_bracket = code.rfind(']', start, end) + 1

list_code = code[start_bracket:end_bracket]
data = eval(list_code)
allowed = ['electrician', 'plumber', 'driver', 'cleaning', 'carpentry', 'tailoring']

for d in data:
    d['trade_demand'] = {k: d['trade_demand'][k] for k in allowed if k in d['trade_demand']}
    d['trades'] = {k: d['trades'][k] for k in allowed if k in d['trades']}
    d['trade_requirements'] = {k: d['trade_requirements'][k] for k in allowed if k in d['trade_requirements']}

lines = ['REGIONAL_DEMAND_DETAILED: List[Dict[str, Any]] = [']
for i, d in enumerate(data):
    lines.append('    {')
    lines.append(f'        "district": "{d["district"]}",')
    lines.append(f'        "overall_demand": {d["overall_demand"]},')
    lines.append(f'        "demand_index": {d["demand_index"]},')
    lines.append(f'        "active_workers": {d["active_workers"]},')
    lines.append(f'        "required_workers": {d["required_workers"]},')
    lines.append(f'        "shortage": {d["shortage"]},')
    lines.append(f'        "status": "{d["status"]}",')
    
    # trade_demand
    lines.append('        "trade_demand": {')
    td_lines = [f'            "{k}": {v}' for k, v in d["trade_demand"].items()]
    lines.append(',\n'.join(td_lines))
    lines.append('        },')
    
    # trades
    lines.append('        "trades": {')
    tr_lines = [f'            "{k}": {v}' for k, v in d["trades"].items()]
    lines.append(',\n'.join(tr_lines))
    lines.append('        },')
    
    # trade_requirements
    lines.append('        "trade_requirements": {')
    req_lines = [f'            "{k}": {json.dumps(v)}' for k, v in d["trade_requirements"].items()]
    lines.append(',\n'.join(req_lines))
    lines.append('        },')
    
    lines.append(f'        "monthly_orders": {d["monthly_orders"]}')
    if i < len(data) - 1:
        lines.append('    },')
    else:
        lines.append('    }')
lines.append(']\n')

new_block = '\n'.join(lines)
new_code = code[:start] + new_block + '\n' + code[end:]

with open('backend/seed_data.py', 'w', encoding='utf-8') as f:
    f.write(new_code)

print('Updated backend/seed_data.py successfully!')
