import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLenis } from 'lenis/react';
import { Menu } from 'lucide-react';
import { navItems } from '../../data/navigation';
import { useActiveSection } from '../../hooks/useActiveSection';
import { useScrollVisibility } from '../../hooks/useScrollVisibility';
import { NavDropdown } from './NavDropdown';
import { MobileMenu } from './MobileMenu';
import { easing } from '../../styles/motion';

// All section IDs for scroll-spy tracking
const sectionIds = ['about', 'skills', 'tooling', 'timeline', 'projects', 'papers', 'contact'];

export function Navigation() {
  const isVisible = useScrollVisibility(400);
  const activeSection = useActiveSection(sectionIds);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lenis = useLenis();

  // Smooth scroll to a section via Lenis
  function handleNavClick(href: string) {
    lenis?.scrollTo(href, { offset: -80, duration: 1.2 });
  }

  // Scroll to top via Lenis
  function handleLogoClick() {
    lenis?.scrollTo(0, { duration: 1.5 });
  }

  // Check if a nav item (or any of its children) matches the active section
  function isItemActive(item: (typeof navItems)[number]): boolean {
    const itemId = item.href.replace('#', '');
    if (activeSection === itemId) return true;
    if (item.children) {
      return item.children.some(
        (child) => activeSection === child.href.replace('#', '')
      );
    }
    return false;
  }

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: easing.out }}
            className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-[12px] border-b border-hairline border-border/30"
          >
            <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              {/* Logo -- scrolls to top */}
              <button
                onClick={handleLogoClick}
                className="text-sm font-semibold tracking-architectural text-ink hover:text-accent transition-colors"
              >
                JB
              </button>

              {/* Desktop nav links */}
              <div className="hidden md:flex items-center gap-8">
                {navItems.map((item) => {
                  if (item.children) {
                    return (
                      <NavDropdown
                        key={item.href}
                        item={item}
                        activeSection={activeSection}
                        onNavigate={handleNavClick}
                      />
                    );
                  }

                  const active = isItemActive(item);
                  return (
                    <button
                      key={item.href}
                      onClick={() => handleNavClick(item.href)}
                      className={`text-sm transition-colors duration-300 ${
                        active
                          ? 'text-ink font-medium'
                          : 'text-silicon-600 hover:text-ink'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>

              {/* Mobile hamburger icon */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden text-ink"
              >
                <Menu size={24} strokeWidth={1.5} />
              </button>
            </nav>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Mobile menu overlay (rendered outside header AnimatePresence) */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onNavigate={handleNavClick}
      />
    </>
  );
}
