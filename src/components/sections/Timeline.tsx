import { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from 'motion/react';
import { milestones } from '../../data/timeline';
import type { TimelineMilestone } from '../../types/data';

// Individual timeline node -- activates once when scroll reaches its threshold
function TimelineNode({
  milestone,
  threshold,
  scrollYProgress,
}: {
  milestone: TimelineMilestone;
  threshold: number;
  scrollYProgress: MotionValue<number>;
}) {
  // One-shot activation: fires setState exactly once, never resets
  const [hasActivated, setHasActivated] = useState(false);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (!hasActivated && latest >= threshold) {
      setHasActivated(true);
    }
  });

  // Continuous content animation driven by MotionValues (no per-frame setState)
  const contentOpacity = useTransform(
    scrollYProgress,
    [threshold - 0.05, threshold + 0.02],
    [0, 1],
  );
  const contentY = useTransform(
    scrollYProgress,
    [threshold - 0.05, threshold + 0.02],
    [8, 0],
  );

  return (
    <div className="relative pb-12 last:pb-0">
      {/* Node circle -- hollow when inactive, filled accent with glow when active */}
      <div
        className={`absolute -left-[21px] top-1 h-3 w-3 rounded-full border-2 transition-all duration-300 ${
          hasActivated
            ? 'border-accent bg-accent shadow-[0_0_12px_oklch(0.55_0.15_250/0.4)]'
            : 'border-silicon-200 bg-cleanroom'
        }`}
      >
        {/* One-shot pulse ring -- expands and fades on activation */}
        {hasActivated && (
          <span className="absolute inset-0 animate-[pulse-ring_1.5s_ease-out_forwards] rounded-full border-2 border-accent/30" />
        )}
      </div>

      {/* Milestone content -- fades in and slides up via useTransform */}
      <motion.div style={{ opacity: contentOpacity, y: contentY }}>
        <span className="text-sm text-silicon-400">{milestone.date}</span>
        <h3 className="mt-1 text-lg font-semibold text-ink">
          {milestone.title}
        </h3>
        <p className="mt-1 text-silicon-600">{milestone.description}</p>
      </motion.div>
    </div>
  );
}

export function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress of the timeline container through the viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.6'],
  });

  return (
    <section id="timeline" className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-2xl font-bold text-ink">Timeline</h2>

        <div ref={containerRef} className="relative mt-12 pl-10">
          {/* SVG path container -- positioned absolutely on the left */}
          <svg
            className="absolute left-0 top-0 h-full w-6"
            viewBox="0 0 24 100"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden="true"
          >
            <defs>
              {/* Gradient stroke: accent-600 at top to accent-400 at bottom */}
              <linearGradient
                id="timeline-gradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="var(--color-accent)"
                  stopOpacity="1"
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-accent)"
                  stopOpacity="0.6"
                />
              </linearGradient>
            </defs>

            {/* Undrawn track -- faint dashed line showing full path */}
            <path
              d="M 12 0 V 100"
              stroke="var(--color-silicon-200)"
              strokeWidth={1}
              strokeDasharray="4 4"
              vectorEffect="non-scaling-stroke"
            />

            {/* Drawn progress path -- fills as user scrolls */}
            <motion.path
              d="M 12 0 V 100"
              stroke="url(#timeline-gradient)"
              strokeWidth={2}
              style={{ pathLength: scrollYProgress }}
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* Milestone nodes */}
          {milestones.map((milestone, i) => (
            <TimelineNode
              key={milestone.title}
              milestone={milestone}
              threshold={i / Math.max(milestones.length - 1, 1)}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
