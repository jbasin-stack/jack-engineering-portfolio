import { describe, it, expect } from 'vitest';
import { AuroraBackground } from '../AuroraBackground';
import { Particles } from '../Particles';
import { NoisyBackground } from '../NoisyBackground';
import { CardSpotlight } from '../CardSpotlight';
import { AnimatedGridPattern } from '../AnimatedGridPattern';

describe('effect component exports', () => {
  it('AuroraBackground exports as a function', () => {
    expect(typeof AuroraBackground).toBe('function');
  });

  it('Particles exports as a function', () => {
    expect(typeof Particles).toBe('function');
  });

  it('NoisyBackground exports as a function', () => {
    expect(typeof NoisyBackground).toBe('function');
  });

  it('CardSpotlight exports as a function', () => {
    expect(typeof CardSpotlight).toBe('function');
  });

  it('AnimatedGridPattern exports as a function', () => {
    expect(typeof AnimatedGridPattern).toBe('function');
  });
});
