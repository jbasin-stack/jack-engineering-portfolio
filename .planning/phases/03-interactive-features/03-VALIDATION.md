---
phase: 3
slug: interactive-features
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-23
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.0 |
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
| 03-01-01 | 01 | 1 | PROJ-01 | unit | `npx vitest run src/data/__tests__/projects.test.ts -t "projects" --reporter=verbose` | ❌ W0 | ⬜ pending |
| 03-01-02 | 01 | 1 | PROJ-02 | unit | `npx vitest run src/data/__tests__/projects.test.ts -t "required fields" --reporter=verbose` | ❌ W0 | ⬜ pending |
| 03-01-03 | 01 | 1 | PROJ-05 | unit | `npx vitest run src/data/__tests__/projects.test.ts --reporter=verbose` | ❌ W0 | ⬜ pending |
| 03-01-04 | 01 | 1 | PROJ-04 | unit | `npx vitest run src/styles/__tests__/motion.test.ts -t "spring" --reporter=verbose` | ✅ (extend) | ⬜ pending |
| 03-02-01 | 02 | 1 | DOCS-01 | unit | `npx vitest run src/data/__tests__/papers.test.ts --reporter=verbose` | ❌ W0 | ⬜ pending |
| 03-02-02 | 02 | 1 | DOCS-02 | unit | `npx vitest run src/data/__tests__/papers.test.ts -t "pdfPath" --reporter=verbose` | ❌ W0 | ⬜ pending |
| 03-02-03 | 02 | 1 | DOCS-04 | unit | `npx vitest run src/data/__tests__/papers.test.ts -t "resume" --reporter=verbose` | ❌ W0 | ⬜ pending |
| 03-02-04 | 02 | 1 | DOCS-03 | manual-only | Visual check for download button | N/A | ⬜ pending |
| 03-02-05 | 02 | 1 | DOCS-05 | smoke | `npm run build && npm run preview` | Manual | ⬜ pending |
| 03-01-05 | 01 | 1 | PROJ-03 | unit | `npx vitest run src/data/__tests__/projects.test.ts --reporter=verbose` | ❌ W0 | ⬜ pending |
| 03-01-06 | 01 | 1 | PROJ-06 | manual-only | Visual check at mobile breakpoint | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/data/__tests__/projects.test.ts` — stubs for PROJ-01, PROJ-02, PROJ-05 (data shape validation)
- [ ] `src/data/__tests__/papers.test.ts` — stubs for DOCS-01, DOCS-02, DOCS-04 (data shape validation)
- [ ] Extend `src/styles/__tests__/motion.test.ts` — add new layout transition configs to spring check

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Grid responsive to single-column on mobile | PROJ-06 | CSS breakpoint behavior, visual check | Resize browser to <640px, verify single column layout |
| Download fallback link present | DOCS-03 | UI element presence, visual check | Open PDF viewer, verify download button visible |
| react-pdf production build | DOCS-05 | Full build + serve required | Run `npm run build && npm run preview`, open PDF |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
