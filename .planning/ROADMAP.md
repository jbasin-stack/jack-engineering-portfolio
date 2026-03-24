# Roadmap: Jack Basinski Engineering Portfolio

## Milestones

- ✅ **v1.0 MVP** — Phases 1-7 (shipped 2026-03-24)
- 🚧 **v1.1 Content Admin Panel** — Phases 8-10 (in progress)

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-7) — SHIPPED 2026-03-24</summary>

- [x] Phase 1: Foundation, Navigation, and Hero (3/3 plans) — completed 2026-03-22
- [x] Phase 2: Content Sections (4/4 plans) — completed 2026-03-23
- [x] Phase 3: Interactive Features (4/4 plans) — completed 2026-03-23
- [x] Phase 4: Polish and Deployment (2/2 plans) — completed 2026-03-23
- [x] Phase 5: Visual Design Overhaul (3/3 plans) — completed 2026-03-23
- [x] Phase 6: Static Assets & Integration Fixes (2/2 plans) — completed 2026-03-24
- [x] Phase 7: Requirements Traceability Cleanup (1/1 plan) — completed 2026-03-24

Full details: [milestones/v1.0-ROADMAP.md](milestones/v1.0-ROADMAP.md)

</details>

### 🚧 v1.1 Content Admin Panel (In Progress)

**Milestone Goal:** Add a local dev-mode admin interface with live preview for managing all portfolio content and assets without hand-editing TypeScript data files.

- [ ] **Phase 8: Admin Infrastructure** - Vite plugin API, TypeScript code generation, and dev/prod boundary
- [ ] **Phase 9: Admin Shell, Preview, and Asset Pipeline** - Split-pane layout with live preview and drag-drop asset uploads
- [ ] **Phase 10: Content Editors** - Form-based editors for all 9 content types with validation and feedback

## Phase Details

### Phase 8: Admin Infrastructure
**Goal**: The foundational dev-only API layer exists — admin route is production-excluded, content can be read and written through REST endpoints, and generated TypeScript files are valid
**Depends on**: Phase 7 (v1.0 complete)
**Requirements**: INFRA-01, INFRA-02, INFRA-03, INFRA-04, INFRA-05
**Success Criteria** (what must be TRUE):
  1. Running `vite build` produces a dist/ folder with zero references to admin code (verified by grep)
  2. A GET request to `/__admin-api/content/hero` in dev mode returns the current hero data as JSON
  3. A POST request to `/__admin-api/content/hero` with valid JSON writes a `.ts` file that passes `tsc -b` without errors
  4. Rapidly saving the same content type 5 times in 2 seconds causes no file corruption and no infinite HMR loop
**Plans**: TBD

### Phase 9: Admin Shell, Preview, and Asset Pipeline
**Goal**: The admin panel has a usable split-pane interface with live preview and working file uploads — a user can navigate content types, see the portfolio update in real time, and upload images and PDFs
**Depends on**: Phase 8
**Requirements**: PREV-01, PREV-02, PREV-03, ASSET-01, ASSET-02, ASSET-03, ASSET-04
**Success Criteria** (what must be TRUE):
  1. Navigating to `?admin` in dev mode shows a split-pane layout with an editor panel and a live preview of the portfolio side-by-side
  2. Dragging the divider between editor and preview resizes both panes smoothly
  3. Saving content through the API causes the preview iframe to update automatically (via HMR) without manual refresh
  4. Dragging an image file onto the upload zone places it in the correct `public/` subdirectory with a lowercase-kebab-case filename
  5. Attempting to upload a 15MB file or a `.exe` file is rejected with a validation error
**Plans**: TBD

### Phase 10: Content Editors
**Goal**: Every content type in the portfolio can be edited through form-based UI — the user never needs to hand-edit TypeScript data files again
**Depends on**: Phase 9
**Requirements**: EDIT-01, EDIT-02, EDIT-03, EDIT-04, EDIT-05, EDIT-06, EDIT-07, EDIT-08, EDIT-09, EDIT-10, EDIT-11
**Success Criteria** (what must be TRUE):
  1. Each of the 9 content types (Hero, Contact, Timeline, Coursework, Skills, Tooling, Navigation, Papers, Projects) has a dedicated form editor accessible from the admin sidebar
  2. Editing a field in any editor and clicking save writes the change to the corresponding `src/data/*.ts` file and the preview updates to show the new content
  3. Submitting a form with invalid data (e.g., empty required field, malformed URL) shows inline validation errors and does not write to disk
  4. After a successful save, a toast notification confirms the save; after a validation error, a toast shows what went wrong
  5. The Projects editor supports adding/removing items in nested arrays (techStack, links, images) and uploading thumbnail images per project
**Plans**: TBD

## Progress

**Execution Order:** Phases execute in numeric order: 8 → 9 → 10

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Foundation, Navigation, and Hero | v1.0 | 3/3 | Complete | 2026-03-22 |
| 2. Content Sections | v1.0 | 4/4 | Complete | 2026-03-23 |
| 3. Interactive Features | v1.0 | 4/4 | Complete | 2026-03-23 |
| 4. Polish and Deployment | v1.0 | 2/2 | Complete | 2026-03-23 |
| 5. Visual Design Overhaul | v1.0 | 3/3 | Complete | 2026-03-23 |
| 6. Static Assets & Integration Fixes | v1.0 | 2/2 | Complete | 2026-03-24 |
| 7. Requirements Traceability Cleanup | v1.0 | 1/1 | Complete | 2026-03-24 |
| 8. Admin Infrastructure | v1.1 | 0/? | Not started | - |
| 9. Admin Shell, Preview, and Asset Pipeline | v1.1 | 0/? | Not started | - |
| 10. Content Editors | v1.1 | 0/? | Not started | - |
