const fs = require("fs");

function fixNeon(file) {
  let c = fs.readFileSync(file, "utf8");
  c = c.replace(/rgba\(180, 77, 255, 0\.15\)/g, "#f4f4f5");
  c = c.replace(/rgba\(180, 77, 255, 0\.1\)/g, "#f4f4f5");
  c = c.replace(/rgba\(180, 77, 255, 0\.08\)/g, "#f4f4f5");
  c = c.replace(/rgba\(180, 77, 255, 0\.3\)/g, "#000000");
  c = c.replace(/rgba\(180, 77, 255, 0\.2\)/g, "#000000");
  c = c.replace(/rgba\(0, 255, 179, 0\.15\)/g, "#f4f4f5");
  c = c.replace(/rgba\(0, 255, 179, 0\.05\)/g, "#f4f4f5");
  c = c.replace(/rgba\(0, 255, 179, 0\.3\)/g, "#000000");
  c = c.replace(/rgba\(0, 255, 179, 0\.2\)/g, "#000000");
  c = c.replace(/rgba\(6, 182, 212, 0\.1\)/g, "#f4f4f5");
  
  c = c.replace(/glow-emerald/g, "");
  c = c.replace(/text-glow-emerald/g, "");
  c = c.replace(/glow-purple/g, "");
  c = c.replace(/text-glow-purple/g, "");
  c = c.replace(/glow-cyan/g, "");
  
  c = c.replace(/boxShadow: "0 8px 32px rgba\(0, 255, 179, 0\.15\)"/g, "boxShadow: \"none\"");
  c = c.replace(/boxShadow: "0 4px 24px rgba\(180, 77, 255, 0\.2\)"/g, "boxShadow: \"none\"");
  c = c.replace(/boxShadow: isActive \? "0 0 16px rgba\(180, 77, 255, 0\.3\)" : "none"/g, "boxShadow: \"none\"");
  
  fs.writeFileSync(file, c);
}

["components/ChatInterface.tsx", "components/DiscoverGrid.tsx", "components/WorkspaceBoard.tsx", "components/OnboardingForm.tsx", "components/SynergyProof.tsx"].forEach(fixNeon);

// Now fix landing page
let p = fs.readFileSync("app/page.tsx", "utf8");
p = p.replace(/className="wrap mesh-bg"/g, "className=\"wrap\"");
p = p.replace(/className="gradient-text"/g, "");
p = p.replace(/<span className="badge-spark">.*?<\/span>/g, "");
p = p.replace(/<span className="badge-text".*?>.*?<\/span>/g, "<span style={{ fontWeight: 800, textTransform: \"uppercase\", letterSpacing: \"0.1em\" }}>Strictly B&W. Match on Code, Not Vibes.</span>");
p = p.replace(/className="hero-badge-pill"/g, "className=\"hero-badge-pill match-card\"");
p = p.replace(/<SynergyProof \/>/g, "<div style={{ display: \"none\" }}></div>"); 
fs.writeFileSync("app/page.tsx", p);

