---
created: 2026-03-25T21:18:22.952Z
title: Investigate admin overlay resize panel not working
area: ui
files:
  - src/admin/AdminShell.tsx
  - src/App.tsx
  - src/components/layout/SmoothScroll.tsx
---

## Problem

The admin panel overlay (opened via Ctrl+Shift+A) uses react-resizable-panels v4.7.6 with a `Group`/`Panel`/`Separator` split-pane layout. The drag separator cannot be moved more than ~1 inch from the left edge of the screen, making the panel nearly unusable for resizing.

Initial fix attempt (increasing `maxSize` from 60 to 85 and reducing right panel `minSize` from 40 to 15) did not resolve the issue — the constraints were not the root cause.

Hypothesis: The AdminShell was rendered inside `SmoothScroll` (Lenis smooth scroll library via `ReactLenis root`), which may apply a CSS transform to its wrapper element. A parent with a CSS transform breaks `position: fixed` children — they position relative to the transformed parent instead of the viewport, constraining the overlay dimensions.

Quick fix applied: moved AdminShell rendering outside `SmoothScroll` in App.tsx to be a direct child of `MotionConfig` (a context provider with no DOM node). This needs deeper investigation to confirm:

1. Whether Lenis root mode actually applies transforms that break fixed positioning
2. Whether the quick fix fully resolves the resize behavior
3. Whether there are other layout/interaction side effects from the AdminShell being outside the Lenis scroll context
4. Whether react-resizable-panels has any known issues with CSS transform ancestors

## Solution

TBD — pending user verification of the quick fix. If confirmed, document the Lenis/fixed-position interaction as a known constraint. If not resolved, deeper investigation into react-resizable-panels measurement logic and the Group container dimensions is needed.
