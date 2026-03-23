import { describe, it, expect } from 'vitest';
import { skillGroups } from '../skills';

describe('skills data', () => {
  it('exports skillGroups as array of exactly 4 groups', () => {
    expect(Array.isArray(skillGroups)).toBe(true);
    expect(skillGroups).toHaveLength(4);
  });

  it('each group has a non-empty domain string and skills array with 4+ entries', () => {
    skillGroups.forEach((group) => {
      expect(typeof group.domain).toBe('string');
      expect(group.domain.length).toBeGreaterThan(0);
      expect(Array.isArray(group.skills)).toBe(true);
      expect(group.skills.length).toBeGreaterThanOrEqual(4);
    });
  });

  it('domains are exactly Fabrication, RF, Analog, Digital', () => {
    const domains = skillGroups.map((g) => g.domain).sort();
    expect(domains).toEqual(['Analog', 'Digital', 'Fabrication', 'RF']);
  });

  it('every skill in every group is a non-empty string', () => {
    skillGroups.forEach((group) => {
      group.skills.forEach((skill) => {
        expect(typeof skill).toBe('string');
        expect(skill.length).toBeGreaterThan(0);
      });
    });
  });
});
