---
phase: 13
slug: animated-hero-gradient
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-27
---

# Phase 13 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 4.1.0 |
| **Config file** | vitest.config.ts |
| **Quick run command** | `npx vitest run src/styles/__tests__/hero-gradient.test.ts` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run src/styles/__tests__/hero-gradient.test.ts`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 13-01-01 | 01 | 0 | HERO-01, HERO-02, HERO-03 | unit (CSS file parse) | `npx vitest run src/styles/__tests__/hero-gradient.test.ts` | ❌ W0 | ⬜ pending |
| 13-02-01 | 02 | 1 | HERO-01 | unit (CSS file parse) | `npx vitest run src/styles/__tests__/hero-gradient.test.ts -t "breathing"` | ❌ W0 | ⬜ pending |
| 13-02-02 | 02 | 1 | HERO-02 | unit (CSS file parse) | `npx vitest run src/styles/__tests__/hero-gradient.test.ts -t "custom properties"` | ❌ W0 | ⬜ pending |
| 13-02-03 | 02 | 1 | HERO-02 | unit (CSS file parse) | `npx vitest run src/styles/__tests__/hero-gradient.test.ts -t "oklch"` | ❌ W0 | ⬜ pending |
| 13-02-04 | 02 | 1 | HERO-01 | unit (component) | `npx vitest run src/styles/__tests__/hero-gradient.test.ts -t "gradient div"` | ❌ W0 | ⬜ pending |
| 13-02-05 | 02 | 1 | HERO-03 | unit (CSS file parse) | `npx vitest run src/styles/__tests__/hero-gradient.test.ts -t "reduced-motion"` | ❌ W0 | ⬜ pending |
| 13-02-06 | 02 | 1 | HERO-03 | unit (CSS file parse) | `npx vitest run src/styles/__tests__/hero-gradient.test.ts -t "static opacity"` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/styles/__tests__/hero-gradient.test.ts` — stubs for HERO-01, HERO-02, HERO-03 (CSS file parsing tests following existing colors.test.ts and theme.test.ts patterns)

*Test pattern: read app.css and Hero.tsx with `readFileSync`, assert presence of keyframes, custom properties, reduced-motion rules, and gradient div.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Gradient visually blends into page background | HERO-02 | Visual aesthetics cannot be automated | View hero section in both light/dark mode, verify no visible seam at gradient edges |
| Breathing animation feels subtle/ambient | HERO-01 | Subjective animation quality | Watch animation for 2+ cycles, verify it feels calm not alarming |
| Dark mode gradient visible but not overpowering | HERO-02 | Color perception on real display | Toggle to dark mode, verify gradient is visible and subtle |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
