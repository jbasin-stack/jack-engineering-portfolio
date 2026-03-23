---
created: 2026-03-23T22:25:02.908Z
title: Skills and Tooling visual enhancements
area: ui
files:
  - src/components/sections/Skills.tsx
  - src/components/sections/Tooling.tsx
  - src/data/skills.ts
---

## Problem

Skills and Tooling sections have subtle noise texture backgrounds but feel a bit bland. The domains (Fabrication, RF, Analog, Digital) are very visual and could benefit from richer treatment.

## Solution

All four ideas were approved by user:
1. **Domain-specific icons/SVGs** — oscilloscope for Analog, FPGA chip for Digital, wafer for Fabrication, antenna for RF
2. **Subtle animated circuit traces** — connecting skill items within each group
3. **Hover glow effect** — similar to CardSpotlight but smaller, on individual skill tags
4. **Color-coded domain accents** — each domain gets a slight tint variation of UW purple
