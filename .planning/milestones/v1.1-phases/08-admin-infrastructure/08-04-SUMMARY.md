---
phase: 08-admin-infrastructure
plan: 04
subsystem: infra
tags: [vite, hmr, path-normalization, windows, cross-platform]

requires:
  - phase: 08-admin-infrastructure
    provides: "Vite plugin with admin API and HMR suppression (08-01), atomic write with activeWrites callbacks (08-03)"
provides:
  - "Cross-platform HMR suppression via normalizePath on stored paths"
  - "Unit test proving path normalization prevents Windows/Unix mismatch"
affects: [09-admin-ui, 10-admin-polish]

tech-stack:
  added: []
  patterns: ["normalizePath from vite for all path comparisons in plugin hooks"]

key-files:
  created:
    - src/admin/__tests__/hmr-suppression.test.ts
  modified:
    - vite-plugin-admin-api.ts

key-decisions:
  - "Normalize on storage side only (onWriteStart/onWriteEnd callbacks), not on handleHotUpdate side, since Vite already normalizes the file argument"
  - "Renamed callback param from path to p to avoid shadowing the path module import"

patterns-established:
  - "Always use normalizePath from vite when storing paths that will be compared against Vite-provided paths"

requirements-completed: [INFRA-05]

duration: 3min
completed: 2026-03-25
---

# Phase 8 Plan 4: HMR Path Normalization Fix Summary

**Fixed Windows HMR suppression mismatch by applying Vite's normalizePath to activeWrites Set operations, closing the INFRA-05 gap**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-25T14:56:11Z
- **Completed:** 2026-03-25T14:59:11Z
- **Tasks:** 1 (TDD: 2 commits)
- **Files modified:** 2

## Accomplishments
- Fixed path separator mismatch preventing HMR suppression on Windows
- Added normalizePath import from vite and applied to both onWriteStart and onWriteEnd callbacks
- Created targeted unit test proving normalization equivalence and demonstrating the original bug
- All 98 tests pass with zero regressions, tsc and build clean

## Task Commits

Each task was committed atomically:

1. **Task 1 (RED): Add HMR suppression path normalization test** - `1e9b36f` (test)
2. **Task 1 (GREEN): Fix path normalization in plugin** - `4144704` (fix)

**Plan metadata:** TBD (docs: complete plan)

_Note: TDD task with two commits (test then fix)_

## Files Created/Modified
- `src/admin/__tests__/hmr-suppression.test.ts` - Unit test validating normalizePath equivalence between backslash and forward-slash paths, plus Set.has() behavior with/without normalization
- `vite-plugin-admin-api.ts` - Added normalizePath import from vite; applied to onWriteStart/onWriteEnd callbacks so activeWrites always stores forward-slash paths

## Decisions Made
- Normalize on storage side only (callbacks), not on handleHotUpdate side, since Vite already normalizes the file argument to forward slashes
- Renamed callback parameter from `path` to `p` to avoid shadowing the `path` module import from Node

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Vitest `-x` flag not supported in v4.1.0; used `--bail 1` instead (trivial CLI difference)

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- INFRA-05 gap fully closed: HMR suppression works cross-platform
- All Phase 8 infrastructure requirements (INFRA-01 through INFRA-05) now complete
- Ready for Phase 9 admin UI implementation

## Self-Check: PASSED

- All created files exist on disk
- All commit hashes found in git log
- 98/98 tests pass, tsc clean, build succeeds

---
*Phase: 08-admin-infrastructure*
*Completed: 2026-03-25*
