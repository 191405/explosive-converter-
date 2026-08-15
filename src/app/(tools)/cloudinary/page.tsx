"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { NeoDropzone } from "@/components/dropzone";
import {
  Sparkles,
  Sliders,
  Crop,
  Layers,
  Image as ImageIcon,
  Download,
  Copy,
  Check,
  Code,
  Maximize2,
  RefreshCw,
  Eye,
  Type,
  Shield,
  Zap,
  ArrowRight,
  SlidersHorizontal,
  Flame,
} from "lucide-react";
import { toast } from "sonner";
import { emitLog } from "@/lib/engine/orchestrator";

export interface CloudinaryParams {
  cropMode: "fill" | "fit" | "crop" | "scale" | "pad";
  width: number;
  height: number;
  gravity: "center" | "face" | "north" | "south" | "east" | "west" | "north_east" | "south_east";
  quality: number;
  format: "webp" | "avif" | "png" | "jpeg";
  // Effects
  brightness: number; // -100 to 100
  contrast: number; // -100 to 100
  saturation: number; // -100 to 100
  blur: number; // 0 to 50
  sharpen: number; // 0 to 100
  grayscale: boolean;
  sepia: boolean;
  invert: boolean;
  vignette: number; // 0 to 100
  // Overlays
  overlayText: string;
  overlayFontSize: number;
  overlayColor: string;
  overlayGravity: "north_east" | "south_east" | "south_west" | "north_west" | "center";
  overlayOpacity: number;
}

const DEFAULT_PARAMS: CloudinaryParams = {
  cropMode: "fill",
  width: 1200,
  height: 630,
  gravity: "center",
  quality: 85,
  format: "webp",
  brightness: 0,
  contrast: 0,
  saturation: 0,
  blur: 0,
  sharpen: 0,
  grayscale: false,
  sepia: false,
  invert: false,
  vignette: 0,
  overlayText: "Explosive Media Studio",
  overlayFontSize: 28,
  overlayColor: "#ffffff",
  overlayGravity: "south_east",
  overlayOpacity: 85,
};

export default function CloudinaryPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalDim, setOriginalDim] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [params, setParams] = useState<CloudinaryParams>(DEFAULT_PARAMS);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transformedDataUrl, setTransformedDataUrl] = useState<string | null>(null);
  const [transformedSize, setTransformedSize] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageElementRef = useRef<HTMLImageElement | null>(null);

  // Generate standard Cloudinary transformation string
  const cloudinaryUrlString = useMemo(() => {
    const parts: string[] = [];
    parts.push(`c_${params.cropMode}`);
    if (params.width) parts.push(`w_${params.width}`);
    if (params.height) parts.push(`h_${params.height}`);
    if (params.gravity !== "center") parts.push(`g_${params.gravity}`);
    parts.push(`q_${params.quality}`);
    parts.push(`f_${params.format}`);

    const effects: string[] = [];
    if (params.brightness !== 0) effects.push(`brightness:${params.brightness}`);
    if (params.contrast !== 0) effects.push(`contrast:${params.contrast}`);
    if (params.saturation !== 0) effects.push(`saturation:${params.saturation}`);
    if (params.blur > 0) effects.push(`blur:${params.blur}`);
    if (params.sharpen > 0) effects.push(`sharpen:${params.sharpen}`);
    if (params.grayscale) effects.push("grayscale");
    if (params.sepia) effects.push("sepia");
    if (params.invert) effects.push("invert");
    if (params.vignette > 0) effects.push(`vignette:${params.vignette}`);

    if (effects.length > 0) {
      parts.push(`e_${effects.join(";")}`);
    }

    if (params.overlayText.trim()) {
      parts.push(
        `l_text:Inter_${params.overlayFontSize}_bold:${encodeURIComponent(params.overlayText)},co_rgb:${params.overlayColor.replace("#", "")},o_${params.overlayOpacity},g_${params.overlayGravity}`
      );
    }

    const filename = file ? file.name : "sample_asset.jpg";
    return `https://res.cloudinary.com/demo/image/upload/${parts.join(",")}/${filename}`;
  }, [params, file]);

  // Load File
  const handleDrop = (files: File[]) => {
    if (files.length === 0) return;
    const f = files[0];
    setFile(f);
    const url = URL.createObjectURL(f);
    setImageSrc(url);

    const img = new Image();
    img.src = url;
    img.onload = () => {
      setOriginalDim({ w: img.naturalWidth, h: img.naturalHeight });
      setParams((prev) => ({
        ...prev,
        width: Math.min(1920, img.naturalWidth),
        height: Math.min(1080, img.naturalHeight),
      }));
      emitLog(`Loaded image [${f.name}] (${img.naturalWidth}x${img.naturalHeight}px)`, "info", "WASM_CORE");
    };
  };

  // Render & Process Image on Canvas
  const processTransformation = useCallback(() => {
    if (!imageSrc || !canvasRef.current) return;
    setIsProcessing(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const targetW = params.width || img.naturalWidth;
      const targetH = params.height || img.naturalHeight;

      canvas.width = targetW;
      canvas.height = targetH;

      // Clear
      ctx.clearRect(0, 0, targetW, targetH);

      // Save initial context state
      ctx.save();

      // 1. Draw Image with Crop/Scale/Gravity
      if (params.cropMode === "fill") {
        const srcRatio = img.naturalWidth / img.naturalHeight;
        const targetRatio = targetW / targetH;
        let sx = 0,
          sy = 0,
          sw = img.naturalWidth,
          sh = img.naturalHeight;

        if (srcRatio > targetRatio) {
          sw = img.naturalHeight * targetRatio;
          if (params.gravity === "center" || params.gravity === "face") {
            sx = (img.naturalWidth - sw) / 2;
          } else if (params.gravity === "east" || params.gravity === "south_east") {
            sx = img.naturalWidth - sw;
          }
        } else {
          sh = img.naturalWidth / targetRatio;
          if (params.gravity === "center" || params.gravity === "face") {
            sy = (img.naturalHeight - sh) / 2;
          } else if (params.gravity === "south" || params.gravity === "south_east") {
            sy = img.naturalHeight - sh;
          }
        }
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetW, targetH);
      } else {
        ctx.drawImage(img, 0, 0, targetW, targetH);
      }

      // 2. Apply CSS/Canvas Filters
      const filterParts: string[] = [];
      if (params.brightness !== 0) filterParts.push(`brightness(${100 + params.brightness}%)`);
      if (params.contrast !== 0) filterParts.push(`contrast(${100 + params.contrast}%)`);
      if (params.saturation !== 0) filterParts.push(`saturate(${100 + params.saturation}%)`);
      if (params.grayscale) filterParts.push("grayscale(100%)");
      if (params.sepia) filterParts.push("sepia(100%)");
      if (params.invert) filterParts.push("invert(100%)");
      if (params.blur > 0) filterParts.push(`blur(${params.blur}px)`);

      if (filterParts.length > 0) {
        ctx.filter = filterParts.join(" ");
        // Re-draw with filter
        ctx.drawImage(canvas, 0, 0);
        ctx.filter = "none";
      }

      // 3. Vignette
      if (params.vignette > 0) {
        const gradient = ctx.createRadialGradient(
          targetW / 2,
          targetH / 2,
          Math.min(targetW, targetH) * 0.3,
          targetW / 2,
          targetH / 2,
          Math.max(targetW, targetH) * 0.7
        );
        gradient.addColorStop(0, "rgba(0,0,0,0)");
        gradient.addColorStop(1, `rgba(0,0,0,${params.vignette / 100})`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, targetW, targetH);
      }

      // 4. Overlays & Typography Watermark
      if (params.overlayText.trim()) {
        ctx.save();
        ctx.globalAlpha = params.overlayOpacity / 100;
        ctx.font = `bold ${params.overlayFontSize}px Inter, sans-serif`;
        ctx.fillStyle = params.overlayColor;
        ctx.textBaseline = "middle";

        const textMetrics = ctx.measureText(params.overlayText);
        const padding = 24;
        let tx = padding;
        let ty = targetH - padding;

        if (params.overlayGravity === "north_east") {
          tx = targetW - textMetrics.width - padding;
          ty = padding + params.overlayFontSize;
        } else if (params.overlayGravity === "south_east") {
          tx = targetW - textMetrics.width - padding;
          ty = targetH - padding - params.overlayFontSize / 2;
        } else if (params.overlayGravity === "north_west") {
          tx = padding;
          ty = padding + params.overlayFontSize;
        } else if (params.overlayGravity === "center") {
          tx = (targetW - textMetrics.width) / 2;
          ty = targetH / 2;
        }

        // Draw shadow
        ctx.shadowColor = "rgba(0,0,0,0.8)";
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.fillText(params.overlayText, tx, ty);
        ctx.restore();
      }

      ctx.restore();

      // Convert to blob data URL
      const mime =
        params.format === "png"
          ? "image/png"
          : params.format === "jpeg"
          ? "image/jpeg"
          : params.format === "avif"
          ? "image/avif"
          : "image/webp";

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setTransformedSize(blob.size);
            const dataUrl = URL.createObjectURL(blob);
            setTransformedDataUrl(dataUrl);
            setIsProcessing(false);
          }
        },
        mime,
        params.quality / 100
      );
    };
  }, [imageSrc, params]);

  // Re-process on parameter changes
  useEffect(() => {
    if (imageSrc) {
      processTransformation();
    }
  }, [imageSrc, params, processTransformation]);

  // Export Transformed Image
  const exportImage = () => {
    if (!transformedDataUrl) return;
    const a = document.createElement("a");
    a.href = transformedDataUrl;
    a.download = `${(file?.name || "cloudinary_asset").replace(/\.[^/.]+$/, "")}_${params.width}x${
      params.height
    }.${params.format}`;
    a.click();
    toast.success("Transformed asset exported successfully.");
  };

  // Copy Cloudinary URL String
  const copyUrl = () => {
    navigator.clipboard.writeText(cloudinaryUrlString);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
    toast.success("Cloudinary transformation string copied to clipboard.");
  };

  // Copy Responsive HTML Picture / Next.js Image Tag
  const copyReactCode = () => {
    const code = `<Image
  src="${cloudinaryUrlString}"
  alt="Dynamic Cloudinary Asset"
  width={${params.width}}
  height={${params.height}}
  quality={${params.quality}}
  format="${params.format}"
  priority
/>`;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    toast.success("Next.js / HTML Image snippet copied to clipboard.");
  };

  return (
    <div className="w-full max-w-6xl flex flex-col gap-8">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
            <span>Media Engine & Cloudinary Studio</span>
            <span>/</span>
            <span className="text-zinc-300">Programmatic Dynamic Asset Pipeline</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white font-sans mt-0.5">
            In-Browser Cloudinary Media Engine
          </h1>
          <p className="text-xs text-zinc-400 font-sans mt-0.5 max-w-2xl font-light">
            Dynamic programmatic media transformation suite. Smart crop (`c_fill`), gravity focal points (`g_face`), effects (`e_sharpen`), dynamic typographic watermarks (`l_text`), and format optimization (`f_auto`, `q_auto`) 100% in volatile memory.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/[0.08] text-zinc-300">
            WASM GPU Canvas
          </span>
          <span className="px-2.5 py-1 rounded bg-white/[0.06] border border-white/[0.12] text-white font-semibold">
            Cloudinary v2 API Spec
          </span>
        </div>
      </div>

      {/* ── Dropzone ── */}
      {!file ? (
        <NeoDropzone
          onDropAccepted={handleDrop}
          maxFiles={1}
          sublabel="Drop any PNG, JPEG, WebP, AVIF, or SVG to open the Cloudinary transformation studio"
        />
      ) : (
        <div className="flex flex-col lg:flex-row items-start gap-6">
          {/* ── Left Column: Live Canvas Preview & Code Inspector ── */}
          <div className="w-full lg:w-7/12 flex flex-col gap-4">
            {/* Live Canvas View */}
            <div className="relative w-full rounded-2xl bg-[#090a0f] border border-white/[0.08] overflow-hidden flex flex-col items-center justify-center min-h-[380px] p-4">
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-[460px] object-contain rounded-lg shadow-2xl transition-all"
              />

              {/* Resolution Tag */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-mono text-zinc-300">
                {params.width} × {params.height} px ({params.format.toUpperCase()})
              </div>

              {/* File Size Tag */}
              {transformedSize > 0 && (
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-mono text-zinc-300">
                  {(transformedSize / 1024).toFixed(1)} KB
                </div>
              )}
            </div>

            {/* Cloudinary Transformation URL Syntax Bar */}
            <div className="p-4 rounded-xl bg-[#0d0e15] border border-white/[0.08] flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-1.5 font-semibold text-white">
                  <Code size={14} />
                  <span>Cloudinary URL Transformation String</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyUrl}
                    className="flex items-center gap-1 text-[11px] text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedUrl ? <Check size={12} className="text-white" /> : <Copy size={12} />}
                    <span>{copiedUrl ? "Copied" : "Copy String"}</span>
                  </button>
                  <span>•</span>
                  <button
                    onClick={copyReactCode}
                    className="flex items-center gap-1 text-[11px] text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {copiedCode ? <Check size={12} className="text-white" /> : <Copy size={12} />}
                    <span>{copiedCode ? "Copied" : "Next.js Snippet"}</span>
                  </button>
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-black/60 font-mono text-[11px] text-zinc-300 break-all select-all border border-white/[0.04]">
                {cloudinaryUrlString}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  setFile(null);
                  setImageSrc(null);
                }}
                className="px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 text-xs font-medium transition-all cursor-pointer"
              >
                Change Asset
              </button>

              <button
                onClick={exportImage}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition-all cursor-pointer shadow-lg"
              >
                <Download size={14} />
                <span>Export Transformed Asset</span>
              </button>
            </div>
          </div>

          {/* ── Right Column: Parameter Controls (Cloudinary Pipeline) ── */}
          <div className="w-full lg:w-5/12 flex flex-col gap-4">
            <div className="p-5 rounded-2xl bg-[#0d0e15] border border-white/[0.08] flex flex-col gap-6 max-h-[640px] overflow-y-auto pr-2">
              {/* Preset Aspect Ratios */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-white">Social & Web Presets</span>
                <div className="grid grid-cols-3 gap-2 text-xs font-medium">
                  {[
                    { label: "16:9 Landscape", w: 1200, h: 675 },
                    { label: "9:16 Reel/Story", w: 1080, h: 1920 },
                    { label: "1:1 Square", w: 1080, h: 1080 },
                    { label: "4:5 Instagram", w: 1080, h: 1350 },
                    { label: "OG Card", w: 1200, h: 630 },
                    { label: "HD 1080p", w: 1920, h: 1080 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => setParams((p) => ({ ...p, width: preset.w, height: preset.h }))}
                      className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] text-zinc-300 text-left transition-all cursor-pointer"
                    >
                      <div className="font-semibold text-white text-[11px]">{preset.label}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">{preset.w}×{preset.h}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dimensions & Crop Mode */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-semibold text-white">Crop Mode (`c_*`) & Gravity (`g_*`)</span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] text-zinc-400">Crop Mode</span>
                    <select
                      value={params.cropMode}
                      onChange={(e) => setParams((p) => ({ ...p, cropMode: e.target.value as any }))}
                      className="h-8 px-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white outline-none cursor-pointer"
                    >
                      <option value="fill" className="bg-[#0d0e15]">c_fill (Smart Crop)</option>
                      <option value="fit" className="bg-[#0d0e15]">c_fit (Contain)</option>
                      <option value="scale" className="bg-[#0d0e15]">c_scale (Stretch)</option>
                      <option value="crop" className="bg-[#0d0e15]">c_crop (Raw Slice)</option>
                      <option value="pad" className="bg-[#0d0e15]">c_pad (Letterbox)</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] text-zinc-400">Gravity Focal Point</span>
                    <select
                      value={params.gravity}
                      onChange={(e) => setParams((p) => ({ ...p, gravity: e.target.value as any }))}
                      className="h-8 px-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white outline-none cursor-pointer"
                    >
                      <option value="center" className="bg-[#0d0e15]">g_center</option>
                      <option value="face" className="bg-[#0d0e15]">g_face (Smart Saliency)</option>
                      <option value="north" className="bg-[#0d0e15]">g_north (Top)</option>
                      <option value="south" className="bg-[#0d0e15]">g_south (Bottom)</option>
                      <option value="north_east" className="bg-[#0d0e15]">g_north_east</option>
                      <option value="south_east" className="bg-[#0d0e15]">g_south_east</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] text-zinc-400">Width (px)</span>
                    <input
                      type="number"
                      value={params.width}
                      onChange={(e) => setParams((p) => ({ ...p, width: Number(e.target.value) }))}
                      className="h-8 px-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] text-zinc-400">Height (px)</span>
                    <input
                      type="number"
                      value={params.height}
                      onChange={(e) => setParams((p) => ({ ...p, height: Number(e.target.value) }))}
                      className="h-8 px-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Visual Enhancements & Filters (`e_*`) */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-semibold text-white">Visual Enhancements & Filters (`e_*`)</span>

                {/* Brightness */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[11px] text-zinc-400">
                    <span>Brightness</span>
                    <span className="font-mono">{params.brightness}</span>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={params.brightness}
                    onChange={(e) => setParams((p) => ({ ...p, brightness: Number(e.target.value) }))}
                    className="w-full accent-white cursor-pointer"
                  />
                </div>

                {/* Contrast */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[11px] text-zinc-400">
                    <span>Contrast</span>
                    <span className="font-mono">{params.contrast}</span>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={params.contrast}
                    onChange={(e) => setParams((p) => ({ ...p, contrast: Number(e.target.value) }))}
                    className="w-full accent-white cursor-pointer"
                  />
                </div>

                {/* Saturation */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[11px] text-zinc-400">
                    <span>Saturation</span>
                    <span className="font-mono">{params.saturation}</span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={params.saturation}
                    onChange={(e) => setParams((p) => ({ ...p, saturation: Number(e.target.value) }))}
                    className="w-full accent-white cursor-pointer"
                  />
                </div>

                {/* Vignette */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[11px] text-zinc-400">
                    <span>Vignette Depth</span>
                    <span className="font-mono">{params.vignette}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={params.vignette}
                    onChange={(e) => setParams((p) => ({ ...p, vignette: Number(e.target.value) }))}
                    className="w-full accent-white cursor-pointer"
                  />
                </div>

                {/* Toggles */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <label className="flex items-center gap-1.5 text-xs text-zinc-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={params.grayscale}
                      onChange={(e) => setParams((p) => ({ ...p, grayscale: e.target.checked }))}
                      className="rounded bg-white/[0.04] border-white/[0.1] text-white"
                    />
                    <span>Grayscale</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-zinc-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={params.sepia}
                      onChange={(e) => setParams((p) => ({ ...p, sepia: e.target.checked }))}
                      className="rounded bg-white/[0.04] border-white/[0.1] text-white"
                    />
                    <span>Sepia</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-zinc-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={params.invert}
                      onChange={(e) => setParams((p) => ({ ...p, invert: e.target.checked }))}
                      className="rounded bg-white/[0.04] border-white/[0.1] text-white"
                    />
                    <span>Invert</span>
                  </label>
                </div>
              </div>

              {/* Dynamic Typography & Watermark (`l_text`) */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-semibold text-white">Dynamic Watermark (`l_text`)</span>
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] text-zinc-400">Overlay Text</span>
                  <input
                    type="text"
                    value={params.overlayText}
                    onChange={(e) => setParams((p) => ({ ...p, overlayText: e.target.value }))}
                    placeholder="Enter text stamp..."
                    className="h-8 px-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] text-zinc-400">Anchor Position</span>
                    <select
                      value={params.overlayGravity}
                      onChange={(e) => setParams((p) => ({ ...p, overlayGravity: e.target.value as any }))}
                      className="h-8 px-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white outline-none cursor-pointer"
                    >
                      <option value="south_east" className="bg-[#0d0e15]">Bottom Right</option>
                      <option value="south_west" className="bg-[#0d0e15]">Bottom Left</option>
                      <option value="north_east" className="bg-[#0d0e15]">Top Right</option>
                      <option value="north_west" className="bg-[#0d0e15]">Top Left</option>
                      <option value="center" className="bg-[#0d0e15]">Center</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] text-zinc-400">Font Size (px)</span>
                    <input
                      type="number"
                      value={params.overlayFontSize}
                      onChange={(e) => setParams((p) => ({ ...p, overlayFontSize: Number(e.target.value) }))}
                      className="h-8 px-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Format & Quality Optimization (`f_auto`, `q_auto`) */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-semibold text-white">Output Format & Quality Optimization</span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] text-zinc-400">Format (`f_*`)</span>
                    <select
                      value={params.format}
                      onChange={(e) => setParams((p) => ({ ...p, format: e.target.value as any }))}
                      className="h-8 px-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white outline-none cursor-pointer"
                    >
                      <option value="webp" className="bg-[#0d0e15]">WebP (Optimal)</option>
                      <option value="avif" className="bg-[#0d0e15]">AVIF (Next-Gen)</option>
                      <option value="png" className="bg-[#0d0e15]">PNG (Lossless)</option>
                      <option value="jpeg" className="bg-[#0d0e15]">JPEG (Standard)</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] text-zinc-400">Quality (`q_{params.quality}`)</span>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      value={params.quality}
                      onChange={(e) => setParams((p) => ({ ...p, quality: Number(e.target.value) }))}
                      className="accent-white cursor-pointer mt-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
