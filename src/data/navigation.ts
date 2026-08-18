import type { NavItem } from '../types/data';

export const navItems: NavItem[] = [
  {
    label: 'Background',
    href: '#about',
    children: [
      {
        label: 'Expertise',
        href: '#expertise',
      },
      {
        label: 'Timeline',
        href: '#timeline',
      },
    ],
  },
  {
    label: 'Projects',
    href: '#projects',
  },
  {
    label: 'Papers',
    href: '#papers',
  },
  {
    label: 'Vibe Coded Projects',
    href: '#VCs',
  },
];
