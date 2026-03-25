import { lazy, Suspense, useState, useCallback } from 'react';
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
import { useKeyboardShortcuts } from './admin/useKeyboardShortcuts';

/** Dev-only lazy import: tree-shaken to null in production builds */
const AdminShell = import.meta.env.DEV
  ? lazy(() => import('./admin/AdminShell'))
  : null;

function App() {
  const [adminOpen, setAdminOpen] = useState(
    () =>
      import.meta.env.DEV &&
      new URLSearchParams(window.location.search).has('admin')
  );

  const toggleAdmin = useCallback(() => {
    setAdminOpen((prev) => {
      const next = !prev;
      const url = new URL(window.location.href);
      if (next) {
        url.searchParams.set('admin', '');
      } else {
        url.searchParams.delete('admin');
      }
      window.history.replaceState({}, '', url.toString());
      return next;
    });
  }, []);

  const closeAdmin = useCallback(() => {
    setAdminOpen(false);
    const url = new URL(window.location.href);
    url.searchParams.delete('admin');
    window.history.replaceState({}, '', url.toString());
  }, []);

  // Noop handlers when panel is closed -- save/close only matter when open
  const noop = useCallback(() => {}, []);

  // Keyboard shortcuts always active (Ctrl+Shift+A toggle works when closed)
  // In production, useKeyboardShortcuts is tree-shaken via dead-code elimination
  useKeyboardShortcuts(adminOpen, toggleAdmin, noop, closeAdmin, false);

  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <Navigation />
        {AdminShell && adminOpen && (
          <Suspense fallback={null}>
            <AdminShell onClose={closeAdmin} />
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
