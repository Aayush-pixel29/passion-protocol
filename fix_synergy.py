
with open("components/SynergyProof.tsx", "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace("glass-panel", "match-card")
c = c.replace("glass", "match-card")
c = c.replace("var(--surface-card)", "#ffffff")
c = c.replace("var(--accent-emerald)", "#000000")
c = c.replace("var(--accent-purple)", "#000000")
c = c.replace("color: \"#00ffb3\"", "color: \"#000000\"")
c = c.replace("background: \"rgba(0, 255, 179, 0.1)\"", "background: \"#f4f4f5\"")
c = c.replace("glow-emerald", "")
c = c.replace("text-glow-emerald", "")
c = c.replace("glow-purple", "")

with open("components/SynergyProof.tsx", "w", encoding="utf-8") as f:
    f.write(c)

