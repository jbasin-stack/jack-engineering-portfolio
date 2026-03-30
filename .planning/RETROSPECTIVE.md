# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.0 — MVP

**Shipped:** 2026-03-24
**Phases:** 7 | **Plans:** 19 | **Sessions:** ~8

### What Was Built
- Full single-page portfolio with Lenis smooth scroll, glassmorphic nav, and typography-first hero
- Five data-driven content sections with responsive grids and semantic HTML
- Interactive bento grid with Motion layout expansion and in-browser PDF viewer
- UW Purple visual design system with noise textures, card spotlight, and animated grid
- Deployed to Vercel with auto-deploy pipeline

### What Worked
- Coarse phase granularity (4 core phases + 1 visual + 2 gap closure) kept planning overhead low
- Data-driven architecture paid off — all content is swappable without touching components
- 21st.dev MCP for sourcing premium components (aceternity, magicui) saved significant implementation time
- Milestone audit caught 10 real gaps that would have shipped as broken features
- Phase execution averaging 4.3 min/plan — rapid iteration cycle

### What Was Inefficient
- Static assets (PDFs, SVGs, portrait) were placeholder-only — needed a dedicated gap closure phase (Phase 6)
- Requirements traceability drifted during rapid execution — needed Phase 7 to realign
- VISUAL-02 (hero aurora) was built, integrated, then removed by user — wasted effort that could have been caught earlier with a visual checkpoint
- paperPdf field was defined in types, populated in data, but routing was never implemented — dead code that persisted across 3 phases

### Patterns Established
- `[-]` checkbox with strikethrough for descoped requirements (vs `[x]` for complete, `[ ]` for pending)
- Phase attribution in traceability reflects where work happened, not where cleanup occurred
- Gap closure phases as a standard pattern after milestone audit
- Lenis scroll lock pattern reused across MobileMenu, Dialog, and Drawer components
- hidden/visible naming convention for Motion stagger variants

### Key Lessons
1. **Run milestone audit before Phase N-1, not after** — gaps in static assets and traceability would have been caught earlier if audit ran after Phase 4 instead of after Phase 5
2. **Visual design decisions need user checkpoint before full implementation** — hero aurora was fully built then removed. Show mock/screenshot first
3. **Dead code paths should be caught during plan execution, not by audit** — paperPdf routing was flagged in comments but never resolved until gap closure
4. **Data-driven architecture is worth the upfront cost** — typed data files made every section trivially composable and independently testable

### Cost Observations
- Model mix: ~60% sonnet (plan execution), ~30% opus (research, planning, audit), ~10% haiku (validation)
- Sessions: ~8 across 5 days
- Notable: Average plan execution time of 4.3 min suggests coarse-grained plans at the right level of abstraction

---

## Milestone: v1.1 — Content Admin Panel

**Shipped:** 2026-03-26
**Phases:** 4 (8-11) | **Plans:** 15 | **Sessions:** ~6

### What Was Built
- Custom Vite plugin with REST API for reading/writing all 9 content types with atomic file writes
- Split-pane admin shell with live preview, resizable panels, and keyboard shortcuts
- Drag-drop asset upload pipeline with validation, kebab-case normalization, and data reference updates
- Form-based editors for all 9 content types with Zod validation, inline errors, and toast feedback
- Item reordering, continuous-scroll PDF viewer, and featured project display
- Production guard: zero admin code in dist/ via DEV-gated lazy imports

### What Worked
- Custom Vite plugin approach over external CMS — zero overhead, perfect fit for 9 small data files
- UAT-driven gap closure: 3 UAT rounds caught real usability issues (middleware ordering, validation display, reorder UX)
- Phase 11 as audit-driven gap closure — resolved 3 cross-phase integration issues (INT-01/02/03) cleanly
- Consistent editor patterns (singleton vs list-type) made phases 10-02 and 10-03 very fast to implement
- Average plan execution time stayed fast at ~3.5 min/plan despite increasing codebase complexity

### What Was Inefficient
- Keyboard shortcuts were wired with noop callbacks in Phase 9 and not caught until the milestone audit — should have been wired with real state from the start
- Phase 10 needed 4 gap closure plans (10-04 through 10-07) on top of 3 core plans — the initial plan underestimated form integration complexity
- Middleware registration order bug (10-04) could have been prevented by reading Vite middleware docs more carefully during Phase 8 research

### Patterns Established
- saveRef pattern for exposing save() from child editors to AdminShell without prop-drilling
- dragCounter ref for preventing border flicker during drag-drop boundary crossings
- existingIds ref to prevent auto-ID from changing existing item IDs on load
- Pre-middleware registration (direct server.middlewares.use) to avoid SPA fallback interception
- guardedSave with savingRef.current flag for concurrent-save protection on rapid Ctrl+S

### Key Lessons
1. **Wire real callbacks from the start, not noops** — INT-01/02/03 were all caused by placeholder callbacks that required a dedicated gap closure phase to fix
2. **UAT rounds are high-ROI** — 3 UAT sessions caught 5 real issues that would have shipped as broken UX
3. **Consistent patterns accelerate velocity** — list-type editors (10-02) averaged 2 min/plan because the pattern was established in 10-01
4. **Audit before completion catches integration gaps that unit tests miss** — the milestone audit found 3 cross-phase wiring issues invisible to per-phase tests

### Cost Observations
- Model mix: ~50% sonnet (plan execution), ~40% opus (research, planning, audit, UAT), ~10% haiku (validation)
- Sessions: ~6 across 2 days
- Notable: 15 plans in 2 days (vs 19 plans in 5 days for v1.0) — velocity improved with established patterns

---

## Milestone: v1.2 — UI Polish & Interactivity

**Shipped:** 2026-03-30
**Phases:** 5 (12-15 + 14.1) | **Plans:** 13 | **Sessions:** ~8

### What Was Built
- Blue-primary oklch color system with automatic dark/light mode and FOUT-free blocking script
- Breathing radial gradient hero animation (CSS @keyframes, zero JS cost) with reduced-motion fallback
- Glassmorphic tabbed Expertise section merging Skills & Tooling with direction-aware slide animations
- Embla horizontal project carousel with center-aligned featured-first layout and Lenis coexistence
- Editorial-style timeline with large year anchors, accent connector line, dot markers, and whileInView animations
- Clean contact section with 4 hover-animated links and minimal footer; 4 deprecated effects removed

### What Worked
- Phase 12 as color foundation before any component work — all subsequent phases inherited tokens cleanly with zero color rework
- Decimal phase insertion (14.1) for timeline overhaul: replaced SVG scroll-drawn approach with editorial layout without disrupting existing phase numbering
- Gap closure plans (14-04, 14-05) within Phase 14: caught and fixed 4 gaps before milestone audit
- CSS-first approach for theme and animations: blocking script, @keyframes, CSS custom properties — no React state, no runtime cost
- 3-source requirements cross-reference in audit caught zero orphaned requirements — traceability was maintained throughout
- Integration checker verified all 5 E2E flows without issues

### What Was Inefficient
- Phase 14 initial verification found 4 gaps requiring 2 additional gap-closure plans — the original 3 plans underestimated animation polish requirements
- Timeline was built twice: once as SVG scroll-drawn (14-02), then replaced entirely with editorial layout (14.1) — research phase could have explored editorial approach first
- Phase 14-04 (tab animation tuning) took 42 minutes — 10x the average plan duration — due to 3 rounds of user feedback on animation parameters (40px vs 60px, blur vs no blur)
- 4 orphaned files from Phase 14 component replacements were not cleaned up until flagged by milestone audit

### Patterns Established
- Zero-JS dark mode pattern: blocking script in `<head>` + matchMedia listener + CSS custom properties in .dark block
- GPU-composited CSS animation pattern: @keyframes on opacity only (no layout/paint properties)
- Vercel-style tab indicator: CSS transitions on offsetLeft/offsetWidth instead of Motion layoutId springs
- overscrollBehaviorX: contain for scroll coexistence (carousel + Lenis) instead of data-lenis-prevent
- Editorial timeline pattern: CSS div connector line + whileInView stagger instead of scroll-driven SVG path
- 4-layer reduced-motion strategy: CSS @media query + MotionConfig + Embla duration:0 + Lenis disabled

### Key Lessons
1. **Foundation phases pay for themselves** — Phase 12's color system was consumed cleanly by 4 subsequent phases with zero rework, validating the "theme first" sequencing decision
2. **Don't build scroll-driven SVG when editorial CSS achieves the goal** — The SVG timeline (14-02) was technically correct but replaced in 14.1 because the visual result wasn't premium enough. Research should explore the simplest approach that achieves the visual target
3. **Animation tuning needs a user checkpoint, not iteration loops** — 42-minute plan 14-04 was caused by converging on animation parameters through code. A visual mockup or reference video would have been faster
4. **Dead code cleanup should happen in the same phase as component replacement** — Orphaned Skills.tsx/Tooling.tsx should have been deleted in Phase 14-01 when Expertise.tsx replaced them

### Cost Observations
- Model mix: ~55% sonnet (plan execution), ~35% opus (research, planning, audit), ~10% haiku (validation)
- Sessions: ~8 across 5 days
- Notable: Phase 14 was the most complex (5 plans + 2 gap closure) but individual plan execution stayed fast at ~4 min avg

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Sessions | Phases | Plans | Avg/Plan | Key Change |
|-----------|----------|--------|-------|----------|------------|
| v1.0 | ~8 | 7 | 19 | 4.3 min | Established gap closure phases as standard post-audit pattern |
| v1.1 | ~6 | 4 | 15 | 3.5 min | UAT-driven gap closure + consistent editor patterns |
| v1.2 | ~8 | 5 | 13 | ~5 min | Foundation-first sequencing + decimal phase insertion for rework |

### Cumulative Quality

| Milestone | Tests | Coverage | Deps Added |
|-----------|-------|----------|------------|
| v1.0 | 17+ | Unit + data integrity | 0 (all intentional) |
| v1.1 | 153 | Unit + integration + import guards | Zod v4, react-resizable-panels, sonner, busboy |
| v1.2 | 204 | Unit + integration + visual scaffold | embla-carousel-react |

### Top Lessons (Verified Across Milestones)

1. Data-driven architecture pays dividends across every phase
2. Milestone audit before completion catches real shipping gaps
3. Wire real implementations from the start — noop placeholders create integration debt
4. Consistent patterns compound velocity across phases
5. Foundation phases (color system, theming) pay for themselves across all subsequent phases — v1.2
6. Build the simplest approach that achieves the visual target — avoid over-engineering (SVG scroll path → CSS editorial) — v1.2
