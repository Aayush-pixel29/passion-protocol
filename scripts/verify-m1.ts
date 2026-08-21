/**
 * Milestone 1 Verification Suite (Asset, CSS & Build Integrity)
 * Run: npx tsx scripts/verify-m1.ts
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT_DIR = path.resolve(__dirname, '..');
const IMAGES_DIR = path.join(ROOT_DIR, 'public', 'images');
const GLOBALS_CSS = path.join(ROOT_DIR, 'app', 'globals.css');
const LAYOUT_TSX = path.join(ROOT_DIR, 'app', 'layout.tsx');

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

interface AssetSpec {
  filename: string;
  expectedRatio: '1:1' | '16:9';
  minWidth: number;
  minHeight: number;
}

const REQUIRED_22_ASSETS: AssetSpec[] = [
  { filename: 'hero-network-matrix.png', expectedRatio: '16:9', minWidth: 800, minHeight: 450 },
  { filename: 'hero-synergy-orbit.png', expectedRatio: '1:1', minWidth: 400, minHeight: 400 },
  { filename: 'bento-vibe-engine.png', expectedRatio: '1:1', minWidth: 400, minHeight: 400 },
  { filename: 'bento-roles-complement.png', expectedRatio: '1:1', minWidth: 400, minHeight: 400 },
  { filename: 'bento-project-incubator.png', expectedRatio: '1:1', minWidth: 400, minHeight: 400 },
  { filename: 'bento-privacy-shield.png', expectedRatio: '1:1', minWidth: 400, minHeight: 400 },
  { filename: 'bento-smart-contracts.png', expectedRatio: '1:1', minWidth: 400, minHeight: 400 },
  { filename: 'role-software-coder.png', expectedRatio: '1:1', minWidth: 256, minHeight: 256 },
  { filename: 'role-creative-designer.png', expectedRatio: '1:1', minWidth: 256, minHeight: 256 },
  { filename: 'role-hardware-maker.png', expectedRatio: '1:1', minWidth: 256, minHeight: 256 },
  { filename: 'role-business-growth.png', expectedRatio: '1:1', minWidth: 256, minHeight: 256 },
  { filename: 'role-marketing-writer.png', expectedRatio: '1:1', minWidth: 256, minHeight: 256 },
  { filename: 'role-general-builder.png', expectedRatio: '1:1', minWidth: 256, minHeight: 256 },
  { filename: 'avatar-alex-coder.png', expectedRatio: '1:1', minWidth: 256, minHeight: 256 },
  { filename: 'avatar-maya-designer.png', expectedRatio: '1:1', minWidth: 256, minHeight: 256 },
  { filename: 'avatar-david-hardware.png', expectedRatio: '1:1', minWidth: 256, minHeight: 256 },
  { filename: 'avatar-elena-growth.png', expectedRatio: '1:1', minWidth: 256, minHeight: 256 },
  { filename: 'avatar-carlos-writer.png', expectedRatio: '1:1', minWidth: 256, minHeight: 256 },
  { filename: 'avatar-priya-fintech.png', expectedRatio: '1:1', minWidth: 256, minHeight: 256 },
  { filename: 'empty-discover-deck.png', expectedRatio: '16:9', minWidth: 800, minHeight: 450 },
  { filename: 'empty-messages-chat.png', expectedRatio: '16:9', minWidth: 800, minHeight: 450 },
  { filename: 'cta-nebula-backdrop.png', expectedRatio: '16:9', minWidth: 800, minHeight: 450 },
];

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

function assertCheck(desc: string, passed: boolean, details?: string) {
  totalChecks++;
  if (passed) {
    passedChecks++;
    console.log(`  \x1b[32m✓\x1b[0m ${desc}`);
  } else {
    failedChecks++;
    console.log(`  \x1b[31m✗\x1b[0m ${desc}`);
    if (details) console.log(`    \x1b[90m${details}\x1b[0m`);
  }
}

async function verifyMilestone1() {
  console.log('\n\x1b[1m\x1b[36m====================================================\x1b[0m');
  console.log('\x1b[1m\x1b[36m  MILESTONE 1 VERIFICATION: ASSETS, CSS & BUILD   \x1b[0m');
  console.log('\x1b[1m\x1b[36m====================================================\x1b[0m\n');

  // --- SECTION 1: ASSET VALIDATION ---
  console.log('\x1b[1m1. Checking AI Image Assets (22 Required PNGs)...\x1b[0m');
  assertCheck('public/images directory exists', fs.existsSync(IMAGES_DIR));

  if (fs.existsSync(IMAGES_DIR)) {
    for (const spec of REQUIRED_22_ASSETS) {
      const assetPath = path.join(IMAGES_DIR, spec.filename);
      const exists = fs.existsSync(assetPath);
      assertCheck(`Asset exists: ${spec.filename}`, exists);

      if (exists) {
        const stat = fs.statSync(assetPath);
        assertCheck(`  Size > 1KB: ${spec.filename} (${(stat.size / 1024).toFixed(1)} KB)`, stat.size > 1024);

        const buffer = fs.readFileSync(assetPath);
        const hasPngHeader = buffer.length >= 24 && buffer.subarray(0, 8).equals(PNG_MAGIC);
        assertCheck(`  Valid PNG magic header: ${spec.filename}`, hasPngHeader);

        if (hasPngHeader) {
          const width = buffer.readUInt32BE(16);
          const height = buffer.readUInt32BE(20);
          const ratio = width / height;

          assertCheck(
            `  Dimensions valid (${width}x${height}): ${spec.filename}`,
            width >= spec.minWidth && height >= spec.minHeight
          );

          if (spec.expectedRatio === '1:1') {
            const isSquare = ratio >= 0.98 && ratio <= 1.02;
            assertCheck(`  Aspect ratio is 1:1 (~${ratio.toFixed(2)}): ${spec.filename}`, isSquare);
          } else {
            const is16by9 = ratio >= 1.70 && ratio <= 1.85;
            assertCheck(`  Aspect ratio is 16:9 (~${ratio.toFixed(2)}): ${spec.filename}`, is16by9);
          }
        }
      }
    }
  }

  // --- SECTION 2: CSS DESIGN SYSTEM VALIDATION ---
  console.log('\n\x1b[1m2. Checking globals.css Tokens & Syntax...\x1b[0m');
  assertCheck('app/globals.css exists', fs.existsSync(GLOBALS_CSS));

  if (fs.existsSync(GLOBALS_CSS)) {
    const css = fs.readFileSync(GLOBALS_CSS, 'utf-8');

    // Syntax Balance
    const openBraces = (css.match(/\{/g) || []).length;
    const closeBraces = (css.match(/\}/g) || []).length;
    assertCheck(`Brace balance matches (${openBraces} open, ${closeBraces} close)`, openBraces === closeBraces);

    // Required Tokens
    const requiredTokens = [
      '--bg', '--bg-2', '--bg-3', '--surface', '--surface-card', '--surface-solid',
      '--surface-hover', '--surface-inset', '--stroke', '--stroke-hover', '--stroke-cyan',
      '--text', '--text-bright', '--muted', '--dim', '--accent', '--accent-2', '--accent-3',
      '--accent-4', '--radius', '--font-sans', '--font-display', '--wrap', '--shadow',
      '--glow-violet', '--glow-cyan', '--glow-pink'
    ];
    for (const token of requiredTokens) {
      assertCheck(`Token defined in CSS: ${token}`, css.includes(token));
    }

    // Required Component Classes
    const requiredClasses = [
      '.glass-panel', '.match-card', '.score-badge', '.role-chip', '.role-tag',
      '.avatar-badge', '.primary-btn', '.outline-btn', '.pill-btn', '.ghost-btn',
      '.bar-track', '.bar-fill', '.gradient-text'
    ];
    for (const cls of requiredClasses) {
      assertCheck(`Class defined in CSS: ${cls}`, css.includes(cls));
    }

    // Obsidian Theme Values Check
    assertCheck('Obsidian dark background token (#090a10)', css.includes('#090a10') || css.includes('9, 10, 16'));
    assertCheck('Electric violet accent (#8b5cf6 / #7c3aed)', css.includes('#8b5cf6') || css.includes('#7c3aed'));
    assertCheck('Neon cyan accent (#06b6d4)', css.includes('#06b6d4'));
  }

  // --- SECTION 3: LAYOUT & FONT LINKAGE ---
  console.log('\n\x1b[1m3. Checking Layout & Google Fonts Linkage...\x1b[0m');
  assertCheck('app/layout.tsx exists', fs.existsSync(LAYOUT_TSX));
  if (fs.existsSync(LAYOUT_TSX)) {
    const layout = fs.readFileSync(LAYOUT_TSX, 'utf-8');
    assertCheck('Imports Plus_Jakarta_Sans', layout.includes('Plus_Jakarta_Sans'));
    assertCheck('Imports Fraunces', layout.includes('Fraunces'));
    assertCheck('Binds --font-jakarta variable', layout.includes('--font-jakarta'));
    assertCheck('Binds --font-fraunces variable', layout.includes('--font-fraunces'));
  }

  // --- SECTION 4: ESLINT & BUILD VALIDATION ---
  console.log('\n\x1b[1m4. Checking ESLint & Next.js 15 Build Pipeline...\x1b[0m');
  try {
    console.log('  Running npm run lint...');
    execSync('npm run lint', { cwd: ROOT_DIR, stdio: 'pipe', maxBuffer: 20 * 1024 * 1024, shell: true as any });
    assertCheck('ESLint passes with 0 errors/warnings', true);
  } catch (err: any) {
    assertCheck('ESLint passes with 0 errors/warnings', false, err.stdout?.toString());
  }

  try {
    console.log('  Running npm run build (Next.js 15 production compile)...');
    execSync('npx next build', { cwd: ROOT_DIR, stdio: 'inherit', shell: true as any });
    assertCheck('npm run build completes with exit code 0', true);
  } catch (err: any) {
    assertCheck('npm run build completes with exit code 0', false, err.stdout?.toString() || err.stderr?.toString() || String(err));
  }

  // --- SUMMARY ---
  console.log('\n\x1b[1m\x1b[36m====================================================\x1b[0m');
  console.log(`\x1b[1mTOTAL CHECKS: ${totalChecks} | \x1b[32mPASSED: ${passedChecks}\x1b[0m | \x1b[31mFAILED: ${failedChecks}\x1b[0m`);
  console.log('\x1b[1m\x1b[36m====================================================\x1b[0m\n');

  if (failedChecks > 0) {
    process.exit(1);
  }
}

verifyMilestone1();
