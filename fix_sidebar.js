const fs = require("fs");
let c = fs.readFileSync("components/ChatInterface.tsx", "utf8");
c = c.replace(/background: #f4f4f5;/g, `background: rgba(255, 255, 255, 0.4);`);
fs.writeFileSync("components/ChatInterface.tsx", c);
console.log("Chat sidebar updated!");

