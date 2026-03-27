---
phase: 14
slug: component-rebuilds
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-27
---

# Phase 14 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1 + jsdom |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 14-01-01 | 01 | 1 | SKTL-01 | unit | `npx vitest run src/components/sections/__tests__/expertise.test.ts -t "renders all domain tabs"` | ❌ W0 | ⬜ pending |
| 14-01-02 | 01 | 1 | SKTL-02 | manual-only | Visual verification — layoutId animation cannot be asserted in jsdom | N/A | ⬜ pending |
| 14-01-03 | 01 | 1 | SKTL-03 | unit | `npx vitest run src/components/sections/__tests__/expertise.test.ts -t "glassmorphic"` | ❌ W0 | ⬜ pending |
| 14-01-04 | 01 | 1 | SKTL-04 | manual-only | AnimatePresence animation cannot be meaningfully tested in jsdom | N/A | ⬜ pending |
| 14-02-01 | 02 | 1 | PROJ-01 | unit | `npx vitest run src/components/projects/__tests__/carousel.test.ts -t "renders all project slides"` | ❌ W0 | ⬜ pending |
| 14-02-02 | 02 | 1 | PROJ-02 | unit | `npx vitest run src/components/projects/__tests__/carousel.test.ts -t "featured project first"` | ❌ W0 | ⬜ pending |
| 14-02-03 | 02 | 1 | PROJ-03 | unit | `npx vitest run src/components/projects/__tests__/carousel.test.ts -t "card content"` | ❌ W0 | ⬜ pending |
| 14-02-04 | 02 | 1 | PROJ-04 | unit | `npx vitest run src/components/projects/__tests__/carousel.test.ts -t "opens detail"` | ❌ W0 | ⬜ pending |
| 14-02-05 | 02 | 1 | PROJ-05 | unit | `npx vitest run src/components/projects/__tests__/carousel.test.ts -t "data-lenis-prevent"` | ❌ W0 | ⬜ pending |
| 14-03-01 | 03 | 2 | TIME-01 | manual-only | Scroll-linked pathLength requires real scroll environment | N/A | ⬜ pending |
| 14-03-02 | 03 | 2 | TIME-02 | unit | `npx vitest run src/components/sections/__tests__/timeline.test.ts -t "renders nodes"` | ❌ W0 | ⬜ pending |
| 14-03-03 | 03 | 2 | TIME-03 | manual-only | CSS animation requires visual verification | N/A | ⬜ pending |
| 14-03-04 | 03 | 2 | TIME-04 | manual-only | Scroll-linked opacity requires real scroll environment | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/components/sections/__tests__/expertise.test.ts` — stubs for SKTL-01, SKTL-03
- [ ] `src/components/projects/__tests__/carousel.test.ts` — stubs for PROJ-01 through PROJ-05
- [ ] `src/components/sections/__tests__/timeline.test.ts` — stubs for TIME-02

*Existing infrastructure covers framework needs: Vitest 4.1 + jsdom configured, @testing-library/react available, existing test patterns in src/data/__tests__/*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Sliding tab indicator animation | SKTL-02 | layoutId animation cannot be asserted in jsdom | Click each tab, verify indicator slides smoothly between tabs |
| Blur/scale/opacity tab content transition | SKTL-04 | AnimatePresence animation cannot be meaningfully tested in jsdom | Switch tabs, verify content fades out and in with blur+scale |
| SVG path draws on scroll | TIME-01 | Scroll-linked pathLength requires real scroll environment | Scroll to timeline section, verify path draws progressively |
| Pulse ring animation on activation | TIME-03 | CSS animation requires visual verification | Scroll past timeline nodes, verify pulse ring effect on activation |
| Content fades in with node activation | TIME-04 | Scroll-linked opacity requires real scroll environment | Scroll past timeline nodes, verify content fades in as nodes activate |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
