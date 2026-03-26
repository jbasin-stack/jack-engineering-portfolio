---
phase: quick
plan: 2
type: execute
wave: 1
depends_on: []
files_modified:
  - src/admin/AdminShell.tsx
autonomous: true
requirements: [QUICK-02]
must_haves:
  truths:
    - "Scrolling inside admin panel nav or editor does NOT scroll the background portfolio page"
    - "Scrolling inside admin panel still works normally for its own content"
    - "When admin panel scroll reaches top/bottom boundary, background page does not scroll"
  artifacts:
    - path: "src/admin/AdminShell.tsx"
      provides: "Admin overlay with wheel event isolation from Lenis"
      contains: "stopPropagation"
  key_links:
    - from: "src/admin/AdminShell.tsx"
      to: "src/components/layout/SmoothScroll.tsx"
      via: "Wheel event propagation blocked before reaching window-level Lenis listener"
      pattern: "onWheel.*stopPropagation"
---

<objective>
Fix dual-scrolling bug where scrolling inside the admin panel also scrolls the background portfolio page.

Purpose: Quick task 1 added `data-lenis-prevent` to AdminShell's outer `motion.div`, but this is insufficient. Lenis uses `root` mode (`<ReactLenis root>` in SmoothScroll.tsx), meaning it listens on `window`. Wheel events bubble from admin panel children up to `window` where Lenis captures them, bypassing the `data-lenis-prevent` check. The fix must stop wheel event propagation at the admin panel boundary AND prevent scroll chaining at overflow boundaries.

Output: Updated AdminShell.tsx with proper scroll isolation
</objective>

<execution_context>
@C:/Users/Jack/.claude/get-shit-done/workflows/execute-plan.md
@C:/Users/Jack/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/admin/AdminShell.tsx
@src/components/layout/SmoothScroll.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Stop wheel event propagation and add overscroll containment</name>
  <files>src/admin/AdminShell.tsx</files>
  <action>
Three changes to AdminShell.tsx to fully isolate admin panel scrolling from the background Lenis smooth scroll:

1. Add `onWheel={(e) => e.stopPropagation()}` to the outer `motion.div` (the one with `className="fixed inset-0 z-[70]"` at ~line 43). This prevents wheel events from bubbling up to `window` where Lenis's root-mode listener would capture them. This is the primary fix.

2. Add `overscroll-behavior: contain` via Tailwind class `overscroll-contain` to the navigation scroll container (the `div` with `className="shrink-0 overflow-y-auto border-b border-gray-100"` at ~line 74). This prevents scroll chaining when the nav area scroll hits its boundary.

3. Add `overscroll-contain` to the editor scroll container (the `div` with `className="flex-1 overflow-y-auto p-4"` at ~line 82). Same reason — prevents scroll chaining at editor scroll boundaries.

Keep the existing `data-lenis-prevent` attribute on the `motion.div` as defense-in-depth.

Do NOT modify SmoothScroll.tsx or any other file. The fix is entirely within AdminShell.tsx.
  </action>
  <verify>
    <automated>npx tsc --noEmit 2>&1 | head -20</automated>
  </verify>
  <done>
    - motion.div has both `data-lenis-prevent` and `onWheel` handler that calls `e.stopPropagation()`
    - Both overflow-y-auto containers have `overscroll-contain` class
    - TypeScript compiles without errors
  </done>
</task>

</tasks>

<verification>
1. `npx tsc --noEmit` passes (no type errors)
2. Manual: Open admin panel in dev mode, scroll inside editor area — background should NOT scroll
3. Manual: Scroll to top/bottom of admin panel content — background should NOT begin scrolling when boundary is reached
</verification>

<success_criteria>
- Wheel events inside admin panel do not propagate to Lenis window listener
- Scroll chaining at overflow boundaries is contained within admin panel
- No regressions to admin panel's own scroll behavior
</success_criteria>

<output>
After completion, create `.planning/quick/2-fix-dual-scrolling-bug-where-admin-panel/2-SUMMARY.md`
</output>
