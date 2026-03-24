---
phase: 05-visual-design-overhaul
plan: 01
subsystem: ui
tags: [tailwind, oklch, css-animations, motion-react, canvas, svg, particles, aurora, noise, spotlight, grid-pattern]

# Dependency graph
requires:
  - phase: 04-polish-and-deployment
    provides: Production-ready Vite+React+Tailwind v4 project with motion/react and cn() utility
provides:
  - 5 UW Purple color tokens as Tailwind utilities (uw-purple, uw-purple-soft, uw-purple-light, uw-purple-faint, uw-gold)
  - Aurora keyframe animation (animate-aurora utility class)
  - AuroraBackground component (CSS-only aurora gradient wrapper)
  - Particles component (canvas particle system with mouse magnetism)
  - NoisyBackground component (SVG noise texture overlay with gradient)
  - CardSpotlight component (mouse-tracked radial gradient spotlight)
  - AnimatedGridPattern component (SVG grid with motion.rect animations)
  - Test scaffolds verifying color tokens, component exports, and zero framer-motion imports
affects: [05-02, 05-03]

# Tech tracking
tech-stack:
  added: []
  patterns: [effect-wrapper-component, svg-noise-over-canvas, motion-value-mouse-tracking, prefers-reduced-motion-check]

key-files:
  created:
    - src/components/effects/AuroraBackground.tsx
    - src/components/effects/Particles.tsx
    - src/components/effects/NoisyBackground.tsx
    - src/components/effects/CardSpotlight.tsx
    - src/components/effects/AnimatedGridPattern.tsx
    - src/styles/__tests__/colors.test.ts
    - src/components/effects/__tests__/effects.test.ts
    - src/tests/imports.test.ts
  modified:
    - src/styles/app.css
    - vitest.config.ts

key-decisions:
  - "SVG feTurbulence for noise texture instead of canvas -- zero JS, static grain, better performance"
  - "useId() hook for unique SVG filter IDs in NoisyBackground to prevent ID collisions"
  - "Added resolve alias for @/ in vitest.config.ts to enable component imports in test environment"

patterns-established:
  - "Effect wrapper pattern: visual effect renders behind children via absolute positioning + z-10 content layer"
  - "prefers-reduced-motion: each effect checks accessibility preference and degrades gracefully"
  - "motion/react only: all motion imports use motion/react, enforced by imports.test.ts"

requirements-completed: [VISUAL-01]

# Metrics
duration: 8min
completed: 2026-03-23
---

# Phase 05 Plan 01: Color Palette & Effect Components Summary

**UW Purple oklch color tokens (5 shades + gold) and 5 standalone visual effect components (Aurora, Particles, Noise, Spotlight, Grid) with full test coverage**

## Performance

- **Duration:** 8 min
- **Started:** 2026-03-23T21:21:37Z
- **Completed:** 2026-03-23T21:30:43Z
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments
- Extended cleanroom color palette with 5 UW accent tokens in oklch color space plus aurora keyframe animation
- Created 5 standalone visual effect components in src/components/effects/ using motion/react (zero framer-motion)
- All 80 tests pass (16 test files) with zero regressions from existing test suite

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend color palette and define aurora keyframe** - `b6e529e` (feat)
2. **Task 2: Create all five effect components and test scaffolds** - `6085f63` (feat)

## Files Created/Modified
- `src/styles/app.css` - Added 5 UW color tokens and aurora keyframe in @theme block
- `src/components/effects/AuroraBackground.tsx` - CSS-only aurora gradient wrapper with blur and mask
- `src/components/effects/Particles.tsx` - Canvas particle system with mouse magnetism, DPR scaling, edge recycling
- `src/components/effects/NoisyBackground.tsx` - SVG feTurbulence noise overlay with gradient background and unique filter IDs
- `src/components/effects/CardSpotlight.tsx` - Mouse-tracked radial gradient using useMotionValue/useMotionTemplate
- `src/components/effects/AnimatedGridPattern.tsx` - SVG grid pattern with motion.rect fade-in/out animations
- `src/styles/__tests__/colors.test.ts` - Verifies all 5 UW color tokens and aurora keyframe
- `src/components/effects/__tests__/effects.test.ts` - Verifies all 5 components export as functions
- `src/tests/imports.test.ts` - Asserts zero framer-motion imports across entire codebase
- `vitest.config.ts` - Added resolve alias for @/ path to enable component imports in tests

## Decisions Made
- Used SVG feTurbulence for NoisyBackground instead of canvas-based noise (zero JS runtime cost, static grain sufficient per design spec)
- Used React useId() hook for unique SVG filter IDs to prevent collision when multiple NoisyBackground instances coexist
- Added @/ resolve alias to vitest.config.ts (was missing, blocking component imports in test environment)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added resolve alias to vitest.config.ts**
- **Found during:** Task 2 (effect component tests)
- **Issue:** Vitest could not resolve `@/lib/utils` path alias used by all effect components
- **Fix:** Added `resolve.alias` configuration mapping `@` to `src/` directory in vitest.config.ts
- **Files modified:** vitest.config.ts
- **Verification:** All component imports resolve correctly, 80/80 tests pass
- **Committed in:** 6085f63 (Task 2 commit)

**2. [Rule 1 - Bug] Fixed imports test self-matching on framer-motion string**
- **Found during:** Task 2 (imports test)
- **Issue:** Test file itself contained literal `from "framer-motion"` strings as search patterns, causing it to flag itself as a violation
- **Fix:** Changed detection to use regex pattern instead of string literals, plus skip-self logic
- **Files modified:** src/tests/imports.test.ts
- **Verification:** Test passes without false positive self-detection
- **Committed in:** 6085f63 (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 bug)
**Impact on plan:** Both fixes necessary for test infrastructure to work. No scope creep.

## Issues Encountered
None beyond the auto-fixed deviations above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All 5 effect components are ready for integration into section wrappers (Plan 05-02)
- Color tokens are available as Tailwind utilities (bg-uw-purple, text-uw-purple-soft, etc.)
- animate-aurora CSS class is functional for AuroraBackground
- No blockers for Plan 05-02 (Hero + section backgrounds) or Plan 05-03 (Timeline grid + card spotlight)

## Self-Check: PASSED

All 10 created/modified files verified on disk. Both commit hashes (b6e529e, 6085f63) found in git log.

---
*Phase: 05-visual-design-overhaul*
*Completed: 2026-03-23*
