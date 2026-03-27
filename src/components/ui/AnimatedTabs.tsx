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

/** Reusable tab bar with Motion layoutId sliding indicator */
export function AnimatedTabs({ tabs, activeTab, onChange }: AnimatedTabsProps) {
  return (
    <div
      role="tablist"
      className="inline-flex w-full rounded-xl bg-silicon-50/50 dark:bg-silicon-200/10 p-1 backdrop-blur-sm"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`panel-${tab.id}`}
            onClick={() => onChange(tab.id)}
            className={`relative flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive ? 'text-ink' : 'text-silicon-600 hover:text-ink'
            }`}
          >
            {/* Sliding indicator behind active tab */}
            {isActive && (
              <motion.div
                layoutId="active-tab-indicator"
                className="absolute inset-0 rounded-lg bg-white/80 shadow-sm dark:bg-white/10"
                style={{ zIndex: -1 }}
                transition={{ type: 'spring', stiffness: 250, damping: 28 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
