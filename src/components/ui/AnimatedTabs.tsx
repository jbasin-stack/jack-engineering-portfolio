import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';

interface Tab {
  id: string;
  label: string;
}

interface AnimatedTabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
}

/** Reusable tab bar with a single persistent sliding indicator */
export function AnimatedTabs({ tabs, activeTab, onChange }: AnimatedTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  // Measure the active tab button and position the indicator
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const activeIndex = tabs.findIndex((t) => t.id === activeTab);
    const buttons = container.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    const activeButton = buttons[activeIndex];

    if (activeButton) {
      setIndicatorStyle({
        left: activeButton.offsetLeft,
        width: activeButton.offsetWidth,
      });
    }
  }, [activeTab, tabs]);

  return (
    <div
      ref={containerRef}
      role="tablist"
      className="relative inline-flex w-full rounded-xl bg-silicon-50/50 dark:bg-silicon-200/10 p-1 backdrop-blur-sm"
    >
      {/* Single sliding indicator -- always mounted, animates position */}
      <motion.div
        className="absolute top-1 bottom-1 rounded-lg bg-white/80 shadow-sm dark:bg-white/10"
        animate={{
          left: indicatorStyle.left,
          width: indicatorStyle.width,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      />

      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            onClick={() => onChange(tab.id)}
            className={`relative z-10 flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive ? 'text-ink' : 'text-silicon-600 hover:text-ink'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
