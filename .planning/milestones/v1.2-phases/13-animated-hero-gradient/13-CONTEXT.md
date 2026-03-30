# Phase 13: Animated Hero Gradient - Context

**Gathered:** 2026-03-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Animated radial gradient background behind the hero section text content, using the blue-primary palette with a hint of UW purple. Breathing opacity animation with prefers-reduced-motion fallback. Must blend seamlessly into the unified page gradient established in Phase 12.

</domain>

<decisions>
## Implementation Decisions

### Gradient shape & position
- Center-aligned elliptical radial gradient (wider than tall, matching hero landscape orientation)
- Large & soft spread covering ~70-80% of the hero area
- Single gradient layer (not multiple overlapping — aurora was rejected for being too busy)
- Positioned as an absolutely-positioned div inside the hero section, above the body's page gradient

### Breathing animation
- Slow meditative breathing cycle: ~6-8 seconds per full breath
- Subtle opacity range: 0.3 to 0.5 (gradient always present, just shifting intensity)
- Smooth sine-wave easing (ease-in-out) for organic, natural feel
- Pure CSS @keyframes animation — zero JS runtime cost, runs on compositor thread
- GPU-composited opacity animation (locked from v1.2 research — not background-size)

### Color stops & blending
- Accent-level blue tint at center (recognizable blue glow, not faint/invisible)
- Hint of UW purple (~hue 295-306) at gradient center for brand connection, fading to blue (hue 250) at edges
- Gradient fades to fully transparent at edges — existing page gradient shows through naturally, no seams
- Separate layer above page gradient — clean separation, no interaction between the two

### Dark mode treatment
- Same animation timing, size, shape, and easing in both modes — only palette colors change
- CSS custom properties (--hero-gradient-center, --hero-gradient-edge) defined in both :root and .dark blocks
- Auto-switches with theme via CSS variable resolution — zero JS needed, same pattern as --gradient-top/--gradient-bottom
- UW purple hint retained in dark mode (purple is already slightly brighter in dark per Phase 12)

### Accessibility (prefers-reduced-motion)
- Static gradient fallback at middle opacity (~0.4) — no animation
- Pattern: @media (prefers-reduced-motion: reduce) disables the keyframe animation
- Consistent with existing aurora and AnimatedGridPattern reduced-motion patterns

### Claude's Discretion
- Exact oklch values for gradient center and edge stops (within the accent blue + purple hint direction)
- Exact ellipse aspect ratio and radial-gradient CSS syntax
- Keyframe animation name and precise timing values within the 6-8s range
- Whether to use will-change: opacity for GPU compositing hint
- Exact CSS custom property naming beyond --hero-gradient-center/--hero-gradient-edge

</decisions>

<specifics>
## Specific Ideas

- Aurora background was previously built and rejected as "too distracting" — this gradient must be much more subtle
- The breathing should feel ambient/calming, like slowly shifting light — not a pulsing beacon
- Purple hint at center creates a subtle brand connection to UW without dominating the blue palette
- Hero.tsx already has a TODO comment placeholder for the background effect

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `Hero.tsx`: Has `{/* TODO: Add hero background effect (user to decide) */}` placeholder ready for the gradient div
- `app.css`: Aurora @keyframes pattern exists — breathing keyframes follow the same pattern
- `app.css`: `@media (prefers-reduced-motion: reduce)` block already handles aurora — add hero breathing there
- `app.css`: CSS custom properties for gradient stops (--gradient-top, --gradient-bottom) — hero gradient follows same pattern

### Established Patterns
- oklch color space with hue 250 for all palette colors — hero gradient stays in this system
- CSS custom properties in :root and .dark blocks for automatic theme switching
- `MotionConfig reducedMotion="user"` in App.tsx (for Motion library), but hero gradient uses pure CSS
- `pointer-events-none absolute` pattern used by AuroraBackground for overlay layers

### Integration Points
- `Hero.tsx` section with `relative overflow-hidden` — gradient div goes inside, behind the z-10 content div
- `app.css` :root and .dark blocks — add --hero-gradient-center and --hero-gradient-edge custom properties
- `app.css` @keyframes section — add hero breathing animation definition
- `app.css` @media (prefers-reduced-motion) — add hero animation disable rule

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 13-animated-hero-gradient*
*Context gathered: 2026-03-26*
