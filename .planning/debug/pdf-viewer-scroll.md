---
status: diagnosed
trigger: "Papers PDF viewer uses page-by-page clicking instead of continuous scroll"
created: 2026-03-26T00:00:00Z
updated: 2026-03-26T00:00:00Z
---

## Current Focus

hypothesis: PdfViewer renders a single `<Page>` component controlled by pageNumber state, producing page-by-page navigation instead of rendering all pages in a scrollable container
test: Read the PdfViewer component and confirm only one Page is rendered at a time
expecting: Single `<Page pageNumber={pageNumber} ... />` inside the Document
next_action: Write up root cause and fix direction

## Symptoms

expected: Papers PDF viewer allows continuous scrolling through all pages of a document
actual: User must click prev/next arrows to move between pages one at a time
errors: none (functional, just wrong UX pattern)
reproduction: Click "View" on any paper in the Papers section; observe single-page display with prev/next navigation buttons
started: Always been this way (original implementation design)

## Eliminated

(none -- root cause identified on first hypothesis)

## Evidence

- timestamp: 2026-03-26T00:00:00Z
  checked: src/components/pdf/PdfViewer.tsx (lines 189-197)
  found: |
    The Document component renders exactly one Page:
    ```tsx
    <Document file={file} onLoadSuccess={onLoadSuccess} onLoadError={onLoadError} loading={null} error={null}>
      {!error && <Page pageNumber={pageNumber} scale={scale} />}
    </Document>
    ```
    State `pageNumber` is controlled by prev/next buttons (lines 87-88).
    Only a single page is ever visible at a time.
  implication: This is the direct cause -- to enable continuous scrolling, ALL pages must be rendered inside the scrollable container

- timestamp: 2026-03-26T00:00:00Z
  checked: src/components/pdf/PdfViewer.tsx (lines 44-45, 86-88)
  found: |
    State management is purely single-page:
    - `pageNumber` state (line 45) tracks the one visible page
    - `prevPage` / `nextPage` (lines 87-88) increment/decrement it
    - Toolbar shows "pageNumber / numPages" (line 114)
  implication: The entire pagination model (state + UI) is designed around single-page viewing

- timestamp: 2026-03-26T00:00:00Z
  checked: src/components/pdf/PdfViewer.tsx (lines 170-200)
  found: |
    The pdfContent area uses `overflow-auto` on the container div (line 172), which would
    support scrolling -- but since only one Page is rendered, there is nothing to scroll to.
  implication: The scrollable container already exists; it just needs multiple pages inside it

- timestamp: 2026-03-26T00:00:00Z
  checked: package.json
  found: "react-pdf": "^10.4.1" -- react-pdf v10 supports rendering multiple <Page> components inside a single <Document>
  implication: No library upgrade needed; react-pdf already supports the multi-page pattern

- timestamp: 2026-03-26T00:00:00Z
  checked: UAT test 9 in .planning/phases/10-content-editors/10-UAT.md
  found: |
    truth: "Papers PDF viewer allows continuous scrolling through pages"
    status: failed
    reason: "User reported: PDF viewer uses page-by-page clicking instead of continuous scroll. Prefers scrollable view."
    severity: minor
  implication: Confirmed UAT requirement for continuous scrolling

## Resolution

root_cause: |
  PdfViewer.tsx renders exactly ONE `<Page>` at a time (line 196), controlled by `pageNumber`
  state and prev/next buttons. This is a design choice, not a bug -- the component was built
  with single-page pagination from the start. The UAT expectation is continuous scrolling,
  which requires rendering all pages simultaneously in a scrollable container.

fix: |
  Replace single-page rendering with all-pages rendering:

  1. **Remove pageNumber state and prev/next navigation** -- no longer needed
  2. **Render all pages in a loop** inside the Document:
     ```tsx
     <Document file={file} onLoadSuccess={onLoadSuccess} onLoadError={onLoadError} loading={null} error={null}>
       {!error && Array.from({ length: numPages }, (_, i) => (
         <Page key={i + 1} pageNumber={i + 1} scale={scale} className="mb-4" />
       ))}
     </Document>
     ```
  3. **Remove page navigation from toolbar** -- replace "Page X / Y" with just "Y pages"
     and remove the ChevronLeft/ChevronRight buttons
  4. **Keep zoom controls and download/close buttons** in the toolbar
  5. **The existing `overflow-auto` container** (line 172) already provides the scroll behavior;
     rendering multiple pages inside it will automatically enable continuous scrolling
  6. **Optional performance enhancement**: For long PDFs, consider virtualizing page rendering
     (only render pages near the viewport) -- but with typical academic papers (5-30 pages),
     rendering all pages should be fine

  Files to change:
  - src/components/pdf/PdfViewer.tsx (primary -- rendering logic and toolbar)

  No changes needed to:
  - src/components/pdf/LazyPdfViewer.tsx (wrapper is fine)
  - src/components/papers/PapersSection.tsx (consumer is fine)
  - src/components/papers/PaperRow.tsx (trigger is fine)
  - No new dependencies required

verification: []
files_changed: []
