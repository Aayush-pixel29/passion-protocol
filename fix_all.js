
const fs = require("fs");

function brutalize(f) {
  let c = fs.readFileSync(f, "utf8");
  c = c.replace(/className={`glass /g, "className={`");
  c = c.replace(/className="chat-container-responsive glass"/g, "className=\"chat-container-responsive match-card\"");
  c = c.replace(/className="glass /g, "className=\"");
  c = c.replace(/className="glass"/g, "className=\"\"");
  c = c.replace(/className={`glass`/g, "className={`");
  c = c.replace(/glass-panel/g, "match-card");
  c = c.replace(/glass-inset/g, "inset-card");
  c = c.replace(/glass-emerald/g, "success");
  c = c.replace(/glow-cyan/g, "");
  c = c.replace(/var\(--surface-card\)/g, "#ffffff");
  c = c.replace(/var\(--surface-inset\)/g, "#f4f4f5");
  c = c.replace(/var\(--stroke\)/g, "#000000");
  c = c.replace(/var\(--stroke-subtle\)/g, "#000000");
  c = c.replace(/var\(--text-bright\)/g, "#000000");
  c = c.replace(/var\(--muted\)/g, "#52525b");
  c = c.replace(/var\(--accent-.*?\)/g, "#000000");
  c = c.replace(/#10b981/g, "#000000");
  c = c.replace(/rgba\(16, 185, 129, 0\.\d+\)/g, "#000000");
  c = c.replace(/rgba\(6, 182, 212, 0\.10\)/g, "#000000");
  c = c.replace(/rgba\(18, 18, 31, 0\.4\)/g, "#f4f4f5"); // chat sidebar bg
  c = c.replace(/border-emerald-500\/50/g, "success");
  fs.writeFileSync(f, c);
}

["components/ChatInterface.tsx", "components/DiscoverGrid.tsx", "components/OnboardingForm.tsx", "components/WorkspaceBoard.tsx"].forEach(brutalize);

