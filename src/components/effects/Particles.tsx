import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ParticlesProps {
  className?: string;
  quantity?: number;
  color?: string;
  staticity?: number;
  ease?: number;
  size?: number;
  vx?: number;
  vy?: number;
}

interface Circle {
  x: number;
  y: number;
  translateX: number;
  translateY: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  dx: number;
  dy: number;
  magnetism: number;
}

/** Hex color string to RGB array */
function hexToRgb(hex: string): [number, number, number] {
  const cleaned = hex.replace("#", "");
  return [
    parseInt(cleaned.slice(0, 2), 16),
    parseInt(cleaned.slice(2, 4), 16),
    parseInt(cleaned.slice(4, 6), 16),
  ];
}

/** Canvas-based particle system with mouse magnetism */
export function Particles({
  className,
  quantity = 60,
  color = "#7c5eb5",
  staticity = 80,
  ease = 60,
  size = 0.4,
  vx = 0,
  vy = 0,
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<Circle[]>([]);
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;
  const rafId = useRef<number>(0);
  const resizeTimeout = useRef<ReturnType<typeof setTimeout>>();

  const [prefersReduced, setPrefersReduced] = useState(false);

  // prefers-reduced-motion: return null (no particles at all)
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mql.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const rgb = hexToRgb(color);

  // Mobile optimization: halve quantity on small screens
  const effectiveQuantity =
    typeof window !== "undefined" && window.innerWidth < 768
      ? Math.ceil(quantity / 2)
      : quantity;

  const createCircle = useCallback((): Circle => {
    const x = Math.random() * canvasSize.current.w;
    const y = Math.random() * canvasSize.current.h;
    return {
      x,
      y,
      translateX: 0,
      translateY: 0,
      size: Math.random() * 2 + size,
      alpha: 0,
      targetAlpha: parseFloat((Math.random() * 0.6 + 0.1).toFixed(1)),
      dx: (Math.random() - 0.5) * 0.2,
      dy: (Math.random() - 0.5) * 0.2,
      magnetism: 0.1 + Math.random() * 4,
    };
  }, [size]);

  const drawCircle = useCallback(
    (circle: Circle, update = false) => {
      const ctx = context.current;
      if (!ctx) return;

      const { x, y, translateX, translateY, size: s, alpha } = circle;
      ctx.translate(x, y);
      ctx.beginPath();
      ctx.arc(translateX, translateY, s, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
      ctx.fill();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!update) {
        circles.current.push(circle);
      }
    },
    [dpr, rgb],
  );

  const initCanvas = useCallback(() => {
    const container = canvasContainerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    circles.current = [];
    canvasSize.current.w = container.offsetWidth;
    canvasSize.current.h = container.offsetHeight;

    canvas.width = canvasSize.current.w * dpr;
    canvas.height = canvasSize.current.h * dpr;
    canvas.style.width = `${canvasSize.current.w}px`;
    canvas.style.height = `${canvasSize.current.h}px`;

    context.current = canvas.getContext("2d");
    if (context.current) {
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    for (let i = 0; i < effectiveQuantity; i++) {
      drawCircle(createCircle());
    }
  }, [dpr, effectiveQuantity, createCircle, drawCircle]);

  const remapValue = (
    value: number,
    start1: number,
    end1: number,
    start2: number,
    end2: number,
  ): number => {
    const remapped =
      ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
    return remapped > 0 ? remapped : 0;
  };

  const animate = useCallback(() => {
    const ctx = context.current;
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasSize.current.w, canvasSize.current.h);

    circles.current.forEach((circle, i) => {
      // Edge detection: recycle particles that go off-screen
      const edgeMargin = circle.size + 2;
      if (
        circle.x < -edgeMargin ||
        circle.x > canvasSize.current.w + edgeMargin ||
        circle.y < -edgeMargin ||
        circle.y > canvasSize.current.h + edgeMargin
      ) {
        circles.current[i] = createCircle();
        circles.current[i].alpha = 0;
        circles.current[i].targetAlpha = parseFloat(
          (Math.random() * 0.6 + 0.1).toFixed(1),
        );
      }

      // Mouse magnetism: drift toward/away from cursor
      circle.x += circle.dx + vx;
      circle.y += circle.dy + vy;
      circle.translateX +=
        (mouse.current.x / (staticity / circle.magnetism) -
          circle.translateX) /
        ease;
      circle.translateY +=
        (mouse.current.y / (staticity / circle.magnetism) -
          circle.translateY) /
        ease;

      // Fade alpha toward target
      if (circle.alpha < circle.targetAlpha) {
        circle.alpha = Math.min(circle.alpha + 0.01, circle.targetAlpha);
      }

      // Distance-based alpha reduction near edges
      const edgeFadeDistance = 40;
      const closestEdge = Math.min(
        circle.x,
        canvasSize.current.w - circle.x,
        circle.y,
        canvasSize.current.h - circle.y,
      );
      if (closestEdge < edgeFadeDistance) {
        circle.alpha = remapValue(
          closestEdge,
          0,
          edgeFadeDistance,
          0,
          circle.targetAlpha,
        );
      }

      drawCircle(circle, true);
    });

    rafId.current = window.requestAnimationFrame(animate);
  }, [createCircle, drawCircle, ease, staticity, vx, vy]);

  // Handle mouse movement relative to canvas center
  const handleMouseMove = useCallback(() => {
    const onMouseMove = (e: MouseEvent) => {
      const container = canvasContainerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const { w, h } = canvasSize.current;
      const x = e.clientX - rect.left - w / 2;
      const y = e.clientY - rect.top - h / 2;
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      if (inside) {
        mouse.current.x = x;
        mouse.current.y = y;
      }
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  // Initialize canvas, start animation, handle resize
  useEffect(() => {
    if (prefersReduced) return;

    initCanvas();
    const cleanupMouse = handleMouseMove();
    rafId.current = window.requestAnimationFrame(animate);

    const handleResize = () => {
      clearTimeout(resizeTimeout.current);
      resizeTimeout.current = setTimeout(initCanvas, 200);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafId.current);
      clearTimeout(resizeTimeout.current);
      window.removeEventListener("resize", handleResize);
      cleanupMouse();
    };
  }, [prefersReduced, initCanvas, handleMouseMove, animate]);

  if (prefersReduced) return null;

  return (
    <div ref={canvasContainerRef} className={cn("h-full w-full", className)}>
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none" />
    </div>
  );
}
