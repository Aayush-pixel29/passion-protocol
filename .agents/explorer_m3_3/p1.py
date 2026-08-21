from write_all import append_part

append_part("""# Technical Blueprint: Messages, Realtime Chat & Onboarding Flow

**Agent**: `explorer_m3_3`  
**Role**: Technical Explorer (Messages, Realtime Chat & Onboarding Flow)  
**Parent Conversation ID**: `cb7c958e-a7b5-4c7b-97d1-5a1f7f1b0785`  
**Working Directory**: `d:\\passion-protocol\\.agents\\explorer_m3_3`  
**Target Milestone**: `M3.4` (Realtime Chat & Contracts) & `M3.5` (Progressive Onboarding Flow)  

---

## 1. Observation

A comprehensive code-level inspection was conducted across the target files, dependencies, design system tokens, assets, and E2E test suites.

### 1.1 Inspected File Paths & Metrics

| File Path | Total Lines | Role & Runtime | Key Invariants & Hooks |
|---|---|---|---|
| `app/messages/page.tsx` | 57 lines | Server Component (RSC) | Auth check (`getOwnProfile`), session redirects (`/login`, `/onboarding`), Supabase join query on `connect_requests` (`status: "accepted"`), partner metadata mapping, empty state fallback. |
| `components/ChatInterface.tsx` | 222 lines | Client Component (`"use client"`) | Supabase Postgres Realtime subscriptions (`chat_<connect_request_id>` on `messages` and `partnership_contracts`), `sendMessage`, `proposePartnership`, `useTransition`, message auto-scroll. |
| `app/onboarding/page.tsx` | 23 lines | Server Component (RSC) | Auth check (`getOwnProfile`), session redirect (`/login`), mounts `<OnboardingForm profile={profile} />`. |
| `components/OnboardingForm.tsx` | 129 lines | Client Component (`"use client"`) | React 19 `useActionState(saveOnboarding)`, 3 form sections, hidden inputs for categories, codename regex `pattern="[A-Za-z0-9_ ]{2,32}"`, 4 vibe sliders (`pace`, `comms`, `risk`, `energy`). |
| `lib/actions.ts` | 325 lines | Server Actions (`"use server"`) | `saveOnboarding(formData)`, `sendMessage(receiverId, content)`, `proposePartnership(formData)`. |
| `app/globals.css` | 1,570 lines | CSS Design System | Deep space obsidian canvas (`--bg: #090a10`), frosted glassmorphism (`--surface-card`, `--surface-inset`), neon accents (`#ff3d6e`, `#8b5cf6`, `#06b6d4`, `#10b981`), CSS utility classes. |
| `public/images/` | 22 PNG assets | Synthetic AI Asset Suite | Includes `empty-messages-chat.png` (165,990 bytes), role icons (`role-software-coder.png`, `role-creative-designer.png`, etc.). |

---

### 1.2 Detailed Baseline Code Observations

#### 1.2.1 `app/messages/page.tsx`
- **Lines 7–10**: Auth check `const { user, profile, supabase } = await getOwnProfile();`. If `!user` redirects to `/login`; if `!profile?.onboarding_complete` redirects to `/onboarding`.
- **Lines 12–35**: Queries `connect_requests` where `status === "accepted"` involving `user.id`. Maps partner IDs and queries `profiles (id, codename, professional_title)`. Constructs `connections` array.
- **Lines 37–55**: Renders `<SiteHeader current="messages" signedIn />`, page intro with `<p className="kicker">Messages</p>` and `<h2>Active Partnerships</h2>`.
- **Lines 45–52**: If `connections.length === 0`, renders a simple `<div className="empty">` container with plain text ("You don't have any active partnerships yet."). When active connections exist, mounts `<ChatInterface currentUserId={user.id} connections={connections} />`.

#### 1.2.2 `components/ChatInterface.tsx`
- **Lines 1–26**: Client component managing `activePartner`, `messages`, `contracts`, `inputText`, `isPending` (`useTransition`), `showPropose`.
- **Lines 28–81**: Realtime subscription lifecycle:
  - Fetches existing `messages` (ordered by `created_at ASC`) and `partnership_contracts` for `activePartner.connect_request_id`.
  - Creates Supabase channel `chat_${activePartner.connect_request_id}` listening to `postgres_changes` `INSERT` on `messages` and `partnership_contracts`.
  - Removes channel cleanly in `useEffect` return cleanup.
- **Lines 87–104**:
  - `handleSend`: Validates `inputText.trim()`, resets input state, and executes `sendMessage(activePartner.partner.id, txt)` inside `startTransition`.
  - `submitContract`: Appends `connect_request_id` and `proposed_to` to `formData` and executes `proposePartnership(formData)` inside `startTransition`.
- **Lines 107–219 (Current Legacy Layout & Styling Remnants)**:
  - Uses inline styles with fixed `height: 600px`.
  - Sidebar uses hardcoded `background: "var(--bg)"` and `rgba(0,0,0,0.04)` active hover.
  - Main chat area has light-theme hardcoding: `background: "#fff"`, partner messages `background: "#f1f5f9"`, contract cards `background: "#f8fafc"` with `border: "1px solid #cbd5e1"`, propose drawer `background: "#fafafa"`.
  - Lacks frosted glass backdrop blurs, glowing gradient user message bubbles, and holographic neon styling.

#### 1.2.3 `app/onboarding/page.tsx`
- **Lines 7–9**: Auth guard via `getOwnProfile()`. Redirects `!user` to `/login`.
- **Lines 11–21**: Renders `<SiteHeader current="none" signedIn />`, `<main className="wrap narrow">`, intro kicker `"Onboarding"` and heading `"Who are you?"`, and mounts `<OnboardingForm profile={profile} />`.

#### 1.2.4 `components/OnboardingForm.tsx`
- **Lines 21–30**: Manages `category` and `lookingCategory` state hooks. Wraps `saveOnboarding(formData)` in React 19 `useActionState`.
- **Lines 35–68 (Section 1: 1. Identity)**: Inputs for `codename` (enforcing `pattern="[A-Za-z0-9_ ]{2,32}"`), `full_name`, `location`, `spoken_languages`, `linkedin_url`, `phone_number`.
- **Lines 70–106 (Section 2: 2. Profession)**: Category chips for `industry_category` and `looking_for_category` backing hidden `<input>` elements. Text inputs for `professional_title` and `looking_for_title`.
- **Lines 109–120 (Section 3: 3. The Vibe)**: 4 range sliders (`pace`, `comms`, `risk`, `energy`) with min 1, max 5, default 3, and endpoint text (`Slow craft` / `Ship fast`, `Async quiet` / `High-bandwidth`, `Safe bets` / `Experimental`, `Deep solo` / `Social collab`).
- **Lines 122–126**: Error message output (`state?.error`) and submit button with `pending` indicator.

#### 1.2.5 E2E Test Suite Expectations
- `test/e2e/tier1_features.test.ts`:
  - **F15-1**: `redirect("/login")` in `app/messages/page.tsx`.
  - **F15-2**: `You don't have any active partnerships yet` or `empty` in `app/messages/page.tsx`.
  - **F15-3**: `supabase.channel` and `postgres_changes` in `ChatInterface.tsx`.
  - **F15-4**: `sendMessage` and `inputText` in `ChatInterface.tsx`.
  - **F15-5**: `proposePartnership`, `partnership_contracts`, `price_amount`, `deliverables` in `ChatInterface.tsx`.
  - **F15-6**: `contracts`, `deliverables`, `status` in `ChatInterface.tsx`.
  - **F16-1**: `export function OnboardingForm`.
  - **F16-2**: `1. Identity`, `name="codename"`, `name="full_name"`, `name="linkedin_url"`.
  - **F16-3**: `pattern="[A-Za-z0-9_ ]{2,32}"`.
  - **F16-4**: `industry_category`, `looking_for_category`.
  - **F16-5**: `pace`, `comms`, `risk`, `energy`, `Slow craft`, `Ship fast`.
  - **F16-6**: `saveOnboarding`.
- `test/e2e/tier2_boundaries.test.ts`:
  - Validates non-negative price, non-empty deliverables, non-empty message body, 1–5 range on vibe dimensions, and codename regex constraints.
""")
