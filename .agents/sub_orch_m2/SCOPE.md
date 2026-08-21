# Scope: Milestone 2 — Landing Page Overhaul

## Architecture
- **Framework & Runtime**: Next.js 15.5.4 App Router, React 19, TypeScript 5.9.
- **Server/Client Boundary**: `app/page.tsx` remains an async React Server Component reading session via `getSessionUser()`. Interactive components (`LandingHeroPreview.tsx`, `LandingSimulator.tsx`, `LandingFaq.tsx`) are clean `"use client"` modules.
- **Design System Integration**: Fully consumes CSS custom properties and utility classes in `app/globals.css` (obsidian theme, glassmorphic panels, neon gradients, Plus Jakarta Sans & Fraunces fonts).
- **Synthetic Asset Utilization**: Integrates 22 synthetic PNG assets from `public/images/` via Next.js `<Image>` with explicit width, height, and priority attributes where appropriate.

## Feature Inventory
| # | Feature | Description | Milestone | Status |
|---|---------|-------------|-----------|--------|
| F3 | Landing Page Hero Section | High-impact hero with badge pill, bold gradient typography, dual CTAs, and interactive simulated co-founder match card (`LandingHeroPreview.tsx`) | M2 | IN_PROGRESS |
| F4 | Social Proof & Metrics Ribbon | 4-column glass stat bar highlighting 4,200+ verified builders, 89% launch rate, <48h match time, and $2.4M volume | M2 | IN_PROGRESS |
| F5 | Bento Grid Feature Showcase | 5 asymmetrical glass bento cards with embedded custom 3D graphics (`LandingBentoGrid.tsx`) | M2 | IN_PROGRESS |
| F6 | Step-by-Step How It Works | 3-step timeline (Calibrate, Browse Discover Deck, Mutual Connect & Launch) with connected gradient wires | M2 | IN_PROGRESS |
| F7 | Interactive Matchmaker Simulator | Client-side interactive sandbox (`LandingSimulator.tsx`) with role chips and 4 vibe sliders computing live synergy score in real time using `vibeScore()` | M2 | IN_PROGRESS |
| F8 | Co-Founder Testimonials Grid | Verified builder case studies featuring synthetic 3D avatars (`public/images/avatar-*.png`) and authentic startup stories | M2 | IN_PROGRESS |
| F9 | Interactive FAQ Accordion | 6 glassmorphic expandable FAQ items (`LandingFaq.tsx`) covering matching algorithm, privacy, contracts, and role categories | M2 | IN_PROGRESS |
| F10 | Pre-Footer CTA Banner | Full-width glowing glass banner with cosmic nebula backdrop graphic (`cta-nebula-backdrop.png`) and instant onboarding trigger | M2 | IN_PROGRESS |
| F11 | Modern Multi-Column Footer | Rich 4-column footer with brand identity, product links, community, legal, status indicator, and newsletter form | M2 | IN_PROGRESS |

## Components to Implement / Update
1. `app/page.tsx` — Public Landing Page (Server Component)
2. `components/LandingHeroPreview.tsx` — Interactive Simulated Co-Founder Card ("use client")
3. `components/LandingBentoGrid.tsx` — 5-Card Asymmetrical Bento Feature Showcase
4. `components/LandingSimulator.tsx` — Interactive Real-time Vibe Matchmaker Sandbox ("use client")
5. `components/LandingFaq.tsx` — Interactive FAQ Accordion with 6 core questions ("use client")
6. `app/globals.css` — Supporting glassmorphic, responsive, and animation styles for the landing page without breaking existing classes.

## Invariant Protection
- `app/page.tsx` must accurately resolve session user and set `ctaHref` to `/discover` if authenticated or `/login` if unauthenticated.
- All existing tests (`npm test` / `npx tsx test/e2e/runner.ts`) must pass 100% with 0 errors.
- Strict TypeScript (`npx tsc --noEmit`) and production build (`npm run build`) must succeed with 0 errors.
