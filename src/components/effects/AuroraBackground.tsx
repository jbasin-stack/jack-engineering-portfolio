import { cn } from "@/lib/utils";
import type { ReactNode, HTMLAttributes } from "react";

interface AuroraBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

/** CSS-only aurora gradient wrapper with animated background-position shift */
export function AuroraBackground({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden bg-cleanroom",
        className,
      )}
      {...props}
    >
      {/* Aurora gradient layer */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={cn(
            `[--aurora:repeating-linear-gradient(100deg,var(--color-uw-purple-light)_10%,var(--color-uw-purple-soft)_15%,var(--color-uw-purple-faint)_20%,var(--color-uw-purple-light)_25%,var(--color-uw-purple-soft)_30%)]`,
            `[--white-gradient:repeating-linear-gradient(100deg,var(--color-cleanroom)_0%,var(--color-cleanroom)_7%,transparent_10%,transparent_12%,var(--color-cleanroom)_16%)]`,
            `[background-image:var(--white-gradient),var(--aurora)]`,
            `[background-size:300%,_200%]`,
            `animate-aurora`,
            `filter blur-[40px]`,
            `will-change-[filter]`,
            `after:content-[''] after:absolute after:inset-0`,
            `after:[background-image:var(--white-gradient),var(--aurora)]`,
            `after:[background-size:200%,_100%]`,
            `after:animate-aurora after:mix-blend-difference`,
            `pointer-events-none absolute -inset-[10px] opacity-40`,
            showRadialGradient &&
              `[mask-image:radial-gradient(ellipse_at_50%_0%,black_25%,transparent_70%)]`,
          )}
        />
      </div>

      {/* Content rendered above the aurora */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
