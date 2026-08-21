# Project: Passion Protocol UI/UX Redesign & Image-Rich Upgrade

## Architecture
- **Framework & Runtime**: Next.js 15.5.4 (App Router, React Server Components, Server Actions), React 19.1.0 (`useActionState`, `useTransition`), TypeScript 5.9.2.
- **Backend & Auth**: Supabase SSR (`@supabase/ssr` 0.7.0) with cookie-based session middleware and Postgres Realtime subscriptions.
- **Design System Architecture**: Centralized CSS custom properties in `app/globals.css` driving dark space obsidian theme (`--bg: #090a10`), frosted glassmorphic card containers (`backdrop-filter: blur(20px)`), vibrant neon accents (`#ff3d6e` pink, `#8b5cf6` electric violet, `#06b6d4` neon cyan, `#10b981` emerald), and Google Fonts (`Plus_Jakarta_Sans` & `Fraunces`).
- **Asset Pipeline**: 22 static synthetic 3D assets in `public/images/` loaded via Next.js `<Image>` and `<img>` tags with explicit dimensions and responsive scaling.
- **State & Route Guards**: Middleware session guard, reciprocal matching engine (`lib/match.ts`), server actions (`lib/actions.ts`), optimistic UI updates via React 19 hooks.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| F1 | Dark Theme Design Tokens | Centralized CSS custom properties in `app/globals.css` (obsidian canvas, glassmorphism surfaces, neon violet/cyan/emerald accents, typography, button variants) | M1 | Survey |
| F2 | Synthetic AI Asset Suite | 22 custom 3D image assets in `public/images/` (hero network matrix, bento 3D graphics, builder avatars, role icons, empty states, CTA backdrop) | M1 | Survey / R3 |
| F3 | Landing Page Hero Section | High-impact hero with badge pill, bold gradient typography, dual CTAs, and interactive simulated co-founder match card | M2 | Survey / R1 |
| F4 | Social Proof & Metrics Ribbon | 4-column glass stat bar highlighting 4,200+ verified builders, 89% launch rate, <48h match time, and $2.4M volume | M2 | Survey / R1 |
| F5 | Bento Grid Feature Showcase | 5 asymmetrical glass bento cards with embedded custom 3D graphics covering 4D vibe, inverted roles, incubator, privacy, and contracts | M2 | Survey / R1, R3 |
| F6 | Step-by-Step How It Works | 3-step timeline (Calibrate, Browse Discover Deck, Mutual Connect & Launch) with connected gradient wires | M2 | Survey / R1 |
| F7 | Interactive Matchmaker Simulator | Client-side interactive sandbox with role chips and 4 vibe sliders computing live synergy score in real time | M2 | Survey / R1 |
| F8 | Co-Founder Testimonials Grid | Verified builder case studies featuring synthetic 3D avatars and authentic startup stories | M2 | Survey / R1, R3 |
| F9 | Interactive FAQ Accordion | 6 glassmorphic expandable FAQ items covering matching algorithm, privacy, contracts, and role categories | M2 | Survey / R1 |
| F10 | Pre-Footer CTA Banner | Full-width glowing glass banner with cosmic nebula backdrop graphic and instant onboarding trigger | M2 | Survey / R1, R3 |
| F11 | Modern Multi-Column Footer | Rich 4-column footer with brand identity, product links, community, legal, status indicator, and newsletter form | M2 | Survey / R1 |
| F12 | Navigation Header Upgrade | Sticky frosted glass header (`components/SiteHeader.tsx`) with active route pills, responsive layout, and auth state handling | M3 | Survey / R2 |
| F13 | Discover Page Redesign | Dark glass match cards, 3D avatars, glowing score badges, mini-equalizer bars, action buttons, and empty state graphic | M3 | Survey / R2, R3 |
| F14 | Profile Page Redesign | Dark glass identity card, animated vibe fingerprint bars, project pitch form, active partnerships grid, and Danger Zone | M3 | Survey / R2 |
| F15 | Messages & Chat Redesign | Frosted glass split-view chat interface, gradient user bubbles, dark partner bubbles, holographic contract cards, and empty state graphic | M3 | Survey / R2, R3 |
| F16 | Onboarding Flow Redesign | 3-step progressive glass card flow with interactive role chips and styled range sliders | M3 | Survey / R2 |
| F17 | Auth & Login Redesign | High-converting glassmorphic auth panel with glowing submit buttons and feedback states | M3 | Survey / R2 |
| F18 | Functional Invariant Protection | Full preservation of Supabase auth, session cookies, rate limits, reciprocal matching, and private contact reveals | M1, M2, M3 | Survey / Acceptance |
| F19 | E2E Opaque-Box Test Suite | Comprehensive 4-tier E2E automated test suite verifying all routes, components, assets, matching logic, and builds | E2E Track | Project Pattern |
| F20 | Adversarial Coverage Hardening | White-box stress testing, gap analysis, and edge case verification by independent Challengers & Reviewers | M4 | Project Pattern |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Design Tokens & AI Asset Generation | 22 custom synthetic image assets in `public/images/`; `app/globals.css` dark tokens; `app/not-found.tsx` | none | DONE |
| M2 | Landing Page Overhaul | Rebuild `app/page.tsx` and create modern landing components (Hero, Metrics, Bento Grid, How It Works, Simulator, Testimonials, FAQ, Pre-Footer CTA, Footer) integrating AI image assets | M1 | IN_PROGRESS |
| M3 | Core Authenticated App Pages Upgrade | Modernize `SiteHeader`, `/discover` & `DiscoverDeck`, `/profile` & `ProjectForm`, `/messages` & `ChatInterface`, `/onboarding` & `OnboardingForm`, `/login` & `AuthForm` under shared design system | M1 | IN_PROGRESS |
| M4 | Final E2E Test Pass & Adversarial Hardening | Run 100% of E2E test suite (Tiers 1-4), execute Tier 5 adversarial hardening with Challengers, and obtain final Reviewer APPROVE and Auditor CLEAN verdicts | M2, M3, E2E Track | PLANNED |
| E2E | E2E Testing Track | Requirement-driven test infrastructure (`TEST_INFRA.md`), test suite implementation (267 tests across Tiers 1-4), and `TEST_READY.md` publication | none | DONE |

## Interface Contracts
### Design Tokens (`app/globals.css`) ↔ Application Pages
- Custom Properties: `--bg`, `--bg-2`, `--bg-3`, `--surface`, `--surface-solid`, `--surface-card`, `--surface-hover`, `--surface-inset`, `--stroke`, `--stroke-hover`, `--stroke-cyan`, `--text`, `--text-bright`, `--muted`, `--accent`, `--accent-2`, `--accent-3`, `--accent-4`, `--radius`, `--font-sans`, `--font-display`.
- Classes: `.glass-panel`, `.match-card`, `.score-badge`, `.role-chip`, `.role-tag`, `.avatar-badge`, `.primary-btn`, `.outline-btn`, `.pill-btn`, `.ghost-btn`, `.bar-track`, `.bar-fill`.

### Synthetic Image Assets (`public/images/`) ↔ UI Components
- Format: PNG images in `public/images/` referenced via `/images/<filename>.png` in Next.js `<Image>` or `<img>` with explicit `width` and `height`.

### Matching Engine & State Models (`lib/match.ts`, `lib/types.ts`) ↔ UI Components
- `vibeScore(a, b)`: 0 to 100 integer score calculated via 4-dimensional Manhattan distance formula.
- `rankMatches(me, candidates)`: Returns `RankedMatch[]` sorted by score descending, filtering on reciprocal categories and language overlap.

## Code Layout
```
d:\passion-protocol\
├── app/
│   ├── layout.tsx                # Global fonts and styles
│   ├── globals.css               # Centralized dark glassmorphism design tokens & styles
│   ├── not-found.tsx             # 404 handler with dark glassmorphic styling
│   ├── page.tsx                  # Public Landing Page (Server Component)
│   ├── login/page.tsx            # Auth & Sign in
│   ├── onboarding/page.tsx       # Onboarding flow
│   ├── discover/page.tsx         # Discover candidate deck
│   ├── messages/page.tsx         # Realtime chat & partnership contracts
│   └── profile/page.tsx          # Profile dashboard & project pitch
├── components/
│   ├── SiteHeader.tsx            # Sticky frosted glass navigation header
│   ├── LandingHeroPreview.tsx    # Interactive Simulated Co-Founder card
│   ├── LandingBentoGrid.tsx      # 5-card Bento Grid feature showcase
│   ├── LandingSimulator.tsx      # Client-side Interactive Live Matchmaker sandbox
│   ├── LandingFaq.tsx            # Interactive glassmorphic FAQ accordion
│   ├── DiscoverDeck.tsx          # Candidate deck with dark glass cards & AI avatars
│   ├── ProjectForm.tsx           # Dark glass project pitch form
│   ├── ChatInterface.tsx         # Realtime split chat interface & contract cards
│   ├── OnboardingForm.tsx        # 3-step progressive onboarding form
│   ├── AuthForm.tsx              # Dark glass auth card
│   └── DeleteAccountButton.tsx   # Danger zone delete account modal
├── lib/
│   ├── types.ts                  # Shared TypeScript data models
│   ├── data.ts                   # Data loading helpers
│   ├── match.ts                  # Vibe scoring & match ranking algorithm
│   ├── actions.ts                # Server Actions
│   └── supabase/                 # Supabase client, server, and middleware
├── public/
│   └── images/                   # 22 custom synthetic AI image assets
└── test/
    └── e2e/                      # E2E test suite (267 automated tests across 7 suites)
```
