---
phase: quick-4
plan: 01
subsystem: ui/scroll
tags: [lenis, scroll, modal, pdf-viewer, project-detail]
dependency_graph:
  requires: []
  provides: [scrollable-modal-content]
  affects: [pdf-viewer, project-detail]
tech_stack:
  added: []
  patterns: [data-lenis-prevent]
key_files:
  modified:
    - src/components/pdf/PdfViewer.tsx
    - src/components/projects/ProjectDetail.tsx
decisions:
  - Used data-lenis-prevent attribute (established pattern from AdminShell.tsx) rather than alternative approaches like stopping Lenis entirely or using event.stopPropagation
metrics:
  duration: 29s
  completed: "2026-03-31T23:35:18Z"
---

# Quick Task 4: Fix Paper Viewer and Project Detail Scroll Blocking

Add data-lenis-prevent to PdfViewer and ProjectDetail scroll containers so Lenis passes through wheel events to native browser scrolling inside modals.

## What Changed

Lenis smooth scroll in `root` mode intercepts all wheel events on the page. When `lenis.stop()` is called to lock background scrolling while a modal is open, it also blocks scrolling inside `overflow-auto` containers within those modals. The `data-lenis-prevent` attribute tells Lenis to skip interception on that element, allowing native scrolling.

Three scroll containers were updated:

1. **PdfViewer.tsx** (line 141) -- The `flex-1 overflow-auto` div wrapping the PDF page content. Users can now scroll through multi-page PDFs.
2. **ProjectDetail.tsx** (line 112) -- `DrawerContent` on mobile. Users can now scroll through long project details on mobile.
3. **ProjectDetail.tsx** (line 129) -- `DialogContent` on desktop. Users can now scroll through long project details on desktop.

This follows the established pattern from `src/admin/AdminShell.tsx` (line 63).

## Commits

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Add data-lenis-prevent to scroll containers | 82b0fb1 | PdfViewer.tsx, ProjectDetail.tsx |

## Deviations from Plan

None -- plan executed exactly as written.

## Verification

- TypeScript compilation: PASSED (no errors)
- All three scroll containers confirmed to have `data-lenis-prevent` attribute

## Self-Check: PASSED

- FOUND: src/components/pdf/PdfViewer.tsx
- FOUND: src/components/projects/ProjectDetail.tsx
- FOUND: 4-SUMMARY.md
- FOUND: commit 82b0fb1
