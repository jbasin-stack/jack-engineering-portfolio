---
phase: 8
slug: admin-infrastructure
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-24
---

# Phase 8 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.0 |
| **Config file** | `vitest.config.ts` (exists, jsdom environment, globals enabled) |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run && npx tsc -b`
- **Before `/gsd:verify-work`:** Full suite must be green + `vite build` + grep verification
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 08-01-01 | 01 | 0 | INFRA-03 | unit | `npx vitest run src/admin/__tests__/codegen.test.ts -x` | ❌ W0 | ⬜ pending |
| 08-01-02 | 01 | 0 | INFRA-04 | unit | `npx vitest run src/admin/__tests__/atomic-write.test.ts -x` | ❌ W0 | ⬜ pending |
| 08-01-03 | 01 | 0 | INFRA-02 | unit | `npx vitest run src/admin/__tests__/admin-api.test.ts -x` | ❌ W0 | ⬜ pending |
| 08-01-04 | 01 | 0 | INFRA-01 | integration | `npx vite build && ! grep -r "admin" dist/` | ❌ W0 | ⬜ pending |
| 08-02-01 | 02 | 1 | INFRA-01 | integration | `npx vite build && ! grep -r "admin" dist/` | ❌ W0 | ⬜ pending |
| 08-02-02 | 02 | 1 | INFRA-02 | unit | `npx vitest run src/admin/__tests__/admin-api.test.ts -x` | ❌ W0 | ⬜ pending |
| 08-03-01 | 03 | 1 | INFRA-03 | unit | `npx vitest run src/admin/__tests__/codegen.test.ts -x` | ❌ W0 | ⬜ pending |
| 08-03-02 | 03 | 1 | INFRA-04 | unit | `npx vitest run src/admin/__tests__/atomic-write.test.ts -x` | ❌ W0 | ⬜ pending |
| 08-04-01 | 04 | 2 | INFRA-05 | manual | Manual: write file, observe no HMR flood in terminal | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/admin/__tests__/codegen.test.ts` — stubs for INFRA-03 (TypeScript generation + formatting + validation)
- [ ] `src/admin/__tests__/atomic-write.test.ts` — stubs for INFRA-04 (temp file + rename + concurrent writes)
- [ ] `src/admin/__tests__/admin-api.test.ts` — stubs for INFRA-02 (GET/POST endpoint handlers)
- [ ] Build verification script for INFRA-01 (vitest test or shell script)
- [ ] `prettier` devDependency installed

*Existing data tests in `src/data/__tests__/*.test.ts` validate that data files maintain their structure after admin writes — these serve as regression tests.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| HMR not triggered during admin writes | INFRA-05 | Requires running Vite dev server and observing terminal output for HMR flooding | 1. Start dev server (`npm run dev`) 2. Open `?admin` 3. Save content 5 times rapidly 4. Verify terminal shows no repeated `[vite] hmr update` messages |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
