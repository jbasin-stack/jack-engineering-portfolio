---
phase: 6
slug: static-assets-and-integration-fixes
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-24
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.0 |
| **Config file** | vitest.config.ts |
| **Quick run command** | `npx vitest --run` |
| **Full suite command** | `npx vitest --run` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest --run`
- **After every plan wave:** Run `npx vitest --run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 06-01-01 | 01 | 1 | CONT-03 | unit (file existence) | `npx vitest --run src/data/__tests__/contact.test.ts` | ✅ (needs asset test) | ⬜ pending |
| 06-01-02 | 01 | 1 | DOCS-01 | unit (file existence) | `npx vitest --run src/data/__tests__/papers.test.ts` | ✅ (needs asset test) | ⬜ pending |
| 06-01-03 | 01 | 1 | PROJ-02 | unit (file existence) | `npx vitest --run src/data/__tests__/projects.test.ts` | ✅ (needs asset test) | ⬜ pending |
| 06-02-01 | 02 | 1 | NAV-02 | unit | `npx vitest --run src/data/__tests__/navigation.test.ts` | ✅ (needs assertion update) | ⬜ pending |
| 06-02-02 | 02 | 1 | DOCS-02, DOCS-04 | manual-only | Manual: open PDF in browser | N/A | ⬜ pending |
| 06-03-01 | 03 | 2 | — | unit | `npx vitest --run src/data/__tests__/motion.test.ts` | ✅ (needs update) | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Static asset placeholder files (PDFs, SVGs, JPG) in `public/` — must exist before asset existence tests can pass
- [ ] Navigation test assertion update for Timeline addition (Background children 2→3)
- [ ] Motion test import/assertion cleanup for removed exports

*Existing infrastructure covers framework and config — Wave 0 is asset and test prep only.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| PdfViewer renders paper PDFs without error | DOCS-02 | Requires browser rendering | Open paper detail, click PDF link, verify renders |
| Resume renders in PdfViewer | DOCS-04 | Requires browser rendering | Click "View Resume" in contact section, verify PDF renders |
| Portrait image renders visually correct | — | Visual quality check | Load page, verify portrait.jpg is visible and correct |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
