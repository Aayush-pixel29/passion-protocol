const fs = require("fs");
let c = fs.readFileSync("components/ChatInterface.tsx", "utf8");

c = c.replace(/background: "rgba\\(8, 8, 16, 0\\.6\\)"/g, `background: "transparent"`);
c = c.replace(/background: "#080810"/g, `background: "transparent"`);
c = c.replace(/background: "rgba\\(255,255,255,0\\.02\\)"/g, `background: "rgba(255,255,255,0.5)"`);
c = c.replace(/border: "2px solid #080810"/g, `border: "2px solid #ffffff"`);
c = c.replace(/color: "#52525b"/g, `color: "var(--muted)"`);
c = c.replace(/background: "#f4f4f5"/g, `background: "var(--surface-2)"`);

fs.writeFileSync("components/ChatInterface.tsx", c);
console.log("ChatInterface updated!");

