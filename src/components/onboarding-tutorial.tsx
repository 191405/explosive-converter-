"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Cpu,
  Monitor,
  Command,
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  HardDrive,
  Wifi,
  FileCheck,
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
    badge: "System Architecture",
    title: "100% Client-Side In-Memory Execution",
    subtitle: "How files are handled without backend servers",
    icon: Shield,
    description:
      "Unlike traditional file conversion websites that upload your personal documents and videos to remote cloud servers, Explosive Converter operates entirely within your browser's local sandbox.",
    points: [
      {
        title: "Zero Network Uploads",
        desc: "Files are loaded into device RAM and processed locally. Nothing is sent over the network.",
      },
      {
        title: "WebAssembly Codecs",
        desc: "Heavy media encoding (H.264, MP3, Opus) is compiled to binary WebAssembly that runs directly on your CPU threads.",
      },
    ],
  },
  {
    badge: "Core Workflow",
    title: "Batch Transcoding & Precision Tools",
    subtitle: "Configuring quality, codecs, and parameters",
    icon: Cpu,
    description:
      "Each utility gives you granular control over the output parameters without artificial compression artifacts or watermarks.",
    points: [
      {
        title: "Audio & Video Suite",
        desc: "Convert audio formats with custom bitrates (up to 320 kbps), slice waveforms with millisecond precision, or compress video streams with CRF control.",
      },
      {
        title: "Document & Graphic Transcoding",
        desc: "Reorder and split PDF structures or transcode high-resolution image batches directly to WebP/PNG.",
      },
    ],
  },
  {
    badge: "Device Compatibility",
    title: "Cross-Platform vs. Desktop Features",
    subtitle: "Understanding display media capabilities",
    icon: Monitor,
    description:
      "Most tools run seamlessly across mobile phones, tablets, and desktop workstations. Specific studio tools have hardware/browser requirements.",
    points: [
      {
        title: "Universal Mobile & Tablet Tools",
        desc: "Audio conversion, image transcoding, PDF editing, and video compression run on all modern mobile browsers.",
      },
      {
        title: "Desktop-Exclusive Studio",
        desc: "Screen and application window capture requires desktop display media APIs (available on PC, Mac, and Linux).",
      },
    ],
  },
  {
    badge: "Productivity",
    title: "Command Palette & Offline Capability",
    subtitle: "Fast navigation and offline persistence",
    icon: Command,
    description:
      "The platform is designed as a focused, high-speed utility dashboard with keyboard-driven navigation.",
    points: [
      {
        title: "Command Palette (⌘K / Ctrl+K)",
        desc: "Press ⌘K or Ctrl+K anywhere to switch tools instantly or search for supported file extensions.",
      },
      {
        title: "Offline Persistence",
        desc: "Once the WebAssembly binaries are loaded in your browser cache, the suite continues operating without an active internet connection.",
      },
    ],
  },
];

const STORAGE_KEY = "explosive_onboarding_v1";

export function OnboardingTutorial() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check if user has already seen the onboarding tutorial
    const hasSeen = localStorage.getItem(STORAGE_KEY);
    if (!hasSeen) {
      // Small delay for smooth entry after initial load
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 700);
      return () => clearTimeout(timer);
    }

    // Allow manual re-triggering via custom event
    const handleOpenTour = () => {
      setCurrentStep(0);
      setIsOpen(true);
    };

    window.addEventListener("open-system-tour", handleOpenTour);
    return () => window.removeEventListener("open-system-tour", handleOpenTour);
  }, []);

  // Keyboard navigation
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
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="relative w-full max-w-xl bg-bg-surface border border-border-focus rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-border-subtle">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-text-tertiary uppercase tracking-widest">
                System Guide • Step {currentStep + 1} of {STEPS.length}
              </span>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-text-primary/5 transition-colors cursor-pointer"
              title="Close guide (Esc)"
            >
              <X size={16} />
            </button>
          </div>

          {/* Step Progress Bar */}
          <div className="w-full h-1 bg-border-subtle">
            <motion.div
              className="h-full bg-text-primary"
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
                  <div className="p-2.5 rounded-xl bg-text-primary/[0.04] border border-border-subtle text-text-primary">
                    <StepIcon size={20} strokeWidth={1.75} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest block">
                      {step.badge}
                    </span>
                    <h3 className="text-lg font-bold tracking-tight text-text-primary">
                      {step.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-normal">
                  {step.description}
                </p>

                {/* Key Technical Highlights */}
                <div className="flex flex-col gap-2.5 pt-2">
                  {step.points.map((pt, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-bg-base/60 border border-border-subtle flex flex-col gap-1"
                    >
                      <span className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-text-primary/70 shrink-0" />
                        {pt.title}
                      </span>
                      <span className="text-[11px] text-text-secondary leading-relaxed pl-5">
                        {pt.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Controls */}
          <div className="px-6 py-4 bg-bg-base/80 border-t border-border-subtle flex items-center justify-between gap-4">
            <button
              onClick={handleDismiss}
              className="text-xs font-mono text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
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
                <span>{isLastStep ? "Get Started" : "Continue"}</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
