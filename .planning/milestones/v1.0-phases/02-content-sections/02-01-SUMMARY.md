---
phase: 02-content-sections
plan: 01
subsystem: data
tags: [typescript, interfaces, motion, vitest, data-layer]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: "Base type interfaces (NavItem, HeroData, SocialLink), motion.ts easing curves, vitest test infrastructure"
provides:
  - "SkillGroup, ToolingGroup, Course, TimelineMilestone, ContactData type interfaces"
  - "5 typed data files: skills, tooling, coursework, timeline, contact"
  - "sectionVariants and fadeUpVariant motion variants for whileInView animations"
  - "19 data integrity tests + 4 motion variant tests"
affects: [02-02, 02-03, 02-04]

# Tech tracking
tech-stack:
  added: []
  patterns: ["typed data files importing interfaces from types/data.ts", "hidden/visible naming for whileInView variants"]

key-files:
  created:
    - src/data/skills.ts
    - src/data/tooling.ts
    - src/data/coursework.ts
    - src/data/timeline.ts
    - src/data/contact.ts
    - src/data/__tests__/skills.test.ts
    - src/data/__tests__/tooling.test.ts
    - src/data/__tests__/coursework.test.ts
    - src/data/__tests__/timeline.test.ts
    - src/data/__tests__/contact.test.ts
  modified:
    - src/types/data.ts
    - src/styles/motion.ts
    - src/styles/__tests__/motion.test.ts

key-decisions:
  - "ContactData.socialLinks reuses existing SocialLink interface for consistency with heroData"
  - "sectionVariants and fadeUpVariant use hidden/visible naming (not initial/animate) for whileInView prop consumption"

patterns-established:
  - "Data file pattern: import type from types/data, export typed const"
  - "whileInView variants use hidden/visible keys with tween-only transitions"

requirements-completed: [SKIL-03, TOOL-03, CRSE-03, TIME-02, TIME-04, CONT-03]

# Metrics
duration: 4min
completed: 2026-03-23
---

# Phase 2 Plan 01: Typed Data Layer Summary

**5 typed content data files (skills, tooling, coursework, timeline, contact) with interfaces, whileInView motion variants, and 23 new data integrity tests**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-23T00:45:18Z
- **Completed:** 2026-03-23T00:48:53Z
- **Tasks:** 2
- **Files modified:** 13

## Accomplishments
- Created 5 new type interfaces in data.ts (SkillGroup, ToolingGroup, Course, TimelineMilestone, ContactData)
- Built 5 content data files with real ECE-specific content: 4 skill domains, 3 tooling categories, 8 UW courses, 8 timeline milestones, contact info with GitHub/LinkedIn
- Added sectionVariants (stagger) and fadeUpVariant (tween fade-up) to motion.ts for section components
- 23 new tests (19 data integrity + 4 motion variant) bringing total from 17 to 40, all green

## Task Commits

Each task was committed atomically:

1. **Task 1 RED: Failing tests for data layer** - `057d228` (test)
2. **Task 1 GREEN: Typed data layer and motion variants** - `30da386` (feat)
3. **Task 2: Motion variant test coverage** - `7c50c7f` (test)

_TDD flow: Task 1 RED wrote 5 data test files, Task 1 GREEN implemented all source files, Task 2 extended motion tests._

## Files Created/Modified
- `src/types/data.ts` - Added SkillGroup, ToolingGroup, Course, TimelineMilestone, ContactData interfaces
- `src/data/skills.ts` - 4 domain groups (Fabrication, RF, Analog, Digital) with 17 skills
- `src/data/tooling.ts` - 3 categories (EDA Tools, Lab Equipment, Fabrication Processes) with 14 items
- `src/data/coursework.ts` - 8 UW ECE courses with codes, names, and descriptors
- `src/data/timeline.ts` - 8 chronological milestones from Sep 2021 to Sep 2024
- `src/data/contact.ts` - Email, resume path, GitHub/LinkedIn social links
- `src/styles/motion.ts` - sectionVariants and fadeUpVariant with Variants type import
- `src/data/__tests__/skills.test.ts` - 4 tests: array length, domain names, skill counts, string validation
- `src/data/__tests__/tooling.test.ts` - 3 tests: array length, category validation, item strings
- `src/data/__tests__/coursework.test.ts` - 4 tests: array length, code format, strings, no duplicates
- `src/data/__tests__/timeline.test.ts` - 3 tests: array bounds, field validation, chronological order
- `src/data/__tests__/contact.test.ts` - 5 tests: tagline, email, resumePath, social links, link fields
- `src/styles/__tests__/motion.test.ts` - 4 new tests: sectionVariants keys/stagger, fadeUpVariant keys/duration, updated no-spring check

## Decisions Made
- ContactData.socialLinks reuses existing SocialLink interface -- same shape as heroData social links for consistency
- sectionVariants and fadeUpVariant use hidden/visible naming (not initial/animate) because they are consumed by whileInView prop which uses string variant names

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All 5 data files ready for consumption by section components (Plans 02-02, 02-03)
- sectionVariants and fadeUpVariant ready for whileInView animations in section components
- Type interfaces provide contracts for component props
- 40 tests provide regression safety for component development

## Self-Check: PASSED

- 13/13 files found
- 3/3 commits verified (057d228, 30da386, 7c50c7f)

---
*Phase: 02-content-sections*
*Completed: 2026-03-23*
