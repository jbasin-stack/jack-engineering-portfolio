---
phase: 15
slug: contact-footer-cleanup
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-30
---

# Phase 15 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 4.1.0 |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run --reporter=verbose` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run --reporter=verbose && npx tsc -b && npx vite build`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 15-01-01 | 01 | 1 | CTFT-01 | unit (file content scan) | `npx vitest run src/tests/bundle.test.ts -x` | ✅ (needs update) | ⬜ pending |
| 15-01-02 | 01 | 1 | CTFT-02 | unit (file content scan) | `npx vitest run src/components/effects/__tests__/effects.test.ts -x` | ✅ (needs update) | ⬜ pending |
| 15-01-03 | 01 | 1 | CTFT-03 | smoke | `npx vitest run src/tests/semantic-html.test.ts -x` | ✅ (add footer assertions) | ⬜ pending |
| 15-02-01 | 02 | 1 | CTFT-ALL | build | `npx tsc -b && npx vite build` | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/tests/bundle.test.ts` — remove Contact/LazyPdfViewer assertion (lines 20-25)
- [ ] `src/components/effects/__tests__/effects.test.ts` — reduce to CardSpotlight-only test
- [ ] `src/styles/__tests__/colors.test.ts` — remove aurora keyframe assertions (lines 89-101)
- [ ] Production build verification: `npx vite build` must succeed with no warnings

*Existing infrastructure covers framework needs; only assertion updates required.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Hover animation on contact icons | CTFT-01 | Visual interaction | Hover each icon, verify scale/color transition |
| Footer visual appearance | CTFT-02 | Visual layout | Scroll to bottom, verify copyright line and minimal styling |
| No deprecated component refs in bundle | CTFT-03 | Build output inspection | Run `npx vite build`, grep dist/ for NoisyBackground, AnimatedGridPattern |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
