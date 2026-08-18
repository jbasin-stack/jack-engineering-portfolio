import { describe, it, expect } from 'vitest';
import { projects } from '../projects';

describe('projects data', () => {
  // Breadth floors were dropped when the v1.0 placeholder projects were removed;
  // the list now tracks real work only and grows via the admin panel.
  it('is a non-empty array of at most 12 entries', () => {
    expect(projects.length).toBeGreaterThanOrEqual(1);
    expect(projects.length).toBeLessThanOrEqual(12);
  });

  it('each project has all required fields', () => {
    for (const project of projects) {
      expect(project).toHaveProperty('id');
      expect(project).toHaveProperty('title');
      expect(project).toHaveProperty('brief');
      expect(project).toHaveProperty('summary');
      expect(project).toHaveProperty('thumbnail');
      expect(project).toHaveProperty('images');
      expect(project).toHaveProperty('domain');
      expect(project).toHaveProperty('techStack');
      expect(project).toHaveProperty('links');
      expect(project).toHaveProperty('featured');
    }
  });

  it('at least one project has featured: true', () => {
    const featuredCount = projects.filter((p) => p.featured).length;
    expect(featuredCount).toBeGreaterThanOrEqual(1);
  });

  it('domain values are drawn from the known domain vocabulary', () => {
    const validDomains = [
      'RF',
      'Fabrication',
      'Semiconductor Fabrication',
      'Analog',
      'Digital',
      'Mixed-Signal',
    ];
    for (const project of projects) {
      expect(validDomains).toContain(project.domain);
    }
  });

  it('all string fields are non-empty', () => {
    for (const project of projects) {
      expect(project.id.length).toBeGreaterThan(0);
      expect(project.title.length).toBeGreaterThan(0);
      expect(project.brief.length).toBeGreaterThan(0);
      expect(project.summary.length).toBeGreaterThan(0);
      expect(project.thumbnail.length).toBeGreaterThan(0);
      expect(project.domain.length).toBeGreaterThan(0);
    }
  });

  it('techStack is a non-empty array of non-empty strings', () => {
    for (const project of projects) {
      expect(project.techStack.length).toBeGreaterThan(0);
      for (const tech of project.techStack) {
        expect(typeof tech).toBe('string');
        expect(tech.length).toBeGreaterThan(0);
      }
    }
  });

  it('every project declares a domain', () => {
    const uniqueDomains = new Set(projects.map((p) => p.domain));
    expect(uniqueDomains.size).toBeGreaterThanOrEqual(1);
    expect(uniqueDomains.has('')).toBe(false);
  });
});
