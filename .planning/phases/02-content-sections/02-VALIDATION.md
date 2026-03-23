---
phase: 2
slug: content-sections
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-22
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.0 |
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
| 02-01-01 | 01 | 0 | SKIL-01, SKIL-02, SKIL-03 | unit | `npx vitest run src/data/__tests__/skills.test.ts -x` | ❌ W0 | ⬜ pending |
| 02-01-02 | 01 | 0 | TOOL-01, TOOL-02, TOOL-03 | unit | `npx vitest run src/data/__tests__/tooling.test.ts -x` | ❌ W0 | ⬜ pending |
| 02-01-03 | 01 | 0 | CRSE-01, CRSE-02, CRSE-03 | unit | `npx vitest run src/data/__tests__/coursework.test.ts -x` | ❌ W0 | ⬜ pending |
| 02-01-04 | 01 | 0 | TIME-01, TIME-02, TIME-04 | unit | `npx vitest run src/data/__tests__/timeline.test.ts -x` | ❌ W0 | ⬜ pending |
| 02-01-05 | 01 | 0 | CONT-01, CONT-02, CONT-03 | unit | `npx vitest run src/data/__tests__/contact.test.ts -x` | ❌ W0 | ⬜ pending |
| 02-02-01 | 02 | 1 | SKIL-01, SKIL-02, SKIL-03, SKIL-04 | unit | `npx vitest run src/data/__tests__/skills.test.ts -x` | ❌ W0 | ⬜ pending |
| 02-02-02 | 02 | 1 | TOOL-01, TOOL-02, TOOL-03 | unit | `npx vitest run src/data/__tests__/tooling.test.ts -x` | ❌ W0 | ⬜ pending |
| 02-02-03 | 02 | 1 | CRSE-01, CRSE-02, CRSE-03 | unit | `npx vitest run src/data/__tests__/coursework.test.ts -x` | ❌ W0 | ⬜ pending |
| 02-03-01 | 03 | 2 | TIME-01, TIME-02, TIME-03, TIME-04 | unit+manual | `npx vitest run src/data/__tests__/timeline.test.ts -x` | ❌ W0 | ⬜ pending |
| 02-03-02 | 03 | 2 | CONT-01, CONT-02, CONT-03, CONT-04 | unit+manual | `npx vitest run src/data/__tests__/contact.test.ts -x` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/data/__tests__/skills.test.ts` — stubs for SKIL-01, SKIL-02, SKIL-03
- [ ] `src/data/__tests__/tooling.test.ts` — stubs for TOOL-01, TOOL-02, TOOL-03
- [ ] `src/data/__tests__/coursework.test.ts` — stubs for CRSE-01, CRSE-02, CRSE-03
- [ ] `src/data/__tests__/timeline.test.ts` — stubs for TIME-01, TIME-02, TIME-04
- [ ] `src/data/__tests__/contact.test.ts` — stubs for CONT-01, CONT-02, CONT-03
- [ ] `src/styles/__tests__/motion.test.ts` — update existing test to cover new animation variants

*Existing infrastructure covers test framework — Vitest already configured from Phase 1.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Semantic HTML structure (skills) | SKIL-04 | DOM structure inspection | Verify `<section>`, `<ul>`, `<li>` elements with descriptive aria labels in browser DevTools |
| Scroll-driven timeline fill | TIME-03 | Scroll animation requires visual verification | Scroll page, confirm line fills progressively and nodes activate at correct thresholds |
| Semantic markup (contact) | CONT-04 | DOM structure inspection | Verify `<section>`, `<address>`, `<a>` elements with correct aria labels and rel attributes |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
