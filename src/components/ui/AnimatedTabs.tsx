import { useState, useRef, useEffect } from 'react';

interface Tab {
  id: string;
  label: string;
}

interface AnimatedTabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
}

/** Vercel-style tab bar with hover highlight and sliding active underline */
export function AnimatedTabs({ tabs, activeTab, onChange }: AnimatedTabsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoverStyle, setHoverStyle] = useState<{ left: string; width: string }>({
    left: '0px',
    width: '0px',
  });
  const [activeStyle, setActiveStyle] = useState<{ left: string; width: string }>({
    left: '0px',
    width: '0px',
  });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const activeIndex = tabs.findIndex((t) => t.id === activeTab);

  // Position hover highlight
  useEffect(() => {
    if (hoveredIndex !== null) {
      const el = tabRefs.current[hoveredIndex];
      if (el) {
        setHoverStyle({ left: `${el.offsetLeft}px`, width: `${el.offsetWidth}px` });
      }
    }
  }, [hoveredIndex]);

  // Position active underline
  useEffect(() => {
    const el = tabRefs.current[activeIndex];
    if (el) {
      setActiveStyle({ left: `${el.offsetLeft}px`, width: `${el.offsetWidth}px` });
    }
  }, [activeIndex]);

  // Initialize position on mount
  useEffect(() => {
    requestAnimationFrame(() => {
      const el = tabRefs.current[activeIndex >= 0 ? activeIndex : 0];
      if (el) {
        setActiveStyle({ left: `${el.offsetLeft}px`, width: `${el.offsetWidth}px` });
      }
    });
  }, []);

  return (
    <div
      role="tablist"
      className="relative inline-flex w-full rounded-xl bg-silicon-50/50 dark:bg-silicon-200/10 p-1 backdrop-blur-sm"
    >
      <div className="relative w-full">
        {/* Hover highlight pill */}
        <div
          className="absolute top-0 bottom-0 rounded-lg bg-silicon-100/80 dark:bg-white/10 transition-all duration-300 ease-out"
          style={{
            ...hoverStyle,
            opacity: hoveredIndex !== null ? 1 : 0,
          }}
        />

        {/* Active indicator pill */}
        <div
          className="absolute top-1 bottom-1 rounded-md bg-white/80 shadow-sm dark:bg-white/10 transition-all duration-300 ease-out"
          style={activeStyle}
        />

        {/* Tab buttons */}
        <div className="relative flex items-center">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              ref={(el) => { tabRefs.current[index] = el; }}
              role="tab"
              aria-selected={index === activeIndex}
              aria-controls={`panel-${tab.id}`}
              className={`relative z-10 flex-1 rounded-lg px-3 py-2 cursor-pointer transition-colors duration-300 text-sm font-medium whitespace-nowrap flex items-center justify-center ${
                index === activeIndex
                  ? 'text-ink'
                  : 'text-silicon-600 hover:text-ink'
              }`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => onChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
