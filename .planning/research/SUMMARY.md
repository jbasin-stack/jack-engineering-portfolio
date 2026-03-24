# Project Research Summary

**Project:** v1.1 Dev-Mode Admin Panel — Jack Engineering Portfolio
**Domain:** Local dev-mode content management panel for static TypeScript portfolio site
**Researched:** 2026-03-24
**Confidence:** HIGH

## Executive Summary

This v1.1 milestone adds a developer-only admin panel that lets Jack edit portfolio content through a form UI rather than hand-editing TypeScript data files. The recommended approach treats the admin panel as a pure dev tool: a custom Vite plugin provides file-write REST endpoints via `configureServer` (dev-only by design via `apply: 'serve'`), the admin UI is a lazily-loaded React route guarded by `import.meta.env.DEV` (tree-shaken to zero bytes in production by Rolldown), and live preview is achieved for free by leveraging Vite's native HMR — when the admin writes a data file, the iframe preview updates automatically without any custom postMessage infrastructure.

The critical architectural insight across all four research areas is that complexity should be zero-added to production. The Vite plugin's `apply: 'serve'` flag, the `import.meta.env.DEV` dead-code elimination path, and the `src/admin/` directory isolation together provide four independent layers of protection that guarantee no admin code reaches Vercel. The entire admin surface — forms, drag-drop uploads, split-pane preview — is dev-only infrastructure that disappears from the deployed bundle. One notable bug to work around: shadcn/ui v4's `Resizable` wrapper has a known API mismatch with `react-resizable-panels` v4's renamed exports; use the library directly, not the shadcn/ui wrapper.

The primary risk is the TypeScript code generation layer: the existing codebase uses `verbatimModuleSyntax: true` and `erasableSyntaxOnly: true`, which means generated `.ts` data files must emit `import type` (not `import`) and pass `tsc -b` after every save. This must be solved with Prettier-formatted template generation and lightweight AST validation in Phase 2 — before any form editors are built on top of it. A secondary risk is infinite HMR loops if admin-initiated file writes are not debounced and isolated from the module graph read path (form state must be initialized from the `GET /__admin-api/content/:type` endpoint, never from module imports).

## Key Findings

### Recommended Stack

The existing validated stack (Vite 8, React 19, Tailwind v4, Motion, shadcn/ui, TypeScript) requires only targeted additions. No router library is needed — the single admin route is handled by a `window.location.search` check behind `import.meta.env.DEV`. No external CMS or database is needed — the 9 TypeScript data files are the persistence layer and the custom Vite plugin is the write API.

**Core technologies to add:**
- **react-hook-form ^7.72.0**: Form state management — shadcn/ui's Form component is built on this; `useFieldArray` handles nested array content types (projects.techStack[], projects.links[], projects.images[])
- **zod ^4.3.6**: Runtime schema validation before file writes — catches malformed data at edit time, not build time; schemas mirror `src/types/data.ts` interfaces
- **@hookform/resolvers ^5.2.2**: Bridge between react-hook-form and Zod — auto-detects Zod v3/v4 at runtime
- **react-dropzone ^15.0.0**: Headless drag-drop upload hook — headless API pairs with shadcn/ui styling, React 19 confirmed compatible in v14.3.6+
- **formidable ^3.5.2** (devDep): Server-side multipart parsing inside Vite plugin — works with raw Node.js IncomingMessage without Express
- **Custom Vite plugin** (in-project, no npm): `configureServer` REST endpoints at `/__admin-api/*` for data read/write and asset upload

**shadcn/ui components to add** via `npx shadcn@latest add`: `input`, `textarea`, `select`, `switch`, `field`, `tabs`, `badge`, `separator`, `resizable`, `scroll-area`.

**Critical version note:** Use `react-resizable-panels` v4 directly (`import { Group, Panel, Separator } from 'react-resizable-panels'`), not through shadcn/ui's `Resizable` wrapper — a known API mismatch exists (shadcn-ui/ui#9136) between shadcn/ui v4's Resizable component and the library's renamed v4 exports.

### Expected Features

**Must have (table stakes) — v1.1 Core (all P1):**
- Form-based editors for all 9 content types — without full coverage the admin provides no value over editing `.ts` files directly
- Zod validation schemas matching TypeScript interfaces — prevents invalid data from corrupting the rendered site
- Vite plugin read/write API endpoints — the foundational layer everything else depends on
- TypeScript code generation — produces valid `.ts` files preserving the existing `import type` + `export const` format
- Dynamic array field management via `useFieldArray` — most content types are arrays with nested arrays
- Asset file upload to `public/` subdirectories — projects, papers, and portrait assets must be uploadable
- Dev-mode route guard (`import.meta.env.DEV`) — zero admin code in production is non-negotiable
- Live side-by-side preview — the flagship feature that justifies building a custom tool
- Save feedback (toasts) — users must know if writes succeed or fail

**Content type complexity (informs build order):**
- LOW: Hero (singleton), Contact (singleton), Coursework (flat array), Timeline (flat array)
- MEDIUM: Navigation (nested children[]), Skills (nested skills[]), Tooling (nested items[]), Papers (PDF file reference)
- HIGH: Projects (3 nested arrays: techStack[], links[], images[]; thumbnail + image file references; 10 fields/item)

**Should have (polish) — v1.1 post-core (P2):**
- Image optimization via Sharp on upload (convert to WebP, resize to max 1200px)
- Drag-and-drop reorder via dnd-kit for projects, milestones, and skills groups
- Content status indicators showing placeholder vs. real content
- Keyboard shortcuts (Ctrl+S to save, Ctrl+N to add item)

**Defer to v2+:**
- Markdown support in descriptions (requires simultaneous changes to rendering components)
- Bulk operations, export/import as JSON, content templates

**Anti-features confirmed (do not build):**
- Full headless CMS (TinaCMS, Payload, Strapi) — zero-cost constraint violation, massive overhead for 9 small files
- Version history/undo — Git `checkout` is the version history system
- Multi-user authentication — single operator, localhost only
- Rich text / WYSIWYG editor — existing interfaces use plain strings; rendering components do not support markup

### Architecture Approach

The admin panel integrates with the existing portfolio through four mechanisms that maintain a strict production/dev boundary: (1) a custom Vite plugin (`apply: 'serve'`) provides filesystem endpoints at `/__admin-api/*`; (2) `App.tsx` gains ~20 lines with an `import.meta.env.DEV` ternary assigning `null` in production + `React.lazy()` that Rolldown dead-code-eliminates; (3) an iframe pointing to `localhost:PORT/` provides live preview — Vite's chokidar watcher detects data file writes and propagates HMR to the iframe automatically, no custom WebSocket setup needed; (4) all admin code lives under `src/admin/` with a one-directional import graph.

**Major components:**
1. **`vite-plugin-admin-api.ts`** — Vite plugin with `GET/POST /__admin-api/content/:type` and `POST /__admin-api/asset/upload`; uses `server.ssrLoadModule()` for TypeScript-aware reads and atomic `writeFile` + `rename` for writes; `apply: 'serve'` ensures complete absence from production builds
2. **`src/admin/AdminShell.tsx`** — Split-pane layout using `react-resizable-panels` v4 directly (not shadcn/ui wrapper); editor panel (40% default) + iframe preview panel (60% default)
3. **`src/admin/editors/*.tsx`** — 9 per-content-type form editors; shared `ArrayFieldEditor`, `AssetUploader`, `NestedObjectField` components
4. **`src/admin/api.ts`** — Typed fetch helpers (`fetchContent<T>`, `saveContent`, `uploadAsset`) for all `/__admin-api/*` endpoints
5. **`src/App.tsx`** (modified ~20 lines) — `import.meta.env.DEV` guard, `React.lazy()` admin import, `?admin` query param + Ctrl+Shift+A toggle

**Key patterns to follow:**
- Read data via `server.ssrLoadModule()` (API endpoint), never via module imports — prevents HMR loop
- Idempotent full-file writes — always replace the entire file content, never patch
- Atomic write-then-rename (`projects.ts.tmp` then `fs.rename()`) — prevents partial write corruption
- Asset paths normalized to lowercase-kebab-case on upload — prevents Windows dev / Linux production case mismatch
- After asset upload: `server.ws.send({ type: 'full-reload' })` — `public/` is not in the module graph

### Critical Pitfalls

1. **Admin code ships to production** — Use `apply: 'serve'` on the plugin + `import.meta.env.DEV` ternary assigning `null` (not conditional render) + `React.lazy()`. Verify with `vite build && grep -r "admin" dist/` returning zero matches. Must be addressed in Phase 1 before any admin UI code is written.

2. **Infinite HMR loop on file writes** — Never initialize admin form state from module imports; always read via `GET /__admin-api/content/:type` endpoint. Implement a write-lock flag with `handleHotUpdate` to suppress HMR events for admin-initiated writes. Debounce saves to 500ms. Must be addressed in Phase 2.

3. **TypeScript code generation produces invalid output** — Project uses `verbatimModuleSyntax: true`, requiring `import type` in all generated files. Always run Prettier programmatically on generated TypeScript. Validate with `ts.createSourceFile()`. Test with `tsc -b`, not just `vite dev`. Apostrophes and special characters in user content require proper JSON escaping. Must be addressed in Phase 2.

4. **Asset path mismatch between dev and production** — Windows is case-insensitive; Vercel (Linux) is not. Normalize all uploaded filenames to lowercase-kebab-case in the upload handler. One function returns the canonical path and writes it to both filesystem and data file reference. Must be addressed in Phase 3.

5. **Data file corruption from concurrent or interrupted writes** — Use atomic write-then-rename pattern. Implement per-file write queue for rapid saves. Keep a `.bak` copy before each write. Must be addressed in Phase 2.

## Implications for Roadmap

The dependency graph is unambiguous: the Vite plugin API endpoints are the foundational layer. TypeScript code generation correctness must be proven before forms write through it. Production exclusion must be the first thing built — retrofitting it is error-prone. The recommended phase count is 7, progressing from infrastructure to editors to verification.

### Phase 1: Foundation and Dev/Prod Boundary

**Rationale:** Production exclusion must be established and verified before a single line of admin UI code is written. Also resolves Lenis/Motion conflicts that affect every subsequent phase.
**Delivers:** `import.meta.env.DEV` guard in `App.tsx`, `src/admin/` directory with stub `AdminShell`, Vite plugin registered with `apply: 'serve'`, `vite build && grep -r "admin" dist/` returns zero, Lenis disabled within admin scope, Motion config isolated for admin.
**Addresses:** Dev-mode-only routing (P1), content type navigation stub (P1)
**Avoids:** Critical Pitfall 1 (admin code in production), Lenis/Motion conflicts in admin context

### Phase 2: File Write API and TypeScript Code Generation

**Rationale:** Every persistence operation routes through the Vite plugin. TypeScript code generation correctness (particularly `verbatimModuleSyntax` compliance) must be proven in isolation before form editors are built on top of it. Atomic writes and HMR loop prevention must be solved here.
**Delivers:** `vite-plugin-admin-api.ts` with all CRUD endpoints, `server.ssrLoadModule()` reads, atomic write-then-rename, write-lock + HMR debounce, Prettier-formatted TypeScript output validated against `tsc -b`, `src/admin/api.ts` fetch helpers, `CONTENT_REGISTRY` mapping all 9 content types.
**Uses:** Custom Vite plugin, formidable, Node `fs.promises`, Prettier API
**Avoids:** Critical Pitfalls 2 (infinite HMR loop), 3 (invalid TypeScript output), 5 (data corruption)

### Phase 3: Asset Upload Pipeline

**Rationale:** Asset upload depends on the file write API from Phase 2. Filename normalization must be built into the upload handler from day one — retrofitting it after assets are uploaded means renaming files and updating data references.
**Delivers:** `POST /__admin-api/asset/upload` with formidable multipart parsing, lowercase-kebab-case filename normalization, file type/size validation (images + PDFs only, max 10MB), path traversal prevention (whitelist `src/data/` and `public/` subdirectories), `server.ws.send({ type: 'full-reload' })` after upload, `AssetUploader.tsx` drag-drop component.
**Uses:** react-dropzone, formidable, Sharp (optional P2 — verify Windows binary install first)
**Avoids:** Critical Pitfall 4 (asset path mismatch), path traversal security risk

### Phase 4: Split-Pane Shell and Live Preview

**Rationale:** The AdminShell layout and iframe preview should be built once the API layer works but before form editors, so the HMR cycle can be verified end-to-end (API write → chokidar → HMR → iframe re-render) with no form complexity in the way.
**Delivers:** `AdminShell.tsx` using `react-resizable-panels` v4 `Group/Panel/Separator` directly, `AdminPreview.tsx` iframe pointing to `localhost:PORT/`, `AdminSidebar.tsx` / `AdminHeader.tsx` with content type tab navigation, verified end-to-end HMR cycle with real data files.
**Uses:** react-resizable-panels v4 directly (bypass shadcn/ui Resizable due to known bug #9136), shadcn/ui tabs, shadcn/ui scroll-area
**Avoids:** shadcn/ui Resizable API mismatch bug, preview not matching production rendering (UX Pitfall 4)

### Phase 5: Form Editors — Simple Types First

**Rationale:** Build editors in order of increasing complexity. Singleton flat types (Hero, Contact) establish the full editing + save + preview + toast feedback loop. Then simple array types (Coursework, Timeline) exercise `useFieldArray`. Then nested array types (Skills, Tooling, Navigation, Papers).
**Delivers:** Editors for 8 of 9 content types (all except Projects), react-hook-form + Zod integration for all editors, `useFieldArray` for array types, shared `ArrayFieldEditor.tsx` and `NestedObjectField.tsx`, save toast feedback, sessionStorage form state persistence (survives HMR).
**Uses:** react-hook-form, zod, @hookform/resolvers, shadcn/ui form components (input, textarea, select, switch, field, badge), shadcn/ui Sonner/Toast
**Avoids:** Form state lost on HMR (UX Pitfall 1), no save feedback (UX Pitfall 3), missing validation (Looks Done But Isn't checklist)

### Phase 6: Projects Editor (Complex Type) and P2 Polish

**Rationale:** Projects is the most complex editor (3 nested arrays, file references, 10 fields/item). Built last after all shared components and `useFieldArray` patterns are established from Phase 5.
**Delivers:** `ProjectsEditor.tsx` with full nested array management, thumbnail/image upload via `AssetUploader`, `featured` boolean toggle, all 10 fields per project item. P2 additions: dnd-kit drag-to-reorder for projects and milestones, image optimization via Sharp (pending Windows binary verification), content status indicators, Ctrl+S / Ctrl+N keyboard shortcuts.
**Uses:** react-hook-form `useFieldArray` (nested), dnd-kit (P2), Sharp (P2 conditional)
**Implements:** Most complex Architecture component — verifies all prior patterns hold under nesting depth

### Phase 7: Production Verification and Hardening

**Rationale:** Final hardening pass addressing the "Looks Done But Isn't" checklist explicitly. All critical pitfalls verified simultaneously before the admin panel is considered complete.
**Delivers:** Verified: `vite build && grep -r "admin" dist/` returns zero; `tsc -b` passes after editing every content type including special characters (apostrophes, quotes, unicode, newlines); rapid-fire saves (5 in 2 seconds) produce no corruption; `vite preview` shows no broken asset references; form state survives HMR; cross-platform file path behavior confirmed on Windows/NTFS.
**Avoids:** All 5 critical pitfalls verified in a production-representative build

### Phase Ordering Rationale

- Phase 1 before everything: Production exclusion cannot be retrofitted. Verify zero admin in `dist/` before writing any admin UI.
- Phase 2 before Phases 4-6: Every editor's save path routes through the plugin. Code generation correctness proven in isolation so form bugs can be distinguished from serialization bugs.
- Phase 3 before Phases 5-6: `AssetUploader` is shared across PapersEditor and ProjectsEditor; must exist before those editors are built.
- Phase 4 before Phases 5-6: AdminShell provides the layout context all editors render inside; HMR cycle verified end-to-end without form complexity.
- Phase 5 before Phase 6: `ArrayFieldEditor` and `NestedObjectField` shared components created in Phase 5 and reused in Phase 6. `useFieldArray` patterns proven on simpler types before the deeply-nested Projects type.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 2 (TypeScript code generation):** The interaction between `verbatimModuleSyntax`, Prettier's TypeScript parser, and `JSON.stringify` output for edge cases (empty arrays, null values, escaped strings with user content) warrants a brief spike. Template-based generation works for flat types (navigation.ts) but is risky for Projects with user-provided string content — consider Prettier + `ts.createSourceFile()` validation as the safety net.
- **Phase 6 (dnd-kit with nested useFieldArray):** dnd-kit with `useFieldArray` at two nesting levels has non-obvious constraints. Verify the specific pattern (array of items, each with sortable sub-arrays) works before committing to the drag-reorder feature.

Phases with standard patterns (skip research-phase):
- **Phase 1:** `import.meta.env.DEV` + `React.lazy()` production exclusion is documented Vite behavior, well-understood.
- **Phase 3:** formidable multipart parsing + filename normalization is standard Node.js. No ambiguity.
- **Phase 4:** react-resizable-panels v4 direct usage is documented; API mismatch with shadcn/ui wrapper is confirmed with a clear workaround.
- **Phase 5:** react-hook-form + Zod + shadcn/ui Form is the official documented pattern on ui.shadcn.com. No research needed.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All package versions verified on npm. React 19 peer dep compatibility confirmed for every addition. The only MEDIUM item (react-hook-form v8 timeline) was resolved: v7 is the correct choice and v8 beta status is confirmed. |
| Features | HIGH | Feature set scoped against the 9 known TypeScript interfaces in `src/types/data.ts`. Content type complexity analysis grounded in actual interface structures. Anti-feature decisions based on real constraints (zero-cost, single user, existing data model). |
| Architecture | HIGH | All four architectural decisions backed by official Vite docs. The shadcn/ui Resizable API mismatch is a confirmed tracked bug with a clear workaround. `server.ssrLoadModule()` for TypeScript-aware reads is an officially documented Vite API. |
| Pitfalls | HIGH | All 5 critical pitfalls traced to documented Vite behavior, TypeScript compiler flags in existing `tsconfig.app.json`, and Node.js filesystem semantics. Prevention strategies use standard patterns. |

**Overall confidence:** HIGH

### Gaps to Address

- **Prettier as dev dependency:** Research recommends running Prettier programmatically on generated TypeScript output. Verify Prettier is already installed (likely as part of ESLint setup) before Phase 2; if not, add `prettier` to devDependencies.
- **Sharp native binary on Windows:** Sharp requires platform-specific native binaries. Verify `npm install -D sharp` works cleanly in the Windows development environment before committing to image optimization in Phase 6. If binary installation fails, defer Sharp to v2 and document manual image optimization as the workaround.
- **`write-file-atomic` vs manual temp-file-rename:** Both produce the same result. Given the project's bias toward minimal dependencies, prefer the manual 3-line pattern (`writeFile` to `.tmp` then `fs.rename()`) over adding `write-file-atomic` as a dependency. Decide in Phase 2.
- **Zod schemas as source of truth vs parallel schemas:** Two valid approaches — (a) refactor `src/types/data.ts` to infer TypeScript types from Zod schemas (cleaner, but modifies v1.0 code); (b) maintain parallel Zod schemas that mirror existing interfaces (slight duplication, but v1.0 code untouched). Recommend approach (b) for v1.1 to maintain a clean boundary with shipped v1.0 code.
- **Zod v4 error format with shadcn/ui form examples:** shadcn/ui docs reference Zod v3 in error display examples. Zod v4 has a different error format. @hookform/resolvers v5.2.2 handles this at the validation layer, but toast error messages may need adjustment for Zod v4's error shape.

## Sources

### Primary (HIGH confidence)
- [Vite Plugin API — configureServer](https://vite.dev/guide/api-plugin) — plugin hooks, `apply: 'serve'`, `handleHotUpdate`, `ssrLoadModule`
- [Vite Env Variables and Modes](https://vite.dev/guide/env-and-mode) — `import.meta.env.DEV` static replacement, tree-shaking behavior
- [Vite HMR API](https://vite.dev/guide/api-hmr) — `import.meta.hot.data`, `server.ws.send`, `full-reload`
- [Vite Server Options](https://vite.dev/config/server-options) — `server.watch` configuration for file watcher tuning
- [shadcn/ui Forms — React Hook Form](https://ui.shadcn.com/docs/forms/react-hook-form) — official form integration docs
- [shadcn/ui Resizable](https://ui.shadcn.com/docs/components/radix/resizable) — built on react-resizable-panels
- [react-hook-form — useFieldArray](https://react-hook-form.com/docs/usefieldarray) — dynamic array field management docs
- [zod v4 release notes](https://zod.dev/v4) — v4.3.6 current stable
- [@hookform/resolvers npm](https://www.npmjs.com/package/@hookform/resolvers) — v5.2.2, Zod v4 auto-detection
- [react-dropzone releases](https://github.com/react-dropzone/react-dropzone/releases) — v15.0.0, React 19 support confirmed
- [formidable GitHub](https://github.com/node-formidable/formidable) — v3.x API for raw Node.js IncomingMessage
- [react-resizable-panels v4](https://github.com/bvaughn/react-resizable-panels) — v4 direct usage, renamed exports
- [TypeScript verbatimModuleSyntax](https://www.typescriptlang.org/tsconfig/verbatimModuleSyntax.html) — requires explicit `import type` syntax
- [chokidar awaitWriteFinish](https://github.com/paulmillr/chokidar) — file watcher debouncing for atomic writes
- [write-file-atomic](https://github.com/npm/write-file-atomic) — atomic write-then-rename pattern for Node.js
- [Prettier API](https://prettier.io/docs/api) — programmatic formatting for generated TypeScript

### Secondary (MEDIUM confidence)
- [shadcn-ui/ui#9136](https://github.com/shadcn-ui/ui/issues/9136) — confirmed API mismatch between shadcn/ui v4 Resizable and react-resizable-panels v4; workaround: use library directly
- [react-hook-form RFC v8](https://github.com/orgs/react-hook-form/discussions/7433) — v8 still in beta as of research date, confirms v7 is correct choice
- [Vite tree-shaking issue #15256](https://github.com/vitejs/vite/issues/15256) — tree-shaking edge cases with env variable guards
- [Vite HMR internals — chokidar and module graph](https://deepwiki.com/vitejs/vite/5-hot-module-replacement-(hmr)) — HMR propagation mechanics
- [Vite environment-specific imports discussion](https://github.com/vitejs/vite/discussions/4172) — dynamic imports inside DEV guards may still be bundled as orphan chunks

### Tertiary (LOW confidence)
- [TypeScript Code Generation: Templates vs AST](https://medium.com/singapore-gds/writing-a-typescript-code-generator-templates-vs-ast-ab391e5d1f5e) — conclusion (templates fine for simple data, AST for complex) confirmed by independent reasoning but single source

---
*Research completed: 2026-03-24*
*Ready for roadmap: yes*
