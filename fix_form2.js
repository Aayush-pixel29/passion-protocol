const fs = require("fs");
let c = fs.readFileSync("components/OnboardingForm.tsx", "utf8");

c = c.replace(/\{step === 1 && \(\r?\n\s*<div/g, "<div style={{ display: step === 1 ? \"block\" : \"none\" }}");
c = c.replace(/\{step === 2 && \(\r?\n\s*<div/g, "<div style={{ display: step === 2 ? \"block\" : \"none\" }}");
c = c.replace(/\{step === 3 && \(\r?\n\s*<div/g, "<div style={{ display: step === 3 ? \"block\" : \"none\" }}");
c = c.replace(/\{step === 4 && \(\r?\n\s*<div/g, "<div style={{ display: step === 4 ? \"block\" : \"none\" }}");

// Replace the closing brackets.
c = c.replace(/          <\/div>\r?\n        \)\}\r?\n/g, "          </div>\n");

// Add manual codename validation to the step 1 next button
c = c.replace(
  /onClick=\{\(\) => setStep\(2\)\}/,
  "onClick={() => { if (codename.trim().length < 2) { alert(\"Codename must be at least 2 characters.\"); return; } setStep(2); }}"
);

// brutalize colors inside this file
c = c.replace(/glow-emerald/g, "");
c = c.replace(/text-glow-emerald/g, "");
c = c.replace(/glow-cyan/g, "");
c = c.replace(/var\(--glow-purple\)/g, "none");
c = c.replace(/rgba\(180, 77, 255, 0\.05\)/g, "#ffffff");
c = c.replace(/rgba\(0, 255, 179, 0\.05\)/g, "#ffffff");
c = c.replace(/rgba\(0, 255, 179, 0\.2\)/g, "#000000");
c = c.replace(/glass/g, "match-card");
c = c.replace(/background: "rgba\(255,255,255,0\.02\)", border: "1px solid rgba\(255,255,255,0\.1\)"/g, "background: \"#ffffff\", border: \"2px solid #000000\"");

fs.writeFileSync("components/OnboardingForm.tsx", c);

