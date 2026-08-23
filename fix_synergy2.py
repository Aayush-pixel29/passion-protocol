
with open("components/SynergyProof.tsx", "r", encoding="utf-8") as f:
    c = f.read()

import re
c = re.sub(r"<div className=\"mesh-bg\".*?/>", "", c)
c = c.replace("rgba(0, 255, 179, 0.3)", "#e4e4e7")

with open("components/SynergyProof.tsx", "w", encoding="utf-8") as f:
    f.write(c)

