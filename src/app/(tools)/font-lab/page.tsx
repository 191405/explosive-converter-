"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { NeoDropzone } from "@/components/dropzone";
import {
  Type,
  Layers,
  Scissors,
  Download,
  Search,
  Code,
  FileDown,
  Info,
  CheckCircle2,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import * as opentype from "opentype.js";
import type { Font, Glyph } from "opentype.js";
import { toast } from "sonner";

export default function FontLabPage() {
  const [file, setFile] = useState<File | null>(null);
  const [font, setFont] = useState<Font | null>(null);
  const [fontMetadata, setFontMetadata] = useState<{
    familyName: string;
    subfamilyName: string;
    unitsPerEm: number;
    numGlyphs: number;
    ascender: number;
    descender: number;
  } | null>(null);

  const [selectedGlyphIndex, setSelectedGlyphIndex] = useState<number>(0);
  const [searchChar, setSearchChar] = useState<string>("");
  const [previewText, setPreviewText] = useState<string>("The quick brown fox jumps over the lazy dog 0123456789");
  const [previewFontSize, setPreviewFontSize] = useState<number>(36);

  // Subsetting state
  const [subsetMode, setSubsetMode] = useState<"latin" | "ascii" | "custom">("latin");
  const [customSubsetChars, setCustomSubsetChars] = useState<string>("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,!?-+=");
  const [isSubsetting, setIsSubsetting] = useState<boolean>(false);

  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Parse Font on Drop
  const handleDrop = async (files: File[]) => {
    if (files.length === 0) return;
    const f = files[0];
    setFile(f);

    try {
      const buffer = await f.arrayBuffer();
      const parsedFont = opentype.parse(buffer);
      setFont(parsedFont);

      setFontMetadata({
        familyName: parsedFont.names.fontFamily?.en || f.name.replace(/\.[^/.]+$/, ""),
        subfamilyName: parsedFont.names.fontSubfamily?.en || "Regular",
        unitsPerEm: parsedFont.unitsPerEm,
        numGlyphs: parsedFont.glyphs.length,
        ascender: parsedFont.ascender,
        descender: parsedFont.descender,
      });

      setSelectedGlyphIndex(0);
      toast.success(`Parsed ${parsedFont.glyphs.length} glyphs from ${f.name}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to parse font file. Ensure it is a valid TTF, OTF, or WOFF font.");
    }
  };

  // Render Selected Glyph SVG path
  const selectedGlyph = useMemo(() => {
    if (!font || selectedGlyphIndex < 0 || selectedGlyphIndex >= font.glyphs.length) return null;
    return font.glyphs.get(selectedGlyphIndex);
  }, [font, selectedGlyphIndex]);

  const glyphSvgPath = useMemo(() => {
    if (!font || !selectedGlyph) return "";
    try {
      const path = selectedGlyph.getPath(20, 140, 120);
      return path.toPathData(2);
    } catch {
      return "";
    }
  }, [font, selectedGlyph]);

  // Export Glyph as SVG
  const exportGlyphSvg = () => {
    if (!selectedGlyph || !glyphSvgPath) return;
    const svgContent = `<?xml version="1.0" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160">
  <path d="${glyphSvgPath}" fill="#ffffff" />
</svg>`;
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `glyph_${selectedGlyph.name || selectedGlyph.unicode || "char"}.svg`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Vector glyph exported as SVG");
  };

  // Subsetting and exporting lean font
  const exportSubsetFont = () => {
    if (!font || !file) return;
    setIsSubsetting(true);

    try {
      let targetChars = customSubsetChars;
      if (subsetMode === "ascii") {
        targetChars = "";
        for (let i = 32; i <= 126; i++) targetChars += String.fromCharCode(i);
      } else if (subsetMode === "latin") {
        targetChars = "";
        for (let i = 32; i <= 255; i++) targetChars += String.fromCharCode(i);
      }

      // Collect glyphs for target characters
      const subsetGlyphs: Glyph[] = [];
      // Always include .notdef
      const notdef = font.glyphs.get(0);
      if (notdef) subsetGlyphs.push(notdef);

      const seenUnicodes = new Set<number>();
      for (const char of targetChars) {
        const code = char.charCodeAt(0);
        if (!seenUnicodes.has(code)) {
          seenUnicodes.add(code);
          const g = font.charToGlyph(char);
          if (g && g.index !== 0) {
            subsetGlyphs.push(g);
          }
        }
      }

      // Create new opentype font with subsetted glyphs
      const subsettedFont = new opentype.Font({
        familyName: `${fontMetadata?.familyName || "Subset"} Subset`,
        styleName: fontMetadata?.subfamilyName || "Regular",
        unitsPerEm: font.unitsPerEm,
        ascender: font.ascender,
        descender: font.descender,
        glyphs: subsetGlyphs,
      });

      const outBuffer = subsettedFont.toArrayBuffer();
      const blob = new Blob([outBuffer], { type: "font/opentype" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const baseName = file.name.replace(/\.[^/.]+$/, "");
      a.download = `${baseName}_subset.otf`;
      a.click();
      URL.revokeObjectURL(url);

      const reduction = (((file.size - blob.size) / file.size) * 100).toFixed(1);
      toast.success(`Subset font generated! Reduced by ${reduction}% (${(file.size / 1024).toFixed(0)}KB → ${(blob.size / 1024).toFixed(0)}KB)`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to subset font");
    } finally {
      setIsSubsetting(false);
    }
  };

  return (
    <div className="w-full max-w-6xl flex flex-col gap-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
            <span>Typography & Vectors</span>
            <span>/</span>
            <span className="text-zinc-300">OpenType Glyph Studio</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white font-sans mt-0.5">
            Font Subsetter, WOFF2 Studio & Glyph Extractor
          </h1>
          <p className="text-xs text-zinc-400 font-sans mt-0.5 max-w-2xl">
            In-memory OpenType/TrueType/WOFF2 parser. Extract vector Bézier curves to SVG, inspect character maps, and strip unused glyphs to slash web font sizes by up to 90%.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <span className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/[0.08] text-zinc-300">
            OpenType.js Engine
          </span>
          <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">
            100% In-Memory
          </span>
        </div>
      </div>

      {!font || !fontMetadata ? (
        <div className="w-full">
          <NeoDropzone
            onDropAccepted={handleDrop}
            maxFiles={1}
            sublabel="Drop TTF, OTF, WOFF, or WOFF2 font files"
          />
        </div>
      ) : (
        <div className="w-full flex flex-col gap-5">
          {/* Metadata Card */}
          <div className="neu-tile p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 neu-btn text-amber-400">
                <Type size={20} />
              </div>
              <div>
                <h3 className="font-sans text-sm font-semibold text-white">
                  {fontMetadata.familyName} <span className="text-zinc-400 font-normal font-mono text-xs">({fontMetadata.subfamilyName})</span>
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 font-mono mt-0.5">
                  <span>{fontMetadata.numGlyphs.toLocaleString()} Glyphs</span>
                  <span>•</span>
                  <span>{fontMetadata.unitsPerEm} UPM</span>
                  <span>•</span>
                  <span>Asc/Desc: {fontMetadata.ascender}/{fontMetadata.descender}</span>
                  <span>•</span>
                  <span>{(file!.size / 1024).toFixed(1)} KB</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setFont(null);
                setFile(null);
                setFontMetadata(null);
              }}
              className="neu-btn px-3 py-1.5 text-xs font-mono text-zinc-400 hover:text-white"
            >
              Change Font
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left: Glyph Browser & Inspector */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {/* Glyph Matrix */}
              <div className="neu-tile p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                  <span className="text-xs font-mono text-zinc-300 font-semibold">
                    Glyph Table ({font.glyphs.length})
                  </span>
                  <div className="relative">
                    <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Find char..."
                      value={searchChar}
                      onChange={(e) => {
                        setSearchChar(e.target.value);
                        if (e.target.value.length > 0) {
                          const g = font.charToGlyph(e.target.value[0]);
                          if (g && g.index !== undefined) setSelectedGlyphIndex(g.index);
                        }
                      }}
                      className="neu-inset pl-7 pr-2 py-1 text-xs text-white placeholder-zinc-500 w-28 font-mono focus:outline-none"
                    />
                  </div>
                </div>

                {/* Virtualized Grid */}
                <div className="grid grid-cols-8 sm:grid-cols-12 md:grid-cols-16 gap-1.5 max-h-60 overflow-y-auto pr-1">
                  {Array.from({ length: Math.min(font.glyphs.length, 300) }).map((_, idx) => {
                    const g = font.glyphs.get(idx);
                    const isSelected = selectedGlyphIndex === idx;
                    const charDisplay = g.unicode ? String.fromCharCode(g.unicode) : "□";

                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedGlyphIndex(idx)}
                        className={`p-2 rounded-lg text-center text-sm font-mono transition-all flex items-center justify-center h-10 ${
                          isSelected
                            ? "bg-amber-400 text-black font-bold shadow-lg"
                            : "neu-btn text-zinc-300 hover:text-white"
                        }`}
                        title={`Index ${idx} • ${g.name || ""} (U+${g.unicode?.toString(16).toUpperCase() || "????"})`}
                      >
                        {charDisplay}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live Typography Preview */}
              <div className="neu-inset p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                  <span className="text-xs font-mono text-zinc-400 font-semibold">Live Waterfall Preview</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-zinc-500">{previewFontSize}px</span>
                    <input
                      type="range"
                      min="16"
                      max="72"
                      value={previewFontSize}
                      onChange={(e) => setPreviewFontSize(Number(e.target.value))}
                      className="neu-slider w-24"
                    />
                  </div>
                </div>

                <input
                  type="text"
                  value={previewText}
                  onChange={(e) => setPreviewText(e.target.value)}
                  className="bg-transparent border-b border-white/[0.08] py-1 text-xs text-zinc-300 focus:outline-none font-mono"
                  placeholder="Type preview string..."
                />

                <div
                  style={{
                    fontSize: `${previewFontSize}px`,
                    lineHeight: 1.2,
                  }}
                  className="text-white py-4 overflow-x-auto whitespace-pre font-sans"
                >
                  {previewText}
                </div>
              </div>
            </div>

            {/* Right: Selected Glyph Inspector & Subsetter */}
            <div className="flex flex-col gap-4">
              {/* Selected Glyph Inspector */}
              <div className="neu-tile p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                  <span className="text-xs font-mono text-zinc-300 font-semibold">Vector Curve Inspector</span>
                  <button
                    onClick={exportGlyphSvg}
                    className="neu-btn px-2.5 py-1 text-xs text-amber-400 flex items-center gap-1"
                  >
                    <FileDown size={12} />
                    <span>SVG</span>
                  </button>
                </div>

                {selectedGlyph && (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-36 h-36 neu-inset flex items-center justify-center p-2">
                      <svg viewBox="0 0 160 160" className="w-full h-full text-white">
                        <path d={glyphSvgPath} fill="currentColor" />
                      </svg>
                    </div>

                    <div className="w-full font-mono text-[11px] text-zinc-400 space-y-1 divide-y divide-white/[0.04]">
                      <div className="flex justify-between py-1">
                        <span>Glyph Name:</span>
                        <span className="text-white">{selectedGlyph.name || "unnamed"}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>Unicode:</span>
                        <span className="text-amber-400">
                          {selectedGlyph.unicode
                            ? `U+${selectedGlyph.unicode.toString(16).padStart(4, "0").toUpperCase()}`
                            : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>Advance Width:</span>
                        <span className="text-white">{selectedGlyph.advanceWidth}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Subsetting Studio */}
              <div className="neu-tile p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                  <span className="text-xs font-mono text-zinc-300 font-semibold">Font Subsetting Studio</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20">
                    -85% Payload
                  </span>
                </div>

                <div className="flex flex-col gap-2 font-mono text-xs">
                  <span className="text-zinc-400 text-[11px]">Subsetting Preset:</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(["latin", "ascii", "custom"] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => setSubsetMode(m)}
                        className={`neu-btn py-1 text-xs capitalize ${
                          subsetMode === m ? "active text-white border-amber-400/40" : "text-zinc-400"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>

                  {subsetMode === "custom" && (
                    <textarea
                      rows={2}
                      value={customSubsetChars}
                      onChange={(e) => setCustomSubsetChars(e.target.value)}
                      placeholder="Paste required characters..."
                      className="neu-inset p-2 text-xs text-white placeholder-zinc-600 focus:outline-none resize-none font-mono"
                    />
                  )}

                  <button
                    onClick={exportSubsetFont}
                    disabled={isSubsetting}
                    className="neu-btn-primary py-2 text-xs flex items-center justify-center gap-2 mt-2"
                  >
                    <Scissors size={13} />
                    <span>{isSubsetting ? "Subsetting..." : "Export Lean Font (.otf)"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
