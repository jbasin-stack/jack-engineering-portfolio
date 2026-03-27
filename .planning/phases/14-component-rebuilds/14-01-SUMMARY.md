---
phase: 14-component-rebuilds
plan: 01
subsystem: ui
tags: [react, motion, tabs, glassmorphism, animation, layoutId]

# Dependency graph
requires:
  - phase: 12-theme-system
    provides: oklch color tokens, semantic classes (text-ink, text-silicon-600, bg-background)
provides:
  - AnimatedTabs reusable component with Motion layoutId sliding indicator
  - Expertise merged section replacing Skills + Tooling
  - Updated navigation with single Expertise link and scroll-spy
affects: [14-02-PLAN, 14-03-PLAN, admin-panel]

# Tech tracking
tech-stack:
  added: []
  patterns: [Motion layoutId tab indicator, AnimatePresence mode="wait" content transitions, glassmorphic panel styling, domain merge mapping]

key-files:
  created:
    - src/components/ui/AnimatedTabs.tsx
    - src/components/sections/Expertise.tsx
    - src/components/sections/__tests__/expertise.test.tsx
  modified:
    - src/App.tsx
    - src/data/navigation.ts
    - src/components/layout/Navigation.tsx
    - src/data/__tests__/navigation.test.ts

key-decisions:
  - "Domain merge mapping as static array with getTools() accessors for data-driven tab content"
  - "Test file uses .tsx extension (not .ts) for JSX support in vitest with oxc transform"
  - "IntersectionObserver mock in test setup for Motion whileInView compatibility in jsdom"

patterns-established:
  - "AnimatedTabs pattern: layoutId='active-tab-indicator' with spring transition for reusable tab UI"
  - "Glassmorphic panel: backdrop-blur-md bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10"
  - "Tab content transition: blur(8px)/scale(0.96)/opacity(0) with AnimatePresence mode='wait'"

requirements-completed: [SKTL-01, SKTL-02, SKTL-03, SKTL-04]

# Metrics
duration: 4min
completed: 2026-03-27
---

# Phase 14 Plan 01: Expertise Tabs Summary

**Merged Skills+Tooling into glassmorphic tabbed Expertise section with Motion layoutId sliding indicator and blur/scale/opacity content transitions**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-27T17:16:57Z
- **Completed:** 2026-03-27T17:21:17Z
- **Tasks:** 3
- **Files modified:** 7

## Accomplishments
- Built reusable AnimatedTabs component with spring-animated layoutId sliding indicator
- Created Expertise section merging 4 skill domains with their corresponding tools into glassmorphic two-column panels
- Updated App.tsx, navigation data, and scroll-spy to replace separate Skills/Tooling with single Expertise section
- All 201 tests pass, TypeScript clean, production build succeeds

## Task Commits

Each task was committed atomically:

1. **Task 0: Create Wave 0 test stubs** - `55c53c2` (test)
2. **Task 1: Create AnimatedTabs and Expertise section** - `b890feb` (feat)
3. **Task 2: Wire Expertise into App and update navigation** - `c1795b5` (feat)

## Files Created/Modified
- `src/components/ui/AnimatedTabs.tsx` - Reusable tab bar with Motion layoutId sliding indicator
- `src/components/sections/Expertise.tsx` - Merged Skills+Tooling section with 4 domain tabs and glassmorphic panels
- `src/components/sections/__tests__/expertise.test.tsx` - Wave 0 test stubs for SKTL-01 and SKTL-03
- `src/App.tsx` - Replaced Skills+Tooling imports with single Expertise import
- `src/data/navigation.ts` - Single "Expertise" link replaces "Skills" and "Lab & Tooling"
- `src/components/layout/Navigation.tsx` - Updated sectionIds for scroll-spy tracking
- `src/data/__tests__/navigation.test.ts` - Updated to match new navigation structure

## Decisions Made
- Domain merge mapping implemented as a static array with `getTools()` accessor functions, keeping data derivation clear and type-safe
- Test file extension corrected from `.ts` to `.tsx` (plan specified `.ts` but JSX requires `.tsx` for oxc transform)
- Added IntersectionObserver mock in test file for Motion `whileInView` compatibility in jsdom environment

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed test file extension from .ts to .tsx**
- **Found during:** Task 1 (verification step)
- **Issue:** Plan specified `expertise.test.ts` but the test uses JSX (`<Expertise />`), which requires `.tsx` for oxc/vite transform
- **Fix:** Renamed file from `.ts` to `.tsx`
- **Files modified:** `src/components/sections/__tests__/expertise.test.tsx`
- **Verification:** Tests parse and run correctly
- **Committed in:** b890feb (Task 1 commit)

**2. [Rule 3 - Blocking] Added IntersectionObserver mock for jsdom**
- **Found during:** Task 1 (verification step)
- **Issue:** Motion `whileInView` requires IntersectionObserver which is not available in jsdom test environment
- **Fix:** Added `beforeAll` mock for IntersectionObserver in test file
- **Files modified:** `src/components/sections/__tests__/expertise.test.tsx`
- **Verification:** Both SKTL-01 and SKTL-03 tests pass
- **Committed in:** b890feb (Task 1 commit)

**3. [Rule 1 - Bug] Updated navigation test expectations**
- **Found during:** Task 2 (verification step)
- **Issue:** Existing `navigation.test.ts` expected 3 children (Skills, Lab & Tooling, Timeline) but we changed to 2 (Expertise, Timeline)
- **Fix:** Updated test assertions to expect 2 children with Expertise and Timeline labels/hrefs
- **Files modified:** `src/data/__tests__/navigation.test.ts`
- **Verification:** All 201 tests pass
- **Committed in:** c1795b5 (Task 2 commit)

---

**Total deviations:** 3 auto-fixed (2 bugs, 1 blocking)
**Impact on plan:** All fixes necessary for correctness. No scope creep.

## Issues Encountered
None beyond the auto-fixed deviations above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Expertise section complete and wired into the app
- AnimatedTabs component available for reuse in other contexts
- Old Skills.tsx and Tooling.tsx files still exist but are no longer imported (can be cleaned up later)
- Ready for 14-02 (project carousel) and 14-03 (timeline SVG) plans

## Self-Check: PASSED

All created files verified present. All 3 task commits verified in git log.

---
*Phase: 14-component-rebuilds*
*Completed: 2026-03-27*
