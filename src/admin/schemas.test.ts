import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import {
  heroSchema,
  contactSchema,
  navItemSchema,
  skillGroupSchema,
  toolingGroupSchema,
  timelineMilestoneSchema,
  courseSchema,
  paperSchema,
  projectSchema,
  socialLinkSchema,
  projectLinkSchema,
} from './schemas';

describe('heroSchema', () => {
  it('accepts valid HeroData', () => {
    const result = heroSchema.safeParse({
      name: 'Jack',
      subtitle: 'Engineer',
      narrative: 'Builds things',
      socialLinks: [{ platform: 'GitHub', url: 'https://github.com', icon: 'github' }],
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing name', () => {
    const result = heroSchema.safeParse({
      subtitle: 'Engineer',
      narrative: 'Builds things',
      socialLinks: [],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const flat = z.flattenError(result.error);
      expect(flat.fieldErrors).toHaveProperty('name');
    }
  });
});

describe('contactSchema', () => {
  it('accepts valid ContactData', () => {
    const result = contactSchema.safeParse({
      tagline: 'Get in touch',
      email: 'jack@example.com',
      resumePath: '/resume.pdf',
      socialLinks: [],
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing email', () => {
    const result = contactSchema.safeParse({
      tagline: 'Get in touch',
      resumePath: '/resume.pdf',
      socialLinks: [],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const flat = z.flattenError(result.error);
      expect(flat.fieldErrors).toHaveProperty('email');
    }
  });
});

describe('navItemSchema', () => {
  it('accepts valid NavItem', () => {
    const result = navItemSchema.safeParse({
      label: 'Home',
      href: '#home',
    });
    expect(result.success).toBe(true);
  });

  it('accepts NavItem with valid children', () => {
    const result = navItemSchema.safeParse({
      label: 'Background',
      href: '#background',
      children: [{ label: 'Skills', href: '#skills' }],
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing label', () => {
    const result = navItemSchema.safeParse({
      href: '#home',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const flat = z.flattenError(result.error);
      expect(flat.fieldErrors).toHaveProperty('label');
    }
  });
});

describe('skillGroupSchema', () => {
  it('accepts valid SkillGroup', () => {
    const result = skillGroupSchema.safeParse({
      domain: 'Embedded Systems',
      skills: ['C', 'C++', 'VHDL'],
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing domain', () => {
    const result = skillGroupSchema.safeParse({
      skills: ['C'],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const flat = z.flattenError(result.error);
      expect(flat.fieldErrors).toHaveProperty('domain');
    }
  });

  it('accepts empty skills array', () => {
    const result = skillGroupSchema.safeParse({
      domain: 'New Domain',
      skills: [],
    });
    expect(result.success).toBe(true);
  });
});

describe('toolingGroupSchema', () => {
  it('accepts valid ToolingGroup', () => {
    const result = toolingGroupSchema.safeParse({
      category: 'IDEs',
      items: ['VS Code', 'CLion'],
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing category', () => {
    const result = toolingGroupSchema.safeParse({
      items: ['VS Code'],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const flat = z.flattenError(result.error);
      expect(flat.fieldErrors).toHaveProperty('category');
    }
  });

  it('accepts empty items array', () => {
    const result = toolingGroupSchema.safeParse({
      category: 'New Category',
      items: [],
    });
    expect(result.success).toBe(true);
  });
});

describe('timelineMilestoneSchema', () => {
  it('accepts valid TimelineMilestone', () => {
    const result = timelineMilestoneSchema.safeParse({
      date: '2025-01',
      title: 'Started UW',
      description: 'Began studying ECE',
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing title', () => {
    const result = timelineMilestoneSchema.safeParse({
      date: '2025-01',
      description: 'Began studying ECE',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const flat = z.flattenError(result.error);
      expect(flat.fieldErrors).toHaveProperty('title');
    }
  });

  it('accepts milestone with optional image', () => {
    const result = timelineMilestoneSchema.safeParse({
      date: '2024-06',
      title: 'Research internship',
      description: 'Worked on RF circuits',
      image: '/timeline/some-image.jpg',
    });
    expect(result.success).toBe(true);
  });

  it('accepts milestone without image field', () => {
    const result = timelineMilestoneSchema.safeParse({
      date: '2023-09',
      title: 'Started UW',
      description: 'Began studying ECE',
    });
    expect(result.success).toBe(true);
  });
});

describe('courseSchema', () => {
  it('accepts valid Course', () => {
    const result = courseSchema.safeParse({
      code: 'ECE 250',
      name: 'Algorithms',
      descriptor: 'Data structures and algorithms',
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing code', () => {
    const result = courseSchema.safeParse({
      name: 'Algorithms',
      descriptor: 'Data structures and algorithms',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const flat = z.flattenError(result.error);
      expect(flat.fieldErrors).toHaveProperty('code');
    }
  });
});

describe('paperSchema', () => {
  it('accepts valid Paper', () => {
    const result = paperSchema.safeParse({
      id: 'lna-design',
      title: 'LNA Design',
      descriptor: 'Low noise amplifier design paper',
      pdfPath: '/papers/lna-design.pdf',
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing id', () => {
    const result = paperSchema.safeParse({
      title: 'LNA Design',
      descriptor: 'Low noise amplifier design paper',
      pdfPath: '/papers/lna-design.pdf',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const flat = z.flattenError(result.error);
      expect(flat.fieldErrors).toHaveProperty('id');
    }
  });
});

describe('projectSchema', () => {
  it('accepts valid Project', () => {
    const result = projectSchema.safeParse({
      id: 'lna-design',
      title: 'LNA Design',
      brief: 'A low noise amplifier',
      summary: 'Detailed summary of the LNA project',
      thumbnail: '/projects/lna-design.svg',
      images: ['/projects/lna-1.png'],
      domain: 'RF Engineering',
      techStack: ['ADS', 'MATLAB'],
      links: [{ label: 'GitHub', url: 'https://github.com' }],
      featured: true,
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing title', () => {
    const result = projectSchema.safeParse({
      id: 'lna-design',
      brief: 'A low noise amplifier',
      summary: 'Detailed summary',
      thumbnail: '/projects/lna-design.svg',
      images: [],
      domain: 'RF Engineering',
      techStack: [],
      links: [],
      featured: false,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const flat = z.flattenError(result.error);
      expect(flat.fieldErrors).toHaveProperty('title');
    }
  });

  it('accepts empty images, techStack, and links arrays', () => {
    const result = projectSchema.safeParse({
      id: 'test',
      title: 'Test Project',
      brief: 'Brief',
      summary: 'Summary',
      thumbnail: '/thumb.png',
      images: [],
      domain: 'Test',
      techStack: [],
      links: [],
      featured: false,
    });
    expect(result.success).toBe(true);
  });

  it('accepts featured: false', () => {
    const result = projectSchema.safeParse({
      id: 'test',
      title: 'Test Project',
      brief: 'Brief',
      summary: 'Summary',
      thumbnail: '/thumb.png',
      images: [],
      domain: 'Test',
      techStack: [],
      links: [],
      featured: false,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.featured).toBe(false);
    }
  });
});

describe('socialLinkSchema', () => {
  it('accepts valid SocialLink', () => {
    const result = socialLinkSchema.safeParse({
      platform: 'GitHub',
      url: 'https://github.com',
      icon: 'github',
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing platform', () => {
    const result = socialLinkSchema.safeParse({
      url: 'https://github.com',
      icon: 'github',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const flat = z.flattenError(result.error);
      expect(flat.fieldErrors).toHaveProperty('platform');
    }
  });
});

describe('projectLinkSchema', () => {
  it('accepts valid ProjectLink', () => {
    const result = projectLinkSchema.safeParse({
      label: 'GitHub',
      url: 'https://github.com',
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing url', () => {
    const result = projectLinkSchema.safeParse({
      label: 'GitHub',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const flat = z.flattenError(result.error);
      expect(flat.fieldErrors).toHaveProperty('url');
    }
  });
});
