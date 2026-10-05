import subprocess

c = subprocess.check_output(['git', 'show', 'fea41e5:frontend/app.js'], encoding='utf-8')

idx = c.find('SUB_SERVICES_CATALOG')
print("SUB_SERVICES_CATALOG found at:", idx)
with open('scratch/sub_catalog_sample.txt', 'w', encoding='utf-8') as f:
    f.write(c[idx:idx+8000])

print("Wrote sample")
