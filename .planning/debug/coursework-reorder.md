---
status: diagnosed
trigger: "Coursework editor has no drag-to-reorder capability. Coursework section doesn't appear on the public-facing website."
created: 2026-03-26T20:00:00Z
updated: 2026-03-26T20:00:00Z
---

## Root Cause

Two separate issues, both stemming from incomplete implementation:

### Issue 1: No reorder capability in any list-type editor

The `ItemList` component (`src/admin/editors/shared/ItemList.tsx`) is a simple click-to-select list with no drag-to-reorder functionality. It accepts only `items`, `activeIndex`, `onSelect`, `getLabel`, and `onAdd` props. There are no `onMove`, `onReorder`, or drag-related props or handlers. No drag-and-drop library (e.g., `@dnd-kit/core`, `react-beautiful-dnd`) is installed in the project.

This affects ALL list-type editors that use `ItemList`:
- CourseworkEditor
- TimelineEditor
- ProjectsEditor
- PapersEditor
- SkillsEditor
- ToolingEditor

The array order in the data files (`src/data/*.ts`) IS the display order on the public site, so reordering in the editor would directly control public display order.

### Issue 2: Coursework section exists but is not rendered on the public site

The `Coursework` component exists at `src/components/sections/Coursework.tsx` and is fully implemented (renders courses with motion animations). However, it is **NOT imported or rendered in `src/App.tsx`**. The App.tsx main section renders:

```
Hero -> WhoAmI -> Skills -> Tooling -> Timeline -> ProjectsSection -> PapersSection -> Contact
```

Coursework is completely absent from this chain. The user noted in UAT: "we don't even have coursework showing up on the website yet because I wasn't sure that I wanted it."

## Artifacts

- path: `src/admin/editors/shared/ItemList.tsx`
  issue: "No drag/reorder props, callbacks, or UI affordances. Pure click-to-select list."

- path: `src/admin/editors/CourseworkEditor.tsx`
  issue: "Uses ItemList without any reorder logic. Has add/delete but no move-up/move-down or drag."

- path: `src/components/sections/Coursework.tsx`
  issue: "Fully implemented public-facing component but not rendered anywhere in App.tsx."

- path: `src/App.tsx`
  issue: "Does not import or render the Coursework section. Missing from the main page layout."

- path: `src/data/coursework.ts`
  issue: "Static array of 8 Course objects. Array order = display order. No sortOrder field."

- path: `package.json`
  issue: "No drag-and-drop library installed (no @dnd-kit, react-beautiful-dnd, etc.)."

## Missing (what needs to be built)

### For reorder capability:
- Install a drag-and-drop library (recommend `@dnd-kit/core` + `@dnd-kit/sortable` -- lightweight, modern, well-maintained)
- Add `onMove(fromIndex, toIndex)` callback to `ItemList` component props
- Add drag handles and sortable wrapper to each `<li>` in `ItemList`
- Add `moveItem(from, to)` helper in each list-type editor (or extract to `useContentEditor`)
- This is a shared component change -- benefits all 6 list-type editors at once

### For public site visibility:
- User decision needed: whether to show coursework on the public site at all
- If yes: import and render `<Coursework />` in `App.tsx` (likely between Timeline and ProjectsSection)
- If yes: add `#coursework` anchor to navigation data so sidebar nav links to it
- The component is already built and functional -- just needs to be wired in

## Evidence

- timestamp: 2026-03-26T20:00:00Z
  checked: "ItemList component source"
  found: "Interface has 5 props: items, activeIndex, onSelect, getLabel, onAdd. Zero drag/reorder functionality."
  implication: "Reorder must be built from scratch in the shared component."

- timestamp: 2026-03-26T20:00:00Z
  checked: "All list-type editors (Coursework, Timeline, Projects, Papers, Skills, Tooling)"
  found: "All use same ItemList pattern. None implement move/reorder logic."
  implication: "This is a systemic gap, not coursework-specific. Fix in ItemList benefits all editors."

- timestamp: 2026-03-26T20:00:00Z
  checked: "App.tsx imports and render tree"
  found: "Coursework component is not imported. Section order: Hero, WhoAmI, Skills, Tooling, Timeline, Projects, Papers, Contact."
  implication: "Coursework is admin-only. Public display requires explicit opt-in by adding to App.tsx."

- timestamp: 2026-03-26T20:00:00Z
  checked: "package.json dependencies"
  found: "No drag-and-drop library installed."
  implication: "New dependency needed. @dnd-kit is the modern choice for React."

- timestamp: 2026-03-26T20:00:00Z
  checked: "Coursework.tsx public component"
  found: "Fully functional: renders courses with motion animations, has section id='coursework', imports from data/coursework.ts."
  implication: "No new component needed -- just needs to be included in App.tsx render tree."

- timestamp: 2026-03-26T20:00:00Z
  checked: "CONTENT_REGISTRY in vite-plugin-admin-api.ts"
  found: "coursework entry exists: maps to coursework.ts, Course type, courses export, isArray: true."
  implication: "Admin API backend fully supports coursework CRUD. Saving reordered arrays would persist correctly."

- timestamp: 2026-03-26T20:00:00Z
  checked: "Course type definition in types/data.ts"
  found: "Course has code, name, descriptor -- no sortOrder or order field."
  implication: "Ordering is implicit (array position). Reorder = rearrange array elements, no schema change needed."
