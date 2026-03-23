import { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useMotionValueEvent,
  type MotionValue,
} from 'motion/react';
import { milestones } from '../../data/timeline';
import type { TimelineMilestone } from '../../types/data';

// Individual timeline node -- activates when scroll progress reaches its threshold
function TimelineNode({
  milestone,
  index,
  total,
  scrollProgress,
}: {
  milestone: TimelineMilestone;
  index: number;
  total: number;
  scrollProgress: MotionValue<number>;
}) {
  const threshold = index / Math.max(total - 1, 1);
  const [isActive, setIsActive] = useState(false);

  // Sync MotionValue to React state for conditional class rendering
  useMotionValueEvent(scrollProgress, 'change', (latest) => {
    setIsActive(latest >= threshold);
  });

  return (
    <div className="relative pb-12 last:pb-0">
      {/* Node dot -- hollow grey until active, then filled accent */}
      <div
        className={`absolute -left-8 top-1 h-3 w-3 rounded-full border-2 transition-colors duration-300 ${
          isActive
            ? 'border-accent bg-accent'
            : 'border-silicon-200 bg-cleanroom'
        }`}
      />

      {/* Milestone content -- fades in when active */}
      <div
        className={`transition-all duration-500 ${
          isActive
            ? 'translate-y-0 opacity-100'
            : 'translate-y-2 opacity-0'
        }`}
      >
        <span className="text-sm text-silicon-400">{milestone.date}</span>
        <h3 className="mt-1 text-lg font-semibold text-ink">
          {milestone.title}
        </h3>
        <p className="mt-1 text-silicon-600">{milestone.description}</p>
      </div>
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

        <div ref={containerRef} className="relative mt-12 pl-8">
          {/* Progressive fill line -- scaleY driven by scroll progress, no grey track */}
          <motion.div
            className="absolute left-0 top-0 h-full w-0.5 origin-top bg-accent"
            style={{ scaleY: scrollYProgress }}
          />

          {/* Milestone nodes */}
          {milestones.map((milestone, i) => (
            <TimelineNode
              key={milestone.title}
              milestone={milestone}
              index={i}
              total={milestones.length}
              scrollProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
