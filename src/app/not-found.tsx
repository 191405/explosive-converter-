"use client";

import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-2xl mx-auto px-6 py-16 text-center select-none font-sans">
      <div className="text-8xl sm:text-[10rem] font-extralight tracking-[-0.04em] text-white/10 leading-none">
        404
      </div>

      <div className="mt-8 flex flex-col gap-3 max-w-md">
        <h2 className="text-xl font-medium text-white">
          This page doesn&apos;t exist
        </h2>
        <p className="text-sm text-zinc-500 leading-relaxed">
          The route you requested could not be found. It may have been moved or the URL might be incorrect.
        </p>
      </div>

      <div className="mt-8 flex items-center gap-3">
        <Link
          href="/"
          className="h-10 flex items-center gap-2 px-5 rounded-lg bg-white text-black font-semibold text-sm shadow-lg hover:shadow-white/10 transition-all"
        >
          <Home size={14} />
          <span>Go Home</span>
        </Link>
        <button
          onClick={() => history.back()}
          className="h-10 flex items-center gap-2 px-5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-zinc-300 border border-white/[0.08] text-sm font-medium transition-all cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Go Back</span>
        </button>
      </div>
    </div>
  );
}
