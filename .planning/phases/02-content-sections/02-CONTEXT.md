# Phase 2: Content Sections - Context

**Gathered:** 2026-03-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Build all data-driven informational sections: Skills, Lab/Tooling, Coursework, Timeline, and Contact. All content rendered from typed TypeScript data files with consistent animation and semantic HTML markup. Projects, papers, PDF viewer, and interactive bento grid are Phase 3. Responsive QA and deployment are Phase 4.

</domain>

<decisions>
## Implementation Decisions

### Skills presentation
- Column grid layout: 2x2 grid with each domain (Fabrication, RF, Analog, Digital) in its own column
- Name only per skill — no secondary info, proficiency indicators, or descriptors
- Domain headings in natural case bold (e.g. "Fabrication", not "FABRICATION") — consistent with section heading style from Phase 1
- Whitespace-only separation between columns — no 0.5px borders, no dividers
- Static text — no hover effects on individual skill items
- Section animates on entry (staggered fade-up) but items are static after

### Lab & Tooling presentation
- Same column grid pattern as Skills — categories (EDA Tools, Lab Equipment, Fab Processes) each get a column
- Same visual treatment: name only, natural case bold headings, whitespace separation, static text
- Consistent with Skills for cohesive "Background" sub-section feel

### Coursework presentation
- Simple vertical list — NOT the column grid pattern
- Each entry: course code + name (e.g. "EE 331 · Devices & Circuits I") with a one-line descriptor below
- Lighter weight descriptor text below the course name to signal domain relevance
- Data-driven from TypeScript data file

### Timeline visual style
- Left-aligned: vertical line on the left, milestones extend to the right
- Each milestone shows: date label, bold title, one-line description (three tiers)
- 2px line weight — thicker than 0.5px border system for visual presence
- Line is invisible until filled — no grey track visible from the start
- Accent-colored fill progresses as user scrolls down the page
- Node dots start hollow/grey, fill with accent color as the fill line reaches them
- Milestone content (title + description) animates in (fade-up) as the fill reaches each node — full reveal effect

### Contact section
- Prominent CTA section — dedicated section with centered layout, not a minimal footer
- Brief personal line above links (e.g. "Open to internship and research opportunities") — data-driven for easy updates
- Email displayed as a styled mailto link with accent color on hover
- "Download Resume" button: filled accent-colored button with white text — the only filled button on the entire page, clear primary CTA
- Social links (GitHub, LinkedIn) displayed below the resume button
- Semantic markup for scraper readability

### Section flow & spacing
- Page order (after Hero, before Projects/Papers): Skills → Lab/Tooling → Coursework → Timeline → Contact
- Generous whitespace only between sections (py-24 or more) — no borders, no alternating backgrounds, no dividers
- Consistent max-width container across all content sections (same container width for skills grid, coursework list, timeline, contact)
- All section headings and content fade-up on scroll into viewport — weighted tween consistent with Phase 1 animation language

### Claude's Discretion
- Exact max-width value for the content container
- Exact padding/gap values within the column grids
- Timeline node dot size and spacing between milestones
- Contact section vertical spacing and social link icon treatment
- Coursework list spacing between entries
- Stagger timing for fade-up animations within each section
- How the skills grid collapses on mobile (2x2 → 1 column)

</decisions>

<specifics>
## Specific Ideas

- Skills and Tooling should feel like a unified "Background" section family — same visual DNA, recruiters scan these together
- Coursework is deliberately different (vertical list vs grid) because it's a shorter, more editorial content type
- Timeline "reveal" effect: line invisible until filled, dots activate, content fades in — the journey unfolds as you scroll
- Resume download button being the ONLY filled button on the page makes it unmissable — this is the #1 recruiter action
- Brief personal line in Contact signals intent (internships, research) without being verbose
- Dieter Rams aesthetic: whitespace as the primary organizing principle, not borders or backgrounds

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `Hero.tsx` / `HeroContent.tsx`: Established section component pattern (section with id, px-6 padding, centered content)
- `SmoothScroll.tsx`: Lenis wrapper already active — new sections just need proper `id` attributes
- `Navigation.tsx` with `NavDropdown.tsx`: Already has nav items pointing to `#skills`, `#coursework`, `#tooling`, `#contact` — sections need matching IDs
- `useActiveSection.ts`: Intersection Observer scroll-spy already watches for section IDs
- `useScrollVisibility.ts`: Could inform timeline scroll-driven animation approach
- Motion variants pattern: `hidden/visible` naming convention for stagger animations (from `HeroContent.tsx`)
- Icon map pattern from hero social links — reusable for contact section social icons

### Established Patterns
- Data-driven rendering: `heroData` in `src/data/hero.ts` with typed interface in `src/types/data.ts` — same pattern for skills, tooling, coursework, timeline, contact data files
- `MotionConfig reducedMotion="user"` wrapping app — all new animations automatically respect prefers-reduced-motion
- Tailwind v4 with custom theme tokens: `text-ink`, `bg-cleanroom`, `bg-silicon-50` — use existing palette
- Placeholder sections already exist in `App.tsx` with correct IDs — replace these with real components

### Integration Points
- `App.tsx` placeholder sections (lines 15-35): Replace with actual section components
- `src/types/data.ts`: Add interfaces for SkillGroup, ToolingGroup, Course, TimelineMilestone, ContactData
- `src/data/`: Add new data files (skills.ts, tooling.ts, coursework.ts, timeline.ts, contact.ts)
- Nav `#background` section ID needs to map to the first content section (Skills)

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-content-sections*
*Context gathered: 2026-03-22*
