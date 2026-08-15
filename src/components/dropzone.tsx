"use client";

import React, { useCallback, useEffect } from "react";
import { useDropzone, type DropzoneOptions, type FileRejection } from "react-dropzone";
import { FileUp, Clipboard, ShieldCheck, HardDrive } from "lucide-react";
import { toast } from "sonner";

export interface NeoDropzoneProps extends Omit<DropzoneOptions, "onDrop"> {
  onDropAccepted?: (files: File[]) => void;
  onDrop?: (acceptedFiles: File[], fileRejections: FileRejection[]) => void;
  label?: string;
  sublabel?: string;
  acceptedFormatsList?: string[];
  icon?: React.ReactNode;
  maxSizeMB?: number;
  currentCount?: number;
}

import { motion } from "framer-motion";

export function NeoDropzone({
  onDropAccepted,
  onDrop: customOnDrop,
  label = "Drop files to load into memory",
  sublabel = "Or click to browse from device. Paste files with Ctrl+V / ⌘V",
  acceptedFormatsList,
  icon,
  maxSizeMB = 2048,
  currentCount,
  ...props
}: NeoDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (customOnDrop) {
        customOnDrop(acceptedFiles, fileRejections);
        return;
      }
      if (acceptedFiles.length > 0 && onDropAccepted) {
        onDropAccepted(acceptedFiles);
      }
      if (fileRejections.length > 0) {
        const reason = fileRejections[0]?.errors[0]?.message || "Unsupported file format.";
        toast.error("File rejected", {
          description: `${reason} Please check the format specifications.`,
        });
      }
    },
    [onDropAccepted, customOnDrop]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    ...props,
  });

  // Support Ctrl+V / Cmd+V paste directly onto the page
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

      const items = e.clipboardData?.items;
      if (!items) return;

      const pastedFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].kind === "file") {
          const file = items[i].getAsFile();
          if (file) pastedFiles.push(file);
        }
      }

      if (pastedFiles.length > 0) {
        if (customOnDrop) customOnDrop(pastedFiles, []);
        else if (onDropAccepted) onDropAccepted(pastedFiles);
        toast.success(`Pasted ${pastedFiles.length} file(s) from clipboard`);
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [customOnDrop, onDropAccepted]);

  return (
    <motion.div
      {...(getRootProps() as any)}
      animate={{
        scale: isDragActive ? 1.02 : 1,
        borderColor: isDragActive ? "var(--text-main)" : "transparent",
      }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`
        w-full max-w-3xl mx-auto p-8 sm:p-10 flex flex-col items-center justify-center
        cursor-pointer transition-colors duration-200 relative rounded-2xl select-none font-sans neu-inset
        ${
          isDragActive
            ? "shadow-2xl ring-2 ring-[var(--text-main)]/20"
            : "hover:border-[var(--border-active)]"
        }
      `}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center gap-3.5 text-center">
        <motion.div
          animate={isDragActive ? { y: [-2, 2, -2], scale: 1.15 } : { y: 0, scale: 1 }}
          transition={{ repeat: isDragActive ? Infinity : 0, duration: 1.2 }}
          className={`p-3.5 rounded-xl neu-btn transition-colors ${
            isDragActive
              ? "text-[var(--text-main)] active"
              : "text-[var(--text-main)]"
          }`}
        >
          {icon || <FileUp size={22} className="text-[var(--text-main)]" />}
        </motion.div>

        <div className="flex flex-col gap-1">
          <h3 className="text-sm sm:text-base font-semibold text-[var(--text-main)] tracking-tight font-sans">
            {isDragActive ? "Release to load into in-memory engine" : label}
          </h3>
          <p className="text-xs text-[var(--text-muted)] font-sans max-w-md">{sublabel}</p>
        </div>

        {/* Format indicators and limits */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[10px] font-mono text-[var(--text-dim)]">
          <span className="flex items-center gap-1.5 bg-[var(--bg-tile)] px-2.5 py-1 rounded-md border border-[var(--border-subtle)] shadow-xs">
            <HardDrive size={11} className="text-[var(--text-dim)]" />
            <span>Up to {maxSizeMB >= 1024 ? `${maxSizeMB / 1024} GB` : `${maxSizeMB} MB`}</span>
          </span>
          <span className="flex items-center gap-1.5 bg-[var(--bg-tile)] px-2.5 py-1 rounded-md border border-[var(--border-subtle)] shadow-xs">
            <ShieldCheck size={11} className="text-emerald-500" />
            <span>Zero Network Upload</span>
          </span>
          <span className="flex items-center gap-1.5 bg-[var(--bg-tile)] px-2.5 py-1 rounded-md border border-[var(--border-subtle)] shadow-xs">
            <Clipboard size={11} className="text-[var(--text-dim)]" />
            <span>⌘V Paste Supported</span>
          </span>
        </div>

        {acceptedFormatsList && acceptedFormatsList.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
            {acceptedFormatsList.map((fmt) => (
              <span
                key={fmt}
                className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-[var(--bg-tile)] text-[var(--text-muted)] border border-[var(--border-subtle)] shadow-xs"
              >
                {fmt}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
