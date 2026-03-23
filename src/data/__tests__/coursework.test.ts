import { describe, it, expect } from 'vitest';
import { courses } from '../coursework';

describe('coursework data', () => {
  it('exports courses as array of at least 6 entries', () => {
    expect(Array.isArray(courses)).toBe(true);
    expect(courses.length).toBeGreaterThanOrEqual(6);
  });

  it('each course has a code matching /^EE \\d{3}$/', () => {
    courses.forEach((course) => {
      expect(course.code).toMatch(/^EE \d{3}$/);
    });
  });

  it('each course has non-empty name and descriptor strings', () => {
    courses.forEach((course) => {
      expect(typeof course.name).toBe('string');
      expect(course.name.length).toBeGreaterThan(0);
      expect(typeof course.descriptor).toBe('string');
      expect(course.descriptor.length).toBeGreaterThan(0);
    });
  });

  it('no duplicate course codes', () => {
    const codes = courses.map((c) => c.code);
    expect(new Set(codes).size).toBe(codes.length);
  });
});
