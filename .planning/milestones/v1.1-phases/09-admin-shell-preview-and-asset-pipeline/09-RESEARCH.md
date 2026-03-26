# Phase 9: Admin Shell, Preview, and Asset Pipeline - Research

**Researched:** 2026-03-25
**Domain:** React split-pane UI, drag-drop file upload, Vite middleware multipart handling
**Confidence:** HIGH

## Summary

Phase 9 replaces the `AdminShell.tsx` stub with a full admin panel featuring three core systems: (1) a grouped content-type navigation sidebar, (2) the split-pane layout using `react-resizable-panels` v4 where the live portfolio serves as the preview, and (3) a drag-drop asset upload pipeline with server-side file writing and automatic data reference updates.

The architecture is significantly simplified by the Phase 8 decision that there is NO iframe for preview -- the actual portfolio page is visible to the right of the admin panel. This means "live preview" is simply Vite HMR doing what it already does. The upload pipeline is the most technically complex part: it requires a new multipart endpoint in the Vite plugin, file validation, atomic file writes to `public/`, automatic data file reference updates via codegen, and rich drag-drop UX with feedback states.

**Primary recommendation:** Use `react-resizable-panels` v4 directly (not shadcn wrapper), `busboy` for multipart parsing in the Vite plugin, `sonner` for toast notifications, and native HTML5 drag-drop events for the upload zone. Keep the upload endpoint as a new route in the existing `vite-plugin-admin-api.ts`.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions
- Grouped vertical nav list: Page Sections (Hero, Contact, Navigation), Portfolio (Projects, Papers), Skills & Experience (Skills, Tooling, Timeline, Coursework) -- always visible, not collapsible
- Auto-selects Hero editor on open, no empty/dashboard state
- Slide-over from left with `react-resizable-panels` v4 (not shadcn wrapper due to bug #9136)
- Default ~450px, min 320px, max 60% viewport
- Live portfolio IS the preview (no iframe) -- updates via HMR
- Inline drop zones per file field, context-based auto-routing to target directories
- Shows image thumbnail + filename for images, file icon + filename for PDFs
- Drag-over feedback: dashed-to-solid accent border, "Drop to upload!" text, 102% scale
- Invalid drag-over: solid red border + rejection message
- After upload: instant swap, green checkmark animation, toast notification
- Click-to-browse fallback
- Context-based file routing (project thumbnails, paper PDFs, portrait, resume, OG image)
- All filenames normalized to lowercase-kebab-case
- Overwrite silently, upload auto-updates data file reference
- Allowed images: .jpg, .jpeg, .png, .svg, .webp; Allowed documents: .pdf
- Max file size: 10MB
- Keyboard shortcuts: Ctrl+Shift+A (toggle), Ctrl+S (save), Escape (close with dirty check)
- Sonner for toast library (needs install)

### Claude's Discretion
- Save bar placement (sticky bottom bar vs inline with editor header)
- Exact animation curves for panel slide-in/out and upload transitions
- Internal component structure (how nav, editor, and save bar are composed)
- Upload progress indicator style (progress bar vs spinner)
- Toast positioning
- Exact group header and nav item styling

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PREV-01 | Admin layout shows split-pane with editor and live preview side-by-side | `react-resizable-panels` v4 `Group`/`Panel`/`Separator` API; portfolio page IS the preview (no iframe needed) |
| PREV-02 | Preview iframe updates automatically via HMR when content is saved | No iframe involved -- actual portfolio is visible; Vite HMR fires automatically after admin API writes data file via `enqueueWrite` |
| PREV-03 | User can resize editor/preview panes | `Separator` component handles drag-to-resize; `minSize`/`maxSize` constraints on Panel |
| ASSET-01 | User can drag-drop upload images to project/portrait slots | HTML5 drag-drop events + `busboy` multipart parsing + new upload endpoint in Vite plugin |
| ASSET-02 | User can drag-drop upload PDF files to papers/resume slots | Same pipeline as ASSET-01 with PDF-specific validation |
| ASSET-03 | Uploaded filenames normalized to lowercase-kebab-case | Server-side normalization in upload endpoint before writing to `public/` |
| ASSET-04 | Uploads validated for file type and size (max 10MB) | Client-side pre-validation (fast reject) + server-side validation (security) |

</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-resizable-panels | ^4.7.5 | Split-pane layout with drag-to-resize | De facto standard for React panel layouts; ARIA-compliant; used directly (not shadcn wrapper) due to bug #9136 |
| sonner | ^2.0.7 | Toast notifications | shadcn/ui's official toast solution; opinionated API with success/error/loading variants |
| busboy | ^1.6.0 | Server-side multipart/form-data parsing | Zero-dependency streaming parser; 20M weekly downloads; works with raw Node.js `IncomingMessage` |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| motion | ^12.38.0 | Panel slide-in/out and upload feedback animations | Already installed; use for slide-over animation and checkmark feedback |
| lucide-react | ^0.577.0 | Icons (upload, file, check, x) | Already installed; use for nav items, upload zone, and status indicators |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| busboy | parse-multipart-data | Simpler API but less mature; busboy is battle-tested with streaming support |
| busboy | Manual boundary parsing | Feasible for dev-only use but error-prone with edge cases; not worth the risk |
| Native drag-drop | react-dropzone | Adds unnecessary dependency; native HTML5 DnD is sufficient for per-field drop zones |

**Installation:**
```bash
npm install react-resizable-panels sonner
npm install -D busboy @types/busboy
```

Note: `busboy` is a devDependency because it only runs in the Vite dev server plugin (never in production builds).

## Architecture Patterns

### Recommended Project Structure
```
src/
├── admin/
│   ├── AdminShell.tsx           # Full admin panel (replaces stub)
│   ├── AdminNav.tsx             # Grouped content-type navigation
│   ├── AdminSaveBar.tsx         # Save/discard controls
│   ├── UploadZone.tsx           # Reusable drag-drop file upload component
│   ├── useAdminPanel.ts         # Panel state (active content type, dirty tracking)
│   ├── useKeyboardShortcuts.ts  # Ctrl+Shift+A, Ctrl+S, Escape handlers
│   ├── upload.ts                # Client-side upload API (POST multipart to Vite endpoint)
│   ├── codegen.ts               # (existing) generateDataFile + formatAndValidate
│   ├── atomic-write.ts          # (existing) atomicWrite + enqueueWrite
│   └── __tests__/               # (existing tests + new)
├── components/ui/
│   ├── sonner.tsx               # shadcn Toaster wrapper (new, from shadcn CLI)
│   └── ...                      # existing components
└── ...
```

### Pattern 1: Admin Panel as Overlay (No iframe)
**What:** The admin panel slides over from the left as a fixed-position panel. The portfolio page remains fully rendered and visible in the background/right side. There is no iframe -- HMR updates the portfolio in-place.
**When to use:** Always -- this is the decided architecture.
**Example:**
```typescript
// Source: react-resizable-panels v4 API + project CONTEXT.md
import { Group, Panel, Separator } from 'react-resizable-panels';

function AdminShell() {
  return (
    <div className="fixed inset-0 z-[70]">
      <Group orientation="horizontal">
        <Panel
          defaultSize={30}
          minSize={20}
          maxSize={60}
          className="bg-white border-r border-gray-200 shadow-lg"
        >
          <AdminNav />
          {/* Editor area rendered here based on active content type */}
          <AdminSaveBar />
        </Panel>
        <Separator className="w-1 bg-transparent hover:bg-accent cursor-col-resize" />
        <Panel>
          {/* This panel is transparent -- portfolio visible beneath */}
        </Panel>
      </Group>
    </div>
  );
}
```

**Critical implementation detail:** The right `Panel` should be transparent/pointer-events-none so the user can see and interact with the portfolio beneath. The admin panel overlay sits at z-[70] (matching existing stub). The portfolio page scrolls and renders normally behind it.

### Pattern 2: Context-Based Upload Routing
**What:** Each file field in the editor knows its upload context (e.g., "project thumbnail for lna-design"). The upload endpoint uses this context to determine the target path.
**When to use:** Every file upload.
**Example:**
```typescript
// Client-side: UploadZone sends context with the file
const formData = new FormData();
formData.append('file', droppedFile);
formData.append('context', JSON.stringify({
  contentType: 'projects',    // from CONTENT_REGISTRY
  field: 'thumbnail',         // which field in the data type
  itemId: 'lna-design',       // for array types, which item
}));

await fetch('/__admin-api/upload', { method: 'POST', body: formData });

// Server-side: route determines target path
// projects + thumbnail + lna-design => public/projects/lna-design.{ext}
// papers + pdfPath + mems-report   => public/papers/mems-report.pdf
// hero + portrait (singleton)      => public/portrait.{ext}
```

### Pattern 3: Upload-Then-Update-Reference (Single Action)
**What:** After writing the file to disk, the upload endpoint also updates the data file's reference to the new path, then lets HMR propagate the change.
**When to use:** Every successful upload.
**Example:**
```typescript
// Server-side upload handler (in vite-plugin-admin-api.ts):
// 1. Validate file type and size
// 2. Normalize filename to kebab-case
// 3. Write file to public/{context-based-path}
// 4. Read current data via ssrLoadModule
// 5. Update the relevant field with new path
// 6. Generate + format + atomicWrite the updated data file
// 7. HMR fires automatically -> portfolio updates
```

### Pattern 4: Keyboard Shortcut Hook
**What:** A custom hook that registers global keyboard shortcuts when the admin panel is open.
**When to use:** Once, in AdminShell.
**Example:**
```typescript
function useKeyboardShortcuts(
  isOpen: boolean,
  onToggle: () => void,
  onSave: () => void,
  onClose: () => void,
  isDirty: boolean,
) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ctrl+Shift+A: toggle admin panel
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        onToggle();
        return;
      }
      if (!isOpen) return;
      // Ctrl+S: save (prevent browser save dialog)
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        onSave();
        return;
      }
      // Escape: close (with dirty check)
      if (e.key === 'Escape') {
        if (isDirty) {
          // Show confirmation dialog
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onToggle, onSave, onClose, isDirty]);
}
```

### Anti-Patterns to Avoid
- **Using an iframe for preview:** The portfolio IS the preview. An iframe would duplicate rendering, break HMR, and waste resources.
- **Parsing multipart on the client:** File validation happens client-side, but the actual multipart body is sent to the server for parsing. Don't try to read file contents in the browser just to re-encode them.
- **Global state for admin panel:** Keep admin panel state local to AdminShell and children. The portfolio components should know nothing about the admin panel.
- **Re-implementing drag-drop from scratch:** Use native HTML5 drag-drop events directly. The pattern is well-established and does not need a library.
- **Shadcn Resizable wrapper:** Bug #9136 means the shadcn wrapper does not work with react-resizable-panels v4. Use the library directly.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Split-pane resizing | Custom mouse-tracking resize logic | `react-resizable-panels` v4 | Handles edge cases: min/max constraints, keyboard nav, ARIA, touch support |
| Multipart parsing | Manual boundary string parsing | `busboy` | Streaming parser handles encoding, large files, malformed input |
| Toast notifications | Custom notification system | `sonner` | Handles stacking, positioning, auto-dismiss, animations, accessibility |
| Filename kebab-case | Custom regex replace | Simple utility function | This one IS fine to hand-roll -- it's just `toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')` |

**Key insight:** The split-pane and multipart parsing are deceptively complex. React-resizable-panels handles dozens of edge cases (touch, keyboard, RTL, min/max interaction). Busboy handles streaming, encoding, malformed boundaries, and memory limits. Both are worth the dependency.

## Common Pitfalls

### Pitfall 1: react-resizable-panels v4 API Name Changes
**What goes wrong:** Using v3 API names (`PanelGroup`, `PanelResizeHandle`, `direction`) which don't exist in v4.
**Why it happens:** Most tutorials and examples (including shadcn docs) reference v3.
**How to avoid:** Import `Group`, `Panel`, `Separator` from `react-resizable-panels`. Use `orientation` prop instead of `direction`.
**Warning signs:** TypeScript errors about missing exports; runtime "X is not a function" errors.

### Pitfall 2: Pointer Events Leaking Through Admin Panel
**What goes wrong:** Clicking in the "preview" area (right panel) triggers both admin panel interactions and portfolio interactions.
**Why it happens:** The admin overlay sits on top of the portfolio, and click events pass through transparent areas.
**How to avoid:** The right Panel should use `pointer-events-none` on its container. The admin panel (left Panel) captures all its own events normally. The portfolio beneath handles its own events naturally because the right panel is transparent.
**Warning signs:** Clicking the portfolio scrolls it AND triggers admin panel state changes.

### Pitfall 3: File Upload Race Condition with Data Update
**What goes wrong:** Upload writes file to `public/`, then updates data file. If HMR fires between these two writes, the portfolio briefly shows a broken image (new path, file not yet written) or old image (old path, file already overwritten).
**Why it happens:** Two sequential writes with HMR listening.
**How to avoid:** Write the file to `public/` FIRST, THEN update the data file. The HMR suppression in `enqueueWrite` handles the data file write. The public file write does not trigger HMR (Vite only watches `src/` by default for HMR). So the sequence is safe: write public file -> update data reference -> HMR fires -> portfolio loads new file from new path.
**Warning signs:** Flickering images after upload; 404 errors in dev console for image paths.

### Pitfall 4: Busboy Backpressure on Windows
**What goes wrong:** Large file uploads stall or time out.
**Why it happens:** On Windows, piping streams without proper backpressure handling can cause issues with file system write speed.
**How to avoid:** Use `pipeline()` or properly handle `drain` events when writing. For 10MB max files, this is unlikely to be an issue in practice, but the pattern should be correct.
**Warning signs:** Uploads hang at ~50-70% with no error.

### Pitfall 5: Ctrl+S Not Preventing Browser Save Dialog
**What goes wrong:** Pressing Ctrl+S opens the browser "Save Page As" dialog instead of saving admin content.
**Why it happens:** `preventDefault()` not called early enough, or the event listener is on the wrong element.
**How to avoid:** Attach the `keydown` listener to `window` and call `e.preventDefault()` immediately when the key combo matches. Must be in the capture phase or at least before the browser's default handler.
**Warning signs:** Browser save dialog appears alongside admin save action.

### Pitfall 6: Drop Zone Events Bubbling
**What goes wrong:** Dragging a file over a nested element inside the drop zone triggers `dragleave`, causing visual flicker.
**Why it happens:** HTML drag events fire for every child element boundary crossing.
**How to avoid:** Use a `dragCounter` ref that increments on `dragenter` and decrements on `dragleave`. Only show the drop state when counter > 0. Reset to 0 on `drop`.
**Warning signs:** Drop zone border flickers rapidly when moving mouse over it.

## Code Examples

### react-resizable-panels v4 -- Horizontal Split Pane
```typescript
// Source: react-resizable-panels v4 GitHub + npm docs
import { Group, Panel, Separator } from 'react-resizable-panels';

// Horizontal layout with constraints
<Group orientation="horizontal">
  <Panel defaultSize={30} minSize={20} maxSize={60}>
    {/* Admin editor content */}
  </Panel>
  <Separator className="w-1 hover:w-1.5 bg-border hover:bg-accent transition-colors" />
  <Panel minSize={40}>
    {/* Transparent -- portfolio visible beneath */}
  </Panel>
</Group>
```

### Sonner Toast Setup
```typescript
// Source: sonner official docs + shadcn integration
// 1. Add <Toaster /> to App.tsx (inside DEV guard)
import { Toaster } from 'sonner'; // or from shadcn wrapper

// In AdminShell or App.tsx:
<Toaster position="bottom-right" richColors />

// 2. Use toast() anywhere:
import { toast } from 'sonner';

toast.success('Content saved');
toast.error('Upload failed: file too large (max 10MB)');
toast.error('Invalid file type: .exe not allowed');
```

### Drag-Drop Upload Zone (Native HTML5)
```typescript
// Source: MDN HTML Drag and Drop API
function UploadZone({ accept, maxSize, onUpload }: UploadZoneProps) {
  const [dragState, setDragState] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const dragCounter = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!accept.includes(ext)) return `${ext} not allowed`;
    if (file.size > maxSize) return `File too large (max ${maxSize / 1024 / 1024}MB)`;
    return null;
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current++;
    // Check file type from DataTransfer items (type available during drag)
    const items = Array.from(e.dataTransfer.items);
    const hasValidType = items.some(item => /* check MIME type */);
    setDragState(hasValidType ? 'valid' : 'invalid');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) setDragState('idle');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;
    setDragState('idle');
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const error = validateFile(file);
    if (error) { toast.error(error); return; }
    onUpload(file);
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={e => e.preventDefault()}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      {/* Visual states based on dragState */}
      <input ref={inputRef} type="file" accept={accept.join(',')} hidden
        onChange={e => e.target.files?.[0] && onUpload(e.target.files[0])} />
    </div>
  );
}
```

### Busboy Multipart Parsing in Vite Plugin
```typescript
// Source: busboy npm docs + Vite plugin pattern from existing codebase
import Busboy from 'busboy';
import { writeFile, mkdir } from 'fs/promises';
import { resolve, extname } from 'path';

// In configureServer middleware:
if (url.startsWith('/__admin-api/upload') && req.method === 'POST') {
  const bb = Busboy({ headers: req.headers, limits: { fileSize: 10 * 1024 * 1024 } });
  let fileBuffer: Buffer | null = null;
  let fileName = '';
  let context: { contentType: string; field: string; itemId?: string } | null = null;

  bb.on('file', (_name, stream, info) => {
    const chunks: Buffer[] = [];
    fileName = info.filename;
    stream.on('data', (chunk: Buffer) => chunks.push(chunk));
    stream.on('end', () => { fileBuffer = Buffer.concat(chunks); });
  });

  bb.on('field', (name, value) => {
    if (name === 'context') context = JSON.parse(value);
  });

  bb.on('finish', async () => {
    // Validate, normalize filename, write to public/, update data file
  });

  req.pipe(bb);
}
```

### Kebab-Case Filename Normalization
```typescript
// Simple utility -- fine to hand-roll
function toKebabCase(filename: string): string {
  const ext = filename.substring(filename.lastIndexOf('.'));
  const name = filename.substring(0, filename.lastIndexOf('.'));
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') + ext.toLowerCase();
}

// "My Cool Project.PNG" => "my-cool-project.png"
// "FPGA_FFT Paper.pdf"  => "fpga-fft-paper.pdf"
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `PanelGroup` / `PanelResizeHandle` / `direction` | `Group` / `Separator` / `orientation` | react-resizable-panels v4 (2025) | All import names and key props changed; old code will not compile |
| shadcn Resizable wrapper | Direct react-resizable-panels import | Bug #9136 (2025) | shadcn wrapper not compatible with v4; must use library directly |
| react-hot-toast / custom toasts | sonner | shadcn/ui adoption (2024-2025) | sonner is now the standard toast for shadcn ecosystems |
| `data-panel-group-direction` CSS selector | `aria-orientation` | react-resizable-panels v4 | CSS selectors targeting panel direction must use ARIA attributes |

**Deprecated/outdated:**
- `PanelGroup`, `PanelResizeHandle` export names (use `Group`, `Separator` in v4)
- `direction` prop (use `orientation` in v4)
- shadcn/ui `Resizable` wrapper with react-resizable-panels v4 (broken, use direct imports)

## Open Questions

1. **Right panel transparency and interaction**
   - What we know: The right Panel needs to be see-through so the portfolio is visible. The admin panel overlay uses z-[70].
   - What's unclear: Whether the right Panel should be completely empty (just a transparent div) or whether it should have pointer-events-none. The user needs to scroll/interact with the portfolio normally when not dragging the separator.
   - Recommendation: Make the right Panel `pointer-events-none` with `bg-transparent`. The Separator still captures drag events. The portfolio beneath handles its own interactions. Test that scrolling works.

2. **Upload endpoint route pattern**
   - What we know: Need `POST /__admin-api/upload` with multipart body. Context (content type, field, item ID) sent as a form field.
   - What's unclear: Whether to use a single upload endpoint or per-type routes like `/__admin-api/upload/:type`.
   - Recommendation: Single endpoint `POST /__admin-api/upload` with context in the form body. Simpler routing, and the context JSON provides all needed routing info.

3. **Sonner installation method**
   - What we know: Can install via `npm install sonner` directly or via `npx shadcn@latest add sonner` which generates a themed wrapper.
   - What's unclear: Whether the shadcn CLI will work correctly with the current base-nova style + Tailwind v4 setup.
   - Recommendation: Use `npx shadcn@latest add sonner` first. If it fails, install `sonner` directly and create a minimal Toaster wrapper manually.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | vitest 4.1.0 |
| Config file | `vitest.config.ts` |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PREV-01 | Split-pane layout renders with editor and transparent preview panel | unit (component) | `npx vitest run src/admin/__tests__/AdminShell.test.tsx -t "split-pane"` | No -- Wave 0 |
| PREV-02 | Saving content triggers HMR (data file write) | integration | Manual verification -- requires running dev server | N/A (manual-only: requires live Vite HMR) |
| PREV-03 | Panes are resizable via Separator drag | unit (component) | `npx vitest run src/admin/__tests__/AdminShell.test.tsx -t "resize"` | No -- Wave 0 |
| ASSET-01 | Image upload writes file to correct public/ path | unit (server) | `npx vitest run src/admin/__tests__/upload.test.ts -t "image upload"` | No -- Wave 0 |
| ASSET-02 | PDF upload writes file to correct public/ path | unit (server) | `npx vitest run src/admin/__tests__/upload.test.ts -t "pdf upload"` | No -- Wave 0 |
| ASSET-03 | Filenames normalized to lowercase-kebab-case | unit | `npx vitest run src/admin/__tests__/upload.test.ts -t "kebab-case"` | No -- Wave 0 |
| ASSET-04 | Rejects files over 10MB and invalid types (.exe) | unit (server) | `npx vitest run src/admin/__tests__/upload.test.ts -t "validation"` | No -- Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run --reporter=verbose`
- **Per wave merge:** `npx vitest run && npx tsc -b --noEmit`
- **Phase gate:** Full suite green + manual verification of admin panel in browser

### Wave 0 Gaps
- [ ] `src/admin/__tests__/upload.test.ts` -- covers ASSET-01, ASSET-02, ASSET-03, ASSET-04 (kebab-case normalization, file validation, routing logic)
- [ ] `src/admin/__tests__/AdminShell.test.tsx` -- covers PREV-01, PREV-03 (component rendering, panel structure)
- [ ] Install `sonner` and `react-resizable-panels` before any component tests
- [ ] Install `busboy` and `@types/busboy` as devDependencies before upload tests

## Sources

### Primary (HIGH confidence)
- [react-resizable-panels GitHub](https://github.com/bvaughn/react-resizable-panels) -- v4 API (Group, Panel, Separator), orientation prop, imperative API
- [react-resizable-panels npm](https://www.npmjs.com/package/react-resizable-panels) -- v4.7.5 latest, pixel/percentage size units
- [sonner GitHub](https://github.com/emilkowalski/sonner) -- v2.0.7, toast API methods
- [sonner docs](https://sonner.emilkowal.ski/toast) -- toast(), toast.success(), toast.error(), Toaster props
- [shadcn/ui sonner](https://ui.shadcn.com/docs/components/radix/sonner) -- shadcn integration pattern
- [busboy npm](https://www.npmjs.com/package/busboy) -- v1.6.0, zero dependencies, streaming multipart parser
- [MDN HTML Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop) -- native DnD events reference
- [shadcn/ui bug #9136](https://github.com/shadcn-ui/ui/issues/9136) -- Resizable wrapper broken with react-resizable-panels v4

### Secondary (MEDIUM confidence)
- [react-resizable-panels v4 CHANGELOG](https://github.com/bvaughn/react-resizable-panels/blob/v4/CHANGELOG.md) -- breaking changes from v3 to v4
- [busboy GitHub](https://github.com/mscdex/busboy) -- stream API, limits configuration

### Tertiary (LOW confidence)
- None -- all critical claims verified through primary sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all libraries verified via npm/GitHub; versions confirmed current
- Architecture: HIGH -- patterns derived from existing codebase (Phase 8 plugin, codegen, atomic-write) and locked user decisions
- Pitfalls: HIGH -- v4 API changes verified; drag-drop counter pattern is well-documented; race condition analysis based on existing HMR suppression code

**Research date:** 2026-03-25
**Valid until:** 2026-04-25 (stable libraries, locked decisions)
