import { describe, it, expect } from 'vitest';
import { milestones } from '../timeline';

describe('timeline data', () => {
  it('exports milestones as array of 6-10 entries', () => {
    expect(Array.isArray(milestones)).toBe(true);
    expect(milestones.length).toBeGreaterThanOrEqual(6);
    expect(milestones.length).toBeLessThanOrEqual(10);
  });

  it('each milestone has non-empty date, title, and description strings', () => {
    milestones.forEach((m) => {
      expect(typeof m.date).toBe('string');
      expect(m.date.length).toBeGreaterThan(0);
      expect(typeof m.title).toBe('string');
      expect(m.title.length).toBeGreaterThan(0);
      expect(typeof m.description).toBe('string');
      expect(m.description.length).toBeGreaterThan(0);
    });
  });

  it('milestones are in chronological order', () => {
    const months: Record<string, number> = {
      Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
      Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
    };

    const timestamps = milestones.map((m) => {
      const [monthStr, yearStr] = m.date.split(' ');
      const month = months[monthStr] ?? 0;
      const year = parseInt(yearStr, 10);
      return year * 12 + month;
    });

    for (let i = 1; i < timestamps.length; i++) {
      expect(timestamps[i]).toBeGreaterThanOrEqual(timestamps[i - 1]);
    }
  });
});
