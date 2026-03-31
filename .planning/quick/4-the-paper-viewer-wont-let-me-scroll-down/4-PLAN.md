---
phase: quick-4
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/components/pdf/PdfViewer.tsx
  - src/components/projects/ProjectDetail.tsx
autonomous: true
requirements: [QUICK-4]
must_haves:
  truths:
    - "User can scroll through multi-page PDFs in the paper viewer dialog"
    - "User can scroll through project detail content in the project dialog"
    - "Background page does not scroll while viewer/detail dialogs are open"
  artifacts:
    - path: "src/components/pdf/PdfViewer.tsx"
      provides: "Scrollable PDF viewer with Lenis scroll prevention"
      contains: "data-lenis-prevent"
    - path: "src/components/projects/ProjectDetail.tsx"
      provides: "Scrollable project detail with Lenis scroll prevention"
      contains: "data-lenis-prevent"
  key_links:
    - from: "src/components/pdf/PdfViewer.tsx"
      to: "Lenis smooth scroll"
      via: "data-lenis-prevent attribute on scrollable container"
      pattern: "data-lenis-prevent"
---

<objective>
Fix the paper viewer (and project detail viewer) scroll blocking caused by Lenis smooth scroll library intercepting wheel events inside modal dialogs.

Purpose: When a user opens a paper PDF or project detail, `lenis.stop()` is called to prevent background page scrolling. However, Lenis in `root` mode intercepts ALL wheel events on the page, including those inside the dialog's `overflow-auto` container. This makes it impossible to scroll through multi-page PDFs or long project details.

Output: Both PdfViewer and ProjectDetail dialogs scroll their internal content correctly while keeping background scroll locked.
</objective>

<execution_context>
@C:/Users/Jack/.claude/get-shit-done/workflows/execute-plan.md
@C:/Users/Jack/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/components/pdf/PdfViewer.tsx
@src/components/projects/ProjectDetail.tsx
@src/components/layout/SmoothScroll.tsx

Root cause: Lenis is configured with `root` mode (line 24 of SmoothScroll.tsx). When `lenis.stop()` is called, it prevents ALL scroll events on the page — including internal `overflow-auto` containers inside dialogs. The fix is to add `data-lenis-prevent` to the scrollable containers inside the dialogs, which tells Lenis to pass through scroll events on those elements to the native browser scroll handler. This pattern is already used in `src/admin/AdminShell.tsx` (line 63).
</context>

<tasks>

<task type="auto">
  <name>Task 1: Add data-lenis-prevent to PdfViewer and ProjectDetail scroll containers</name>
  <files>src/components/pdf/PdfViewer.tsx, src/components/projects/ProjectDetail.tsx</files>
  <action>
In `src/components/pdf/PdfViewer.tsx`:
- On the `pdfContent` div (line 141, the `<div className="flex-1 overflow-auto">`), add the `data-lenis-prevent` attribute. This tells Lenis to not intercept scroll/wheel events on this element, allowing native browser scrolling to work inside the PDF viewer even when `lenis.stop()` has been called.
- The attribute goes on the outermost scrollable container: `<div className="flex-1 overflow-auto" data-lenis-prevent>`

In `src/components/projects/ProjectDetail.tsx`:
- The same bug affects project detail modals. On desktop (line 129), `DialogContent` has `overflow-y-auto` but Lenis blocks scrolling. Add `data-lenis-prevent` to the `DialogContent` element.
- On mobile (line 112), `DrawerContent` has `overflow-y-auto`. Add `data-lenis-prevent` to the `DrawerContent` element as well.
  </action>
  <verify>
    <automated>npx tsc --noEmit 2>&1 | head -20</automated>
  </verify>
  <done>
    - PdfViewer's scrollable container has `data-lenis-prevent` attribute
    - ProjectDetail's DialogContent and DrawerContent have `data-lenis-prevent` attribute
    - TypeScript compiles without errors
    - User can scroll through multi-page PDFs in the viewer
    - User can scroll through long project details in the detail dialog
    - Background page remains scroll-locked while dialogs are open
  </done>
</task>

</tasks>

<verification>
1. `npx tsc --noEmit` passes with no errors
2. Open the site, click "View" on a paper, verify the PDF pages can be scrolled
3. Click on a project card, verify the project detail content can be scrolled
4. Confirm background page does not scroll while either dialog is open
</verification>

<success_criteria>
- Paper viewer allows scrolling through all pages of a multi-page PDF
- Project detail dialog allows scrolling through long content
- Background page scroll remains locked when dialogs are open
- No TypeScript errors introduced
</success_criteria>

<output>
After completion, create `.planning/quick/4-the-paper-viewer-wont-let-me-scroll-down/4-SUMMARY.md`
</output>
