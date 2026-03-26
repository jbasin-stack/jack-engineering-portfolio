# Phase 11: Keyboard Shortcut Wiring & Production Guard - Research

**Researched:** 2026-03-26
**Domain:** React state bridging, Vite dead-code elimination, keyboard event handling
**Confidence:** HIGH

## Summary

Phase 11 closes three well-documented integration gaps (INT-01, INT-02, INT-03) in the v1.1 milestone. The current `useKeyboardShortcuts` hook is fully implemented and correct -- the problem is purely a wiring/integration issue in `App.tsx` where (a) the hook is unconditionally imported (leaking into production builds), (b) `onSave` receives a noop instead of the real save function, and (c) `isDirty` is hardcoded to `false`.

The fix involves two coordinated changes: (1) move keyboard shortcut handling into the dev-only admin boundary so it never touches production builds, and (2) bridge AdminShell's `handleSave` and `isDirty` state to the keyboard shortcut handler. The existing `saveRef` pattern already demonstrates how to bridge functions across component boundaries in this codebase.

**Primary recommendation:** Move `useKeyboardShortcuts` call into `AdminShell.tsx` (where `handleSave` and `isDirty` already live), keep only the `Ctrl+Shift+A` toggle listener in `App.tsx` behind `import.meta.env.DEV`, and gate all admin state in `App.tsx` behind the same DEV check.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Ctrl+S triggers save and shows green toast (same flow as Save button)
- Silent no-op when no dirty changes -- no toast, no visual feedback
- Only suppress browser "Save Page" dialog when admin panel is open; normal browser behavior when closed
- Ignore rapid double-tap -- first Ctrl+S triggers save, subsequent presses ignored until save completes (matches existing 300ms debounce)
- Works everywhere in the panel regardless of focus (text inputs, buttons, etc.)
- Error handling identical to Save button -- red toast with error details, inline field validation errors
- `window.confirm()` dialog when dirty state exists ("You have unsaved changes. Close anyway?") -- matches existing X button behavior
- Close immediately when no unsaved changes -- no prompt
- Layered escape: close sub-dialogs first; only close panel when no sub-dialogs are open
- Move Ctrl+S and Escape handling into AdminShell (already dev-only gated)
- Inline Ctrl+Shift+A listener in App.tsx behind `import.meta.env.DEV` check
- Gate ALL admin logic in App.tsx behind `import.meta.env.DEV`: adminOpen state, toggleAdmin, closeAdmin, keyboard listener
- Production App.tsx is purely portfolio rendering -- zero admin state, callbacks, listeners, or imports
- Result: `useKeyboardShortcuts.ts` never imported in production; `vite build` dist/ has zero references

### Claude's Discretion
- Exact state bridging mechanism (refs, context, event bus, or moving hook call location)
- Whether to refactor `useKeyboardShortcuts` or keep it as-is and change where it's called
- Internal implementation of save-in-progress guard
- How to structure the DEV gate in App.tsx (custom hook, inline block, extracted component)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| INFRA-01 | Admin panel is accessible only in dev mode -- zero admin code in production build | Production guard architecture: DEV-gated admin state in App.tsx + `useKeyboardShortcuts` moved into AdminShell eliminates all admin imports from production. Verified by grep on `vite build` output. |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | ^19.2.4 | Component framework | Already installed, useRef/useCallback for state bridging |
| Vite | ^8.0.1 | Build tool | `import.meta.env.DEV` static replacement enables dead-code elimination |
| Vitest | ^4.1.0 | Test framework | Already configured, used for all existing tests |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| sonner | ^2.0.7 | Toast notifications | Already used -- save success/error toasts via `toast()` |

No new dependencies needed. This phase is purely rewiring existing code.

## Architecture Patterns

### Recommended Approach: Split useKeyboardShortcuts

The cleanest solution splits keyboard handling into two concerns:

```
App.tsx (production)
  - Zero admin imports, state, or listeners
  - Pure portfolio rendering

App.tsx (dev only, behind import.meta.env.DEV)
  - adminOpen state, toggleAdmin, closeAdmin
  - Ctrl+Shift+A toggle listener (inline, ~10 lines)
  - Lazy AdminShell import + render

AdminShell.tsx (already dev-only via lazy import)
  - useKeyboardShortcuts(handleSave, handleClose, isDirty) for Ctrl+S + Escape
  - Has direct access to handleSave (via saveRef) and isDirty (via useAdminPanel)
  - No bridging needed -- all state is local
```

### Pattern 1: DEV-gated Admin Block in App.tsx
**What:** Wrap all admin state and logic in a single `if (import.meta.env.DEV)` block
**When to use:** This phase -- removing all admin concerns from production App.tsx
**Example:**
```typescript
// App.tsx -- production path is pure portfolio rendering
function App() {
  // DEV-only admin state and listeners
  // Option A: Extract to a custom hook that returns { adminOpen, AdminShell, adminProps }
  // Option B: Inline conditional block
  // Option C: Wrap in a DevAdminProvider component

  return (
    <MotionConfig reducedMotion="user">
      {/* AdminShell rendered only in dev */}
      <SmoothScroll>
        {/* ...portfolio sections... */}
      </SmoothScroll>
    </MotionConfig>
  );
}
```

**Key insight on Vite dead-code elimination:**
Vite replaces `import.meta.env.DEV` with literal `false` at build time, then the bundler eliminates the dead code. This works reliably for:
- Ternary expressions: `const X = import.meta.env.DEV ? lazy(() => import('./X')) : null;`
- If blocks: `if (import.meta.env.DEV) { ... }`
- Top-level const assignments used in conditions

The existing `AdminShell` lazy import pattern on App.tsx line 16-18 already demonstrates this working correctly.

### Pattern 2: Moving Keyboard Shortcuts into AdminShell
**What:** Call `useKeyboardShortcuts` inside AdminShell where save/dirty state lives
**When to use:** This phase -- eliminates the need to bridge state across components
**Example:**
```typescript
// AdminShell.tsx
export default function AdminShell({ onClose }: AdminShellProps) {
  const { isDirty, setDirty, ... } = useAdminPanel();
  const saveRef = useRef<(() => Promise<boolean>) | null>(null);

  const handleSave = async () => {
    if (saveRef.current) {
      await saveRef.current();
    }
  };

  // Keyboard shortcuts now have direct access to handleSave and isDirty
  useKeyboardShortcuts(true, () => {}, handleSave, handleClose, isDirty);
  // isOpen is always true here (AdminShell only renders when open)
  // onToggle is no-op here (toggle lives in App.tsx)

  // ...rest of component
}
```

### Pattern 3: Save-in-Progress Guard
**What:** Prevent double-save from rapid Ctrl+S presses
**When to use:** When wiring Ctrl+S to handleSave
**Example:**
```typescript
// Inside AdminShell or useKeyboardShortcuts
const savingRef = useRef(false);

const guardedSave = useCallback(async () => {
  if (savingRef.current) return; // Already saving
  savingRef.current = true;
  try {
    await handleSave();
  } finally {
    savingRef.current = false;
  }
}, [handleSave]);
```

### Pattern 4: Inline Ctrl+Shift+A Listener
**What:** Simple keydown listener for the toggle shortcut, scoped to DEV only
**When to use:** In App.tsx behind `import.meta.env.DEV` to replace the current `useKeyboardShortcuts` call
**Example:**
```typescript
// Inside a useEffect, behind import.meta.env.DEV
useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
      e.preventDefault();
      toggleAdmin();
    }
  };
  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}, [toggleAdmin]);
```

### Anti-Patterns to Avoid
- **Lifting isDirty to App.tsx:** Would require prop-drilling or context, adds complexity. AdminShell already owns this state.
- **Event bus for save bridging:** Over-engineering for a problem solvable by moving the hook call location.
- **Keeping useKeyboardShortcuts import in App.tsx:** Even behind a DEV check, the static import on line 13 would still be bundled. Must either dynamic-import or move the call entirely.
- **useImperativeHandle for save bridging:** The saveRef pattern already works. No need for forwardRef + useImperativeHandle.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Toast notifications | Custom toast system | sonner `toast()` | Already integrated, handles stacking/dismissal |
| Dirty confirmation dialog | Custom React modal | `window.confirm()` | Matches existing X button behavior, blocks JS thread (handles layered escape naturally) |
| Save debouncing | Custom debounce utility | `useRef` boolean guard | Simpler, matches async/await pattern, no timing edge cases |

**Key insight:** The layered escape concern (close sub-dialogs before panel) is naturally handled because all sub-dialogs in the codebase use `window.confirm()`, which is a native blocking dialog. While a `window.confirm()` is open, keyboard event listeners don't fire. When the user presses Escape on a confirm dialog, it dismisses the dialog (native behavior), and the keydown event never reaches the panel's Escape handler.

## Common Pitfalls

### Pitfall 1: Static Import Defeats DEV Guard
**What goes wrong:** Writing `import { useKeyboardShortcuts } from './admin/useKeyboardShortcuts'` at the top of App.tsx, even if the function is only called inside an `if (import.meta.env.DEV)` block, will still include the module in the production bundle because ES module imports are static.
**Why it happens:** JavaScript bundlers hoist imports. The import statement runs unconditionally.
**How to avoid:** Either (a) move the `useKeyboardShortcuts` call into a component that is already dev-only (AdminShell), or (b) use dynamic `import()` behind the DEV check. Option (a) is far cleaner for this case.
**Warning signs:** `grep -r "useKeyboardShortcuts" dist/` returns matches after `vite build`.

### Pitfall 2: Ctrl+S Fires During Active Save
**What goes wrong:** User presses Ctrl+S rapidly, triggering multiple concurrent POST requests. Could cause race conditions or duplicate toasts.
**Why it happens:** The keyboard handler fires on every keydown, and async save takes time.
**How to avoid:** Add a `savingRef` boolean guard. Set to `true` before save starts, `false` in `finally` block. Skip save if already `true`.
**Warning signs:** Multiple "Saved" toasts appearing in quick succession.

### Pitfall 3: Ctrl+S Suppresses Browser Dialog When Panel is Closed
**What goes wrong:** If the keyboard handler is active globally and the panel is closed, Ctrl+S still calls `e.preventDefault()`, breaking the expected browser "Save Page" behavior.
**Why it happens:** Handler doesn't check `isOpen` before preventing default on Ctrl+S.
**How to avoid:** The existing `useKeyboardShortcuts` already has `if (!isOpen) return;` before the Ctrl+S check. Moving the hook into AdminShell (which only renders when open) makes this automatic.
**Warning signs:** Browser "Save Page" dialog never appears when panel is closed.

### Pitfall 4: useKeyboardShortcuts Stale Closure on isDirty
**What goes wrong:** The Escape handler captures a stale `isDirty` value because the useEffect dependency array doesn't include `isDirty`.
**Why it happens:** Closure captures the value at effect setup time.
**How to avoid:** The existing hook already includes `isDirty` in its dependency array (line 50). Verify this remains true after any refactoring.
**Warning signs:** Escape closes panel without confirmation even though there are unsaved changes.

### Pitfall 5: handleSave Not Yet Set When Keyboard Shortcut Fires
**What goes wrong:** `saveRef.current` is null when Ctrl+S fires because the editor hasn't mounted yet.
**Why it happens:** Race condition between AdminShell mount and keyboard handler registration.
**How to avoid:** The existing `handleSave` already checks `if (saveRef.current)` before calling. Ctrl+S on an unmounted editor is a no-op (which is correct behavior -- nothing to save).
**Warning signs:** Ctrl+S does nothing. This is actually correct when no editor content is loaded.

## Code Examples

### Current Broken Wiring (App.tsx line 53)
```typescript
// CURRENT: noop and false -- shortcuts don't work
useKeyboardShortcuts(adminOpen, toggleAdmin, noop, closeAdmin, false);
```

### Fixed Architecture: App.tsx (dev-gated)
```typescript
// All admin state gated behind import.meta.env.DEV
// No static imports of admin modules
// Ctrl+Shift+A handled inline in useEffect (behind DEV)
// Ctrl+S + Escape handled inside AdminShell (already dev-only)
```

### Fixed Architecture: AdminShell.tsx (keyboard shortcuts with real state)
```typescript
// useKeyboardShortcuts called HERE with real handleSave and isDirty
// isOpen is always true (AdminShell only renders when open)
// onToggle is no-op (toggle shortcut lives in App.tsx)
// Save-in-progress guard via savingRef
```

### Production Build Verification
```bash
# After vite build, verify zero admin code in output
grep -r "useKeyboardShortcuts" dist/
# Should return no matches

grep -r "AdminShell" dist/
# Should return no matches

grep -r "adminOpen" dist/
# Should return no matches
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `useKeyboardShortcuts` in App.tsx with noop bridging | Move hook into AdminShell where state lives | This phase | Eliminates bridging problem entirely |
| Unconditional admin imports in App.tsx | All admin code behind `import.meta.env.DEV` | This phase | Zero admin code in production |
| Admin state always initialized in App.tsx | Admin state only exists in DEV mode | This phase | Cleaner production component tree |

## Open Questions

1. **Should `useKeyboardShortcuts` be refactored or kept as-is?**
   - What we know: The hook's API accepts `isOpen`, `onToggle`, `onSave`, `onClose`, `isDirty`. When called from AdminShell, `isOpen` is always `true` and `onToggle` is a no-op.
   - What's unclear: Whether to simplify the hook API since it will only be called from AdminShell now, or keep it generic.
   - Recommendation: **Keep it as-is.** The hook works correctly. Passing `true` for `isOpen` and a no-op for `onToggle` is trivial. Refactoring adds risk for no functional benefit. The Ctrl+Shift+A handler in the hook becomes dead code inside AdminShell, but that's harmless.

2. **Alternative: Split the hook into two functions?**
   - What we know: Could split into `useAdminToggleShortcut(onToggle)` for App.tsx and `useEditorShortcuts(onSave, onClose, isDirty)` for AdminShell.
   - What's unclear: Whether the cleaner API justifies the refactoring effort.
   - Recommendation: **Claude's discretion.** Either approach works. Splitting is cleaner but more files to change. Keeping as-is is simpler and lower risk.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.0 |
| Config file | `vitest.config.ts` |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run --reporter=verbose` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| INFRA-01 (production guard) | `vite build` dist/ has zero references to `useKeyboardShortcuts`, `AdminShell`, `adminOpen` | integration (build + grep) | `npx vite build && grep -r "useKeyboardShortcuts" dist/ && echo FAIL \|\| echo PASS` | Partially -- `src/tests/bundle.test.ts` exists but doesn't check admin imports |
| INT-01 closure | `useKeyboardShortcuts` not statically imported in App.tsx | unit (source grep) | `npx vitest run src/tests/imports.test.ts` | Partially -- `imports.test.ts` checks framer-motion, not admin imports |
| INT-02 closure | Ctrl+S calls real save function when panel is open | unit | `npx vitest run src/admin/__tests__/keyboard-shortcuts.test.ts -x` | No -- Wave 0 |
| INT-03 closure | Escape shows confirm when isDirty is true | unit | `npx vitest run src/admin/__tests__/keyboard-shortcuts.test.ts -x` | No -- Wave 0 |
| Save guard | Rapid Ctrl+S doesn't trigger concurrent saves | unit | `npx vitest run src/admin/__tests__/keyboard-shortcuts.test.ts -x` | No -- Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run --reporter=verbose`
- **Per wave merge:** `npx vitest run --reporter=verbose && npx tsc -b`
- **Phase gate:** Full suite green + `vite build` + grep verification

### Wave 0 Gaps
- [ ] `src/admin/__tests__/keyboard-shortcuts.test.ts` -- covers INT-02, INT-03, save guard behavior
- [ ] Extend `src/tests/bundle.test.ts` or `src/tests/imports.test.ts` -- verify no admin imports in production App.tsx (covers INFRA-01, INT-01)

## Sources

### Primary (HIGH confidence)
- [Vite Env Variables and Modes docs](https://vite.dev/guide/env-and-mode) -- `import.meta.env.DEV` static replacement and dead-code elimination
- Codebase inspection: `src/App.tsx`, `src/admin/useKeyboardShortcuts.ts`, `src/admin/AdminShell.tsx`, `src/admin/useAdminPanel.ts`, `src/admin/useContentEditor.ts`
- `.planning/v1.1-MILESTONE-AUDIT.md` -- INT-01, INT-02, INT-03 gap definitions

### Secondary (MEDIUM confidence)
- [Vite GitHub Issue #10886](https://github.com/vitejs/vite/issues/10886) -- dead-in-production function discussion, confirms DEV guard pattern
- [React useRef docs](https://react.dev/reference/react/useRef) -- ref-based callback pattern

### Tertiary (LOW confidence)
- None -- all findings verified against codebase and official docs

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new libraries, purely rewiring existing code
- Architecture: HIGH -- the pattern (move hook into dev-only component) is straightforward and follows existing codebase patterns (AdminShell lazy import)
- Pitfalls: HIGH -- all pitfalls verified against actual codebase code, existing patterns already handle most edge cases

**Research date:** 2026-03-26
**Valid until:** Indefinite -- this is a codebase-specific wiring fix, not dependent on external library changes
