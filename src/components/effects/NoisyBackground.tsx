import { useId } from "react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface NoisyBackgroundProps {
  children: ReactNode;
  className?: string;
  gradientFrom?: string;
  gradientTo?: string;
  noiseOpacity?: number;
}

/** SVG noise texture overlay with gradient background -- zero JS, pure CSS/SVG */
export function NoisyBackground({
  children,
  className,
  gradientFrom = "var(--color-uw-purple-faint)",
  gradientTo = "var(--color-cleanroom)",
  noiseOpacity = 0.3,
}: NoisyBackgroundProps) {
  // Unique filter ID per instance to avoid SVG ID collisions
  const filterId = useId();

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, ${gradientFrom}, ${gradientTo})`,
        }}
      />

      {/* SVG noise overlay */}
      <svg
        className="absolute inset-0 h-full w-full pointer-events-none"
        aria-hidden="true"
      >
        <filter id={filterId}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves={3}
            stitchTiles="stitch"
          />
        </filter>
        <rect
          width="100%"
          height="100%"
          filter={`url(#${filterId})`}
          opacity={noiseOpacity}
        />
      </svg>

      {/* Content rendered above noise */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
