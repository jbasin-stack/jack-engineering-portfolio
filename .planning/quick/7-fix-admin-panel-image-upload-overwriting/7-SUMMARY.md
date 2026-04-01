---
phase: quick-7
plan: 01
subsystem: admin
tags: [upload, file-paths, vite-plugin, tdd]

requires:
  - phase: none
    provides: existing admin upload infrastructure
provides:
  - unique file paths for project image uploads via getUploadPath fileName param
affects: [admin-panel, upload-workflow]

tech-stack:
  added: []
  patterns: [optional fileName param for path differentiation]

key-files:
  created: []
  modified:
    - src/admin/upload.ts
    - vite-plugin-admin-api.ts
    - src/admin/__tests__/upload.test.ts

key-decisions:
  - "fileName parameter is optional with fallback to preserve backwards compatibility"
  - "baseName extracted by stripping extension from normalizedName, since ext is handled separately"

patterns-established:
  - "getUploadPath accepts optional fileName for field-specific path uniqueness"

requirements-completed: [QUICK-7]

duration: 1min
completed: 2026-04-01
---

# Quick Task 7: Fix Admin Panel Image Upload Overwriting Summary

**getUploadPath now accepts optional fileName to produce unique paths for project image uploads, preventing file overwriting**

## Performance

- **Duration:** 1 min 15s
- **Started:** 2026-04-01T20:38:33Z
- **Completed:** 2026-04-01T20:39:48Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Added optional `fileName` parameter to `getUploadPath` that produces `/projects/{id}-{fileName}.{ext}` paths for image uploads
- Wired `baseName` (kebab-cased, extension-stripped) into the vite plugin's `getUploadPath` call
- Added 3 new test cases covering images with fileName, uniqueness verification, and backwards-compatible fallback
- All 18 tests pass, TypeScript compiles cleanly

## Task Commits

Each task was committed atomically:

1. **Task 1: Add test for unique project image paths, then fix getUploadPath** - `1a2f5bc` (feat - TDD red/green)
2. **Task 2: Wire normalizedName into getUploadPath call in vite plugin** - `fa3d63c` (feat)

## Files Created/Modified
- `src/admin/upload.ts` - Added optional `fileName` param to `getUploadPath`, split projects branch into thumbnail vs images
- `vite-plugin-admin-api.ts` - Extract `baseName` from `normalizedName` and pass as 5th arg to `getUploadPath`
- `src/admin/__tests__/upload.test.ts` - Added 3 tests for images field path uniqueness and fallback behavior

## Decisions Made
- fileName parameter is optional with fallback to `{id}{ext}` to preserve backwards compatibility for both thumbnail and images-without-fileName cases
- baseName is extracted by stripping the file extension from the already-kebab-cased normalizedName, since the extension is already handled as a separate `ext` variable

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Upload path uniqueness fixed; multiple images per project now produce distinct file paths on disk
- No blockers for further admin panel work

## Self-Check: PASSED

All files exist, all commits verified.

---
*Quick Task: 7-fix-admin-panel-image-upload-overwriting*
*Completed: 2026-04-01*
