import { useEffect } from 'react';
import { useLenis } from 'lenis/react';
import { useIsMobile } from '../../hooks/useIsMobile';
import type { Project } from '../../types/data';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '../ui/drawer';

interface ProjectDetailProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Full project detail rendered inside Dialog (desktop) or Drawer (mobile). */
export function ProjectDetail({ project, open, onOpenChange }: ProjectDetailProps) {
  const isMobile = useIsMobile();
  const lenis = useLenis();

  // Lock Lenis scroll when dialog/drawer is open (same pattern as MobileMenu)
  useEffect(() => {
    if (open) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
    return () => {
      lenis?.start();
    };
  }, [open, lenis]);

  if (!project) return null;

  // Determine images to display: project.images, fallback to thumbnail
  const images =
    project.images.length > 0 ? project.images : [project.thumbnail];

  // Shared detail content for both Dialog and Drawer
  const detailContent = (
    <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
      {/* Image gallery column */}
      <div className="flex flex-col gap-4">
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`${project.title} image ${i + 1}`}
            loading="lazy"
            decoding="async"
            className="w-full rounded-lg object-cover"
          />
        ))}
      </div>

      {/* Content column */}
      <div className="flex flex-col gap-4">
        {/* Domain pill */}
        <span className="inline-block w-fit rounded-full bg-silicon-50 px-3 py-1 text-xs font-medium text-silicon-600">
          {project.domain}
        </span>

        {/* Summary */}
        <p className="text-silicon-600 leading-relaxed">{project.summary}</p>

        {/* Tech stack tags */}
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-silicon-50 px-3 py-1 text-xs text-silicon-600"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* External links */}
        {project.links.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-2">
            {project.links.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-accent hover:underline"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Responsive: Dialog on desktop, Drawer on mobile
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[95vh] overflow-y-auto p-0">
          <DrawerHeader className="p-6 pb-0">
            <DrawerTitle className="text-xl font-bold text-ink">
              {project.title}
            </DrawerTitle>
            <DrawerDescription className="sr-only">
              Details for {project.title}
            </DrawerDescription>
          </DrawerHeader>
          {detailContent}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-ink">
            {project.title}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Details for {project.title}
          </DialogDescription>
        </DialogHeader>
        {detailContent}
      </DialogContent>
    </Dialog>
  );
}
