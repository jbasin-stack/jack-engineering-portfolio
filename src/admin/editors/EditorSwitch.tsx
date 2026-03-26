import type { MutableRefObject } from 'react';
import type { ContentTypeKey } from '../useAdminPanel';
import { HeroEditor } from './HeroEditor';
import { ContactEditor } from './ContactEditor';
import { NavigationEditor } from './NavigationEditor';

interface EditorSwitchProps {
  contentType: ContentTypeKey;
  onDirtyChange: (dirty: boolean) => void;
  saveRef: MutableRefObject<(() => Promise<boolean>) | null>;
}

/** Routes activeContentType to the correct editor component */
export function EditorSwitch({
  contentType,
  onDirtyChange,
  saveRef,
}: EditorSwitchProps) {
  switch (contentType) {
    case 'hero':
      return <HeroEditor onDirtyChange={onDirtyChange} saveRef={saveRef} />;
    case 'contact':
      return <ContactEditor onDirtyChange={onDirtyChange} saveRef={saveRef} />;
    case 'navigation':
      return (
        <NavigationEditor onDirtyChange={onDirtyChange} saveRef={saveRef} />
      );
    default:
      return (
        <p className="text-sm text-gray-400">
          Editor for{' '}
          <span className="font-medium text-gray-600">{contentType}</span>{' '}
          coming soon
        </p>
      );
  }
}
