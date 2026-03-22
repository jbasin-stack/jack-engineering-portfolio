import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { useScrollVisibility } from '../../hooks/useScrollVisibility';

export function ScrollIndicator() {
  const hasScrolled = useScrollVisibility(100);

  return (
    <AnimatePresence>
      {!hasScrolled && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Gentle pulse animation on the chevron */}
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown size={24} strokeWidth={1.5} className="text-silicon-400" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
