from write_all import append_part

append_part("""
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
""")
