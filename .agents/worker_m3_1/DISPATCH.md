# Dispatch: worker_m3_1

**Agent ID**: `worker_m3_1`  
**Role**: Milestone 3 Implementation Worker  
**Working Directory**: `d:\passion-protocol\.agents\worker_m3_1`  
**Parent Orchestrator**: `sub_orch_m3`  

## MANDATORY INTEGRITY WARNING
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Objectives & Files Owned
You are assigned to implement the complete Milestone 3 (Core Authenticated App Pages Upgrade) in accordance with the technical blueprints produced by the Explorers:
- `d:\passion-protocol\.agents\explorer_m3_1\handoff.md` (SiteHeader, /discover, DiscoverDeck)
- `d:\passion-protocol\.agents\explorer_m3_2\handoff.md` (/profile, ProjectForm, DeleteAccountButton, /login, AuthForm)
- `d:\passion-protocol\.agents\explorer_m3_3\handoff.md` (/messages, ChatInterface, /onboarding, OnboardingForm)

### Files to Update:
1. `components/SiteHeader.tsx`
2. `app/discover/page.tsx`
3. `components/DiscoverDeck.tsx`
4. `app/profile/page.tsx`
5. `components/ProjectForm.tsx`
6. `components/DeleteAccountButton.tsx`
7. `app/messages/page.tsx`
8. `components/ChatInterface.tsx`
9. `app/onboarding/page.tsx`
10. `components/OnboardingForm.tsx`
11. `app/login/page.tsx`
12. `components/AuthForm.tsx`

## Core Functional Invariants (MUST PRESERVE)
1. Next.js 15 & React 19 compliance: `useTransition`, `useActionState`, `getOwnProfile()`, server actions.
2. Supabase auth: `signInWithPassword`, `signUp`, `resetPasswordForEmail`, route guards.
3. Matching algorithm & data flows: `rankMatches`, `vibeScore`, reciprocal category filtering, language overlap.
4. Server Actions signatures: `saveOnboarding`, `sendConnect`, `respondToConnect`, `saveProject`, `sendMessage`, `proposePartnership`, `deleteAccount`.
5. Realtime channels: Supabase postgres changes on `messages` and `partnership_contracts`.
6. Private contact reveal rules: `contact_url` only shown for accepted connections.
7. Empty states must render synthetic AI assets: `public/images/empty-discover-deck.png` and `public/images/empty-messages-chat.png`.

## Verification Commands
After implementing, you must run and verify:
1. `npx tsc --noEmit`
2. `npm test` (must pass all 267 E2E tests across 7 test suites)
3. `npm run build` (must complete with 0 errors)

## Deliverables
- Write implementation report to `d:\passion-protocol\.agents\worker_m3_1\handoff.md` with build and test command outputs.
- Update `d:\passion-protocol\.agents\worker_m3_1\progress.md`.
- Send message back to parent `sub_orch_m3` (`cb7c958e-a7b5-4c7b-97d1-5a1f7f1b0785`).

## 2026-08-21T16:56:24Z
Implement the complete Milestone 3 (Core Authenticated App Pages Upgrade) based on the comprehensive blueprints provided by the 3 Explorers:
- components/SiteHeader.tsx
- app/discover/page.tsx
- components/DiscoverDeck.tsx
- app/profile/page.tsx
- components/ProjectForm.tsx
- components/DeleteAccountButton.tsx
- app/messages/page.tsx
- components/ChatInterface.tsx
- app/onboarding/page.tsx
- components/OnboardingForm.tsx
- app/login/page.tsx
- components/AuthForm.tsx

