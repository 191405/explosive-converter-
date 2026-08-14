"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

/**
 * High-Performance Cinematic Background
 * 
 * - Desktop: Smooth lerped cursor spotlight & subtle film grain
 * - Mobile: Ultra-lightweight static gradients (zero CPU/canvas overhead for silky 60fps)
 */
export function CinematicBackground() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const grainRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);

    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || "ontouchstart" in window;
      setIsMobile(mobile);
      return mobile;
    };

    const mobile = checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });

    // Only run mouse tracking & continuous canvas loops on non-mobile devices
    if (mobile) return;

    let frame: number;
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const trackCursor = () => {
      const lerp = 0.08;
      current.current.x += (mouse.current.x - current.current.x) * lerp;
      current.current.y += (mouse.current.y - current.current.y) * lerp;

      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate3d(${current.current.x - 350}px, ${current.current.y - 350}px, 0)`;
      }
      frame = requestAnimationFrame(trackCursor);
    };

    // Render single-pass noise texture rather than continuous heavy CPU loop
    const grainCanvas = grainRef.current;
    if (grainCanvas) {
      const ctx = grainCanvas.getContext("2d", { alpha: true });
      const size = 128;
      grainCanvas.width = size;
      grainCanvas.height = size;

      if (ctx) {
        const imageData = ctx.createImageData(size, size);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const v = Math.random() * 255;
          data[i] = v;
          data[i + 1] = v;
          data[i + 2] = v;
          data[i + 3] = resolvedTheme === "light" ? 6 : 8;
        }
        ctx.putImageData(imageData, 0, 0);
      }
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    frame = requestAnimationFrame(trackCursor);

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(frame);
    };
  }, [resolvedTheme]);

  if (!mounted) return null;

  const isLight = resolvedTheme === "light";

  return (
    <div
      className={`fixed inset-0 z-0 pointer-events-none overflow-hidden ${
        isLight ? "bg-[#f7f7f8]" : "bg-[#050505]"
      }`}
      aria-hidden="true"
    >
      {/* 
        Layer 1: Silk Gradient
        Mobile: Light static blur for instant render
        Desktop: Animated smooth drift
      */}
      <div
        className={`absolute w-[160vw] h-[160vh] -top-[30%] -left-[30%] ${
          isMobile ? "blur-[40px] opacity-20" : "blur-[80px] opacity-40"
        } saturate-0 mix-blend-screen transition-opacity duration-700`}
        style={{
          background: isLight
            ? `radial-gradient(circle at 35% 35%, rgba(0,0,0,0.06) 0%, transparent 40%),
               radial-gradient(circle at 65% 65%, rgba(0,0,0,0.04) 0%, transparent 50%)`
            : `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.04) 0%, transparent 40%),
               radial-gradient(circle at 65% 65%, rgba(255,255,255,0.02) 0%, transparent 50%)`,
          animation: isMobile ? "none" : "silk-drift 40s ease-in-out infinite alternate",
          willChange: isMobile ? "auto" : "transform",
        }}
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes silk-drift {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(8deg) scale(1.05) translate(-2%, 2%); }
          100% { transform: rotate(-4deg) scale(1.02) translate(2%, -2%); }
        }
      `,
        }}
      />

      {/* Layer 2: Lightweight Film Grain (Desktop only) */}
      {!isMobile && (
        <canvas
          ref={grainRef}
          className="fixed inset-0 w-full h-full opacity-25 mix-blend-screen pointer-events-none"
          style={{ imageRendering: "pixelated" }}
        />
      )}

      {/* Layer 3: Smooth Spotlight (Desktop only) */}
      {!isMobile && (
        <div
          ref={spotlightRef}
          className={`fixed w-[700px] h-[700px] rounded-full transition-opacity duration-700 ${
            isLight ? "opacity-20 mix-blend-multiply" : "opacity-50 mix-blend-screen"
          }`}
          style={{
            background: isLight
              ? "radial-gradient(circle, rgba(0,0,0,0.05) 0%, transparent 60%)"
              : "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 60%)",
            willChange: "transform",
            transform: "translate3d(-1000px, -1000px, 0)",
          }}
        />
      )}
    </div>
  );
}
