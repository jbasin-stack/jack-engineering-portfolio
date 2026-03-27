import { motion } from 'motion/react';
import type { Project } from '../../types/data';
import { easing } from '../../styles/motion';

interface CarouselCardProps {
  project: Project;
  onClick: () => void;
}

/** Simplified project card for carousel slides with hover scale effect. */
export function CarouselCard({ project, onClick }: CarouselCardProps) {
  return (
    <motion.div
      className="cursor-pointer rounded-xl bg-card shadow-md overflow-hidden h-full"
      whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
      transition={{ duration: 0.3, ease: easing.out }}
      onClick={onClick}
    >
      <img
        src={project.thumbnail}
        alt={project.title}
        className="w-full aspect-video object-cover"
        loading="lazy"
        decoding="async"
      />

      <div className="p-5">
        <h3 className="font-bold text-ink">{project.title}</h3>
        <p className="text-silicon-600 mt-1 line-clamp-2">{project.brief}</p>
        <span className="inline-block rounded-full bg-accent/10 dark:bg-accent/20 px-3 py-1 text-xs font-medium text-accent mt-3">
          {project.domain}
        </span>
      </div>
    </motion.div>
  );
}
