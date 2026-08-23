
import re

with open("app/page.tsx", "r", encoding="utf-8") as f:
    p = f.read()

p = re.sub(r"<span className=\"badge-spark\">.*?</span>", "", p, flags=re.DOTALL)
p = re.sub(r"<span className=\"badge-text\">.*?</span>", "<span style={{ fontWeight: 800, textTransform: \"uppercase\", letterSpacing: \"0.1em\" }}>Strictly B&W. Match on Code, Not Vibes.</span>", p, flags=re.DOTALL)
p = p.replace("className=\"hero-badge-pill\"", "className=\"hero-badge-pill match-card\"")

with open("app/page.tsx", "w", encoding="utf-8") as f:
    f.write(p)

