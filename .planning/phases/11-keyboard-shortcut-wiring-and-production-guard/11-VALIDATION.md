---
phase: 11
slug: keyboard-shortcut-wiring-and-production-guard
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-26
---

# Phase 11 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.0 |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run --reporter=verbose` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run --reporter=verbose && npx tsc -b`
- **Before `/gsd:verify-work`:** Full suite must be green + `npx vite build` + grep verification
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 11-01-01 | 01 | 0 | INFRA-01, INT-01 | unit | `npx vitest run src/tests/imports.test.ts` | ❌ W0 | ⬜ pending |
| 11-01-02 | 01 | 0 | INT-02, INT-03 | unit | `npx vitest run src/admin/__tests__/keyboard-shortcuts.test.ts` | ❌ W0 | ⬜ pending |
| 11-01-03 | 01 | 1 | INT-01 | source | Verify no static import of `useKeyboardShortcuts` in App.tsx | ✅ | ⬜ pending |
| 11-01-04 | 01 | 1 | INFRA-01 | source | Verify all admin state in App.tsx behind `import.meta.env.DEV` | ✅ | ⬜ pending |
| 11-01-05 | 01 | 1 | INT-02 | unit | `npx vitest run src/admin/__tests__/keyboard-shortcuts.test.ts` | ❌ W0 | ⬜ pending |
| 11-01-06 | 01 | 1 | INT-03 | unit | `npx vitest run src/admin/__tests__/keyboard-shortcuts.test.ts` | ❌ W0 | ⬜ pending |
| 11-01-07 | 01 | 1 | INFRA-01 | integration | `npx vite build && grep -r "useKeyboardShortcuts" dist/ && echo FAIL \|\| echo PASS` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/admin/__tests__/keyboard-shortcuts.test.ts` — test stubs for Ctrl+S save, Escape dirty confirmation, save-in-progress guard
- [ ] Extend `src/tests/imports.test.ts` — verify no admin imports in production App.tsx (INFRA-01, INT-01)

*Existing infrastructure covers test framework and config.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Ctrl+S shows green success toast | INT-02 | Toast visual requires browser | 1. Open admin panel 2. Edit content 3. Press Ctrl+S 4. Verify green toast appears |
| Escape shows confirm dialog when dirty | INT-03 | `window.confirm()` requires browser | 1. Open admin panel 2. Edit content 3. Press Escape 4. Verify confirm dialog appears |
| Browser Save Page dialog works when panel closed | INFRA-01 | Browser native dialog | 1. Close admin panel 2. Press Ctrl+S 3. Verify browser Save Page dialog appears |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
