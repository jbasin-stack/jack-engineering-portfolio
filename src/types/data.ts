export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface HeroData {
  name: string;
  subtitle: string;
  narrative: string;
  socialLinks: SocialLink[];
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface SkillGroup {
  domain: string;
  skills: string[];
}

export interface ToolingGroup {
  category: string;
  items: string[];
}

export interface Course {
  code: string;
  name: string;
  descriptor: string;
}

export interface TimelineMilestone {
  date: string;
  title: string;
  description: string;
}

export interface ContactData {
  tagline: string;
  email: string;
  resumePath: string;
  socialLinks: SocialLink[];
}

export interface Project {
  id: string;
  title: string;
  brief: string;
  summary: string;
  thumbnail: string;
  images: string[];
  domain: string;
  techStack: string[];
  links: { label: string; url: string }[];
  featured: boolean;
}

export interface Paper {
  id: string;
  title: string;
  descriptor: string;
  pdfPath: string;
}
