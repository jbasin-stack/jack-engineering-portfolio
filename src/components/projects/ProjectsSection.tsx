import { useState } from 'react';
import { motion, LayoutGroup } from 'motion/react';
import { projects } from '../../data/projects';
import { sectionVariants, fadeUpVariant } from '../../styles/motion';
import type { Project } from '../../types/data';
import { ProjectCard } from './ProjectCard';
import { ProjectDetail } from './ProjectDetail';

/** Bento grid Projects section with expand state management and detail Dialog/Drawer. */
export function ProjectsSection() {
  // Only one card expanded at a time
  const [expandedId, setExpandedId] = useState<string | null>(null);
  // Which project to show in the full detail Dialog/Drawer
  const [detailProject, setDetailProject] = useState<Project | null>(null);

  return (
    <motion.section
      id="projects"
      aria-label="Projects"
      className="px-6 py-24"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
    >
      <div className="mx-auto max-w-5xl">
        <motion.h2
          className="text-2xl font-bold text-ink"
          variants={fadeUpVariant}
        >
          Projects
        </motion.h2>

        {/* Bento grid -- 3 columns on desktop, 1 on mobile */}
        <LayoutGroup>
          <motion.div
            className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3"
            variants={fadeUpVariant}
          >
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isExpanded={expandedId === project.id}
                onToggle={() =>
                  setExpandedId(
                    expandedId === project.id ? null : project.id,
                  )
                }
                onReadMore={() => {
                  setExpandedId(null);
                  setDetailProject(project);
                }}
              />
            ))}
          </motion.div>
        </LayoutGroup>

        {/* Full project detail Dialog (desktop) / Drawer (mobile) */}
        <ProjectDetail
          project={detailProject}
          open={detailProject !== null}
          onOpenChange={(open) => {
            if (!open) setDetailProject(null);
          }}
        />
      </div>
    </motion.section>
  );
}
