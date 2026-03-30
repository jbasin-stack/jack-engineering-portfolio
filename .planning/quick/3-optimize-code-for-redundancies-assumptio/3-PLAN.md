---
phase: quick-optimize
plan: 3
type: execute
wave: 1
depends_on: []
files_modified:
  - src/data/hero.ts
  - src/components/sections/Expertise.tsx
  - src/components/projects/ProjectsSection.tsx
  - src/components/projects/ProjectCard.tsx
  - src/components/sections/Skills.tsx
  - src/components/sections/Tooling.tsx
  - src/components/effects/CardSpotlight.tsx
  - src/components/effects/__tests__/effects.test.ts
  - src/styles/motion.ts
  - src/components/sections/Timeline.tsx
  - src/components/projects/ProjectDetail.tsx
  - src/components/sections/WhoAmI.tsx
autonomous: true
must_haves:
  truths:
    - "TypeScript compiles with zero errors (tsc -b)"
    - "No dead-code components ship in the production bundle"
    - "All images below the fold use lazy loading for fast initial paint"
    - "Hero narrative text contains no debug artifacts"
  artifacts:
    - path: "src/data/hero.ts"
      provides: "Clean hero narrative without debug text"
      contains: "Bridging semiconductor"
    - path: "src/components/sections/Expertise.tsx"
      provides: "Type-safe tab change handler"
  key_links:
    - from: "src/App.tsx"
      to: "src/components/projects/ProjectCarousel.tsx"
      via: "direct import (no dead ProjectsSection reference)"
---

<objective>
Audit and fix code redundancies, stale assumptions, and performance gaps across the portfolio codebase.

Purpose: Ensure the production bundle is lean (no dead code), TypeScript compiles cleanly, all images are performance-optimized with lazy loading, and no debug artifacts remain in data files.

Output: Clean codebase with zero TS errors, no orphan components, and optimized image loading.
</objective>

<context>
@src/App.tsx
@src/data/hero.ts
@src/components/sections/Expertise.tsx
@src/components/projects/ProjectsSection.tsx
@src/components/projects/ProjectCard.tsx
@src/components/sections/Skills.tsx
@src/components/sections/Tooling.tsx
@src/components/effects/CardSpotlight.tsx
@src/styles/motion.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Remove dead-code components and fix data artifacts</name>
  <files>
    src/components/projects/ProjectsSection.tsx
    src/components/projects/ProjectCard.tsx
    src/components/sections/Skills.tsx
    src/components/sections/Tooling.tsx
    src/components/effects/CardSpotlight.tsx
    src/components/effects/__tests__/effects.test.ts
    src/styles/motion.ts
    src/data/hero.ts
  </files>
  <action>
    **Dead code removal:** The following components are NOT imported by App.tsx or any live code path. They were superseded during v1.2 (ProjectCarousel replaced ProjectsSection; Expertise replaced Skills+Tooling):

    1. DELETE `src/components/projects/ProjectsSection.tsx` — replaced by ProjectCarousel.tsx (which IS used in App.tsx)
    2. DELETE `src/components/projects/ProjectCard.tsx` — only consumer was ProjectsSection (dead)
    3. DELETE `src/components/sections/Skills.tsx` — replaced by Expertise.tsx
    4. DELETE `src/components/sections/Tooling.tsx` — replaced by Expertise.tsx
    5. DELETE `src/components/effects/CardSpotlight.tsx` — only consumer was ProjectCard (dead)
    6. DELETE `src/components/effects/__tests__/effects.test.ts` — tests CardSpotlight (dead)

    **Stale export cleanup in motion.ts:**
    - `layoutTransition` is only used by the now-deleted ProjectCard.tsx. Remove the export. Keep easing, sectionVariants, and fadeUpVariant (used by live components).

    **Data artifact fix in hero.ts:**
    - Line 7: `narrative` value contains "LOVE\n" at the end — this is debug/test text left behind. Change to:
      `'Bridging semiconductor manufacturing and system design'`
      (remove "LOVE\n" and the trailing newline)

    IMPORTANT: Do NOT delete any data files (projects.ts, skills.ts, tooling.ts, coursework.ts) — they are consumed by the admin panel editors even though their section components may be dead. Only delete the COMPONENT files listed above.
  </action>
  <verify>
    <automated>cd "C:/Claude code projects/GSD Projects/Jack_Engineering_Portfolio" && npx tsc -b 2>&1 | head -20</automated>
    Verify: No import errors from removed files. Grep for "ProjectsSection", "ProjectCard", "CardSpotlight", "Skills" (component import), "Tooling" (component import) in src/ — should find zero results in non-admin, non-data files.
  </verify>
  <done>
    - 6 dead component/test files deleted
    - layoutTransition export removed from motion.ts
    - hero.ts narrative cleaned of debug text
    - TypeScript compiles with zero errors from deletions
  </done>
</task>

<task type="auto">
  <name>Task 2: Fix TypeScript error and add missing lazy loading to images</name>
  <files>
    src/components/sections/Expertise.tsx
    src/components/sections/Timeline.tsx
    src/components/projects/ProjectDetail.tsx
    src/components/sections/WhoAmI.tsx
  </files>
  <action>
    **TypeScript error fix in Expertise.tsx (line 75):**
    The `handleTabChange` function accepts `string` but `activeTab` state is typed as the union `"fabrication" | "rf-test" | "analog" | "digital"` (inferred from `as const` on domainMapping). Fix by typing the parameter:

    Change `function handleTabChange(newTabId: string)` to accept the correct union type. The cleanest approach: extract a type from the tabs array:
    ```ts
    type DomainTabId = (typeof domainMapping)[number]['id'];
    ```
    Then type `activeTab` state as `DomainTabId` and `handleTabChange(newTabId: DomainTabId)`. Also update the `AnimatedTabs` `onChange` callback type if needed — check if AnimatedTabs accepts a generic or uses `string`. If AnimatedTabs forces `string`, cast at the call site: `onChange={(id) => handleTabChange(id as DomainTabId)}`.

    **Image lazy loading — add `loading="lazy"` and `decoding="async"` to all below-fold images that lack them:**

    1. `Timeline.tsx` — 3 `<img>` elements (lines ~103, ~113, ~123): Add `loading="lazy" decoding="async"` to each.
    2. `ProjectDetail.tsx` — gallery images in `detailContent` (line ~55): Add `loading="lazy" decoding="async"` to each img in the map.
    3. `WhoAmI.tsx` — portrait image (line ~27): Add `loading="lazy" decoding="async"`. (The WhoAmI section is below the hero fold.)

    NOTE: CarouselCard.tsx already has `loading="lazy"` — no change needed there.

    Do NOT add lazy loading to hero section images (above the fold).
  </action>
  <verify>
    <automated>cd "C:/Claude code projects/GSD Projects/Jack_Engineering_Portfolio" && npx tsc -b 2>&1 && echo "TYPE CHECK PASSED"</automated>
    Additional: grep for `loading="lazy"` in Timeline.tsx, ProjectDetail.tsx, WhoAmI.tsx — should find matches.
  </verify>
  <done>
    - TypeScript compiles with zero errors
    - Expertise.tsx tab handler is type-safe (no more TS2345)
    - All below-fold images have loading="lazy" decoding="async" for optimized loading
  </done>
</task>

</tasks>

<verification>
1. `npx tsc -b` completes with zero errors
2. `npm run build` succeeds (production bundle compiles)
3. Dead files no longer exist: ProjectsSection.tsx, ProjectCard.tsx, Skills.tsx, Tooling.tsx, CardSpotlight.tsx
4. Hero narrative reads cleanly without debug text
5. All below-fold img tags include loading="lazy"
</verification>

<success_criteria>
- Zero TypeScript compilation errors
- Production build succeeds with no warnings from removed imports
- 6 dead component/test files removed from the codebase
- All below-fold images have lazy loading attributes
- Hero data contains no debug artifacts
- No functional regressions (App.tsx renders same sections as before)
</success_criteria>

<output>
After completion, write a brief summary of changes to `.planning/quick/3-optimize-code-for-redundancies-assumptio/3-SUMMARY.md`
</output>
