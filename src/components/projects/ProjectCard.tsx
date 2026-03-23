import { motion } from 'motion/react';
import type { Project } from '../../types/data';
import { easing, layoutTransition } from '../../styles/motion';
import { CardSpotlight } from '../effects/CardSpotlight';

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
      className={`rounded-xl bg-white shadow-lg overflow-hidden ${
        isExpanded ? 'col-span-1 md:col-span-3' : ''
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
      {/* Spotlight hover effect -- inside layout div so it won't break layout animations */}
      <CardSpotlight
        radius={300}
        color="rgba(75, 46, 131, 0.12)"
        className="h-full"
      >
        {/* Card content -- always visible, layout="position" avoids scale distortion */}
        <motion.div
          layout="position"
          className="cursor-pointer"
          onClick={onToggle}
        >
          {/* When expanded, use side-by-side layout: image left, details right */}
          {isExpanded ? (
            <div className="flex flex-col md:flex-row">
              <img
                src={project.thumbnail}
                alt={project.title}
                className="w-full md:w-2/5 aspect-video object-cover md:aspect-auto md:min-h-[280px]"
              />
              <div className="p-6 flex-1">
                <h3 className="text-lg font-bold text-ink">{project.title}</h3>
                <span className="inline-block rounded-full bg-silicon-50 px-3 py-1 text-xs font-medium text-silicon-600 mt-2">
                  {project.domain}
                </span>
                <p className="text-silicon-600 leading-relaxed mt-4">
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
                <div className="flex items-center gap-3 mt-5">
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
            </div>
          ) : (
            <>
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
            </>
          )}
        </motion.div>
      </CardSpotlight>
    </motion.div>
  );
}
