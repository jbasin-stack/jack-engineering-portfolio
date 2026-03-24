# Phase 2: Content Sections - Research

**Researched:** 2026-03-22
**Domain:** React data-driven sections, scroll-driven animation, semantic HTML, Motion (framer-motion) scroll APIs
**Confidence:** HIGH

## Summary

Phase 2 implements five content sections (Skills, Lab & Tooling, Coursework, Timeline, Contact) all rendered from typed TypeScript data files. The project already has an established pattern from Phase 1: typed interfaces in `src/types/data.ts`, data files in `src/data/`, and components using Motion variants with `hidden/visible` naming and weighted tween easing. This phase extends that pattern to five new sections.

The most technically complex piece is the Timeline scroll-driven progressive fill animation, which requires Motion's `useScroll` hook with a target ref and `useTransform` to map scroll progress to the line's `scaleY` and node activation states. All other sections are straightforward data-driven rendering with `whileInView` fade-up animations. A notable pitfall is that lucide-react has deprecated brand icons (Github, Linkedin) as of v0.475.0 -- the project already uses these in HeroContent.tsx and will need them again for the Contact section.

**Primary recommendation:** Follow the established Phase 1 data-file + typed-interface + component pattern exactly. Use Motion's `useScroll({ target, offset })` with `useTransform` for the timeline fill, and `whileInView` with `viewport={{ once: true }}` for all section entry animations. Keep the lucide-react brand icons for now (they work but emit deprecation warnings) and note future migration to `@icons-pack/react-simple-icons` or inline SVGs.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Skills presentation:** 2x2 column grid, name only per skill, natural case bold headings, whitespace-only separation (no borders/dividers), static text (no hover effects), section animates on entry (staggered fade-up) but items are static after
- **Lab & Tooling presentation:** Same column grid pattern as Skills (categories each get a column), same visual treatment (name only, natural case bold headings, whitespace separation, static text)
- **Coursework presentation:** Simple vertical list (NOT column grid), each entry: course code + name with one-line descriptor below, lighter weight descriptor text
- **Timeline visual style:** Left-aligned vertical line on left with milestones extending right, each milestone shows date label + bold title + one-line description (three tiers), 2px line weight, line invisible until filled (no grey track), accent-colored fill progresses as user scrolls, node dots start hollow/grey then fill with accent as line reaches them, milestone content animates in (fade-up) as fill reaches each node
- **Contact section:** Prominent CTA section with centered layout, brief personal line above links (data-driven), email as styled mailto link with accent hover, "Download Resume" button as filled accent button with white text (ONLY filled button on entire page), social links below resume button, semantic markup
- **Section flow & spacing:** Page order (after Hero): Skills -> Lab/Tooling -> Coursework -> Timeline -> Contact. Generous whitespace only between sections (py-24 or more), no borders/alternating backgrounds/dividers. Consistent max-width container. All headings and content fade-up on scroll into viewport with weighted tween

### Claude's Discretion
- Exact max-width value for the content container
- Exact padding/gap values within the column grids
- Timeline node dot size and spacing between milestones
- Contact section vertical spacing and social link icon treatment
- Coursework list spacing between entries
- Stagger timing for fade-up animations within each section
- How the skills grid collapses on mobile (2x2 -> 1 column)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| SKIL-01 | User can view technical skills as a clean typography-driven list | Column grid component with data-driven rendering from typed TS data file |
| SKIL-02 | Skills are grouped by domain: Fabrication, RF, Analog, Digital | Data file structures groups with domain name + skills array |
| SKIL-03 | Skills are rendered from a TypeScript data file for easy updates | Established pattern from heroData -- typed interface + data file |
| SKIL-04 | Skills section uses semantic HTML so AI scrapers can parse skill keywords | Use `<section>`, `<h2>`, `<h3>`, `<ul>`, `<li>` elements with descriptive aria-labels |
| TOOL-01 | User sees a section displaying hands-on lab and tooling proficiency | Same grid component pattern as Skills, different data source |
| TOOL-02 | Tooling is grouped by category (EDA tools, lab equipment, fabrication processes) | Data file groups by category, same interface shape as skills |
| TOOL-03 | Tooling data is driven from a TypeScript data file | Same typed data file pattern |
| CRSE-01 | User sees a section highlighting key UW ECE courses | Vertical list component rendering from typed course data |
| CRSE-02 | Courses include brief descriptors signaling domain relevance | Course interface includes `code`, `name`, and `descriptor` fields |
| CRSE-03 | Coursework data is driven from a TypeScript data file | Same typed data file pattern |
| TIME-01 | User sees a vertical timeline visualizing engineering journey | Left-aligned timeline component with Motion scroll-linked animation |
| TIME-02 | Timeline contains 6-10 key milestones | Data file with array of milestone objects |
| TIME-03 | Timeline features scroll-driven animation (fill line progresses as user scrolls) | Motion `useScroll` + `useTransform` for progressive scaleY fill |
| TIME-04 | Timeline data is driven from a TypeScript data file | Same typed data file pattern |
| CONT-01 | User sees a contact section with direct email link | Contact component with mailto link from data file |
| CONT-02 | User sees links to LinkedIn and GitHub profiles | Social links rendered from contact data with icon map pattern |
| CONT-03 | User can download resume as a PDF via a prominent button | Filled accent button linking to `/resume.pdf` in public directory |
| CONT-04 | Contact section uses semantic markup for scraper readability | Use `<address>`, `<a>` with proper rel attributes, structured data |
</phase_requirements>

## Standard Stack

### Core (already installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| motion | ^12.38.0 | Scroll animations (useScroll, useTransform, whileInView, motion.div) | Already installed; provides both scroll-linked and scroll-triggered animation APIs |
| react | ^19.2.4 | Component framework | Already installed |
| tailwindcss | ^4.2.2 | Utility-first styling with existing theme tokens | Already installed; cleanroom palette, Inter font, border-hairline utility |
| lucide-react | ^0.577.0 | Icons (Mail, Download, ExternalLink, plus deprecated Github/Linkedin) | Already installed; used in Hero and Navigation |
| lenis | ^1.3.19 | Smooth scroll wrapper | Already installed; all sections just need proper `id` attributes |

### Supporting (no new packages needed)
No additional packages are required for Phase 2. All functionality is achievable with the existing stack.

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| lucide-react Github/Linkedin icons | @icons-pack/react-simple-icons | Avoids deprecation warnings, but adds a dependency for 2 icons -- not worth it now |
| lucide-react Github/Linkedin icons | Inline SVG components | Zero dependency, but manual maintenance -- reasonable future migration |
| Motion useScroll for timeline | CSS scroll-timeline | Native CSS, but browser support is still incomplete (no Safari as of early 2026) |
| Motion whileInView | Custom IntersectionObserver | Already have useActiveSection hook, but whileInView is simpler and integrates with variants |

**Installation:**
```bash
# No new packages needed -- Phase 2 uses the existing stack entirely
```

## Architecture Patterns

### Recommended Project Structure
```
src/
  types/
    data.ts              # ADD: SkillGroup, ToolingGroup, Course, TimelineMilestone, ContactData interfaces
  data/
    hero.ts              # EXISTING: reference pattern
    skills.ts            # NEW: 4 domain groups
    tooling.ts           # NEW: 3 category groups
    coursework.ts        # NEW: course entries with descriptors
    timeline.ts          # NEW: 6-10 milestones
    contact.ts           # NEW: email, social links, resume path, tagline
    __tests__/
      skills.test.ts     # NEW: data integrity tests
      tooling.test.ts    # NEW: data integrity tests
      coursework.test.ts # NEW: data integrity tests
      timeline.test.ts   # NEW: data integrity tests
      contact.test.ts    # NEW: data integrity tests
  components/
    sections/
      Skills.tsx         # NEW: 2x2 column grid section
      Tooling.tsx        # NEW: column grid section (same pattern as Skills)
      Coursework.tsx     # NEW: vertical list section
      Timeline.tsx       # NEW: scroll-driven timeline with progressive fill
      Contact.tsx        # NEW: CTA section with email, resume button, social links
  styles/
    motion.ts            # EXTEND: add whileInView variants for section entry animations
```

### Pattern 1: Data-Driven Section Component
**What:** Each section reads from a typed data file, maps over arrays, and renders with semantic HTML. Animations use Motion variants.
**When to use:** Every content section in Phase 2 follows this pattern.
**Example:**
```typescript
// src/types/data.ts -- ADD these interfaces
export interface SkillGroup {
  domain: string;      // "Fabrication", "RF", "Analog", "Digital"
  skills: string[];    // ["Thin Film Deposition", "Photolithography", ...]
}

export interface ToolingGroup {
  category: string;    // "EDA Tools", "Lab Equipment", "Fabrication Processes"
  items: string[];
}

export interface Course {
  code: string;        // "EE 331"
  name: string;        // "Devices & Circuits I"
  descriptor: string;  // "Semiconductor physics and MOSFET device modeling"
}

export interface TimelineMilestone {
  date: string;        // "Sep 2023"
  title: string;       // "Started UW ECE"
  description: string; // "Began Electrical & Computer Engineering program"
}

export interface ContactData {
  tagline: string;     // "Open to internship and research opportunities"
  email: string;
  resumePath: string;  // "/resume.pdf"
  socialLinks: SocialLink[];  // reuses existing SocialLink interface
}
```

```typescript
// src/data/skills.ts -- follows heroData pattern exactly
import type { SkillGroup } from '../types/data';

export const skillGroups: SkillGroup[] = [
  {
    domain: 'Fabrication',
    skills: ['Thin Film Deposition', 'Photolithography', 'Wet/Dry Etching', 'SEM/AFM Characterization'],
  },
  {
    domain: 'RF',
    skills: ['S-Parameter Analysis', 'Impedance Matching', 'Filter Design', 'VNA Operation'],
  },
  // ... Analog, Digital
];
```

### Pattern 2: whileInView Scroll-Triggered Fade-Up
**What:** Sections and their children animate in when scrolling into the viewport. Uses the established `hidden/visible` variant naming convention from HeroContent.tsx.
**When to use:** Every section heading and content block.
**Example:**
```typescript
// Source: Motion docs -- whileInView with viewport options
// Uses the established hidden/visible variant naming from HeroContent.tsx

import { motion, type Variants } from 'motion/react';
import { easing } from '../../styles/motion';

// Container with stagger -- reuse pattern from HeroContent
const sectionVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easing.out },
  },
};

// Usage in any section component:
<motion.section
  id="skills"
  className="px-6 py-24"
  variants={sectionVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.2 }}
>
  <motion.h2 variants={itemVariants}>Skills</motion.h2>
  {/* ... children also use itemVariants */}
</motion.section>
```

### Pattern 3: Timeline Scroll-Driven Progressive Fill
**What:** The vertical timeline line fills with accent color and activates node dots as the user scrolls through the timeline section. Uses `useScroll` with a target ref to track the section's scroll progress, and `useTransform` to map that progress to visual states.
**When to use:** Timeline section only.
**Example:**
```typescript
// Timeline progressive fill using useScroll + useTransform
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

function Timeline({ milestones }: { milestones: TimelineMilestone[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress of the timeline container through the viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.5'],
    // "start 0.8" = animation begins when top of container is at 80% of viewport
    // "end 0.5" = animation ends when bottom of container reaches 50% of viewport
  });

  return (
    <section id="timeline" className="px-6 py-24">
      <div ref={containerRef} className="relative mx-auto max-w-3xl">
        {/* The fill line -- scales from 0 to 1 on Y axis */}
        <motion.div
          className="absolute left-0 top-0 h-full w-0.5 origin-top bg-accent"
          style={{ scaleY: scrollYProgress }}
        />

        {milestones.map((milestone, index) => (
          <TimelineNode
            key={index}
            milestone={milestone}
            index={index}
            total={milestones.length}
            scrollProgress={scrollYProgress}
          />
        ))}
      </div>
    </section>
  );
}

// Each node activates when scroll progress reaches its position
function TimelineNode({ milestone, index, total, scrollProgress }) {
  // Map this node's activation threshold: evenly spaced along the scroll
  const threshold = index / (total - 1);
  const isActive = useTransform(scrollProgress, (v) => v >= threshold);

  // ... render node dot (fill when active) + milestone content (fade in when active)
}
```

### Pattern 4: Reusable ColumnGrid for Skills and Tooling
**What:** Both Skills and Tooling sections share the same visual DNA -- a responsive column grid with domain/category headings and simple name lists. Extract a shared component or keep them as consistent siblings.
**When to use:** Skills and Tooling sections.
**Example:**
```typescript
// Shared pattern for column grid sections
// Skills: 4 columns (Fabrication, RF, Analog, Digital)
// Tooling: 3 columns (EDA Tools, Lab Equipment, Fab Processes)

<div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
  {groups.map((group) => (
    <div key={group.domain}>
      <h3 className="text-lg font-semibold text-ink">{group.domain}</h3>
      <ul className="mt-4 space-y-2">
        {group.skills.map((skill) => (
          <li key={skill} className="text-silicon-600">{skill}</li>
        ))}
      </ul>
    </div>
  ))}
</div>
```

### Anti-Patterns to Avoid
- **DO NOT use spring animations:** All Motion transitions must use tween (duration + ease). The project enforces a no-spring policy with unit tests that deep-check for `type: 'spring'`.
- **DO NOT add bounce or overshoot:** Use `easing.out` from `src/styles/motion.ts` for all entry animations. Weighted, no bounce.
- **DO NOT use `animate="visible"` with `whileInView`:** Use `initial="hidden" whileInView="visible"` -- not `initial="hidden" animate="visible"` (that fires on mount, not on scroll).
- **DO NOT hardcode content in JSX:** Every string, every skill name, every course -- must come from the data file.
- **DO NOT add borders or background alternation between sections:** User explicitly locked "whitespace as the primary organizing principle."
- **DO NOT show the timeline track before it fills:** The line must be invisible until the accent fill reaches that point. This means the fill IS the line -- there is no grey base track.
- **DO NOT use `min-h-screen` on content sections:** Only placeholder sections used this. Real sections should size to their content with `py-24` vertical padding.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Scroll-triggered entry animations | Custom IntersectionObserver + useState | Motion `whileInView` + `viewport={{ once: true }}` | Handles mount/unmount, respects reducedMotion via MotionConfig, integrates with variants |
| Scroll-linked timeline progress | Manual scroll listener + requestAnimationFrame | Motion `useScroll({ target })` + `useTransform` | Native ScrollTimeline fallback, no jank, works with Lenis smooth scroll |
| Icon rendering from data | Switch statements or string-to-component maps | Lucide icon map pattern (already established in HeroContent.tsx) | Type-safe, tree-shakeable, consistent with Phase 1 |
| Responsive grid breakpoints | Manual media queries in JS | Tailwind `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` | Established pattern, zero JS overhead |
| Motion value derived state | useEffect + useState watching scroll position | `useTransform` with callback | No re-renders, runs on animation frame, composable |

**Key insight:** Phase 2 has zero novel technical problems. Every pattern is either already established in Phase 1 (data files, variants, icon maps) or is a well-documented Motion API (useScroll, useTransform, whileInView). The timeline is the most complex piece but is a standard Motion pattern.

## Common Pitfalls

### Pitfall 1: Stale MotionValues in Timeline Node Components
**What goes wrong:** Using `useTransform` with a callback returns a MotionValue, not a React state. You cannot use it directly in conditional rendering or className ternaries.
**Why it happens:** MotionValues update outside React's render cycle for performance. Treating them as state causes the component to not re-render.
**How to avoid:** Use `useMotionValueEvent` to sync a MotionValue to React state when you need to conditionally render or apply classes, OR use `motion.div` style props directly.
**Warning signs:** Timeline nodes never change visual state despite scrolling.
```typescript
// WRONG: MotionValue in conditional
const isActive = useTransform(progress, v => v >= threshold);
return <div className={isActive ? 'bg-accent' : 'bg-gray'}> // isActive is a MotionValue, not boolean

// RIGHT: Use useMotionValueEvent to sync to state
const [isActive, setIsActive] = useState(false);
useMotionValueEvent(scrollProgress, 'change', (v) => {
  setIsActive(v >= threshold);
});
return <div className={isActive ? 'bg-accent' : 'bg-silicon-200'}> // boolean, works
```

### Pitfall 2: whileInView Fires on Mount When Element is Already Visible
**What goes wrong:** If a section is in the viewport when the page loads (unlikely for sections below the fold, but possible on short viewports), the animation plays instantly with no visual effect.
**Why it happens:** `whileInView` detects the element as "in view" on mount.
**How to avoid:** Set `initial="hidden"` so the element starts hidden, and the transition from hidden to visible is always visible regardless of timing.
**Warning signs:** Sections appear without animation on page load.

### Pitfall 3: Lucide Brand Icon Deprecation Warnings
**What goes wrong:** Importing `Github` and `Linkedin` from lucide-react emits TypeScript deprecation warnings as of v0.475.0. The project uses v0.577.0.
**Why it happens:** Lucide no longer maintains brand icons due to trademark policies.
**How to avoid:** For Phase 2, continue using the existing imports (they still work, just deprecated). The Contact section social icons should use the same `iconMap` pattern from HeroContent.tsx for consistency. Document as tech debt for future migration to inline SVGs or `@icons-pack/react-simple-icons`.
**Warning signs:** TypeScript strikethrough on `Github`/`Linkedin` imports, deprecation notices in IDE.

### Pitfall 4: Timeline useScroll Offset Misconfiguration
**What goes wrong:** The timeline fill line either completes too early, too late, or jumps instead of smoothly progressing.
**Why it happens:** The `offset` array in `useScroll` defines when progress=0 and progress=1 relative to the target and viewport. Wrong values cause unexpected mapping.
**How to avoid:** Use `offset: ["start end", "end start"]` as a starting point (progress goes from 0 when the container enters the viewport to 1 when it exits). Then tune for the "reveal as you scroll through" effect. The CONTEXT decision says fill progresses "as user scrolls down the page," so the fill should complete roughly as the last milestone is centered in viewport.
**Warning signs:** Line snaps to full, or fill progress doesn't match scroll position intuitively.

### Pitfall 5: Section ID Mismatch with Navigation
**What goes wrong:** Nav links don't scroll to the right section, or scroll-spy highlighting breaks.
**Why it happens:** The navigation data has `#skills`, `#coursework`, `#tooling`, `#contact` and the scroll-spy watches `['skills', 'coursework', 'tooling', 'projects', 'papers', 'contact']`. If section `id` attributes don't match exactly, linking breaks.
**How to avoid:** Double-check every section component's `id` attribute matches what's in `navigation.ts` and `Navigation.tsx` sectionIds. The CONTEXT specifies page order: Skills -> Lab/Tooling -> Coursework -> Timeline -> Contact. Note that "timeline" is NOT in the current nav, so it doesn't need a nav entry (it sits between Coursework and Contact). The current App.tsx placeholder order differs from the CONTEXT decision and must be updated.
**Warning signs:** Clicking nav links scrolls to wrong section or nowhere.

### Pitfall 6: Forgetting `viewport={{ once: true }}`
**What goes wrong:** Section entry animations replay every time the user scrolls back and forth, causing visual noise and cognitive fatigue.
**Why it happens:** `whileInView` without `once: true` re-triggers both enter and exit animations.
**How to avoid:** Always include `viewport={{ once: true }}` on section-level `whileInView` animations. The CONTEXT says "Section animates on entry (staggered fade-up) but items are static after."
**Warning signs:** Animations replay on scroll-up.

## Code Examples

Verified patterns from the existing codebase and official sources:

### Section Entry Animation Pattern (extends HeroContent.tsx pattern)
```typescript
// Consistent with HeroContent.tsx hidden/visible naming convention
// Source: existing codebase pattern + Motion whileInView docs
import { motion, type Variants } from 'motion/react';
import { easing } from '../../styles/motion';

const sectionVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easing.out },
  },
};

// Usage: wrap section content in motion.section
<motion.section
  id="skills"
  className="px-6 py-24"
  variants={sectionVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.15 }}
>
  <div className="mx-auto max-w-4xl">
    <motion.h2
      className="text-2xl font-bold text-ink"
      variants={fadeUpVariant}
    >
      Skills
    </motion.h2>
    {/* Grid children also use fadeUpVariant */}
  </div>
</motion.section>
```

### Data File Pattern (mirrors hero.ts exactly)
```typescript
// src/data/contact.ts
import type { ContactData } from '../types/data';

export const contactData: ContactData = {
  tagline: 'Open to internship and research opportunities',
  email: 'jack@example.com',
  resumePath: '/resume.pdf',
  socialLinks: [
    { platform: 'GitHub', url: 'https://github.com/jackbasinski', icon: 'Github' },
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/jackbasinski', icon: 'Linkedin' },
  ],
};
```

### Timeline Fill Line with useScroll + useTransform
```typescript
// Source: Motion useScroll docs, adapted for vertical timeline fill
import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'motion/react';
import { easing } from '../../styles/motion';
import type { TimelineMilestone } from '../../types/data';

export function Timeline({ milestones }: { milestones: TimelineMilestone[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.6'],
  });

  return (
    <motion.section
      id="timeline"
      className="px-6 py-24"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <div ref={containerRef} className="relative mx-auto max-w-3xl pl-8">
        {/* Progressive fill line -- scaleY driven by scroll progress */}
        <motion.div
          className="absolute left-0 top-0 h-full w-0.5 origin-top bg-accent"
          style={{ scaleY: scrollYProgress }}
        />

        {milestones.map((milestone, i) => (
          <TimelineNode
            key={i}
            milestone={milestone}
            index={i}
            total={milestones.length}
            scrollProgress={scrollYProgress}
          />
        ))}
      </div>
    </motion.section>
  );
}
```

### Resume Download Button (only filled button on the page)
```typescript
// Source: CONTEXT.md locked decision -- the ONLY filled button on the entire page
<a
  href={contactData.resumePath}
  download
  className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
>
  <Download size={18} strokeWidth={1.5} />
  Download Resume
</a>
```

### Semantic HTML for Scraper Readability
```typescript
// Skills section -- semantic markup for AI scrapers
<section id="skills" aria-label="Technical Skills">
  <h2>Skills</h2>
  {skillGroups.map((group) => (
    <div key={group.domain} role="group" aria-label={`${group.domain} skills`}>
      <h3>{group.domain}</h3>
      <ul>
        {group.skills.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
    </div>
  ))}
</section>

// Contact section -- semantic markup
<section id="contact" aria-label="Contact Information">
  <address>
    <a href={`mailto:${contactData.email}`}>{contactData.email}</a>
  </address>
</section>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `framer-motion` package | `motion` package | 2024 rebrand | Import from `motion/react` not `framer-motion` -- already done in Phase 1 |
| `useViewportScroll` | `useScroll` | framer-motion v6+ | `useViewportScroll` is removed; use `useScroll()` (no args) for page scroll |
| `onViewportEnter` callback | `whileInView` prop | framer-motion v6+ | Declarative approach, integrates with variants |
| Manual scroll listeners for timeline | `useScroll({ target })` + `useTransform` | Stable in Motion 10+ | Hardware-accelerated via native ScrollTimeline when possible |
| Lucide brand icons (Github, Linkedin) | Deprecated in lucide-react 0.475.0+ | Feb 2025 | Still functional, emit deprecation warnings; future migration to simple-icons or inline SVGs |

**Deprecated/outdated:**
- `useViewportScroll`: Removed, replaced by `useScroll()` with no arguments
- `AnimateSharedLayout`: Removed, functionality merged into `AnimatePresence` and `layoutId`
- Lucide `Github`, `Linkedin`, `Instagram`, `Twitter`, `Facebook`: Deprecated, still exported but will be removed eventually

## Open Questions

1. **Timeline section ID and navigation integration**
   - What we know: Timeline sits between Coursework and Contact in the page flow. The nav does not have a "Timeline" link -- it's not in the `#background` dropdown or as a top-level item.
   - What's unclear: Should the timeline section have a nav anchor? It wasn't mentioned in CONTEXT.
   - Recommendation: Give it `id="timeline"` for anchoring purposes but don't add a nav link (it's a visual element users scroll through naturally, not a section they'd navigate to directly). No change to navigation.ts needed.

2. **App.tsx section order vs CONTEXT decision**
   - What we know: Current App.tsx placeholders have: background, skills, coursework, tooling, projects, papers, contact. The CONTEXT decision says: Skills -> Lab/Tooling -> Coursework -> Timeline -> Contact (with Projects and Papers being Phase 3).
   - What's unclear: Should we remove `#background` placeholder or keep it? Should Skills have `id="skills"` or `id="background"`?
   - Recommendation: Remove the `#background` placeholder. Skills gets `id="skills"`, Tooling gets `id="tooling"`. The nav dropdown for "Background" already maps its children to `#skills`, `#coursework`, `#tooling`. Keep `#projects` and `#papers` as simple placeholders for Phase 3.

3. **Resume PDF file**
   - What we know: Contact section needs a "Download Resume" button linking to a PDF.
   - What's unclear: Does the PDF exist yet? Where should it live?
   - Recommendation: Place a placeholder PDF or create the path at `/public/resume.pdf`. The data file should reference `/resume.pdf` (Vite serves public/ files at root). If no PDF exists yet, include a TODO comment.

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
| SKIL-01 | Skills section renders all skill groups from data | unit | `npx vitest run src/data/__tests__/skills.test.ts -x` | No -- Wave 0 |
| SKIL-02 | Skills grouped by 4 domains | unit | `npx vitest run src/data/__tests__/skills.test.ts -x` | No -- Wave 0 |
| SKIL-03 | Skills data file exports typed array | unit | `npx vitest run src/data/__tests__/skills.test.ts -x` | No -- Wave 0 |
| SKIL-04 | Semantic HTML structure | manual-only | Visual inspection of DOM | N/A -- semantic HTML verified by inspection |
| TOOL-01 | Tooling section renders all groups | unit | `npx vitest run src/data/__tests__/tooling.test.ts -x` | No -- Wave 0 |
| TOOL-02 | Tooling grouped by 3 categories | unit | `npx vitest run src/data/__tests__/tooling.test.ts -x` | No -- Wave 0 |
| TOOL-03 | Tooling data file exports typed array | unit | `npx vitest run src/data/__tests__/tooling.test.ts -x` | No -- Wave 0 |
| CRSE-01 | Coursework section renders courses | unit | `npx vitest run src/data/__tests__/coursework.test.ts -x` | No -- Wave 0 |
| CRSE-02 | Courses have code, name, and descriptor | unit | `npx vitest run src/data/__tests__/coursework.test.ts -x` | No -- Wave 0 |
| CRSE-03 | Coursework data file exports typed array | unit | `npx vitest run src/data/__tests__/coursework.test.ts -x` | No -- Wave 0 |
| TIME-01 | Timeline section renders milestones | unit | `npx vitest run src/data/__tests__/timeline.test.ts -x` | No -- Wave 0 |
| TIME-02 | Timeline has 6-10 milestones | unit | `npx vitest run src/data/__tests__/timeline.test.ts -x` | No -- Wave 0 |
| TIME-03 | Scroll-driven animation (fill line) | manual-only | Visual scroll test in browser | N/A -- scroll animation verified by inspection |
| TIME-04 | Timeline data file exports typed array | unit | `npx vitest run src/data/__tests__/timeline.test.ts -x` | No -- Wave 0 |
| CONT-01 | Contact has email link | unit | `npx vitest run src/data/__tests__/contact.test.ts -x` | No -- Wave 0 |
| CONT-02 | Contact has LinkedIn and GitHub links | unit | `npx vitest run src/data/__tests__/contact.test.ts -x` | No -- Wave 0 |
| CONT-03 | Resume download path exists | unit | `npx vitest run src/data/__tests__/contact.test.ts -x` | No -- Wave 0 |
| CONT-04 | Semantic markup | manual-only | Visual DOM inspection | N/A |

### Sampling Rate
- **Per task commit:** `npx vitest run --reporter=verbose`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/data/__tests__/skills.test.ts` -- covers SKIL-01, SKIL-02, SKIL-03
- [ ] `src/data/__tests__/tooling.test.ts` -- covers TOOL-01, TOOL-02, TOOL-03
- [ ] `src/data/__tests__/coursework.test.ts` -- covers CRSE-01, CRSE-02, CRSE-03
- [ ] `src/data/__tests__/timeline.test.ts` -- covers TIME-01, TIME-02, TIME-04
- [ ] `src/data/__tests__/contact.test.ts` -- covers CONT-01, CONT-02, CONT-03
- [ ] `src/styles/__tests__/motion.test.ts` -- UPDATE existing test to cover new animation variants (no-spring check for section variants)

## Sources

### Primary (HIGH confidence)
- Existing codebase (Phase 1 patterns) -- `src/types/data.ts`, `src/data/hero.ts`, `src/components/hero/HeroContent.tsx`, `src/styles/motion.ts`
- [Motion useScroll docs](https://motion.dev/docs/react-use-scroll) -- useScroll API, target, offset, scrollYProgress
- [Motion scroll animations overview](https://motion.dev/docs/react-scroll-animations) -- whileInView, viewport options, scroll-linked vs scroll-triggered
- [Motion component docs](https://motion.dev/docs/react-motion-component) -- whileInView prop, viewport.once, viewport.amount

### Secondary (MEDIUM confidence)
- [Lucide-icons deprecation issue #2792](https://github.com/lucide-icons/lucide/issues/2792) -- Brand icons deprecated at v0.475.0
- [Lucide brand icons policy #670](https://github.com/lucide-icons/lucide/issues/670) -- Not accepting new brand icons
- [Animata animated timeline](https://animata.design/docs/progress/animatedtimeline) -- Timeline component patterns with scaleY and staggered activation

### Tertiary (LOW confidence)
- [Scroll-linked timeline animation Medium article](https://medium.com/@daxgama/scroll-linked-timeline-animation-with-framer-motion-d868b6b72f99) -- Could not access (403), referenced approach only

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- No new packages, all already installed and verified in Phase 1
- Architecture: HIGH -- Extends established Phase 1 patterns (data files, typed interfaces, Motion variants, icon maps)
- Pitfalls: HIGH -- Timeline scroll animation is well-documented; icon deprecation verified via GitHub issues
- Timeline scroll animation: MEDIUM -- API is well-documented but offset tuning requires visual iteration in browser

**Research date:** 2026-03-22
**Valid until:** 2026-04-22 (stable stack, no fast-moving dependencies)
