"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Cpu,
  Monitor,
  Command,
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Terminal,
  Binary,
  Radio,
  Shapes,
  Zap,
} from "lucide-react";

interface Step {
  title: string;
  badge: string;
  subtitle: string;
  description: string;
  icon: any;
  points: { title: string; desc: string }[];
}

const STEPS: Step[] = [
  {
    badge: "Hybrid Architecture",
    title: "100% In-Memory WASM SIMD & Edge Streaming",
    subtitle: "Zero-server file privacy and high-throughput execution",
    icon: ShieldCheck,
    description:
      "Explosive Studio Suite processes your files directly inside your browser memory using WebAssembly SIMD and Web Workers. For extreme batch workloads, an optional Edge Streaming pipeline is available.",
    points: [
      {
        title: "Zero Network Exfiltration",
        desc: "Files are loaded into device RAM and processed locally. Personal documents and video streams never leave your machine.",
      },
      {
        title: "Hardware Concurrency & SIMD",
        desc: "Neural OCR, Bézier vectorization, and video codecs run across all available CPU threads with vector acceleration.",
      },
    ],
  },
  {
    badge: "Pro Engineering Tools",
    title: "Forensics, Vectors, OCR & Spatial Audio DSP",
    subtitle: "7 brand new super-rare capabilities",
    icon: Cpu,
    description:
      "Explore pro-grade tools that eliminate the need for expensive desktop software suites.",
    points: [
      {
        title: "Forensic Metadata & Stego",
        desc: "Scrub tracking tags, inspect raw EXIF headers, and visualize LSB steganography bitplanes.",
      },
      {
        title: "Raster to Vector & Document OCR",
        desc: "Trace pixel images to smooth SVG paths and extract text from document scans with zero cloud API keys.",
      },
      {
        title: "Spatial Audio DSP & Stem Phase",
        desc: "Vocal removal/karaoke via stereo center phase cancellation, 3D binaural panning, and 8-band parametric EQ.",
      },
    ],
  },
  {
    badge: "Data & Media Optimization",
    title: "Universal Code AST Morph & In-Memory Archive",
    subtitle: "Lossless schema transforms and archive repacking",
    icon: Binary,
    description:
      "Transform developer payloads and compress nested archives without touching the filesystem disk.",
    points: [
      {
        title: "Universal Code AST Morph",
        desc: "Bi-directional instant conversion between JSON, YAML, TOML, CSV, XML, and TypeScript interfaces.",
      },
      {
        title: "Archive Inspector & Repacker",
        desc: "Explore nested ZIP/TAR catalogs and pack multi-file batches into in-memory containers.",
      },
    ],
  },
  {
    badge: "Developer Ergonomics",
    title: "Live Stdout Terminal & Command Deck",
    subtitle: "Tactile industrial interface with 0 AI gimmicks",
    icon: Terminal,
    description:
      "Designed for power users with real-time stdout telemetry, hardware profiling, and instant keyboard navigation.",
    points: [
      {
        title: "Live Stdout Terminal Drawer (`~`)",
        desc: "Press `~` or click the top telemetry bar to view real-time FFmpeg and WASM stdout/stderr logs.",
      },
      {
        title: "Command Deck (⌘K / Ctrl+K)",
        desc: "Jump to any tool or trigger actions instantly with global keyboard shortcuts.",
      },
    ],
  },
];

const STORAGE_KEY = "explosive_studio_guide_v2";

export function OnboardingTutorial() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeen = localStorage.getItem(STORAGE_KEY);
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 600);
      return () => clearTimeout(timer);
    }

    const handleOpenTour = () => {
      setCurrentStep(0);
      setIsOpen(true);
    };

    window.addEventListener("open-system-tour", handleOpenTour);
    return () => window.removeEventListener("open-system-tour", handleOpenTour);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleDismiss();
      } else if (e.key === "ArrowRight") {
        if (currentStep < STEPS.length - 1) setCurrentStep((prev) => prev + 1);
      } else if (e.key === "ArrowLeft") {
        if (currentStep > 0) setCurrentStep((prev) => prev - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentStep]);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setIsOpen(false);
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleDismiss();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  if (!isOpen) return null;

  const step = STEPS[currentStep];
  const StepIcon = step.icon;
  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="relative w-full max-w-xl bg-[#0c0c10] border border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400">
              <Zap size={13} className="text-amber-400" />
              <span>Explosive Studio Guide • Step {currentStep + 1} of {STEPS.length}</span>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
              title="Close guide (Esc)"
            >
              <X size={16} />
            </button>
          </div>

          {/* Step Progress Bar */}
          <div className="w-full h-1 bg-white/[0.06]">
            <motion.div
              className="h-full bg-white"
              initial={{ width: `${(currentStep / STEPS.length) * 100}%` }}
              animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Main Modal Content */}
          <div className="p-6 sm:p-8 flex flex-col gap-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-4"
              >
                {/* Icon & Category Badge */}
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white">
                    <StepIcon size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
                      {step.badge}
                    </span>
                    <h3 className="text-lg font-bold tracking-tight text-white">
                      {step.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
                  {step.description}
                </p>

                {/* Key Technical Highlights */}
                <div className="flex flex-col gap-2.5 pt-2">
                  {step.points.map((pt, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-[#050507] border border-white/[0.06] flex flex-col gap-1"
                    >
                      <span className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5 font-mono">
                        <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                        {pt.title}
                      </span>
                      <span className="text-[11px] text-zinc-400 leading-relaxed pl-5 font-mono">
                        {pt.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Controls */}
          <div className="px-6 py-4 bg-[#08080a] border-t border-white/[0.06] flex items-center justify-between gap-4 font-mono">
            <button
              onClick={handleDismiss}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
            >
              Skip Guide
            </button>

            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <button
                  onClick={handlePrev}
                  className="btn-secondary px-3 py-2 text-xs flex items-center gap-1.5 font-medium cursor-pointer"
                >
                  <ArrowLeft size={13} />
                  <span>Back</span>
                </button>
              )}

              <button
                onClick={handleNext}
                className="btn-primary px-4 py-2 text-xs flex items-center gap-1.5 font-semibold cursor-pointer shadow-sm"
              >
                <span>{isLastStep ? "Enter Studio" : "Continue"}</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
