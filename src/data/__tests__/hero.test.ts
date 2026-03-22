import { describe, it, expect } from 'vitest';
import { heroData } from '../hero';

describe('hero data', () => {
  it('exports heroData with name, subtitle, and narrative as non-empty strings', () => {
    expect(typeof heroData.name).toBe('string');
    expect(heroData.name.length).toBeGreaterThan(0);

    expect(typeof heroData.subtitle).toBe('string');
    expect(heroData.subtitle.length).toBeGreaterThan(0);

    expect(typeof heroData.narrative).toBe('string');
    expect(heroData.narrative.length).toBeGreaterThan(0);
  });

  it('has name set to Jack Basinski', () => {
    expect(heroData.name).toBe('Jack Basinski');
  });

  it('has socialLinks with at least 2 entries', () => {
    expect(Array.isArray(heroData.socialLinks)).toBe(true);
    expect(heroData.socialLinks.length).toBeGreaterThanOrEqual(2);
  });

  it('each social link has platform, url, and icon fields', () => {
    heroData.socialLinks.forEach((link) => {
      expect(link.platform).toBeTruthy();
      expect(link.url).toBeTruthy();
      expect(link.icon).toBeTruthy();
    });
  });
});
