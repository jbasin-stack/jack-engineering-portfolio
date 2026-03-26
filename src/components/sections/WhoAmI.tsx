import { motion } from 'motion/react';
import { sectionVariants, fadeUpVariant } from '../../styles/motion';

// Replace with your actual portrait image path (e.g., /portrait.jpg in public/)
const PORTRAIT_SRC = '/portrait.jpg';

export function WhoAmI() {
  return (
    <section className="px-6 py-24">
      <motion.div
        id="about"
        role="region"
        aria-label="About Me"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-start gap-12 md:flex-row md:items-center">
            {/* Portrait photo */}
            <motion.div
              className="shrink-0"
              variants={fadeUpVariant}
            >
              <div className="h-56 w-56 overflow-hidden rounded-2xl border border-silicon-200 bg-silicon-50">
                <img
                  src={PORTRAIT_SRC}
                  alt="Jack Basinski"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    // Hide broken image if portrait not yet added
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            </motion.div>

            {/* Bio text */}
            <div>
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
          </div>
        </div>
      </motion.div>
    </section>
  );
}
