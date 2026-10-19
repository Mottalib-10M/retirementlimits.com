#!/usr/bin/env python3
"""Rebuilds src/data/life-tables.json from the eCFR text of 26 CFR 1.401(a)(9)-9.
Refresh the source first:
  curl -sL -o scripts/data/ecfr-1.401a9-9.html "https://www.ecfr.gov/api/renderer/v1/content/enhanced/current/title-26?part=1&section=1.401(a)(9)-9"
Usage: python3 scripts/build-tables.py"""
import re, html, json
s = open('scripts/data/ecfr-1.401a9-9.html').read()
ok = lambda x: x.replace('+', '')
tabs = re.findall(r'<table.*?</table>', s, flags=re.S)
def rows(t):
    return [[re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', '', c))).strip() for c in re.findall(r'<t[hd].*?</t[hd]>', r, flags=re.S)] for r in re.findall(r'<tr.*?</tr>', t, flags=re.S)]
single = {int(ok(a)): float(b) for a, b in rows(tabs[0])[1:]}
uniform = {int(ok(a)): float(b) for a, b in rows(tabs[1])[1:]}
joint = {}
for t in tabs[2:27]:
    r = rows(t); cols = r[0][1:]
    for row in r[1:]:
        a = int(ok(row[0]))
        for c, v in zip(cols, row[1:]):
            if c and v: joint.setdefault(int(ok(c)), {})[a] = float(v)
# Owner ages 70 to 120, spouse ages 20 to owner - 11 (Table II is only used for a spouse more than 10 years younger).
J = {o: {sp: joint[o][sp] for sp in range(20, o - 10)} for o in range(70, 121)}
assert joint[75][64] == 25.3 and uniform[75] == 24.6 and uniform[72] == 27.4, 'Pub. 590-B examples no longer match'
json.dump({"_source": "26 CFR 1.401(a)(9)-9(b) Single Life Table, (c) Uniform Lifetime Table, (d) Joint and Last Survivor Table, eCFR current text read 2026-10-19 (script scripts/build-tables.py). Same values as Tables I, II and III of IRS Publication 590-B (2025).",
           "single": {str(k): v for k, v in single.items()}, "uniform": {str(k): v for k, v in uniform.items()},
           "joint": {str(o): {str(k): v for k, v in d.items()} for o, d in J.items()}}, open('src/data/life-tables.json', 'w'), indent=0)
print('life-tables.json:', len(single), 'single,', len(uniform), 'uniform,', len(J), 'joint rows')
