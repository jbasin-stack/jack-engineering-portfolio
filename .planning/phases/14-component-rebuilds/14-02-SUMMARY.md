---
phase: 14-component-rebuilds
plan: 02
subsystem: ui
tags: [svg, motion, scroll-animation, timeline, useTransform, pathLength, keyframes]

# Dependency graph
requires:
  - phase: 12-theme-tokens
    provides: oklch color system with accent, silicon, cleanroom CSS custom properties
provides:
  - SVG scroll-drawn timeline path with gradient stroke
  - Glowing pulse-activated nodes with one-shot animation
  - Performance-optimized scroll tracking (useTransform over setState)
affects: [14-component-rebuilds]

# Tech tracking
tech-stack:
  added: []
  patterns: [motion.path with pathLength for scroll-driven SVG drawing, useTransform for zero-render continuous animations, one-shot useState for discrete activation events, CSS @keyframes pulse-ring for expanding ring animation]

key-files:
  created:
    - src/components/sections/__tests__/timeline.test.tsx
  modified:
    - src/components/sections/Timeline.tsx
    - src/styles/app.css

key-decisions:
  - "pulse-ring keyframes defined in app.css at global scope (consistent with hero-breathe pattern)"
  - "SVG uses preserveAspectRatio=none with vectorEffect=non-scaling-stroke for clean scaling"
  - "Test file uses .tsx extension (not .ts) for JSX support in vitest"
  - "Container padding increased from pl-8 to pl-10 to accommodate wider SVG element"

patterns-established:
  - "One-shot activation pattern: useState + useMotionValueEvent with early return guard"
  - "Continuous scroll values via useTransform (no setState for opacity/position)"
  - "SVG path drawing via motion.path style={{ pathLength }} bound to scrollYProgress"

requirements-completed: [TIME-01, TIME-02, TIME-03, TIME-04]

# Metrics
duration: 2min
completed: 2026-03-27
---

# Phase 14 Plan 02: Timeline SVG Rebuild Summary

**Scroll-drawn SVG path timeline with gradient stroke, glowing one-shot pulse nodes, and useTransform-driven content fade-in replacing 8-setState-per-frame implementation**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-27T17:16:46Z
- **Completed:** 2026-03-27T17:19:28Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Replaced div-based scaleY line with SVG motion.path that draws progressively via pathLength
- Added gradient stroke (accent full opacity at top, 60% at bottom) with faint dashed undrawn track
- Inactive nodes are hollow circles; active nodes fill with accent color and emit 12px ambient glow
- One-shot pulse ring animation (1.5s ease-out, scale 1 to 2.5, opacity fade) fires once per node
- Content fade-in driven entirely by useTransform (zero per-frame setState for continuous values)
- Eliminated performance issue: 0 re-renders during normal scrolling (was 8 setState calls per frame)

## Task Commits

Each task was committed atomically:

1. **Task 0: Create Wave 0 test stub** - `a4fdbdd` (test)
2. **Task 1: Rebuild Timeline with SVG path and glowing nodes** - `818bfce` (feat)

## Files Created/Modified
- `src/components/sections/__tests__/timeline.test.tsx` - Wave 0 test stub validating milestone heading rendering (TIME-02)
- `src/components/sections/Timeline.tsx` - Complete rewrite with SVG path, gradient stroke, glowing nodes, pulse rings, useTransform content fade
- `src/styles/app.css` - Added pulse-ring @keyframes for node activation animation

## Decisions Made
- Defined pulse-ring @keyframes in app.css at global scope (matches hero-breathe pattern) rather than inline style tag
- Used Tailwind arbitrary animation class `animate-[pulse-ring_1.5s_ease-out_forwards]` for the pulse ring
- SVG uses `preserveAspectRatio="none"` with `vectorEffect="non-scaling-stroke"` to stretch vertically while keeping consistent stroke widths
- Increased container left padding from `pl-8` to `pl-10` to accommodate the wider SVG element (w-6 vs old w-0.5)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Test file extension changed from .ts to .tsx**
- **Found during:** Task 0 (Wave 0 test stub)
- **Issue:** Plan specified `.ts` extension but test uses JSX syntax (`<Timeline />`), causing OXC transform error
- **Fix:** Created file as `.tsx` instead of `.ts`
- **Files modified:** src/components/sections/__tests__/timeline.test.tsx
- **Verification:** Test passes with .tsx extension
- **Committed in:** a4fdbdd (Task 0 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Trivial file extension fix. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Timeline section fully rebuilt with premium scroll-driven animation
- SVG path, gradient stroke, and pulse nodes ready for visual verification
- All 201 tests pass, TypeScript clean, production build succeeds
- Plan 03 (Projects carousel) can proceed independently

## Self-Check: PASSED

All files exist, all commits verified.

---
*Phase: 14-component-rebuilds*
*Completed: 2026-03-27*
