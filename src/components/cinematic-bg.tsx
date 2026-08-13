"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

/**
 * Cinematic Background — $50k Motion Design Grade
 * 
 * A very deep, pitch-black aesthetic with:
 * 1. Slow, silky monochromatic abstract gradients (CSS)
 * 2. High-frequency analog film grain
 * 3. Soft, subtle interactive cursor tracking
 */
export function CinematicBackground() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const grainRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    // ── Smooth Lerped Cursor Spotlight ──
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    let frame: number;
    const trackCursor = () => {
      const lerp = 0.05; // Very smooth and heavy delay
      current.current.x += (mouse.current.x - current.current.x) * lerp;
      current.current.y += (mouse.current.y - current.current.y) * lerp;

      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate(${current.current.x - 400}px, ${current.current.y - 400}px)`;
      }
      frame = requestAnimationFrame(trackCursor);
    };

    // ── High-Frequency Film Grain ──
    const grainCanvas = grainRef.current;
    let grainFrame: number;
    if (grainCanvas) {
      const ctx = grainCanvas.getContext("2d", { alpha: true });
      // Small canvas stretched via CSS for pixelated analog grain look
      const size = 128; 
      grainCanvas.width = size;
      grainCanvas.height = size;

      const renderGrain = () => {
        if (!ctx) return;
        const imageData = ctx.createImageData(size, size);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const v = Math.random() * 255;
          data[i] = resolvedTheme === "light" ? 0 : v;
          data[i + 1] = resolvedTheme === "light" ? 0 : v;
          data[i + 2] = resolvedTheme === "light" ? 0 : v;
          data[i + 3] = resolvedTheme === "light" ? 8 : 10; // Extremely subtle noise
        }
        ctx.putImageData(imageData, 0, 0);
        
        // Render at 30fps for authentic film stutter
        setTimeout(() => {
          grainFrame = requestAnimationFrame(renderGrain);
        }, 1000 / 30);
      };
      renderGrain();
    }

    window.addEventListener("mousemove", handleMouseMove);
    frame = requestAnimationFrame(trackCursor);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(frame);
      cancelAnimationFrame(grainFrame);
    };
  }, [resolvedTheme]);

  if (!mounted) return null;

  const isLight = resolvedTheme === "light";

  return (
    <div className={`fixed inset-0 z-0 pointer-events-none overflow-hidden ${isLight ? 'bg-[#fcfcfc]' : 'bg-black'}`} aria-hidden="true">
      {/* 
        Layer 1: Silk Gradients 
        Monochromatic, moving very slowly to create a smoke/silk effect.
      */}
      <div 
        className={`absolute w-[200vw] h-[200vh] -top-[50%] -left-[50%] blur-[100px] saturate-0 mix-blend-screen transition-opacity duration-700 ${isLight ? 'opacity-10' : 'opacity-40'}`}
        style={{
          background: isLight 
            ? `radial-gradient(circle at 30% 40%, rgba(0,0,0,0.1) 0%, transparent 40%),
               radial-gradient(circle at 70% 60%, rgba(0,0,0,0.08) 0%, transparent 50%),
               radial-gradient(circle at 50% 20%, rgba(0,0,0,0.06) 0%, transparent 30%)`
            : `radial-gradient(circle at 30% 40%, rgba(255,255,255,0.05) 0%, transparent 40%),
               radial-gradient(circle at 70% 60%, rgba(255,255,255,0.03) 0%, transparent 50%),
               radial-gradient(circle at 50% 20%, rgba(255,255,255,0.04) 0%, transparent 30%)`,
          animation: 'silk-drift 40s ease-in-out infinite alternate',
        }}
      />
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes silk-drift {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(10deg) scale(1.1) translate(-2%, 2%); }
          100% { transform: rotate(-5deg) scale(1.05) translate(2%, -2%); }
        }
      `}} />

      {/* Layer 2: Film Grain */}
      <canvas
        ref={grainRef}
        className="fixed inset-0 w-full h-full opacity-30 mix-blend-screen"
        style={{ imageRendering: "pixelated" }}
      />

      {/* Layer 3: Heavy Smooth Spotlight */}
      <div
        ref={spotlightRef}
        className={`fixed w-[800px] h-[800px] rounded-full transition-opacity duration-700 ${isLight ? 'opacity-20 mix-blend-multiply' : 'opacity-60 mix-blend-screen'}`}
        style={{
          background: isLight 
            ? "radial-gradient(circle, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.02) 30%, transparent 60%)"
            : "radial-gradient(circle, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 30%, transparent 60%)",
          willChange: "transform",
        }}
      />
    </div>
  );
}
