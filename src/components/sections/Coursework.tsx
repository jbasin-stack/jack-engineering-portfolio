import { motion } from 'motion/react';
import { courses } from '../../data/coursework';
import { sectionVariants, fadeUpVariant } from '../../styles/motion';

export function Coursework() {
  return (
    <motion.section
      id="coursework"
      aria-label="Key Coursework"
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
          Coursework
        </motion.h2>

        <div className="mt-12 space-y-8">
          {courses.map((course) => (
            <motion.div key={course.code} variants={fadeUpVariant}>
              <p className="text-lg font-medium text-ink">
                {course.code} &middot; {course.name}
              </p>
              <p className="mt-1 text-sm text-silicon-400">
                {course.descriptor}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
