
const fs = require("fs");
["components/ChatInterface.tsx", "components/WorkspaceBoard.tsx"].forEach(f => {
    let c = fs.readFileSync(f, "utf8");
    c = c.replace(/className={`glass /g, "className={`");
    c = c.replace(/className="glass /g, "className=\"");
    c = c.replace(/className="glass"/g, "className=\"\"");
    c = c.replace(/className={`glass`/g, "className={`");
    c = c.replace(/glass-panel/g, "match-card");
    c = c.replace(/glass-inset/g, "inset-card");
    c = c.replace(/glass-emerald/g, "success");
    fs.writeFileSync(f, c);
});

