# Roadmap: Jack Basinski Engineering Portfolio

## Milestones

- ✅ **v1.0 MVP** — Phases 1-7 (shipped 2026-03-24)
- ✅ **v1.1 Content Admin Panel** — Phases 8-11 (shipped 2026-03-26)
- 🚧 **v1.2 UI Polish & Interactivity** — Phases 12-15 (in progress)

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-7) — SHIPPED 2026-03-24</summary>

- [x] Phase 1: Foundation, Navigation, and Hero (3/3 plans) — completed 2026-03-22
- [x] Phase 2: Content Sections (4/4 plans) — completed 2026-03-23
- [x] Phase 3: Interactive Features (4/4 plans) — completed 2026-03-23
- [x] Phase 4: Polish and Deployment (2/2 plans) — completed 2026-03-23
- [x] Phase 5: Visual Design Overhaul (3/3 plans) — completed 2026-03-23
- [x] Phase 6: Static Assets & Integration Fixes (2/2 plans) — completed 2026-03-24
- [x] Phase 7: Requirements Traceability Cleanup (1/1 plan) — completed 2026-03-24

Full details: [milestones/v1.0-ROADMAP.md](milestones/v1.0-ROADMAP.md)

</details>

<details>
<summary>✅ v1.1 Content Admin Panel (Phases 8-11) — SHIPPED 2026-03-26</summary>

- [x] Phase 8: Admin Infrastructure (4/4 plans) — completed 2026-03-25
- [x] Phase 9: Admin Shell, Preview, and Asset Pipeline (3/3 plans) — completed 2026-03-25
- [x] Phase 10: Content Editors (7/7 plans) — completed 2026-03-26
- [x] Phase 11: Keyboard Shortcut Wiring & Production Guard (1/1 plan) — completed 2026-03-26

Full details: [milestones/v1.1-ROADMAP.md](milestones/v1.1-ROADMAP.md)

</details>

### 🚧 v1.2 UI Polish & Interactivity (In Progress)

**Milestone Goal:** Elevate the portfolio's visual experience with cohesive theming, animated interactions, and modern component patterns — so every visitor immediately feels the craft behind the engineering.

- [ ] **Phase 12: Theme Foundation & Unified Background** - Blue-primary color system with system-preference dark/light mode and seamless page-spanning background
- [ ] **Phase 13: Animated Hero Gradient** - Breathing radial gradient behind hero content that blends into the unified background
- [ ] **Phase 14: Component Rebuilds** - Animated glassmorphic tabs (merged Skills & Tooling), horizontal project carousel, and scroll-triggered SVG timeline with glowing nodes
- [ ] **Phase 15: Contact Footer & Cleanup** - Clean contact links section, minimal footer, deprecated component removal, and production build verification

## Phase Details

### Phase 12: Theme Foundation & Unified Background
**Goal**: The entire site renders correctly in both light and dark modes with no visual seams between sections
**Depends on**: Phase 11 (v1.1 complete)
**Requirements**: THEME-01, THEME-02, THEME-03, THEME-04, THEME-05, THEME-06
**Success Criteria** (what must be TRUE):
  1. Visiting the site on a system set to dark mode shows a dark-themed page with no flash of light theme on load
  2. Visiting the site on a system set to light mode shows a light-themed page with correct contrast
  3. Scrolling from hero through all sections to footer shows one continuous background with no hard color breaks between sections
  4. Opening the PDF viewer (Dialog/Drawer) in both light and dark mode shows correctly styled chrome and readable content
  5. Toggling system preference between light and dark triggers a smooth color transition across all visible elements
**Plans**: 3 plans

Plans:
- [ ] 12-01-PLAN.md — Color system, dark mode tokens, blocking script, transitions
- [ ] 12-02-PLAN.md — Unified background, section cleanup, site component and PDF viewer theming
- [ ] 12-03-PLAN.md — Admin panel dark mode theming

### Phase 13: Animated Hero Gradient
**Goal**: The hero section makes a strong first impression with a subtle animated gradient that signals design craft
**Depends on**: Phase 12
**Requirements**: HERO-01, HERO-02, HERO-03
**Success Criteria** (what must be TRUE):
  1. The hero section displays a breathing radial gradient animation behind the text content that pulses subtly
  2. The gradient uses the blue-primary palette and blends seamlessly into the unified page background below
  3. Enabling prefers-reduced-motion in OS settings shows a static gradient with no animation
**Plans**: TBD

Plans:
- [ ] 13-01: TBD

### Phase 14: Component Rebuilds
**Goal**: The three highest-impact interactive sections are rebuilt with modern animated patterns that make the portfolio feel premium
**Depends on**: Phase 12
**Requirements**: SKTL-01, SKTL-02, SKTL-03, SKTL-04, PROJ-01, PROJ-02, PROJ-03, PROJ-04, PROJ-05, TIME-01, TIME-02, TIME-03, TIME-04
**Success Criteria** (what must be TRUE):
  1. Skills and Tooling appear as a single tabbed section where clicking a tab slides an animated indicator and fades in glassmorphic content panels
  2. Projects display in a horizontal carousel that can be navigated by dragging, swiping, or clicking arrow buttons, with the featured project in the first position
  3. Clicking a project card in the carousel opens the existing project detail Dialog/Drawer with PDF viewer
  4. Scrolling past the timeline draws a vertical SVG path progressively with glowing nodes that pulse and activate as their entries come into view
  5. The carousel scrolls independently without conflicting with Lenis page-level smooth scroll
**Plans**: TBD

Plans:
- [ ] 14-01: TBD
- [ ] 14-02: TBD
- [ ] 14-03: TBD

### Phase 15: Contact Footer & Cleanup
**Goal**: The page ends with a polished contact section and clean footer, and the codebase has no dead code from replaced components
**Depends on**: Phase 13, Phase 14
**Requirements**: CTFT-01, CTFT-02, CTFT-03
**Success Criteria** (what must be TRUE):
  1. The contact section displays direct links for email, LinkedIn, GitHub, and resume download, each with hover animation on its icon
  2. A clean minimal footer with copyright line appears at the bottom of the page
  3. Running `vite build` produces a production bundle with no references to deprecated components (NoisyBackground, AnimatedGridPattern) and no admin code
**Plans**: TBD

Plans:
- [ ] 15-01: TBD
- [ ] 15-02: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 12 → 13 → 14 → 15

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation, Navigation, and Hero | v1.0 | 3/3 | Complete | 2026-03-22 |
| 2. Content Sections | v1.0 | 4/4 | Complete | 2026-03-23 |
| 3. Interactive Features | v1.0 | 4/4 | Complete | 2026-03-23 |
| 4. Polish and Deployment | v1.0 | 2/2 | Complete | 2026-03-23 |
| 5. Visual Design Overhaul | v1.0 | 3/3 | Complete | 2026-03-23 |
| 6. Static Assets & Integration Fixes | v1.0 | 2/2 | Complete | 2026-03-24 |
| 7. Requirements Traceability Cleanup | v1.0 | 1/1 | Complete | 2026-03-24 |
| 8. Admin Infrastructure | v1.1 | 4/4 | Complete | 2026-03-25 |
| 9. Admin Shell, Preview, and Asset Pipeline | v1.1 | 3/3 | Complete | 2026-03-25 |
| 10. Content Editors | v1.1 | 7/7 | Complete | 2026-03-26 |
| 11. Keyboard Shortcut Wiring & Production Guard | v1.1 | 1/1 | Complete | 2026-03-26 |
| 12. Theme Foundation & Unified Background | 1/3 | In Progress|  | - |
| 13. Animated Hero Gradient | v1.2 | 0/? | Not started | - |
| 14. Component Rebuilds | v1.2 | 0/? | Not started | - |
| 15. Contact Footer & Cleanup | v1.2 | 0/? | Not started | - |
