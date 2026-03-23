---
created: 2026-03-23T22:25:02.908Z
title: Choose Hero background effect
area: ui
files:
  - src/components/hero/Hero.tsx:7
  - src/components/effects/AuroraBackground.tsx
  - src/components/effects/Particles.tsx
---

## Problem

The Hero section currently has no background effect after the Aurora gradient was removed (user found it too distracting). A placeholder TODO comment exists at Hero.tsx line 7. The Hero is the first thing visitors see — it needs a visual treatment that's premium but not overwhelming.

## Solution

Options discussed with user:
1. **Particles only** — remove Aurora, keep floating particles with subtle dark-to-purple CSS radial gradient. Clean and techy.
2. **Dot matrix / circuit trace pattern** — static SVG grid of faint dots or PCB-style traces. On-brand for ECE.
3. **Slow gradient mesh** — 2-3 soft purple/dark blobs drifting extremely slowly. More ambient than Aurora.

User to decide which direction. All effect components already exist in src/components/effects/.
