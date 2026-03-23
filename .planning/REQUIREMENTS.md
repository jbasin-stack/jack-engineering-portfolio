# Requirements: Jack Basinski Engineering Portfolio

**Defined:** 2026-03-20
**Core Value:** Every visitor — recruiter, professor, or peer — immediately understands Jack's range and depth as an electrical engineer, and can access the evidence without friction.

## v1 Requirements

### Foundation

- [x] **FNDN-01**: Project uses Vite 8 + React 19 with TypeScript, Tailwind CSS v4, and Motion (framer-motion successor)
- [x] **FNDN-02**: All content (projects, papers, skills, coursework, tooling, timeline) stored in typed TypeScript data files, not hardcoded in JSX
- [x] **FNDN-03**: Lenis smooth scroll wraps entire page with weighted easing and physical feel
- [x] **FNDN-04**: Lenis and Motion frame loops are synced (Lenis autoRaf disabled, driven by Motion's frame.update)
- [x] **FNDN-05**: Framer Motion weighted animations on all section entries and interactive hover states — no bounce or springy defaults
- [x] **FNDN-06**: 0.5px border design system with 1px fallback for non-Retina displays via HiDPI media query
- [x] **FNDN-07**: prefers-reduced-motion support disables Lenis smooth scroll and non-essential Motion animations
- [ ] **FNDN-08**: 21st.dev MCP server used as primary source for sourcing premium React components

### Navigation

- [x] **NAV-01**: User sees a fixed glassmorphic header with backdrop-blur, visible on all scroll positions
- [x] **NAV-02**: Navigation contains links to: Skills, Projects, Papers, Contact/Resume
- [x] **NAV-03**: Active section is highlighted in nav via Intersection Observer scroll-spy
- [x] **NAV-04**: Clicking a nav link smooth-scrolls to the target section via Lenis
- [x] **NAV-05**: Nav collapses to mobile-friendly menu at small breakpoints (hamburger on mobile only)

### Hero

- [x] **HERO-01**: User sees a typography-first hero section as the landing view
- [x] **HERO-02**: Hero communicates Jack's identity: ECE student at UW, semiconductor fabrication × system design
- [x] **HERO-03**: Hero uses high-quality sans-serif typography with generous whitespace

### Skills

- [x] **SKIL-01**: User can view technical skills as a clean typography-driven list
- [x] **SKIL-02**: Skills are grouped by domain: Fabrication, RF, Analog, Digital
- [x] **SKIL-03**: Skills are rendered from a TypeScript data file for easy updates
- [x] **SKIL-04**: Skills section uses semantic HTML so AI scrapers and recruiters can parse skill keywords

### Projects

- [ ] **PROJ-01**: User sees 3–5 projects displayed in a bento grid with variable-size cards
- [ ] **PROJ-02**: Each project card shows thumbnail/preview, title, and brief description
- [ ] **PROJ-03**: User can click a project card to see an inline expansion with full description, visuals, tech stack, and links
- [ ] **PROJ-04**: Card expansion/collapse uses Framer Motion layout animations for smooth transitions
- [x] **PROJ-05**: Project data (title, description, images, skills, links) is driven from TypeScript data files
- [ ] **PROJ-06**: Bento grid collapses gracefully to single-column on mobile

### Papers & Documents

- [x] **DOCS-01**: User sees a papers section listing academic papers and technical reports with titles and summaries
- [x] **DOCS-02**: User can click a paper to view the PDF in-browser via a Shadcn Dialog (desktop) or Drawer (mobile)
- [x] **DOCS-03**: User can download any PDF directly as a fallback
- [x] **DOCS-04**: Resume is viewable in the same in-browser PDF viewer
- [x] **DOCS-05**: react-pdf integration works in both dev and production Vite builds

### Lab & Tooling

- [x] **TOOL-01**: User sees a section displaying hands-on lab and tooling proficiency
- [x] **TOOL-02**: Tooling is grouped by category (EDA tools, lab equipment, fabrication processes)
- [x] **TOOL-03**: Tooling data is driven from a TypeScript data file

### Coursework

- [x] **CRSE-01**: User sees a section highlighting key UW ECE courses
- [x] **CRSE-02**: Courses include brief descriptors signaling domain relevance
- [x] **CRSE-03**: Coursework data is driven from a TypeScript data file

### Timeline

- [x] **TIME-01**: User sees a vertical timeline visualizing engineering journey and progression
- [x] **TIME-02**: Timeline contains 6–10 key milestones (courses, projects, research experiences)
- [x] **TIME-03**: Timeline features scroll-driven animation (fill line progresses as user scrolls)
- [x] **TIME-04**: Timeline data is driven from a TypeScript data file

### Contact

- [x] **CONT-01**: User sees a contact section with direct email link
- [x] **CONT-02**: User sees links to LinkedIn and GitHub profiles
- [x] **CONT-03**: User can download resume as a PDF via a prominent button
- [x] **CONT-04**: Contact section uses semantic markup for scraper readability

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
| FNDN-01 | Phase 1 | Complete |
| FNDN-02 | Phase 1 | Complete |
| FNDN-03 | Phase 1 | Complete |
| FNDN-04 | Phase 1 | Complete |
| FNDN-05 | Phase 1 | Complete |
| FNDN-06 | Phase 1 | Complete |
| FNDN-07 | Phase 1 | Complete |
| FNDN-08 | Phase 1 | Pending |
| NAV-01 | Phase 1 | Complete |
| NAV-02 | Phase 1 | Complete |
| NAV-03 | Phase 1 | Complete |
| NAV-04 | Phase 1 | Complete |
| NAV-05 | Phase 1 | Complete |
| HERO-01 | Phase 1 | Complete |
| HERO-02 | Phase 1 | Complete |
| HERO-03 | Phase 1 | Complete |
| SKIL-01 | Phase 2 | Complete |
| SKIL-02 | Phase 2 | Complete |
| SKIL-03 | Phase 2 | Complete |
| SKIL-04 | Phase 2 | Complete |
| PROJ-01 | Phase 3 | Pending |
| PROJ-02 | Phase 3 | Pending |
| PROJ-03 | Phase 3 | Pending |
| PROJ-04 | Phase 3 | Pending |
| PROJ-05 | Phase 3 | Complete |
| PROJ-06 | Phase 3 | Pending |
| DOCS-01 | Phase 3 | Complete |
| DOCS-02 | Phase 3 | Complete |
| DOCS-03 | Phase 3 | Complete |
| DOCS-04 | Phase 3 | Complete |
| DOCS-05 | Phase 3 | Complete |
| TOOL-01 | Phase 2 | Complete |
| TOOL-02 | Phase 2 | Complete |
| TOOL-03 | Phase 2 | Complete |
| CRSE-01 | Phase 2 | Complete |
| CRSE-02 | Phase 2 | Complete |
| CRSE-03 | Phase 2 | Complete |
| TIME-01 | Phase 2 | Complete |
| TIME-02 | Phase 2 | Complete |
| TIME-03 | Phase 2 | Complete |
| TIME-04 | Phase 2 | Complete |
| CONT-01 | Phase 2 | Complete |
| CONT-02 | Phase 2 | Complete |
| CONT-03 | Phase 2 | Complete |
| CONT-04 | Phase 2 | Complete |
| PERF-01 | Phase 4 | Pending |
| PERF-02 | Phase 4 | Pending |
| PERF-03 | Phase 4 | Pending |
| PERF-04 | Phase 4 | Pending |
| PERF-05 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 50 total
- Mapped to phases: 50
- Unmapped: 0

---
*Requirements defined: 2026-03-20*
*Last updated: 2026-03-20 after roadmap creation*
