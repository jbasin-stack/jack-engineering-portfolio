---
phase: 10
slug: content-editors
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-26
---

# Phase 10 — Validation Strategy

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
| 10-01-01 | 01 | 1 | EDIT-10 | unit | `npx vitest run src/admin/schemas.test.ts -x` | ❌ W0 | ⬜ pending |
| 10-01-02 | 01 | 1 | EDIT-01 | unit | `npx vitest run src/admin/editors/HeroEditor.test.tsx -x` | ❌ W0 | ⬜ pending |
| 10-01-03 | 01 | 1 | EDIT-11 | unit | `npx vitest run src/admin/useContentEditor.test.ts -x` | ❌ W0 | ⬜ pending |
| 10-01-04 | 01 | 1 | EDIT-01 | integration | Manual: open admin, edit Hero, save, verify file | N/A | ⬜ pending |
| 10-02-01 | 02 | 2 | EDIT-04, EDIT-05, EDIT-06, EDIT-07 | integration | Manual: edit each list-type editor, save, verify | N/A | ⬜ pending |
| 10-03-01 | 03 | 3 | EDIT-08, EDIT-09 | integration | Manual: edit Papers/Projects, nested arrays, upload, save | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/admin/schemas.test.ts` — Zod schema validation tests for all 9 content types (EDIT-10)
- [ ] `src/admin/useContentEditor.test.ts` — save flow with toast feedback (EDIT-11)
- [ ] Vitest + jsdom already configured — no framework install needed

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Each editor accessible from admin sidebar | EDIT-01..09 | UI navigation requires browser | Open admin, click each nav item, verify editor renders |
| Save writes to correct .ts data file | EDIT-01..09 | File write via Vite dev server | Edit field, save, check `src/data/*.ts` |
| Preview updates after save | EDIT-01..09 | HMR + iframe refresh | Save, verify preview iframe shows new content |
| Inline validation errors display | EDIT-10 | Visual check required | Submit empty required field, verify red border + error text |
| Toast feedback on save | EDIT-11 | Visual check required | Save valid data → green toast; save invalid → red toast |
| Projects nested array editing | EDIT-09 | Complex UI interaction | Add/remove techStack tags, links rows, upload thumbnail |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
