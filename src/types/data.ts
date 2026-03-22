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
