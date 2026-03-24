# Phase 6: Static Assets & Integration Fixes - Research

**Researched:** 2026-03-24
**Domain:** Static asset provisioning, navigation data wiring, dead code cleanup
**Confidence:** HIGH

## Summary

Phase 6 is a gap-closure phase identified by the v1 milestone audit. The site is functionally complete and deployed, but several runtime paths are broken because referenced static assets do not exist in `public/`, the Timeline section lacks a navigation link, the `paperPdf` field on projects is dead code, and three exports in `motion.ts` are orphaned. None of these issues require new libraries, architectural decisions, or complex engineering -- they are file creation, data wiring, and dead code removal tasks.

The primary risk is creating placeholder assets that look broken or unprofessional. PDFs need to be real multi-page documents (or convincing placeholders), SVGs need to be clean engineering-themed illustrations, and the portrait needs to be a real photo or a tasteful placeholder. The code changes (navigation data, paperPdf cleanup, motion.ts cleanup) are straightforward edits with clear boundaries and existing test coverage that will need updating.

**Primary recommendation:** Create placeholder static assets, add Timeline to navigation data, remove paperPdf dead code path, remove orphaned motion.ts exports, and update affected tests to match.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CONT-03 | User can download resume as a PDF via a prominent button | resume.pdf must exist in public/; Contact.tsx already has download button wired to contactData.resumePath (/resume.pdf) |
| DOCS-01 | User sees a papers section listing academic papers with titles and summaries | Papers section component is complete; paper PDF files must exist at paths defined in papers.ts |
| DOCS-02 | User can click a paper to view the PDF in-browser via Dialog/Drawer | PdfViewer and LazyPdfViewer components are fully wired; PDF files at /papers/*.pdf must exist to avoid error fallback |
| DOCS-04 | Resume is viewable in the same in-browser PDF viewer | LazyPdfViewer is wired in Contact.tsx with contactData.resumePath; resume.pdf must exist in public/ |
| PROJ-02 | Each project card shows thumbnail/preview, title, and brief description | ProjectCard renders img with project.thumbnail; SVG files at /projects/*.svg must exist in public/projects/ |
| NAV-02 | Navigation contains links to: Skills, Projects, Papers, Contact/Resume | Timeline section (id="timeline") is scroll-spy tracked but missing from navigation.ts navItems; need to add #timeline link |
</phase_requirements>

## Standard Stack

This phase does not introduce any new libraries. All work uses the existing stack.

### Core (already installed, no changes)
| Library | Version | Purpose | Relevance to Phase 6 |
|---------|---------|---------|----------------------|
| Vite | 8.0.1 | Build tool, serves public/ as static root | PDF/SVG/JPG files in public/ are served at root paths |
| React | 19.2.4 | UI framework | No component architecture changes needed |
| react-pdf | 10.4.1 | PDF rendering | Already wired; needs real PDF files to render |
| Vitest | 4.1.0 | Test runner | Tests need updating after navigation data and motion.ts changes |

### No new packages needed

Phase 6 is purely:
1. Adding files to `public/`
2. Editing `navigation.ts` (1 line addition)
3. Editing `ProjectsSection.tsx` (removing dead code comment)
4. Editing `motion.ts` (removing 3 exports)
5. Updating tests to match

## Architecture Patterns

### Existing Asset Convention

Vite serves everything in `public/` at the root URL path. The project already follows this pattern:
- `public/favicon.svg` -> `/favicon.svg`
- `public/og-image.png` -> `/og-image.png`
- `public/pdf.worker.min.mjs` -> `/pdf.worker.min.mjs`

All data files reference assets using absolute paths from root:
- `contactData.resumePath` = `'/resume.pdf'`
- `papers[].pdfPath` = `'/papers/lna-design.pdf'`, etc.
- `projects[].thumbnail` = `'/projects/lna-design.svg'`, etc.
- `WhoAmI.tsx` PORTRAIT_SRC = `'/portrait.jpg'`

### Required File Structure After Phase 6
```
public/
├── favicon.svg          # (exists)
├── icons.svg            # (exists)
├── og-image.png         # (exists)
├── og-image.svg         # (exists)
├── pdf.worker.min.mjs   # (exists)
├── portrait.jpg         # NEW - referenced by WhoAmI.tsx
├── resume.pdf           # NEW - referenced by contact.ts
├── papers/
│   ├── lna-design.pdf       # NEW - referenced by papers.ts
│   ├── mems-process-report.pdf  # NEW - referenced by papers.ts
│   └── fpga-fft.pdf         # NEW - referenced by papers.ts
└── projects/
    ├── lna-design.svg        # NEW - referenced by projects.ts (thumbnail)
    ├── lna-schematic.svg     # NEW - referenced by projects.ts (images[])
    ├── mems-accelerometer.svg # NEW - referenced by projects.ts (thumbnail)
    ├── mems-sem.svg          # NEW - referenced by projects.ts (images[])
    ├── fpga-processor.svg    # NEW - referenced by projects.ts (thumbnail)
    ├── fpga-block-diagram.svg # NEW - referenced by projects.ts (images[])
    ├── adc-frontend.svg      # NEW - referenced by projects.ts (thumbnail)
    └── adc-pcb.svg           # NEW - referenced by projects.ts (images[])
```

### Navigation Data Pattern

Current `navigation.ts`:
```typescript
export const navItems: NavItem[] = [
  {
    label: 'Background',
    href: '#about',
    children: [
      { label: 'Skills', href: '#skills' },
      { label: 'Lab & Tooling', href: '#tooling' },
    ],
  },
  { label: 'Projects', href: '#projects' },
  { label: 'Papers', href: '#papers' },
  { label: 'Contact', href: '#contact' },
];
```

Timeline (`id="timeline"`) is tracked by scroll-spy in `Navigation.tsx` (line 13: `sectionIds` array includes `'timeline'`) but has no corresponding entry in `navItems`. The section renders between Tooling and Projects in the page order (see App.tsx).

The natural placement for a Timeline nav link is inside the "Background" dropdown, after "Lab & Tooling", since Timeline follows Tooling in page order and is contextually related to the "Background" grouping.

### Dead Code: paperPdf Field

In `ProjectsSection.tsx` lines 50-54:
```typescript
onReadMore={() => {
  setExpandedId(null);
  // If project links to a paper PDF, defer to PDF viewer (handled by Plan 03)
  // Otherwise, open the detail Dialog/Drawer
  setDetailProject(project);
}}
```

The comment mentions routing to PDF viewer for projects with `paperPdf`, but no conditional logic was ever implemented. The `paperPdf` field exists on the `Project` type interface (`data.ts` line 60: `paperPdf?: string;`) and is populated on the LNA project (`projects.ts` line 18: `paperPdf: '/papers/lna-design.pdf'`).

**Decision needed:** Either implement the routing (check `project.paperPdf`, open PDF viewer instead of detail dialog) or remove the dead code (field from type, value from data, comment from component). The success criteria says "paperPdf field either routes to PDF viewer or dead code is removed." Removing is simpler and the paper is already accessible from the Papers section.

**Recommendation:** Remove the dead code. The LNA paper is already viewable from the Papers section. Adding PDF viewer routing to project cards would require importing LazyPdfViewer into ProjectsSection, adding open/close state, and managing two different detail modals -- unnecessary complexity for a link that duplicates the Papers section functionality.

### Orphaned Exports in motion.ts

Current exports in `motion.ts` and their usage:
| Export | Used By Components | Used By Tests Only | Status |
|--------|-------------------|-------------------|--------|
| `easing` | Navigation, HeroContent, MobileMenu, ProjectCard | motion.test.ts | KEEP |
| `fadeUp` | (none) | motion.test.ts | KEEP (used with spread operator pattern, low risk) |
| `fadeIn` | (none) | motion.test.ts | ORPHANED - remove |
| `staggerContainer` | (none) | motion.test.ts | ORPHANED - remove |
| `staggerChild` | (none) | motion.test.ts | ORPHANED - remove |
| `sectionVariants` | WhoAmI, Skills, Tooling, Contact, PapersSection, ProjectsSection, Coursework | motion.test.ts | KEEP |
| `fadeUpVariant` | WhoAmI, Skills, Tooling, Contact, PaperRow, PapersSection, ProjectsSection, Coursework | motion.test.ts | KEEP |
| `layoutTransition` | ProjectCard | motion.test.ts | KEEP |

`fadeUp` is also not imported by any component, but unlike the other three, it represents a simple "initial + animate + transition" pattern that could be used with spread syntax. However, by the success criteria ("No orphaned exports remain"), `fadeUp` should also be removed if truly unused. HeroContent defines its own inline variants (containerVariants, childVariants) and does not import fadeUp.

**Correction:** `fadeUp` is also orphaned -- no component imports it. Remove `fadeUp`, `fadeIn`, `staggerContainer`, and `staggerChild` (4 total orphaned exports). Update `motion.test.ts` to remove tests for these 4 exports and update the "no spring" deep-check array.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Placeholder PDFs | Write raw PDF bytes | Use a real PDF or a minimal PDF generator tool | PDF format is binary; hand-writing is error-prone |
| SVG illustrations | Complex hand-drawn SVGs | Simple geometric placeholder SVGs with engineering-themed shapes | Must render clean at aspect-video ratio in project cards |
| Portrait placeholder | Skip the image | Use a simple colored rectangle with initials, or prompt user for real photo | WhoAmI already has onError handler that hides broken images |

**Key insight:** The user (Jack) will need to provide real content files eventually. For now, well-structured placeholder files that demonstrate the layout works are sufficient. PDFs should be multi-page to exercise page navigation in PdfViewer. SVGs should be sized to work at the aspect-video ratio used in ProjectCard.

## Common Pitfalls

### Pitfall 1: PDF Placeholder Too Simple
**What goes wrong:** A single-page blank PDF doesn't exercise the page navigation controls in PdfViewer.
**Why it happens:** Taking the minimal path for placeholder content.
**How to avoid:** Create PDFs with at least 2-3 pages so the page nav (prev/next buttons) is testable.
**Warning signs:** PdfViewer always shows "1 / 1" for all papers.

### Pitfall 2: SVG Aspect Ratio Mismatch
**What goes wrong:** Placeholder SVGs don't match the `aspect-video` (16:9) CSS class used on `<img>` in ProjectCard, causing letterboxing or cropping.
**Why it happens:** SVGs have their own viewBox that may not match the container's aspect ratio.
**How to avoid:** Use `viewBox="0 0 640 360"` (16:9) in all project SVGs. This matches `aspect-video`.
**Warning signs:** Images look squished, have white bars, or are cropped oddly.

### Pitfall 3: Navigation Test Hardcoded Count
**What goes wrong:** `navigation.test.ts` asserts `navItems` has exactly 4 items and Background has 2 children. Adding Timeline as a child of Background breaks both assertions.
**Why it happens:** Tests are tightly coupled to current data shape.
**How to avoid:** Update the test assertions: Background children count from 2 to 3, and add a check for the Timeline child.
**Warning signs:** `navigation.test.ts` fails after editing navigation.ts.

### Pitfall 4: Motion Test Imports Break
**What goes wrong:** `motion.test.ts` imports `fadeIn`, `staggerChild`, `staggerContainer` which will no longer exist after cleanup.
**Why it happens:** Tests were written to validate all exports including orphaned ones.
**How to avoid:** Update `motion.test.ts` to remove imports and test cases for the removed exports. Update the "no spring" deep-check array to only include remaining exports.
**Warning signs:** TypeScript compilation errors in test files.

### Pitfall 5: Forgetting images[] Paths
**What goes wrong:** Only thumbnail SVGs are created, but `project.images[]` also references additional SVGs (e.g., `lna-schematic.svg`, `mems-sem.svg`) that are rendered in `ProjectDetail`.
**Why it happens:** Looking only at the thumbnail field and missing the images array.
**How to avoid:** Cross-reference both `thumbnail` and `images[]` fields for all 4 projects. There are 8 unique SVG paths total.
**Warning signs:** Thumbnails render in card grid but detail dialog shows broken images.

### Pitfall 6: Git LFS or Large Binary Commits
**What goes wrong:** Committing large PDFs or images to a regular git repo bloats the repository.
**Why it happens:** Placeholder PDFs/images may be unnecessarily large.
**How to avoid:** Keep placeholders small. PDFs under 100KB, SVGs under 10KB, portrait JPG under 200KB.
**Warning signs:** Git push takes unusually long; repo size jumps significantly.

## Code Examples

### Adding Timeline to Navigation Data
```typescript
// src/data/navigation.ts
export const navItems: NavItem[] = [
  {
    label: 'Background',
    href: '#about',
    children: [
      { label: 'Skills', href: '#skills' },
      { label: 'Lab & Tooling', href: '#tooling' },
      { label: 'Timeline', href: '#timeline' },  // NEW
    ],
  },
  { label: 'Projects', href: '#projects' },
  { label: 'Papers', href: '#papers' },
  { label: 'Contact', href: '#contact' },
];
```

### Removing paperPdf Dead Code

**From `src/types/data.ts`**, remove line 60:
```typescript
// REMOVE: paperPdf?: string;
```

**From `src/data/projects.ts`**, remove line 18 from the LNA project:
```typescript
// REMOVE: paperPdf: '/papers/lna-design.pdf',
```

**From `src/components/projects/ProjectsSection.tsx`**, clean up the comment at lines 50-54:
```typescript
onReadMore={() => {
  setExpandedId(null);
  setDetailProject(project);
}}
```

### Cleaning Orphaned Motion Exports

**From `src/styles/motion.ts`**, remove these exports (keep easing, sectionVariants, fadeUpVariant, layoutTransition):
```typescript
// REMOVE: fadeUp (lines 12-15)
// REMOVE: fadeIn (lines 17-21)
// REMOVE: staggerContainer (lines 24-30)
// REMOVE: staggerChild (lines 33-40)
```

### Minimal Placeholder SVG Template (16:9)
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" fill="none">
  <rect width="640" height="360" fill="#F8F9FA"/>
  <text x="320" y="180" text-anchor="middle" dominant-baseline="middle"
        font-family="Inter, sans-serif" font-size="24" fill="#6B7280">
    [Project Name]
  </text>
</svg>
```

## State of the Art

No technology changes are relevant. This phase is purely operational -- adding missing files and cleaning dead code.

| Old State | New State | Impact |
|-----------|-----------|--------|
| PDFs referenced but missing | PDFs exist in public/ | PdfViewer renders content instead of error fallback |
| SVGs referenced but missing | SVGs exist in public/projects/ | Project cards show thumbnails instead of broken images |
| Timeline unreachable via nav | Timeline in Background dropdown | Section accessible via keyboard/click navigation |
| paperPdf field unused | paperPdf removed from type + data | Cleaner type interface, no confusion about routing |
| 4 orphaned motion exports | Removed from motion.ts | Smaller bundle, no dead code confusion |

## Open Questions

1. **Real vs. placeholder content files**
   - What we know: The user (Jack) would need to provide real resume PDF, academic paper PDFs, portrait photo, and project illustration SVGs for a production portfolio.
   - What's unclear: Whether the user wants real content added now or just well-structured placeholders.
   - Recommendation: Create high-quality placeholders that demonstrate layout correctness. Mark with clear comments that they should be replaced with real content. PDFs should be multi-page to exercise viewer controls.

2. **Timeline nav link placement**
   - What we know: Timeline renders between Tooling and Projects in App.tsx. The "Background" dropdown currently contains Skills and Lab & Tooling.
   - What's unclear: Whether Timeline conceptually belongs in "Background" dropdown or as a top-level nav item.
   - Recommendation: Add as third child of "Background" dropdown. It's part of the "who Jack is" story and follows Tooling in page order. Adding a new top-level item would clutter the nav.

3. **fadeUp export -- truly orphaned?**
   - What we know: No component imports `fadeUp` from motion.ts. HeroContent defines its own inline variants.
   - What's unclear: Whether fadeUp was intended for future use.
   - Recommendation: Remove it. Success criteria says "no orphaned exports." If needed later, it can be re-added.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.0 |
| Config file | vitest.config.ts |
| Quick run command | `npx vitest --run` |
| Full suite command | `npx vitest --run` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CONT-03 | resume.pdf exists at contactData.resumePath | unit (file existence) | `npx vitest --run src/data/__tests__/contact.test.ts` | Exists (needs asset existence test added) |
| DOCS-01 | Paper PDF paths resolve to real files | unit (file existence) | `npx vitest --run src/data/__tests__/papers.test.ts` | Exists (needs asset existence test added) |
| DOCS-02 | PdfViewer renders without error for valid PDF | manual-only | Manual: open paper in browser | N/A - requires browser |
| DOCS-04 | Resume renders in PdfViewer | manual-only | Manual: click View Resume in browser | N/A - requires browser |
| PROJ-02 | Project thumbnail SVGs exist at defined paths | unit (file existence) | `npx vitest --run src/data/__tests__/projects.test.ts` | Exists (needs asset existence test added) |
| NAV-02 | Timeline link exists in navigation data | unit | `npx vitest --run src/data/__tests__/navigation.test.ts` | Exists (needs assertion update) |

### Additional Test Updates Required
| Test File | Current State | Required Changes |
|-----------|---------------|-----------------|
| `navigation.test.ts` | Asserts 4 nav items, Background has 2 children | Update: Background has 3 children, add Timeline child check |
| `motion.test.ts` | Imports and tests fadeUp, fadeIn, staggerContainer, staggerChild | Remove imports and tests for all 4 removed exports; update no-spring array |
| `projects.test.ts` | Validates data shape only | Optionally add file existence check for thumbnails |
| `papers.test.ts` | Validates data shape only | Optionally add file existence check for pdfPath |
| `contact.test.ts` | Validates resumePath = '/resume.pdf' | Optionally add file existence check |

### Sampling Rate
- **Per task commit:** `npx vitest --run`
- **Per wave merge:** `npx vitest --run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] Static asset files (PDFs, SVGs, JPG) in `public/` -- must be created before asset existence tests can pass
- [ ] Navigation test assertions need updating for Timeline addition
- [ ] Motion test imports need updating for removed exports

## Sources

### Primary (HIGH confidence)
- Direct codebase analysis of all referenced files (see research methodology above)
- v1 milestone audit (`v1-MILESTONE-AUDIT.md`) -- definitive list of gaps and integration issues
- Existing test suite (16 files, 80 tests, all passing) -- establishes test patterns and current assertions

### Secondary (MEDIUM confidence)
- Vite public directory documentation -- static assets served from public/ at root path (standard Vite behavior, well-known)

### Tertiary (LOW confidence)
- None -- all findings are from direct codebase inspection

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new libraries, pure file/data changes
- Architecture: HIGH -- all patterns already established in codebase, just filling gaps
- Pitfalls: HIGH -- all identified from direct code analysis (hardcoded test counts, missing images[] paths, etc.)

**Research date:** 2026-03-24
**Valid until:** 2026-04-24 (stable -- no external dependencies changing)
