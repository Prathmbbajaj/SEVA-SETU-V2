with open('frontend/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Search input placeholder
old_p = 'placeholder="Type a trade (e.g. Electrician, Plumber, Emergency Nursing)..."'
new_p = 'placeholder="Type a trade (e.g. Electrician, Plumber, Carpentry, Driver)..."'
assert old_p in html, "old_p not found"
html = html.replace(old_p, new_p)

# 2. Quick suggestion chips
idx_q = html.find('id="txt-quick-suggestions"')
if idx_q == -1:
    idx_q = html.find('data-i18n="txt-quick-suggestions"')
assert idx_q != -1, "quick suggestions not found"
end_chips = html.find('</div>', idx_q)
chips_block = html[idx_q:end_chips]
new_chips_inner = '''data-i18n="txt-quick-suggestions">Quick Suggestions:</span>
              <button onclick="applyQuickSearch('electrician')" class="text-[11px] bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-semibold px-2.5 py-1 rounded-lg border border-slate-200 transition btn-tactile">⚡ Electrician (₹120/hr)</button>
              <button onclick="applyQuickSearch('plumber')" class="text-[11px] bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-semibold px-2.5 py-1 rounded-lg border border-slate-200 transition btn-tactile">🔧 Plumber (₹110/hr)</button>
              <button onclick="applyQuickSearch('carpentry')" class="text-[11px] bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-lg border border-amber-300 transition btn-tactile">🔨 Carpentry (₹115/hr)</button>
              <button onclick="applyQuickSearch('cleaning')" class="text-[11px] bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-semibold px-2.5 py-1 rounded-lg border border-slate-200 transition btn-tactile">✨ Cleaning (₹90/hr)</button>
              <button onclick="applyQuickSearch('tailoring')" class="text-[11px] bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-semibold px-2.5 py-1 rounded-lg border border-slate-200 transition btn-tactile">✂️ Tailoring (₹90/hr)</button>
              <button onclick="applyQuickSearch('driver')" class="text-[11px] bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-semibold px-2.5 py-1 rounded-lg border border-slate-200 transition btn-tactile">🚗 Driver (₹130/hr)</button>'''
html = html[:idx_q] + new_chips_inner + html[end_chips:]

# 3. Sunita Sharma auth tile
old_tile = '<div class="text-[10px] text-purple-700 font-bold mt-0.5">🩺 Healthcare (South Delhi)</div>'
new_tile = '<div class="text-[10px] text-purple-700 font-bold mt-0.5">✂️ Tailoring (South Delhi)</div>'
assert old_tile in html, "old_tile not found"
html = html.replace(old_tile, new_tile)

# 4. Sunita persona select
old_opt = '<option value="103">Sunita Sharma (Healthcare)</option>'
new_opt = '<option value="103">Sunita Sharma (Tailoring)</option>'
assert old_opt in html, "old_opt not found"
html = html.replace(old_opt, new_opt)

# 5. Dedicated Worker Welfare & Safety
old_wel = 'Dedicated Worker Healthcare & Safety'
new_wel = 'Dedicated Worker Welfare & Safety'
assert old_wel in html, "old_wel not found"
html = html.replace(old_wel, new_wel)

# 6. Ministry service select
idx_min_sel = html.find('id="min-service-select"')
assert idx_min_sel != -1
end_min_sel = html.find('</select>', idx_min_sel)
new_min_opts = '''id="min-service-select" onchange="onMinistryServiceChange(this.value)" class="bg-transparent text-xs font-black text-slate-800 outline-none cursor-pointer pr-2">
                <option value="all">📊 All 6 Services (Consolidated Report)</option>
                <option value="electrician">⚡ Electrician Services</option>
                <option value="plumber">🔧 Plumbing & Sanitation</option>
                <option value="carpentry">🪚 Carpentry & Woodcraft</option>
                <option value="cleaning">🧹 Deep Sanitation & Facility Care</option>
                <option value="tailoring">🧵 Tailoring & Apparel</option>
                <option value="driver">🚗 Chauffeur & Commercial Transit</option>
              '''
html = html[:idx_min_sel] + new_min_opts + html[end_min_sel:]

# 7. Elderly Support & Assisted Living
old_ngo = '<option value="elder">Elderly Healthcare & Assisted Living</option>'
new_ngo = '<option value="elder">Elderly Support & Assisted Living</option>'
assert old_ngo in html, "old_ngo not found"
html = html.replace(old_ngo, new_ngo)

# 8. Review submission select
idx_rev_svc = html.find('id="review-input-service"')
assert idx_rev_svc != -1
end_rev_svc = html.find('</select>', idx_rev_svc)
new_rev_svc_opts = '''id="review-input-service" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white">
              <option value="electrician">Electrician</option>
              <option value="plumber">Plumber</option>
              <option value="driver">Emergency Driver</option>
              <option value="tailoring">Tailoring & Handloom</option>
              <option value="cleaning">Deep Cleaning</option>
              <option value="carpentry">Carpentry & Woodcraft</option>
            '''
html = html[:idx_rev_svc] + new_rev_svc_opts + html[end_rev_svc:]

idx_rev_wkr = html.find('id="review-input-worker"')
assert idx_rev_wkr != -1
end_rev_wkr = html.find('</select>', idx_rev_wkr)
new_rev_wkr_opts = '''id="review-input-worker" class="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white">
              <option value="101">Rajesh Kumar (Electrician)</option>
              <option value="102">Mohammad Aslam (Plumber)</option>
              <option value="103">Sunita Sharma (Tailoring)</option>
              <option value="104">Vikram Singh (Driver)</option>
              <option value="105">Pooja Devi (Cleaning)</option>
              <option value="108">Rameshwar Mistri (Carpentry)</option>
            '''
html = html[:idx_rev_wkr] + new_rev_wkr_opts + html[end_rev_wkr:]

# 9. Debarment modal checkboxes
idx_debar = html.find('id="min-debar-services-list"')
assert idx_debar != -1
end_debar = html.find('</div>', idx_debar)
new_debar_opts = '''id="min-debar-services-list" class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
              <label class="flex items-center space-x-2 text-slate-700 cursor-pointer">
                <input type="checkbox" name="min_debar_service" value="electrician" class="w-3.5 h-3.5 text-red-600 rounded" />
                <span>⚡ Electrician</span>
              </label>
              <label class="flex items-center space-x-2 text-slate-700 cursor-pointer">
                <input type="checkbox" name="min_debar_service" value="plumber" class="w-3.5 h-3.5 text-red-600 rounded" />
                <span>🔧 Plumber</span>
              </label>
              <label class="flex items-center space-x-2 text-slate-700 cursor-pointer">
                <input type="checkbox" name="min_debar_service" value="driver" class="w-3.5 h-3.5 text-red-600 rounded" />
                <span>🚗 Driver</span>
              </label>
              <label class="flex items-center space-x-2 text-slate-700 cursor-pointer">
                <input type="checkbox" name="min_debar_service" value="tailoring" class="w-3.5 h-3.5 text-red-600 rounded" />
                <span>✂️ Tailoring</span>
              </label>
              <label class="flex items-center space-x-2 text-slate-700 cursor-pointer">
                <input type="checkbox" name="min_debar_service" value="cleaning" class="w-3.5 h-3.5 text-red-600 rounded" />
                <span>✨ Cleaning</span>
              </label>
              <label class="flex items-center space-x-2 text-slate-700 cursor-pointer">
                <input type="checkbox" name="min_debar_service" value="carpentry" class="w-3.5 h-3.5 text-red-600 rounded" />
                <span>🪚 Carpentry</span>
              </label>
            '''
html = html[:idx_debar] + new_debar_opts + html[end_debar:]

with open('frontend/index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print('frontend/index.html updated successfully!')
