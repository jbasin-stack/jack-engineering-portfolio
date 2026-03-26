import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import type { NavItem } from '../../types/data';

interface NavDropdownProps {
  item: NavItem;
  activeSection: string;
  onNavigate: (href: string) => void;
}

export function NavDropdown({ item, activeSection, onNavigate }: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Check if any child section is currently active
  const anyChildActive = item.children?.some(
    (child) => activeSection === child.href.replace('#', '')
  ) ?? false;

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Trigger button */}
      <button
        className={`text-sm transition-colors duration-300 flex items-center gap-1 ${
          anyChildActive
            ? 'text-ink font-medium'
            : 'text-silicon-600 hover:text-ink'
        }`}
      >
        {item.label}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 min-w-[160px] rounded-lg bg-background/90 backdrop-blur-[12px] border border-hairline border-border/30 py-2 shadow-lg shadow-ink/5"
          >
            {item.children?.map((child) => {
              const isChildActive = activeSection === child.href.replace('#', '');
              return (
                <button
                  key={child.href}
                  onClick={() => onNavigate(child.href)}
                  className={`block w-full px-4 py-2 text-left text-sm transition-colors ${
                    isChildActive
                      ? 'text-ink font-medium'
                      : 'text-silicon-600 hover:text-ink hover:bg-muted'
                  }`}
                >
                  {child.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
