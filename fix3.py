
with open("components/OnboardingForm.tsx", "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace("\\\"", "\"")

with open("components/OnboardingForm.tsx", "w", encoding="utf-8") as f:
    f.write(c)

