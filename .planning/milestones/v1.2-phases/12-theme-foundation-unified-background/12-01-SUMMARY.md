---
phase: 12-theme-foundation-unified-background
plan: 01
subsystem: ui
tags: [oklch, dark-mode, css-variables, tailwind-v4, color-system, fout-prevention]

# Dependency graph
requires: []
provides:
  - Blue-tinted oklch color system with hue 250 across entire silicon palette
  - Complete .dark CSS variable overrides for all shadcn semantic tokens
  - Fixed @custom-variant dark selector for Tailwind v4 dark: prefix
  - Synchronous blocking script preventing FOUT on dark-mode systems
  - matchMedia listener for live system preference tracking
  - 300ms smooth CSS transitions for theme switching
  - Unified body gradient with transitionable custom property stops
  - color-scheme property for native UI theming (scrollbars, form controls)
affects: [12-02-PLAN, 12-03-PLAN, admin-theming, pdf-viewer-theming]

# Tech tracking
tech-stack:
  added: []
  removed: [next-themes]
  patterns: [css-variable-dark-mode, blocking-script-fout-prevention, system-preference-tracking, oklch-blue-tinted-neutrals]

key-files:
  created:
    - src/styles/__tests__/theme.test.ts
  modified:
    - src/styles/app.css
    - index.html
    - src/main.tsx
    - package.json
    - src/styles/__tests__/colors.test.ts

key-decisions:
  - "Silicon scale chroma bumped 2-3x (e.g., 0.005->0.012, 0.01->0.022) for visible blue tint"
  - "Cleanroom hue shifted from 90 to 250 for blue DNA consistency"
  - "Gradient uses CSS custom properties (--gradient-top, --gradient-bottom) for transitionable stops"
  - "Double-rAF no-transition pattern in blocking script for clean initial load"
  - "Removed next-themes; zero-JS dark mode via blocking script + matchMedia listener"

patterns-established:
  - "CSS variable dark mode: .dark class on <html> overrides all shadcn semantic tokens"
  - "FOUT prevention: synchronous inline script in <head> before any CSS/JS modules"
  - "System preference tracking: matchMedia change listener in main.tsx entry point"
  - "Theme transitions: global 300ms ease on background-color, color, border-color with no-transition suppression"

requirements-completed: [THEME-01, THEME-02, THEME-04, THEME-05]

# Metrics
duration: 3min
completed: 2026-03-26
---

# Phase 12 Plan 01: Color System & Dark Mode Infrastructure Summary

**Blue-tinted oklch color system (hue 250, 2-3x chroma) with complete .dark CSS overrides, FOUT-preventing blocking script, and 300ms smooth theme transitions**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-26T22:37:24Z
- **Completed:** 2026-03-26T22:40:44Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments
- Complete blue-tinted oklch color system with silicon scale chroma bumped 2-3x for visible blue across all steps
- Full .dark class block with all shadcn semantic tokens, sidebar tokens, palette overrides, and gradient custom properties
- Fixed @custom-variant dark selector bug (:is -> :where for zero specificity)
- Synchronous blocking script in index.html prevents dark mode FOUT
- matchMedia listener in main.tsx tracks live system preference changes
- Removed unused next-themes package
- 47 tests pass across 3 test files

## Task Commits

Each task was committed atomically:

1. **Task 1: Build color system and dark mode CSS infrastructure** - `e2c65c5` (feat)
2. **Task 2: Add blocking script, system preference listener, and remove next-themes** - `0ef4730` (feat)

## Files Created/Modified
- `src/styles/app.css` - Complete color system with .dark overrides, transitions, gradient custom properties, fixed @custom-variant
- `index.html` - Blocking script that applies .dark class before first paint
- `src/main.tsx` - matchMedia change listener for live system preference tracking
- `package.json` - Removed next-themes dependency
- `src/styles/__tests__/theme.test.ts` - Tests for dark tokens, selector, transitions, gradients, blocking script
- `src/styles/__tests__/colors.test.ts` - Expanded with dark mode token, silicon chroma, cleanroom hue tests

## Decisions Made
- Bumped silicon scale chroma uniformly 2-3x (e.g., silicon-50: 0.005->0.012, silicon-200: 0.01->0.022) for visible blue tint at every step
- Shifted cleanroom hue from 90 to 250 to maintain blue DNA consistency across the entire palette
- Used CSS custom properties for gradient stops (--gradient-top, --gradient-bottom) to enable transitionable gradients
- Double-rAF pattern in blocking script ensures no-transition class is removed only after first paint cycle
- System-preference-only dark mode requires zero React state -- pure CSS + two small scripts

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Color system and dark mode infrastructure complete, ready for Plan 02 (unified background, section transparency)
- All shadcn components will auto-theme when .dark class is applied (semantic tokens already mapped)
- Admin panel hardcoded colors ready for Plan 03 semantic token replacement
- Gradient custom properties ready for unified background in Plan 02

## Self-Check: PASSED

All 5 key files exist. Both task commits (e2c65c5, 0ef4730) verified in git log.

---
*Phase: 12-theme-foundation-unified-background*
*Completed: 2026-03-26*
