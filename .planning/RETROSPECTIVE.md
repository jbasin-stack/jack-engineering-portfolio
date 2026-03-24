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

## Cross-Milestone Trends

### Process Evolution

| Milestone | Sessions | Phases | Key Change |
|-----------|----------|--------|------------|
| v1.0 | ~8 | 7 | Established gap closure phases as standard post-audit pattern |

### Cumulative Quality

| Milestone | Tests | Coverage | Zero-Dep Additions |
|-----------|-------|----------|-------------------|
| v1.0 | 17+ | Unit + data integrity | 0 (all deps intentional) |

### Top Lessons (Verified Across Milestones)

1. Data-driven architecture pays dividends across every phase
2. Milestone audit before completion catches real shipping gaps
