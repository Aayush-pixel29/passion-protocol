# E2E Test Infra: Passion Protocol UI/UX Redesign

## Test Philosophy
- **Opaque-Box & Requirement-Driven**: Tests derive strictly from user requirements in `ORIGINAL_REQUEST.md` and architecture specifications in `PROJECT.md`, verifying system behavior through public routes, exported contracts, UI components, static assets, and build artifacts.
- **Progressive Testability**: Verification does not rely on complex mock states where simple invariants suffice. Tier 1 checks can execute and pass with early milestones, while Tiers 2-4 stress boundaries, feature interactions, and end-to-end user journeys.
- **Robustness & Zero Regressions**: Complete invariant verification covering build/lint pass, image asset presence, CSS token consistency, route protection, matching algorithms, reciprocal filtering, and rate limiting.
- **Methodology**: 4-Tier Testing Model combining Category-Partition, Boundary Value Analysis (BVA), Pairwise Combinatorial Testing, and Real-World Workload Scenarios.

---

## Feature Inventory Test Matrix

| # | Feature | Source (Requirement) | Tier 1 (>=5 tests) | Tier 2 (>=5 tests) | Tier 3 (Pairwise) | Tier 4 (Scenario) |
|---|---------|----------------------|:------------------:|:------------------:|:-----------------:|:-----------------:|
| F1 | Dark Theme Design Tokens | ORIGINAL_REQUEST §R2, PROJECT.md | 6 | 5 | ✓ | ✓ |
| F2 | Synthetic AI Asset Suite | ORIGINAL_REQUEST §R3, PROJECT.md | 6 | 5 | ✓ | ✓ |
| F3 | Landing Hero Section | ORIGINAL_REQUEST §R1, PROJECT.md | 5 | 5 | ✓ | ✓ |
| F4 | Metrics & Social Proof Ribbon | ORIGINAL_REQUEST §R1, PROJECT.md | 5 | 5 | ✓ | ✓ |
| F5 | Bento Grid Feature Showcase | ORIGINAL_REQUEST §R1, R3, PROJECT.md | 5 | 5 | ✓ | ✓ |
| F6 | Step-by-Step How It Works | ORIGINAL_REQUEST §R1, PROJECT.md | 5 | 5 | ✓ | ✓ |
| F7 | Interactive Matchmaker Simulator | ORIGINAL_REQUEST §R1, PROJECT.md | 6 | 6 | ✓ | ✓ |
| F8 | Testimonials & Builder Case Studies | ORIGINAL_REQUEST §R1, R3, PROJECT.md | 5 | 5 | ✓ | ✓ |
| F9 | Interactive FAQ Accordion | ORIGINAL_REQUEST §R1, PROJECT.md | 5 | 5 | ✓ | ✓ |
| F10 | Pre-Footer CTA Banner | ORIGINAL_REQUEST §R1, R3, PROJECT.md | 5 | 5 | ✓ | ✓ |
| F11 | Multi-Column Footer | ORIGINAL_REQUEST §R1, PROJECT.md | 5 | 5 | ✓ | ✓ |
| F12 | Navigation Header (`SiteHeader`) | ORIGINAL_REQUEST §R2, PROJECT.md | 5 | 5 | ✓ | ✓ |
| F13 | Discover Page & Deck | ORIGINAL_REQUEST §R2, R3, PROJECT.md | 6 | 5 | ✓ | ✓ |
| F14 | Profile Page & Project Pitch | ORIGINAL_REQUEST §R2, PROJECT.md | 6 | 5 | ✓ | ✓ |
| F15 | Messages & Chat Interface | ORIGINAL_REQUEST §R2, R3, PROJECT.md | 6 | 5 | ✓ | ✓ |
| F16 | Progressive Onboarding Flow | ORIGINAL_REQUEST §R2, PROJECT.md | 6 | 5 | ✓ | ✓ |
| F17 | Auth & Login Flow | ORIGINAL_REQUEST §R2, PROJECT.md | 5 | 5 | ✓ | ✓ |
| F18 | Functional Invariants & Match Engine | ORIGINAL_REQUEST §Build, PROJECT.md | 8 | 8 | ✓ | ✓ |
| **Total** | **All 18 Features** | | **99 Tests** | **94 Tests** | **22 Tests** | **12 Scenarios** |

---

## Test Architecture

### 1. Test Directory Structure
```
d:\passion-protocol\test\e2e\
├── runner.ts                     # Main test suite runner & reporting engine
├── test_framework.ts             # Lightweight assertion harness & test runner primitives
├── build_and_lint.test.ts        # Next.js production build, TypeScript & ESLint checks
├── asset_verification.test.ts    # Synthetic 3D asset existence, sizes, formats & loading
├── theme_tokens.test.ts          # CSS variable definitions, glassmorphism & font consistency
├── tier1_features.test.ts        # Tier 1: 99+ feature-level component & logic tests
├── tier2_boundaries.test.ts      # Tier 2: 94+ edge-case, extreme-value & boundary tests
├── tier3_combinations.test.ts    # Tier 3: 22+ pairwise cross-feature integration tests
└── tier4_scenarios.test.ts       # Tier 4: 12 real-world application workload journeys
```

### 2. Test Execution Commands
- **Full Test Suite**: `npx tsx test/e2e/runner.ts`
- **NPM Script**: `npm test` (configured to invoke `tsx test/e2e/runner.ts`)
- **Exit Code Semantics**:
  - `0`: All test suites, invariant checks, build validations, and assertions passed cleanly.
  - `1`: Any assertion failure, missing asset, type error, or unexpected exception occurred.

### 3. Assertion & Evaluation Primitives
- Deterministic match scoring validator (`vibeScore` and `rankMatches`).
- AST & DOM pattern matcher for Next.js Server & Client components.
- CSS token parser validating required custom properties, glassmorphism classes, and color palettes.
- Image asset validator inspecting `public/images/` files for non-zero file sizes, valid PNG headers, and correct dimensions.

---

## 4-Tier Test Coverage Specification

### Tier 1 — Feature Coverage (>=5 per feature)
- **F1 (Tokens)**: Obsidian canvas variables, frosted glass card classes, neon pink/violet/cyan/emerald accents, typography custom properties, border radius values, button class variants.
- **F2 (Assets)**: 22 synthetic PNG assets presence, valid file headers, aspect ratio constraints, hero network image, bento graphics, avatar portraits.
- **F3 (Hero)**: Value proposition headline, badge pill rendering, Primary 'Find Your Co-Founder' CTA, Secondary 'Explore Deck' CTA, Live preview match card.
- **F4 (Metrics)**: Verified builders counter, Launch rate percentage, Average match time, Total volume stat, responsive 4-column layout.
- **F5 (Bento Grid)**: 4D vibe card, Inverted role hierarchy card, Micro-incubator card, Zero-knowledge privacy card, Milestone contract card.
- **F6 (How It Works)**: Step 1 (Calibrate Vibe), Step 2 (Browse Discover Deck), Step 3 (Mutual Connect & Launch), gradient connectors, step badges.
- **F7 (Simulator)**: 4 vibe slider controls, role category selector chips, real-time score recalculation, dynamic synergy description, reset action, instant CTA link.
- **F8 (Testimonials)**: Builder cards rendering, synthetic 3D avatars, role tags, startup valuation/progress stats, quote formatting.
- **F9 (FAQ)**: 6 expandable FAQ items, question headings, toggle expansion behavior, ARIA accessibility attributes, contact support fallback link.
- **F10 (Pre-Footer CTA)**: Full-width container, gradient glow backdrop, action button, value proposition recap, trust badge.
- **F11 (Footer)**: 4 column links, copyright statement, status indicator (Live), social media links, newsletter subscription field.
- **F12 (Header)**: Logo brand mark, sticky backdrop blur navigation, route pills (`/discover`, `/messages`, `/profile`), auth login button, mobile hamburger menu.
- **F13 (Discover Deck)**: Candidate card rendering, vibe fingerprint bars, complementary role badge, Connect action, Pass action, Empty deck state graphic.
- **F14 (Profile)**: User identity card, 4 vibe slider fingerprints, editable pitch input, active partnerships list, Danger zone delete account modal.
- **F15 (Messages)**: Conversation sidebar list, active chat pane, sender bubble styling, recipient bubble styling, milestone contract card, empty messages state.
- **F16 (Onboarding)**: 3-step wizard navigation, full name / handle inputs, role chips selection, 4 vibe calibration sliders, form submission action, validation feedback.
- **F17 (Auth)**: Sign in card, email input, magic link / password submit button, feedback error banner, redirect to onboarding on new account.
- **F18 (Invariants)**: Manhattan distance score calculation, reciprocal role filtering, language overlap intersection, match ranking descending order, private contact reveal mask, connection rate limiting, session authentication middleware guard, database transaction safety.

### Tier 2 — Boundary & Corner Cases (>=5 per feature)
- Extreme vibe slider ratings (all 1s, all 5s, mixed [1,5,1,5] vs [5,1,5,1]).
- Zero candidate matches (empty database/filter returns graceful empty state graphic).
- Maximal candidate load (ranking 100+ candidates without memory or performance degradation).
- Missing/optional profile fields (bio empty, socials empty, pitch empty).
- Identical vibe fingerprints (vibe distance = 0 => score = 100).
- Orthogonal vibe fingerprints (maximum distance => score = 0).
- Self-matching prevention (candidate cannot match with their own profile).
- Duplicate connection request idempotency (prevent duplicate match entries).
- Unauthenticated access to protected routes (`/discover`, `/messages`, `/profile` redirect to `/login`).
- Malformed inputs on onboarding and project forms (empty strings, excessively long strings, script tags).
- Rapid action clicks (connect/pass debouncing).
- Zero messages in new thread (display clean empty chat state with mutual connect celebration).

### Tier 3 — Cross-Feature Combinations (Pairwise Coverage)
- **C1: Onboarding → Discover**: Profile created in Onboarding immediately reflects in Discover deck candidate ranking.
- **C2: Discover → Connection → Messages**: Clicking Connect in Discover generates a connection row and unlocks a message conversation thread once reciprocated.
- **C3: Profile Update → Discover Synergy Recalculation**: Updating vibe sliders on Profile instantly updates the synergy scores shown to other candidates in Discover.
- **C4: Messages → Milestone Contract Agreement**: Creating and agreeing to a milestone contract inside Messages updates partnership status across Profile and Dashboard.
- **C5: Simulator Settings → Onboarding Prefill**: Selecting role and vibe settings on the Landing Simulator preserves preferences into the Onboarding flow.
- **C6: Theme Consistency Across All Routes**: Verifying exact CSS custom properties and surface classes across `/`, `/login`, `/onboarding`, `/discover`, `/profile`, `/messages`.
- **C7: Asset Rendering Across All Pages**: Verifying that 3D avatars, bento illustrations, and empty state illustrations render without broken image links on all pages.

### Tier 4 — Real-World Application Scenarios
1. **Scenario 1 — The Technical Solo Founder**: A Rust/Solidity engineer signs up, completes 4D vibe calibration (Technical=5, Vision=2, Execution=5, Risk=4), browses Discover deck, connects with a complementary Product/GTM builder (Vision=5, Technical=2), connects mutually, starts chat, and drafts an initial co-founder partnership contract.
2. **Scenario 2 — The Design & Growth Lead**: A Growth marketer completes onboarding with inverted role preferences (seeking technical co-founders), filters Discover candidates, reviews vibe fingerprints, connects, and verifies that private contact details remain masked until reciprocal acceptance.
3. **Scenario 3 — The Serial Founder Pivot**: An existing user updates their profile pitch and recalibrates their vibe sliders from high-risk exploration to focused execution; verifies that all Discover deck synergy scores update dynamically and previous partnerships remain intact.
4. **Scenario 4 — The Mobile / Low-Bandwidth Visitor**: Visitor lands on the public page on mobile viewport, interacts with the Live Simulator sandbox, explores the FAQ accordion, navigates through the sticky header, and initiates onboarding.
5. **Scenario 5 — Security & Privacy Invariants**: Unauthenticated visitor attempts direct access to `/discover`, is redirected to `/login`, signs in, verifies session cookie security, checks rate limit triggers on rapid connections, and validates account deletion safeguards in the Danger Zone.

---

## Coverage Thresholds
- **Tier 1**: ≥ 5 tests per inventoried feature (Minimum: 90 tests, Target: 99+ tests).
- **Tier 2**: ≥ 5 boundary/corner tests per feature (Minimum: 90 tests, Target: 94+ tests).
- **Tier 3**: ≥ 20 pairwise cross-feature integration tests (Target: 22+ tests).
- **Tier 4**: ≥ 5 end-to-end user application workload scenarios (Target: 12 scenarios).
- **Build & Quality**: 100% clean Next.js build (`npm run build`), ESLint validation (`npm run lint`), asset integrity verification, CSS theme token verification.
- **Pass Semantics**: 100% of tests must pass (0 failures, 0 skipped, 0 errors).
