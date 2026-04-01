---
phase: quick-6
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/data/projects.ts
  - vite-plugin-admin-api.ts
autonomous: true
requirements: [FIX-BLANK-PROJECTS]
must_haves:
  truths:
    - "Clicking any project card navigates to a working detail page (no blank screen)"
    - "Admin panel projects page loads without crashing"
    - "Uploading an image to a project's images field appends to the array instead of overwriting it"
  artifacts:
    - path: "src/data/projects.ts"
      provides: "Corrected Schottky project with images as string[]"
      contains: "images: ['/projects/schottky-diode-fabrication.jpg']"
    - path: "vite-plugin-admin-api.ts"
      provides: "Array-aware updateDataReference handler"
      contains: "Array.isArray"
  key_links:
    - from: "vite-plugin-admin-api.ts"
      to: "src/data/projects.ts"
      via: "updateDataReference writes project data"
      pattern: "Array.isArray.*item\\[context\\.field\\]"
---

<objective>
Fix two related bugs causing blank pages when clicking projects after admin panel edits.

Purpose: The Schottky Diode Fabrication project has `images` as a string instead of `string[]`, crashing ProjectDetail and the admin projects page. The root cause is `updateDataReference` in the admin API plugin always assigning a string to fields, even when the field type is an array.

Output: Both the corrupted data and the root cause are fixed. All project pages render correctly.
</objective>

<execution_context>
@C:/Users/Jack/.claude/get-shit-done/workflows/execute-plan.md
@C:/Users/Jack/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/data/projects.ts
@src/types/data.ts
@vite-plugin-admin-api.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Fix corrupted project data and harden admin upload handler</name>
  <files>src/data/projects.ts, vite-plugin-admin-api.ts</files>
  <action>
**Fix 1 — Corrupted data in src/data/projects.ts (line 11):**
Change the Schottky Diode Fabrication project's `images` field from:
```
images: '/projects/schottky-diode-fabrication.jpg',
```
to:
```
images: ['/projects/schottky-diode-fabrication.jpg'],
```
This restores compliance with the `Project` interface where `images: string[]`.

**Fix 2 — Root cause in vite-plugin-admin-api.ts (line 74):**
In the `updateDataReference` function, inside the `if (entry.isArray && ...)` block (around line 74), replace:
```typescript
item[context.field] = targetPath;
```
with logic that checks whether the existing field value is an array. If it is, push the new path onto it. If it is not (e.g., `thumbnail` which is `string`), assign directly as before:
```typescript
if (Array.isArray(item[context.field])) {
  (item[context.field] as string[]).push(targetPath);
} else {
  item[context.field] = targetPath;
}
```
This ensures future admin image uploads to array fields (like `images`) append correctly rather than overwriting the array with a bare string.
  </action>
  <verify>
    <automated>npx tsc --noEmit 2>&1 | head -20</automated>
  </verify>
  <done>TypeScript compiles with no errors. The Schottky project's images field is a string array. The admin upload handler correctly appends to array fields and assigns to scalar fields.</done>
</task>

<task type="auto">
  <name>Task 2: Verify project pages render without crashes</name>
  <files></files>
  <action>
Run the dev server and confirm it starts without errors. Then use the build command to verify the full production build succeeds — this exercises all component rendering paths including ProjectDetail which does `.map()` on `project.images`.

1. Run `npm run build` (Vite production build). This will fail if any TypeScript or runtime-resolvable errors exist.
2. Confirm no errors in output.
  </action>
  <verify>
    <automated>cd "C:/Claude code projects/GSD Projects/Jack_Engineering_Portfolio" && npm run build 2>&1 | tail -10</automated>
  </verify>
  <done>Production build completes successfully with no errors, confirming all project data is valid and all components can render.</done>
</task>

</tasks>

<verification>
1. `npx tsc --noEmit` passes (type safety)
2. `npm run build` succeeds (full build validation)
3. In src/data/projects.ts, every project's `images` field is an array
4. In vite-plugin-admin-api.ts, the updateDataReference function checks `Array.isArray` before deciding to push vs assign
</verification>

<success_criteria>
- All project detail pages render without blank screens
- Admin panel projects page loads without crashing
- Future admin image uploads to array fields append correctly
- TypeScript compilation and production build both pass
</success_criteria>

<output>
After completion, create `.planning/quick/6-fix-blank-page-when-clicking-projects-af/6-SUMMARY.md`
</output>
