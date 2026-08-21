# Scope: Milestone 3 — Core Authenticated App Pages Upgrade

## Architecture
- **Framework & Runtime**: Next.js 15.5.4 App Router, React 19.1.0, TypeScript 5.9.2.
- **Styling Model**: Centralized obsidian dark theme and frosted glassmorphism tokens in `app/globals.css`, leveraging `--bg: #090a10`, `--surface: rgba(18, 20, 32, 0.78)`, `--surface-card: rgba(22, 25, 42, 0.65)`, vibrant neon accents (`#ff3d6e`, `#8b5cf6`, `#06b6d4`, `#10b981`), and utility classes (`.glass-panel`, `.match-card`, `.score-badge`, `.role-chip`, `.role-tag`, `.avatar-badge`, `.primary-btn`, `.outline-btn`, `.pill-btn`, `.ghost-btn`, `.bar-track`, `.bar-fill`).
- **Asset Integration**: High-resolution synthetic AI assets in `public/images/` (`empty-discover-deck.png`, `empty-messages-chat.png`, role icons, avatars, etc.) rendered with explicit Next.js `<Image>` or optimized `<img>` tags.
- **State & Invariant Boundary**: Supabase SSR auth cookies, middleware route protections, 4D Manhattan reciprocal matching engine (`lib/match.ts`), Server Actions signatures, Realtime Postgres subscriptions, rate limiting (30 connects/day), and private contact reveal protection.

## Feature Inventory (Milestone 3 Scope)
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| F12 | Navigation Header Upgrade | Sticky frosted glass header (`components/SiteHeader.tsx`) with active route pills, responsive layout, and auth state handling | M3 | Survey / R2 |
| F13 | Discover Page Redesign | Dark glass match cards, 3D avatars, glowing score badges, mini-equalizer bars, action buttons, and empty state graphic | M3 | Survey / R2, R3 |
| F14 | Profile Page Redesign | Dark glass identity card, animated vibe fingerprint bars, project pitch form, active partnerships grid, and Danger Zone | M3 | Survey / R2 |
| F15 | Messages & Chat Redesign | Frosted glass split-view chat interface, gradient user bubbles, dark partner bubbles, holographic contract cards, and empty state graphic | M3 | Survey / R2, R3 |
| F16 | Onboarding Flow Redesign | 3-step progressive glass card flow with interactive role chips and styled range sliders | M3 | Survey / R2 |
| F17 | Auth & Login Redesign | High-converting glassmorphic auth panel with glowing submit buttons and feedback states | M3 | Survey / R2 |
| F18 | Functional Invariant Protection | Full preservation of Supabase auth, session cookies, rate limits, reciprocal matching, and private contact reveals | M3 | Survey / Acceptance |

## Milestones Breakdown
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M3.1 | Navigation & Auth Surfaces | `components/SiteHeader.tsx`, `app/login/page.tsx`, `components/AuthForm.tsx` | M1 | IN_PROGRESS |
| M3.2 | Discover & Operator Deck | `app/discover/page.tsx`, `components/DiscoverDeck.tsx`, `empty-discover-deck.png` | M1 | IN_PROGRESS |
| M3.3 | Profile & Project Pitch | `app/profile/page.tsx`, `components/ProjectForm.tsx`, `components/DeleteAccountButton.tsx` | M1 | IN_PROGRESS |
| M3.4 | Realtime Chat & Contracts | `app/messages/page.tsx`, `components/ChatInterface.tsx`, `empty-messages-chat.png` | M1 | IN_PROGRESS |
| M3.5 | Progressive Onboarding Flow | `app/onboarding/page.tsx`, `components/OnboardingForm.tsx` | M1 | IN_PROGRESS |

## Interface Contracts
### Design Tokens (`app/globals.css`) ↔ UI Components
- Backgrounds: `--bg`, `--bg-2`, `--bg-3`, `--surface`, `--surface-card`, `--surface-hover`, `--surface-inset`.
- Borders: `--stroke`, `--stroke-subtle`, `--stroke-hover`, `--stroke-cyan`, `--stroke-accent`.
- Typography: `--text`, `--text-bright`, `--muted`, `--dim`, `--font-sans`, `--font-display`.
- Accents & Glows: `--accent` (`#ff3d6e`), `--accent-2` (`#8b5cf6`), `--accent-3` (`#06b6d4`), `--accent-4` (`#10b981`), `--glow-violet`, `--glow-cyan`, `--glow-pink`.
- Base Classes: `.glass-panel`, `.match-card`, `.score-badge`, `.role-chip`, `.role-tag`, `.avatar-badge`, `.primary-btn`, `.outline-btn`, `.pill-btn`, `.ghost-btn`, `.bar-track`, `.bar-fill`.

### Backend & Server Actions (`lib/actions.ts`, `lib/supabase/`) ↔ UI Components
- `saveOnboarding(prevState, formData)`: Form action in `components/OnboardingForm.tsx`.
- `sendConnect(targetUserId)`: Action in `components/DiscoverDeck.tsx`.
- `respondToConnect(requestId, accept)`: Action in `components/DiscoverDeck.tsx`.
- `saveProject(prevState, formData)`: Action in `components/ProjectForm.tsx`.
- `sendMessage(connectionId, body)`: Action in `components/ChatInterface.tsx`.
- `proposePartnership(connectionId, terms, amount)`: Action in `components/ChatInterface.tsx`.
- `deleteAccount()`: Server action in `components/DeleteAccountButton.tsx`.

## Code Layout & Write Boundaries
- `components/SiteHeader.tsx`
- `app/discover/page.tsx`
- `components/DiscoverDeck.tsx`
- `app/profile/page.tsx`
- `components/ProjectForm.tsx`
- `components/DeleteAccountButton.tsx`
- `app/messages/page.tsx`
- `components/ChatInterface.tsx`
- `app/onboarding/page.tsx`
- `components/OnboardingForm.tsx`
- `app/login/page.tsx`
- `components/AuthForm.tsx`
