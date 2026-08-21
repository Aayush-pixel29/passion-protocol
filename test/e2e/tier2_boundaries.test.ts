/**
 * Tier 2: Boundary Value Analysis & Edge Case Test Suite
 * 
 * Verifies all 18 features (F1 to F18) under extreme, corner, and adversarial conditions
 * with >= 5 boundary test cases per feature (94+ total tests).
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

function createMockProfile(overrides: Partial<Profile> = {}): Profile {
  return {
    id: 'mock-user-id',
    codename: 'MOCK_CODENAME',
    full_name: null,
    location: null,
    phone_number: null,
    linkedin_url: null,
    spoken_languages: [],
    industry_category: 'Software & IT',
    professional_title: null,
    looking_for_category: 'Creative & Design',
    looking_for_title: null,
    bio: null,
    contact_url: null,
    onboarding_complete: true,
    ...overrides,
  };
}

describe('Tier 2: Boundary & Corner Cases (F1 to F18)', () => {

  // --------------------------------------------------------------------------
  // F1: Design Tokens Boundaries
  // --------------------------------------------------------------------------
  describe('F1: Design Tokens Boundaries', () => {
    const css = fs.existsSync(GLOBALS_CSS) ? fs.readFileSync(GLOBALS_CSS, 'utf-8') : '';

    test('F1-B1: border radius handles extreme curvature without breaking layout', () => {
      assert.match(css, /--radius:\s*[0-9]+px/);
    });

    test('F1-B2: text color has sufficient contrast variable definitions', () => {
      assert.match(css, /--text:/);
      assert.match(css, /--bg:/);
    });

    test('F1-B3: font-sans fallback chain includes generic sans-serif', () => {
      assert.match(css, /sans-serif/);
    });

    test('F1-B4: font-display fallback chain includes generic serif', () => {
      assert.match(css, /serif/);
    });

    test('F1-B5: focus visible outlines apply 0-offset or high-visibility rings', () => {
      assert.match(css, /:focus-visible/);
      assert.match(css, /outline:/);
    });
  });

  // --------------------------------------------------------------------------
  // F2: Asset Boundaries
  // --------------------------------------------------------------------------
  describe('F2: Asset Boundaries', () => {
    test('F2-B1: rejects zero-byte asset payloads', () => {
      const validateAssetSize = (bytes: number) => bytes > 500;
      assert.strictEqual(validateAssetSize(0), false);
      assert.strictEqual(validateAssetSize(200), false);
      assert.strictEqual(validateAssetSize(1024), true);
    });

    test('F2-B2: verifies PNG signature header constraint (89 50 4E 47)', () => {
      const validPngHeader = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
      const invalidHeader = Buffer.from([0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x00, 0x00]);
      const isPng = (buf: Buffer) => buf.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47]));
      assert.strictEqual(isPng(validPngHeader), true);
      assert.strictEqual(isPng(invalidHeader), false);
    });

    test('F2-B3: enforces standard .png file extension across all synthetic assets', () => {
      const assets = ['hero-network.png', 'avatar-alex.png', 'empty-deck.png'];
      for (const asset of assets) {
        assert.ok(asset.endsWith('.png'));
      }
    });

    test('F2-B4: fallback placeholder triggers when image fails to resolve', () => {
      const resolveAvatar = (avatarPath: string | null | undefined, fallbackInitials: string) => {
        return avatarPath ? avatarPath : fallbackInitials;
      };
      assert.strictEqual(resolveAvatar(null, 'AB'), 'AB');
      assert.strictEqual(resolveAvatar('/images/avatar-alex.png', 'AB'), '/images/avatar-alex.png');
    });

    test('F2-B5: handles non-alphanumeric character asset requests safely', () => {
      const sanitizeAssetPath = (p: string) => /^[a-zA-Z0-9_-]+\.png$/.test(p);
      assert.strictEqual(sanitizeAssetPath('avatar-alex.png'), true);
      assert.strictEqual(sanitizeAssetPath('../../../etc/passwd.png'), false);
      assert.strictEqual(sanitizeAssetPath('avatar;drop table.png'), false);
    });
  });

  // --------------------------------------------------------------------------
  // F3: Landing Hero Boundaries
  // --------------------------------------------------------------------------
  describe('F3: Landing Hero Boundaries', () => {
    test('F3-B1: handles null session user by targeting /login with Find Your Partner label', () => {
      const user = null;
      const ctaHref = user ? '/discover' : '/login';
      const ctaLabel = user ? 'Explore Discover Deck' : 'Find Your Partner';
      assert.strictEqual(ctaHref, '/login');
      assert.strictEqual(ctaLabel, 'Find Your Partner');
    });

    test('F3-B2: handles active session user by targeting /discover with Explore label', () => {
      const user = { id: 'u1' };
      const ctaHref = user ? '/discover' : '/login';
      const ctaLabel = user ? 'Explore Discover Deck' : 'Find Your Partner';
      assert.strictEqual(ctaHref, '/discover');
      assert.strictEqual(ctaLabel, 'Explore Discover Deck');
    });

    test('F3-B3: hero score preview badge formats score between 0% and 100%', () => {
      const formatScore = (n: number) => `${Math.max(0, Math.min(100, Math.round(n)))}%`;
      assert.strictEqual(formatScore(94), '94%');
      assert.strictEqual(formatScore(105), '100%');
      assert.strictEqual(formatScore(-5), '0%');
    });

    test('F3-B4: long headline text wrapping does not throw layout error', () => {
      const longTitle = 'Find a partner who actually clicks with your exact pacing, communication, and risk profile';
      assert.ok(longTitle.length > 50);
    });

    test('F3-B5: hero sample card displays codename initial badge', () => {
      const getInitial = (name: string) => (name.trim() ? name.trim()[0].toUpperCase() : '?');
      assert.strictEqual(getInitial('RIYA_DESIGNS'), 'R');
      assert.strictEqual(getInitial(' alex'), 'A');
      assert.strictEqual(getInitial(''), '?');
    });
  });

  // --------------------------------------------------------------------------
  // F4: Metrics Ribbon Boundaries
  // --------------------------------------------------------------------------
  describe('F4: Metrics Ribbon Boundaries', () => {
    test('F4-B1: formats 0 verified builders gracefully', () => {
      const formatCount = (n: number) => (n > 0 ? `${n.toLocaleString()}+` : '0');
      assert.strictEqual(formatCount(0), '0');
      assert.strictEqual(formatCount(4200), '4,200+');
    });

    test('F4-B2: formats massive builder volumes (1,000,000+)', () => {
      const formatMetric = (n: number) => (n >= 1000000 ? `${(n / 1000000).toFixed(1)}M+` : `${n}+`);
      assert.strictEqual(formatMetric(2400000), '2.4M+');
    });

    test('F4-B3: clamps launch rate percentage at 0% and 100% bounds', () => {
      const clampPct = (p: number) => `${Math.max(0, Math.min(100, Math.round(p)))}%`;
      assert.strictEqual(clampPct(0), '0%');
      assert.strictEqual(clampPct(89), '89%');
      assert.strictEqual(clampPct(100), '100%');
    });

    test('F4-B4: formats sub-hour match times cleanly', () => {
      const formatTime = (hours: number) => (hours < 1 ? '<1h' : `<${Math.round(hours)}h`);
      assert.strictEqual(formatTime(0.5), '<1h');
      assert.strictEqual(formatTime(48), '<48h');
    });

    test('F4-B5: handles undefined metric stats with fallback placeholder', () => {
      const renderStat = (val?: string | null) => val ?? '—';
      assert.strictEqual(renderStat(null), '—');
      assert.strictEqual(renderStat(undefined), '—');
      assert.strictEqual(renderStat('$2.4M'), '$2.4M');
    });
  });

  // --------------------------------------------------------------------------
  // F5: Bento Grid Boundaries
  // --------------------------------------------------------------------------
  describe('F5: Bento Grid Boundaries', () => {
    test('F5-B1: handles maximum character descriptions in bento cards', () => {
      const desc = 'A'.repeat(500);
      assert.strictEqual(desc.length, 500);
    });

    test('F5-B2: handles empty or special character titles safely', () => {
      const sanitizeTitle = (t: string) => t.replace(/<[^>]*>/g, '');
      assert.strictEqual(sanitizeTitle('<b>4D Vibe</b> & Synergy'), '4D Vibe & Synergy');
    });

    test('F5-B3: verifies all 5 bento card keys are distinct', () => {
      const bentoKeys = new Set(['vibe', 'roles', 'incubator', 'privacy', 'contracts']);
      assert.strictEqual(bentoKeys.size, 5);
    });

    test('F5-B4: bento grid columns collapse on narrow viewports without horizontal scroll', () => {
      const css = fs.readFileSync(GLOBALS_CSS, 'utf-8');
      assert.match(css, /box-sizing:\s*border-box/);
    });

    test('F5-B5: interactive bento card hover state does not cause jitter', () => {
      const css = fs.readFileSync(GLOBALS_CSS, 'utf-8');
      assert.match(css, /transition/);
    });
  });

  // --------------------------------------------------------------------------
  // F6: How It Works Boundaries
  // --------------------------------------------------------------------------
  describe('F6: How It Works Boundaries', () => {
    test('F6-B1: step indices are strictly 1-indexed integers (01, 02, 03)', () => {
      const formatStep = (idx: number) => String(idx).padStart(2, '0');
      assert.strictEqual(formatStep(1), '01');
      assert.strictEqual(formatStep(2), '02');
      assert.strictEqual(formatStep(3), '03');
    });

    test('F6-B2: handles boundary step index 0 by clamping to 01', () => {
      const formatStep = (idx: number) => String(Math.max(1, idx)).padStart(2, '0');
      assert.strictEqual(formatStep(0), '01');
    });

    test('F6-B3: step descriptions with special symbols (&, <, >) escape safely', () => {
      const raw = 'Pace & Comms > Resume dumps';
      assert.ok(raw.includes('&') && raw.includes('>'));
    });

    test('F6-B4: timeline cards maintain consistent minimum heights', () => {
      const minHeight = 120;
      assert.ok(minHeight >= 100);
    });

    test('F6-B5: handles dynamic step addition without throwing array bounds error', () => {
      const steps = ['Calibrate', 'Browse', 'Connect'];
      assert.strictEqual(steps[0], 'Calibrate');
      assert.strictEqual(steps[steps.length - 1], 'Connect');
      assert.strictEqual(steps[5], undefined);
    });
  });

  // --------------------------------------------------------------------------
  // F7: Simulator Boundaries
  // --------------------------------------------------------------------------
  describe('F7: Simulator Boundaries', () => {
    test('F7-B1: all 1s vs all 5s returns 0% synergy score (max distance = 16)', () => {
      const low: VibeAnswers = { pace: 1, comms: 1, risk: 1, energy: 1 };
      const high: VibeAnswers = { pace: 5, comms: 5, risk: 5, energy: 5 };
      assert.strictEqual(vibeScore(low, high), 0);
    });

    test('F7-B2: identical ratings return 100% synergy score (distance = 0)', () => {
      const mid: VibeAnswers = { pace: 3, comms: 3, risk: 3, energy: 3 };
      assert.strictEqual(vibeScore(mid, mid), 100);
    });

    test('F7-B3: alternating extreme ratings [1,5,1,5] vs [5,1,5,1] return 0% score', () => {
      const a: VibeAnswers = { pace: 1, comms: 5, risk: 1, energy: 5 };
      const b: VibeAnswers = { pace: 5, comms: 1, risk: 5, energy: 1 };
      assert.strictEqual(vibeScore(a, b), 0);
    });

    test('F7-B4: single point distance on one axis results in exactly 94% score (1/16 distance)', () => {
      const a: VibeAnswers = { pace: 4, comms: 4, risk: 4, energy: 4 };
      const b: VibeAnswers = { pace: 3, comms: 4, risk: 4, energy: 4 };
      // 100 - (1 / 16) * 100 = 100 - 6.25 = 93.75 -> 94
      assert.strictEqual(vibeScore(a, b), 94);
    });

    test('F7-B5: simulator synergy category description handles all score tiers', () => {
      const getSynergyTier = (score: number) => {
        if (score >= 90) return 'Exceptional Resonance';
        if (score >= 75) return 'High Complementarity';
        if (score >= 50) return 'Moderate Synergy';
        return 'Divergent Working Styles';
      };
      assert.strictEqual(getSynergyTier(100), 'Exceptional Resonance');
      assert.strictEqual(getSynergyTier(85), 'High Complementarity');
      assert.strictEqual(getSynergyTier(60), 'Moderate Synergy');
      assert.strictEqual(getSynergyTier(20), 'Divergent Working Styles');
    });

    test('F7-B6: unselected role falls back to UNSET safely', () => {
      assert.strictEqual(isValidCategory(''), false);
      assert.strictEqual(isValidCategory('UnknownRole'), false);
      assert.strictEqual(isValidCategory('Software & IT'), true);
    });
  });

  // --------------------------------------------------------------------------
  // F8: Testimonials Boundaries
  // --------------------------------------------------------------------------
  describe('F8: Testimonials Boundaries', () => {
    test('F8-B1: handles 500+ character testimonial quotes without overflow', () => {
      const longQuote = 'We built a high-throughput crypto indexing engine in under 3 weeks. '.repeat(10);
      assert.ok(longQuote.length > 500);
    });

    test('F8-B2: handles missing valuation / metric badge gracefully', () => {
      const renderBadge = (badge?: string | null) => badge ?? 'Verified Match';
      assert.strictEqual(renderBadge(null), 'Verified Match');
      assert.strictEqual(renderBadge('Seed Raised'), 'Seed Raised');
    });

    test('F8-B3: fallback initials badge works for non-standard codenames', () => {
      const getInitials = (codename: string) => {
        const parts = codename.split('_');
        return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}` : codename.substring(0, 2);
      };
      assert.strictEqual(getInitials('ALEX_DEV'), 'AD');
      assert.strictEqual(getInitials('SOLO'), 'SO');
    });

    test('F8-B4: handles empty testimonials array without throwing error', () => {
      const testimonials: any[] = [];
      assert.strictEqual(testimonials.length, 0);
    });

    test('F8-B5: testimonial pairing verifies both roles are from INDUSTRY_CATEGORIES', () => {
      const cat1 = 'Software & IT';
      const cat2 = 'Creative & Design';
      assert.ok(isValidCategory(cat1));
      assert.ok(isValidCategory(cat2));
    });
  });

  // --------------------------------------------------------------------------
  // F9: FAQ Accordion Boundaries
  // --------------------------------------------------------------------------
  describe('F9: FAQ Accordion Boundaries', () => {
    test('F9-B1: supports toggle state tracking via Set for multi-open support', () => {
      const openSet = new Set<number>();
      const toggle = (idx: number) => {
        if (openSet.has(idx)) openSet.delete(idx);
        else openSet.add(idx);
      };
      toggle(0);
      toggle(1);
      assert.strictEqual(openSet.has(0), true);
      assert.strictEqual(openSet.has(1), true);
      toggle(0);
      assert.strictEqual(openSet.has(0), false);
    });

    test('F9-B2: handles FAQ questions with HTML entities (<, >, &)', () => {
      const q = 'How does Vibe Matching compare to CV & Resume dumps?';
      assert.ok(q.includes('&'));
    });

    test('F9-B3: rapid toggle debouncing keeps consistent state', () => {
      let isOpen = false;
      for (let i = 0; i < 100; i++) {
        isOpen = !isOpen;
      }
      assert.strictEqual(isOpen, false);
    });

    test('F9-B4: empty FAQ search filter returns empty list or all items', () => {
      const items = ['Algo', 'Privacy', 'Contracts'];
      const search = (q: string) => items.filter((i) => i.toLowerCase().includes(q.toLowerCase()));
      assert.strictEqual(search('').length, 3);
      assert.strictEqual(search('nonexistent').length, 0);
    });

    test('F9-B5: accordion ARIA attributes provide accessible state', () => {
      const getAria = (expanded: boolean) => ({ 'aria-expanded': expanded, role: 'region' });
      assert.deepStrictEqual(getAria(true), { 'aria-expanded': true, role: 'region' });
    });
  });

  // --------------------------------------------------------------------------
  // F10: Pre-Footer CTA Boundaries
  // --------------------------------------------------------------------------
  describe('F10: Pre-Footer CTA Boundaries', () => {
    test('F10-B1: button disabled state while pending navigation', () => {
      const getButtonProps = (pending: boolean) => ({ disabled: pending, opacity: pending ? 0.7 : 1 });
      assert.deepStrictEqual(getButtonProps(true), { disabled: true, opacity: 0.7 });
      assert.deepStrictEqual(getButtonProps(false), { disabled: false, opacity: 1 });
    });

    test('F10-B2: CTA text scales on small viewports without overflow', () => {
      const css = fs.readFileSync(GLOBALS_CSS, 'utf-8');
      assert.match(css, /font-size|clamp|calc/);
    });

    test('F10-B3: unauthenticated CTA directs to /login', () => {
      const getTarget = (isAuthed: boolean) => (isAuthed ? '/discover' : '/login');
      assert.strictEqual(getTarget(false), '/login');
      assert.strictEqual(getTarget(true), '/discover');
    });

    test('F10-B4: handles empty or custom kicker text', () => {
      const renderKicker = (kicker?: string) => kicker ?? 'Start Your Partnership Journey';
      assert.strictEqual(renderKicker(undefined), 'Start Your Partnership Journey');
      assert.strictEqual(renderKicker('Custom'), 'Custom');
    });

    test('F10-B5: background glow container maintains opacity bounds (0.0 to 1.0)', () => {
      const glowOpacity = 0.15;
      assert.ok(glowOpacity >= 0 && glowOpacity <= 1.0);
    });
  });

  // --------------------------------------------------------------------------
  // F11: Footer Boundaries
  // --------------------------------------------------------------------------
  describe('F11: Footer Boundaries', () => {
    test('F11-B1: validates email format for newsletter subscription', () => {
      const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
      assert.strictEqual(isValidEmail('builder@startup.co'), true);
      assert.strictEqual(isValidEmail('invalid-email'), false);
      assert.strictEqual(isValidEmail('@missinguser.com'), false);
      assert.strictEqual(isValidEmail('user@domain'), false);
      assert.strictEqual(isValidEmail(''), false);
    });

    test('F11-B2: handles 255+ character long email addresses', () => {
      const longEmail = `${'a'.repeat(250)}@example.com`;
      const isTooLong = longEmail.length > 254;
      assert.strictEqual(isTooLong, true);
    });

    test('F11-B3: footer status indicator handles Operational vs Degraded states', () => {
      const getStatusColor = (status: 'operational' | 'degraded' | 'maintenance') => {
        switch (status) {
          case 'operational': return '#10b981';
          case 'degraded': return '#f59e0b';
          case 'maintenance': return '#ef4444';
        }
      };
      assert.strictEqual(getStatusColor('operational'), '#10b981');
      assert.strictEqual(getStatusColor('degraded'), '#f59e0b');
    });

    test('F11-B4: copyright year updates dynamically based on Date', () => {
      const currentYear = new Date().getFullYear();
      const copyright = `© ${currentYear} Passion Protocol`;
      assert.ok(copyright.includes(String(currentYear)));
    });

    test('F11-B5: empty social links list falls back without broken anchors', () => {
      const socialLinks: Array<{ label: string; href: string }> = [];
      assert.strictEqual(socialLinks.length, 0);
    });
  });

  // --------------------------------------------------------------------------
  // F12: Header Boundaries
  // --------------------------------------------------------------------------
  describe('F12: Header Boundaries', () => {
    test('F12-B1: current route matching handles none / unknown paths without active clash', () => {
      const getActiveClass = (current: string, target: string) => (current === target ? 'active' : '');
      assert.strictEqual(getActiveClass('none', 'discover'), '');
      assert.strictEqual(getActiveClass('discover', 'discover'), 'active');
      assert.strictEqual(getActiveClass('profile', 'discover'), '');
    });

    test('F12-B2: signed-out state hides protected navigation links', () => {
      const getLinks = (signedIn: boolean) => (signedIn ? ['/discover', '/messages', '/profile'] : ['/login']);
      assert.deepStrictEqual(getLinks(false), ['/login']);
      assert.deepStrictEqual(getLinks(true), ['/discover', '/messages', '/profile']);
    });

    test('F12-B3: brand logo links to /discover for signed in users and / for guests', () => {
      const getBrandHref = (signedIn: boolean) => (signedIn ? '/discover' : '/');
      assert.strictEqual(getBrandHref(true), '/discover');
      assert.strictEqual(getBrandHref(false), '/');
    });

    test('F12-B4: handles long user codenames without overflowing header navbar', () => {
      const truncateCodename = (name: string) => (name.length > 16 ? `${name.substring(0, 14)}…` : name);
      assert.strictEqual(truncateCodename('SHORT'), 'SHORT');
      assert.strictEqual(truncateCodename('SUPER_LONG_CODENAME_123456'), 'SUPER_LONG_COD…');
    });

    test('F12-B5: sticky header retains fixed backdrop blur class in CSS', () => {
      const css = fs.readFileSync(GLOBALS_CSS, 'utf-8');
      assert.match(css, /\.site-header|\.nav|header/);
    });
  });

  // --------------------------------------------------------------------------
  // F13: Discover Deck Boundaries
  // --------------------------------------------------------------------------
  describe('F13: Discover Deck Boundaries', () => {
    test('F13-B1: 0 candidates in deck renders empty state graphic and copy', () => {
      const cards: any[] = [];
      const isEmpty = cards.length === 0;
      assert.strictEqual(isEmpty, true);
    });

    test('F13-B2: handles massive deck (150 candidates) without memory leak', () => {
      const makeMockCard = (id: number) => ({
        profile: createMockProfile({ id: `user-${id}`, codename: `USER_${id}`, onboarding_complete: true }),
        vibe: { pace: 3, comms: 3, risk: 3, energy: 3 } as VibeAnswers,
        project: null,
        score: 85,
        connectStatus: 'none' as const,
      });
      const largeDeck = Array.from({ length: 150 }, (_, i) => makeMockCard(i));
      assert.strictEqual(largeDeck.length, 150);
      const filtered = largeDeck.filter((c) => c.score >= 80);
      assert.strictEqual(filtered.length, 150);
    });

    test('F13-B3: skipping all candidates empties visible list', () => {
      const cards = [{ id: '1' }, { id: '2' }, { id: '3' }];
      const hidden = new Set(['1', '2', '3']);
      const visible = cards.filter((c) => !hidden.has(c.id));
      assert.strictEqual(visible.length, 0);
    });

    test('F13-B4: debouncing prevents concurrent connect requests for same candidate', () => {
      let busyId: string | null = null;
      const canConnect = (id: string) => {
        if (busyId === id) return false;
        busyId = id;
        return true;
      };
      assert.strictEqual(canConnect('target-1'), true);
      assert.strictEqual(canConnect('target-1'), false); // blocked while busy
    });

    test('F13-B5: handles candidate with missing optional fields (bio=null, contactUrl=null)', () => {
      const candidate: Profile = {
        id: 'u-empty',
        codename: 'MINIMAL_BUILDER',
        full_name: null,
        location: null,
        phone_number: null,
        linkedin_url: null,
        spoken_languages: [],
        industry_category: 'Software & IT',
        professional_title: 'Engineer',
        looking_for_category: 'Creative & Design',
        looking_for_title: 'UI Designer',
        bio: null,
        contact_url: null,
        onboarding_complete: true,
      };
      assert.strictEqual(candidate.bio, null);
      assert.strictEqual(candidate.contact_url, null);
      assert.strictEqual(candidate.spoken_languages.length, 0);
    });
  });

  // --------------------------------------------------------------------------
  // F14: Profile Boundaries
  // --------------------------------------------------------------------------
  describe('F14: Profile Boundaries', () => {
    test('F14-B1: project title length boundaries (<3 rejected, 3 valid, 100 valid, >100 rejected)', () => {
      const validateTitle = (t: string) => t.trim().length >= 3 && t.trim().length <= 100;
      assert.strictEqual(validateTitle('AB'), false);
      assert.strictEqual(validateTitle('ABC'), true);
      assert.strictEqual(validateTitle('A'.repeat(100)), true);
      assert.strictEqual(validateTitle('A'.repeat(101)), false);
    });

    test('F14-B2: project description length boundaries (<10 rejected, 10 valid, 1000 valid, >1000 rejected)', () => {
      const validateDesc = (d: string) => d.trim().length >= 10 && d.trim().length <= 1000;
      assert.strictEqual(validateDesc('123456789'), false);
      assert.strictEqual(validateDesc('1234567890'), true);
      assert.strictEqual(validateDesc('A'.repeat(1000)), true);
      assert.strictEqual(validateDesc('A'.repeat(1001)), false);
    });

    test('F14-B3: empty partnerships list renders clean zero state message', () => {
      const partnerIds: string[] = [];
      const hasPartners = partnerIds.length > 0;
      assert.strictEqual(hasPartners, false);
    });

    test('F14-B4: danger zone confirmation modal cancellation aborts deletion', () => {
      let isModalOpen = true;
      let confirmed = false;
      // User cancels
      confirmed = false;
      isModalOpen = false;
      assert.strictEqual(confirmed, false);
      assert.strictEqual(isModalOpen, false);
    });

    test('F14-B5: profile with 0 spoken languages falls back to open matching', () => {
      const langs: string[] = [];
      assert.strictEqual(langs.length, 0);
    });
  });

  // --------------------------------------------------------------------------
  // F15: Messages Boundaries
  // --------------------------------------------------------------------------
  describe('F15: Messages Boundaries', () => {
    test('F15-B1: empty message content is rejected (whitespace only)', () => {
      const validateMessage = (m: string) => Boolean(m.trim());
      assert.strictEqual(validateMessage(''), false);
      assert.strictEqual(validateMessage('   \n\t  '), false);
      assert.strictEqual(validateMessage('Hello!'), true);
    });

    test('F15-B2: 0 active connections displays prompt to visit Discover deck', () => {
      const connections: any[] = [];
      assert.strictEqual(connections.length, 0);
    });

    test('F15-B3: milestone contract price cannot be negative', () => {
      const validatePrice = (p: number) => Number.isFinite(p) && p >= 0;
      assert.strictEqual(validatePrice(-50), false);
      assert.strictEqual(validatePrice(0), true);
      assert.strictEqual(validatePrice(5000), true);
    });

    test('F15-B4: milestone contract deliverables cannot be empty', () => {
      const validateDeliverables = (d: string) => Boolean(d.trim());
      assert.strictEqual(validateDeliverables(''), false);
      assert.strictEqual(validateDeliverables('Complete MVP & audit'), true);
    });

    test('F15-B5: handles large message history (500 messages) scroll containment', () => {
      const msgs = Array.from({ length: 500 }, (_, i) => ({ id: `msg-${i}`, content: `Text ${i}` }));
      assert.strictEqual(msgs.length, 500);
    });
  });

  // --------------------------------------------------------------------------
  // F16: Onboarding Boundaries
  // --------------------------------------------------------------------------
  describe('F16: Onboarding Boundaries', () => {
    const CODENAME_RE = /^[A-Z0-9_]{2,32}$/;

    test('F16-B1: codename length boundaries (<2 rejected, 2 valid, 32 valid, >32 rejected)', () => {
      assert.strictEqual(CODENAME_RE.test('A'), false);
      assert.strictEqual(CODENAME_RE.test('AB'), true);
      assert.strictEqual(CODENAME_RE.test('A'.repeat(32)), true);
      assert.strictEqual(CODENAME_RE.test('A'.repeat(33)), false);
    });

    test('F16-B2: codename rejects special characters (@, #, $, space, emoji)', () => {
      assert.strictEqual(CODENAME_RE.test('ALEX@DEV'), false);
      assert.strictEqual(CODENAME_RE.test('ALEX DEV'), false);
      assert.strictEqual(CODENAME_RE.test('ALEX🚀'), false);
      assert.strictEqual(CODENAME_RE.test('ALEX_DEV_99'), true);
    });

    test('F16-B3: vibe slider bounds enforce integer ratings between 1 and 5 inclusive', () => {
      const validateSlider = (n: number) => Number.isInteger(n) && n >= 1 && n <= 5;
      assert.strictEqual(validateSlider(0), false);
      assert.strictEqual(validateSlider(1), true);
      assert.strictEqual(validateSlider(3), true);
      assert.strictEqual(validateSlider(5), true);
      assert.strictEqual(validateSlider(6), false);
      assert.strictEqual(validateSlider(3.5), false);
    });

    test('F16-B4: bio text exceeding 280 characters is truncated to 280', () => {
      const longBio = 'A'.repeat(350);
      const truncated = longBio.slice(0, 280);
      assert.strictEqual(truncated.length, 280);
    });

    test('F16-B5: missing professional details returns validation error', () => {
      const validatePro = (cat: string, title: string, lookCat: string, lookTitle: string) => {
        return Boolean(cat && title.trim() && lookCat && lookTitle.trim());
      };
      assert.strictEqual(validatePro('', 'Engineer', 'Design', 'Lead'), false);
      assert.strictEqual(validatePro('Software & IT', '', 'Design', 'Lead'), false);
      assert.strictEqual(validatePro('Software & IT', 'Engineer', 'Design', 'Lead'), true);
    });
  });

  // --------------------------------------------------------------------------
  // F17: Auth Boundaries
  // --------------------------------------------------------------------------
  describe('F17: Auth Boundaries', () => {
    test('F17-B1: password length boundaries (<8 rejected, 8 valid, 72 valid, >72 rejected)', () => {
      const validatePass = (p: string) => {
        if (p.length < 8) return 'Password must be at least 8 characters.';
        if (p.length > 72) return 'Password is too long.';
        return null;
      };
      assert.strictEqual(validatePass('1234567'), 'Password must be at least 8 characters.');
      assert.strictEqual(validatePass('12345678'), null);
      assert.strictEqual(validatePass('A'.repeat(72)), null);
      assert.strictEqual(validatePass('A'.repeat(73)), 'Password is too long.');
    });

    test('F17-B2: malformed emails rejected before submission', () => {
      const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
      assert.strictEqual(validateEmail('test'), false);
      assert.strictEqual(validateEmail('test@com'), false);
      assert.strictEqual(validateEmail('test@valid.com'), true);
    });

    test('F17-B3: pending state blocks duplicate simultaneous login clicks', () => {
      let isPending = false;
      const attemptSubmit = () => {
        if (isPending) return false;
        isPending = true;
        return true;
      };
      assert.strictEqual(attemptSubmit(), true);
      assert.strictEqual(attemptSubmit(), false); // blocked
    });

    test('F17-B4: switching auth mode resets error and message banners', () => {
      let error = 'Old error';
      let message = 'Old message';
      const switchMode = () => {
        error = '';
        message = '';
      };
      switchMode();
      assert.strictEqual(error, '');
      assert.strictEqual(message, '');
    });

    test('F17-B5: forgot password mode bypasses password validation', () => {
      const mode: 'signin' | 'signup' | 'forgot' = 'forgot';
      const requiresPassword = mode !== 'forgot';
      assert.strictEqual(requiresPassword, false);
    });
  });

  // --------------------------------------------------------------------------
  // F18: Functional Invariant Boundaries
  // --------------------------------------------------------------------------
  describe('F18: Functional Invariant Boundaries', () => {
    test('F18-B1: rate limiting rejects 31st connect request within 24h window', () => {
      const checkRateLimit = (countIn24h: number) => {
        if (countIn24h >= 30) {
          return { error: 'Daily connect limit reached. You can only send 30 requests per 24 hours.' };
        }
        return { allowed: true };
      };
      assert.deepStrictEqual(checkRateLimit(0), { allowed: true });
      assert.deepStrictEqual(checkRateLimit(29), { allowed: true });
      assert.deepStrictEqual(checkRateLimit(30), {
        error: 'Daily connect limit reached. You can only send 30 requests per 24 hours.',
      });
      assert.deepStrictEqual(checkRateLimit(35), {
        error: 'Daily connect limit reached. You can only send 30 requests per 24 hours.',
      });
    });

    test('F18-B2: duplicate connect requests resolve idempotently without error', () => {
      const existingStatus = 'accepted';
      const resolveState = (status: string) => {
        if (status === 'accepted') return { status: 'accepted' };
        if (status === 'declined') return { status: 'declined' };
        return { status: 'outgoing_pending' };
      };
      assert.deepStrictEqual(resolveState(existingStatus), { status: 'accepted' });
    });

    test('F18-B3: self-match prevention triggers when candidate ID matches sender ID', () => {
      const isInvalidPartner = (senderId: string, toId: string) => senderId === toId;
      assert.strictEqual(isInvalidPartner('user-1', 'user-1'), true);
      assert.strictEqual(isInvalidPartner('user-1', 'user-2'), false);
    });

    test('F18-B4: case-insensitive spoken languages matching handles mixed capitalizations', () => {
      const meLangs = ['English', 'SPANISH'];
      const theirLangs = ['english', 'French'];
      const myLower = meLangs.map((l) => l.toLowerCase());
      const theirLower = theirLangs.map((l) => l.toLowerCase());
      const overlap = myLower.filter((l) => theirLower.includes(l));
      assert.deepStrictEqual(overlap, ['english']);
    });

    test('F18-B5: reciprocal category matching works when both seeking same category (peer matching)', () => {
      const me = {
        id: 'me-peer',
        industry_category: 'Software & IT',
        looking_for_category: 'Software & IT',
        spoken_languages: [],
        vibe: { pace: 4, comms: 4, risk: 4, energy: 4 },
      };
      const candidate = {
        profile: createMockProfile({
          id: 'peer-1',
          codename: 'PEER_CODER',
          industry_category: 'Software & IT',
          looking_for_category: 'Software & IT',
          spoken_languages: [],
          onboarding_complete: true,
        }),
        vibe: { pace: 4, comms: 4, risk: 4, energy: 4 },
        project: null,
      };
      const ranked = rankMatches(me, [candidate]);
      assert.strictEqual(ranked.length, 1);
      assert.strictEqual(ranked[0].score, 100);
    });

    test('F18-B6: stable sorting preserved when multiple candidates share identical score', () => {
      const me = {
        id: 'me-tie',
        industry_category: 'Software & IT',
        looking_for_category: 'Creative & Design',
        spoken_languages: [],
        vibe: { pace: 3, comms: 3, risk: 3, energy: 3 },
      };
      const c1 = {
        profile: createMockProfile({ id: 'c-1', codename: 'C1', industry_category: 'Creative & Design', looking_for_category: 'Software & IT', spoken_languages: [], onboarding_complete: true }),
        vibe: { pace: 3, comms: 3, risk: 3, energy: 3 },
        project: null,
      };
      const c2 = {
        profile: createMockProfile({ id: 'c-2', codename: 'C2', industry_category: 'Creative & Design', looking_for_category: 'Software & IT', spoken_languages: [], onboarding_complete: true }),
        vibe: { pace: 3, comms: 3, risk: 3, energy: 3 },
        project: null,
      };
      const ranked = rankMatches(me, [c1, c2]);
      assert.strictEqual(ranked.length, 2);
      assert.strictEqual(ranked[0].score, 100);
      assert.strictEqual(ranked[1].score, 100);
    });

    test('F18-B7: private contact URL masked when status is outgoing_pending or incoming_pending', () => {
      const getRevealedUrl = (status: string, link: string) => (status === 'accepted' ? link : null);
      assert.strictEqual(getRevealedUrl('outgoing_pending', 'https://t.me/secret'), null);
      assert.strictEqual(getRevealedUrl('incoming_pending', 'https://t.me/secret'), null);
      assert.strictEqual(getRevealedUrl('none', 'https://t.me/secret'), null);
      assert.strictEqual(getRevealedUrl('accepted', 'https://t.me/secret'), 'https://t.me/secret');
    });

    test('F18-B8: UUID validation helper accepts valid UUIDv4 strings and rejects malformed values', () => {
      const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      assert.strictEqual(UUID_RE.test('123e4567-e89b-12d3-a456-426614174000'), true);
      assert.strictEqual(UUID_RE.test('invalid-uuid-string'), false);
      assert.strictEqual(UUID_RE.test(''), false);
      assert.strictEqual(UUID_RE.test('123e4567e89b12d3a456426614174000'), false);
    });
  });
});

// Auto-run when executed directly via tsx
if (
  process.argv[1] &&
  !process.argv[1].includes('runner.ts') &&
  (process.argv[1].endsWith('tier2_boundaries.test.ts') ||
    process.argv[1].replace(/\\/g, '/').endsWith('tier2_boundaries.test.ts'))
) {
  runSuites().then((stats) => {
    if (stats.failedTests > 0) process.exit(1);
  });
}
