# Phase 15: Contact Footer & Cleanup - Research

**Researched:** 2026-03-30
**Domain:** React component refactoring, dead code removal, CSS hover transitions
**Confidence:** HIGH

## Summary

Phase 15 is a refactoring and polish phase -- no new libraries or complex patterns are needed. The work involves (1) refactoring Contact.tsx from a multi-section layout with a PDF viewer modal into a compact single-row link display with icon hover animations, (2) adding a minimal footer strip with copyright and tagline, and (3) deleting four unused effect components plus updating all affected tests and imports.

The existing codebase provides all required patterns: oklch accent color via `text-accent` class, `transition-colors duration-300` for hover animations, `sectionVariants`/`fadeUpVariant` from Motion for entry animations, and Lucide icons already imported. No new npm dependencies are required. The primary risk is test breakage from file deletions -- three test files reference deprecated components or the LazyPdfViewer import in Contact.tsx.

**Primary recommendation:** Treat this as two logical waves: (1) Contact section refactor + footer addition, (2) dead code deletion + test updates. The second wave verifies `vite build` succeeds cleanly.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Heading changed to "Say Hello" (friendly, minimal tone)
- Keep centered-stack layout (heading -> tagline -> links row)
- All 4 links (Email, GitHub, LinkedIn, Resume) in a single horizontal row
- Each link shows icon + label text (not icon-only)
- All links styled identically -- resume is not a CTA, just one link among equals
- Resume link downloads directly (no in-browser PDF viewer modal)
- Remove LazyPdfViewer integration and useState from Contact.tsx
- Color shift from muted gray to oklch accent blue on hover
- Hover applies to icon + label text together (whole link lights up)
- 300ms CSS transition duration
- No scale, bounce, or glow effects -- color shift only
- Copyright line: "(c) {dynamic year} Jack Basinski" using new Date().getFullYear()
- Second line: "Built with React & Motion" tagline
- Subtle 1px muted border-top separator between contact section and footer
- Footer centered, minimal padding
- Delete all 4 unused effect components: NoisyBackground.tsx, AnimatedGridPattern.tsx, AuroraBackground.tsx, Particles.tsx
- Keep CardSpotlight.tsx (still used by ProjectCard)
- Update effects test file to only test CardSpotlight
- Remove PDF viewer import and resume modal state from Contact.tsx

### Claude's Discretion
- Footer component structure (separate component vs inline in Contact)
- Any additional obvious dead code found during implementation
- Exact spacing, font sizes, and padding values
- Whether "Built with" text links to anything or is plain text

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CTFT-01 | Clean contact section with direct links for email, LinkedIn, GitHub, and resume download | Contact.tsx refactor: remove LazyPdfViewer, add horizontal row of 4 equal links with icon + label. Uses existing contactData, sectionVariants, fadeUpVariant patterns |
| CTFT-02 | Social link icons with hover animation | CSS `transition-colors duration-300` from muted gray (`text-silicon-400`) to accent blue (`hover:text-accent`). Applied to entire link (icon + label text). Already an established pattern in the codebase |
| CTFT-03 | Clean minimal footer with copyright line | Footer strip below Contact section within existing `<footer>` element in App.tsx. Dynamic year, "Built with React & Motion" tagline, 1px `border-t border-border` separator |
</phase_requirements>

## Standard Stack

### Core (already installed -- no new dependencies)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react | ^19.2.4 | UI components | Already in use |
| motion | ^12.38.0 | Entry animations (sectionVariants/fadeUpVariant) | Already in use for all sections |
| lucide-react | ^0.577.0 | Icons (Mail, Github, Linkedin, FileText) | Already in use for contact icons |
| tailwindcss | ^4.2.2 | Styling (hover transitions, spacing, colors) | Already in use for all styling |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| vitest | ^4.1.0 | Test runner | Updating effects test and bundle test |

### Alternatives Considered
None -- this phase uses only existing libraries with no new additions.

**Installation:**
```bash
# No installation needed -- all dependencies already present
```

## Architecture Patterns

### Current Contact.tsx Structure (being refactored)
```
Contact.tsx
├── useState (showResume) -- REMOVE
├── LazyPdfViewer import -- REMOVE
├── motion.section#contact
│   ├── h2 "Get in Touch" -- CHANGE to "Say Hello"
│   ├── p (tagline)
│   ├── address > a (email) -- MERGE into link row
│   ├── div (resume actions: View + Download) -- REPLACE with single download link
│   ├── div (social icons: GitHub, LinkedIn) -- MERGE into link row
│   └── LazyPdfViewer -- REMOVE
```

### Target Contact.tsx Structure
```
Contact.tsx
├── motion.section#contact
│   ├── h2 "Say Hello"
│   ├── p (tagline)
│   └── div.link-row (4 equal links in horizontal flex)
│       ├── a[mailto:] Mail icon + "Email"
│       ├── a[github] Github icon + "GitHub"
│       ├── a[linkedin] Linkedin icon + "LinkedIn"
│       └── a[download] FileText icon + "Resume"
```

### Footer Strip (new)
```
Footer strip (below Contact, within <footer> in App.tsx)
├── border-t separator
├── p "(c) 2026 Jack Basinski"
└── p "Built with React & Motion"
```

### Recommended Project Structure Change
```
src/
├── components/
│   ├── sections/
│   │   └── Contact.tsx          # Refactored (simpler, no PDF viewer)
│   ├── layout/
│   │   └── Footer.tsx           # NEW (recommended: separate component)
│   └── effects/
│       ├── CardSpotlight.tsx     # KEEP (used by ProjectCard)
│       ├── __tests__/
│       │   └── effects.test.ts  # UPDATE (only CardSpotlight)
│       ├── NoisyBackground.tsx   # DELETE
│       ├── AnimatedGridPattern.tsx # DELETE
│       ├── AuroraBackground.tsx  # DELETE
│       └── Particles.tsx         # DELETE
```

### Pattern: Contact Link Row
**What:** All 4 links as equal items in a horizontal flex row with uniform icon + label styling
**When to use:** When all links should feel like equals with no visual hierarchy
**Example:**
```typescript
// Established hover pattern from Navigation.tsx line 58
// text-silicon-400 is the muted base, hover:text-accent is the target
className="inline-flex items-center gap-2 text-silicon-400 transition-colors duration-300 hover:text-accent"
```

### Pattern: Footer Component
**What:** Separate Footer.tsx component rendered inside the existing `<footer>` element in App.tsx
**When to use:** Keeps Contact.tsx focused on contact content, footer as its own concern
**Example:**
```typescript
// App.tsx already wraps Contact in <footer> at line 77-79
<footer>
  <Contact />
  <Footer />  {/* NEW -- footer strip below contact */}
</footer>
```

### Anti-Patterns to Avoid
- **Mixing concerns in Contact.tsx:** Don't put the copyright footer inside the Contact component. The `<footer>` HTML element in App.tsx already exists -- add a separate Footer component as a sibling to Contact inside it.
- **Hardcoded year:** Don't write `2026` -- use `new Date().getFullYear()` per user decision.
- **Icon-only links:** User explicitly wants icon + label text on each link, not icon-only.
- **Visual hierarchy among links:** Resume must NOT be styled as a CTA button. All 4 links are visually identical.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Icon mapping | Manual switch/if chains | `iconMap` object lookup (already exists in codebase) | Consistent pattern in HeroContent.tsx and Contact.tsx |
| Hover animations | JS-based hover effects | Tailwind `transition-colors duration-300 hover:text-accent` | Simpler, GPU-composited, already used everywhere |
| Section entry animation | Custom scroll observer | `sectionVariants` + `fadeUpVariant` from `styles/motion.ts` | Established pattern across all sections |
| Dynamic year | External package | `new Date().getFullYear()` | One line of native JS |

**Key insight:** This phase is pure refactoring of existing patterns. Every technique needed is already demonstrated in the codebase.

## Common Pitfalls

### Pitfall 1: Broken bundle test after removing LazyPdfViewer from Contact
**What goes wrong:** `src/tests/bundle.test.ts` lines 20-25 assert that Contact.tsx contains `LazyPdfViewer`. After refactoring, this test will fail.
**Why it happens:** The test was written to verify lazy-loading was used for the PDF viewer.
**How to avoid:** Update the bundle test to remove the Contact/LazyPdfViewer assertion. PapersSection still uses LazyPdfViewer, so that assertion remains valid.
**Warning signs:** `vitest` fails on `bundle.test.ts` after Contact refactor.

### Pitfall 2: Aurora animation test still expects removed CSS
**What goes wrong:** `src/styles/__tests__/colors.test.ts` lines 89-101 test for `--animate-aurora` and `@keyframes aurora` in app.css. The aurora animation is only used by AuroraBackground.tsx (being deleted).
**Why it happens:** The CSS definition remains in app.css even though the component is deleted.
**How to avoid:** Two options -- (a) remove the aurora CSS from app.css and update the test, or (b) leave the CSS as harmless dead weight. Recommendation: remove it during cleanup for completeness, and update the test to remove the aurora assertions.
**Warning signs:** None if CSS is left -- tests pass but dead CSS remains. Better to clean it up.

### Pitfall 3: Forgetting to update contactData structure
**What goes wrong:** The current `contactData` has email and socialLinks (GitHub, LinkedIn) as separate fields. The new UI renders all 4 items identically.
**Why it happens:** Email is `contactData.email` (string), socialLinks is an array of `{platform, url, icon}`.
**How to avoid:** Either (a) normalize data by adding email and resume to the socialLinks array, or (b) construct the unified link array in the component from both sources. Option (b) is less disruptive -- build the array in the component without changing the data file.
**Warning signs:** Inconsistent rendering logic between email/resume and social links.

### Pitfall 4: `<address>` semantic element for non-address content
**What goes wrong:** Current Contact.tsx wraps the email in `<address>`. If the entire link row is placed inside `<address>`, it's semantically incorrect (address is for contact info of the document/section author, not general links).
**Why it happens:** Over-application of semantic HTML.
**How to avoid:** Remove the `<address>` wrapper since the new layout is a row of mixed links (email + social + resume download). The `<footer>` parent already provides the semantic context.

### Pitfall 5: Missing `download` attribute on resume link
**What goes wrong:** Resume opens in browser instead of downloading.
**Why it happens:** Forgot the `download` attribute on the `<a>` element.
**How to avoid:** Ensure `<a href={contactData.resumePath} download>` has the `download` attribute. This is already present in the current code but could be lost during refactoring.

## Code Examples

Verified patterns from the existing codebase:

### Contact Link with Hover Animation
```typescript
// Pattern from Navigation.tsx line 58 and Contact.tsx line 46
// Muted base color -> accent on hover, 300ms transition
<a
  href={url}
  className="inline-flex items-center gap-2 text-silicon-400 transition-colors duration-300 hover:text-accent"
>
  <Icon size={18} strokeWidth={1.5} />
  {label}
</a>
```

### Section Entry Animation (established pattern)
```typescript
// From every section component in the codebase
import { sectionVariants, fadeUpVariant } from '../../styles/motion';

<motion.section
  variants={sectionVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.2 }}
>
  <motion.div variants={fadeUpVariant}>
    {/* content */}
  </motion.div>
</motion.section>
```

### Footer Border Separator
```typescript
// Pattern from existing codebase: border-border is the semantic border token
// 1px top border as section separator
<div className="border-t border-border px-6 py-8 text-center">
```

### Icon Map Pattern (existing)
```typescript
// From HeroContent.tsx and Contact.tsx -- data-driven icon rendering
import { Mail, Github, Linkedin, FileText } from 'lucide-react';

const iconMap = { Mail, Github, Linkedin, FileText } as const;

// Usage with data-driven rendering
const Icon = iconMap[link.icon as keyof typeof iconMap];
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| PDF viewer modal in Contact | Direct download link | Phase 15 decision | Removes LazyPdfViewer dep, simplifies Contact component |
| Separate email + social rows | Single unified link row | Phase 15 decision | All 4 links as visual equals |
| NoisyBackground/Aurora effects | Pure CSS gradients | Phase 12-13 | 4 effect components now dead code |

**Deprecated/outdated:**
- `NoisyBackground.tsx`: Replaced by unified CSS gradient background in Phase 12
- `AnimatedGridPattern.tsx`: Never used in production after Phase 12 redesign
- `AuroraBackground.tsx`: Explicitly rejected by user as too distracting
- `Particles.tsx`: Contradicts minimalist philosophy, never used in production layout
- `animate-aurora` CSS keyframe: Only consumer is AuroraBackground.tsx (being deleted)

## Cleanup Scope (Full Inventory)

### Files to DELETE (4 components)
1. `src/components/effects/NoisyBackground.tsx`
2. `src/components/effects/AnimatedGridPattern.tsx`
3. `src/components/effects/AuroraBackground.tsx`
4. `src/components/effects/Particles.tsx`

### Files to UPDATE (tests)
1. `src/components/effects/__tests__/effects.test.ts` -- Remove 4 import/test blocks, keep only CardSpotlight
2. `src/tests/bundle.test.ts` -- Remove assertion that Contact.tsx imports LazyPdfViewer (lines 20-25)
3. `src/styles/__tests__/colors.test.ts` -- Remove aurora keyframe assertions (lines 89-101)

### CSS to CLEAN (optional but recommended)
1. `src/styles/app.css` -- Remove `--animate-aurora` definition (line 30) and `@keyframes aurora` (lines 31-34), and the `.animate-aurora` reduced-motion override (line 271)

### Imports to REMOVE from Contact.tsx
- `import { useState } from 'react'` -- no longer needed
- `import { LazyPdfViewer } from '../pdf/LazyPdfViewer'` -- removed feature
- `Download` and `Eye` from lucide-react -- replaced by `FileText` for resume icon

## Open Questions

1. **Footer as separate component vs inline in Contact?**
   - What we know: App.tsx has `<footer><Contact /></footer>`. Adding a sibling `<Footer />` component is cleaner separation of concerns.
   - Recommendation: Create `src/components/layout/Footer.tsx` as a separate component. Add it as a sibling to `<Contact />` inside the existing `<footer>` element in App.tsx. This follows the project's component-per-concern pattern.

2. **Should "Built with" text link to anything?**
   - What we know: User said the footer should "feel like a quiet sign-off, not a destination."
   - Recommendation: Plain text, no links. Linking to React/Motion sites would make it a destination.

3. **Contact data normalization for unified link row?**
   - What we know: Currently email is a separate string field, socialLinks is an array. Resume path is a separate field.
   - Recommendation: Build the unified link array in the component (not the data file) to avoid changing data types/schemas that the admin panel may depend on.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | vitest 4.1.0 |
| Config file | `vitest.config.ts` |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run --reporter=verbose` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CTFT-01 | Contact section has 4 direct links (email, LinkedIn, GitHub, resume download) | unit (file content scan) | `npx vitest run src/tests/bundle.test.ts -x` | Exists but needs update (remove LazyPdfViewer assertion) |
| CTFT-02 | Social link icons have hover animation classes | unit (file content scan) | `npx vitest run src/components/effects/__tests__/effects.test.ts -x` | Exists but needs update (remove 4 deleted components) |
| CTFT-03 | Footer with copyright line exists | smoke | `npx vitest run src/tests/semantic-html.test.ts -x` | Exists -- could add footer assertions |
| CTFT-ALL | Production build clean (no deprecated refs) | build | `npx tsc -b && npx vite build` | N/A -- manual verification |

### Sampling Rate
- **Per task commit:** `npx vitest run --reporter=verbose`
- **Per wave merge:** `npx vitest run --reporter=verbose && npx tsc -b && npx vite build`
- **Phase gate:** Full suite green + production build succeeds with no deprecated component references

### Wave 0 Gaps
- [ ] `src/tests/bundle.test.ts` -- remove Contact/LazyPdfViewer assertion (lines 20-25)
- [ ] `src/components/effects/__tests__/effects.test.ts` -- reduce to CardSpotlight-only test
- [ ] `src/styles/__tests__/colors.test.ts` -- remove aurora keyframe assertions (lines 89-101)
- [ ] Production build verification: `npx vite build` must succeed with no warnings

## Sources

### Primary (HIGH confidence)
- Codebase inspection: `src/components/sections/Contact.tsx` -- current component structure
- Codebase inspection: `src/data/contact.ts` -- current contact data model
- Codebase inspection: `src/App.tsx` -- footer element wrapping Contact (line 77-79)
- Codebase inspection: `src/styles/app.css` -- oklch color system, aurora CSS, border tokens
- Codebase inspection: `src/styles/motion.ts` -- sectionVariants and fadeUpVariant definitions
- Codebase inspection: `src/components/effects/` -- all 5 effect files, test file
- Codebase inspection: `src/tests/bundle.test.ts` -- LazyPdfViewer assertion that needs updating
- Codebase inspection: `src/styles/__tests__/colors.test.ts` -- aurora assertions that need updating

### Secondary (MEDIUM confidence)
- None needed -- all findings from direct codebase inspection

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new dependencies, all patterns verified in codebase
- Architecture: HIGH -- straightforward refactoring of existing component with known patterns
- Pitfalls: HIGH -- all test files inspected, all import chains traced, all deletion targets verified with grep

**Research date:** 2026-03-30
**Valid until:** Indefinite -- phase uses only existing codebase patterns with no external dependencies to go stale
