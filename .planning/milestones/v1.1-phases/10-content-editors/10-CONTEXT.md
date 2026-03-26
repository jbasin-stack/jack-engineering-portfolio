# Phase 10: Content Editors - Context

**Gathered:** 2026-03-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Build form-based editors for all 9 content types (Hero, Contact, Navigation, Skills, Tooling, Timeline, Coursework, Papers, Projects) so the user never needs to hand-edit TypeScript data files again. Each editor validates input with Zod before saving and provides toast feedback. The admin shell, navigation, save bar, upload zones, and API infrastructure are already complete from Phases 8–9.

</domain>

<decisions>
## Implementation Decisions

### Array/list editing UX
- Simple string arrays (techStack, skills, tooling items): inline text input + Enter key to add, rendered as tags with × button to remove
- Structured array items (links with label+url, socialLinks with platform+url+icon): mini-form row per item with fields side-by-side, × button to remove, "+ Add" button creates new empty row
- No drag-to-reorder in v1.1 — items stay in insertion order (EDIT-P03 defers dnd-kit reorder to v2)
- Remove is immediate on × click, no per-item confirmation needed

### Editor layout
- All editors use a single scrollable form with subtle section headers (e.g., "Details", "Media", "Tech & Links")
- Singleton editors (Hero, Contact, Navigation): form fields directly, no item picker
- List-type editors (Projects, Papers, Skills, Tooling, Timeline, Coursework): compact item list at the top of the editor, click to load item form below, "+ Add new" button at bottom of list, active item highlighted
- Complex editors (Projects) group fields with section headers but don't use tabs or accordions
- Consistent layout across all editors — singletons are the same pattern minus the item picker

### Item management
- Users can delete items from list-type content via a "Delete" button at the bottom of the item form, with a confirmation prompt before removing
- New items start blank with `id` auto-generated from the title field (kebab-case, derived as user types)
- All other fields start empty; required fields are caught by Zod validation on save

### Validation timing & feedback
- Zod validation fires on save only (Save button or Ctrl+S) — no mid-typing validation
- Zod schemas mirror existing TypeScript type definitions exactly — if the type says `string`, the field is required; arrays can be empty `[]`
- No extra validation constraints beyond what the types define
- Inline errors: red text below the invalid field + red field border
- Red toast summary for save-level error notification (Sonner already installed)
- All inline errors clear on the next save attempt (clean slate re-validation)

### Build order & plan structure
- Wave 1: Shared form components (FormField, TagInput, StructuredRow, SectionHeader) + singleton editors (Hero, Contact, Navigation)
- Wave 2: List-type editors with simple items (Skills, Tooling, Timeline, Coursework)
- Wave 3: Complex editors with nested arrays and uploads (Papers, Projects)
- One plan per wave (3 plans total: 10-01, 10-02, 10-03)
- Shared components extracted upfront in Wave 1 and reused across all subsequent editors

### Claude's Discretion
- Exact Zod schema implementation details
- Form field component internal structure and styling
- Section header visual treatment
- How the item list is styled (compact list vs cards)
- Auto-generated ID derivation logic details
- Whether to use controlled or uncontrolled form inputs
- Toast positioning and timing

</decisions>

<specifics>
## Specific Ideas

- The scrollable form with section headers should feel like editing a config in a dev tool — straightforward, not a marketing-site form builder
- Tag input (inline text + Enter) should feel snappy — immediate visual feedback when a tag is added
- The item picker at the top of list-type editors should feel like VS Code's file explorer — compact, clickable, clear which item is active
- All 9 editors should feel like the same tool with different fields, not 9 different UIs

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/admin/AdminShell.tsx` — complete shell with nav, scrollable editor area, save bar, toast notifications
- `src/admin/useAdminPanel.ts` — `ContentTypeKey` union type, `CONTENT_GROUPS` nav structure, dirty state tracking
- `src/admin/UploadZone.tsx` — drag-drop upload component for inline file fields (images, PDFs)
- `src/admin/codegen.ts` — `generateDataFile()` + `formatAndValidate()` for writing .ts data files
- `src/admin/atomic-write.ts` — `atomicWrite()` + `enqueueWrite()` with HMR suppression
- `src/types/data.ts` — all 9 content type interfaces (HeroData, Project, Paper, SkillGroup, etc.)
- `src/components/ui/button.tsx`, `sonner.tsx` — shadcn/ui components already installed
- shadcn/ui CLI available for adding `input`, `textarea`, `label`, `select`, `checkbox` components

### Established Patterns
- `CONTENT_REGISTRY` in `vite-plugin-admin-api.ts` maps all 9 content types to file/type/export metadata
- REST API: GET `/__admin-api/content/:type` reads data, POST writes data
- Data files follow pattern: `import type { X } from '../types/data'; export const x: X = { ... };`
- Single quotes, `import type` syntax, Tailwind v4 for styling, Motion for animations
- `@` path alias resolves to `./src`

### Integration Points
- `AdminShell.tsx` editor area (line 79–114) — currently shows placeholder text; replace with actual editor components
- `handleSave` (line 22) — currently shows toast stub; wire to actual API POST
- `useAdminPanel` — provides `activeContentType` to switch which editor renders
- Upload endpoint: POST `/__admin-api/upload/:type` for file uploads (already built in Phase 9)

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 10-content-editors*
*Context gathered: 2026-03-25*
