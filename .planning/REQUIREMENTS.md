# Requirements: Jack Basinski — Engineering Portfolio

**Defined:** 2026-03-26
**Core Value:** Every visitor immediately understands Jack's range and depth as an electrical engineer, and can access the evidence without friction.

## v1.2 Requirements

Requirements for UI Polish & Interactivity milestone. Each maps to roadmap phases.

### Theme & Background

- [x] **THEME-01**: Site automatically applies dark or light theme based on user's system preference (prefers-color-scheme)
- [x] **THEME-02**: Blue-primary oklch color variable system with light and dark mode definitions
- [ ] **THEME-03**: Unified continuous background across all sections with no hard color breaks between them
- [x] **THEME-04**: Theme switch triggers smooth 300ms CSS transitions on background, text, and border colors
- [x] **THEME-05**: Dark mode FOUT prevented via blocking script that applies theme class before React mounts
- [ ] **THEME-06**: PDF viewer (Dialog/Drawer) styled correctly in both light and dark modes

### Hero

- [ ] **HERO-01**: Animated radial gradient background with breathing opacity animation behind hero content
- [ ] **HERO-02**: Gradient uses blue-primary palette colors and blends smoothly into the unified page background
- [ ] **HERO-03**: Gradient animation respects prefers-reduced-motion (static gradient fallback)

### Skills & Tooling

- [ ] **SKTL-01**: Skills and Tooling sections merged into a single tabbed section with one tab per domain
- [ ] **SKTL-02**: Animated sliding tab indicator using Motion layoutId
- [ ] **SKTL-03**: Tab content panels use glassmorphic styling (backdrop-blur, semi-transparent background, subtle border)
- [ ] **SKTL-04**: Tab content animates in with blur/scale/opacity transition on tab switch

### Projects

- [ ] **PROJ-01**: Projects displayed in a horizontal carousel with drag/swipe and arrow button navigation
- [ ] **PROJ-02**: Featured project appears in first carousel position with visual emphasis
- [ ] **PROJ-03**: Carousel cards show project image, title, and summary with hover scale effect
- [ ] **PROJ-04**: Clicking a carousel card opens the existing project detail Dialog/Drawer with PDF viewer
- [ ] **PROJ-05**: Carousel coexists with Lenis smooth scroll (data-lenis-prevent on viewport)

### Timeline

- [ ] **TIME-01**: Vertical SVG path that draws progressively as user scrolls, driven by scroll position
- [ ] **TIME-02**: Glowing circular node markers at each timeline entry that activate on scroll
- [ ] **TIME-03**: Active nodes display pulsing ring animation (expanding circle with fading opacity)
- [ ] **TIME-04**: Timeline entry content fades in as its corresponding node activates

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

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| THEME-01 | Phase 12 | Complete |
| THEME-02 | Phase 12 | Complete |
| THEME-03 | Phase 12 | Pending |
| THEME-04 | Phase 12 | Complete |
| THEME-05 | Phase 12 | Complete |
| THEME-06 | Phase 12 | Pending |
| HERO-01 | Phase 13 | Pending |
| HERO-02 | Phase 13 | Pending |
| HERO-03 | Phase 13 | Pending |
| SKTL-01 | Phase 14 | Pending |
| SKTL-02 | Phase 14 | Pending |
| SKTL-03 | Phase 14 | Pending |
| SKTL-04 | Phase 14 | Pending |
| PROJ-01 | Phase 14 | Pending |
| PROJ-02 | Phase 14 | Pending |
| PROJ-03 | Phase 14 | Pending |
| PROJ-04 | Phase 14 | Pending |
| PROJ-05 | Phase 14 | Pending |
| TIME-01 | Phase 14 | Pending |
| TIME-02 | Phase 14 | Pending |
| TIME-03 | Phase 14 | Pending |
| TIME-04 | Phase 14 | Pending |
| CTFT-01 | Phase 15 | Pending |
| CTFT-02 | Phase 15 | Pending |
| CTFT-03 | Phase 15 | Pending |

**Coverage:**
- v1.2 requirements: 25 total
- Mapped to phases: 25
- Unmapped: 0

---
*Requirements defined: 2026-03-26*
*Last updated: 2026-03-26 after roadmap creation*
