import { motion, type Variants } from 'motion/react';
import { Github, Linkedin } from 'lucide-react';
import { heroData } from '../../data/hero';
import { easing } from '../../styles/motion';

// Icon lookup for dynamic rendering from data
const iconMap = { Github, Linkedin } as const;

// Stagger container orchestrates children with 200ms delay
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2 },
  },
};

// Each child fades up from 20px below
const childVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easing.out },
  },
};

export function HeroContent() {
  return (
    <motion.div
      className="text-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Tier 1: Name -- largest, uppercase with wide tracking */}
      <motion.h1
        className="text-[clamp(2.5rem,5vw,4.5rem)] font-bold uppercase tracking-architectural text-ink"
        variants={childVariants}
      >
        {heroData.name}
      </motion.h1>

      {/* Tier 2: Subtitle -- medium */}
      <motion.p
        className="mt-4 text-[clamp(1rem,2vw,1.5rem)] text-silicon-600"
        variants={childVariants}
      >
        {heroData.subtitle}
      </motion.p>

      {/* Tier 3: Narrative -- smaller, lighter weight */}
      <motion.p
        className="mt-3 text-[clamp(0.875rem,1.5vw,1.125rem)] font-light text-silicon-400"
        variants={childVariants}
      >
        {heroData.narrative}
      </motion.p>

      {/* Social icons row */}
      <motion.div
        className="mt-6 flex items-center justify-center gap-4"
        variants={childVariants}
      >
        {heroData.socialLinks.map((link) => {
          const Icon = iconMap[link.icon as keyof typeof iconMap];
          return (
            <a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-silicon-400 transition-colors duration-300 hover:text-ink"
            >
              <Icon size={20} strokeWidth={1.5} />
            </a>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
