# Phase 14: Component Rebuilds - Context

**Gathered:** 2026-03-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Rebuild the three highest-impact interactive sections with modern animated patterns: animated glassmorphic tabs merging Skills & Tooling into a single "Expertise" section, horizontal project carousel with Embla, and scroll-triggered SVG timeline with glowing nodes. The existing ProjectDetail Dialog/Drawer and PDF viewer are reused — not rebuilt.

</domain>

<decisions>
## Implementation Decisions

### Tab grouping strategy
- 4 merged domain tabs: Fabrication, RF & Test, Analog, Digital
- Merge mapping: Fabrication = Skills(Fab) + Tools(Fab Processes); RF & Test = Skills(RF) + Tools(Lab Equipment); Analog = Skills(Analog) + Tools(EDA Tools); Digital = Skills(Digital) + Tools(Xilinx Vivado)
- Two-column layout inside each glassmorphic panel: "Skills" column left, "Tools & Equipment" column right
- Small bold sub-headings above each column for clarity
- Consistent two-column layout even for Digital (which has only 1 tool) — asymmetry is fine
- Default tab is data-driven: first domain in admin content order = first tab selected
- Full-width tab row on mobile (4 short labels fit), content columns stack to single column
- Tab content animates in with blur/scale/opacity transition (SKTL-04)
- Sliding tab indicator using Motion layoutId (SKTL-02)
- Glassmorphic panels: backdrop-blur, semi-transparent background, subtle border (SKTL-03)

### Carousel card design
- Card content: project thumbnail image, title, one-line brief, domain tag
- No expand/collapse behavior — click goes directly to existing Dialog/Drawer detail view
- Featured project card is ~1.5x wider than standard cards, in first position
- Simple scale+shadow hover effect: scale 1.02x + elevated shadow on hover (no CardSpotlight)
- Solid bg-card background with shadow-md and rounded-xl (not glassmorphic — distinct from tab panels)
- Arrow buttons flanking the carousel (left/right outside card area), hidden at start/end of scroll
- Horizontal swipe navigation on mobile, full-width single cards
- Dot indicators below carousel on mobile only (hidden on desktop)
- Arrow buttons hidden on touch devices (swipe is the gesture)
- embla-carousel-react for carousel (locked from v1.2 research)
- data-lenis-prevent on Embla viewport (locked from v1.2 research)

### Timeline glow & SVG treatment
- Subtle ambient glow around active nodes: box-shadow ~12-16px, accent color at 40% opacity
- One-shot pulse ring on activation: ring expands (0 to ~20px) and fades (accent/30 to transparent), then settles to steady glow — no continuous pulse
- Pulse duration ~1.5s, ease-out
- Accent blue color for all glow effects (CSS variable-driven, works in both modes)
- SVG path replaces current div line: gradient fill on drawn portion (accent-600 at top to accent-400 at bottom, ~2px width)
- Undrawn portion: faint solid or dashed line (silicon-200, ~1px)
- Inactive nodes: hollow circle with silicon-200 border, bg-cleanroom fill
- Active nodes: filled accent color with soft glow halo
- Content fades in as corresponding node activates (TIME-04)

### Section naming & navigation
- Merged section named "Expertise" (replaces separate "Skills" and "Tooling" sections)
- Section id="expertise" (replaces #skills and #tooling hash links)
- Single "Expertise" nav link replaces both "Skills" and "Tooling" in the nav bar
- Old Skills.tsx and Tooling.tsx components replaced by new Expertise.tsx (or similar)

### Claude's Discretion
- Exact glassmorphic blur intensity and transparency values for tab panels
- Embla carousel configuration details (slide spacing, align, containScroll)
- SVG path drawing technique (clip-path vs stroke-dasharray vs mask)
- Exact Motion animation timing for tab content transitions
- Mobile breakpoint for carousel dot indicators vs arrow buttons
- Whether to use SVG filter for glow or CSS box-shadow

</decisions>

<specifics>
## Specific Ideas

- Two distinct visual languages: glassmorphic tab panels (transparent/blurred) vs solid carousel cards (opaque with shadow) — intentional contrast
- Timeline gradient path should feel like "energy flowing down" — accent-600 at top fading to accent-400 at bottom
- The one-shot pulse on timeline nodes = moment of discovery, not a persistent distraction
- Featured project wider card gives it natural emphasis without badges or borders
- Default tab driven by admin panel ordering so Jack can control first impression without code changes

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `ProjectDetail.tsx` + `ProjectCard.tsx`: Detail Dialog/Drawer is reused as-is; ProjectCard patterns inform carousel card structure
- `CardSpotlight.tsx`: NOT used in carousel (decision: simple scale+shadow), but kept for other uses
- Motion library (`motion/react`): Already imported in all section components — layoutId, whileInView, useScroll all available
- `sectionVariants` + `fadeUpVariant` from `styles/motion.ts`: Reuse for section entry animations
- `useScroll` + `useMotionValueEvent`: Already powering timeline scroll tracking — SVG upgrade builds on this

### Established Patterns
- oklch color system with hue 250, CSS custom properties in :root and .dark blocks
- `MotionConfig reducedMotion="user"` in App.tsx for Motion animations
- Semantic color tokens (bg-card, text-ink, text-silicon-600, border-accent)
- Section layout: `section > div.mx-auto.max-w-5xl` with `px-6 py-24` padding

### Integration Points
- `Skills.tsx` (4 domains) + `Tooling.tsx` (3 categories) → replaced by new merged Expertise component
- `ProjectsSection.tsx` bento grid → replaced by Embla carousel component
- `Timeline.tsx` div-based line → replaced by SVG path with gradient
- Nav bar links: "Skills" + "Tooling" → single "Expertise" link
- `src/data/skills.ts` + `src/data/tooling.ts` → data stays, import into merged component with domain mapping
- Admin panel editors for skills and tooling content remain functional (data files unchanged)

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 14-component-rebuilds*
*Context gathered: 2026-03-27*
