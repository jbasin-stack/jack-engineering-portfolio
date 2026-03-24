import { lazy, Suspense } from 'react';
import { MotionConfig } from 'motion/react';
import { SmoothScroll } from './components/layout/SmoothScroll';
import { Hero } from './components/hero/Hero';
import { Navigation } from './components/layout/Navigation';
import { WhoAmI } from './components/sections/WhoAmI';
import { Skills } from './components/sections/Skills';
import { Tooling } from './components/sections/Tooling';
import { Timeline } from './components/sections/Timeline';
import { ProjectsSection } from './components/projects/ProjectsSection';
import { PapersSection } from './components/papers/PapersSection';
import { Contact } from './components/sections/Contact';

/** Dev-only lazy import: tree-shaken to null in production builds */
const AdminShell = import.meta.env.DEV
  ? lazy(() => import('./admin/AdminShell'))
  : null;

function App() {
  const isAdmin =
    import.meta.env.DEV &&
    new URLSearchParams(window.location.search).has('admin');

  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <Navigation />
        {AdminShell && isAdmin && (
          <Suspense fallback={null}>
            <AdminShell />
          </Suspense>
        )}
        <main>
          <Hero />
          <WhoAmI />
          <Skills />
          <Tooling />
          <Timeline />

          <ProjectsSection />
          <PapersSection />
        </main>
        <footer>
          <Contact />
        </footer>
      </SmoothScroll>
    </MotionConfig>
  );
}

export default App;
