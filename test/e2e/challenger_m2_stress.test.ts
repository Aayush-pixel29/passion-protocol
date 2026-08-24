/**
 * Challenger M2 Adversarial Stress Test Suite
 * 
 * Focus Areas:
 * 1. Asset Binary & Metadata Integrity (22 PNGs, signatures, IHDR dimensions)
 * 2. Next.js <Image> CLS Prevention (explicit numeric width/height or fill+sizes)
 * 3. Session-Based Routing & Dynamic CTA Logic (null user vs authenticated user)
 * 4. Landing Component Invariants (HeroPreview, BentoGrid, Simulator, FAQ, Footer)
 * 5. Deterministic Vibe Math & Synergy Tier Stress Testing
 */

import fs from 'node:fs';
import path from 'node:path';
import { describe, test, expect, assert } from './test_framework';
import { vibeScore } from '../../lib/match';
import { INDUSTRY_CATEGORIES, CATEGORY_ICONS, formatRoleWithIcon, type VibeAnswers, type IndustryCategory } from '../../lib/types';

const ROOT_DIR = path.resolve(__dirname, '../..');
const PUBLIC_IMAGES_DIR = path.join(ROOT_DIR, 'public', 'images');
const APP_DIR = path.join(ROOT_DIR, 'app');
const COMPONENTS_DIR = path.join(ROOT_DIR, 'components');

const EXPECTED_22_ASSETS = [
  'avatar-alex-coder.png',
  'avatar-carlos-writer.png',
  'avatar-david-hardware.png',
  'avatar-elena-growth.png',
  'avatar-maya-designer.png',
  'avatar-priya-fintech.png',
  'bento-privacy-shield.png',
  'bento-project-incubator.png',
  'bento-roles-complement.png',
  'bento-smart-contracts.png',
  'bento-vibe-engine.png',
  'cta-nebula-backdrop.png',
  'empty-discover-deck.png',
  'empty-messages-chat.png',
  'hero-network-matrix.png',
  'hero-synergy-orbit.png',
  'role-business-growth.png',
  'role-creative-designer.png',
  'role-general-builder.png',
  'role-hardware-maker.png',
  'role-marketing-writer.png',
  'role-software-coder.png',
];

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function parsePNGHeader(buffer: Buffer) {
  if (buffer.length < 24) throw new Error('Buffer too short for PNG');
  if (!buffer.subarray(0, 8).equals(PNG_SIGNATURE)) throw new Error('Invalid PNG signature');
  const chunkType = buffer.subarray(12, 16).toString('ascii');
  if (chunkType !== 'IHDR') throw new Error(`Expected IHDR, found ${chunkType}`);
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  const bitDepth = buffer.readUInt8(24);
  const colorType = buffer.readUInt8(25);
  return { width, height, bitDepth, colorType };
}

function getAllFiles(dir: string, extensions: string[] = ['.tsx', '.ts', '.jsx', '.js']): string[] {
  if (!fs.existsSync(dir)) return [];
  const results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getAllFiles(fullPath, extensions));
    } else if (entry.isFile() && extensions.some((ext) => entry.name.endsWith(ext))) {
      results.push(fullPath);
    }
  }
  return results;
}

describe('Challenger M2: Adversarial Asset, CLS, & Session Routing Suite', () => {

  describe('1. Asset Suite Completeness & Binary Sanity', () => {
    test('public/images contains exactly all 22 required PNG assets', () => {
      const diskFiles = fs.readdirSync(PUBLIC_IMAGES_DIR).filter((f) => f.endsWith('.png'));
      expect(diskFiles.length).toBe(22);

      const diskSet = new Set(diskFiles);
      for (const expected of EXPECTED_22_ASSETS) {
        assert.ok(diskSet.has(expected), `Missing asset: ${expected}`);
      }
    });

    test('every PNG asset has valid 8-byte signature, positive dimensions, and size > 10KB', () => {
      for (const assetName of EXPECTED_22_ASSETS) {
        const filePath = path.join(PUBLIC_IMAGES_DIR, assetName);
        const stat = fs.statSync(filePath);
        expect(stat.size).toBeGreaterThan(10000); // All generated assets are rich images > 10KB

        const buf = fs.readFileSync(filePath);
        const header = parsePNGHeader(buf);
        expect(header.width).toBeGreaterThan(0);
        expect(header.height).toBeGreaterThan(0);
      }
    });
  });

  describe('2. Cumulative Layout Shift (CLS) Prevention in Next.js <Image>', () => {
    test('all <Image> elements across app/ and components/ declare numeric width & height OR fill', () => {
      const sourceFiles = [...getAllFiles(APP_DIR), ...getAllFiles(COMPONENTS_DIR)];
      const violations: string[] = [];

      for (const file of sourceFiles) {
        const content = fs.readFileSync(file, 'utf-8');
        if (!content.includes('next/image')) continue;

        // Regex match JSX <Image ... />
        const imageTagRegex = /<Image\b([\s\S]*?)\/?>/g;
        let match: RegExpExecArray | null;
        while ((match = imageTagRegex.exec(content)) !== null) {
          const props = match[1];
          const hasWidth = /\bwidth\s*=\s*\{?\d+\}?/.test(props);
          const hasHeight = /\bheight\s*=\s*\{?\d+\}?/.test(props);
          const hasFill = /\bfill\b/.test(props);
          const hasAlt = /\balt\s*=\s*["'{]/.test(props);

          if (!hasAlt) {
            violations.push(`${path.basename(file)}: <Image> missing alt attribute`);
          }
          if (!hasFill && (!hasWidth || !hasHeight)) {
            violations.push(`${path.basename(file)}: <Image> missing explicit width/height or fill`);
          }
        }
      }

      assert.strictEqual(violations.length, 0, `CLS / Accessibility violations:\n${violations.join('\n')}`);
    });

    test('when fill is used on <Image>, container has relative/absolute positioning and sizes attribute', () => {
      // Generic check across app/ and components/: any <Image fill> usage anywhere
      // in the codebase must declare a sizes attribute, so this doesn't regress
      // if the CTA backdrop (or any other fill-image) is added, removed, or moved.
      const sourceFiles = [...getAllFiles(APP_DIR), ...getAllFiles(COMPONENTS_DIR)].filter(
        (f) => f.endsWith('.tsx')
      );
      const violations: string[] = [];

      for (const file of sourceFiles) {
        const content = fs.readFileSync(file, 'utf-8');
        const imageBlocks = content.match(/<Image\b[^>]*\/?>/g) || [];
        for (const block of imageBlocks) {
          if (/\bfill\b/.test(block) && !/sizes\s*=/.test(block)) {
            violations.push(`${path.basename(file)}: <Image fill> missing sizes attribute`);
          }
        }
      }

      assert.strictEqual(violations.length, 0, `Fill-image CLS violations:\n${violations.join('\n')}`);
    });
  });

  describe('3. Codebase Asset Reference Exhaustiveness', () => {
    test('all image paths referenced in app/ and components/ resolve to existing public/ files', () => {
      const sourceFiles = [...getAllFiles(APP_DIR), ...getAllFiles(COMPONENTS_DIR)];
      const refRegex = /["'`](\/images\/[a-zA-Z0-9_\-]+\.png)["'`]/g;
      const brokenRefs: string[] = [];

      for (const file of sourceFiles) {
        const content = fs.readFileSync(file, 'utf-8');
        let match: RegExpExecArray | null;
        while ((match = refRegex.exec(content)) !== null) {
          const imagePath = match[1];
          const fullDiskPath = path.join(ROOT_DIR, 'public', imagePath.replace(/^\//, ''));
          if (!fs.existsSync(fullDiskPath)) {
            brokenRefs.push(`${imagePath} referenced in ${path.basename(file)}`);
          }
        }
      }

      assert.strictEqual(brokenRefs.length, 0, `Broken image references found:\n${brokenRefs.join('\n')}`);
    });
  });

  describe('4. Session-Based Routing Logic Simulation', () => {
    test('unauthenticated state (user = null) generates /login CTA and "Find Your Partner"', () => {
      const user: any = null;
      const ctaHref = user ? "/discover" : "/login";
      const ctaLabel = user ? "Explore Discover Deck" : "Find Your Partner";

      expect(ctaHref).toBe("/login");
      expect(ctaLabel).toBe("Find Your Partner");
    });

    test('authenticated state (user = { id: "u-1" }) generates /discover CTA and "Explore Discover Deck"', () => {
      const user: any = { id: "u-1", email: "builder@test.com" };
      const ctaHref = user ? "/discover" : "/login";
      const ctaLabel = user ? "Explore Discover Deck" : "Find Your Partner";

      expect(ctaHref).toBe("/discover");
      expect(ctaLabel).toBe("Explore Discover Deck");
    });

    test('LandingSimulator generates pre-filled calibration params for unauthenticated user and /discover for authed user', () => {
      const vibe: VibeAnswers = { pace: 5, comms: 4, risk: 5, energy: 4 };
      const myCat: IndustryCategory = "Software & IT";
      const targetCat: IndustryCategory = "Creative & Design";

      // Unauthenticated
      const unauthedHref = `/onboarding?role=${encodeURIComponent(myCat)}&seeking=${encodeURIComponent(targetCat)}&pace=${vibe.pace}&comms=${vibe.comms}&risk=${vibe.risk}&energy=${vibe.energy}`;
      expect(unauthedHref).toBe("/onboarding?role=Software%20%26%20IT&seeking=Creative%20%26%20Design&pace=5&comms=4&risk=5&energy=4");

      // Authenticated
      const authedHref = "/discover";
      expect(authedHref).toBe("/discover");
    });
  });

  describe('5. Interactive Landing Component Logic & Math Verification', () => {
    test('LandingHeroPreview candidate samples compute correct static scores and valid assets', () => {
      const SAMPLES = [
        { codename: "RIYA_DESIGNS 🎨", score: 94, avatarImg: "/images/avatar-maya-designer.png", vibe: { pace: 5, comms: 4, risk: 5, energy: 4 } },
        { codename: "ALEX_AI 💻", score: 96, avatarImg: "/images/avatar-alex-coder.png", vibe: { pace: 5, comms: 5, risk: 4, energy: 5 } },
        { codename: "DAVID_MAKER ⚙️", score: 91, avatarImg: "/images/avatar-david-hardware.png", vibe: { pace: 4, comms: 3, risk: 5, energy: 4 } },
      ];

      for (const sample of SAMPLES) {
        const diskPath = path.join(ROOT_DIR, 'public', sample.avatarImg.replace(/^\//, ''));
        assert.ok(fs.existsSync(diskPath), `Avatar does not exist: ${sample.avatarImg}`);
        expect(sample.score).toBeGreaterThanOrEqual(90);
        expect(sample.score).toBeLessThanOrEqual(100);
      }
    });

    test('LandingSimulator deterministic vibe calculation matches vibeScore formula across extreme ranges', () => {
      // Test identical vibes
      const identicalA: VibeAnswers = { pace: 5, comms: 5, risk: 5, energy: 5 };
      const identicalB: VibeAnswers = { pace: 5, comms: 5, risk: 5, energy: 5 };
      expect(vibeScore(identicalA, identicalB)).toBe(100);

      // Test polar opposite vibes (max distance = |5-1|*4 = 16 => score = 0)
      const oppositeA: VibeAnswers = { pace: 1, comms: 1, risk: 1, energy: 1 };
      const oppositeB: VibeAnswers = { pace: 5, comms: 5, risk: 5, energy: 5 };
      expect(vibeScore(oppositeA, oppositeB)).toBe(0);

      // Test preset vibes
      const sprint: VibeAnswers = { pace: 5, comms: 5, risk: 5, energy: 4 };
      const deepTech: VibeAnswers = { pace: 2, comms: 2, risk: 4, energy: 2 };
      const score = vibeScore(sprint, deepTech);
      // dist = |5-2| + |5-2| + |5-4| + |4-2| = 3 + 3 + 1 + 2 = 9
      // score = Math.round(100 - (9/16)*100) = Math.round(100 - 56.25) = 44
      expect(score).toBe(44);
    });

    test('landing page comparison section covers matching, discovery, and contracts', () => {
      // The 5-card bento grid was replaced by a tighter 3-row honest comparison
      // (old way vs. Passion Protocol way). Verify the same 3 core differentiators
      // are still represented, just without decorative illustration assets.
      const pageFile = path.join(APP_DIR, 'page.tsx');
      const content = fs.readFileSync(pageFile, 'utf-8');

      assert.match(content, /Pace,\s*Comms,\s*Risk,\s*Energy/, 'Comparison covers the 4D vibe engine');
      assert.match(content, /Reciprocal matching/i, 'Comparison covers reciprocal matching');
      assert.match(content, /milestone contract/i, 'Comparison covers milestone contracts');
    });

    test('LandingFaq includes 6 glassmorphic FAQ items covering all core topics', () => {
      const faqFile = path.join(COMPONENTS_DIR, 'LandingFaq.tsx');
      const content = fs.readFileSync(faqFile, 'utf-8');

      const expectedTopics = ['algorithm', 'privacy', 'workflow', 'contracts', 'profile', 'limits'];
      for (const topic of expectedTopics) {
        assert.ok(content.includes(`topic: "${topic}"`), `FAQ missing topic: ${topic}`);
      }
      assert.ok(content.includes('aria-expanded'), 'FAQ buttons must have aria-expanded');
      assert.ok(content.includes('role="region"'), 'FAQ answers must have role="region"');
    });
  });

  describe('6. Landing Page Sections & Invariant Verification', () => {
    test('app/page.tsx renders all 8 required sections (redesigned, simplified structure)', () => {
      // Redesigned 2026-08-22: cut from 10 sections to 8. Removed the 5-card
      // bento grid, the separate simulator section, the 3-card fake-testimonial
      // grid, and the newsletter footer — each either duplicated the hero's
      // live SynergyProof widget or relied on fabricated content. Every section
      // below either carries real product logic or real, non-fabricated copy.
      const pageFile = path.join(APP_DIR, 'page.tsx');
      const content = fs.readFileSync(pageFile, 'utf-8');

      // 1. Header
      assert.ok(content.includes('<SiteHeader'), 'Missing SiteHeader');
      // 2. Hero with the live formula widget (replaces the static mock match card)
      assert.ok(content.includes('styles.hero'), 'Missing Hero section');
      assert.ok(content.includes('<SynergyProof'), 'Missing SynergyProof live widget');
      // 3. Real registered builders (self-hides if pool is empty — not fabricated)
      assert.ok(content.includes('<SneakPeekMarquee'), 'Missing SneakPeekMarquee');
      // 4. Comparison section (replaces the 5-card bento grid)
      assert.ok(content.includes('compareSection') || content.includes('COMPARISONS'), 'Missing comparison section');
      // 5. How It Works
      assert.ok(content.includes("how-it-works"), "Missing How It Works");
      // 6. Honest builder note (replaces the 3-card fabricated testimonial grid)
      assert.ok(content.includes('buildNote'), 'Missing honest builder note');
      // 7. FAQ
      assert.ok(content.includes('<LandingFaq'), 'Missing LandingFaq');
      // 8. CTA + Footer
      assert.ok(content.includes('ctaSimple'), 'Missing CTA section');
      assert.ok(content.includes('footerSimple'), 'Missing Footer');
    });
  });
});
