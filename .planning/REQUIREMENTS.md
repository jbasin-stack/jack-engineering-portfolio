# Requirements: Jack Basinski Engineering Portfolio

**Defined:** 2026-03-20
**Core Value:** Every visitor — recruiter, professor, or peer — immediately understands Jack's range and depth as an electrical engineer, and can access the evidence without friction.

## v1 Requirements

### Foundation

- [ ] **FNDN-01**: Project uses Vite 8 + React 19 with TypeScript, Tailwind CSS v4, and Motion (framer-motion successor)
- [ ] **FNDN-02**: All content (projects, papers, skills, coursework, tooling, timeline) stored in typed TypeScript data files, not hardcoded in JSX
- [ ] **FNDN-03**: Lenis smooth scroll wraps entire page with weighted easing and physical feel
- [ ] **FNDN-04**: Lenis and Motion frame loops are synced (Lenis autoRaf disabled, driven by Motion's frame.update)
- [ ] **FNDN-05**: Framer Motion weighted animations on all section entries and interactive hover states — no bounce or springy defaults
- [ ] **FNDN-06**: 0.5px border design system with 1px fallback for non-Retina displays via HiDPI media query
- [ ] **FNDN-07**: prefers-reduced-motion support disables Lenis smooth scroll and non-essential Motion animations
- [ ] **FNDN-08**: 21st.dev MCP server used as primary source for sourcing premium React components

### Navigation

- [ ] **NAV-01**: User sees a fixed glassmorphic header with backdrop-blur, visible on all scroll positions
- [ ] **NAV-02**: Navigation contains links to: Skills, Projects, Papers, Contact/Resume
- [ ] **NAV-03**: Active section is highlighted in nav via Intersection Observer scroll-spy
- [ ] **NAV-04**: Clicking a nav link smooth-scrolls to the target section via Lenis
- [ ] **NAV-05**: Nav collapses to mobile-friendly menu at small breakpoints (hamburger on mobile only)

### Hero

- [ ] **HERO-01**: User sees a typography-first hero section as the landing view
- [ ] **HERO-02**: Hero communicates Jack's identity: ECE student at UW, semiconductor fabrication × system design
- [ ] **HERO-03**: Hero uses high-quality sans-serif typography with generous whitespace

### Skills

- [ ] **SKIL-01**: User can view technical skills as a clean typography-driven list
- [ ] **SKIL-02**: Skills are grouped by domain: Fabrication, RF, Analog, Digital
- [ ] **SKIL-03**: Skills are rendered from a TypeScript data file for easy updates
- [ ] **SKIL-04**: Skills section uses semantic HTML so AI scrapers and recruiters can parse skill keywords

### Projects

- [ ] **PROJ-01**: User sees 3–5 projects displayed in a bento grid with variable-size cards
- [ ] **PROJ-02**: Each project card shows thumbnail/preview, title, and brief description
- [ ] **PROJ-03**: User can click a project card to see an inline expansion with full description, visuals, tech stack, and links
- [ ] **PROJ-04**: Card expansion/collapse uses Framer Motion layout animations for smooth transitions
- [ ] **PROJ-05**: Project data (title, description, images, skills, links) is driven from TypeScript data files
- [ ] **PROJ-06**: Bento grid collapses gracefully to single-column on mobile

### Papers & Documents

- [ ] **DOCS-01**: User sees a papers section listing academic papers and technical reports with titles and summaries
- [ ] **DOCS-02**: User can click a paper to view the PDF in-browser via a Shadcn Dialog (desktop) or Drawer (mobile)
- [ ] **DOCS-03**: User can download any PDF directly as a fallback
- [ ] **DOCS-04**: Resume is viewable in the same in-browser PDF viewer
- [ ] **DOCS-05**: react-pdf integration works in both dev and production Vite builds

### Lab & Tooling

- [ ] **TOOL-01**: User sees a section displaying hands-on lab and tooling proficiency
- [ ] **TOOL-02**: Tooling is grouped by category (EDA tools, lab equipment, fabrication processes)
- [ ] **TOOL-03**: Tooling data is driven from a TypeScript data file

### Coursework

- [ ] **CRSE-01**: User sees a section highlighting key UW ECE courses
- [ ] **CRSE-02**: Courses include brief descriptors signaling domain relevance
- [ ] **CRSE-03**: Coursework data is driven from a TypeScript data file

### Timeline

- [ ] **TIME-01**: User sees a vertical timeline visualizing engineering journey and progression
- [ ] **TIME-02**: Timeline contains 6–10 key milestones (courses, projects, research experiences)
- [ ] **TIME-03**: Timeline features scroll-driven animation (fill line progresses as user scrolls)
- [ ] **TIME-04**: Timeline data is driven from a TypeScript data file

### Contact

- [ ] **CONT-01**: User sees a contact section with direct email link
- [ ] **CONT-02**: User sees links to LinkedIn and GitHub profiles
- [ ] **CONT-03**: User can download resume as a PDF via a prominent button
- [ ] **CONT-04**: Contact section uses semantic markup for scraper readability

### Performance & Deployment

- [ ] **PERF-01**: Site is fully responsive at mobile, tablet, and desktop breakpoints
- [ ] **PERF-02**: Semantic HTML with proper heading hierarchy (H1 > H2 > H3) and semantic elements (header, nav, main, section, footer)
- [ ] **PERF-03**: OpenGraph meta tags for polished social previews when shared
- [ ] **PERF-04**: Lighthouse performance score 90+ (optimized images, lazy loading, minimal JS bundle)
- [ ] **PERF-05**: Site deployed on Vercel free tier with auto-deploy on push

## v2 Requirements

### Post-Launch Enhancements

- **BLOG-01**: Technical blog/notes section for thought leadership
- **TEST-01**: Testimonials section with quotes from professors and mentors
- **CERT-01**: Certifications and training section
- **OSS-01**: Open source contributions section
- **DARK-01**: Dark mode toggle as an alternative to Cleanroom White theme
- **VID-01**: Video walkthroughs of projects
- **ANLYT-01**: Vercel Analytics for engagement tracking
- **OG-01**: Custom Open Graph images per project

## Out of Scope

| Feature | Reason |
|---------|--------|
| Contact form with backend | Zero-cost constraint; direct email link is sufficient and lower friction |
| CMS / admin panel | Over-engineering for 3-5 projects; data files + Vercel auto-deploy is simpler |
| Multi-page routing | Breaks single-page scroll philosophy; inline expansion keeps user in context |
| Skill percentage bars | Meaningless self-assessment; typography list is cleaner and more editorial |
| Particle effects / 3D backgrounds | Tanks Lighthouse; contradicts minimalist philosophy |
| Custom cursor | Accessibility nightmare; zero value for target audiences |
| GitHub contribution graph | Not relevant for ECE/hardware; most work happens in Cadence and labs |
| Hamburger menu on desktop | Hides navigation unnecessarily; reserve for mobile only |
| Animation on every element | Cognitive fatigue; undermines "weighted, no bounce" philosophy |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FNDN-01 | — | Pending |
| FNDN-02 | — | Pending |
| FNDN-03 | — | Pending |
| FNDN-04 | — | Pending |
| FNDN-05 | — | Pending |
| FNDN-06 | — | Pending |
| FNDN-07 | — | Pending |
| FNDN-08 | — | Pending |
| NAV-01 | — | Pending |
| NAV-02 | — | Pending |
| NAV-03 | — | Pending |
| NAV-04 | — | Pending |
| NAV-05 | — | Pending |
| HERO-01 | — | Pending |
| HERO-02 | — | Pending |
| HERO-03 | — | Pending |
| SKIL-01 | — | Pending |
| SKIL-02 | — | Pending |
| SKIL-03 | — | Pending |
| SKIL-04 | — | Pending |
| PROJ-01 | — | Pending |
| PROJ-02 | — | Pending |
| PROJ-03 | — | Pending |
| PROJ-04 | — | Pending |
| PROJ-05 | — | Pending |
| PROJ-06 | — | Pending |
| DOCS-01 | — | Pending |
| DOCS-02 | — | Pending |
| DOCS-03 | — | Pending |
| DOCS-04 | — | Pending |
| DOCS-05 | — | Pending |
| TOOL-01 | — | Pending |
| TOOL-02 | — | Pending |
| TOOL-03 | — | Pending |
| CRSE-01 | — | Pending |
| CRSE-02 | — | Pending |
| CRSE-03 | — | Pending |
| TIME-01 | — | Pending |
| TIME-02 | — | Pending |
| TIME-03 | — | Pending |
| TIME-04 | — | Pending |
| CONT-01 | — | Pending |
| CONT-02 | — | Pending |
| CONT-03 | — | Pending |
| CONT-04 | — | Pending |
| PERF-01 | — | Pending |
| PERF-02 | — | Pending |
| PERF-03 | — | Pending |
| PERF-04 | — | Pending |
| PERF-05 | — | Pending |

**Coverage:**
- v1 requirements: 45 total
- Mapped to phases: 0
- Unmapped: 45 ⚠️

---
*Requirements defined: 2026-03-20*
*Last updated: 2026-03-20 after initial definition*
