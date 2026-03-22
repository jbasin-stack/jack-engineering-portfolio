import { HeroContent } from './HeroContent';
import { ScrollIndicator } from './ScrollIndicator';

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[75vh] items-center justify-center bg-gradient-to-b from-cleanroom to-silicon-50 px-6"
    >
      <HeroContent />
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <ScrollIndicator />
      </div>
    </section>
  );
}
