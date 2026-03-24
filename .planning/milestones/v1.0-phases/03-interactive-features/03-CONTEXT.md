# Phase 3: Interactive Features - Context

**Gathered:** 2026-03-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Two flagship interactive experiences: a bento grid of 3-5 project cards with inline expansion and full-detail Dialog/Drawer, and an in-browser PDF viewer for academic papers. Projects and Papers are separate sections with distinct interaction patterns. Resume is accessed only via the Contact section, not the Papers listing.

</domain>

<decisions>
## Implementation Decisions

### Bento grid layout
- 3-column grid on desktop, single-column on mobile
- Variable-size cards: one featured project spans 2 columns (flagged via `featured: true` in data file)
- Image thumbnails with fixed aspect ratio (object-cover) at top of each card
- Subtle box-shadow on cards (not 0.5px borders) — cards float slightly
- Hover effect: subtle lift (translateY -2px) + shadow deepens, weighted tween
- "Projects" section heading above the grid, consistent with other sections
- Section uses the established `max-w-5xl` container

### Card content (collapsed state)
- Each card shows: thumbnail image, project title (bold), one-line description
- Domain tag pill (e.g. "RF", "Fabrication", "Analog") displayed below the description
- Domain categories align with the skill domains from Phase 2
- Stylized graphic thumbnails (not photographs) — polished illustrations, diagrams, or rendered visuals

### Card expansion behavior
- Inline expansion: card grows in place, pushes cards below down
- Only one card expanded at a time — expanding a new card auto-collapses the previous one
- Expanded view shows: brief paragraph summary (objective, methods, results) + tech stack tags
- Subtle "collapse" button added to expanded card to close it
- "Read more" button in expanded view opens full project detail in Dialog (desktop) / Drawer (mobile)
- Smooth Motion layout animation for expand/collapse transitions

### Project detail Dialog/Drawer
- Desktop: Dialog overlay with dimmed backdrop
- Two-column layout inside Dialog: image gallery/carousel on left, full description + tech stack + external links on right
- Mobile: stacks to single column vertically
- For papers linked from a project, "Read more" opens the PDF viewer instead of a project Dialog
- Close button to dismiss

### Papers section
- Separate section from Projects (not mixed in bento grid), matches nav structure
- Clean row listing: each paper shows title (bold), brief descriptor (course/publication context), and "View" action
- Clicking "View" opens the PDF in the same viewer component used across the site
- Resume is NOT listed in Papers — accessed only via Contact section download button

### PDF viewer
- Desktop: near-full-screen Dialog (~90% viewport width and height) with dimmed backdrop
- Mobile: full-height Drawer (~95% screen), swipe down to dismiss
- Controls: page navigation (prev/next + page indicator), zoom in/out, download button, close button
- Uses react-pdf — must test production Vite build (known brittleness flag from STATE.md)
- Shadcn Dialog/Drawer components — verify v4 API at implementation time (known flag from STATE.md)

### Claude's Discretion
- Exact shadow values and hover animation timing
- Fixed aspect ratio value for thumbnails (16:9 vs 4:3)
- Gallery/carousel implementation in project detail Dialog
- PDF viewer toolbar design and control placement
- Domain tag pill styling (colors, border-radius)
- Stagger animation timing for bento grid entry
- Exact Dialog/Drawer sizing and padding
- How expanded card summary paragraph is structured

</decisions>

<specifics>
## Specific Ideas

- Bento grid with variable sizes creates visual hierarchy — the featured project is the hero of the section
- Box-shadow on cards is a deliberate departure from the 0.5px border system — cards should float and feel interactive, distinct from static content sections
- Inline expansion keeps the user in spatial context (key decision from PROJECT.md: "inline expansion over modal for detail view")
- "Read more" opening a Dialog/Drawer is a middle ground: still single-page architecture (no routing), but gives full project content the room it needs
- Papers as clean rows (not cards) deliberately contrasts with the visual bento grid — signals "documents to read" vs "projects to explore"
- PDF viewer should feel substantial — near-full-screen with real controls, not a tiny embedded viewer
- Domain tags help recruiters quickly pattern-match projects to their hiring needs (RF role? → spot the RF projects instantly)
- Stylized graphics for thumbnails means the portfolio has a cohesive visual language, not a random mix of lab photos

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/styles/motion.ts`: `sectionVariants` and `fadeUpVariant` with `hidden/visible` naming — use for Projects and Papers section entry animations
- `src/components/hero/HeroContent.tsx`: Stagger animation pattern for child elements — reuse for bento grid card entry
- `src/data/contact.ts`: `ContactData.resumePath` already stores the resume PDF path — reuse for PDF viewer
- `src/types/data.ts`: Typed interface pattern — add `Project`, `Paper` interfaces following the same conventions
- `MotionConfig reducedMotion="user"` already wrapping app — all new animations auto-respect prefers-reduced-motion

### Established Patterns
- Data-driven rendering: typed data files in `src/data/` with interfaces in `src/types/data.ts`
- Section component pattern: `<section id="...">` with `px-6 py-24` padding, `mx-auto max-w-5xl` container
- Tailwind v4 custom tokens: `text-ink`, `bg-cleanroom`, `bg-silicon-50`, accent color
- Weighted tween-only animations (no spring/bounce) — enforced by unit tests
- `hidden/visible` variant naming for Motion `initial`/`animate` props

### Integration Points
- `App.tsx` lines 23-33: Phase 3 placeholder sections (`#projects`, `#papers`) — replace with real components
- `src/data/navigation.ts`: Nav already has "Projects" and "Papers" links pointing to `#projects` and `#papers`
- `useActiveSection.ts`: Scroll-spy already configured to watch for these section IDs
- `src/data/contact.ts`: Resume path for PDF viewer integration

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-interactive-features*
*Context gathered: 2026-03-23*
