# Phase 14: Component Rebuilds - Research

**Researched:** 2026-03-27
**Domain:** Animated React component rebuilds -- tabbed expertise section, Embla carousel, SVG scroll-drawn timeline
**Confidence:** HIGH

## Summary

Phase 14 rebuilds the three highest-impact interactive sections of the portfolio: (1) merging Skills + Tooling into a single "Expertise" tabbed section with glassmorphic panels and a Motion layoutId sliding indicator, (2) replacing the bento grid Projects section with an Embla Carousel featuring drag/swipe navigation and a featured-first card, and (3) upgrading the Timeline from a div-based progress bar to a scroll-drawn SVG path with glowing pulse-activated nodes. All three rebuilds use the existing Motion 12 animation library and Tailwind v4 styling. The only new npm dependency is `embla-carousel-react@^8.6.0`.

The existing codebase already has the correct foundation: oklch color system with dark mode variables, `useScroll`/`useMotionValueEvent` patterns in Timeline.tsx, `MotionConfig reducedMotion="user"` in App.tsx, and Lenis smooth scroll with `data-lenis-prevent` support. The v1.2 milestone research (`.planning/research/`) has already validated stack choices, architecture patterns, and pitfalls. This phase-specific research builds on that foundation with implementation-level detail.

**Primary recommendation:** Build the three components in order -- Expertise tabs first (self-contained, least risky), then Project carousel (new dependency, Lenis integration), then Timeline SVG (most complex animation work). Each is independently testable.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- 4 merged domain tabs: Fabrication, RF & Test, Analog, Digital
- Merge mapping: Fabrication = Skills(Fab) + Tools(Fab Processes); RF & Test = Skills(RF) + Tools(Lab Equipment); Analog = Skills(Analog) + Tools(EDA Tools); Digital = Skills(Digital) + Tools(Xilinx Vivado)
- Two-column layout inside each glassmorphic panel: "Skills" column left, "Tools & Equipment" column right
- Small bold sub-headings above each column for clarity
- Consistent two-column layout even for Digital (which has only 1 tool)
- Default tab is data-driven: first domain in admin content order = first tab selected
- Full-width tab row on mobile (4 short labels fit), content columns stack to single column
- Tab content animates in with blur/scale/opacity transition (SKTL-04)
- Sliding tab indicator using Motion layoutId (SKTL-02)
- Glassmorphic panels: backdrop-blur, semi-transparent background, subtle border (SKTL-03)
- Card content: project thumbnail image, title, one-line brief, domain tag
- No expand/collapse behavior -- click goes directly to existing Dialog/Drawer detail view
- Featured project card is ~1.5x wider than standard cards, in first position
- Simple scale+shadow hover effect: scale 1.02x + elevated shadow on hover (no CardSpotlight)
- Solid bg-card background with shadow-md and rounded-xl (not glassmorphic)
- Arrow buttons flanking the carousel (left/right outside card area), hidden at start/end of scroll
- Horizontal swipe navigation on mobile, full-width single cards
- Dot indicators below carousel on mobile only (hidden on desktop)
- Arrow buttons hidden on touch devices (swipe is the gesture)
- embla-carousel-react for carousel (locked from v1.2 research)
- data-lenis-prevent on Embla viewport (locked from v1.2 research)
- Subtle ambient glow around active nodes: box-shadow ~12-16px, accent color at 40% opacity
- One-shot pulse ring on activation: ring expands (0 to ~20px) and fades (accent/30 to transparent), then settles to steady glow
- Pulse duration ~1.5s, ease-out
- Accent blue color for all glow effects (CSS variable-driven)
- SVG path replaces current div line: gradient fill on drawn portion (accent-600 at top to accent-400 at bottom, ~2px width)
- Undrawn portion: faint solid or dashed line (silicon-200, ~1px)
- Inactive nodes: hollow circle with silicon-200 border, bg-cleanroom fill
- Active nodes: filled accent color with soft glow halo
- Content fades in as corresponding node activates (TIME-04)
- Merged section named "Expertise" with id="expertise"
- Single "Expertise" nav link replaces both "Skills" and "Tooling" in the nav bar
- Old Skills.tsx and Tooling.tsx replaced by new Expertise.tsx

### Claude's Discretion
- Exact glassmorphic blur intensity and transparency values for tab panels
- Embla carousel configuration details (slide spacing, align, containScroll)
- SVG path drawing technique (clip-path vs stroke-dasharray vs mask)
- Exact Motion animation timing for tab content transitions
- Mobile breakpoint for carousel dot indicators vs arrow buttons
- Whether to use SVG filter for glow or CSS box-shadow

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| SKTL-01 | Skills and Tooling sections merged into a single tabbed section with one tab per domain | Domain merge mapping defined in CONTEXT.md; data files (`skills.ts`, `tooling.ts`) provide source data; 4 tabs derived from skill domain names |
| SKTL-02 | Animated sliding tab indicator using Motion layoutId | BuildUI pattern verified; `motion.div` with `layoutId="active-tab"` + spring transition; already proven in Motion 12 |
| SKTL-03 | Tab content panels use glassmorphic styling | Tailwind `backdrop-blur-md` + `bg-white/10 dark:bg-white/5` + `border border-white/20 dark:border-white/10` + `rounded-xl` |
| SKTL-04 | Tab content animates in with blur/scale/opacity transition on tab switch | AnimatePresence with `key={activeTab}` + `filter: blur()` + `scale` + `opacity` transitions |
| PROJ-01 | Projects displayed in horizontal carousel with drag/swipe and arrow navigation | Embla Carousel v8.6.0 with `useEmblaCarousel` hook; prev/next via `canGoToPrev()`/`canGoToNext()` API |
| PROJ-02 | Featured project appears in first carousel position with visual emphasis | Sort projects array `featured` first; featured slide uses `flex: 0 0 60%` vs standard `flex: 0 0 40%` on desktop |
| PROJ-03 | Carousel cards show project image, title, and summary with hover scale effect | New simplified CarouselCard component; `whileHover={{ scale: 1.02 }}` + elevated shadow |
| PROJ-04 | Clicking a carousel card opens existing project detail Dialog/Drawer | Reuse `ProjectDetail` component as-is; carousel manages `detailProject` state |
| PROJ-05 | Carousel coexists with Lenis smooth scroll | `data-lenis-prevent` on Embla viewport div; `touch-action: pan-y pinch-zoom` on container |
| TIME-01 | Vertical SVG path that draws progressively as user scrolls | `motion.path` with `pathLength` bound to `useScroll`'s `scrollYProgress` via `useTransform` |
| TIME-02 | Glowing circular node markers that activate on scroll | `motion.circle` SVG elements with CSS `box-shadow` for glow; activation threshold derived from node index |
| TIME-03 | Active nodes display pulsing ring animation | One-shot CSS `@keyframes` for expanding ring; triggered by adding class on activation; `animation-iteration-count: 1` |
| TIME-04 | Timeline entry content fades in as node activates | Derive opacity from scroll progress via `useTransform`; avoid `setState` per scroll frame |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| motion | ^12.38.0 | All animations: layoutId tabs, AnimatePresence content transitions, useScroll/useTransform for timeline, whileHover on cards | Already installed. Provides layoutId, pathLength, scroll-linked animation natively. |
| embla-carousel-react | ^8.6.0 | Horizontal project carousel with snap-point navigation | Locked from v1.2 research. 3.4KB gzipped, hook-based, React 19 compatible, zero CSS opinions. |
| tailwindcss | ^4.2.2 | All styling: glassmorphic blur, responsive layout, dark mode variants | Already installed. backdrop-blur-md, bg-white/10, dark: variants all native. |
| lenis | ^1.3.19 | Page-level smooth scroll (existing, carousel must coexist) | Already installed. data-lenis-prevent attribute for carousel isolation. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| lucide-react | ^0.577.0 | Arrow icons for carousel navigation buttons | Already installed. ChevronLeft/ChevronRight icons. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| embla-carousel-react | Swiper.js | 42KB vs 3.4KB. Overkill for 4 project cards. Has its own CSS framework. |
| CSS box-shadow glow | SVG feGaussianBlur filter | SVG filter gives more realistic glow but costs more repaints. For ~8 nodes, box-shadow is sufficient and compositor-friendly. |
| Manual role="tablist" | @radix-ui/react-tabs | Would add a dependency. Project uses Base UI via shadcn; simple manual ARIA is 20 lines. |
| AnimatePresence for tab content | CSS transition only | AnimatePresence gives enter+exit animations; CSS transitions only handle enter. |

**Installation:**
```bash
npm install embla-carousel-react@^8.6.0
```

That is the only new dependency. Everything else uses existing installed packages.

## Architecture Patterns

### Recommended Project Structure
```
src/
  components/
    sections/
      Expertise.tsx          # New: merged Skills+Tooling tabbed section (replaces Skills.tsx + Tooling.tsx)
      Timeline.tsx           # Modified: SVG path + glow nodes (replaces div-based timeline)
    projects/
      ProjectCarousel.tsx    # New: Embla carousel wrapper
      CarouselCard.tsx       # New: simplified card for carousel slides (no expand/collapse)
      ProjectDetail.tsx      # Unchanged: reused Dialog/Drawer
    ui/
      AnimatedTabs.tsx       # New: reusable tab bar with layoutId indicator
  data/
    skills.ts               # Unchanged: source data
    tooling.ts              # Unchanged: source data
    projects.ts             # Unchanged: source data
    timeline.ts             # Unchanged: source data
    navigation.ts           # Modified: "Skills" + "Lab & Tooling" -> "Expertise"
  hooks/
    useActiveSection.ts     # Modified: section IDs updated
```

### Pattern 1: Motion layoutId Tab Indicator
**What:** A sliding pill/underline that animates between tab buttons when the active tab changes. The active tab renders a `motion.div` with a shared `layoutId`; Motion automatically interpolates position and size.

**When to use:** Expertise section tab bar (SKTL-02).

**Example:**
```tsx
// Source: buildui.com/recipes/animated-tabs + Motion docs
function AnimatedTabs({ tabs, activeTab, onChange }: AnimatedTabsProps) {
  return (
    <div role="tablist" className="relative flex gap-1 rounded-xl bg-silicon-50/50 dark:bg-silicon-200/10 p-1 backdrop-blur-sm">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`panel-${tab.id}`}
          onClick={() => onChange(tab.id)}
          className={`relative z-10 flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === tab.id ? 'text-ink' : 'text-silicon-600 hover:text-ink'
          }`}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="active-tab-indicator"
              className="absolute inset-0 rounded-lg bg-white/80 dark:bg-white/10 shadow-sm"
              style={{ zIndex: -1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
```

### Pattern 2: AnimatePresence Tab Content with Blur/Scale/Opacity
**What:** When the active tab changes, outgoing content exits with blur + scale down + fade out, incoming content enters with the reverse. Uses `AnimatePresence` with a `key` tied to the active tab.

**When to use:** Expertise section tab content panels (SKTL-04).

**Example:**
```tsx
// Source: Motion AnimatePresence docs
const tabContentVariants = {
  initial: { opacity: 0, scale: 0.96, filter: 'blur(8px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, scale: 0.96, filter: 'blur(8px)' },
};

<AnimatePresence mode="wait">
  <motion.div
    key={activeTab}
    role="tabpanel"
    id={`panel-${activeTab}`}
    variants={tabContentVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.25, ease: easing.out }}
    className="mt-6 rounded-xl backdrop-blur-md bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 p-6"
  >
    {/* Two-column content */}
  </motion.div>
</AnimatePresence>
```

### Pattern 3: Embla Carousel with Lenis Coexistence
**What:** Embla manages horizontal scroll; Lenis manages vertical page scroll. `data-lenis-prevent` on the Embla viewport tells Lenis to skip scroll processing inside the carousel. `touch-action: pan-y pinch-zoom` on the container delegates vertical gestures to the browser/Lenis and horizontal gestures to Embla.

**When to use:** Project carousel (PROJ-01, PROJ-05).

**Example:**
```tsx
// Source: Embla Carousel React docs + Lenis GitHub
const [emblaRef, emblaApi] = useEmblaCarousel({
  align: 'start',
  containScroll: 'trimSnaps',
  dragFree: false,
  loop: false,
  slidesToScroll: 1,
  duration: prefersReducedMotion ? 0 : 25,
});

<div className="relative">
  {/* Viewport with Lenis prevention */}
  <div
    ref={emblaRef}
    className="overflow-hidden"
    data-lenis-prevent
  >
    <div className="flex touch-action-pan-y gap-4">
      {sortedProjects.map((project) => (
        <div
          key={project.id}
          className={project.featured
            ? 'flex-[0_0_85%] md:flex-[0_0_60%]'
            : 'flex-[0_0_85%] md:flex-[0_0_40%]'
          }
        >
          <CarouselCard project={project} onClick={() => setDetailProject(project)} />
        </div>
      ))}
    </div>
  </div>
  {/* Arrow buttons outside viewport */}
</div>
```

### Pattern 4: Scroll-Linked SVG pathLength Drawing
**What:** An SVG `<path>` whose visible length is bound to `scrollYProgress` via Motion's `useTransform`. As the user scrolls through the timeline section, the path progressively "draws" from top to bottom. Motion internally manages `stroke-dasharray` and `stroke-dashoffset` via its `pathLength` abstraction.

**When to use:** Timeline vertical progress line (TIME-01).

**Example:**
```tsx
// Source: Motion SVG animation docs + dev.to/heres scroll-svg-path
const containerRef = useRef<HTMLDivElement>(null);
const { scrollYProgress } = useScroll({
  target: containerRef,
  offset: ['start 0.8', 'end 0.6'],
});

<svg className="absolute left-0 top-0 h-full w-6" viewBox="0 0 24 100" preserveAspectRatio="none">
  {/* Undrawn track */}
  <path
    d="M 12 0 V 100"
    stroke="var(--color-silicon-200)"
    strokeWidth={1}
    fill="none"
    strokeDasharray="4 4"
  />
  {/* Drawn progress path with gradient */}
  <defs>
    <linearGradient id="timeline-gradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="1" />
      <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.6" />
    </linearGradient>
  </defs>
  <motion.path
    d="M 12 0 V 100"
    stroke="url(#timeline-gradient)"
    strokeWidth={2}
    fill="none"
    style={{ pathLength: scrollYProgress }}
  />
</svg>
```

### Pattern 5: Threshold-Based Node Activation Without Per-Frame setState
**What:** Instead of `useMotionValueEvent` -> `setState` (which causes a React re-render per scroll frame per node), use `useTransform` to derive a MotionValue for each node's opacity/glow state. Only use `useState` for the discrete active/inactive transition (which happens once per node, not per frame).

**When to use:** Timeline node activation (TIME-02, TIME-04).

**Example:**
```tsx
// Derive opacity from scroll progress without React re-renders
const nodeProgress = useTransform(
  scrollYProgress,
  [threshold - 0.05, threshold],
  [0, 1]
);

// Only trigger state change once at threshold crossing for CSS class
const [hasActivated, setHasActivated] = useState(false);
useMotionValueEvent(scrollYProgress, 'change', (latest) => {
  if (!hasActivated && latest >= threshold) {
    setHasActivated(true); // One-shot, never resets
  }
});
```

### Anti-Patterns to Avoid
- **LayoutGroup on Embla container:** Motion's layout system conflicts with Embla's transform-based positioning. Use plain `<div>` elements for Embla structure. Motion whileHover INSIDE cards is fine.
- **Continuous glow animation on scroll:** Do not animate box-shadow on every scroll frame. Make it a discrete state change (inactive -> active) triggered once.
- **Using useState per scroll frame:** The current Timeline.tsx calls `setIsActive(latest >= threshold)` on every scroll event. With 8 nodes, that is 8 re-renders per frame. Use `useTransform` for continuous values, `useState` only for one-shot threshold crossings.
- **Embla wheel-gestures plugin with Lenis:** The plugin intercepts wheel events, conflicting with Lenis. Let mouse wheel scroll the page vertically; carousel is navigated by drag/arrows.
- **Hardcoded tab domain names:** Derive tabs from the `skillGroups` data. The domain merge mapping can be a static config object, but domain names should come from data.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Horizontal carousel scroll mechanics | Custom transform-based carousel with snap | embla-carousel-react hook | Touch handling, momentum, snap points, accessibility, edge behavior are deceptively complex. Embla handles trackpad, mouse, touch, keyboard navigation. |
| Tab indicator animation | Manual position calculation with refs + getBoundingClientRect | Motion layoutId | Layout animations handle different-width tabs, dynamic text, responsive resizing automatically. Manual calc breaks on resize. |
| SVG path length measurement | pathLength calculation with getTotalLength() | Motion pathLength style prop | Motion abstracts stroke-dasharray/dashoffset management. Setting `style={{ pathLength }}` "just works" with MotionValues. |
| Scroll progress tracking | IntersectionObserver + manual progress calc | Motion useScroll + useTransform | useScroll handles target/offset configuration and returns MotionValues that compose with useTransform for derived values. |
| Touch-action gesture disambiguation | Custom touch event handlers for horizontal vs vertical | CSS `touch-action: pan-y pinch-zoom` | Browser-native gesture disambiguation is more reliable than JS touch handling. One CSS property replaces hundreds of lines of gesture code. |

**Key insight:** The three hardest problems in this phase (carousel scroll mechanics, layout animation, and scroll-linked SVG drawing) are all solved by libraries already in the project. The implementation work is wiring existing APIs together, not building animation primitives.

## Common Pitfalls

### Pitfall 1: Lenis Hijacks Embla Horizontal Scroll
**What goes wrong:** Trackpad horizontal swipe on the carousel is intercepted by Lenis, making the carousel feel stuck.
**Why it happens:** Lenis processes all wheel events globally. Trackpad swipes have a vertical component that Lenis captures.
**How to avoid:** Add `data-lenis-prevent` attribute to the Embla viewport element. Add `overscroll-behavior: contain` CSS. Test with a trackpad, not just a mouse.
**Warning signs:** Carousel works with click buttons but not with trackpad swipe.

### Pitfall 2: Motion LayoutGroup Conflicts with Embla
**What goes wrong:** Carousel slides "jump" or "teleport" during navigation because Motion tries to animate layout changes that Embla is managing.
**Why it happens:** Both Motion's layout system and Embla apply transforms to the same elements.
**How to avoid:** Remove `<LayoutGroup>` from the carousel. Use plain `<div>` for Embla structure. Only use Motion for per-card effects (whileHover).
**Warning signs:** Slides appear at wrong offsets after navigation; console warnings about layout animations.

### Pitfall 3: SVG Timeline Causes Jank from Per-Frame Re-renders
**What goes wrong:** Scrolling through the timeline drops below 60fps because each of 8 nodes triggers a `setState` call on every scroll frame.
**Why it happens:** Current pattern: `useMotionValueEvent(scrollProgress, 'change', (latest) => setIsActive(latest >= threshold))` fires on every scroll frame, triggering 8 React re-renders per frame.
**How to avoid:** Use `useTransform` for continuous values (opacity, position). Use `useState` only for one-shot threshold crossings (active/inactive). The `hasActivated` pattern above ensures state only changes once per node.
**Warning signs:** React Profiler shows hundreds of TimelineNode re-renders during a single scroll gesture.

### Pitfall 4: Tab Content Height Shift Causes Layout Jump
**What goes wrong:** Switching between tabs with different content heights causes the page below the tabs to jump, disrupting scroll position.
**Why it happens:** Different domains have different numbers of skills/tools, creating different panel heights.
**How to avoid:** Use a fixed `min-height` on the tab content container based on the tallest panel. Since all 4 domains have similar skill counts (4-5 items each), the height difference is small, but a min-height prevents any jump.
**Warning signs:** Page scroll position shifts when clicking a different tab.

### Pitfall 5: Embla Ignores prefers-reduced-motion
**What goes wrong:** Carousel still animates slide transitions even when user has reduced motion enabled.
**Why it happens:** Embla is not a Motion component and ignores `MotionConfig reducedMotion="user"`. Embla has its own `duration` option.
**How to avoid:** Check `useReducedMotion()` from Motion and pass `duration: 0` to Embla options when reduced motion is active.
**Warning signs:** Enable "Reduce motion" in OS settings; carousel still animates.

### Pitfall 6: Navigation and Scroll-Spy Break After Section ID Changes
**What goes wrong:** After renaming sections (skills+tooling -> expertise), the nav bar links and scroll-spy stop working.
**Why it happens:** `navigation.ts` still references `#skills` and `#tooling`; `Navigation.tsx` still has `['skills', 'tooling']` in the sectionIds array; `useActiveSection` no longer finds those elements.
**How to avoid:** Update all three files simultaneously: `navigation.ts` (nav links), `Navigation.tsx` (sectionIds array), and `useActiveSection` call site. Test that clicking "Expertise" scrolls to the new section and that the nav highlights correctly.
**Warning signs:** Nav link for "Expertise" does nothing; scroll-spy never highlights the expertise section.

## Code Examples

### Domain Merge Mapping (Expertise Section Data)
```typescript
// Static mapping of domains to their skill + tooling sources
// Derives from CONTEXT.md locked decisions
interface ExpertiseDomain {
  id: string;
  label: string;
  skills: string[];
  tools: string[];
}

function buildExpertiseDomains(): ExpertiseDomain[] {
  // Map skill domains to tooling categories
  const domainMap: Record<string, { skillDomain: string; toolCategory: string }> = {
    fabrication: { skillDomain: 'Fabrication', toolCategory: 'Fabrication Processes' },
    'rf-test': { skillDomain: 'RF', toolCategory: 'Lab Equipment' },
    analog: { skillDomain: 'Analog', toolCategory: 'EDA Tools' },
    digital: { skillDomain: 'Digital', toolCategory: '' }, // Vivado extracted from EDA Tools
  };
  // ... derive from skillGroups and toolingGroups imports
}
```

### Carousel Card (Simplified from ProjectCard)
```tsx
// No expand/collapse, no CardSpotlight, no LayoutGroup
interface CarouselCardProps {
  project: Project;
  onClick: () => void;
}

function CarouselCard({ project, onClick }: CarouselCardProps) {
  return (
    <motion.div
      className="cursor-pointer rounded-xl bg-card shadow-md overflow-hidden h-full"
      whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
      transition={{ duration: 0.3, ease: easing.out }}
      onClick={onClick}
    >
      <img
        src={project.thumbnail}
        alt={project.title}
        className="w-full aspect-video object-cover"
        loading="lazy"
        decoding="async"
      />
      <div className="p-5">
        <h3 className="font-bold text-ink">{project.title}</h3>
        <p className="text-silicon-600 mt-1 line-clamp-2">{project.brief}</p>
        <span className="inline-block rounded-full bg-silicon-50 px-3 py-1 text-xs font-medium text-silicon-600 mt-3">
          {project.domain}
        </span>
      </div>
    </motion.div>
  );
}
```

### Timeline Node with One-Shot Pulse
```tsx
// CSS for the one-shot pulse ring
// @keyframes pulse-ring {
//   0% { transform: scale(1); opacity: 0.3; }
//   100% { transform: scale(2.5); opacity: 0; }
// }
// .pulse-ring { animation: pulse-ring 1.5s ease-out forwards; }

function TimelineNode({ milestone, threshold, scrollYProgress }: TimelineNodeProps) {
  const [hasActivated, setHasActivated] = useState(false);

  // One-shot activation -- only fires once
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (!hasActivated && latest >= threshold) {
      setHasActivated(true);
    }
  });

  // Continuous opacity driven by scroll (no setState)
  const contentOpacity = useTransform(
    scrollYProgress,
    [threshold - 0.05, threshold + 0.02],
    [0, 1]
  );
  const contentY = useTransform(
    scrollYProgress,
    [threshold - 0.05, threshold + 0.02],
    [8, 0]
  );

  return (
    <div className="relative pb-12 last:pb-0">
      {/* Node circle */}
      <div className={`absolute -left-[21px] top-1 h-3 w-3 rounded-full border-2 transition-all duration-300 ${
        hasActivated
          ? 'border-accent bg-accent shadow-[0_0_12px_var(--color-accent)/40]'
          : 'border-silicon-200 bg-cleanroom'
      }`}>
        {/* One-shot pulse ring */}
        {hasActivated && (
          <span className="absolute inset-0 rounded-full border-2 border-accent/30 pulse-ring" />
        )}
      </div>

      {/* Content driven by MotionValues (no React re-renders) */}
      <motion.div style={{ opacity: contentOpacity, y: contentY }}>
        <span className="text-sm text-silicon-400">{milestone.date}</span>
        <h3 className="mt-1 text-lg font-semibold text-ink">{milestone.title}</h3>
        <p className="mt-1 text-silicon-600">{milestone.description}</p>
      </motion.div>
    </div>
  );
}
```

### Navigation Update
```typescript
// src/data/navigation.ts -- updated
export const navItems: NavItem[] = [
  {
    label: 'Background',
    href: '#about',
    children: [
      { label: 'Expertise', href: '#expertise' },  // Was: Skills + Lab & Tooling (2 items)
      { label: 'Timeline', href: '#timeline' },
    ],
  },
  { label: 'Projects', href: '#projects' },
  { label: 'Papers', href: '#papers' },
  { label: 'Contact', href: '#contact' },
];
```

### App.tsx Section Replacement
```tsx
// Before:
<Skills />
<Tooling />

// After:
<Expertise />
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| framer-motion package | motion/react import path | Motion v11+ (2024) | Import from 'motion/react' not 'framer-motion'. Project already uses correct path. |
| embla-carousel v7 scrollPrev/scrollNext | embla-carousel v8 scrollPrev/scrollNext (same) | v8 Jan 2024 | API is stable. v9 RC renames to goToPrev/goToNext but v8 is the stable target. |
| Manual stroke-dasharray math | Motion pathLength style prop | Motion v5+ | Motion abstracts dasharray/dashoffset. Just set `style={{ pathLength }}` with a MotionValue. |
| LayoutGroup for card expand | Embla for horizontal carousel | This phase | Removes LayoutGroup dependency from projects section entirely. |

**Deprecated/outdated:**
- embla-carousel v9 RC (v9.0.0-rc01): Available but NOT stable. v9 renames methods (scrollNext -> goToNext). Stick with v8.6.0 for production.
- `framer-motion` package name: Superseded by `motion` package. This project already uses `motion/react`.

## Implementation-Specific Recommendations (Claude's Discretion)

### Glassmorphic Panel Values
- **Blur intensity:** `backdrop-blur-md` (12px) -- matches the existing nav bar blur
- **Background:** `bg-white/10 dark:bg-white/5` -- subtle transparency without muddiness
- **Border:** `border border-white/20 dark:border-white/10` -- visible edge without harshness
- **Rounded corners:** `rounded-xl` -- consistent with card styling elsewhere
- **Rationale:** The nav bar already uses `backdrop-blur-[12px]` successfully. Matching this keeps visual consistency. The `/10` opacity is low enough to see the unified background gradient through the panels.

### Embla Configuration
```typescript
{
  align: 'start',           // Cards align to left edge, not centered
  containScroll: 'trimSnaps', // Remove awkward snap at edges
  dragFree: false,           // Snap to slides, not free-scroll
  loop: false,               // Only 4 projects; loop causes immediate repetition
  slidesToScroll: 1,         // One card at a time
  duration: 25,              // Default speed (overridden to 0 for reduced motion)
}
```
- **Slide gap:** `gap-4` (16px) on the flex container
- **Slide widths:** Desktop: featured `flex-[0_0_60%]`, standard `flex-[0_0_40%]`. Mobile: all `flex-[0_0_85%]` for peek effect.

### SVG Path Drawing Technique
- **Recommendation:** Use Motion's `pathLength` style prop (which internally manages stroke-dasharray/dashoffset)
- **Why not clip-path:** Clip-path approach requires calculating clip regions from scroll position. Motion's pathLength abstraction is simpler and more performant.
- **Why not mask:** Similar complexity to clip-path. pathLength is the standard pattern for SVG line drawing.
- **Gradient on drawn path:** Use SVG `<linearGradient>` as the stroke color. Motion's pathLength works with gradient strokes.

### Tab Content Transition Timing
- **Duration:** 250ms (quick enough to feel responsive, slow enough to see the blur effect)
- **Easing:** `easing.out` from the existing `styles/motion.ts` (ease-out quart)
- **Mode:** `AnimatePresence mode="wait"` -- old content exits fully before new enters

### Mobile Breakpoint for Carousel Controls
- **Recommendation:** Use the existing `md` breakpoint (768px) to match Tailwind conventions already in use
- **Desktop (>=768px):** Arrow buttons visible, dot indicators hidden
- **Mobile (<768px):** Arrow buttons hidden, dot indicators visible, full-width swipe
- **Detection method:** CSS `hidden md:flex` / `flex md:hidden` (no JS needed for visibility)

### Glow Effect: CSS box-shadow vs SVG filter
- **Recommendation:** CSS box-shadow for the node glow
- **Why:** box-shadow with `transition-property: box-shadow` is compositor-friendly for the discrete active/inactive state change. SVG feGaussianBlur filter would require a repaint and is overkill for a subtle ambient glow. The one-shot pulse ring uses CSS `@keyframes` on a pseudo-element border, which is also compositor-friendly.
- **Values:** `box-shadow: 0 0 12px oklch(0.55 0.15 250 / 0.4)` (accent color at 40% opacity)

## Open Questions

1. **Digital tab tool mapping edge case**
   - What we know: The Digital domain maps to Skills(Digital) + Tools(Xilinx Vivado). But "Xilinx Vivado" is one item inside the "EDA Tools" category, which also contains Cadence Virtuoso, Keysight ADS, KiCad, and LTspice.
   - What's unclear: Should Vivado be extracted from EDA Tools and shown as the sole Digital tool? Or should Digital show no tools column?
   - Recommendation: The CONTEXT.md explicitly states "Digital = Skills(Digital) + Tools(Xilinx Vivado)" and "Consistent two-column layout even for Digital (which has only 1 tool)". Extract Vivado from the EDA Tools list. Show it as the single tool in Digital's right column.

2. **Embla viewport focus management**
   - What we know: Embla's `focus: true` option auto-watches slides for focus events.
   - What's unclear: Whether focus events interact with Lenis scroll-to behavior when using keyboard navigation inside the carousel.
   - Recommendation: Test keyboard Tab navigation through carousel slides with Lenis active. If Lenis interferes, add `data-lenis-prevent` to a wider container.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1 + jsdom |
| Config file | `vitest.config.ts` |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SKTL-01 | Skills+Tooling merged into tabbed section | unit | `npx vitest run src/components/sections/__tests__/expertise.test.ts -t "renders all domain tabs"` | Wave 0 |
| SKTL-02 | Sliding tab indicator with layoutId | manual-only | Visual verification -- layoutId animation cannot be asserted in jsdom | N/A |
| SKTL-03 | Glassmorphic panel styling | unit | `npx vitest run src/components/sections/__tests__/expertise.test.ts -t "glassmorphic"` | Wave 0 |
| SKTL-04 | Blur/scale/opacity tab content transition | manual-only | AnimatePresence animation cannot be meaningfully tested in jsdom | N/A |
| PROJ-01 | Carousel with drag/swipe and arrow navigation | unit | `npx vitest run src/components/projects/__tests__/carousel.test.ts -t "renders all project slides"` | Wave 0 |
| PROJ-02 | Featured project in first position | unit | `npx vitest run src/components/projects/__tests__/carousel.test.ts -t "featured project first"` | Wave 0 |
| PROJ-03 | Card shows image, title, summary, hover effect | unit | `npx vitest run src/components/projects/__tests__/carousel.test.ts -t "card content"` | Wave 0 |
| PROJ-04 | Card click opens Dialog/Drawer | unit | `npx vitest run src/components/projects/__tests__/carousel.test.ts -t "opens detail"` | Wave 0 |
| PROJ-05 | Carousel coexists with Lenis | unit | `npx vitest run src/components/projects/__tests__/carousel.test.ts -t "data-lenis-prevent"` | Wave 0 |
| TIME-01 | SVG path draws on scroll | manual-only | Scroll-linked pathLength requires real scroll environment | N/A |
| TIME-02 | Glowing node markers activate on scroll | unit | `npx vitest run src/components/sections/__tests__/timeline.test.ts -t "renders nodes"` | Wave 0 |
| TIME-03 | Pulse ring animation on activation | manual-only | CSS animation requires visual verification | N/A |
| TIME-04 | Content fades in with node activation | manual-only | Scroll-linked opacity requires real scroll environment | N/A |

### Sampling Rate
- **Per task commit:** `npx vitest run --reporter=verbose`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/components/sections/__tests__/expertise.test.ts` -- covers SKTL-01, SKTL-03
- [ ] `src/components/projects/__tests__/carousel.test.ts` -- covers PROJ-01 through PROJ-05
- [ ] `src/components/sections/__tests__/timeline.test.ts` -- covers TIME-02

*(Test infrastructure exists: Vitest 4.1 + jsdom configured, @testing-library/react available, existing test patterns in src/data/__tests__/)*

## Sources

### Primary (HIGH confidence)
- [Embla Carousel React docs](https://www.embla-carousel.com/docs/get-started/react) - hook API, DOM structure, CSS requirements
- [Embla Carousel API Options](https://www.embla-carousel.com/docs/api/options) - align, containScroll, dragFree, duration, all defaults
- [Embla Carousel prev/next buttons guide](https://www.embla-carousel.com/docs/guides/previous-and-next-buttons) - canGoToPrev, canGoToNext, button state management
- [Motion SVG animation docs](https://motion.dev/docs/react-svg-animation) - pathLength, pathSpacing, pathOffset on path/circle/etc
- [Motion layout animations docs](https://motion.dev/docs/react-layout-animations) - layoutId shared element transitions
- [Motion AnimatePresence docs](https://motion.dev/docs/react-animate-presence) - exit animations, mode="wait", key-based content swapping
- [Lenis GitHub - data-lenis-prevent](https://github.com/darkroomengineering/lenis) - attribute-based scroll prevention for nested containers
- [BuildUI Animated Tabs recipe](https://buildui.com/recipes/animated-tabs) - layoutId pill indicator pattern with spring transition

### Secondary (MEDIUM confidence)
- [dev.to scroll SVG path with framer-motion](https://dev.to/heres/scroll-svg-path-with-framer-motion-54el) - useScroll + useTransform + pathLength implementation pattern
- [Embla + framer-motion conflict (GitHub #317)](https://github.com/davidjerleke/embla-carousel/issues/317) - LayoutGroup conflicts with Embla transforms
- [Epic Web Dev glassmorphism with Tailwind](https://www.epicweb.dev/tips/creating-glassmorphism-effects-with-tailwind-css) - backdrop-blur-md + bg-white/10 pattern
- v1.2 milestone research (`.planning/research/STACK.md`, `ARCHITECTURE.md`, `PITFALLS.md`) - comprehensive stack validation, integration patterns, and pitfall documentation

### Tertiary (LOW confidence)
- None -- all findings verified against primary or secondary sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - embla-carousel-react validated in v1.2 research; Motion layoutId and pathLength verified via official docs
- Architecture: HIGH - patterns derived from official documentation and existing codebase patterns
- Pitfalls: HIGH - pitfalls validated against v1.2 research, official GitHub issues, and codebase inspection
- Code examples: HIGH - adapted from official docs and verified patterns; grounded in actual project data structures and styling conventions

**Research date:** 2026-03-27
**Valid until:** 2026-04-27 (stable libraries, well-documented patterns)
