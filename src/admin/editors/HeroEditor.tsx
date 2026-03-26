import type { MutableRefObject } from 'react';
import type { HeroData, SocialLink } from '@/types/data';
import { useContentEditor } from '../useContentEditor';
import { heroSchema } from '../schemas';
import { FormField } from './shared/FormField';
import { SectionHeader } from './shared/SectionHeader';
import { StructuredArrayField } from './shared/StructuredArrayField';

interface HeroEditorProps {
  onDirtyChange: (dirty: boolean) => void;
  saveRef: MutableRefObject<(() => Promise<boolean>) | null>;
}

const socialLinkFields = [
  { key: 'platform', label: 'Platform' },
  { key: 'url', label: 'URL' },
  { key: 'icon', label: 'Icon' },
];

/** Singleton editor for Hero content (name, subtitle, narrative, social links) */
export function HeroEditor({ onDirtyChange, saveRef }: HeroEditorProps) {
  const { data, updateField, fieldErrors, loading } =
    useContentEditor<HeroData>({
      contentType: 'hero',
      schema: heroSchema,
      onDirtyChange,
      saveRef,
    });

  if (loading || !data) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-3 w-20 rounded bg-gray-200" />
        <div className="h-8 w-full rounded bg-gray-100" />
        <div className="h-8 w-full rounded bg-gray-100" />
        <div className="h-20 w-full rounded bg-gray-100" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SectionHeader>Details</SectionHeader>
      <FormField
        label="Name"
        value={data.name}
        onChange={(v) => updateField('name', v)}
        error={fieldErrors.name}
      />
      <FormField
        label="Subtitle"
        value={data.subtitle}
        onChange={(v) => updateField('subtitle', v)}
        error={fieldErrors.subtitle}
      />
      <FormField
        label="Narrative"
        value={data.narrative}
        onChange={(v) => updateField('narrative', v)}
        error={fieldErrors.narrative}
        multiline
      />

      <SectionHeader>Social Links</SectionHeader>
      <StructuredArrayField
        label="Social Links"
        items={data.socialLinks as unknown as Record<string, string>[]}
        onChange={(links) => updateField('socialLinks', links as unknown as SocialLink[])}
        fields={socialLinkFields}
        error={fieldErrors.socialLinks}
      />
    </div>
  );
}
