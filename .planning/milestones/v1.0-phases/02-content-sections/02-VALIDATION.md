---
phase: 02
slug: content-sections
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-22
---

# Phase 02 — Validation Strategy

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
| 02-01-01 | 01 | 1 | SKIL-03, TOOL-03, CRSE-03, TIME-02, TIME-04, CONT-03 | unit | `npx vitest run --reporter=verbose` | No -- Wave 0 | ⬜ pending |
| 02-01-02 | 01 | 1 | SKIL-01, SKIL-02, TOOL-01, TOOL-02, CRSE-01, CRSE-02, TIME-01, CONT-01, CONT-02 | unit | `npx vitest run --reporter=verbose` | No -- Wave 0 | ⬜ pending |
| 02-02-01 | 02 | 2 | SKIL-01, SKIL-02, SKIL-04, TOOL-01, TOOL-02, CRSE-01, CRSE-02 | unit + tsc | `npx tsc --noEmit && npx vitest run` | ❌ W0 | ⬜ pending |
| 02-03-01 | 03 | 2 | TIME-01, TIME-03 | unit + manual | `npx tsc --noEmit && npx vitest run` | ❌ W0 | ⬜ pending |
| 02-03-02 | 03 | 2 | CONT-01, CONT-02, CONT-04 | unit + tsc | `npx tsc --noEmit && npx vitest run` | ❌ W0 | ⬜ pending |
| 02-04-01 | 04 | 3 | SKIL-01, SKIL-02, CONT-03, TIME-01, TIME-02 | build + manual | `npx tsc --noEmit && npx vite build && npx vitest run` | ✅ | ⬜ pending |
| 02-04-02 | 04 | 3 | all | manual | Visual checkpoint | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/data/__tests__/skills.test.ts` — stubs for SKIL-01, SKIL-02, SKIL-03
- [ ] `src/data/__tests__/tooling.test.ts` — stubs for TOOL-01, TOOL-02, TOOL-03
- [ ] `src/data/__tests__/coursework.test.ts` — stubs for CRSE-01, CRSE-02, CRSE-03
- [ ] `src/data/__tests__/timeline.test.ts` — stubs for TIME-01, TIME-02, TIME-04
- [ ] `src/data/__tests__/contact.test.ts` — stubs for CONT-01, CONT-02, CONT-03
- [ ] `src/styles/__tests__/motion.test.ts` — UPDATE existing test to cover sectionVariants and fadeUpVariant (no-spring check)

*Note: Plan 02-01 Task 2 creates all Wave 0 test files as part of its TDD approach.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Semantic HTML structure (Skills, Tooling) | SKIL-04 | DOM structure needs visual/inspector verification | Inspect rendered HTML for section, h2, h3, ul, li elements with aria-labels |
| Scroll-driven timeline fill animation | TIME-03 | Scroll-linked animation requires browser interaction | Scroll through timeline section, verify accent fill progresses, nodes activate, content fades in |
| Semantic markup (Contact) | CONT-04 | DOM structure needs visual/inspector verification | Inspect for address element, aria-label, rel attributes on external links |
| Visual verification checkpoint | all | Full page integration requires human approval | Plan 02-04 Task 2 checkpoint covers all 8 verification areas |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
