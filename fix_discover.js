const fs = require("fs");
let c = fs.readFileSync("components/DiscoverGrid.tsx", "utf8");

// Change the Vibe Print section
c = c.replace(/boxShadow: "0 0 8px rgba\\(0, 255, 179, 0\\.4\\)"/g, `boxShadow: "0 2px 8px var(--brand-tint)"`);
c = c.replace(/background: "#f4f4f5"/g, `background: "var(--brand-tint)"`);
c = c.replace(/color: \x27var\(--ink\)\x27, fontFamily: "var\(--font-mono\)", letterSpacing: "0\.1em" \}\}>VIBE PRINT/g, `color: "var(--brand)", fontWeight: 800 }}>Vibe Fingerprint`);
c = c.replace(/color: \x27var\(--ink\)\x27, opacity: 0\.8/g, `color: "var(--brand)", opacity: 1`);
c = c.replace(/rgba\(0, 255, 179, 0\.1\)/g, `var(--accent-emerald-tint)`);
c = c.replace(/color: \x27var\(--ink\)\x27, fontSize: 12, fontWeight: 800/g, `color: "var(--accent-emerald)", fontSize: 12, fontWeight: 800`);
c = c.replace(/background: "rgba\\(255,255,255,0\\.02\\)"/g, `background: "var(--surface-2)"`);
c = c.replace(/color: "#52525b"/g, `color: "var(--muted)"`);

fs.writeFileSync("components/DiscoverGrid.tsx", c);
console.log("DiscoverGrid styling updated!");

