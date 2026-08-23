
import re

with open("components/OnboardingForm.tsx", "r", encoding="utf-8") as f:
    c = f.read()

# 1. Replace the React conditionals with display style
c = re.sub(
    r"\{step === 1 && \(\s*(<div className=\"animate-slide-up.*?>)",
    r"<div className=\"animate-slide-up match-card onboarding-card\" style={{ display: step === 1 ? \"block\" : \"none\", padding: 40, borderRadius: 24 }}>",
    c, flags=re.DOTALL
)
c = re.sub(
    r"\{step === 2 && \(\s*(<div className=\"animate-slide-up.*?>)",
    r"<div className=\"animate-slide-up match-card onboarding-card\" style={{ display: step === 2 ? \"block\" : \"none\", padding: 40, borderRadius: 24 }}>",
    c, flags=re.DOTALL
)
c = re.sub(
    r"\{step === 3 && \(\s*(<div className=\"animate-slide-up.*?>)",
    r"<div className=\"animate-slide-up match-card onboarding-card\" style={{ display: step === 3 ? \"block\" : \"none\", padding: 40, borderRadius: 24 }}>",
    c, flags=re.DOTALL
)
c = re.sub(
    r"\{step === 4 && \(\s*(<div className=\"animate-slide-up.*?>)",
    r"<div className=\"animate-slide-up match-card onboarding-card\" style={{ display: step === 4 ? \"block\" : \"none\", padding: 40, borderRadius: 24, textAlign: \"center\" }}>",
    c, flags=re.DOTALL
)

# 2. Remove the closing brackets for those blocks
c = re.sub(r"          </div>\n\s*\)\}\n", "          </div>\n", c)

# 3. Validation for step 1
c = c.replace(
    "onClick={() => setStep(2)}",
    "onClick={() => { if (codename.trim().length < 2) { alert(\"Codename must be at least 2 characters.\"); return; } setStep(2); }}"
)

# 4. Brutalize CSS classes specifically in this file
c = c.replace("glow-emerald", "")
c = c.replace("text-glow-emerald", "")
c = c.replace("glow-cyan", "")
c = c.replace("var(--glow-purple)", "none")
c = c.replace("rgba(180, 77, 255, 0.05)", "#ffffff")
c = c.replace("rgba(0, 255, 179, 0.05)", "#ffffff")
c = c.replace("rgba(0, 255, 179, 0.2)", "#000000")
c = c.replace("glass", "match-card")
c = c.replace("background: \"rgba(255,255,255,0.02)\", border: \"1px solid rgba(255,255,255,0.1)\"", "background: \"#ffffff\", border: \"2px solid #000000\"")
c = c.replace("color: \"#fff\"", "color: \"#ffffff\"")
c = c.replace("rgba(255,255,255,0.02)", "#ffffff")


with open("components/OnboardingForm.tsx", "w", encoding="utf-8") as f:
    f.write(c)

