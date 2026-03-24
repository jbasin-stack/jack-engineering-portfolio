# Pitfalls Research

**Domain:** Dev-mode content admin panel for Vite 8 + React 19 static portfolio site
**Researched:** 2026-03-24
**Confidence:** HIGH (verified against Vite docs, codebase inspection, and community patterns)

## Critical Pitfalls

### Pitfall 1: Admin Code Ships to Production

**What goes wrong:**
Admin panel components, form editors, file-write endpoints, and their dependencies end up in the production bundle. The deployed portfolio on Vercel includes an `/admin` route or admin-related JavaScript chunks that are downloadable by anyone.

**Why it happens:**
Developers use `import.meta.env.DEV` to conditionally render the admin route but still use static imports for admin components. Vite's static analysis follows all `import` statements regardless of runtime conditions. A static `import AdminPanel from './admin/AdminPanel'` at the top of App.tsx will always be bundled, even if the component is only rendered inside an `if (import.meta.env.DEV)` block. Dynamic `import()` inside a DEV guard is better, but Rollup/Rolldown may still resolve and bundle the chunk -- it just becomes an orphan chunk that never loads but is still deployed.

**How to avoid:**
1. Use a Vite plugin approach: `configureServer` to mount the admin API routes (file writes, asset uploads) -- these hooks only run in dev, never in production builds
2. For admin UI components, use `React.lazy(() => import('./admin/AdminPanel'))` inside a guard that checks `import.meta.env.DEV`, AND verify the chunk is excluded from the build output
3. Better approach: put all admin UI under `src/admin/` and add a custom Vite plugin that uses the `resolveId` hook to return `\0virtual:noop` for any `src/admin/` import during production builds
4. Verify with `npx vite build && ls dist/assets/` -- search for any admin-related chunk names
5. Add a CI check: `grep -r "admin" dist/ && exit 1` to fail the build if admin code leaks

**Warning signs:**
- `dist/assets/` contains chunks with "admin" or "editor" in the filename after `vite build`
- Bundle analyzer shows admin dependencies (form libraries, file upload code) in production
- The production site has a `/admin` route that resolves instead of 404ing

**Phase to address:**
Phase 1 (project scaffolding) -- the exclusion mechanism must be the very first thing built, before any admin code exists. Retrofitting exclusion onto an existing admin panel is error-prone.

---

### Pitfall 2: File Write Triggers Infinite HMR Loop

**What goes wrong:**
The admin panel writes to `src/data/projects.ts`. Vite's file watcher (chokidar) detects the change and triggers HMR. HMR reloads the admin panel component, which re-reads the data, which (due to a bug or side effect) writes the file again, causing another HMR event. The dev server enters an infinite hot-update cycle, the page flickers constantly, and the terminal floods with update messages.

**Why it happens:**
Vite watches everything under `src/` by default. Any write to `src/data/*.ts` is treated as a source change. If the admin panel's form state initialization reads from the data file (via module import) and the HMR reload re-triggers the form's initialization logic, the write-watch-reload cycle can loop. This is especially insidious when using `useEffect` to sync form state with file data -- the effect runs on mount, detects a "change," and writes back.

**How to avoid:**
1. Implement a write-lock flag: set a module-level `isWriting = true` before `fs.writeFile`, and use Vite's `handleHotUpdate` plugin hook to suppress HMR for `src/data/*.ts` while the flag is active
2. Use `server.watcher.on('change')` in the plugin to debounce data file changes with a 500ms window after admin-initiated writes
3. Never initialize admin form state from the HMR-hot module import -- instead, read files via an API endpoint (`GET /api/admin/data/projects`) that reads from disk, bypassing the module graph entirely
4. Configure `awaitWriteFinish` in Vite's server.watch options: `{ stabilityThreshold: 300, pollInterval: 100 }` to prevent partial-write HMR triggers

**Warning signs:**
- Terminal shows rapid repeated `[vite] hmr update /src/data/projects.ts` messages
- The admin panel's form fields "jump" or reset unexpectedly
- Browser console shows multiple consecutive hot-update messages for the same file

**Phase to address:**
Phase 2 (file write API) -- must be solved the moment file writes are implemented, before building form editors on top.

---

### Pitfall 3: TypeScript Code Generation Produces Invalid or Unformatted Output

**What goes wrong:**
The admin panel generates `src/data/projects.ts` with mangled formatting, missing `import type` statements, incorrect string escaping (especially with apostrophes in project descriptions like "Jack's"), or output that fails `tsc` type checking. The generated code may break `verbatimModuleSyntax` by using `import { Project }` instead of `import type { Project }`.

**Why it happens:**
This project uses `"verbatimModuleSyntax": true` and `"erasableSyntaxOnly": true` in tsconfig.app.json. These are strict settings. Code generation via string templates (template literals) is fragile -- it is easy to forget `type` in imports, miss semicolons, produce inconsistent indentation, or fail to escape special characters in user-provided content. The current data files use a specific style (double quotes, trailing commas, explicit type annotations) that template-based generation must match exactly.

**How to avoid:**
1. Generate code using an AST approach: build an AST with TypeScript's compiler API (`ts.factory.createArrayLiteralExpression`, etc.) and print with `ts.Printer` -- this guarantees syntactic correctness
2. If using string templates (simpler but riskier): run Prettier programmatically on the output before writing to disk. Use `await prettier.format(code, { parser: 'typescript' })` to normalize formatting
3. Always emit `import type { ... }` (not `import { ... }`) for type imports -- `verbatimModuleSyntax` requires this and `tsc -b` (used in the build script) will reject bare type imports
4. Escape user content properly: replace `'` with `\\'` in strings, or use the AST approach which handles this automatically
5. After every write, run a lightweight validation: `ts.createSourceFile()` on the output to confirm it parses without syntax errors

**Warning signs:**
- `npm run build` (which runs `tsc -b`) fails after content edits via admin
- ESLint reports formatting violations in data files
- Data files have inconsistent formatting compared to hand-written originals
- Apostrophes or special characters in content cause syntax errors

**Phase to address:**
Phase 2 (file write API) -- the serialization/code-generation layer must be built and tested before forms write through it.

---

### Pitfall 4: Asset Path Mismatch Between Dev and Production

**What goes wrong:**
Images uploaded via the admin panel to `public/projects/my-image.png` work in dev (served at `/projects/my-image.png`) but break in production. Or the admin generates a data file referencing `/projects/my-image.png` but the actual file was saved as `my_image.png` (different casing or naming). The portfolio renders broken image icons on the deployed site.

**Why it happens:**
Vite's dev server serves `public/` at the root path, and `vite build` copies `public/` to `dist/`. This should be consistent, BUT:
1. Windows file systems are case-insensitive while Linux (Vercel's deploy target) is case-sensitive. An image saved as `LNA-Design.png` referenced as `/projects/lna-design.png` works on Windows dev but fails on Vercel
2. The admin may sanitize filenames differently than what gets written to the data file
3. If the Vite config has a `base` option set (currently it does not, but if added later), all asset paths need the base prefix in production but not in dev

**How to avoid:**
1. Normalize all filenames to lowercase-kebab-case on upload: `My Image (2).png` becomes `my-image-2.png`
2. The admin must write the exact same path string to both the filesystem AND the data file -- use a single function that returns the canonical path
3. Validate that the referenced file actually exists on disk after writing the data file
4. Never allow uppercase characters in asset filenames -- enforce this in the upload handler
5. Test with `vite build && vite preview` after every asset upload to catch path mismatches before deploying

**Warning signs:**
- Images appear in dev but show as broken in `vite preview`
- Console shows 404 errors for asset paths in production
- File names in `public/` have mixed casing or spaces

**Phase to address:**
Phase 3 (asset upload) -- path normalization must be part of the upload handler from day one.

---

### Pitfall 5: Data File Corruption from Concurrent or Interrupted Writes

**What goes wrong:**
A partial write occurs (the process crashes mid-write, or two rapid saves collide), leaving `src/data/projects.ts` with truncated or malformed content. The Vite dev server cannot parse the file, HMR fails, and the entire application shows an error overlay. Worse, if the user closes the terminal without noticing, they have lost data.

**Why it happens:**
`fs.writeFile` is not atomic on most file systems. If two writes overlap (user clicks Save twice quickly, or saves one section while another is still writing), the second write can interleave with the first. On Windows specifically, file locking can cause `EPERM` errors when trying to write a file that Vite's watcher currently has open.

**How to avoid:**
1. Use the atomic write-then-rename pattern: write to `src/data/projects.ts.tmp`, then `fs.rename()` to `src/data/projects.ts`. Rename is atomic on both NTFS and ext4
2. Implement a per-file write queue: if a write to `projects.ts` is in progress, queue the next write and execute it after the first completes (not in parallel)
3. Keep a `.backup` copy: before writing, copy the current file to `src/data/projects.ts.bak`. If the write fails, the user can recover
4. Use `write-file-atomic` npm package which implements the temp-file-and-rename pattern with proper error handling

**Warning signs:**
- Vite error overlay shows "Failed to parse source" for a data file
- Data file contains truncated JSON/TS or a mix of old and new content
- `EPERM` or `EBUSY` errors in the terminal on Windows

**Phase to address:**
Phase 2 (file write API) -- atomic writes must be the default from the very first write operation.

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| String template code generation instead of AST | Faster to implement, easier to read | Fragile to edge cases (escaping, formatting, type imports), breaks on special characters | Only for simple flat data files with no user-provided strings (like navigation.ts). Never for projects.ts or papers.ts. |
| Reading data files via module imports instead of fs.readFile API | Instant reactivity through HMR, no API layer needed | Couples admin forms to the module graph, triggers HMR on reads, makes write-lock logic harder | Never -- always read through a dedicated API endpoint |
| Embedding admin in App.tsx with a DEV conditional | Quick setup, no routing needed | Clutters the main component, risk of leaking to production, hard to code-split | Only acceptable as a 30-minute spike. Replace with proper isolation immediately. |
| Skipping Prettier on generated output | Faster writes, no dev dependency at runtime | Formatting drift between hand-edited and generated files, confusing git diffs | Never -- always format before writing |
| Storing upload state in component state only | Simple React pattern | Lost on HMR, lost on page refresh, no progress recovery on failure | During initial prototyping only. Add persistence before the feature is "done." |

## Integration Gotchas

Common mistakes when connecting admin components to the existing portfolio.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Vite dev middleware (file write API) | Using Express-style middleware that conflicts with Vite's connect server, or mounting middleware after internal middleware when it should be before | Use Vite's `configureServer` plugin hook. Return a function from it to mount middleware after Vite's internal middleware (so Vite handles HMR/module requests first, admin API is a fallback). |
| HMR after data file writes | Not debouncing or gating HMR events, causing the admin form to re-render and lose unsaved changes on every keystroke-triggered save | Debounce writes (500ms minimum). Use `handleHotUpdate` to suppress or delay HMR for admin-written files. Read data via API, not module imports. |
| Lenis smooth scroll in admin panel | The admin panel inherits Lenis smooth scrolling from the portfolio root, making form scrolling feel wrong (inertia on a form is disorienting) | Disable Lenis within the admin panel route. Either unmount `<SmoothScroll>` when in admin mode, or wrap admin content in a Lenis-excluded container. |
| Motion animations in admin context | Admin panel components inherit Motion's `MotionConfig reducedMotion="user"` and any layout animations, causing form elements to animate unexpectedly | Wrap admin panel in its own `<MotionConfig>` with no animations, or place it outside the `<MotionConfig>` boundary entirely. |
| react-pdf preview in admin | Trying to show a live PDF preview of uploaded PDFs using the existing PdfViewer component while the file is still being written to public/ | Do not preview PDFs by loading from the filesystem path. Instead, use a blob URL created from the upload's File object: `URL.createObjectURL(file)`. |

## Performance Traps

Patterns that degrade the development experience.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Reading all 9 data files on every admin page load via fs.readFile | Admin panel takes 200ms+ to open, noticeable delay | Read only the data file for the currently selected content type. Lazy-load others on tab switch. | Immediately noticeable but tolerable at 9 files. Would be bad at 50+. |
| Running Prettier synchronously on every save | Save feels sluggish (100-300ms delay per write) | Run Prettier asynchronously. Write the file first, then format and re-write. The brief unformatted state is invisible because HMR will fire on the final formatted write. | Noticeable immediately on slower machines. |
| Generating full preview re-renders on every keystroke | The live preview iframe or component re-renders character by character, causing jank | Debounce preview updates to 300ms after the last keystroke. Batch state updates. | Immediately with any non-trivial preview component (projects section with Motion animations). |
| Loading all admin dependencies eagerly | Dev server startup slows down even when not using admin | Lazy-import all admin deps. The admin route should add zero overhead to normal `npm run dev` startup. | Noticeable when admin deps grow (rich text editors, image croppers, drag-drop libraries). |

## Security Mistakes

Domain-specific security issues for a dev-only admin panel.

| Mistake | Risk | Prevention |
|---------|------|------------|
| Admin API endpoints accessible without dev-mode check | If the dev server is accidentally exposed to a network (e.g., `--host 0.0.0.0`), anyone on the LAN can write arbitrary TypeScript to src/ | Every admin API handler must verify `process.env.NODE_ENV !== 'production'` AND the admin plugin should only register routes in `configureServer` (which is dev-only by definition). Add an explicit check anyway for defense in depth. |
| File write API allows path traversal | A crafted filename like `../../vite.config.ts` could overwrite critical project files | Whitelist allowed write targets: only `src/data/*.ts` and `public/projects/`, `public/papers/`, `public/`. Reject any path containing `..` or absolute paths. Resolve and verify the final path is within the allowed directories. |
| Uploaded files not validated | A user could upload a 500MB file or a `.js` file to `public/` which gets served in production | Validate file type (only images: jpg/png/webp/svg, and PDFs) and file size (max 10MB) on the server side. Do not rely on client-side validation alone. |

## UX Pitfalls

Common user experience mistakes in admin panel design.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Form state lost on HMR during active editing | User types a project description, saves a different file, HMR reloads the admin component, and the unsaved description is gone | Store in-progress form state in sessionStorage or a ref that survives HMR. Use `import.meta.hot.accept()` with a callback that preserves state, or use `import.meta.hot.data` to pass state across HMR boundaries. |
| No confirmation before overwriting existing content | User accidentally clears a field and clicks Save, overwriting good content with empty string | Show a diff preview before saving. Or at minimum, require confirmation when a field is being emptied or shortened by more than 50%. Keep backups. |
| No visual feedback on save success/failure | User clicks Save, nothing happens visually, they are unsure if it worked | Show a toast notification on save. Show an error message with the actual error if the write fails. Disable the Save button during write and re-enable on completion. |
| Preview does not match production rendering | The side-by-side preview uses simplified rendering that does not match the actual portfolio sections | Render the actual portfolio section components in the preview. Do not build separate "preview" components. Pass data as props to the same components used in production. |
| No way to undo or revert changes | User makes a mistake and cannot go back | Since data files are in git, show the user how to revert (or provide a "Revert to last commit" button that runs `git checkout -- src/data/[file].ts`). |

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **File write API:** Often missing atomic writes -- verify that a kill-9 during write does not corrupt the data file
- [ ] **Production exclusion:** Often verified only by "the route doesn't show" -- verify with `vite build && grep -r "admin" dist/` that no admin code exists in the bundle
- [ ] **Asset upload:** Often missing filename normalization -- verify that uploading `My Image (1).PNG` results in `my-image-1.png` on disk and in the data file
- [ ] **Live preview:** Often only tested with simple data -- verify that a project with apostrophes, quotes, newlines, and unicode in the description renders correctly in preview AND in production
- [ ] **Form editors:** Often missing validation -- verify that submitting an empty required field (like project title) shows an error rather than writing an empty string to the data file
- [ ] **HMR stability:** Often tested with single saves -- verify that rapid-fire saves (5 saves in 2 seconds) do not crash the dev server or corrupt files
- [ ] **TypeScript output:** Often passes lint but breaks build -- verify `tsc -b` passes after every type of admin edit (not just `vite dev` which is more lenient)
- [ ] **Cross-platform:** Often works on the dev machine only -- verify file writes work on both Windows (NTFS, case-insensitive) and Linux/macOS (ext4/APFS, case-sensitive) if collaborators use different OSes

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Admin code leaked to production | LOW | Run `vite build`, inspect `dist/assets/` for admin chunks. If found, fix the exclusion plugin, rebuild, redeploy. No user data affected. |
| Infinite HMR loop | LOW | Kill the dev server (Ctrl+C). Add debounce/write-lock to the file write handler. Restart. |
| Corrupted data file | LOW-MEDIUM | If git has a clean commit: `git checkout -- src/data/[file].ts`. If not: restore from the `.bak` file. If neither: re-enter the data manually (the files are small, 9 files with <50 entries each). |
| Asset path mismatch in production | LOW | Fix the filename or reference in the data file. Redeploy. Usually caught by `vite preview` testing. |
| Form state lost to HMR | LOW | Annoying but not destructive. Re-enter the lost text. Fix by adding sessionStorage persistence. |
| Generated TypeScript fails tsc | MEDIUM | The `npm run build` script (`tsc -b && vite build`) will catch this before deploy. Fix the code generator's output, re-save through admin. |
| Path traversal exploit in dev | LOW | Dev-only, no production impact. Fix the path validation. Audit what was written and `git checkout` any overwritten files. |

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Admin code ships to production | Phase 1 (scaffolding) | `vite build && ls dist/assets/` shows zero admin-related chunks. Bundle size does not increase. |
| Infinite HMR loop | Phase 2 (file write API) | Save a data file 10 times rapidly -- no infinite loop, no error overlay, form state preserved. |
| TypeScript code generation errors | Phase 2 (file write API) | After admin-editing every data type, `tsc -b` passes. Special characters in content do not break syntax. |
| Asset path mismatch | Phase 3 (asset upload) | Upload an image with spaces and uppercase, verify it renders in `vite preview`. |
| Data file corruption | Phase 2 (file write API) | Kill the dev server mid-save (Ctrl+C during write). Restart and verify data file is intact (either new version or old version, never partial). |
| Form state lost on HMR | Phase 4 (form editors) | Edit a form field, change a CSS file (triggering HMR), verify the form field still has the unsaved value. |
| Lenis/Motion conflicts in admin | Phase 1 (scaffolding) | Admin panel scrolls normally (no smooth scroll inertia). Form elements do not animate on mount. |
| Preview does not match production | Phase 5 (live preview) | Side-by-side preview renders identically to the actual portfolio sections. |
| No save feedback or undo | Phase 4 (form editors) | Every save shows a toast. Every destructive edit can be reverted. |

## Sources

- [Vite Env Variables and Modes](https://vite.dev/guide/env-and-mode) - `import.meta.env.DEV` static replacement and tree-shaking behavior
- [Vite Plugin API](https://vite.dev/guide/api-plugin) - `configureServer`, `handleHotUpdate`, and `resolveId` hooks
- [Vite HMR API](https://vite.dev/guide/api-hmr) - `import.meta.hot.data` for preserving state across HMR, custom events
- [Vite environment-specific imports discussion](https://github.com/vitejs/vite/discussions/4172) - Dynamic imports inside DEV guards may still be bundled
- [Vite tree-shaking issue #15256](https://github.com/vitejs/vite/issues/15256) - Tree shaking fails when env variable is missing
- [chokidar awaitWriteFinish](https://github.com/paulmillr/chokidar) - File watcher debouncing for atomic writes
- [write-file-atomic](https://github.com/npm/write-file-atomic) - Atomic write-then-rename pattern for Node.js
- [TypeScript verbatimModuleSyntax](https://www.typescriptlang.org/tsconfig/verbatimModuleSyntax.html) - Requires explicit `import type` syntax
- [Vite HMR debugging discussion](https://github.com/vitejs/vite/discussions/4577) - Non-component exports in .tsx break Fast Refresh
- [Prettier API](https://prettier.io/docs/api) - Programmatic formatting for generated code
- [Vite Server Options](https://vite.dev/config/server-options) - `server.watch` configuration for file watcher tuning

---
*Pitfalls research for: Dev-mode content admin panel (v1.1 milestone)*
*Researched: 2026-03-24*
