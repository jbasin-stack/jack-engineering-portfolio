---
status: resolved
trigger: "Timeline editor has no ordering + validation says 'check highlighted fields' but nothing highlighted. User wants drag reorder or auto-sort, red stars on required fields, inline errors across all editors."
created: 2026-03-26T20:00:00Z
updated: 2026-03-26T20:00:00Z
---

## Root Cause

There are **three distinct issues** sharing one debug session:

### Issue 1: No Timeline Ordering

**Root cause:** Neither the editor nor the data layer has any sort/reorder logic.

- `ItemList` component (`src/admin/editors/shared/ItemList.tsx`) renders items in array index order with no drag-to-reorder capability. It accepts no `onReorder` prop.
- `TimelineEditor` stores milestones as a plain array. No sort-on-save or sort-on-load logic exists.
- The public `Timeline` component (`src/components/sections/Timeline.tsx`) renders `milestones` in import order (line 93: `milestones.map`). No sort applied at render time.
- The data file `src/data/timeline.ts` has milestones manually ordered chronologically, but the test `src/data/__tests__/timeline.test.ts` (line 22-38) verifies chronological order by parsing "Mon YYYY" format dates. The test will **break** if the editor saves milestones in a different order, because there is no auto-sort on save.
- Date format is freeform string (`z.string().min(1)` in schema) -- values like "Sep 2021", "August 2024", "Fall 2025" coexist, making reliable auto-sort by date non-trivial without a standardized format.

### Issue 2: "Check Highlighted Fields" But Nothing Highlighted (Array Editors)

**Root cause:** `z.flattenError()` on an `z.array(objectSchema)` produces **numeric index keys** (e.g. `{ "0": [...], "1": [...] }`), NOT dotted path keys like `"0.title"` that the list-type editors expect.

The validation pipeline:
1. `useContentEditor.ts` line 60-61: `z.flattenError(result.error)` -> sets `fieldErrors`
2. For **singleton editors** (Hero, Contact): schema is `z.object({...})`, so `flattenError` returns `{ name: [...], subtitle: [...] }` -- keys match what editors pass to `error={fieldErrors.name}`. **This works correctly.**
3. For **list-type editors** (Timeline, Skills, Tooling, Coursework, Papers, Projects): schema is `z.array(z.object({...}))`, so `flattenError` returns `{ "0": [...], "1": [...] }` -- the key is just the array index string.
4. But editors look up errors as `fieldErrors[\`${activeIndex}.date\`]` (e.g., `"0.date"`). This key **never exists** in the flattened result because flattenError for array schemas nests differently.

**Result:** Toast says "check highlighted fields" but `fieldErrors["0.date"]` is `undefined`, so `FormField` receives no error, `aria-invalid` is not set, no red border appears, no inline error message renders.

**Affected editors (fieldErrors keys always miss):**
- `TimelineEditor` -- uses `fieldErrors[\`${activeIndex}.date\`]`, `fieldErrors[\`${activeIndex}.title\`]`, `fieldErrors[\`${activeIndex}.description\`]`
- `SkillsEditor` -- uses `fieldErrors[\`${activeIndex}.domain\`]`, `fieldErrors[\`${activeIndex}.skills\`]`
- `ToolingEditor` -- uses `fieldErrors[\`${activeIndex}.category\`]`, `fieldErrors[\`${activeIndex}.items\`]`
- `CourseworkEditor` -- uses `fieldErrors[\`${activeIndex}.code\`]`, `fieldErrors[\`${activeIndex}.name\`]`, `fieldErrors[\`${activeIndex}.descriptor\`]`
- `PapersEditor` -- uses `fieldErrors[\`${activeIndex}.title\`]`, `fieldErrors[\`${activeIndex}.descriptor\`]`, `fieldErrors[\`${activeIndex}.pdfPath\`]`
- `ProjectsEditor` -- uses `fieldErrors[\`${activeIndex}.title\`]`, etc.

**Editors where validation highlighting DOES work:**
- `HeroEditor` -- singleton, `fieldErrors.name` matches `flattenError` output
- `ContactEditor` -- singleton, `fieldErrors.tagline` etc. matches

**NavigationEditor** -- singleton-style (renders all items inline), dumps all fieldErrors at the bottom as a catch-all (lines 212-220). Partially works but errors are not inline next to the specific field.

### Issue 3: No Required Field Indicators

**Root cause:** `FormField`, `TagInput`, `StructuredArrayField`, and `Label` components have **zero** required-field visual indicators.

- `FormField` label is rendered as `<Label htmlFor={id}>{label}</Label>` -- no asterisk, no "required" prop, no red star.
- No `required` prop exists on `FormField` interface at all.
- `TagInput` and `StructuredArrayField` similarly have no required indicator.
- The Zod schemas define all core fields as `z.string().min(1)` (effectively required), but this information is not surfaced to the UI at design time -- it only manifests as a validation error after the user tries to save.

## Evidence

- timestamp: 2026-03-26T20:00:00Z
  checked: useContentEditor.ts save() function (line 55-63)
  found: Uses `z.flattenError(result.error)` which for array schemas returns index-keyed objects, not dot-path-keyed objects
  implication: All list-type editors (6 of 9) cannot display field-level validation errors

- timestamp: 2026-03-26T20:00:00Z
  checked: FormField.tsx, TagInput.tsx, StructuredArrayField.tsx
  found: All support `error` prop and render inline errors + aria-invalid, but FormField has no `required` prop or asterisk indicator
  implication: The rendering pipeline works IF errors are passed correctly; the problem is in error key mapping

- timestamp: 2026-03-26T20:00:00Z
  checked: ItemList.tsx
  found: No drag/reorder/sort capability -- pure read-only list with select + add
  implication: Need to either add drag-reorder to ItemList or implement auto-sort logic

- timestamp: 2026-03-26T20:00:00Z
  checked: Timeline.tsx (public component) and timeline.ts (data)
  found: Renders in array order with no sort. Data uses freeform date strings ("Sep 2021", "August 2024", "Fall 2025").
  implication: Auto-sort requires standardized date format or manual ordering

- timestamp: 2026-03-26T20:00:00Z
  checked: Input and Textarea UI components
  found: Both have `aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20` styles built in
  implication: The red border styling WILL work once aria-invalid is properly set -- no CSS changes needed

- timestamp: 2026-03-26T20:00:00Z
  checked: NavigationEditor.tsx
  found: Uses raw Input components (not FormField), no error prop passed to individual fields, dumps all errors in a catch-all block at bottom
  implication: NavigationEditor needs refactoring to use FormField or pass errors inline

## Artifacts

- path: "src/admin/useContentEditor.ts"
  issue: "`z.flattenError()` on array schemas produces index-keyed errors (e.g. `{'0': [...]}`) but list-type editors look up `'0.title'`-style dotted keys. Error data exists but is never matched to the right field."

- path: "src/admin/editors/shared/ItemList.tsx"
  issue: "No reorder capability -- only renders items and allows selection. No `onReorder` prop, no drag-and-drop, no move-up/move-down buttons."

- path: "src/admin/editors/shared/FormField.tsx"
  issue: "No `required` prop, no asterisk/star indicator on labels. Interface only has: label, value, onChange, error, multiline, placeholder."

- path: "src/admin/editors/TimelineEditor.tsx"
  issue: "Uses `fieldErrors[\`${activeIndex}.date\`]` pattern that never matches flattenError output for array schemas."

- path: "src/admin/editors/NavigationEditor.tsx"
  issue: "Uses raw Input components instead of FormField. No per-field error display. Errors dumped in bulk at bottom of form."

- path: "src/admin/editors/shared/TagInput.tsx"
  issue: "No `required` prop or asterisk indicator on label."

- path: "src/admin/editors/shared/StructuredArrayField.tsx"
  issue: "No `required` prop or asterisk indicator. Individual sub-field errors from nested objects not surfaced."

## Missing (Fixes Needed)

### For ordering (Issue 1):
- Add drag-to-reorder to `ItemList` (e.g. using `@dnd-kit/core` or move-up/move-down buttons) OR add auto-sort-by-date on save with a standardized date format
- If auto-sort: standardize timeline date field to a parseable format (e.g. "YYYY-MM" or a date picker) and sort before saving
- The `ItemList` `onReorder` callback needs to be wired into all list-type editors that want ordering

### For validation field errors (Issue 2):
- Replace `z.flattenError()` in `useContentEditor.ts` with a custom error flattener that produces dotted path keys (e.g. `"0.title"`) from `ZodError.issues[].path` array
- OR change the error lookup pattern in all list-type editors to use the nested structure that `flattenError` actually produces
- The fix in `useContentEditor.ts` is simpler: iterate `result.error.issues`, join each issue's `.path` array with `.` to produce keys like `"0.title"`, `"0.date"`, etc.

### For required indicators (Issue 3):
- Add `required?: boolean` prop to `FormField`, `TagInput`, `StructuredArrayField`
- Render a red asterisk (`<span className="text-destructive">*</span>`) next to label text when `required={true}`
- Pass `required` on all fields that have `z.string().min(1)` or equivalent schema constraints
- Also add to `NavigationEditor`'s inline Input labels

### For NavigationEditor error display:
- Refactor to pass per-field errors inline (either use FormField or manually pass error to each Input)
- Remove the catch-all error dump at the bottom
