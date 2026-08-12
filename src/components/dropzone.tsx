"use client";

import React, { useCallback, useState } from "react";
import { useDropzone, type DropzoneOptions, type FileRejection } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";

interface NeoDropzoneProps extends Omit<DropzoneOptions, "onDrop"> {
  onDropAccepted: (files: File[]) => void;
  label?: string;
  sublabel?: string;
  icon?: React.ReactNode;
}

export function NeoDropzone({
  onDropAccepted,
  label = "Drop files here",
  sublabel,
  icon,
  ...props
}: NeoDropzoneProps) {
  const [fileCount, setFileCount] = useState(0);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (acceptedFiles.length > 0) {
        setFileCount((prev) => prev + acceptedFiles.length);
        onDropAccepted(acceptedFiles);
      }
      if (fileRejections.length > 0) {
        console.error("Rejected files:", fileRejections);
        alert("Some files were rejected. Please check the file types.");
      }
    },
    [onDropAccepted]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    ...props,
  });

  return (
    <motion.div
      {...(getRootProps() as any)}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`
        w-full max-w-2xl mx-auto p-8 sm:p-12 flex flex-col items-center justify-center
        cursor-pointer transition-all duration-300 relative overflow-hidden glass-panel
        ${isDragActive ? "border-white/40 bg-white/[0.05]" : "border-white/[0.06]"}
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
            className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none"
          />
        )}
      </AnimatePresence>

      <motion.div
        animate={{ y: isDragActive ? -5 : 0 }}
        className={`mb-4 transition-colors duration-300 ${isDragActive ? "text-white" : "text-white/40"}`}
      >
        {icon || (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        )}
      </motion.div>
      <h3 className={`text-xl font-semibold tracking-tight transition-colors duration-300 ${isDragActive ? "text-white" : "text-white/80"}`}>
        {isDragActive ? "Drop to add files" : label}
      </h3>
      {sublabel && (
        <p className="text-sm text-white/40 mt-2 font-light">
          {sublabel}
        </p>
      )}

      {fileCount > 0 && (
        <span className="absolute top-4 right-4 bg-white/10 text-white text-xs px-3 py-1 rounded-full font-medium border border-white/10 backdrop-blur-md">
          {fileCount} file{fileCount !== 1 ? "s" : ""} added
        </span>
      )}
    </motion.div>
  );
}
