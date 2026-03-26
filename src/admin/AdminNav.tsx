import {
  Sparkles,
  Mail,
  Menu,
  FolderOpen,
  FileText,
  Cpu,
  Wrench,
  Clock,
  GraduationCap,
} from 'lucide-react';
import { CONTENT_GROUPS, type ContentTypeKey } from './useAdminPanel';
import { cn } from '@/lib/utils';

/** Icon lookup for each content type */
const ICONS: Record<ContentTypeKey, React.ElementType> = {
  hero: Sparkles,
  contact: Mail,
  navigation: Menu,
  projects: FolderOpen,
  papers: FileText,
  skills: Cpu,
  tooling: Wrench,
  timeline: Clock,
  coursework: GraduationCap,
};

interface AdminNavProps {
  activeType: ContentTypeKey;
  onSelect: (type: ContentTypeKey) => void;
}

/** Grouped content-type navigation sidebar for the admin panel */
export function AdminNav({ activeType, onSelect }: AdminNavProps) {
  return (
    <nav className="flex flex-col gap-4 p-3">
      {CONTENT_GROUPS.map((group) => (
        <div key={group.heading}>
          <h3 className="mb-1 px-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            {group.heading}
          </h3>
          <ul className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const Icon = ICONS[item.key];
              const isActive = activeType === item.key;

              return (
                <li key={item.key}>
                  <button
                    onClick={() => onSelect(item.key)}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
                      isActive
                        ? 'bg-accent/10 font-medium text-accent'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
