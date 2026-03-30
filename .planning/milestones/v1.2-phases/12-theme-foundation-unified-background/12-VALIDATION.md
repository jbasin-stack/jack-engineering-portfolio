---
phase: 12
slug: theme-foundation-unified-background
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-26
---

# Phase 12 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 4.1.0 |
| **Config file** | vitest.config.ts |
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
| 12-01-01 | 01 | 0 | THEME-01 | unit | `npx vitest run src/styles/__tests__/theme.test.ts -t "system preference" -x` | ❌ W0 | ⬜ pending |
| 12-01-02 | 01 | 0 | THEME-02 | unit | `npx vitest run src/styles/__tests__/colors.test.ts -x` | ✅ (needs expansion) | ⬜ pending |
| 12-01-03 | 01 | 0 | THEME-03 | unit | `npx vitest run src/styles/__tests__/theme.test.ts -t "unified background" -x` | ❌ W0 | ⬜ pending |
| 12-01-04 | 01 | 0 | THEME-04 | unit | `npx vitest run src/styles/__tests__/theme.test.ts -t "transition" -x` | ❌ W0 | ⬜ pending |
| 12-01-05 | 01 | 0 | THEME-05 | unit | `npx vitest run src/styles/__tests__/theme.test.ts -t "blocking script" -x` | ❌ W0 | ⬜ pending |
| 12-01-06 | 01 | 0 | THEME-06 | unit | `npx vitest run src/styles/__tests__/theme.test.ts -t "pdf viewer" -x` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/styles/__tests__/theme.test.ts` — stubs for THEME-01, THEME-03, THEME-04, THEME-05, THEME-06
- [ ] Expand `src/styles/__tests__/colors.test.ts` — add dark mode token assertions for THEME-02
- [ ] Test that `index.html` contains the blocking script (string assertion on file content)
- [ ] Test that `app.css` contains `.dark` block with required tokens
- [ ] Test that section components no longer import/render NoisyBackground or AnimatedGridPattern

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Smooth color transition on theme toggle | THEME-04 | Visual perception — unit tests can verify transition CSS exists but not perceived smoothness | 1. Open site in Chrome 2. Toggle system dark mode 3. Verify no jarring flash, colors smoothly transition |
| No visual seams between sections | THEME-03 | Layout rendering judgment | 1. Scroll from hero to footer 2. Verify continuous gradient with no hard color breaks |
| PDF viewer readability in both modes | THEME-06 | Content rendering quality | 1. Open PDF viewer in light mode 2. Switch to dark mode 3. Verify chrome and content are readable |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
