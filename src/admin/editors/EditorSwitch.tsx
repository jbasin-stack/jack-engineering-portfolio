import type { MutableRefObject } from 'react';
import type { ContentTypeKey } from '../useAdminPanel';
import { HeroEditor } from './HeroEditor';
import { ContactEditor } from './ContactEditor';
import { NavigationEditor } from './NavigationEditor';
import { SkillsEditor } from './SkillsEditor';
import { ToolingEditor } from './ToolingEditor';
import { TimelineEditor } from './TimelineEditor';
import { CourseworkEditor } from './CourseworkEditor';
import { PapersEditor } from './PapersEditor';
import { ProjectsEditor } from './ProjectsEditor';

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
    case 'skills':
      return <SkillsEditor onDirtyChange={onDirtyChange} saveRef={saveRef} />;
    case 'tooling':
      return (
        <ToolingEditor onDirtyChange={onDirtyChange} saveRef={saveRef} />
      );
    case 'timeline':
      return (
        <TimelineEditor onDirtyChange={onDirtyChange} saveRef={saveRef} />
      );
    case 'coursework':
      return (
        <CourseworkEditor onDirtyChange={onDirtyChange} saveRef={saveRef} />
      );
    case 'papers':
      return (
        <PapersEditor onDirtyChange={onDirtyChange} saveRef={saveRef} />
      );
    case 'projects':
      return (
        <ProjectsEditor onDirtyChange={onDirtyChange} saveRef={saveRef} />
      );
    default:
      return (
        <p className="text-sm text-muted-foreground">
          Unknown content type:{' '}
          <span className="font-medium text-foreground">{contentType}</span>
        </p>
      );
  }
}
