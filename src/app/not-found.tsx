import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Home, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] w-full max-w-4xl mx-auto px-4 py-12 text-center select-none font-sans">
      {/* Sukoya Style Fine Art Container */}
      <div className="relative w-full max-w-2xl rounded-3xl overflow-hidden border border-white/[0.08] bg-[#0c0e15] shadow-2xl shadow-black/90 p-8 sm:p-12 flex flex-col items-center gap-6">
        
        {/* Large Ethereal 404 Display */}
        <div className="text-7xl sm:text-9xl font-extralight tracking-widest text-white/90 font-mono select-none">
          4Ø4
        </div>

        {/* Poetic Sukoya Style Copy */}
        <div className="flex flex-col gap-2 max-w-md">
          <h2 className="text-lg sm:text-xl font-light text-zinc-200">
            Outer Reaches of the Memory Heap
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
            We&apos;re sorry. We can&apos;t connect to this workstation route right now. The requested buffer address does not exist or has been cleared from volatile memory.
          </p>
        </div>

        {/* Minimalist Action Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs shadow-lg shadow-amber-400/20 transition-all hover:scale-105"
          >
            <Home size={14} />
            <span>Head Home or Enjoy the View</span>
          </Link>
          <a
            href="/#catalog"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/[0.08] text-xs font-medium transition-all"
          >
            <Compass size={14} className="text-amber-400" />
            <span>Browse Workstations</span>
          </a>
        </div>

        {/* Sukoya Style Subtitle Footer */}
        <div className="pt-6 border-t border-white/[0.04] w-full flex items-center justify-between text-[10px] font-mono text-zinc-500">
          <span>explosive.studio</span>
          <span>head home or enjoy the view?</span>
          <span>web · product · silicon</span>
        </div>
      </div>
    </div>
  );
}
