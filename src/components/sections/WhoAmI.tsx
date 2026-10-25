import { motion } from 'motion/react';
import { sectionVariants, fadeUpVariant } from '../../styles/motion';

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
                  loading="lazy"
                  decoding="async"
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
                I'm a senior in Electrical & Computer Engineering at the University
                of Washington, working where semiconductor fabrication meets analog
                and mixed-signal circuit design. I lead the undergraduate research
                assistants at the Washington Nanofabrication Facility, and I spent
                summer 2026 as a photolithography process engineering intern at
                Micron.
              </motion.p>

              <motion.p
                className="mt-4 max-w-2xl text-lg leading-relaxed text-silicon-600"
                variants={fadeUpVariant}
              >
                On the design side, I build analog circuits in Cadence and on the
                bench. I'm heading toward high-speed and optical I/O circuits,
                where fabrication variation turns into a circuit problem and
                knowing how devices are made pays off.
              </motion.p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
