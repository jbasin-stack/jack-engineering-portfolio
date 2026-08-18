import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Timeline } from '../Timeline';
import { milestones } from '../../../data/timeline';

// Mock IntersectionObserver for Motion whileInView support in jsdom
beforeAll(() => {
  globalThis.IntersectionObserver = class IntersectionObserver {
    constructor(private cb: IntersectionObserverCallback) {}
    observe() { /* noop */ }
    unobserve() { /* noop */ }
    disconnect() { /* noop */ }
    readonly root = null;
    readonly rootMargin = '';
    readonly thresholds = [] as number[];
    takeRecords() { return []; }
  } as unknown as typeof globalThis.IntersectionObserver;
});

describe('Timeline section', () => {
  // Will pass after Plan 02 implements editorial Timeline
  it('renders all 8 milestone entries', () => {
    render(<Timeline />);
    const articles = document.querySelectorAll('article');
    expect(articles.length).toBe(milestones.length);
  });

  // Will pass after Plan 02 implements editorial Timeline
  it('displays extracted year for each entry', () => {
    render(<Timeline />);
    // Years may appear multiple times (e.g. two entries in 2022)
    const years = [...new Set(milestones.map((m) => m.date.split(' ')[1]))];
    for (const year of years) {
      expect(screen.getAllByText(year).length).toBeGreaterThanOrEqual(1);
    }
  });

  // Will pass after Plan 02 implements editorial Timeline
  it('renders connector line element', () => {
    render(<Timeline />);
    const connector = document.querySelector('[data-testid="timeline-connector"]');
    expect(connector).not.toBeNull();
  });

  // Will pass after Plan 02 implements editorial Timeline
  it('renders dot markers for each entry', () => {
    render(<Timeline />);
    const dots = document.querySelectorAll('[data-testid="timeline-dot"]');
    expect(dots.length).toBe(milestones.length);
  });

  it('renders section heading', () => {
    render(<Timeline />);
    const heading = screen.getByRole('heading', { name: /timeline/i });
    expect(heading).toBeDefined();
  });
});
