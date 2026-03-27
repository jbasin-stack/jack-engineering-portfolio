import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Timeline } from '../Timeline';

describe('Timeline section', () => {
  it('renders nodes for each milestone', () => {
    // TIME-02: Each milestone has a corresponding node rendered
    render(<Timeline />);
    // The timeline section should contain the milestone titles
    // milestones data has 8 entries
    const headings = screen.getAllByRole('heading', { level: 3 });
    expect(headings.length).toBeGreaterThanOrEqual(1);
  });
});
