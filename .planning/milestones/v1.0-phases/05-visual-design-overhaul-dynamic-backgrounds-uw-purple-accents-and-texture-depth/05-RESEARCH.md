# Phase 05: Visual Design Overhaul -- Research

**Researched:** 2026-03-23
**Domain:** Visual effects, CSS animations, canvas-based particle systems, SVG patterns, color system extension
**Confidence:** HIGH

## Summary

This phase transforms the portfolio from its current clean monochrome aesthetic into a visually dynamic experience using five distinct effect components: Aurora Background (CSS-only animated gradient), Particles (canvas-based floating dots with mouse magnetism), Noisy Gradient Backgrounds (canvas-based grain overlay), Card Spotlight (motion-tracked radial gradient reveal), and Animated Grid Pattern (SVG-based pattern with motion/react animations). All five components are available as copy-paste source code from 21st.dev/aceternity/magicui/easemize and require zero npm dependencies beyond what the project already has.

The project already uses `motion/react` (v12.38.0), which is the renamed successor to `framer-motion` with identical API. All 21st.dev components that import from `"framer-motion"` can be trivially updated to import from `"motion/react"` -- this is a drop-in replacement with no breaking changes. The project also has `cn()` utility and `@` path alias already configured, which are the only two dependencies these components need.

**Primary recommendation:** Copy each component's source into `src/components/effects/`, change `framer-motion` imports to `motion/react`, customize colors to UW purple palette, and wrap each section with its designated effect. Use `prefers-reduced-motion` checks to disable canvas animations and CSS keyframes for accessibility.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Extend cleanroom palette with UW Purple (#4b2e83) as primary accent color
- Add UW Metallic Gold (#85754d) as secondary accent (used sparingly -- links, highlights)
- Add soft purple tint for gradients and glows (lighter shade of UW purple)
- Keep cleanroom white (#FAFAF8) and ink (#1C1E26) as base colors -- purple is accent thread, not replacement
- Hero: Aurora Background (aceternity) + Particles overlay (magicui) with mouse magnetism (~60 qty, ~0.4 size, high staticity)
- WhoAmI: Noisy Gradient Background (easemize) with subtle purple-to-cleanroom gradient, noise ~0.3
- Skills/Tooling: Noisy Gradient Background with barely-there noise texture
- Project Cards: Card Spotlight (aceternity) with cursor-following radial gradient glow in soft UW purple
- Timeline: Animated Grid Pattern (magicui) as subtle background, ~0.15 opacity, UW purple fill
- Papers: No visual effect -- clean breathing room
- Contact/Footer: Subtle gradient to match hero section (low intensity)
- Effect intensity curve: bold hero -> textured middle -> calm footer
- No section has more than one background effect

### Claude's Discretion
- Exact opacity and blend values for each section's effect
- How to integrate 21st.dev components into existing Vite+React+Tailwind stack (copy-paste vs npm)
- Whether components need adaptation for existing motion/react setup (vs framer-motion)
- Performance optimization if multiple canvas elements cause jank
- Exact soft purple tint hex value (derived from UW Purple)
- Gradient direction and color stop positions for section backgrounds
- How Card Spotlight interacts with existing expand/collapse layout animations on project cards

### Deferred Ideas (OUT OF SCOPE)
- Dark mode toggle (portfolio is light-only for v1)
- Animated page transitions between sections
- 3D card tilt effects (could be v2 enhancement)
- Particle interaction with scroll position
- Custom cursor effects
</user_constraints>

## Standard Stack

### Core (already installed -- zero new dependencies)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| motion | 12.38.0 | Animation engine for Card Spotlight + Animated Grid Pattern | Already in project; `motion/react` is drop-in for `framer-motion` imports |
| react | 19.2.4 | Component framework | Already in project |
| tailwindcss | 4.2.2 | Styling with @theme custom properties | Already in project; Tailwind v4 CSS-first config used for aurora keyframes |
| clsx + tailwind-merge | latest | `cn()` utility for class merging | Already in project at `src/lib/utils.ts` |

### Supporting (zero new npm installs)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Canvas API | Browser native | Particles (mouse-interactive), Noisy Gradient noise layer | Hero particles, WhoAmI/Skills/Tooling grain textures |
| SVG + motion.rect | Browser native + motion | Animated Grid Pattern | Timeline background pattern |
| CSS @keyframes | Browser native | Aurora Background animation | Hero aurora effect |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Canvas-based Particles (magicui) | tsparticles library | tsparticles adds ~50KB+ dependency; magicui Particles is ~150 lines of self-contained canvas code with zero deps |
| Canvas-based Noisy Gradient (easemize) | SVG feTurbulence filter | SVG approach is lighter but less controllable; canvas approach allows animated grain refresh and precise alpha control |
| Copy-paste components | npx shadcn@latest add | shadcn registry may not have all 5 components; copy-paste gives full control and avoids version coupling |

**Installation:**
```bash
# No packages to install -- all dependencies already in project
# Components are copy-pasted into src/components/effects/
```

## Architecture Patterns

### Recommended Project Structure
```
src/
  components/
    effects/                    # NEW: Visual effect components
      AuroraBackground.tsx      # CSS-only aurora gradient (hero)
      Particles.tsx             # Canvas particles with mouse magnetism (hero)
      NoisyBackground.tsx       # Canvas noise/grain overlay (WhoAmI, Skills, Tooling)
      CardSpotlight.tsx         # Mouse-tracked spotlight (project cards)
      AnimatedGridPattern.tsx   # SVG grid with motion.rect (timeline)
    hero/
      Hero.tsx                  # Modified: wraps content with AuroraBackground + Particles
    sections/
      WhoAmI.tsx                # Modified: wraps with NoisyBackground
      Skills.tsx                # Modified: wraps with NoisyBackground
      Tooling.tsx               # Modified: wraps with NoisyBackground
      Timeline.tsx              # Modified: adds AnimatedGridPattern as background layer
      Contact.tsx               # Modified: adds subtle gradient background
    projects/
      ProjectCard.tsx           # Modified: wraps with CardSpotlight
      ProjectsSection.tsx       # Unchanged (LayoutGroup stays)
  styles/
    app.css                     # Modified: add UW color tokens + aurora keyframe
```

### Pattern 1: Effect Wrapper Component
**What:** Each visual effect is a standalone wrapper that takes `children` and renders the effect behind them.
**When to use:** Aurora Background, Noisy Background, Card Spotlight.
**Example:**
```typescript
// Verified pattern from magicui/aceternity source code
// Effect component wraps section content
<AuroraBackground className="min-h-[75vh]">
  <HeroContent />
  <ScrollIndicator />
</AuroraBackground>
```

### Pattern 2: Background Layer Component
**What:** Effect rendered as an absolutely-positioned layer behind existing content via `pointer-events-none`.
**When to use:** Particles overlay, Animated Grid Pattern.
**Example:**
```typescript
// From magicui Particles source -- aria-hidden + pointer-events-none
<section className="relative">
  <Particles
    className="absolute inset-0"
    quantity={60}
    color="#7c5eb5"
    staticity={80}
    size={0.4}
  />
  <div className="relative z-10">
    {/* Section content */}
  </div>
</section>
```

### Pattern 3: Card Spotlight Integration with LayoutGroup
**What:** Card Spotlight wraps individual project cards INSIDE the existing LayoutGroup.
**When to use:** Project cards with expand/collapse animations.
**Critical detail:** The Card Spotlight uses `useMotionValue` and `useMotionTemplate` for mouse tracking, which creates a radial-gradient CSS mask. This does NOT conflict with Motion's `layout` prop because the spotlight effect only manipulates a mask on an overlay div, not the card's position/size. The existing `motion.div` with `layout` prop stays as the outer wrapper; Card Spotlight becomes an inner visual layer.
**Example:**
```typescript
// CardSpotlight goes INSIDE the existing motion.div layout wrapper
<motion.div layout className={...} transition={...}>
  <CardSpotlightEffect radius={300} color="rgba(75, 46, 131, 0.15)">
    {/* Existing card content */}
  </CardSpotlightEffect>
</motion.div>
```

### Pattern 4: Reduced Motion Respect
**What:** All canvas/animation effects check `prefers-reduced-motion` and gracefully degrade.
**When to use:** Every effect component.
**Example:**
```typescript
// Hook for checking reduced motion preference
function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mql.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);
  return prefersReduced;
}

// In Particles component: skip animation loop entirely
const prefersReduced = usePrefersReducedMotion();
if (prefersReduced) return null; // or render static fallback
```

### Anti-Patterns to Avoid
- **Multiple requestAnimationFrame loops per section:** Each canvas component runs its own rAF loop. Having Particles + NoisyBackground both visible and animating in the same viewport is fine since the Particles are only in the hero and NoisyBackground is in separate sections below.
- **Animating filter:blur() on large elements:** The Aurora Background uses blur(80px) on its inner gradient div. This MUST be on a GPU-composited layer (will-change: filter or transform: translateZ(0)) to avoid CPU rendering. The aceternity implementation handles this via the absolute positioning which triggers compositing.
- **Card Spotlight on the LayoutGroup wrapper div:** Do NOT wrap the LayoutGroup itself with a spotlight. Apply spotlight to each individual card.
- **Using framer-motion import in new components:** Always import from `motion/react`, never `framer-motion`. The project uses the `motion` package (v12).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Particle system with mouse interaction | Custom canvas particle engine | magicui Particles component (copy-paste) | Edge recycling, DPR scaling, magnetism formula already solved in ~200 lines |
| Aurora gradient animation | Custom CSS gradient animation | Aceternity Aurora Background (copy-paste) | Repeating-linear-gradient + background-position animation is tricky to get smooth; 60s infinite loop timing tested |
| SVG animated grid | Custom SVG pattern with animations | magicui AnimatedGridPattern (copy-paste) | ResizeObserver + random repositioning + motion.rect opacity cycle already implemented |
| Mouse-tracked spotlight | Custom onMouseMove radial gradient | Aceternity Card Spotlight pattern (copy-paste) | useMotionValue + useMotionTemplate avoids React re-renders for 60fps tracking |
| oklch color conversion | Manual hex-to-oklch math | Pre-computed values (see Color Palette below) | Color science is error-prone; values verified with computation |

**Key insight:** All five components are self-contained copy-paste code (100-250 lines each) with zero external dependencies. The effort is in ADAPTATION (colors, opacity, sizing) not in building from scratch.

## Common Pitfalls

### Pitfall 1: framer-motion vs motion/react Import Mismatch
**What goes wrong:** Components copied from 21st.dev import from `"framer-motion"` but project uses `"motion/react"`.
**Why it happens:** 21st.dev component source code was written before the rename.
**How to avoid:** Search-and-replace `from "framer-motion"` with `from "motion/react"` in every copied file. The API is identical -- `motion`, `useMotionValue`, `useMotionTemplate`, `MotionValue` all work.
**Warning signs:** TypeScript error "Cannot find module 'framer-motion'".

### Pitfall 2: Aurora Background blur() Performance on Firefox
**What goes wrong:** CSS `filter: blur(80px)` on a large element causes frame drops in Firefox.
**Why it happens:** Firefox renders blur in software unless WebRender is enabled. Large blur radii are expensive.
**How to avoid:** Add `will-change: filter` or `transform: translateZ(0)` to force GPU compositing. Keep blur radius reasonable (40-80px). The absolute-positioned inner div in the aceternity implementation naturally creates a compositing layer.
**Warning signs:** Laggy scroll in Firefox specifically. Test with Firefox DevTools performance panel.

### Pitfall 3: Canvas Not Cleaning Up requestAnimationFrame
**What goes wrong:** Memory leak when navigating away or component unmounts without canceling rAF.
**Why it happens:** The Particles component stores `rafID` in a ref and cancels it on unmount. If you modify the component, ensure the cleanup runs.
**How to avoid:** Always call `cancelAnimationFrame(rafID.current)` in the useEffect cleanup. The magicui source code already handles this correctly with `rafID` ref.
**Warning signs:** Increasing memory usage, console warnings about state updates on unmounted components.

### Pitfall 4: Card Spotlight Conflicting with Layout Animations
**What goes wrong:** Adding spotlight wrapper breaks the expand/collapse bento grid animation.
**Why it happens:** If CardSpotlight adds its own positioning/sizing, it can interfere with Motion's layout calculations.
**How to avoid:** CardSpotlight must be an INNER wrapper (inside the `motion.div` with `layout` prop), not an outer wrapper. The spotlight effect only applies a CSS mask on an overlay div -- it does not affect the card's box model. The existing `motion.div` with `layout` and `whileHover` stays as the outer element.
**Warning signs:** Cards jump or flash during expand/collapse. Test by expanding a card and observing smooth transitions.

### Pitfall 5: Tailwind v4 Custom Keyframes Not Emitting
**What goes wrong:** `animate-aurora` class does nothing.
**Why it happens:** In Tailwind v4, custom keyframes must be defined inside `@theme` block to generate utilities. If defined outside, the `animate-aurora` utility class won't exist.
**How to avoid:** Define the aurora keyframe inside `@theme` block in `app.css`:
```css
@theme {
  --animate-aurora: aurora 60s linear infinite;
  @keyframes aurora {
    from { background-position: 50% 50%, 50% 50%; }
    to { background-position: 350% 50%, 350% 50%; }
  }
}
```
**Warning signs:** Class applied but no animation visible.

### Pitfall 6: Noisy Background Canvas Flicker on Resize
**What goes wrong:** Canvas-based noise flickers or goes blank when browser window is resized.
**Why it happens:** Canvas dimensions change but redraw is not debounced.
**How to avoid:** The easemize implementation uses resize observer. Add a 200ms debounce to the resize handler (magicui Particles already does this).
**Warning signs:** Visual flash when resizing browser.

## Code Examples

### UW Purple Color Palette Extension (oklch)

Computed from hex values, verified by algorithm:

```css
/* Add to @theme block in src/styles/app.css */
@theme {
  /* UW Purple accent scale */
  --color-uw-purple: oklch(0.385 0.136 295);
  --color-uw-purple-soft: oklch(0.55 0.133 298);
  --color-uw-purple-light: oklch(0.75 0.083 304);
  --color-uw-purple-faint: oklch(0.917 0.029 306);

  /* UW Gold */
  --color-uw-gold: oklch(0.567 0.060 89);

  /* Aurora keyframe animation */
  --animate-aurora: aurora 60s linear infinite;
  @keyframes aurora {
    from { background-position: 50% 50%, 50% 50%; }
    to { background-position: 350% 50%, 350% 50%; }
  }
}
```

**Color mapping reference:**
| Token | oklch | Hex (approx) | Usage |
|-------|-------|--------------|-------|
| `uw-purple` | oklch(0.385 0.136 295) | #4b2e83 | Primary accent, timeline nodes, links |
| `uw-purple-soft` | oklch(0.55 0.133 298) | #7c5eb5 | Particle color, spotlight glow, gradient midpoints |
| `uw-purple-light` | oklch(0.75 0.083 304) | #b8a0d8 | Subtle gradient tints, hover states |
| `uw-purple-faint` | oklch(0.917 0.029 306) | #e8dff3 | Near-white tint for section backgrounds |
| `uw-gold` | oklch(0.567 0.060 89) | #85754d | Secondary accent, select links/highlights |

### Aurora Background Adaptation (Hero)

```typescript
// src/components/effects/AuroraBackground.tsx
// Adapted from aceternity aurora-background, imports changed to motion/react
"use client"; // remove if not using Next.js

import { cn } from "@/lib/utils";
import type { ReactNode, HTMLAttributes } from "react";

interface AuroraBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export function AuroraBackground({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden bg-cleanroom",
        className,
      )}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={cn(
            // Aurora gradient layers using UW purple tones
            `[--aurora:repeating-linear-gradient(100deg,var(--color-uw-purple-light)_10%,var(--color-uw-purple-soft)_15%,var(--color-uw-purple-faint)_20%,var(--color-uw-purple-light)_25%,var(--color-uw-purple-soft)_30%)]`,
            `[--white-gradient:repeating-linear-gradient(100deg,var(--color-cleanroom)_0%,var(--color-cleanroom)_7%,transparent_10%,transparent_12%,var(--color-cleanroom)_16%)]`,
            `[background-image:var(--white-gradient),var(--aurora)]`,
            `[background-size:300%,_200%]`,
            `animate-aurora`,
            `filter blur-[40px]`,
            `after:content-[''] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] after:[background-size:200%,_100%] after:animate-aurora after:mix-blend-difference`,
            `pointer-events-none absolute -inset-[10px] opacity-40`,
            showRadialGradient &&
              `[mask-image:radial-gradient(ellipse_at_50%_0%,black_25%,transparent_70%)]`,
          )}
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
```

### Particles Component Key Adaptations

```typescript
// Key changes from magicui source:
// 1. Remove "use client" directive (not Next.js)
// 2. Import cn from "@/lib/utils" (already exists)
// 3. Add prefers-reduced-motion check
// 4. Default color to UW purple soft: "#7c5eb5"
// 5. Default quantity to 60 (per CONTEXT.md locked decision)
// 6. Default staticity to 80 (high = ambient, not busy)

// Usage in Hero:
<section className="relative min-h-[75vh]">
  <AuroraBackground className="absolute inset-0" showRadialGradient>
    <div /> {/* Aurora is background-only in this usage */}
  </AuroraBackground>
  <Particles
    className="absolute inset-0 z-[1]"
    quantity={60}
    color="#7c5eb5"
    staticity={80}
    ease={60}
    size={0.4}
  />
  <div className="relative z-10">
    <HeroContent />
    <ScrollIndicator />
  </div>
</section>
```

### Card Spotlight Integration with ProjectCard

```typescript
// CardSpotlight goes INSIDE the motion.div, as an inner visual wrapper
// The outer motion.div keeps layout + whileHover
export function ProjectCard({ project, isExpanded, onToggle, onReadMore }: ProjectCardProps) {
  return (
    <motion.div
      layout
      className={cn(
        "rounded-xl bg-white shadow-lg overflow-hidden",
        isExpanded && "col-span-1 md:col-span-3",
      )}
      whileHover={{
        y: -2,
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
      }}
      transition={{ layout: layoutTransition, duration: 0.3, ease: easing.out }}
    >
      {/* Spotlight is an inner overlay, does not affect layout */}
      <CardSpotlight
        radius={300}
        color="rgba(75, 46, 131, 0.12)"
        className="h-full"
      >
        {/* ... existing card content ... */}
      </CardSpotlight>
    </motion.div>
  );
}
```

### Animated Grid Pattern Usage (Timeline)

```typescript
// Source: magicui GitHub repo (verified)
// AnimatedGridPattern uses motion.rect from motion/react (change import)
<section id="timeline" className="relative px-6 py-24 overflow-hidden">
  <AnimatedGridPattern
    width={40}
    height={40}
    numSquares={30}
    maxOpacity={0.15}
    duration={4}
    className="absolute inset-0 fill-uw-purple/15 stroke-uw-purple/15 [mask-image:radial-gradient(500px_circle_at_center,white,transparent)]"
  />
  <div className="relative z-10 mx-auto max-w-5xl">
    {/* existing timeline content */}
  </div>
</section>
```

### Noisy Gradient Background -- Simplified CSS/SVG Alternative

Given performance concerns with multiple canvas elements, a lighter SVG noise approach for WhoAmI/Skills/Tooling:

```typescript
// SVG noise filter -- zero canvas, zero JS, pure CSS
// Generates grain texture overlay via feTurbulence
export function NoisyBackground({
  children,
  className,
  gradientFrom = "var(--color-uw-purple-faint)",
  gradientTo = "var(--color-cleanroom)",
  noiseOpacity = 0.3,
}: {
  children: React.ReactNode;
  className?: string;
  gradientFrom?: string;
  gradientTo?: string;
  noiseOpacity?: number;
}) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, ${gradientFrom}, ${gradientTo})`,
        }}
      />
      {/* SVG noise overlay */}
      <svg className="absolute inset-0 h-full w-full pointer-events-none" aria-hidden="true">
        <filter id="noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect
          width="100%"
          height="100%"
          filter="url(#noise)"
          opacity={noiseOpacity}
        />
      </svg>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
```

**Recommendation for Claude's Discretion:** Use SVG feTurbulence for the noise texture on WhoAmI/Skills/Tooling sections instead of the full canvas-based easemize component. Rationale: (1) Zero JavaScript = zero rAF loops = no performance impact, (2) The noise does not need to animate (static grain is fine per CONTEXT.md "low noise intensity"), (3) Simpler code = fewer bugs. Reserve canvas for the hero Particles where mouse interactivity IS needed.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `import { motion } from "framer-motion"` | `import { motion } from "motion/react"` | Motion v11 (late 2024) | Drop-in rename, identical API, all 21st.dev components need this change |
| Tailwind v3 `tailwind.config.js` keyframes | Tailwind v4 `@theme { @keyframes }` in CSS | Tailwind v4 (2025) | Aurora keyframe must be in CSS @theme block, not JS config |
| `useMotionTemplate` from framer-motion | `useMotionTemplate` from motion/react | Motion v11 | Same API, used by Card Spotlight |
| tsparticles (heavy library) | Self-contained canvas particles (magicui) | Community shift 2024+ | Zero-dep, ~200 lines, copy-paste ownership |

**Deprecated/outdated:**
- framer-motion package name: Still works but `motion` package is the maintained successor. Project already uses `motion`.
- Tailwind v3 config-based custom animations: v4 uses CSS-first @theme blocks.

## Performance Analysis

### Effect Layer Budget

| Section | Effect Type | Rendering | CPU/GPU Impact | Concurrent Animations |
|---------|-------------|-----------|----------------|----------------------|
| Hero | Aurora (CSS) + Particles (Canvas rAF) | CSS animation + 1 canvas | MEDIUM -- blur compositing + 60 particles/frame | 2 effects but Aurora is pure CSS |
| WhoAmI | Noisy Background (SVG) | SVG filter, static | VERY LOW -- rendered once | 0 active animations |
| Skills | Noisy Background (SVG) | SVG filter, static | VERY LOW -- rendered once | 0 active animations |
| Tooling | Noisy Background (SVG) | SVG filter, static | VERY LOW -- rendered once | 0 active animations |
| Timeline | Animated Grid (SVG + motion.rect) | SVG with motion animations | LOW -- 30 rects fading in/out | motion.rect opacity tweens |
| Projects | Card Spotlight (motion) | CSS mask via useMotionValue | LOW -- only on hover, no rAF | mouse events -> motion value |
| Papers | None | -- | NONE | -- |
| Contact | CSS gradient | CSS only | NEGLIGIBLE | 0 active animations |

**Verdict:** Only ONE canvas-based rAF loop runs at any time (Particles in hero). As user scrolls past hero, the canvas continues but is off-screen (browser can throttle invisible canvases). All other effects are CSS/SVG (static) or motion-value-driven (on-demand). This is well within performance budget for 90+ Lighthouse score.

### Mitigation Strategies
1. **Particles quantity reduction on mobile:** Check `window.innerWidth < 768` and reduce to ~30 particles.
2. **prefers-reduced-motion:** Skip all canvas rAF loops and CSS animations entirely.
3. **will-change: filter** on Aurora blur div to ensure GPU compositing.
4. **SVG noise IDs must be unique** if multiple NoisyBackground instances exist on the same page (use `useId()` hook).

## Open Questions

1. **Aurora Background Exact CSS Class String**
   - What we know: The component uses repeating-linear-gradient with custom properties, blur filter, after pseudo-element with mix-blend-difference, and mask-image radial gradient. The animation is a 60s infinite linear background-position shift.
   - What's unclear: The exact aceternity Tailwind class string (documentation is dynamic-loaded). The code example above is a faithful reconstruction from multiple sources.
   - Recommendation: Test the reconstructed component visually. If the aurora effect doesn't look right, tweak gradient colors and blur radius empirically.

2. **Card Spotlight CanvasRevealEffect Subcomponent**
   - What we know: The aceternity Card Spotlight includes an optional CanvasRevealEffect with animated dots. The core spotlight (radial gradient mask) works without it.
   - What's unclear: Whether CanvasRevealEffect is needed for the intended visual effect.
   - Recommendation: Start with just the radial-gradient spotlight mask (simpler, lighter). Add CanvasRevealEffect only if the visual feels underwhelming.

3. **SVG Noise Filter ID Collision**
   - What we know: Multiple NoisyBackground instances on the same page each need a unique SVG filter ID.
   - What's unclear: Whether browsers handle duplicate filter IDs gracefully or silently fail.
   - Recommendation: Use React's `useId()` hook to generate unique filter IDs per instance.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.0 + jsdom |
| Config file | `vitest.config.ts` |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| VIS-01 | UW purple color tokens exist in CSS theme | unit | `npx vitest run src/styles/__tests__/colors.test.ts -t "uw-purple"` | No -- Wave 0 |
| VIS-02 | Aurora keyframe defined in @theme block | unit | `npx vitest run src/styles/__tests__/colors.test.ts -t "aurora"` | No -- Wave 0 |
| VIS-03 | All effect components export correctly | unit | `npx vitest run src/components/effects/__tests__/effects.test.ts` | No -- Wave 0 |
| VIS-04 | No framer-motion imports in codebase | unit | `npx vitest run src/tests/imports.test.ts -t "framer-motion"` | No -- Wave 0 |
| VIS-05 | prefers-reduced-motion disables canvas effects | manual-only | Manual browser test with OS accessibility setting | N/A |
| VIS-06 | Card Spotlight does not break layout animations | manual-only | Manual test: expand/collapse project card | N/A |
| VIS-07 | No spring animations in new motion configs | unit (extend existing) | `npx vitest run src/styles/__tests__/motion.test.ts -t "spring"` | Yes (extend) |

### Sampling Rate
- **Per task commit:** `npx vitest run --reporter=verbose`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/styles/__tests__/colors.test.ts` -- verify UW color tokens in CSS
- [ ] `src/components/effects/__tests__/effects.test.ts` -- verify effect components export
- [ ] `src/tests/imports.test.ts` -- verify no framer-motion imports remain

## Sources

### Primary (HIGH confidence)
- [magicui GitHub: animated-grid-pattern.tsx](https://github.com/magicuidesign/magicui/blob/main/apps/www/registry/magicui/animated-grid-pattern.tsx) -- Full SVG + motion.rect source code, verified
- [magicui GitHub: particles.tsx](https://github.com/magicuidesign/magicui/blob/main/apps/www/registry/magicui/particles.tsx) -- Full canvas particle source code, verified
- [Motion upgrade guide](https://motion.dev/docs/react-upgrade-guide) -- framer-motion to motion/react is drop-in replacement, no breaking changes in v12
- [Tailwind v4 animation docs](https://tailwindcss.com/docs/animation) -- @theme { @keyframes } for custom animations
- [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) -- Accessibility pattern

### Secondary (MEDIUM confidence)
- [Aceternity Aurora Background](https://ui.aceternity.com/components/aurora-background) -- Component structure verified from multiple sources; exact CSS class string reconstructed from docs + svelte port + inspira-ui references
- [CSS-Tricks: Grainy Gradients](https://css-tricks.com/grainy-gradients/) -- SVG feTurbulence noise technique as lightweight alternative to canvas noise
- [21st.dev: Noisy Gradient Backgrounds](https://21st.dev/community/components/easemize/noisy-gradient-backgrounds) -- Canvas-based noise component, API confirmed via WebFetch
- [Josh Comeau: prefers-reduced-motion](https://www.joshwcomeau.com/react/prefers-reduced-motion/) -- React hook pattern for reduced motion detection

### Tertiary (LOW confidence)
- Aurora Background blur performance on Firefox -- anecdotal reports of issues; recommended mitigation (will-change) is standard practice regardless

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all deps already installed, zero new packages needed
- Architecture: HIGH -- component source code verified from GitHub, integration pattern clear
- Color palette: HIGH -- oklch values computed algorithmically from hex, cross-verified
- Pitfalls: MEDIUM -- blur performance and layout animation interaction need empirical testing
- Noisy gradient approach: MEDIUM -- recommending SVG over canvas (Claude's discretion); either works

**Research date:** 2026-03-23
**Valid until:** 2026-04-23 (stable domain -- CSS/canvas APIs don't change rapidly)
