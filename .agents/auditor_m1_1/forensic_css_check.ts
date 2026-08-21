import fs from "node:fs";
import path from "node:path";

const ROOT = "d:/passion-protocol";
const GLOBALS_CSS = path.join(ROOT, "app", "globals.css");
const LAYOUT_TSX = path.join(ROOT, "app", "layout.tsx");

const css = fs.readFileSync(GLOBALS_CSS, "utf-8");
const layout = fs.readFileSync(LAYOUT_TSX, "utf-8");

console.log("=== CSS TOKENS & UTILITIES AUDIT ===");

const tokens = [
  "--bg", "--bg-2", "--bg-3",
  "--surface", "--surface-card", "--surface-solid", "--surface-hover", "--surface-inset", "--surface-glass", "--surface-elevated",
  "--stroke", "--stroke-subtle", "--stroke-strong", "--stroke-hover", "--stroke-accent", "--stroke-cyan", "--stroke-emerald",
  "--text", "--text-bright", "--muted", "--dim",
  "--accent", "--accent-2", "--accent-3", "--accent-4", "--accent-amber",
  "--radius", "--radius-sm", "--radius-md", "--radius-lg", "--radius-full",
  "--font-sans", "--font-display",
  "--wrap", "--wrap-narrow",
  "--shadow", "--shadow-sm", "--shadow-lg", "--shadow-hover",
  "--glow-violet", "--glow-cyan", "--glow-pink", "--glow-emerald"
];

const tokenResults = tokens.map(t => ({
  token: t,
  found: css.includes(t)
}));

console.log(`Tokens verified: ${tokenResults.filter(t => t.found).length} / ${tokens.length}`);
if (tokenResults.some(t => !t.found)) {
  console.log("Missing tokens:", tokenResults.filter(t => !t.found).map(t => t.token));
}

const classes = [
  ".glass-panel", ".glass-card", ".glass-inset",
  ".match-card", ".score-badge",
  ".role-chip", ".role-tag", ".avatar-badge",
  ".primary-btn", ".outline-btn", ".pill-btn", ".ghost-btn",
  ".bar-track", ".bar-fill",
  ".gradient-text", ".gradient-text-cyan", ".gradient-text-emerald",
  ".neon-border", ".badge-pill"
];

const classResults = classes.map(c => ({
  class: c,
  found: css.includes(c)
}));

console.log(`Classes verified: ${classResults.filter(c => c.found).length} / ${classes.length}`);
if (classResults.some(c => !c.found)) {
  console.log("Missing classes:", classResults.filter(c => !c.found).map(c => c.class));
}

console.log("\n=== LAYOUT FONT BINDING AUDIT ===");
const fontChecks = [
  { name: "Plus_Jakarta_Sans imported", pass: layout.includes("Plus_Jakarta_Sans") },
  { name: "Fraunces imported", pass: layout.includes("Fraunces") },
  { name: "--font-jakarta variable set", pass: layout.includes("--font-jakarta") },
  { name: "--font-fraunces variable set", pass: layout.includes("--font-fraunces") },
  { name: "Variables injected in html/body className", pass: layout.includes("font-sans") || layout.includes("${plusJakartaSans.variable}") || layout.includes("plusJakartaSans.variable") }
];

fontChecks.forEach(f => {
  console.log(`[${f.pass ? "PASS" : "FAIL"}] ${f.name}`);
});

fs.writeFileSync(
  path.join(__dirname, "detailed_css_audit.json"),
  JSON.stringify({ tokenResults, classResults, fontChecks }, null, 2)
);
