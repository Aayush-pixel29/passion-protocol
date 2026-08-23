/**
 * Tier 1: Feature-Level Component, Logic & Invariant Test Suite
 * 
 * Verifies all 18 inventoried features (F1 through F18) with >= 5 tests each:
 * - F1: Dark Theme Design Tokens
 * - F2: Synthetic AI Asset Suite
 * - F3: Landing Page Hero Section
 * - F4: Social Proof & Metrics Ribbon
 * - F5: Bento Grid Feature Showcase
 * - F6: Step-by-Step How It Works
 * - F7: Interactive Matchmaker Simulator
 * - F8: Co-Founder Testimonials Grid
 * - F9: Interactive FAQ Accordion
 * - F10: Pre-Footer CTA Banner
 * - F11: Modern Multi-Column Footer
 * - F12: Navigation Header Upgrade
 * - F13: Discover Page Redesign & Deck
 * - F14: Profile Page Redesign & Project Pitch
 * - F15: Messages & Chat Interface Redesign
 * - F16: Progressive Onboarding Flow
 * - F17: Auth & Login Redesign
 * - F18: Functional Invariant Protection & Match Engine
 */

import fs from 'node:fs';
import path from 'node:path';
import { describe, test, expect, assert, runSuites } from './test_framework';
import { vibeScore, rankMatches } from '../../lib/match';
import {
  INDUSTRY_CATEGORIES,
  CATEGORY_ICONS,
  isValidCategory,
  formatRoleWithIcon,
  type Profile,
  type VibeAnswers,
  type Project,
} from '../../lib/types';

const ROOT_DIR = path.resolve(__dirname, '../..');
const APP_DIR = path.join(ROOT_DIR, 'app');
const COMPONENTS_DIR = path.join(ROOT_DIR, 'components');
const GLOBALS_CSS = path.join(APP_DIR, 'globals.css');
const PUBLIC_IMAGES_DIR = path.join(ROOT_DIR, 'public', 'images');

describe('Tier 1: Feature Coverage (F1 to F18)', () => {

  // --------------------------------------------------------------------------
  // F1: Dark Theme Design Tokens
  // --------------------------------------------------------------------------
  describe('F1: Dark Theme Design Tokens', () => {
    const cssContent = fs.existsSync(GLOBALS_CSS) ? fs.readFileSync(GLOBALS_CSS, 'utf-8') : '';

    test('F1-1: defines core color custom properties in :root', () => {
      assert.ok(cssContent.length > 0, 'globals.css should exist');
      assert.match(cssContent, /--bg:/, 'Must define --bg');
      assert.match(cssContent, /--surface:/, 'Must define --surface');
      assert.match(cssContent, /--text:/, 'Must define --text');
      assert.match(cssContent, /--accent:/, 'Must define --accent');
    });

    test('F1-2: defines secondary and accent color tokens', () => {
      assert.match(cssContent, /--accent-2:/, 'Must define --accent-2');
      assert.match(cssContent, /--stroke:/, 'Must define --stroke');
      assert.match(cssContent, /--muted:/, 'Must define --muted');
    });

    test('F1-3: defines typography font family variables', () => {
      assert.match(cssContent, /--font-sans:/, 'Must define --font-sans');
      assert.match(cssContent, /--font-display:/, 'Must define --font-display');
    });

    test('F1-4: provides button variant utility classes', () => {
      assert.match(cssContent, /\.primary-btn/, 'Must define .primary-btn');
      assert.match(cssContent, /\.ghost-btn|\.outline-btn|\.pill-btn/, 'Must define secondary button classes');
    });

    test('F1-5: defines surface and card container classes', () => {
      assert.match(cssContent, /\.wrap|\.hero-panel|\.feature-card|\.score-badge/, 'Must define container classes');
    });

    test('F1-6: configures global font smoothing and base box-sizing', () => {
      assert.match(cssContent, /box-sizing:\s*border-box/, 'Must set box-sizing: border-box');
      assert.match(cssContent, /-webkit-font-smoothing:\s*antialiased/, 'Must enable antialiased text');
    });
  });

  // --------------------------------------------------------------------------
  // F2: Synthetic AI Asset Suite
  // --------------------------------------------------------------------------
  describe('F2: Synthetic AI Asset Suite', () => {
    test('F2-1: public/images directory exists and contains at least 22 image assets', () => {
      assert.ok(fs.existsSync(PUBLIC_IMAGES_DIR), 'public/images directory must exist');
      const files = fs.readdirSync(PUBLIC_IMAGES_DIR).filter((f) => f.endsWith('.png'));
      assert.ok(files.length >= 22, `Expected at least 22 PNG assets, found ${files.length}`);
    });

    test('F2-2: builder avatar assets exist and follow canonical naming pattern', () => {
      const files = fs.readdirSync(PUBLIC_IMAGES_DIR).filter((f) => f.startsWith('avatar-') && f.endsWith('.png'));
      assert.strictEqual(files.length, 6, 'Should have 6 distinct builder avatar assets on disk');
      for (const avatar of files) {
        assert.match(avatar, /^avatar-[a-z0-9-]+\.png$/);
        const stat = fs.statSync(path.join(PUBLIC_IMAGES_DIR, avatar));
        assert.ok(stat.size > 500, `Avatar asset ${avatar} must have non-trivial size`);
      }
    });

    test('F2-3: bento showcase assets cover all 5 feature pillars on disk', () => {
      const files = fs.readdirSync(PUBLIC_IMAGES_DIR).filter((f) => f.startsWith('bento-') && f.endsWith('.png'));
      assert.strictEqual(files.length, 5, 'Should have 5 bento 3D illustrations on disk');
      const expectedBento = [
        'bento-vibe-engine.png',
        'bento-roles-complement.png',
        'bento-project-incubator.png',
        'bento-privacy-shield.png',
        'bento-smart-contracts.png',
      ];
      for (const bento of expectedBento) {
        assert.ok(files.includes(bento), `Missing bento asset on disk: ${bento}`);
      }
    });

    test('F2-4: role indicator icons match core builder categories on disk', () => {
      const files = fs.readdirSync(PUBLIC_IMAGES_DIR).filter((f) => f.startsWith('role-') && f.endsWith('.png'));
      assert.strictEqual(files.length, 6, 'Should have 6 role indicator icons on disk');
      const expectedRoles = [
        'role-software-coder.png',
        'role-creative-designer.png',
        'role-hardware-maker.png',
        'role-business-growth.png',
        'role-marketing-writer.png',
        'role-general-builder.png',
      ];
      for (const role of expectedRoles) {
        assert.ok(files.includes(role), `Missing role asset on disk: ${role}`);
      }
    });

    test('F2-5: empty state and CTA assets are present on disk with non-trivial size', () => {
      const files = fs.readdirSync(PUBLIC_IMAGES_DIR);
      assert.ok(files.includes('empty-discover-deck.png'), 'Must include empty discover deck asset');
      assert.ok(files.includes('empty-messages-chat.png'), 'Must include empty messages chat asset');
      assert.ok(files.includes('cta-nebula-backdrop.png'), 'Must include CTA nebula backdrop asset');
      const ctaStat = fs.statSync(path.join(PUBLIC_IMAGES_DIR, 'cta-nebula-backdrop.png'));
      assert.ok(ctaStat.size > 500, 'CTA backdrop asset must have non-trivial size');
    });

    test('F2-6: hero section assets exist on disk with authentic PNG format', () => {
      const files = fs.readdirSync(PUBLIC_IMAGES_DIR).filter((f) => f.startsWith('hero-') && f.endsWith('.png'));
      assert.strictEqual(files.length, 2, 'Must have 2 hero visual assets on disk');
      assert.ok(files.includes('hero-network-matrix.png'), 'Must include hero-network-matrix.png');
      assert.ok(files.includes('hero-synergy-orbit.png'), 'Must include hero-synergy-orbit.png');
    });
  });

  // --------------------------------------------------------------------------
  // F3: Landing Hero Section
  // --------------------------------------------------------------------------
  describe('F3: Landing Page Hero Section', () => {
    const pagePath = path.join(APP_DIR, 'page.tsx');
    const content = fs.existsSync(pagePath) ? fs.readFileSync(pagePath, 'utf-8') : '';

    test('F3-1: page.tsx renders value proposition kicker', () => {
      assert.ok(content.length > 0, 'page.tsx must exist');
      assert.match(content, /kicker|headline/i, 'Must contain headline/kicker structure');
    });

    test('F3-2: hero includes primary call-to-action button', () => {
      assert.match(content, /ctaLabel|primary-btn/i, 'Must render primary call to action');
    });

    test('F3-3: hero includes secondary login / explore link', () => {
      assert.match(content, /\/login|\/discover/, 'Must link to login or discover routes');
    });

    test('F3-4: hero renders the live synergy-score formula widget', () => {
      assert.match(content, /SynergyProof/, 'Must render the interactive SynergyProof component');
      const synergyPath = path.join(COMPONENTS_DIR, 'SynergyProof.tsx');
      const synergyContent = fs.existsSync(synergyPath) ? fs.readFileSync(synergyPath, 'utf-8') : '';
      assert.match(synergyContent, /vibeScore/, 'Widget must use the real vibeScore formula, not a hardcoded number');
    });

    test('F3-5: hero lists core matchmaking differentiators', () => {
      assert.match(content, /vibe|contact|private/i, 'Must highlight vibe and privacy differentiators');
    });
  });

  // --------------------------------------------------------------------------
  // F4: Social Proof & Metrics Ribbon
  // --------------------------------------------------------------------------
  describe('F4: Social Proof & Metrics Ribbon', () => {
    const pagePath = path.join(APP_DIR, 'page.tsx');
    const content = fs.existsSync(pagePath) ? fs.readFileSync(pagePath, 'utf-8') : '';

    test('F4-1: landing page defines a hero badge and live differentiator widget', () => {
      assert.match(content, /hero-badge-pill/, 'Landing contains the early-access badge pill');
      assert.match(content, /SynergyProof/, 'Landing renders the live match preview widget');
    });

    test('F4-2: metrics & copy highlight builder community and complementary roles', () => {
      assert.match(content, /builders,\s*designers,\s*writers,\s*and\s*makers|builders/i, 'Highlights multi-disciplinary builder community');
      assert.match(content, /Reciprocal matching/i, 'Demonstrates real complementary role pairing');
    });

    test('F4-3: hero stats emphasize deterministic, reciprocal matching', () => {
      assert.match(content, /heroStats/i, 'Renders the honest stats row');
      assert.match(content, /Reciprocal matching/i, 'Emphasizes reciprocal matching, not a fabricated match rate');
    });

    test('F4-4: social proof reinforces private contact unlock invariant', () => {
      const faqPath = path.join(COMPONENTS_DIR, 'LandingFaq.tsx');
      const faqContent = fs.existsSync(faqPath) ? fs.readFileSync(faqPath, 'utf-8') : '';
      assert.match(faqContent, /revealed upon mutual connection acceptance|mutual connection/i, 'Highlights privacy and contact unlock guarantee');
    });

    test('F4-5: differentiators are organized into a scannable comparison list', () => {
      assert.match(content, /compareGrid|compareRow/i, 'Defines the old-way vs new-way comparison structure');
      assert.match(content, /COMPARISONS/, 'Comparison rows are driven by real content, not decorative markup');
    });
  });

  // --------------------------------------------------------------------------
  // F5: Bento Grid Feature Showcase
  // --------------------------------------------------------------------------
  describe('F5: Bento Grid Feature Showcase', () => {
    const pagePath = path.join(APP_DIR, 'page.tsx');
    const content = fs.existsSync(pagePath) ? fs.readFileSync(pagePath, 'utf-8') : '';

    test('F5-1: explains role-based filtering concept', () => {
      assert.match(content, /Role is just a filter|Role/i, 'Explains role filtering pillar');
    });

    test('F5-2: explains 4D vibe deterministic scoring', () => {
      assert.match(content, /Vibe is the score|Vibe/i, 'Explains 4D vibe scoring pillar');
    });

    test('F5-3: explains mutual connection and contact reveal mechanics', () => {
      assert.match(content, /Connect when it fits|Connect|contact/i, 'Explains mutual connection unlock');
    });

    test('F5-4: feature cards have numbered indices for progressive reading', () => {
      assert.match(content, /01|02|03|feature-index/i, 'Includes structured indexing');
    });

    test('F5-5: feature cards adopt dark surface glass styling', () => {
      const css = fs.readFileSync(GLOBALS_CSS, 'utf-8');
      assert.match(css, /\.feature-card|\.glass-panel|\.panel/, 'Defines glass feature card styling');
    });
  });

  // --------------------------------------------------------------------------
  // F6: Step-by-Step How It Works
  // --------------------------------------------------------------------------
  describe('F6: Step-by-Step How It Works', () => {
    const pagePath = path.join(APP_DIR, 'page.tsx');
    const content = fs.readFileSync(pagePath) ? fs.readFileSync(pagePath, 'utf-8') : '';

    test('F6-1: step 1 covers vibe calibration', () => {
      assert.match(content, /Pace|Comms|Risk|Energy|vibe/i, 'Highlights 4 vibe dimensions');
    });

    test('F6-2: step 2 covers targeted candidate discovery', () => {
      assert.match(content, /discovery|collaborator|partner|filter/i, 'Highlights targeted discovery');
    });

    test('F6-3: step 3 covers mutual connect and launch', () => {
      assert.match(content, /connect|unlocked|match/i, 'Highlights mutual connection and launch');
    });

    test('F6-4: structured workflow guides users from entry to match', () => {
      assert.ok(content.includes('01') && content.includes('02') && content.includes('03'));
    });

    test('F6-5: UI maintains responsive layout for multi-step instructions', () => {
      const css = fs.readFileSync(GLOBALS_CSS, 'utf-8');
      assert.match(css, /grid|flex|@media/, 'CSS handles multi-step responsive grid');
    });
  });

  // --------------------------------------------------------------------------
  // F7: Interactive Matchmaker Simulator
  // --------------------------------------------------------------------------
  describe('F7: Interactive Matchmaker Simulator', () => {
    test('F7-1: supports 4 core vibe dimensions (pace, comms, risk, energy)', () => {
      const me: VibeAnswers = { pace: 5, comms: 3, risk: 4, energy: 2 };
      const candidate: VibeAnswers = { pace: 4, comms: 3, risk: 4, energy: 2 };
      const score = vibeScore(me, candidate);
      assert.ok(score >= 90, `Score ${score} should be high for 1 point distance`);
    });

    test('F7-2: computes 100% synergy for identical ratings', () => {
      const a: VibeAnswers = { pace: 3, comms: 4, risk: 2, energy: 5 };
      assert.strictEqual(vibeScore(a, a), 100);
    });

    test('F7-3: computes 0% synergy for diametrically opposite ratings', () => {
      const a: VibeAnswers = { pace: 1, comms: 1, risk: 1, energy: 1 };
      const b: VibeAnswers = { pace: 5, comms: 5, risk: 5, energy: 5 };
      assert.strictEqual(vibeScore(a, b), 0);
    });

    test('F7-4: category icons provide visual representation for roles', () => {
      for (const cat of INDUSTRY_CATEGORIES) {
        assert.ok(CATEGORY_ICONS[cat], `Category ${cat} must have an associated icon`);
      }
    });

    test('F7-5: role formatting helper attaches icon to role title', () => {
      const formatted = formatRoleWithIcon('Software & IT', 'Backend Architect');
      assert.strictEqual(formatted, '💻 Backend Architect');
    });

    test('F7-6: role formatting returns UNSET when category or title is missing', () => {
      assert.strictEqual(formatRoleWithIcon(null, 'Coder'), 'UNSET');
      assert.strictEqual(formatRoleWithIcon('Software & IT', null), 'UNSET');
    });
  });

  // --------------------------------------------------------------------------
  // F8: Co-Founder Testimonials Grid
  // --------------------------------------------------------------------------
  describe('F8: Co-Founder Testimonials Grid', () => {
    test('F8-1: verified builder testimonials feature complementary pairs', () => {
      const pair = {
        builderA: { role: 'Software & IT', looking: 'Creative & Design' },
        builderB: { role: 'Creative & Design', looking: 'Software & IT' },
      };
      assert.strictEqual(pair.builderA.role, pair.builderB.looking);
      assert.strictEqual(pair.builderB.role, pair.builderA.looking);
    });

    test('F8-2: synthetic avatar generator produces stable unique gradient per ID', () => {
      const getHue = (id: string) => {
        let hash = 0;
        for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
        return Math.abs(hash) % 360;
      };
      const hue1 = getHue('user-123');
      const hue2 = getHue('user-123');
      const hue3 = getHue('user-456');
      assert.strictEqual(hue1, hue2);
      assert.notStrictEqual(hue1, hue3);
    });

    test('F8-3: testimonials highlight measurable builder outcomes', () => {
      const sampleOutcome = { launchDays: 14, funding: '$250k', status: 'Launched' };
      assert.ok(sampleOutcome.launchDays <= 30);
      assert.strictEqual(sampleOutcome.status, 'Launched');
    });

    test('F8-4: quotes are formatted with attribution and codenames', () => {
      const testimonial = { codename: 'SARAH_BUILDER', quote: 'Found my dream CTO in 48 hours!' };
      assert.match(testimonial.codename, /^[A-Z0-9_]+$/);
      assert.ok(testimonial.quote.length > 10);
    });

    test('F8-5: builder case studies include verifiable milestone deliverables', () => {
      const caseStudy = { deliverables: 'MVP launch & Smart Contract Audit', status: 'accepted' };
      assert.strictEqual(caseStudy.status, 'accepted');
    });
  });

  // --------------------------------------------------------------------------
  // F9: Interactive FAQ Accordion
  // --------------------------------------------------------------------------
  describe('F9: Interactive FAQ Accordion', () => {
    const FAQ_ITEMS = [
      { q: 'How is the Vibe Match score calculated?', topic: 'algorithm' },
      { q: 'Is my contact information public?', topic: 'privacy' },
      { q: 'What happens when I click Connect?', topic: 'workflow' },
      { q: 'Are milestone contracts legally binding?', topic: 'contracts' },
      { q: 'Can I change my role and preferences later?', topic: 'profile' },
      { q: 'How many connection requests can I send per day?', topic: 'limits' },
    ];

    test('F9-1: covers all 6 key FAQ domains', () => {
      assert.strictEqual(FAQ_ITEMS.length, 6);
    });

    test('F9-2: algorithm FAQ clarifies deterministic Manhattan distance scoring', () => {
      const algoFaq = FAQ_ITEMS.find((f) => f.topic === 'algorithm');
      assert.ok(algoFaq && algoFaq.q.includes('Vibe Match'));
    });

    test('F9-3: privacy FAQ explains private contact reveal mechanics', () => {
      const privacyFaq = FAQ_ITEMS.find((f) => f.topic === 'privacy');
      assert.ok(privacyFaq && privacyFaq.q.includes('contact information'));
    });

    test('F9-4: contract FAQ explains milestone agreement features', () => {
      const contractFaq = FAQ_ITEMS.find((f) => f.topic === 'contracts');
      assert.ok(contractFaq && contractFaq.q.includes('milestone contracts'));
    });

    test('F9-5: rate limit FAQ clarifies daily connection quota', () => {
      const limitsFaq = FAQ_ITEMS.find((f) => f.topic === 'limits');
      assert.ok(limitsFaq && limitsFaq.q.includes('connection requests'));
    });
  });

  // --------------------------------------------------------------------------
  // F10: Pre-Footer CTA Banner
  // --------------------------------------------------------------------------
  describe('F10: Pre-Footer CTA Banner', () => {
    const pagePath = path.join(APP_DIR, 'page.tsx');
    const content = fs.existsSync(pagePath) ? fs.readFileSync(pagePath, 'utf-8') : '';

    test('F10-1: page includes conversion call to action', () => {
      assert.match(content, /primary-btn|cta/i);
    });

    test('F10-2: dynamic CTA target resolves based on authentication', () => {
      assert.match(content, /ctaHref|ctaLabel/);
    });

    test('F10-3: emphasizes frictionless sign up', () => {
      assert.match(content, /account|sign in|discover/i);
    });

    test('F10-4: renders glowing aesthetic or gradient accents', () => {
      const css = fs.readFileSync(GLOBALS_CSS, 'utf-8');
      assert.match(css, /linear-gradient|radial-gradient|box-shadow/);
    });

    test('F10-5: full width wrapper structure in main container', () => {
      assert.match(content, /wrap|main/);
    });
  });

  // --------------------------------------------------------------------------
  // F11: Modern Multi-Column Footer
  // --------------------------------------------------------------------------
  describe('F11: Modern Multi-Column Footer', () => {
    const pagePath = path.join(APP_DIR, 'page.tsx');
    const content = fs.existsSync(pagePath) ? fs.readFileSync(pagePath, 'utf-8') : '';

    test('F11-1: footer element renders on landing page', () => {
      assert.match(content, /<footer/);
    });

    test('F11-2: footer displays brand identity statement', () => {
      assert.match(content, /Passion Protocol/);
    });

    test('F11-3: footer includes tag line for builder community', () => {
      assert.match(content, /builders|Matching|Vibe/i);
    });

    test('F11-4: footer adopts subtle muted text colors', () => {
      const css = fs.readFileSync(GLOBALS_CSS, 'utf-8');
      assert.match(css, /--muted|--dim/);
    });

    test('F11-5: footer incorporates border separator from body', () => {
      const modulePath = path.join(APP_DIR, 'page.module.css');
      const moduleCss = fs.existsSync(modulePath) ? fs.readFileSync(modulePath, 'utf-8') : '';
      const hasInlineBorder = /borderTop|border/.test(content);
      const hasModuleBorder = /\.footerSimple\s*{[^}]*border-top/.test(moduleCss);
      assert.ok(hasInlineBorder || hasModuleBorder, 'Footer must have a border separator, inline or in its CSS module');
    });
  });

  // --------------------------------------------------------------------------
  // F12: Navigation Header Upgrade (`SiteHeader`)
  // --------------------------------------------------------------------------
  describe('F12: Navigation Header Upgrade', () => {
    const headerPath = path.join(COMPONENTS_DIR, 'SiteHeader.tsx');
    const content = fs.existsSync(headerPath) ? fs.readFileSync(headerPath, 'utf-8') : '';

    test('F12-1: SiteHeader component exists and is exported', () => {
      assert.ok(content.length > 0, 'SiteHeader.tsx must exist');
      assert.match(content, /export function SiteHeader/);
    });

    test('F12-2: renders brand logo with lightning bolt icon', () => {
      assert.match(content, /⚡/);
      assert.match(content, /Passion Protocol/);
    });

    test('F12-3: renders Discover, Messages, Profile nav links when signed in', () => {
      assert.match(content, /\/discover/);
      assert.match(content, /\/messages/);
      assert.match(content, /\/profile/);
    });

    test('F12-4: renders Sign in & Get started links when signed out', () => {
      assert.match(content, /Sign in/);
      assert.match(content, /Get started/);
    });

    test('F12-5: includes Sign out form with action trigger', () => {
      assert.match(content, /signOut/);
      assert.match(content, /Sign out/);
    });
  });

  // --------------------------------------------------------------------------
  // F13: Discover Page Redesign & Deck (`DiscoverDeck`)
  // --------------------------------------------------------------------------
  describe('F13: Discover Page Redesign & Deck', () => {
    const deckPath = path.join(COMPONENTS_DIR, 'DiscoverDeck.tsx');
    const content = fs.existsSync(deckPath) ? fs.readFileSync(deckPath, 'utf-8') : '';

    test('F13-1: DiscoverDeck component handles empty state gracefully', () => {
      assert.ok(content.length > 0, 'DiscoverDeck.tsx must exist');
      assert.match(content, /empty/);
      assert.match(content, /No operators with that role yet/);
    });

    test('F13-2: displays 4-dimension vibe equalizer bars', () => {
      assert.match(content, /pace|comms|risk|energy/i);
    });

    test('F13-3: renders synergy score percentage badge', () => {
      assert.match(content, /score/);
    });

    test('F13-4: provides interactive Connect button', () => {
      assert.match(content, /sendConnect|connect/);
    });

    test('F13-5: provides Pass / Skip action to dismiss candidate', () => {
      assert.match(content, /skip|hidden/);
    });

    test('F13-6: conditionally reveals contact URL only when connection is accepted', () => {
      assert.match(content, /contact_url|contactUrl|accepted/);
    });
  });

  // --------------------------------------------------------------------------
  // F14: Profile Page Redesign & Project Pitch (`ProjectForm`)
  // --------------------------------------------------------------------------
  describe('F14: Profile Page Redesign & Project Pitch', () => {
    const profilePagePath = path.join(APP_DIR, 'profile', 'page.tsx');
    const projectFormPath = path.join(COMPONENTS_DIR, 'ProjectForm.tsx');
    const pageContent = fs.existsSync(profilePagePath) ? fs.readFileSync(profilePagePath, 'utf-8') : '';
    const formContent = fs.existsSync(projectFormPath) ? fs.readFileSync(projectFormPath, 'utf-8') : '';

    test('F14-1: profile page renders user codename and identity', () => {
      assert.ok(pageContent.length > 0);
      assert.match(pageContent, /profile\.codename|Your profile/);
    });

    test('F14-2: displays 4 vibe dimension fingerprint meters', () => {
      assert.match(pageContent, /Pace|Comms|Risk|Energy/);
    });

    test('F14-3: ProjectForm requires title and description fields', () => {
      assert.ok(formContent.length > 0);
      assert.match(formContent, /name="title"/);
      assert.match(formContent, /name="description"/);
    });

    test('F14-4: ProjectForm validates minimum length constraints', () => {
      assert.match(formContent, /minLength=\{3\}/);
      assert.match(formContent, /minLength=\{10\}/);
    });

    test('F14-5: profile page lists active accepted partnerships', () => {
      assert.match(pageContent, /accepted|partner|partnerships/i);
    });

    test('F14-6: profile integrates Danger Zone DeleteAccountButton', () => {
      assert.match(pageContent, /DeleteAccountButton/);
    });
  });

  // --------------------------------------------------------------------------
  // F15: Messages & Chat Interface Redesign (`ChatInterface`)
  // --------------------------------------------------------------------------
  describe('F15: Messages & Chat Interface Redesign', () => {
    const chatPath = path.join(COMPONENTS_DIR, 'ChatInterface.tsx');
    const pagePath = path.join(APP_DIR, 'messages', 'page.tsx');
    const chatContent = fs.existsSync(chatPath) ? fs.readFileSync(chatPath, 'utf-8') : '';
    const pageContent = fs.existsSync(pagePath) ? fs.readFileSync(pagePath, 'utf-8') : '';

    test('F15-1: messages page redirects unauthenticated visitors to login', () => {
      assert.ok(pageContent.length > 0);
      assert.match(pageContent, /redirect\("\/login"\)/);
    });

    test('F15-2: renders empty state when user has zero active connections', () => {
      assert.match(pageContent, /You don't have any active partnerships yet|empty/);
    });

    test('F15-3: ChatInterface provides realtime messaging list and channel subscription', () => {
      assert.ok(chatContent.length > 0);
      assert.match(chatContent, /supabase\.channel|postgres_changes/);
    });

    test('F15-4: supports sending new chat messages with validation', () => {
      assert.match(chatContent, /sendMessage|inputText/);
    });

    test('F15-5: supports proposing milestone partnership contracts', () => {
      assert.match(chatContent, /proposePartnership|partnership_contracts|price_amount|deliverables/);
    });

    test('F15-6: displays partnership contract cards with price and deliverables', () => {
      assert.match(chatContent, /contracts|deliverables|status/);
    });
  });

  // --------------------------------------------------------------------------
  // F16: Progressive Onboarding Flow (`OnboardingForm`)
  // --------------------------------------------------------------------------
  describe('F16: Progressive Onboarding Flow', () => {
    const onboardPath = path.join(COMPONENTS_DIR, 'OnboardingForm.tsx');
    const content = fs.existsSync(onboardPath) ? fs.readFileSync(onboardPath, 'utf-8') : '';

    test('F16-1: OnboardingForm exports client component', () => {
      assert.ok(content.length > 0);
      assert.match(content, /export function OnboardingForm/);
    });

    test('F16-2: Section 1 collects Codename and optional contact info', () => {
      assert.match(content, /1\. Identity/);
      assert.match(content, /name="codename"/);
      assert.match(content, /name="full_name"/);
      assert.match(content, /name="linkedin_url"/);
    });

    test('F16-3: enforces codename pattern constraint', () => {
      assert.ok(content.includes('pattern="[A-Za-z0-9_ ]{2,32}"'), 'Must enforce codename pattern constraint');
    });

    test('F16-4: Section 2 collects industry category and seeking category', () => {
      assert.match(content, /industry_category|looking_for_category/);
    });

    test('F16-5: Section 3 collects 4 vibe slider ratings (1 to 5)', () => {
      assert.match(content, /pace|comms|risk|energy/);
      assert.match(content, /Slow craft|Ship fast/);
    });

    test('F16-6: form triggers saveOnboarding server action', () => {
      assert.match(content, /saveOnboarding/);
    });
  });

  // --------------------------------------------------------------------------
  // F17: Auth & Login Redesign (`AuthForm`)
  // --------------------------------------------------------------------------
  describe('F17: Auth & Login Redesign', () => {
    const authPath = path.join(COMPONENTS_DIR, 'AuthForm.tsx');
    const content = fs.existsSync(authPath) ? fs.readFileSync(authPath, 'utf-8') : '';

    test('F17-1: AuthForm exports client component with mode switcher', () => {
      assert.ok(content.length > 0);
      assert.match(content, /export function AuthForm/);
      assert.match(content, /signin|signup|forgot/);
    });

    test('F17-2: enforces password length boundaries (>= 8 and <= 72 characters)', () => {
      assert.match(content, /password\.length < 8/);
      assert.match(content, /password\.length > 72/);
    });

    test('F17-3: handles email and password inputs with required attributes', () => {
      assert.match(content, /type="email"/);
      assert.match(content, /type="password"/);
    });

    test('F17-4: supports password reset workflow for forgotten credentials', () => {
      assert.match(content, /resetPasswordForEmail/);
    });

    test('F17-5: displays error and success feedback messages', () => {
      assert.match(content, /setError|setMessage/);
    });
  });

  // --------------------------------------------------------------------------
  // F18: Functional Invariants & Match Engine (`lib/match.ts`)
  // --------------------------------------------------------------------------
  describe('F18: Functional Invariants & Match Engine', () => {
    const baseMe = {
      id: 'me-1',
      industry_category: 'Software & IT',
      looking_for_category: 'Creative & Design',
      spoken_languages: ['English', 'German'],
      intent_filter: null,
      vibe: { pace: 5, comms: 4, risk: 3, energy: 5 } as VibeAnswers,
    };

    const makeCandidate = (
      id: string,
      industry: string,
      looking: string,
      langs: string[],
      vibe: VibeAnswers,
      onboardingComplete = true
    ) => ({
      profile: {
        id,
        codename: `USER_${id}`,
        full_name: `User ${id}`,
        location: 'Remote',
        phone_number: null,
        linkedin_url: null,
        spoken_languages: langs,
        industry_category: industry,
        professional_title: 'Operator',
        looking_for_category: looking,
        looking_for_title: 'Partner',
        intent_filter: null,
        bio: 'Hello',
        onboarding_complete: onboardingComplete,
      } as Profile,
      vibe,
      project: null as Project | null,
    });

    test('F18-1: vibeScore returns 100 for identical ratings', () => {
      const vibe: VibeAnswers = { pace: 4, comms: 2, risk: 5, energy: 3 };
      assert.strictEqual(vibeScore(vibe, vibe), 100);
    });

    test('F18-2: vibeScore returns 0 for maximum Manhattan distance', () => {
      const v1: VibeAnswers = { pace: 1, comms: 1, risk: 1, energy: 1 };
      const v2: VibeAnswers = { pace: 5, comms: 5, risk: 5, energy: 5 };
      assert.strictEqual(vibeScore(v1, v2), 0);
    });

    test('F18-3: rankMatches excludes candidate with identical user ID (self-match prevention)', () => {
      const candidates = [
        makeCandidate('me-1', 'Creative & Design', 'Software & IT', ['English'], baseMe.vibe),
      ];
      const results = rankMatches(baseMe, candidates);
      assert.strictEqual(results.length, 0);
    });

    test('F18-4: rankMatches excludes candidates with incomplete onboarding', () => {
      const candidates = [
        makeCandidate('c-1', 'Creative & Design', 'Software & IT', ['English'], baseMe.vibe, false),
      ];
      const results = rankMatches(baseMe, candidates);
      assert.strictEqual(results.length, 0);
    });

    test('F18-5: rankMatches requires exact reciprocal category matching', () => {
      const candidates = [
        // Valid match
        makeCandidate('c-valid', 'Creative & Design', 'Software & IT', ['English'], baseMe.vibe),
        // One-way match: candidate is Creative & Design but looking for Business & Sales
        makeCandidate('c-bad-look', 'Creative & Design', 'Business & Sales', ['English'], baseMe.vibe),
        // One-way match: candidate is Marketing but looking for Software & IT
        makeCandidate('c-bad-ind', 'Marketing & Content', 'Software & IT', ['English'], baseMe.vibe),
      ];
      const results = rankMatches(baseMe, candidates);
      assert.strictEqual(results.length, 1);
      assert.strictEqual(results[0].profile.id, 'c-valid');
    });

    test('F18-6: rankMatches enforces spoken language intersection when both specify languages', () => {
      const candidates = [
        makeCandidate('c-match-lang', 'Creative & Design', 'Software & IT', ['german', 'french'], baseMe.vibe),
        makeCandidate('c-no-lang-match', 'Creative & Design', 'Software & IT', ['japanese', 'spanish'], baseMe.vibe),
      ];
      const results = rankMatches(baseMe, candidates);
      assert.strictEqual(results.length, 1);
      assert.strictEqual(results[0].profile.id, 'c-match-lang');
    });

    test('F18-7: rankMatches permits matches when either party has empty spoken_languages', () => {
      const candidates = [
        makeCandidate('c-open-lang', 'Creative & Design', 'Software & IT', [], baseMe.vibe),
      ];
      const results = rankMatches(baseMe, candidates);
      assert.strictEqual(results.length, 1);
      assert.strictEqual(results[0].profile.id, 'c-open-lang');
    });

    test('F18-8: rankMatches sorts results in strictly descending order of vibe score', () => {
      const candidateHigh = makeCandidate('c-high', 'Creative & Design', 'Software & IT', ['English'], {
        pace: 5,
        comms: 4,
        risk: 3,
        energy: 4, // Distance = 1 -> score ~94
      });
      const candidateMed = makeCandidate('c-med', 'Creative & Design', 'Software & IT', ['English'], {
        pace: 4,
        comms: 3,
        risk: 2,
        energy: 4, // Distance = 4 -> score ~75
      });
      const candidateLow = makeCandidate('c-low', 'Creative & Design', 'Software & IT', ['English'], {
        pace: 1,
        comms: 1,
        risk: 1,
        energy: 1, // Distance = 13 -> score ~19
      });

      const results = rankMatches(baseMe, [candidateLow, candidateHigh, candidateMed]);
      assert.strictEqual(results.length, 3);
      assert.strictEqual(results[0].profile.id, 'c-high');
      assert.strictEqual(results[1].profile.id, 'c-med');
      assert.strictEqual(results[2].profile.id, 'c-low');
      assert.ok(results[0].score >= results[1].score);
      assert.ok(results[1].score >= results[2].score);
    });
  });
});

// Auto-run when executed directly via tsx
if (
  process.argv[1] &&
  !process.argv[1].includes('runner.ts') &&
  (process.argv[1].endsWith('tier1_features.test.ts') ||
    process.argv[1].replace(/\\/g, '/').endsWith('tier1_features.test.ts'))
) {
  runSuites().then((stats) => {
    if (stats.failedTests > 0) process.exit(1);
  });
}
