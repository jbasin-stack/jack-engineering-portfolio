import { motion } from 'motion/react';
import { sectionVariants, fadeUpVariant } from '../../styles/motion';

export function WhoAmI() {
  return (
    <motion.section
      id="about"
      aria-label="About Me"
      className="px-6 py-24"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="mx-auto max-w-5xl">
        <motion.h2
          className="text-2xl font-bold text-ink"
          variants={fadeUpVariant}
        >
          Who I Am
        </motion.h2>

        <motion.p
          className="mt-6 max-w-2xl text-lg leading-relaxed text-silicon-600"
          variants={fadeUpVariant}
        >
          I'm an ECE student at the University of Washington drawn to the
          intersection of semiconductor fabrication and system-level design.
          From cleanroom process development to mixed-signal circuit
          architecture, I want to close the gap between how devices are made
          and how they're used.
        </motion.p>

        <motion.p
          className="mt-4 max-w-2xl text-lg leading-relaxed text-silicon-600"
          variants={fadeUpVariant}
        >
          My goal is to contribute to the next generation of hardware —
          whether that's advancing fabrication processes, designing more
          efficient analog interfaces, or building the tooling that connects
          the two.
        </motion.p>
      </div>
    </motion.section>
  );
}
