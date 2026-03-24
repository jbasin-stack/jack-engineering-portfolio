# Feature Research: Dev-Mode Content Admin Panel

**Domain:** Local dev-mode CMS / content admin panel for static portfolio site
**Researched:** 2026-03-24
**Confidence:** HIGH

## Context

This research covers the v1.1 milestone: a dev-mode-only admin panel for managing all portfolio content without hand-editing TypeScript data files. The v1.0 portfolio is already shipped with 9 typed data files (`src/data/*.ts`), typed interfaces (`src/types/data.ts`), and static assets in `public/` (SVGs, PDFs, portrait). The admin panel is a developer tool, not a production feature -- it must be excluded from the production build entirely.

**User:** Jack Basinski (single operator). This is a one-person admin tool, not a multi-user CMS.

**Existing data surface to manage:**
- 9 TypeScript data files: hero, skills, tooling, coursework, timeline, contact, papers, navigation, projects
- 13 TypeScript interfaces defining all content shapes
- Static assets: 8 project SVGs, 4 PDFs (papers), 1 portrait JPG, 1 resume PDF
- All content is typed, exported as `const` arrays/objects with explicit type annotations

## Feature Landscape

### Table Stakes (Users Expect These)

These features define what "admin panel" means in this context. Without them, it is just a glorified text editor and provides no value over editing `.ts` files directly.

| Feature | Why Expected | Complexity | Dependencies |
|---------|--------------|------------|--------------|
| **Form-based editors for all 9 content types** | The entire point of the admin panel. Each content type (projects, papers, skills, tooling, timeline, hero, contact, navigation, coursework) needs a dedicated form that mirrors its TypeScript interface. Without full coverage, the user still has to hand-edit some files, defeating the purpose. | HIGH | Existing TypeScript interfaces in `src/types/data.ts` define every field. Forms must match these exactly. |
| **Validation matching TypeScript types** | Forms without validation allow invalid data that breaks the rendered site. Zod schemas derived from the existing TS interfaces catch errors at edit time, not at build time. | MEDIUM | Zod + @hookform/resolvers. Schemas must mirror `src/types/data.ts` interfaces precisely. A single source of truth for types is critical. |
| **Direct file writes to `src/data/*.ts`** | The admin panel must actually persist changes. Writing valid TypeScript data files that preserve `import` statements, type annotations, and `export const` structure is the core technical challenge. | HIGH | Vite plugin with `configureServer` hook using Node.js `fs` module. Must generate syntactically correct TS that passes `tsc --noEmit`. |
| **Dynamic array field management** | Most content types are arrays (projects[], skills[], milestones[], etc.). Users need to add, remove, and reorder items within these arrays. Without this, the admin panel cannot manage lists of content. | MEDIUM | React Hook Form `useFieldArray` for each array-type content. Nested arrays (e.g., project.techStack[], project.links[]) need nested `useFieldArray` instances. |
| **Asset file upload to `public/`** | Projects reference images in `public/projects/`, papers reference PDFs in `public/papers/`, and the portrait lives at `public/portrait.jpg`. The admin panel must allow uploading new files to these paths. | MEDIUM | Vite plugin endpoint for `multipart/form-data` handling. Files written directly to `public/` subdirectories. File paths in data files must match upload destinations. |
| **Dev-mode-only routing (excluded from production build)** | The admin panel must never ship to production. It adds bundle weight, exposes file-write APIs, and has no purpose on the live site. | LOW | `import.meta.env.DEV` conditional rendering. Vite tree-shakes dead code in production builds. The `configureServer` hook is inherently dev-only (not called during `vite build`). |
| **Content type navigation/sidebar** | With 9 content types, the user needs a way to navigate between editors. A sidebar or tab navigation listing all content types is the minimum organizational structure. | LOW | Simple list/nav component. No complex routing needed -- can use tab state or a flat admin layout. |
| **Save confirmation and error feedback** | After clicking save, the user must know whether the write succeeded or failed. Silent saves with no feedback create uncertainty. Error messages must be specific (e.g., "Validation failed: project.title is required" not "Save failed"). | LOW | Toast/notification component after API response. shadcn/ui Sonner or Toast component. |

### Differentiators (Competitive Advantage)

Features that elevate this from "functional admin panel" to "genuinely pleasant content editing experience." These justify building a custom tool rather than just editing `.ts` files.

| Feature | Value Proposition | Complexity | Dependencies |
|---------|-------------------|------------|--------------|
| **Live side-by-side preview** | The flagship feature that makes the admin panel worth building. See the rendered portfolio update in real time as you edit content. This is what TinaCMS and Payload CMS offer as their headline capability. Without it, you might as well edit files and rely on Vite HMR in a separate browser tab. | HIGH | An iframe loading the portfolio app alongside the editor. Communication via Vite HMR -- when the admin panel writes a data file, Vite's HMR propagates the change to the iframe automatically. No custom `postMessage` protocol needed because Vite already handles this. |
| **Drag-and-drop file upload with preview** | Uploading files by clicking "choose file" works but feels dated. Drag-and-drop with immediate thumbnail preview (for images) or filename display (for PDFs) is the modern standard. Reduces friction for the most tedious operation: replacing placeholder assets. | MEDIUM | HTML5 Drag and Drop API or a lightweight library. Preview generation for images is native (`URL.createObjectURL`). PDF preview could show first-page thumbnail but is not essential. |
| **Image optimization on upload** | Project images uploaded as full-resolution PNGs or JPEGs should be automatically converted to WebP and resized to reasonable dimensions. This prevents the Lighthouse performance pitfall (identified in v1.0 PITFALLS.md) at the content entry point rather than requiring manual optimization. | MEDIUM | Sharp running server-side in the Vite plugin. Converts uploaded images to WebP, resizes to max 1200px width, strips EXIF data. Only applies to image uploads, not PDFs. |
| **Reorder items via drag-and-drop** | Projects, timeline milestones, skills groups, and other arrays have a meaningful display order. Drag-to-reorder is more intuitive than "move up / move down" buttons for arranging content. | MEDIUM | A lightweight DnD library (dnd-kit is the React standard). Only needed for array-type content. The reordered array writes back to the data file in the new order. |
| **Content type status indicators** | Show at a glance which content types have placeholder data vs. real content. Useful for tracking progress on replacing all placeholders before sharing the portfolio widely. | LOW | Heuristic checks: project links pointing to "#" are placeholders, portrait.jpg file size indicates placeholder vs. real photo, PDF file sizes, etc. Badge or indicator in the sidebar. |
| **Keyboard shortcuts for common actions** | Save (Ctrl+S), navigate between content types, add new item. Power-user efficiency for a developer audience. | LOW | Event listeners on the admin panel. Simple implementation with `useEffect` + `keydown` handlers. |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem useful but add disproportionate complexity or actively harm the project for this specific use case.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| **Full headless CMS (TinaCMS, Payload, Strapi)** | "Why build a custom admin panel when production CMS tools exist?" | Massive dependency overhead for a one-person portfolio. TinaCMS requires a GraphQL server. Payload needs a database. Strapi is an entire backend framework. All violate the zero-cost constraint and add hosting complexity. The portfolio has 9 small data files, not a content-heavy blog. The custom panel is 10x simpler because it only needs to read/write local TypeScript files. | Custom Vite plugin with form-based editors. The entire admin panel is a dev-only React route + a Vite middleware that writes files. Zero infrastructure. |
| **Version history / undo** | "What if I accidentally delete a project?" | The data files are in a Git repository. `git diff` and `git checkout` provide version history far more robustly than any custom undo system. Building undo/redo adds state management complexity (command pattern, history stack) that is not justified when Git already solves this. | Git is the version history system. The admin panel writes files; Git tracks changes. A "last saved" timestamp in the UI is sufficient feedback. |
| **Multi-user authentication** | "What about access control?" | This is a dev-mode tool running on `localhost`. There is exactly one user (Jack). Adding authentication adds login flows, session management, and security surface for zero benefit. The `configureServer` hook only runs in dev mode -- there is no production attack surface. | No auth needed. The tool runs locally in dev mode. If someone has access to `localhost:5173`, they already have access to the filesystem. |
| **Rich text / WYSIWYG editor** | "What about formatting project descriptions?" | The portfolio renders plain text descriptions. None of the TypeScript interfaces contain HTML or Markdown fields. Adding a rich text editor (Tiptap, Slate, ProseMirror) introduces a heavy dependency for capability the rendering layer does not support. If rich text is ever needed, it belongs in the rendering components first. | Plain text `<textarea>` for description fields. The minimalist design philosophy means descriptions are typographically styled by the components, not by inline formatting. |
| **Markdown support in descriptions** | "More flexible than plain text." | Same issue as rich text -- the existing components render `description` and `summary` fields as plain strings with no Markdown parsing. Adding Markdown support requires changes to every rendering component (install a Markdown renderer, handle sanitization). This is scope creep for v1.1. | If Markdown is desired, add it as a v2 feature that updates both the admin panel AND the rendering components simultaneously. For now, plain text matches the existing data model. |
| **Real-time collaborative editing** | "Multiple people editing at once." | Single operator tool. Adding WebSocket synchronization, conflict resolution, and operational transforms is absurd for a one-person portfolio admin. | Not applicable. One user, one machine, one browser tab. |
| **Database-backed content storage** | "What about querying and filtering?" | The entire content surface is 9 small TypeScript files totaling under 300 lines. A database adds hosting costs, migration scripts, schema management, and an ORM -- all for data that fits comfortably in memory. TypeScript files are the database; `tsc` is the schema validator. | Direct filesystem read/write of `.ts` files. The data files ARE the persistence layer. |
| **Automatic Git commits on save** | "Track every change automatically." | Noisy commit history full of incremental edits ("update project title", "fix typo", "change image"). Pollutes the Git log. The user should commit deliberately when a meaningful batch of changes is complete. | Show a "changes since last commit" indicator if desired, but leave committing to the user. |
| **Schema migration system** | "Handle TypeScript interface changes." | The admin panel reads the current interface definitions. If interfaces change, the admin panel forms are updated in code at the same time (they live in the same repo). There is no "migration" because the data files and the admin forms evolve together in the same commit. | Co-locate form definitions with TypeScript interfaces. When an interface changes, the corresponding Zod schema and form fields change in the same PR. |
| **Image cropping/editing in browser** | "Let users crop and resize uploads." | Adds a complex UI component (image cropper) for a marginal benefit. The Sharp pipeline handles resizing automatically. If precise cropping is needed, the user can crop in any image editor before uploading. | Automatic resize-to-max-width via Sharp on the server side. Manual cropping happens in external tools before upload. |

## Feature Dependencies

```
[Vite Plugin API Endpoints]
    (foundational -- all data persistence depends on this)

[Form-Based Editors]
    |-- requires --> [Vite Plugin API Endpoints] (forms need somewhere to POST data)
    |-- requires --> [Zod Validation Schemas] (forms need validation)
    |-- requires --> [TypeScript Code Generation] (saved data must produce valid .ts files)

[Zod Validation Schemas]
    |-- derived from --> [Existing TypeScript Interfaces] (src/types/data.ts)

[TypeScript Code Generation]
    |-- requires --> [Vite Plugin API Endpoints] (file write happens server-side)
    |-- must match --> [Existing Data File Format] (preserve imports, types, exports)

[Live Preview]
    |-- requires --> [Vite Plugin API Endpoints] (writes trigger HMR)
    |-- requires --> [Form-Based Editors] (need something to preview)
    |-- leverages --> [Vite HMR] (automatic -- no custom implementation needed)

[Asset File Upload]
    |-- requires --> [Vite Plugin API Endpoints] (upload endpoint)
    |-- enhances --> [Form-Based Editors] (upload links to form fields for thumbnails, PDFs)

[Image Optimization]
    |-- requires --> [Asset File Upload] (runs as post-processing on uploaded images)
    |-- uses --> [Sharp] (server-side in Vite plugin)

[Drag-Drop Reorder]
    |-- enhances --> [Form-Based Editors] (alternative to manual index management)
    |-- requires --> [Dynamic Array Fields] (items must be in an array to reorder)

[Dev-Mode Route Guard]
    |-- independent --> (wraps entire admin panel, no other dependencies)
    |-- uses --> [import.meta.env.DEV] (Vite built-in, tree-shaken in production)

[Content Type Navigation]
    |-- requires --> [Form-Based Editors] (must have editors to navigate between)
```

### Dependency Notes

- **Vite Plugin API Endpoints are foundational:** Every persistence operation (save data, upload file, read current data) routes through custom middleware registered via `configureServer`. This must be built and tested first.
- **TypeScript Code Generation is the hardest technical challenge:** The plugin must produce syntactically valid `.ts` files that preserve the existing format: `import type { X } from '../types/data';` at the top, `export const name: Type[] = [...]` structure, and proper formatting. A template-literal approach (not AST manipulation) is the right call -- the data file structure is simple and predictable.
- **Live Preview is "free" thanks to Vite HMR:** When the admin panel writes a data file via the API, Vite detects the file change and triggers HMR. An iframe loading the portfolio app on the same dev server receives the HMR update automatically. No custom `postMessage` protocol or WebSocket setup is needed. This is the single biggest architectural win.
- **Zod schemas must stay in sync with TypeScript interfaces:** The Zod schemas used for form validation should be the source of truth, with TypeScript types inferred from them via `z.infer<typeof schema>`. Alternatively, maintain parallel Zod schemas that match the existing interfaces. The former is cleaner but requires refactoring `src/types/data.ts`; the latter is safer for a v1.1 milestone that should not modify v1.0 code.
- **Image optimization depends on Sharp, which is a native Node.js module:** Sharp works fine in the Vite dev server (it runs in Node.js), but it adds a significant `node_modules` footprint (~25MB for platform-specific binaries). This is acceptable for a dev dependency.

## MVP Definition

### Launch With (v1.1 Core)

The minimum set of features that makes the admin panel genuinely useful -- worth opening instead of editing `.ts` files by hand.

- [ ] **Vite plugin with read/write API endpoints** -- POST to save data, GET to load current data, POST for file uploads. Dev-mode only via `configureServer`.
- [ ] **Form editors for all 9 content types** -- React Hook Form + Zod validation. Every field in every TypeScript interface has a corresponding form input.
- [ ] **Dynamic array management** -- Add/remove/reorder items in array content types (projects, skills, milestones, etc.) via `useFieldArray`.
- [ ] **TypeScript file generation** -- Saved form data produces valid `.ts` files that match the existing file format exactly. `tsc --noEmit` must pass after every save.
- [ ] **Asset file upload** -- Drag-and-drop upload of images and PDFs to `public/` subdirectories. Uploaded paths link to form fields (e.g., project.thumbnail).
- [ ] **Live side-by-side preview** -- iframe loading the portfolio alongside the editor. Vite HMR handles real-time updates automatically.
- [ ] **Dev-mode route guard** -- Admin panel accessible only when `import.meta.env.DEV` is true. Zero admin code in production bundle.
- [ ] **Save feedback** -- Toast notifications for success/failure on every save operation.

### Add After Core Works (v1.1 Polish)

Features to layer on once the core editing loop is solid.

- [ ] **Image optimization on upload** -- Sharp converts images to WebP, resizes to max 1200px. Trigger: when users start uploading real project photos and the performance impact becomes noticeable.
- [ ] **Drag-and-drop reorder** -- dnd-kit for reordering projects, timeline milestones, skills groups. Trigger: when the user has enough content items that order management via forms becomes tedious.
- [ ] **Content status indicators** -- Badges showing placeholder vs. real content. Trigger: useful once real content replacement is underway.
- [ ] **Keyboard shortcuts** -- Ctrl+S to save, Ctrl+N to add new item. Trigger: when the editing workflow is established and speed becomes desirable.

### Future Consideration (v2+)

Features to defer until the admin panel's core value is proven.

- [ ] **Markdown support in descriptions** -- Requires updating rendering components too. Only worthwhile if plain text descriptions prove limiting.
- [ ] **Bulk operations** -- Select multiple items to delete or move. Only relevant if content volume grows significantly.
- [ ] **Export/import as JSON** -- Useful for backup/migration but Git handles this adequately.
- [ ] **Content templates** -- Pre-filled forms for common project types (RF design, fabrication, FPGA, etc.). Only valuable once content patterns are established.

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Vite plugin API endpoints | HIGH | MEDIUM | P1 |
| Form editors (all 9 types) | HIGH | HIGH | P1 |
| Zod validation schemas | HIGH | MEDIUM | P1 |
| TypeScript file generation | HIGH | HIGH | P1 |
| Live side-by-side preview | HIGH | MEDIUM | P1 |
| Asset file upload | HIGH | MEDIUM | P1 |
| Dev-mode route guard | HIGH | LOW | P1 |
| Dynamic array management | HIGH | MEDIUM | P1 |
| Save feedback (toasts) | MEDIUM | LOW | P1 |
| Content type navigation | MEDIUM | LOW | P1 |
| Image optimization (Sharp) | MEDIUM | MEDIUM | P2 |
| Drag-drop reorder (dnd-kit) | MEDIUM | MEDIUM | P2 |
| Content status indicators | LOW | LOW | P2 |
| Keyboard shortcuts | LOW | LOW | P2 |
| Markdown descriptions | LOW | HIGH | P3 |
| Bulk operations | LOW | MEDIUM | P3 |

**Priority key:**
- P1: Must have for the admin panel to be useful. Without these, editing `.ts` files by hand is easier.
- P2: Should have. Adds polish and efficiency once core editing works.
- P3: Nice to have. Only if the admin panel becomes a long-term workflow tool.

## Content Type Complexity Analysis

Each content type has different editing complexity based on its TypeScript interface structure.

| Content Type | Interface | Array? | Nested Arrays? | File References? | Form Complexity |
|--------------|-----------|--------|----------------|------------------|-----------------|
| Hero | `HeroData` | No (singleton) | Yes (`socialLinks[]`) | No | LOW |
| Contact | `ContactData` | No (singleton) | Yes (`socialLinks[]`) | Yes (`resumePath`) | LOW |
| Navigation | `NavItem[]` | Yes | Yes (`children[]`) | No | MEDIUM |
| Skills | `SkillGroup[]` | Yes | Yes (`skills[]`) | No | MEDIUM |
| Tooling | `ToolingGroup[]` | Yes | Yes (`items[]`) | No | MEDIUM |
| Coursework | `Course[]` | Yes | No | No | LOW |
| Timeline | `TimelineMilestone[]` | Yes | No | No | LOW |
| Papers | `Paper[]` | Yes | No | Yes (`pdfPath`) | MEDIUM |
| Projects | `Project[]` | Yes | Yes (`techStack[]`, `links[]`, `images[]`) | Yes (`thumbnail`, `images[]`) | HIGH |

**Projects is the most complex editor** -- it has the deepest nesting (3 nested arrays), file references for both images and links, and the most fields per item (10 fields). Build this editor last, after patterns are established with simpler types.

**Singleton types (Hero, Contact) are the simplest** -- no array management, just a flat form. Build these first to establish the editing + save + preview loop.

## Comparable Tool Analysis

| Feature | TinaCMS (Git-backed) | Payload CMS (DB-backed) | This Admin Panel (TS file-backed) |
|---------|----------------------|-------------------------|-----------------------------------|
| Content storage | Markdown/JSON files in repo | Database (Postgres/MongoDB) | TypeScript data files in `src/data/` |
| Live preview | Side-by-side iframe, `postMessage` | Side-by-side iframe, `postMessage` | Side-by-side iframe, Vite HMR (simpler) |
| Setup complexity | GraphQL server, Tina Cloud or self-host | Full backend + DB + auth | One Vite plugin, zero infrastructure |
| Validation | Schema-defined | Collection config | Zod schemas matching TS interfaces |
| Asset handling | Repo-based media or cloud storage | Built-in media library | Direct write to `public/` + Sharp optimization |
| Production overhead | Tina Cloud API or self-hosted server | Full backend runtime | Zero -- admin code tree-shaken from build |
| Multi-user support | Yes (Git-based merging) | Yes (DB + auth) | No (single developer tool) |
| Cost | Free tier or paid cloud | Self-hosted or cloud | Zero |
| **Fit for this project** | Over-engineered | Massively over-engineered | Purpose-built, minimal |

The custom approach wins because the content surface is small (9 files, ~250 lines of data), the user is a single developer, and the zero-cost constraint eliminates hosted CMS options. The admin panel is a dev tool, not a production service.

## Sources

- [Vite Plugin API -- configureServer](https://vite.dev/guide/api-plugin) -- HIGH confidence: official Vite docs on server middleware hooks
- [Vite Environment Modes](https://vite.dev/guide/env-and-mode) -- HIGH confidence: `import.meta.env.DEV` for dev-mode guards
- [React Hook Form -- useFieldArray](https://react-hook-form.com/docs/usefieldarray) -- HIGH confidence: official docs for dynamic array field management
- [Zod + React Hook Form integration](https://www.freecodecamp.org/news/react-form-validation-zod-react-hook-form/) -- MEDIUM confidence: well-referenced tutorial, pattern verified by @hookform/resolvers docs
- [Sharp -- Node.js image processing](https://github.com/lovell/sharp) -- HIGH confidence: official repo, dominant image processing library
- [TinaCMS -- Visual Editing](https://tina.io/docs/contextual-editing/react) -- HIGH confidence: official TinaCMS docs for live preview patterns
- [Payload CMS -- Live Preview](https://payloadcms.com/docs/live-preview/overview) -- HIGH confidence: official Payload docs for iframe preview architecture
- [vite-plugin-fs](https://www.npmjs.com/package/vite-plugin-fs) -- MEDIUM confidence: npm package for browser-to-filesystem bridge in dev mode
- [TypeScript Code Generation: Templates vs AST](https://medium.com/singapore-gds/writing-a-typescript-code-generator-templates-vs-ast-ab391e5d1f5e) -- MEDIUM confidence: practical comparison of approaches

---
*Feature research for: Dev-Mode Content Admin Panel (v1.1 milestone)*
*Researched: 2026-03-24*
