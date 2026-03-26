import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLenis } from 'lenis/react';
import { X } from 'lucide-react';
import { navItems } from '../../data/navigation';
import { easing } from '../../styles/motion';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (href: string) => void;
}

export function MobileMenu({ isOpen, onClose, onNavigate }: MobileMenuProps) {
  const lenis = useLenis();

  // Lock background scroll when overlay is open (Lenis stop/start)
  useEffect(() => {
    if (isOpen) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
  }, [isOpen, lenis]);

  // Navigate to section and close the menu
  function handleItemClick(href: string) {
    onNavigate(href);
    onClose();
  }

  // Track a running delay index across all items for staggered entrance
  let delayIndex = 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: easing.out }}
          className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-[20px]"
        >
          <div className="flex h-full flex-col px-6 py-4">
            {/* Top bar with logo and close button */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold tracking-architectural text-ink">
                JB
              </span>
              <button onClick={onClose} className="text-ink">
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            {/* Nav items centered vertically */}
            <div className="flex flex-1 flex-col items-start justify-center gap-6">
              {navItems.map((item) => {
                if (item.children) {
                  // Parent with sub-items: non-interactive heading + indented children
                  const parentBlock = (
                    <div key={item.href}>
                      <span className="text-sm font-medium uppercase tracking-architectural text-silicon-400">
                        {item.label}
                      </span>
                      <div className="ml-4 mt-2 flex flex-col gap-3">
                        {item.children.map((child) => {
                          const currentDelay = delayIndex * 0.05;
                          delayIndex++;
                          return (
                            <motion.button
                              key={child.href}
                              onClick={() => handleItemClick(child.href)}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: currentDelay }}
                              className="text-left text-2xl font-light text-ink"
                            >
                              {child.label}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  );
                  return parentBlock;
                }

                // Top-level items without children
                const currentDelay = delayIndex * 0.05;
                delayIndex++;
                return (
                  <motion.button
                    key={item.href}
                    onClick={() => handleItemClick(item.href)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: currentDelay }}
                    className="text-left text-2xl font-light text-ink"
                  >
                    {item.label}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
