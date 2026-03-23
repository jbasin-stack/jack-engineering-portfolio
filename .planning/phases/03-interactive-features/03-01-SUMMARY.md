---
phase: 03-interactive-features
plan: 01
subsystem: ui
tags: [shadcn, react-pdf, dialog, drawer, typescript, data-layer, hooks]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: Tailwind v4, motion.ts, Vite config, TypeScript data patterns
  - phase: 02-content-sections
    provides: Existing type interfaces in data.ts, section component patterns
provides:
  - shadcn Dialog and Drawer components at @/components/ui/
  - react-pdf installed with stable PDF worker at public/pdf.worker.min.mjs
  - Project and Paper TypeScript interfaces
  - Typed data files for 4 projects (1 featured) and 3 papers
  - useIsMobile responsive hook
  - layoutTransition tween config for card animations
  - Data shape test scaffolds for projects and papers
affects: [03-02, 03-03, 03-04]

# Tech tracking
tech-stack:
  added: [react-pdf, pdfjs-dist, shadcn/ui, @base-ui/react, vaul, clsx, tailwind-merge, tw-animate-css]
  patterns: [responsive Dialog/Drawer via useIsMobile, shadcn component pattern with cn() utility]

key-files:
  created:
    - src/components/ui/dialog.tsx
    - src/components/ui/drawer.tsx
    - src/data/projects.ts
    - src/data/papers.ts
    - src/hooks/useIsMobile.ts
    - src/data/__tests__/projects.test.ts
    - src/data/__tests__/papers.test.ts
    - public/pdf.worker.min.mjs
    - src/lib/utils.ts
    - components.json
  modified:
    - src/types/data.ts
    - src/styles/app.css
    - src/styles/motion.ts
    - src/styles/__tests__/motion.test.ts
    - package.json
    - tsconfig.app.json
    - tsconfig.json
    - vite.config.ts

key-decisions:
  - "shadcn v4 CLI used Base UI (not Radix) for Dialog -- accepted as the current default"
  - "Removed Geist font import, preserved Inter as font-sans across both @theme blocks"
  - "Mapped shadcn --background/--foreground CSS vars to cleanroom/ink oklch values"
  - "Removed .dark theme block (portfolio is light-only)"
  - "PDF worker copied to public/ for stable production path (not import.meta.url)"

patterns-established:
  - "shadcn components use @/ path alias with cn() utility from src/lib/utils.ts"
  - "Responsive modal pattern: useIsMobile() hook selects Dialog (desktop) vs Drawer (mobile)"
  - "Data files follow import type { T } from '../types/data' convention"

requirements-completed: [PROJ-05, DOCS-05]

# Metrics
duration: 7min
completed: 2026-03-23
---

# Phase 3 Plan 01: Foundation Summary

**shadcn Dialog/Drawer, react-pdf with stable worker, Project/Paper typed data layer, useIsMobile hook, and tween layout transition config**

## Performance

- **Duration:** 7 min
- **Started:** 2026-03-23T16:35:00Z
- **Completed:** 2026-03-23T16:42:57Z
- **Tasks:** 2
- **Files modified:** 15

## Accomplishments
- Installed and configured shadcn/ui with Dialog and Drawer components, carefully merging CSS variables into existing cleanroom palette
- Installed react-pdf with PDF.js worker at stable public/ path for production reliability
- Created Project and Paper TypeScript interfaces with typed data files (4 projects across 4 ECE domains, 3 papers)
- Added useIsMobile hook for responsive Dialog/Drawer pattern and layoutTransition tween config
- All 52 tests pass including 12 new data shape validations and extended spring-check coverage

## Task Commits

Each task was committed atomically:

1. **Task 1: Install dependencies, configure path aliases, initialize shadcn, and copy PDF worker** - `2cc40fd` (feat)
2. **Task 2: Create Project and Paper interfaces, data files, useIsMobile hook, layout transition config, and test scaffolds** - `8adaed9` (feat)

## Files Created/Modified
- `src/components/ui/dialog.tsx` - shadcn Dialog component (Base UI)
- `src/components/ui/drawer.tsx` - shadcn Drawer component (Vaul)
- `src/components/ui/button.tsx` - shadcn Button component (updated by shadcn CLI)
- `src/lib/utils.ts` - cn() class merging utility
- `components.json` - shadcn configuration
- `src/types/data.ts` - Added Project and Paper interfaces
- `src/data/projects.ts` - 4 typed ECE project entries with 1 featured
- `src/data/papers.ts` - 3 typed academic paper entries
- `src/hooks/useIsMobile.ts` - Mobile detection hook using matchMedia at 768px
- `src/styles/motion.ts` - Added layoutTransition tween config
- `src/styles/app.css` - Merged shadcn CSS variables with cleanroom palette
- `public/pdf.worker.min.mjs` - PDF.js worker for stable production builds
- `src/data/__tests__/projects.test.ts` - 7 data shape validation tests
- `src/data/__tests__/papers.test.ts` - 4 data shape validation tests
- `src/styles/__tests__/motion.test.ts` - Extended with layoutTransition tween + spring checks

## Decisions Made
- shadcn v4 CLI defaulted to Base UI primitives instead of Radix for Dialog -- accepted as the current standard since it works identically from the consumer API perspective
- Removed the Geist font import added by shadcn init and kept Inter as the project's established font
- Mapped shadcn's `--background` and `--foreground` variables to the cleanroom/ink oklch values so shadcn components blend with the existing palette
- Removed the `.dark` theme block since this portfolio is light-only
- Copied PDF worker to `public/` with stable filename rather than using `import.meta.url` (avoids Vite hash-based 404s in production)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added path aliases to root tsconfig.json**
- **Found during:** Task 1 (shadcn init)
- **Issue:** shadcn CLI reads `tsconfig.json` (root), not `tsconfig.app.json`, and rejected init because no import alias was found
- **Fix:** Added `compilerOptions.baseUrl` and `compilerOptions.paths` to root `tsconfig.json` in addition to `tsconfig.app.json`
- **Files modified:** tsconfig.json
- **Verification:** shadcn init succeeded after the fix
- **Committed in:** Previously committed (was in git HEAD already)

**2. [Rule 1 - Bug] Restored cleanroom palette after shadcn CSS override**
- **Found during:** Task 1 (shadcn init)
- **Issue:** shadcn init overwrote `--font-sans` with Geist, added `@layer base` body styles with `bg-background text-foreground`, and added `--color-accent` that conflicted with existing cleanroom accent
- **Fix:** Manually merged app.css: restored Inter font, mapped shadcn vars to cleanroom values, kept body using `bg-cleanroom text-ink`, removed Geist import
- **Files modified:** src/styles/app.css
- **Verification:** Build succeeds, existing tests pass, cleanroom palette tokens preserved
- **Committed in:** 2cc40fd (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 bug)
**Impact on plan:** Both fixes were essential. The shadcn CSS merge was the most critical -- without it, the entire site would have lost its cleanroom palette. No scope creep.

## Issues Encountered
- shadcn CLI v4 used Base UI instead of Radix for Dialog (noted in research as a possibility). The consumer API is similar enough that downstream plans should work without changes.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- shadcn Dialog and Drawer ready for Plan 02 (ProjectDetail) and Plan 03 (PdfViewer)
- Project/Paper data files ready for Plan 02 (ProjectsSection) and Plan 03 (PapersSection)
- useIsMobile hook ready for responsive Dialog/Drawer pattern
- layoutTransition config ready for card expand/collapse animations
- react-pdf worker at stable path for Plan 03 PDF viewer component
- All 52 tests green, production build passing

## Self-Check: PASSED

All 11 key files verified present. Both task commits (2cc40fd, 8adaed9) found in git history.

---
*Phase: 03-interactive-features*
*Completed: 2026-03-23*
