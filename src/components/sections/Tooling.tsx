import { motion } from 'motion/react';
import { toolingGroups } from '../../data/tooling';
import { sectionVariants, fadeUpVariant } from '../../styles/motion';

export function Tooling() {
  return (
    <motion.section
      id="tooling"
      aria-label="Lab and Tooling Proficiency"
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
          Lab & Tooling
        </motion.h2>

        <div className="mt-12 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {toolingGroups.map((group) => (
            <motion.div
              key={group.category}
              role="group"
              aria-label={group.category}
              variants={fadeUpVariant}
            >
              <h3 className="text-lg font-semibold text-ink">
                {group.category}
              </h3>
              <ul className="mt-4 space-y-2">
                {group.items.map((item) => (
                  <li key={item} className="text-silicon-600">
                    {item}
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
