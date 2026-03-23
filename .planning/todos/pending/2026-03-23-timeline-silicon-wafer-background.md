---
created: 2026-03-23T22:25:02.908Z
title: Timeline silicon wafer background
area: ui
files:
  - src/components/sections/Timeline.tsx
  - src/components/effects/AnimatedGridPattern.tsx
---

## Problem

User wants the Timeline section background to feature a photo of a silicon wafer, with the die on the wafer visually representing the grey timeline node boxes. Current implementation uses an AnimatedGridPattern (animated SVG grid) which the user likes but wants to evolve into something more ECE-themed.

## Solution

1. User will provide a high-res silicon wafer photo
2. Use the photo as a low-opacity background image in the Timeline section
3. Style/position timeline nodes to resemble die on the wafer
4. May need to replace or overlay AnimatedGridPattern with the wafer image
5. Consider blend modes and opacity to keep text readable
