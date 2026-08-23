const fs = require("fs");
let c = fs.readFileSync("components/OnboardingForm.tsx", "utf8");

let count = 1;
c = c.replace(/\{step === \d && \(\r?\n\s*(<div className="animate-slide-up match-card onboarding-card".*?)style=\{\{(.*?)\}\}>/g, 
  (match, p1, p2) => {
    const replacement = `${p1}style={{ display: step === ${count} ? "block" : "none", ${p2} }}>`;
    count++;
    return replacement;
  }
);
c = c.replace(/          <\/div>\r?\n        \)\}\r?\n/g, "          </div>\n");
fs.writeFileSync("components/OnboardingForm.tsx", c);

