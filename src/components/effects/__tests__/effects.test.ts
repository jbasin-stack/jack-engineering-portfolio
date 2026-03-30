import { describe, it, expect } from 'vitest';
import { CardSpotlight } from '../CardSpotlight';

describe('effect component exports', () => {
  it('CardSpotlight exports as a function', () => {
    expect(typeof CardSpotlight).toBe('function');
  });
});
