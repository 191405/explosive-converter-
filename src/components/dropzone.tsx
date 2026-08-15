"use client";

import React, { useCallback, useEffect } from "react";
import { useDropzone, type DropzoneOptions, type FileRejection } from "react-dropzone";
import { Upload, FileUp, Clipboard, ShieldCheck, HardDrive } from "lucide-react";
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
    <div
      {...(getRootProps() as any)}
      className={`
        w-full max-w-3xl mx-auto p-8 sm:p-10 flex flex-col items-center justify-center
        cursor-pointer transition-all duration-150 relative rounded-xl border border-dashed
        select-none font-sans
        ${
          isDragActive
            ? "border-amber-400/80 bg-amber-400/[0.04] shadow-xl"
            : "border-white/[0.12] bg-[#0a0a0d] hover:border-white/[0.25] hover:bg-[#0f0f14]"
        }
      `}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center gap-3 text-center">
        <div
          className={`p-3 rounded-xl border transition-colors ${
            isDragActive
              ? "bg-amber-400 text-black border-amber-400"
              : "bg-white/[0.04] text-zinc-300 border-white/[0.08]"
          }`}
        >
          <FileUp size={22} strokeWidth={1.75} />
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight">
            {isDragActive ? "Release to load into in-memory engine" : label}
          </h3>
          <p className="text-xs text-zinc-400 font-mono max-w-md">{sublabel}</p>
        </div>

        {/* Format indicators and limits */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[10px] font-mono text-zinc-500">
          <span className="flex items-center gap-1 bg-white/[0.03] px-2 py-0.5 rounded border border-white/[0.05]">
            <HardDrive size={11} className="text-zinc-400" />
            <span>Up to {maxSizeMB >= 1024 ? `${maxSizeMB / 1024} GB` : `${maxSizeMB} MB`}</span>
          </span>
          <span className="flex items-center gap-1 bg-white/[0.03] px-2 py-0.5 rounded border border-white/[0.05]">
            <ShieldCheck size={11} className="text-emerald-400" />
            <span>Zero Network Upload</span>
          </span>
          <span className="flex items-center gap-1 bg-white/[0.03] px-2 py-0.5 rounded border border-white/[0.05]">
            <Clipboard size={11} className="text-zinc-400" />
            <span>⌘V Paste Supported</span>
          </span>
        </div>

        {acceptedFormatsList && acceptedFormatsList.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-1 pt-1">
            {acceptedFormatsList.map((fmt) => (
              <span
                key={fmt}
                className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/[0.05] text-zinc-400 border border-white/[0.06]"
              >
                {fmt}
              </span>
            ))}
          </div>
        )}

        {typeof currentCount === "number" && currentCount > 0 && (
          <div className="mt-2 text-[11px] font-mono font-semibold px-3 py-1 rounded bg-white text-black">
            {currentCount} file{currentCount !== 1 ? "s" : ""} staged in memory
          </div>
        )}
      </div>
    </div>
  );
}
