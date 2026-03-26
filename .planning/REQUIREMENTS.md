# Requirements: Jack Basinski — Engineering Portfolio

**Defined:** 2026-03-24
**Core Value:** Every visitor immediately understands Jack's range and depth as an electrical engineer, and can access the evidence without friction.

## v1.1 Requirements

Requirements for the Content Admin Panel milestone. Each maps to roadmap phases.

### Infrastructure

- [x] **INFRA-01**: Admin panel is accessible only in dev mode — zero admin code in production build
- [x] **INFRA-02**: Custom Vite plugin provides REST API at `/__admin-api/*` for content read/write
- [x] **INFRA-03**: TypeScript code generation produces valid `.ts` files with `import type` syntax (passes `tsc -b`)
- [x] **INFRA-04**: File writes are atomic (write-to-temp then rename) preventing corruption
- [x] **INFRA-05**: HMR loop prevention — admin reads data via API endpoint, not module imports

### Content Editing

- [x] **EDIT-01**: User can edit Hero section content (name, tagline, social links) via form
- [x] **EDIT-02**: User can edit Contact section content (email, socials, resume path) via form
- [ ] **EDIT-03**: User can edit Timeline entries (add, remove, modify milestones) via form
- [ ] **EDIT-04**: User can edit Coursework entries via form
- [ ] **EDIT-05**: User can edit Skills groups and individual skills via form
- [ ] **EDIT-06**: User can edit Tooling categories and items via form
- [x] **EDIT-07**: User can edit Navigation structure via form
- [ ] **EDIT-08**: User can edit Papers (title, summary, PDF reference) via form
- [ ] **EDIT-09**: User can edit Projects (all 10 fields including nested arrays) via form
- [x] **EDIT-10**: All editors validate input with Zod schemas before saving
- [x] **EDIT-11**: User receives toast feedback on successful save or validation error

### Asset Management

- [x] **ASSET-01**: User can drag-drop upload images (JPG, PNG, SVG, WebP) to project/portrait slots
- [x] **ASSET-02**: User can drag-drop upload PDF files to papers/resume slots
- [x] **ASSET-03**: Uploaded filenames are normalized to lowercase-kebab-case
- [x] **ASSET-04**: Uploads are validated for file type and size (max 10MB)

### Live Preview

- [x] **PREV-01**: Admin layout shows split-pane with editor and live preview side-by-side
- [x] **PREV-02**: Preview iframe updates automatically via HMR when content is saved
- [x] **PREV-03**: User can resize editor/preview panes

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Content Editing Polish

- **EDIT-P01**: Keyboard shortcuts (Ctrl+S to save, Ctrl+N to add item)
- **EDIT-P02**: Content status indicators showing placeholder vs real content
- **EDIT-P03**: Drag-to-reorder via dnd-kit for array items (projects, skills, etc.)
- **EDIT-P04**: Markdown support in description fields

### Asset Polish

- **ASSET-P01**: Image optimization via Sharp on upload (WebP conversion, resize to max 1200px)

### Bulk Operations

- **BULK-01**: Export/import content as JSON
- **BULK-02**: Content templates for common project types

## Out of Scope

| Feature | Reason |
|---------|--------|
| Full headless CMS (TinaCMS, Payload, Strapi) | Zero-cost constraint violation, massive overhead for 9 small files |
| Version history/undo in admin | Git is the version history system |
| Multi-user authentication | Single operator, localhost only |
| Rich text / WYSIWYG editor | Existing interfaces use plain strings; rendering components don't support markup |
| Production-accessible admin | Security risk, violates dev-tool philosophy |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFRA-01 | Phase 8 | Complete |
| INFRA-02 | Phase 8 | Complete |
| INFRA-03 | Phase 8 | Complete |
| INFRA-04 | Phase 8 | Complete |
| INFRA-05 | Phase 8 | Complete |
| EDIT-01 | Phase 10 | Complete |
| EDIT-02 | Phase 10 | Complete |
| EDIT-03 | Phase 10 | Pending |
| EDIT-04 | Phase 10 | Pending |
| EDIT-05 | Phase 10 | Pending |
| EDIT-06 | Phase 10 | Pending |
| EDIT-07 | Phase 10 | Complete |
| EDIT-08 | Phase 10 | Pending |
| EDIT-09 | Phase 10 | Pending |
| EDIT-10 | Phase 10 | Complete |
| EDIT-11 | Phase 10 | Complete |
| ASSET-01 | Phase 9 | Complete |
| ASSET-02 | Phase 9 | Complete |
| ASSET-03 | Phase 9 | Complete |
| ASSET-04 | Phase 9 | Complete |
| PREV-01 | Phase 9 | Complete |
| PREV-02 | Phase 9 | Complete |
| PREV-03 | Phase 9 | Complete |

**Coverage:**
- v1.1 requirements: 23 total
- Mapped to phases: 23
- Unmapped: 0

---
*Requirements defined: 2026-03-24*
*Last updated: 2026-03-24 after roadmap creation*
