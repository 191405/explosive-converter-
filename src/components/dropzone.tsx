"use client";

import React, { useCallback } from "react";
import { useDropzone, type DropzoneOptions, type FileRejection } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud } from "lucide-react";
import { toast } from "sonner";

export interface NeoDropzoneProps extends Omit<DropzoneOptions, "onDrop"> {
  onDropAccepted?: (files: File[]) => void;
  onDrop?: (acceptedFiles: File[], fileRejections: FileRejection[]) => void;
  label?: string;
  sublabel?: string;
  icon?: React.ReactNode;
  currentCount?: number;
}

export function NeoDropzone({
  onDropAccepted,
  onDrop: customOnDrop,
  label = "Drop files here or browse",
  sublabel,
  icon,
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
        console.warn("Rejected files:", fileRejections);
        const reason = fileRejections[0]?.errors[0]?.message || "Unsupported file format.";
        toast.error("File rejected", {
          description: `${reason} Please check the supported formats.`,
        });
      }
    },
    [onDropAccepted, customOnDrop]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    ...props,
  });

  return (
    <motion.div
      {...(getRootProps() as any)}
      whileHover={{ scale: 1.005 }}
      whileTap={{ scale: 0.995 }}
      className={`
        w-full max-w-2xl mx-auto p-8 sm:p-12 flex flex-col items-center justify-center
        cursor-pointer transition-all duration-200 relative overflow-hidden rounded-2xl
        border-2 border-dashed
        ${
          isDragActive
            ? "border-text-primary bg-text-primary/[0.08] shadow-lg"
            : "border-border-subtle bg-bg-surface/60 hover:border-border-focus hover:bg-bg-surface"
        }
      `}
    >
      <input {...getInputProps()} />
      
      {/* Animated glow on drag */}
      <AnimatePresence>
        {isDragActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-b from-text-primary/[0.06] to-transparent pointer-events-none"
          />
        )}
      </AnimatePresence>

      <motion.div
        animate={{ y: isDragActive ? -4 : 0 }}
        className={`mb-3 p-3 rounded-2xl transition-colors duration-200 ${
          isDragActive
            ? "bg-text-primary text-bg-base"
            : "bg-text-primary/[0.04] text-text-primary/70 border border-border-subtle"
        }`}
      >
        {icon || <UploadCloud size={28} strokeWidth={1.75} />}
      </motion.div>

      <h3 className="text-base sm:text-lg font-bold tracking-tight text-text-primary text-center">
        {isDragActive ? "Release to process files" : label}
      </h3>

      {sublabel && (
        <p className="text-xs text-text-tertiary mt-1.5 font-mono text-center max-w-md px-2">
          {sublabel}
        </p>
      )}

      {typeof currentCount === "number" && currentCount > 0 && (
        <span className="mt-3 text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-text-primary/10 text-text-primary border border-border-subtle">
          {currentCount} file{currentCount !== 1 ? "s" : ""} selected
        </span>
      )}
    </motion.div>
  );
}
