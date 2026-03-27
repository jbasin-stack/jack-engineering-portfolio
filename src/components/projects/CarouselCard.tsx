import { motion } from 'motion/react';
import type { Project } from '../../types/data';
import { easing } from '../../styles/motion';

interface CarouselCardProps {
  project: Project;
  onClick: () => void;
}

/** Enhanced project card for carousel slides with gradient overlay, hover zoom, and accent glow. */
export function CarouselCard({ project, onClick }: CarouselCardProps) {
  return (
    <motion.div
      className="group cursor-pointer rounded-xl bg-card shadow-md overflow-hidden h-full border border-transparent transition-colors duration-300 hover:border-accent/30"
      whileHover={{
        scale: 1.02,
        boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px oklch(0.55 0.15 250 / 0.15)',
      }}
      transition={{ duration: 0.3, ease: easing.out }}
      onClick={onClick}
    >
      {/* Featured accent bar */}
      {project.featured && (
        <div className="h-1 w-full bg-gradient-to-r from-accent/80 via-accent to-accent/80" />
      )}

      {/* Thumbnail with gradient overlay and hover zoom */}
      <div className="relative overflow-hidden">
        <img
          src={project.thumbnail}
          alt={project.title}
          className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      </div>

      {/* Text content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-ink leading-tight">{project.title}</h3>
        <p className="text-sm text-silicon-600 mt-2 line-clamp-2 leading-relaxed">{project.brief}</p>
        <span className="inline-block rounded-full bg-accent/10 dark:bg-accent/20 px-3 py-1 text-xs font-semibold text-accent mt-4 tracking-wide uppercase">
          {project.domain}
        </span>
      </div>
    </motion.div>
  );
}
