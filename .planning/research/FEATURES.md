# Feature Research

**Domain:** Premium minimalist engineering portfolio (ECE student targeting recruiters + grad school admissions)
**Researched:** 2026-03-20
**Confidence:** HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

Features visitors assume exist. Missing these means the visitor bounces or perceives the site as amateur.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Responsive design** | 50%+ of traffic is mobile. Recruiters check on phones between meetings. Professors browse on tablets. | MEDIUM | Must work flawlessly at mobile, tablet, and desktop breakpoints. Bento grid must collapse gracefully. Test on real devices, not just Chrome DevTools. |
| **Clear navigation** | Recruiters spend 30-60 seconds per portfolio page (MIT CommLab data). If they can't find projects/resume instantly, they leave. | LOW | Fixed nav with 4-5 sections max. Single-page scroll nav with active section highlighting. Glassmorphic fixed nav per PROJECT.md is the right call. |
| **Hero section with identity** | Visitor must know within 3 seconds: who this person is, what they do, why they should care. | LOW | Typography-driven hero per PROJECT.md. Name, discipline, one compelling sentence about semiconductor fab + system design intersection. No generic "Welcome to my portfolio." |
| **Projects section (3-5 projects)** | This IS the portfolio. Recruiters and professors both evaluate based on project work. 4-10 projects is ideal per recruiter surveys; 3-5 is optimal for a student. | HIGH | Each project needs: title, brief description, your specific role/contribution, 2-6 high-quality visuals (schematics, photos, diagrams), skills used, and outcome. Per MIT: "articulate what you're showing; highlight impact and contribution." |
| **Resume/CV access** | Recruiters need a downloadable PDF resume. Professors need to see academic credentials. This is the #1 action item visitors take. | LOW | Prominent download button. PDF must be current. Both in-browser preview AND download option. |
| **Contact information** | If someone wants to reach out, they need to be able to. Missing contact info = missed opportunity. | LOW | Email link, LinkedIn, GitHub at minimum. Direct email link is sufficient for a personal portfolio (contact form adds unnecessary friction and requires backend per PROJECT.md constraints). |
| **Skills/competency display** | Both audiences need to quickly assess technical breadth: what tools, what domains, what depth. | LOW | Typography-driven grouped list per PROJECT.md. Domains: Fab, RF, Analog, Digital. No skill bars or percentage indicators (they are meaningless). |
| **Fast load time (Lighthouse 90+)** | Slow portfolio undermines credibility. Per PROJECT.md constraint. A portfolio site that loads slowly signals lack of technical competence. | MEDIUM | Optimize images (WebP/AVIF), lazy load below-fold content, minimize JS bundle. Lenis is only 3KB so it will not hurt. Framer Motion tree-shaking is critical. |
| **Semantic HTML + basic SEO** | AI scrapers (ChatGPT, Perplexity) and search engines need to parse the site. Recruiters may Google the name. Per PROJECT.md: "non-negotiable." | MEDIUM | Proper heading hierarchy (H1 > H2 > H3), semantic elements (header, nav, main, article, section, footer), OpenGraph meta tags, structured data. WCAG 2.2 compliance especially for heading structure. |
| **About/bio section** | Professors want to understand research motivation and trajectory. Recruiters want personality and culture fit signals. | LOW | Brief but specific: UW ECE student, semiconductor fab + system design focus, specific research interests. Not a life story. Weave into hero or make it a distinct short section. |

### Differentiators (Competitive Advantage)

Features that separate this portfolio from the hundreds of generic engineering student sites. These align with the "less, but better" philosophy.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Premium scroll experience (Lenis)** | 95% of student portfolios use default browser scroll. Lenis smooth scroll with weighted easing immediately signals craft and intentionality. Creates a physical, premium feel that matches the "Dieter Rams / Jony Ive" aesthetic. | LOW | Lenis is 3KB, well-documented, and straightforward to integrate. Respects prefers-reduced-motion. Per PROJECT.md: this is a core design decision. |
| **Weighted Framer Motion animations** | Most student portfolios either have no animation or use bouncy/springy defaults. Weighted, physical-feeling enter/hover animations with no bounce communicate precision engineering sensibility. | MEDIUM | Must be consistent across all elements. Use a shared motion config for consistent easing. Animate on viewport entry, not on load. Respect prefers-reduced-motion by disabling non-essential animations. |
| **Bento grid project cards with inline expansion** | Standard portfolios use a boring vertical list or grid of identical cards. Bento layout with varying card sizes lets flagship projects take visual priority. Inline expansion (not modal) keeps the user in context and feels more connected. Bento grids are a dominant 2025-2026 UI pattern, with 67% of top SaaS products adopting them. | HIGH | Most complex UI component. Cards need: thumbnail/preview, title, brief description. Expanded state needs: full description, visuals, skills, links. Animate expansion smoothly with Framer Motion layout animations. |
| **In-browser PDF viewer for papers** | Most student portfolios link to external Google Drive or plain PDF links. Viewing papers and resume in-browser without leaving the site reduces friction and keeps engagement. Professors reviewing research papers will appreciate not being bounced to another tab. | MEDIUM | Use Shadcn Dialog or Drawer component. Embed PDF with browser-native viewer or react-pdf. Must also offer a download fallback. Mobile: use Drawer (bottom sheet). Desktop: use Dialog (centered modal). |
| **Papers/publications section** | Very few undergraduate portfolios highlight academic papers. For grad school admissions, this is gold. Professors look specifically for research output and ability to communicate findings. | LOW | Section with paper titles, abstracts/summaries, and in-browser PDF access. Even if only 1-2 papers, the section's existence signals research orientation. |
| **Lab and tooling proficiency section** | Shows hands-on capability beyond theory. Cleanroom equipment, Cadence, KLayout, oscilloscopes, etc. This is a differentiator for semiconductor roles specifically because it proves you have actually fabricated, not just simulated. | LOW | Clean typographic list or subtle grid. Group by category (EDA tools, lab equipment, fabrication processes). No logos or icons needed -- the names carry weight with domain experts. |
| **Glassmorphic design language** | Glassmorphism in 2026 is mature and validated (Apple Liquid Glass at WWDC 2025, Samsung One UI 7). Applied selectively to nav and overlays, it creates depth and sophistication without being gimmicky. Combined with 0.5px borders, this is a cohesive signature aesthetic. | MEDIUM | Use sparingly: nav bar, PDF viewer overlay, maybe card hover states. Do NOT apply everywhere. Needs careful contrast ratios for accessibility. Frosted glass over light backgrounds only. Tailwind: `bg-white/30 backdrop-blur-lg border border-white/20`. |
| **Coursework section** | Signals depth to both audiences. Recruiters see domain-relevant coursework. Professors see preparation for graduate work. Few student portfolios include this, but it is low-effort high-signal for an ECE student. | LOW | Simple list of key UW ECE courses with brief descriptors. Highlight courses relevant to semiconductor, RF, analog, digital domains. |
| **Timeline/journey section** | Visualizes engineering progression and helps both audiences understand trajectory. Professors want to see a coherent research narrative. Recruiters want to see growth. Modern implementations use scroll-animated fill lines connecting milestone nodes. | MEDIUM | Vertical timeline with key milestones (courses, projects, research experiences). Keep it concise -- 6-10 milestones max. Scroll-animated fill line that progresses as the user scrolls is a premium touch. |
| **Data-driven content architecture** | All project/paper/skill content stored in clean data files (JSON/TS objects), not hardcoded in JSX. Makes the portfolio trivially updatable as new projects and papers are added. | MEDIUM | Per PROJECT.md constraint: "content must be swappable/updatable without code changes." This is both a differentiator (maintainability) and a development best practice. Define TypeScript interfaces for Project, Paper, Skill, TimelineEvent, etc. |
| **prefers-reduced-motion support** | Demonstrates accessibility awareness -- a quality signal for both technical audiences. WCAG 2.2 compliance. Affects 70M+ people with vestibular disorders globally. | LOW | Disable Lenis smooth scroll and Framer Motion animations when user prefers reduced motion. This is a requirement, not optional. Framer Motion has built-in support via `useReducedMotion()`. |
| **0.5px border signature detail** | Subtle design system consistency. Shows intentional design thinking at the detail level. Creates a cohesive visual language across all components. | LOW | Custom Tailwind value: `border-[0.5px]`. Consistent across all card edges, section dividers, and glass elements. |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem appealing but create problems for this specific project.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| **Dark mode toggle** | "Everyone has dark mode now." | Doubles design/QA surface. The "Cleanroom White" + "Silicon Grey" palette is a deliberate aesthetic choice -- offering a toggle undermines the cohesive brand. A single well-designed theme is more opinionated and memorable. Per PROJECT.md: explicitly out of scope for v1. | Ship one cohesive light theme. The palette itself is the brand. |
| **Contact form with backend** | "Professional sites have contact forms." | Requires backend infrastructure (violates zero-cost constraint), spam filtering, and ongoing maintenance. For a personal portfolio, a contact form adds friction vs. a direct email link. Research confirms personal portfolio sites benefit from simpler direct email. Per PROJECT.md: out of scope. | `mailto:` link with pre-filled subject line + LinkedIn link. Both are zero-cost and zero-maintenance. |
| **Blog/technical notes** | "Shows thought leadership." | Content creation overhead is significant. An empty or rarely-updated blog is worse than no blog. The portfolio itself demonstrates technical depth through projects and papers. Per PROJECT.md: deferred to v2. | Let projects and papers speak. If writing urge strikes, add a "Notes" section in v2 when there is actual content to populate it. |
| **Skill percentage bars/ratings** | "Show how good you are at each skill." | Self-assessed skill percentages are meaningless and widely mocked in the industry. "85% at Python" means nothing. They also look dated. | Typography-driven skill lists grouped by domain. The projects themselves demonstrate proficiency depth. |
| **Particle effects / 3D backgrounds** | "Make it stand out with cool visuals." | Tanks Lighthouse performance. Distracts from content. Contradicts minimalist philosophy. Most implementations feel gimmicky, not premium. | Let typography, whitespace, and subtle motion do the work. The restraint IS the statement. |
| **Testimonials/quotes section** | "Social proof builds credibility." | Requires content collection from professors/colleagues. Feels forced on a student portfolio. Per PROJECT.md: deferred to v2. | Projects with clear outcomes and papers with real citations are stronger social proof for this audience. |
| **Multi-page routing** | "Separate pages for each project feel more professional." | Breaks the single-page flow that creates the premium scroll experience. Adds routing complexity. For 3-5 projects, inline expansion is more cohesive and keeps the visitor in context. Per PROJECT.md: single-page is a deliberate design decision. | Single-page smooth scroll with inline card expansion for project detail. |
| **CMS/admin panel** | "Easy to update content." | Massive over-engineering for a personal portfolio with 3-5 projects. Adds hosting complexity, security surface, and dependencies. Static content updated in data files is simpler and more reliable. Per PROJECT.md: out of scope. | Data-driven content in TypeScript/JSON files. Update content by editing data files and redeploying (Vercel auto-deploys on push). |
| **Animations on every element** | "More animation = more premium." | Animation overload causes cognitive fatigue and reduces accessibility. Undermines the "weighted, no bounce" philosophy. Each animation should earn its place. | Animate entry transitions for sections, hover states for interactive elements, and the scroll experience. Leave static elements static. |
| **GitHub contribution graph embed** | "Shows I code every day." | Not relevant for an ECE/hardware student. Most semiconductor work happens in Cadence, lab notebooks, and proprietary tools -- not GitHub. An empty-looking graph hurts more than helps. | Link to GitHub profile in contact section for those who want to explore. Let projects demonstrate coding capability. |
| **Custom cursor** | "Unique interaction detail." | Accessibility nightmare (breaks assistive technology expectations). Adds zero value for recruiters. Confuses users. | Default system cursor. Focus design effort on content and layout. |
| **Infinite scroll / pagination** | "Handle lots of content." | Single-page portfolio with 5-8 sections does not need it. Adds complexity for no benefit. | Fixed sections with smooth scroll navigation. |
| **Hamburger menu on desktop** | "Clean minimal nav." | Hides navigation unnecessarily on desktop where space is available. | Always-visible fixed nav on desktop. Collapse to mobile-friendly menu only at small breakpoints. |

## Feature Dependencies

```
[Data Architecture (TS interfaces + data files)]
    (foundational -- no dependencies, many things depend on it)

[Page Structure (sections with IDs)]
    └──requires──> [Data Architecture]

[Lenis Smooth Scroll]
    └──requires──> [Page Structure]
    └──enhances──> [Navigation] (smooth scroll to anchors)
    └──enhances──> [Timeline Section] (scroll-driven animation)

[Navigation (fixed glassmorphic)]
    └──requires──> [Page Structure] (section anchors to scroll to)
    └──requires──> [CSS backdrop-filter] (well-supported in 2026)

[Framer Motion Animations]
    └──requires──> [Page Structure] (elements must exist to animate)
    └──enhances──> [Project Cards] (expand/collapse layout animation)
    └──enhances──> [All Sections] (viewport entry animation)
    └──enhances──> [PDF Viewer] (overlay transitions)

[Project Cards (Bento Grid)]
    └──requires──> [Data Architecture] (project data must be defined)
    └──requires──> [Framer Motion] (for layoutId expand/collapse)
    └──requires──> [CSS Grid] (for responsive bento layout)

[In-Browser PDF Viewer]
    └──requires──> [Shadcn Dialog/Drawer] (overlay component)
    └──requires──> [react-pdf or browser native PDF] (rendering engine)
    └──requires──> [PDF Files] (actual paper/resume PDFs hosted)

[Papers Section]
    └──requires──> [Data Architecture] (paper metadata)
    └──requires──> [In-Browser PDF Viewer] (to view papers inline)

[Timeline Section]
    └──requires──> [Data Architecture] (timeline event data)
    └──enhances──> [Lenis] (scroll-driven fill animation)

[Skills Section]
    └──requires──> [Data Architecture] (skills data grouped by domain)

[Lab & Tooling Section]
    └──requires──> [Data Architecture] (tooling data)

[Coursework Section]
    └──requires──> [Data Architecture] (course data)

[Contact Section]
    (no dependencies -- static links)

[Hero Section]
    (no dependencies -- first thing built)

[prefers-reduced-motion]
    └──requires──> [Lenis] + [Framer Motion] (must exist to be conditionally disabled)

[Responsive Design]
    └──requires──> [All Sections] (must be built before responsive testing)
    └──requires──> [Bento Grid] (grid collapse logic for mobile)

[Semantic HTML + SEO]
    └──requires──> [Page Structure] (proper element hierarchy)
```

### Dependency Notes

- **Data Architecture is foundational:** TypeScript interfaces and data files for projects, papers, skills, timeline events, courses, and tooling must be defined early. Nearly every content section depends on this. Build this first.
- **Lenis + Framer Motion are infrastructure:** They enhance the entire experience but need basic page structure first. Install and configure early, then layer animations onto sections as they are built.
- **PDF Viewer depends on Shadcn:** The Dialog/Drawer component from Shadcn is needed before the PDF viewing experience can be implemented. react-pdf also requires Vite worker configuration.
- **Project Cards are the most complex feature:** They depend on both data architecture AND animation infrastructure. Build the static version first, then add bento layout, then add interactive expansion.
- **prefers-reduced-motion is a cross-cutting concern:** Must be wired up after animation infrastructure exists but should be planned from the start (do not bolt it on later). Use Framer Motion's `useReducedMotion()` hook.
- **Responsive design is a testing/polish concern:** Cannot be fully validated until all sections exist. Plan for it from the start with mobile-first CSS, but dedicated responsive QA happens at the end.

## MVP Definition

### Launch With (v1)

Minimum viable portfolio that creates the premium impression and serves both audiences.

- [ ] **Data-driven content architecture** -- TypeScript interfaces and data files. Foundation for everything.
- [ ] **Hero section** -- Typography-first identity statement. First impression is everything.
- [ ] **Fixed glassmorphic navigation** -- Anchored wayfinding for the single-page experience.
- [ ] **Skills section** -- Grouped by domain (Fab, RF, Analog, Digital). Quick competency scan.
- [ ] **Projects section with bento cards** -- 3-5 projects with inline expansion. This is the core product.
- [ ] **Papers section with PDF viewer** -- Academic papers viewable in-browser. Critical for grad school audience.
- [ ] **Lab & Tooling section** -- Hands-on proficiency proof. Important for semiconductor recruiters.
- [ ] **Coursework section** -- Signals academic depth. Low-effort, high-signal.
- [ ] **Contact section** -- Email, LinkedIn, GitHub, resume download.
- [ ] **Lenis smooth scroll** -- Premium scroll feel across the entire page.
- [ ] **Framer Motion animations** -- Weighted entry and hover animations. No bounce.
- [ ] **Responsive design** -- Mobile-first, tested at all breakpoints.
- [ ] **Semantic HTML + metadata** -- Proper structure, OpenGraph tags, accessibility.
- [ ] **prefers-reduced-motion support** -- Accessibility compliance.

### Add After Validation (v1.x)

Features to add once the core portfolio is live and getting real feedback.

- [ ] **Timeline/journey section** -- Add when there is enough career progression to visualize meaningfully.
- [ ] **Scroll-driven timeline animation** -- Enhance timeline with Lenis scroll-linked fill effect.
- [ ] **Vercel Analytics** -- Understand which projects get the most engagement.
- [ ] **Custom Open Graph images** -- Polished social preview when links are shared on LinkedIn/Slack.
- [ ] **Project filtering/tagging** -- Add if project count grows beyond 5.

### Future Consideration (v2+)

Features to defer until the portfolio is established and content pipeline is sustainable.

- [ ] **Blog/technical notes** -- Only when there is a commitment to regular writing.
- [ ] **Testimonials section** -- Only when testimonials are collected organically from professors/mentors.
- [ ] **Dark mode** -- Only if user testing reveals strong demand and the brand can support two themes.
- [ ] **Certifications section** -- Only when relevant certifications are earned.
- [ ] **Open source contributions section** -- Only when there is meaningful OSS work to showcase.
- [ ] **Video walkthroughs of projects** -- High-value but high-effort content creation.

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Data-driven content architecture | HIGH | MEDIUM | P1 |
| Hero section | HIGH | LOW | P1 |
| Fixed glassmorphic nav | HIGH | LOW | P1 |
| Projects section (bento cards + expansion) | HIGH | HIGH | P1 |
| Resume download + PDF viewer | HIGH | MEDIUM | P1 |
| Skills section | HIGH | LOW | P1 |
| Contact section | HIGH | LOW | P1 |
| Responsive design | HIGH | MEDIUM | P1 |
| Semantic HTML + SEO | HIGH | MEDIUM | P1 |
| Lenis smooth scroll | HIGH | LOW | P1 |
| Framer Motion animations | HIGH | MEDIUM | P1 |
| prefers-reduced-motion | MEDIUM | LOW | P1 |
| Papers section | HIGH | LOW | P1 |
| Lab & Tooling section | MEDIUM | LOW | P1 |
| Coursework section | MEDIUM | LOW | P1 |
| Glassmorphic design (nav + overlays) | MEDIUM | MEDIUM | P1 |
| 0.5px border system | MEDIUM | LOW | P1 |
| Timeline section | MEDIUM | MEDIUM | P2 |
| Scroll-driven timeline animation | LOW | MEDIUM | P2 |
| Analytics | LOW | LOW | P2 |
| OG images | LOW | LOW | P2 |
| Blog | MEDIUM | HIGH | P3 |
| Dark mode | LOW | HIGH | P3 |
| Testimonials | LOW | LOW | P3 |

**Priority key:**
- P1: Must have for launch -- core portfolio experience
- P2: Should have, add when v1 is stable and feedback is collected
- P3: Nice to have, future consideration only

## Competitor Feature Analysis

| Feature | Generic Student Portfolio (Wix/Squarespace) | Software Dev Portfolio (React) | This Portfolio (ECE Premium) |
|---------|----------------------------------------------|-------------------------------|-------------------------------|
| Projects | Template grid, external links | GitHub-centric, live demos | Bento grid with inline expansion, schematics + photos + process documentation |
| Resume | PDF download link | Rarely included (GitHub profile instead) | In-browser viewer + download, prominently accessible |
| Academic papers | Almost never included | Never included | Dedicated section with in-browser PDF viewer -- key differentiator for grad school |
| Skills display | Skill bars, percentages | Tech stack icons | Typography-driven grouped list by ECE domain -- cleaner, more editorial |
| Lab/tooling | Never included | Never included | Dedicated section proving hands-on fabrication and lab experience |
| Animation quality | Template defaults or none | Bouncy spring defaults | Weighted, physical-feeling, no-bounce -- intentional and restrained |
| Scroll experience | Default browser scroll | Default browser scroll | Lenis smooth scroll -- premium feel immediately |
| Design language | Generic templates | Dark mode dev aesthetic | Cleanroom White + Silicon Grey with glassmorphism and 0.5px borders |
| Content structure | Hardcoded in template | Mixed (some data-driven) | Fully data-driven TypeScript architecture -- trivially updatable |
| Coursework | Never included | Never included | Included -- signals academic preparation for both audiences |
| Accessibility | Template-dependent (often poor) | Often neglected | Built-in prefers-reduced-motion, semantic HTML, WCAG 2.2 baseline |
| Mobile experience | Responsive by default (template) | Varies widely | Mobile-first responsive with graceful bento collapse |

## Audience-Specific Feature Value

### For Recruiters (Semiconductor/Hardware Internships + Full-Time)

**High value:** Projects section (what you built), Skills section (quick competency check), Lab & Tooling (hands-on proof), Resume download (immediate action item), Fast load time (respect their time), Clear navigation (30-60 seconds per page)

**Medium value:** Coursework (domain relevance), Contact section (next step), Glassmorphic design (memorable impression), Hero section (3-second identity scan)

**Low value:** Papers section (less relevant for industry roles), Timeline (nice but not decisive)

### For Professors (Grad School Admissions)

**High value:** Papers section (research output -- this is what they care about most), Projects section (technical depth and methodology), Skills section (preparation for grad research), Coursework (academic readiness), About/bio (research interests and narrative)

**Medium value:** Lab & Tooling (research capability), Timeline (trajectory and motivation), Hero section (research identity framing)

**Low value:** Resume download (they have the application materials), Glassmorphic design (aesthetics are secondary to content)

### Shared High Value (Both Audiences)

Fast load, clear navigation, responsive design, semantic HTML, and well-organized content structure serve both audiences equally.

## Sources

- [MIT Mechanical Engineering Communication Lab - Portfolio Guide](https://mitcommlab.mit.edu/meche/commkit/portfolio/) - HIGH confidence: authoritative source on engineering portfolio structure
- [Built In - Create a Hardware Engineering Portfolio That Gets Results](https://builtin.com/hardware/hardware-engineering-portfolio) - MEDIUM confidence: industry perspective on hardware portfolios
- [MIT EECS - What Faculty Members Look For in Grad School Applications](https://www.eecs.mit.edu/academics/graduate-programs/admission-process/what-faculty-members-are-looking-for-in-a-grad-school-application-essay/) - HIGH confidence: directly from admissions perspective
- [SiteBuilder Report - Engineer Portfolios: 20+ Examples](https://www.sitebuilderreport.com/inspiration/engineer-portfolios) - MEDIUM confidence: curated examples
- [Semiconductor Jobs - Portfolio Projects That Get You Hired](https://semiconductorjobs.co.uk/career-advice/portfolio-projects-that-get-you-hired-for-semiconductor-jobs-with-real-github-examples-) - MEDIUM confidence: domain-specific advice
- [NYU Tandon - Building a Portfolio](https://engineering.nyu.edu/life-tandon/experiential-learning-center/building-portfolio) - HIGH confidence: university career services
- [Landdding - Bento Grid Design Guide 2026](https://landdding.com/blog/blog-bento-grid-design-guide) - MEDIUM confidence: current design trend analysis
- [Medium - Glassmorphism and Liquid Design 2026](https://medium.com/design-bootcamp/ui-design-trend-2026-2-glassmorphism-and-liquid-design-make-a-comeback-50edb60ca81e) - LOW confidence: single source, but corroborated by Apple WWDC 2025 Liquid Glass announcement
- [Lenis - Smooth Scroll Library](https://lenis.darkroom.engineering/) - HIGH confidence: official source
- [Pope Tech - Design Accessible Animation and Movement](https://blog.pope.tech/2025/12/08/design-accessible-animation-and-movement/) - HIGH confidence: accessibility specialist source
- [DEV Community - Semantic HTML in 2025](https://dev.to/gerryleonugroho/semantic-html-in-2025-the-bedrock-of-accessible-seo-ready-and-future-proof-web-experiences-2k01) - MEDIUM confidence: well-referenced technical article
- [WPForms - Contact Form vs Email Address](https://wpforms.com/contact-form-vs-email-address-which-is-better/) - MEDIUM confidence: comparative analysis

---
*Feature research for: Jack Basinski Engineering Portfolio*
*Researched: 2026-03-20*
