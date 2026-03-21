# Technology Stack

**Project:** Jack Basinski Engineering Portfolio
**Researched:** 2026-03-20

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| React | 19.2.x | UI library | Stable, mature, dominant ecosystem for component-driven SPAs. React 19 brings performance improvements and is well-supported by every tool in this stack. | HIGH |
| Vite | 8.0.x | Build tool + dev server | Vite 8 ships Rolldown (Rust-based bundler) for 10-30x faster builds. Auto-detects React projects. First-class Vercel deployment support. The `@vitejs/plugin-react` v6 uses Oxc instead of Babel, yielding smaller installs and faster transforms. | HIGH |
| TypeScript | 5.9.x | Type safety | Strict mode catches bugs at compile time. Every library in this stack ships types. TS 6.0 RC exists but 5.9 is the latest stable release line -- use it. | HIGH |
| Tailwind CSS | 4.2.x | Utility-first CSS | v4 runs on a Rust-based Oxide engine (5x faster full builds, 100x faster incremental). CSS-first config via `@theme` directives -- no `tailwind.config.js` needed. One-line setup: `@import "tailwindcss"`. Native support for glassmorphism via `backdrop-blur-*` and `bg-white/30` opacity utilities. | HIGH |

### Animation & Scroll

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Motion (formerly Framer Motion) | 12.x | Animation library | The library is now called "Motion" and imports from `motion/react` (not `framer-motion`). 30M+ monthly npm downloads. Hybrid engine: JS flexibility + native browser APIs for 120fps GPU-accelerated animations. Built-in springs, layout transitions, gestures, `whileInView`, `useScroll`, `useInView`. Scroll-linked animations default to native `ScrollTimeline` for zero-JS overhead when possible. | HIGH |
| Lenis | 1.3.x | Smooth scroll | The leading smooth scroll library. Lightweight, performant, accessible. Normalizes scroll input across browsers/devices while keeping native APIs intact. React integration via `lenis/react` package with `<ReactLenis>` wrapper and `useLenis` hook. Delivers the weighted, premium scroll feel specified in project requirements. | HIGH |

### UI Components

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| shadcn/ui | CLI v4 | Component primitives | Not a dependency -- copies components into your project. CLI v4 (March 2026) supports Tailwind v4, Base UI or Radix UI primitives, and MCP integration. Provides Dialog, Drawer, Sheet, and other primitives needed for PDF viewer overlay and navigation. Zero runtime cost for unused components. | HIGH |
| Lucide React | 0.577.x | Icons | Tree-shakeable SVG icons. The default icon library for shadcn/ui. Each import is a single inline SVG. 10,800+ dependent projects. | HIGH |

### PDF Viewing

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| react-pdf | 10.4.x | In-browser PDF rendering | Built on Mozilla's PDF.js. Provides `<Document>` and `<Page>` components for rendering PDFs inline. Read-only viewer is exactly what this portfolio needs (papers + resume). No paid alternatives needed. | HIGH |
| vite-plugin-static-copy | latest | Build asset copying | Required to copy PDF.js worker and cMap files to the build output directory. Without this, react-pdf breaks in production builds with Vite. | MEDIUM |

### Utilities

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| clsx | 2.x | Conditional class names | Tiny utility for conditionally joining class strings. Used in the `cn()` helper function that shadcn/ui components expect. | HIGH |
| tailwind-merge | 2.x | Tailwind class deduplication | Intelligently resolves conflicting Tailwind classes (e.g., `p-4` vs `p-2`). Combined with clsx in the standard `cn()` utility. | HIGH |
| class-variance-authority | 0.7.x | Component variants | Type-safe variant management for component props (e.g., button sizes, card styles). Used by shadcn/ui internally. | HIGH |

### Deployment

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Vercel | Free tier | Hosting + CDN | Auto-detects Vite projects. Zero-config deployment from Git push. Automatic HTTPS, global CDN, preview URLs per commit. Free tier is more than sufficient for a portfolio site. | HIGH |

## What NOT to Use

| Technology | Why Not | Use Instead |
|------------|---------|-------------|
| Next.js | Overkill for a single-page portfolio. Adds server complexity, larger bundle, slower dev startup. No SSR/ISR needed -- this is a static SPA. Vite 8's Rolldown bundler is faster for this use case. | Vite 8 + React |
| `framer-motion` (npm package) | Deprecated package name. Framer Motion has been renamed to Motion. The `framer-motion` npm still works but receives no new features. | `motion` (import from `motion/react`) |
| `@studio-freight/lenis` | Deprecated package scope. Darkroom Engineering renamed the package. | `lenis` (with `lenis/react` for React integration) |
| Gatsby | Over-engineered SSG framework. Slow builds, heavy plugin ecosystem, declining community. | Vite 8 SPA |
| Astro | Good for content-heavy sites, but this project needs rich client-side interactivity (scroll animations, PDF viewer, expandable cards). Astro's island architecture adds friction for full-page animation orchestration. | Vite 8 SPA with Motion |
| React Router | Unnecessary for a single-page scroll site. Adds bundle weight and complexity for zero benefit. Smooth scroll with anchor navigation is simpler and more aligned with the UX. | Lenis scroll-to-anchor |
| Animate.css / GSAP | Animate.css is too basic (no spring physics, no layout animations). GSAP is powerful but adds licensing concerns and doesn't integrate as cleanly with React's component model as Motion does. | Motion |
| Material UI / Chakra UI / Ant Design | Opinionated design systems that fight against the minimal, custom aesthetic this project demands. Heavy bundle sizes. Glassmorphism requires fighting their defaults. | shadcn/ui (unstyled primitives you own) |
| `react-pdf-viewer` | Heavier alternative with its own UI chrome. react-pdf gives raw rendering primitives so you can build a viewer that matches the portfolio's minimal design language. | `react-pdf` |
| Styled Components / Emotion | CSS-in-JS adds runtime overhead and conflicts with Tailwind's utility-first approach. | Tailwind CSS v4 |

## Installation

```bash
# Initialize project
npm create vite@latest jack-portfolio -- --template react-ts
cd jack-portfolio

# Core UI
npm install react react-dom
npm install -D typescript @vitejs/plugin-react

# Tailwind CSS v4 (CSS-first setup, no config file needed)
npm install tailwindcss @tailwindcss/vite

# Animation & Scroll
npm install motion lenis

# UI Components (shadcn CLI adds components on demand)
npx shadcn@latest init

# PDF Viewing
npm install react-pdf
npm install -D vite-plugin-static-copy

# Utilities (shadcn init installs these, but listed for clarity)
npm install clsx tailwind-merge class-variance-authority

# Icons
npm install lucide-react
```

## Key Configuration Notes

### Vite 8 + Tailwind v4
Tailwind v4 uses a Vite plugin instead of PostCSS. In `vite.config.ts`:
```typescript
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default {
  plugins: [react(), tailwindcss()]
}
```

In your main CSS file, just:
```css
@import "tailwindcss";
```

### Motion (not Framer Motion)
Import from the new package path:
```typescript
import { motion, AnimatePresence, useScroll, useInView } from 'motion/react'
```

### Lenis React Integration
Use the unified `lenis` package:
```typescript
import { ReactLenis, useLenis } from 'lenis/react'
```

### react-pdf Worker Configuration
The worker MUST be configured in the same file as the `<Document>` component (not in a separate entry file):
```typescript
import { pdfjs } from 'react-pdf'
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()
```

### Glassmorphism with Tailwind v4
Native utility classes, no custom config needed:
```html
<nav class="bg-white/30 backdrop-blur-lg border border-white/20 rounded-2xl">
```

## Sources

- [Vite 8 announcement](https://vite.dev/blog/announcing-vite8) - Rolldown bundler, @vitejs/plugin-react v6
- [Motion official docs](https://motion.dev/) - Renamed from Framer Motion, import from motion/react
- [Lenis npm](https://www.npmjs.com/package/lenis) - v1.3.19, unified package replacing @studio-freight/lenis
- [shadcn/ui CLI v4 changelog](https://ui.shadcn.com/docs/changelog/2026-03-cli-v4) - March 2026 release
- [Tailwind CSS v4 announcement](https://tailwindcss.com/blog/tailwindcss-v4) - Oxide engine, CSS-first config
- [react-pdf npm](https://www.npmjs.com/package/react-pdf) - v10.4.x, PDF.js based
- [React 19.2 blog post](https://react.dev/blog/2025/10/01/react-19-2) - Stable release line
- [TypeScript 5.9 docs](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-9.html)
- [Vercel Vite deployment docs](https://vercel.com/docs/frameworks/frontend/vite)
