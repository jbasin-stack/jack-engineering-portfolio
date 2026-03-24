---
phase: 06-static-assets-and-integration-fixes
plan: 02
subsystem: ui
tags: [navigation, motion, dead-code, cleanup, vitest]

# Dependency graph
requires:
  - phase: 01-foundation-and-navigation
    provides: navigation data, motion config, base types
  - phase: 03-interactive-features
    provides: ProjectsSection with bento grid
provides:
  - Timeline reachable via Background dropdown navigation
  - Clean Project interface without paperPdf dead code
  - Minimal motion.ts with only 4 used exports
  - Updated test suite reflecting cleaned data and nav
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Dead code removal verified via grep + TypeScript + build pipeline"

key-files:
  created: []
  modified:
    - src/data/navigation.ts
    - src/types/data.ts
    - src/data/projects.ts
    - src/components/projects/ProjectsSection.tsx
    - src/styles/motion.ts
    - src/styles/__tests__/motion.test.ts
    - src/data/__tests__/navigation.test.ts

key-decisions:
  - "Removed paperPdf rather than implementing PDF routing in ProjectsSection -- LNA paper already accessible from Papers section"
  - "Removed bulk tween-confirmation test since individual fadeUpVariant and layoutTransition tests already cover tween assertions"

patterns-established:
  - "Motion exports kept minimal: only export what is imported by components"

requirements-completed: [NAV-02, PROJ-02, DOCS-01, DOCS-02, DOCS-04, CONT-03]

# Metrics
duration: 2min
completed: 2026-03-24
---

# Phase 06 Plan 02: Navigation, Dead Code, and Motion Cleanup Summary

**Timeline added to Background dropdown, paperPdf dead code removed from Project type/data/component, and 4 orphaned motion.ts exports deleted with full test updates**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-24T15:26:55Z
- **Completed:** 2026-03-24T15:29:15Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments
- Timeline is now the third child in the Background dropdown, making it reachable via nav click
- paperPdf field fully removed from Project interface, project data, and dead comment in ProjectsSection
- motion.ts reduced from 8 exports to 4 (easing, sectionVariants, fadeUpVariant, layoutTransition)
- All 16 test files (75 tests) pass with updated assertions

## Task Commits

Each task was committed atomically:

1. **Task 1: Add Timeline to navigation and remove paperPdf dead code** - `82dd6f4` (feat)
2. **Task 2: Clean orphaned motion.ts exports and update all affected tests** - `355102e` (refactor)

## Files Created/Modified
- `src/data/navigation.ts` - Added Timeline as third Background dropdown child
- `src/types/data.ts` - Removed paperPdf optional field from Project interface
- `src/data/projects.ts` - Removed paperPdf value from LNA project object
- `src/components/projects/ProjectsSection.tsx` - Removed dead PDF-routing comment from onReadMore
- `src/styles/motion.ts` - Removed fadeUp, fadeIn, staggerContainer, staggerChild exports
- `src/styles/__tests__/motion.test.ts` - Removed tests for deleted exports, updated allConfigs array
- `src/data/__tests__/navigation.test.ts` - Updated to assert 3 Background children including Timeline

## Decisions Made
- Removed paperPdf rather than implementing PDF routing in ProjectsSection -- the LNA paper is already accessible from the Papers section, so adding a second access path would create unnecessary complexity
- Removed the bulk "all transition objects include a duration property" test since the remaining exports (fadeUpVariant, layoutTransition) already have dedicated tween-confirmation test cases

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All three integration issues from the v1 audit are resolved
- Navigation, types, data, and motion are clean with full test coverage
- Production build succeeds with no dead imports

## Self-Check: PASSED

All 7 modified files verified on disk. Both task commits (82dd6f4, 355102e) verified in git log.

---
*Phase: 06-static-assets-and-integration-fixes*
*Completed: 2026-03-24*
