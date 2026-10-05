import subprocess

c = subprocess.check_output(['git', 'show', 'fea41e5:frontend/app.js'], encoding='utf-8')

out = []
for term in ['painting', 'pottery', 'blacksmith']:
    needle = f'  {term}: ['
    idx = c.find(needle)
    if idx != -1:
        # find matching bracket end
        next_trade = c.find('\n  ', idx + len(needle))
        # let's find the closing of this subservice array
        end_idx = c.find('  ],', idx)
        out.append(f"// === {term.upper()} SUB SERVICES ===")
        out.append(c[idx:end_idx+4])

with open('scratch/found_subservices.txt', 'w', encoding='utf-8') as f:
    f.write('\n\n'.join(out))

print("Wrote subservices successfully")
