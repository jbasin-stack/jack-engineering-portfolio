---
phase: 05
slug: visual-design-overhaul
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-23
---

# Phase 05 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.0 + jsdom |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 05-01-00 | 01 | 0 | VIS-01..04 | unit | `npx vitest run src/styles/__tests__/colors.test.ts src/components/effects/__tests__/effects.test.ts src/tests/imports.test.ts` | ❌ W0 | ⬜ pending |
| 05-01-01 | 01 | 1 | VIS-01 | unit | `npx vitest run src/styles/__tests__/colors.test.ts -t "uw-purple"` | ❌ W0 | ⬜ pending |
| 05-01-02 | 01 | 1 | VIS-02 | unit | `npx vitest run src/styles/__tests__/colors.test.ts -t "aurora"` | ❌ W0 | ⬜ pending |
| 05-02-01 | 02 | 1 | VIS-03 | unit | `npx vitest run src/components/effects/__tests__/effects.test.ts` | ❌ W0 | ⬜ pending |
| 05-02-02 | 02 | 1 | VIS-04 | unit | `npx vitest run src/tests/imports.test.ts -t "framer-motion"` | ❌ W0 | ⬜ pending |
| 05-03-01 | 03 | 1 | VIS-05 | manual | Manual browser test with OS accessibility setting | N/A | ⬜ pending |
| 05-03-02 | 03 | 1 | VIS-06 | manual | Manual test: expand/collapse project card | N/A | ⬜ pending |
| 05-03-03 | 03 | 1 | VIS-07 | unit | `npx vitest run src/styles/__tests__/motion.test.ts -t "spring"` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/styles/__tests__/colors.test.ts` — verify UW color tokens exist in CSS theme
- [ ] `src/components/effects/__tests__/effects.test.ts` — verify effect components export correctly
- [ ] `src/tests/imports.test.ts` — verify no framer-motion imports remain in codebase

*Existing test infrastructure (vitest, jsdom) covers framework needs.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| prefers-reduced-motion disables canvas effects | VIS-05 | Requires OS-level accessibility setting toggle | Toggle "Reduce motion" in OS settings, reload site, verify no canvas animations run |
| Card Spotlight doesn't break layout animations | VIS-06 | Requires visual verification of animation interaction | Hover over project card, click to expand, verify layout animation still works smoothly |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
