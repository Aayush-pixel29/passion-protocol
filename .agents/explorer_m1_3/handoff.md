# Milestone 1: Asset & CSS Verification Strategy Blueprint

**Agent**: `explorer_m1_3`  
**Working Directory**: `d:\passion-protocol\.agents\explorer_m1_3`  
**Parent**: `sub_orch_m1` (ID: `9c420d0f-aaab-49b8-b7e7-7180e735d5de`)  
**Mission**: Formulate the comprehensive verification strategy, test scripts, challenger checks, and auditor inspection criteria for Milestone 1 (Design Tokens & AI Asset Generation).

---

## 1. Observation

Direct investigation of the codebase, project specifications, and test infrastructure reveals the following structural, technical, and architectural facts:

### 1.1 Project Baseline & Tooling Setup
- **`package.json`** (`d:\passion-protocol\package.json`):
  - Next.js: `next@^15.5.4` (App Router, Turbopack/Webpack, Server Actions, React Server Components).
  - React: `react@^19.1.0`, `react-dom@^19.1.0`.
  - TypeScript: `typescript@^5.9.2`.
  - ESLint: `eslint@^9.35.0` with `eslint-config-next@^15.5.4` and `@eslint/eslintrc@^3.3.6`.
  - TS Execution: `tsx@^4.20.5` is installed, enabling zero-config execution of TypeScript scripts via `npx tsx <script.ts>`.
- **`tsconfig.json`** (`d:\passion-protocol\tsconfig.json`, Lines 21–22):
  - Includes: `["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"]`.
  - Critical Observation: Because `tsconfig.json` includes `**/*.ts`, `next build` type-checks **all** TypeScript files in the entire project, including files in `test/`, `scripts/`, and subdirectories. Any typing error anywhere in the repository will cause `npm run build` to fail with exit code 1.
- **Current Lint Status**:
  - `npm run lint` executes cleanly and returns exit code 0 (`✔ No ESLint warnings or errors`).

### 1.2 Asset Specifications & Target Directory
- **Directory**: `d:\passion-protocol\public\images\` (currently needs creation or validation).
- **Master List of 22 Synthetic Assets** (`SCOPE.md` & `explorer_survey_3/handoff.md`):
  1. `hero-network-matrix.png` (Ratio: `16:9`, e.g. 1920×1080 or 1024×576)
  2. `hero-synergy-orbit.png` (Ratio: `1:1`, e.g. 1024×1024)
  3. `bento-vibe-engine.png` (Ratio: `1:1`, e.g. 1024×1024)
  4. `bento-roles-complement.png` (Ratio: `1:1`, e.g. 1024×1024)
  5. `bento-project-incubator.png` (Ratio: `1:1`, e.g. 1024×1024)
  6. `bento-privacy-shield.png` (Ratio: `1:1`, e.g. 1024×1024)
  7. `bento-smart-contracts.png` (Ratio: `1:1`, e.g. 1024×1024)
  8. `role-software-coder.png` (Ratio: `1:1`, e.g. 512×512)
  9. `role-creative-designer.png` (Ratio: `1:1`, e.g. 512×512)
  10. `role-hardware-maker.png` (Ratio: `1:1`, e.g. 512×512)
  11. `role-business-growth.png` (Ratio: `1:1`, e.g. 512×512)
  12. `role-marketing-writer.png` (Ratio: `1:1`, e.g. 512×512)
  13. `role-general-builder.png` (Ratio: `1:1`, e.g. 512×512)
  14. `avatar-alex-coder.png` (Ratio: `1:1`, e.g. 512×512)
  15. `avatar-maya-designer.png` (Ratio: `1:1`, e.g. 512×512)
  16. `avatar-david-hardware.png` (Ratio: `1:1`, e.g. 512×512)
  17. `avatar-elena-growth.png` (Ratio: `1:1`, e.g. 512×512)
  18. `avatar-carlos-writer.png` (Ratio: `1:1`, e.g. 512×512)
  19. `avatar-priya-fintech.png` (Ratio: `1:1`, e.g. 512×512)
  20. `empty-discover-deck.png` (Ratio: `16:9`, e.g. 1024×576)
  21. `empty-messages-chat.png` (Ratio: `16:9`, e.g. 1024×576)
  22. `cta-nebula-backdrop.png` (Ratio: `16:9`, e.g. 1920×1080)
- **Binary PNG Structure**:
  - Magic Bytes: 8 bytes `89 50 4E 47 0D 0A 1A 0A` (hex: `0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a`).
  - First Chunk: `IHDR` chunk starting at byte offset 12 (`0x49, 0x48, 0x44, 0x52`).
  - Dimensions: Width is a 32-bit unsigned big-endian integer at offset 16–19; Height is at offset 20–23.

### 1.3 CSS Architecture & Token Invariants
- **File**: `d:\passion-protocol\app\globals.css` (imported in `app/layout.tsx`).
- **Required CSS Custom Properties**:
  - Space Obsidian Canvas: `--bg: #090a10`, `--bg-2: #10121d`, `--bg-3: #171928`, `--surface: rgba(18, 20, 32, 0.78)`, `--surface-solid: #121420`, `--surface-card: rgba(22, 25, 42, 0.65)`, `--surface-hover: rgba(30, 35, 58, 0.85)`, `--surface-inset: rgba(10, 12, 20, 0.55)`.
  - Neon Accent Palette: `--accent: #ff3d6e` (Hot Coral/Pink), `--accent-2: #8b5cf6` (Electric Violet), `--accent-3: #06b6d4` (Neon Cyan), `--accent-4: #10b981` (Emerald).
  - Borders & Atmospheric Shadows: `--stroke`, `--stroke-subtle`, `--stroke-hover`, `--stroke-cyan`, `--shadow`, `--shadow-hover`, `--glow-violet`, `--glow-cyan`, `--glow-pink`.
  - Typography & Geometry: `--radius: 20px`, `--radius-sm: 10px`, `--radius-md: 14px`, `--radius-lg: 24px`, `--font-sans: var(--font-jakarta)...`, `--font-display: var(--font-fraunces)...`, `--wrap: 1240px`.
- **Required Core Class Names**:
  - `.glass-panel`, `.match-card`, `.score-badge`, `.role-chip`, `.role-tag`, `.avatar-badge`, `.primary-btn`, `.outline-btn`, `.pill-btn`, `.ghost-btn`, `.bar-track`, `.bar-fill`, `.gradient-text`.

---

## 2. Logic Chain

From the observed facts and specifications, we establish the following 4-pillar verification logic chain:

```
[M1.1: 22 PNG Assets] ──> [Pillar 1: Binary & Metadata Validator] ──┐
                                                                    │
[M1.2: globals.css]    ──> [Pillar 2: CSS Token & Syntax Parser]   ──┼──> [Pillar 4: Challenger & Auditor Gate]
                                                                    │
[Build & TypeScript]   ──> [Pillar 3: Next.js 15 Build Verifier]   ──┘
```

### 2.1 Pillar 1: 22 AI Image Asset Verification Logic
To guarantee that image assets are production-ready and will render flawlessly in Next.js `<Image>` components:
1. **File Existence & Integrity Check**:
   - For each of the 22 canonical filenames, verify `fs.existsSync(path.join(PUBLIC_IMAGES_DIR, filename)) === true`.
2. **Byte Weight Threshold**:
   - File size must be `stat.size >= 1024` (1 KB). Empty files (0 bytes) or corrupted text placeholders (e.g. 50-byte error dumps) will fail immediately.
3. **Binary Header (Magic Bytes) Validation**:
   - Read the first 8 bytes of the file. Compare strictly against `Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])`. This prevents renamed non-PNG files (such as JPEGs or SVGs renamed as .png) from passing.
4. **IHDR Chunk & Dimension Parsing**:
   - Read bytes 12–15 to confirm `IHDR`.
   - Read bytes 16–19 (`buffer.readUInt32BE(16)`) for `width`.
   - Read bytes 20–23 (`buffer.readUInt32BE(20)`) for `height`.
   - Check `width > 0` and `height > 0`.
5. **Aspect Ratio Enforcement**:
   - For `1:1` square assets (18 assets: `hero-synergy-orbit.png`, all 5 `bento-*`, all 6 `role-*`, all 6 `avatar-*`):
     - Tolerance: `0.98 <= (width / height) <= 1.02` (ideally `width === height`).
   - For `16:9` widescreen assets (4 assets: `hero-network-matrix.png`, `empty-discover-deck.png`, `empty-messages-chat.png`, `cta-nebula-backdrop.png`):
     - Target ratio: `16 / 9 = 1.7777...`
     - Tolerance: `1.70 <= (width / height) <= 1.85`.
6. **Alias & Naming Synchronization**:
   - To avoid conflicts between test runners that may check shorter names (e.g. `hero-network.png`) vs full canonical names (`hero-network-matrix.png`), verify that either exact names or symlinks/aliases are properly handled.

### 2.2 Pillar 2: CSS Syntax & Design System Verification Logic
To guarantee `app/globals.css` complies with Next.js 15 compilation and design token contracts:
1. **Syntax Health & Brace Balancing**:
   - Count open `{` and close `}` braces in `app/globals.css` (must be equal).
   - Ensure unclosed multi-line comments `/* ... */` do not exist.
   - Ensure all `@media` queries, `@keyframes` definitions, and `:root` blocks have matching closures.
2. **Token Extraction & Existence Check**:
   - Parse all CSS Custom Properties defined in `:root`.
   - Assert all 20+ required tokens exist (`--bg`, `--bg-2`, `--bg-3`, `--surface`, `--surface-card`, `--surface-solid`, `--surface-hover`, `--surface-inset`, `--stroke`, `--stroke-hover`, `--stroke-cyan`, `--text`, `--text-bright`, `--muted`, `--dim`, `--accent`, `--accent-2`, `--accent-3`, `--accent-4`, `--radius`, `--font-sans`, `--font-display`, `--wrap`, `--shadow`, `--glow-violet`, `--glow-cyan`, `--glow-pink`).
3. **Obsidian Dark Palette Value Validation**:
   - Assert `--bg` is set to `#090a10` (or `rgb(9, 10, 16)`).
   - Assert `--text` is light (`#f8fafc` or `#ffffff`), preventing dark-on-dark unreadable text regressions.
   - Assert `--accent` is `#ff3d6e` (Hot Coral/Pink) and `--accent-2` is `#8b5cf6` (Electric Violet).
4. **Class Definition Audit**:
   - Assert existence of required glassmorphic and UI classes (`.glass-panel`, `.match-card`, `.score-badge`, `.role-chip`, `.role-tag`, `.avatar-badge`, `.primary-btn`, `.outline-btn`, `.pill-btn`, `.ghost-btn`, `.bar-track`, `.bar-fill`, `.gradient-text`).
5. **Next.js Font Variable Binding**:
   - Verify that `--font-sans` references `var(--font-jakarta)` and `--font-display` references `var(--font-fraunces)` as configured in `app/layout.tsx`.

### 2.3 Pillar 3: Next.js 15 Production Build & Type-Safety Logic
To guarantee 0 TypeScript and 0 ESLint errors:
1. **Linter Execution**:
   - Run `npm run lint` (or `npx eslint .`).
   - Exit code must be 0 with 0 errors and 0 warnings.
2. **Production Compilation (`npm run build`)**:
   - Execute `npm run build` (`next build`).
   - Next.js compiles all React Server Components, Client Components, and route definitions.
   - Next.js runs internal `tsc --noEmit` and validates types across all files.
   - Exit code must be 0.
   - `.next/` directory must be generated with valid build manifests.

### 2.4 Pillar 4: Challenger & Auditor Verification Framework
Milestone 1 requires independent adversarial scrutiny:
1. **Challenger Automated Test Script**:
   - A dedicated verification script `scripts/verify-m1.ts` that runs all asset, CSS, and build checks sequentially and outputs colorized PASS/FAIL indicators with execution summary.
2. **Forensic Auditor Inspection Checklist**:
   - 10 structured audit checkpoints covering file system presence, binary integrity, CSS validity, typography integration, and clean build logs.

---

## 3. Caveats

1. **Workspace Type Errors in Tests / Scripts**:
   - Because `tsconfig.json` includes `**/*.ts`, any script or test file written in the repo must have 100% strict TypeScript typing. Type errors in `test/e2e/test_framework.ts` (e.g. missing `black` color key) will break `next build`. All test files must be cleanly typed.
2. **Asset Dimensions vs Tool Generation**:
   - The `generate_image` tool outputs standard resolutions (e.g. 1024×1024 for `1:1`, 1024×576 or 1920×1080 for `16:9`). Minor resolution variations are acceptable as long as aspect ratios match the specification.
3. **No Dynamic CSS Preprocessors**:
   - Passion Protocol uses pure vanilla CSS with CSS variables in `app/globals.css` (Tailwind / PostCSS are not installed). CSS syntax checks must test standard CSS syntax.
4. **Environment Variables During Build**:
   - Next.js 15 build processes pages at build time. `.env.local` contains dummy or development Supabase keys. Build should succeed without active external database connections.

---

## 4. Conclusion

Milestone 1 is ready for deterministic, automated verification. The verification strategy is broken into 4 robust layers:

1. **Asset Layer**: Automated byte-level PNG signature and IHDR dimension validator across all 22 required image assets.
2. **Design System Layer**: Automated CSS token parser, syntax validator, and font variable linkage check.
3. **Build Layer**: Zero-error ESLint and Next.js 15 production build assertion.
4. **Adversarial & Audit Layer**: Standalone execution script `verify-m1.ts` and 10-point forensic audit protocol.

---

## 5. Verification Method & Ready-to-Use Scripts

The implementer (`worker_m1_*`), challenger (`challenger_m1`), and auditor (`auditor_m1`) can execute the following verification procedures:

### 5.1 Verification Script Blueprint (`scripts/verify-m1.ts`)

This zero-dependency script can be created and run with `npx tsx scripts/verify-m1.ts`:

```typescript
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
    execSync('npm run lint', { cwd: ROOT_DIR, stdio: 'pipe' });
    assertCheck('ESLint passes with 0 errors/warnings', true);
  } catch (err: any) {
    assertCheck('ESLint passes with 0 errors/warnings', false, err.stdout?.toString());
  }

  try {
    console.log('  Running npm run build (Next.js 15 production compile)...');
    execSync('npm run build', { cwd: ROOT_DIR, stdio: 'pipe' });
    assertCheck('npm run build completes with exit code 0', true);
  } catch (err: any) {
    assertCheck('npm run build completes with exit code 0', false, err.stdout?.toString() || err.stderr?.toString());
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
```

---

### 5.2 Forensic Auditor 10-Point Inspection Criteria

The forensic auditor will evaluate Milestone 1 against the following strict checklist:

| # | Inspection Checkpoint | Criterion | Pass Condition |
|---|---|---|---|
| **A1** | Asset Directory Structure | `public/images/` exists | Folder present with 22 `.png` files |
| **A2** | PNG Magic Byte Signature | First 8 bytes = `89 50 4E 47 0D 0A 1A 0A` | All 22 files have authentic binary PNG signature |
| **A3** | Asset File Weight | `stat.size >= 1024` bytes | No 0-byte or corrupted stub files |
| **A4** | Aspect Ratio Accuracy | 18 square (1:1) & 4 wide (16:9) | `width/height` matches tolerances |
| **A5** | CSS Token Completeness | All 20+ design system tokens in `:root` | Obsidian `--bg: #090a10`, neon accents, shadows defined |
| **A6** | Glassmorphism & UI Classes | `.glass-panel`, `.match-card`, `.score-badge`, etc. | All component utility classes present in `app/globals.css` |
| **A7** | Font Variable Linkage | `--font-jakarta` & `--font-fraunces` in `layout.tsx` | Next.js Google Fonts bound to root HTML element |
| **A8** | CSS Syntax Integrity | Balanced `{}` braces, valid keyframes | 0 CSS parse or syntax errors during build |
| **A9** | ESLint Code Quality | `npm run lint` | Exits code 0 with 0 errors/warnings |
| **A10**| Next.js 15 Build Pipeline | `npm run build` | Exits code 0 with clean production bundle |

---

### 5.3 Quick CLI Commands for Independent Verification

```powershell
# 1. Verify ESLint status
npm run lint

# 2. Run TypeScript build verification
npm run build

# 3. Check public/images count and sizes
Get-ChildItem -Path "d:\passion-protocol\public\images" | Select-Object Name, Length

# 4. Run automated M1 verification script (once implemented)
npx tsx scripts/verify-m1.ts
```
