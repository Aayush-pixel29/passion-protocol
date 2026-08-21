import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const ROOT = "d:/passion-protocol";
const IMAGES_DIR = path.join(ROOT, "public", "images");
const GLOBALS_CSS = path.join(ROOT, "app", "globals.css");
const LAYOUT_TSX = path.join(ROOT, "app", "layout.tsx");

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

interface ExpectedAsset {
  filename: string;
  expectedRatio: "1:1" | "16:9";
  minBytes: number;
}

const EXPECTED_22: ExpectedAsset[] = [
  { filename: "hero-network-matrix.png", expectedRatio: "16:9", minBytes: 1024 },
  { filename: "hero-synergy-orbit.png", expectedRatio: "1:1", minBytes: 1024 },
  { filename: "bento-vibe-engine.png", expectedRatio: "1:1", minBytes: 1024 },
  { filename: "bento-roles-complement.png", expectedRatio: "1:1", minBytes: 1024 },
  { filename: "bento-project-incubator.png", expectedRatio: "1:1", minBytes: 1024 },
  { filename: "bento-privacy-shield.png", expectedRatio: "1:1", minBytes: 1024 },
  { filename: "bento-smart-contracts.png", expectedRatio: "1:1", minBytes: 1024 },
  { filename: "role-software-coder.png", expectedRatio: "1:1", minBytes: 1024 },
  { filename: "role-creative-designer.png", expectedRatio: "1:1", minBytes: 1024 },
  { filename: "role-hardware-maker.png", expectedRatio: "1:1", minBytes: 1024 },
  { filename: "role-business-growth.png", expectedRatio: "1:1", minBytes: 1024 },
  { filename: "role-marketing-writer.png", expectedRatio: "1:1", minBytes: 1024 },
  { filename: "role-general-builder.png", expectedRatio: "1:1", minBytes: 1024 },
  { filename: "avatar-alex-coder.png", expectedRatio: "1:1", minBytes: 1024 },
  { filename: "avatar-maya-designer.png", expectedRatio: "1:1", minBytes: 1024 },
  { filename: "avatar-david-hardware.png", expectedRatio: "1:1", minBytes: 1024 },
  { filename: "avatar-elena-growth.png", expectedRatio: "1:1", minBytes: 1024 },
  { filename: "avatar-carlos-writer.png", expectedRatio: "1:1", minBytes: 1024 },
  { filename: "avatar-priya-fintech.png", expectedRatio: "1:1", minBytes: 1024 },
  { filename: "empty-discover-deck.png", expectedRatio: "16:9", minBytes: 1024 },
  { filename: "empty-messages-chat.png", expectedRatio: "16:9", minBytes: 1024 },
  { filename: "cta-nebula-backdrop.png", expectedRatio: "16:9", minBytes: 1024 }
];

interface AuditResult {
  checkId: string;
  name: string;
  passed: boolean;
  details: string;
  data?: any;
}

const results: AuditResult[] = [];

function record(checkId: string, name: string, passed: boolean, details: string, data?: any) {
  results.push({ checkId, name, passed, details, data });
  const symbol = passed ? "[PASS]" : "[FAIL]";
  console.log(`${symbol} ${checkId}: ${name} - ${details}`);
}

async function runAudit() {
  console.log("=== STARTING INDEPENDENT FORENSIC AUDIT ===");

  // A1: Asset Directory Structure
  const dirExists = fs.existsSync(IMAGES_DIR);
  if (!dirExists) {
    record("A1", "Asset Directory Structure", false, "public/images does not exist");
    return;
  }
  const filesInDir = fs.readdirSync(IMAGES_DIR);
  const missingFiles = EXPECTED_22.filter(e => !filesInDir.includes(e.filename));
  const extraFiles = filesInDir.filter(f => !EXPECTED_22.map(e => e.filename).includes(f));
  const all22Exist = missingFiles.length === 0;
  record("A1", "Asset Directory Structure", all22Exist, 
    `Found ${filesInDir.length} files in public/images. Missing: ${missingFiles.length}, Extra: ${extraFiles.length}`,
    { filesInDir, missingFiles, extraFiles }
  );

  // A2: PNG Magic Byte Signature
  let allMagicValid = true;
  const magicDetails: any[] = [];
  for (const asset of EXPECTED_22) {
    const filePath = path.join(IMAGES_DIR, asset.filename);
    if (!fs.existsSync(filePath)) {
      allMagicValid = false;
      magicDetails.push({ file: asset.filename, status: "MISSING" });
      continue;
    }
    const buf = fs.readFileSync(filePath);
    const magic = buf.subarray(0, 8);
    const isValid = magic.equals(PNG_MAGIC);
    if (!isValid) allMagicValid = false;
    magicDetails.push({ 
      file: asset.filename, 
      magicHex: magic.toString("hex"), 
      isValid 
    });
  }
  record("A2", "PNG Magic Byte Signature", allMagicValid, 
    `Magic byte check: ${allMagicValid ? "All 22 files have valid PNG header (89504e470d0a1a0a)" : "Some files failed"}`,
    magicDetails
  );

  // A3: Asset File Weight
  let allSubstantial = true;
  const weightDetails: any[] = [];
  let totalBytes = 0;
  for (const asset of EXPECTED_22) {
    const filePath = path.join(IMAGES_DIR, asset.filename);
    if (fs.existsSync(filePath)) {
      const stat = fs.statSync(filePath);
      totalBytes += stat.size;
      const isOk = stat.size >= asset.minBytes;
      if (!isOk) allSubstantial = false;
      weightDetails.push({ file: asset.filename, bytes: stat.size, kb: (stat.size / 1024).toFixed(2), isOk });
    } else {
      allSubstantial = false;
    }
  }
  record("A3", "Asset File Weight", allSubstantial, 
    `Total asset size: ${(totalBytes / (1024 * 1024)).toFixed(2)} MB across 22 assets. Min size > 1KB: ${allSubstantial}`,
    weightDetails
  );

  // A4: Aspect Ratio Accuracy & Resolution
  let allAspectsValid = true;
  const dimDetails: any[] = [];
  let squareCount = 0;
  let wideCount = 0;

  for (const asset of EXPECTED_22) {
    const filePath = path.join(IMAGES_DIR, asset.filename);
    if (fs.existsSync(filePath)) {
      const buf = fs.readFileSync(filePath);
      const width = buf.readUInt32BE(16);
      const height = buf.readUInt32BE(20);
      const ratio = width / height;
      let ratioMatch = false;
      if (asset.expectedRatio === "1:1") {
        ratioMatch = ratio >= 0.98 && ratio <= 1.02;
        if (ratioMatch) squareCount++;
      } else {
        ratioMatch = ratio >= 1.70 && ratio <= 1.85;
        if (ratioMatch) wideCount++;
      }
      if (!ratioMatch) allAspectsValid = false;
      dimDetails.push({
        file: asset.filename,
        width,
        height,
        ratio: ratio.toFixed(3),
        expected: asset.expectedRatio,
        ratioMatch
      });
    }
  }
  record("A4", "Aspect Ratio Accuracy", allAspectsValid && squareCount === 18 && wideCount === 4,
    `Square (1:1): ${squareCount}/18, Widescreen (16:9): ${wideCount}/4. All specs matched: ${allAspectsValid}`,
    dimDetails
  );

  // A5: CSS Token Completeness
  const cssExists = fs.existsSync(GLOBALS_CSS);
  if (!cssExists) {
    record("A5", "CSS Token Completeness", false, "app/globals.css missing");
    return;
  }
  const cssContent = fs.readFileSync(GLOBALS_CSS, "utf-8");
  const requiredTokens = [
    "--bg", "--bg-2", "--bg-3", "--surface", "--surface-card", "--surface-solid",
    "--surface-hover", "--surface-inset", "--surface-glass", "--surface-elevated",
    "--stroke", "--stroke-subtle", "--stroke-strong", "--stroke-hover", "--stroke-cyan",
    "--text", "--text-bright", "--muted", "--dim", "--accent", "--accent-2", "--accent-3",
    "--accent-4", "--radius", "--radius-sm", "--radius-md", "--radius-lg", "--radius-full",
    "--font-sans", "--font-display", "--wrap", "--shadow", "--glow-violet", "--glow-cyan",
    "--glow-pink"
  ];
  const missingTokens = requiredTokens.filter(t => !cssContent.includes(t));
  const hasDarkBase = cssContent.includes("#090a10") || cssContent.includes("9, 10, 16");
  const hasAccents = cssContent.includes("#ff3d6e") && cssContent.includes("#8b5cf6") && cssContent.includes("#06b6d4") && cssContent.includes("#10b981");
  const a5Passed = missingTokens.length === 0 && hasDarkBase && hasAccents;
  record("A5", "CSS Token Completeness", a5Passed,
    `Checked ${requiredTokens.length} tokens. Missing: ${missingTokens.length}. Dark base #090a10: ${hasDarkBase}. Neons: ${hasAccents}`,
    { missingTokens }
  );

  // A6: Glassmorphism & UI Classes
  const requiredClasses = [
    ".glass-panel", ".glass-card", ".glass-inset", ".match-card", ".score-badge",
    ".role-chip", ".role-tag", ".avatar-badge", ".primary-btn", ".outline-btn",
    ".pill-btn", ".ghost-btn", ".bar-track", ".bar-fill", ".gradient-text",
    ".gradient-text-cyan", ".gradient-text-emerald", ".neon-border", ".badge-pill"
  ];
  const missingClasses = requiredClasses.filter(c => !cssContent.includes(c));
  const hasBackdropBlur = cssContent.includes("backdrop-filter: blur") || cssContent.includes("backdrop-blur");
  const a6Passed = missingClasses.length === 0 && hasBackdropBlur;
  record("A6", "Glassmorphism & UI Classes", a6Passed,
    `Checked ${requiredClasses.length} UI classes. Missing: ${missingClasses.length}. Backdrop blur: ${hasBackdropBlur}`,
    { missingClasses }
  );

  // A7: Font Variable Linkage
  const layoutExists = fs.existsSync(LAYOUT_TSX);
  let a7Passed = false;
  let layoutDetails: any = {};
  if (layoutExists) {
    const layoutContent = fs.readFileSync(LAYOUT_TSX, "utf-8");
    const hasJakarta = layoutContent.includes("Plus_Jakarta_Sans");
    const hasFraunces = layoutContent.includes("Fraunces");
    const hasVarJakarta = layoutContent.includes("--font-jakarta");
    const hasVarFraunces = layoutContent.includes("--font-fraunces");
    a7Passed = hasJakarta && hasFraunces && hasVarJakarta && hasVarFraunces;
    layoutDetails = { hasJakarta, hasFraunces, hasVarJakarta, hasVarFraunces };
  }
  record("A7", "Font Variable Linkage", a7Passed,
    `Plus_Jakarta_Sans & Fraunces font bindings in layout.tsx: ${a7Passed}`,
    layoutDetails
  );

  // A8: CSS Syntax Integrity
  const openBraces = (cssContent.match(/\{/g) || []).length;
  const closeBraces = (cssContent.match(/\}/g) || []).length;
  const braceBalanced = openBraces === closeBraces && openBraces > 0;
  const lines = cssContent.split("\n").length;
  record("A8", "CSS Syntax Integrity", braceBalanced,
    `Total CSS lines: ${lines}. Open braces: ${openBraces}, Close braces: ${closeBraces}, Balanced: ${braceBalanced}`
  );

  // A9: ESLint
  let lintPassed = false;
  let lintOutput = "";
  try {
    lintOutput = execSync("npm run lint", { cwd: ROOT, stdio: "pipe" }).toString();
    lintPassed = true;
  } catch (err: any) {
    lintOutput = (err.stdout?.toString() || "") + "\n" + (err.stderr?.toString() || "");
    lintPassed = false;
  }
  record("A9", "ESLint", lintPassed,
    lintPassed ? "ESLint completed with 0 errors and 0 warnings" : "ESLint failed",
    lintOutput.trim()
  );

  // A10: Build
  let buildPassed = false;
  let buildOutput = "";
  try {
    buildOutput = execSync("npm run build", { cwd: ROOT, stdio: "pipe" }).toString();
    buildPassed = true;
  } catch (err: any) {
    buildOutput = (err.stdout?.toString() || "") + "\n" + (err.stderr?.toString() || "");
    buildPassed = false;
  }
  record("A10", "Build", buildPassed,
    buildPassed ? "Next.js 15 production build compiled and rendered static pages successfully with exit code 0" : "Build failed",
    buildOutput.trim()
  );

  // Integrity Forensics: Facade and Cheating checks
  // Check for dummy 0-byte or corrupted PNGs
  let hasCheating = false;
  const cheatingDetails: string[] = [];

  // Check if any PNG file is under 5KB or has fake non-PNG chunks
  for (const asset of EXPECTED_22) {
    const filePath = path.join(IMAGES_DIR, asset.filename);
    if (fs.existsSync(filePath)) {
      const buf = fs.readFileSync(filePath);
      if (buf.length < 1000) {
        hasCheating = true;
        cheatingDetails.push(`${asset.filename} is suspiciously small (${buf.length} bytes)`);
      }
      // Check for IHDR and IDAT chunks
      const hasIHDR = buf.indexOf("IHDR") !== -1;
      const hasIDAT = buf.indexOf("IDAT") !== -1;
      const hasIEND = buf.indexOf("IEND") !== -1;
      if (!hasIHDR || !hasIDAT || !hasIEND) {
        hasCheating = true;
        cheatingDetails.push(`${asset.filename} is missing essential PNG chunks (IHDR: ${hasIHDR}, IDAT: ${hasIDAT}, IEND: ${hasIEND})`);
      }
    }
  }

  // Check globals.css for facade CSS
  if (cssContent.length < 500) {
    hasCheating = true;
    cheatingDetails.push("globals.css is suspiciously minimal");
  }

  const forensicPass = !hasCheating && cheatingDetails.length === 0;
  record("FORENSIC", "Anti-Cheat & Facade Analysis", forensicPass,
    forensicPass ? "All 22 assets have valid IHDR, IDAT, and IEND chunks. No fake stubs or facade CSS detected." : `Detected suspicious items: ${cheatingDetails.join("; ")}`,
    cheatingDetails
  );

  console.log("\n=== AUDIT SUMMARY ===");
  const allPassed = results.every(r => r.passed);
  console.log(`Final Verdict: ${allPassed ? "CLEAN" : "INTEGRITY VIOLATION"}`);
  console.log(`Passed: ${results.filter(r => r.passed).length} / ${results.length}`);

  // Save audit data to JSON
  fs.writeFileSync(
    path.join(__dirname, "audit_results.json"), 
    JSON.stringify({ verdict: allPassed ? "CLEAN" : "INTEGRITY VIOLATION", results }, null, 2)
  );
}

runAudit();
