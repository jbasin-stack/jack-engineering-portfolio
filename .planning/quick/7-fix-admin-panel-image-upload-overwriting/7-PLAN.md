---
phase: quick-7
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/admin/upload.ts
  - vite-plugin-admin-api.ts
  - src/admin/__tests__/upload.test.ts
autonomous: true
requirements: [QUICK-7]
must_haves:
  truths:
    - "Uploading multiple images to a project produces unique file paths per image"
    - "Project thumbnails still route to /projects/{id}.{ext} (no regression)"
    - "Project images route to /projects/{id}-{filename}.{ext}"
  artifacts:
    - path: "src/admin/upload.ts"
      provides: "getUploadPath with optional fileName parameter"
      exports: ["getUploadPath"]
    - path: "src/admin/__tests__/upload.test.ts"
      provides: "Test coverage for images field path uniqueness"
  key_links:
    - from: "vite-plugin-admin-api.ts"
      to: "src/admin/upload.ts"
      via: "getUploadPath call with normalizedName argument"
      pattern: "getUploadPath\\(.*normalizedName\\)"
---

<objective>
Fix admin panel image upload so that uploading multiple images to a project produces unique file paths instead of overwriting a single path.

Purpose: Currently `getUploadPath` generates identical paths for all project image uploads (`/projects/{id}.{ext}`), causing the second image to overwrite the first on disk. The fix differentiates thumbnail uploads (single, keeps current path) from images uploads (multiple, includes filename in path).

Output: Patched upload logic, updated plugin call site, passing tests.
</objective>

<execution_context>
@C:/Users/Jack/.claude/get-shit-done/workflows/execute-plan.md
@C:/Users/Jack/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/admin/upload.ts
@vite-plugin-admin-api.ts
@src/admin/__tests__/upload.test.ts
</context>

<tasks>

<task type="auto" tdd="true">
  <name>Task 1: Add test for unique project image paths, then fix getUploadPath</name>
  <files>src/admin/__tests__/upload.test.ts, src/admin/upload.ts</files>
  <behavior>
    - Test: getUploadPath('projects', 'images', 'lna-design', '.jpg', 'diagram') returns '/projects/lna-design-diagram.jpg'
    - Test: getUploadPath('projects', 'images', 'lna-design', '.png', 'schematic') returns '/projects/lna-design-schematic.png'
    - Test: getUploadPath('projects', 'thumbnail', 'lna-design', '.png') still returns '/projects/lna-design.png' (no regression)
    - Test: getUploadPath('projects', 'images', 'lna-design', '.jpg') without fileName falls back to '/projects/lna-design.jpg'
  </behavior>
  <action>
RED: In `src/admin/__tests__/upload.test.ts`, add tests to the existing `getUploadPath` describe block:
1. Test that `images` field with a `fileName` argument produces `/projects/{id}-{fileName}.{ext}`.
2. Test with a second different filename to confirm uniqueness.
3. Confirm existing thumbnail test still passes (already exists at line 56).
4. Test fallback when `images` field is called without `fileName` (backwards compat).

Run tests — new tests MUST fail (getUploadPath doesn't accept fileName yet).

GREEN: In `src/admin/upload.ts`, modify `getUploadPath`:
1. Add optional `fileName?: string` parameter (5th positional arg).
2. Split the `if` at line 71 into two branches:
   - `field === 'thumbnail'` returns `/projects/${itemId}${ext}` (unchanged).
   - `field === 'images' && fileName` returns `/projects/${itemId}-${fileName}${ext}`.
   - `field === 'images'` without fileName falls back to `/projects/${itemId}${ext}`.
3. Keep all other content type branches unchanged.

Run tests — all tests MUST pass.
  </action>
  <verify>
    <automated>npx vitest run src/admin/__tests__/upload.test.ts</automated>
  </verify>
  <done>getUploadPath produces unique paths for project images based on filename. All existing tests still pass. New tests cover the images field with and without fileName.</done>
</task>

<task type="auto">
  <name>Task 2: Wire normalizedName into getUploadPath call in vite plugin</name>
  <files>vite-plugin-admin-api.ts</files>
  <action>
In `vite-plugin-admin-api.ts` at line 180, the call is:
```
const targetPath = getUploadPath(context.contentType, context.field, context.itemId, ext);
```

The variable `normalizedName` is already computed at line 178 as `toKebabCase(fileName)`. Extract the base name (without extension) from `normalizedName` and pass it as the 5th argument:

```typescript
const baseName = normalizedName.replace(/\.[^.]+$/, '');
const targetPath = getUploadPath(context.contentType, context.field, context.itemId, ext, baseName);
```

This ensures the filename passed to `getUploadPath` is already kebab-cased and has no extension (the extension is handled separately by `ext`).
  </action>
  <verify>
    <automated>npx vitest run src/admin/__tests__/upload.test.ts && npx tsc --noEmit</automated>
  </verify>
  <done>The vite plugin passes the normalized base filename to getUploadPath. TypeScript compiles without errors. Uploading multiple images to a project will now produce unique paths on disk.</done>
</task>

</tasks>

<verification>
1. `npx vitest run src/admin/__tests__/upload.test.ts` — all tests pass including new image path tests
2. `npx tsc --noEmit` — no type errors across the project
3. Manual sanity: inspect that `getUploadPath('projects', 'images', 'lna-design', '.jpg', 'diagram')` returns `/projects/lna-design-diagram.jpg` (covered by automated test)
</verification>

<success_criteria>
- Uploading `diagram.jpg` and `schematic.jpg` to project `lna-design` produces `/projects/lna-design-diagram.jpg` and `/projects/lna-design-schematic.jpg` (unique paths, no overwrite)
- Thumbnail upload path unchanged: `/projects/lna-design.png`
- All unit tests pass
- TypeScript compiles cleanly
</success_criteria>

<output>
After completion, create `.planning/quick/7-fix-admin-panel-image-upload-overwriting/7-SUMMARY.md`
</output>
