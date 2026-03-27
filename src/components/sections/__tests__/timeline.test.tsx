import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Timeline } from '../Timeline';

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
    expect(articles.length).toBe(8);
  });

  // Will pass after Plan 02 implements editorial Timeline
  it('displays extracted year for each entry', () => {
    render(<Timeline />);
    expect(screen.getByText('2021')).toBeDefined();
    expect(screen.getByText('2022')).toBeDefined();
    expect(screen.getByText('2023')).toBeDefined();
    expect(screen.getByText('2024')).toBeDefined();
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
    expect(dots.length).toBe(8);
  });

  it('renders section heading', () => {
    render(<Timeline />);
    const heading = screen.getByRole('heading', { name: /timeline/i });
    expect(heading).toBeDefined();
  });
});
