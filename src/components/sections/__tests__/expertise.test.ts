import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Expertise } from '../Expertise';

describe('Expertise section', () => {
  it('renders all domain tabs', () => {
    // SKTL-01: All 4 domain tabs are rendered
    render(<Expertise />);
    expect(screen.getByRole('tab', { name: /fabrication/i })).toBeDefined();
    expect(screen.getByRole('tab', { name: /rf & test/i })).toBeDefined();
    expect(screen.getByRole('tab', { name: /analog/i })).toBeDefined();
    expect(screen.getByRole('tab', { name: /digital/i })).toBeDefined();
  });

  it('has glassmorphic panel classes', () => {
    // SKTL-03: Tab panel uses glassmorphic styling
    render(<Expertise />);
    const panel = screen.getByRole('tabpanel');
    expect(panel.className).toMatch(/backdrop-blur/);
    expect(panel.className).toMatch(/border/);
  });
});
