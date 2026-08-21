# Core App Pages & AI Image Asset Inventory Handoff Report

**Agent**: `explorer_survey_3`  
**Working Directory**: `d:\passion-protocol\.agents\explorer_survey_3`  
**Target File**: `d:\passion-protocol\.agents\explorer_survey_3\handoff.md`  
**Mission**: Survey the core authenticated application pages (`/discover`, `/profile`, `/messages`, `/onboarding`, `/login`, `SiteHeader`), define the shared design system inheritance model, and build the comprehensive AI Synthetic Image Asset Inventory (Requirement R3) with precise prompts and placement specifications.

---

## 1. Observation

### 1.1 Core Authenticated App Pages Analysis

A comprehensive audit of all authenticated app pages and their backing components was conducted across `app/` and `components/`.

#### 1.1.1 Discover Page (`app/discover/page.tsx` & `components/DiscoverDeck.tsx`)
- **Server Entrypoint** (`app/discover/page.tsx`, 82 lines):
  - **Auth & Onboarding Guard** (Lines 9–13): Enforces user authentication and onboarding completion (`onboarding_complete`, `looking_for_category`, `industry_category`, `vibe`).
  - **Match Ranking Engine** (Lines 15–25): Calls `loadCompletedOperators()` and `rankMatches()` to compute deterministic match percentages based on category inversion, language overlap, and 4D Manhattan vibe distance.
  - **Connection State Mapping** (Lines 27–40): Queries `connect_requests` to determine statuses: `accepted`, `declined`, `outgoing_pending`, `incoming_pending`, or `none`.
  - **Contact Revelation** (Lines 42–47): Reads `profile_links` (RLS protected, only visible for accepted connections and self).
  - **Structure** (Lines 64–81): Renders `SiteHeader`, `.page-intro.spread` with kicker/heading/sub, and `DiscoverDeck`.
- **Client Deck Component** (`components/DiscoverDeck.tsx`, 227 lines):
  - **State Management** (Lines 34–39): Manages `hidden` (dismissed IDs), `local` (optimistic deck state), `error`, and `busyId` with `useTransition()`.
  - **Empty State** (Lines 43–51): Basic dashed border container (`.empty`) with text only. Lacks visual engagement.
  - **Card Structure** (Lines 107–220):
    - Avatar (Lines 110–127): Rendered using dynamic HSL CSS gradients (`getAvatarGradient()`) with a single letter initial.
    - Match Score (Line 135): `<div className="score-badge">{card.score}%</div>`.
    - Project Teaser (Lines 138–147): Embedded with inline light-theme styles (`background: "rgba(0,0,0,0.03)"`).
    - Vibe Dimensions (Lines 152–158): Plain text `Pace X/5`, `Comms X/5`, `Risk X/5`, `Energy X/5`.
    - Interactive Action Rows (Lines 159–219): Connect, Skip, Accept, Decline buttons, and active partnership contact reveal.

#### 1.1.2 Profile Page (`app/profile/page.tsx`, `components/ProjectForm.tsx`, `components/DeleteAccountButton.tsx`)
- **Server Entrypoint** (`app/profile/page.tsx`, 172 lines):
  - **Data Fetching** (Lines 17–49): Retrieves own profile, vibe answers, active project pitch, inbound connect count, and active partner profiles/links.
  - **Layout & Structure**:
    - `.profile-grid` (Lines 58–110): Split into `section.identity` (title, name, location, languages, LinkedIn/phone, stats bar) and `section.fingerprint` (4 vibe dimension visualizer bars: `.bar-track`, `.bar-fill`).
    - Project Pitch (Lines 112–118): Inline-styled container (`border: "1px solid #eaeaea", borderRadius: 12`) housing `<ProjectForm project={project} />`.
    - Active Partnerships (Lines 120–159): Grid of `.match-card.success` cards for accepted collaborators.
    - Danger Zone (Lines 161–167): Hardcoded red header with `<DeleteAccountButton />`.
- **Client Components**:
  - `ProjectForm.tsx` (44 lines): Client form with `useTransition()` calling `saveProject()`. Form labels and inputs.
  - `DeleteAccountButton.tsx` (31 lines): Confirmation dialog calling `deleteAccount()` RPC with inline styles (`backgroundColor: "#ef4444"`).

#### 1.1.3 Messages & Chat Interface (`app/messages/page.tsx` & `components/ChatInterface.tsx`)
- **Server Entrypoint** (`app/messages/page.tsx`, 57 lines):
  - Fetches accepted partner profiles and maps them to connection items.
  - Displays empty state if 0 partners; otherwise mounts `<ChatInterface />`.
- **Client Chat Component** (`components/ChatInterface.tsx`, 222 lines):
  - **Realtime Collaboration** (Lines 28–81): Supabase Postgres realtime subscriptions for `messages` and `partnership_contracts` tables filtered by connection/partner ID.
  - **Layout**: Fixed `height: 600px` flex split view.
  - **Styling Remnants**: Heavy reliance on inline styles with light-mode assumptions (`background: "#fff"`, `border: "1px solid var(--stroke)"`, partner message `background: "#f1f5f9"`, contract card `background: "#f8fafc", border: "1px solid #cbd5e1"`).
  - **Features**: Realtime instant chat, auto-scroll to bottom, "Propose Partnership" terms drawer ($ price + deliverables scope), and contract card status tracking.

#### 1.1.4 Onboarding Flow (`app/onboarding/page.tsx` & `components/OnboardingForm.tsx`)
- **Server Entrypoint** (`app/onboarding/page.tsx`, 23 lines):
  - Requires session auth; renders `<OnboardingForm profile={profile} />`.
- **Client Form** (`components/OnboardingForm.tsx`, 129 lines):
  - Uses `useActionState()` wrapping `saveOnboarding(formData)`.
  - **3-Step Form Sections**:
    1. *Identity*: Codename, Full Name, Location, Spoken Languages, LinkedIn URL, Phone Number.
    2. *Profession*: Industry Category chips (`INDUSTRY_CATEGORIES`), Professional Title, Target Partner Category chips, Target Partner Title.
    3. *The Vibe*: 4 range sliders (Pace, Comms, Risk, Energy) with min=1, max=5.

#### 1.1.5 Authentication Page (`app/login/page.tsx` & `components/AuthForm.tsx`)
- **Server Entrypoint** (`app/login/page.tsx`, 28 lines):
  - Split-page layout with marketing copy on the left and `<AuthForm />` in `.panel` on the right.
- **Client Form** (`components/AuthForm.tsx`, 155 lines):
  - 3 view states: `signin`, `signup`, `forgot`.
  - Handles Supabase `signInWithPassword`, `signUp`, and `resetPasswordForEmail`.

#### 1.1.6 Navigation Header (`components/SiteHeader.tsx`)
- **Sticky Header** (50 lines):
  - Sticky glass header with brand logo `⚡ Passion Protocol`.
  - Conditional navigation depending on `signedIn`:
    - Signed in: `Discover`, `Messages`, `Profile`, `Sign out` (Server action).
    - Signed out: `Sign in`, `Get started` CTA.

---

### 1.2 Current State of Styling & Global CSS (`app/globals.css`)
- **CSS Architecture**: 1,281 lines of pure vanilla CSS in `app/globals.css`.
- **Variables**: Currently defined with warm light-peach colors (`--bg: #fff6ef; --surface: #ffffff; --stroke: #f0d4c4; --text: #1c1230;`).
- **Typography**: Next.js Google Fonts `Plus_Jakarta_Sans` (sans body) and `Fraunces` (serif display headings) imported in `app/layout.tsx`.
- **Existing Reusable Classes**: `.role-chip`, `.role-tag`, `.avatar-badge`, `.score-badge`, `.match-card`, `.match-grid`, `.primary-btn`, `.outline-btn`, `.pill-btn`, `.ghost-btn`, `.panel`, `.identity`, `.fingerprint`, `.bar-track`, `.bar-fill`.

### 1.3 Asset System State
- The `public/` directory currently does not exist.
- 0 image assets or SVG illustrations are present in the repository.
- Avatars and cards currently rely purely on basic CSS gradient circles and emoji characters.

---

## 2. Logic Chain

### 2.1 Unified Design System Inheritance Model

To satisfy **Requirement R2 (Core App Consistency)** and acceptance criteria ("The core app pages share the exact same CSS variables/theme as the newly designed landing page"), the styling must not be fragmented. All authenticated app pages will inherit directly from updated global CSS variables, augmented by modernized glassmorphic utility classes.

```
+-------------------------------------------------------------------------+
|                  CENTRAL DESIGN SYSTEM (app/globals.css)                |
|  - Obsidian Dark Mode Tokens (--bg: #090a10, --surface: rgba(18,20,32)) |
|  - Electric Violet & Neon Cyan Accents (--accent: #ff3d6e, --accent-2)  |
|  - Glassmorphic Card & Panel Base Classes (.glass-panel, .match-card)   |
|  - Unified Typography (--font-sans, --font-display, gradient-text)     |
|  - Shared Button & Control Variants (.primary-btn, .pill-btn, .input)   |
+-------------------------------------------------------------------------+
       |                  |                  |                  |
       v                  v                  v                  v
+--------------+  +---------------+  +---------------+  +---------------+
| Landing Page |  | Discover Deck |  | User Profile  |  | Messages/Chat |
| (app/page)   |  | (app/discover)|  | (app/profile) |  | (app/messages)|
+--------------+  +---------------+  +---------------+  +---------------+
```

#### 2.1.1 Core CSS Variable Tokens (`app/globals.css`)
```css
:root {
  /* Dark Space Obsidian Canvas */
  --bg: #090a10;
  --bg-2: #10121d;
  --bg-3: #171928;
  --surface: rgba(18, 20, 32, 0.78);
  --surface-solid: #121420;
  --surface-card: rgba(22, 25, 42, 0.65);
  --surface-hover: rgba(30, 35, 58, 0.85);
  --surface-inset: rgba(10, 12, 20, 0.55);
  
  /* Borders & Glows */
  --stroke: rgba(255, 255, 255, 0.09);
  --stroke-subtle: rgba(255, 255, 255, 0.05);
  --stroke-hover: rgba(139, 92, 246, 0.45);
  --stroke-accent: rgba(255, 61, 110, 0.4);
  --stroke-cyan: rgba(6, 182, 212, 0.4);
  
  /* Typography & High-Contrast Colors */
  --text: #f8fafc;
  --text-bright: #ffffff;
  --muted: #94a3b8;
  --dim: #64748b;
  
  /* Brand Accent Hierarchy */
  --accent: #ff3d6e;         /* Passion Pink / Hot Coral */
  --accent-2: #8b5cf6;       /* Electric Violet */
  --accent-3: #06b6d4;       /* Neon Cyan */
  --accent-4: #10b981;       /* Radiant Emerald */
  --accent-amber: #f59e0b;   /* Warm Amber */
  --success: #10b981;
  --danger: #f43f5e;
  
  /* Modern Shadows & Atmospheric Auras */
  --shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
  --shadow-hover: 0 25px 60px -10px rgba(139, 92, 246, 0.3), 0 0 35px rgba(6, 182, 212, 0.15);
  --glow-violet: 0 0 35px rgba(139, 92, 246, 0.35);
  --glow-cyan: 0 0 35px rgba(6, 182, 212, 0.35);
  --glow-pink: 0 0 35px rgba(255, 61, 110, 0.35);
  
  /* Geometry & Typography */
  --radius: 20px;
  --radius-sm: 10px;
  --radius-md: 14px;
  --radius-lg: 24px;
  --font-sans: var(--font-jakarta), "Segoe UI", system-ui, -apple-system, sans-serif;
  --font-display: var(--font-fraunces), Georgia, "Times New Roman", serif;
  --wrap: 1240px;
}
```

---

### 2.2 Core App Pages Alignment Specifications

#### 2.2.1 Navigation & Header (`components/SiteHeader.tsx`)
- **Visuals**:
  - Glassmorphic navigation bar with `backdrop-filter: blur(16px); background: rgba(9, 10, 16, 0.82); border-bottom: 1px solid var(--stroke);`.
  - Brand Logo: Gradient text mark with glowing ⚡ icon.
  - Active Tab State: Glowing violet/pink background pill (`background: rgba(139, 92, 246, 0.18); border: 1px solid rgba(139, 92, 246, 0.35); color: #fff;`).
  - Sign Out Action: Styled as a refined ghost pill button.

#### 2.2.2 Discover Page & Deck (`app/discover/page.tsx` & `components/DiscoverDeck.tsx`)
- **Page Layout**:
  - Ambient background glow matching landing page aesthetics.
  - Page header with glowing pill kicker `"DISCOVER OPERATORS"` and dynamic count.
- **Match Cards (`.match-card`)**:
  - **Glassmorphism**: `background: var(--surface-card); backdrop-filter: blur(16px); border: 1px solid var(--stroke); border-radius: var(--radius);`.
  - **Hover Dynamics**: Hover lifts `-4px` with border lighting up in violet/cyan and glowing shadow.
  - **Avatars**: Support 3D synthetic avatars or stylized holographic initial ring (`.avatar-badge.ring-glow`).
  - **Score Badge**: High-synergy glow for scores ≥ 90% (`background: linear-gradient(135deg, #8b5cf6, #06b6d4); box-shadow: var(--glow-cyan);`).
  - **Vibe Equalizer Meter**: Replace plain `Pace X/5` text with mini horizontal graphical indicator bars with glowing fills.
  - **Project Pitch Box**: Inset dark glass container (`background: var(--surface-inset); border: 1px solid var(--stroke-subtle); border-radius: var(--radius-sm);`).
  - **Success / Connected State**: Glowing emerald border and badge with copyable direct contact link.
- **Empty State Deck**:
  - High-impact empty state card incorporating `public/images/empty-discover-deck.png` with supportive copy and CTA to edit preferences or invite collaborators.

#### 2.2.3 Profile Page (`app/profile/page.tsx`, `ProjectForm.tsx`, `DeleteAccountButton.tsx`)
- **Identity Panel (`.identity`)**:
  - Dark glass surface with frosted blur, glowing stats counters (`.stat-value` in gradient text), role chip tags, and formatted metadata (location, languages, socials).
- **Vibe Fingerprint Panel (`.fingerprint`)**:
  - Modernized slider bars: `.bar-track` with `background: rgba(255, 255, 255, 0.08)` and `.bar-fill` with `background: linear-gradient(90deg, #ff3d6e, #8b5cf6, #06b6d4)`.
- **Project Pitch Manager**:
  - Replaces hardcoded `#eaeaea` border with `.panel` / `.glass-panel`.
  - Form inputs styled with dark glass background, subtle white border, and focus glowing ring.
- **Active Partnerships Grid**:
  - Display cards with glowing emerald partnership status, verified contact badges, and direct messaging link.
- **Danger Zone**:
  - Glass card with subtle ruby/crimson border (`border: 1px solid rgba(244, 63, 94, 0.25); background: rgba(244, 63, 94, 0.04);`).

#### 2.2.4 Messages & Realtime Chat (`app/messages/page.tsx` & `components/ChatInterface.tsx`)
- **Chat Container (`.chat-container`)**:
  - Frosted glass container (`backdrop-filter: blur(20px); background: var(--surface-card); border: 1px solid var(--stroke); border-radius: var(--radius-lg);`).
- **Sidebar**:
  - Active partner list with avatar rings, status dots, and active item gradient indicator.
- **Message Bubbles**:
  - **My Messages**: Gradient fill (`linear-gradient(135deg, #ff3d6e 0%, #8b5cf6 100%)`), crisp white text, subtle shadow.
  - **Partner Messages**: Dark glass bubble (`background: rgba(255, 255, 255, 0.07); border: 1px solid var(--stroke); color: #f8fafc;`).
- **Partnership Contract Card**:
  - Holographic milestone card with 🤝 header, price in neon cyan, deliverables description, and status pill badge.
- **Empty State**:
  - Renders `public/images/empty-messages-chat.png` with smooth call-to-action to connect with operators in Discover.

#### 2.2.5 Onboarding Flow (`app/onboarding/page.tsx` & `components/OnboardingForm.tsx`)
- **Form Architecture**:
  - Wrapped in narrow container with progressive glass step cards (`1. Identity`, `2. Profession`, `3. The Vibe`).
  - **Role Selector**: Interactive chips with category icons (💻, 🎨, ⚙️, 📈, ✍️) lighting up in electric violet / hot coral on selection.
  - **Vibe Range Sliders**: Custom-styled CSS range sliders with neon thumb, gradient fill track, and clear descriptive endpoints.

#### 2.2.6 Login & Auth (`app/login/page.tsx` & `components/AuthForm.tsx`)
- **Auth Panel (`.auth-panel`)**:
  - High-converting glassmorphic card with glowing neon submit button, smooth password toggle, and crisp error/success banners.

---

### 2.3 AI Synthetic Image Asset Inventory (Requirement R3)

To ensure Passion Protocol features a rich, modern, and visually compelling experience, a complete suite of synthetic image assets must be generated and embedded across the landing page and core app pages.

#### 2.3.1 Asset Master Inventory Table

| # | Asset Identifier | Target File Path | Dimensions / Ratio | Primary Placement & UI Role |
|---|---|---|---|---|
| **01** | `hero_network_matrix` | `public/images/hero-network-matrix.png` | `16:9` (1920×1080) | Landing Page Hero Main Visual / Backdrop Aura |
| **02** | `hero_synergy_orbit` | `public/images/hero-synergy-orbit.png` | `1:1` (1024×1024) | Landing Page Hero Interactive Preview Card Node |
| **03** | `bento_vibe_engine` | `public/images/bento-vibe-engine.png` | `1:1` (1024×1024) | Bento Grid Card 1: 4D Vibe & Chemistry Engine |
| **04** | `bento_roles_complement` | `public/images/bento-roles-complement.png` | `1:1` (1024×1024) | Bento Grid Card 2: Inverted Complementary Role Discovery |
| **05** | `bento_project_incubator`| `public/images/bento-project-incubator.png`| `1:1` (1024×1024) | Bento Grid Card 3: Project Incubator & Milestone Scope |
| **06** | `bento_privacy_shield` | `public/images/bento-privacy-shield.png` | `1:1` (1024×1024) | Bento Grid Card 4: Zero-Spam Double Opt-in Security Vault |
| **07** | `bento_smart_contracts` | `public/images/bento-smart-contracts.png` | `1:1` (1024×1024) | Bento Grid Card 5: Milestone Contracts & Real-Time Chat |
| **08** | `role_software_coder` | `public/images/role-software-coder.png` | `1:1` (512×512) | Category 3D Icon: Software & IT / Developer |
| **09** | `role_creative_designer`| `public/images/role-creative-designer.png`| `1:1` (512×512) | Category 3D Icon: Creative & Design / UI/UX |
| **10** | `role_hardware_maker` | `public/images/role-hardware-maker.png` | `1:1` (512×512) | Category 3D Icon: Engineering & Hardware / Robotics |
| **11** | `role_business_growth` | `public/images/role-business-growth.png` | `1:1` (512×512) | Category 3D Icon: Business & Sales / Founder |
| **12** | `role_marketing_writer` | `public/images/role-marketing-writer.png` | `1:1` (512×512) | Category 3D Icon: Marketing & Content / Storyteller |
| **13** | `role_general_builder` | `public/images/role-general-builder.png` | `1:1` (512×512) | Category 3D Icon: General Operator / Polymath |
| **14** | `avatar_alex_coder` | `public/images/avatar-alex-coder.png` | `1:1` (512×512) | Co-Founder Avatar: Alex (AI Systems Architect) |
| **15** | `avatar_maya_designer` | `public/images/avatar-maya-designer.png` | `1:1` (512×512) | Co-Founder Avatar: Maya (Product Designer) |
| **16** | `avatar_david_hardware` | `public/images/avatar-david-hardware.png` | `1:1` (512×512) | Co-Founder Avatar: David (Robotics Engineer) |
| **17** | `avatar_elena_growth` | `public/images/avatar-elena-growth.png` | `1:1` (512×512) | Co-Founder Avatar: Elena (Growth Strategist) |
| **18** | `avatar_carlos_writer` | `public/images/avatar-carlos-writer.png` | `1:1` (512×512) | Co-Founder Avatar: Carlos (Technical Writer) |
| **19** | `avatar_priya_fintech` | `public/images/avatar-priya-fintech.png` | `1:1` (512×512) | Co-Founder Avatar: Priya (Fintech Architect) |
| **20** | `empty_discover_deck` | `public/images/empty-discover-deck.png` | `16:9` (1024×576) | Discover Page: Empty Match Deck Graphic |
| **21** | `empty_messages_chat` | `public/images/empty-messages-chat.png` | `16:9` (1024×576) | Messages Page: Empty Conversation Graphic |
| **22** | `cta_nebula_backdrop` | `public/images/cta-nebula-backdrop.png` | `16:9` (1920×1080) | Pre-Footer High-Conversion Call To Action Backdrop |

---

#### 2.3.2 Detailed Asset Generation Prompts & Artistic Specifications

Every prompt is engineered to adhere to the high-tech, futuristic minimalist aesthetic inspired by `lets-code-landing-page.vercel.app` (deep obsidian dark mode, translucent glassmorphic surfaces, neon violet/cyan/rose lighting, octane render quality).

##### Suite 1: Hero & Experience Graphics
1. **`hero_network_matrix`**
   - **Path**: `public/images/hero-network-matrix.png`
   - **Aspect Ratio**: `16:9`
   - **Prompt**:
     > `"Ultra-detailed 3D digital art of a futuristic co-founder matching neural network matrix, interconnected glowing holographic builder nodes, luminous fiber-optic data streams pulsing in electric violet, cyan, and hot magenta, translucent frosted glass cards floating in 3D space, deep space obsidian background, volumetric lighting, subtle cosmic particle mist, cinematic raytracing, octane render, 8k resolution, sleek modern UI concept art, no text, clean composition."`
2. **`hero_synergy_orbit`**
   - **Path**: `public/images/hero-synergy-orbit.png`
   - **Aspect Ratio**: `1:1`
   - **Prompt**:
     > `"3D rendered futuristic holographic orbital ring representing synergy and compatibility between two startup founders, translucent glass spheres glowing with neon purple and cyan energy cores, floating particle aura, clean dark obsidian background, minimal modern aesthetic, octane render, studio lighting, hyper-realistic glass refraction."`

##### Suite 2: Bento Grid 3D Feature Graphics
3. **`bento_vibe_engine`** (Card 1: 4D Vibe Engine)
   - **Path**: `public/images/bento-vibe-engine.png`
   - **Aspect Ratio**: `1:1`
   - **Prompt**:
     > `"3D isometric digital artwork of a 4-dimensional futuristic holographic equalizer console, four glowing vertical translucent slider tracks in electric violet, cyan, emerald, and hot pink, dynamic energy soundwaves and particle sparks rising, frosted dark glass base plate, deep obsidian backdrop, cinematic soft glow, octane render, 8k."`
4. **`bento_roles_complement`** (Card 2: Inverted Role Filtering)
   - **Path**: `public/images/bento-roles-complement.png`
   - **Aspect Ratio**: `1:1`
   - **Prompt**:
     > `"3D isometric glowing puzzle spheres interlocking in perfect harmony, one sphere inscribed with glowing code syntax brackets, the other with a glowing design stylus and color prism, connected by a neon energy beam, translucent dark glass materials, soft studio lighting on dark background, ultra-sleek UI asset, 8k."`
5. **`bento_project_incubator`** (Card 3: Project Pitch & Budget)
   - **Path**: `public/images/bento-project-incubator.png`
   - **Aspect Ratio**: `1:1`
   - **Prompt**:
     > `"3D rendered futuristic startup launchpad container, a glowing geometric crystal prism incubating inside a frosted glass chamber, floating holographic milestone roadmap nodes in neon emerald and cyan, dark space background, volumetric rim lighting, octane render, clean modern minimalism."`
6. **`bento_privacy_shield`** (Card 4: Zero-Spam Privacy Vault)
   - **Path**: `public/images/bento-privacy-shield.png`
   - **Aspect Ratio**: `1:1`
   - **Prompt**:
     > `"3D isometric futuristic security shield vault crafted from dark tinted translucent frosted glass, surrounded by glowing neon cyan protective rings and a subtle holographic biometric lock iris, ambient purple edge illumination, clean dark obsidian background, high tech cyber privacy aesthetic, octane render 8k."`
7. **`bento_smart_contracts`** (Card 5: Milestone Contracts & Chat)
   - **Path**: `public/images/bento-smart-contracts.png`
   - **Aspect Ratio**: `1:1`
   - **Prompt**:
     > `"3D rendered futuristic digital smart contract document floating in space, glowing neon escrow handshake seal in gold and cyan, translucent glass layers with encrypted binary data streams, dark backdrop with ambient violet glow, ultra-detailed textures, raytraced reflections."`

##### Suite 3: Industry Category 3D Hologram Icons
8. **`role_software_coder`** (Software & IT)
   - **Path**: `public/images/role-software-coder.png`
   - **Aspect Ratio**: `1:1`
   - **Prompt**:
     > `"3D stylized icon of floating translucent code brackets { } made of glowing electric violet and cyan crystal glass, subtle circuit board light trails, dark obsidian background, soft neon glow, minimalist 3D icon, octane render, 8k."`
9. **`role_creative_designer`** (Creative & Design)
   - **Path**: `public/images/role-creative-designer.png`
   - **Aspect Ratio**: `1:1`
   - **Prompt**:
     > `"3D stylized icon of a floating translucent glass design palette and glowing holographic bezier curve pen, vibrant magenta and rose glowing aura, dark background, smooth frosted glass reflections, minimalist modern 3D icon."`
10. **`role_hardware_maker`** (Engineering & Hardware)
    - **Path**: `public/images/role-hardware-maker.png`
    - **Aspect Ratio**: `1:1`
    - **Prompt**:
      > `"3D stylized icon of an intricate floating mechanical gear and microchip processor made of frosted tinted glass and glowing emerald neon copper traces, dark space backdrop, clean futuristic tech icon."`
11. **`role_business_growth`** (Business & Sales)
    - **Path**: `public/images/role-business-growth.png`
    - **Aspect Ratio**: `1:1`
    - **Prompt**:
      > `"3D stylized icon of an upward exponential growth graph rendered as translucent glowing golden amber and cyan glass pillars, floating geometric spark nodes, dark minimalist background, clean isometric icon."`
12. **`role_marketing_writer`** (Marketing & Content)
    - **Path**: `public/images/role-marketing-writer.png`
    - **Aspect Ratio**: `1:1`
    - **Prompt**:
      > `"3D stylized icon of a floating glowing holographic fountain pen nib leaving a luminous trail of cyan words and light particles, frosted glass texture, dark obsidian background, modern icon art."`
13. **`role_general_builder`** (Other / Polymath)
    - **Path**: `public/images/role-general-builder.png`
    - **Aspect Ratio**: `1:1`
    - **Prompt**:
      > `"3D stylized icon of a glowing multi-tool polyhedral crystal cube emitting multifaceted rainbow light rays, frosted dark glass body, floating in dark void, futuristic builder emblem."`

##### Suite 4: Co-Founder Avatars (Diverse Builder Archetypes)
14. **`avatar_alex_coder`** (Alex - AI Systems Engineer)
    - **Path**: `public/images/avatar-alex-coder.png`
    - **Aspect Ratio**: `1:1`
    - **Prompt**:
      > `"High-fidelity 3D stylized avatar portrait of a focused male software engineer with glasses, cyberpunk subtle rim lighting in neon cyan and purple, clean dark background, Pixar/Overwatch quality 3D character render, highly detailed."`
15. **`avatar_maya_designer`** (Maya - Product Designer)
    - **Path**: `public/images/avatar-maya-designer.png`
    - **Aspect Ratio**: `1:1`
    - **Prompt**:
      > `"High-fidelity 3D stylized avatar portrait of a creative female product designer with sleek hairstyle, illuminated by warm rose and violet studio lights, dark obsidian background, friendly confident expression, 3D character render."`
16. **`avatar_david_hardware`** (David - Robotics Maker)
    - **Path**: `public/images/avatar-david-hardware.png`
    - **Aspect Ratio**: `1:1`
    - **Prompt**:
      > `"High-fidelity 3D stylized avatar portrait of a male robotics builder with workshop headband, subtle emerald green rim lighting, confident builder vibe, detailed 3D digital art."`
17. **`avatar_elena_growth`** (Elena - Growth Hacker)
    - **Path**: `public/images/avatar-elena-growth.png`
    - **Aspect Ratio**: `1:1`
    - **Prompt**:
      > `"High-fidelity 3D stylized avatar portrait of an ambitious female startup founder, dynamic lighting in electric blue and amber, dark background, sharp professional look, 3D character render."`
18. **`avatar_carlos_writer`** (Carlos - Narrative Architect)
    - **Path**: `public/images/avatar-carlos-writer.png`
    - **Aspect Ratio**: `1:1`
    - **Prompt**:
      > `"High-fidelity 3D stylized avatar portrait of a charismatic male writer with headphones, soft glowing magenta ambient lighting, thoughtful expression, 3D character art."`
19. **`avatar_priya_fintech`** (Priya - Fintech Architect)
    - **Path**: `public/images/avatar-priya-fintech.png`
    - **Aspect Ratio**: `1:1`
    - **Prompt**:
      > `"High-fidelity 3D stylized avatar portrait of a female financial tech engineer of South Asian descent, sharp modern styling, dual-tone cyan and gold rim lighting, dark studio backdrop."`

##### Suite 5: Empty States & Backdrop Graphics
20. **`empty_discover_deck`** (Discover Deck Empty State)
    - **Path**: `public/images/empty-discover-deck.png`
    - **Aspect Ratio**: `16:9`
    - **Prompt**:
      > `"3D artwork of a futuristic deep space radar observatory scanner searching for signals, circular glowing holographic concentric sonar rings expanding across a dark grid, floating distant constellations in violet and cyan, clean empty state illustration, no text, 8k."`
21. **`empty_messages_chat`** (Messages Empty State)
    - **Path**: `public/images/empty-messages-chat.png`
    - **Aspect Ratio**: `16:9`
    - **Prompt**:
      > `"3D artwork of two floating translucent holographic message envelopes hovering above a dark reflective glass plane, glowing with neon connection sparks, ambient purple aura, minimalist modern empty state concept art."`
22. **`cta_nebula_backdrop`** (Pre-Footer CTA Glowing Backdrop)
    - **Path**: `public/images/cta-nebula-backdrop.png`
    - **Aspect Ratio**: `16:9`
    - **Prompt**:
      > `"Vibrant cosmic dark space nebula with swirling vortex of glowing electric violet, hot magenta, and luminous cyan stardust, deep black obsidian edges, smooth radiant background banner texture, 8k resolution."`

---

### 2.4 Code Integration & Rendering Strategy

All generated images must be saved into `public/images/` and rendered using Next.js standard imports or `<Image>` / `<img>` elements with proper width, height, and priority tags to ensure 0 build errors.

```tsx
// Example Landing Page Hero Visual Integration:
import Image from "next/image";

<div className="hero-visual-wrapper">
  <Image
    src="/images/hero-network-matrix.png"
    alt="Passion Protocol Co-Founder Synergy Matrix"
    width={720}
    height={480}
    priority
    className="hero-main-image"
  />
</div>

// Example Bento Grid Card Integration:
<div className="bento-card">
  <div className="bento-card-image-wrap">
    <Image
      src="/images/bento-vibe-engine.png"
      alt="4D Vibe Engine Visualizer"
      width={320}
      height={320}
      className="bento-image"
    />
  </div>
  <h3>4D Vibe & Chemistry Engine</h3>
  <p>Calibrate your pace, comms, risk, and energy for instant deterministic compatibility.</p>
</div>
```

---

## 3. Caveats

1. **Static Directory Structure**:
   - The directory `public/images/` must be created prior to writing or saving generated image assets.
2. **Next.js 15 Image Handling**:
   - When using Next.js `<Image>`, always specify `width` and `height` (or `fill` with a relative parent container) to prevent layout shift and lint warnings.
3. **Database Integrity & Server Actions**:
   - UI styling updates must strictly preserve the existing form action parameters (`formData.get("codename")`, `saveOnboarding`, `sendConnect`, `respondToConnect`, `saveProject`, `sendMessage`, `proposePartnership`).
4. **Dark Mode Text Contrast**:
   - All text in secondary containers (`.panel`, `.identity`, `.match-card`, `.chat-sidebar`) must use `--text` (`#f8fafc`) or `--muted` (`#94a3b8`) rather than legacy `#1c1230` to guarantee WCAG AA contrast against dark surfaces.

---

## 4. Conclusion

This survey provides an exhaustive, end-to-end blueprint for aligning the core authenticated application pages with the modern dark glassmorphic design system and executing the full AI Synthetic Image Asset Inventory (Requirement R3).

### Key Deliverables Summary:
1. **Design System Alignment Model**: Defined unified CSS variables, glassmorphism card rules, interactive buttons, form input states, and responsive navigation inherited across all core pages (`/discover`, `/profile`, `/messages`, `/onboarding`, `/login`).
2. **Comprehensive 22-Asset AI Inventory**: Created detailed specifications with exact paths in `public/images/`, aspect ratios, UI placements, and production-grade text prompts for generating hero graphics, bento grid illustrations, role badges, co-founder avatars, empty states, and CTA backdrops.
3. **Seamless Implementation Roadmap**: Structured for worker agents to generate assets and update components without disrupting existing Supabase data flow or routing logic.

---

## 5. Verification Method

To independently verify the core app upgrade and asset inventory implementation:

### 5.1 Build & Static Analysis
```bash
npm run build
```
*Expected Result*: Build completes with **0 TypeScript and 0 ESLint errors**.

### 5.2 Asset Verification
```powershell
Get-ChildItem -Path "d:\passion-protocol\public\images"
```
*Verification Checks*:
- [ ] Confirm all 22 required image files exist in `public/images/`.
- [ ] Confirm files are valid PNGs with correct aspect ratios and dimensions.
- [ ] Confirm Next.js routes serve images cleanly without 404s (e.g. `http://localhost:3000/images/hero-network-matrix.png`).

### 5.3 Per-Page Visual & Functional Verification
1. **Landing Page (`/`)**:
   - Verify Hero visual, 5 Bento Grid cards with images, Testimonial avatars, and Pre-footer CTA render with deep space dark glass styling.
2. **Discover Page (`/discover`)**:
   - Verify dark glass match cards, role tags, animated synergy score badges, and project pitch snippets.
   - Verify empty state displays `empty-discover-deck.png` when 0 matches remain.
3. **Profile Page (`/profile`)**:
   - Verify dark identity card, glowing vibe fingerprint sliders, active partnerships grid, and project form.
4. **Messages Page (`/messages`)**:
   - Verify glass split-view chat interface, gradient user bubbles, dark partner bubbles, and holographic contract cards.
5. **Onboarding Page (`/onboarding`)**:
   - Verify 3-step glass card flow, category chips with glowing selection states, and custom range sliders.
6. **Login Page (`/login`)**:
   - Verify dark glass auth card with glowing action button.
