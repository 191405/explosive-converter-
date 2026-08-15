"use client";

import React from "react";

export function CinematicBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Subtle top ambient glow */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-amber-500/[0.04] via-emerald-500/[0.02] to-transparent blur-[120px] rounded-full" />

      {/* Subtle refined engineering dot matrix */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 70% 70% at 50% 30%, black 20%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 30%, black 20%, transparent 80%)",
        }}
      />
    </div>
  );
}
