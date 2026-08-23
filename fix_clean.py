
files = [
    "components/ChatInterface.tsx",
    "components/DiscoverGrid.tsx",
    "components/WorkspaceBoard.tsx",
    "components/OnboardingForm.tsx",
    "components/SynergyProof.tsx"
]

for filepath in files:
    with open(filepath, "r", encoding="utf-8") as f:
        c = f.read()
    
    c = c.replace("rgba(180, 77, 255, 0.15)", "#f4f4f5")
    c = c.replace("rgba(180, 77, 255, 0.1)", "#f4f4f5")
    c = c.replace("rgba(180, 77, 255, 0.08)", "#f4f4f5")
    c = c.replace("rgba(180, 77, 255, 0.3)", "#000000")
    c = c.replace("rgba(180, 77, 255, 0.2)", "#000000")
    
    c = c.replace("rgba(0, 255, 179, 0.15)", "#f4f4f5")
    c = c.replace("rgba(0, 255, 179, 0.05)", "#f4f4f5")
    c = c.replace("rgba(0, 255, 179, 0.3)", "#000000")
    c = c.replace("rgba(0, 255, 179, 0.2)", "#000000")
    
    c = c.replace("rgba(6, 182, 212, 0.1)", "#f4f4f5")
    
    c = c.replace("glow-emerald", "")
    c = c.replace("text-glow-emerald", "")
    c = c.replace("glow-purple", "")
    c = c.replace("text-glow-purple", "")
    c = c.replace("glow-cyan", "")
    
    c = c.replace("boxShadow: \"0 8px 32px rgba(0, 255, 179, 0.15)\"", "boxShadow: \"none\"")
    c = c.replace("boxShadow: \"0 4px 24px rgba(180, 77, 255, 0.2)\"", "boxShadow: \"none\"")
    c = c.replace("boxShadow: isActive ? \"0 0 16px rgba(180, 77, 255, 0.3)\" : \"none\"", "boxShadow: \"none\"")
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(c)

with open("app/page.tsx", "r", encoding="utf-8") as f:
    p = f.read()

p = p.replace("className=\"wrap mesh-bg\"", "className=\"wrap\"")
p = p.replace("className=\"gradient-text\"", "")
p = p.replace("<SynergyProof />", "<div style={{ display: \"none\" }}></div>")

with open("app/page.tsx", "w", encoding="utf-8") as f:
    f.write(p)

