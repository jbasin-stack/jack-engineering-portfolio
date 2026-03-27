import { motion, type Variants } from 'motion/react';
import clsx from 'clsx';
import { easing } from '../../styles/motion';
import { milestones } from '../../data/timeline';
import type { TimelineMilestone } from '../../types/data';

// Layout variants cycle through entries for visual variety when images are present
type LayoutVariant = 'large' | 'half' | 'overlay';
const LAYOUT_CYCLE: LayoutVariant[] = ['large', 'half', 'overlay'];

// Extract 4-digit year from date string like "Sep 2021"
function extractYear(date: string): string {
  const match = date.match(/\d{4}/);
  return match ? match[0] : date;
}

// Timeline-specific animation variants
const entryVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easing.out },
  },
};

const dotVariant: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: easing.out },
  },
};

// Single timeline entry with year anchor, title, description, and optional image
function TimelineEntry({
  milestone,
  index,
}: {
  milestone: TimelineMilestone;
  index: number;
}) {
  const variant = LAYOUT_CYCLE[index % LAYOUT_CYCLE.length];
  const year = extractYear(milestone.date);
  const hasImage = !!milestone.image;

  return (
    <motion.article
      variants={entryVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="relative py-16 pl-10 md:py-20 md:pl-14"
    >
      {/* Dot marker on the connector line */}
      <motion.div
        variants={dotVariant}
        data-testid="timeline-dot"
        className="absolute left-0 top-20 h-[6px] w-[6px] -translate-x-1/2 rounded-full bg-accent md:top-24"
      />

      {/* Year anchor */}
      <motion.span
        variants={fadeUp}
        className={clsx(
          'block font-bold text-accent/80',
          // Large variant gets bigger year text when no image
          !hasImage && variant === 'large'
            ? 'text-6xl md:text-8xl'
            : 'text-5xl md:text-7xl',
        )}
      >
        {year}
      </motion.span>

      {/* Title */}
      <motion.h3
        variants={fadeUp}
        className="mt-3 text-xl font-semibold text-ink md:text-2xl"
      >
        {milestone.title}
      </motion.h3>

      {/* Description */}
      <motion.p
        variants={fadeUp}
        className="mt-2 max-w-2xl text-base leading-relaxed text-silicon-600 md:text-lg"
      >
        {milestone.description}
      </motion.p>

      {/* Image section -- only rendered when image exists */}
      {hasImage && (
        <motion.div variants={fadeUp}>
          {variant === 'large' && (
            <div className="mt-6 w-full">
              <img
                src={milestone.image}
                alt={milestone.title}
                className="aspect-video w-full rounded-lg object-cover"
              />
            </div>
          )}

          {variant === 'half' && (
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <img
                src={milestone.image}
                alt={milestone.title}
                className="aspect-video w-full rounded-lg object-cover"
              />
            </div>
          )}

          {variant === 'overlay' && (
            <div className="relative mt-6 aspect-[3/2] w-full overflow-hidden rounded-lg">
              <img
                src={milestone.image}
                alt={milestone.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          )}
        </motion.div>
      )}
    </motion.article>
  );
}

export function Timeline() {
  return (
    <section id="timeline" className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-2xl font-bold text-ink">Timeline</h2>

        <div className="relative mt-12">
          {/* Thin accent connector line running the full height */}
          <div
            data-testid="timeline-connector"
            className="absolute bottom-0 left-[3px] top-0 w-[1.5px] bg-accent/30"
          />

          {/* Milestone entries */}
          {milestones.map((milestone, i) => (
            <TimelineEntry key={milestone.title} milestone={milestone} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
