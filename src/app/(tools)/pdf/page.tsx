"use client";

import { useState } from "react";
import { NeoDropzone } from "@/components/dropzone";
import { PDFDocument, degrees } from "pdf-lib";
import { motion, AnimatePresence } from "framer-motion";
import { Merge, Scissors, RotateCw, FileDown, Trash2, FileText, X } from "lucide-react";
import { toast } from "sonner";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

type PDFMode = "merge" | "split" | "rotate";

const modes: { value: PDFMode; label: string; icon: typeof Merge; desc: string }[] = [
  { value: "merge", label: "Merge", icon: Merge, desc: "Combine multiple PDFs into one file" },
  { value: "split", label: "Split / Extract", icon: Scissors, desc: "Extract specific pages from a PDF" },
  { value: "rotate", label: "Rotate Pages", icon: RotateCw, desc: "Rotate all pages by 90°, 180° or 270°" },
];

export default function PDFTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [mode, setMode] = useState<PDFMode>("merge");
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState<number>(0);
  const [resultName, setResultName] = useState("output.pdf");

  // Split-specific
  const [pageRange, setPageRange] = useState("1-3");
  const [totalPages, setTotalPages] = useState<number | null>(null);

  // Rotate-specific
  const [rotateAngle, setRotateAngle] = useState<90 | 180 | 270>(90);

  const handleDrop = async (acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
    setDownloadUrl(null);

    // For split/rotate, read page count of first file
    if ((mode === "split" || mode === "rotate") && acceptedFiles.length > 0) {
      try {
        const buf = await acceptedFiles[0].arrayBuffer();
        const pdf = await PDFDocument.load(buf);
        setTotalPages(pdf.getPageCount());
      } catch {
        setTotalPages(null);
      }
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setDownloadUrl(null);
  };

  const clearAll = () => {
    setFiles([]);
    setDownloadUrl(null);
    setTotalPages(null);
  };

  // ── Merge ──
  const mergePDFs = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of files) {
        const buf = await file.arrayBuffer();
        const pdf = await PDFDocument.load(buf);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((p) => mergedPdf.addPage(p));
      }
      const bytes = await mergedPdf.save();
      const blob = new Blob([bytes as any], { type: "application/pdf" });
      setResultSize(blob.size);
      setResultName("merged-output.pdf");
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error(err);
      toast.error("Failed to merge. Ensure all files are valid PDFs.");
    } finally {
      setIsProcessing(false);
    }
  };

  // ── Split / Extract ──
  const splitPDF = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    try {
      const buf = await files[0].arrayBuffer();
      const srcPdf = await PDFDocument.load(buf);
      const total = srcPdf.getPageCount();

      // Parse page range like "1-3,5,7-9"
      const indices: number[] = [];
      pageRange.split(",").forEach((part) => {
        const trimmed = part.trim();
        if (trimmed.includes("-")) {
          const [start, end] = trimmed.split("-").map(Number);
          for (let i = Math.max(1, start); i <= Math.min(total, end); i++) {
            indices.push(i - 1); // 0-indexed
          }
        } else {
          const n = parseInt(trimmed);
          if (n >= 1 && n <= total) indices.push(n - 1);
        }
      });

      if (indices.length === 0) {
        toast.error("No valid pages in range. Use format: 1-3,5,7-9");
        setIsProcessing(false);
        return;
      }

      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(srcPdf, indices);
      copiedPages.forEach((p) => newPdf.addPage(p));

      const bytes = await newPdf.save();
      const blob = new Blob([bytes as any], { type: "application/pdf" });
      setResultSize(blob.size);
      setResultName(`extracted-pages.pdf`);
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error(err);
      toast.error("Failed to extract pages.");
    } finally {
      setIsProcessing(false);
    }
  };

  // ── Rotate ──
  const rotatePDF = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    try {
      const buf = await files[0].arrayBuffer();
      const pdf = await PDFDocument.load(buf);
      pdf.getPages().forEach((page) => {
        page.setRotation(degrees((page.getRotation().angle + rotateAngle) % 360));
      });
      const bytes = await pdf.save();
      const blob = new Blob([bytes as any], { type: "application/pdf" });
      setResultSize(blob.size);
      setResultName(`rotated-${rotateAngle}.pdf`);
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error(err);
      toast.error("Failed to rotate pages.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAction = () => {
    if (mode === "merge") mergePDFs();
    else if (mode === "split") splitPDF();
    else if (mode === "rotate") rotatePDF();
  };

  const canAct =
    (mode === "merge" && files.length >= 2) ||
    ((mode === "split" || mode === "rotate") && files.length >= 1);

  const totalInputSize = files.reduce((sum, f) => sum + f.size, 0);

  return (
    <div className="w-full max-w-4xl flex flex-col items-center gap-10">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-black text-glow tracking-tight">PDF Studio</h1>
        <p className="text-text-primary/50 font-light text-lg">Merge, split, extract & rotate PDFs — entirely in your browser.</p>
      </div>

      {/* Mode Selector */}
      <div className="glass-panel p-1.5 flex flex-wrap justify-center gap-1 w-full max-w-xl">
        {modes.map((m) => {
          const Icon = m.icon;
          const active = mode === m.value;
          return (
            <motion.button
              key={m.value}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setMode(m.value);
                setDownloadUrl(null);
                if (m.value === "merge") { setTotalPages(null); }
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all flex-1 min-w-[100px] justify-center ${
                active ? "bg-text-primary text-bg-base font-semibold shadow-lg" : "text-text-primary/50 hover:text-text-primary font-medium hover:bg-text-primary/[0.05]"
              }`}
            >
              <Icon size={16} strokeWidth={active ? 2 : 1.5} />
              {m.label}
            </motion.button>
          );
        })}
      </div>

      {/* Mode Description */}
      <AnimatePresence mode="wait">
        <motion.p
          key={mode}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="text-sm text-text-primary/40 text-center font-mono tracking-wide"
        >
          {modes.find((m) => m.value === mode)?.desc}
        </motion.p>
      </AnimatePresence>

      {/* Dropzone */}
      <NeoDropzone
        onDropAccepted={handleDrop}
        accept={{ "application/pdf": [".pdf"] }}
        multiple={mode === "merge"}
        label={mode === "merge" ? "Drop PDF files here" : "Drop a PDF file"}
        sublabel={mode === "merge" ? "Add 2+ PDFs to merge" : "Select one PDF to process"}
        icon={<FileText size={40} strokeWidth={1.5} />}
      />

      {/* File list */}
      {files.length > 0 && (
        <div className="w-full max-w-2xl glass-panel p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-text-primary/[0.05] pb-4">
            <h3 className="font-semibold text-lg tracking-tight">
              {files.length} file{files.length !== 1 ? "s" : ""}{" "}
              <span className="text-text-primary/40 font-mono text-xs ml-2">{formatBytes(totalInputSize)}</span>
            </h3>
            <button onClick={clearAll} className="text-xs text-text-primary/40 hover:text-text-primary transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-text-primary/[0.05]">
              <Trash2 size={14} /> Clear all
            </button>
          </div>

          {/* Page info for split/rotate */}
          {totalPages && (mode === "split" || mode === "rotate") && (
            <div className="bg-text-primary/[0.03] border border-text-primary/[0.05] px-4 py-3 rounded-lg text-sm text-text-primary/60 flex items-center gap-2">
              <FileText size={16} className="text-text-primary/40" />
              Document has <span className="text-text-primary font-semibold">{totalPages}</span> pages
            </div>
          )}

          <motion.div layout className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-2">
            <AnimatePresence>
              {files.map((file, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.98, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, x: -10 }}
                  key={`${file.name}-${index}`}
                  className="bg-text-primary/[0.02] border border-text-primary/[0.04] flex items-center justify-between px-4 py-3 rounded-lg hover:bg-text-primary/[0.04] transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="p-2 rounded bg-text-primary/[0.05] text-text-primary/70 shrink-0">
                      <FileText size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-[11px] text-text-primary/40 font-mono mt-0.5">{formatBytes(file.size)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-text-primary/30 hover:text-text-primary hover:bg-text-primary/10 p-1.5 rounded-md transition-all shrink-0"
                  >
                    <X size={16} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Split-specific: page range input */}
          {mode === "split" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex flex-col sm:flex-row items-center gap-4 bg-text-primary/[0.02] p-4 rounded-lg border border-text-primary/[0.04]"
            >
              <label className="text-sm text-text-primary/60 whitespace-nowrap font-medium">Pages to extract:</label>
              <input
                type="text"
                value={pageRange}
                onChange={(e) => setPageRange(e.target.value)}
                placeholder="e.g. 1-3,5,7-9"
                className="input-base px-4 py-2 w-full sm:w-48 text-sm outline-none placeholder:text-text-primary/20"
              />
            </motion.div>
          )}

          {/* Rotate-specific: angle picker */}
          {mode === "rotate" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex items-center justify-between gap-4 bg-text-primary/[0.02] p-4 rounded-lg border border-text-primary/[0.04]"
            >
              <span className="text-sm text-text-primary/60 font-medium">Rotation Angle:</span>
              <div className="flex p-1 rounded-lg bg-text-primary/40 border border-text-primary/[0.05]">
                {([90, 180, 270] as const).map((angle) => (
                  <button
                    key={angle}
                    onClick={() => setRotateAngle(angle)}
                    className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${
                      rotateAngle === angle
                        ? "bg-text-primary text-bg-base shadow-sm"
                        : "text-text-primary/50 hover:text-text-primary hover:bg-text-primary/[0.05]"
                    }`}
                  >
                    {angle}°
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Action bar */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            {!downloadUrl ? (
              <button
                onClick={handleAction}
                disabled={!canAct || isProcessing}
                className="btn-primary px-8 py-3 w-full sm:w-auto flex items-center justify-center gap-2 text-sm"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                    Processing…
                  </>
                ) : (
                  <>
                    {mode === "merge" && <Merge size={16} />}
                    {mode === "split" && <Scissors size={16} />}
                    {mode === "rotate" && <RotateCw size={16} />}
                    {mode === "merge" ? "Merge PDFs" : mode === "split" ? "Extract Pages" : "Rotate All Pages"}
                  </>
                )}
              </button>
            ) : (
              <a href={downloadUrl} download={resultName} className="w-full sm:w-auto">
                <button className="btn-primary px-8 py-3 w-full flex items-center justify-center gap-2 text-sm bg-text-primary text-bg-base">
                  <FileDown size={16} />
                  Download Result <span className="opacity-60 font-mono text-[10px] ml-1">({formatBytes(resultSize)})</span>
                </button>
              </a>
            )}
            {mode === "merge" && !downloadUrl && files.length < 2 && (
              <span className="text-xs text-text-primary/40">Add at least 2 files</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
