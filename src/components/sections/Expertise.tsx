import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { skillGroups } from '../../data/skills';
import { toolingGroups } from '../../data/tooling';
import { sectionVariants, fadeUpVariant, easing } from '../../styles/motion';
import { AnimatedTabs } from '../ui/AnimatedTabs';

// Domain merge mapping: each domain combines a skill group with relevant tools
const domainMapping = [
  {
    id: 'fabrication',
    label: 'Fabrication',
    skillDomain: 'Fabrication',
    getTools: () =>
      toolingGroups.find((g) => g.category === 'Fabrication Processes')?.items ?? [],
  },
  {
    id: 'rf-test',
    label: 'RF & Test',
    skillDomain: 'RF',
    getTools: () =>
      toolingGroups.find((g) => g.category === 'Lab Equipment')?.items ?? [],
  },
  {
    id: 'analog',
    label: 'Analog',
    skillDomain: 'Analog',
    getTools: () =>
      (toolingGroups.find((g) => g.category === 'EDA Tools')?.items ?? []).filter(
        (item) => item !== 'Xilinx Vivado'
      ),
  },
  {
    id: 'digital',
    label: 'Digital',
    skillDomain: 'Digital',
    getTools: () => ['Xilinx Vivado'],
  },
] as const;

// Derive tab list from mapping (data-driven default: first domain)
const tabs = domainMapping.map(({ id, label }) => ({ id, label }));

// Direction-aware slide variants for tab content transitions
// direction: +1 (forward/right) or -1 (backward/left)
// Uses subtle 40px offset with light blur for a buttery smooth feel
const slideVariants = {
  initial: (direction: number) => ({
    x: direction * 40,
    opacity: 0,
    filter: 'blur(4px)',
  }),
  animate: {
    x: 0,
    opacity: 1,
    filter: 'blur(0px)',
  },
  exit: (direction: number) => ({
    x: direction * -40,
    opacity: 0,
    filter: 'blur(4px)',
  }),
};

/** Merged Skills + Tooling section with 4 domain tabs */
export function Expertise() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const directionRef = useRef(0);

  // Compute slide direction based on tab index delta
  function handleTabChange(newTabId: string) {
    const oldIndex = tabs.findIndex((t) => t.id === activeTab);
    const newIndex = tabs.findIndex((t) => t.id === newTabId);
    directionRef.current = newIndex > oldIndex ? 1 : -1;
    setActiveTab(newTabId);
  }

  const activeDomain = domainMapping.find((d) => d.id === activeTab)!;
  const skills =
    skillGroups.find((g) => g.domain === activeDomain.skillDomain)?.skills ?? [];
  const tools = activeDomain.getTools();

  return (
    <section className="px-6 py-24">
      <motion.div
        id="expertise"
        role="region"
        aria-label="Expertise"
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
            Expertise
          </motion.h2>

          {/* Tab bar */}
          <motion.div className="mt-8" variants={fadeUpVariant}>
            <AnimatedTabs
              tabs={tabs}
              activeTab={activeTab}
              onChange={handleTabChange}
            />
          </motion.div>

          {/* Tab content panels */}
          <AnimatePresence mode="wait" custom={directionRef.current}>
            <motion.div
              key={activeTab}
              custom={directionRef.current}
              role="tabpanel"
              id={`panel-${activeTab}`}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: easing.inOut }}
              className="mt-6 min-h-[200px] rounded-xl backdrop-blur-md bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 p-6"
            >
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Skills column */}
                <div>
                  <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink">
                    Skills
                  </h3>
                  <ul className="space-y-2">
                    {skills.map((skill) => (
                      <li key={skill} className="text-silicon-600">
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tools & Equipment column */}
                <div>
                  <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink">
                    Tools & Equipment
                  </h3>
                  <ul className="space-y-2">
                    {tools.map((tool) => (
                      <li key={tool} className="text-silicon-600">
                        {tool}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
