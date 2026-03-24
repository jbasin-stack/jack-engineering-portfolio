# Stack Research: v1.1 Dev-Mode Admin Panel

**Domain:** Local dev-mode content admin panel with live preview, form editing, and asset uploads
**Researched:** 2026-03-24
**Confidence:** HIGH

## Context

This research covers ONLY the new libraries and patterns needed for v1.1. The existing validated stack (Vite 8, React 19, Tailwind v4, Motion, Lenis, shadcn/ui, react-pdf, Vercel, TypeScript) is not re-evaluated. The admin panel writes to `src/data/*.ts` files and `public/` assets during development, and must be completely excluded from production builds.

## Recommended Stack Additions

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Custom Vite plugin | N/A (authored in-project) | Dev-server API endpoints for file writes and uploads | Vite's `configureServer` hook gives direct access to the Connect middleware stack. A custom plugin is the canonical way to add REST endpoints to the dev server without adding a separate backend process. Zero dependencies beyond Node.js `fs` module. |
| react-hook-form | ^7.72.0 | Form state management for all 9 content editors | shadcn/ui's Form component is built on react-hook-form. The project already uses shadcn/ui, so this is the natural pairing. Supports React 19 (peer dep: `^16.8.0 \|\| ^17 \|\| ^18 \|\| ^19`). Uncontrolled-by-default architecture means re-renders are scoped to individual fields, not entire forms. |
| zod | ^4.3.6 | Schema validation for content data before writing to disk | TypeScript-first validation that generates types. Zod v4 is faster and smaller than v3. Zod schemas mirror the existing `src/types/data.ts` interfaces, providing runtime validation that catches errors before they corrupt data files. |
| @hookform/resolvers | ^5.2.2 | Connects Zod schemas to react-hook-form | The official bridge between react-hook-form and Zod. Supports both Zod v3 and v4 with auto-detection. |
| react-dropzone | ^15.0.0 | Drag-and-drop file upload zone in the browser | Headless hook-based API (`useDropzone`) with no opinionated UI -- pairs perfectly with shadcn/ui styling. 5M+ weekly downloads, React 19 peer dep support added in v14.3.6+. Handles file type filtering, size limits, and multiple file selection. |
| formidable | ^3.5.2 | Server-side multipart form parsing in Vite plugin | Parses `multipart/form-data` from upload requests inside the Vite dev middleware. Works with raw Node.js `IncomingMessage` (Connect-compatible) without Express. Formidable is battle-tested (since 2011), supports streaming, and writes to configurable upload directories. |

### shadcn/ui Components to Add

These components are already available via the `shadcn` CLI (v4.1.0 installed). They need to be added to `src/components/ui/` using `npx shadcn@latest add [component]`.

| Component | Purpose | Why Needed |
|-----------|---------|------------|
| `input` | Text fields for titles, URLs, descriptions | Basic form primitive for string content editing |
| `textarea` | Multi-line text for summaries, narratives | Project summaries and descriptions require multi-line input |
| `select` | Dropdowns for domain, icon picker | Project domain selection (RF, Analog, Digital, Fabrication) |
| `switch` | Boolean toggles for `featured` flag | Projects have a `featured: boolean` field |
| `field` | Form field wrapper with label/error | shadcn/ui v4's form field component for accessible forms |
| `tabs` | Content type selector (Projects, Papers, Skills, etc.) | Navigate between the 9 different content editors |
| `badge` | Tag display for techStack arrays | Visual display of tech stack items in array editors |
| `separator` | Visual dividers between form sections | Clean separation between form groups |
| `resizable` | Split-pane layout (editor + preview) | Built on react-resizable-panels. Provides the side-by-side editor/preview layout. |
| `scroll-area` | Scrollable preview panel | Independent scroll for the preview pane |

### No New Development Tools Required

The existing dev tooling (Vite 8, TypeScript 5.9, Vitest 4.1, ESLint) covers all testing and linting needs for the admin panel code.

## Installation

```bash
# New runtime dependencies (form handling + validation)
npm install react-hook-form@^7.72.0 zod@^4.3.6 @hookform/resolvers@^5.2.2 react-dropzone@^15.0.0

# New dev dependency (server-side multipart parsing, only used in Vite plugin)
npm install -D formidable@^3.5.2 @types/formidable@^3.4.5

# Add shadcn/ui components (no npm install needed, copies to src/components/ui/)
npx shadcn@latest add input textarea select switch field tabs badge separator resizable scroll-area
```

## Architecture Decisions

### Routing: No Router Library -- Use Hash-Based Conditional Rendering

The portfolio is a single-page scroll app with no existing router. Adding react-router or wouter for a single dev-only route is unnecessary overhead.

**Approach:** Use `window.location.hash` with `import.meta.env.DEV` gating:

```typescript
// In main.tsx or App.tsx
if (import.meta.env.DEV && window.location.hash === '#/admin') {
  // Lazy-load admin panel
  const AdminPanel = React.lazy(() => import('./admin/AdminPanel'));
  // Render admin instead of portfolio
}
```

- `import.meta.env.DEV` is statically replaced by Vite -- the entire admin code path is tree-shaken from production builds
- `React.lazy()` ensures admin panel code is code-split even in dev
- Navigate to `http://localhost:5173/#/admin` during development
- Zero additional dependencies

### Live Preview: Same-Process Re-Render via Vite HMR

**Do NOT use an iframe.** The admin panel and the portfolio preview share the same Vite dev server and React process. When the admin panel writes updated data to `src/data/*.ts`, Vite's HMR automatically detects the file change and hot-reloads the affected modules. The preview panel simply renders the same portfolio components with the current data imports.

**Approach:** Resizable split pane with editor on left, portfolio component preview on right. Both sides are React components in the same app. Data edits trigger file writes, HMR picks up the file changes, and the preview re-renders automatically.

Benefits:
- Zero custom preview infrastructure
- Real HMR speed (typically <100ms)
- Preview uses exact same components as production
- No iframe cross-origin or styling isolation issues

### File Write API: Custom Vite Plugin with Connect Middleware

The Vite plugin uses `configureServer` to add REST API endpoints:

```typescript
// vite-plugin-admin-api.ts
export function adminApiPlugin(): Plugin {
  return {
    name: 'admin-api',
    apply: 'serve', // Only active in dev mode
    configureServer(server) {
      // POST /api/admin/content/:type -- write data file
      // POST /api/admin/upload -- handle file upload
      // GET /api/admin/content/:type -- read current data
      server.middlewares.use('/api/admin', handler);
    },
  };
}
```

Key design points:
- `apply: 'serve'` ensures the plugin is completely inert during `vite build`
- Uses Node.js `fs.writeFile` to write TypeScript data files
- Uses `formidable` to parse multipart uploads and write to `public/`
- JSON request bodies for content updates (no special parser needed beyond built-in `JSON.parse` on the request stream)

### Content Serialization: TypeScript Code Generation

When writing back to `src/data/*.ts`, the admin panel must produce valid TypeScript that matches the existing file format (typed exports with `import type` statements).

**Approach:** Template-based serialization in the Vite plugin:

```typescript
function serializeDataFile(type: string, data: unknown): string {
  const typeImport = typeImports[type]; // e.g., "import type { Project } from '../types/data';"
  const exportName = exportNames[type]; // e.g., "projects"
  const typeName = typeNames[type];     // e.g., "Project[]"
  return `${typeImport}\n\nexport const ${exportName}: ${typeName} = ${JSON.stringify(data, null, 2)};\n`;
}
```

This keeps data files clean, type-safe, and consistent with the existing format.

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Custom Vite plugin for API | vite-plugin-fs | If you want a drop-in fs abstraction. Rejected because it exposes arbitrary filesystem access and the project only needs controlled writes to specific paths. |
| react-hook-form + zod | React 19 `useActionState` + manual validation | For very simple forms (1-2 fields). Rejected because the admin has 9 content types with nested arrays, and react-hook-form's `useFieldArray` handles dynamic lists (techStack, skills, images) far better. |
| react-dropzone | Native HTML5 drag-drop API | For a single file input with no UX requirements. Rejected because react-dropzone provides file type validation, preview thumbnails, and accessible keyboard support out of the box. |
| formidable | multer v2.1.1 | If using Express. Multer is Express middleware; while it works with Connect, formidable's `form.parse(req)` API is cleaner for raw Node.js IncomingMessage objects in Vite's connect middleware. |
| formidable | busboy | If you need streaming for very large files. Busboy is lower-level (event-based). For portfolio assets (images, PDFs under 20MB), formidable's simpler callback API is sufficient. |
| Hash-based routing | wouter (1.5KB) | If the project grows to need multiple dev-only routes (e.g., separate /admin/analytics page). For a single admin route, a hash check is simpler. |
| Same-process preview | iframe with separate Vite instance | If admin and portfolio need complete CSS/JS isolation. Rejected because they share the same design system and the iframe approach doubles server resources. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| react-router / react-router-dom | 18.7KB gzipped for one dev-only route. Would persist in production bundle unless carefully code-split. Massive overkill for this use case. | Hash-based conditional with `import.meta.env.DEV` |
| vite-plugin-fs | Exposes arbitrary filesystem read/write from the browser. Security risk even in dev mode. Unmaintained (last update 2023). | Custom Vite plugin with scoped, validated endpoints |
| JSON files for content storage | Would require a migration from the existing TypeScript data files. Adds a build step to convert JSON to TS. The existing TS files work perfectly with Vite's HMR. | Continue writing TypeScript data files directly |
| Full CMS (Sanity, Contentful, Strapi) | Violates the zero-cost constraint. Adds external service dependency. The content is static and lives in the repository. This is a dev-time editing tool, not a production CMS. | Local file-based editing via Vite plugin |
| express as Vite middleware | Adding Express as a dependency just for body parsing is wasteful. Vite's internal Connect server is sufficient. Express would add ~600KB to node_modules. | Node.js built-in JSON parsing + formidable for multipart |
| @tanstack/form | Newer but less mature ecosystem. shadcn/ui is designed around react-hook-form, not TanStack Form. Using TanStack Form would mean building all form UI from scratch instead of using shadcn/ui's existing Form component. | react-hook-form (shadcn/ui native integration) |

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| react-hook-form@^7.72.0 | React 19.2.x | Peer dep explicitly includes `^19`. Works with React 19's concurrent features. |
| zod@^4.3.6 | @hookform/resolvers@^5.2.2 | Resolvers v5 auto-detects Zod v3 vs v4 at runtime. Use Zod v4 for faster parsing and smaller bundle. |
| react-dropzone@^15.0.0 | React 19.2.x | React 19 JSX type imports fixed in v14.3.6. Peer dep support confirmed. |
| formidable@^3.5.2 | Node.js 18+ | Used only in Vite plugin (server-side). Compatible with Vite 8's Node.js requirements. |
| shadcn/ui v4 components | react-hook-form ^7.x, Base UI | shadcn v4 uses Base UI (not Radix) for primitives. Form component wraps react-hook-form's Controller. |
| react-resizable-panels@^4.7.5 | React 19, shadcn/ui v4 Resizable | shadcn/ui's Resizable component wraps this library. Install via `npx shadcn add resizable`. |

## Sources

- [Vite Plugin API - configureServer](https://vite.dev/guide/api-plugin) -- Official Vite docs on plugin hooks (HIGH confidence)
- [Vite Env Variables](https://vite.dev/guide/env-and-mode) -- `import.meta.env.DEV` tree-shaking behavior (HIGH confidence)
- [shadcn/ui Forms - React Hook Form](https://ui.shadcn.com/docs/forms/react-hook-form) -- Official shadcn/ui form integration docs (HIGH confidence)
- [shadcn/ui Resizable](https://ui.shadcn.com/docs/components/radix/resizable) -- Built on react-resizable-panels (HIGH confidence)
- [react-hook-form npm](https://www.npmjs.com/package/react-hook-form) -- v7.72.0, React 19 peer dep (HIGH confidence)
- [react-hook-form RFC v8](https://github.com/orgs/react-hook-form/discussions/7433) -- v8 still in beta, stick with v7 (MEDIUM confidence)
- [zod v4 release notes](https://zod.dev/v4) -- Zod 4.3.6 is current stable (HIGH confidence)
- [@hookform/resolvers npm](https://www.npmjs.com/package/@hookform/resolvers) -- v5.2.2, Zod v4 auto-detection (HIGH confidence)
- [react-dropzone releases](https://github.com/react-dropzone/react-dropzone/releases) -- v15.0.0 with React 19 support (HIGH confidence)
- [formidable GitHub](https://github.com/node-formidable/formidable) -- v3.x for raw Node.js request parsing (HIGH confidence)
- [vite-plugin-fs GitHub](https://github.com/StarLederer/vite-plugin-fs) -- Evaluated and rejected for security reasons (MEDIUM confidence)
- [react-resizable-panels npm](https://www.npmjs.com/package/react-resizable-panels) -- v4.7.5 current (HIGH confidence)

---
*Stack research for: v1.1 Dev-Mode Admin Panel*
*Researched: 2026-03-24*
