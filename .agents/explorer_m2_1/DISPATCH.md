## 2026-08-21T16:44:58Z

You are explorer_m2_1, an exploration agent for Milestone 2 (Landing Page Overhaul).
Working directory: d:\passion-protocol\.agents\explorer_m2_1
Parent conversation ID: 1ed05baa-bf1e-4390-901b-53ddffda380d

Read the following reference files:
1. d:\passion-protocol\.agents\ORIGINAL_REQUEST.md
2. d:\passion-protocol\PROJECT.md
3. d:\passion-protocol\.agents\sub_orch_m2\SCOPE.md
4. d:\passion-protocol\.agents\explorer_survey_2\handoff.md
5. d:\passion-protocol\.agents\explorer_survey_3\handoff.md
6. d:\passion-protocol\app\page.tsx
7. d:\passion-protocol\TEST_READY.md
8. d:\passion-protocol\test\e2e\tier1_features.test.ts (specifically F3 through F11)

Your task:
Analyze and formulate the complete component architecture and decomposition plan for the Landing Page Overhaul:
1. Specify the exact breakdown of `app/page.tsx` (React Server Component with session resolution via `getSessionUser()`) and all 10 sections.
2. Define the exact prop interfaces, client/server boundaries, and file layouts for:
   - `components/LandingHeroPreview.tsx` (Client component: simulated interactive co-founder card)
   - `components/LandingBentoGrid.tsx` (Bento Grid feature showcase with 5 asymmetrical glass cards and AI images)
   - `components/LandingSimulator.tsx` (Client component: Live interactive 4D vibe matchmaker sandbox)
   - `components/LandingFaq.tsx` (Client component: 6-item glassmorphic accordion)
   - Sections in `app/page.tsx`: Sticky Header, Hero, Metrics Ribbon, Bento Grid, How It Works, Simulator, Testimonials with AI Avatars, FAQ, Pre-Footer CTA with nebula backdrop, Multi-column Footer.
3. Review all test assertions in `test/e2e/tier1_features.test.ts` and `test/e2e/tier2_boundaries.test.ts` for F3-F11 to ensure every regex, text pattern, and structural expectation is met.

Write your findings and concrete implementation blueprints to `d:\passion-protocol\.agents\explorer_m2_1\handoff.md` and send a message when complete.
