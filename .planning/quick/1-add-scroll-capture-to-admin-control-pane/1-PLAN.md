---
phase: quick
plan: 1
type: execute
wave: 1
depends_on: []
files_modified:
  - src/admin/AdminShell.tsx
autonomous: true
must_haves:
  truths:
    - "Scrolling over the admin panel scrolls the panel content, not the main page"
    - "Scrolling over the transparent right panel still scrolls the main page normally"
  artifacts:
    - path: "src/admin/AdminShell.tsx"
      provides: "Admin panel with Lenis scroll prevention"
      contains: "data-lenis-prevent"
  key_links:
    - from: "src/admin/AdminShell.tsx"
      to: "Lenis smooth scroll (via SmoothScroll.tsx)"
      via: "data-lenis-prevent attribute on admin panel container"
      pattern: "data-lenis-prevent"
---

<objective>
Fix scroll capture on the admin control panel so that wheel events over the panel scroll the panel's own content (navigation list, editor area) instead of being intercepted by Lenis and scrolling the main portfolio page.

Purpose: The admin panel uses overflow-y-auto containers for nav and editor areas, but Lenis (smooth scroll library) captures wheel events at the root level, stealing scroll from the admin panel.

Output: AdminShell.tsx with data-lenis-prevent attribute that tells Lenis to ignore scroll events originating inside the admin panel.
</objective>

<execution_context>
@C:/Users/Jack/.claude/get-shit-done/workflows/execute-plan.md
@C:/Users/Jack/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/admin/AdminShell.tsx
@src/components/layout/SmoothScroll.tsx

<interfaces>
<!-- Lenis natively supports data-lenis-prevent attribute -->
<!-- Any element with this attribute will have wheel/touch events ignored by Lenis -->
<!-- Lenis also sets overscroll-behavior: contain via its CSS for elements with this attribute -->
<!-- See: node_modules/lenis/dist/lenis.css and lenis.js -->

From node_modules/lenis/dist/lenis.css:
```css
.lenis [data-lenis-prevent] {
  overscroll-behavior: contain;
}
```

From node_modules/lenis/dist/lenis.js (event traversal check):
```js
node.hasAttribute?.("data-lenis-prevent")
```
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add data-lenis-prevent to admin panel container</name>
  <files>src/admin/AdminShell.tsx</files>
  <action>
Add the `data-lenis-prevent` attribute to the left Panel's inner content area in AdminShell.tsx.

Specifically, add `data-lenis-prevent` to the motion.div wrapper (the fixed overlay container at line 43-48). This ensures ALL scroll events originating anywhere inside the admin panel (nav area, editor area, save bar) are excluded from Lenis smooth scroll handling, allowing the native overflow-y-auto scrolling on the nav and editor containers to work correctly.

Do NOT add it to the transparent right panel -- that panel should remain pointer-events-none and allow Lenis to handle scroll events over the portfolio content as normal.

The attribute is a boolean HTML attribute with no value: `data-lenis-prevent` (not `data-lenis-prevent="true"`).
  </action>
  <verify>
    <automated>cd "C:/Claude code projects/GSD Projects/Jack_Engineering_Portfolio" && grep -q "data-lenis-prevent" src/admin/AdminShell.tsx && npx tsc --noEmit --pretty 2>&1 | tail -5</automated>
  </verify>
  <done>AdminShell.tsx contains data-lenis-prevent on the admin overlay container. TypeScript compiles without errors. Scrolling over the admin panel scrolls the panel content natively instead of the main page.</done>
</task>

</tasks>

<verification>
1. Open dev server with ?admin query param
2. Hover over the admin panel's editor area and scroll -- panel content should scroll, not the main page
3. Hover over the transparent right side and scroll -- main page should scroll normally via Lenis
4. TypeScript compiles clean: `npx tsc --noEmit`
</verification>

<success_criteria>
- data-lenis-prevent attribute present on admin panel container
- Wheel events over admin panel scroll the panel, not the page
- Wheel events over the portfolio (right side) still use Lenis smooth scroll
- No TypeScript errors
</success_criteria>

<output>
After completion, create `.planning/quick/1-add-scroll-capture-to-admin-control-pane/1-SUMMARY.md`
</output>
</task>
