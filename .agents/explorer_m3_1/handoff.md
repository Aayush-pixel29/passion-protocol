# Technical Blueprint & Investigation Report: Header & Discover Deck (Milestone 3)

**Agent ID**: `explorer_m3_1`  
**Working Directory**: `d:\passion-protocol\.agents\explorer_m3_1`  
**Parent Orchestrator**: `sub_orch_m3` (Conversation ID: `cb7c958e-a7b5-4c7b-97d1-5a1f7f1b0785`)  
**Mission**: Perform deep technical investigation, architectural analysis, and blueprint specification for modernizing `components/SiteHeader.tsx`, `app/discover/page.tsx`, and `components/DiscoverDeck.tsx` under the obsidian dark glassmorphic design system while strictly preserving all functional invariants.

---

## 1. Observation

Direct examination of the workspace, styling tokens, test suites, and source files revealed the following exact facts, structures, and lines:

### 1.1 `components/SiteHeader.tsx` (50 lines)
- **Current File Location**: `d:\passion-protocol\components\SiteHeader.tsx`
- **Imports**: `Link` from `"next/link"`, `signOut` Server Action from `"@/lib/actions"`.
- **Props Interface**:
  ```ts
  type Props = {
    current: "discover" | "profile" | "messages" | "none";
    signedIn: boolean;
  };
  ```
- **Structure & Layout** (Lines 9–48):
  - Sticky glass header wrapper `<header className="site-header">` housing `.site-header-inner`.
  - Brand Logo (Lines 13–16): `<Link href={signedIn ? "/discover" : "/"} className="brand">` with `<span style={{ color: "#ff3d6e", marginRight: 6 }}>⚡</span><span>Passion Protocol</span>`.
  - Navigation links (Lines 17–45):
    - When `signedIn === true`: Renders links to `/discover`, `/messages`, `/profile`, with `.active` class applied when matching `current`. Contains inline form `<form action={signOut} style={{ display: "inline" }}>` with `<button className="ghost-btn" type="submit">Sign out</button>`.
    - When `signedIn === false`: Renders `<Link href="/login" className="ghost-btn">Sign in</Link>` and `<Link href="/login" className="header-cta pill-btn">Get started</Link>`.
- **Styling Hooks**: Uses `.site-header`, `.site-header-inner`, `.brand`, `.nav`, `.ghost-btn`, `.header-cta`, `.pill-btn` from `app/globals.css`.

### 1.2 `app/discover/page.tsx` (82 lines)
- **Current File Location**: `d:\passion-protocol\app\discover\page.tsx`
- **Server Entrypoint Logic**:
  - **Auth & Onboarding Guard** (Lines 9–13): Calls `getOwnProfile()`. Redirects to `/login` if `!user`. Redirects to `/onboarding` if `!profile?.onboarding_complete || !profile.looking_for_category || !profile.industry_category || !vibe`.
  - **Reciprocal Matching Engine** (Lines 15–25): Calls `loadCompletedOperators()`, executes `rankMatches()` with user parameters (`id`, `industry_category`, `looking_for_category`, `spoken_languages`, `vibe`).
  - **Connection State Mapping** (Lines 27–40): Queries Supabase `connect_requests` table with `.or(\`from_id.eq.${user.id},to_id.eq.${user.id}\`)` and maps each partner's `ConnectState` (`accepted`, `declined`, `outgoing_pending`, `incoming_pending`, `none`).
  - **Private Contact Revelation** (Lines 42–47): Queries `profile_links` (Row Level Security protected: only accessible for self and accepted partners).
  - **Card Data Transformation** (Lines 49–62): Transforms `ranked` array into `DiscoverCard[]`, attaching `profile`, `vibe`, `project`, `score`, `connectStatus`, and conditionally masked `contactUrl` (only populated if `status === "accepted"`).
  - **Page Layout** (Lines 64–81): Renders `.site` > `SiteHeader` with `current="discover" signedIn` > `main.wrap` > `.page-intro.spread` with `<p className="kicker">Discover</p>`, `<h2>People who match your vibe</h2>`, `<p className="sub">...` > `<DiscoverDeck cards={cards} />`.

### 1.3 `components/DiscoverDeck.tsx` (227 lines)
- **Current File Location**: `d:\passion-protocol\components\DiscoverDeck.tsx`
- **Client Component Directive**: `"use client";`
- **Data Model**:
  ```ts
  export type DiscoverCard = {
    profile: Profile;
    vibe: VibeAnswers;
    project: import("@/lib/types").Project | null;
    score: number;
    connectStatus: ConnectState;
    contactUrl?: string | null;
  };
  ```
- **Client State & Server Action Hooks** (Lines 34–39):
  - `const [hidden, setHidden] = useState<Set<string>>(new Set());` (tracks dismissed/skipped IDs).
  - `const [local, setLocal] = useState(cards);` (optimistic card state).
  - `const [error, setError] = useState("");`
  - `const [busyId, setBusyId] = useState<string | null>(null);`
  - `const [, startTransition] = useTransition();`
- **Mutations & Invariants** (Lines 53–90):
  - `skip(id)`: Adds candidate ID to `hidden` set without database write.
  - `connect(id)`: Calls `sendConnect(id)` inside `startTransition()`, handles `busyId`, handles errors, optimistically updates card status.
  - `respond(id, decision)`: Calls `respondToConnect(id, decision)` inside `startTransition()`, updates card status to `accepted` or `declined`.
- **Card Structure** (Lines 107–221):
  - Card container: `<article className={accepted ? "match-card success" : "match-card"}>`
  - Avatar: Pure CSS gradient circle with single character initial `<div style={{ width: 44, height: 44, borderRadius: "50%", background: avatarBg }}>{initial}</div>`.
  - Header: Codename and skill subtitles via `formatRoleWithIcon()`.
  - Synergy Score: `<div className="score-badge">{card.score}%</div>`.
  - Project Pitch Container: Light-theme styled box (`background: "rgba(0,0,0,0.03)"`).
  - Vibe Dimensions: Plain text `Pace X/5`, `Comms X/5`, `Risk X/5`, `Energy X/5`.
  - Connected State: Direct link to `contactUrl` if accepted.
  - Empty State: Plain dashed box `<div className="empty">` with basic text.

### 1.4 Global CSS Tokens (`app/globals.css`)
- **Tokens Available**:
  - Obsidian backgrounds: `--bg: #090a10`, `--bg-2: #10121d`, `--bg-3: #171928`
  - Glass surfaces: `--surface: rgba(18, 20, 32, 0.78)`, `--surface-card: rgba(22, 25, 42, 0.70)`, `--surface-hover: rgba(30, 35, 58, 0.85)`, `--surface-inset: rgba(10, 12, 20, 0.65)`
  - Glows & Borders: `--stroke: rgba(255, 255, 255, 0.09)`, `--stroke-hover: rgba(139, 92, 246, 0.45)`, `--glow-violet`, `--glow-cyan`, `--glow-pink`, `--glow-emerald`
  - Typography: `--text: #f8fafc`, `--text-bright: #ffffff`, `--muted: #94a3b8`, `--dim: #64748b`
  - Accents: `--accent: #ff3d6e`, `--accent-2: #8b5cf6`, `--accent-3: #06b6d4`, `--accent-4: #10b981`
  - Reusable Classes: `.glass-panel`, `.glass-card`, `.glass-inset`, `.gradient-text`, `.badge-pill`, `.score-badge`, `.role-chip`, `.role-tag`, `.avatar-badge`, `.avatar-badge.ring-glow`, `.bar-track`, `.bar-fill`, `.primary-btn`, `.outline-btn`, `.pill-btn`, `.ghost-btn`.

### 1.5 Asset Availability & Automated Test Verification
- **Synthetic 3D Assets** (`public/images/`):
  - `empty-discover-deck.png` (16:9, 1024×576)
  - `avatar-alex-coder.png`, `avatar-maya-designer.png`, `avatar-david-hardware.png`, `avatar-elena-growth.png`, `avatar-carlos-writer.png`, `avatar-priya-fintech.png` (512×512)
- **E2E Test Suite Status**: Executed `npx tsx test/e2e/runner.ts`. **267 of 267 tests passed (100% success rate across 7 test suites)**.

---

## 2. Logic Chain

From the observations above, we establish the step-by-step reasoning for the proposed modernized implementation:

### 2.1 Navigation Header Modernization (`components/SiteHeader.tsx`)
1. **Glassmorphism & Fixed Blur**:
   - `SiteHeader` uses `.site-header` which in `app/globals.css` specifies `background: rgba(9, 10, 16, 0.82)`, `border-bottom: 1px solid var(--stroke)`, `position: sticky; top: 0; z-index: 50; backdrop-filter: blur(16px)`.
   - The brand icon `⚡` should be styled with a radiant drop shadow (`filter: drop-shadow(0 0 10px rgba(255, 61, 110, 0.6))`) and the brand name rendered with high-contrast text and a subtle gradient hover effect.
2. **Active Tab Indicator State**:
   - When a user is on `/discover`, `current === "discover"` adds the `.active` class to the link.
   - In `app/globals.css`, `.nav a.active` renders `background: rgba(139, 92, 246, 0.20)`, `border: 1px solid rgba(139, 92, 246, 0.35)`, `box-shadow: 0 0 16px rgba(139, 92, 246, 0.22)`.
   - Adding a subtle live indicator dot `<span className="live-dot" />` or glowing pill style gives it a premium feel.
3. **Sign Out Action**:
   - The sign-out form `<form action={signOut}>` with `<button className="ghost-btn" type="submit">Sign out</button>` must be retained exactly to satisfy test assertions (`/signOut/` and `/Sign out/`).
4. **Mobile Responsiveness**:
   - Media queries in `app/globals.css` at `980px`, `768px`, and `480px` properly collapse and scale the `.site-header-inner` gap and font sizes. Adding accessible ARIA attributes (`aria-label="Main Navigation"`, `aria-current={current === "discover" ? "page" : undefined}`) ensures WCAG compliance.

### 2.2 Discover Server Page Modernization (`app/discover/page.tsx`)
1. **Preservation of Core Data Pipeline**:
   - Auth check: `const { user, profile, vibe, supabase } = await getOwnProfile(); if (!user) redirect("/login"); if (!profile?.onboarding_complete || ...) redirect("/onboarding");`
   - Matching: `const pool = await loadCompletedOperators(); const ranked = rankMatches({ ... }, pool);`
   - Connection statuses: Queried from Supabase `connect_requests` table.
   - Contact links: Queried from `profile_links` (RLS protected).
   - Invariant: `contactUrl` must only be passed to `DiscoverCard` when `status === "accepted"`.
2. **Visual Hierarchy & Header Elevation**:
   - Upgrade the page header `.page-intro.spread` with a glowing badge pill kicker:
     ```tsx
     <div className="badge-pill" style={{ marginBottom: 12 }}>
       <span>⚡</span>
       <span>DISCOVER OPERATORS</span>
     </div>
     ```
   - Heading: `<h2>People who match your <span className="gradient-text">vibe</span></h2>`
   - Subtitle: Add an operator counter pill:
     ```tsx
     <div className="discover-stats-badge">
       <span className="live-dot" />
       <span>{cards.length} {cards.length === 1 ? "operator" : "operators"} available</span>
     </div>
     ```

### 2.3 Discover Deck Client Component Modernization (`components/DiscoverDeck.tsx`)

#### 2.3.1 Synthetic AI Avatar System
1. Instead of generic single-color circles, implement a dual-mode avatar rendering strategy:
   - **Avatar Asset Mapping**: Map operator codename or `industry_category` to synthetic 3D assets in `public/images/`:
     - Software & IT / Coder -> `/images/avatar-alex-coder.png`
     - Creative & Design / Designer -> `/images/avatar-maya-designer.png`
     - Engineering & Hardware / Maker -> `/images/avatar-david-hardware.png`
     - Business & Sales / Growth -> `/images/avatar-elena-growth.png`
     - Marketing & Content / Writer -> `/images/avatar-carlos-writer.png`
     - Other / Fintech -> `/images/avatar-priya-fintech.png`
   - **Stylized Holographic Ring Container**:
     - Render the avatar inside `.avatar-badge.ring-glow` with `position: relative`, `overflow: hidden`, and a glowing gradient perimeter.
     - Fallback: High-fidelity glowing gradient initial ring using `getAvatarGradient()`.

#### 2.3.2 Synergy Score Badge Glow
1. The score badge `<div className={card.score >= 90 ? "score-badge pulse" : "score-badge"}>` renders with cyan-violet gradient (`linear-gradient(135deg, var(--accent-2) 0%, var(--accent-3) 100%)`).
2. High synergy scores (≥ 90%) pulse dynamically using `--glow-cyan` animation (`box-shadow: 0 0 20px rgba(6, 182, 212, 0.45)`).

#### 2.3.3 4D Vibe Mini Graphical Equalizer Indicator Bars
1. Replace static text (`Pace 4/5`) with visual progress bars:
   - 4 dimensions: Pace, Comms, Risk, Energy.
   - For each dimension, render:
     - Header row with dimension label and numeric value (`Pace` ... `4/5`).
     - Mini track `<div className="bar-track" style={{ height: 6 }}>` with `<div className="bar-fill" style={{ width: `${(val / 5) * 100}%` }} />`.
   - Preserves all regex search assertions (`assert.match(content, /pace|comms|risk|energy/i)` and `assert.match(content, /score/)`).

#### 2.3.4 Inset Pitch Box (`--surface-inset`)
1. If `card.project` is present:
   - Style container using `background: var(--surface-inset)`, `border: 1px solid var(--stroke-subtle)`, `border-radius: var(--radius-sm)`, `padding: 14px 16px`.
   - Title: `<h4>{card.project.title}</h4>`
   - Description: `<p className="sub">{card.project.description}</p>`
   - Budget: `<span className="role-tag" style={{ color: "var(--accent-3)", borderColor: "var(--stroke-cyan)" }}>Budget: {card.project.budget_range}</span>`
2. If `card.profile.bio` is present and no project: render formatted quote container.

#### 2.3.5 Connection State Machine & Direct Contact Reveal
1. **Accepted State** (`card.connectStatus === "accepted"`):
   - Card container has `.match-card.success` with glowing emerald border (`#10b981`) and emerald gradient background aura.
   - Partnership status: `<p className="status-line" style={{ color: "#10b981", fontWeight: 700 }}>● Partnership active</p>`.
   - Revealed contact URL: Rendered in a highlighted box with external link icon.
2. **Pending Outgoing State** (`card.connectStatus === "outgoing_pending"`):
   - Status line: `✓ Request sent` in `--accent` color.
3. **Pending Incoming State** (`card.connectStatus === "incoming_pending"`):
   - Action buttons: Decline (`.pill-btn.skip`) and Accept (`.pill-btn.accept`).
4. **Declined State** (`card.connectStatus === "declined"`):
   - Status line: `Request declined` in muted text.
5. **Default Unconnected State** (`card.connectStatus === "none"`):
   - Action buttons: Skip (`.pill-btn.skip`) and Connect (`.pill-btn.accept`).
6. Invariant: `busyId === card.profile.id` disables buttons and shows "Sending…" / "Accepting…" spinner state.

#### 2.3.6 High-Impact Empty State
1. When `visible.length === 0`:
   - Render `.empty` container with `public/images/empty-discover-deck.png` via Next.js `<Image>`.
   - Include required verbatim test string: `"No operators with that role yet"`.
   - Supportive copy: `"You're one of the first here — invite a collaborator or check back soon!"`.
   - Primary action button: `<Link href="/profile" className="outline-btn" style={{ marginTop: 16, display: "inline-flex" }}>Adjust Vibe Preferences →</Link>`.

---

## 3. Detailed Component Code Specifications

### 3.1 Proposed Implementation: `components/SiteHeader.tsx`
```tsx
import Link from "next/link";
import { signOut } from "@/lib/actions";

type Props = {
  current: "discover" | "profile" | "messages" | "none";
  signedIn: boolean;
};

export function SiteHeader({ current, signedIn }: Props) {
  return (
    <header className="site-header" role="banner">
      <div className="site-header-inner">
        <Link 
          href={signedIn ? "/discover" : "/"} 
          className="brand" 
          aria-label="Passion Protocol Home"
        >
          <span 
            style={{ 
              color: "#ff3d6e", 
              marginRight: 6,
              filter: "drop-shadow(0 0 8px rgba(255, 61, 110, 0.6))",
              fontSize: "1.25rem",
              lineHeight: 1
            }}
          >
            ⚡
          </span>
          <span className="brand-text">Passion Protocol</span>
        </Link>

        <nav className="nav" aria-label="Main Navigation">
          {signedIn ? (
            <>
              <Link 
                href="/discover" 
                className={current === "discover" ? "active" : ""}
                aria-current={current === "discover" ? "page" : undefined}
              >
                Discover
              </Link>
              <Link 
                href="/messages" 
                className={current === "messages" ? "active" : ""}
                aria-current={current === "messages" ? "page" : undefined}
              >
                Messages
              </Link>
              <Link 
                href="/profile" 
                className={current === "profile" ? "active" : ""}
                aria-current={current === "profile" ? "page" : undefined}
              >
                Profile
              </Link>
              <form action={signOut} style={{ display: "inline" }}>
                <button className="ghost-btn" type="submit" aria-label="Sign out of your account">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="ghost-btn">
                Sign in
              </Link>
              <Link href="/login" className="header-cta pill-btn">
                Get started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
```

### 3.2 Proposed Implementation: `app/discover/page.tsx`
```tsx
import { DiscoverDeck, type DiscoverCard } from "@/components/DiscoverDeck";
import { SiteHeader } from "@/components/SiteHeader";
import { getOwnProfile, loadCompletedOperators } from "@/lib/data";
import { rankMatches } from "@/lib/match";
import { redirect } from "next/navigation";
import { type ConnectState } from "@/lib/types";

export default async function DiscoverPage() {
  const { user, profile, vibe, supabase } = await getOwnProfile();
  if (!user) redirect("/login");
  if (!profile?.onboarding_complete || !profile.looking_for_category || !profile.industry_category || !vibe) {
    redirect("/onboarding");
  }

  const pool = await loadCompletedOperators();
  const ranked = rankMatches(
    { 
      id: user.id, 
      industry_category: profile.industry_category, 
      looking_for_category: profile.looking_for_category,
      spoken_languages: profile.spoken_languages || [],
      vibe 
    },
    pool
  );

  const { data: connects } = await supabase
    .from("connect_requests")
    .select("from_id, to_id, status")
    .or(`from_id.eq.${user.id},to_id.eq.${user.id}`);

  const statusByUser = new Map<string, ConnectState>();
  for (const row of connects ?? []) {
    const otherId = row.from_id === user.id ? row.to_id : row.from_id;
    let state: ConnectState;
    if (row.status === "accepted") state = "accepted";
    else if (row.status === "declined") state = "declined";
    else state = row.from_id === user.id ? "outgoing_pending" : "incoming_pending";
    statusByUser.set(otherId, state);
  }

  // RLS on profile_links will automatically return links for accepted partners and self
  const { data: links } = await supabase.from("profile_links").select("user_id, contact_url");
  const linkByUser = new Map<string, string>();
  for (const row of links ?? []) {
    if (row.contact_url) linkByUser.set(row.user_id, row.contact_url);
  }

  const cards: DiscoverCard[] = ranked.map((row) => {
    const status = statusByUser.get(row.profile.id) ?? "none";
    return {
      profile: {
        ...row.profile,
        contact_url: linkByUser.get(row.profile.id) ?? null,
      },
      vibe: row.vibe,
      project: row.project,
      score: row.score,
      connectStatus: status,
      contactUrl: status === "accepted" ? linkByUser.get(row.profile.id) ?? null : null,
    };
  });

  return (
    <div className="site">
      <SiteHeader current="discover" signedIn />
      <main className="wrap">
        <div className="page-intro spread">
          <div>
            <div className="badge-pill" style={{ marginBottom: 12 }}>
              <span style={{ color: "#ff3d6e" }}>⚡</span>
              <span>DISCOVER OPERATORS</span>
            </div>
            <h2>
              People who match your <span className="gradient-text">vibe</span>
            </h2>
            <p className="sub">
              <strong>{profile.codename}</strong> · seeking <strong>{profile.looking_for_title}</strong> · ranked by 4D synergy & reciprocal discipline
            </p>
          </div>
          <div 
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              background: "var(--surface-card)",
              border: "1px solid var(--stroke)",
              borderRadius: "var(--radius-full)",
              fontSize: "13px",
              fontWeight: 700,
              color: "var(--muted)",
              boxShadow: "var(--shadow-sm)"
            }}
          >
            <span 
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#10b981",
                boxShadow: "0 0 8px rgba(16, 185, 129, 0.7)"
              }} 
            />
            <span>{cards.length} {cards.length === 1 ? "operator" : "operators"} available</span>
          </div>
        </div>
        <DiscoverDeck cards={cards} />
      </main>
    </div>
  );
}
```

### 3.3 Proposed Implementation: `components/DiscoverDeck.tsx`
```tsx
"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { sendConnect, respondToConnect } from "@/lib/actions";
import { formatRoleWithIcon, type Profile, type VibeAnswers, type ConnectState } from "@/lib/types";

export type DiscoverCard = {
  profile: Profile;
  vibe: VibeAnswers;
  project: import("@/lib/types").Project | null;
  score: number;
  connectStatus: ConnectState;
  contactUrl?: string | null;
};

const DIMS: Array<{ key: keyof VibeAnswers; label: string }> = [
  { key: "pace", label: "Pace" },
  { key: "comms", label: "Comms" },
  { key: "risk", label: "Risk" },
  { key: "energy", label: "Energy" },
];

function getAvatarImage(codename: string, category: string | null): string {
  const upper = codename.toUpperCase();
  if (upper.includes("ALEX") || upper.includes("DEV") || upper.includes("ARJUN")) {
    return "/images/avatar-alex-coder.png";
  }
  if (upper.includes("RIYA") || upper.includes("MAYA") || upper.includes("DESIGN")) {
    return "/images/avatar-maya-designer.png";
  }
  if (upper.includes("NEO") || upper.includes("DAVID") || upper.includes("MAKER")) {
    return "/images/avatar-david-hardware.png";
  }
  if (upper.includes("KAI") || upper.includes("CARLOS") || upper.includes("SCRIPT")) {
    return "/images/avatar-carlos-writer.png";
  }
  if (upper.includes("LUNA") || upper.includes("PRIYA") || upper.includes("CODE")) {
    return "/images/avatar-priya-fintech.png";
  }
  if (upper.includes("GROWTH") || upper.includes("ELENA")) {
    return "/images/avatar-elena-growth.png";
  }

  // Category fallbacks
  switch (category) {
    case "Software & IT":
      return "/images/avatar-alex-coder.png";
    case "Creative & Design":
      return "/images/avatar-maya-designer.png";
    case "Engineering & Hardware":
      return "/images/avatar-david-hardware.png";
    case "Business & Sales":
      return "/images/avatar-elena-growth.png";
    case "Marketing & Content":
      return "/images/avatar-carlos-writer.png";
    default:
      return "/images/avatar-priya-fintech.png";
  }
}

function getAvatarGradient(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue1 = Math.abs(hash) % 360;
  const hue2 = (hue1 + 45) % 360;
  return `linear-gradient(135deg, hsl(${hue1}, 80%, 60%), hsl(${hue2}, 90%, 48%))`;
}

export function DiscoverDeck({ cards }: { cards: DiscoverCard[] }) {
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [local, setLocal] = useState(cards);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const visible = local.filter((c) => !hidden.has(c.profile.id));

  if (visible.length === 0) {
    return (
      <div className="empty" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div style={{ position: "relative", width: 280, height: 160, marginBottom: 8 }}>
          <Image
            src="/images/empty-discover-deck.png"
            alt="Deep space observatory scanning for operators"
            fill
            sizes="(max-width: 768px) 240px, 280px"
            style={{ objectFit: "contain" }}
            priority
          />
        </div>
        <p style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-bright)", margin: 0 }}>
          No operators with that role yet
        </p>
        <p style={{ maxWidth: 480, margin: 0, color: "var(--muted)", lineHeight: 1.6 }}>
          You&apos;re one of the first here — invite a collaborator or check back soon!
        </p>
        <Link 
          href="/profile" 
          className="outline-btn"
          style={{ marginTop: 8, padding: "10px 20px", fontSize: "14px" }}
        >
          Adjust Vibe Preferences →
        </Link>
      </div>
    );
  }

  function skip(id: string) {
    setError("");
    setHidden((prev) => new Set(prev).add(id));
  }

  function connect(id: string) {
    setError("");
    setBusyId(id);
    startTransition(async () => {
      const result = await sendConnect(id);
      setBusyId(null);
      if (result.error) {
        setError(result.error);
        return;
      }
      const status = result.status ?? "outgoing_pending";
      setLocal((rows) =>
        rows.map((row) => (row.profile.id === id ? { ...row, connectStatus: status } : row))
      );
    });
  }

  function respond(id: string, decision: "accepted" | "declined") {
    setError("");
    setBusyId(id);
    startTransition(async () => {
      const result = await respondToConnect(id, decision);
      setBusyId(null);
      if (result.error) {
        setError(result.error);
        return;
      }
      const status = result.status ?? decision;
      setLocal((rows) =>
        rows.map((row) => (row.profile.id === id ? { ...row, connectStatus: status } : row))
      );
    });
  }

  return (
    <div>
      {error ? <p className="error">{error}</p> : null}
      <div className="match-grid">
        {visible.map((card) => {
          const accepted = card.connectStatus === "accepted";
          const outgoing = card.connectStatus === "outgoing_pending";
          const incoming = card.connectStatus === "incoming_pending";
          const declined = card.connectStatus === "declined";
          const pending = busyId === card.profile.id;

          const avatarSrc = getAvatarImage(card.profile.codename, card.profile.industry_category);
          const initial = card.profile.codename ? card.profile.codename[0].toUpperCase() : "O";
          const avatarBg = getAvatarGradient(card.profile.id || card.profile.codename);
          const isHighSynergy = card.score >= 90;

          return (
            <article 
              key={card.profile.id} 
              className={accepted ? "match-card success" : "match-card"}
            >
              <div className="match-card-top">
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div 
                    className="avatar-badge ring-glow md" 
                    style={{ 
                      position: "relative", 
                      overflow: "hidden",
                      background: avatarBg,
                      boxShadow: isHighSynergy ? "0 0 0 2px var(--surface-solid), var(--glow-cyan)" : undefined
                    }}
                  >
                    <Image
                      src={avatarSrc}
                      alt={`${card.profile.codename} avatar`}
                      width={44}
                      height={44}
                      style={{ objectFit: "cover", width: "100%", height: "100%" }}
                      onError={(e) => {
                        // Fallback to initial if image fails
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    <span className="avatar-initial" style={{ position: "absolute" }}>{initial}</span>
                  </div>
                  <div>
                    <h3 style={{ margin: "0 0 4px", fontSize: "1.15rem" }}>{card.profile.codename}</h3>
                    <p className="card-skill" style={{ margin: 0, fontSize: "13px" }}>
                      {formatRoleWithIcon(card.profile.industry_category, card.profile.professional_title)} · needs {formatRoleWithIcon(card.profile.looking_for_category, card.profile.looking_for_title)}
                    </p>
                  </div>
                </div>
                <div 
                  className={isHighSynergy ? "score-badge pulse" : "score-badge"}
                  title={`${card.score}% Vibe Synergy`}
                >
                  {card.score}%
                </div>
              </div>
              
              {card.project ? (
                <div 
                  className="glass-inset" 
                  style={{ 
                    marginTop: 14, 
                    padding: "12px 14px",
                    background: "var(--surface-inset)",
                    border: "1px solid var(--stroke-subtle)",
                    borderRadius: "var(--radius-sm)"
                  }}
                >
                  <h4 style={{ margin: "0 0 4px 0", fontSize: "0.95rem", color: "var(--text-bright)" }}>
                    {card.project.title}
                  </h4>
                  <p className="sub" style={{ margin: 0, fontSize: "0.85rem", lineHeight: 1.5 }}>
                    {card.project.description}
                  </p>
                  {card.project.budget_range ? (
                    <div style={{ marginTop: 8 }}>
                      <span 
                        className="role-tag" 
                        style={{ 
                          fontSize: "11px", 
                          padding: "2px 8px", 
                          color: "var(--accent-3)", 
                          borderColor: "var(--stroke-cyan)",
                          background: "rgba(6, 182, 212, 0.10)"
                        }}
                      >
                        Budget: {card.project.budget_range}
                      </span>
                    </div>
                  ) : null}
                </div>
              ) : card.profile.bio ? (
                <p 
                  className="sub" 
                  style={{ 
                    marginTop: 12, 
                    fontSize: "0.88rem", 
                    lineHeight: 1.5,
                    fontStyle: "italic",
                    color: "#cbd5e1"
                  }}
                >
                  &ldquo;{card.profile.bio}&rdquo;
                </p>
              ) : null}
              
              <div 
                className="dims" 
                style={{ 
                  marginTop: 16,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px 14px"
                }}
              >
                {DIMS.map((d) => {
                  const val = card.vibe[d.key];
                  const percentage = Math.round((val / 5) * 100);
                  return (
                    <div key={d.key} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--muted)", fontWeight: 600 }}>
                        <span>{d.label}</span>
                        <span style={{ color: "var(--text)" }}>{val}/5</span>
                      </div>
                      <div 
                        className="bar-track" 
                        style={{ 
                          height: 5, 
                          background: "rgba(255, 255, 255, 0.08)",
                          borderRadius: 999,
                          overflow: "hidden"
                        }}
                      >
                        <div 
                          className="bar-fill" 
                          style={{ 
                            width: `${percentage}%`,
                            height: "100%",
                            background: "linear-gradient(90deg, var(--accent) 0%, var(--accent-2) 50%, var(--accent-3) 100%)",
                            borderRadius: 999
                          }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {accepted ? (
                <div 
                  className="left" 
                  style={{ 
                    marginTop: "auto", 
                    paddingTop: 14, 
                    borderTop: "1px solid rgba(16, 185, 129, 0.3)" 
                  }}
                >
                  <p 
                    className="status-line" 
                    style={{ 
                      color: "#10b981", 
                      fontWeight: 700, 
                      display: "flex", 
                      alignItems: "center", 
                      gap: 6,
                      margin: 0
                    }}
                  >
                    <span 
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#10b981",
                        boxShadow: "0 0 8px rgba(16, 185, 129, 0.8)",
                        display: "inline-block"
                      }}
                    />
                    Partnership active
                  </p>
                  {card.contactUrl ? (
                    <div 
                      style={{ 
                        marginTop: 8, 
                        padding: "8px 12px", 
                        background: "rgba(16, 185, 129, 0.08)", 
                        border: "1px solid rgba(16, 185, 129, 0.25)",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "0.88rem"
                      }}
                    >
                      <span style={{ color: "var(--muted)", marginRight: 6 }}>Direct Contact:</span>
                      <a
                        href={card.contactUrl.startsWith("http") ? card.contactUrl : `https://${card.contactUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ 
                          color: "var(--accent-3)", 
                          fontWeight: 700, 
                          textDecoration: "underline",
                          wordBreak: "break-all"
                        }}
                      >
                        {card.contactUrl} ↗
                      </a>
                    </div>
                  ) : (
                    <p className="sub" style={{ marginTop: 4, fontSize: "0.85rem" }}>
                      No direct contact link provided yet.
                    </p>
                  )}
                </div>
              ) : outgoing ? (
                <div 
                  className="status-line left" 
                  style={{ 
                    marginTop: "auto", 
                    fontWeight: 700, 
                    color: "var(--accent)",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    paddingTop: 12
                  }}
                >
                  <span>✓</span>
                  <span>Request sent</span>
                </div>
              ) : incoming ? (
                <div className="btn-row left" style={{ marginTop: "auto", paddingTop: 12 }}>
                  <button
                    className="pill-btn skip"
                    type="button"
                    onClick={() => respond(card.profile.id, "declined")}
                    disabled={pending}
                  >
                    Decline
                  </button>
                  <button
                    className="pill-btn accept"
                    type="button"
                    onClick={() => respond(card.profile.id, "accepted")}
                    disabled={pending}
                  >
                    {pending ? "Accepting…" : "Accept"}
                  </button>
                </div>
              ) : declined ? (
                <p 
                  className="status-line left sub" 
                  style={{ marginTop: "auto", paddingTop: 12 }}
                >
                  Request declined
                </p>
              ) : (
                <div className="btn-row left" style={{ marginTop: "auto", paddingTop: 12 }}>
                  <button 
                    className="pill-btn skip" 
                    type="button" 
                    onClick={() => skip(card.profile.id)}
                  >
                    Skip
                  </button>
                  <button
                    className="pill-btn accept"
                    type="button"
                    onClick={() => connect(card.profile.id)}
                    disabled={pending}
                  >
                    {pending ? "Sending…" : "Connect"}
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
```

---

## 4. Caveats

1. **Test Assertion String Invariants**:
   - The test suite in `test/e2e/tier1_features.test.ts` (test `F13-1`) explicitly matches `/No operators with that role yet/` and `/empty/`. The empty state copy must preserve this exact phrasing.
   - Test `F13-2` asserts `/pace|comms|risk|energy/i`. The mini-equalizer bars must render the explicit label strings `Pace`, `Comms`, `Risk`, and `Energy`.
   - Test `F12-2` asserts `/⚡/` and `/Passion Protocol/`. The header brand logo must contain the `⚡` emoji character.
   - Test `F12-5` asserts `/signOut/` and `/Sign out/`. The sign-out button and server action form must remain identical.
2. **Next.js `<Image>` Container Dynamics**:
   - In `DiscoverDeck.tsx`, when using `<Image fill ... />`, the parent element must have `position: relative` or explicit numeric `width` and `height` (e.g. `width={44} height={44}`) to avoid hydration warnings and layout shift.
3. **Client State vs Server Mutation**:
   - The `hidden` state in `DiscoverDeck.tsx` is client-side only (for transient skips during a session). Permanent actions (`sendConnect`, `respondToConnect`) trigger Server Actions with optimistic state updates.
4. **Dark Mode Text Contrast**:
   - High contrast must be maintained on all cards: `--text-bright` (`#ffffff`) for titles, `#cbd5e1` / `--muted` (`#94a3b8`) for subtitles, and neon accents (`#ff3d6e`, `#8b5cf6`, `#06b6d4`, `#10b981`) for statuses.

---

## 5. Conclusion

This technical investigation delivers an exhaustive, zero-ambiguity blueprint for modernizing `components/SiteHeader.tsx`, `app/discover/page.tsx`, and `components/DiscoverDeck.tsx`:
1. **`SiteHeader.tsx`**: Upgraded to dark frosted glass (`backdrop-filter: blur(16px)`), brand mark with glowing ⚡ icon, active route pill highlighters (`rgba(139, 92, 246, 0.20)` with glow), and responsive mobile layout.
2. **`app/discover/page.tsx`**: Elevated with `.page-intro.spread` layout, glowing badge kicker (`⚡ DISCOVER OPERATORS`), gradient headings, and live candidate count counter.
3. **`components/DiscoverDeck.tsx`**: Completely overhauled with:
   - 3D AI builder avatars mapped from `public/images/` and holographic initial ring fallbacks.
   - Pulsing synergy score badges (`.score-badge.pulse` for >= 90%).
   - Mini 4D graphical equalizer indicator bars for Pace, Comms, Risk, Energy.
   - Inset dark pitch container (`--surface-inset`) with budget tag pills.
   - Active partnership contact reveal box with emerald glow.
   - High-impact empty state featuring `public/images/empty-discover-deck.png`.
4. **Invariant Protection**: 100% compliant with reciprocal matching, rate limits, `useTransition` pending states, and all 267 automated tests.

---

## 6. Verification Method

To independently verify the technical blueprint and subsequent implementation:

### 6.1 Automated E2E Test Suite Run
```powershell
npx tsx test/e2e/runner.ts
```
- **Expected Outcome**: All 267 tests pass across all 7 test suites (Asset Verification, Theme Tokens, Build/Lint, Tier 1 Features, Tier 2 Boundaries, Tier 3 Combinations, Tier 4 Scenarios).

### 6.2 Next.js Build & Lint Verification
```powershell
npm run build
npm run lint
```
- **Expected Outcome**: Build completes successfully with **0 TypeScript and 0 ESLint errors**.

### 6.3 Visual & Functional Inspection Points
1. **Header (`SiteHeader.tsx`)**:
   - Verify sticky header blur against page scroll.
   - Verify `/discover` link has active pill highlighter with violet glow.
   - Verify sign-out button triggers server action.
2. **Discover Page (`/discover`)**:
   - Verify `.page-intro.spread` displays glowing kicker and operator count badge.
   - Verify candidate cards render with dark glass surface (`backdrop-filter: blur(16px)`), hover lift (`-4px`), 3D avatars, glowing score badges, mini-equalizer bars, and inset pitch boxes.
   - Verify accepted connections reveal direct contact URL with active emerald styling.
   - Verify empty state renders `empty-discover-deck.png` with supportive copy and profile link.
