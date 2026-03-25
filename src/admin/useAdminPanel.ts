import { useState, useCallback } from 'react';

/** The 9 content types matching CONTENT_REGISTRY keys */
export type ContentTypeKey =
  | 'hero'
  | 'projects'
  | 'papers'
  | 'skills'
  | 'tooling'
  | 'timeline'
  | 'contact'
  | 'navigation'
  | 'coursework';

interface ContentGroupEntry {
  key: ContentTypeKey;
  label: string;
}

interface ContentGroup {
  heading: string;
  items: ContentGroupEntry[];
}

/** Three nav groups for the admin sidebar */
export const CONTENT_GROUPS: ContentGroup[] = [
  {
    heading: 'Page Sections',
    items: [
      { key: 'hero', label: 'Hero' },
      { key: 'contact', label: 'Contact' },
      { key: 'navigation', label: 'Navigation' },
    ],
  },
  {
    heading: 'Portfolio',
    items: [
      { key: 'projects', label: 'Projects' },
      { key: 'papers', label: 'Papers' },
    ],
  },
  {
    heading: 'Skills & Experience',
    items: [
      { key: 'skills', label: 'Skills' },
      { key: 'tooling', label: 'Tooling' },
      { key: 'timeline', label: 'Timeline' },
      { key: 'coursework', label: 'Coursework' },
    ],
  },
];

/** Manages admin panel state: active content type and dirty tracking */
export function useAdminPanel() {
  const [activeContentType, setActiveContentType] =
    useState<ContentTypeKey>('hero');
  const [isDirty, setDirty] = useState(false);

  const handleSetActiveContentType = useCallback(
    (type: ContentTypeKey) => {
      setActiveContentType(type);
      setDirty(false);
    },
    []
  );

  return {
    activeContentType,
    setActiveContentType: handleSetActiveContentType,
    isDirty,
    setDirty,
  };
}
