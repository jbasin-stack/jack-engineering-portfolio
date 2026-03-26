---
phase: 09-admin-shell-preview-and-asset-pipeline
plan: 02
subsystem: api
tags: [busboy, multipart, upload, file-validation, kebab-case, vite-plugin]

# Dependency graph
requires:
  - phase: 08-admin-infrastructure
    provides: Vite admin API plugin with CONTENT_REGISTRY, codegen, atomic-write
provides:
  - Upload endpoint at /__admin-api/upload with busboy multipart parsing
  - Filename normalization utility (toKebabCase)
  - File validation utility (validateUpload)
  - Context-based upload path routing (getUploadPath)
  - Client-side uploadFile helper with FormData
  - Automatic data file reference updates after upload
affects: [09-admin-shell-preview-and-asset-pipeline, phase-10-editor-forms]

# Tech tracking
tech-stack:
  added: [busboy, "@types/busboy"]
  patterns: [multipart-file-upload, context-based-routing, file-before-data-write-ordering]

key-files:
  created:
    - src/admin/upload.ts
    - src/admin/__tests__/upload.test.ts
  modified:
    - vite-plugin-admin-api.ts
    - package.json

key-decisions:
  - "File write before data update ordering prevents HMR race condition"
  - "Hero portrait skips data update since path is hardcoded in component"
  - "structuredClone for deep-cloning SSR-loaded module data before mutation"

patterns-established:
  - "Context-based upload routing: contentType + field determines public/ subdirectory"
  - "Busboy streaming with finish callback for async file processing"

requirements-completed: [ASSET-01, ASSET-02, ASSET-03, ASSET-04]

# Metrics
duration: 4min
completed: 2026-03-25
---

# Phase 9 Plan 2: Asset Pipeline Upload Endpoint Summary

**Busboy multipart upload endpoint with kebab-case normalization, type/size validation, context-based path routing, and automatic data file reference updates**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-25T15:46:09Z
- **Completed:** 2026-03-25T15:50:15Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Upload utility with toKebabCase, validateUpload, getUploadPath, and uploadFile -- 15 tests covering all edge cases
- Server-side upload endpoint at /__admin-api/upload parsing multipart with busboy, enforcing 10MB limit and allowed extensions
- Automatic data file reference updates for projects, papers, and contact content types after file upload
- File-before-data write ordering prevents HMR race condition (public/ writes do not trigger HMR; src/ data writes do)

## Task Commits

Each task was committed atomically:

1. **Task 1: Upload utility with filename normalization and validation (TDD)** - `27de5c4` (feat)
2. **Task 2: Upload endpoint with busboy multipart parsing** - `ae8bc4a` (feat)

_Task 1 followed TDD: RED (tests fail, module missing) -> GREEN (all 15 tests pass)_

## Files Created/Modified
- `src/admin/upload.ts` - Filename normalization, validation, path routing, and client-side upload helper
- `src/admin/__tests__/upload.test.ts` - 15 tests for toKebabCase, validateUpload, getUploadPath
- `vite-plugin-admin-api.ts` - Added upload endpoint handler and updateDataReference helper
- `package.json` - Added busboy and @types/busboy dev dependencies

## Decisions Made
- File writes to public/ happen BEFORE data file updates to prevent HMR race condition (public/ writes do not trigger Vite HMR, only src/ data file writes do)
- Hero portrait upload skips data file update since the portrait path is hardcoded in the component JSX
- Used structuredClone to deep-clone SSR-loaded module data before mutating fields for data file regeneration
- Installed busboy (not formidable/multer) for streaming multipart parsing with minimal overhead

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Installed busboy dependency**
- **Found during:** Task 2 (Upload endpoint)
- **Issue:** busboy and @types/busboy not in package.json, needed for multipart parsing
- **Fix:** Ran `npm install busboy @types/busboy --save-dev`
- **Files modified:** package.json, package-lock.json
- **Verification:** TypeScript compiles clean, import resolves
- **Committed in:** ae8bc4a (Task 2 commit)

**2. [Rule 1 - Bug] Fixed TS strict mode error on response.json() return type**
- **Found during:** Task 2 verification (tsc --noEmit)
- **Issue:** `response.json()` returns `unknown` in strict TypeScript; accessing `.error` and `.path` properties failed
- **Fix:** Added explicit type assertion `as { error?: string; path?: string }`
- **Files modified:** src/admin/upload.ts
- **Verification:** `npx tsc -b --noEmit` passes clean
- **Committed in:** ae8bc4a (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 bug)
**Impact on plan:** Both fixes necessary for compilation. No scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Upload endpoint ready for integration with admin shell UI (Phase 9 Plan 1/3)
- Client-side uploadFile helper ready for drag-drop upload zones in editor forms (Phase 10)
- All 113 existing tests continue to pass with zero regressions

## Self-Check: PASSED

All files exist. All commits verified in git log.

---
*Phase: 09-admin-shell-preview-and-asset-pipeline*
*Completed: 2026-03-25*
