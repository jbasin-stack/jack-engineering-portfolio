import type { MutableRefObject } from 'react';
import type { ContactData, SocialLink } from '@/types/data';
import { useContentEditor } from '../useContentEditor';
import { contactSchema } from '../schemas';
import { FormField } from './shared/FormField';
import { SectionHeader } from './shared/SectionHeader';
import { StructuredArrayField } from './shared/StructuredArrayField';
import { UploadZone } from '../UploadZone';

interface ContactEditorProps {
  onDirtyChange: (dirty: boolean) => void;
  saveRef: MutableRefObject<(() => Promise<boolean>) | null>;
}

const socialLinkFields = [
  { key: 'platform', label: 'Platform' },
  { key: 'url', label: 'URL' },
  { key: 'icon', label: 'Icon' },
];

/** Singleton editor for Contact content (tagline, email, resume, social links) */
export function ContactEditor({ onDirtyChange, saveRef }: ContactEditorProps) {
  const { data, updateField, fieldErrors, loading } =
    useContentEditor<ContactData>({
      contentType: 'contact',
      schema: contactSchema,
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
        label="Tagline"
        value={data.tagline}
        onChange={(v) => updateField('tagline', v)}
        error={fieldErrors.tagline}
      />
      <FormField
        label="Email"
        value={data.email}
        onChange={(v) => updateField('email', v)}
        error={fieldErrors.email}
      />

      <SectionHeader>Resume</SectionHeader>
      <UploadZone
        label="Resume PDF"
        accept={['.pdf']}
        maxSize={10 * 1024 * 1024}
        context={{ contentType: 'contact', field: 'resumePath' }}
        currentFile={data.resumePath}
        onUploaded={(path) => updateField('resumePath', path)}
      />
      {fieldErrors.resumePath && (
        <p className="text-sm text-red-500">{fieldErrors.resumePath[0]}</p>
      )}

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
