import { lazy, Suspense, useState, useCallback, useEffect } from 'react';
import { MotionConfig } from 'motion/react';
import { SmoothScroll } from './components/layout/SmoothScroll';
import { Hero } from './components/hero/Hero';
import { Navigation } from './components/layout/Navigation';
import { WhoAmI } from './components/sections/WhoAmI';
import { Expertise } from './components/sections/Expertise';
import { Timeline } from './components/sections/Timeline';
import { ProjectCarousel } from './components/projects/ProjectCarousel';
import { PapersSection } from './components/papers/PapersSection';
import { Contact } from './components/sections/Contact';
import { Footer } from './components/layout/Footer';

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

  // DEV-only: Ctrl+Shift+A toggle shortcut (inline, not imported from admin/)
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        toggleAdmin();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggleAdmin]);

  return (
    <MotionConfig reducedMotion="user">
      {AdminShell && adminOpen && (
        <Suspense fallback={null}>
          <AdminShell onClose={closeAdmin} />
        </Suspense>
      )}
      <SmoothScroll>
        <Navigation />
        <main>
          <Hero />
          <WhoAmI />
          <Expertise />
          <Timeline />

          <ProjectCarousel />
          <PapersSection />
        </main>
        <footer>
          <Contact />
          <Footer />
        </footer>
      </SmoothScroll>
    </MotionConfig>
  );
}

export default App;
