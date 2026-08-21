import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

interface StressTestResult {
  category: string;
  name: string;
  passed: boolean;
  details?: string;
}

const results: StressTestResult[] = [];

function assert(condition: boolean, category: string, name: string, details?: string) {
  results.push({
    category,
    name,
    passed: condition,
    details: condition ? undefined : details || "Assertion failed",
  });
}

const rootDir = "d:\\passion-protocol";
const globalsCssPath = path.join(rootDir, "app", "globals.css");
const layoutPath = path.join(rootDir, "app", "layout.tsx");

console.log("===============================================================");
console.log("   CHALLENGER_M1_2: ADVERSARIAL CSS & BUILD STRESS HARNESS    ");
console.log("===============================================================\n");

// 1. AST & Character-level state machine parser for globals.css
console.log("1. Character-level State Machine & Brace / Nesting Analysis...");
const cssContent = fs.readFileSync(globalsCssPath, "utf-8");

let inComment = false;
let inSingleQuote = false;
let inDoubleQuote = false;
let braceDepth = 0;
let parenDepth = 0;
let maxBraceDepth = 0;
let mediaQueryCount = 0;
let keyframesCount = 0;
let rulesCount = 0;
let totalOpenBraces = 0;
let totalCloseBraces = 0;

let mediaQueryStack: { name: string; depth: number; line: number }[] = [];
let mediaErrors: string[] = [];

const lines = cssContent.split("\n");
for (let lineNum = 1; lineNum <= lines.length; lineNum++) {
  const line = lines[lineNum - 1];
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = i + 1 < line.length ? line[i + 1] : "";

    // Comments
    if (inComment) {
      if (char === "*" && nextChar === "/") {
        inComment = false;
        i++; // skip /
      }
      continue;
    }

    if (char === "/" && nextChar === "*") {
      inComment = true;
      i++; // skip *
      continue;
    }

    // Quotes
    if (inSingleQuote) {
      if (char === "'" && line[i - 1] !== "\\") {
        inSingleQuote = false;
      }
      continue;
    }
    if (inDoubleQuote) {
      if (char === '"' && line[i - 1] !== "\\") {
        inDoubleQuote = false;
      }
      continue;
    }

    if (char === "'") {
      inSingleQuote = true;
      continue;
    }
    if (char === '"') {
      inDoubleQuote = true;
      continue;
    }

    // Parentheses
    if (char === "(") parenDepth++;
    if (char === ")") parenDepth--;

    // Braces
    if (char === "{") {
      braceDepth++;
      totalOpenBraces++;
      if (braceDepth > maxBraceDepth) maxBraceDepth = braceDepth;

      // Check if this brace opens a media query or keyframe or normal rule
      const lineBefore = line.substring(0, i).trim();
      if (line.includes("@media") || (lineNum > 1 && lines[lineNum - 2].includes("@media"))) {
        mediaQueryCount++;
        mediaQueryStack.push({ name: line.trim(), depth: braceDepth, line: lineNum });
      } else if (line.includes("@keyframes") || (lineNum > 1 && lines[lineNum - 2].includes("@keyframes"))) {
        keyframesCount++;
      } else {
        rulesCount++;
      }
    } else if (char === "}") {
      braceDepth--;
      totalCloseBraces++;
      if (braceDepth < 0) {
        mediaErrors.push(`Negative brace depth at line ${lineNum}, col ${i + 1}`);
      }
      // Check if media query was closed
      if (mediaQueryStack.length > 0) {
        const top = mediaQueryStack[mediaQueryStack.length - 1];
        if (braceDepth < top.depth) {
          mediaQueryStack.pop();
        }
      }
    }
  }
}

assert(!inComment, "CSS Syntax", "Comments properly closed", "Unclosed comment detected at EOF");
assert(!inSingleQuote && !inDoubleQuote, "CSS Syntax", "Quotes properly closed", "Unclosed quote detected at EOF");
assert(braceDepth === 0, "CSS Syntax", "Global brace depth is balanced (0 at EOF)", `Final brace depth is ${braceDepth}`);
assert(totalOpenBraces === totalCloseBraces, "CSS Syntax", "Total open braces match total close braces", `Open: ${totalOpenBraces}, Close: ${totalCloseBraces}`);
assert(parenDepth === 0, "CSS Syntax", "Parentheses balanced (0 at EOF)", `Final paren depth is ${parenDepth}`);
assert(mediaQueryStack.length === 0, "CSS Syntax", "All @media query blocks properly closed", `Unclosed media queries: ${mediaQueryStack.map(m => m.name).join(", ")}`);
assert(mediaErrors.length === 0, "CSS Syntax", "No negative brace depth nesting violations", mediaErrors.join("; "));
assert(maxBraceDepth >= 2, "CSS Nesting", "CSS supports valid 2-level nesting for @media/@keyframes", `Max brace depth: ${maxBraceDepth}`);

// 2. Token Definitions and Dangling Reference Check
console.log("2. Analyzing Custom Property (CSS Token) Definitions & Usages...");

// Extract all defined properties
const definedTokens = new Set<string>();
const tokenDefRegex = /(--[a-zA-Z0-9_-]+)\s*:/g;
let match;
while ((match = tokenDefRegex.exec(cssContent)) !== null) {
  definedTokens.add(match[1]);
}

// Extract all var() references
const usedTokens = new Set<string>();
const varUsageRegex = /var\(\s*(--[a-zA-Z0-9_-]+)/g;
while ((match = varUsageRegex.exec(cssContent)) !== null) {
  usedTokens.add(match[1]);
}

const requiredTokens = [
  "--bg", "--bg-2", "--bg-3",
  "--surface", "--surface-solid", "--surface-card", "--surface-hover", "--surface-card-hover", "--surface-inset", "--surface-glass", "--surface-elevated",
  "--stroke", "--stroke-subtle", "--stroke-strong", "--stroke-hover", "--stroke-accent", "--stroke-cyan", "--stroke-emerald",
  "--text", "--text-bright", "--muted", "--dim",
  "--accent", "--accent-2", "--accent-3", "--accent-4", "--accent-amber",
  "--success", "--danger", "--warning", "--info",
  "--shadow", "--shadow-sm", "--shadow-lg", "--shadow-hover",
  "--glow-violet", "--glow-cyan", "--glow-pink", "--glow-emerald", "--glow-button",
  "--radius", "--radius-sm", "--radius-md", "--radius-lg", "--radius-full",
  "--font-sans", "--font-display", "--wrap", "--wrap-narrow"
];

for (const tok of requiredTokens) {
  assert(definedTokens.has(tok), "Token Definition", `Required token '${tok}' is defined in CSS`, `Missing required token ${tok}`);
}

// External font tokens bound in layout.tsx
const allowedExternalTokens = new Set(["--font-jakarta", "--font-fraunces"]);

// Check for dangling variable references
const danglingTokens: string[] = [];
for (const tok of usedTokens) {
  if (!definedTokens.has(tok) && !allowedExternalTokens.has(tok)) {
    danglingTokens.push(tok);
  }
}
assert(danglingTokens.length === 0, "Token References", "Zero dangling or undefined CSS variables used in var()", `Dangling tokens: ${danglingTokens.join(", ")}`);

// 3. Class Definitions Verification
console.log("3. Validating Required Design System Classes...");
const requiredClasses = [
  ".glass-panel",
  ".glass-card",
  ".glass-inset",
  ".glow-box",
  ".gradient-text",
  ".gradient-text-cyan",
  ".gradient-text-emerald",
  ".neon-border",
  ".badge-pill",
  ".site",
  ".wrap",
  ".site-header",
  ".brand",
  ".nav",
  ".ghost-btn",
  ".primary-btn",
  ".outline-btn",
  ".pill-btn",
  ".button",
  ".kicker",
  ".lede",
  ".hero-split",
  ".hero-panel",
  ".score-badge",
  ".pulse-badge",
  ".feature-grid",
  ".feature-card",
  ".role-chip",
  ".role-tag",
  ".avatar-badge",
  ".split-page",
  ".match-grid",
  ".match-card",
  ".profile-grid",
  ".identity",
  ".stats",
  ".stat-value",
  ".stat-label",
  ".fingerprint",
  ".bar-track",
  ".bar-fill",
  ".label",
  ".input",
  ".chip",
  ".slider-block",
  ".error",
  ".status-line",
  ".empty",
  ".panel"
];

for (const cls of requiredClasses) {
  // Regex to check class presence as a selector
  const escapedCls = cls.replace(".", "\\.");
  const classRegex = new RegExp(`${escapedCls}[\\s,.:{]`);
  const exists = classRegex.test(cssContent);
  assert(exists, "Class Definition", `Required CSS class '${cls}' is defined`, `Missing class definition for ${cls}`);
}

// 4. Role Variants & Semantic States Stress Test
console.log("4. Validating Role Variant Badges & Interactive States...");
const roles = ["coder", "designer", "writer", "maker"];
for (const role of roles) {
  assert(cssContent.includes(`.role-chip.${role}`) || cssContent.includes(`.role-chip.role-${role}`) || cssContent.includes(`[data-role="${role}"]`), "Role Classes", `.role-chip variant for '${role}' exists`);
  assert(cssContent.includes(`.role-tag.${role}`) || cssContent.includes(`.role-tag.role-${role}`) || cssContent.includes(`[data-role="${role}"]`), "Role Classes", `.role-tag variant for '${role}' exists`);
  assert(cssContent.includes(`.role-chip.selected.${role}`) || cssContent.includes(`.role-chip.selected[data-role="${role}"]`), "Role Classes", `Active/selected state for role '${role}' exists`);
}

// 5. Layout.tsx Font Binding Integrity
console.log("5. Validating layout.tsx Font Bindings...");
const layoutContent = fs.readFileSync(layoutPath, "utf-8");
assert(layoutContent.includes('Plus_Jakarta_Sans'), "Layout & Typography", "Imports Plus_Jakarta_Sans from next/font/google");
assert(layoutContent.includes('Fraunces'), "Layout & Typography", "Imports Fraunces from next/font/google");
assert(layoutContent.includes('variable: "--font-jakarta"'), "Layout & Typography", "Binds --font-jakarta variable");
assert(layoutContent.includes('variable: "--font-fraunces"'), "Layout & Typography", "Binds --font-fraunces variable");
assert(layoutContent.includes('jakarta.variable') && layoutContent.includes('fraunces.variable'), "Layout & Typography", "Injects font variables into HTML root");

// 6. Media Query Breakpoints & Accessibility
console.log("6. Stress-Testing Responsive & Accessibility Rules...");
assert(cssContent.includes("@media (max-width: 980px)"), "Media Queries", "Desktop tablet breakpoint (980px) exists");
assert(cssContent.includes("@media (max-width: 768px)"), "Media Queries", "Tablet / mobile breakpoint (768px) exists");
assert(cssContent.includes("@media (max-width: 480px)"), "Media Queries", "Small mobile breakpoint (480px) exists");
assert(cssContent.includes("@media (prefers-reduced-motion: reduce)"), "Accessibility", "prefers-reduced-motion media query exists for a11y compliance");
assert(cssContent.includes(":focus-visible"), "Accessibility", ":focus-visible focus ring styling exists for keyboard navigation");

// 7. Synthetic Image Asset Integrity (22 assets)
console.log("7. Validating All 22 Synthetic Assets in public/images/...");
const imagesDir = path.join(rootDir, "public", "images");
const expectedAssets = [
  { name: "hero-network-matrix.png", ratio: "16:9" },
  { name: "hero-synergy-orbit.png", ratio: "1:1" },
  { name: "bento-vibe-engine.png", ratio: "1:1" },
  { name: "bento-roles-complement.png", ratio: "1:1" },
  { name: "bento-project-incubator.png", ratio: "1:1" },
  { name: "bento-privacy-shield.png", ratio: "1:1" },
  { name: "bento-smart-contracts.png", ratio: "1:1" },
  { name: "role-software-coder.png", ratio: "1:1" },
  { name: "role-creative-designer.png", ratio: "1:1" },
  { name: "role-hardware-maker.png", ratio: "1:1" },
  { name: "role-business-growth.png", ratio: "1:1" },
  { name: "role-marketing-writer.png", ratio: "1:1" },
  { name: "role-general-builder.png", ratio: "1:1" },
  { name: "avatar-alex-coder.png", ratio: "1:1" },
  { name: "avatar-maya-designer.png", ratio: "1:1" },
  { name: "avatar-david-hardware.png", ratio: "1:1" },
  { name: "avatar-elena-growth.png", ratio: "1:1" },
  { name: "avatar-carlos-writer.png", ratio: "1:1" },
  { name: "avatar-priya-fintech.png", ratio: "1:1" },
  { name: "empty-discover-deck.png", ratio: "16:9" },
  { name: "empty-messages-chat.png", ratio: "16:9" },
  { name: "cta-nebula-backdrop.png", ratio: "16:9" },
];

for (const asset of expectedAssets) {
  const filePath = path.join(imagesDir, asset.name);
  const exists = fs.existsSync(filePath);
  assert(exists, "Assets", `Asset '${asset.name}' exists on disk`);
  if (exists) {
    const stat = fs.statSync(filePath);
    assert(stat.size > 1024, "Assets", `Asset '${asset.name}' size > 1KB (${Math.round(stat.size / 1024)} KB)`);
    
    // Check PNG signature
    const buf = fs.readFileSync(filePath);
    const isPng = buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47 &&
                  buf[4] === 0x0D && buf[5] === 0x0A && buf[6] === 0x1A && buf[7] === 0x0A;
    assert(isPng, "Assets", `Asset '${asset.name}' is a valid PNG binary`);

    if (buf.length > 24) {
      const width = buf.readUInt32BE(16);
      const height = buf.readUInt32BE(20);
      const ratio = width / height;
      if (asset.ratio === "16:9") {
        assert(Math.abs(ratio - (16/9)) < 0.05, "Assets", `Asset '${asset.name}' has 16:9 ratio (${width}x${height})`);
      } else {
        assert(Math.abs(ratio - 1.0) < 0.05, "Assets", `Asset '${asset.name}' has 1:1 ratio (${width}x${height})`);
      }
    }
  }
}

// Print Summary
const passedCount = results.filter(r => r.passed).length;
const failedCount = results.filter(r => !r.passed).length;

console.log("\n===============================================================");
console.log(`STRESS RESULTS: ${passedCount} PASSED | ${failedCount} FAILED | TOTAL: ${results.length}`);
console.log("===============================================================");

if (failedCount > 0) {
  console.log("\nFAILED ASSERTIONS:");
  for (const r of results.filter(r => !r.passed)) {
    console.log(`❌ [${r.category}] ${r.name}: ${r.details}`);
  }
  process.exit(1);
} else {
  console.log("✅ ALL ADVERSARIAL CSS & ASSET STRESS CHECKS PASSED EMPIRICALLY!");
}
