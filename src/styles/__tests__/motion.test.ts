import { describe, it, expect } from 'vitest';
import { easing, sectionVariants, fadeUpVariant, layoutTransition } from '../motion';

describe('motion config', () => {
  it('easing.out is a 4-element array of numbers', () => {
    expect(easing.out).toHaveLength(4);
    easing.out.forEach((val) => {
      expect(typeof val).toBe('number');
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThanOrEqual(1);
    });
  });

  it('easing.inOut is a 4-element array of numbers', () => {
    expect(easing.inOut).toHaveLength(4);
    easing.inOut.forEach((val) => {
      expect(typeof val).toBe('number');
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThanOrEqual(1);
    });
  });

  it('sectionVariants has hidden and visible keys', () => {
    expect(sectionVariants).toHaveProperty('hidden');
    expect(sectionVariants).toHaveProperty('visible');
  });

  it('sectionVariants.visible has transition.staggerChildren defined', () => {
    const visible = sectionVariants.visible as { transition?: { staggerChildren?: number } };
    expect(visible?.transition?.staggerChildren).toBeDefined();
  });

  it('fadeUpVariant has hidden and visible keys', () => {
    expect(fadeUpVariant).toHaveProperty('hidden');
    expect(fadeUpVariant).toHaveProperty('visible');
  });

  it('fadeUpVariant.visible has transition.duration defined (confirms tween)', () => {
    const visible = fadeUpVariant.visible as { transition?: { duration?: number } };
    expect(visible?.transition?.duration).toBeDefined();
    expect(typeof visible?.transition?.duration).toBe('number');
  });

  it('layoutTransition has duration and ease defined (confirms tween)', () => {
    expect(layoutTransition.duration).toBeDefined();
    expect(typeof layoutTransition.duration).toBe('number');
    expect(layoutTransition.ease).toBeDefined();
    expect(Array.isArray(layoutTransition.ease)).toBe(true);
  });

  it('NO animation config contains type: spring', () => {
    const allConfigs = [sectionVariants, fadeUpVariant, layoutTransition, easing];

    function deepCheckForSpring(obj: unknown, path: string = ''): void {
      if (obj === null || obj === undefined) return;
      if (typeof obj !== 'object') return;

      const record = obj as Record<string, unknown>;
      for (const key of Object.keys(record)) {
        if (key === 'type' && record[key] === 'spring') {
          throw new Error(`Found type: 'spring' at ${path}.${key}`);
        }
        deepCheckForSpring(record[key], `${path}.${key}`);
      }
    }

    allConfigs.forEach((config, index) => {
      expect(() => deepCheckForSpring(config, `config[${index}]`)).not.toThrow();
    });
  });

});
