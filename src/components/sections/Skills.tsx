import { motion } from 'motion/react';
import { skillGroups } from '../../data/skills';
import { sectionVariants, fadeUpVariant } from '../../styles/motion';

export function Skills() {
  return (
    <motion.section
      id="skills"
      aria-label="Technical Skills"
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
          Skills
        </motion.h2>

        <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-4">
          {skillGroups.map((group) => (
            <motion.div
              key={group.domain}
              role="group"
              aria-label={`${group.domain} skills`}
              variants={fadeUpVariant}
            >
              <h3 className="text-lg font-semibold text-ink">
                {group.domain}
              </h3>
              <ul className="mt-4 space-y-2">
                {group.skills.map((skill) => (
                  <li key={skill} className="text-silicon-600">
                    {skill}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
