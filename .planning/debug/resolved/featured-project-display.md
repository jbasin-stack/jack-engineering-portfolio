---
status: resolved
trigger: "Featured project tag doesn't visually differentiate. Wants featured projects to span a full row."
created: 2026-03-26T00:00:00Z
updated: 2026-03-26T00:00:00Z
uat_test: 10
---

## Current Focus

hypothesis: The `featured` boolean is stored in data and editable in admin, but the public ProjectsSection and ProjectCard components never read or use the `featured` field for visual differentiation.
test: Code review of ProjectCard.tsx and ProjectsSection.tsx
expecting: No reference to `project.featured` in rendering logic
next_action: none -- root cause confirmed

## Symptoms

expected: Featured projects should look visually different from non-featured projects on the public site (user wants them to span a full row).
actual: All project cards render identically in the grid regardless of `featured` status. The checkbox in admin toggles the boolean but nothing on the public site consumes it.
errors: none (functional gap, not a runtime error)
reproduction: Set a project to featured=true in admin, view the public projects section -- card looks identical to non-featured cards.
started: The featured col-span-2 was intentionally removed during Phase 03-04 visual verification (commit d2210c1) in favor of "uniform tile sizing." The `featured` field has been a no-op on the public site since that commit.

## Eliminated

- hypothesis: The featured field is not stored or persisted correctly
  evidence: `projects.ts` has `featured: true` on lna-design and precision-adc-frontend. The admin editor reads/writes it via Checkbox component. Schema validates it. Data layer is correct.
  timestamp: 2026-03-26T00:00:00Z

- hypothesis: The featured field is used in ProjectCard but the CSS is wrong
  evidence: Full read of ProjectCard.tsx (120 lines) -- the string `featured` does not appear anywhere in the component. The only conditional class is based on `isExpanded` (col-span-3 when expanded), not `featured`.
  timestamp: 2026-03-26T00:00:00Z

## Evidence

- timestamp: 2026-03-26T00:00:00Z
  checked: src/types/data.ts line 59
  found: Project interface has `featured: boolean` field
  implication: Type system supports the field

- timestamp: 2026-03-26T00:00:00Z
  checked: src/data/projects.ts
  found: Two projects have `featured: true` (lna-design, precision-adc-frontend). Two have `featured: false`.
  implication: Data has featured flags set -- but note the test at `src/data/__tests__/projects.test.ts:25` expects exactly ONE featured project. Current data has TWO, so this test would fail.

- timestamp: 2026-03-26T00:00:00Z
  checked: src/admin/editors/ProjectsEditor.tsx lines 197-208
  found: Featured checkbox exists in admin UI, reads `activeItem.featured`, calls `updateItem('featured', checked)`. Correctly toggles the boolean.
  implication: Admin side is fully wired. Problem is exclusively on the public display side.

- timestamp: 2026-03-26T00:00:00Z
  checked: src/components/projects/ProjectCard.tsx (full file, 120 lines)
  found: The word "featured" does not appear ANYWHERE in this file. The only conditional grid spanning is `isExpanded ? 'col-span-1 md:col-span-3' : ''` (line 23-25). No visual differentiation for featured projects.
  implication: Root cause confirmed -- ProjectCard ignores the featured flag entirely.

- timestamp: 2026-03-26T00:00:00Z
  checked: src/components/projects/ProjectsSection.tsx (full file, 70 lines)
  found: The word "featured" does not appear in this file either. It maps over `projects` and passes each to `ProjectCard` without any featured-specific logic.
  implication: Neither the grid container nor the card component use the featured field.

- timestamp: 2026-03-26T00:00:00Z
  checked: .planning/milestones/v1.0-phases/03-interactive-features/03-04-SUMMARY.md
  found: Key decision documented -- "Removed featured card col-span-2 differentiation in favor of uniform tile sizing." This was a deliberate design choice during Phase 03-04. The original Phase 03-02 implementation DID have `project.featured ? 'col-span-1 md:col-span-2' : ''` but it was removed.
  implication: The featured visual was explicitly removed. Now the user wants it back in a different form (full row, not 2-col span).

## Resolution

root_cause: |
  The `featured` boolean field exists in the data layer (Project interface, project data, admin editor checkbox) but is completely ignored by the public-facing components. The original Phase 03-02 implementation applied `md:col-span-2` to featured cards, but this was intentionally removed during Phase 03-04 visual verification (commit d2210c1) in favor of uniform tile sizing. Since that removal, the `featured` field has been a no-op on the public site -- it is stored and editable but has zero visual effect.

fix: not yet applied
verification: not yet performed
files_changed: []

## Artifacts

### Files Involved

| File | Role | Issue |
|------|------|-------|
| `src/types/data.ts:59` | Type definition | Has `featured: boolean` -- correct |
| `src/data/projects.ts` | Data store | Has featured flags on 2 projects -- works, but test expects exactly 1 |
| `src/admin/editors/ProjectsEditor.tsx:197-208` | Admin UI | Featured checkbox works correctly -- no change needed |
| `src/components/projects/ProjectCard.tsx` | Public card | **No reference to `featured` at all** -- needs featured visual treatment |
| `src/components/projects/ProjectsSection.tsx` | Public grid | **No reference to `featured` at all** -- grid container may need changes |

### Suggested Fix Direction

The user wants featured projects to "take up a whole row by itself." The grid is currently `grid-cols-1 md:grid-cols-3`. The fix should:

1. **ProjectCard.tsx**: Add a `featured` conditional class. When `project.featured` is true and the card is NOT already expanded, apply `md:col-span-3` (full row in the 3-column grid). This gives featured projects a full-width hero treatment distinct from the click-to-expand behavior.

2. **Featured card layout**: When a card spans the full row via featured (not via expand), it should have a differentiated layout -- e.g., horizontal layout with image on one side and content on the other (similar to the existing expanded layout but as the default collapsed state for featured cards). This avoids a card that is just stretched with a giant thumbnail.

3. **Test fix**: Update `src/data/__tests__/projects.test.ts` -- the test on line 25-27 expects exactly 1 featured project, but `projects.ts` currently has 2 (`lna-design` and `precision-adc-frontend`). Either update the test to allow multiple featured projects, or decide on a single featured project.

4. **No admin changes needed** -- the featured checkbox already works correctly.

### Data Integrity Note

`src/data/projects.ts` currently has TWO projects with `featured: true` (lna-design at line 20 and precision-adc-frontend at line 74). The existing test at `src/data/__tests__/projects.test.ts:25-27` asserts exactly one featured project. This test is likely currently failing or was written for an earlier state of the data. This should be reconciled as part of the fix.
