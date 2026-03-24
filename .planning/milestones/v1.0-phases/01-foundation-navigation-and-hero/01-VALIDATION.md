---
phase: 1
slug: foundation-navigation-and-hero
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-20
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest (included with Vite 8 ecosystem) |
| **Config file** | none — Wave 0 installs |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vite build && npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 0 | FNDN-01 | smoke | `npx vite build` | N/A | ⬜ pending |
| 01-01-02 | 01 | 0 | FNDN-02 | unit | `npx vitest run src/data/ -x` | ❌ W0 | ⬜ pending |
| 01-01-03 | 01 | 0 | FNDN-05 | unit | `npx vitest run src/styles/motion -x` | ❌ W0 | ⬜ pending |
| 01-01-04 | 01 | 0 | NAV-02 | unit | `npx vitest run src/data/navigation -x` | ❌ W0 | ⬜ pending |
| 01-01-05 | 01 | 0 | HERO-02 | unit | `npx vitest run src/data/hero -x` | ❌ W0 | ⬜ pending |
| 01-02-01 | 02 | 1 | FNDN-03 | manual-only | Manual: scroll page, verify smooth momentum | N/A | ⬜ pending |
| 01-02-02 | 02 | 1 | FNDN-04 | manual-only | Manual: scroll while animations play, no stutter | N/A | ⬜ pending |
| 01-02-03 | 02 | 1 | FNDN-06 | manual-only | Manual: inspect on Retina vs non-Retina | N/A | ⬜ pending |
| 01-02-04 | 02 | 1 | FNDN-07 | manual-only | Manual: toggle OS reduced motion | N/A | ⬜ pending |
| 01-02-05 | 02 | 1 | FNDN-08 | manual-only | Manual: verify during code review | N/A | ⬜ pending |
| 01-03-01 | 03 | 1 | NAV-01 | manual-only | Manual: scroll and verify frosted glass | N/A | ⬜ pending |
| 01-03-02 | 03 | 1 | NAV-03 | manual-only | Manual: scroll through sections, verify highlight | N/A | ⬜ pending |
| 01-03-03 | 03 | 1 | NAV-04 | manual-only | Manual: click nav link, verify smooth scroll | N/A | ⬜ pending |
| 01-03-04 | 03 | 1 | NAV-05 | manual-only | Manual: resize to mobile, verify hamburger | N/A | ⬜ pending |
| 01-03-05 | 03 | 1 | HERO-01 | smoke | `npx vite build` + manual verify | N/A | ⬜ pending |
| 01-03-06 | 03 | 1 | HERO-03 | manual-only | Manual: verify font loads and spacing | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `vitest.config.ts` — test framework configuration
- [ ] `src/data/__tests__/navigation.test.ts` — validates nav data structure and types
- [ ] `src/data/__tests__/hero.test.ts` — validates hero data exports
- [ ] `src/styles/__tests__/motion.test.ts` — validates animation config uses tween, not spring
- [ ] Framework install: `npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom`

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Smooth scroll feel | FNDN-03 | Subjective scroll momentum feel | Scroll page up/down, verify smooth weighted momentum |
| Lenis+Motion sync | FNDN-04 | Visual stutter detection | Scroll while animations play, verify no jitter |
| 0.5px borders | FNDN-06 | Hardware-dependent rendering | Inspect on Retina and non-Retina displays |
| Reduced motion | FNDN-07 | OS setting interaction | Toggle OS reduced motion preference, verify animations stop |
| 21st.dev usage | FNDN-08 | Process verification | Review code to confirm 21st.dev components used |
| Glassmorphic nav | NAV-01 | Visual backdrop-blur effect | Scroll content behind nav, verify frosted glass |
| Scroll-spy | NAV-03 | Visual highlight tracking | Scroll through all sections, verify active item changes |
| Nav smooth scroll | NAV-04 | Smooth scroll behavior | Click each nav link, verify smooth scrolling |
| Mobile hamburger | NAV-05 | Responsive layout behavior | Resize to <768px, verify hamburger and overlay |
| Hero landing view | HERO-01 | Visual layout verification | Load page, verify hero fills viewport |
| Typography quality | HERO-03 | Visual font rendering | Verify Inter font loads, whitespace is generous |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
