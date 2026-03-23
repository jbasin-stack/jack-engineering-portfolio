# Phase 05: Visual Design Overhaul — Context

**Gathered:** 2026-03-23
**Status:** Ready for planning
**Source:** Direct conversation decisions

<domain>
## Phase Boundary

Transform the portfolio from a clean-but-bland monochrome site into a visually dynamic experience with animated backgrounds, noise textures, UW purple color accents, and interactive card effects. All new visual components sourced from 21st.dev community libraries (aceternity, magicui, easemize/bundui).

This phase does NOT change content, layout structure, or functionality — only visual treatment and interactivity.

</domain>

<decisions>
## Implementation Decisions

### Color Palette Extension
- **LOCKED:** Extend cleanroom palette with UW Purple (#4b2e83) as primary accent color
- **LOCKED:** Add UW Metallic Gold (#85754d) as secondary accent (used sparingly — links, highlights)
- **LOCKED:** Add soft purple tint for gradients and glows (lighter shade of UW purple)
- **LOCKED:** Keep cleanroom white (#FAFAF8) and ink (#1C1E26) as base colors — purple is accent thread, not replacement

### Hero Section
- **LOCKED:** Replace static gradient with Aurora Background component (aceternity via 21st.dev)
- **LOCKED:** Customize aurora colors to UW purple tones (replace default emerald/teal)
- **LOCKED:** Add Particles overlay (magicui via 21st.dev) with mouse magnetism effect
- **LOCKED:** Particle settings: ~60 quantity, ~0.4 size, high staticity (ambient, not busy)
- **LOCKED:** Purple-tinted particles that drift and respond to cursor movement
- **LOCKED:** Medium intensity — this is the showpiece section

### WhoAmI Section
- **LOCKED:** Add Noisy Gradient Background (easemize via 21st.dev)
- **LOCKED:** Subtle purple-to-cleanroom gradient with grain overlay
- **LOCKED:** Low noise intensity (~0.3) for texture without distraction

### Skills/Tooling Sections
- **LOCKED:** Add Noisy Gradient Background (easemize via 21st.dev)
- **LOCKED:** Barely-there noise texture (very low intensity)

### Project Cards (Bento Grid)
- **LOCKED:** Wrap project cards with Card Spotlight component (aceternity via 21st.dev)
- **LOCKED:** Interactive spotlight follows cursor on hover, revealing radial gradient glow
- **LOCKED:** Customize spotlight color to soft UW purple glow
- **LOCKED:** Medium intensity on hover

### Timeline Section
- **LOCKED:** Add Animated Grid Pattern (magicui via 21st.dev) as subtle background
- **LOCKED:** Very low opacity (~0.15), UW purple fill
- **LOCKED:** Engineering/technical feel

### Papers Section
- **LOCKED:** No visual effect — clean, provides breathing room between effects

### Contact/Footer
- **LOCKED:** Subtle gradient to match hero section (low intensity)

### Intensity Curve
- **LOCKED:** Effect intensity follows: bold hero → textured middle → calm footer
- **LOCKED:** No section has more than one background effect
- **LOCKED:** Clean sections between effects provide visual breathing room

### Component Sources (all from 21st.dev)
1. Aurora Background — aceternity (hero animated gradient)
2. Noisy Gradient Backgrounds — easemize (section noise textures)
3. Card Spotlight — aceternity (project card hover effect)
4. Particles — magicui (hero floating particles)
5. Animated Grid Pattern — magicui (timeline background)

### Claude's Discretion
- Exact opacity and blend values for each section's effect
- How to integrate 21st.dev components into existing Vite+React+Tailwind stack (copy-paste vs npm)
- Whether components need adaptation for the existing motion/react setup (vs framer-motion)
- Performance optimization if multiple canvas elements cause jank
- Exact soft purple tint hex value (derived from UW Purple)
- Gradient direction and color stop positions for section backgrounds
- How Card Spotlight interacts with existing expand/collapse layout animations on project cards

</decisions>

<specifics>
## Specific Ideas

### 21st.dev Component URLs
- Aurora Background: https://21st.dev/community/components/aceternity/aurora-background/default
- Noisy Gradient Backgrounds: https://21st.dev/community/components/easemize/noisy-gradient-backgrounds
- Card Spotlight: https://21st.dev/community/components/aceternity/card-spotlight
- Particles: https://21st.dev/magicui/particles/default
- Animated Grid Pattern: https://21st.dev/magicui/animated-grid-pattern/default

### UW Brand Colors
- UW Purple: #4b2e83 (oklch approximate: oklch(0.32 0.12 290))
- UW Metallic Gold: #85754d (oklch approximate: oklch(0.55 0.06 85))

### Component Technical Notes
- Aurora Background: CSS animations only, 60fps, uses repeating-linear-gradient + blur + invert
- Noisy Gradient Backgrounds: Canvas-based noise, configurable gradient type/origin/colors/noise intensity
- Card Spotlight: Uses framer-motion for mouse tracking, radial gradient reveal on hover
- Particles: Canvas-based, requestAnimationFrame, mouse magnetism with configurable staticity
- Animated Grid Pattern: SVG-based, framer-motion for fade animations, ResizeObserver responsive

</specifics>

<deferred>
## Deferred Ideas

- Dark mode toggle (portfolio is light-only for v1)
- Animated page transitions between sections
- 3D card tilt effects (could be v2 enhancement)
- Particle interaction with scroll position
- Custom cursor effects

</deferred>

---

*Phase: 05-visual-design-overhaul*
*Context gathered: 2026-03-23 via direct conversation*
