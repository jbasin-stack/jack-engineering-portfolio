---
phase: 9
slug: admin-shell-preview-and-asset-pipeline
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-25
---

# Phase 9 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 4.1.0 |
| **Config file** | `vitest.config.ts` |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run && npx tsc -b --noEmit`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 09-01-01 | 01 | 1 | PREV-01 | unit (component) | `npx vitest run src/admin/__tests__/AdminShell.test.tsx -t "split-pane"` | ❌ W0 | ⬜ pending |
| 09-01-02 | 01 | 1 | PREV-03 | unit (component) | `npx vitest run src/admin/__tests__/AdminShell.test.tsx -t "resize"` | ❌ W0 | ⬜ pending |
| 09-02-01 | 02 | 1 | ASSET-01 | unit (server) | `npx vitest run src/admin/__tests__/upload.test.ts -t "image upload"` | ❌ W0 | ⬜ pending |
| 09-02-02 | 02 | 1 | ASSET-02 | unit (server) | `npx vitest run src/admin/__tests__/upload.test.ts -t "pdf upload"` | ❌ W0 | ⬜ pending |
| 09-02-03 | 02 | 1 | ASSET-03 | unit | `npx vitest run src/admin/__tests__/upload.test.ts -t "kebab-case"` | ❌ W0 | ⬜ pending |
| 09-02-04 | 02 | 1 | ASSET-04 | unit (server) | `npx vitest run src/admin/__tests__/upload.test.ts -t "validation"` | ❌ W0 | ⬜ pending |
| 09-03-01 | 03 | 2 | PREV-02 | manual | Manual verification — requires running dev server | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/admin/__tests__/upload.test.ts` — stubs for ASSET-01, ASSET-02, ASSET-03, ASSET-04
- [ ] `src/admin/__tests__/AdminShell.test.tsx` — stubs for PREV-01, PREV-03
- [ ] `npm install react-resizable-panels sonner` — required for component tests
- [ ] `npm install -D busboy @types/busboy` — required for upload tests

*Wave 0 creates test stubs that initially fail, then pass as implementation proceeds.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Saving content triggers HMR preview update | PREV-02 | Requires live Vite dev server with HMR | 1. Open `?admin` 2. Edit content and save 3. Verify portfolio updates without manual refresh |
| Drag divider resizes panes smoothly | PREV-03 | Visual smoothness not testable in jsdom | 1. Open `?admin` 2. Drag the separator between panels 3. Verify both panes resize without jank |
| Drag-over feedback states (dashed→solid, invalid red) | ASSET-01 | Visual feedback requires real browser drag events | 1. Drag image over upload zone 2. Verify border transitions 3. Drag .exe file and verify red rejection state |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
