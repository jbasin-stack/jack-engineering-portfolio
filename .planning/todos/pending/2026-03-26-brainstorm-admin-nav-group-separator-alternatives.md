---
created: 2026-03-26T05:33:03.153Z
title: Brainstorm admin nav group separator alternatives
area: ui
files:
  - src/admin/AdminNav.tsx
  - src/admin/AdminShell.tsx
---

## Problem

The admin sidebar navigation uses boxed/bordered containers to separate the three content groups (Page Sections, Portfolio, Skills & Experience). When scrolling through the nav, these box separators feel disruptive to the visual flow — they create hard boundaries that break the lightweight, dev-tool sidebar feel described in the Phase 9 context ("like VS Code's explorer or Linear's sidebar").

## Solution

Brainstorm alternative UI patterns for group separation that maintain visual hierarchy without heavy borders:
- Subtle spacing/padding between groups (no visible separator)
- Uppercase small-text group headers with extra top margin only
- Thin hairline dividers (1px, low opacity)
- Indentation-based grouping (items indented under flush-left headers)
- Background tint difference between groups (very subtle)

Evaluate options against the "lightweight dev-tool sidebar" aesthetic from Phase 9 context. This is a v2 polish item — current implementation works functionally.
