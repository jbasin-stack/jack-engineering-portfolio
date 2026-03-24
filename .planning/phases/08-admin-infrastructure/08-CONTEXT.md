# Phase 8: Admin Infrastructure - Context

**Gathered:** 2026-03-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the foundational dev-only API layer: custom Vite plugin with REST endpoints for reading/writing content data files, TypeScript code generation that produces valid `.ts` output, atomic file writes, HMR loop prevention, and the dev/production code boundary ensuring zero admin code in production builds.

</domain>

<decisions>
## Implementation Decisions

### Admin activation UX
- Two entry methods: `?admin` query parameter (bookmarkable) AND `Ctrl+Shift+A` keyboard toggle (quick switching)
- Admin panel is a **slide-over panel from the left side**, not a full-page replacement
- Panel is **resizable** via drag handle on the right edge (react-resizable-panels)
  - Default width: ~450px (28% of viewport)
  - Min width: 320px
  - Max width: 60% of viewport
- The **live portfolio is the preview** — no iframe needed. Portfolio is visible to the right of the admin panel and updates via HMR when content is saved
- Smooth slide-in/out animation (~200ms ease-out) when opening/closing
- Exiting admin returns to portfolio view at top of page, `?admin` removed from URL

### Generated file quality
- Generated `.ts` files must match existing hand-written style (single quotes, trailing commas, consistent structure)
- No marker comments — generated files are indistinguishable from hand-written
- Clean generation is fine — no need to preserve original hand-written formatting quirks
- First admin save may reformat slightly; all subsequent saves are consistent
- Validate generated TypeScript with `ts.createSourceFile()` **before** writing to disk — invalid output returns an error, never writes broken files
- Git diffs should be clean — formatting approach chosen by Claude must prioritize diff readability

### Error & save feedback
- **Toast notifications** (Sonner via shadcn/ui) for save success and failure
  - Success: green toast, auto-dismiss after 3 seconds (e.g., "Hero saved")
  - Error: red toast, stays until dismissed, shows **detailed** developer-level error info (TS parse error, line/column)
- **Manual save only** — Save button click or `Ctrl+S`, no auto-save on keystroke
- **Debounce rapid saves** — last-write-wins with ~300ms debounce window. 5 rapid clicks = 1 write
- Save button disabled with "Saving..." text while a write is in progress
- **Dirty state indicator** — save button shows a dot when there are unsaved edits
- **Exit confirmation** — prompt "You have unsaved changes. Exit anyway?" when closing admin with dirty state

### Dev server messaging
- One-line hint in terminal blending with Vite's native output style (same arrow prefix, colors)
  - `Admin:   http://localhost:5173/?admin` alongside Vite's `Local:` line
- **Errors only** logged to terminal — normal saves produce no terminal output; failed writes show `[admin-api] ERROR` with details
- No browser console message about admin availability

### Claude's Discretion
- Prettier vs custom formatter for generated file formatting (must achieve clean diffs + single quotes)
- Exact animation easing curve for slide-in/out
- Internal debounce implementation details
- Toast positioning (bottom-right suggested but flexible)
- Exact dirty state dot styling

</decisions>

<specifics>
## Specific Ideas

- Admin panel as a slide-over (not full replacement) was chosen to keep the live portfolio visible as the preview — this eliminates the iframe approach from the research and simplifies architecture
- Terminal message should look native to Vite, not like a separate plugin banner
- Error messages should be developer-grade (TS error codes, line numbers) since this is a dev tool for one user

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/ui/` — shadcn/ui components already installed; will need `input`, `textarea`, `tabs`, `badge`, etc. added via CLI
- `src/types/data.ts` — shared type definitions used by both portfolio components and admin editors
- `src/data/*.ts` — 9 data files following consistent pattern: `import type { X } from '../types/data'; export const x: X = { ... };`

### Established Patterns
- Single quotes in all TypeScript files
- `import type { ... }` syntax required by `verbatimModuleSyntax: true` in tsconfig
- Data files are pure JSON-compatible typed exports (no logic, no computed values)
- Tailwind v4 for styling, Motion for animations
- `@` path alias resolves to `./src`

### Integration Points
- `vite.config.ts` — add `adminApiPlugin()` to plugins array (1-line change)
- `src/App.tsx` — add `import.meta.env.DEV` guard with lazy import for admin entry (~20 lines)
- `src/data/*.ts` — written to at runtime by admin API; format must match existing structure
- Lenis smooth scroll must be disabled or excluded within admin panel context

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 08-admin-infrastructure*
*Context gathered: 2026-03-24*
