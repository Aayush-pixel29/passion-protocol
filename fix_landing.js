const fs = require("fs");
let c = fs.readFileSync("app/page.tsx", "utf8");

c = c.replace(/className="wrap mesh-bg"/g, "className=\"wrap\"");
c = c.replace(/className="gradient-text"/g, "");
c = c.replace(/<span className="badge-spark">.*?<\/span>/g, "");
c = c.replace(/<span className="badge-text".*?>.*?<\/span>/g, "<span style={{ fontWeight: 800, textTransform: \"uppercase\", letterSpacing: \"0.1em\" }}>Strictly B&W. Match on Code, Not Vibes.</span>");
c = c.replace(/className="hero-badge-pill"/g, "className=\"hero-badge-pill match-card\"");
c = c.replace(/<SynergyProof \/>/g, "<div></div>"); // Remove SynergyProof as it has neon elements, or I can brutalize it. Let us brutalize it in another script.

fs.writeFileSync("app/page.tsx", c);

