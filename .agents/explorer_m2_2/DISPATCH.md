## 2026-08-21T16:44:58Z
You are explorer_m2_2, an exploration agent for Milestone 2 (Landing Page Overhaul).
Working directory: d:\passion-protocol\.agents\explorer_m2_2
Parent conversation ID: 1ed05baa-bf1e-4390-901b-53ddffda380d

Read the following reference files:
1. d:\passion-protocol\.agents\ORIGINAL_REQUEST.md
2. d:\passion-protocol\PROJECT.md
3. d:\passion-protocol\.agents\sub_orch_m2\SCOPE.md
4. d:\passion-protocol\lib\match.ts
5. d:\passion-protocol\lib\types.ts
6. d:\passion-protocol\lib\data.ts
7. d:\passion-protocol\test\e2e\tier1_features.test.ts (F3-F11, F18)
8. d:\passion-protocol\test\e2e\tier2_boundaries.test.ts

Your task:
Analyze and formulate the state management, interactive behavior, and test compliance specifications for the interactive landing page widgets:
1. Design `components/LandingSimulator.tsx`:
   - State for selected user category (`Software & IT`, `Creative & Design`, etc.), target partner category, and 4 vibe sliders (`pace`, `comms`, `risk`, `energy` from 1 to 5).
   - Real-time synergy calculation using `vibeScore(userVibe, candidateVibe)` from `lib/match.ts`.
   - Dynamic simulation cards updating live as sliders/roles change.
2. Design `components/LandingHeroPreview.tsx`:
   - Interactive preview / pulse effect demonstrating complementary match with animated or interactive synergy metrics.
3. Design `components/LandingFaq.tsx`:
   - Interactive open/close accordion state for 6 core questions (algorithm, privacy, contracts, limits, roles, side-projects).
4. Verify all functional and boundary invariants (null user vs logged-in user CTA routing, score clamping 0-100%, mobile touch interactions).

Write your findings and code-ready specs to `d:\passion-protocol\.agents\explorer_m2_2\handoff.md` and send a message when complete.
