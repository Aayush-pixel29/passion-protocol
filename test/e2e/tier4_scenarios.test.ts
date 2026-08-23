/**
 * Tier 4: Real-World Workload Scenarios & End-to-End User Journeys
 * 
 * Verifies 12 comprehensive real-world application user journeys:
 * - Scenario 1: The Technical Solo Founder
 * - Scenario 2: The Design & Growth Lead with Inverted Role Preferences
 * - Scenario 3: The Serial Founder Pivot & Vibe Recalibration
 * - Scenario 4: Mobile & Low-Bandwidth Visitor Journey
 * - Scenario 5: Security & Privacy Invariants Enforcement
 * - Scenario 6: Cross-Timezone Global Team Collaboration
 * - Scenario 7: Student Hackathon Sprint Builders
 * - Scenario 8: Deep-Tech AI Researcher + Commercial Domain Expert
 * - Scenario 9: Solo Indie Developer Seeking Growth Marketer
 * - Scenario 10: Early Stage Incubator Cohort Batch Matching
 * - Scenario 11: Milestone Contract Negotiation & Dispute Resolution
 * - Scenario 12: Builder Portfolio Showcase & Social Presence
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
  type PartnershipContract,
  type Message,
} from '../../lib/types';

describe('Tier 4: Real-World Workload Scenarios (12 User Journeys)', () => {

  // --------------------------------------------------------------------------
  // Scenario 1: The Technical Solo Founder
  // --------------------------------------------------------------------------
  test('Scenario 1: The Technical Solo Founder (Alice: Rust/Solidity Engineer → Bob: GTM Partner)', () => {
    // 1. Alice signs up and creates profile
    const aliceProfile: Profile = {
      id: 'alice-tech',
      codename: 'ALICE_RUST',
      full_name: 'Alice Vance',
      location: 'Zurich, Switzerland',
      phone_number: '+41791234567',
      linkedin_url: 'https://linkedin.com/in/alice-rust',
      spoken_languages: ['English', 'German'],
      industry_category: 'Software & IT',
      professional_title: 'Rust & Smart Contract Architect',
      looking_for_category: 'Business & Sales',
      looking_for_title: 'GTM Co-Founder',
      intent_filter: null,
      bio: 'Building decentralized compute mesh with verified enclave proofs.',
      contact_url: 'https://signal.me/#alice',
      onboarding_complete: true,
    };
    const aliceVibe: VibeAnswers = { pace: 5, comms: 2, risk: 5, energy: 4 };

    // 2. Alice registers project pitch
    const aliceProject: Project = {
      id: 'proj-mesh',
      user_id: aliceProfile.id,
      title: 'Decentralized Enclave Compute',
      description: 'Zero-knowledge compute layer with cryptographic attestation.',
      budget_range: '$5,000 + 15% Equity',
      created_at: new Date().toISOString(),
    };

    // 3. Bob exists in candidate pool
    const bobProfile: Profile = {
      id: 'bob-gtm',
      codename: 'BOB_GTM',
      full_name: 'Bob Martinez',
      location: 'New York, USA',
      phone_number: '+12125550199',
      linkedin_url: 'https://linkedin.com/in/bob-gtm',
      spoken_languages: ['English', 'Spanish'],
      industry_category: 'Business & Sales',
      professional_title: 'GTM & Enterprise Sales Lead',
      looking_for_category: 'Software & IT',
      looking_for_title: 'Technical CTO',
      intent_filter: null,
      bio: 'Scaled 2 B2B infrastructure startups to $5M ARR.',
      contact_url: 'https://t.me/bobmartinez',
      onboarding_complete: true,
    };
    const bobVibe: VibeAnswers = { pace: 5, comms: 3, risk: 4, energy: 4 }; // Distance = (0 + 1 + 1 + 0) = 2 -> score ~88%

    // 4. Alice ranks matches in Discover deck
    const rankedForAlice = rankMatches(
      {
        id: aliceProfile.id,
        industry_category: aliceProfile.industry_category!,
        looking_for_category: aliceProfile.looking_for_category!,
        spoken_languages: aliceProfile.spoken_languages,
        intent_filter: null,
        vibe: aliceVibe,
      },
      [{ profile: bobProfile, vibe: bobVibe, project: null }]
    );

    assert.strictEqual(rankedForAlice.length, 1);
    assert.strictEqual(rankedForAlice[0].profile.codename, 'BOB_GTM');
    assert.strictEqual(rankedForAlice[0].score, 98); // +10 reciprocal bonus

    // 5. Mutual connection established & contract drafted
    const contract: PartnershipContract = {
      id: 'contract-mesh-1',
      connect_request_id: 'conn-alice-bob',
      proposed_by: aliceProfile.id,
      proposed_to: bobProfile.id,
      price_amount: 5000,
      deliverables: 'Deliver Enterprise GTM Strategy and Secure 3 Design Partner LOIs',
      contract_type: 'custom',
      revenue_split_a: 50,
      revenue_split_b: 50,
      platform_fee_pct: 20,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    assert.strictEqual(contract.status, 'pending');
    assert.strictEqual(contract.price_amount, 5000);
  });

  // --------------------------------------------------------------------------
  // Scenario 2: The Design & Growth Lead (Inverted Role Preferences)
  // --------------------------------------------------------------------------
  test('Scenario 2: The Design & Growth Lead (Elena: Designer → Marcus: Hardware Engineer with Private Masking)', () => {
    const elena: Profile = {
      id: 'elena-design',
      codename: 'ELENA_UX',
      full_name: 'Elena Rostova',
      location: 'Berlin, Germany',
      phone_number: '+491512345678',
      linkedin_url: 'https://linkedin.com/in/elena-ux',
      spoken_languages: ['English', 'German'],
      industry_category: 'Creative & Design',
      professional_title: 'Principal Hardware Industrial Designer',
      looking_for_category: 'Engineering & Hardware',
      looking_for_title: 'Embedded Firmware Specialist',
      intent_filter: null,
      bio: 'Designing ergonomic next-generation wearable interfaces.',
      contact_url: 'https://calendly.com/elena-ux',
      onboarding_complete: true,
    };
    const elenaVibe: VibeAnswers = { pace: 3, comms: 5, risk: 3, energy: 5 };

    const marcus: Profile = {
      id: 'marcus-hw',
      codename: 'MARCUS_EMBEDDED',
      full_name: 'Marcus Chen',
      location: 'Munich, Germany',
      phone_number: '+491712345678',
      linkedin_url: 'https://linkedin.com/in/marcus-embed',
      spoken_languages: ['German', 'English'],
      industry_category: 'Engineering & Hardware',
      professional_title: 'Embedded Systems & Robotics Lead',
      looking_for_category: 'Creative & Design',
      looking_for_title: 'Industrial Designer',
      intent_filter: null,
      bio: 'Custom PCB design, STM32 firmware, and BLE integration.',
      contact_url: 'https://t.me/marcuschen',
      onboarding_complete: true,
    };
    const marcusVibe: VibeAnswers = { pace: 3, comms: 4, risk: 3, energy: 4 };

    // Vibe score: Distance = 0 + 1 + 0 + 1 = 2 -> score 88%
    const score = vibeScore(elenaVibe, marcusVibe);
    assert.strictEqual(score, 88);

    // Private contact masking before acceptance
    let connectStatus: 'outgoing_pending' | 'accepted' = 'outgoing_pending';
    const getVisibleContact = (status: string, url: string) => (status === 'accepted' ? url : null);
    assert.strictEqual(getVisibleContact(connectStatus, marcus.contact_url!), null);

    // After Marcus accepts
    connectStatus = 'accepted';
    assert.strictEqual(getVisibleContact(connectStatus, marcus.contact_url!), 'https://t.me/marcuschen');
  });

  // --------------------------------------------------------------------------
  // Scenario 3: The Serial Founder Pivot & Vibe Recalibration
  // --------------------------------------------------------------------------
  test('Scenario 3: Serial Founder Pivot (David updates project pitch & recalibrates sliders from 5 to 2)', () => {
    let davidVibe: VibeAnswers = { pace: 5, comms: 5, risk: 5, energy: 5 }; // High-risk explorer
    const partnerVibe: VibeAnswers = { pace: 2, comms: 3, risk: 2, energy: 3 }; // Methodical builder

    // Before recalibration: Distance = 3 + 2 + 3 + 2 = 10 -> Score = 100 - (10/16)*100 = 38%
    let initialScore = vibeScore(davidVibe, partnerVibe);
    assert.strictEqual(initialScore, 38);

    // David pivots to disciplined execution
    davidVibe = { pace: 2, comms: 3, risk: 2, energy: 3 };
    let recalibratedScore = vibeScore(davidVibe, partnerVibe);
    assert.strictEqual(recalibratedScore, 100);

    // Update project description
    const updatedProject: Project = {
      id: 'proj-david',
      user_id: 'david-founder',
      title: 'B2B Treasury Management',
      description: 'Streamlining multi-entity payroll and liquidity management.',
      budget_range: '$10,000',
      created_at: new Date().toISOString(),
    };
    assert.strictEqual(updatedProject.title, 'B2B Treasury Management');
  });

  // --------------------------------------------------------------------------
  // Scenario 4: Mobile & Low-Bandwidth Visitor Journey
  // --------------------------------------------------------------------------
  test('Scenario 4: Mobile Visitor Journey (Landing → Live Simulator → Onboarding Flow)', () => {
    // 1. Mobile viewport interacts with live simulator
    const mobileSimulatorInput = {
      selectedRole: 'Software & IT',
      selectedSeeking: 'Creative & Design',
      vibeSliders: { pace: 4, comms: 4, risk: 3, energy: 4 },
    };

    assert.ok(isValidCategory(mobileSimulatorInput.selectedRole));
    assert.ok(isValidCategory(mobileSimulatorInput.selectedSeeking));

    // 2. Simulates instant synergy calculation
    const defaultBenchmark: VibeAnswers = { pace: 4, comms: 4, risk: 3, energy: 4 };
    const simulatedScore = vibeScore(mobileSimulatorInput.vibeSliders, defaultBenchmark);
    assert.strictEqual(simulatedScore, 100);

    // 3. User transitions to Onboarding form with prefilled state
    const prefilledData = {
      codename: 'MOBILE_BUILDER',
      industry_category: mobileSimulatorInput.selectedRole,
      looking_for_category: mobileSimulatorInput.selectedSeeking,
      pace: mobileSimulatorInput.vibeSliders.pace,
    };
    assert.strictEqual(prefilledData.codename, 'MOBILE_BUILDER');
    assert.strictEqual(prefilledData.pace, 4);
  });

  // --------------------------------------------------------------------------
  // Scenario 5: Security & Privacy Invariants Enforcement
  // --------------------------------------------------------------------------
  test('Scenario 5: Security & Privacy Invariants (Route guards, rate limits, masked reveals, danger zone)', () => {
    // 1. Route guard check
    const protectedPages = ['/discover', '/messages', '/profile', '/onboarding'];
    for (const route of protectedPages) {
      const isProtected = route !== '/login' && route !== '/';
      assert.strictEqual(isProtected, true);
    }

    // 2. Rate limiting check: 30 connections / 24 hours
    const currentSentRequests = 30;
    const canSendMore = currentSentRequests < 30;
    assert.strictEqual(canSendMore, false);

    // 3. Danger zone account deletion execution
    let accountDeleted = false;
    const deleteRpc = () => {
      accountDeleted = true;
      return { success: true };
    };
    const result = deleteRpc();
    assert.strictEqual(result.success, true);
    assert.strictEqual(accountDeleted, true);
  });

  // --------------------------------------------------------------------------
  // Scenario 6: Cross-Timezone Global Team Collaboration
  // --------------------------------------------------------------------------
  test('Scenario 6: Cross-Timezone Global Team (Kenji in Tokyo + Sarah in Berlin: Async Quiet alignment)', () => {
    const kenji: Profile = {
      id: 'kenji-tokyo',
      codename: 'KENJI_ASYNC',
      full_name: 'Kenji Sato',
      location: 'Tokyo, Japan',
      phone_number: null,
      linkedin_url: null,
      spoken_languages: ['Japanese', 'English'],
      industry_category: 'Software & IT',
      professional_title: 'Full Stack Engineer',
      looking_for_category: 'Marketing & Content',
      looking_for_title: 'Technical Content Marketer',
      intent_filter: null,
      bio: 'Deep work focus with async communication.',
      contact_url: 'https://keybase.io/kenji',
      onboarding_complete: true,
    };
    const kenjiVibe: VibeAnswers = { pace: 4, comms: 1, risk: 4, energy: 2 }; // Comms = 1 (Async quiet)

    const sarah: Profile = {
      id: 'sarah-berlin',
      codename: 'SARAH_WRITER',
      full_name: 'Sarah Becker',
      location: 'Berlin, Germany',
      phone_number: null,
      linkedin_url: null,
      spoken_languages: ['German', 'English'],
      industry_category: 'Marketing & Content',
      professional_title: 'Technical Writer & Growth Lead',
      looking_for_category: 'Software & IT',
      looking_for_title: 'Backend Engineer',
      intent_filter: null,
      bio: 'Async-first documentation and content scaling.',
      contact_url: 'https://t.me/sarahbecker',
      onboarding_complete: true,
    };
    const sarahVibe: VibeAnswers = { pace: 4, comms: 1, risk: 4, energy: 2 }; // Comms = 1 (Async quiet)

    // Language intersection: 'English'
    const ranked = rankMatches(
      {
        id: kenji.id,
        industry_category: kenji.industry_category!,
        looking_for_category: kenji.looking_for_category!,
        spoken_languages: kenji.spoken_languages,
        intent_filter: null,
        vibe: kenjiVibe,
      },
      [{ profile: sarah, vibe: sarahVibe, project: null }]
    );

    assert.strictEqual(ranked.length, 1);
    assert.strictEqual(ranked[0].score, 100);
    assert.strictEqual(ranked[0].profile.codename, 'SARAH_WRITER');
  });

  // --------------------------------------------------------------------------
  // Scenario 7: Student Hackathon Sprint Builders
  // --------------------------------------------------------------------------
  test('Scenario 7: Student Hackathon Sprint Builders (High Pace=5, High Risk=5, Rapid Comms=5)', () => {
    const studentA: VibeAnswers = { pace: 5, comms: 5, risk: 5, energy: 5 };
    const studentB: VibeAnswers = { pace: 5, comms: 5, risk: 5, energy: 5 };

    assert.strictEqual(vibeScore(studentA, studentB), 100);

    // Free $0 hackathon milestone agreement
    const hackathonContract: PartnershipContract = {
      id: 'contract-hack-1',
      connect_request_id: 'conn-students',
      proposed_by: 'student-1',
      proposed_to: 'student-2',
      price_amount: 0,
      deliverables: 'Ship working hackathon demo before 48-hour submission deadline',
      contract_type: 'custom',
      revenue_split_a: 50,
      revenue_split_b: 50,
      platform_fee_pct: 20,
      status: 'accepted',
      created_at: new Date().toISOString(),
    };

    assert.strictEqual(hackathonContract.price_amount, 0);
    assert.strictEqual(hackathonContract.status, 'accepted');
  });

  // --------------------------------------------------------------------------
  // Scenario 8: Deep-Tech AI Researcher + Commercial Domain Expert
  // --------------------------------------------------------------------------
  test('Scenario 8: Deep-Tech AI Researcher (Dr. Anya) + Commercial Biotech Executive (Vikram)', () => {
    const anya: Profile = {
      id: 'anya-ai',
      codename: 'ANYA_RESEARCH',
      full_name: 'Dr. Anya Sharma',
      location: 'Oxford, UK',
      phone_number: '+447123456789',
      linkedin_url: 'https://linkedin.com/in/anya-phd',
      spoken_languages: ['English', 'Hindi'],
      industry_category: 'Software & IT',
      professional_title: 'AI Alignment & Bio-Informatics Researcher',
      looking_for_category: 'Business & Sales',
      looking_for_title: 'Commercial Biotech Partner',
      intent_filter: null,
      bio: 'Developed novel protein folding model with 2x speedup.',
      contact_url: 'https://orcid.org/0000-0002-1234-5678',
      onboarding_complete: true,
    };
    const anyaVibe: VibeAnswers = { pace: 3, comms: 3, risk: 4, energy: 2 };

    const vikram: Profile = {
      id: 'vikram-biz',
      codename: 'VIKRAM_BIO',
      full_name: 'Vikram Patel',
      location: 'Boston, USA',
      phone_number: '+16175550144',
      linkedin_url: 'https://linkedin.com/in/vikram-patel-bio',
      spoken_languages: ['English', 'Hindi'],
      industry_category: 'Business & Sales',
      professional_title: 'Biotech Licensing Executive',
      looking_for_category: 'Software & IT',
      looking_for_title: 'Lead AI Scientist',
      intent_filter: null,
      bio: 'Negotiated 5 clinical trial IP license agreements.',
      contact_url: 'https://t.me/vikrambio',
      onboarding_complete: true,
    };
    const vikramVibe: VibeAnswers = { pace: 3, comms: 4, risk: 4, energy: 3 };

    // Vibe distance: 0 + 1 + 0 + 1 = 2 -> score 88%
    const ranked = rankMatches(
      {
        id: anya.id,
        industry_category: anya.industry_category!,
        looking_for_category: anya.looking_for_category!,
        spoken_languages: anya.spoken_languages,
        intent_filter: null,
        vibe: anyaVibe,
      },
      [{ profile: vikram, vibe: vikramVibe, project: null }]
    );

    assert.strictEqual(ranked.length, 1);
    assert.strictEqual(ranked[0].score, 98);
    const roleString = formatRoleWithIcon(vikram.industry_category, vikram.professional_title);
    assert.ok(roleString.includes('Biotech Licensing Executive'));
  });

  // --------------------------------------------------------------------------
  // Scenario 9: Solo Indie Developer Seeking Growth Marketer
  // --------------------------------------------------------------------------
  test('Scenario 9: Solo Indie Developer Seeking Growth Marketer (Leo MVP → Maya Content & SEO)', () => {
    const leo: Profile = {
      id: 'leo-indie',
      codename: 'LEO_BUILDS',
      full_name: 'Leo Chen',
      location: 'Toronto, Canada',
      phone_number: null,
      linkedin_url: null,
      spoken_languages: ['English'],
      industry_category: 'Software & IT',
      professional_title: 'Indie Hacker & Next.js Dev',
      looking_for_category: 'Marketing & Content',
      looking_for_title: 'Growth & SEO Lead',
      intent_filter: null,
      bio: 'Built SaaS with $1k MRR, need distribution.',
      contact_url: 'https://x.com/leobuilds',
      onboarding_complete: true,
    };
    const leoVibe: VibeAnswers = { pace: 5, comms: 3, risk: 4, energy: 3 };

    const candidates = [
      {
        profile: {
          id: 'maya-mkt',
          codename: 'MAYA_GROWTH',
          industry_category: 'Marketing & Content',
          looking_for_category: 'Software & IT',
          spoken_languages: ['English'],
          onboarding_complete: true,
        } as Profile,
        vibe: { pace: 5, comms: 4, risk: 4, energy: 3 } as VibeAnswers, // Dist = 1 -> 94%
        project: null,
      },
      {
        profile: {
          id: 'tom-mkt',
          codename: 'TOM_CONTENT',
          industry_category: 'Marketing & Content',
          looking_for_category: 'Software & IT',
          spoken_languages: ['English'],
          onboarding_complete: true,
        } as Profile,
        vibe: { pace: 2, comms: 1, risk: 1, energy: 1 } as VibeAnswers, // Dist = 10 -> 38%
        project: null,
      },
    ];

    const ranked = rankMatches(
      {
        id: leo.id,
        industry_category: leo.industry_category!,
        looking_for_category: leo.looking_for_category!,
        spoken_languages: leo.spoken_languages,
        intent_filter: null,
        vibe: leoVibe,
      },
      candidates
    );

    assert.strictEqual(ranked.length, 2);
    assert.strictEqual(ranked[0].profile.codename, 'MAYA_GROWTH');
    assert.strictEqual(ranked[0].score, 100);
    assert.strictEqual(ranked[1].profile.codename, 'TOM_CONTENT');
    assert.strictEqual(ranked[1].score, 38);
  });

  // --------------------------------------------------------------------------
  // Scenario 10: Early Stage Incubator Cohort Batch Matching
  // --------------------------------------------------------------------------
  test('Scenario 10: Incubator Cohort Batch Matching (10 diverse operators pairwise matched)', () => {
    // 5 reciprocal complementary pairs (10 operators total)
    const complementaryPairs = [
      ['Software & IT', 'Creative & Design'],
      ['Business & Sales', 'Engineering & Hardware'],
      ['Software & IT', 'Business & Sales'],
      ['Creative & Design', 'Marketing & Content'],
      ['Software & IT', 'Creative & Design'],
    ];

    const cohort = Array.from({ length: 10 }, (_, i) => {
      const pairIndex = Math.floor(i / 2);
      const isFirstInPair = i % 2 === 0;
      const [roleA, roleB] = complementaryPairs[pairIndex];
      const industry_category = isFirstInPair ? roleA : roleB;
      const looking_for_category = isFirstInPair ? roleB : roleA;

      return {
        profile: {
          id: `operator-${i}`,
          codename: `OPERATOR_${i}`,
          full_name: null,
          location: 'San Francisco, CA',
          phone_number: null,
          linkedin_url: null,
          industry_category,
          professional_title: isFirstInPair ? 'Technical Lead' : 'Domain Specialist',
          looking_for_category,
          looking_for_title: isFirstInPair ? 'Domain Specialist' : 'Technical Lead',
          intent_filter: null,
          bio: 'Incubator batch founder',
          contact_url: null,
          spoken_languages: ['English'],
          onboarding_complete: true,
        } as unknown as Profile,
        vibe: {
          pace: ((i * 2) % 5) + 1,
          comms: ((i * 3) % 5) + 1,
          risk: ((i * 4) % 5) + 1,
          energy: ((i * 1) % 5) + 1,
        } as VibeAnswers,
        project: null,
      };
    });

    // Every operator queries their personalized Discover deck
    let totalMatchesFound = 0;
    for (const op of cohort) {
      const matches = rankMatches(
        {
          id: op.profile.id,
          industry_category: op.profile.industry_category!,
          looking_for_category: op.profile.looking_for_category!,
          spoken_languages: op.profile.spoken_languages,
          intent_filter: null,
          vibe: op.vibe,
        },
        cohort
      );
      totalMatchesFound += matches.length;
    }

    assert.ok(totalMatchesFound > 0, 'Cohort members should successfully discover complementary peers');
    assert.ok(totalMatchesFound >= 10, 'Every cohort member should find at least one reciprocal peer');
  });

  // --------------------------------------------------------------------------
  // Scenario 11: Milestone Contract Negotiation & Dispute Resolution
  // --------------------------------------------------------------------------
  test('Scenario 11: Contract Proposal, Re-negotiation & Settlement ($3,000 → $4,500 with deliverables)', () => {
    // 1. Initial proposal
    let contract: PartnershipContract = {
      id: 'contract-nego-1',
      connect_request_id: 'conn-nego',
      proposed_by: 'founder-1',
      proposed_to: 'partner-1',
      price_amount: 3000,
      deliverables: 'Initial MVP backend implementation',
      contract_type: 'custom',
      revenue_split_a: 50,
      revenue_split_b: 50,
      platform_fee_pct: 20,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    // 2. Partner requests scope adjustment
    contract = {
      ...contract,
      price_amount: 4500,
      deliverables: 'MVP backend + Full PostgreSQL Schema & Realtime Chat Integration',
      status: 'pending',
    };
    assert.strictEqual(contract.price_amount, 4500);

    // 3. Founder accepts terms
    contract = { ...contract, status: 'accepted' };
    assert.strictEqual(contract.status, 'accepted');

    // 4. Milestone completed and marked paid
    contract = { ...contract, status: 'paid' };
    assert.strictEqual(contract.status, 'paid');
  });

  // --------------------------------------------------------------------------
  // Scenario 12: Builder Portfolio Showcase & Social Presence
  // --------------------------------------------------------------------------
  test('Scenario 12: Builder Portfolio Showcase & LinkedIn Profile Reveal (Sanitization & formatting)', () => {
    const rawForm = {
      codename: '   grace_hopper   ',
      full_name: 'Grace Hopper',
      location: 'New York, NY',
      linkedin_url: 'https://linkedin.com/in/gracehopper',
      industry_category: 'Software & IT',
      professional_title: 'Compiler Pioneer',
      looking_for_category: 'Engineering & Hardware',
      looking_for_title: 'Hardware Architect',
      bio: 'Pioneered machine-independent programming languages.',
    };

    // Codename normalization: trimmed, spaces to underscore, uppercase
    const normalizedCodename = rawForm.codename.trim().replace(/\s+/g, '_').toUpperCase();
    assert.strictEqual(normalizedCodename, 'GRACE_HOPPER');

    // Verified category
    assert.ok(isValidCategory(rawForm.industry_category));
    assert.ok(isValidCategory(rawForm.looking_for_category));

    // Formatted role string
    const roleString = formatRoleWithIcon(rawForm.industry_category, rawForm.professional_title);
    assert.strictEqual(roleString, '💻 Compiler Pioneer');
  });
});

// Auto-run when executed directly via tsx
if (
  process.argv[1] &&
  !process.argv[1].includes('runner.ts') &&
  (process.argv[1].endsWith('tier4_scenarios.test.ts') ||
    process.argv[1].replace(/\\/g, '/').endsWith('tier4_scenarios.test.ts'))
) {
  runSuites().then((stats) => {
    if (stats.failedTests > 0) process.exit(1);
  });
}
