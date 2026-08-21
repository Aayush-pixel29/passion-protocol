# Technical Blueprint: Profile, Project Form, Danger Zone & Authentication Modernization

**Agent**: `explorer_m3_2`  
**Working Directory**: `d:\passion-protocol\.agents\explorer_m3_2`  
**Target Output**: `d:\passion-protocol\.agents\explorer_m3_2\handoff.md`  
**Parent Orchestrator**: `sub_orch_m3` (`cb7c958e-a7b5-4c7b-97d1-5a1f7f1b0785`)  
**Scope**: Detailed technical analysis and blueprint for upgrading `app/profile/page.tsx`, `components/ProjectForm.tsx`, `components/DeleteAccountButton.tsx`, `app/login/page.tsx`, and `components/AuthForm.tsx` to the cyber-luxe dark glassmorphism design system while protecting all functional invariants.

---

## 1. Observation

A line-by-line inspection of the 5 target files, their supporting server actions, database helpers, test suites, and CSS stylesheets was conducted.

### 1.1 Target File Inventory & Current State

#### 1.1.1 `app/profile/page.tsx` (172 lines)
- **Data Loading & Guards** (Lines 17–49):
  - Fetches user session, profile, vibe ratings, and active project pitch via `getOwnProfile()`.
  - Invariant guards: Redirects unauthenticated visitors to `/login` (Line 18) and incomplete onboarding to `/onboarding` (Line 19).
  - Queries exact count of pending inbound requests via `supabase.from("connect_requests").select("*", { count: "exact", head: true }).eq("to_id", user.id).eq("status", "pending")` (Lines 21–25).
  - Queries accepted connections and resolves partner profiles from `profiles` and contact URLs from `profile_links` (Lines 27–48).
- **Layout & Visual Deficiencies**:
  - `section.identity` (Lines 59–91): Contains hardcoded light background container (`background: "#f8fafc"`, Line 68) for contact details, causing severe visual clash against dark mode.
  - `section.fingerprint` (Lines 92–109): Renders `.bar-track` and `.bar-fill` with basic width calculation without dimensional typography hierarchy.
  - Project Pitch (Lines 112–118): Wraps `ProjectForm` in an inline-styled `border: "1px solid #eaeaea"` container with `borderRadius: 12`, clashing with obsidian glass tokens.
  - Active Partnerships (Lines 120–159): Renders `.match-card.success` cards with hardcoded blue link colors (`#3b82f6`) and basic styling.
  - Danger Zone (Lines 161–167): Has hardcoded `borderTop: "1px solid #eaeaea"` and unstyled container.

#### 1.1.2 `components/ProjectForm.tsx` (44 lines)
- **Form Mechanics**:
  - Uses React 19 `useTransition()` wrapping `saveProject(formData)` (Lines 8–19).
  - Controlled/Uncontrolled inputs: `name="title"` (minLength={3}, maxLength={100}), `name="description"` (minLength={10}, maxLength={1000}), `name="budget_range"` (maxLength={100}).
  - Triggers standard browser `alert()` on error/success.
- **Visual Deficiencies**:
  - Lacks dedicated `.input` classes, dark glass inset styling, and visual character limit / helper guidance.

#### 1.1.3 `components/DeleteAccountButton.tsx` (31 lines)
- **Account Deletion Flow**:
  - Uses `useTransition()` calling `deleteAccount()` server action (Lines 7–18).
  - Executes browser `confirm()` dialogue.
- **Visual Deficiencies**:
  - Uses hardcoded inline button style (`backgroundColor: "#ef4444", borderColor: "#ef4444"`), lacking glassmorphic crimson accenting and elevation.

#### 1.1.4 `app/login/page.tsx` (28 lines)
- **Split Page Structure**:
  - Header: `<SiteHeader current="none" signedIn={false} />` (Line 7).
  - Layout: `<main className="wrap split-page">` with `.split-copy` on left and `.panel` housing `<AuthForm />` on right.
- **Visual Deficiencies**:
  - Left column marketing copy lacks visual iconography, value pillars, and glowing accents.

#### 1.1.5 `components/AuthForm.tsx` (155 lines)
- **Authentication Engine**:
  - State management for `mode` (`"signin" | "signup" | "forgot"`), `email`, `password`, `error`, `message`, `pending` (Lines 9–15).
  - Supabase client invocation: `createClient()` from `@/lib/supabase/client`.
  - Invariant validation: `password.length < 8` and `password.length > 72` (Lines 38–45).
  - Password Reset: `supabase.auth.resetPasswordForEmail(email, { redirectTo })` (Lines 25–35).
  - Sign Up: `supabase.auth.signUp({ email, password })` (Lines 49–63).
  - Sign In: `supabase.auth.signInWithPassword({ email, password })` (Lines 65–75).
- **Visual Deficiencies**:
  - Plain mode toggle buttons without segmented pill controls.
  - Basic feedback alerts lacking glassmorphic backdrop and icons.

### 1.2 Verification Baseline
- Automated test suite `test/e2e/runner.ts` executes 267 tests across 7 suites covering `theme_tokens.test.ts`, `tier1_features.test.ts` (F14, F17, F18), and boundary suites with 100% pass rate.

---

## 2. Logic Chain

From the observations, the modernization must achieve deep aesthetic harmony with the obsidian glass design system while preserving 100% of functional invariants.

```
+-----------------------------------------------------------------------------------+
|                        GLOBAL DESIGN TOKENS (app/globals.css)                     |
|  --bg: #090a10, --surface: rgba(18,20,32,0.78), --surface-card: rgba(22,25,42,0.70) |
|  --accent: #ff3d6e, --accent-2: #8b5cf6, --accent-3: #06b6d4, --accent-4: #10b981 |
|  --stroke: rgba(255,255,255,0.09), --shadow: 0 20px 50px rgba(0,0,0,0.60)         |
+-----------------------------------------------------------------------------------+
        |                                     |                                |
        v                                     v                                v
+----------------------------+  +----------------------------+  +----------------------------+
|     USER PROFILE PAGE      |  |     PROJECT & DANGER ZONE  |  |    LOGIN & AUTH PANEL      |
| - Dark glass .identity card|  | - Dark glass ProjectForm   |  | - Value-prop split page    |
| - 4D Vibe Fingerprint bars |  | - Character limit helper   |  | - Glass segmented auth tabs|
| - Emerald partner cards    |  | - Crimson glass Danger Zone|  | - Glowing neon submit btn  |
| - Edit Identity pill CTA   |  | - delete_user RPC modal    |  | - Frosted feedback banners |
+----------------------------+  +----------------------------+  +----------------------------+
```

### 2.1 Technical Specifications & Invariant Mapping

| Component | Target File | Core Transformations | Invariants Preserved |
|---|---|---|---|
| **Profile Page** | `app/profile/page.tsx` | - Modernize `.profile-grid`<br>- Dark glass `.identity` card with glowing stats counters<br>- Category tag & role rank pills<br>- Glass inset metadata for Location, Languages, LinkedIn, Phone<br>- Multi-color gradient `.bar-fill` in `.fingerprint`<br>- Glass panel container for project pitch<br>- Emerald glowing `.match-card.success` partner cards<br>- Glass danger card with crimson accent | - Auth & onboarding redirect checks<br>- Pending inbound count query<br>- Accepted partner ID mapping<br>- RLS-protected `profile_links` map<br>- Vibe dimension keys (`pace`, `comms`, `risk`, `energy`)<br>- DeleteAccountButton integration |
| **Project Form** | `components/ProjectForm.tsx` | - Dark glass inputs (`.input`) with `--surface-inset`<br>- Focus glow ring (`--accent-2`)<br>- Helper badges for min/max character limits<br>- High-impact primary submit button with pending state<br>- Sleek inline status feedback banner | - `saveProject(formData)` server action<br>- `name="title"` (minLength=3, maxLength=100, required)<br>- `name="description"` (minLength=10, maxLength=1000, required)<br>- `name="budget_range"` (maxLength=100)<br>- `useTransition()` hook |
| **Danger Zone** | `components/DeleteAccountButton.tsx` | - Crimson glass button styling (`rgba(244, 63, 94, 0.12)` background, `rgba(244, 63, 94, 0.35)` border)<br>- Glowing crimson shadow on hover<br>- Disabled pending state with "Deleting..." indicator | - Browser `confirm()` guard<br>- `deleteAccount()` server action invocation<br>- Account deletion RPC trigger and redirect to `/` |
| **Login Page** | `app/login/page.tsx` | - Split layout (`.split-page`) with ambient radial glow<br>- Gradient headline typography (`.gradient-text`)<br>- 3 visual value pillars (Vibe Engine, Double Opt-in, Realtime Collab)<br>- Frosted `.glass-panel` container for AuthForm | - `SiteHeader current="none" signedIn={false}`<br>- App container `.site` and `.wrap` structure |
| **Auth Form** | `components/AuthForm.tsx` | - Segmented tab toggle (`Sign In` vs `Create Account`)<br>- Glass inputs with autocomplete & email validation<br>- Password length checks (8 to 72 chars)<br>- Glowing neon submit button (`.primary-btn`)<br>- Glassmorphic error and success banners (`.error`, `.glass-inset`) | - `createClient()` Supabase SSR client<br>- `signInWithPassword`, `signUp`, `resetPasswordForEmail`<br>- `router.refresh()`, `router.push("/discover")`<br>- Reset error/message state on mode switch |

---

### 2.2 Detailed Implementation Blueprints

#### 2.2.1 Proposed Implementation: `app/profile/page.tsx`

```tsx
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { getOwnProfile } from "@/lib/data";
import { redirect } from "next/navigation";
import { DeleteAccountButton } from "@/components/DeleteAccountButton";
import { ProjectForm } from "@/components/ProjectForm";
import { CATEGORY_ICONS } from "@/lib/types";

const DIMS: Array<{ key: "pace" | "comms" | "risk" | "energy"; label: string }> = [
  { key: "pace", label: "Pace" },
  { key: "comms", label: "Comms" },
  { key: "risk", label: "Risk" },
  { key: "energy", label: "Energy" },
];

export default async function ProfilePage() {
  const { user, profile, vibe, project, supabase } = await getOwnProfile();
  if (!user) redirect("/login");
  if (!profile?.onboarding_complete) redirect("/onboarding");

  const { count: pendingCount } = await supabase
    .from("connect_requests")
    .select("*", { count: "exact", head: true })
    .eq("to_id", user.id)
    .eq("status", "pending");

  const { data: acceptedRows } = await supabase
    .from("connect_requests")
    .select("from_id, to_id")
    .or(`from_id.eq.${user.id},to_id.eq.${user.id}`)
    .eq("status", "accepted");

  const partnerIds = (acceptedRows ?? []).map((row) =>
    row.from_id === user.id ? row.to_id : row.from_id
  );

  const { data: partnerProfiles } = partnerIds.length
    ? await supabase.from("profiles").select("id, codename, industry_category, professional_title").in("id", partnerIds)
    : { data: [] };

  const { data: partnerLinks } = partnerIds.length
    ? await supabase.from("profile_links").select("user_id, contact_url").in("user_id", partnerIds)
    : { data: [] };

  const linkByUserId = new Map<string, string>();
  for (const link of partnerLinks ?? []) {
    if (link.contact_url) linkByUserId.set(link.user_id, link.contact_url);
  }

  const categoryIcon = CATEGORY_ICONS[profile.industry_category || ""] || "🧑‍💻";

  return (
    <div className="site">
      <SiteHeader current="profile" signedIn />
      <main className="wrap">
        {/* Page Header */}
        <div className="page-intro" style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span className="kicker" style={{ margin: 0 }}>OPERATOR DOSSIER</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "12px", color: "var(--success)", background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.3)", padding: "2px 10px", borderRadius: 999 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--success)", boxShadow: "0 0 8px var(--success)" }} />
              Verified Active
            </span>
          </div>
          <h1 className="gradient-text" style={{ fontSize: "clamp(2rem, 5vw, 2.75rem)", fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>
            {profile.codename}
          </h1>
        </div>

        {/* Profile Grid: Identity + Vibe Fingerprint */}
        <div className="profile-grid">
          {/* Left Column: Identity Card */}
          <section className="identity">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span className="role-tag" style={{ fontSize: "12px", padding: "4px 10px" }}>
                {categoryIcon} {profile.industry_category}
              </span>
            </div>

            <h3 style={{ fontSize: "20px", color: "var(--text-bright)", margin: "0 0 6px", fontWeight: 700 }}>
              {profile.professional_title}
            </h3>

            <p style={{ color: "var(--accent-3)", fontSize: "14px", fontWeight: 600, margin: "0 0 16px" }}>
              Seeking: <span style={{ color: "var(--text-bright)" }}>{profile.looking_for_title}</span> ({profile.looking_for_category})
            </p>

            {profile.full_name ? (
              <p className="sub" style={{ margin: "6px 0", fontSize: "14px", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "var(--dim)" }}>Name:</span>
                <span style={{ color: "var(--text-bright)", fontWeight: 500 }}>{profile.full_name}</span>
              </p>
            ) : null}

            {profile.location ? (
              <p className="sub" style={{ margin: "6px 0", fontSize: "14px", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "var(--dim)" }}>Location:</span>
                <span style={{ color: "var(--text-bright)", fontWeight: 500 }}>📍 {profile.location}</span>
              </p>
            ) : null}

            {profile.spoken_languages?.length ? (
              <div style={{ margin: "8px 0", display: "flex", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
                <span style={{ color: "var(--dim)", fontSize: "14px" }}>Languages:</span>
                {profile.spoken_languages.map((lang) => (
                  <span key={lang} style={{ fontSize: "12px", padding: "2px 8px", background: "var(--surface-inset)", border: "1px solid var(--stroke-subtle)", borderRadius: "var(--radius-sm)", color: "var(--text)" }}>
                    🌐 {lang}
                  </span>
                ))}
              </div>
            ) : null}

            {profile.bio ? (
              <p className="sub" style={{ marginTop: 12, padding: "10px 14px", background: "var(--surface-inset)", borderRadius: "var(--radius-sm)", border: "1px solid var(--stroke-subtle)", fontSize: "13px", fontStyle: "italic", lineHeight: 1.5 }}>
                &ldquo;{profile.bio}&rdquo;
              </p>
            ) : null}
            
            {profile.linkedin_url || profile.phone_number ? (
              <div className="glass-inset" style={{ marginTop: 16, padding: 14 }}>
                {profile.linkedin_url ? (
                  <p className="sub" style={{ margin: "4px 0", fontSize: "13px" }}>
                    <span style={{ color: "var(--dim)" }}>LinkedIn:</span>{" "}
                    <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-3)", textDecoration: "underline", fontWeight: 500 }}>
                      {profile.linkedin_url} ↗
                    </a>
                  </p>
                ) : null}
                {profile.phone_number ? (
                  <p className="sub" style={{ margin: "4px 0", fontSize: "13px" }}>
                    <span style={{ color: "var(--dim)" }}>Phone:</span>{" "}
                    <span style={{ color: "var(--text-bright)", fontWeight: 500 }}>📱 {profile.phone_number}</span>
                  </p>
                ) : null}
              </div>
            ) : null}

            {/* Glowing Stats Strip */}
            <div className="stats">
              <div>
                <div className="stat-value">{partnerIds.length}</div>
                <div className="stat-label">Partners</div>
              </div>
              <div>
                <div className="stat-value">{pendingCount ?? 0}</div>
                <div className="stat-label">Inbound</div>
              </div>
              <div>
                <div className="stat-value" style={{ fontSize: "1.1rem", display: "flex", alignItems: "center", gap: 4 }}>
                  <span>{categoryIcon}</span>
                </div>
                <div className="stat-label">{profile.industry_category?.split(" ")[0] || "Category"}</div>
              </div>
            </div>

            <div style={{ marginTop: 24 }}>
              <Link href="/onboarding" className="outline-btn" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "14px", padding: "10px 18px" }}>
                <span>✏️</span> Edit Identity & Vibe
              </Link>
            </div>
          </section>

          {/* Right Column: Vibe Fingerprint Panel */}
          <section className="fingerprint">
            <div style={{ marginBottom: 4 }}>
              <p className="label plain" style={{ margin: 0, fontSize: "18px", color: "var(--text-bright)" }}>
                Vibe Fingerprint
              </p>
              <p className="sub" style={{ margin: "4px 0 16px", fontSize: "13px", color: "var(--muted)" }}>
                4-dimensional behavioral chemistry calibration.
              </p>
            </div>

            {vibe ? (
              DIMS.map((d) => (
                <div key={d.key} style={{ marginBottom: 8 }}>
                  <div className="slider-meta" style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: "13px" }}>
                    <span style={{ fontWeight: 600, color: "var(--text-bright)" }}>{d.label}</span>
                    <span style={{ fontWeight: 700, color: "var(--accent-3)", fontFamily: "monospace" }}>{vibe[d.key]} / 5</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${(vibe[d.key] / 5) * 100}%` }} />
                  </div>
                </div>
              ))
            ) : (
              <p className="sub">No vibe answers yet.</p>
            )}
          </section>
        </div>

        {/* Project Pitch Section */}
        <section className="glass-panel" style={{ marginTop: 40, padding: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: "28px" }}>🚀</span>
            <div>
              <h3 style={{ margin: 0, fontSize: "20px", color: "var(--text-bright)" }}>Project Pitch & Milestone Scope</h3>
              <p className="sub" style={{ margin: "4px 0 0", fontSize: "14px" }}>
                Broadcast what you are building to attract synergistic co-founders and collaborators across the protocol.
              </p>
            </div>
          </div>
          <ProjectForm project={project} />
        </section>

        {/* Active Partnerships Grid */}
        {partnerProfiles && partnerProfiles.length > 0 ? (
          <section style={{ marginTop: 48 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: "20px", color: "var(--text-bright)", display: "flex", alignItems: "center", gap: 8 }}>
                <span>🤝</span> Active Partnerships ({partnerProfiles.length})
              </h3>
              <Link href="/messages" className="pill-btn" style={{ fontSize: "13px", padding: "6px 14px" }}>
                Open Messages →
              </Link>
            </div>
            <div className="match-grid">
              {partnerProfiles.map((p) => {
                const contact = linkByUserId.get(p.id);
                const partnerIcon = CATEGORY_ICONS[p.industry_category || ""] || "🧑‍💻";
                return (
                  <article key={p.id} className="match-card success" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <div className="match-card-top">
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                            <span className="role-tag" style={{ fontSize: "11px", padding: "2px 8px" }}>
                              {partnerIcon} {p.industry_category}
                            </span>
                          </div>
                          <h3 style={{ fontSize: "18px", color: "var(--text-bright)", margin: "4px 0" }}>{p.codename}</h3>
                          <p className="card-skill">{p.professional_title}</p>
                        </div>
                      </div>
                      <div style={{ marginTop: 12, padding: "10px 12px", background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: "var(--radius-sm)" }}>
                        <p style={{ color: "var(--success)", fontWeight: 700, fontSize: "13px", margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--success)" }} />
                          Partnership Active
                        </p>
                        {contact ? (
                          <p className="sub" style={{ marginTop: 6, marginBottom: 0, fontSize: "13px" }}>
                            Contact:{" "}
                            <a
                              href={contact.startsWith("http") ? contact : `https://${contact}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: "var(--accent-3)", textDecoration: "underline", fontWeight: 600 }}
                            >
                              {contact} ↗
                            </a>
                          </p>
                        ) : (
                          <p className="sub" style={{ marginTop: 6, marginBottom: 0, fontSize: "13px", color: "var(--dim)" }}>
                            No direct contact link shared
                          </p>
                        )}
                      </div>
                    </div>
                    <div style={{ marginTop: 16 }}>
                      <Link href="/messages" className="pill-btn" style={{ width: "100%", textAlign: "center", display: "block", fontSize: "13px" }}>
                        Chat with {p.codename}
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ) : null}

        {/* Danger Zone */}
        <section className="glass-card" style={{ marginTop: 56, padding: "28px 32px", border: "1px solid rgba(244, 63, 94, 0.25)", background: "rgba(244, 63, 94, 0.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
            <div>
              <h3 style={{ color: "var(--danger)", margin: "0 0 6px", fontSize: "18px", display: "flex", alignItems: "center", gap: 8 }}>
                <span>⚠️</span> Danger Zone
              </h3>
              <p className="sub" style={{ margin: 0, maxWidth: "560px", fontSize: "14px", lineHeight: 1.5 }}>
                Permanently delete your account, operator identity, project pitches, vibe calibration, and all associated messages. This action is irreversible.
              </p>
            </div>
            <DeleteAccountButton />
          </div>
        </section>
      </main>
    </div>
  );
}
```

---

#### 2.2.2 Proposed Implementation: `components/ProjectForm.tsx`

```tsx
"use client";

import { useState, useTransition } from "react";
import { saveProject } from "@/lib/actions";
import type { Project } from "@/lib/types";

export function ProjectForm({ project }: { project: Project | null }) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const action = (formData: FormData) => {
    setFeedback(null);
    startTransition(async () => {
      const res = await saveProject(formData);
      if (res?.error) {
        setFeedback({ type: "error", text: res.error });
        alert(res.error);
      } else {
        setFeedback({ type: "success", text: "Project pitch saved successfully!" });
        alert("Project saved!");
      }
    });
  };

  return (
    <form action={action} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {feedback ? (
        <div
          className={feedback.type === "error" ? "error" : "glass-inset"}
          style={{
            padding: "12px 16px",
            color: feedback.type === "error" ? "var(--danger)" : "var(--success)",
            borderColor: feedback.type === "error" ? "rgba(244, 63, 94, 0.3)" : "rgba(16, 185, 129, 0.3)",
            background: feedback.type === "error" ? "rgba(244, 63, 94, 0.08)" : "rgba(16, 185, 129, 0.08)",
            fontSize: "14px",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>{feedback.type === "error" ? "⚠️" : "✨"}</span>
          <span>{feedback.text}</span>
        </div>
      ) : null}

      <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span className="label" style={{ margin: 0 }}>Project Title</span>
          <span style={{ fontSize: "12px", color: "var(--dim)" }}>3–100 characters</span>
        </div>
        <input
          className="input"
          name="title"
          defaultValue={project?.title || ""}
          placeholder="E.g., Next-Gen Fintech Protocol"
          required
          minLength={3}
          maxLength={100}
          style={{ margin: 0 }}
        />
      </label>
      
      <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span className="label" style={{ margin: 0 }}>Project Description & Milestone Scope</span>
          <span style={{ fontSize: "12px", color: "var(--dim)" }}>10–1000 characters</span>
        </div>
        <textarea
          className="input"
          name="description"
          defaultValue={project?.description || ""}
          placeholder="Describe your vision, current prototype stage, tech stack, and what co-founder superpowers you need..."
          required
          minLength={10}
          maxLength={1000}
          rows={4}
          style={{ margin: 0, resize: "vertical", minHeight: "110px" }}
        />
      </label>

      <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span className="label" style={{ margin: 0 }}>Budget or Equity Range (Optional)</span>
          <span style={{ fontSize: "12px", color: "var(--dim)" }}>E.g. $1,000–$5,000 or 10–20% Equity</span>
        </div>
        <input
          className="input"
          name="budget_range"
          defaultValue={project?.budget_range || ""}
          placeholder="E.g., $2,500 milestone budget or 15% Co-founder Equity"
          maxLength={100}
          style={{ margin: 0 }}
        />
      </label>

      <div style={{ display: "flex", justifyContent: "flex-start", marginTop: 4 }}>
        <button type="submit" disabled={isPending} className="primary-btn" style={{ minWidth: "180px" }}>
          {isPending ? "Saving..." : project ? "Update Project Pitch" : "Create Project Pitch"}
        </button>
      </div>
    </form>
  );
}
```

---

#### 2.2.3 Proposed Implementation: `components/DeleteAccountButton.tsx`

```tsx
"use client";

import { useTransition } from "react";
import { deleteAccount } from "@/lib/actions";

export function DeleteAccountButton() {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Are you sure you want to permanently delete your account? This action cannot be undone.")) {
      startTransition(async () => {
        const result = await deleteAccount();
        if (result?.error) {
          alert("Failed to delete account: " + result.error);
        }
      });
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isPending}
      className="button"
      style={{
        background: "rgba(244, 63, 94, 0.12)",
        color: "#f43f5e",
        border: "1.5px solid rgba(244, 63, 94, 0.35)",
        padding: "10px 20px",
        borderRadius: "var(--radius-sm)",
        fontWeight: 700,
        fontSize: "14px",
        cursor: isPending ? "not-allowed" : "pointer",
        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        boxShadow: "0 0 14px rgba(244, 63, 94, 0.15)",
      }}
    >
      <span>🗑️</span>
      <span>{isPending ? "Deleting..." : "Delete my account"}</span>
    </button>
  );
}
```

---

#### 2.2.4 Proposed Implementation: `app/login/page.tsx`

```tsx
import { AuthForm } from "@/components/AuthForm";
import { SiteHeader } from "@/components/SiteHeader";

export default function LoginPage() {
  return (
    <div className="site">
      <SiteHeader current="none" signedIn={false} />
      <main className="wrap split-page" style={{ alignItems: "center", minHeight: "calc(100vh - 120px)" }}>
        <section className="split-copy" style={{ maxWidth: "520px" }}>
          <span className="kicker" style={{ marginBottom: 12, display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span>⚡</span> OPERATOR ACCESS
          </span>
          <h1 className="gradient-text" style={{ fontSize: "clamp(36px, 6vw, 56px)", lineHeight: 1.1, margin: "12px 0 20px" }}>
            Welcome<br />back
          </h1>
          <p className="lede" style={{ fontSize: "17px", color: "var(--muted)", lineHeight: 1.6, marginBottom: 32 }}>
            Authenticate to enter the protocol. Once calibrated, the Discover deck opens as a full desktop operator matrix — deterministic vibe synergy, zero swipe fatigue.
          </p>

          <div style={{ display: "grid", gap: 16, borderTop: "1px solid var(--stroke)", paddingTop: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(139, 92, 246, 0.15)", border: "1px solid rgba(139, 92, 246, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>
                🧬
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-bright)" }}>4D Vibe & Chemistry Engine</div>
                <div style={{ fontSize: "12px", color: "var(--dim)" }}>Pace, comms, risk, and energy matching</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(6, 182, 212, 0.15)", border: "1px solid rgba(6, 182, 212, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>
                🛡️
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-bright)" }}>Zero-Spam Double Opt-in</div>
                <div style={{ fontSize: "12px", color: "var(--dim)" }}>Contacts revealed only upon mutual connection</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255, 61, 110, 0.15)", border: "1px solid rgba(255, 61, 110, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>
                🚀
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-bright)" }}>Realtime Collab & Contracts</div>
                <div style={{ fontSize: "12px", color: "var(--dim)" }}>Instant messaging and escrow milestone agreements</div>
              </div>
            </div>
          </div>
        </section>

        <section className="panel glass-panel" style={{ padding: "36px 32px", position: "relative", overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              top: "-30%",
              right: "-20%",
              width: "220px",
              height: "220px",
              background: "radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div style={{ position: "relative", zIndex: 1 }}>
            <AuthForm />
          </div>
        </section>
      </main>
    </div>
  );
}
```

---

#### 2.2.5 Proposed Implementation: `components/AuthForm.tsx`

```tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");

    const supabase = createClient();

    if (mode === "forgot") {
      setPending(true);
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/login`,
      });
      setPending(false);

      if (resetError) {
        setError(resetError.message);
      } else {
        setMessage("Check your email for the password reset link.");
      }
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password.length > 72) {
      setError("Password is too long.");
      return;
    }

    setPending(true);
    if (mode === "signup") {
      const { data, error: authError } = await supabase.auth.signUp({ email, password });
      setPending(false);

      if (authError) {
        setError(authError.message);
        return;
      }

      if (!data.session && data.user) {
        setMessage("Account created! Please check your email inbox to confirm your account.");
        return;
      }

      router.refresh();
      router.push("/discover");
    } else {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      setPending(false);

      if (authError) {
        setError(authError.message);
        return;
      }

      router.refresh();
      router.push("/discover");
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Mode Switcher Segmented Control */}
      <div style={{ display: "flex", background: "var(--surface-inset)", padding: 4, borderRadius: "var(--radius-sm)", border: "1px solid var(--stroke)", marginBottom: 8 }}>
        <button
          type="button"
          onClick={() => {
            setMode("signin");
            setError("");
            setMessage("");
          }}
          style={{
            flex: 1,
            padding: "8px 12px",
            borderRadius: "calc(var(--radius-sm) - 2px)",
            border: "none",
            background: mode === "signin" ? "var(--surface-hover)" : "transparent",
            color: mode === "signin" ? "var(--text-bright)" : "var(--muted)",
            fontWeight: mode === "signin" ? 700 : 500,
            fontSize: "14px",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("signup");
            setError("");
            setMessage("");
          }}
          style={{
            flex: 1,
            padding: "8px 12px",
            borderRadius: "calc(var(--radius-sm) - 2px)",
            border: "none",
            background: mode === "signup" ? "var(--surface-hover)" : "transparent",
            color: mode === "signup" ? "var(--text-bright)" : "var(--muted)",
            fontWeight: mode === "signup" ? 700 : 500,
            fontSize: "14px",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          Create Account
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label className="label" htmlFor="email" style={{ margin: 0 }}>
          Email Address
        </label>
        <input
          id="email"
          className="input"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="operator@passionprotocol.com"
          style={{ margin: 0 }}
        />
      </div>

      {mode !== "forgot" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label className="label" htmlFor="password" style={{ margin: 0 }}>
              Password
            </label>
            {mode === "signin" ? (
              <button
                type="button"
                className="sub"
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.8rem", textDecoration: "underline", color: "var(--dim)" }}
                onClick={() => {
                  setMode("forgot");
                  setError("");
                  setMessage("");
                }}
              >
                Forgot password?
              </button>
            ) : null}
          </div>
          <input
            id="password"
            className="input"
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            required
            minLength={8}
            maxLength={72}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            style={{ margin: 0 }}
          />
        </div>
      ) : null}

      {error ? (
        <div className="error" style={{ margin: "4px 0 0", display: "flex", alignItems: "center", gap: 8 }}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      ) : null}

      {message ? (
        <div className="glass-inset" style={{ margin: "4px 0 0", padding: "10px 14px", border: "1px solid rgba(16, 185, 129, 0.3)", background: "rgba(16, 185, 129, 0.1)", color: "var(--success)", fontSize: "13px", fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
          <span>✨</span>
          <span>{message}</span>
        </div>
      ) : null}

      <button className="primary-btn" type="submit" disabled={pending} style={{ marginTop: 8, width: "100%" }}>
        {pending ? "Working…" : mode === "signup" ? "Create Operator Account" : mode === "forgot" ? "Send Reset Link" : "Sign In to Orbit"}
      </button>

      <button
        className="toggle-auth"
        type="button"
        onClick={() => {
          setMode(mode === "signin" ? "signup" : "signin");
          setError("");
          setMessage("");
        }}
        style={{ textAlign: "center", marginTop: 8 }}
      >
        {mode === "signin"
          ? "Need an account? Sign up"
          : mode === "signup"
          ? "Have an account? Sign in"
          : "Back to Sign in"}
      </button>
    </form>
  );
}
```

---

## 3. Caveats

1. **Alert Preservation in Tests**:
   - `components/ProjectForm.tsx` triggers `alert()` on submission result. The proposed implementation preserves the `alert()` call alongside the new inline status banner so existing browser tests or test assertions targeting `alert` continue passing seamlessly.
2. **Delete Confirmation**:
   - `components/DeleteAccountButton.tsx` maintains `window.confirm()` as the primary execution guard to ensure compatibility with automated headless tests that mock `confirm()`.
3. **URL Normalization in Contact Links**:
   - Contact links on active partnership cards use `contact.startsWith("http") ? contact : "https://" + contact` with `target="_blank"` and `rel="noopener noreferrer"` to prevent tab-nabbing vulnerabilities.
4. **Mobile Responsiveness**:
   - `.profile-grid` collapses to a single-column layout on viewports $\le 980\text{px}$ via existing rules in `app/globals.css`.

---

## 4. Conclusion

This technical blueprint provides a complete, drop-in-ready redesign specification for `app/profile/page.tsx`, `components/ProjectForm.tsx`, `components/DeleteAccountButton.tsx`, `app/login/page.tsx`, and `components/AuthForm.tsx`.

### Summary of Improvements:
1. **Profile Identity Card**: Replaces light-mode containers with dark glass insets, gradient stat counters, category tags, and an "Edit Identity & Vibe" pill CTA.
2. **Vibe Fingerprint**: Polished dimensional hierarchy with score indicators and smooth glowing progress bars.
3. **Project Pitch**: Encapsulated in a cyber-luxe glass panel with helper guidance and responsive inputs.
4. **Active Collaborators**: Upgraded `.match-card.success` with glowing emerald accents and direct chat routing.
5. **Danger Zone**: Crimson glass card with `deleteAccount` RPC trigger.
6. **Login & Auth**: Split marketing layout with value props and a high-converting segmented auth panel.

---

## 5. Verification Method

To verify the proposed implementation once written by the implementing subagents:

### 5.1 Static Type Check & Linting
```powershell
npm run lint
```
*Expected*: 0 errors, 0 warnings.

### 5.2 Next.js Build
```powershell
npm run build
```
*Expected*: Successful static/dynamic route generation for `/profile` and `/login` with 0 build errors.

### 5.3 Automated E2E Test Suite
```powershell
npx tsx test/e2e/runner.ts
```
*Expected*: All 267 tests across 7 suites pass with 100% success rate:
- F14 Profile tests (`test/e2e/tier1_features.test.ts`)
- F17 Auth tests (`test/e2e/tier1_features.test.ts`)
- Theme token assertions (`test/e2e/theme_tokens.test.ts`)
- Scenario journeys (`test/e2e/tier4_scenarios.test.ts`)
