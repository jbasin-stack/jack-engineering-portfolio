# Phase 13: Animated Hero Gradient - Research

**Researched:** 2026-03-27
**Domain:** CSS animations, radial gradients, oklch color space, accessibility (prefers-reduced-motion)
**Confidence:** HIGH

## Summary

Phase 13 is a tightly-scoped CSS-only implementation phase. The hero section needs a breathing radial gradient overlay that pulses subtly behind the text content. The technical domain is well-understood: CSS `@keyframes` animating `opacity` on an absolutely-positioned div containing a `radial-gradient` background. No new dependencies are needed. The entire implementation touches exactly two files: `Hero.tsx` (add a gradient div) and `app.css` (add custom properties, keyframes, and reduced-motion rule).

The existing codebase provides clear patterns to follow. The AuroraBackground component demonstrates the `pointer-events-none absolute` overlay pattern. The `:root` and `.dark` blocks already define `--gradient-top`/`--gradient-bottom` custom properties -- the hero gradient tokens follow the exact same convention. The `@media (prefers-reduced-motion: reduce)` block already disables aurora animation, and the hero breathing animation gets added to that same block.

**Primary recommendation:** Implement as pure CSS with a single absolutely-positioned div inside Hero.tsx, CSS custom properties for theme-aware colors, a `@keyframes` breathing animation on `opacity`, and a reduced-motion media query fallback. Zero JavaScript, zero new dependencies.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Center-aligned elliptical radial gradient (wider than tall, matching hero landscape orientation)
- Large & soft spread covering ~70-80% of the hero area
- Single gradient layer (not multiple overlapping -- aurora was rejected for being too busy)
- Positioned as an absolutely-positioned div inside the hero section, above the body's page gradient
- Slow meditative breathing cycle: ~6-8 seconds per full breath
- Subtle opacity range: 0.3 to 0.5 (gradient always present, just shifting intensity)
- Smooth sine-wave easing (ease-in-out) for organic, natural feel
- Pure CSS @keyframes animation -- zero JS runtime cost, runs on compositor thread
- GPU-composited opacity animation (locked from v1.2 research -- not background-size)
- Accent-level blue tint at center (recognizable blue glow, not faint/invisible)
- Hint of UW purple (~hue 295-306) at gradient center for brand connection, fading to blue (hue 250) at edges
- Gradient fades to fully transparent at edges -- existing page gradient shows through naturally, no seams
- Separate layer above page gradient -- clean separation, no interaction between the two
- Same animation timing, size, shape, and easing in both modes -- only palette colors change
- CSS custom properties (--hero-gradient-center, --hero-gradient-edge) defined in both :root and .dark blocks
- Auto-switches with theme via CSS variable resolution -- zero JS needed
- UW purple hint retained in dark mode
- Static gradient fallback at middle opacity (~0.4) -- no animation for prefers-reduced-motion
- Pattern: @media (prefers-reduced-motion: reduce) disables the keyframe animation
- Consistent with existing aurora and AnimatedGridPattern reduced-motion patterns

### Claude's Discretion
- Exact oklch values for gradient center and edge stops (within the accent blue + purple hint direction)
- Exact ellipse aspect ratio and radial-gradient CSS syntax
- Keyframe animation name and precise timing values within the 6-8s range
- Whether to use will-change: opacity for GPU compositing hint
- Exact CSS custom property naming beyond --hero-gradient-center/--hero-gradient-edge

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| HERO-01 | Animated radial gradient background with breathing opacity animation behind hero content | Core implementation: absolutely-positioned div with radial-gradient background, @keyframes breathing animation on opacity property. Follows AuroraBackground overlay pattern. |
| HERO-02 | Gradient uses blue-primary palette colors and blends smoothly into the unified page background | CSS custom properties --hero-gradient-center (purple-tinted blue) and --hero-gradient-edge (blue, fading to transparent) in :root and .dark blocks. oklch hue 250-306 range. Transparent edges blend into body's linear-gradient. |
| HERO-03 | Gradient animation respects prefers-reduced-motion (static gradient fallback) | @media (prefers-reduced-motion: reduce) rule sets animation: none on the gradient div. Static opacity at ~0.4. Follows existing aurora pattern in app.css line 232-235. |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| CSS @keyframes | Native | Breathing animation | Zero-JS, compositor-thread, already used for aurora |
| CSS radial-gradient | Native | Elliptical gradient shape | Standard CSS function, no library needed |
| CSS custom properties | Native | Theme-aware color switching | Already established pattern in :root/.dark blocks |
| oklch() | Native | Color values | Project-wide color space standard (hue 250) |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Tailwind CSS | 4.2.2 | Utility classes for positioning | Already in project, used for pointer-events-none, absolute, inset-0 |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS @keyframes | Motion library animate | Adds JS runtime cost for no benefit; CSS opacity animation is already GPU-composited |
| Absolutely-positioned div | CSS ::before pseudo-element | Div is clearer, matches AuroraBackground pattern, easier to debug in DevTools |
| oklch() values | hex/hsl values | Would break project-wide color system consistency |

**Installation:**
```bash
# No installation needed -- zero new dependencies
```

## Architecture Patterns

### Recommended Project Structure
```
src/
  components/
    hero/
      Hero.tsx            # Add gradient div (modify existing)
  styles/
    app.css               # Add custom properties, keyframes, reduced-motion (modify existing)
    __tests__/
      hero-gradient.test.ts  # New test file for gradient CSS validation
```

### Pattern 1: Overlay Gradient Div
**What:** An absolutely-positioned div inside a `relative overflow-hidden` parent, rendered behind z-10 content
**When to use:** When you need a visual background effect that doesn't affect layout
**Example:**
```tsx
// Follows AuroraBackground pattern (src/components/effects/AuroraBackground.tsx)
<section id="hero" className="relative min-h-[75vh] overflow-hidden">
  {/* Hero gradient breathing layer */}
  <div
    className="hero-gradient pointer-events-none absolute inset-0"
    aria-hidden="true"
  />

  {/* Content above gradient */}
  <div className="relative z-10 flex min-h-[75vh] items-center justify-center px-6">
    <HeroContent />
  </div>
</section>
```

### Pattern 2: Theme-Aware CSS Custom Properties
**What:** Define color variables in both `:root` and `.dark` blocks, reference via `var()` in gradient
**When to use:** Any visual that needs to adapt to light/dark mode without JS
**Example:**
```css
/* Follows --gradient-top/--gradient-bottom pattern already in app.css */
:root {
  --hero-gradient-center: oklch(0.65 0.12 298);  /* purple-blue center */
  --hero-gradient-edge: oklch(0.55 0.15 250);     /* blue edge */
}

.dark {
  --hero-gradient-center: oklch(0.40 0.10 298);  /* darker purple-blue */
  --hero-gradient-edge: oklch(0.35 0.12 250);     /* darker blue edge */
}
```

### Pattern 3: Breathing Keyframes on Opacity
**What:** CSS @keyframes animating only `opacity` for GPU-composited performance
**When to use:** Subtle pulsing/breathing effects with no layout recalculation
**Example:**
```css
@keyframes hero-breathe {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.5; }
}

.hero-gradient {
  background: radial-gradient(ellipse at 50% 50%,
    var(--hero-gradient-center) 0%,
    var(--hero-gradient-edge) 40%,
    transparent 70%
  );
  animation: hero-breathe 7s ease-in-out infinite;
}
```

### Pattern 4: Reduced-Motion Fallback
**What:** Disable animation in `@media (prefers-reduced-motion: reduce)`, keep static visual
**When to use:** Any CSS animation that could cause discomfort
**Example:**
```css
/* Follows existing pattern at app.css line 232-235 */
@media (prefers-reduced-motion: reduce) {
  .animate-aurora {
    animation: none;
  }
  .hero-gradient {
    animation: none;
    opacity: 0.4;  /* Static middle value */
  }
}
```

### Anti-Patterns to Avoid
- **Animating background-size or background-position for "breathing":** These trigger paint/layout, not composited. The v1.2 research explicitly locked opacity-only animation for GPU compositing.
- **Multiple overlapping gradient layers:** Aurora was rejected for being "too distracting." Keep it to a single radial-gradient on one div.
- **Using Motion/Framer for this animation:** Adds unnecessary JS runtime. Pure CSS @keyframes with `animation: ... ease-in-out infinite` is simpler and more performant.
- **Hardcoding colors instead of CSS custom properties:** Would break theme switching. Must use `var()` references.
- **Using background-color instead of background (radial-gradient):** `background-color` cannot hold a gradient value. Must use `background` or `background-image`.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Theme-aware colors | Manual JS theme detection + inline styles | CSS custom properties in :root/.dark | Already established pattern, zero JS, instant switching |
| Breathing animation | JS requestAnimationFrame loop | CSS @keyframes with ease-in-out | Runs on compositor thread, zero main-thread cost |
| Reduced-motion detection | JS matchMedia check + useState | CSS @media (prefers-reduced-motion) | Pure CSS, no hydration delay, instant effect |
| GPU compositing | Custom transform hacks | opacity animation + optional will-change | Browser auto-promotes opacity animations to compositor |

**Key insight:** This entire phase is CSS-only by design. The user explicitly locked "zero JS runtime cost" for the animation. Every technique needed is a standard CSS feature. The only TSX change is adding a single `<div>` element.

## Common Pitfalls

### Pitfall 1: Gradient Not Visible Against Page Background
**What goes wrong:** The radial-gradient colors are too similar to the page background gradient, making the hero gradient invisible or barely perceptible.
**Why it happens:** Both the page background and hero gradient are in the blue oklch palette. If chroma/lightness values are too close, there's no contrast.
**How to avoid:** Use accent-level chroma (0.10-0.15) for the hero gradient center, significantly higher than the page background's low chroma (0.008-0.025). Include the purple hue shift (295-306) at center for visual differentiation.
**Warning signs:** Gradient invisible in either light or dark mode when viewed on a real screen (not just code review).

### Pitfall 2: Animation Looks Like a "Pulsing Beacon" Instead of Breathing
**What goes wrong:** The opacity transition is too fast or the range is too wide, creating an alarming pulse instead of a calm ambient effect.
**Why it happens:** Using linear easing, too-short duration, or too-wide opacity range (e.g., 0.1 to 0.8).
**How to avoid:** Use ease-in-out easing (sine-wave feel), 7s duration (middle of 6-8s range), and narrow opacity range (0.3-0.5). The gradient should always be visible, just shifting intensity.
**Warning signs:** Animation draws attention to itself rather than feeling ambient.

### Pitfall 3: Hard Seam Between Hero Gradient and Page Background
**What goes wrong:** A visible ring or edge where the radial gradient ends and the body's linear-gradient begins.
**Why it happens:** Gradient stops don't fade to fully transparent, or the gradient div has a visible boundary.
**How to avoid:** Ensure the outermost gradient stop is `transparent` at ~70% spread. The div uses `inset-0` to cover the full hero section. The gradient naturally fades out before reaching edges.
**Warning signs:** Visible circle outline or color discontinuity at hero section edges.

### Pitfall 4: Dark Mode Colors Too Dim or Too Bright
**What goes wrong:** Gradient that looks great in light mode is invisible in dark mode (too dim) or washes out content (too bright).
**Why it happens:** Using the same oklch lightness values for both modes.
**How to avoid:** Define separate custom property values in `:root` and `.dark`. Dark mode gradient center should have lower lightness but similar or slightly higher chroma for visibility against the dark background.
**Warning signs:** Gradient only noticeable in one mode.

### Pitfall 5: will-change: opacity Causing Memory Issues
**What goes wrong:** Using `will-change` promotes the element to its own compositor layer permanently, consuming GPU memory.
**Why it happens:** Blanket application of `will-change` without understanding the cost.
**How to avoid:** Modern browsers auto-promote elements with `animation` on `opacity`. `will-change: opacity` is optional -- the animation will be GPU-composited regardless. If used, it's fine for a single element, but be aware of the tradeoff. The AuroraBackground uses `will-change-[filter]` as precedent.
**Warning signs:** None for a single element -- this is a minor consideration.

### Pitfall 6: Theme Transition Flash on Gradient
**What goes wrong:** When switching between light and dark mode, the gradient color snaps instantly instead of transitioning smoothly.
**Why it happens:** The existing 300ms transition rule applies to `background-color` but not `background` (gradient shorthand).
**How to avoid:** CSS gradients with custom property values transition automatically when the custom properties change -- but only if the gradient structure (number of stops, positions) remains identical between modes. Since only the color values change (via custom properties), the gradient will interpolate smoothly with the existing 300ms transition on background-color. However, `radial-gradient()` values in the `background` shorthand may not transition. If needed, set `transition: opacity 300ms ease` on the gradient div itself so the theme transition is handled by the overall page transition mechanism.
**Warning signs:** Hard color snap on theme toggle.

## Code Examples

Verified patterns from the existing codebase:

### Existing Overlay Pattern (AuroraBackground)
```tsx
// Source: src/components/effects/AuroraBackground.tsx lines 25-44
<div className="absolute inset-0 overflow-hidden">
  <div
    className={cn(
      `pointer-events-none absolute -inset-[10px] opacity-40`,
      // ... gradient classes
    )}
  />
</div>
```

### Existing Custom Property Pattern (app.css)
```css
/* Source: src/styles/app.css lines 135-138 and 191-193 */
:root {
  --gradient-top: var(--color-cleanroom);
  --gradient-bottom: var(--color-silicon-50);
}
.dark {
  --gradient-top: oklch(0.16 0.025 250);
  --gradient-bottom: oklch(0.12 0.020 250);
}
```

### Existing Reduced-Motion Pattern (app.css)
```css
/* Source: src/styles/app.css lines 232-236 */
@media (prefers-reduced-motion: reduce) {
  .animate-aurora {
    animation: none;
  }
}
```

### Existing Hero Structure (Hero.tsx)
```tsx
// Source: src/components/hero/Hero.tsx
<section id="hero" className="relative min-h-[75vh] overflow-hidden">
  {/* TODO: Add hero background effect (user to decide) */}
  <div className="relative z-10 flex min-h-[75vh] items-center justify-center px-6">
    <HeroContent />
  </div>
</section>
```

### Recommended Implementation
```css
/* app.css -- add to :root block */
--hero-gradient-center: oklch(0.65 0.12 298);
--hero-gradient-edge: oklch(0.55 0.15 250);

/* app.css -- add to .dark block */
--hero-gradient-center: oklch(0.35 0.10 298);
--hero-gradient-edge: oklch(0.30 0.12 250);

/* app.css -- add keyframes (near existing aurora keyframes) */
@keyframes hero-breathe {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.5; }
}

/* app.css -- add class (in @layer base or as standalone rule) */
.hero-gradient {
  background: radial-gradient(
    ellipse at 50% 50%,
    var(--hero-gradient-center) 0%,
    var(--hero-gradient-edge) 35%,
    transparent 70%
  );
  animation: hero-breathe 7s ease-in-out infinite;
}

/* app.css -- add to existing @media (prefers-reduced-motion) block */
.hero-gradient {
  animation: none;
  opacity: 0.4;
}
```

```tsx
// Hero.tsx -- replace TODO comment
<section id="hero" className="relative min-h-[75vh] overflow-hidden">
  <div className="hero-gradient pointer-events-none absolute inset-0" aria-hidden="true" />
  <div className="relative z-10 flex min-h-[75vh] items-center justify-center px-6">
    <HeroContent />
    ...
  </div>
</section>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| JS-driven animation loops | CSS @keyframes with compositor promotion | Stable since 2015+ | Zero main-thread cost for opacity animations |
| hsl()/rgb() color spaces | oklch() perceptually uniform space | CSS Color Level 4 (2023+) | Better color interpolation, project standard |
| -webkit-prefixed animations | Unprefixed @keyframes | Stable since 2015+ | No vendor prefixes needed |
| JS-based reduced-motion checks | CSS @media (prefers-reduced-motion) | Supported in all modern browsers | Instant, no hydration delay |

**Deprecated/outdated:**
- `-webkit-animation` prefix: Not needed, all target browsers support unprefixed
- `transform: scale()` for breathing effects: `opacity` is simpler and more appropriate for this use case

## Open Questions

1. **Exact oklch lightness/chroma values for dark mode gradient**
   - What we know: Dark mode background is oklch(0.16 0.025 250), gradient needs to be visible against it
   - What's unclear: Exact lightness/chroma combination that reads well on dark backgrounds while feeling subtle
   - Recommendation: Start with lightness ~0.30-0.40 and chroma ~0.10-0.12, tune visually in browser DevTools

2. **Whether radial-gradient custom properties transition smoothly on theme switch**
   - What we know: CSS transitions apply to `background-color` but `background` (gradient shorthand) may not interpolate between gradient values even when only custom properties change
   - What's unclear: Whether the existing 300ms transition handles this correctly or if the gradient will snap
   - Recommendation: Test in browser. If snapping occurs, the overall page transition (body opacity + background) may mask it sufficiently. Alternatively, the gradient div's opacity is animated anyway, so a brief snap during theme transition is unlikely to be noticeable.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | vitest 4.1.0 |
| Config file | vitest.config.ts |
| Quick run command | `npx vitest run src/styles/__tests__/hero-gradient.test.ts` |
| Full suite command | `npx vitest run` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| HERO-01 | Breathing gradient animation exists in CSS | unit (CSS file parse) | `npx vitest run src/styles/__tests__/hero-gradient.test.ts -t "breathing"` | No -- Wave 0 |
| HERO-01 | Hero.tsx renders gradient div | unit (component export) | `npx vitest run src/styles/__tests__/hero-gradient.test.ts -t "gradient div"` | No -- Wave 0 |
| HERO-02 | Custom properties defined in :root and .dark | unit (CSS file parse) | `npx vitest run src/styles/__tests__/hero-gradient.test.ts -t "custom properties"` | No -- Wave 0 |
| HERO-02 | Gradient uses oklch values with correct hue range | unit (CSS file parse) | `npx vitest run src/styles/__tests__/hero-gradient.test.ts -t "oklch"` | No -- Wave 0 |
| HERO-03 | Reduced-motion rule disables hero animation | unit (CSS file parse) | `npx vitest run src/styles/__tests__/hero-gradient.test.ts -t "reduced-motion"` | No -- Wave 0 |
| HERO-03 | Reduced-motion sets static opacity | unit (CSS file parse) | `npx vitest run src/styles/__tests__/hero-gradient.test.ts -t "static opacity"` | No -- Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run src/styles/__tests__/hero-gradient.test.ts`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/styles/__tests__/hero-gradient.test.ts` -- covers HERO-01, HERO-02, HERO-03 (CSS file parsing tests following existing colors.test.ts and theme.test.ts patterns)

*(Test pattern: read app.css and Hero.tsx with `readFileSync`, assert presence of keyframes, custom properties, reduced-motion rules, and gradient div -- exactly like the existing colors.test.ts and theme.test.ts approach)*

## Sources

### Primary (HIGH confidence)
- Existing codebase: `src/styles/app.css` -- current CSS structure, custom properties, reduced-motion patterns
- Existing codebase: `src/components/hero/Hero.tsx` -- current hero structure with TODO placeholder
- Existing codebase: `src/components/effects/AuroraBackground.tsx` -- overlay div pattern
- Existing codebase: `src/styles/__tests__/colors.test.ts` and `theme.test.ts` -- test patterns for CSS validation

### Secondary (MEDIUM confidence)
- CSS Animations Level 1 spec -- `@keyframes`, `animation` shorthand (well-established, stable)
- CSS Images Level 3 spec -- `radial-gradient()` (well-established, stable)
- CSS Color Level 4 -- `oklch()` (project already uses this, confirmed working)

### Tertiary (LOW confidence)
- Gradient transition behavior on theme switch -- needs in-browser validation (see Open Questions #2)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- pure CSS, all features are stable and already used in the project
- Architecture: HIGH -- follows exact existing patterns (AuroraBackground overlay, custom properties, reduced-motion block)
- Pitfalls: HIGH -- well-understood domain, primary risks are aesthetic (color tuning) not technical
- Test strategy: HIGH -- follows existing test patterns exactly (readFileSync + string assertions)

**Research date:** 2026-03-27
**Valid until:** 2026-06-27 (stable CSS features, no churn expected)
