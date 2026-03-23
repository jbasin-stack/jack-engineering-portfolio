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

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <Navigation />
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
