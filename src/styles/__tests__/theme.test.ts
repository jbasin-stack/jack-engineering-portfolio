import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const cssContent = readFileSync(
  resolve(__dirname, '..', 'app.css'),
  'utf-8',
);

describe('dark mode CSS infrastructure', () => {
  it('has a .dark block with --background token', () => {
    // Match .dark { ... --background: ... } block
    const darkBlock = cssContent.match(/\.dark\s*\{[^}]*--background:/s);
    expect(darkBlock).not.toBeNull();
  });

  it('has a .dark block with --foreground token', () => {
    const darkBlock = cssContent.match(/\.dark\s*\{[^}]*--foreground:/s);
    expect(darkBlock).not.toBeNull();
  });

  it('has a .dark block with --card token', () => {
    const darkBlock = cssContent.match(/\.dark\s*\{[^}]*--card:/s);
    expect(darkBlock).not.toBeNull();
  });

  it('has a .dark block with --popover token', () => {
    const darkBlock = cssContent.match(/\.dark\s*\{[^}]*--popover:/s);
    expect(darkBlock).not.toBeNull();
  });

  it('has color-scheme: dark inside .dark block', () => {
    const darkBlock = cssContent.match(/\.dark\s*\{[^}]*color-scheme:\s*dark/s);
    expect(darkBlock).not.toBeNull();
  });
});

describe('@custom-variant dark selector', () => {
  it('uses :where(.dark, .dark *) selector for zero specificity', () => {
    expect(cssContent).toContain('@custom-variant dark (&:where(.dark, .dark *))');
  });

  it('does not use the old buggy :is(.dark *) selector', () => {
    expect(cssContent).not.toContain('(&:is(.dark *))');
  });
});

describe('theme transition rules', () => {
  it('has transition for background-color, color, and border-color', () => {
    expect(cssContent).toContain('background-color 300ms ease');
    expect(cssContent).toContain('color 300ms ease');
    expect(cssContent).toContain('border-color 300ms ease');
  });

  it('has no-transition suppression rule', () => {
    expect(cssContent).toContain('html.no-transition');
    expect(cssContent).toContain('transition: none !important');
  });

  it('suppresses transitions on media elements', () => {
    // img, video, canvas, svg should have transition: none
    expect(cssContent).toMatch(/img.*transition:\s*none\s*!important/s);
  });
});

describe('gradient custom properties', () => {
  it('defines --gradient-top in :root', () => {
    const rootBlock = cssContent.match(/:root\s*\{[^}]*--gradient-top:/s);
    expect(rootBlock).not.toBeNull();
  });

  it('defines --gradient-bottom in :root', () => {
    const rootBlock = cssContent.match(/:root\s*\{[^}]*--gradient-bottom:/s);
    expect(rootBlock).not.toBeNull();
  });

  it('defines --gradient-top in .dark block', () => {
    const darkBlock = cssContent.match(/\.dark\s*\{[^}]*--gradient-top:/s);
    expect(darkBlock).not.toBeNull();
  });

  it('defines --gradient-bottom in .dark block', () => {
    const darkBlock = cssContent.match(/\.dark\s*\{[^}]*--gradient-bottom:/s);
    expect(darkBlock).not.toBeNull();
  });

  it('body has linear-gradient background-image', () => {
    expect(cssContent).toContain('linear-gradient(to bottom, var(--gradient-top), var(--gradient-bottom))');
  });
});

describe('color-scheme property', () => {
  it('sets color-scheme: light in :root', () => {
    const rootBlock = cssContent.match(/:root\s*\{[^}]*color-scheme:\s*light/s);
    expect(rootBlock).not.toBeNull();
  });

  it('sets color-scheme: dark in .dark block', () => {
    const darkBlock = cssContent.match(/\.dark\s*\{[^}]*color-scheme:\s*dark/s);
    expect(darkBlock).not.toBeNull();
  });
});
