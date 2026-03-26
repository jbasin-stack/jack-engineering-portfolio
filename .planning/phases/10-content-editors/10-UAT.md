---
status: complete
phase: 10-content-editors
source: [10-01-SUMMARY.md, 10-02-SUMMARY.md, 10-03-SUMMARY.md]
started: 2026-03-26T16:00:00Z
updated: 2026-03-26T19:00:00Z
---

## Current Test
<!-- OVERWRITE each test - shows where we are -->

[testing complete]

## Tests

### 1. Editor Navigation
expected: In the admin panel, clicking different content types in the sidebar loads the corresponding editor. All 9 types (Hero, Contact, Navigation, Skills, Tooling, Timeline, Coursework, Papers, Projects) should display a real editor form — no placeholder text.
result: pass

### 2. Hero Editor — Edit and Save
expected: Select Hero from sidebar. Form shows fields for hero content (title, subtitle, etc.) pre-populated with current data. Edit a field, click Save. Toast notification confirms save succeeded. Refreshing the page shows the saved value persists.
result: pass

### 3. Contact Editor with Upload
expected: Select Contact from sidebar. Form shows contact fields pre-populated with current data. UploadZone is available for resume/photo. Edit a field and save — toast confirms success.
result: pass

### 4. Navigation Editor with Nested Children
expected: Select Navigation from sidebar. Shows list of nav links. Each link can have nested children (one level deep). Can edit link labels/paths and manage child links. Save persists changes.
result: pass

### 5. Skills Editor — Add/Edit/Delete
expected: Select Skills from sidebar. ItemList shows existing skill groups. Click a group to edit — see domain field and skills as tags (TagInput). Can add new skills by typing and pressing Enter. Can add a new skill group, delete an existing one (with confirmation). Save persists.
result: pass

### 6. Tooling Editor — Add/Edit/Delete
expected: Select Tooling from sidebar. ItemList shows tooling categories. Click to edit — see category field and items as tags. Can add/remove items, add/delete categories. Save persists.
result: pass

### 7. Timeline Editor — Add/Edit/Delete
expected: Select Timeline from sidebar. ItemList shows milestones. Click to edit — see date, title, and description fields. Can add new milestones, delete existing ones. Save persists.
result: issue
reported: "For the timeline, I'd like to be able to drag around the categories to order them, or Id like to have a standardized date system so that they are auto sorted on the timeline. also, When I tried to add one without a description, i got an error but It just said 'check highlighted fields' which I didnt see. Add brief error messages for all of the general cases, like missing context in a box or a red star for required. this goes for all of the checkpoints we discussed."
severity: major

### 8. Coursework Editor — Add/Edit/Delete
expected: Select Coursework from sidebar. ItemList shows courses. Click to edit — see code, name, and descriptor fields. Can add new courses, delete existing ones. Save persists.
result: issue
reported: "Likewise, for coursework, I'd like to be able to rearrange it, but we don't even have coursework showing up on the website yet because I wasn't sure that I wanted it."
severity: minor

### 9. Papers Editor with PDF Upload
expected: Select Papers from sidebar. ItemList shows papers. Click to edit — see title, descriptor fields, and UploadZone for PDF. Adding a new paper auto-generates an ID from the title. Save persists.
result: issue
reported: "For the papers, when you click view, I'd rather be able to scroll through the paper than click through each page."
severity: minor

### 10. Projects Editor — Full Feature Set
expected: Select Projects from sidebar. ItemList shows projects. Click to edit — see fields organized in sections: Details (title, brief, summary, domain, featured checkbox), Media (thumbnail upload, image gallery with remove buttons and add via UploadZone), Tech & Links (techStack as tags, links as structured rows). Save persists.
result: issue
reported: "It doesn't seem like the featured project tag is doing much right now. Maybe we should make it so that a featured project takes up a whole row by itself."
severity: minor

### 11. Validation Error Feedback
expected: In any editor, clear a required field (e.g., Hero title) and click Save. Inline error messages appear next to invalid fields. Toast shows validation failed. Data is NOT saved with invalid values.
result: issue
reported: "In some cases, I don't see highlighted fields, but in this case, I did. Inconsistent field highlighting across editors."
severity: major

## Summary

total: 11
passed: 6
issues: 5
pending: 0
skipped: 0

## Gaps

- truth: "Clicking content types in sidebar loads corresponding editor form with no placeholder text"
  status: resolved
  reason: "User reported: When I click on them, I just see ghosted outlines. It's like it's loading really slowly."
  severity: major
  test: 1
  root_cause: "Admin API Vite plugin registers middleware AFTER Vite internals (returns function from configureServer), so SPA fallback intercepts /__admin-api/* requests and returns HTML instead of JSON. useContentEditor fetch gets HTML, json() parse throws, but no .catch() handler exists — loading stays true forever, editors stuck on animate-pulse skeleton."
  artifacts:
    - path: "vite-plugin-admin-api.ts"
      issue: "configureServer returns a function (post-middleware), causing API routes to be intercepted by SPA fallback"
    - path: "src/admin/useContentEditor.ts"
      issue: "No .catch() on fetch chain — errors silently swallowed, loading never set to false"
  missing:
    - "Change configureServer to register middleware directly (pre-middleware) instead of returning a function"
    - "Add .catch() handler to fetch chain in useContentEditor to show error toast and set loading=false"
  debug_session: ".planning/debug/editors-ghosted-outlines.md"

- truth: "Timeline milestones can be reordered and validation errors show inline messages with required field indicators"
  status: failed
  reason: "User reported: No drag-to-reorder or date-based auto-sort for timeline items. Validation error just says 'check highlighted fields' but no fields are visibly highlighted. Wants red stars for required fields and inline error messages across all editors."
  severity: major
  test: 7
  artifacts: []
  missing: []

- truth: "Coursework items can be reordered in the editor"
  status: failed
  reason: "User reported: Would like to rearrange coursework items. Coursework section not yet displayed on the public site — user unsure if they want it."
  severity: minor
  test: 8
  artifacts: []
  missing: []

- truth: "Papers PDF viewer allows continuous scrolling through pages"
  status: failed
  reason: "User reported: PDF viewer uses page-by-page clicking instead of continuous scroll. Prefers scrollable view."
  severity: minor
  test: 9
  artifacts: []
  missing: []

- truth: "Featured projects take up a full row in the projects grid"
  status: failed
  reason: "User reported: Featured project tag doesn't visually differentiate. Wants featured projects to span a full row."
  severity: minor
  test: 10
  artifacts: []
  missing: []

- truth: "Validation error highlighting is consistent across all editors"
  status: failed
  reason: "User reported: Some editors show highlighted fields on validation error, others don't. Inconsistent behavior."
  severity: major
  test: 11
  artifacts: []
  missing: []
