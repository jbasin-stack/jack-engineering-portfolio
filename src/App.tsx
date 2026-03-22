import { MotionConfig } from 'motion/react';
import { SmoothScroll } from './components/layout/SmoothScroll';
import { Hero } from './components/hero/Hero';
import { Navigation } from './components/layout/Navigation';

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <Navigation />
        <main>
          <Hero />

          {/* Placeholder sections for scrolling and nav targets */}
          <section id="background" className="min-h-screen px-6 py-24">
            <h2 className="text-2xl font-bold text-ink">Background</h2>
          </section>
          <section id="skills" className="min-h-screen px-6 py-24">
            <h2 className="text-2xl font-bold text-ink">Skills</h2>
          </section>
          <section id="coursework" className="min-h-screen px-6 py-24">
            <h2 className="text-2xl font-bold text-ink">Coursework</h2>
          </section>
          <section id="tooling" className="min-h-screen px-6 py-24">
            <h2 className="text-2xl font-bold text-ink">Lab & Tooling</h2>
          </section>
          <section id="projects" className="min-h-screen px-6 py-24">
            <h2 className="text-2xl font-bold text-ink">Projects</h2>
          </section>
          <section id="papers" className="min-h-screen px-6 py-24">
            <h2 className="text-2xl font-bold text-ink">Papers</h2>
          </section>
          <section id="contact" className="min-h-screen px-6 py-24">
            <h2 className="text-2xl font-bold text-ink">Contact</h2>
          </section>
        </main>
      </SmoothScroll>
    </MotionConfig>
  );
}

export default App;
