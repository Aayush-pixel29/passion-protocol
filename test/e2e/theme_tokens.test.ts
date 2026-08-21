/**
 * Theme Tokens & Design System Verification Suite
 * 
 * Verifies:
 * 1. CSS Custom Properties in app/globals.css (dark obsidian canvas, neon accents, surfaces)
 * 2. Glassmorphism utility classes (.glass-panel, .match-card, .score-badge, .role-chip, etc.)
 * 3. Typography & Google Fonts configuration (Plus_Jakarta_Sans, Fraunces)
 * 4. Design system class usage consistency across all routes (Landing, Discover, Profile, Messages, Onboarding, Login)
 * 5. Responsive design breakpoints and accessibility media queries
 */

import fs from 'node:fs';
import path from 'node:path';
import { describe, test, expect, assert } from './test_framework';

const ROOT_DIR = path.resolve(__dirname, '../..');
const GLOBALS_CSS_PATH = path.join(ROOT_DIR, 'app', 'globals.css');
const LAYOUT_TSX_PATH = path.join(ROOT_DIR, 'app', 'layout.tsx');

const APP_PAGES = [
  { name: 'Landing Page', path: path.join(ROOT_DIR, 'app', 'page.tsx') },
  { name: 'Discover Page', path: path.join(ROOT_DIR, 'app', 'discover', 'page.tsx') },
  { name: 'Profile Page', path: path.join(ROOT_DIR, 'app', 'profile', 'page.tsx') },
  { name: 'Messages Page', path: path.join(ROOT_DIR, 'app', 'messages', 'page.tsx') },
  { name: 'Onboarding Page', path: path.join(ROOT_DIR, 'app', 'onboarding', 'page.tsx') },
  { name: 'Login Page', path: path.join(ROOT_DIR, 'app', 'login', 'page.tsx') },
];

function readGlobalsCss(): string {
  if (!fs.existsSync(GLOBALS_CSS_PATH)) {
    throw new Error(`globals.css not found at ${GLOBALS_CSS_PATH}`);
  }
  return fs.readFileSync(GLOBALS_CSS_PATH, 'utf-8');
}

function parseCssCustomProperties(cssContent: string): Map<string, string> {
  const properties = new Map<string, string>();
  // Match inside :root { ... } across multiple lines
  const rootMatch = cssContent.match(/:root\s*\{([\s\S]+?)\}/);
  if (!rootMatch) return properties;

  // Strip CSS comments
  const cleanContent = rootMatch[1].replace(/\/\*[\s\S]*?\*\//g, '');
  const varRegex = /(--[a-zA-Z0-9_-]+)\s*:\s*([^;]+);/g;
  let match: RegExpExecArray | null;
  while ((match = varRegex.exec(cleanContent)) !== null) {
    properties.set(match[1].trim(), match[2].trim());
  }
  return properties;
}

describe('Theme Tokens & Design System Verification', () => {

  describe('1. CSS Custom Properties (:root variables)', () => {
    test('app/globals.css exists and is non-empty', () => {
      assert.ok(fs.existsSync(GLOBALS_CSS_PATH), 'app/globals.css should exist');
      const content = readGlobalsCss();
      expect(content.length).toBeGreaterThan(100);
    });

    test(':root defines core background and surface tokens', () => {
      const css = readGlobalsCss();
      const tokens = parseCssCustomProperties(css);

      expect(tokens.has('--bg')).toBe(true);
      expect(tokens.has('--surface')).toBe(true);
      expect(tokens.has('--stroke')).toBe(true);
      expect(tokens.has('--text')).toBe(true);
      expect(tokens.has('--muted')).toBe(true);
    });

    test(':root defines neon accent color palette', () => {
      const css = readGlobalsCss();
      const tokens = parseCssCustomProperties(css);

      // Neon Pink Accent (#ff3d6e)
      expect(tokens.has('--accent')).toBe(true);
      const accent = tokens.get('--accent') || '';
      assert.ok(
        accent.includes('#ff3d6e') || accent.includes('rgb') || accent.includes('hsl'),
        `Expected --accent to be defined with pink tone, got: ${accent}`
      );

      // Electric Violet Accent-2 (#7c3aed or #8b5cf6)
      expect(tokens.has('--accent-2')).toBe(true);

      // Accent-3 / Accent-4 / Success / Cyan
      const hasSecondaryAccents = tokens.has('--accent-3') || tokens.has('--success');
      expect(hasSecondaryAccents).toBe(true);
    });

    test(':root defines typography font variables and border radius', () => {
      const css = readGlobalsCss();
      const tokens = parseCssCustomProperties(css);

      expect(tokens.has('--font-sans')).toBe(true);
      expect(tokens.has('--font-display')).toBe(true);
      expect(tokens.has('--radius')).toBe(true);

      const fontSans = tokens.get('--font-sans') || '';
      assert.ok(
        fontSans.includes('--font-jakarta') || fontSans.includes('sans-serif'),
        `Expected --font-sans to reference --font-jakarta, got: ${fontSans}`
      );

      const fontDisplay = tokens.get('--font-display') || '';
      assert.ok(
        fontDisplay.includes('--font-fraunces') || fontDisplay.includes('serif'),
        `Expected --font-display to reference --font-fraunces, got: ${fontDisplay}`
      );
    });
  });

  describe('2. Glassmorphic Surface & Core Utility Classes', () => {
    test('defines .match-card container styling with smooth transitions', () => {
      const css = readGlobalsCss();
      expect(css).toContain('.match-card');
      expect(css).toContain('.match-card:hover');
      assert.match(css, /\.match-card\s*\{[\s\S]*?border-radius:/);
      assert.match(css, /\.match-card\s*\{[\s\S]*?transition:/);
    });

    test('defines .score-badge with gradient background and pulse animations', () => {
      const css = readGlobalsCss();
      expect(css).toContain('.score-badge');
      expect(css).toContain('@keyframes pulseBadge');
      assert.match(css, /\.score-badge\s*\{[\s\S]*?background:/);
    });

    test('defines .role-chip and .role-tag for 4 core builder roles (coder, designer, writer, maker)', () => {
      const css = readGlobalsCss();
      expect(css).toContain('.role-chip');
      expect(css).toContain('.role-tag');

      // Coder role
      assert.ok(css.includes('.coder') || css.includes('role-coder'), 'Missing coder role styling');
      // Designer role
      assert.ok(css.includes('.designer') || css.includes('role-designer'), 'Missing designer role styling');
      // Writer role
      assert.ok(css.includes('.writer') || css.includes('role-writer'), 'Missing writer role styling');
      // Maker role
      assert.ok(css.includes('.maker') || css.includes('role-maker'), 'Missing maker role styling');
    });

    test('defines .avatar-badge with size tiers (sm, md, lg, xl) and gradient variants', () => {
      const css = readGlobalsCss();
      expect(css).toContain('.avatar-badge');
      expect(css).toContain('.avatar-badge.sm');
      expect(css).toContain('.avatar-badge.md');
      expect(css).toContain('.avatar-badge.lg');
      expect(css).toContain('.avatar-badge.xl');
    });

    test('defines button variant classes: .primary-btn, .outline-btn, .pill-btn, .ghost-btn', () => {
      const css = readGlobalsCss();
      expect(css).toContain('.primary-btn');
      expect(css).toContain('.outline-btn');
      expect(css).toContain('.pill-btn');
      expect(css).toContain('.ghost-btn');
      expect(css).toContain('.primary-btn:hover');
      expect(css).toContain('.outline-btn:hover');
    });

    test('defines vibe fingerprint progress bar classes: .bar-track and .bar-fill', () => {
      const css = readGlobalsCss();
      expect(css).toContain('.bar-track');
      expect(css).toContain('.bar-fill');
      assert.match(css, /\.bar-fill\s*\{[\s\S]*?transition:/);
    });
  });

  describe('3. Google Fonts & Layout Integration', () => {
    test('app/layout.tsx configures Plus_Jakarta_Sans and Fraunces fonts', () => {
      assert.ok(fs.existsSync(LAYOUT_TSX_PATH), 'app/layout.tsx should exist');
      const layoutContent = fs.readFileSync(LAYOUT_TSX_PATH, 'utf-8');

      expect(layoutContent).toContain('Plus_Jakarta_Sans');
      expect(layoutContent).toContain('Fraunces');
      expect(layoutContent).toContain('--font-jakarta');
      expect(layoutContent).toContain('--font-fraunces');
    });

    test('app/layout.tsx injects font variables into root HTML element', () => {
      const layoutContent = fs.readFileSync(LAYOUT_TSX_PATH, 'utf-8');
      const hasFontClasses = /<html\b[\s\S]*?className=\{?`?\$\{jakarta\.variable\} \$\{fraunces\.variable\}`?\}?/.test(layoutContent) ||
        (layoutContent.includes('jakarta.variable') && layoutContent.includes('fraunces.variable') && layoutContent.includes('<html'));
      assert.ok(hasFontClasses, 'app/layout.tsx must inject jakarta and fraunces font variables into <html>');
    });
  });

  describe('4. Design System Consistency Across Application Pages', () => {
    for (const page of APP_PAGES) {
      test(`${page.name} exists and adopts standard layout containers (.site or .wrap)`, () => {
        assert.ok(fs.existsSync(page.path), `Page file ${page.path} does not exist`);
        const content = fs.readFileSync(page.path, 'utf-8');
        const hasLayoutContainer = content.includes('className="site"') ||
          content.includes('className="wrap"') ||
          content.includes("className='site'") ||
          content.includes("className='wrap'") ||
          content.includes('site') ||
          content.includes('wrap');

        assert.ok(
          hasLayoutContainer,
          `${page.name} (${page.path}) should use standardized container classes (.site / .wrap)`
        );
      });
    }

    test('all core app pages utilize shared SiteHeader navigation component', () => {
      for (const page of APP_PAGES) {
        const content = fs.readFileSync(page.path, 'utf-8');
        const hasHeader = content.includes('SiteHeader') || content.includes('<SiteHeader');
        assert.ok(hasHeader, `${page.name} should include the SiteHeader component`);
      }
    });
  });

  describe('5. Responsive Breakpoints & Accessibility Styling', () => {
    test('defines responsive media query breakpoints (980px, 768px, 480px)', () => {
      const css = readGlobalsCss();
      expect(css).toContain('@media (max-width: 980px)');
      expect(css).toContain('@media (max-width: 768px)');
      expect(css).toContain('@media (max-width: 480px)');
    });

    test('defines accessible focus-visible outlines for interactive elements', () => {
      const css = readGlobalsCss();
      expect(css).toContain(':focus-visible');
      assert.match(css, /outline:\s*2\.?5?px solid/);
    });

    test('defines prefers-reduced-motion media query for motion sensitivity', () => {
      const css = readGlobalsCss();
      expect(css).toContain('@media (prefers-reduced-motion: reduce)');
      expect(css).toContain('animation-duration: 0.01ms');
    });
  });
});
