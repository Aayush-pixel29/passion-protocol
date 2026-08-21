# Original User Request

## 2026-08-21T13:11:05Z

# Teamwork Project Prompt — Draft

> Status: Launched
> Goal: Task delegated to teamwork_preview
> Requested team: Full agent team

Redesign and upgrade the UI/UX of the Passion Protocol landing page and core app pages to be highly attractive and image-rich. The design should take inspiration from modern, premium landing pages (like lets-code-landing-page.vercel.app), adapting that vibe to fit Passion Protocol's co-founder matchmaking theme.

Working directory: d:\passion-protocol
Integrity mode: development

## Requirements

### R1. Landing Page Overhaul
Redesign the public landing page (`app/page.tsx`) to be visually stunning and modern. It must effectively communicate the value proposition of finding a co-founder/partner, using a premium aesthetic with strong typography and layout.

### R2. Core App Consistency
Upgrade the authenticated pages (Discover, Profile, Messages, and Onboarding) to seamlessly match the new landing page's design system, ensuring a unified visual identity across the entire app.

### R3. Custom AI Assets
Generate and embed custom synthetic images/assets (using image generation tools) for use on the landing page and throughout the app to make the UI visually rich, replacing plain text or simple CSS shapes where appropriate.

## Acceptance Criteria

### Build & Stability
- [ ] `npm run build` completes successfully with 0 TypeScript or ESLint errors.
- [ ] No existing functionality (login, routing, matching logic) is broken by the UI changes.

### Visual & Assets
- [ ] The codebase contains newly generated custom image assets (e.g., in the `public/` folder).
- [ ] The landing page actively renders these new custom images using HTML `<img>` or Next.js `<Image>` tags.
- [ ] The core app pages (Discover, Profile) share the exact same CSS variables/theme (colors, typography, spacing) as the newly designed landing page.

### Review
- [ ] An independent agent reviewer confirms that the UI layout matches premium modern aesthetics (adequate padding, clear typography hierarchy, and strong visual balance).
