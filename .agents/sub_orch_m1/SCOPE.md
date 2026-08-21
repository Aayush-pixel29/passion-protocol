# Scope: Milestone 1 — Design Tokens & AI Asset Generation

## Architecture
- **CSS Design System**: Centralized design system in `app/globals.css` with dark space obsidian background (`--bg: #090a10`), frosted glassmorphic card containers (`backdrop-filter: blur(20px)`), vibrant neon accents (`--accent: #ff3d6e`, `--accent-2: #8b5cf6`, `--accent-3: #06b6d4`, `--accent-4: #10b981`), typography variables, button and card variants, and responsive layout rules.
- **AI Synthetic Asset Pipeline**: Generation of 22 high-resolution 3D assets placed in `public/images/` adhering strictly to the specs in `explorer_survey_3/handoff.md`.

## Feature Inventory
| # | Feature | Description | Milestone | Source | Status |
|---|---------|-------------|-----------|--------|--------|
| F1 | Dark Theme Design Tokens | Centralized CSS custom properties in `app/globals.css` (obsidian canvas, glassmorphism surfaces, neon violet/cyan/emerald accents, typography, button variants) | M1 | Survey | DONE |
| F2 | Synthetic AI Asset Suite | 22 custom 3D image assets in `public/images/` (hero network matrix, bento 3D graphics, builder avatars, role icons, empty states, CTA backdrop) | M1 | Survey / R3 | DONE |

## Milestone 1 Breakdown & Plan
| Sub-Task | Scope | Dependencies | Status |
|----------|-------|-------------|--------|
| M1.1 Asset Generation | Create `public/images/` and generate 22 custom 3D synthetic assets per exact specs | none | DONE |
| M1.2 Global CSS Tokens | Overhaul `app/globals.css` with obsidian dark mode, glassmorphism, accent colors, and component styles | none | DONE |
| M1.3 Verification & Audit | Verify build passes, all 22 assets exist and are valid PNGs, CSS has 0 syntax errors, and audit is CLEAN | M1.1, M1.2 | DONE |

## Interface Contracts
### Design Tokens (`app/globals.css`) ↔ Application Pages
- Custom Properties: `--bg`, `--bg-2`, `--bg-3`, `--surface`, `--surface-solid`, `--surface-card`, `--surface-hover`, `--surface-inset`, `--stroke`, `--stroke-hover`, `--stroke-cyan`, `--text`, `--text-bright`, `--muted`, `--accent`, `--accent-2`, `--accent-3`, `--accent-4`, `--radius`, `--font-sans`, `--font-display`.
- Classes: `.glass-panel`, `.match-card`, `.score-badge`, `.role-chip`, `.role-tag`, `.avatar-badge`, `.primary-btn`, `.outline-btn`, `.pill-btn`, `.ghost-btn`, `.bar-track`, `.bar-fill`.

### Synthetic Image Assets (`public/images/`) ↔ UI Components
- Format: PNG images in `public/images/` referenced via `/images/<filename>.png` in Next.js `<Image>` or `<img>` with explicit `width` and `height`.
- Master List of 22 Assets:
  1. `hero-network-matrix.png` (16:9)
  2. `hero-synergy-orbit.png` (1:1)
  3. `bento-vibe-engine.png` (1:1)
  4. `bento-roles-complement.png` (1:1)
  5. `bento-project-incubator.png` (1:1)
  6. `bento-privacy-shield.png` (1:1)
  7. `bento-smart-contracts.png` (1:1)
  8. `role-software-coder.png` (1:1)
  9. `role-creative-designer.png` (1:1)
  10. `role-hardware-maker.png` (1:1)
  11. `role-business-growth.png` (1:1)
  12. `role-marketing-writer.png` (1:1)
  13. `role-general-builder.png` (1:1)
  14. `avatar-alex-coder.png` (1:1)
  15. `avatar-maya-designer.png` (1:1)
  16. `avatar-david-hardware.png` (1:1)
  17. `avatar-elena-growth.png` (1:1)
  18. `avatar-carlos-writer.png` (1:1)
  19. `avatar-priya-fintech.png` (1:1)
  20. `empty-discover-deck.png` (16:9)
  21. `empty-messages-chat.png` (16:9)
  22. `cta-nebula-backdrop.png` (16:9)
