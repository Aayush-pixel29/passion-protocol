# AI Synthetic Image Asset Generation Implementation Plan (Milestone 1)

**Agent**: `explorer_m1_1`  
**Working Directory**: `d:\passion-protocol\.agents\explorer_m1_1`  
**Target File**: `d:\passion-protocol\.agents\explorer_m1_1\handoff.md`  
**Parent**: `sub_orch_m1` (Conversation ID: `9c420d0f-aaab-49b8-b7e7-7180e735d5de`)  
**Mission**: Investigate and produce a comprehensive, structured implementation plan for generating all 22 AI synthetic image assets into `d:\passion-protocol\public\images\` per the exact prompts and aspect ratios in `explorer_survey_3/handoff.md`.

---

## 1. Observation

### 1.1 Direct Workspace Observations
1. **Directory State**:
   - Inspected `d:\passion-protocol\`: The directory `d:\passion-protocol\public\` does not exist yet.
   - Target asset destination `d:\passion-protocol\public\images\` must be created before placing image files.
2. **Framework & Asset Serving Rules**:
   - Next.js 15.5.4 serves static files placed in `public/images/<file>.png` via the public URI path `/images/<file>.png`.
   - UI components (`app/page.tsx`, `components/DiscoverDeck.tsx`, `components/ChatInterface.tsx`, etc.) import and render these images using `<Image src="/images/<filename>.png" ... />` or `<img src="/images/<filename>.png" ... />`.
3. **Tool Parameter Specifications (`generate_image`)**:
   - `AspectRatio`: Must be one of `'1:1'`, `'2:3'`, `'3:2'`, `'3:4'`, `'4:3'`, `'9:16'`, `'16:9'` (Default: `'1:1'`).
   - `ImageName`: All lowercase with underscores, describing what the image contains, maximum 3 words (e.g. `'hero_network_matrix'`, `'bento_vibe_engine'`).
   - `Prompt`: Text prompt describing the 3D aesthetic, lighting, objects, background, and rendering style.
   - `toolAction` & `toolSummary`: Standard descriptive string metadata.
   - Generated output: Saved as a PNG artifact, which can then be placed into `d:\passion-protocol\public\images\<kebab-name>.png`.

### 1.2 Inventory Audit (22 Assets)
From `d:\passion-protocol\.agents\explorer_survey_3\handoff.md` and `PROJECT.md`, the 22 required image assets are divided into 5 functional suites:
- **Suite 1: Hero & Experience Graphics** (2 assets) — 1× `16:9`, 1× `1:1`
- **Suite 2: Bento Grid 3D Feature Graphics** (5 assets) — 5× `1:1`
- **Suite 3: Industry Category 3D Hologram Icons** (6 assets) — 6× `1:1`
- **Suite 4: Co-Founder Avatars (Diverse Builder Archetypes)** (6 assets) — 6× `1:1`
- **Suite 5: Empty States & Backdrop Graphics** (3 assets) — 3× `16:9`

Total Aspect Ratio Breakdown:
- **`16:9`** (4 assets): `hero-network-matrix.png`, `empty-discover-deck.png`, `empty-messages-chat.png`, `cta-nebula-backdrop.png`
- **`1:1`** (18 assets): All other 18 graphics, icons, avatars, and bento cards.

---

## 2. Logic Chain

### 2.1 Mapping & Naming Consistency

To avoid discrepancies between tool parameter constraints (`ImageName` max 3 words, snake_case) and Next.js asset references (kebab-case in `public/images/`), the plan establishes a deterministic 1:1 mapping:

```
[Tool ImageName] (snake_case, <= 3 words)
      │
      ▼
[generate_image tool execution]
      │
      ▼
[Artifact Output / Buffer]
      │
      ▼
[Filesystem Destination] -> public/images/<kebab-case>.png
      │
      ▼
[Next.js URI Route] -> /images/<kebab-case>.png
```

### 2.2 Complete Asset Specification Matrix

| # | Tool `ImageName` (<=3 words) | Target File Path | Ratio | UI Component & Placement |
|---|---|---|---|---|
| 01 | `hero_network_matrix` | `public/images/hero-network-matrix.png` | `16:9` | Landing Page Hero Main Visual / Backdrop Aura |
| 02 | `hero_synergy_orbit` | `public/images/hero-synergy-orbit.png` | `1:1` | Landing Page Hero Interactive Preview Card Node |
| 03 | `bento_vibe_engine` | `public/images/bento-vibe-engine.png` | `1:1` | Bento Grid Card 1: 4D Vibe & Chemistry Engine |
| 04 | `bento_roles_complement` | `public/images/bento-roles-complement.png` | `1:1` | Bento Grid Card 2: Inverted Complementary Role Discovery |
| 05 | `bento_project_incubator`| `public/images/bento-project-incubator.png`| `1:1` | Bento Grid Card 3: Project Incubator & Milestone Scope |
| 06 | `bento_privacy_shield` | `public/images/bento-privacy-shield.png` | `1:1` | Bento Grid Card 4: Zero-Spam Double Opt-in Security Vault |
| 07 | `bento_smart_contracts` | `public/images/bento-smart-contracts.png` | `1:1` | Bento Grid Card 5: Milestone Contracts & Real-Time Chat |
| 08 | `role_software_coder` | `public/images/role-software-coder.png` | `1:1` | Category 3D Icon: Software & IT / Developer |
| 09 | `role_creative_designer`| `public/images/role-creative-designer.png`| `1:1` | Category 3D Icon: Creative & Design / UI/UX |
| 10 | `role_hardware_maker` | `public/images/role-hardware-maker.png` | `1:1` | Category 3D Icon: Engineering & Hardware / Robotics |
| 11 | `role_business_growth` | `public/images/role-business-growth.png` | `1:1` | Category 3D Icon: Business & Sales / Founder |
| 12 | `role_marketing_writer` | `public/images/role-marketing-writer.png` | `1:1` | Category 3D Icon: Marketing & Content / Storyteller |
| 13 | `role_general_builder` | `public/images/role-general-builder.png` | `1:1` | Category 3D Icon: General Operator / Polymath |
| 14 | `avatar_alex_coder` | `public/images/avatar-alex-coder.png` | `1:1` | Co-Founder Avatar: Alex (AI Systems Architect) |
| 15 | `avatar_maya_designer` | `public/images/avatar-maya-designer.png` | `1:1` | Co-Founder Avatar: Maya (Product Designer) |
| 16 | `avatar_david_hardware` | `public/images/avatar-david-hardware.png` | `1:1` | Co-Founder Avatar: David (Robotics Engineer) |
| 17 | `avatar_elena_growth` | `public/images/avatar-elena-growth.png` | `1:1` | Co-Founder Avatar: Elena (Growth Strategist) |
| 18 | `avatar_carlos_writer` | `public/images/avatar-carlos-writer.png` | `1:1` | Co-Founder Avatar: Carlos (Technical Writer) |
| 19 | `avatar_priya_fintech` | `public/images/avatar-priya-fintech.png` | `1:1` | Co-Founder Avatar: Priya (Fintech Architect) |
| 20 | `empty_discover_deck` | `public/images/empty-discover-deck.png` | `16:9` | Discover Page: Empty Match Deck Graphic |
| 21 | `empty_messages_chat` | `public/images/empty-messages-chat.png` | `16:9` | Messages Page: Empty Conversation Graphic |
| 22 | `cta_nebula_backdrop` | `public/images/cta-nebula-backdrop.png` | `16:9` | Pre-Footer High-Conversion Call To Action Backdrop |

---

### 2.3 Exact Tool Invocations & Payload Definitions

Here are the exact 22 tool execution payloads for the implementation worker:

#### Suite 1: Hero & Experience Graphics (2 Assets)

```json
// Asset 01: hero-network-matrix.png
{
  "AspectRatio": "16:9",
  "ImageName": "hero_network_matrix",
  "Prompt": "Ultra-detailed 3D digital art of a futuristic co-founder matching neural network matrix, interconnected glowing holographic builder nodes, luminous fiber-optic data streams pulsing in electric violet, cyan, and hot magenta, translucent frosted glass cards floating in 3D space, deep space obsidian background, volumetric lighting, subtle cosmic particle mist, cinematic raytracing, octane render, 8k resolution, sleek modern UI concept art, no text, clean composition.",
  "toolAction": "Generating hero network matrix",
  "toolSummary": "Hero network matrix image"
}

// Asset 02: hero-synergy-orbit.png
{
  "AspectRatio": "1:1",
  "ImageName": "hero_synergy_orbit",
  "Prompt": "3D rendered futuristic holographic orbital ring representing synergy and compatibility between two startup founders, translucent glass spheres glowing with neon purple and cyan energy cores, floating particle aura, clean dark obsidian background, minimal modern aesthetic, octane render, studio lighting, hyper-realistic glass refraction.",
  "toolAction": "Generating hero synergy orbit",
  "toolSummary": "Hero synergy orbit image"
}
```

#### Suite 2: Bento Grid 3D Feature Graphics (5 Assets)

```json
// Asset 03: bento-vibe-engine.png
{
  "AspectRatio": "1:1",
  "ImageName": "bento_vibe_engine",
  "Prompt": "3D isometric digital artwork of a 4-dimensional futuristic holographic equalizer console, four glowing vertical translucent slider tracks in electric violet, cyan, emerald, and hot pink, dynamic energy soundwaves and particle sparks rising, frosted dark glass base plate, deep obsidian backdrop, cinematic soft glow, octane render, 8k.",
  "toolAction": "Generating bento vibe engine",
  "toolSummary": "Bento vibe engine image"
}

// Asset 04: bento-roles-complement.png
{
  "AspectRatio": "1:1",
  "ImageName": "bento_roles_complement",
  "Prompt": "3D isometric glowing puzzle spheres interlocking in perfect harmony, one sphere inscribed with glowing code syntax brackets, the other with a glowing design stylus and color prism, connected by a neon energy beam, translucent dark glass materials, soft studio lighting on dark background, ultra-sleek UI asset, 8k.",
  "toolAction": "Generating bento roles complement",
  "toolSummary": "Bento roles complement image"
}

// Asset 05: bento-project-incubator.png
{
  "AspectRatio": "1:1",
  "ImageName": "bento_project_incubator",
  "Prompt": "3D rendered futuristic startup launchpad container, a glowing geometric crystal prism incubating inside a frosted glass chamber, floating holographic milestone roadmap nodes in neon emerald and cyan, dark space background, volumetric rim lighting, octane render, clean modern minimalism.",
  "toolAction": "Generating bento project incubator",
  "toolSummary": "Bento project incubator image"
}

// Asset 06: bento-privacy-shield.png
{
  "AspectRatio": "1:1",
  "ImageName": "bento_privacy_shield",
  "Prompt": "3D isometric futuristic security shield vault crafted from dark tinted translucent frosted glass, surrounded by glowing neon cyan protective rings and a subtle holographic biometric lock iris, ambient purple edge illumination, clean dark obsidian background, high tech cyber privacy aesthetic, octane render 8k.",
  "toolAction": "Generating bento privacy shield",
  "toolSummary": "Bento privacy shield image"
}

// Asset 07: bento-smart-contracts.png
{
  "AspectRatio": "1:1",
  "ImageName": "bento_smart_contracts",
  "Prompt": "3D rendered futuristic digital smart contract document floating in space, glowing neon escrow handshake seal in gold and cyan, translucent glass layers with encrypted binary data streams, dark backdrop with ambient violet glow, ultra-detailed textures, raytraced reflections.",
  "toolAction": "Generating bento smart contracts",
  "toolSummary": "Bento smart contracts image"
}
```

#### Suite 3: Industry Category 3D Hologram Icons (6 Assets)

```json
// Asset 08: role-software-coder.png
{
  "AspectRatio": "1:1",
  "ImageName": "role_software_coder",
  "Prompt": "3D stylized icon of floating translucent code brackets { } made of glowing electric violet and cyan crystal glass, subtle circuit board light trails, dark obsidian background, soft neon glow, minimalist 3D icon, octane render, 8k.",
  "toolAction": "Generating role software coder",
  "toolSummary": "Role software coder icon"
}

// Asset 09: role-creative-designer.png
{
  "AspectRatio": "1:1",
  "ImageName": "role_creative_designer",
  "Prompt": "3D stylized icon of a floating translucent glass design palette and glowing holographic bezier curve pen, vibrant magenta and rose glowing aura, dark background, smooth frosted glass reflections, minimalist modern 3D icon.",
  "toolAction": "Generating role creative designer",
  "toolSummary": "Role creative designer icon"
}

// Asset 10: role-hardware-maker.png
{
  "AspectRatio": "1:1",
  "ImageName": "role_hardware_maker",
  "Prompt": "3D stylized icon of an intricate floating mechanical gear and microchip processor made of frosted tinted glass and glowing emerald neon copper traces, dark space backdrop, clean futuristic tech icon.",
  "toolAction": "Generating role hardware maker",
  "toolSummary": "Role hardware maker icon"
}

// Asset 11: role-business-growth.png
{
  "AspectRatio": "1:1",
  "ImageName": "role_business_growth",
  "Prompt": "3D stylized icon of an upward exponential growth graph rendered as translucent glowing golden amber and cyan glass pillars, floating geometric spark nodes, dark minimalist background, clean isometric icon.",
  "toolAction": "Generating role business growth",
  "toolSummary": "Role business growth icon"
}

// Asset 12: role-marketing-writer.png
{
  "AspectRatio": "1:1",
  "ImageName": "role_marketing_writer",
  "Prompt": "3D stylized icon of a floating glowing holographic fountain pen nib leaving a luminous trail of cyan words and light particles, frosted glass texture, dark obsidian background, modern icon art.",
  "toolAction": "Generating role marketing writer",
  "toolSummary": "Role marketing writer icon"
}

// Asset 13: role-general-builder.png
{
  "AspectRatio": "1:1",
  "ImageName": "role_general_builder",
  "Prompt": "3D stylized icon of a glowing multi-tool polyhedral crystal cube emitting multifaceted rainbow light rays, frosted dark glass body, floating in dark void, futuristic builder emblem.",
  "toolAction": "Generating role general builder",
  "toolSummary": "Role general builder icon"
}
```

#### Suite 4: Co-Founder Avatars (6 Assets)

```json
// Asset 14: avatar-alex-coder.png
{
  "AspectRatio": "1:1",
  "ImageName": "avatar_alex_coder",
  "Prompt": "High-fidelity 3D stylized avatar portrait of a focused male software engineer with glasses, cyberpunk subtle rim lighting in neon cyan and purple, clean dark background, Pixar/Overwatch quality 3D character render, highly detailed.",
  "toolAction": "Generating avatar alex coder",
  "toolSummary": "Avatar alex coder"
}

// Asset 15: avatar-maya-designer.png
{
  "AspectRatio": "1:1",
  "ImageName": "avatar_maya_designer",
  "Prompt": "High-fidelity 3D stylized avatar portrait of a creative female product designer with sleek hairstyle, illuminated by warm rose and violet studio lights, dark obsidian background, friendly confident expression, 3D character render.",
  "toolAction": "Generating avatar maya designer",
  "toolSummary": "Avatar maya designer"
}

// Asset 16: avatar-david-hardware.png
{
  "AspectRatio": "1:1",
  "ImageName": "avatar_david_hardware",
  "Prompt": "High-fidelity 3D stylized avatar portrait of a male robotics builder with workshop headband, subtle emerald green rim lighting, confident builder vibe, detailed 3D digital art.",
  "toolAction": "Generating avatar david hardware",
  "toolSummary": "Avatar david hardware"
}

// Asset 17: avatar-elena-growth.png
{
  "AspectRatio": "1:1",
  "ImageName": "avatar_elena_growth",
  "Prompt": "High-fidelity 3D stylized avatar portrait of an ambitious female startup founder, dynamic lighting in electric blue and amber, dark background, sharp professional look, 3D character render.",
  "toolAction": "Generating avatar elena growth",
  "toolSummary": "Avatar elena growth"
}

// Asset 18: avatar-carlos-writer.png
{
  "AspectRatio": "1:1",
  "ImageName": "avatar_carlos_writer",
  "Prompt": "High-fidelity 3D stylized avatar portrait of a charismatic male writer with headphones, soft glowing magenta ambient lighting, thoughtful expression, 3D character art.",
  "toolAction": "Generating avatar carlos writer",
  "toolSummary": "Avatar carlos writer"
}

// Asset 19: avatar-priya-fintech.png
{
  "AspectRatio": "1:1",
  "ImageName": "avatar_priya_fintech",
  "Prompt": "High-fidelity 3D stylized avatar portrait of a female financial tech engineer of South Asian descent, sharp modern styling, dual-tone cyan and gold rim lighting, dark studio backdrop.",
  "toolAction": "Generating avatar priya fintech",
  "toolSummary": "Avatar priya fintech"
}
```

#### Suite 5: Empty States & Backdrop Graphics (3 Assets)

```json
// Asset 20: empty-discover-deck.png
{
  "AspectRatio": "16:9",
  "ImageName": "empty_discover_deck",
  "Prompt": "3D artwork of a futuristic deep space radar observatory scanner searching for signals, circular glowing holographic concentric sonar rings expanding across a dark grid, floating distant constellations in violet and cyan, clean empty state illustration, no text, 8k.",
  "toolAction": "Generating empty discover deck",
  "toolSummary": "Empty discover deck graphic"
}

// Asset 21: empty-messages-chat.png
{
  "AspectRatio": "16:9",
  "ImageName": "empty_messages_chat",
  "Prompt": "3D artwork of two floating translucent holographic message envelopes hovering above a dark reflective glass plane, glowing with neon connection sparks, ambient purple aura, minimalist modern empty state concept art.",
  "toolAction": "Generating empty messages chat",
  "toolSummary": "Empty messages chat graphic"
}

// Asset 22: cta-nebula-backdrop.png
{
  "AspectRatio": "16:9",
  "ImageName": "cta_nebula_backdrop",
  "Prompt": "Vibrant cosmic dark space nebula with swirling vortex of glowing electric violet, hot magenta, and luminous cyan stardust, deep black obsidian edges, smooth radiant background banner texture, 8k resolution.",
  "toolAction": "Generating cta nebula backdrop",
  "toolSummary": "CTA nebula backdrop graphic"
}
```

---

### 2.4 Worker Execution Workflow & Step-by-Step Instructions

1. **Step 1: Create Target Directory Structure**
   Run shell command to create the directory:
   ```powershell
   New-Item -ItemType Directory -Path "d:\passion-protocol\public\images" -Force
   ```

2. **Step 2: Execute AI Image Generations (Batch Processing)**
   Execute `generate_image` tool calls in 5 batches (Suites 1 through 5).

3. **Step 3: Copy/Place Artifacts into `public/images/`**
   Ensure each generated artifact is saved/copied to its exact target path (`d:\passion-protocol\public\images\<filename>.png`).
   For any direct file placement script or copy step, map snake_case to kebab-case filename:
   ```
   hero_network_matrix.png     -> public/images/hero-network-matrix.png
   hero_synergy_orbit.png      -> public/images/hero-synergy-orbit.png
   bento_vibe_engine.png       -> public/images/bento-vibe-engine.png
   bento_roles_complement.png  -> public/images/bento-roles-complement.png
   bento_project_incubator.png -> public/images/bento-project-incubator.png
   bento_privacy_shield.png    -> public/images/bento-privacy-shield.png
   bento_smart_contracts.png   -> public/images/bento-smart-contracts.png
   role_software_coder.png     -> public/images/role-software-coder.png
   role_creative_designer.png  -> public/images/role-creative-designer.png
   role_hardware_maker.png     -> public/images/role-hardware-maker.png
   role_business_growth.png    -> public/images/role-business-growth.png
   role_marketing_writer.png   -> public/images/role-marketing-writer.png
   role_general_builder.png    -> public/images/role-general-builder.png
   avatar_alex_coder.png       -> public/images/avatar-alex-coder.png
   avatar_maya_designer.png    -> public/images/avatar-maya-designer.png
   avatar_david_hardware.png   -> public/images/avatar-david-hardware.png
   avatar_elena_growth.png     -> public/images/avatar-elena-growth.png
   avatar_carlos_writer.png    -> public/images/avatar-carlos-writer.png
   avatar_priya_fintech.png    -> public/images/avatar-priya-fintech.png
   empty_discover_deck.png     -> public/images/empty-discover-deck.png
   empty_messages_chat.png     -> public/images/empty-messages-chat.png
   cta_nebula_backdrop.png     -> public/images/cta-nebula-backdrop.png
   ```

4. **Step 4: Execute Validation & Integrity Verification**
   Run an automated check script to confirm all 22 files exist, have non-zero sizes, and valid PNG headers.

---

## 3. Caveats

1. **Target Directory Pre-requisite**:
   - `d:\passion-protocol\public\images\` does not exist initially. Any file write or copy operation will fail if the directory is not created first.
2. **Tool Parameter vs File Naming**:
   - The tool parameter `ImageName` requires lowercase with underscores (max 3 words). Target files in `public/images/` use standard kebab-case (`hero-network-matrix.png`). Implementers must ensure accurate mapping.
3. **Artifact Directory Resolution**:
   - Artifacts generated by `generate_image` reside in the session brain artifact folder (`C:\Users\Aayush\.gemini\antigravity\brain\2e874493-4d05-4c37-9821-d0d7f6597da3\`). When generated, they must be copied into `d:\passion-protocol\public\images\`.
4. **Next.js `<Image>` Tag Performance**:
   - In Milestone 2 (Landing Page) and Milestone 3 (Core App), all `<Image>` tags referencing these assets should include explicit `width` and `height` properties or `fill` with `sizes` to satisfy Next.js ESLint rules and eliminate layout shift.

---

## 4. Conclusion

The synthetic AI asset generation plan for Milestone 1 is completely specified and ready for immediate implementation.

### Key Summary:
- **Total Assets**: 22 high-resolution 3D synthetic image assets.
- **Target Folder**: `d:\passion-protocol\public\images\`
- **Tool Payloads**: 22 fully formulated `generate_image` JSON payloads with exact prompts, aspect ratios (`16:9` and `1:1`), and compliant `ImageName` values.
- **Dependencies**: Milestone 1 has 0 external blocking dependencies and unblocks Milestone 2 (Landing Page) and Milestone 3 (Core App Pages).

---

## 5. Verification Method

To independently verify the AI asset generation once executed by the worker agent:

### 5.1 Directory & File Count Verification
Run the following PowerShell script from workspace root:
```powershell
$targetDir = "d:\passion-protocol\public\images"
$files = Get-ChildItem -Path $targetDir -Filter "*.png"
Write-Output "Total image assets found: $($files.Count) / 22"

$expectedAssets = @(
  "hero-network-matrix.png", "hero-synergy-orbit.png",
  "bento-vibe-engine.png", "bento-roles-complement.png", "bento-project-incubator.png",
  "bento-privacy-shield.png", "bento-smart-contracts.png",
  "role-software-coder.png", "role-creative-designer.png", "role-hardware-maker.png",
  "role-business-growth.png", "role-marketing-writer.png", "role-general-builder.png",
  "avatar-alex-coder.png", "avatar-maya-designer.png", "avatar-david-hardware.png",
  "avatar-elena-growth.png", "avatar-carlos-writer.png", "avatar-priya-fintech.png",
  "empty-discover-deck.png", "empty-messages-chat.png", "cta-nebula-backdrop.png"
)

$missing = @()
foreach ($asset in $expectedAssets) {
  $p = Join-Path $targetDir $asset
  if (!(Test-Path $p) -or (Get-Item $p).Length -eq 0) {
    $missing += $asset
  }
}

if ($missing.Count -eq 0) {
  Write-Output "VERIFICATION PASS: All 22 image assets exist with non-zero size."
} else {
  Write-Error "VERIFICATION FAIL: Missing or empty assets: $($missing -join ', ')"
}
```

### 5.2 PNG Header Magic Bytes Check
Confirm that all 22 files start with PNG signature `89 50 4E 47 0D 0A 1A 0A`:
```powershell
$pngHeader = [byte[]](0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A)
Get-ChildItem -Path "d:\passion-protocol\public\images\*.png" | ForEach-Object {
  $bytes = [System.IO.File]::ReadAllBytes($_.FullName)[0..7]
  $matches = ($bytes -join " ") -eq ($pngHeader -join " ")
  if (-not $matches) {
    Write-Error "Corrupt PNG header in file: $($_.Name)"
  }
}
Write-Output "PNG header validation passed for all files."
```

### 5.3 Next.js Build Pass
```powershell
npm run build
```
Expected result: Build passes with 0 errors and zero missing static asset warnings.
