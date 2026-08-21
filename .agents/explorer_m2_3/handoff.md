# Milestone 2 Visual Styling, CSS Enhancements & Asset Integration Handoff Report

**Agent**: `explorer_m2_3`  
**Working Directory**: `d:\passion-protocol\.agents\explorer_m2_3`  
**Target File**: `d:\passion-protocol\.agents\explorer_m2_3\handoff.md`  
**Parent Conversation ID**: `1ed05baa-bf1e-4390-901b-53ddffda380d`  
**Mission**: Formulate the comprehensive visual styling system, CSS enhancements for `app/globals.css`, and exact image asset integration plan for Milestone 2 (Landing Page Overhaul).

---

## 1. Observation

### 1.1 Synthetic AI Asset Suite Audit (`public/images/`)
An inspection and binary audit of `public/images/` was conducted against the physical filesystem and `test/e2e/challenger_m1_audit_output.json`. All 22 image assets exist on disk, are valid Truecolor RGBA PNGs (magic bytes `89 50 4E 47 0D 0A 1A 0A`), have 0 CRC errors, non-trivial file weights (> 100 KB), and valid IHDR dimensions.

```
Discovered: 22 files in public/images/
Verification status: 22 / 22 PASS (0 CRC errors, 0 truncated chunks, 0 missing files)
```

#### Exact Asset File Metadata Table:
| # | Filename | Category | Dimensions (px) | Aspect Ratio | Size (KB) | SHA256 (first 12 chars) |
|---|---|---|---|---|---|---|
| 1 | `hero-network-matrix.png` | Hero Visual / Backdrop | 1376 × 768 | 16:9 (1.79:1) | 1,724.28 KB | `fc61a9aeb2d0` |
| 2 | `hero-synergy-orbit.png` | Hero Interactive Node | 1024 × 1024 | 1:1 (1.00:1) | 1,748.32 KB | `ef79801ed366` |
| 3 | `bento-vibe-engine.png` | Bento 3D Graphic 1 | 1024 × 1024 | 1:1 (1.00:1) | 1,683.04 KB | `0ae08dab9a8e` |
| 4 | `bento-roles-complement.png`| Bento 3D Graphic 2 | 1024 × 1024 | 1:1 (1.00:1) | 1,254.74 KB | `df2e49b524ec` |
| 5 | `bento-project-incubator.png`| Bento 3D Graphic 3 | 1024 × 1024 | 1:1 (1.00:1) | 1,491.16 KB | `be39481494b7` |
| 6 | `bento-privacy-shield.png` | Bento 3D Graphic 4 | 1024 × 1024 | 1:1 (1.00:1) | 1,782.22 KB | `2f59190bf4ff` |
| 7 | `bento-smart-contracts.png`| Bento 3D Graphic 5 | 1024 × 1024 | 1:1 (1.00:1) | 1,802.23 KB | `3c7386abf363` |
| 8 | `role-software-coder.png` | Role 3D Hologram | 1024 × 1024 | 1:1 (1.00:1) | 1,411.79 KB | `84c54d4b680d` |
| 9 | `role-creative-designer.png`| Role 3D Hologram | 1024 × 1024 | 1:1 (1.00:1) | 1,268.06 KB | `dcedb70227f3` |
| 10 | `role-hardware-maker.png` | Role 3D Hologram | 1024 × 1024 | 1:1 (1.00:1) | 1,787.37 KB | `b6e59ac05e81` |
| 11 | `role-business-growth.png`| Role 3D Hologram | 1024 × 1024 | 1:1 (1.00:1) | 108.56 KB | `0b5609ffb91f` |
| 12 | `role-marketing-writer.png`| Role 3D Hologram | 1024 × 1024 | 1:1 (1.00:1) | 124.93 KB | `edfb36cf6976` |
| 13 | `role-general-builder.png` | Role 3D Hologram | 1024 × 1024 | 1:1 (1.00:1) | 115.49 KB | `0568f060701b` |
| 14 | `avatar-alex-coder.png` | Builder Avatar | 1024 × 1024 | 1:1 (1.00:1) | 117.29 KB | `48bf089a8b48` |
| 15 | `avatar-maya-designer.png` | Builder Avatar | 1024 × 1024 | 1:1 (1.00:1) | 115.68 KB | `74addf6635b1` |
| 16 | `avatar-david-hardware.png`| Builder Avatar | 1024 × 1024 | 1:1 (1.00:1) | 105.06 KB | `22de5310c5ab` |
| 17 | `avatar-elena-growth.png` | Builder Avatar | 1024 × 1024 | 1:1 (1.00:1) | 116.19 KB | `e66a5f23f2dc` |
| 18 | `avatar-carlos-writer.png` | Builder Avatar | 1024 × 1024 | 1:1 (1.00:1) | 114.56 KB | `97e8246d0271` |
| 19 | `avatar-priya-fintech.png` | Builder Avatar | 1024 × 1024 | 1:1 (1.00:1) | 116.21 KB | `2f07e9402201` |
| 20 | `empty-discover-deck.png` | Empty State Graphic | 1920 × 1080 | 16:9 (1.78:1) | 174.59 KB | `a7de47ee7ea9` |
| 21 | `empty-messages-chat.png` | Empty State Graphic | 1920 × 1080 | 16:9 (1.78:1) | 162.10 KB | `ac923fc9c16b` |
| 22 | `cta-nebula-backdrop.png` | Pre-Footer CTA Backdrop | 1920 × 1080 | 16:9 (1.78:1) | 404.89 KB | `b4760e5b301e` |

### 1.2 Current State of Global CSS (`app/globals.css`)
- **Total Lines**: 1,570 lines.
- **Root Variables Present**:
  - Theme colors: `--bg: #090a10`, `--bg-2: #10121d`, `--bg-3: #171928`.
  - Glass surfaces: `--surface: rgba(18, 20, 32, 0.78)`, `--surface-card: rgba(22, 25, 42, 0.70)`, `--surface-hover: rgba(30, 35, 58, 0.85)`, `--surface-inset: rgba(10, 12, 20, 0.65)`.
  - Accent colors: `--accent: #ff3d6e` (pink), `--accent-2: #8b5cf6` (electric violet), `--accent-3: #06b6d4` (neon cyan), `--accent-4: #10b981` (emerald).
  - Glowing shadows: `--glow-violet`, `--glow-cyan`, `--glow-pink`, `--glow-emerald`, `--glow-button`.
  - Typography tokens: `--font-sans`, `--font-display`.
- **Existing Classes**: `.glass-panel`, `.glass-card`, `.glass-inset`, `.glow-box`, `.gradient-text`, `.neon-border`, `.badge-pill`, `.score-badge`, `.role-chip`, `.role-tag`, `.avatar-badge`, `.primary-btn`, `.outline-btn`, `.pill-btn`, `.ghost-btn`, `.hero-split`, `.hero-panel`, `.feature-grid`, `.feature-card`.
- **Missing Specific Milestone 2 Classes**:
  - Asymmetrical 12-column Bento Grid classes (`.bento-grid`, `.bento-card-wide`, `.bento-card-tall`, `.bento-visual-wrap`).
  - Interactive Simulator sandbox container classes (`.simulator-section`, `.simulator-grid`, `.simulator-controls`, `.simulator-preview-panel`).
  - How It Works timeline & step connector classes (`.timeline-steps`, `.step-connector-line`, `.step-pill-number`).
  - Testimonial grid & 3D avatar card classes (`.testimonials-grid`, `.testimonial-quote-box`, `.testimonial-author-row`).
  - Interactive FAQ accordion animation classes (`.faq-accordion`, `.faq-item-trigger`, `.faq-item-body`, `.faq-chevron`).
  - Pre-Footer CTA cosmic nebula banner classes (`.cta-banner-container`, `.cta-backdrop-layer`, `.cta-banner-card`).
  - Modern 4-column footer classes (`.footer-grid-4col`, `.footer-col-header`, `.footer-newsletter-box`, `.system-status-indicator`).

### 1.3 Analysis of Existing Landing Page (`app/page.tsx`)
- `app/page.tsx` is an async Server Component (103 lines) calling `getSessionUser()`.
- Currently contains only 3 static sections: basic hero split with static RIYA_DESIGNS mock, 3-card feature grid, and 2-line inline text footer.
- Uses 0 image assets from `public/images/`.

### 1.4 Test Suite Verification Constraints (`test/e2e/`)
All 267 automated tests currently pass cleanly (`npx tsx test/e2e/runner.ts` executes in ~9.7s). Specific test suite requirements:
1. `test/e2e/asset_verification.test.ts` (lines 319–350): All `<Image>` tags MUST have numeric `width` + `height` attributes OR the `fill` boolean attribute.
2. `test/e2e/asset_verification.test.ts` (lines 286–317): All `/images/...` paths in JSX MUST resolve to existing files on disk.
3. `test/e2e/tier1_features.test.ts` (F3–F11): Landing page must preserve key text anchors and class hooks (`kicker`, `primary-btn`, `score-badge`, `01`, `02`, `03`, `vibe`, `contact`, `private`, `footer`, `Passion Protocol`).

---

## 2. Logic Chain

### 2.1 Complete 22-Asset Mapping to Milestone 2 Components

```
========================================================================================
                               PASSION PROTOCOL M2 ASSET MAP
========================================================================================
[Hero Section]
├── hero-network-matrix.png (1376x768)  --> Hero Background Luminous Mesh Aura
├── hero-synergy-orbit.png (1024x1024)   --> LandingHeroPreview.tsx Central Synergy Orbit Node
├── avatar-alex-coder.png (1024x1024)    --> LandingHeroPreview.tsx Left Operator (ALEX_AI)
└── avatar-maya-designer.png (1024x1024) --> LandingHeroPreview.tsx Right Operator (MAYA_UX)

[Bento Grid Showcase] (LandingBentoGrid.tsx)
├── bento-vibe-engine.png (1024x1024)       --> Card 1: 4D Vibe & Chemistry Engine (2-col wide)
├── bento-roles-complement.png (1024x1024)  --> Card 2: Inverted Complementary Discovery (1-col)
├── bento-project-incubator.png (1024x1024) --> Card 3: Project Pitch & Milestone Scope (1-col)
├── bento-privacy-shield.png (1024x1024)    --> Card 4: Zero-Spam Double Opt-in Vault (1-col)
└── bento-smart-contracts.png (1024x1024)   --> Card 5: Milestone Contracts & Live Chat (2-col wide)

[Interactive Matchmaker Simulator] (LandingSimulator.tsx)
├── role-software-coder.png (1024x1024)    --> Role Selector Chip: "Software & IT" 💻
├── role-creative-designer.png (1024x1024) --> Role Selector Chip: "Creative & Design" 🎨
├── role-hardware-maker.png (1024x1024)    --> Role Selector Chip: "Engineering & Hardware" ⚙️
├── role-business-growth.png (1024x1024)   --> Role Selector Chip: "Business & Sales" 📈
├── role-marketing-writer.png (1024x1024)  --> Role Selector Chip: "Marketing & Content" ✍️
└── role-general-builder.png (1024x1024)   --> Role Selector Chip: "Other" 🛠️

[Co-Founder Testimonials & Social Proof Grid]
├── avatar-alex-coder.png (1024x1024)    --> Story 1 (Alex & Maya - AI Systems + UX)
├── avatar-maya-designer.png (1024x1024) --> Story 1 (Alex & Maya - AI Systems + UX)
├── avatar-david-hardware.png (1024x1024)--> Story 2 (David & Elena - Robotics + GTM)
├── avatar-elena-growth.png (1024x1024)  --> Story 2 (David & Elena - Robotics + GTM)
├── avatar-carlos-writer.png (1024x1024) --> Story 3 (Carlos & Priya - Narrative + Fintech)
└── avatar-priya-fintech.png (1024x1024) --> Story 3 (Carlos & Priya - Narrative + Fintech)

[Pre-Footer High-Conversion CTA]
└── cta-nebula-backdrop.png (1920x1080)  --> Pre-Footer CTA Glowing Radiant Nebula Banner

[Core App Empty States (Documented / M3 Integration)]
├── empty-discover-deck.png (1920x1080)  --> Discover Page: Empty Candidate Pool Graphic
└── empty-messages-chat.png (1920x1080)  --> Messages Page: Empty Conversation State Graphic
========================================================================================
```

#### Detailed Asset Specification Table:
| Asset Filename | Component Target | Section | UI Placement & Function | Width × Height | Priority |
|---|---|---|---|---|---|
| `hero-network-matrix.png` | `app/page.tsx` | Hero Section | Ambient background matrix glow layer behind hero typography and preview card | 1376 × 768 | `priority` |
| `hero-synergy-orbit.png` | `components/LandingHeroPreview.tsx` | Hero Section | Central rotating holographic synergy orbit node connecting candidate nodes | 320 × 320 | `priority` |
| `bento-vibe-engine.png` | `components/LandingBentoGrid.tsx` | Bento Grid Card 1 | Visual illustration for 4D Vibe & Chemistry Engine (Pace, Comms, Risk, Energy) | 480 × 480 | `false` |
| `bento-roles-complement.png`| `components/LandingBentoGrid.tsx` | Bento Grid Card 2 | Visual illustration for Inverted Complementary Role Discovery | 360 × 360 | `false` |
| `bento-project-incubator.png`| `components/LandingBentoGrid.tsx` | Bento Grid Card 3 | Visual illustration for Project Pitch, Milestone Roadmap & Budgets | 360 × 360 | `false` |
| `bento-privacy-shield.png` | `components/LandingBentoGrid.tsx` | Bento Grid Card 4 | Visual illustration for Zero-Spam Double Opt-in Security Vault | 360 × 360 | `false` |
| `bento-smart-contracts.png`| `components/LandingBentoGrid.tsx` | Bento Grid Card 5 | Visual illustration for Milestone Partnership Contracts & Realtime Messaging | 480 × 480 | `false` |
| `role-software-coder.png` | `components/LandingSimulator.tsx` | Simulator | 3D Hologram icon inside "Software & IT" role selector chip | 40 × 40 | `false` |
| `role-creative-designer.png`| `components/LandingSimulator.tsx`| Simulator | 3D Hologram icon inside "Creative & Design" role selector chip | 40 × 40 | `false` |
| `role-hardware-maker.png` | `components/LandingSimulator.tsx` | Simulator | 3D Hologram icon inside "Engineering & Hardware" role selector chip | 40 × 40 | `false` |
| `role-business-growth.png`| `components/LandingSimulator.tsx` | Simulator | 3D Hologram icon inside "Business & Sales" role selector chip | 40 × 40 | `false` |
| `role-marketing-writer.png`| `components/LandingSimulator.tsx`| Simulator | 3D Hologram icon inside "Marketing & Content" role selector chip | 40 × 40 | `false` |
| `role-general-builder.png` | `components/LandingSimulator.tsx` | Simulator | 3D Hologram icon inside "Other" role selector chip | 40 × 40 | `false` |
| `avatar-alex-coder.png` | `components/LandingHeroPreview.tsx` & `app/page.tsx` | Hero & Testimonials | Alex 3D avatar in Hero Match preview & Story 1 card | 64 × 64 / 80 × 80 | `priority` (Hero) |
| `avatar-maya-designer.png` | `components/LandingHeroPreview.tsx` & `app/page.tsx` | Hero & Testimonials | Maya 3D avatar in Hero Match preview & Story 1 card | 64 × 64 / 80 × 80 | `priority` (Hero) |
| `avatar-david-hardware.png`| `app/page.tsx` | Testimonials | David 3D avatar in Story 2 (Robotics + GTM) testimonial card | 80 × 80 | `false` |
| `avatar-elena-growth.png` | `app/page.tsx` | Testimonials & Hero | Elena 3D avatar in Story 2 testimonial & Hero social proof avatar stack | 80 × 80 / 40 × 40 | `false` |
| `avatar-carlos-writer.png` | `app/page.tsx` | Testimonials & Hero | Carlos 3D avatar in Story 3 testimonial & Hero social proof avatar stack | 80 × 80 / 40 × 40 | `false` |
| `avatar-priya-fintech.png` | `app/page.tsx` | Testimonials & Hero | Priya 3D avatar in Story 3 testimonial & Hero social proof avatar stack | 80 × 80 / 40 × 40 | `false` |
| `cta-nebula-backdrop.png` | `app/page.tsx` | Pre-Footer CTA | Full-width glowing cosmic nebula texture layer in Pre-Footer CTA card | 1920 × 1080 (or fill) | `false` |
| `empty-discover-deck.png` | `components/DiscoverDeck.tsx` | Discover Page | Empty match deck graphic when candidate deck is exhausted (Milestone 3) | 640 × 360 | `false` |
| `empty-messages-chat.png` | `components/ChatInterface.tsx` | Messages Page | Empty state chat graphic when no active conversations exist (Milestone 3) | 640 × 360 | `false` |

---

### 2.2 Next.js `<Image>` Component Usage Patterns (0 Layout Shift & Zero Broken Links)

To guarantee **0 Cumulative Layout Shift (CLS)**, high performance, and compliance with the Next.js 15 App Router and E2E test assertions:

#### 1. Hero Section Matrix Visual (`app/page.tsx` or `LandingHeroPreview.tsx`):
```tsx
import Image from "next/image";

{/* Above the fold: Priority true, explicit dimensions, CSS fluid scaling */}
<div className="hero-matrix-bg">
  <Image
    src="/images/hero-network-matrix.png"
    alt="Passion Protocol Co-Founder Synergy Neural Matrix"
    width={1376}
    height={768}
    priority
    className="hero-matrix-img"
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 700px"
  />
</div>
```

#### 2. Hero Interactive Preview Orbit Node (`LandingHeroPreview.tsx`):
```tsx
<div className="hero-orbit-node">
  <Image
    src="/images/hero-synergy-orbit.png"
    alt="Holographic Synergy Orbit"
    width={120}
    height={120}
    priority
    className="synergy-orbit-img"
  />
</div>
```

#### 3. Bento Grid 3D Graphic Cards (`LandingBentoGrid.tsx`):
```tsx
{/* Below the fold: Lazy loaded, explicit dimensions */}
<div className="bento-image-container">
  <Image
    src="/images/bento-vibe-engine.png"
    alt="4D Vibe & Chemistry Engine Visualizer"
    width={400}
    height={400}
    className="bento-card-image"
    loading="lazy"
  />
</div>
```

#### 4. Builder Avatars in Testimonials & Hero (`app/page.tsx`):
```tsx
<div className="testimonial-avatar-wrapper">
  <Image
    src="/images/avatar-alex-coder.png"
    alt="Alex - AI Systems Engineer"
    width={64}
    height={64}
    className="testimonial-avatar-img"
  />
</div>
```

#### 5. 3D Role Hologram Icons in Simulator (`LandingSimulator.tsx`):
```tsx
<button
  type="button"
  onClick={() => setSelectedRole(role)}
  className={`role-select-chip ${selectedRole === role ? "selected" : ""}`}
>
  <Image
    src={`/images/${roleImageMap[role]}`}
    alt={`${role} 3D Icon`}
    width={28}
    height={28}
    className="role-hologram-icon"
  />
  <span>{role}</span>
</button>
```

#### 6. Pre-Footer Cosmic Nebula CTA Backdrop (`app/page.tsx`):
```tsx
<div className="cta-banner-wrapper">
  <div className="cta-backdrop-layer">
    <Image
      src="/images/cta-nebula-backdrop.png"
      alt="Cosmic Nebula Atmosphere"
      fill
      sizes="(max-width: 1240px) 100vw, 1240px"
      className="cta-backdrop-image"
      style={{ objectFit: "cover", opacity: 0.38 }}
    />
  </div>
  <div className="cta-content-inner">
    <h2>Stop Building in Isolation.</h2>
    <p>Find your complementary co-founder in under 2 minutes.</p>
    <Link href={ctaHref} className="primary-btn inline">
      Launch Discover Deck →
    </Link>
  </div>
</div>
```

---

### 2.3 Formulated CSS Classes & Styling Additions for `app/globals.css`

The following CSS code blocks must be appended to `app/globals.css` without removing or mutating any existing variables or classes.

```css
/* ==========================================================================
   MILESTONE 2: LANDING PAGE OVERHAUL ENHANCEMENTS
   ========================================================================== */

/* --- Hero Visual & Orbit Nodes --- */
.hero-matrix-bg {
  position: relative;
  width: 100%;
  max-width: 580px;
  margin: 0 auto;
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.hero-matrix-img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: var(--radius-lg);
  filter: drop-shadow(0 0 35px rgba(139, 92, 246, 0.35));
}

.hero-orbit-node {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.synergy-orbit-img {
  animation: floatOrb 6s ease-in-out infinite;
  filter: drop-shadow(0 0 25px rgba(6, 182, 212, 0.45));
}

.hero-avatar-stack {
  display: flex;
  align-items: center;
  margin-top: 24px;
}

.hero-avatar-stack .stack-item {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 2px solid var(--bg);
  margin-left: -10px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.hero-avatar-stack .stack-item:first-child {
  margin-left: 0;
}

.hero-social-proof-text {
  margin-left: 14px;
  color: var(--muted);
  font-size: 13px;
  font-weight: 600;
}

.hero-social-proof-text strong {
  color: var(--text-bright);
}

/* ==========================================================================
   METRICS & SOCIAL PROOF RIBBON (.metrics-ribbon)
   ========================================================================== */
.metrics-ribbon {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin: 72px 0;
  padding: 32px 24px;
  background: var(--surface-card);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--stroke);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
}

.metric-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
}

.metric-cell:not(:last-child)::after {
  content: "";
  position: absolute;
  right: -10px;
  top: 15%;
  height: 70%;
  width: 1px;
  background: var(--stroke);
}

.metric-value {
  font-family: var(--font-display);
  font-size: clamp(32px, 3.8vw, 44px);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #ffffff 0%, var(--accent-3) 50%, var(--accent-2) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.metric-title {
  color: var(--muted);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

/* ==========================================================================
   BENTO GRID FEATURE SHOWCASE (.bento-grid)
   ========================================================================== */
.bento-section {
  margin: 96px 0;
}

.section-header-center {
  text-align: center;
  max-width: 680px;
  margin: 0 auto 56px;
}

.section-header-center h2 {
  font-size: clamp(32px, 4vw, 48px);
  letter-spacing: -0.03em;
  margin-bottom: 16px;
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
}

.bento-card {
  background: var(--surface-card);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--stroke);
  border-radius: var(--radius-lg);
  padding: 32px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: var(--shadow);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.bento-card:hover {
  transform: translateY(-4px);
  border-color: var(--stroke-hover);
  box-shadow: var(--shadow-hover);
}

.bento-card.col-span-8 {
  grid-column: span 8;
}

.bento-card.col-span-4 {
  grid-column: span 4;
}

.bento-card.col-span-6 {
  grid-column: span 6;
}

.bento-card.col-span-12 {
  grid-column: span 12;
}

.bento-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent-3);
  background: rgba(6, 182, 212, 0.10);
  border: 1px solid rgba(6, 182, 212, 0.25);
  padding: 4px 10px;
  border-radius: 6px;
  margin-bottom: 16px;
}

.bento-card h3 {
  font-size: 22px;
  margin: 0 0 10px;
  color: var(--text-bright);
}

.bento-card p {
  color: var(--muted);
  font-size: 15px;
  line-height: 1.6;
  margin: 0 0 20px;
}

.bento-image-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: auto;
  padding-top: 16px;
}

.bento-card-image {
  max-width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: var(--radius);
  transition: transform 0.3s ease;
}

.bento-card:hover .bento-card-image {
  transform: scale(1.03);
}

/* ==========================================================================
   STEP-BY-STEP HOW IT WORKS TIMELINE (.timeline-flow)
   ========================================================================== */
.timeline-section {
  margin: 96px 0;
}

.timeline-steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  position: relative;
  margin-top: 48px;
}

.step-card-v2 {
  background: var(--surface-card);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--stroke);
  border-radius: var(--radius-lg);
  padding: 32px 28px;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow);
  position: relative;
  transition: transform 0.25s ease, border-color 0.25s ease;
}

.step-card-v2:hover {
  transform: translateY(-4px);
  border-color: var(--stroke-hover);
  box-shadow: var(--shadow-hover);
}

.step-pill-number {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%);
  color: #fff;
  font-weight: 800;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  box-shadow: var(--glow-pink);
}

.step-card-v2:nth-child(2) .step-pill-number {
  background: linear-gradient(135deg, var(--accent-2) 0%, var(--accent-3) 100%);
  box-shadow: var(--glow-violet);
}

.step-card-v2:nth-child(3) .step-pill-number {
  background: linear-gradient(135deg, var(--accent-3) 0%, var(--accent-4) 100%);
  box-shadow: var(--glow-cyan);
}

.step-card-v2 h3 {
  font-size: 21px;
  margin: 0 0 12px;
}

.step-card-v2 p {
  color: var(--muted);
  font-size: 15px;
  line-height: 1.6;
  margin: 0;
}

/* ==========================================================================
   INTERACTIVE MATCHMAKER SIMULATOR (.simulator-section)
   ========================================================================== */
.simulator-section {
  margin: 96px 0;
}

.simulator-panel {
  background: var(--surface);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid var(--stroke);
  border-radius: var(--radius-lg);
  padding: 40px;
  box-shadow: var(--shadow-lg);
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 40px;
}

.simulator-controls {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.role-selector-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.role-select-chip {
  background: var(--surface-card);
  border: 1.5px solid var(--stroke);
  border-radius: var(--radius-md);
  padding: 10px 14px;
  color: var(--muted);
  font-weight: 700;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.role-select-chip:hover {
  background: var(--surface-hover);
  border-color: var(--stroke-hover);
  color: var(--text-bright);
}

.role-select-chip.selected {
  background: rgba(139, 92, 246, 0.22);
  border-color: var(--accent-2);
  color: #fff;
  box-shadow: var(--glow-violet);
}

.role-hologram-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
  flex-shrink: 0;
}

.simulator-slider-group {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.slider-unit {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.slider-label-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  font-weight: 700;
  color: var(--text-bright);
}

.slider-endpoints {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--dim);
}

.simulator-results-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
}

.sim-candidate-card {
  background: var(--surface-card);
  border: 1px solid var(--stroke);
  border-radius: var(--radius);
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  transition: all 0.25s ease;
}

.sim-candidate-card:hover {
  border-color: var(--stroke-hover);
  transform: translateY(-2px);
}

.sim-candidate-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sim-candidate-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--accent-2);
  flex-shrink: 0;
}

.sim-candidate-text h4 {
  margin: 0 0 4px;
  font-size: 16px;
}

.sim-candidate-text p {
  margin: 0;
  font-size: 13px;
  color: var(--muted);
}

.sim-score-badge {
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%);
  color: #fff;
  font-weight: 800;
  font-size: 16px;
  padding: 8px 14px;
  border-radius: 12px;
  box-shadow: var(--glow-pink);
  text-align: center;
  min-width: 60px;
}

/* ==========================================================================
   CO-FOUNDER TESTIMONIALS GRID (.testimonials-section)
   ========================================================================== */
.testimonials-section {
  margin: 96px 0;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 48px;
}

.testimonial-card-v2 {
  background: var(--surface-card);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--stroke);
  border-radius: var(--radius-lg);
  padding: 28px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: var(--shadow);
  transition: all 0.25s ease;
}

.testimonial-card-v2:hover {
  transform: translateY(-4px);
  border-color: var(--stroke-hover);
  box-shadow: var(--shadow-hover);
}

.testimonial-quote {
  font-size: 15px;
  line-height: 1.65;
  color: #cbd5e1;
  margin: 0 0 24px;
  font-style: italic;
}

.testimonial-pair {
  display: flex;
  align-items: center;
  gap: 12px;
  border-top: 1px solid var(--stroke);
  padding-top: 16px;
}

.testimonial-avatars {
  display: flex;
  align-items: center;
}

.testimonial-avatar-thumb {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid var(--surface-solid);
  overflow: hidden;
  margin-left: -8px;
}

.testimonial-avatar-thumb:first-child {
  margin-left: 0;
}

.testimonial-pair-info h4 {
  margin: 0 0 2px;
  font-size: 14px;
  color: var(--text-bright);
}

.testimonial-pair-info span {
  font-size: 12px;
  color: var(--accent-3);
  font-weight: 600;
}

/* ==========================================================================
   INTERACTIVE FAQ ACCORDION (.faq-section)
   ========================================================================== */
.faq-section {
  margin: 96px 0;
  max-width: 860px;
  margin-left: auto;
  margin-right: auto;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 48px;
}

.faq-item {
  background: var(--surface-card);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--stroke);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.faq-item:hover,
.faq-item.open {
  border-color: var(--stroke-hover);
  background: var(--surface-hover);
}

.faq-trigger {
  width: 100%;
  background: transparent;
  border: 0;
  padding: 22px 24px;
  text-align: left;
  color: var(--text-bright);
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.faq-chevron {
  font-size: 18px;
  color: var(--accent-3);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  flex-shrink: 0;
}

.faq-item.open .faq-chevron {
  transform: rotate(180deg);
  color: var(--accent);
}

.faq-body {
  padding: 0 24px 22px;
  color: var(--muted);
  font-size: 15px;
  line-height: 1.65;
  animation: fadeIn 0.3s ease forwards;
}

/* ==========================================================================
   PRE-FOOTER CALL TO ACTION BANNER (.cta-banner-wrapper)
   ========================================================================== */
.cta-banner-wrapper {
  position: relative;
  margin: 96px 0 64px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--stroke);
  overflow: hidden;
  background: var(--surface-card);
  box-shadow: var(--shadow-lg), var(--glow-violet);
  padding: 64px 32px;
  text-align: center;
}

.cta-backdrop-layer {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.cta-content-inner {
  position: relative;
  z-index: 1;
  max-width: 640px;
  margin: 0 auto;
}

.cta-content-inner h2 {
  font-size: clamp(34px, 4.5vw, 52px);
  letter-spacing: -0.03em;
  margin-bottom: 16px;
}

.cta-content-inner p {
  color: #cbd5e1;
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 32px;
}

/* ==========================================================================
   RICH MULTI-COLUMN MODERN FOOTER (.site-footer)
   ========================================================================== */
.site-footer {
  border-top: 1px solid var(--stroke);
  background: rgba(9, 10, 16, 0.95);
  margin-top: 96px;
  padding: 64px 0 32px;
}

.footer-grid-4col {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
  gap: 48px;
  margin-bottom: 56px;
}

.footer-brand-col h3 {
  font-size: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.footer-brand-col p {
  color: var(--muted);
  font-size: 14px;
  line-height: 1.6;
  max-width: 320px;
  margin-bottom: 20px;
}

.footer-col-links h4 {
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent-3);
  margin-bottom: 18px;
}

.footer-col-links ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-col-links a {
  color: var(--muted);
  font-size: 14px;
  text-decoration: none;
  transition: color 0.15s ease;
}

.footer-col-links a:hover {
  color: var(--text-bright);
}

.footer-bottom-bar {
  border-top: 1px solid var(--stroke-subtle);
  padding-top: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  color: var(--dim);
  font-size: 13px;
}

.system-status-indicator {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--success);
  font-weight: 700;
}

.system-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--success);
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.60);
}

/* ==========================================================================
   RESPONSIVE MEDIA QUERIES FOR LANDING PAGE OVERHAUL
   ========================================================================== */
@media (max-width: 1080px) {
  .bento-card.col-span-8,
  .bento-card.col-span-4,
  .bento-card.col-span-6 {
    grid-column: span 12;
  }

  .footer-grid-4col {
    grid-template-columns: 1fr 1fr;
    gap: 36px;
  }
}

@media (max-width: 980px) {
  .metrics-ribbon {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

  .metric-cell:not(:last-child)::after {
    display: none;
  }

  .timeline-steps,
  .testimonials-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .simulator-panel {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 24px;
  }
}

@media (max-width: 768px) {
  .metrics-ribbon {
    grid-template-columns: 1fr 1fr;
    padding: 24px 16px;
    margin: 48px 0;
  }

  .cta-banner-wrapper {
    padding: 40px 20px;
    margin: 48px 0;
  }

  .footer-grid-4col {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .footer-bottom-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
```

---

## 3. Caveats

1. **Next.js `<Image>` Tag Dimensions Invariant**:
   - The test suite (`test/e2e/asset_verification.test.ts:334-340`) enforces that every `<Image>` element must provide explicit `width` and `height` properties or the `fill` boolean prop. Failure to do so will cause immediate test failure in CI.
2. **Server/Client Boundaries**:
   - `app/page.tsx` must remain an `async` React Server Component so it can resolve user authentication (`getSessionUser()`) and pass `ctaHref` dynamically.
   - Interactive components (`LandingHeroPreview.tsx`, `LandingSimulator.tsx`, `LandingFaq.tsx`) must declare `"use client"` at the top of their files.
3. **Asset URL Relative Format**:
   - All image assets in `public/images/` must be referenced using the standard Next.js path `/images/<filename>.png` (not `public/images/...` or relative `../../public/...`).
4. **Preservation of Existing CSS Selectors**:
   - Core app styling and existing test assertions rely on `.site`, `.wrap`, `.hero-split`, `.hero-panel`, `.feature-grid`, `.score-badge`, `.primary-btn`, `.role-chip`, `.match-card`. The new CSS classes are purely additive and do not alter existing specificity or layout contracts.

---

## 4. Conclusion

This blueprint provides an exhaustive, production-grade visual specification for Milestone 2:
1. **100% Asset Coverage**: All 22 synthetic PNG assets are cataloged, verified, and mapped with explicit dimensions and component placements across the Hero, Bento Grid, Simulator, Testimonials, FAQ, Pre-Footer CTA, and Core App pages.
2. **Layout Shift Elimination**: Standardized Next.js `<Image>` implementation guarantees 0 Cumulative Layout Shift (CLS) through explicit dimensions, aspect ratio wrappers, and priority attributes on above-the-fold elements.
3. **Additive Design System**: Production-ready CSS rules for `app/globals.css` provide modern asymmetrical Bento grids, glowing neon borders, interactive sliders, timeline flows, FAQ accordions, and fully responsive breakpoints without breaking any existing styles.

---

## 5. Verification Method

To independently verify the styling and asset implementation:

### 5.1 Run E2E Test Suite
```bash
npx tsx test/e2e/runner.ts
```
*Expected Result*: All 267 tests across 7 suites pass cleanly with 0 errors.

### 5.2 Verify TypeScript Compilation & Build
```bash
npx tsc --noEmit
npm run build
```
*Expected Result*: TypeScript validation completes with 0 errors; production build completes successfully.

### 5.3 Adversarial Asset Audit
```bash
npx tsx test/e2e/challenger_png_audit.ts
```
*Expected Result*: 22 / 22 assets pass CRC, IHDR dimensions, aspect ratio, and binary signature validation.
