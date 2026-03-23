# Phase 3: Interactive Features - Research

**Researched:** 2026-03-23
**Domain:** Bento grid with Motion layout animations, PDF viewer (react-pdf), shadcn Dialog/Drawer
**Confidence:** MEDIUM-HIGH

## Summary

Phase 3 introduces the two flagship interactive experiences: a bento grid of 3-5 project cards with inline expansion using Motion layout animations, and an in-browser PDF viewer using react-pdf with shadcn Dialog (desktop) and Drawer (mobile). This phase has three distinct technical challenges: (1) Motion `layout` prop for smooth inline card expand/collapse within a CSS grid, (2) react-pdf worker configuration that survives Vite 8 production builds, and (3) shadcn/ui initialization into an existing Tailwind v4 project that has no path aliases or shadcn setup yet.

The project currently has no `components.json`, no `@/` path alias, and no `src/components/ui/` directory. Setting up shadcn/ui is a prerequisite that must happen before Dialog/Drawer components can be used. React-pdf's worker file handling in Vite production builds is an acknowledged risk from STATE.md -- the recommended mitigation is copying the worker to the `public/` folder with a stable filename rather than relying on Vite's hashed asset pipeline.

**Primary recommendation:** Initialize shadcn/ui first (with Radix, not Base UI -- Radix is battle-tested and the project already conceptually depends on it). Use Motion's `layout` prop (not `layoutId`) for inline card expansion since cards stay in place rather than morphing between views. For react-pdf, copy the worker to `public/` for production reliability rather than using `import.meta.url` which is brittle across Vite builds.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- 3-column grid on desktop, single-column on mobile
- Variable-size cards: one featured project spans 2 columns (flagged via `featured: true` in data file)
- Image thumbnails with fixed aspect ratio (object-cover) at top of each card
- Subtle box-shadow on cards (not 0.5px borders) -- cards float slightly
- Hover effect: subtle lift (translateY -2px) + shadow deepens, weighted tween
- "Projects" section heading above the grid, consistent with other sections
- Section uses the established `max-w-5xl` container
- Each card shows: thumbnail image, project title (bold), one-line description
- Domain tag pill (e.g. "RF", "Fabrication", "Analog") displayed below the description
- Domain categories align with the skill domains from Phase 2
- Stylized graphic thumbnails (not photographs)
- Inline expansion: card grows in place, pushes cards below down
- Only one card expanded at a time -- expanding a new card auto-collapses the previous one
- Expanded view shows: brief paragraph summary + tech stack tags
- Subtle "collapse" button added to expanded card to close it
- "Read more" button in expanded view opens full project detail in Dialog (desktop) / Drawer (mobile)
- Smooth Motion layout animation for expand/collapse transitions
- Desktop Dialog: overlay with dimmed backdrop, two-column layout (image gallery left, description right)
- Mobile: stacks to single column vertically
- Papers section is separate from Projects (not mixed in bento grid)
- Clean row listing for papers: title (bold), brief descriptor, "View" action
- Resume is NOT listed in Papers -- accessed only via Contact section download button
- PDF viewer: near-full-screen Dialog (~90% viewport) on desktop, full-height Drawer (~95%) on mobile
- PDF controls: page nav (prev/next + page indicator), zoom in/out, download button, close button
- Uses react-pdf -- must test production Vite build
- Shadcn Dialog/Drawer components

### Claude's Discretion
- Exact shadow values and hover animation timing
- Fixed aspect ratio value for thumbnails (16:9 vs 4:3)
- Gallery/carousel implementation in project detail Dialog
- PDF viewer toolbar design and control placement
- Domain tag pill styling (colors, border-radius)
- Stagger animation timing for bento grid entry
- Exact Dialog/Drawer sizing and padding
- How expanded card summary paragraph is structured

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PROJ-01 | 3-5 projects in bento grid with variable-size cards | CSS grid with `grid-template-columns`, featured card spans 2 cols via `col-span-2`, Motion stagger entry |
| PROJ-02 | Each card shows thumbnail/preview, title, brief description | Data-driven rendering from `src/data/projects.ts` with `Project` interface, `object-cover` for thumbnails |
| PROJ-03 | Click card for inline expansion with full description, visuals, tech stack, links | Motion `layout` prop on card container, `AnimatePresence` for expanded content, state management for single-expansion |
| PROJ-04 | Card expansion/collapse uses Motion layout animations | `layout` prop auto-animates height/position changes; use `layout="position"` on non-expanding children to prevent distortion |
| PROJ-05 | Project data driven from TypeScript data files | New `Project` interface in `src/types/data.ts`, data file `src/data/projects.ts` following established pattern |
| PROJ-06 | Bento grid collapses to single-column on mobile | Responsive grid: `grid-cols-1 md:grid-cols-3`, featured card loses `col-span-2` on mobile |
| DOCS-01 | Papers section listing academic papers with titles and summaries | New `Paper` interface in `src/types/data.ts`, data file `src/data/papers.ts`, row-based layout distinct from bento grid |
| DOCS-02 | Click paper to view PDF in-browser via Dialog (desktop) / Drawer (mobile) | shadcn Dialog + Drawer with `useIsMobile` hook, react-pdf `Document` + `Page` components inside |
| DOCS-03 | Download any PDF directly as fallback | Download button using `<a href={pdfPath} download>` or programmatic download alongside viewer controls |
| DOCS-04 | Resume viewable in same PDF viewer | Reuse `PdfViewer` component, trigger from Contact section's existing `resumePath` data |
| DOCS-05 | react-pdf works in both dev and production Vite builds | Copy worker to `public/`, stable workerSrc path, production build test as verification step |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| motion | ^12.38.0 | Layout animations for card expand/collapse | Already installed; `layout` prop handles height/position animation via CSS transform |
| react-pdf | ^10.x | PDF rendering in-browser | De facto React PDF viewer; wraps pdfjs-dist with React components |
| pdfjs-dist | (peer dep of react-pdf) | PDF parsing engine + worker | Required by react-pdf, bundled automatically |
| shadcn/ui | latest (CLI v4) | Dialog, Drawer UI primitives | Project spec requires it; Radix-based, pairs with Tailwind v4 |
| vaul | (dep of shadcn Drawer) | Drawer primitive | Automatically installed with shadcn Drawer component |
| radix-ui | (dep of shadcn Dialog) | Dialog primitive | Automatically installed with shadcn Dialog component |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| vite-plugin-static-copy | latest | Copy pdfjs-dist cMaps to build output | Only if non-latin PDF characters needed; optional for this portfolio |
| lucide-react | ^0.577.0 | Icons for controls (ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, X) | Already installed; use for PDF viewer toolbar icons |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| react-pdf | @react-pdf-viewer/core | More features but heavier bundle, overkill for a simple viewer |
| shadcn Dialog/Drawer | Custom Radix primitives | shadcn gives styled, accessible components out of the box |
| Motion layout | CSS transitions on height | CSS `auto` height animation is unreliable; Motion handles it properly |
| useIsMobile hook | CSS media queries only | Need JS-level conditional rendering for Dialog vs Drawer |

**Installation:**
```bash
# shadcn initialization (run first, handles its own deps)
npx shadcn@latest init

# shadcn components
npx shadcn@latest add dialog drawer

# react-pdf
npm install react-pdf
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   ├── ui/              # shadcn components (auto-generated)
│   │   ├── dialog.tsx
│   │   └── drawer.tsx
│   ├── projects/        # Bento grid + cards
│   │   ├── ProjectsSection.tsx    # Section wrapper with bento grid
│   │   ├── ProjectCard.tsx        # Individual card (collapsed + expanded)
│   │   └── ProjectDetail.tsx      # Full detail Dialog/Drawer content
│   ├── papers/          # Papers section
│   │   ├── PapersSection.tsx      # Section wrapper with row listing
│   │   └── PaperRow.tsx           # Individual paper row
│   ├── pdf/             # PDF viewer (shared)
│   │   └── PdfViewer.tsx          # Dialog/Drawer + react-pdf Document/Page
│   ├── sections/        # Existing sections (Skills, Tooling, etc.)
│   └── layout/          # Existing layout (Nav, SmoothScroll)
├── data/
│   ├── projects.ts      # Project data
│   └── papers.ts        # Paper data
├── types/
│   └── data.ts          # Add Project, Paper interfaces
├── hooks/
│   └── useIsMobile.ts   # Mobile detection for Dialog vs Drawer
└── styles/
    └── motion.ts        # Add layout transition config
```

### Pattern 1: Motion Layout Expand/Collapse
**What:** Use Motion's `layout` prop to automatically animate card height changes when expanded content is toggled via React state.
**When to use:** Card inline expansion -- the card stays in place and grows, pushing siblings down.
**Example:**
```typescript
// Source: motion.dev/docs/react-layout-animations
import { motion, AnimatePresence } from 'motion/react';

function ProjectCard({ project, isExpanded, onToggle }) {
  return (
    <motion.div
      layout  // Animate position + size changes
      className={`rounded-xl shadow-md ${project.featured ? 'md:col-span-2' : ''}`}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
    >
      {/* Collapsed content -- always visible */}
      <motion.div layout="position" onClick={onToggle}>
        <img src={project.thumbnail} className="w-full aspect-video object-cover" />
        <h3>{project.title}</h3>
        <p>{project.brief}</p>
        <span className="domain-pill">{project.domain}</span>
      </motion.div>

      {/* Expanded content -- conditionally rendered */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p>{project.summary}</p>
            <div>{/* tech stack tags */}</div>
            <button>Read more</button>
            <button onClick={onToggle}>Collapse</button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
```

**Key details:**
- `layout` on the outer container animates the size change automatically
- `layout="position"` on inner non-expanding children prevents them from being distorted by the parent's scale transform
- `AnimatePresence` handles enter/exit of the expanded content
- Use the project's existing `easing.out` curve for the transition
- Only ONE card expanded at a time: parent manages `expandedId` state

### Pattern 2: Responsive Dialog/Drawer
**What:** Render shadcn Dialog on desktop, Drawer on mobile, using a `useIsMobile` hook.
**When to use:** Project detail view and PDF viewer.
**Example:**
```typescript
// Source: shadcn/ui responsive dialog pattern
import { useIsMobile } from '@/hooks/useIsMobile';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';

function ResponsiveModal({ open, onOpenChange, title, children }) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
          {children}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
```

### Pattern 3: react-pdf Worker Setup for Vite
**What:** Configure react-pdf with a stable worker path that survives production builds.
**When to use:** PdfViewer component.
**Example:**
```typescript
// Source: github.com/wojtekmaj/react-pdf README
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Point to worker in public/ folder -- stable across builds
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

function PdfViewer({ file, onClose }) {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);

  return (
    <Document file={file} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
      <Page pageNumber={pageNumber} scale={scale} />
    </Document>
  );
}
```

### Pattern 4: Data-Driven Section (Following Established Pattern)
**What:** Type interface in `data.ts`, data file in `src/data/`, component renders from data.
**When to use:** All new sections (Projects, Papers).
**Example:**
```typescript
// src/types/data.ts -- add to existing file
export interface Project {
  id: string;
  title: string;
  brief: string;          // One-line card description
  summary: string;        // Expanded view paragraph
  thumbnail: string;      // Path to stylized graphic
  images: string[];       // Gallery images for detail view
  domain: string;         // "RF" | "Fabrication" | "Analog" | "Digital"
  techStack: string[];    // Tech stack tags
  links: { label: string; url: string }[];
  featured: boolean;      // Spans 2 columns in bento grid
  paperPdf?: string;      // If project links to a paper PDF
}

export interface Paper {
  id: string;
  title: string;
  descriptor: string;     // Course/publication context
  pdfPath: string;        // Path to PDF in public/
}
```

### Anti-Patterns to Avoid
- **Using `layoutId` for inline expansion:** `layoutId` is for shared element transitions between two different components (e.g., list item morphing into a full-page view). For inline expansion where the card stays in place, use the `layout` prop instead.
- **Setting workerSrc in a separate module from the PDF component:** React module execution order can cause the default to overwrite your setting. Always configure `pdfjs.GlobalWorkerOptions.workerSrc` in the same file that renders `<Document>`.
- **Using `import.meta.url` for worker in production builds:** Vite hashes the worker filename, causing cache invalidation issues and potential 404s on redeployment. Copy the worker file to `public/` with a stable name.
- **Animating height with CSS transitions:** `height: auto` cannot be animated with CSS transitions. Motion's `layout` prop handles this correctly via FLIP animation (measures before/after, animates with transforms).
- **Using spring animations:** The project enforces tween-only animations via unit tests. All new transition configs must use `duration` + `ease`, never `type: "spring"`.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| PDF rendering | Canvas-based PDF renderer | react-pdf (wraps pdfjs-dist) | PDF parsing is enormously complex; font rendering, form fields, annotations |
| Modal overlay | Custom portal + backdrop | shadcn Dialog (Radix primitive) | Focus trapping, scroll lock, keyboard dismiss, screen reader announcements |
| Bottom sheet / drawer | Custom slide-up panel | shadcn Drawer (Vaul) | Touch gesture handling, snap points, backdrop dimming, iOS rubber-band physics |
| Mobile detection | `window.innerWidth` check | Dedicated `useIsMobile` hook with resize listener + matchMedia | SSR safety, resize debouncing, consistent breakpoint with Tailwind |
| Layout animations | Manual FLIP calculations | Motion `layout` prop | FLIP is complex to implement correctly; Motion handles measurement, interpolation, and interruption |

**Key insight:** This phase has three genuinely complex UI primitives (PDF viewer, accessible modal, layout animation) that each have dedicated libraries solving thousands of edge cases. Custom implementations would be a multi-week detour.

## Common Pitfalls

### Pitfall 1: react-pdf Worker 404 in Production
**What goes wrong:** PDF viewer works in dev but fails in production with a worker file 404.
**Why it happens:** Vite adds content hashes to the worker filename. On redeployment, cached `main.js` references an old worker hash that no longer exists.
**How to avoid:** Copy `pdfjs-dist/build/pdf.worker.min.mjs` to `public/pdf.worker.min.mjs` and set `workerSrc = '/pdf.worker.min.mjs'` (stable path, no hash).
**Warning signs:** Console error "Setting up fake worker" or "Failed to load worker" after deploying.

### Pitfall 2: Motion Layout Distortion on Children
**What goes wrong:** Text and images inside an expanding card appear stretched or squished during the animation.
**Why it happens:** Motion uses CSS `scale()` transforms to animate layout changes. Children inherit the parent's scale, distorting their appearance.
**How to avoid:** Add `layout="position"` to child elements that should not scale with the parent. This tells Motion to only animate their position, not size.
**Warning signs:** Text briefly appears wider/narrower during expand/collapse.

### Pitfall 3: shadcn Init Overwrites Existing CSS
**What goes wrong:** Running `shadcn init` adds new CSS variables and potentially conflicts with the existing `@theme` block in `app.css`.
**Why it happens:** shadcn init generates its own color variables and `@theme` configuration.
**How to avoid:** Run `shadcn init` and then carefully merge the generated CSS with the existing `app.css`, preserving the cleanroom palette tokens (`text-ink`, `bg-cleanroom`, `bg-silicon-*`, `color-accent`). The shadcn variables (like `--background`, `--foreground`) can coexist but must map to the existing palette.
**Warning signs:** Colors shift after shadcn init; existing components lose their styling.

### Pitfall 4: Path Aliases Not Configured
**What goes wrong:** shadcn components use `@/components/ui/dialog` imports, but the project has no `@/` alias.
**Why it happens:** The current `tsconfig.app.json` has no `baseUrl` or `paths` config, and `vite.config.ts` has no `resolve.alias`.
**How to avoid:** Before running `shadcn init`, add path aliases to both `tsconfig.app.json` and `vite.config.ts`. The shadcn CLI may do this automatically, but verify.
**Warning signs:** TypeScript "Cannot find module '@/...'" errors.

### Pitfall 5: Bento Grid Column Span Breakage on Mobile
**What goes wrong:** Featured card with `col-span-2` overflows on single-column mobile layout.
**Why it happens:** `col-span-2` in a `grid-cols-1` layout causes the element to try spanning 2 columns that don't exist.
**How to avoid:** Use responsive classes: `col-span-1 md:col-span-2` for featured cards.
**Warning signs:** Card extends beyond viewport on mobile.

### Pitfall 6: Multiple Cards Expanded Simultaneously
**What goes wrong:** User clicks multiple cards rapidly and more than one ends up expanded.
**Why it happens:** State update race condition if using separate boolean states per card.
**How to avoid:** Use a single `expandedId: string | null` state in the parent component. Setting a new ID auto-collapses the previous card.
**Warning signs:** Layout breaks with multiple expanded cards overlapping.

### Pitfall 7: Lenis Scroll Lock Conflict with Dialog/Drawer
**What goes wrong:** User can scroll the background page while a Dialog/Drawer is open, or Lenis prevents the Dialog content from scrolling.
**Why it happens:** Lenis manages scroll globally. Radix Dialog and Vaul Drawer also try to lock body scroll.
**How to avoid:** Call `lenis.stop()` when Dialog/Drawer opens and `lenis.start()` when it closes. The project already uses this pattern for the mobile nav menu.
**Warning signs:** Background scrolls behind modal; or Dialog content is unscrollable.

## Code Examples

Verified patterns from existing project code and official sources:

### Bento Grid CSS Layout
```typescript
// Responsive 3-column bento grid with featured card spanning 2 cols
<div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
  {projects.map((project) => (
    <ProjectCard
      key={project.id}
      project={project}
      isExpanded={expandedId === project.id}
      onToggle={() => setExpandedId(
        expandedId === project.id ? null : project.id
      )}
      className={project.featured ? 'col-span-1 md:col-span-2' : ''}
    />
  ))}
</div>
```

### Section Entry Animation (Following Established Pattern)
```typescript
// Source: Existing Skills.tsx section pattern
import { motion } from 'motion/react';
import { sectionVariants, fadeUpVariant } from '../../styles/motion';

export function ProjectsSection() {
  return (
    <motion.section
      id="projects"
      aria-label="Projects"
      className="px-6 py-24"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
    >
      <div className="mx-auto max-w-5xl">
        <motion.h2
          className="text-2xl font-bold text-ink"
          variants={fadeUpVariant}
        >
          Projects
        </motion.h2>
        {/* Bento grid here */}
      </div>
    </motion.section>
  );
}
```

### useIsMobile Hook
```typescript
// src/hooks/useIsMobile.ts
import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => setIsMobile(mql.matches);
    mql.addEventListener('change', onChange);
    setIsMobile(mql.matches);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return isMobile;
}
```

### Card Hover Effect (Locked Decision)
```typescript
// Subtle lift + shadow deepen on hover, weighted tween
<motion.div
  layout
  className="rounded-xl bg-cleanroom shadow-md cursor-pointer"
  whileHover={{
    y: -2,
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
  }}
  transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
>
  {/* card content */}
</motion.div>
```

### PDF Worker Copy Script
```bash
# Add to package.json scripts or run during build
# Copy worker to public/ for stable production path
cp node_modules/pdfjs-dist/build/pdf.worker.min.mjs public/pdf.worker.min.mjs
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| framer-motion package | motion package | 2024 (Motion v11) | Import from `motion/react` not `framer-motion`; already done in this project |
| react-pdf v7 with CommonJS worker | react-pdf v10 with ESM worker (.mjs) | 2024-2025 | Worker file is now `pdf.worker.min.mjs` not `pdf.worker.min.js` |
| shadcn/ui v3 with separate Radix packages | shadcn CLI v4 with unified `radix-ui` package | March 2026 | Single `radix-ui` import; CLI can scaffold full projects; Base UI option available |
| tailwindcss-animate for shadcn animations | tw-animate-css | March 2025 | Deprecated old animate package; shadcn CLI v4 handles this automatically |
| HSL color variables for shadcn | OKLCH color variables | Tailwind v4 transition | Project already uses OKLCH; shadcn v4 with Tailwind v4 matches |
| forwardRef in shadcn components | React.ComponentProps (React 19) | 2025 | Simpler component code; project uses React 19 so this applies |

**Deprecated/outdated:**
- `tailwindcss-animate`: Replaced by `tw-animate-css` for shadcn components
- `framer-motion` npm package: Renamed to `motion`; project already uses the new package
- react-pdf v7/v8 worker paths: v10 uses `.mjs` extension

## Open Questions

1. **shadcn init interaction with existing Tailwind v4 `@theme` block**
   - What we know: The project has a custom `@theme` block with oklch colors. shadcn CLI v4 generates its own `@theme` or CSS variable block.
   - What's unclear: Exact merge behavior -- does CLI v4 detect existing `@theme` and append, or does it overwrite?
   - Recommendation: Run `shadcn init --dry-run` first to see what it would change. Manually merge the output with existing `app.css` if needed. Back up `app.css` before running init.

2. **Gallery/carousel for project detail Dialog**
   - What we know: The expanded Dialog needs an image gallery on the left side (desktop two-column layout).
   - What's unclear: Whether to use a simple thumbnail grid, a carousel with prev/next, or a lightbox pattern.
   - Recommendation: Start with a simple stacked image list. If the user wants carousel behavior, shadcn has a carousel component that can be added later. Keep it simple for v1.

3. **PDF file placement and paths**
   - What we know: Resume is at `/resume.pdf` (from contactData). Papers will have PDF files.
   - What's unclear: Whether PDFs exist yet or are placeholders.
   - Recommendation: Create the data structures expecting files in `public/papers/` and `public/resume.pdf`. Use placeholder text if files don't exist yet.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.0 |
| Config file | `vitest.config.ts` |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PROJ-01 | Projects data has 3-5 entries, one featured | unit | `npx vitest run src/data/__tests__/projects.test.ts -t "projects" --reporter=verbose` | No -- Wave 0 |
| PROJ-02 | Each project has thumbnail, title, brief | unit | `npx vitest run src/data/__tests__/projects.test.ts -t "required fields" --reporter=verbose` | No -- Wave 0 |
| PROJ-03 | Expandable card renders expanded content | unit | `npx vitest run src/data/__tests__/projects.test.ts --reporter=verbose` | No -- Wave 0 |
| PROJ-04 | Motion config uses tween, no spring | unit | `npx vitest run src/styles/__tests__/motion.test.ts -t "spring" --reporter=verbose` | Yes (existing, extend) |
| PROJ-05 | Project data is typed and complete | unit | `npx vitest run src/data/__tests__/projects.test.ts --reporter=verbose` | No -- Wave 0 |
| PROJ-06 | Grid responsive classes present | manual-only | Visual check at mobile breakpoint | N/A |
| DOCS-01 | Papers data has entries with titles | unit | `npx vitest run src/data/__tests__/papers.test.ts --reporter=verbose` | No -- Wave 0 |
| DOCS-02 | Paper PDF path is valid string | unit | `npx vitest run src/data/__tests__/papers.test.ts -t "pdfPath" --reporter=verbose` | No -- Wave 0 |
| DOCS-03 | Download fallback link present | manual-only | Visual check for download button | N/A |
| DOCS-04 | Resume path matches contact data | unit | `npx vitest run src/data/__tests__/papers.test.ts -t "resume" --reporter=verbose` | No -- Wave 0 |
| DOCS-05 | react-pdf production build | smoke | `npm run build && npm run preview` | Manual verification |

### Sampling Rate
- **Per task commit:** `npx vitest run --reporter=verbose`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green + production build test before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/data/__tests__/projects.test.ts` -- covers PROJ-01, PROJ-02, PROJ-05 (data shape validation)
- [ ] `src/data/__tests__/papers.test.ts` -- covers DOCS-01, DOCS-02, DOCS-04 (data shape validation)
- [ ] Extend `src/styles/__tests__/motion.test.ts` -- add new layout transition configs to spring check

## Sources

### Primary (HIGH confidence)
- [react-pdf GitHub README](https://github.com/wojtekmaj/react-pdf) -- Worker setup, Vite config, v10 API
- [shadcn/ui Vite installation](https://ui.shadcn.com/docs/installation/vite) -- Init command, path alias setup
- [shadcn/ui Dialog docs](https://ui.shadcn.com/docs/components/radix/dialog) -- Dialog API, imports, usage
- [shadcn/ui Drawer docs](https://ui.shadcn.com/docs/components/radix/drawer) -- Drawer API, Vaul integration
- [shadcn/ui Tailwind v4 guide](https://ui.shadcn.com/docs/tailwind-v4) -- CSS variable migration, OKLCH, `@theme inline`
- [Motion layout animations docs](https://motion.dev/docs/react-layout-animations) -- `layout` prop, `layout="position"`, FLIP approach

### Secondary (MEDIUM confidence)
- [shadcn CLI v4 changelog](https://ui.shadcn.com/docs/changelog/2026-03-cli-v4) -- New CLI features, `--base` flag, preset system
- [Responsive Dialog/Drawer pattern](https://www.nextjsshop.com/resources/blog/responsive-dialog-drawer-shadcn-ui) -- useIsMobile + conditional rendering pattern
- [react-pdf Vite issues](https://github.com/wojtekmaj/react-pdf/issues/1843) -- Worker config with React.lazy, module execution order

### Tertiary (LOW confidence)
- [react-pdf production fix article](https://medium.com/@prospercoded/how-i-fixed-the-it-works-on-my-machine-pdf-js-nightmare-in-vite-54adfe92e7f2) -- Public folder worker approach (could not verify full content, but pattern corroborated by multiple issues)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- react-pdf and shadcn are well-documented; Motion already in use
- Architecture: HIGH -- follows existing project patterns (data-driven sections, motion variants)
- Pitfalls: HIGH -- react-pdf Vite issues are extensively documented in GitHub issues; Motion layout distortion is well-known
- shadcn v4 + Tailwind v4 integration: MEDIUM -- CLI v4 just released (March 2026); exact merge behavior with existing `@theme` needs validation at init time

**Research date:** 2026-03-23
**Valid until:** 2026-04-07 (14 days -- shadcn CLI v4 is very new, may have patches)
