import { HeroContent } from './HeroContent';
import { ScrollIndicator } from './ScrollIndicator';

export function Hero() {
  return (
    <section id="hero" className="relative min-h-[75vh] overflow-hidden">
      {/* TODO: Add hero background effect (user to decide) */}

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
