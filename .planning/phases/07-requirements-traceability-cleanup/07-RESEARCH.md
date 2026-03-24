# Phase 07: Requirements Traceability Cleanup - Research

**Researched:** 2026-03-24
**Domain:** Requirements documentation, traceability maintenance, markdown editing
**Confidence:** HIGH

## Summary

Phase 7 is a documentation-only phase with zero code changes. The goal is to bring `REQUIREMENTS.md` into full alignment with the actual state of the codebase as established by the v1 milestone audit. Four categories of edits are required: (1) marking FNDN-08 as complete since Phase 5 used 21st.dev community components, (2) updating NAV-01's requirement text to match the approved "hidden until 400px scroll" design instead of "visible on all scroll positions," (3) marking CRSE-01/CRSE-02 as descoped rather than pending, and (4) ensuring VISUAL-01 through VISUAL-07 have both definition text in the requirements list and correct status entries in the traceability table with accurate coverage counts.

The current state of REQUIREMENTS.md is partially updated -- VISUAL-01 through VISUAL-07 already appear in the traceability table (added during a prior update), but the VISUAL requirements still lack definition text in the checkbox list section. FNDN-08 and NAV-01 are still marked pending/incorrect, and CRSE-01/CRSE-02 are listed as pending in the traceability table despite being intentionally descoped by the user. Additionally, the coverage counts at the bottom need recalculation to accurately reflect completions, deferrals, and descoped items.

**Primary recommendation:** This is a single-file edit operation on `.planning/REQUIREMENTS.md`. Make all changes atomically in one plan, verify counts match, and update the "Last updated" timestamp.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FNDN-08 | 21st.dev MCP server used as primary source for sourcing premium React components | Audit confirms Phase 5 used aceternity/magicui/easemize components from 21st.dev. Checkbox should be [x], traceability status should be "Complete", phase should be "Phase 5" |
| NAV-01 | Navigation visibility behavior | Current text says "visible on all scroll positions" but approved design hides nav until 400px scroll. Text must be rewritten; checkbox is [x]; traceability status is "Complete" with phase "Phase 1" |
| CRSE-01 | User sees a section highlighting key UW ECE courses | Component built (Coursework.tsx exists) but user explicitly descoped from rendered page. Mark as descoped, not pending or complete |
| CRSE-02 | Courses include brief descriptors signaling domain relevance | Same as CRSE-01 -- built but intentionally excluded. Mark as descoped |
| VISUAL-01 | UW purple color tokens and effect component infrastructure | Satisfied in Phase 5 (05-01). Already in traceability table as Complete. Needs definition text in checkbox list |
| VISUAL-02 | Hero section animated aurora gradient with floating particles | User intentionally deferred. Already in traceability table as Deferred. Needs definition text in checkbox list |
| VISUAL-03 | Noise texture backgrounds on WhoAmI, Skills, Tooling sections | Satisfied in Phase 5 (05-02). Already in traceability table as Complete. Needs definition text in checkbox list |
| VISUAL-04 | Timeline animated grid pattern background | Satisfied in Phase 5 (05-03). Already in traceability table as Complete. Needs definition text in checkbox list |
| VISUAL-05 | Project card cursor-following spotlight effect | Satisfied in Phase 5 (05-03). Already in traceability table as Complete. Needs definition text in checkbox list |
| VISUAL-06 | Contact section subtle gradient background | Satisfied in Phase 5 (05-02). Already in traceability table as Complete. Needs definition text in checkbox list |
| VISUAL-07 | Effect intensity follows bold-to-calm curve across page | Satisfied in Phase 5 (05-02). Already in traceability table as Complete. Needs definition text in checkbox list |
</phase_requirements>

## Current State Analysis

### What REQUIREMENTS.md Currently Shows (Incorrect)

| Requirement | Current Checkbox | Current Traceability Phase | Current Traceability Status | Problem |
|-------------|-----------------|---------------------------|----------------------------|---------|
| FNDN-08 | `[ ]` (unchecked) | Phase 7 | Pending | Should be [x], Phase 5, Complete |
| NAV-01 | `[ ]` (unchecked) | Phase 7 | Pending | Text says "visible on all scroll positions" -- wrong. Should be [x], Phase 1, Complete with updated text |
| CRSE-01 | `[ ]` (unchecked) | Phase 7 | Pending | Should use descoped marker, Phase 2, Descoped |
| CRSE-02 | `[ ]` (unchecked) | Phase 7 | Pending | Should use descoped marker, Phase 2, Descoped |
| VISUAL-01 | No checkbox entry | Phase 5 | Complete | Needs checkbox definition text added |
| VISUAL-02 | No checkbox entry | Phase 5 | Deferred | Needs checkbox definition text added |
| VISUAL-03 | No checkbox entry | Phase 5 | Complete | Needs checkbox definition text added |
| VISUAL-04 | No checkbox entry | Phase 5 | Complete | Needs checkbox definition text added |
| VISUAL-05 | No checkbox entry | Phase 5 | Complete | Needs checkbox definition text added |
| VISUAL-06 | No checkbox entry | Phase 5 | Complete | Needs checkbox definition text added |
| VISUAL-07 | No checkbox entry | Phase 5 | Complete | Needs checkbox definition text added |

### What REQUIREMENTS.md Should Show (Corrected)

| Requirement | Target Checkbox | Target Traceability Phase | Target Traceability Status | Change Needed |
|-------------|----------------|--------------------------|---------------------------|---------------|
| FNDN-08 | `[x]` | Phase 5 | Complete | Check box, change phase from 7 to 5, change status from Pending to Complete |
| NAV-01 | `[x]` | Phase 1 | Complete | Rewrite requirement text, check box, change phase from 7 to 1, change status to Complete |
| CRSE-01 | `[-]` or `[~]` | Phase 2 | Descoped | Use descoped marker, change phase from 7 to 2, change status to Descoped |
| CRSE-02 | `[-]` or `[~]` | Phase 2 | Descoped | Use descoped marker, change phase from 7 to 2, change status to Descoped |
| VISUAL-01 | `[x]` | Phase 5 | Complete | Add new checkbox line with definition text (already in traceability) |
| VISUAL-02 | `[ ]` | Phase 5 | Deferred | Add new checkbox line with definition text (already in traceability as Deferred) |
| VISUAL-03 | `[x]` | Phase 5 | Complete | Add new checkbox line with definition text |
| VISUAL-04 | `[x]` | Phase 5 | Complete | Add new checkbox line with definition text |
| VISUAL-05 | `[x]` | Phase 5 | Complete | Add new checkbox line with definition text |
| VISUAL-06 | `[x]` | Phase 5 | Complete | Add new checkbox line with definition text |
| VISUAL-07 | `[x]` | Phase 5 | Complete | Add new checkbox line with definition text |

## Architecture Patterns

### REQUIREMENTS.md Structure

The file follows a specific structure that must be maintained:

```
# Requirements: [Project Name]
**Defined:** [date]
**Core Value:** [description]

## v1 Requirements

### [Category Name]
- [x] **REQ-ID**: Requirement description text
- [ ] **REQ-ID**: Requirement description text

## v2 Requirements
### Post-Launch Enhancements
- **REQ-ID**: Description

## Out of Scope
| Feature | Reason |

## Traceability
| Requirement | Phase | Status |
|-------------|-------|--------|

**Coverage:**
- v1 requirements: N total
- Mapped to phases: N
- Unmapped: N
- [status breakdown]

---
*Requirements defined: [date]*
*Last updated: [date]*
```

### Checkbox Convention

Existing patterns in the file:
- `[x]` = Complete (satisfied and verified)
- `[ ]` = Not complete (pending or unstarted)

For descoped items, there is no existing convention in this project. The standard markdown-checkbox approach is:
- `[-]` = Descoped/cancelled (some renderers show strikethrough)
- Alternative: `[ ] ~~**CRSE-01**~~: ~~description~~` with strikethrough

**Recommendation:** Use `[-]` for descoped items and add "(descoped)" annotation in the description text. This is visually distinct from both complete and pending.

### Traceability Status Values

Current values used: Complete, Pending, Deferred. Add: Descoped.

| Status | Meaning |
|--------|---------|
| Complete | Requirement satisfied and verified |
| Pending | Not yet addressed |
| Deferred | Intentionally postponed (will be done later) |
| Descoped | Intentionally removed from scope (will NOT be done) |

### VISUAL Requirement Definition Text

These need to be added as a new "### Visual Design" subsection. The definitions should be sourced from the Phase 5 ROADMAP success criteria and VERIFICATION report:

| ID | Definition Text (from ROADMAP + VERIFICATION) |
|----|----------------------------------------------|
| VISUAL-01 | UW purple color palette extension with oklch tokens and 5 effect components (Aurora, Particles, NoisyBackground, CardSpotlight, AnimatedGridPattern) |
| VISUAL-02 | Hero section displays animated aurora gradient with floating particles that respond to cursor movement |
| VISUAL-03 | WhoAmI, Skills, and Tooling sections have subtle noise texture backgrounds with purple tinting |
| VISUAL-04 | Timeline has animated grid pattern background with engineering/technical aesthetic |
| VISUAL-05 | Project cards show interactive spotlight effect following cursor on hover without breaking expand/collapse animations |
| VISUAL-06 | Contact section uses subtle gradient background echoing hero aesthetic |
| VISUAL-07 | Effect intensity follows bold hero to textured middle to calm footer curve across page |

### NAV-01 Rewritten Text

Current: "User sees a fixed glassmorphic header with backdrop-blur, visible on all scroll positions"

Should become: "User sees a fixed glassmorphic header with backdrop-blur that appears after scrolling past the hero (400px threshold)"

This matches the approved design decision from Phase 1 CONTEXT.md (01-03 plan): "Nav visibility threshold 400px so nav appears only after scrolling past hero."

## Exact Edits Required

### Edit 1: FNDN-08 Checkbox (Line 17)

**Before:** `- [ ] **FNDN-08**: 21st.dev MCP server used as primary source for sourcing premium React components`
**After:** `- [x] **FNDN-08**: 21st.dev MCP server used as primary source for sourcing premium React components`

### Edit 2: NAV-01 Checkbox and Text (Line 21)

**Before:** `- [ ] **NAV-01**: User sees a fixed glassmorphic header with backdrop-blur, visible on all scroll positions`
**After:** `- [x] **NAV-01**: User sees a fixed glassmorphic header with backdrop-blur that appears after scrolling past the hero (400px threshold)`

### Edit 3: CRSE-01/CRSE-02 Checkbox (Lines 65-66)

**Before:**
```
- [ ] **CRSE-01**: User sees a section highlighting key UW ECE courses
- [ ] **CRSE-02**: Courses include brief descriptors signaling domain relevance
```
**After:**
```
- [-] **CRSE-01**: ~~User sees a section highlighting key UW ECE courses~~ (descoped -- component built but excluded from rendered page by user decision)
- [-] **CRSE-02**: ~~Courses include brief descriptors signaling domain relevance~~ (descoped -- component built but excluded from rendered page by user decision)
```

### Edit 4: Add Visual Design Section (after Performance & Deployment, before v2)

Insert new subsection between lines 89 and 91:

```markdown
### Visual Design

- [x] **VISUAL-01**: UW purple color palette extension with oklch tokens and five effect components (Aurora, Particles, NoisyBackground, CardSpotlight, AnimatedGridPattern)
- [ ] **VISUAL-02**: Hero section displays animated aurora gradient with floating particles that respond to cursor movement (deferred -- user removed as too distracting)
- [x] **VISUAL-03**: WhoAmI, Skills, and Tooling sections have subtle noise texture backgrounds with purple tinting
- [x] **VISUAL-04**: Timeline has animated grid pattern background with engineering/technical aesthetic
- [x] **VISUAL-05**: Project cards show interactive spotlight effect following cursor on hover without breaking expand/collapse animations
- [x] **VISUAL-06**: Contact section uses subtle gradient background echoing hero aesthetic
- [x] **VISUAL-07**: Effect intensity follows bold hero to textured middle to calm footer curve across page
```

### Edit 5: Traceability Table Updates

Update these rows:

| Row | Before | After |
|-----|--------|-------|
| FNDN-08 | `Phase 7 | Pending` | `Phase 5 | Complete` |
| NAV-01 | `Phase 7 | Pending` | `Phase 1 | Complete` |
| CRSE-01 | `Phase 7 | Pending` | `Phase 2 | Descoped` |
| CRSE-02 | `Phase 7 | Pending` | `Phase 2 | Descoped` |

VISUAL-01 through VISUAL-07 rows are already correct in the traceability table (Phase 5, correct statuses).

### Edit 6: Coverage Counts

**Before:**
```
**Coverage:**
- v1 requirements: 57 total (50 original + 7 VISUAL)
- Mapped to phases: 57
- Unmapped: 0
- Pending (gap closure): 4 (FNDN-08, NAV-01, CRSE-01, CRSE-02)
```

**After (recalculated):**
```
**Coverage:**
- v1 requirements: 57 total (50 original + 7 VISUAL)
- Complete: 53
- Deferred: 1 (VISUAL-02)
- Descoped: 2 (CRSE-01, CRSE-02)
- Pending: 0
- Unmapped: 0
```

Breakdown verification:
- 50 original requirements: 48 complete + 2 descoped (CRSE-01, CRSE-02) = 50
- 7 VISUAL requirements: 6 complete + 1 deferred (VISUAL-02) = 7
- Total complete: 48 + 6 = 54... wait, let me recount.

Actually: Original 50 = 48 [x] + 2 descoped (CRSE-01, CRSE-02). FNDN-08 was [ ] and NAV-01 was [ ] -- both become [x], so that's 48 already checked + 2 newly checked = 48 + 2 = 50 - 2 descoped = 48 complete from original set. No -- let me be precise.

Original 50 requirements current state:
- Already [x]: FNDN-01 through FNDN-07 (7), NAV-02 through NAV-05 (4), HERO-01 through HERO-03 (3), SKIL-01 through SKIL-04 (4), PROJ-01 through PROJ-06 (6), DOCS-01 through DOCS-05 (5), TOOL-01 through TOOL-03 (3), CRSE-03 (1), TIME-01 through TIME-04 (4), CONT-01 through CONT-04 (4), PERF-01 through PERF-05 (5) = 7+4+3+4+6+5+3+1+4+4+5 = 46
- Newly [x] after Phase 7: FNDN-08 (1), NAV-01 (1) = 2
- Descoped: CRSE-01 (1), CRSE-02 (1) = 2
- Total original: 46 + 2 + 2 = 50. Correct.

VISUAL 7 requirements:
- Complete: VISUAL-01, 03, 04, 05, 06, 07 = 6
- Deferred: VISUAL-02 = 1
- Total VISUAL: 7. Correct.

Grand total: 50 + 7 = 57
- Complete: 48 + 6 = 54
- Deferred: 1
- Descoped: 2
- Total accounted: 54 + 1 + 2 = 57. Correct.

Corrected coverage section:
```
**Coverage:**
- v1 requirements: 57 total (50 original + 7 VISUAL)
- Complete: 54
- Deferred: 1 (VISUAL-02 -- hero background effect, user decision)
- Descoped: 2 (CRSE-01, CRSE-02 -- coursework section, user decision)
- Pending: 0
- Unmapped: 0
```

### Edit 7: Last Updated Timestamp

**Before:** `*Last updated: 2026-03-20 after roadmap creation*`
**After:** `*Last updated: 2026-03-24 after Phase 7 traceability cleanup*`

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Requirement counting | Manual counting of checkboxes | Systematic count from traceability table | Manual counts drift; table is source of truth |
| Status validation | Eyeballing checkbox vs traceability agreement | Line-by-line comparison between checkbox section and traceability table | Easy to miss inconsistencies between the two sections |

## Common Pitfalls

### Pitfall 1: Checkbox-Traceability Disagreement
**What goes wrong:** Checkbox says [x] but traceability table says Pending (or vice versa)
**Why it happens:** Editing one section but forgetting the other
**How to avoid:** Always update BOTH the checkbox line AND the traceability table row for every change
**Warning signs:** Coverage counts don't add up

### Pitfall 2: Wrong Phase Attribution
**What goes wrong:** FNDN-08 stays attributed to "Phase 7" instead of being moved to "Phase 5" where the work actually happened
**Why it happens:** Phase 7 is the cleanup phase, not the implementation phase
**How to avoid:** Traceability phase should reflect WHERE the work was done, not where the bookkeeping happened. FNDN-08 work was done in Phase 5. NAV-01 work was done in Phase 1. CRSE-01/02 work was in Phase 2.
**Warning signs:** Phase 7 appears as the phase for any requirement in the traceability table

### Pitfall 3: Coverage Count Arithmetic Errors
**What goes wrong:** Coverage summary says "54 complete" but actual count is different
**Why it happens:** Adding/removing items without recounting
**How to avoid:** Count from traceability table rows, not from checkbox section. Verify total = complete + deferred + descoped + pending
**Warning signs:** Numbers don't sum to total

### Pitfall 4: Descoped vs Deferred Confusion
**What goes wrong:** CRSE-01/02 marked as "Deferred" instead of "Descoped"
**Why it happens:** Both mean "not done" but have different implications
**How to avoid:** Deferred = will do later (VISUAL-02). Descoped = removed from scope entirely (CRSE-01/02). The audit explicitly says CRSE-01/02 are "descoped" not "deferred"
**Warning signs:** Using the wrong status changes expectations about future work

### Pitfall 5: VISUAL Definitions Missing from Checkbox Section
**What goes wrong:** VISUAL requirements appear only in traceability table but have no checkbox definition text
**Why it happens:** They were added to traceability table in a prior update but the definition section was never created
**How to avoid:** Add a "### Visual Design" subsection with all 7 VISUAL checkbox items with descriptive text
**Warning signs:** Traceability table has rows with no corresponding requirement definition

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest (via Vite 8) |
| Config file | `vitest.config.ts` |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run` |

### Phase Requirements to Test Map

Phase 7 is documentation-only. There are no code changes, so no automated tests are needed or applicable. All validation is manual inspection of REQUIREMENTS.md content.

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FNDN-08 | Checkbox [x] and traceability row updated | manual-only | N/A -- markdown content verification | N/A |
| NAV-01 | Requirement text rewritten, checkbox [x], traceability updated | manual-only | N/A -- markdown content verification | N/A |
| CRSE-01 | Marked descoped in checkbox and traceability | manual-only | N/A -- markdown content verification | N/A |
| CRSE-02 | Marked descoped in checkbox and traceability | manual-only | N/A -- markdown content verification | N/A |
| VISUAL-01 | Definition text exists in checkbox section | manual-only | N/A -- markdown content verification | N/A |
| VISUAL-02 | Definition text exists with deferred annotation | manual-only | N/A -- markdown content verification | N/A |
| VISUAL-03 | Definition text exists in checkbox section | manual-only | N/A -- markdown content verification | N/A |
| VISUAL-04 | Definition text exists in checkbox section | manual-only | N/A -- markdown content verification | N/A |
| VISUAL-05 | Definition text exists in checkbox section | manual-only | N/A -- markdown content verification | N/A |
| VISUAL-06 | Definition text exists in checkbox section | manual-only | N/A -- markdown content verification | N/A |
| VISUAL-07 | Definition text exists in checkbox section | manual-only | N/A -- markdown content verification | N/A |

**Justification for manual-only:** All changes are to a planning markdown file (`.planning/REQUIREMENTS.md`), not source code. No unit test framework can meaningfully validate markdown content correctness -- verification requires reading the file and confirming the edits match the audit findings.

### Sampling Rate
- **Per task commit:** Read REQUIREMENTS.md and verify checkbox/traceability/count consistency
- **Per wave merge:** N/A (single-plan phase)
- **Phase gate:** All 5 success criteria confirmed by reading final file

### Wave 0 Gaps
None -- no test infrastructure needed for documentation-only changes.

## Verification Checklist

After all edits are applied, verify these 5 success criteria from the ROADMAP:

1. **FNDN-08 marked complete** -- checkbox is `[x]`, traceability shows `Phase 5 | Complete`
2. **NAV-01 text updated** -- requirement text says "appears after scrolling past the hero (400px threshold)", checkbox is `[x]`, traceability shows `Phase 1 | Complete`
3. **CRSE-01/CRSE-02 descoped** -- checkbox uses `[-]` with strikethrough and annotation, traceability shows `Phase 2 | Descoped`
4. **VISUAL-01-07 in traceability** -- all 7 rows present with correct Phase 5 attribution and correct statuses (6 Complete, 1 Deferred)
5. **Coverage counts accurate** -- 57 total, 54 complete, 1 deferred, 2 descoped, 0 pending, 0 unmapped

## Sources

### Primary (HIGH confidence)
- `.planning/REQUIREMENTS.md` -- current state of requirements document (the file being edited)
- `.planning/v1-MILESTONE-AUDIT.md` -- definitive audit establishing what needs to change
- `.planning/ROADMAP.md` -- Phase 5 and Phase 7 definitions, VISUAL requirement descriptions

### Secondary (HIGH confidence)
- `.planning/phases/05-*/05-VERIFICATION.md` -- VISUAL requirement satisfaction evidence
- `src/components/layout/Navigation.tsx` -- confirms 400px scroll threshold (line 16)
- `src/components/sections/Coursework.tsx` -- confirms component exists but is descoped from page

### Tertiary
- None needed -- all evidence is internal to the project planning documents

## Metadata

**Confidence breakdown:**
- Exact edits needed: HIGH -- audit provides complete gap analysis with specific requirement IDs and target states
- Checkbox conventions: HIGH -- established patterns visible in existing REQUIREMENTS.md
- Coverage arithmetic: HIGH -- manually verified counts sum correctly (54 + 1 + 2 = 57)
- VISUAL definition text: HIGH -- sourced from ROADMAP success criteria and VERIFICATION report

**Research date:** 2026-03-24
**Valid until:** Indefinite (documentation cleanup of completed project state)
