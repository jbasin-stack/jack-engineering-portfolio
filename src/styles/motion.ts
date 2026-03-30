import type { Variants } from 'motion/react';

// Weighted easing curves -- smooth, no bounce
export const easing = {
  // "Ease out quart" -- fast start, gentle deceleration
  out: [0.25, 1, 0.5, 1] as const,
  // "Ease in-out cubic" -- smooth both directions
  inOut: [0.65, 0, 0.35, 1] as const,
};

// Section entry animation -- stagger children on viewport entry
export const sectionVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

// Individual item fade-up for whileInView sections
export const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easing.out },
  },
};
