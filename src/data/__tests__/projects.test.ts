import { describe, it, expect } from 'vitest';
import { projects } from '../projects';

describe('projects data', () => {
  it('is an array of 3-5 entries', () => {
    expect(projects.length).toBeGreaterThanOrEqual(3);
    expect(projects.length).toBeLessThanOrEqual(5);
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

  it('domain values are one of RF, Fabrication, Analog, Digital', () => {
    const validDomains = ['RF', 'Fabrication', 'Analog', 'Digital'];
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

  it('domains span at least 3 categories', () => {
    const uniqueDomains = new Set(projects.map((p) => p.domain));
    expect(uniqueDomains.size).toBeGreaterThanOrEqual(3);
  });
});
