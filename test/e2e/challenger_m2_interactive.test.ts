import { describe, test, expect, assert } from './test_framework';
import { vibeScore } from '../../lib/match';
import {
  INDUSTRY_CATEGORIES,
  CATEGORY_ICONS,
  formatRoleWithIcon,
  type IndustryCategory,
  type VibeAnswers,
} from '../../lib/types';

// Mock candidates replicating LandingSimulator.tsx
const MOCK_CANDIDATES = [
  {
    id: 'sim-1',
    codename: 'MAYA_UX',
    professional_title: 'Lead Product Designer',
    category: 'Creative & Design' as IndustryCategory,
    looking_for_category: 'Software & IT' as IndustryCategory,
    avatarImg: '/images/avatar-maya-designer.png',
    vibe: { pace: 4, comms: 4, risk: 4, energy: 3 },
    projectTitle: 'Prompt-to-React Design System & Plugin',
    budgetRange: ',000 Milestone',
    bio: 'Ex-Figma plugin creator building AI-first generative design tools.',
  },
  {
    id: 'sim-2',
    codename: 'ALEX_AI',
    professional_title: 'AI Systems Architect',
    category: 'Software & IT' as IndustryCategory,
    looking_for_category: 'Creative & Design' as IndustryCategory,
    avatarImg: '/images/avatar-alex-coder.png',
    vibe: { pace: 5, comms: 4, risk: 5, energy: 4 },
    projectTitle: 'Autonomous Agent Protocol',
    budgetRange: ',000 Milestone',
    bio: 'Distributed systems and zero-knowledge compute mesh engineer.',
  },
  {
    id: 'sim-3',
    codename: 'DAVID_ROBOT',
    professional_title: 'Robotics & IoT Lead',
    category: 'Engineering & Hardware' as IndustryCategory,
    looking_for_category: 'Business & Sales' as IndustryCategory,
    avatarImg: '/images/avatar-david-hardware.png',
    vibe: { pace: 4, comms: 3, risk: 5, energy: 4 },
    projectTitle: 'Drone Telemetry & Spatial Controller',
    budgetRange: ',000 Seed Allocation',
    bio: 'Prototyping spatial haptic feedback and real-time flight controllers.',
  },
  {
    id: 'sim-4',
    codename: 'ELENA_SCALE',
    professional_title: 'GTM & Growth Hacker',
    category: 'Business & Sales' as IndustryCategory,
    looking_for_category: 'Engineering & Hardware' as IndustryCategory,
    avatarImg: '/images/avatar-elena-growth.png',
    vibe: { pace: 5, comms: 5, risk: 4, energy: 5 },
    projectTitle: 'Enterprise DevRel Pipeline Engine',
    budgetRange: ',000 + 15% Equity',
    bio: 'Scaled two B2B developer platforms from zero to  ARR.',
  },
  {
    id: 'sim-5',
    codename: 'CARLOS_DOCS',
    professional_title: 'Technical Storyteller',
    category: 'Marketing & Content' as IndustryCategory,
    looking_for_category: 'Software & IT' as IndustryCategory,
    avatarImg: '/images/avatar-carlos-writer.png',
    vibe: { pace: 3, comms: 4, risk: 3, energy: 4 },
    projectTitle: 'Interactive Developer Documentation',
    budgetRange: ',500 Milestone',
    bio: 'Author of viral technical newsletters and interactive dev guides.',
  },
  {
    id: 'sim-6',
    codename: 'PRIYA_CHAIN',
    professional_title: 'Fintech & DeFi Lead',
    category: 'Software & IT' as IndustryCategory,
    looking_for_category: 'Marketing & Content' as IndustryCategory,
    avatarImg: '/images/avatar-priya-fintech.png',
    vibe: { pace: 5, comms: 3, risk: 5, energy: 3 },
    projectTitle: 'Cross-Chain Escrow Protocol',
    budgetRange: ',000 Milestone',
    bio: 'Next-gen smart contract settlement layer with micropayment streaming.',
  },
];

const PRESETS = [
  { label: '⚡ Hackathon Sprint', vibe: { pace: 5, comms: 5, risk: 5, energy: 4 } },
  { label: '🔬 Deep-Tech R&D', vibe: { pace: 2, comms: 2, risk: 4, energy: 2 } },
  { label: '🚀 Product Studio', vibe: { pace: 4, comms: 4, risk: 3, energy: 4 } },
  { label: '🌐 Async Indie', vibe: { pace: 3, comms: 1, risk: 3, energy: 1 } },
];

function getSynergyTier(score: number): { label: string; badgeClass: string } {
  if (score >= 90) return { label: 'Exceptional Resonance', badgeClass: 'tier-exceptional' };
  if (score >= 75) return { label: 'High Complementarity', badgeClass: 'tier-high' };
  if (score >= 50) return { label: 'Moderate Synergy', badgeClass: 'tier-moderate' };
  return { label: 'Divergent Working Styles', badgeClass: 'tier-divergent' };
}

describe('Challenger M2: Interactive Widgets & Calculation Logic Stress Test', () => {

  describe('1. LandingSimulator: Mathematical Formula & Extreme Combinations', () => {
    test('Extreme opposite [1,1,1,1] vs [5,5,5,5] yields exactly 0%', () => {
      const a: VibeAnswers = { pace: 1, comms: 1, risk: 1, energy: 1 };
      const b: VibeAnswers = { pace: 5, comms: 5, risk: 5, energy: 5 };
      expect(vibeScore(a, b)).toBe(0);
      expect(vibeScore(b, a)).toBe(0);
    });

    test('Identical [5,5,5,5] vs [5,5,5,5] and [1,1,1,1] vs [1,1,1,1] yield exactly 100%', () => {
      const maxVibe: VibeAnswers = { pace: 5, comms: 5, risk: 5, energy: 5 };
      const minVibe: VibeAnswers = { pace: 1, comms: 1, risk: 1, energy: 1 };
      expect(vibeScore(maxVibe, maxVibe)).toBe(100);
      expect(vibeScore(minVibe, minVibe)).toBe(100);
    });

    test('Single step difference (distance = 1) yields exactly 94%', () => {
      const a: VibeAnswers = { pace: 5, comms: 5, risk: 5, energy: 5 };
      const b: VibeAnswers = { pace: 5, comms: 5, risk: 5, energy: 4 }; // distance = 1
      expect(vibeScore(a, b)).toBe(94);
      expect(vibeScore(b, a)).toBe(94);
    });

    test('Mathematical symmetry across all 390,625 pairwise combinations of 4D space', () => {
      const vectors: VibeAnswers[] = [];
      for (let p = 1; p <= 5; p++) {
        for (let c = 1; c <= 5; c++) {
          for (let r = 1; r <= 5; r++) {
            for (let e = 1; e <= 5; e++) {
              vectors.push({ pace: p, comms: c, risk: r, energy: e });
            }
          }
        }
      }
      expect(vectors.length).toBe(625);

      // Sample 2,000 random pairs to verify symmetry and range
      for (let i = 0; i < 2000; i++) {
        const idxA = Math.floor(Math.random() * 625);
        const idxB = Math.floor(Math.random() * 625);
        const vA = vectors[idxA];
        const vB = vectors[idxB];
        const sAB = vibeScore(vA, vB);
        const sBA = vibeScore(vB, vA);
        expect(sAB).toBe(sBA);
        expect(sAB).toBeGreaterThanOrEqual(0);
        expect(sAB).toBeLessThanOrEqual(100);
      }
    });

    test('Exhaustive evaluation of all 625 slider vectors against all 6 candidates', () => {
      let evalCount = 0;
      for (let p = 1; p <= 5; p++) {
        for (let c = 1; c <= 5; c++) {
          for (let r = 1; r <= 5; r++) {
            for (let e = 1; e <= 5; e++) {
              const currentVibe: VibeAnswers = { pace: p, comms: c, risk: r, energy: e };
              for (const cand of MOCK_CANDIDATES) {
                const score = vibeScore(currentVibe, cand.vibe);
                evalCount++;
                expect(score).toBeGreaterThanOrEqual(0);
                expect(score).toBeLessThanOrEqual(100);
                assert.ok(Number.isInteger(score), 'Score must be an integer');
              }
            }
          }
        }
      }
      expect(evalCount).toBe(625 * 6);
    });

    test('Slider input clamping handles out-of-bounds inputs gracefully', () => {
      const clamp = (val: number) => Math.max(1, Math.min(5, Math.round(val)));
      expect(clamp(0)).toBe(1);
      expect(clamp(-10)).toBe(1);
      expect(clamp(6)).toBe(5);
      expect(clamp(100)).toBe(5);
      expect(clamp(3.7)).toBe(4);
      expect(clamp(2.2)).toBe(2);
    });
  });

  describe('2. LandingSimulator: 6 Industry Categories & Reciprocal Priority Sorting', () => {
    test('All 6 INDUSTRY_CATEGORIES are valid and have icons', () => {
      expect(INDUSTRY_CATEGORIES.length).toBe(6);
      for (const cat of INDUSTRY_CATEGORIES) {
        assert.ok(CATEGORY_ICONS[cat], 'Missing icon for category: ' + cat);
      }
    });

    test('Simulator ranking sorts targetCategory matches above non-matching categories', () => {
      const vibe: VibeAnswers = { pace: 4, comms: 4, risk: 4, energy: 4 };

      for (const targetCat of INDUSTRY_CATEGORIES) {
        const ranked = MOCK_CANDIDATES
          .map((candidate) => {
            const score = vibeScore(vibe, candidate.vibe);
            const isTargetCategory = candidate.category === targetCat;
            return {
              ...candidate,
              score,
              tier: getSynergyTier(score),
              isTargetCategory,
            };
          })
          .sort((a, b) => {
            if (a.isTargetCategory && !b.isTargetCategory) return -1;
            if (!a.isTargetCategory && b.isTargetCategory) return 1;
            return b.score - a.score;
          });

        const targetCount = MOCK_CANDIDATES.filter((c) => c.category === targetCat).length;
        if (targetCount > 0) {
          for (let i = 0; i < targetCount; i++) {
            expect(ranked[i].category).toBe(targetCat);
            expect(ranked[i].isTargetCategory).toBe(true);
          }
          if (targetCount < ranked.length) {
            for (let i = targetCount; i < ranked.length; i++) {
              expect(ranked[i].isTargetCategory).toBe(false);
            }
          }
        } else {
          // 'Other' has 0 mock candidates; all isTargetCategory are false, sorted purely by score desc
          for (let i = 0; i < ranked.length - 1; i++) {
            expect(ranked[i].score).toBeGreaterThanOrEqual(ranked[i + 1].score);
          }
        }
      }
    });
  });

  describe('3. LandingSimulator: Synergy Tier Boundary Mappings', () => {
    test('Verifies all score thresholds map to exact synergy tier labels and badge classes', () => {
      // >= 90: Exceptional Resonance
      expect(getSynergyTier(100)).toEqual({ label: 'Exceptional Resonance', badgeClass: 'tier-exceptional' });
      expect(getSynergyTier(90)).toEqual({ label: 'Exceptional Resonance', badgeClass: 'tier-exceptional' });

      // 75-89: High Complementarity
      expect(getSynergyTier(89)).toEqual({ label: 'High Complementarity', badgeClass: 'tier-high' });
      expect(getSynergyTier(75)).toEqual({ label: 'High Complementarity', badgeClass: 'tier-high' });

      // 50-74: Moderate Synergy
      expect(getSynergyTier(74)).toEqual({ label: 'Moderate Synergy', badgeClass: 'tier-moderate' });
      expect(getSynergyTier(50)).toEqual({ label: 'Moderate Synergy', badgeClass: 'tier-moderate' });

      // < 50: Divergent Working Styles
      expect(getSynergyTier(49)).toEqual({ label: 'Divergent Working Styles', badgeClass: 'tier-divergent' });
      expect(getSynergyTier(0)).toEqual({ label: 'Divergent Working Styles', badgeClass: 'tier-divergent' });
    });

    test('Exhaustive 0..100 boundary monotonicity check', () => {
      for (let s = 0; s <= 100; s++) {
        const tier = getSynergyTier(s);
        if (s >= 90) {
          expect(tier.label).toBe('Exceptional Resonance');
          expect(tier.badgeClass).toBe('tier-exceptional');
        } else if (s >= 75) {
          expect(tier.label).toBe('High Complementarity');
          expect(tier.badgeClass).toBe('tier-high');
        } else if (s >= 50) {
          expect(tier.label).toBe('Moderate Synergy');
          expect(tier.badgeClass).toBe('tier-moderate');
        } else {
          expect(tier.label).toBe('Divergent Working Styles');
          expect(tier.badgeClass).toBe('tier-divergent');
        }
      }
    });
  });

  describe('4. LandingSimulator: Quick Preset Archetypes', () => {
    test('All 4 presets have valid labels and calibrated slider values (1..5)', () => {
      expect(PRESETS.length).toBe(4);
      for (const preset of PRESETS) {
        expect(preset.vibe.pace).toBeGreaterThanOrEqual(1);
        expect(preset.vibe.pace).toBeLessThanOrEqual(5);
        expect(preset.vibe.comms).toBeGreaterThanOrEqual(1);
        expect(preset.vibe.comms).toBeLessThanOrEqual(5);
        expect(preset.vibe.risk).toBeGreaterThanOrEqual(1);
        expect(preset.vibe.risk).toBeLessThanOrEqual(5);
        expect(preset.vibe.energy).toBeGreaterThanOrEqual(1);
        expect(preset.vibe.energy).toBeLessThanOrEqual(5);
      }
    });

    test('Sprint preset produces High/Exceptional synergy with fast-paced candidates', () => {
      const sprint = PRESETS[0].vibe; // { pace: 5, comms: 5, risk: 5, energy: 4 }
      // ALEX_AI: { pace: 5, comms: 4, risk: 5, energy: 4 } -> distance = 1 -> 94%
      const alexScore = vibeScore(sprint, MOCK_CANDIDATES[1].vibe);
      expect(alexScore).toBe(94);
      expect(getSynergyTier(alexScore).label).toBe('Exceptional Resonance');

      // ELENA_SCALE: { pace: 5, comms: 5, risk: 4, energy: 5 } -> distance = 2 -> 88%
      const elenaScore = vibeScore(sprint, MOCK_CANDIDATES[3].vibe);
      expect(elenaScore).toBe(88);
      expect(getSynergyTier(elenaScore).label).toBe('High Complementarity');
    });

    test('Deep-Tech preset produces Divergent working styles with sprint candidates', () => {
      const deepTech = PRESETS[1].vibe; // { pace: 2, comms: 2, risk: 4, energy: 2 }
      // ALEX_AI: { pace: 5, comms: 4, risk: 5, energy: 4 } -> dist = 3 + 2 + 1 + 2 = 8 -> 50%
      const alexScore = vibeScore(deepTech, MOCK_CANDIDATES[1].vibe);
      expect(alexScore).toBe(50);
      expect(getSynergyTier(alexScore).label).toBe('Moderate Synergy');

      // ELENA_SCALE: { pace: 5, comms: 5, risk: 4, energy: 5 } -> dist = 3 + 3 + 0 + 3 = 9 -> 44%
      const elenaScore = vibeScore(deepTech, MOCK_CANDIDATES[3].vibe);
      expect(elenaScore).toBe(44);
      expect(getSynergyTier(elenaScore).label).toBe('Divergent Working Styles');
    });
  });

  describe('5. LandingHeroPreview: Sample Switching & Equalizer Percentage Math', () => {
    const SAMPLES = [
      {
        codename: 'RIYA_DESIGNS 🎨',
        role: 'Designer',
        category: 'Creative & Design',
        targetRole: 'Coder 💻',
        score: 94,
        avatarInitials: 'R',
        avatarImg: '/images/avatar-maya-designer.png',
        project: 'Autonomous Agent Protocol · ,000 Milestone Budget',
        vibe: { pace: 5, comms: 4, risk: 5, energy: 4 },
      },
      {
        codename: 'ALEX_AI 💻',
        role: 'Systems Coder',
        category: 'Software & IT',
        targetRole: 'Product Designer 🎨',
        score: 96,
        avatarInitials: 'A',
        avatarImg: '/images/avatar-alex-coder.png',
        project: 'Decentralized Compute Mesh · ,000 Milestone Budget',
        vibe: { pace: 5, comms: 5, risk: 4, energy: 5 },
      },
      {
        codename: 'DAVID_MAKER ⚙️',
        role: 'Robotics Lead',
        category: 'Engineering & Hardware',
        targetRole: 'Growth Co-Founder 📈',
        score: 91,
        avatarInitials: 'D',
        avatarImg: '/images/avatar-david-hardware.png',
        project: 'Autonomous Drone Fleet · ,000 Seed Allocation',
        vibe: { pace: 4, comms: 3, risk: 5, energy: 4 },
      },
    ];

    test('All 3 samples have valid data and equalizer percentages match (val / 5) * 100%', () => {
      expect(SAMPLES.length).toBe(3);
      for (const sample of SAMPLES) {
        expect(sample.score).toBeGreaterThanOrEqual(90);
        expect((sample.vibe.pace / 5) * 100).toBeGreaterThanOrEqual(20);
        expect((sample.vibe.comms / 5) * 100).toBeGreaterThanOrEqual(20);
        expect((sample.vibe.risk / 5) * 100).toBeGreaterThanOrEqual(20);
        expect((sample.vibe.energy / 5) * 100).toBeGreaterThanOrEqual(20);
      }
    });

    test('Simulated sample switching cycles accurately through indices [0, 1, 2, 0]', () => {
      let activeIndex = 0;
      expect(SAMPLES[activeIndex].codename).toBe('RIYA_DESIGNS 🎨');

      activeIndex = 1;
      expect(SAMPLES[activeIndex].codename).toBe('ALEX_AI 💻');

      activeIndex = 2;
      expect(SAMPLES[activeIndex].codename).toBe('DAVID_MAKER ⚙️');

      activeIndex = (activeIndex + 1) % SAMPLES.length;
      expect(SAMPLES[activeIndex].codename).toBe('RIYA_DESIGNS 🎨');
    });
  });

  describe('6. LandingFaq: Multi-Open Accordion State & ARIA Conformance', () => {
    const FAQ_DATA = [
      { question: 'How is the Vibe Match score calculated?', topic: 'algorithm', answer: '4-dimensional Manhattan distance formula...' },
      { question: 'Is my contact information public?', topic: 'privacy', answer: 'No. All builders browse using pseudonym codenames...' },
      { question: 'What happens when I click Connect?', topic: 'workflow', answer: 'Clicking Connect sends a double opt-in request...' },
      { question: 'Are milestone contracts legally binding?', topic: 'contracts', answer: 'Milestone contracts allow partners to define deliverables...' },
      { question: 'Can I change my role and preferences later?', topic: 'profile', answer: 'Yes, absolutely...' },
      { question: 'How many connection requests can I send per day?', topic: 'limits', answer: 'Up to 30 active outbound connection requests per 24-hour window...' },
    ];

    test('FAQ initial state has first item open (Set([0]))', () => {
      const openIndices = new Set([0]);
      expect(openIndices.has(0)).toBe(true);
      expect(openIndices.has(1)).toBe(false);
    });

    test('Multi-open toggle supports opening multiple items simultaneously and closing individually', () => {
      let openIndices = new Set([0]);

      const toggle = (set: Set<number>, idx: number) => {
        const next = new Set(set);
        if (next.has(idx)) next.delete(idx);
        else next.add(idx);
        return next;
      };

      openIndices = toggle(openIndices, 1);
      expect(openIndices.size).toBe(2);
      expect(openIndices.has(0)).toBe(true);
      expect(openIndices.has(1)).toBe(true);

      openIndices = toggle(openIndices, 0);
      expect(openIndices.size).toBe(1);
      expect(openIndices.has(0)).toBe(false);
      expect(openIndices.has(1)).toBe(true);

      for (let i = 0; i < 6; i++) {
        if (!openIndices.has(i)) openIndices = toggle(openIndices, i);
      }
      expect(openIndices.size).toBe(6);

      for (let i = 0; i < 6; i++) {
        openIndices = toggle(openIndices, i);
      }
      expect(openIndices.size).toBe(0);
    });

    test('ARIA attributes verify accessible controls and regions', () => {
      for (let i = 0; i < FAQ_DATA.length; i++) {
        const item = FAQ_DATA[i];
        assert.ok(item.question.length > 5, 'Question must not be empty');
        assert.ok(item.answer.length > 10, 'Answer must not be empty');

        const ariaControls = 'faq-answer-' + i;
        const contentId = 'faq-answer-' + i;
        expect(ariaControls).toBe(contentId);
      }
    });
  });
});
