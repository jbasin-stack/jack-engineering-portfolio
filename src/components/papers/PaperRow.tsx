import { motion } from 'motion/react';
import type { Paper } from '../../types/data';
import { fadeUpVariant } from '../../styles/motion';

interface PaperRowProps {
  paper: Paper;
  onView: () => void;
}

export function PaperRow({ paper, onView }: PaperRowProps) {
  return (
    <motion.div
      className="flex items-baseline justify-between py-4"
      variants={fadeUpVariant}
    >
      {/* Title and descriptor */}
      <div className="min-w-0 pr-4">
        <span className="font-semibold text-ink">{paper.title}</span>
        <span className="ml-2 text-sm text-silicon-600">
          {paper.descriptor}
        </span>
      </div>

      {/* View action */}
      <button
        onClick={onView}
        className="shrink-0 cursor-pointer font-medium text-accent hover:underline"
      >
        View
      </button>
    </motion.div>
  );
}
