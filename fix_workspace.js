const fs = require("fs");
let c = fs.readFileSync("components/WorkspaceBoard.tsx", "utf8");

c = c.replace(/background: "rgba\\(0,0,0,0\.3\\)"/g, `background: "rgba(255,255,255,0.7)"`);
c = c.replace(/background: "rgba\\(0,0,0,0\.4\\)"/g, `background: "rgba(255,255,255,0.7)"`);
c = c.replace(/background: "#f4f4f5"/g, `background: "rgba(255,255,255,0.4)"`);
c = c.replace(/background: "rgba\\(255,255,255,0\.02\\)"/g, `background: "rgba(255,255,255,0.5)"`);
c = c.replace(/background: "rgba\\(255,255,255,0\.05\\)"/g, `background: "rgba(255,255,255,0.6)"`);

fs.writeFileSync("components/WorkspaceBoard.tsx", c);
console.log("WorkspaceBoard updated!");

