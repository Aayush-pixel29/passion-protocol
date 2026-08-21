# Dispatch: Milestone 3 Sub-Orchestrator (Core Authenticated App Pages Upgrade)

**Working Directory**: `d:\passion-protocol\.agents\sub_orch_m3`  
**Role**: Milestone 3 Sub-Orchestrator  
**Mission**: Execute Milestone 3 (Core Authenticated App Pages Upgrade) per `d:\passion-protocol\PROJECT.md` and `d:\passion-protocol\.agents\ORIGINAL_REQUEST.md`.

## Inputs & Specifications
- Read `d:\passion-protocol\PROJECT.md`.
- Read `d:\passion-protocol\.agents\ORIGINAL_REQUEST.md`.
- Read Core App Specs in `d:\passion-protocol\.agents\explorer_survey_3\handoff.md`.
- Read Codebase Boundaries in `d:\passion-protocol\.agents\explorer_survey_1\handoff.md`.
- Read `d:\passion-protocol\TEST_READY.md`.

## Scope & Write Ownership
You own the core authenticated app pages and shared navigation:
- `components/SiteHeader.tsx` (Sticky dark frosted glass header with active route pills and responsive drawer)
- `app/discover/page.tsx` & `components/DiscoverDeck.tsx` (Dark glass cards, glowing score badges, mini-equalizer bars, action buttons, AI avatars, and empty state with `empty-discover-deck.png`)
- `app/profile/page.tsx`, `components/ProjectForm.tsx`, `components/DeleteAccountButton.tsx` (Dark glass identity panel, animated vibe fingerprint bars, glass project pitch form, active partnerships grid)
- `app/messages/page.tsx` & `components/ChatInterface.tsx` (Frosted glass split chat view, gradient user bubbles, dark partner bubbles, holographic contract cards, empty state with `empty-messages-chat.png`)
- `app/onboarding/page.tsx` & `components/OnboardingForm.tsx` (3-step progressive glass card flow, category chips with glowing selection states, custom range sliders)
- `app/login/page.tsx` & `components/AuthForm.tsx` (High-converting dark glass auth panel)

## Functional Invariants & Integrity Boundaries (MUST PRESERVE)
- Authentication: `signInWithPassword`, `signUp`, `resetPasswordForEmail` via Supabase SSR client.
- Middleware route protection: `/login` $\leftrightarrow$ `/onboarding` $\leftrightarrow$ `/discover` routing rules.
- Matching algorithm: Reciprocal categories, language intersection, and 4D Manhattan vibe distance in `lib/match.ts`.
- Server Actions & State: Form action signatures (`saveOnboarding`, `sendConnect`, `respondToConnect`, `saveProject`, `sendMessage`, `proposePartnership`) and Realtime subscriptions in `ChatInterface.tsx`.
- Rate limiting (30 connects/day) and private contact reveal logic.

## Sub-Orchestrator Procedure
1. Follow iteration loop: Explorer -> Worker (with MANDATORY INTEGRITY WARNING) -> Reviewer (2) -> Challenger (2) -> Forensic Auditor (1) -> Gate.
2. Record all gate verdicts in `d:\passion-protocol\.agents\sub_orch_m3\GATE_STATUS.md`.
3. On Gate PASS, write `d:\passion-protocol\.agents\sub_orch_m3\handoff.md` and report completion back to parent orchestrator via `send_message`.
