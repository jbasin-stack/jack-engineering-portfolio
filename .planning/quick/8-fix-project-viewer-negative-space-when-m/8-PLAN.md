---
phase: quick-8
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/projects/ProjectDetail.tsx
autonomous: true
requirements: [QUICK-8]

must_haves:
  truths:
    - "Content column stays visible while scrolling through images on desktop"
    - "No negative/dead space appears below the text column when images are tall"
    - "Mobile drawer layout is unaffected (sticky only applies at md breakpoint)"
  artifacts:
    - path: "src/components/projects/ProjectDetail.tsx"
      provides: "Sticky content column in project detail grid"
      contains: "md:sticky"
  key_links:
    - from: "content column div"
      to: "grid container with overflow"
      via: "md:sticky md:top-6 md:self-start"
      pattern: "md:sticky.*md:self-start"
---

<objective>
Fix the project detail modal so the right-side content column (domain pill, summary, tech tags, links) stays pinned/sticky on desktop while the user scrolls through multiple images in the left column. This eliminates the large negative space that appears below the short content when images stack tall.

Purpose: All 5 projects have 2 images each, causing a consistently bad layout where the text ends but the images column continues, leaving dead space.
Output: Updated ProjectDetail.tsx with sticky content column at md breakpoint.
</objective>

<execution_context>
@C:/Users/Jack/.claude/get-shit-done/workflows/execute-plan.md
@C:/Users/Jack/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/components/projects/ProjectDetail.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add sticky positioning to the content column</name>
  <files>src/components/projects/ProjectDetail.tsx</files>
  <action>
In `src/components/projects/ProjectDetail.tsx`, modify the content column div (currently line 67) from:

```
<div className="flex flex-col gap-4">
```

to:

```
<div className="flex flex-col gap-4 md:sticky md:top-6 md:self-start">
```

This adds three Tailwind utility classes at the `md` breakpoint only:
- `md:sticky` — makes the element stick within its grid cell as the parent scrolls
- `md:top-6` — sets the sticky offset to 1.5rem from the top of the scroll container
- `md:self-start` — prevents the grid from stretching the content column to full height (which would defeat sticky behavior)

Important notes:
- Only modify the CONTENT column (second div in the grid), NOT the images column
- The `md:` prefix ensures mobile/drawer layout is completely unaffected
- The parent DialogContent already has `overflow-y-auto` which is required for sticky to work inside it
- Do NOT change any other styles, structure, or the mobile Drawer path
  </action>
  <verify>
    <automated>cd "C:/Claude code projects/GSD Projects/Jack_Engineering_Portfolio" && npx tsc --noEmit 2>&1 | head -20</automated>
  </verify>
  <done>Content column has `md:sticky md:top-6 md:self-start` classes. TypeScript compiles cleanly. On desktop, the text content stays pinned at the top of its column while scrolling through tall image stacks, eliminating the negative space problem.</done>
</task>

</tasks>

<verification>
1. `npx tsc --noEmit` passes with no errors
2. Open the site, click any project (e.g., Schottky Diode Fabrication with 2 process flow images)
3. On desktop: scroll down in the modal — the domain pill, summary text, tech tags, and links should remain visible/pinned while the images scroll
4. On mobile: drawer layout should behave exactly as before (no sticky, normal vertical flow)
5. Verify with a single-image project as well — layout should still look correct (sticky has no negative effect when content heights are similar)
</verification>

<success_criteria>
- No dead/negative space below the content column on desktop when images are taller than content
- Content column stays pinned while scrolling through images
- Mobile drawer layout unchanged
- TypeScript compiles cleanly
</success_criteria>

<output>
After completion, create `.planning/quick/8-fix-project-viewer-negative-space-when-m/8-SUMMARY.md`
</output>
