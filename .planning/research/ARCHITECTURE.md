# Architecture Patterns

**Domain:** Premium minimalist engineering portfolio (single-page scroll SPA)
**Researched:** 2026-03-20

## Recommended Architecture

Single-page React SPA with data-driven content, section-based composition, and scroll-orchestrated animations.

```
src/
  components/
    layout/
      App.tsx              # Root: ReactLenis wrapper + section composition
      Navigation.tsx       # Fixed glassmorphic nav with scroll-to-anchor
      Footer.tsx           # Contact links, copyright
    sections/
      Hero.tsx             # Typography-first hero with narrative
      Skills.tsx           # Domain-grouped skills list
      Projects.tsx         # Bento grid with expandable cards
      Papers.tsx           # Paper/resume list with PDF viewer trigger
      LabTooling.tsx       # Hands-on equipment and tools
      Coursework.tsx       # Key UW ECE courses
      Timeline.tsx         # Engineering journey visualization
      Contact.tsx          # Email, LinkedIn, GitHub, resume download
    ui/
      (shadcn components)  # Dialog, Drawer, Button, etc. (added via CLI)
    shared/
      Section.tsx          # Reusable section wrapper (id, padding, animation)
      AnimatedEntry.tsx    # Reusable whileInView fade/slide wrapper
      PdfViewer.tsx        # react-pdf Document/Page in Dialog/Drawer
      ProjectCard.tsx      # Individual bento card with expansion logic
  data/
    projects.ts            # Project content (title, description, tags, images)
    papers.ts              # Paper/resume metadata (title, abstract, pdf path)
    skills.ts              # Skills grouped by domain
    timeline.ts            # Timeline entries
    coursework.ts          # Course data
    navigation.ts          # Nav items (label, anchor id)
  hooks/
    useActiveSection.ts    # Intersection Observer for active nav highlighting
    usePdfViewer.ts        # PDF viewer open/close state management
    useMediaQuery.ts       # Responsive breakpoint detection (Dialog vs Drawer)
  lib/
    utils.ts               # cn() utility, shared helpers
    motion.ts              # Shared Motion animation variants/configs
  styles/
    globals.css            # Tailwind import, custom properties, fonts
  assets/
    pdfs/                  # PDF files for papers and resume
    images/                # Project images, optimized
  main.tsx                 # Entry point
  index.html               # Meta tags, Open Graph, fonts
```

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `App.tsx` | Root layout, Lenis provider, section ordering | All sections, Navigation |
| `Navigation.tsx` | Fixed glassmorphic nav, scroll-to-anchor, active section highlight | `useActiveSection` hook, Lenis scroll API |
| `Section.tsx` | Consistent section wrapper: id anchor, padding, optional entry animation | Individual section components |
| `AnimatedEntry.tsx` | Reusable Motion `whileInView` wrapper with configurable spring/delay | Any element needing scroll-triggered animation |
| `ProjectCard.tsx` | Single project card: thumbnail, title, tags, expansion trigger/content | `Projects.tsx` parent, `data/projects.ts` |
| `PdfViewer.tsx` | react-pdf rendering inside shadcn Dialog (desktop) or Drawer (mobile) | `Papers.tsx`, `Contact.tsx` (for resume) |
| `data/*.ts` | Content as typed TypeScript objects. Single source of truth. | All section components import their data |

### Data Flow

```
data/*.ts (static TS objects)
    |
    v
Section components (import data, map to JSX)
    |
    v
Shared components (AnimatedEntry wraps elements, Section wraps sections)
    |
    v
App.tsx (composes sections in scroll order, wraps in ReactLenis)
    |
    v
Navigation (reads section anchors, highlights active via IntersectionObserver)
    |
    v
Lenis (intercepts scroll events, applies smooth interpolation)
    |
    v
Motion (animates elements as they enter viewport via whileInView/useScroll)
```

No state management library needed. This is a read-only portfolio with minimal interactive state:
- **PDF viewer open/close**: `useState` in a custom hook
- **Expanded project card**: `useState` in Projects section
- **Active navigation section**: `useActiveSection` hook (IntersectionObserver)

## Patterns to Follow

### Pattern 1: Data-Driven Content
**What:** All displayable content lives in typed TypeScript files under `data/`, not inline in JSX.
**When:** Every section that renders content (projects, skills, papers, timeline, coursework).
**Why:** Content updates require zero component changes. Type safety catches missing fields. Easy to hand off content editing to non-developers.

```typescript
// data/projects.ts
export interface Project {
  id: string
  title: string
  subtitle: string
  description: string
  tags: string[]
  image: string
  details: string  // expanded view content (markdown or plain text)
}

export const projects: Project[] = [
  {
    id: 'rf-amplifier',
    title: 'Low-Noise RF Amplifier',
    subtitle: 'Cadence Virtuoso / 180nm CMOS',
    description: 'Designed a two-stage LNA achieving 2.1 dB noise figure...',
    tags: ['RF', 'Analog', 'Cadence'],
    image: '/images/rf-amplifier.webp',
    details: 'Full technical writeup...'
  },
  // ...
]
```

### Pattern 2: Shared Animation Variants
**What:** Define Motion animation configs in a central file, reuse across components.
**When:** Entry animations, hover states, stagger configurations.
**Why:** Consistent motion language. One place to tune the "weighted, no bounce" feel.

```typescript
// lib/motion.ts
export const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }
}

export const staggerContainer = {
  whileInView: { transition: { staggerChildren: 0.08 } },
  viewport: { once: true }
}

// Custom spring: weighted, no bounce
export const weightedSpring = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
  mass: 1
}
```

### Pattern 3: Responsive PDF Viewer (Dialog on Desktop, Drawer on Mobile)
**What:** Use shadcn Dialog for desktop viewport, Drawer for mobile. Same PDF content, different container.
**When:** Viewing papers or resume.
**Why:** Desktop users expect centered modals. Mobile users need bottom-sheet drawers that don't fight with scroll. shadcn provides both primitives.

```typescript
// components/shared/PdfViewer.tsx
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Drawer, DrawerContent } from '@/components/ui/drawer'
import { Document, Page } from 'react-pdf'

export function PdfViewer({ src, open, onOpenChange }) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const Wrapper = isDesktop ? Dialog : Drawer
  const Content = isDesktop ? DialogContent : DrawerContent

  return (
    <Wrapper open={open} onOpenChange={onOpenChange}>
      <Content className="max-w-4xl max-h-[90vh] overflow-auto">
        <Document file={src}>
          <Page pageNumber={1} />
        </Document>
      </Content>
    </Wrapper>
  )
}
```

### Pattern 4: Section Wrapper with Scroll Anchor
**What:** Every major section uses a shared wrapper that provides consistent spacing, an `id` for anchor scrolling, and optional entry animation.
**When:** Every section of the portfolio.
**Why:** Consistent vertical rhythm. Lenis scrolls to `#section-id`. Single place to adjust section padding.

```typescript
// components/shared/Section.tsx
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

interface SectionProps {
  id: string
  children: React.ReactNode
  className?: string
}

export function Section({ id, children, className }: SectionProps) {
  return (
    <motion.section
      id={id}
      className={cn('px-6 py-24 md:py-32 max-w-6xl mx-auto', className)}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.section>
  )
}
```

### Pattern 5: Lenis at the Root with Scroll Offset
**What:** Wrap the entire app in `<ReactLenis>` at the root level. Configure scroll offset to account for fixed nav height.
**When:** App initialization.
**Why:** Lenis must own the entire scroll context. Partial Lenis wrapping causes inconsistent scroll behavior.

```typescript
// App.tsx
import { ReactLenis } from 'lenis/react'

function App() {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
      <Navigation />
      <main>
        <Hero />
        <Skills />
        <Projects />
        <Papers />
        <LabTooling />
        <Coursework />
        <Timeline />
        <Contact />
      </main>
      <Footer />
    </ReactLenis>
  )
}
```

## Anti-Patterns to Avoid

### Anti-Pattern 1: Global State for Local Interactions
**What:** Using Redux/Zustand/Context for PDF viewer open state or project expansion.
**Why bad:** Massive overengineering. Adds dependencies, boilerplate, and debugging surface for state that only matters to one component.
**Instead:** `useState` in the parent component or a custom hook. This portfolio has zero shared mutable state that warrants a state manager.

### Anti-Pattern 2: Animating Everything
**What:** Adding Motion animations to every text element, icon, and border.
**Why bad:** Creates visual noise that contradicts the minimalist philosophy. Hurts performance on mobile. Makes the site feel "bouncy" rather than "weighted."
**Instead:** Animate section entries (fade in from below), project card expansion (layout animation), and hover states on interactive elements only. Typography, borders, and backgrounds should be static.

### Anti-Pattern 3: Hardcoded Content in JSX
**What:** Writing project descriptions, skill lists, and paper titles directly in component JSX.
**Why bad:** Violates the project constraint that content must be "swappable without code changes." Makes the site impossible for a non-developer to update.
**Instead:** All content in `data/*.ts` files with TypeScript interfaces. Components map over data arrays.

### Anti-Pattern 4: Heavy PDF Preloading
**What:** Loading all PDF files on initial page load.
**Why bad:** PDFs are large (500KB-5MB each). Loading 5+ PDFs on page load destroys Lighthouse score and mobile experience.
**Instead:** Lazy-load react-pdf component and only fetch the PDF when the viewer is opened. Use `React.lazy()` for the PdfViewer component itself.

### Anti-Pattern 5: Router for Single-Page Scroll
**What:** Adding React Router for a site with no actual page navigation.
**Why bad:** Adds bundle weight. Creates URL management complexity. Hash routing conflicts with smooth scroll anchors.
**Instead:** Lenis smooth scroll to `#section-id` anchors. The browser's native anchor behavior plus Lenis interpolation is all that's needed.

### Anti-Pattern 6: CSS-in-JS with Tailwind
**What:** Using styled-components, Emotion, or CSS modules alongside Tailwind CSS.
**Why bad:** Two styling paradigms fighting for the same territory. Adds runtime overhead. Contradicts Tailwind's zero-runtime utility-first philosophy.
**Instead:** Tailwind CSS v4 for all styling. Use the `cn()` utility for conditional classes. Use `@theme` directives for custom design tokens.

## Scalability Considerations

This is a personal portfolio, not a SaaS product. "Scale" here means content growth and maintainability.

| Concern | v1 (5 projects) | v2 (15+ projects) | Future |
|---------|-----------------|-------------------|--------|
| Content volume | Data files, all inline | Data files, possibly filter/category UI | Consider MDX or headless CMS |
| Build time | < 5s with Vite 8 | < 10s (still fine) | Still fine for static content |
| Bundle size | ~150-200KB gzipped | ~200-250KB (lazy-load new sections) | Code-split heavy components |
| PDF storage | `/public/pdfs/` folder | Same, but consider CDN if > 20 PDFs | External storage (S3/Cloudflare R2) |
| Animation complexity | Shared variants file | Same architecture | Consider animation timelines if needed |

## Sources

- [Motion layout animations](https://motion.dev/docs/react-scroll-animations) - layoutId, AnimatePresence patterns
- [Lenis React integration](https://github.com/darkroomengineering/lenis/blob/main/packages/react/README.md) - ReactLenis provider, useLenis hook
- [shadcn/ui responsive dialog pattern](https://www.nextjsshop.com/resources/blog/responsive-dialog-drawer-shadcn-ui) - Dialog on desktop, Drawer on mobile
- [react-pdf Vite worker config](https://github.com/wojtekmaj/react-pdf) - Worker must be configured in same module as Document component
- [Vite 8 static deployment](https://vite.dev/guide/static-deploy) - Vercel auto-detection
