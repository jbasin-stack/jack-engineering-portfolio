import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, useMotionTemplate } from "motion/react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface CardSpotlightProps {
  children: ReactNode;
  className?: string;
  radius?: number;
  color?: string;
}

/** Mouse-tracked radial gradient spotlight overlay for cards */
export function CardSpotlight({
  children,
  className,
  radius = 300,
  color = "rgba(75, 46, 131, 0.12)",
}: CardSpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // prefers-reduced-motion: skip the spotlight overlay entirely
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mql.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY],
  );

  // Radial gradient follows cursor position via motion template
  const background = useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, ${color}, transparent 80%)`;

  if (prefersReduced) {
    return (
      <div className={cn("relative", className)}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Spotlight overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-[inherit] transition-opacity duration-300"
        style={{ background, opacity: isHovered ? 1 : 0 }}
      />

      {/* Card content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
