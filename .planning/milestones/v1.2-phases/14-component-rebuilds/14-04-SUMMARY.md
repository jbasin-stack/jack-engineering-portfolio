---
phase: 14-component-rebuilds
plan: 04
subsystem: ui
tags: [css-transitions, tabs, animation, vercel-style, expertise]

# Dependency graph
requires:
  - phase: 14-component-rebuilds
    provides: AnimatedTabs component and Expertise section structure (14-01)
provides:
  - Vercel-style CSS tab indicator with hover highlight pill and sliding active bar
  - Direction-aware content panel transitions (slide + blur + opacity)
  - Smooth carousel scroll behavior adjustment
affects: [15-contact-footer]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Pure CSS transitions for tab indicator (replacing Motion layoutId)
    - data-attribute driven hover/active states on tab elements
    - CSS transition 300ms ease-out for tab indicator sliding
    - Direction-tracked content transitions with 40px slide, 0.3s duration, 4px blur

key-files:
  created: []
  modified:
    - src/components/ui/AnimatedTabs.tsx
    - src/components/sections/Expertise.tsx
    - src/components/projects/ProjectCarousel.tsx

key-decisions:
  - "Replaced Motion layoutId tab indicator with Vercel-style pure CSS transitions -- Motion spring physics produced jittery animation"
  - "Content panel uses 40px slide, 0.3s duration, 4px blur, inOut easing -- tuned through 3 iterations based on user feedback"
  - "Tab indicator uses 300ms ease-out CSS transition with hover highlight pill -- simpler and smoother than Motion animate"

patterns-established:
  - "CSS transitions preferred over Motion for simple position/size animations (smoother, less overhead)"
  - "Direction tracking via useRef for tab navigation direction state"

requirements-completed: [SKTL-04]

# Metrics
duration: 42min
completed: 2026-03-27
---

# Phase 14 Plan 04: Tab Slide Animation Summary

**Vercel-style pure CSS tab indicator with hover highlight pill, sliding active bar, and direction-aware content panel transitions (40px slide, 4px blur, 300ms ease-out)**

## Performance

- **Duration:** 42 min (including 3 iteration rounds based on user feedback)
- **Started:** 2026-03-27T20:55:23Z
- **Completed:** 2026-03-27T21:37:44Z
- **Tasks:** 2 (Task 1 with 3 fix iterations + Task 2 checkpoint)
- **Files modified:** 3

## Accomplishments

- Directional sliding animation on Expertise tab content panels -- content slides left/right based on tab navigation direction
- Vercel-style tab indicator with hover highlight pill and smooth sliding active bar using pure CSS transitions
- Tuned content transitions through 3 iterations to achieve smooth, premium feel (40px slide, 0.3s duration, 4px blur)
- Carousel scroll behavior adjusted for consistency with tab animation polish

## Task Commits

Each task was committed atomically:

1. **Task 1: Add directional slide animation** - `43a3a3f` (feat)
2. **Task 1.5: Fix animation smoothness** - `0f3b2d8` (fix) -- softened tab indicator spring, smoothed content transitions
3. **Task 1.6: Rewrite tab indicator to persistent sliding element** - `8905f82` (fix) -- replaced Motion layoutId with persistent element approach
4. **Task 1.7: Rewrite to Vercel-style CSS transitions** - `b3340bf` (feat) -- final implementation with pure CSS transitions, user approved
5. **Task 2: Verify directional slide animation** - User approved (checkpoint, no commit)

## Files Created/Modified

- `src/components/ui/AnimatedTabs.tsx` - Rewrote tab indicator from Motion layoutId to Vercel-style CSS transitions with hover highlight pill and sliding active bar
- `src/components/sections/Expertise.tsx` - Added direction tracking and slide animation to tab content panels
- `src/components/projects/ProjectCarousel.tsx` - Adjusted scroll behavior for consistency

## Decisions Made

- **Motion layoutId replaced with CSS transitions:** The original plan specified Motion layoutId for the tab indicator. The initial implementation was invisible/jittery. After 3 iteration rounds, the final solution uses pure CSS transitions (transform + width on a persistent indicator div) which produces visibly smoother animation at lower complexity.
- **Content panel transition parameters tuned through user feedback:** Started at 60px slide with scale+blur. User reported it was too aggressive. Final parameters: 40px x-slide, 0.3s duration, 4px blur (down from 8px), cubic-bezier inOut easing, no scale transform.
- **Hover highlight pill added:** The Vercel-style approach includes a semi-transparent hover pill behind tabs, providing visual feedback before click. Uses data-hover attribute and CSS transition.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Motion layoutId produced invisible/jittery animation**
- **Found during:** Task 1 (initial implementation)
- **Issue:** Motion layoutId for tab indicator either produced no visible animation or had jittery spring physics
- **Fix:** Iterated through 3 approaches: (1) softer spring, (2) persistent sliding element with Motion animate, (3) pure CSS transitions
- **Files modified:** src/components/ui/AnimatedTabs.tsx
- **Verification:** User visual approval after each iteration
- **Committed in:** 0f3b2d8, 8905f82, b3340bf

**2. [Rule 1 - Bug] Content transition too aggressive per user feedback**
- **Found during:** Task 1 (user feedback round)
- **Issue:** Initial 60px slide + 8px blur + scale transform felt overdone
- **Fix:** Reduced to 40px slide, 4px blur, removed scale, changed easing to inOut
- **Files modified:** src/components/sections/Expertise.tsx
- **Verification:** User approved final parameters
- **Committed in:** 0f3b2d8, b3340bf

---

**Total deviations:** 2 auto-fixed (2 bugs -- animation quality issues)
**Impact on plan:** Both fixes were necessary iterations to achieve user-approved animation quality. The core approach changed from Motion layoutId to CSS transitions, which is simpler and produces better results. No scope creep.

## Issues Encountered

- Motion layoutId did not produce the expected smooth sliding tab indicator animation. Required 3 implementation attempts before landing on pure CSS transitions. This is a known limitation where CSS transitions can outperform Motion for simple position/size animations.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All Phase 14 gap closure plans (14-04, 14-05) are complete
- Phase 14 is fully done -- all 5 plans complete
- Phase 15 (Contact Footer & Cleanup) is ready to begin

## Self-Check: PASSED

- [x] src/components/ui/AnimatedTabs.tsx - FOUND
- [x] src/components/sections/Expertise.tsx - FOUND
- [x] src/components/projects/ProjectCarousel.tsx - FOUND
- [x] 14-04-SUMMARY.md - FOUND
- [x] Commit 43a3a3f - FOUND
- [x] Commit 0f3b2d8 - FOUND
- [x] Commit 8905f82 - FOUND
- [x] Commit b3340bf - FOUND

---
*Phase: 14-component-rebuilds*
*Completed: 2026-03-27*
