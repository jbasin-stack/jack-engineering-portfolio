import { motion, AnimatePresence } from 'motion/react';
import type { Project } from '../../types/data';
import { easing, layoutTransition } from '../../styles/motion';

interface ProjectCardProps {
  project: Project;
  isExpanded: boolean;
  onToggle: () => void;
  onReadMore: () => void;
}

/** Single project card with collapsed/expanded states and Motion layout animation. */
export function ProjectCard({
  project,
  isExpanded,
  onToggle,
  onReadMore,
}: ProjectCardProps) {
  return (
    <motion.div
      layout
      className={`rounded-xl bg-cleanroom shadow-md overflow-hidden ${
        project.featured ? 'col-span-1 md:col-span-2' : ''
      }`}
      whileHover={{
        y: -2,
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
      }}
      transition={{
        layout: layoutTransition,
        ...{ duration: 0.3, ease: easing.out },
      }}
    >
      {/* Collapsed content -- always visible */}
      <motion.div
        layout="position"
        className="cursor-pointer"
        onClick={onToggle}
      >
        <img
          src={project.thumbnail}
          alt={project.title}
          className="w-full aspect-video object-cover"
        />
        <div className="p-5">
          <h3 className="font-bold text-ink">{project.title}</h3>
          <p className="text-silicon-600 mt-1">{project.brief}</p>
          <span className="inline-block rounded-full bg-silicon-50 px-3 py-1 text-xs font-medium text-silicon-600 mt-3">
            {project.domain}
          </span>
        </div>
      </motion.div>

      {/* Expanded content -- conditional, fades in/out */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="px-5 pb-5"
          >
            <div className="border-t border-silicon-200/30 pt-4 mt-2">
              <p className="text-silicon-600 leading-relaxed">
                {project.summary}
              </p>

              {/* Tech stack tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-silicon-50 px-3 py-1 text-xs text-silicon-600"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onReadMore();
                  }}
                  className="text-sm font-medium text-accent hover:underline"
                >
                  Read more
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggle();
                  }}
                  className="text-sm text-silicon-400 hover:text-silicon-600"
                >
                  Collapse
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
