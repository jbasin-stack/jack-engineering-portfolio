import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

describe('code splitting and lazy loading', () => {
  it('LazyPdfViewer.tsx exists and uses React.lazy', () => {
    const lazyPath = resolve(__dirname, '../components/pdf/LazyPdfViewer.tsx');
    expect(existsSync(lazyPath)).toBe(true);
    const content = readFileSync(lazyPath, 'utf-8');
    expect(content).toContain('lazy(');
    expect(content).toContain('Suspense');
  });

  it('PapersSection imports LazyPdfViewer instead of PdfViewer', () => {
    const papersPath = resolve(__dirname, '../components/papers/PapersSection.tsx');
    const content = readFileSync(papersPath, 'utf-8');
    expect(content).toContain('LazyPdfViewer');
    expect(content).not.toMatch(/import\s*\{[^}]*PdfViewer[^}]*\}\s*from\s*['"]\.\.\/pdf\/PdfViewer['"]/);
  });

  it('Contact imports LazyPdfViewer instead of PdfViewer', () => {
    const contactPath = resolve(__dirname, '../components/sections/Contact.tsx');
    const content = readFileSync(contactPath, 'utf-8');
    expect(content).toContain('LazyPdfViewer');
    expect(content).not.toMatch(/import\s*\{[^}]*PdfViewer[^}]*\}\s*from\s*['"]\.\.\/pdf\/PdfViewer['"]/);
  });

  it('main.tsx imports @fontsource-variable/inter', () => {
    const mainPath = resolve(__dirname, '../main.tsx');
    const content = readFileSync(mainPath, 'utf-8');
    expect(content).toContain('@fontsource-variable/inter');
  });
});
