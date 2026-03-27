---
phase: 13-animated-hero-gradient
plan: 01
subsystem: ui
tags: [css-animations, radial-gradient, oklch, accessibility, prefers-reduced-motion, hero]

# Dependency graph
requires:
  - phase: 12-theme-foundation
    provides: "CSS custom properties pattern (:root/.dark), unified page gradient, reduced-motion block"
provides:
  - "Breathing radial gradient overlay behind hero section content"
  - "Theme-aware hero gradient custom properties (--hero-gradient-center, --hero-gradient-edge)"
  - "Reduced-motion static gradient fallback"
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "CSS @keyframes breathing animation on opacity (GPU-composited)"
    - "Overlay gradient div with pointer-events-none and aria-hidden"

key-files:
  created:
    - src/styles/__tests__/hero-gradient.test.ts
  modified:
    - src/styles/app.css
    - src/components/hero/Hero.tsx

key-decisions:
  - "Pure CSS implementation with zero JS runtime cost"
  - "oklch hue 298 (purple) at gradient center, hue 250 (blue) at edges for UW brand hint"
  - "7s breathing cycle with opacity 0.3-0.5 range and ease-in-out easing"

patterns-established:
  - "Hero gradient overlay: absolutely-positioned div with CSS class, aria-hidden, pointer-events-none"

requirements-completed: [HERO-01, HERO-02, HERO-03]

# Metrics
duration: 3min
completed: 2026-03-27
---

# Phase 13 Plan 01: Animated Hero Gradient Summary

**Breathing radial gradient with UW purple-to-blue oklch palette, 7s CSS opacity animation, dark mode adaptation, and reduced-motion static fallback**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-27T15:56:58Z
- **Completed:** 2026-03-27T15:59:31Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Hero section displays a breathing elliptical radial gradient with opacity cycling 0.3-0.5 over 7 seconds
- Gradient uses UW purple hint (oklch hue 298) at center fading to blue (hue 250) and transparent at edges
- Dark mode auto-adapts via CSS custom properties -- zero JS needed
- prefers-reduced-motion users see a static gradient at opacity 0.4 with no animation
- 15 automated tests validate all CSS rules and Hero.tsx integration

## Task Commits

Each task was committed atomically:

1. **Task 1: Create hero gradient test scaffold** - `d89db73` (test) -- TDD RED: 15 failing tests
2. **Task 2: Implement hero gradient CSS and TSX** - `b640f2b` (feat) -- TDD GREEN: all 15 pass

**Plan metadata:** pending (docs: complete plan)

## Files Created/Modified
- `src/styles/__tests__/hero-gradient.test.ts` - 15 test cases across 4 describe blocks validating custom properties, keyframes, reduced-motion, and Hero.tsx gradient div
- `src/styles/app.css` - Added --hero-gradient-center/--hero-gradient-edge to :root and .dark, @keyframes hero-breathe, .hero-gradient class, reduced-motion fallback
- `src/components/hero/Hero.tsx` - Replaced TODO placeholder with breathing gradient overlay div

## Decisions Made
- Pure CSS implementation with zero JS runtime cost (per user lock)
- oklch hue 298 for purple center, hue 250 for blue edges (matching UW brand palette)
- 7s duration (middle of locked 6-8s range) with ease-in-out easing for organic breathing feel
- Opacity range 0.3-0.5: gradient always visible, just shifting intensity
- Elliptical radial gradient fading to transparent at 70% for seamless blending with page background

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Hero gradient complete and integrated with theme system
- Full test suite passes (198/198 tests), production build succeeds
- Ready for Phase 14 (if applicable)

## Self-Check: PASSED

- FOUND: src/styles/__tests__/hero-gradient.test.ts
- FOUND: src/styles/app.css
- FOUND: src/components/hero/Hero.tsx
- FOUND: .planning/phases/13-animated-hero-gradient/13-01-SUMMARY.md
- FOUND: commit d89db73 (test)
- FOUND: commit b640f2b (feat)

---
*Phase: 13-animated-hero-gradient*
*Completed: 2026-03-27*
