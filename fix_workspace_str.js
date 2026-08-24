const fs = require("fs");
let c = fs.readFileSync("components/WorkspaceBoard.tsx", "utf8");

c = c.split(`background: "rgba(0,0,0,0.3)"`).join(`background: "rgba(255,255,255,0.7)"`);
c = c.split(`background: "rgba(0,0,0,0.4)"`).join(`background: "rgba(255,255,255,0.7)"`);
c = c.split(`background: "#f4f4f5"`).join(`background: "rgba(255,255,255,0.4)"`);
c = c.split(`background: "rgba(255,255,255,0.02)"`).join(`background: "rgba(255,255,255,0.5)"`);
c = c.split(`background: "rgba(255,255,255,0.05)"`).join(`background: "rgba(255,255,255,0.6)"`);
c = c.split(`rgba(0, 255, 179, 0.1)`).join(`var(--accent-emerald-tint)`);

fs.writeFileSync("components/WorkspaceBoard.tsx", c);
console.log("WorkspaceBoard updated with strings!");

