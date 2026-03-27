---
phase: 14-component-rebuilds
plan: 03
subsystem: ui
tags: [embla-carousel, react, motion, carousel, drag-swipe]

# Dependency graph
requires:
  - phase: 14-01
    provides: Expertise section rebuild (App.tsx already updated)
provides:
  - Horizontal Embla project carousel with drag/swipe/arrow navigation
  - CarouselCard component with hover scale effect
  - Featured project sorting and wider slide sizing
  - Lenis coexistence via data-lenis-prevent
affects: []

# Tech tracking
tech-stack:
  added: [embla-carousel-react]
  patterns: [useEmblaCarousel hook with arrow/dot state management, data-lenis-prevent for scroll coexistence]

key-files:
  created:
    - src/components/projects/ProjectCarousel.tsx
    - src/components/projects/CarouselCard.tsx
    - src/components/projects/__tests__/carousel.test.tsx
  modified:
    - src/App.tsx
    - package.json

key-decisions:
  - "embla-carousel-react useEmblaCarousel hook for carousel state (align, containScroll, dragFree)"
  - "Featured projects sorted first with 60% desktop width vs 40% for standard cards"
  - "data-lenis-prevent on Embla viewport + touchAction pan-y for Lenis coexistence"
  - "Reduced motion: Embla duration set to 0 for instant transitions"

patterns-established:
  - "Embla carousel pattern: useEmblaCarousel + arrow state via on('select') + dot indicators"
  - "matchMedia mock pattern for jsdom tests using useIsMobile hook"

requirements-completed: [PROJ-01, PROJ-02, PROJ-03, PROJ-04, PROJ-05]

# Metrics
duration: 9min
completed: 2026-03-27
---

# Phase 14 Plan 03: Project Carousel Summary

**Horizontal Embla carousel replacing bento grid with drag/swipe, arrow buttons, dot indicators, and featured-first sorting**

## Performance

- **Duration:** 9 min
- **Started:** 2026-03-27T17:24:02Z
- **Completed:** 2026-03-27T17:33:38Z
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments
- Replaced static bento grid ProjectsSection with interactive horizontal Embla carousel
- Featured projects (LNA, Precision ADC) sort first with 60% width slides on desktop
- Arrow buttons flank carousel on desktop (hidden at scroll limits), dot indicators on mobile
- Carousel coexists with Lenis smooth scroll via data-lenis-prevent attribute
- All 5 PROJ requirement stubs (PROJ-01 through PROJ-05) pass

## Task Commits

Each task was committed atomically:

1. **Task 0: Create Wave 0 test stubs** - `b6b1d76` (test)
2. **Task 1: Install embla-carousel-react and create CarouselCard** - `611d464` (feat)
3. **Task 2: Create ProjectCarousel and wire into App.tsx** - `f27e376` (feat)

## Files Created/Modified
- `src/components/projects/ProjectCarousel.tsx` - Embla carousel wrapper with arrows, dots, detail wiring
- `src/components/projects/CarouselCard.tsx` - Simplified project card with hover scale effect
- `src/components/projects/__tests__/carousel.test.tsx` - Wave 0 test stubs for PROJ-01 through PROJ-05
- `src/App.tsx` - Replaced ProjectsSection import/render with ProjectCarousel
- `package.json` - Added embla-carousel-react dependency

## Decisions Made
- Used `.tsx` extension for test file (project convention: JSX test files require .tsx for oxc transform)
- Featured sorting via `[...projects].sort((a, b) => Number(b.featured) - Number(a.featured))` as module-level constant
- Arrow buttons use `disabled:opacity-0` for smooth fade-out at scroll boundaries
- Dot indicators use `scrollSnapList()` for accurate snap-aligned dots

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added matchMedia and lenis/react mocks to test file**
- **Found during:** Task 2 (ProjectCarousel creation)
- **Issue:** Tests failed because ProjectDetail uses useLenis and useIsMobile hooks which require matchMedia and lenis context not available in jsdom
- **Fix:** Added `vi.mock('lenis/react')` and `window.matchMedia` mock in beforeAll
- **Files modified:** src/components/projects/__tests__/carousel.test.tsx
- **Verification:** All 5 tests pass, all 206 project tests pass
- **Committed in:** f27e376 (Task 2 commit)

**2. [Rule 1 - Bug] Used .tsx extension instead of .ts for test file**
- **Found during:** Task 0 (test stub creation)
- **Issue:** Plan specified `.ts` but project convention (decision from 14-01) requires `.tsx` for test files with JSX
- **Fix:** Created file as `carousel.test.tsx` from the start
- **Files modified:** src/components/projects/__tests__/carousel.test.tsx
- **Verification:** vitest processes file correctly with JSX transforms
- **Committed in:** b6b1d76 (Task 0 commit)

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 bug)
**Impact on plan:** Both auto-fixes necessary for test compatibility. No scope creep.

## Issues Encountered
None beyond the auto-fixed deviations above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Phase 14 (Component Rebuilds) is now complete: all 3 plans executed
- Expertise tabs (14-01), Timeline SVG (14-02), and Project Carousel (14-03) all rebuilt
- Ready to proceed to Phase 15 or any remaining milestone work

## Self-Check: PASSED

All created files verified present. All 3 task commits verified in git log.

---
*Phase: 14-component-rebuilds*
*Completed: 2026-03-27*
