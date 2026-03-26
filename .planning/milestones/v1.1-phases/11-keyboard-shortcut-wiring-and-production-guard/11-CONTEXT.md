# Phase 11: Keyboard Shortcut Wiring & Production Guard - Context

**Gathered:** 2026-03-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Wire Ctrl+S save and Escape dirty-confirmation keyboard shortcuts to work end-to-end, and exclude all admin-related imports (including `useKeyboardShortcuts`) from production builds. Closes INT-01, INT-02, INT-03 from the v1.1 milestone audit.

</domain>

<decisions>
## Implementation Decisions

### State bridging approach
- Claude's discretion on how to bridge save function and dirty state between App.tsx and AdminShell
- Options considered: refs from App.tsx, event bus, moving shortcuts into AdminShell
- Key constraint: Ctrl+S and Escape must reach AdminShell's `handleSave` and `isDirty` state

### Ctrl+S save behavior
- Ctrl+S triggers save and shows green toast (same flow as clicking Save button)
- Silent no-op when no dirty changes — no toast, no visual feedback
- Only suppress browser "Save Page" dialog when admin panel is open; normal browser behavior when closed
- Ignore rapid double-tap — first Ctrl+S triggers save, subsequent presses ignored until save completes (matches existing 300ms debounce)
- Works everywhere in the panel regardless of focus (text inputs, buttons, etc.)
- Error handling identical to Save button — red toast with error details, inline field validation errors

### Escape close behavior
- `window.confirm()` dialog when dirty state exists ("You have unsaved changes. Close anyway?") — matches existing X button behavior
- Close immediately when no unsaved changes — no prompt
- Layered escape: close sub-dialogs (delete confirmation, etc.) first; only close panel when no sub-dialogs are open

### Production guard
- Move Ctrl+S and Escape handling into AdminShell (already dev-only gated)
- Inline Ctrl+Shift+A listener in App.tsx behind `import.meta.env.DEV` check
- Gate ALL admin logic in App.tsx behind `import.meta.env.DEV`: adminOpen state, toggleAdmin, closeAdmin, keyboard listener
- Production App.tsx is purely portfolio rendering — zero admin state, callbacks, listeners, or imports
- Result: `useKeyboardShortcuts.ts` never imported in production; `vite build` dist/ has zero references

### Claude's Discretion
- Exact state bridging mechanism (refs, context, event bus, or moving hook call location)
- Whether to refactor `useKeyboardShortcuts` or keep it as-is and change where it's called
- Internal implementation of save-in-progress guard
- How to structure the DEV gate in App.tsx (custom hook, inline block, extracted component)

</decisions>

<specifics>
## Specific Ideas

- This is the final phase of v1.1 — closing audit gaps, not adding new features
- The three bugs are well-documented in `.planning/v1.1-MILESTONE-AUDIT.md` (INT-01, INT-02, INT-03)
- Current `useKeyboardShortcuts.ts` hook is fully implemented and correct — the issue is wiring, not logic
- AdminShell already has working `handleSave` (via `saveRef`) and `isDirty` state — the bridge from App.tsx is what's missing

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/admin/useKeyboardShortcuts.ts` — fully implemented hook with Ctrl+Shift+A, Ctrl+S, Escape handlers
- `src/admin/AdminShell.tsx` — has `handleSave` (via saveRef), `isDirty` state, `handleClose` with dirty check
- `src/admin/useAdminPanel.ts` — manages `isDirty` and `setDirty` state
- `saveRef` pattern — already bridges editor save functions into AdminShell

### Established Patterns
- `import.meta.env.DEV` ternary for dev-only lazy imports (AdminShell pattern)
- `window.confirm()` for dirty-state exit confirmation (AdminShell X button)
- `saveRef` ref-based callback bridging (editors → AdminShell)

### Integration Points
- `src/App.tsx:13` — unconditional import of `useKeyboardShortcuts` (must be removed)
- `src/App.tsx:53` — `noop` onSave and `false` isDirty (must be wired to real values)
- `src/App.tsx:16-18` — AdminShell lazy import pattern (model for DEV gating)
- `src/admin/AdminShell.tsx:21-25` — `handleSave` function that needs to be reachable from keyboard shortcut

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 11-keyboard-shortcut-wiring-and-production-guard*
*Context gathered: 2026-03-26*
