import { MotionConfig } from 'motion/react';
import { SmoothScroll } from './components/layout/SmoothScroll';
import { Hero } from './components/hero/Hero';
import { Navigation } from './components/layout/Navigation';
import { Skills } from './components/sections/Skills';
import { Tooling } from './components/sections/Tooling';
import { Coursework } from './components/sections/Coursework';
import { Timeline } from './components/sections/Timeline';
import { Contact } from './components/sections/Contact';

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <Navigation />
        <main>
          <Hero />
          <Skills />
          <Tooling />
          <Coursework />
          <Timeline />

          {/* Phase 3 placeholders */}
          <section id="projects" className="px-6 py-24">
            <div className="mx-auto max-w-5xl">
              <h2 className="text-2xl font-bold text-ink">Projects</h2>
            </div>
          </section>
          <section id="papers" className="px-6 py-24">
            <div className="mx-auto max-w-5xl">
              <h2 className="text-2xl font-bold text-ink">Papers</h2>
            </div>
          </section>

          <Contact />
        </main>
      </SmoothScroll>
    </MotionConfig>
  );
}

export default App;
