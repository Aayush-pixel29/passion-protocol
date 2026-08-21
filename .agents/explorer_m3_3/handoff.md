# Technical Blueprint: Messages, Realtime Chat & Onboarding Flow

**Agent**: `explorer_m3_3`  
**Role**: Technical Explorer (Messages, Realtime Chat & Onboarding Flow)  
**Parent Conversation ID**: `cb7c958e-a7b5-4c7b-97d1-5a1f7f1b0785`  
**Working Directory**: `d:\passion-protocol\.agents\explorer_m3_3`  
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

---

## 2. Logic Chain

### 2.1 Design System Integration & Invariant Preservation

```
+----------------------------------------------------------------------------------------------------+
|                                 GLOBAL DESIGN SYSTEM (app/globals.css)                             |
|  - Obsidian Canvas: --bg: #090a10, --surface-card: rgba(22,25,42,0.70), --surface-inset             |
|  - Glowing Accents: --accent (#ff3d6e), --accent-2 (#8b5cf6), --accent-3 (#06b6d4), --accent-4    |
|  - Glassmorphic Tokens: backdrop-filter: blur(20px), --stroke, --glow-violet, --glow-cyan          |
+----------------------------------------------------------------------------------------------------+
                                    |                                       |
                                    v                                       v
      +-------------------------------------------------+     +------------------------------------------+
      |        MESSAGING & REALTIME CHAT (M3.4)         |     |      PROGRESSIVE ONBOARDING (M3.5)       |
      | - app/messages/page.tsx                         |     | - app/onboarding/page.tsx                |
      |   * Frosted Page Intro + Lede Subtitle          |     |   * Centered Narrow Progressive Flow     |
      |   * AI Empty State (empty-messages-chat.png)    |     | - components/OnboardingForm.tsx          |
      | - components/ChatInterface.tsx                  |     |   * 3-Step Glass Card Deck               |
      |   * Frosted Glass Split Container (.chat-panel) |     |     Card 1: 1. Identity & Persona        |
      |   * Active Partner Sidebar with Status Dot      |     |     Card 2: 2. Profession & Icons (💻🎨) |
      |   * User Bubble: Hot Coral -> Violet Gradient   |     |     Card 3: 3. The Vibe (Sliders + Glow) |
      |   * Partner Bubble: Dark Glass (rgba 255, 0.07) |     |   * Invariant: useActionState + Action   |
      |   * Holographic Milestone Contract Cards        |     |   * Exact Form Input Names & Patterns    |
      |   * Invariant: Supabase Realtime Channels       |     +------------------------------------------+
      +-------------------------------------------------+
```

### 2.2 Detailed Component Modernization Blueprint

#### 2.2.1 Messages Page (`app/messages/page.tsx`)
1. **Container & Header**:
   - Modernized intro block with glowing pill kicker `"MESSAGING & CONTRACTS"`, heading `"Active Partnerships"`, and descriptive lede.
2. **Rich AI Empty State**:
   - When `connections.length === 0`:
     - Embeds `public/images/empty-messages-chat.png` with `<Image src="/images/empty-messages-chat.png" alt="No active partnerships" width={440} height={248} priority className="empty-chat-image" />`.
     - Displays text: `"You don't have any active partnerships yet."` and `"Go to Discover and connect with someone!"`.
     - Includes glowing gradient CTA button linking to `/discover` (`"Explore Discover Deck →"`).
3. **Chat Mounting**:
   - When `connections.length > 0`, mounts `<ChatInterface currentUserId={user.id} connections={connections} />` inside responsive container.

#### 2.2.2 Chat Interface (`components/ChatInterface.tsx`)
1. **Chat Split View Container (`.chat-container` / `.glass-panel`)**:
   - Replaces inline styles with unified CSS classes: `backdrop-filter: blur(20px); background: var(--surface-card); border: 1px solid var(--stroke); border-radius: var(--radius-lg); box-shadow: var(--shadow); height: 700px; display: flex; overflow: hidden;`.
2. **Sidebar (Partners List)**:
   - Width: 300px, `background: var(--surface-inset)`, `border-right: 1px solid var(--stroke)`.
   - Sidebar Header: `"Active Collaborators"` with counter pill badge.
   - Partner Cards:
     - Avatar circle with gradient background (`.avatar-badge.sm.gradient-violet`) + online status dot (`.status-dot` in radiant emerald `#10b981`).
     - Partner Codename (`--text-bright`, font-weight 700) and Professional Title (`--muted`, font-size 13px).
     - Active partner indicator: Glowing violet background (`rgba(139, 92, 246, 0.18)`), glowing left border (`3px solid var(--accent-2)`), and text highlight.
3. **Chat Header**:
   - Displays active partner avatar, codename, title, and live encryption badge (`"⚡ Live Realtime Encryption"`).
   - "Propose Partnership" CTA styled with `.pill-btn.accept` or glowing gradient button.
4. **Message Stream**:
   - Scrollable area (`overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 16px;`).
   - **User Message (Me)**:
     - `align-self: flex-end; max-width: 72%;`
     - Bubble: `background: linear-gradient(135deg, #ff3d6e 0%, #8b5cf6 100%); color: #ffffff; padding: 12px 18px; border-radius: 18px; border-bottom-right-radius: 4px; box-shadow: 0 4px 16px rgba(255, 61, 110, 0.28); font-size: 15px; line-height: 1.5;`.
   - **Partner Message (Them)**:
     - `align-self: flex-start; max-width: 72%;`
     - Bubble: `background: rgba(255, 255, 255, 0.07); border: 1px solid var(--stroke); backdrop-filter: blur(12px); color: #f8fafc; padding: 12px 18px; border-radius: 18px; border-bottom-left-radius: 4px; font-size: 15px; line-height: 1.5;`.
5. **Holographic Partnership Contract Cards**:
   - Card container: `align-self: center; width: 100%; max-width: 440px; background: rgba(18, 20, 32, 0.90); backdrop-filter: blur(20px); border: 1.5px solid var(--stroke-cyan); border-radius: var(--radius-md); padding: 20px; box-shadow: 0 12px 36px rgba(0, 0, 0, 0.6), var(--glow-cyan); text-align: center;`.
   - Header: `🤝 Partnership Proposed` in display serif font (`--font-display`), gradient text.
   - Deliverables scope: Dark inset box with subtle border and italicized text.
   - Price Amount: Neon cyan display text (`color: var(--accent-3); font-size: 1.6rem; font-weight: 800; font-family: var(--font-display);`).
   - Status Pill: Holographic pill badge (`background: rgba(6, 182, 212, 0.15); border: 1px solid rgba(6, 182, 212, 0.40); color: #67e8f9; font-weight: 700; font-size: 12px; text-transform: uppercase; padding: 4px 12px; border-radius: 999px;`).
6. **Proposal Form Drawer**:
   - Glass slide-up panel at bottom (`background: var(--surface-solid); border-top: 1px solid var(--stroke); padding: 24px;`).
   - Header with cancel action.
   - Form inputs with `.input` styling, glowing focus rings, number input for `price_amount`, textarea for `deliverables`.
   - Action button with `isPending` state handling.
7. **Message Input Dock**:
   - Fixed frosted footer (`background: var(--surface-inset); border-top: 1px solid var(--stroke); padding: 16px 20px; display: flex; gap: 12px; align-items: center;`).
   - Text input with smooth focus ring, placeholder `"Type an encrypted message..."`.
   - Send button with gradient styling and Enter key submission.

#### 2.2.3 Onboarding Page & Form (`app/onboarding/page.tsx`, `components/OnboardingForm.tsx`)
1. **Page Structure (`app/onboarding/page.tsx`)**:
   - Centered narrow container (`.wrap.narrow`, max-width 760px).
   - Intro header with kicker `"INITIALIZE IDENTITY"`, heading `"Calibrate Your Builder Profile"`, and clear orientation copy.
2. **3-Step Progressive Glass Card Deck (`components/OnboardingForm.tsx`)**:
   - Form wraps 3 distinct visual `.glass-card` / `.panel` containers:
     - **Card 1: 1. Identity & Public Persona**:
       - Step Badge: `<span className="badge-pill">01 / IDENTITY</span>`
       - Heading: `<h3>1. Identity</h3>`
       - Input fields:
         - `codename`: Required, `pattern="[A-Za-z0-9_ ]{2,32}"`, placeholder `"e.g. CYBER_ARCHITECT"`, with helper hint.
         - `full_name`: Optional, placeholder `"For milestone contracts (e.g. Alex Vance)"`.
         - 2-Column Grid: `location` (`"City, Country"`) and `spoken_languages` (`"English, Spanish, Hindi"`).
         - 2-Column Grid: `linkedin_url` (`"https://linkedin.com/in/..."`) and `phone_number` (`"+1 (555) 000-0000"`).
     - **Card 2: 2. Profession & Target Co-Founder**:
       - Step Badge: `<span className="badge-pill">02 / PROFESSION</span>`
       - Heading: `<h3>2. Profession</h3>`
       - Interactive Category Chips:
         - Maps each category to a distinct 3D / Unicode icon:
           - `"Software & IT"`: 💻
           - `"Creative & Design"`: 🎨
           - `"Engineering & Hardware"`: ⚙️
           - `"Business & Sales"`: 📈
           - `"Marketing & Content"`: ✍️
           - `"Other"`: 🛠️
         - Chips light up on selection in electric violet (`#8b5cf6`) and hot coral (`#ff3d6e`) with glowing borders and shadows (`box-shadow: var(--glow-violet)`).
         - Hidden inputs: `<input type="hidden" name="industry_category" value={category} />` and `<input type="hidden" name="looking_for_category" value={lookingCategory} />`.
       - Text inputs: `professional_title` and `looking_for_title`.
     - **Card 3: 3. The Vibe Fingerprint (4D Match Calibration)**:
       - Step Badge: `<span className="badge-pill">03 / THE VIBE</span>`
       - Heading: `<h3>3. The Vibe</h3>`
       - Subtitle: `"Calibrate your 4-dimensional working rhythm for reciprocal compatibility matching."`
       - 4 Custom Range Sliders (`pace`, `comms`, `risk`, `energy`):
         - `pace`: `"Slow craft"` ↔ `"Ship fast"`
         - `comms`: `"Async quiet"` ↔ `"High-bandwidth"`
         - `risk`: `"Safe bets"` ↔ `"Experimental"`
         - `energy`: `"Deep solo"` ↔ `"Social collab"`
         - Each slider displays live numeric feedback badge (1–5), custom styled track, and glowing thumb.
   - **Form State & Submission**:
     - Error banner rendered dynamically if `state?.error` occurs.
     - Submit button: Full-width or auto-width glowing gradient button with `pending` feedback (`"Calibrating & Launching Profile..."`).

---

## 3. Caveats

1. **E2E String Assertion Constraints**:
   - `test/e2e/tier1_features.test.ts` contains literal string assertions. The following must remain character-exact in the JSX source:
     - `1. Identity`
     - `pattern="[A-Za-z0-9_ ]{2,32}"`
     - `name="codename"`, `name="full_name"`, `name="linkedin_url"`
     - `industry_category`, `looking_for_category`
     - `pace`, `comms`, `risk`, `energy`, `Slow craft`, `Ship fast`
     - `saveOnboarding`
     - `redirect("/login")`
     - `You don't have any active partnerships yet`
     - `supabase.channel`, `postgres_changes`, `sendMessage`, `inputText`, `proposePartnership`, `partnership_contracts`, `price_amount`, `deliverables`, `contracts`, `status`.
2. **Next.js 15 Image Sizing**:
   - When rendering `empty-messages-chat.png`, always specify explicit `width={440}` and `height={248}` (or responsive equivalents) to prevent layout shifts and lint warnings.
3. **React 19 Form State**:
   - `useActionState` expects `async (_prev: { error?: string } | void, formData: FormData) => saveOnboarding(formData)`. The form must submit natively via `action={action}` without custom synthetic event overrides that break FormData population.

---

## 4. Conclusion & Complete Implementation Code

Below are the complete, ready-to-deploy component implementations for `app/messages/page.tsx`, `components/ChatInterface.tsx`, `app/onboarding/page.tsx`, and `components/OnboardingForm.tsx`.

### 4.1 Modernized `app/messages/page.tsx`

```tsx
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { getOwnProfile } from "@/lib/data";
import { redirect } from "next/navigation";
import { ChatInterface } from "@/components/ChatInterface";

export default async function MessagesPage() {
  const { user, profile, supabase } = await getOwnProfile();
  if (!user) redirect("/login");
  if (!profile?.onboarding_complete) redirect("/onboarding");

  // Get active connections
  const { data: acceptedRows } = await supabase
    .from("connect_requests")
    .select("id, from_id, to_id")
    .or(`from_id.eq.${user.id},to_id.eq.${user.id}`)
    .eq("status", "accepted");

  const partners = (acceptedRows ?? []).map((row) => ({
    connect_request_id: row.id,
    partner_id: row.from_id === user.id ? row.to_id : row.from_id,
  }));

  const partnerIds = partners.map((p) => p.partner_id);

  const { data: partnerProfiles } = partnerIds.length
    ? await supabase
        .from("profiles")
        .select("id, codename, professional_title")
        .in("id", partnerIds)
    : { data: [] };

  const partnerMap = new Map(partnerProfiles?.map((p) => [p.id, p]));

  const connections = partners
    .map((p) => ({
      connect_request_id: p.connect_request_id,
      partner: partnerMap.get(p.partner_id)!,
    }))
    .filter((p) => p.partner);

  return (
    <div className="site">
      <SiteHeader current="messages" signedIn />
      <main className="wrap" style={{ maxWidth: 1100 }}>
        <div className="page-intro spread">
          <div>
            <span className="kicker">MESSAGING & CONTRACTS</span>
            <h2>Active Partnerships</h2>
            <p className="sub">
              Encrypted realtime dialogue and holographic milestone agreements with verified collaborators.
            </p>
          </div>
          <div className="badge-pill">
            <span style={{ color: "var(--success)" }}>●</span> {connections.length} Active {connections.length === 1 ? "Channel" : "Channels"}
          </div>
        </div>

        {connections.length === 0 ? (
          <div className="empty glass-panel" style={{ marginTop: 32, padding: "48px 32px" }}>
            <div style={{ maxWidth: 480, margin: "0 auto 24px" }}>
              <Image
                src="/images/empty-messages-chat.png"
                alt="No active partnerships"
                width={440}
                height={248}
                priority
                style={{ width: "100%", height: "auto", borderRadius: 14, border: "1px solid var(--stroke)" }}
              />
            </div>
            <h3 style={{ margin: "0 0 8px 0" }}>No Active Partnerships Yet</h3>
            <p style={{ margin: "0 0 6px 0", color: "#cbd5e1" }}>You don&apos;t have any active partnerships yet.</p>
            <p style={{ margin: "0 0 24px 0", color: "var(--muted)" }}>Go to Discover and connect with someone!</p>
            <Link href="/discover" className="primary-btn inline">
              Explore Discover Deck →
            </Link>
          </div>
        ) : (
          <ChatInterface currentUserId={user.id} connections={connections} />
        )}
      </main>
    </div>
  );
}
```

---

### 4.2 Modernized `components/ChatInterface.tsx`

```tsx
"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { sendMessage, proposePartnership } from "@/lib/actions";
import type { Message, PartnershipContract } from "@/lib/types";

type Connection = {
  connect_request_id: string;
  partner: {
    id: string;
    codename: string;
    professional_title: string | null;
  };
};

export function ChatInterface({
  currentUserId,
  connections,
}: {
  currentUserId: string;
  connections: Connection[];
}) {
  const [activePartner, setActivePartner] = useState<Connection | null>(connections[0] || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [contracts, setContracts] = useState<PartnershipContract[]>([]);
  const [inputText, setInputText] = useState("");
  const [isPending, startTransition] = useTransition();
  const [showPropose, setShowPropose] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!activePartner) return;

    const fetchChat = async () => {
      const { data: msgs } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${currentUserId},receiver_id.eq.${activePartner.partner.id}),and(sender_id.eq.${activePartner.partner.id},receiver_id.eq.${currentUserId})`
        )
        .order("created_at", { ascending: true });

      if (msgs) setMessages(msgs as Message[]);

      const { data: ctrs } = await supabase
        .from("partnership_contracts")
        .select("*")
        .eq("connect_request_id", activePartner.connect_request_id);

      if (ctrs) setContracts(ctrs as PartnershipContract[]);
    };

    fetchChat();

    const channel = supabase
      .channel(`chat_${activePartner.connect_request_id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const newMsg = payload.new as Message;
          if (
            (newMsg.sender_id === currentUserId && newMsg.receiver_id === activePartner.partner.id) ||
            (newMsg.sender_id === activePartner.partner.id && newMsg.receiver_id === currentUserId)
          ) {
            setMessages((prev) => [...prev, newMsg]);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "partnership_contracts" },
        (payload) => {
          const newCtr = payload.new as PartnershipContract;
          if (newCtr.connect_request_id === activePartner.connect_request_id) {
            setContracts((prev) => [...prev, newCtr]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePartner, currentUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, contracts]);

  const handleSend = () => {
    if (!inputText.trim() || !activePartner) return;
    const txt = inputText;
    setInputText("");
    startTransition(async () => {
      await sendMessage(activePartner.partner.id, txt);
    });
  };

  const submitContract = (formData: FormData) => {
    formData.append("connect_request_id", activePartner!.connect_request_id);
    formData.append("proposed_to", activePartner!.partner.id);
    startTransition(async () => {
      const res = await proposePartnership(formData);
      if (res?.error) alert(res.error);
      setShowPropose(false);
    });
  };

  return (
    <div
      className="glass-panel"
      style={{
        display: "flex",
        height: "680px",
        overflow: "hidden",
        boxShadow: "var(--shadow)",
        border: "1px solid var(--stroke)",
      }}
    >
      {/* Active Partner Sidebar */}
      <div
        style={{
          width: 300,
          borderRight: "1px solid var(--stroke)",
          background: "var(--surface-inset)",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--stroke)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", color: "var(--muted)", textTransform: "uppercase" }}>
            Partners ({connections.length})
          </span>
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {connections.map((conn) => {
            const isActive = activePartner?.partner.id === conn.partner.id;
            const initial = conn.partner.codename.charAt(0).toUpperCase();

            return (
              <div
                key={conn.partner.id}
                onClick={() => setActivePartner(conn)}
                style={{
                  padding: "16px 20px",
                  cursor: "pointer",
                  background: isActive ? "rgba(139, 92, 246, 0.16)" : "transparent",
                  borderLeft: isActive ? "3px solid var(--accent-2)" : "3px solid transparent",
                  borderBottom: "1px solid var(--stroke-subtle)",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{ position: "relative" }}>
                  <div className="avatar-badge sm gradient-violet">
                    <span className="avatar-initial">{initial}</span>
                  </div>
                  <span className="status-dot" />
                </div>
                <div style={{ overflow: "hidden" }}>
                  <h4 style={{ margin: "0 0 2px 0", fontSize: 15, color: isActive ? "#fff" : "var(--text)" }}>
                    {conn.partner.codename}
                  </h4>
                  <p className="sub" style={{ margin: 0, fontSize: "0.8rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {conn.partner.professional_title || "Verified Builder"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--surface-card)" }}>
        {activePartner ? (
          <>
            {/* Chat Top Header */}
            <div
              style={{
                padding: "16px 24px",
                borderBottom: "1px solid var(--stroke)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "rgba(18, 20, 32, 0.65)",
                backdropFilter: "blur(16px)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className="avatar-badge sm gradient-sunset">
                  <span className="avatar-initial">{activePartner.partner.codename.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 17, color: "var(--text-bright)" }}>
                    {activePartner.partner.codename}
                  </h3>
                  <span style={{ fontSize: 12, color: "var(--accent-4)", display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "var(--accent-4)", boxShadow: "0 0 8px var(--accent-4)" }} />
                    Encrypted Realtime Channel
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="pill-btn accept"
                onClick={() => setShowPropose(true)}
                style={{ fontSize: 13, padding: "8px 16px" }}
              >
                🤝 Propose Partnership
              </button>
            </div>

            {/* Message Stream */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: 24,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {messages.length === 0 && contracts.length === 0 ? (
                <div style={{ margin: "auto", textAlign: "center", color: "var(--dim)", padding: 24 }}>
                  <p style={{ margin: "0 0 6px 0", fontSize: 16, color: "var(--muted)" }}>
                    This is the start of your encrypted dialogue with <strong>{activePartner.partner.codename}</strong>.
                  </p>
                  <p style={{ margin: 0, fontSize: 13 }}>Send a message or propose a milestone contract below.</p>
                </div>
              ) : null}

              {messages.map((msg) => {
                const isMe = msg.sender_id === currentUserId;
                return (
                  <div key={msg.id} style={{ alignSelf: isMe ? "flex-end" : "flex-start", maxWidth: "70%" }}>
                    <div
                      style={{
                        background: isMe ? "linear-gradient(135deg, #ff3d6e 0%, #8b5cf6 100%)" : "rgba(255, 255, 255, 0.07)",
                        border: isMe ? "none" : "1px solid var(--stroke)",
                        color: isMe ? "#ffffff" : "var(--text)",
                        padding: "12px 18px",
                        borderRadius: 18,
                        borderBottomRightRadius: isMe ? 4 : 18,
                        borderBottomLeftRadius: !isMe ? 4 : 18,
                        boxShadow: isMe ? "0 4px 16px rgba(255, 61, 110, 0.28)" : "var(--shadow-sm)",
                        fontSize: 15,
                        lineHeight: 1.5,
                        wordBreak: "break-word",
                      }}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })}

              {/* Holographic Partnership Contracts */}
              {contracts.map((ctr) => (
                <div
                  key={ctr.id}
                  style={{
                    alignSelf: "center",
                    width: "100%",
                    maxWidth: 440,
                    background: "rgba(18, 20, 32, 0.90)",
                    backdropFilter: "blur(20px)",
                    border: "1.5px solid var(--stroke-cyan)",
                    borderRadius: "var(--radius-md)",
                    padding: 20,
                    textAlign: "center",
                    boxShadow: "0 12px 36px rgba(0, 0, 0, 0.6), var(--glow-cyan)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 10 }}>
                    <span style={{ fontSize: 20 }}>🤝</span>
                    <h4 style={{ margin: 0, fontSize: 18, color: "var(--text-bright)", fontFamily: "var(--font-display)" }}>
                      Partnership Proposed
                    </h4>
                  </div>
                  <div
                    style={{
                      background: "var(--surface-inset)",
                      border: "1px solid var(--stroke-subtle)",
                      borderRadius: 10,
                      padding: "12px 16px",
                      margin: "0 0 14px 0",
                      color: "#cbd5e1",
                      fontSize: 14,
                      lineHeight: 1.5,
                    }}
                  >
                    {ctr.deliverables}
                  </div>
                  <div
                    style={{
                      fontSize: "1.6rem",
                      fontWeight: 800,
                      color: "var(--accent-3)",
                      fontFamily: "var(--font-display)",
                      letterSpacing: "-0.02em",
                      marginBottom: 12,
                    }}
                  >
                    ${ctr.price_amount}
                  </div>
                  <div>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        fontWeight: 800,
                        letterSpacing: "0.08em",
                        padding: "6px 14px",
                        background: "rgba(6, 182, 212, 0.15)",
                        border: "1px solid rgba(6, 182, 212, 0.40)",
                        color: "#67e8f9",
                        borderRadius: "var(--radius-full)",
                        boxShadow: "0 0 12px rgba(6, 182, 212, 0.20)",
                      }}
                    >
                      Status: {ctr.status}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Proposal Drawer or Message Input */}
            {showPropose ? (
              <div
                style={{
                  padding: 24,
                  borderTop: "1px solid var(--stroke)",
                  background: "var(--surface-elevated)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h4 style={{ margin: 0, fontSize: 16 }}>Propose Milestone Terms</h4>
                  <button
                    type="button"
                    onClick={() => setShowPropose(false)}
                    className="ghost-btn"
                    style={{ padding: "4px 10px", fontSize: 13 }}
                  >
                    ✕ Cancel
                  </button>
                </div>
                <form action={submitContract} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <label>
                    <span className="label">Price / Budget ($)</span>
                    <input name="price_amount" type="number" min={0} required placeholder="E.g., 500" className="input" style={{ marginBottom: 0 }} />
                  </label>
                  <label>
                    <span className="label">Deliverables / Scope</span>
                    <textarea name="deliverables" required placeholder="What exact milestones or outcomes will be delivered?" rows={3} className="input" style={{ marginBottom: 0 }} />
                  </label>
                  <button type="submit" disabled={isPending} className="primary-btn" style={{ marginTop: 4 }}>
                    {isPending ? "Sending Proposal..." : "Send Milestone Proposal 🤝"}
                  </button>
                </form>
              </div>
            ) : (
              <div
                style={{
                  padding: "16px 20px",
                  borderTop: "1px solid var(--stroke)",
                  display: "flex",
                  gap: 12,
                  background: "var(--surface-inset)",
                  alignItems: "center",
                }}
              >
                <input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type an encrypted message..."
                  className="input"
                  style={{ flex: 1, margin: 0 }}
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!inputText.trim() || isPending}
                  className="primary-btn inline"
                  style={{ height: 48, padding: "0 24px" }}
                >
                  Send ⚡
                </button>
              </div>
            )}
          </>
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--dim)" }}>
            Select a partnership to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
```

---

### 4.3 Modernized `app/onboarding/page.tsx`

```tsx
import { OnboardingForm } from "@/components/OnboardingForm";
import { SiteHeader } from "@/components/SiteHeader";
import { getOwnProfile } from "@/lib/data";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  const { user, profile } = await getOwnProfile();
  if (!user) redirect("/login");

  return (
    <div className="site">
      <SiteHeader current="none" signedIn />
      <main className="wrap narrow" style={{ maxWidth: 760 }}>
        <div className="page-intro" style={{ textAlign: "center", marginBottom: 36 }}>
          <span className="kicker">INITIALIZE IDENTITY</span>
          <h2 style={{ fontSize: "clamp(32px, 4vw, 44px)", margin: "8px 0 12px" }}>Who are you?</h2>
          <p className="sub" style={{ maxWidth: 540, margin: "0 auto" }}>
            Calibrate your builder persona, discipline, complementary search criteria, and 4D operating rhythm.
          </p>
        </div>
        <OnboardingForm profile={profile} />
      </main>
    </div>
  );
}
```

---

### 4.4 Modernized `components/OnboardingForm.tsx`

```tsx
"use client";

import { useActionState, useState } from "react";
import { saveOnboarding } from "@/lib/actions";
import { INDUSTRY_CATEGORIES, type IndustryCategory, type Profile } from "@/lib/types";

const CATEGORY_ICONS: Record<IndustryCategory, string> = {
  "Software & IT": "💻",
  "Creative & Design": "🎨",
  "Engineering & Hardware": "⚙️",
  "Business & Sales": "📈",
  "Marketing & Content": "✍️",
  "Other": "🛠️",
};

const SLIDERS: Array<{
  name: "pace" | "comms" | "risk" | "energy";
  label: string;
  left: string;
  right: string;
}> = [
  { name: "pace", label: "Pace", left: "Slow craft", right: "Ship fast" },
  { name: "comms", label: "Comms", left: "Async quiet", right: "High-bandwidth" },
  { name: "risk", label: "Risk", left: "Safe bets", right: "Experimental" },
  { name: "energy", label: "Energy", left: "Deep solo", right: "Social collab" },
];

export function OnboardingForm({ profile }: { profile?: Profile | null }) {
  const [category, setCategory] = useState<IndustryCategory | "">(
    (profile?.industry_category as IndustryCategory) ?? ""
  );
  const [lookingCategory, setLookingCategory] = useState<IndustryCategory | "">(
    (profile?.looking_for_category as IndustryCategory) ?? ""
  );

  const [sliderValues, setSliderValues] = useState<Record<string, number>>({
    pace: 3,
    comms: 3,
    risk: 3,
    energy: 3,
  });

  const [state, action, pending] = useActionState(
    async (_prev: { error: string } | void, formData: FormData) => {
      return saveOnboarding(formData);
    },
    undefined
  );

  return (
    <form action={action} className="onboard-form" style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {/* 1. Identity */}
      <section className="glass-panel" style={{ padding: 32 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, borderBottom: "1px solid var(--stroke)", paddingBottom: 12 }}>
          <h3 style={{ margin: 0 }}>1. Identity</h3>
          <span className="badge-pill">01 / IDENTITY</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <label>
            <span className="label">Codename (Public)</span>
            <input
              name="codename"
              className="input"
              defaultValue={profile?.codename ?? ""}
              required
              pattern="[A-Za-z0-9_ ]{2,32}"
              placeholder="e.g. CYBER_ARCHITECT"
              style={{ marginBottom: 4 }}
            />
            <span style={{ fontSize: 12, color: "var(--dim)" }}>2–32 letters, numbers, or underscores. Displayed on cards.</span>
          </label>

          <label>
            <span className="label">Full Name (Optional, for Contracts)</span>
            <input
              name="full_name"
              className="input"
              defaultValue={profile?.full_name ?? ""}
              placeholder="e.g. Alex Rivera"
              style={{ marginBottom: 0 }}
            />
          </label>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <label>
              <span className="label">Location</span>
              <input
                name="location"
                className="input"
                defaultValue={profile?.location ?? ""}
                placeholder="City, Country"
                style={{ marginBottom: 0 }}
              />
            </label>
            <label>
              <span className="label">Spoken Languages</span>
              <input
                name="spoken_languages"
                className="input"
                defaultValue={profile?.spoken_languages?.join(", ") ?? ""}
                placeholder="English, Hindi, German..."
                style={{ marginBottom: 0 }}
              />
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <label>
              <span className="label">LinkedIn URL</span>
              <input
                name="linkedin_url"
                className="input"
                defaultValue={profile?.linkedin_url ?? ""}
                placeholder="https://linkedin.com/in/..."
                style={{ marginBottom: 0 }}
              />
            </label>
            <label>
              <span className="label">Phone Number</span>
              <input
                name="phone_number"
                className="input"
                defaultValue={profile?.phone_number ?? ""}
                placeholder="+1 (555) 000-0000"
                style={{ marginBottom: 0 }}
              />
            </label>
          </div>
        </div>
      </section>

      {/* 2. Profession */}
      <section className="glass-panel" style={{ padding: 32 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, borderBottom: "1px solid var(--stroke)", paddingBottom: 12 }}>
          <h3 style={{ margin: 0 }}>2. Profession</h3>
          <span className="badge-pill">02 / PROFESSION</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <p className="label plain" style={{ marginBottom: 12 }}>My Discipline & Category</p>
            <input type="hidden" name="industry_category" value={category} />
            <div className="chip-row">
              {INDUSTRY_CATEGORIES.map((c) => {
                const isSelected = category === c;
                return (
                  <button
                    key={c}
                    type="button"
                    className={isSelected ? "chip selected" : "chip"}
                    onClick={() => setCategory(c)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      borderColor: isSelected ? "var(--accent-2)" : undefined,
                    }}
                  >
                    <span>{CATEGORY_ICONS[c]}</span>
                    <span>{c}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <label>
            <span className="label">Professional Title</span>
            <input
              name="professional_title"
              className="input"
              defaultValue={profile?.professional_title ?? ""}
              placeholder="e.g. Lead AI Systems Engineer, 3D Product Designer"
              required
              style={{ marginBottom: 0 }}
            />
          </label>

          <div style={{ marginTop: 8 }}>
            <p className="label plain" style={{ marginBottom: 12 }}>I am looking for a partner in...</p>
            <input type="hidden" name="looking_for_category" value={lookingCategory} />
            <div className="chip-row">
              {INDUSTRY_CATEGORIES.map((c) => {
                const isSelected = lookingCategory === c;
                return (
                  <button
                    key={c}
                    type="button"
                    className={isSelected ? "chip selected" : "chip"}
                    onClick={() => setLookingCategory(c)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      borderColor: isSelected ? "var(--accent)" : undefined,
                      background: isSelected ? "linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%)" : undefined,
                    }}
                  >
                    <span>{CATEGORY_ICONS[c]}</span>
                    <span>{c}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <label>
            <span className="label">Target Partner Title</span>
            <input
              name="looking_for_title"
              className="input"
              defaultValue={profile?.looking_for_title ?? ""}
              placeholder="e.g. Full-Stack Dev, Growth Hacker, Hardware Architect"
              required
              style={{ marginBottom: 0 }}
            />
          </label>
        </div>
      </section>

      {/* 3. The Vibe */}
      <section className="glass-panel" style={{ padding: 32 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, borderBottom: "1px solid var(--stroke)", paddingBottom: 12 }}>
          <h3 style={{ margin: 0 }}>3. The Vibe</h3>
          <span className="badge-pill">03 / THE VIBE</span>
        </div>

        <p className="sub" style={{ margin: "0 0 24px 0", fontSize: 14 }}>
          4-dimensional rhythm calibration. The protocol matches you with operators who share or complement your working tempo.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {SLIDERS.map((s) => (
            <label key={s.name} className="slider-block" style={{ marginBottom: 0 }}>
              <span className="slider-meta" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontWeight: 700, color: "var(--text-bright)" }}>
                  {s.label}: <span style={{ color: "var(--muted)", fontWeight: 400 }}>{s.left}</span>
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span className="score-badge" style={{ padding: "2px 8px", minWidth: 28, fontSize: 12, borderRadius: 6 }}>
                    {sliderValues[s.name]}
                  </span>
                  <span style={{ color: "var(--muted)", fontWeight: 400 }}>{s.right}</span>
                </span>
              </span>
              <input
                type="range"
                name={s.name}
                min={1}
                max={5}
                defaultValue={3}
                onChange={(e) =>
                  setSliderValues((prev) => ({
                    ...prev,
                    [s.name]: Number(e.target.value),
                  }))
                }
              />
            </label>
          ))}
        </div>
      </section>

      {state?.error ? <div className="error">{state.error}</div> : null}

      <button
        className="primary-btn"
        type="submit"
        disabled={pending}
        style={{ padding: "16px 36px", fontSize: 16 }}
      >
        {pending ? "Calibrating & Saving Profile…" : "Complete Profile & Launch Protocol ⚡"}
      </button>
    </form>
  );
}
```

---

## 5. Verification Method

To independently verify the implementation and functional invariants:

### 5.1 Static Analysis & Build Verification
```powershell
npm run build
```
*Expected Result*: 0 TypeScript errors and 0 ESLint errors across all App Router routes.

### 5.2 Automated E2E Test Suite Execution
```powershell
npx tsx --test test/e2e/tier1_features.test.ts
npx tsx --test test/e2e/tier2_boundaries.test.ts
```
*Verification Checks*:
- [ ] `F15-1`: Messages page redirects unauthenticated visitors to `/login`.
- [ ] `F15-2`: Renders empty state with `empty-messages-chat.png` when active connections is 0.
- [ ] `F15-3`: `ChatInterface` provides realtime message list and Supabase channel subscription.
- [ ] `F15-4`: Supports sending new chat messages with validation (`sendMessage`, `inputText`).
- [ ] `F15-5`: Supports proposing milestone partnership contracts (`proposePartnership`, `price_amount`, `deliverables`).
- [ ] `F15-6`: Displays partnership contract cards with price and deliverables.
- [ ] `F16-1` to `F16-6`: OnboardingForm preserves 3-step sections (`1. Identity`, `2. Profession`, `3. The Vibe`), pattern regex `[A-Za-z0-9_ ]{2,32}`, category chips, vibe sliders, and `saveOnboarding`.
- [ ] `F15-B1` to `F15-B5`: Boundary validation on messages and milestone contracts.
- [ ] `F16-B1` to `F16-B5`: Boundary validation on codenames and vibe ratings.
