import { describe, it, expect } from 'vitest';
import { navItems } from '../navigation';

describe('navigation data', () => {
  it('exports navItems as an array of exactly 4 items', () => {
    expect(Array.isArray(navItems)).toBe(true);
    expect(navItems).toHaveLength(4);
  });

  it('has Background as the first item with 3 children', () => {
    const background = navItems[0];
    expect(background.label).toBe('Background');
    expect(background.children).toBeDefined();
    expect(background.children).toHaveLength(3);
  });

  it('Background children are Skills, Coursework, and Lab & Tooling', () => {
    const children = navItems[0].children!;
    expect(children[0].label).toBe('Skills');
    expect(children[1].label).toBe('Coursework');
    expect(children[2].label).toBe('Lab & Tooling');
  });

  it('every nav item has a non-empty label and href starting with #', () => {
    navItems.forEach((item) => {
      expect(item.label).toBeTruthy();
      expect(item.href).toMatch(/^#/);
    });
  });

  it('child items also have proper label and href', () => {
    navItems.forEach((item) => {
      if (item.children) {
        item.children.forEach((child) => {
          expect(child.label).toBeTruthy();
          expect(child.href).toMatch(/^#/);
        });
      }
    });
  });
});
