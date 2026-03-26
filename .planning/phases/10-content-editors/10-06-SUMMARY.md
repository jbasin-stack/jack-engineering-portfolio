---
phase: 10-content-editors
plan: 06
subsystem: ui
tags: [react, admin, reorder, lucide-react, item-list]

# Dependency graph
requires:
  - phase: 10-content-editors (plans 01-02)
    provides: ItemList shared component and 6 list-type editors
provides:
  - Move-up/move-down reorder buttons in ItemList component
  - onReorder prop wired in all 6 list-type editors
affects: [10-content-editors]

# Tech tracking
tech-stack:
  added: []
  patterns: [adjacent-swap reorder via onReorder callback]

key-files:
  modified:
    - src/admin/editors/shared/ItemList.tsx
    - src/admin/editors/TimelineEditor.tsx
    - src/admin/editors/CourseworkEditor.tsx
    - src/admin/editors/SkillsEditor.tsx
    - src/admin/editors/ToolingEditor.tsx
    - src/admin/editors/PapersEditor.tsx
    - src/admin/editors/ProjectsEditor.tsx

key-decisions:
  - "Always-visible muted arrows over hover-reveal for admin tool discoverability"
  - "Swap-based reorder (adjacent items only) for simplicity and predictability"
  - "onSelect(targetIndex) called inside onReorder handler to follow selection with moved item"

patterns-established:
  - "onReorder callback: (fromIndex, toIndex) => swap + setActiveIndex(to) + onDirtyChange(true)"

requirements-completed: [EDIT-03, EDIT-04, EDIT-05, EDIT-06]

# Metrics
duration: 2min
completed: 2026-03-26
---

# Phase 10 Plan 06: Item Reorder Summary

**Move-up/move-down arrow buttons in ItemList with onReorder wired across all 6 list-type editors**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-26T18:47:18Z
- **Completed:** 2026-03-26T18:49:29Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments
- ItemList component now accepts optional `onReorder` prop with ChevronUp/ChevronDown buttons
- Boundary protection: up disabled on first item, down disabled on last item
- All 6 list-type editors (Timeline, Coursework, Skills, Tooling, Papers, Projects) wired with reorder
- Active selection follows moved item automatically
- Changes tracked as dirty so save bar appears after reorder

## Task Commits

Each task was committed atomically:

1. **Task 1: Add move-up/move-down buttons to ItemList** - `d028d9c` (feat)
2. **Task 2: Wire onReorder in all 6 list-type editors** - `defe236` (feat)

## Files Created/Modified
- `src/admin/editors/shared/ItemList.tsx` - Added optional onReorder prop with ChevronUp/ChevronDown arrow buttons
- `src/admin/editors/TimelineEditor.tsx` - Wired onReorder prop to ItemList
- `src/admin/editors/CourseworkEditor.tsx` - Wired onReorder prop to ItemList
- `src/admin/editors/SkillsEditor.tsx` - Wired onReorder prop to ItemList
- `src/admin/editors/ToolingEditor.tsx` - Wired onReorder prop to ItemList
- `src/admin/editors/PapersEditor.tsx` - Wired onReorder prop to ItemList
- `src/admin/editors/ProjectsEditor.tsx` - Wired onReorder prop to ItemList

## Decisions Made
- Always-visible muted arrows (text-gray-400) rather than hover-reveal for admin tool discoverability
- Swap-based reorder rather than drag-and-drop for simplicity and predictability
- Selection follows moved item via onSelect(targetIndex) inside the onReorder handler

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- All 6 list-type editors now support item reordering
- UAT gaps 7 and 8 (timeline/coursework reorder) are resolved
- Ready for remaining gap closure plans (10-05, 10-07)

## Self-Check: PASSED

- All 7 modified files verified present on disk
- Commit d028d9c verified in git log
- Commit defe236 verified in git log

---
*Phase: 10-content-editors*
*Completed: 2026-03-26*
