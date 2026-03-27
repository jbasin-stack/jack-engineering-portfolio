# Requirements: Jack Basinski — Engineering Portfolio

**Defined:** 2026-03-26
**Core Value:** Every visitor immediately understands Jack's range and depth as an electrical engineer, and can access the evidence without friction.

## v1.2 Requirements

Requirements for UI Polish & Interactivity milestone. Each maps to roadmap phases.

### Theme & Background

- [x] **THEME-01**: Site automatically applies dark or light theme based on user's system preference (prefers-color-scheme)
- [x] **THEME-02**: Blue-primary oklch color variable system with light and dark mode definitions
- [x] **THEME-03**: Unified continuous background across all sections with no hard color breaks between them
- [x] **THEME-04**: Theme switch triggers smooth 300ms CSS transitions on background, text, and border colors
- [x] **THEME-05**: Dark mode FOUT prevented via blocking script that applies theme class before React mounts
- [x] **THEME-06**: PDF viewer (Dialog/Drawer) styled correctly in both light and dark modes

### Hero

- [x] **HERO-01**: Animated radial gradient background with breathing opacity animation behind hero content
- [x] **HERO-02**: Gradient uses blue-primary palette colors and blends smoothly into the unified page background
- [x] **HERO-03**: Gradient animation respects prefers-reduced-motion (static gradient fallback)

### Skills & Tooling

- [x] **SKTL-01**: Skills and Tooling sections merged into a single tabbed section with one tab per domain
- [x] **SKTL-02**: Animated sliding tab indicator using Motion layoutId
- [x] **SKTL-03**: Tab content panels use glassmorphic styling (backdrop-blur, semi-transparent background, subtle border)
- [x] **SKTL-04**: Tab content animates in with blur/scale/opacity transition on tab switch

### Projects

- [x] **PROJ-01**: Projects displayed in a horizontal carousel with drag/swipe and arrow button navigation
- [x] **PROJ-02**: Featured project appears in first carousel position with visual emphasis
- [x] **PROJ-03**: Carousel cards show project image, title, and summary with hover scale effect
- [x] **PROJ-04**: Clicking a carousel card opens the existing project detail Dialog/Drawer with PDF viewer
- [x] **PROJ-05**: Carousel coexists with Lenis smooth scroll (data-lenis-prevent on viewport)

### Timeline (Phase 14 — superseded by Phase 14.1)

- [x] ~~**TIME-01**: Vertical SVG path that draws progressively as user scrolls, driven by scroll position~~ (superseded by TL-CONNECTOR)
- [x] ~~**TIME-02**: Glowing circular node markers at each timeline entry that activate on scroll~~ (superseded by TL-CONNECTOR)
- [x] ~~**TIME-03**: Active nodes display pulsing ring animation (expanding circle with fading opacity)~~ (removed — TL-CLEANUP)
- [x] ~~**TIME-04**: Timeline entry content fades in as its corresponding node activates~~ (superseded by TL-ANIMATE)

### Timeline Overhaul (Phase 14.1 — replaces TIME-01 through TIME-04)

- [ ] **TL-DATA**: TimelineMilestone data model includes optional image field; Zod schema updated to match
- [ ] **TL-CLEANUP**: pulse-ring CSS keyframe removed from app.css (no longer used after editorial rebuild)
- [ ] **TL-TEST**: Timeline test scaffold rewritten for editorial component structure (8 entries, year extraction, connector, dots)
- [ ] **TL-LAYOUT**: Entries use 3 cycling layout variants (large/half/overlay) with graceful text-only fallback
- [ ] **TL-YEAR**: Large accent-colored year text extracted from date field as primary visual anchor per entry
- [ ] **TL-CONNECTOR**: Thin accent-blue vertical line (1-2px) on left edge with small filled dot markers (4-6px) at each entry
- [ ] **TL-ANIMATE**: Entries fade + slide up on viewport entry via whileInView; dots scale in with entry content; reduced motion respected

### Contact & Footer

- [ ] **CTFT-01**: Clean contact section with direct links for email, LinkedIn, GitHub, and resume download
- [ ] **CTFT-02**: Social link icons with hover animation
- [ ] **CTFT-03**: Clean minimal footer with copyright line

## Future Requirements

Deferred to v2+. Tracked but not in current roadmap.

### Personalization

- **PRSN-01**: Manual dark/light mode toggle to override system preference
- **PRSN-02**: User-selectable accent color

### Content

- **CONT-01**: Testimonials/quotes section
- **CONT-02**: Technical blog/notes system
- **CONT-03**: Project filtering in carousel

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Dark mode toggle button | System-preference-only is simpler and more opinionated for v1.2 |
| Aurora/mesh gradient background | Previously built and rejected by user as too distracting |
| Particle effects / 3D backgrounds | Contradicts minimalist philosophy |
| GSAP ScrollTrigger | Already using Motion for all animations; adding GSAP doubles animation bundle |
| Carousel autoplay | Accessibility issue (WCAG requires pause control), conflicts with intentional viewing |
| Per-section background effects | Exactly what v1.2 is removing — unified background is the goal |
| Infinite loop carousel | Only 4 projects; loop causes immediate content repetition |
| SVG morphing on timeline nodes | Over-engineered; simple glow transitions are more elegant |
| Contact form | Direct links are sufficient; no backend needed |
| Timeline entry category tags | Not needed for 8 milestones (deferred from Phase 14.1) |
| Admin image upload for timeline | Future enhancement after images are available (deferred from Phase 14.1) |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| THEME-01 | Phase 12 | Complete |
| THEME-02 | Phase 12 | Complete |
| THEME-03 | Phase 12 | Complete |
| THEME-04 | Phase 12 | Complete |
| THEME-05 | Phase 12 | Complete |
| THEME-06 | Phase 12 | Complete |
| HERO-01 | Phase 13 | Complete |
| HERO-02 | Phase 13 | Complete |
| HERO-03 | Phase 13 | Complete |
| SKTL-01 | Phase 14 | Complete |
| SKTL-02 | Phase 14 | Complete |
| SKTL-03 | Phase 14 | Complete |
| SKTL-04 | Phase 14 | Complete |
| PROJ-01 | Phase 14 | Complete |
| PROJ-02 | Phase 14 | Complete |
| PROJ-03 | Phase 14 | Complete |
| PROJ-04 | Phase 14 | Complete |
| PROJ-05 | Phase 14 | Complete |
| TIME-01 | Phase 14 | Superseded by TL-CONNECTOR |
| TIME-02 | Phase 14 | Superseded by TL-CONNECTOR |
| TIME-03 | Phase 14 | Superseded by TL-CLEANUP |
| TIME-04 | Phase 14 | Superseded by TL-ANIMATE |
| TL-DATA | Phase 14.1 | Pending |
| TL-CLEANUP | Phase 14.1 | Pending |
| TL-TEST | Phase 14.1 | Pending |
| TL-LAYOUT | Phase 14.1 | Pending |
| TL-YEAR | Phase 14.1 | Pending |
| TL-CONNECTOR | Phase 14.1 | Pending |
| TL-ANIMATE | Phase 14.1 | Pending |
| CTFT-01 | Phase 15 | Pending |
| CTFT-02 | Phase 15 | Pending |
| CTFT-03 | Phase 15 | Pending |

**Coverage:**
- v1.2 requirements: 32 total (25 original + 7 timeline overhaul)
- Mapped to phases: 32
- Unmapped: 0

---
*Requirements defined: 2026-03-26*
*Last updated: 2026-03-27 after Phase 14.1 planning*
