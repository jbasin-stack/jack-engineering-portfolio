# Architecture Patterns: Dev-Mode Admin Panel Integration

**Domain:** Local development content management panel for existing Vite 8 + React 19 SPA
**Researched:** 2026-03-24
**Overall confidence:** HIGH

## Executive Summary

The admin panel integrates with the existing portfolio architecture through four mechanisms: (1) a custom Vite plugin providing `configureServer` middleware for file system writes, (2) conditional routing via `import.meta.env.DEV` guards with lazy-loaded admin components that are tree-shaken from production, (3) a split-pane layout with an iframe-based live preview that leverages Vite's native HMR (file writes to `src/data/*.ts` automatically trigger hot reload through chokidar), and (4) strict code boundary enforcement via directory isolation (`src/admin/`) and `import.meta.env.DEV` entry gates.

No router library is needed. No database is needed. The admin panel writes TypeScript data files and copies assets to `public/` -- the same artifacts already consumed by production components. The entire admin surface disappears from production builds through dead-code elimination.

## Recommended Architecture

### High-Level Component Layout

```
+------------------------------------------------------+
|  Browser (dev mode only)                              |
|                                                       |
|  ?admin query param or Ctrl+Shift+A toggles mode      |
|                                                       |
|  +--------------------------------------------------+ |
|  | Admin Shell (split-pane layout)                   | |
|  |                                                   | |
|  | +-------------------+ +------------------------+ | |
|  | | Editor Panel      | | Preview Panel (iframe) | | |
|  | |                   | |                        | | |
|  | | Sidebar nav +     | | <iframe src="/">       | | |
|  | | form fields for   | | (portfolio rendered    | | |
|  | | active content    | |  at full fidelity)     | | |
|  | | type              | |                        | | |
|  | |                   | | Auto-refreshes via     | | |
|  | | [Save] writes     | | Vite HMR after file    | | |
|  | | to /__admin-api/* | | write completes        | | |
|  | +-------------------+ +------------------------+ | |
|  +--------------------------------------------------+ |
+------------------------------------------------------+

+------------------------------------------------------+
|  Vite Dev Server (Node.js)                            |
|                                                       |
|  vite-plugin-admin-api                                |
|  - POST /__admin-api/content/:type  -> write TS file  |
|  - POST /__admin-api/asset/upload   -> write to public/|
|  - GET  /__admin-api/content/:type  -> read TS file   |
|  - GET  /__admin-api/asset/list     -> list public/*  |
|                                                       |
|  Chokidar watcher (built-in):                         |
|  - Detects src/data/*.ts changes                      |
|  - Triggers HMR automatically                         |
|  - iframe receives hot update                         |
+------------------------------------------------------+
```

### Component Boundaries

| Component | Responsibility | Communicates With | New/Modified |
|-----------|---------------|-------------------|--------------|
| `vite-plugin-admin-api` | Vite plugin: REST endpoints for reading/writing data files and uploading assets | Vite dev server (configureServer hook), filesystem | **NEW** |
| `src/admin/AdminShell.tsx` | Top-level admin layout: sidebar nav + split-pane editor/preview | Editor components, iframe preview | **NEW** |
| `src/admin/editors/*.tsx` | Per-content-type form editors (9 total) | admin-api via fetch, type definitions | **NEW** |
| `src/admin/components/*.tsx` | Shared admin UI: form fields, asset uploader, JSON preview | Editors | **NEW** |
| `src/App.tsx` | Add conditional admin entry point (~15 lines) | AdminShell (lazy import) | **MODIFIED** (minimal) |
| `vite.config.ts` | Add adminApiPlugin() to plugins array | vite-plugin-admin-api | **MODIFIED** (1 line) |
| `src/main.tsx` | No changes needed | App | **UNCHANGED** |
| `src/data/*.ts` | Content data files (written to by admin API at runtime) | Components (read), admin-api (write) | **UNCHANGED** (modified by tool at runtime) |
| `src/types/data.ts` | TypeScript interfaces for all content types | Editors, components, admin-api | **UNCHANGED** (shared contract) |
| `public/` | Static assets (written to by admin upload API at runtime) | Components (read), admin-api (write) | **UNCHANGED** (modified by tool at runtime) |

### Data Flow

```
1. User edits content in admin form
2. Form state managed locally in editor component (useState)
3. [Save] button triggers POST to /__admin-api/content/:type
4. Vite plugin middleware receives request, generates TypeScript source
5. Plugin writes to src/data/:type.ts via fs.promises.writeFile
6. Chokidar detects file change (automatic -- src/ is watched by default)
7. Vite HMR pipeline processes the change, finds importing modules
8. iframe (loading the portfolio at /) receives hot module update
9. Portfolio re-renders with new data (no full page reload for most changes)
```

For asset uploads:
```
1. User drags file onto upload zone in editor
2. FormData POST to /__admin-api/asset/upload with target directory
3. Plugin writes file to public/:directory/:filename
4. Plugin returns the public URL path (e.g., /projects/new-image.png)
5. User references this path in the content form
6. Saving content triggers data file write -> HMR cycle above
7. For immediate asset visibility: plugin sends server.ws.send({ type: 'full-reload' })
```

## Architecture Decision 1: Routing Strategy

### Decision: `import.meta.env.DEV` guard with query parameter toggle -- no router needed

**Why not a separate entry point / separate HTML file:**
The portfolio is a single-page app with one `index.html`. Adding a second HTML entry would require Vite multi-page configuration (`build.rolldownOptions.input`), complicate the dev server, and create two separate React trees that cannot share types easily. Overkill for a dev tool.

**Why not react-router:**
The portfolio has zero routing today -- it is a scroll-based SPA with hash anchors. Adding react-router just for the admin panel introduces a dependency, complicates deployment (Vercel SPA rewrite rules), and changes the production architecture for a dev-only feature.

**Why not a Vite plugin that serves separate admin HTML:**
This would be a "Vite-served but React-separate" approach. While technically clean for code isolation, it prevents sharing React context, component libraries (shadcn/ui), Tailwind configuration, and TypeScript types without complex build gymnastics. The admin panel needs the same shadcn/ui components and Tailwind v4 setup.

**Chosen approach:** A single conditional branch in `App.tsx` that checks for `import.meta.env.DEV` and a URL query parameter (`?admin`) or keyboard shortcut. The admin module tree is lazily imported so it creates a separate chunk that Vite's dead-code elimination removes entirely in production.

```tsx
// src/App.tsx (modified -- showing only additions)
import { lazy, Suspense, useState, useEffect } from 'react';

// Static replacement: in production, import.meta.env.DEV becomes false,
// so the lazy() call is dead code and tree-shaken by Rolldown.
const AdminShell = import.meta.env.DEV
  ? lazy(() => import('./admin/AdminShell'))
  : null;

function App() {
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    // Activate via ?admin query param
    if (new URLSearchParams(window.location.search).has('admin')) {
      setShowAdmin(true);
    }
    // Toggle via Ctrl+Shift+A keyboard shortcut
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setShowAdmin(prev => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // When admin is active, replace entire page with admin shell
  if (showAdmin && AdminShell) {
    return (
      <Suspense fallback={<div className="p-8 text-lg">Loading admin...</div>}>
        <AdminShell onExit={() => setShowAdmin(false)} />
      </Suspense>
    );
  }

  // Existing portfolio (completely unchanged)
  return (
    <MotionConfig reducedMotion="user">
      {/* ... existing JSX ... */}
    </MotionConfig>
  );
}
```

**Confidence:** HIGH -- `import.meta.env.DEV` static replacement is documented by Vite as enabling tree-shaking. The ternary assigning `AdminShell` to `null` in production means the `lazy()` import is never created, so the chunk is never generated.

## Architecture Decision 2: File System Write Mechanism

### Decision: Custom Vite plugin with `configureServer` middleware

The admin panel needs to write to the local filesystem from the browser. The browser cannot write files directly. The solution is a Vite plugin that adds REST API endpoints to the dev server.

**Why a Vite plugin (not a standalone Express server):**
- Runs on the same port -- no CORS, no separate process to manage
- Only exists during `vite dev` -- automatically absent in production
- Has access to the Vite server instance for HMR signaling if needed
- The `configureServer` hook is the official Vite mechanism for this pattern

**Plugin shape:**

```typescript
// vite-plugin-admin-api.ts
import fs from 'fs/promises';
import path from 'path';
import type { Plugin } from 'vite';

// Maps content type names to file metadata for generation
const CONTENT_REGISTRY = {
  hero:       { file: 'hero.ts',       type: 'HeroData',          export: 'heroData',      isArray: false },
  projects:   { file: 'projects.ts',   type: 'Project',           export: 'projects',      isArray: true },
  papers:     { file: 'papers.ts',     type: 'Paper',             export: 'papers',        isArray: true },
  skills:     { file: 'skills.ts',     type: 'SkillGroup',        export: 'skillGroups',   isArray: true },
  tooling:    { file: 'tooling.ts',    type: 'ToolingGroup',      export: 'toolingGroups', isArray: true },
  timeline:   { file: 'timeline.ts',   type: 'TimelineMilestone', export: 'milestones',    isArray: true },
  contact:    { file: 'contact.ts',    type: 'ContactData',       export: 'contactData',   isArray: false },
  navigation: { file: 'navigation.ts', type: 'NavItem',           export: 'navItems',      isArray: true },
  coursework: { file: 'coursework.ts', type: 'Course',            export: 'courses',       isArray: true },
} as const;

export function adminApiPlugin(): Plugin {
  return {
    name: 'admin-api',
    apply: 'serve', // Only runs during vite dev, never during build

    configureServer(server) {
      // Return function so middleware runs AFTER Vite's internal middleware
      return () => {
        server.middlewares.use(async (req, res, next) => {
          if (!req.url?.startsWith('/__admin-api/')) return next();

          // Parse URL: /__admin-api/content/:type or /__admin-api/asset/upload
          // For GET: read and parse the TypeScript data file, return JSON
          // For POST content: receive JSON, generate TS source, write file
          // For POST asset: receive multipart form data, write to public/
          // After asset upload: server.ws.send({ type: 'full-reload' })
        });
      };
    },
  };
}
```

**Why `apply: 'serve'`:**
This is the Vite-native way to ensure a plugin only runs during development. The plugin is completely absent during `vite build`. No dead-code elimination needed -- the plugin literally does not execute.

**Why `/__admin-api/` prefix:**
The double-underscore prefix follows Vite's own convention (e.g., `/__vite_ping`). It avoids collisions with public assets and makes it obvious these are internal dev endpoints.

**Confidence:** HIGH -- `configureServer` is the documented Vite Plugin API for adding custom middleware. The `apply: 'serve'` option is documented. The connect middleware pattern used by Vite is standard Node.js.

### TypeScript File Generation Strategy

Each data file follows a predictable pattern:
```typescript
import type { TypeName } from '../types/data';

export const exportName: TypeName[] = [ /* JSON-serializable value */ ];
```

The admin API receives JSON from the form, validates it, and generates the file using template-based generation:

```typescript
function generateDataFile(
  typeName: string,
  exportName: string,
  data: unknown,
  isArray: boolean
): string {
  const typeAnnotation = isArray ? `${typeName}[]` : typeName;
  const serialized = JSON.stringify(data, null, 2);
  return [
    `import type { ${typeName} } from '../types/data';`,
    '',
    `export const ${exportName}: ${typeAnnotation} = ${serialized};`,
    '',
  ].join('\n');
}
```

**Why not AST manipulation (ts-morph, recast):**
The data files are simple (single typed export, no logic, no computed values). Template-based generation is predictable, has zero dependencies, and produces files identical to the existing hand-written format. AST manipulation tools like ts-morph add 10+ MB of dependencies for no benefit here.

**Why not write JSON and import it:**
The existing codebase uses `.ts` data files with typed exports. Changing to `.json` would require modifying every component's import, lose TypeScript type annotations on the exports, and change the established project pattern.

### Reading Data Files (GET Endpoint)

For the GET endpoint, the plugin reads the TypeScript source file and extracts the JSON data. Two approaches:

1. **Simple regex extraction:** Match the export assignment, extract the value between `= ` and `;`, parse as JSON. Works because the data is JSON-compatible (no template literals, no function calls).

2. **Dynamic import via Vite's module system:** Use `server.ssrLoadModule()` to load the data file through Vite's transform pipeline, getting the actual exported value. This is more robust but slightly more complex.

**Recommendation:** Use `ssrLoadModule` for reads -- it handles the TypeScript transform automatically and returns the live exported value. This guarantees the admin panel always shows exactly what the components see.

```typescript
// Inside configureServer middleware for GET requests:
const mod = await server.ssrLoadModule(`/src/data/${entry.file}`);
const data = mod[entry.export];
res.setHeader('Content-Type', 'application/json');
res.end(JSON.stringify(data));
```

## Architecture Decision 3: Live Preview Mechanism

### Decision: Iframe pointing to `localhost:PORT/` with Vite's native HMR

**Why iframe (not re-rendering in the same React tree):**
- The portfolio uses Lenis smooth scroll, Motion layout animations, and section-specific scroll observers. Rendering it inline within the admin panel would conflict with the admin's own scroll context.
- An iframe provides complete isolation -- the portfolio renders exactly as it would in production, with its own scroll container, animations, and event handlers.
- Changes are reflected through Vite's HMR, which already works in the iframe because it loads the same Vite dev server.

**Why not a separate Vite dev server instance:**
The iframe loads `http://localhost:5173/` (the same dev server). No second server is needed. The admin panel and the portfolio are served from the same origin, so there are no CORS issues with the iframe.

**How the HMR refresh cycle works:**

```
1. Admin form [Save] -> POST /__admin-api/content/projects
2. Plugin writes src/data/projects.ts via fs.promises.writeFile
3. Chokidar (Vite built-in) detects file change in src/
4. Vite HMR processes: finds modules importing projects.ts
5. Module graph propagation: ProjectsSection.tsx accepts update
6. iframe's Vite HMR client receives the update via WebSocket
7. React components re-render with new project data
8. No full page reload -- just the changed section updates
```

This is zero-configuration. Vite already watches all files under `src/`. Writing a `.ts` file in `src/data/` is indistinguishable from a developer editing it in VS Code. The HMR pipeline handles it automatically.

**For asset changes** (images, PDFs uploaded to `public/`):
Files in `public/` are not part of the module graph, so changing them does not trigger HMR. After asset upload, the admin API sends a full-reload signal:
```typescript
server.ws.send({ type: 'full-reload' });
```
Full reload is acceptable because asset uploads are infrequent (user uploads a file, then continues editing the content form).

**Split-pane implementation:**
Use `react-resizable-panels` v4 directly (not through shadcn/ui's Resizable wrapper). The v4 library renamed its exports (`PanelGroup` -> `Group`, `PanelResizeHandle` -> `Separator`), and shadcn/ui v4's Resizable component has a known API mismatch with these new names (tracked in shadcn-ui/ui#9136). Using the library directly requires only three components and avoids the wrapper bug.

```tsx
// src/admin/AdminShell.tsx (conceptual)
import { Group, Panel, Separator } from 'react-resizable-panels';

export default function AdminShell({ onExit }: { onExit: () => void }) {
  return (
    <div className="h-screen flex flex-col">
      <AdminHeader onExit={onExit} />
      <Group direction="horizontal" className="flex-1">
        <Panel defaultSize={40} minSize={25}>
          <AdminSidebar />
          <EditorArea />
        </Panel>
        <Separator className="w-1.5 bg-zinc-800 hover:bg-purple-500 transition-colors" />
        <Panel defaultSize={60} minSize={30}>
          <AdminPreview />
        </Panel>
      </Group>
    </div>
  );
}
```

**Confidence:** HIGH -- Vite's chokidar-based file watching of `src/` is core documented behavior. The HMR propagation from data files through importing components is standard Vite module graph behavior.

## Architecture Decision 4: Admin/Production Code Boundary

### Decision: Directory isolation + `import.meta.env.DEV` entry gate + `apply: 'serve'` plugin

**Four layers of protection ensure zero admin code in production:**

1. **Directory isolation:** All admin UI code lives under `src/admin/`. No production component imports from `src/admin/`. The import graph is one-directional: admin imports from `src/types/` and `src/components/ui/` (shared), but production code never imports from `src/admin/`.

2. **Lazy import behind `import.meta.env.DEV` guard:** The only reference to `src/admin/` from production code is in `App.tsx`, behind a compile-time constant:
   ```tsx
   const AdminShell = import.meta.env.DEV
     ? lazy(() => import('./admin/AdminShell'))
     : null;
   ```
   In production, `import.meta.env.DEV` is statically replaced with `false`, the ternary resolves to `null`, and the `lazy(() => import(...))` is dead code that Rolldown eliminates.

3. **Vite plugin with `apply: 'serve'`:** The admin API plugin only runs during `vite dev`. During `vite build`, the plugin is not applied at all.

4. **Dev-only dependency:** `react-resizable-panels` goes in `devDependencies` in package.json. The production build will not include it because the only code path that imports it (`src/admin/`) is dead-code-eliminated.

**Verification strategy:**
```bash
vite build
# After build, verify no admin code leaked:
grep -r "admin" dist/   # should return zero matches
grep -r "AdminShell" dist/   # should return zero matches
```

**Confidence:** HIGH -- This is the documented pattern for dev-only code in Vite applications. The `import.meta.env.DEV` dead-code elimination is explicitly called out in Vite's documentation.

## Admin Directory Structure

```
src/admin/
  AdminShell.tsx           # Main layout: header + split pane (editor | preview)
  AdminHeader.tsx          # Top bar: content type tabs, exit button
  AdminSidebar.tsx         # Left sidebar: navigation between 9 content types
  AdminPreview.tsx         # Iframe wrapper pointing to localhost, reload button
  api.ts                   # Fetch helpers for /__admin-api/* endpoints
  editors/
    HeroEditor.tsx         # Form for hero data (name, subtitle, narrative, social links)
    ProjectsEditor.tsx     # Form for projects array (add/remove/reorder)
    PapersEditor.tsx       # Form for papers array with PDF upload
    SkillsEditor.tsx       # Form for skill groups (domain + skills list)
    ToolingEditor.tsx      # Form for tooling groups (category + items list)
    TimelineEditor.tsx     # Form for timeline milestones (date + title + desc)
    ContactEditor.tsx      # Form for contact data (tagline, email, resume, social)
    NavigationEditor.tsx   # Form for nav items (label, href, nested children)
    CourseworkEditor.tsx   # Form for courses (code, name, descriptor)
  components/
    AssetUploader.tsx      # Drag-drop file upload zone (images, PDFs)
    ArrayFieldEditor.tsx   # Generic add/remove/reorder for array content types
    FormField.tsx          # Labeled input with validation feedback
    NestedObjectField.tsx  # Editable sub-objects (e.g., social links within hero)
    JsonPreview.tsx        # Raw JSON view toggle for debugging
```

### Editor Pattern

Each editor follows the same pattern to keep implementation consistent:

```tsx
// Pattern: each editor loads data on mount, manages form state locally,
// saves via POST, and relies on HMR for preview updates.
export function ProjectsEditor() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContent<Project[]>('projects').then(setProjects);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await saveContent('projects', projects);
    setSaving(false);
    // No manual refresh needed -- writing src/data/projects.ts triggers HMR
    // and the iframe preview updates automatically
  };

  return (
    <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
      {/* ArrayFieldEditor for add/remove/reorder */}
      {/* Per-item fields: id, title, brief, summary, thumbnail, etc. */}
      <button type="submit" disabled={saving}>
        {saving ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
```

### Admin API Client

```typescript
// src/admin/api.ts
const API_BASE = '/__admin-api';

export async function fetchContent<T>(type: string): Promise<T> {
  const res = await fetch(`${API_BASE}/content/${type}`);
  if (!res.ok) throw new Error(`Failed to fetch ${type}: ${res.statusText}`);
  return res.json();
}

export async function saveContent(type: string, data: unknown): Promise<void> {
  const res = await fetch(`${API_BASE}/content/${type}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to save ${type}: ${res.statusText}`);
}

export async function uploadAsset(file: File, directory: string): Promise<string> {
  const form = new FormData();
  form.append('file', file);
  form.append('directory', directory);
  const res = await fetch(`${API_BASE}/asset/upload`, {
    method: 'POST',
    body: form,
  });
  if (!res.ok) throw new Error('Upload failed');
  const { path } = await res.json();
  return path; // e.g., "/projects/my-image.png"
}
```

## Patterns to Follow

### Pattern 1: Type-Safe Admin-to-Data Contract

**What:** The admin editors and the portfolio components share `src/types/data.ts` as the single source of truth for content shape. The admin API validates incoming JSON against these structures before writing.

**When:** Always. Every content type flows through the same typed interface.

**Why:** Prevents the admin panel from writing malformed data that would crash the portfolio.

### Pattern 2: Optimistic UI with HMR Confirmation

**What:** The admin editor updates its local state immediately on save (optimistic), then the iframe's HMR-driven re-render serves as visual confirmation that the write succeeded.

**When:** Every save operation.

**Why:** Provides instant feedback in the editor while the file write + HMR cycle completes (typically under 500ms).

### Pattern 3: Idempotent Full-File Writes

**What:** Every save writes the complete file content, not a diff. The admin API reads the current file, the editor loads and modifies the full data, and save replaces the entire file.

**When:** Every save operation.

**Why:** Prevents partial writes, merge conflicts, and corruption. The data files are small (largest is projects.ts at ~65 lines). Full-file writes are atomic from the user's perspective.

### Pattern 4: Asset Path Convention Enforcement

**What:** Assets are organized by type: `public/projects/*.{svg,png,jpg}`, `public/papers/*.pdf`, `public/portrait.jpg`, `public/resume.pdf`. The admin uploader enforces this convention by accepting a target directory.

**When:** Every asset upload.

**Why:** Matches the existing project structure. Existing data files already reference these paths.

## Anti-Patterns to Avoid

### Anti-Pattern 1: Shared State Between Admin and Portfolio

**What:** Trying to use React context or global state to pass edited content from admin to the portfolio preview.

**Why bad:** The portfolio renders in an iframe with its own React tree. Shared state would require a postMessage bridge, adding complexity and breaking the "file write + HMR" simplicity. It also couples admin and portfolio code.

**Instead:** Write to disk, let HMR do its job. The iframe re-renders from the same data files the production build uses. What you preview is exactly what you ship.

### Anti-Pattern 2: AST-Based TypeScript Manipulation

**What:** Using ts-morph, recast, or the TypeScript compiler API to parse and modify the data files.

**Why bad:** Massive dependencies (ts-morph alone is 10+ MB). The data files are simple typed exports with no logic. AST manipulation is slow, complex, and fragile for this use case.

**Instead:** Template-based generation. Read JSON, format as TypeScript, write file.

### Anti-Pattern 3: Bidirectional File Sync

**What:** Setting up a file watcher in the admin panel to detect external file changes (e.g., user edits in VS Code) and sync the editor state.

**Why bad:** Creates bidirectional sync complexity with potential conflict resolution needs. This is a single-user dev tool.

**Instead:** The admin panel loads data on mount and saves on button press. If the user edits files externally, they refresh the admin page.

### Anti-Pattern 4: Putting Admin Components in `src/components/`

**What:** Mixing admin-only components into the existing component directories.

**Why bad:** Blurs the boundary between production and admin code. Makes it harder to verify the production bundle excludes admin code.

**Instead:** All admin code in `src/admin/`. One directory to audit, one directory that is guaranteed unreachable from production imports.

### Anti-Pattern 5: Using react-router for Admin Navigation

**What:** Adding react-router to navigate between admin editor tabs.

**Why bad:** The portfolio has zero routing. Adding a router dependency for dev-only tab navigation is overkill. It changes the production architecture (Vercel rewrite rules, etc.) for a dev tool.

**Instead:** Simple `useState` to track which editor tab is active. The "routing" within the admin panel is just conditional rendering based on a `currentEditor` state variable.

## Integration Points Summary

| Integration Point | What Changes | Risk | Notes |
|-------------------|-------------|------|-------|
| `vite.config.ts` | Add `adminApiPlugin()` to plugins array | LOW | Plugin uses `apply: 'serve'`, zero production impact |
| `src/App.tsx` | Add ~20 lines: lazy import + DEV guard + keyboard shortcut | LOW | Guarded by `import.meta.env.DEV`, tree-shaken in production |
| `src/types/data.ts` | No changes | NONE | Already the shared contract between editors and components |
| `src/data/*.ts` | Written to at runtime by admin API | LOW | Same format, same exports, different values |
| `public/*` | Written to at runtime by asset uploader | LOW | New files added, existing structure maintained |
| `package.json` | Add `react-resizable-panels` to devDependencies | LOW | Dev-only dependency for split pane |

## New Components (Suggested Build Order)

Build order accounts for dependencies -- each step can be tested before proceeding.

| Order | Component | Depends On | How to Test |
|-------|-----------|------------|-------------|
| 1 | `vite-plugin-admin-api` (content read/write endpoints) | filesystem, content registry map | `curl` or browser fetch against running dev server |
| 2 | `src/admin/api.ts` (fetch helpers) | admin-api plugin running | Browser console fetch calls |
| 3 | `App.tsx` modification (DEV guard + lazy import) | None (just the guard, AdminShell can be a stub) | Navigate to `?admin`, verify stub renders |
| 4 | `src/admin/AdminShell.tsx` + split pane layout | react-resizable-panels | Renders with placeholder editor + iframe preview |
| 5 | `src/admin/AdminPreview.tsx` (iframe wrapper) | AdminShell for layout context | iframe loads portfolio, verify HMR works after manual data file edit |
| 6 | `src/admin/editors/HeroEditor.tsx` (simplest: single object, few fields) | api.ts, types/data.ts | Edit hero name, save, see preview update |
| 7 | `src/admin/components/ArrayFieldEditor.tsx` (generic array CRUD) | None (generic component) | Render with mock data, add/remove/reorder items |
| 8 | `src/admin/components/AssetUploader.tsx` (drag-drop upload) | admin-api asset endpoint | Upload image, verify appears in public/ |
| 9 | Remaining editors: projects, papers, skills, tooling, timeline, contact, navigation, coursework | ArrayFieldEditor, AssetUploader, api.ts | Each independently testable via save + preview |
| 10 | Production build verification | Everything above | `vite build`, grep dist/ for "admin" (expect zero) |

## Scalability Considerations

| Concern | Current Scope (dev tool) | If Needed Later |
|---------|------------------------|-----------------|
| Multiple users | Single developer on local machine | Not applicable for personal portfolio |
| Large data files | 9 files, largest ~65 lines | If data grows, split into multiple files per type |
| Asset count | ~20 files in public/ | Add manifest file and thumbnail generation |
| Content validation | Runtime type checks in API | Add Zod schemas derived from TypeScript interfaces |
| Undo/redo | Not implemented | Git history serves as undo (files are committed) |

## Sources

- [Vite Plugin API -- configureServer hook](https://vite.dev/guide/api-plugin) -- HIGH confidence
- [Vite Env and Mode -- import.meta.env.DEV tree-shaking](https://vite.dev/guide/env-and-mode) -- HIGH confidence
- [Vite HMR API -- Client-side hot module replacement](https://vite.dev/guide/api-hmr) -- HIGH confidence
- [Vite Troubleshooting -- File watching behavior](https://vite.dev/guide/troubleshooting) -- HIGH confidence
- [Vite HMR internals -- chokidar and module graph](https://deepwiki.com/vitejs/vite/5-hot-module-replacement-(hmr)) -- MEDIUM confidence
- [react-resizable-panels v4](https://github.com/bvaughn/react-resizable-panels) -- HIGH confidence
- [shadcn/ui Resizable v4 API mismatch](https://github.com/shadcn-ui/ui/issues/9136) -- MEDIUM confidence (known bug as of Dec 2025)
