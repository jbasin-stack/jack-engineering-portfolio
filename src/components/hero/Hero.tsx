import { HeroContent } from './HeroContent';
import { ScrollIndicator } from './ScrollIndicator';

export function Hero() {
  return (
    <section id="hero" className="relative min-h-[75vh] overflow-hidden">
      {/* Breathing gradient background */}
      <div className="hero-gradient pointer-events-none absolute inset-0" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 flex min-h-[75vh] items-center justify-center px-6">
        <HeroContent />
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <ScrollIndicator />
        </div>
      </div>
    </section>
  );
}
