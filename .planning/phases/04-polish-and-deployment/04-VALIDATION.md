---
phase: 4
slug: polish-and-deployment
status: draft
nyquist_compliant: false
wave_0_complete: false
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
| 04-01-01 | 01 | 1 | PERF-02 | unit | `npx vitest run src/tests/semantic-html.test.ts -x` | ❌ W0 | ⬜ pending |
| 04-01-02 | 01 | 1 | PERF-03 | unit | `npx vitest run src/tests/og-tags.test.ts -x` | ❌ W0 | ⬜ pending |
| 04-01-03 | 01 | 1 | PERF-04 | unit | `npx vitest run src/tests/bundle.test.ts -x` | ❌ W0 | ⬜ pending |
| 04-01-04 | 01 | 1 | PERF-05 | smoke | `npm run build` | ✅ | ⬜ pending |
| 04-01-05 | 01 | 1 | PERF-01 | manual | N/A | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/tests/semantic-html.test.ts` — verify heading hierarchy and semantic elements for PERF-02
- [ ] `src/tests/og-tags.test.ts` — verify OG meta tags exist in index.html for PERF-03
- [ ] `src/tests/bundle.test.ts` — verify code splitting produces separate chunks for PERF-04

*Existing infrastructure covers build smoke test (PERF-05).*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Responsive layout at mobile/tablet/desktop | PERF-01 | Visual rendering, overflow, and touch targets cannot be verified via DOM testing | Run `npm run dev`, test at 375px (mobile), 768px (tablet), 1280px (desktop) widths; verify grids collapse correctly, no horizontal overflow, all content accessible |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
