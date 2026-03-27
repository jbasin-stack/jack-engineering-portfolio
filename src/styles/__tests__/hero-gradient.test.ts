import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const cssContent = readFileSync(
  resolve(__dirname, '..', 'app.css'),
  'utf-8',
);

const heroTsxContent = readFileSync(
  resolve(__dirname, '..', '..', 'components', 'hero', 'Hero.tsx'),
  'utf-8',
);

describe('hero gradient custom properties', () => {
  it('defines --hero-gradient-center in :root block', () => {
    const rootBlock = cssContent.match(/:root\s*\{[^}]*--hero-gradient-center:/s);
    expect(rootBlock).not.toBeNull();
  });

  it('defines --hero-gradient-edge in :root block', () => {
    const rootBlock = cssContent.match(/:root\s*\{[^}]*--hero-gradient-edge:/s);
    expect(rootBlock).not.toBeNull();
  });

  it('defines --hero-gradient-center in .dark block', () => {
    const darkBlock = cssContent.match(/\.dark\s*\{[^}]*--hero-gradient-center:/s);
    expect(darkBlock).not.toBeNull();
  });

  it('defines --hero-gradient-edge in .dark block', () => {
    const darkBlock = cssContent.match(/\.dark\s*\{[^}]*--hero-gradient-edge:/s);
    expect(darkBlock).not.toBeNull();
  });

  it('--hero-gradient-center uses oklch with hue in 295-306 range (purple hint)', () => {
    // Match the :root definition to get the center value
    const centerMatch = cssContent.match(/--hero-gradient-center:\s*oklch\([^)]*\b(29[5-9]|30[0-6])\b/);
    expect(centerMatch).not.toBeNull();
  });

  it('--hero-gradient-edge uses oklch with hue 250 (blue)', () => {
    const edgeMatch = cssContent.match(/--hero-gradient-edge:\s*oklch\([^)]*\b250\b/);
    expect(edgeMatch).not.toBeNull();
  });
});

describe('hero breathing animation', () => {
  it('defines @keyframes hero-breathe with opacity values', () => {
    expect(cssContent).toContain('@keyframes hero-breathe');
    const keyframeBlock = cssContent.match(/@keyframes hero-breathe\s*\{[\s\S]*?opacity:\s*0\.\d[\s\S]*?\}/);
    expect(keyframeBlock).not.toBeNull();
  });

  it('.hero-gradient class has radial-gradient using custom properties', () => {
    const gradientMatch = cssContent.match(
      /\.hero-gradient\s*\{[^}]*radial-gradient\([^)]*var\(--hero-gradient-center\)[^)]*var\(--hero-gradient-edge\)/s,
    );
    expect(gradientMatch).not.toBeNull();
  });

  it('.hero-gradient class has animation referencing hero-breathe', () => {
    const animMatch = cssContent.match(/\.hero-gradient\s*\{[^}]*animation:[^}]*hero-breathe/s);
    expect(animMatch).not.toBeNull();
  });

  it('animation duration is between 6-8 seconds', () => {
    const durationMatch = cssContent.match(/\.hero-gradient\s*\{[^}]*animation:[^}]*([6-8])s/s);
    expect(durationMatch).not.toBeNull();
  });
});

describe('hero gradient reduced-motion', () => {
  it('disables .hero-gradient animation in prefers-reduced-motion block', () => {
    const reducedBlock = cssContent.match(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*?\.hero-gradient\s*\{[^}]*animation:\s*none/,
    );
    expect(reducedBlock).not.toBeNull();
  });

  it('sets static opacity around 0.4 in reduced-motion', () => {
    const reducedBlock = cssContent.match(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*?\.hero-gradient\s*\{[^}]*opacity:\s*0\.4/,
    );
    expect(reducedBlock).not.toBeNull();
  });
});

describe('hero gradient div in Hero.tsx', () => {
  it('contains a div with class hero-gradient', () => {
    expect(heroTsxContent).toContain('hero-gradient');
  });

  it('gradient div has aria-hidden="true"', () => {
    expect(heroTsxContent).toContain('aria-hidden="true"');
  });

  it('gradient div has pointer-events-none', () => {
    expect(heroTsxContent).toContain('pointer-events-none');
  });
});
