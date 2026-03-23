import { AuroraBackground } from '@/components/effects/AuroraBackground';
import { Particles } from '@/components/effects/Particles';
import { HeroContent } from './HeroContent';
import { ScrollIndicator } from './ScrollIndicator';

export function Hero() {
  return (
    <section id="hero" className="relative min-h-[75vh] overflow-hidden">
      {/* Layer 1: Aurora gradient background */}
      <AuroraBackground className="absolute inset-0" showRadialGradient>
        <div />
      </AuroraBackground>

      {/* Layer 2: Floating particles with mouse magnetism */}
      <Particles
        className="absolute inset-0 z-[1]"
        quantity={60}
        color="#7c5eb5"
        staticity={80}
        ease={60}
        size={0.4}
      />

      {/* Layer 3: Content above all effects */}
      <div className="relative z-10 flex min-h-[75vh] items-center justify-center px-6">
        <HeroContent />
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <ScrollIndicator />
        </div>
      </div>
    </section>
  );
}
