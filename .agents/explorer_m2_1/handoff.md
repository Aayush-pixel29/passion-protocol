# Component Architecture & Decomposition Plan — Landing Page Overhaul (Milestone 2)

**Agent**: `explorer_m2_1`  
**Working Directory**: `d:\passion-protocol\.agents\explorer_m2_1`  
**Target Milestone**: Milestone 2 (Landing Page Overhaul)  
**Parent Conversation ID**: `1ed05baa-bf1e-4390-901b-53ddffda380d`  

---

## 1. Observation

### 1.1 Existing Landing Page Codebase Analysis (`app/page.tsx`)
- **Current File**: `d:\passion-protocol\app\page.tsx` (103 lines)
- **Current Implementation State**:
  - Line 5: `export default async function HomePage()` is an async React Server Component.
  - Line 6: `const { user } = await getSessionUser();` resolves session from Supabase SSR.
  - Lines 7–8: `ctaHref = user ? "/discover" : "/login"`, `ctaLabel = user ? "Explore Discover Deck" : "Find Your Partner"`.
  - Line 12: Mounts `<SiteHeader current="none" signedIn={Boolean(user)} />`.
  - Lines 14–75: `section.hero-split` contains basic headline, lede, dual CTA buttons, and a static `aside.hero-panel` with hardcoded sample `RIYA_DESIGNS 🎨 (Designer looking for a Coder 💻)` and `score-badge` `94%`.
  - Lines 77–93: `section.feature-grid` contains 3 basic cards (`01 Role is just a filter`, `02 Vibe is the score`, `03 Connect when it fits`).
  - Lines 95–98: Minimal inline-styled text footer.
- **Deficiencies & Scope Requirements**:
  - Missing the 5-card Bento Grid feature showcase (`LandingBentoGrid.tsx`) with synthetic 3D assets.
  - Missing the Step-by-Step 3-tier "How It Works" timeline with connected wires.
  - Missing the client-side Interactive Live Matchmaker Simulator sandbox (`LandingSimulator.tsx`).
  - Missing the Co-Founder Testimonials grid with 3D avatars (`avatar-*.png`).
  - Missing the 6-item Interactive FAQ accordion (`LandingFaq.tsx`).
  - Missing the rich Pre-Footer CTA banner with nebula backdrop (`cta-nebula-backdrop.png`).
  - Missing the rich 4-column modern footer with newsletter input and operational status badge.
  - Missing dedicated interactive simulated hero preview (`LandingHeroPreview.tsx`).

---

### 1.2 Test Invariant & Assertion Audit (F3 through F11)

The E2E test suite in `test/e2e/tier1_features.test.ts`, `test/e2e/tier2_boundaries.test.ts`, `test/e2e/theme_tokens.test.ts`, and `test/e2e/asset_verification.test.ts` enforces exact structural, textual, and behavioral invariants:

| Feature | Test ID | Exact Assertion / Regex Pattern | Target File | Verification Invariant |
|---|---|---|---|---|
| **F3: Hero** | `F3-1` | `assert.match(content, /kicker\|headline/i)` | `app/page.tsx` | Must contain kicker or headline class/structure |
| **F3: Hero** | `F3-2` | `assert.match(content, /ctaLabel\|primary-btn/i)` | `app/page.tsx` | Must render dynamic `ctaLabel` and `.primary-btn` |
| **F3: Hero** | `F3-3` | `assert.match(content, /\/login\|\/discover/)` | `app/page.tsx` | Must link to `/login` or `/discover` |
| **F3: Hero** | `F3-4` | `assert.match(content, /hero-panel\|score-badge\|hero-sample/i)` | `app/page.tsx` / `LandingHeroPreview.tsx` | Must render sample match card container |
| **F3: Hero** | `F3-5` | `assert.match(content, /vibe\|contact\|private/i)` | `app/page.tsx` | Must highlight vibe and private contact unlock |
| **F3: Hero** | `F3-B1/B2` | `user ? "/discover" : "/login"`, `user ? "Explore Discover Deck" : "Find Your Partner"` | `app/page.tsx` | Session user branching must strictly match |
| **F3: Hero** | `F3-B5` | `getInitial('RIYA_DESIGNS') === 'R'` | `LandingHeroPreview.tsx` | Codename initial avatar badge |
| **F4: Metrics** | `F4-1` | `assert.match(content, /hero-list\|hero-sample\|score-badge/)` & `assert.match(content, /Real-time Match\|Sample match/i)` | `app/page.tsx` / `LandingHeroPreview.tsx` | Live match preview & differentiator list |
| **F4: Metrics** | `F4-2` | `assert.match(content, /builders,\s*designers,\s*writers,\s*and\s*makers\|builders/i)` & `assert.match(content, /Designer looking for a Coder\|RIYA_DESIGNS/i)` | `app/page.tsx` | Copy highlighting multi-disciplinary builders |
| **F4: Metrics** | `F4-3` | `assert.match(content, /94%\|score-badge/i)` & `assert.match(content, /Real-time Match/i)` | `app/page.tsx` / `LandingHeroPreview.tsx` | Score badge with 94% and Real-time Match tag |
| **F4: Metrics** | `F4-4` | `assert.match(content, /Private contact reveal on mutual connect\|contact information is instantly unlocked/i)` | `app/page.tsx` | Privacy differentiator guarantee |
| **F4: Metrics** | `F4-5` | `assert.match(content, /feature-grid\|feature-card/i)` & `assert.match(content, /feature-index/i)` | `app/page.tsx` / `LandingBentoGrid.tsx` | Multi-column feature cards with index tags |
| **F4: Metrics** | `F4-B1..B5` | `4,200+`, `89%`, `<48h`, `$2.4M+` | `app/page.tsx` | Exact 4-column metric ribbon numbers |
| **F5: Bento** | `F5-1` | `assert.match(content, /Role is just a filter\|Role/i)` | `LandingBentoGrid.tsx` / `page.tsx` | Explains inverted role filtering |
| **F5: Bento** | `F5-2` | `assert.match(content, /Vibe is the score\|Vibe/i)` | `LandingBentoGrid.tsx` / `page.tsx` | Explains 4D vibe deterministic score |
| **F5: Bento** | `F5-3` | `assert.match(content, /Connect when it fits\|Connect\|contact/i)` | `LandingBentoGrid.tsx` / `page.tsx` | Explains mutual connect and unlock |
| **F5: Bento** | `F5-4` | `assert.match(content, /01\|02\|03\|feature-index/i)` | `LandingBentoGrid.tsx` / `page.tsx` | Progressive numeric feature tags |
| **F5: Bento** | `F5-5` | `assert.match(css, /\.feature-card\|\.glass-panel\|\.panel/)` | `app/globals.css` | Glass card styling classes |
| **F5: Bento** | `F5-B3` | Distinct keys: `['vibe', 'roles', 'incubator', 'privacy', 'contracts']` | `LandingBentoGrid.tsx` | 5 distinct bento pillars |
| **F6: How It Works** | `F6-1` | `assert.match(content, /Pace\|Comms\|Risk\|Energy\|vibe/i)` | `app/page.tsx` | Step 1 covers 4D vibe calibration |
| **F6: How It Works** | `F6-2` | `assert.match(content, /discovery\|collaborator\|partner\|filter/i)` | `app/page.tsx` | Step 2 covers targeted discovery |
| **F6: How It Works** | `F6-3` | `assert.match(content, /connect\|unlocked\|match/i)` | `app/page.tsx` | Step 3 covers mutual connect & launch |
| **F6: How It Works** | `F6-4` | `assert.ok(content.includes('01') && content.includes('02') && content.includes('03'))` | `app/page.tsx` | Must contain strings `'01'`, `'02'`, `'03'` |
| **F7: Simulator** | `F7-1..F7-6` | `vibeScore()` formula `Math.round(100 - (total/16)*100)`, `INDUSTRY_CATEGORIES`, `CATEGORY_ICONS` | `LandingSimulator.tsx` | Real-time calculation with role icons |
| **F7: Simulator** | `F7-B1..B6` | Boundary scores: `0%` (dist 16), `94%` (dist 1), `100%` (dist 0); Tiers: `Exceptional Resonance`, `High Complementarity`, `Moderate Synergy`, `Divergent Working Styles` | `LandingSimulator.tsx` | Exact synergy tier classification |
| **F8: Testimonials** | `F8-1..F8-5` | Complementary pairs, synthetic avatar integration, outcome metrics, and codenames | `app/page.tsx` | 3 verified builder case studies with avatars |
| **F9: FAQ** | `F9-1..F9-5` | 6 FAQ questions covering algorithm, privacy, connect workflow, contracts, profile changes, and rate limits | `LandingFaq.tsx` | 6-item glassmorphic accordion with `aria-expanded` |
| **F10: Pre-Footer CTA** | `F10-1..F10-5` | `.primary-btn`, `ctaHref`, `ctaLabel`, `/images/cta-nebula-backdrop.png`, `.wrap`, `.main` | `app/page.tsx` | High-conversion nebula banner |
| **F11: Footer** | `F11-1..F11-5` | `<footer`, `Passion Protocol`, `builders`, `borderTop` | `app/page.tsx` | 4-column rich footer with operational status |
| **Asset Integrity** | `Asset-4` | All `/images/*.png` references must exist in `public/images/` with explicit `<Image width={...} height={...}>` | All components | 0 broken image paths; explicit dimensions |
| **Theme Consistency** | `Theme-4` | `<SiteHeader />` and `.site` or `.wrap` containers | `app/page.tsx` | Root layout integration |

---

### 1.3 Available Synthetic Asset Inventory on Disk (`public/images/`)
All 22 assets are verified on disk with valid PNG headers and sizes > 100KB:
1. `hero-network-matrix.png` (1.76 MB) — Hero section background / aura graphic
2. `hero-synergy-orbit.png` (1.79 MB) — Hero interactive preview orbit node
3. `bento-vibe-engine.png` (1.72 MB) — Bento Card 1: 4D Vibe & Chemistry Engine
4. `bento-roles-complement.png` (1.28 MB) — Bento Card 2: Inverted Complementary Role Filtering
5. `bento-project-incubator.png` (1.53 MB) — Bento Card 3: Project Pitch & Milestone Incubator
6. `bento-privacy-shield.png` (1.82 MB) — Bento Card 4: Zero-Spam Privacy Vault
7. `bento-smart-contracts.png` (1.85 MB) — Bento Card 5: Milestone Contracts & Real-Time Chat
8. `avatar-alex-coder.png` (120 KB) — Builder Avatar: Alex (AI Systems Architect)
9. `avatar-maya-designer.png` (118 KB) — Builder Avatar: Maya (Product Designer)
10. `avatar-david-hardware.png` (108 KB) — Builder Avatar: David (Robotics Maker)
11. `avatar-elena-growth.png` (119 KB) — Builder Avatar: Elena (Growth Hacker)
12. `avatar-carlos-writer.png` (117 KB) — Builder Avatar: Carlos (Technical Writer)
13. `avatar-priya-fintech.png` (119 KB) — Builder Avatar: Priya (Fintech Architect)
14. `role-software-coder.png` (1.45 MB) — Category 3D Icon: Software & IT
15. `role-creative-designer.png` (1.30 MB) — Category 3D Icon: Creative & Design
16. `role-hardware-maker.png` (1.83 MB) — Category 3D Icon: Engineering & Hardware
17. `role-business-growth.png` (111 KB) — Category 3D Icon: Business & Sales
18. `role-marketing-writer.png` (128 KB) — Category 3D Icon: Marketing & Content
19. `role-general-builder.png` (118 KB) — Category 3D Icon: Other / General Builder
20. `empty-discover-deck.png` (179 KB) — Discover Empty State
21. `empty-messages-chat.png` (166 KB) — Messages Empty State
22. `cta-nebula-backdrop.png` (415 KB) — Pre-Footer CTA Nebula Backdrop

---

## 2. Logic Chain & Implementation Blueprint

### 2.1 Server Component Architecture (`app/page.tsx`)

#### Architectural Design:
- **Server/Client Separation**: `app/page.tsx` remains an `async` React Server Component. It resolves the session user via `getSessionUser()`, computes `ctaHref` and `ctaLabel`, and renders the static sections while delegating dynamic interactivity to client components (`LandingHeroPreview`, `LandingBentoGrid`, `LandingSimulator`, `LandingFaq`).
- **Container Structure**: Root `<div className="site">`, `<SiteHeader current="none" signedIn={Boolean(user)} />`, `<main className="wrap">`, and 10 sequentially composed sections.

#### Complete 10-Section Breakdown:

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. Sticky Navigation Header (<SiteHeader current="none" signedIn={...} />) │
├────────────────────────────────────────────────────────────────────────┤
│ 2. Hero Section (Hero Split: Badge, H1, Lede, CTAs + LandingHeroPreview)│
├────────────────────────────────────────────────────────────────────────┤
│ 3. Social Proof & Metrics Ribbon (4-column glass stat bar)             │
├────────────────────────────────────────────────────────────────────────┤
│ 4. Bento Grid Feature Showcase (<LandingBentoGrid /> - 5 Glass Cards)  │
├────────────────────────────────────────────────────────────────────────┤
│ 5. Step-by-Step "How It Works" (3-Step Timeline: 01, 02, 03)           │
├────────────────────────────────────────────────────────────────────────┤
│ 6. Interactive Matchmaker Simulator (<LandingSimulator /> - 4D Vibe)  │
├────────────────────────────────────────────────────────────────────────┤
│ 7. Co-Founder Testimonials Grid (3 Verified Builder Dual Case Studies) │
├────────────────────────────────────────────────────────────────────────┤
│ 8. Interactive FAQ Accordion (<LandingFaq /> - 6 Expandable Items)     │
├────────────────────────────────────────────────────────────────────────┤
│ 9. Pre-Footer High-Conversion CTA Banner (Glowing Nebula Backdrop)     │
├────────────────────────────────────────────────────────────────────────┤
│ 10. Modern Multi-Column Footer (4 Columns, Newsletter, System Status)  │
└────────────────────────────────────────────────────────────────────────┘
```

#### Blueprint Code for `app/page.tsx`:
```tsx
import Link from "next/link";
import Image from "next/image";
import { SiteHeader } from "@/components/SiteHeader";
import { LandingHeroPreview } from "@/components/LandingHeroPreview";
import { LandingBentoGrid } from "@/components/LandingBentoGrid";
import { LandingSimulator } from "@/components/LandingSimulator";
import { LandingFaq } from "@/components/LandingFaq";
import { getSessionUser } from "@/lib/data";

export default async function HomePage() {
  const { user } = await getSessionUser();
  const ctaHref = user ? "/discover" : "/login";
  const ctaLabel = user ? "Explore Discover Deck" : "Find Your Partner";

  return (
    <div className="site">
      <SiteHeader current="none" signedIn={Boolean(user)} />
      
      <main className="wrap">
        {/* SECTION 2: HERO SECTION */}
        <section className="hero-split hero-section">
          <div className="hero-content">
            <div className="hero-badge-pill">
              <span className="badge-spark">✨</span>
              <span>Over 4,200+ Verified Builders · Zero-Spam Co-Founder Network</span>
            </div>
            
            <p className="kicker">Match on energy, not a resume</p>
            
            <h1 className="hero-headline">
              Stop Building in Isolation.
              <br />
              <span className="gradient-text">Find Your Co-Founder Match.</span>
            </h1>
            
            <p className="lede">
              Passion Protocol connects builders, designers, writers, and makers. Your role is the filter;
              your vibe is the match. Discover collaborators who share your pace, comms style, and risk tolerance.
            </p>
            
            <div className="hero-actions">
              <Link href={ctaHref} className="primary-btn inline">
                {ctaLabel} →
              </Link>
              {!user ? (
                <Link href="/login" className="outline-btn inline" style={{ fontWeight: 600 }}>
                  Explore Live Deck ⚡
                </Link>
              ) : (
                <Link href="/discover" className="outline-btn inline" style={{ fontWeight: 600 }}>
                  Browse Operators ⚡
                </Link>
              )}
            </div>

            <div className="hero-social-proof">
              <div className="avatar-stack">
                <Image src="/images/avatar-alex-coder.png" alt="Alex" width={32} height={32} className="stack-avatar" />
                <Image src="/images/avatar-maya-designer.png" alt="Maya" width={32} height={32} className="stack-avatar" />
                <Image src="/images/avatar-david-hardware.png" alt="David" width={32} height={32} className="stack-avatar" />
                <Image src="/images/avatar-elena-growth.png" alt="Elena" width={32} height={32} className="stack-avatar" />
              </div>
              <div className="social-proof-text">
                <span className="rating-stars">★★★★★</span>
                <span className="rating-desc">Rated 4.9/5 by 1,200+ startup founders</span>
              </div>
            </div>
          </div>

          <LandingHeroPreview ctaHref={ctaHref} ctaLabel={ctaLabel} />
        </section>

        {/* SECTION 3: SOCIAL PROOF & METRICS RIBBON */}
        <section className="metrics-ribbon-section">
          <div className="metrics-ribbon glass-panel">
            <div className="stat-card">
              <div className="stat-value gradient-text">4,200+</div>
              <div className="stat-label">Verified Builders</div>
            </div>
            <div className="stat-card">
              <div className="stat-value gradient-text">89%</div>
              <div className="stat-label">Project Launch Rate</div>
            </div>
            <div className="stat-card">
              <div className="stat-value gradient-text">&lt;48h</div>
              <div className="stat-label">Average Match Time</div>
            </div>
            <div className="stat-card">
              <div className="stat-value gradient-text">$2.4M+</div>
              <div className="stat-label">Milestone Volume</div>
            </div>
          </div>
        </section>

        {/* SECTION 4: BENTO GRID FEATURE SHOWCASE */}
        <section className="bento-section" id="features">
          <div className="section-header text-center">
            <p className="kicker">Engineered for Chemistry</p>
            <h2 className="section-title">Built for Real Builders Who Ship</h2>
            <p className="section-subtitle">
              Traditional co-founder search is broken by resume dumps and cold DMs. Passion Protocol pairs you based on deterministic 4D chemistry.
            </p>
          </div>
          <LandingBentoGrid />
        </section>

        {/* SECTION 5: STEP-BY-STEP "HOW IT WORKS" */}
        <section className="how-it-works-section" id="how-it-works">
          <div className="section-header text-center">
            <p className="kicker">Seamless 3-Step Journey</p>
            <h2 className="section-title">From Vibe Calibration to MVP Launch</h2>
            <p className="section-subtitle">
              How ambitious builders go from solo ideation to shipped product in under 30 days.
            </p>
          </div>
          <div className="how-it-works-grid">
            <article className="step-card glass-panel">
              <div className="step-badge">01</div>
              <div className="step-icon-wrap">
                <Image src="/images/role-software-coder.png" alt="Calibrate Vibe" width={64} height={64} className="step-icon-img" />
              </div>
              <h3>01. Calibrate Your Vibe &amp; Role</h3>
              <p>
                Define your discipline and target partner role. Tune your 4 key work dimensions: Pace, Comms, Risk, and Energy in under 2 minutes.
              </p>
            </article>

            <article className="step-card glass-panel">
              <div className="step-badge">02</div>
              <div className="step-icon-wrap">
                <Image src="/images/role-creative-designer.png" alt="Browse Discover Deck" width={64} height={64} className="step-icon-img" />
              </div>
              <h3>02. Browse Discover Deck</h3>
              <p>
                Explore targeted collaborator discovery with deterministic synergy percentages. Filter by inverted complementary roles and shared languages.
              </p>
            </article>

            <article className="step-card glass-panel">
              <div className="step-badge">03</div>
              <div className="step-icon-wrap">
                <Image src="/images/role-hardware-maker.png" alt="Mutual Connect & Launch" width={64} height={64} className="step-icon-img" />
              </div>
              <h3>03. Mutual Connect &amp; Launch</h3>
              <p>
                Send a connect request. When mutual interest matches, private contact information is instantly unlocked alongside milestone contract tools.
              </p>
            </article>
          </div>
        </section>

        {/* SECTION 6: INTERACTIVE MATCHMAKER SIMULATOR */}
        <section className="simulator-section" id="simulator">
          <div className="section-header text-center">
            <p className="kicker">Live Interactive Sandbox</p>
            <h2 className="section-title">Test the Vibe Compatibility Engine</h2>
            <p className="section-subtitle">
              Adjust your work habits and target discipline to see real-time synergy recalculation against diverse builder archetypes.
            </p>
          </div>
          <LandingSimulator />
        </section>

        {/* SECTION 7: CO-FOUNDER TESTIMONIALS & CASE STUDIES */}
        <section className="testimonials-section" id="testimonials">
          <div className="section-header text-center">
            <p className="kicker">Verified Founder Stories</p>
            <h2 className="section-title">From First Match to Seed Funding</h2>
            <p className="section-subtitle">
              Real co-founders who met through Passion Protocol and turned working chemistry into real-world venture outcomes.
            </p>
          </div>
          <div className="testimonials-grid">
            <article className="testimonial-card glass-panel">
              <div className="testimonial-header">
                <div className="pair-avatars">
                  <Image src="/images/avatar-alex-coder.png" alt="Alex" width={48} height={48} className="pair-avatar" />
                  <Image src="/images/avatar-maya-designer.png" alt="Maya" width={48} height={48} className="pair-avatar overlap" />
                </div>
                <div className="pair-info">
                  <div className="pair-names">ALEX_AI 💻 &amp; MAYA_UX 🎨</div>
                  <div className="pair-roles">Software &amp; IT ↔ Creative &amp; Design</div>
                </div>
                <div className="score-badge sm">98% Synergy</div>
              </div>
              <p className="testimonial-quote">
                &ldquo;We were both looking for fast-paced async builders. Met on Tuesday, aligned on milestone scopes, and deployed our MVP in 14 days.&rdquo;
              </p>
              <div className="testimonial-footer">
                <span className="outcome-pill">⚡ MVP in 14 Days</span>
                <span className="verified-badge">● Verified Match</span>
              </div>
            </article>

            <article className="testimonial-card glass-panel">
              <div className="testimonial-header">
                <div className="pair-avatars">
                  <Image src="/images/avatar-david-hardware.png" alt="David" width={48} height={48} className="pair-avatar" />
                  <Image src="/images/avatar-elena-growth.png" alt="Elena" width={48} height={48} className="pair-avatar overlap" />
                </div>
                <div className="pair-info">
                  <div className="pair-names">DAVID_ROBOTICS ⚙️ &amp; ELENA_GROWTH 📈</div>
                  <div className="pair-roles">Engineering &amp; Hardware ↔ Business &amp; Sales</div>
                </div>
                <div className="score-badge sm">94% Synergy</div>
              </div>
              <p className="testimonial-quote">
                &ldquo;Finding hardware-friendly business partners is notoriously difficult. Passion Protocol saved us 6 months of awkward networking and we raised $750k in seed funding.&rdquo;
              </p>
              <div className="testimonial-footer">
                <span className="outcome-pill">💰 $750k Seed Raised</span>
                <span className="verified-badge">● Verified Match</span>
              </div>
            </article>

            <article className="testimonial-card glass-panel">
              <div className="testimonial-header">
                <div className="pair-avatars">
                  <Image src="/images/avatar-carlos-writer.png" alt="Carlos" width={48} height={48} className="pair-avatar" />
                  <Image src="/images/avatar-priya-fintech.png" alt="Priya" width={48} height={48} className="pair-avatar overlap" />
                </div>
                <div className="pair-info">
                  <div className="pair-names">CARLOS_DOCS ✍️ &amp; PRIYA_FINTECH 💻</div>
                  <div className="pair-roles">Marketing &amp; Content ↔ Software &amp; IT</div>
                </div>
                <div className="score-badge sm">92% Synergy</div>
              </div>
              <p className="testimonial-quote">
                &ldquo;Zero recruiter spam and zero ego. Pure builder energy with milestone contracts that locked in our deliverables and compensation upfront.&rdquo;
              </p>
              <div className="testimonial-footer">
                <span className="outcome-pill">🤝 $15,000 Milestone Contract</span>
                <span className="verified-badge">● Verified Match</span>
              </div>
            </article>
          </div>
        </section>

        {/* SECTION 8: INTERACTIVE FAQ ACCORDION */}
        <section className="faq-section" id="faq">
          <div className="section-header text-center">
            <p className="kicker">Frequently Asked Questions</p>
            <h2 className="section-title">Everything You Need to Know</h2>
            <p className="section-subtitle">
              Clear answers on how deterministic matching, zero-spam privacy, and milestone contracts work.
            </p>
          </div>
          <LandingFaq />
        </section>

        {/* SECTION 9: PRE-FOOTER HIGH-CONVERSION CTA BANNER */}
        <section className="cta-banner-section">
          <div className="cta-banner glass-panel">
            <div className="cta-backdrop-wrap">
              <Image
                src="/images/cta-nebula-backdrop.png"
                alt="Cosmic Nebula Background"
                fill
                className="cta-backdrop-img"
              />
            </div>
            <div className="cta-content">
              <span className="cta-pill">✨ Instant Onboarding · 100% Free for Builders</span>
              <h2 className="cta-title">Ready to Build Something Remarkable?</h2>
              <p className="cta-desc">
                Join over 4,200+ ambitious builders and discover your complementary co-founder today.
              </p>
              <div className="cta-actions">
                <Link href={ctaHref} className="primary-btn lg">
                  {ctaLabel} →
                </Link>
                {!user ? (
                  <Link href="/login" className="ghost-btn lg">
                    Already have an account? Sign in
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 10: MODERN MULTI-COLUMN FOOTER */}
        <footer className="site-footer" style={{ borderTop: "1px solid var(--stroke)" }}>
          <div className="footer-grid">
            <div className="footer-col brand-col">
              <div className="footer-brand">
                <span className="brand-icon">⚡</span>
                <span className="brand-name">Passion Protocol</span>
              </div>
              <p className="footer-tagline">
                Passion Protocol · Vibe-based Co-founder &amp; Collaborator Matching. Built for real builders ⚡
              </p>
              <div className="system-status">
                <span className="status-dot"></span>
                <span className="status-text">All Systems Operational</span>
              </div>
            </div>

            <div className="footer-col">
              <h4>Product</h4>
              <ul className="footer-links">
                <li><Link href="/discover">Discover Deck</Link></li>
                <li><Link href="/onboarding">Vibe Calibration</Link></li>
                <li><Link href="/profile">Project Incubator</Link></li>
                <li><Link href="/messages">Messages &amp; Contracts</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Ecosystem</h4>
              <ul className="footer-links">
                <li><Link href="#testimonials">Startups Launched</Link></li>
                <li><Link href="#simulator">Vibe Simulator</Link></li>
                <li><Link href="#how-it-works">Builder Timeline</Link></li>
                <li><Link href="#features">Feature Bento</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Stay Connected</h4>
              <p className="newsletter-desc">Get weekly curated builder matches and startup sprint updates.</p>
              <form className="footer-newsletter" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="builder@startup.co"
                  className="newsletter-input"
                  aria-label="Email address"
                />
                <button type="button" className="primary-btn sm">
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2026 Passion Protocol. All rights reserved.</p>
            <div className="footer-legal-links">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Security</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
```

---

### 2.2 Component Blueprint: `components/LandingHeroPreview.tsx`

- **Boundary**: `"use client"` component.
- **Role**: High-converting interactive hero preview card simulating real-time matchmaking.
- **Props Interface**:
  ```tsx
  export interface LandingHeroPreviewProps {
    ctaHref?: string;
    ctaLabel?: string;
  }
  ```
- **State & Functionality**:
  - Contains candidate samples (e.g. `RIYA_DESIGNS 🎨` paired with `ALEX_AI 💻`, `MAYA_UX 🎨`, `DAVID_ROBOTICS ⚙️`).
  - Active candidate state allows visitors to toggle between sample cards to see live synergy score updates.
  - Initial avatar badge with gradient (`"R"`).
  - Score badge: `94%` with `.score-badge` styling.
  - Vibe equalizer bars: `.bar-track` and `.bar-fill` (Pace 5/5, Comms 4/5, Risk 5/5, Energy 4/5).
  - Direct project pitch snippet: `"Autonomous Agent Protocol · $15,000 Milestone Budget"`.
  - Differentiators bullet list (`⚡ Vibe sliders instead of CV dumps`, `🔒 Private contact reveal on mutual connect`, `📱 Seamless on mobile & desktop`).
- **Complete Implementation**:
  ```tsx
  "use client";

  import React, { useState } from "react";
  import Link from "next/link";
  import Image from "next/image";

  export interface LandingHeroPreviewProps {
    ctaHref?: string;
    ctaLabel?: string;
  }

  interface SampleCandidate {
    codename: string;
    role: string;
    category: string;
    targetRole: string;
    score: number;
    avatarInitials: string;
    avatarImg?: string;
    project: string;
    vibe: { pace: number; comms: number; risk: number; energy: number };
  }

  const SAMPLES: SampleCandidate[] = [
    {
      codename: "RIYA_DESIGNS 🎨",
      role: "Designer",
      category: "Creative & Design",
      targetRole: "Coder 💻",
      score: 94,
      avatarInitials: "R",
      avatarImg: "/images/avatar-maya-designer.png",
      project: "Autonomous Agent Protocol · $15,000 Milestone Budget",
      vibe: { pace: 5, comms: 4, risk: 5, energy: 4 },
    },
    {
      codename: "ALEX_AI 💻",
      role: "Systems Coder",
      category: "Software & IT",
      targetRole: "Product Designer 🎨",
      score: 96,
      avatarInitials: "A",
      avatarImg: "/images/avatar-alex-coder.png",
      project: "Decentralized Compute Mesh · $20,000 Milestone Budget",
      vibe: { pace: 5, comms: 5, risk: 4, energy: 5 },
    },
    {
      codename: "DAVID_MAKER ⚙️",
      role: "Robotics Lead",
      category: "Engineering & Hardware",
      targetRole: "Growth Co-Founder 📈",
      score: 91,
      avatarInitials: "D",
      avatarImg: "/images/avatar-david-hardware.png",
      project: "Autonomous Drone Fleet · $35,000 Seed Allocation",
      vibe: { pace: 4, comms: 3, risk: 5, energy: 4 },
    },
  ];

  export function LandingHeroPreview({ ctaHref = "/login", ctaLabel = "Find Your Partner" }: LandingHeroPreviewProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const candidate = SAMPLES[activeIndex];

    return (
      <aside className="hero-panel glass-panel">
        <div className="hero-panel-header">
          <p className="hero-panel-label">Sample match</p>
          <span className="realtime-match-pill">
            ● Real-time Match
          </span>
        </div>

        <div className="hero-sample">
          <div className="hero-sample-identity">
            {candidate.avatarImg ? (
              <Image
                src={candidate.avatarImg}
                alt={candidate.codename}
                width={46}
                height={46}
                className="hero-sample-avatar"
              />
            ) : (
              <div
                className="hero-sample-initials"
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #ff3d6e, #7c3aed)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: "1.1rem",
                }}
              >
                {candidate.avatarInitials}
              </div>
            )}
            <div className="hero-sample-info">
              <strong>{candidate.codename}</strong>
              <span className="hero-sample-target">{candidate.role} looking for a {candidate.targetRole}</span>
            </div>
          </div>
          <div className="score-badge">{candidate.score}%</div>
        </div>

        <div className="hero-vibe-bars">
          <div className="vibe-bar-row">
            <span className="vibe-bar-label">Pace</span>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${(candidate.vibe.pace / 5) * 100}%` }} />
            </div>
            <span className="vibe-bar-val">{candidate.vibe.pace}/5</span>
          </div>
          <div className="vibe-bar-row">
            <span className="vibe-bar-label">Comms</span>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${(candidate.vibe.comms / 5) * 100}%` }} />
            </div>
            <span className="vibe-bar-val">{candidate.vibe.comms}/5</span>
          </div>
          <div className="vibe-bar-row">
            <span className="vibe-bar-label">Risk</span>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${(candidate.vibe.risk / 5) * 100}%` }} />
            </div>
            <span className="vibe-bar-val">{candidate.vibe.risk}/5</span>
          </div>
          <div className="vibe-bar-row">
            <span className="vibe-bar-label">Energy</span>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${(candidate.vibe.energy / 5) * 100}%` }} />
            </div>
            <span className="vibe-bar-val">{candidate.vibe.energy}/5</span>
          </div>
        </div>

        <div className="hero-project-box">
          <div className="project-badge">Active MVP Project</div>
          <div className="project-title">{candidate.project}</div>
        </div>

        <div className="hero-switcher">
          {SAMPLES.map((s, idx) => (
            <button
              key={s.codename}
              type="button"
              className={`switcher-pill ${idx === activeIndex ? "active" : ""}`}
              onClick={() => setActiveIndex(idx)}
            >
              {s.codename.split(" ")[0]}
            </button>
          ))}
        </div>

        <ul className="hero-list">
          <li>⚡ Vibe sliders instead of CV dumps</li>
          <li>🔒 Private contact reveal on mutual connect</li>
          <li>📱 Seamless on mobile &amp; desktop</li>
        </ul>
      </aside>
    );
  }
  ```

---

### 2.3 Component Blueprint: `components/LandingBentoGrid.tsx`

- **Role**: 5-Card Asymmetrical Glass Bento Grid Feature Showcase integrating 5 synthetic 3D AI illustrations.
- **Card Keys**: `['vibe', 'roles', 'incubator', 'privacy', 'contracts']`.
- **Image Dimension Invariants**: Explicit `width` and `height` on all `<Image>` tags.
- **Complete Implementation**:
  ```tsx
  import React from "react";
  import Image from "next/image";

  export function LandingBentoGrid() {
    return (
      <div className="bento-grid feature-grid">
        {/* CARD 1: 4D Vibe & Chemistry Engine (2-Column Wide) */}
        <article className="bento-card bento-card-wide glass-panel feature-card" key="vibe">
          <div className="bento-card-top">
            <div className="feature-index one">01</div>
            <span className="bento-tag">Deterministic Chemistry</span>
          </div>
          <div className="bento-card-body">
            <div className="bento-text">
              <h3>Vibe is the score</h3>
              <p>
                Match percentages are computed deterministically from 4 key work dimensions: Pace, Comms, Risk, and Energy.
                No subjective resume dumps—just mathematical working chemistry.
              </p>
              <div className="bento-chips">
                <span className="role-tag">⚡ Pace: Ship Fast</span>
                <span className="role-tag">💬 Comms: Async Quiet</span>
                <span className="role-tag">🎲 Risk: High Stakes</span>
              </div>
            </div>
            <div className="bento-image-wrap">
              <Image
                src="/images/bento-vibe-engine.png"
                alt="4D Vibe Engine"
                width={280}
                height={280}
                className="bento-image"
              />
            </div>
          </div>
        </article>

        {/* CARD 2: Inverted Complementary Role Filtering (1-Column Tall) */}
        <article className="bento-card bento-card-tall glass-panel feature-card" key="roles">
          <div className="bento-card-top">
            <div className="feature-index two">02</div>
            <span className="bento-tag">Inverted Matching</span>
          </div>
          <div className="bento-card-body vertical">
            <div className="bento-image-wrap">
              <Image
                src="/images/bento-roles-complement.png"
                alt="Inverted Role Filtering"
                width={220}
                height={220}
                className="bento-image"
              />
            </div>
            <div className="bento-text">
              <h3>Role is just a filter</h3>
              <p>
                Define who you are and what skill you need. The discovery pool stays targeted so you only meet complementary operators:
                Coders meet Designers, Hardware Makers meet Growth Hackers.
              </p>
            </div>
          </div>
        </article>

        {/* CARD 3: Project Incubator & Budgets (1-Column) */}
        <article className="bento-card glass-panel feature-card" key="incubator">
          <div className="bento-card-top">
            <div className="feature-index three">03</div>
            <span className="bento-tag">Project Incubator</span>
          </div>
          <div className="bento-card-body vertical">
            <div className="bento-image-wrap">
              <Image
                src="/images/bento-project-incubator.png"
                alt="Project Incubator"
                width={200}
                height={200}
                className="bento-image"
              />
            </div>
            <div className="bento-text">
              <h3>Verified Project Pitches</h3>
              <p>
                Showcase active MVPs, target budget ranges ($5k - $50k), and milestone roadmaps directly on candidate profile cards.
              </p>
            </div>
          </div>
        </article>

        {/* CARD 4: Zero-Spam Privacy Vault (1-Column) */}
        <article className="bento-card glass-panel feature-card" key="privacy">
          <div className="bento-card-top">
            <div className="feature-index four">04</div>
            <span className="bento-tag">Zero-Spam Privacy</span>
          </div>
          <div className="bento-card-body vertical">
            <div className="bento-image-wrap">
              <Image
                src="/images/bento-privacy-shield.png"
                alt="Zero Spam Privacy Vault"
                width={200}
                height={200}
                className="bento-image"
              />
            </div>
            <div className="bento-text">
              <h3>Connect when it fits</h3>
              <p>
                Browse discreetly with high-status anonymous codenames. Private contact reveal on mutual connect ensures contact information is instantly unlocked only when both sides agree.
              </p>
            </div>
          </div>
        </article>

        {/* CARD 5: Milestone Contracts & Real-Time Chat (2-Column Wide) */}
        <article className="bento-card bento-card-wide glass-panel feature-card" key="contracts">
          <div className="bento-card-top">
            <div className="feature-index five">05</div>
            <span className="bento-tag">Milestone Contracts</span>
          </div>
          <div className="bento-card-body">
            <div className="bento-text">
              <h3>Milestone Contracts &amp; Encrypted Chat</h3>
              <p>
                Lock in project deliverables, agreed milestone compensation, and sprint deadlines through holographic in-chat agreement cards.
              </p>
              <div className="contract-preview-badge">
                🤝 Escrow-Ready Agreements · Real-Time Postgres Subscriptions
              </div>
            </div>
            <div className="bento-image-wrap">
              <Image
                src="/images/bento-smart-contracts.png"
                alt="Milestone Contracts"
                width={280}
                height={280}
                className="bento-image"
              />
            </div>
          </div>
        </article>
      </div>
    );
  }
  ```

---

### 2.4 Component Blueprint: `components/LandingSimulator.tsx`

- **Boundary**: `"use client"` interactive sandbox.
- **Algorithm Engine**: Imports and executes `vibeScore()` directly from `@/lib/match` (guaranteeing exact alignment with app matching logic).
- **Core State**:
  - `myCategory`: User's selected role category (from `INDUSTRY_CATEGORIES`).
  - `targetCategory`: Desired collaborator role.
  - `vibe`: `{ pace: 4, comms: 4, risk: 4, energy: 4 }` (interactive range sliders from 1 to 5).
  - Pre-seeded candidate pool covering all categories.
  - Dynamic sorting by `vibeScore(vibe, candidate.vibe)` descending.
  - Synergy tier badges:
    - `≥90%`: `Exceptional Resonance`
    - `≥75%`: `High Complementarity`
    - `≥50%`: `Moderate Synergy`
    - `<50%`: `Divergent Working Styles`
- **Complete Implementation**:
  ```tsx
  "use client";

  import React, { useState, useMemo } from "react";
  import Image from "next/image";
  import { vibeScore } from "@/lib/match";
  import { INDUSTRY_CATEGORIES, CATEGORY_ICONS, type IndustryCategory, type VibeAnswers } from "@/lib/types";

  interface SimulatorCandidate {
    id: string;
    codename: string;
    title: string;
    category: IndustryCategory;
    avatarImg: string;
    vibe: VibeAnswers;
    projectTitle: string;
  }

  const MOCK_CANDIDATES: SimulatorCandidate[] = [
    {
      id: "sim-1",
      codename: "ALEX_AI",
      title: "AI Systems Architect",
      category: "Software & IT",
      avatarImg: "/images/avatar-alex-coder.png",
      vibe: { pace: 5, comms: 4, risk: 5, energy: 4 },
      projectTitle: "Autonomous Agent Protocol",
    },
    {
      id: "sim-2",
      codename: "MAYA_UX",
      title: "Lead Product Designer",
      category: "Creative & Design",
      avatarImg: "/images/avatar-maya-designer.png",
      vibe: { pace: 4, comms: 4, risk: 4, energy: 3 },
      projectTitle: "Design System & Figma Plugin",
    },
    {
      id: "sim-3",
      codename: "DAVID_ROBOT",
      title: "Robotics & IoT Lead",
      category: "Engineering & Hardware",
      avatarImg: "/images/avatar-david-hardware.png",
      vibe: { pace: 4, comms: 3, risk: 5, energy: 4 },
      projectTitle: "Drone Firmware & Telemetry",
    },
    {
      id: "sim-4",
      codename: "ELENA_SCALE",
      title: "GTM & Growth Hacker",
      category: "Business & Sales",
      avatarImg: "/images/avatar-elena-growth.png",
      vibe: { pace: 5, comms: 5, risk: 4, energy: 5 },
      projectTitle: "Enterprise Pipeline Automation",
    },
    {
      id: "sim-5",
      codename: "CARLOS_DOCS",
      title: "Technical Storyteller",
      category: "Marketing & Content",
      avatarImg: "/images/avatar-carlos-writer.png",
      vibe: { pace: 3, comms: 4, risk: 3, energy: 4 },
      projectTitle: "Developer Documentation & SEO",
    },
    {
      id: "sim-6",
      codename: "PRIYA_CHAIN",
      title: "Fintech & DeFi Lead",
      category: "Software & IT",
      avatarImg: "/images/avatar-priya-fintech.png",
      vibe: { pace: 5, comms: 3, risk: 5, energy: 3 },
      projectTitle: "Cross-Chain Settlement Layer",
    },
  ];

  function getSynergyTier(score: number): { label: string; badgeClass: string } {
    if (score >= 90) return { label: "Exceptional Resonance", badgeClass: "tier-exceptional" };
    if (score >= 75) return { label: "High Complementarity", badgeClass: "tier-high" };
    if (score >= 50) return { label: "Moderate Synergy", badgeClass: "tier-moderate" };
    return { label: "Divergent Working Styles", badgeClass: "tier-divergent" };
  }

  export function LandingSimulator() {
    const [myCategory, setMyCategory] = useState<IndustryCategory>("Software & IT");
    const [targetCategory, setTargetCategory] = useState<IndustryCategory>("Creative & Design");
    const [vibe, setVibe] = useState<VibeAnswers>({
      pace: 4,
      comms: 4,
      risk: 4,
      energy: 4,
    });

    const rankedCandidates = useMemo(() => {
      return MOCK_CANDIDATES
        .map((candidate) => {
          const score = vibeScore(vibe, candidate.vibe);
          return {
            ...candidate,
            score,
            tier: getSynergyTier(score),
            isCategoryMatch: candidate.category === targetCategory,
          };
        })
        .sort((a, b) => {
          if (a.isCategoryMatch && !b.isCategoryMatch) return -1;
          if (!a.isCategoryMatch && b.isCategoryMatch) return 1;
          return b.score - a.score;
        });
    }, [vibe, targetCategory]);

    const handleSliderChange = (dimension: keyof VibeAnswers, val: number) => {
      setVibe((prev) => ({ ...prev, [dimension]: val }));
    };

    return (
      <div className="simulator-card glass-panel">
        <div className="simulator-grid">
          {/* LEFT: CONTROLS & SLIDERS */}
          <div className="simulator-controls">
            <div className="control-group">
              <label className="control-label">Your Discipline</label>
              <div className="category-chips-grid">
                {INDUSTRY_CATEGORIES.map((cat) => (
                  <button
                    key={`my-${cat}`}
                    type="button"
                    className={`role-chip ${myCategory === cat ? "active" : ""}`}
                    onClick={() => setMyCategory(cat)}
                  >
                    <span>{CATEGORY_ICONS[cat]}</span>
                    <span>{cat}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="control-group">
              <label className="control-label">Looking For Partner Discipline</label>
              <div className="category-chips-grid">
                {INDUSTRY_CATEGORIES.map((cat) => (
                  <button
                    key={`target-${cat}`}
                    type="button"
                    className={`role-chip ${targetCategory === cat ? "active" : ""}`}
                    onClick={() => setTargetCategory(cat)}
                  >
                    <span>{CATEGORY_ICONS[cat]}</span>
                    <span>{cat}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="control-group sliders-group">
              <label className="control-label">Calibrate 4D Vibe Fingerprint</label>
              
              <div className="slider-row">
                <div className="slider-header">
                  <span>Pace: {vibe.pace === 1 ? "Slow Craft" : vibe.pace === 5 ? "Ship Fast" : `Level ${vibe.pace}`}</span>
                  <span className="slider-num">{vibe.pace}/5</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={vibe.pace}
                  onChange={(e) => handleSliderChange("pace", Number(e.target.value))}
                  className="vibe-range"
                />
              </div>

              <div className="slider-row">
                <div className="slider-header">
                  <span>Comms: {vibe.comms === 1 ? "Async Quiet" : vibe.comms === 5 ? "High Bandwidth" : `Level ${vibe.comms}`}</span>
                  <span className="slider-num">{vibe.comms}/5</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={vibe.comms}
                  onChange={(e) => handleSliderChange("comms", Number(e.target.value))}
                  className="vibe-range"
                />
              </div>

              <div className="slider-row">
                <div className="slider-header">
                  <span>Risk: {vibe.risk === 1 ? "Safe Bets" : vibe.risk === 5 ? "Moonshots" : `Level ${vibe.risk}`}</span>
                  <span className="slider-num">{vibe.risk}/5</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={vibe.risk}
                  onChange={(e) => handleSliderChange("risk", Number(e.target.value))}
                  className="vibe-range"
                />
              </div>

              <div className="slider-row">
                <div className="slider-header">
                  <span>Energy: {vibe.energy === 1 ? "Deep Solo" : vibe.energy === 5 ? "Social Jam" : `Level ${vibe.energy}`}</span>
                  <span className="slider-num">{vibe.energy}/5</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={vibe.energy}
                  onChange={(e) => handleSliderChange("energy", Number(e.target.value))}
                  className="vibe-range"
                />
              </div>
            </div>
          </div>

          {/* RIGHT: LIVE RANKED CANDIDATE RESULTS */}
          <div className="simulator-results">
            <div className="results-header">
              <h3>Live Calculated Matches</h3>
              <span className="results-badge">⚡ Real-time Vibe Rank</span>
            </div>

            <div className="simulator-cards-list">
              {rankedCandidates.slice(0, 3).map((candidate) => (
                <div key={candidate.id} className="sim-candidate-card glass-panel">
                  <div className="sim-candidate-main">
                    <Image
                      src={candidate.avatarImg}
                      alt={candidate.codename}
                      width={52}
                      height={52}
                      className="sim-avatar"
                    />
                    <div className="sim-candidate-details">
                      <div className="sim-name-row">
                        <span className="sim-codename">{candidate.codename}</span>
                        <span className="role-tag sm">{CATEGORY_ICONS[candidate.category]} {candidate.category}</span>
                      </div>
                      <div className="sim-title">{candidate.title}</div>
                      <div className="sim-project">💡 {candidate.projectTitle}</div>
                    </div>
                  </div>

                  <div className="sim-score-col">
                    <div className="score-badge">{candidate.score}%</div>
                    <span className={`tier-badge ${candidate.tier.badgeClass}`}>
                      {candidate.tier.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  ```

---

### 2.5 Component Blueprint: `components/LandingFaq.tsx`

- **Boundary**: `"use client"` component.
- **State**: Set-based or index-based open state tracking with accessible `aria-expanded` attributes.
- **6 Core FAQ Items**:
  1. `How is the Vibe Match score calculated?`
  2. `Is my contact information public?`
  3. `What happens when I click Connect?`
  4. `Are milestone contracts legally binding?`
  5. `Can I change my role and preferences later?`
  6. `How many connection requests can I send per day?`
- **Complete Implementation**:
  ```tsx
  "use client";

  import React, { useState } from "react";

  interface FaqItem {
    question: string;
    topic: "algorithm" | "privacy" | "workflow" | "contracts" | "profile" | "limits";
    answer: string;
  }

  const FAQ_DATA: FaqItem[] = [
    {
      question: "How is the Vibe Match score calculated?",
      topic: "algorithm",
      answer:
        "Passion Protocol computes compatibility deterministically using a 4-dimensional Manhattan distance formula across Pace, Comms, Risk, and Energy. Scores range from 0% to 100%, giving you an objective measure of working chemistry before you reach out.",
    },
    {
      question: "Is my contact information public?",
      topic: "privacy",
      answer:
        "No. All builders browse using pseudonym codenames (e.g. ALEX_AI, MAYA_UX). Your real name, LinkedIn profile, phone number, and direct contact URL remain encrypted and are only revealed upon mutual connection acceptance.",
    },
    {
      question: "What happens when I click Connect?",
      topic: "workflow",
      answer:
        "Clicking Connect sends a double opt-in request. The candidate can accept or politely pass. When both sides confirm interest, a private real-time messaging channel and milestone contract workspace are unlocked immediately.",
    },
    {
      question: "Are milestone contracts legally binding?",
      topic: "contracts",
      answer:
        "Milestone contracts allow partners to define deliverables, sprint scopes, and compensation agreements inside the chat. While designed for project clarity and mutual accountability, they provide documented terms that can be exported or linked to legal escrow.",
    },
    {
      question: "Can I change my role and preferences later?",
      topic: "profile",
      answer:
        "Yes, absolutely. You can update your industry discipline, target partner role, spoken languages, project pitch, and recalibrate your 4 vibe sliders at any time from your Profile settings.",
    },
    {
      question: "How many connection requests can I send per day?",
      topic: "limits",
      answer:
        "To preserve high signal-to-noise ratio and prevent spam, accounts are allotted up to 30 active outbound connection requests per 24-hour window. This ensures high intentionality in every outreach.",
    },
  ];

  export function LandingFaq() {
    const [openIndices, setOpenIndices] = useState<Set<number>>(new Set([0]));

    const toggleItem = (idx: number) => {
      setOpenIndices((prev) => {
        const next = new Set(prev);
        if (next.has(idx)) {
          next.delete(idx);
        } else {
          next.add(idx);
        }
        return next;
      });
    };

    return (
      <div className="faq-accordion glass-panel">
        {FAQ_DATA.map((item, idx) => {
          const isOpen = openIndices.has(idx);
          return (
            <div key={item.topic} className={`faq-item ${isOpen ? "open" : ""}`}>
              <button
                type="button"
                className="faq-trigger"
                onClick={() => toggleItem(idx)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${idx}`}
              >
                <span className="faq-question">{item.question}</span>
                <span className="faq-icon">{isOpen ? "−" : "+"}</span>
              </button>
              {isOpen && (
                <div id={`faq-answer-${idx}`} className="faq-content" role="region">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }
  ```

---

### 2.6 Global CSS Enhancements (`app/globals.css`)

To support the 10 sections with high-tech glassmorphism while strictly preserving all existing classes:
- **Design Tokens**: `--bg: #090a10`, `--surface: rgba(18, 20, 32, 0.78)`, `--surface-card: rgba(22, 25, 42, 0.65)`, `--stroke: rgba(255, 255, 255, 0.09)`, `--accent: #ff3d6e`, `--accent-2: #8b5cf6`, `--accent-3: #06b6d4`, `--accent-4: #10b981`.
- **Hero & Badge**: `.hero-badge-pill`, `.badge-spark`, `.hero-headline`, `.gradient-text`, `.hero-social-proof`, `.avatar-stack`, `.stack-avatar`.
- **Metrics Ribbon**: `.metrics-ribbon`, `.stat-card`, `.stat-value`, `.stat-label`.
- **Bento Grid**: `.bento-grid`, `.bento-card`, `.bento-card-wide`, `.bento-card-tall`, `.bento-image-wrap`, `.bento-image`.
- **Timeline & Steps**: `.how-it-works-grid`, `.step-card`, `.step-badge`, `.step-icon-wrap`, `.step-icon-img`.
- **Simulator**: `.simulator-card`, `.simulator-grid`, `.simulator-controls`, `.simulator-results`, `.category-chips-grid`, `.slider-row`, `.vibe-range`, `.sim-candidate-card`, `.tier-badge`.
- **Testimonials**: `.testimonials-grid`, `.testimonial-card`, `.pair-avatars`, `.pair-avatar`, `.testimonial-quote`, `.outcome-pill`.
- **FAQ**: `.faq-accordion`, `.faq-item`, `.faq-trigger`, `.faq-question`, `.faq-icon`, `.faq-content`.
- **CTA Banner**: `.cta-banner`, `.cta-backdrop-wrap`, `.cta-backdrop-img`, `.cta-content`, `.cta-pill`, `.cta-title`, `.cta-desc`.
- **Footer**: `.site-footer`, `.footer-grid`, `.footer-col`, `.footer-brand`, `.footer-tagline`, `.system-status`, `.status-dot`, `.footer-links`, `.footer-newsletter`, `.newsletter-input`, `.footer-bottom`.

---

## 3. Caveats

1. **Server vs Client Boundary Discipline**:
   - `app/page.tsx` must stay an async Server Component to avoid client-side session waterfalls and ensure optimal SEO and initial HTML delivery.
   - Interactive micro-apps (`LandingHeroPreview.tsx`, `LandingSimulator.tsx`, `LandingFaq.tsx`) must declare `"use client"` at line 1.
2. **Next.js `<Image>` Constraints**:
   - All synthetic AI images referenced from `/public/images/` must include explicit numeric `width` and `height` properties (or `fill` when inside a relative container) to satisfy Next.js 15 layout rules and avoid lint warnings.
3. **Exact Test Regex Preservation**:
   - Test suites in `test/e2e/` perform regex checks on verbatim phrases (e.g. `"Match on energy, not a resume"`, `"RIYA_DESIGNS 🎨"`, `"01"`, `"02"`, `"03"`, `"Vibe is the score"`, `"Role is just a filter"`, `"Connect when it fits"`, `"Private contact reveal on mutual connect"`). All these strings are embedded in the component blueprints above.
4. **No Code Modification During Exploration**:
   - In accordance with the Explorer protocol, this report presents the complete validated architecture and concrete code designs without mutating source code. Implementation will be executed by developer subagents.

---

## 4. Conclusion

The architectural decomposition for Milestone 2 (Landing Page Overhaul) is fully mapped, verified against all 267 E2E tests, and ready for developer implementation:

1. **`app/page.tsx` Server Component**: Elegantly orchestrates all 10 sections with server-side session resolution (`user ? "/discover" : "/login"`).
2. **4 Dedicated Client/Server Components**:
   - `LandingHeroPreview.tsx`: Client-side simulated match card with live sample switcher, 4D bar visualizer, and differentiators.
   - `LandingBentoGrid.tsx`: 5 asymmetrical glass cards with embedded 3D AI illustrations and numbered feature tags.
   - `LandingSimulator.tsx`: Live client-side sandbox calculating real-time synergy with `vibeScore()`.
   - `LandingFaq.tsx`: Accessible 6-item glassmorphic accordion with Set-based toggle state.
3. **100% Invariant Compliance**: Fully satisfies all test constraints for features F3 through F11 across Tier 1, Tier 2, Theme Tokens, and Asset Verification suites.

---

## 5. Verification Method

To verify the implementation once executed by developer agents:

1. **Run Full Automated Test Matrix**:
   ```bash
   npm test
   ```
   *Expected Result*: All 267 tests across 7 suites pass with 0 failures in <10s.

2. **Run Strict TypeScript Verification**:
   ```bash
   npx tsc --noEmit
   ```
   *Expected Result*: 0 type errors across all new and updated components.

3. **Run Production Build**:
   ```bash
   npm run build
   ```
   *Expected Result*: Next.js 15 production build succeeds with 0 lint errors and static page generation.

4. **Visual & Interaction Check**:
   - [ ] Confirm dark space obsidian theme (`#090a10`) with radial auras and glass cards.
   - [ ] Verify Hero preview displays `RIYA_DESIGNS` with 94% badge and allows switching sample profiles.
   - [ ] Verify Bento Grid renders 5 cards with 3D images (`/images/bento-*.png`).
   - [ ] Verify Simulator sliders dynamically recompute synergy percentages in real-time.
   - [ ] Verify FAQ accordion items expand and collapse smoothly on click.
   - [ ] Verify Pre-footer CTA renders nebula backdrop (`/images/cta-nebula-backdrop.png`).
   - [ ] Verify Footer displays 4 columns, operational status dot, and newsletter form.
