---
phase: 10-content-editors
plan: 05
subsystem: ui
tags: [zod, validation, react, admin, form-errors, inline-validation]

# Dependency graph
requires:
  - phase: 10-content-editors (plan 01)
    provides: "useContentEditor hook, FormField/TagInput/StructuredArrayField shared components, NavigationEditor"
provides:
  - "Dotted-path error flattener producing correct fieldErrors keys for array-schema editors"
  - "Required field indicators (red asterisk) on FormField, TagInput, StructuredArrayField"
  - "Visual red ring on invalid FormField and TagInput inputs"
  - "NavigationEditor refactored to use FormField with per-field inline errors"
affects: [content-editors, admin-panel]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Custom Zod error flattener using issue.path.join('.') for dotted-path keys"
    - "Required prop convention on shared form components for red asterisk display"

key-files:
  created: []
  modified:
    - src/admin/useContentEditor.ts
    - src/admin/editors/shared/FormField.tsx
    - src/admin/editors/shared/TagInput.tsx
    - src/admin/editors/shared/StructuredArrayField.tsx
    - src/admin/editors/NavigationEditor.tsx

key-decisions:
  - "Custom issue.path.join('.') flattener over z.flattenError() for correct array-schema key matching"
  - "ring-1 ring-red-500 for visual error highlighting rather than relying solely on aria-invalid"

patterns-established:
  - "Dotted-path fieldErrors keys: array editors use `${index}.field`, nested use `${i}.children.${ci}.field`"
  - "Required prop on shared components renders red asterisk after label text"

requirements-completed: [EDIT-10, EDIT-11]

# Metrics
duration: 3min
completed: 2026-03-26
---

# Phase 10 Plan 05: Inline Validation Error Display Summary

**Dotted-path Zod error flattener fixing invisible validation errors in 7/9 editors, plus required field indicators and NavigationEditor FormField refactor**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-26T18:47:16Z
- **Completed:** 2026-03-26T18:49:47Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Replaced z.flattenError() with custom flattener producing dotted-path keys (e.g. '0.title') so array-schema editors correctly look up fieldErrors
- Added required prop to FormField, TagInput, and StructuredArrayField with red asterisk indicator
- Added red ring visual highlight on invalid FormField and TagInput inputs
- Refactored NavigationEditor from raw Input/Label to FormField for consistent per-field inline error display

## Task Commits

Each task was committed atomically:

1. **Task 1: Fix error flattener and add required indicators to shared components** - `06021df` (fix)
2. **Task 2: Refactor NavigationEditor to use FormField for consistent error display** - `10f9412` (refactor)

## Files Created/Modified
- `src/admin/useContentEditor.ts` - Custom error flattener using issue.path.join('.') for dotted-path keys
- `src/admin/editors/shared/FormField.tsx` - Added required prop with red asterisk, red ring on error
- `src/admin/editors/shared/TagInput.tsx` - Added required prop with red asterisk, red ring on error
- `src/admin/editors/shared/StructuredArrayField.tsx` - Added required prop with red asterisk
- `src/admin/editors/NavigationEditor.tsx` - Replaced raw Input/Label with FormField, removed generic error dump

## Decisions Made
- Used custom issue.path.join('.') flattener instead of z.flattenError() because the latter produces numeric keys ({0: [...]}) that don't match the dotted-path lookups (e.g. fieldErrors['0.title']) used by array-schema editors
- Applied ring-1 ring-red-500 as the visual error style since aria-invalid alone has no visible effect without matching CSS

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All 9 editors now display inline validation errors correctly using dotted-path key matching
- Required fields show red asterisks across all shared form components
- NavigationEditor uses the same FormField pattern as all other editors for consistency
- Ready for remaining gap closure plans (10-06, 10-07)

## Self-Check: PASSED

All 6 files verified present. Both commit hashes (06021df, 10f9412) verified in git log. Key content claims verified: issue.path.join in useContentEditor, required prop in all 3 shared components, FormField usage in NavigationEditor, no raw Input import remaining.

---
*Phase: 10-content-editors*
*Completed: 2026-03-26*
