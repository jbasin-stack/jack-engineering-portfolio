import { z } from 'zod';

// Shared sub-schemas (exported for StructuredArrayField validation)
export const socialLinkSchema = z.object({
  platform: z.string().min(1),
  url: z.string().min(1),
  icon: z.string().min(1),
});

export const projectLinkSchema = z.object({
  label: z.string().min(1),
  url: z.string().min(1),
});

// Singleton schemas
export const heroSchema = z.object({
  name: z.string().min(1),
  subtitle: z.string().min(1),
  narrative: z.string().min(1),
  socialLinks: z.array(socialLinkSchema),
});

export const contactSchema = z.object({
  tagline: z.string().min(1),
  email: z.string().min(1),
  resumePath: z.string().min(1),
  socialLinks: z.array(socialLinkSchema),
});

// NavItem with one level of nesting for children
export const navItemSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  children: z
    .array(
      z.object({
        label: z.string().min(1),
        href: z.string().min(1),
      })
    )
    .optional(),
});

// Array item schemas
export const skillGroupSchema = z.object({
  domain: z.string().min(1),
  skills: z.array(z.string()),
});

export const toolingGroupSchema = z.object({
  category: z.string().min(1),
  items: z.array(z.string()),
});

export const timelineMilestoneSchema = z.object({
  date: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  image: z.string().optional(),
});

export const courseSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  descriptor: z.string().min(1),
});

export const paperSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  descriptor: z.string().min(1),
  pdfPath: z.string().min(1),
});

export const projectSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  brief: z.string().min(1),
  summary: z.string().min(1),
  thumbnail: z.string().min(1),
  images: z.array(z.string()),
  domain: z.string().min(1),
  techStack: z.array(z.string()),
  links: z.array(projectLinkSchema),
  featured: z.boolean(),
});
