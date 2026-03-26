# Phase 9: Admin Shell, Preview, and Asset Pipeline - Context

**Gathered:** 2026-03-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the admin panel's usable UI shell with grouped content navigation, the split-pane layout with live preview (portfolio visible alongside), and the drag-drop asset upload pipeline for images and PDFs. The stub `AdminShell.tsx` is replaced with the full implementation. Content editor forms themselves are Phase 10.

</domain>

<decisions>
## Implementation Decisions

### Content type navigation
- Grouped vertical list in the admin panel sidebar, always visible (not collapsible)
- Three groups: **Page Sections** (Hero, Contact, Navigation), **Portfolio** (Projects, Papers), **Skills & Experience** (Skills, Tooling, Timeline, Coursework)
- Auto-selects Hero editor when admin panel first opens — no empty/dashboard state
- Group headers are uppercase labels; items are clickable list entries below each group

### Admin panel layout
- Slide-over from the left (decided in Phase 8) with `react-resizable-panels` v4
- Nav list at top, editor area below (scrollable), save bar position at Claude's discretion
- Default ~450px width, min 320px, max 60% viewport (Phase 8 decisions carry forward)
- Live portfolio IS the preview — visible to the right of the panel, updates via HMR

### Upload zone design
- Inline drop zones per file field (project thumbnail, paper PDF, portrait, resume, OG image)
- Shows image thumbnail + filename for images, file icon + filename for PDFs
- Current file visible with "Drop to replace" hint
- Drag-over feedback: dashed border turns solid accent color, text changes to "Drop to upload!", subtle scale-up (102%)
- Invalid file drag-over: solid red border + rejection message (e.g., ".exe not allowed")
- After successful upload: instant swap to new file preview, brief green checkmark animation, toast notification
- Click-to-browse fallback alongside drag-drop

### Asset file routing
- Context-based auto-routing — the editor field determines the target directory:
  - Project thumbnails → `public/projects/{kebab-name}.{ext}`
  - Paper PDFs → `public/papers/{kebab-name}.pdf`
  - Portrait photo → `public/portrait.{ext}`
  - Resume PDF → `public/resume.pdf`
  - OG image → `public/og-image.{ext}`
- All filenames normalized to lowercase-kebab-case
- Overwrite silently when replacing existing files (git tracks history)
- Upload auto-updates the data file reference — single action writes file AND updates the `.ts` data file, then HMR fires

### File validation
- Allowed images: .jpg, .jpeg, .png, .svg, .webp
- Allowed documents: .pdf
- Max file size: 10MB per file
- Rejected files show error toast with specific reason (wrong type or size exceeded)

### Keyboard shortcuts
- `Ctrl+Shift+A` — Toggle admin panel open/close (deferred from Phase 8)
- `Ctrl+S` — Save current editor (global scope when admin panel is open, prevents browser save-page dialog)
- `Escape` — Close admin panel (respects dirty state — shows exit confirmation if unsaved changes exist)
- Three shortcuts total — minimal set for a dev tool

### Claude's Discretion
- Save bar placement (sticky bottom bar vs inline with editor header)
- Exact animation curves for panel slide-in/out and upload transitions
- Internal component structure (how nav, editor, and save bar are composed)
- Upload progress indicator style (progress bar vs spinner)
- Toast positioning
- Exact group header and nav item styling

</decisions>

<specifics>
## Specific Ideas

- The grouped nav list should feel lightweight — small text, minimal chrome, like a sidebar in a dev tool (think VS Code's explorer or Linear's sidebar)
- Upload zones should feel native to the form — not like a separate "upload widget" bolted on
- The auto-update-reference behavior means uploading a file is a complete action: drop file → see it in preview immediately, no extra save step needed
- Phase 8 decided: no iframe for preview. The actual portfolio page is visible to the right. This simplifies the architecture significantly

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/admin/AdminShell.tsx` — stub to be replaced with full implementation
- `src/admin/codegen.ts` — `generateDataFile()` + `formatAndValidate()` for writing .ts data files
- `src/admin/atomic-write.ts` — `atomicWrite()` + `enqueueWrite()` with HMR suppression hooks
- `src/components/ui/button.tsx`, `dialog.tsx`, `drawer.tsx` — existing shadcn/ui components
- `src/hooks/useIsMobile.ts` — mobile detection hook

### Established Patterns
- `vite-plugin-admin-api.ts` — REST API with `CONTENT_REGISTRY` mapping all 9 content types to their file/type/export metadata
- `import.meta.env.DEV` guard for admin code tree-shaking in production
- `?admin` query param as entry point (App.tsx already handles this)
- Tailwind v4 for styling, Motion for animations
- `@` path alias resolves to `./src`

### Integration Points
- `src/App.tsx` — lazy-loads AdminShell when `?admin` present; needs Ctrl+Shift+A toggle added
- `vite-plugin-admin-api.ts` — needs new upload endpoint (POST multipart to `/__admin-api/upload/:type`)
- `public/projects/`, `public/papers/` — existing asset directories (8 SVGs, 4 PDFs currently)
- `public/portrait.jpg`, `public/resume.pdf` — root-level assets
- Sonner (toast library via shadcn/ui) needs to be installed
- `react-resizable-panels` v4 needs to be installed (shadcn wrapper has bug #9136)

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 09-admin-shell-preview-and-asset-pipeline*
*Context gathered: 2026-03-25*
