import subprocess

c = subprocess.check_output(['git', 'show', 'HEAD:frontend/app.js'], encoding='utf-8')

with open('scratch/sub_catalog_head.txt', 'w', encoding='utf-8') as f:
    for trade in ['painting', 'pottery', 'blacksmith']:
        idx = c.find(f'  {trade}: [')
        if idx != -1:
            end = c.find('\n  ],', idx)
            f.write(c[idx:end+5] + '\n\n')

print("Wrote sub_catalog_head.txt successfully")
