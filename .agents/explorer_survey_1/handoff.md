# Codebase Structure, Architecture, and Boundaries Survey Report

**Explorer**: explorer_survey_1  
**Date**: 2026-08-21  
**Target Repository**: `d:\passion-protocol`  
**Goal**: Comprehensive architectural survey, styling analysis, functional boundary mapping, and actionable recommendations for the Passion Protocol landing page overhaul and core app redesign.

---

## 1. Observation

Direct examination of the workspace reveals the following structural, technical, and architectural facts:

### 1.1 Dependency & Tooling Baseline
- **`package.json`**:
  - Framework: `next@^15.5.4` (Next.js 15 App Router with Turbopack / Webpack bundler, Server Actions, React Server Components).
  - UI Library: `react@^19.1.0`, `react-dom@^19.1.0` (React 19, `useActionState`, `useTransition`).
  - Backend/Auth: `@supabase/ssr@^0.7.0`, `@supabase/supabase-js@^2.57.4`.
  - Tooling: `typescript@^5.9.2`, `eslint@^9.35.0`, `@eslint/eslintrc@^3.3.6`, `eslint-config-next@^15.5.4`, `tsx@^4.20.5`.
  - Missing Packages: No `lucide-react`, `tailwindcss`, `@tailwindcss/*`, or `postcss` packages are installed. Icons are currently native unicode/emojis (⚡, 💻, ⚙️, 🎨, 📈, ✍️, 🛠️, 🧑‍💻).
- **Scripts**:
  - `dev`: `next dev`
  - `build`: `next build`
  - `start`: `next start`
  - `lint`: `next lint`
  - `seed`: `npx tsx scripts/seed-demo.ts`
- **TypeScript Configuration (`tsconfig.json`)**:
  - Target: `ES2017`, `strict: true`, `moduleResolution: "bundler"`, paths mapping `"@/*": ["./*"]`.
- **ESLint Configuration (`eslint.config.mjs`)**:
  - Flat configuration using `@eslint/eslintrc` `FlatCompat`, extending `next/core-web-vitals` and `next/typescript`.
- **Assets / Public Directory**:
  - Currently, no `public/` folder exists at root. There are no static image files or SVG assets in the project yet.

### 1.2 Routing & Directory Layout
```
d:\passion-protocol\
├── app/
│   ├── layout.tsx           # Root layout: font loading & global CSS inclusion
│   ├── globals.css          # Core CSS custom properties, utility classes, animations
│   ├── page.tsx             # Public Landing Page (Server Component)
│   ├── login/page.tsx       # Auth page with AuthForm (Client Component)
│   ├── onboarding/page.tsx  # Multi-step profile setup with OnboardingForm (Client Component)
│   ├── discover/page.tsx    # Candidate discovery deck with DiscoverDeck (Client Component)
│   ├── messages/page.tsx    # Real-time chat & partnership contracts (Client Component)
│   └── profile/page.tsx     # Profile dashboard, stats, vibe fingerprint, project pitch
├── components/
│   ├── SiteHeader.tsx       # Navigation header with active states and sign-out action
│   ├── AuthForm.tsx         # Supabase signIn, signUp, resetPassword
│   ├── DiscoverDeck.tsx     # Candidate deck with vibe matching, accept/skip actions
│   ├── OnboardingForm.tsx   # React 19 useActionState form for profile & vibe answers
│   ├── ProjectForm.tsx      # Project pitch creation/editing form
│   ├── ChatInterface.tsx    # Supabase Realtime channel chat & partnership contracts
│   ├── DeleteAccountButton.tsx # RPC delete_user invocation
│   └── ui/                  # (Empty directory)
├── lib/
│   ├── types.ts             # Profile, VibeAnswers, ConnectState, Project, Message, etc.
│   ├── data.ts              # getSessionUser, getOwnProfile, loadCompletedOperators
│   ├── match.ts             # vibeScore (L1 distance metric) & rankMatches
│   ├── actions.ts           # Server actions (saveOnboarding, sendConnect, respondToConnect, etc.)
│   └── supabase/
│       ├── client.ts        # Browser client via createBrowserClient (@supabase/ssr)
│       ├── server.ts        # Server client via createServerClient with next/headers cookies
│       └── middleware.ts    # Session refresh and route guard logic
├── middleware.ts            # Next.js middleware calling lib/supabase/middleware.ts
├── scripts/
│   └── seed-demo.ts         # Seeder for 6 completed operator accounts
└── supabase/
    └── migrations/          # 6 SQL migrations (001_init to 005_global_expansion)
```

### 1.3 Styling Architecture & Theming
- **`app/layout.tsx`**:
  - Google Fonts configured via `next/font/google`:
    - `Plus_Jakarta_Sans` assigned to CSS variable `--font-jakarta`
    - `Fraunces` assigned to CSS variable `--font-fraunces`
- **`app/globals.css` (1,281 lines)**:
  - Pure CSS design system using CSS Custom Properties in `:root`:
    - Palette: `--bg: #fff6ef`, `--bg-2: #ffe8f3`, `--bg-3: #e8f4ff`, `--surface: #ffffff`, `--stroke: #f0d4c4`, `--text: #1c1230`, `--muted: #5c4d63`, `--dim: #7a6a7e`, `--accent: #ff3d6e`, `--accent-2: #7c3aed`, `--accent-3: #ff8a1a`, `--success: #0f9d6e`, `--danger: #e11d48`.
    - Geometry & Elevation: `--radius: 18px`, `--wrap: 1180px`, `--shadow: 0 18px 50px rgba(255, 61, 110, 0.12)`, `--shadow-hover: 0 24px 50px -12px rgba(255, 61, 110, 0.22)`.
    - Typography references: `--font-sans: var(--font-jakarta), ...`, `--font-display: var(--font-fraunces), ...`.
    - Base resets, focus rings (`:focus-visible`), animations (`fadeIn`, `slideUp`, `pulseBadge`, `cardHover`).
    - Component styles: `.site-header`, `.brand`, `.nav`, `.primary-btn`, `.outline-btn`, `.ghost-btn`, `.pill-btn`, `.score-badge`, `.role-chip`, `.role-tag`, `.avatar-badge` (sizes `sm`, `md`, `lg`, `xl`), `.hero-split`, `.hero-panel`, `.feature-grid`, `.match-card`, `.fingerprint`, `.bar-track`, `.bar-fill`.
    - Responsive breakpoints: `@media (max-width: 980px)`, `@media (max-width: 768px)`, `@media (max-width: 480px)`.
    - Accessibility: `@media (prefers-reduced-motion: reduce)`.

---

## 2. Logic Chain

From the observed code and architectural layout, we establish the following analytical conclusions:

### 2.1 State Management & Rendering Model
- **Next.js 15 App Router Model**:
  - The application relies heavily on React Server Components (RSC) for initial page loads (`app/page.tsx`, `app/discover/page.tsx`, `app/profile/page.tsx`, `app/messages/page.tsx`) and Client Components for interactivity (`DiscoverDeck.tsx`, `ChatInterface.tsx`, `AuthForm.tsx`, `OnboardingForm.tsx`, `ProjectForm.tsx`).
  - Server Actions in `lib/actions.ts` handle mutations and use `revalidatePath` and `redirect` to maintain fresh server state.
  - React 19 hooks (`useActionState`, `useTransition`) are used for optimistic updates, pending states, and form transitions.

### 2.2 Functional Integrity Boundaries (Critical Invariants)
1. **Authentication & Session Lifecycle**:
   - `lib/supabase/middleware.ts` guards `/onboarding`, `/discover`, `/profile`, `/messages`.
   - Invariant: Unauthenticated requests to protected paths must redirect to `/login`.
   - Invariant: Authenticated users without `onboarding_complete` must be routed to `/onboarding`.
   - Invariant: Authenticated users with completed onboarding visiting `/login` must be routed to `/discover`.
   - Invariant: `AuthForm.tsx` handles `signInWithPassword`, `signUp`, and `resetPasswordForEmail` via Supabase client.
2. **Matching Engine (`lib/match.ts`)**:
   - Invariant 1: Self-match exclusion (`row.profile.id !== me.id`).
   - Invariant 2: Candidate must have `onboarding_complete === true`.
   - Invariant 3: Reciprocal Category Matching: `row.profile.industry_category === me.looking_for_category && row.profile.looking_for_category === me.industry_category`.
   - Invariant 4: Language match: if both parties have spoken languages listed, their arrays must have a non-empty intersection.
   - Invariant 5: Deterministic Vibe Scoring: Sum of absolute differences across 4 sliders (`pace`, `comms`, `risk`, `energy`) on a 1–5 scale. Maximum distance is 16. Score is `Math.round(100 - (total / 16) * 100)`.
   - Invariant 6: Results sorted in descending order of score.
3. **Connection Requests & Rate Limiting (`lib/actions.ts`)**:
   - Rate limit: Users cannot send more than 30 connect requests in any rolling 24-hour window.
   - Reciprocal auto-accept: If user B already received a pending request from user A, sending a connect request from B to A automatically sets the status to `accepted`.
   - Contact reveal: Privacy constraint where `profile_links.contact_url` is only revealed when `connect_requests.status === 'accepted'`.
4. **Chat & Realtime Messaging (`lib/actions.ts`, `ChatInterface.tsx`)**:
   - Messaging and partnership contract proposals require an active `accepted` connect request status.
   - Realtime updates stream via Supabase Postgres changes on `messages` and `partnership_contracts`.
5. **Data Schemas & Enums**:
   - `INDUSTRY_CATEGORIES`: `"Software & IT"`, `"Engineering & Hardware"`, `"Creative & Design"`, `"Business & Sales"`, `"Marketing & Content"`, `"Other"`.
   - Codename format: `[A-Z0-9_]{2,32}`.
   - Slider dimensions: `pace`, `comms`, `risk`, `energy` (integers 1 to 5).

---

## 3. Caveats

1. **Pure CSS vs Tailwind**:
   - The project currently uses a bespoke, rich CSS design system in `app/globals.css` with CSS custom properties and does NOT have Tailwind CSS installed. All styling redesign must either expand upon `globals.css` / CSS variables or install Tailwind CSS cleanly without breaking existing classes. Enhancing `globals.css` with modular CSS classes and custom property tokens is the lowest-risk and cleanest approach.
2. **Icons**:
   - `lucide-react` is not in `package.json`. If modern icons (Lucide/SVG) are desired, `lucide-react` can be installed or inline clean SVG icons can be embedded.
3. **Public Directory**:
   - `public/` directory does not yet exist and needs to be created to store generated synthetic image assets (e.g. `public/images/...`).
4. **React 19 & Next 15 Compatibility**:
   - Next.js 15 requires `await cookies()` in server helpers (already correctly implemented in `lib/supabase/server.ts`).
   - Server Actions in Next.js 15 must use `revalidatePath` and careful redirect handling inside or outside try-catch blocks.

---

## 4. Conclusion & Actionable Architectural Recommendations

To satisfy all user requirements (`R1. Landing Page Overhaul`, `R2. Core App Consistency`, `R3. Custom AI Assets`, and Acceptance Criteria), the following architectural plan is recommended for the design and implementation team:

### 4.1 Asset Architecture
1. Create `public/images/` directory.
2. Generate and store high-quality custom visual assets:
   - `hero-network.png` / `hero-visual.png`: Premium 3D-styled collaborator network illustration with vibrant glowing nodes matching `#ff3d6e` and `#7c3aed`.
   - `avatar-coder.png`, `avatar-designer.png`, `avatar-maker.png`, `avatar-writer.png`, `avatar-growth.png`: High-resolution synthetic character avatars for sample cards and hero previews.
   - `feature-vibe-radar.png`: Isometric visual representing the 4-dimension vibe slider fingerprinting.
   - `feature-matching.png`: Dynamic visual representing the reciprocal category filtering.
   - `feature-connect.png`: Graphic representing instant connection, chat, and contract generation.
3. Render assets in `app/page.tsx` and core app components using Next.js `<Image>` or optimized `<img>` tags with explicit dimensions, responsive sizing, and `priority` loading on above-the-fold hero imagery.

### 4.2 Landing Page (`app/page.tsx`) Redesign Architecture
- **Inspiration**: Modern premium landing page (e.g., lets-code-landing-page.vercel.app / Linear style) adapted for Passion Protocol's warm, vibrant energy:
  1. **Navigation Bar**: Polished glassmorphism bar (`SiteHeader`) with logo mark, live indicator, and auth actions.
  2. **Hero Section**:
     - Attention-grabbing badge pill with live pulse dot.
     - Bold typography headline blending display serif (`--font-fraunces`) and sans-serif (`--font-jakarta`) with gradient text accents.
     - Dual CTA group: primary gradient button ("Find Your Partner →") with glow shadow and secondary "Watch how it works / Sign in" link.
     - Interactive Hero Visual: A floating glassmorphic Live Match Card featuring synthetic avatar imagery, animated vibe sliders (Pace, Comms, Risk, Energy), 96% match pill badge, and live partner status.
  3. **Social Proof & Metrics Banner**:
     - Stats strip (e.g. "1,200+ Compatible Founders", "94% Average Match Accuracy", "< 24h Time to First Collab").
     - Avatar stack featuring custom synthetic faces.
  4. **"Why Vibe Over Resume" Comparison Grid**:
     - Visual comparison of traditional CV dump (tedious, mismatch-prone) vs Passion Protocol Vibe Algorithm (instant chemistry, aligned risk & pace).
  5. **Feature Deep-Dive Cards (3-Step Process)**:
     - 3 interactive feature cards with custom illustrations, glowing gradient borders, and crisp step badges (`01`, `02`, `03`).
  6. **Interactive Vibe Sandbox / Simulator**:
     - Client-side interactive slider widget on the landing page letting visitors drag sliders and see match calculation in real-time before registering.
  7. **Collaborator Showcase / Role Tags Strip**:
     - Floating role badges showcasing diverse disciplines (Software, Hardware, Design, AI, Growth, Content).
  8. **High-Impact CTA Section**:
     - Large glassmorphism card with glowing background mesh gradient inviting builders to join the protocol.
  9. **Comprehensive Footer**:
     - Brand identity, copyright, protocol status indicator.

### 4.3 Core App Design System Unification (`app/discover`, `app/profile`, `app/messages`, `app/onboarding`)
- Ensure all authenticated pages leverage the exact same design tokens from `:root`:
  - **SiteHeader**: Sticky header with blur backdrop, active page pill highlighter, and clean layout across mobile/desktop.
  - **Discover Deck (`components/DiscoverDeck.tsx`)**:
    - Upgrade cards to glassmorphic surface with subtle gradient borders.
    - Render synthetic avatar images or high-fidelity gradient badges with initials.
    - Display vibe dimension mini-bars, project pitch snippets with budget pills, and clean action buttons (`Connect`, `Skip`, `Accept`, `Decline`).
  - **Profile Page (`app/profile/page.tsx`)**:
    - Modern profile dashboard with identity card, stats counters, animated progress bars for the 4 vibe dimensions, project pitch editor, active partnership cards with contact links, and styled Danger Zone.
  - **Messages Page (`app/messages/page.tsx` & `ChatInterface.tsx`)**:
    - Polished split messenger with active partner sidebar, message bubbles, real-time message indicators, and structured contract proposal cards.
  - **Onboarding Page (`app/onboarding/page.tsx` & `OnboardingForm.tsx`)**:
    - Multi-section card with category chips, interactive sliders with live numeric feedback, and smooth submit transitions.

---

## 5. Verification Method

To independently verify the codebase structure, build integrity, and functional boundaries:

1. **Verify Static Code & Type Consistency**:
   - Check all TypeScript types across `lib/types.ts`, `lib/data.ts`, `lib/match.ts`, `lib/actions.ts`.
   - Validate that no missing imports or broken path aliases (`@/*`) exist.
2. **Build and Lint Commands**:
   - Command: `npm run lint` — must complete with 0 errors and 0 warnings.
   - Command: `npm run build` — must compile all routes (`/`, `/login`, `/onboarding`, `/discover`, `/messages`, `/profile`) successfully with 0 TypeScript/ESLint errors.
3. **Functional Invariant Tests**:
   - Check matching logic unit verification:
     - Verify `vibeScore({ pace: 3, comms: 4, risk: 3, energy: 4 }, { pace: 3, comms: 4, risk: 3, energy: 4 }) === 100`.
     - Verify `vibeScore({ pace: 1, comms: 1, risk: 1, energy: 1 }, { pace: 5, comms: 5, risk: 5, energy: 5 }) === 0`.
   - Verify unauthenticated visit to `/discover` redirects to `/login`.
   - Verify `AuthForm`, `OnboardingForm`, `DiscoverDeck`, `ProjectForm`, and `ChatInterface` maintain exact form action signatures and Supabase hooks.
