import { describe, it, expect } from 'vitest';
import { toolingGroups } from '../tooling';

describe('tooling data', () => {
  it('exports toolingGroups as array of exactly 3 groups', () => {
    expect(Array.isArray(toolingGroups)).toBe(true);
    expect(toolingGroups).toHaveLength(3);
  });

  it('each group has a non-empty category string and items array with 3+ entries', () => {
    toolingGroups.forEach((group) => {
      expect(typeof group.category).toBe('string');
      expect(group.category.length).toBeGreaterThan(0);
      expect(Array.isArray(group.items)).toBe(true);
      expect(group.items.length).toBeGreaterThanOrEqual(3);
    });
  });

  it('every item in every group is a non-empty string', () => {
    toolingGroups.forEach((group) => {
      group.items.forEach((item) => {
        expect(typeof item).toBe('string');
        expect(item.length).toBeGreaterThan(0);
      });
    });
  });
});
