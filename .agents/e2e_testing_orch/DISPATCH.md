# Dispatch: E2E Testing Orchestrator

**Working Directory**: `d:\passion-protocol\.agents\e2e_testing_orch`  
**Role**: E2E Testing Orchestrator  
**Mission**: Design, implement, and verify a comprehensive opaque-box automated test suite for the Passion Protocol UI/UX Redesign based strictly on user requirements in `d:\passion-protocol\.agents\ORIGINAL_REQUEST.md` and `d:\passion-protocol\PROJECT.md`.

## Key Responsibilities
1. Create `d:\passion-protocol\TEST_INFRA.md` following the Project Pattern specification.
2. Implement automated test cases covering all 4 tiers:
   - **Tier 1 (Feature Coverage)**: At least 5 test cases per feature (Landing page sections, Discover deck, Profile dashboard, Messages/Realtime chat, Onboarding flow, Auth/Login, Vibe scoring algorithm, Image asset loading).
   - **Tier 2 (Boundary & Corner Cases)**: At least 5 boundary test cases per feature (extreme vibe slider values 1 and 5, empty candidate deck, 0 messages, unauthenticated access redirects, rate limit bounds).
   - **Tier 3 (Cross-Feature Combinations)**: Pairwise tests across features (Onboarding -> Discover -> Connect -> Messages -> Partnership contracts).
   - **Tier 4 (Real-World Application Scenarios)**: End-to-end user journeys (Complete new user signup -> 4D vibe calibration -> find complementary match -> send connect -> mutual accept -> start realtime chat and agree on milestone contract).
3. Ensure test suite can be run via a single clean command (e.g. `npx tsx test/e2e/runner.ts` or `npm test`).
4. Publish `d:\passion-protocol\TEST_READY.md` when the test suite is ready with complete coverage summary.
5. Report completion back to Project Orchestrator via `send_message`.
