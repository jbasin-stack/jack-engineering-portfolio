import type { NavItem } from '../types/data';

export const navItems: NavItem[] = [
  {
    label: 'Background',
    href: '#background',
    children: [
      { label: 'Skills', href: '#skills' },
      { label: 'Coursework', href: '#coursework' },
      { label: 'Lab & Tooling', href: '#tooling' },
    ],
  },
  { label: 'Projects', href: '#projects' },
  { label: 'Papers', href: '#papers' },
  { label: 'Contact', href: '#contact' },
];
