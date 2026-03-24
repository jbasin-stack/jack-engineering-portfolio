---
phase: 4
slug: polish-and-deployment
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-03-23
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.0 |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run`
- **After every plan wave:** Run `npx vitest run && npm run build`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 04-01-00 | 01 | 1 | PERF-02/03/04 | scaffold | `npx vitest run src/tests/ --reporter=verbose` | Created by Task 0 | ⬜ pending |
| 04-01-01 | 01 | 1 | PERF-04 | unit | `npx vitest run src/tests/bundle.test.ts src/tests/semantic-html.test.ts -x` | ✅ W0 | ⬜ pending |
| 04-01-02 | 01 | 1 | PERF-02/03 | unit | `npx vitest run src/tests/og-tags.test.ts src/tests/semantic-html.test.ts -x` | ✅ W0 | ⬜ pending |
| 04-01-03 | 01 | 1 | PERF-01 | smoke+unit | `npm run build && npx vitest run` | ✅ | ⬜ pending |
| 04-02-01 | 02 | 2 | PERF-05 | smoke | `npx vercel ls` | ✅ | ⬜ pending |
| 04-02-02 | 02 | 2 | PERF-05 | manual | N/A | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [x] `src/tests/semantic-html.test.ts` — verify heading hierarchy and semantic elements for PERF-02 (created by Task 0 in plan 04-01)
- [x] `src/tests/og-tags.test.ts` — verify OG meta tags exist in index.html for PERF-03 (created by Task 0 in plan 04-01)
- [x] `src/tests/bundle.test.ts` — verify code splitting produces separate chunks for PERF-04 (created by Task 0 in plan 04-01)

*All Wave 0 test files are created by Task 0 of plan 04-01 before any implementation tasks run.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Responsive layout at mobile/tablet/desktop | PERF-01 | Visual rendering, overflow, and touch targets cannot be verified via DOM testing | Run `npm run dev`, test at 375px (mobile), 768px (tablet), 1280px (desktop) widths; verify grids collapse correctly, no horizontal overflow, all content accessible |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 10s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved (revised 2026-03-23)
