"use client";

/**
 * Engineering Grid Background
 * Pure CSS subtle grid lines with zero JavaScript runtime loops, zero CPU overhead, and 60fps rendering.
 */
export function CinematicBackground() {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none select-none bg-[#070709] [background-image:linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
      aria-hidden="true"
    />
  );
}
