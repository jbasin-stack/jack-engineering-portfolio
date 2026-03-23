import { useCallback, useEffect, useId, useRef, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface AnimatedGridPatternProps {
  width?: number;
  height?: number;
  numSquares?: number;
  maxOpacity?: number;
  duration?: number;
  className?: string;
}

/** SVG grid pattern with motion.rect elements that fade in/out at random positions */
export function AnimatedGridPattern({
  width = 40,
  height = 40,
  numSquares = 30,
  maxOpacity = 0.15,
  duration = 4,
  className,
}: AnimatedGridPatternProps) {
  const patternId = useId();
  const containerRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [prefersReduced, setPrefersReduced] = useState(false);

  // prefers-reduced-motion check
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mql.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // Track container size via ResizeObserver
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Generate random grid positions for animated squares
  const getRandomPositions = useCallback(() => {
    const cols = Math.ceil(dimensions.width / width);
    const rows = Math.ceil(dimensions.height / height);
    const totalCells = cols * rows;

    if (totalCells === 0) return [];

    const positions: Array<[number, number]> = [];
    const used = new Set<number>();

    for (let i = 0; i < Math.min(numSquares, totalCells); i++) {
      let idx: number;
      do {
        idx = Math.floor(Math.random() * totalCells);
      } while (used.has(idx));

      used.add(idx);
      positions.push([idx % cols, Math.floor(idx / cols)]);
    }

    return positions;
  }, [dimensions.width, dimensions.height, width, height, numSquares]);

  const [squares, setSquares] = useState<Array<[number, number]>>([]);

  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      setSquares(getRandomPositions());
    }
  }, [dimensions, getRandomPositions]);

  return (
    <svg
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        className,
      )}
    >
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M${width} 0L${width} ${height}M0 ${height}L0 0`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </pattern>
      </defs>

      {/* Static grid lines */}
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />

      {/* Animated squares */}
      {squares.map(([col, row], index) =>
        prefersReduced ? (
          // Static squares when reduced motion is preferred
          <rect
            key={`${col}-${row}-${index}`}
            x={col * width + 1}
            y={row * height + 1}
            width={width - 1}
            height={height - 1}
            fill="currentColor"
            opacity={maxOpacity * 0.5}
          />
        ) : (
          <motion.rect
            key={`${col}-${row}-${index}`}
            x={col * width + 1}
            y={row * height + 1}
            width={width - 1}
            height={height - 1}
            fill="currentColor"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, maxOpacity, 0] }}
            transition={{
              duration,
              repeat: Infinity,
              delay: Math.random() * duration,
              ease: "easeInOut",
            }}
          />
        ),
      )}
    </svg>
  );
}
