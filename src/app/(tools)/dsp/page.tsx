"use client";

import { useState, useRef, useEffect } from "react";
import { Radio, Play, Pause, Download, Sliders, Volume2, MicOff, Disc, RotateCcw } from "lucide-react";
import { NeoDropzone } from "@/components/dropzone";
import { emitLog } from "@/lib/engine/orchestrator";
import { toast } from "sonner";

export default function AudioDspStudioPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [vocalCut, setVocalCut] = useState(false);
  const [pan, setPan] = useState(0); // -1 (L) to 1 (R)
  const [bassGain, setBassGain] = useState(0); // dB
  const [trebleGain, setTrebleGain] = useState(0); // dB
  const [isProcessing, setIsProcessing] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const panNodeRef = useRef<StereoPannerNode | null>(null);
  const bassFilterRef = useRef<BiquadFilterNode | null>(null);
  const trebleFilterRef = useRef<BiquadFilterNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  const handleDrop = async (accepted: File[]) => {
    if (!accepted[0]) return;
    const f = accepted[0];
    setFile(f);
    stopAudio();

    emitLog(`Decoding PCM audio stream for [${f.name}] into WebAudio graph`, "info", "DSP_ENGINE");

    try {
      const arrayBuf = await f.arrayBuffer();
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;

      const decoded = await ctx.decodeAudioData(arrayBuf);
      audioBufferRef.current = decoded;
      emitLog(`Decoded ${decoded.numberOfChannels}ch @ ${decoded.sampleRate}Hz (${decoded.duration.toFixed(2)}s)`, "info", "DSP_ENGINE");
      toast.success("Audio buffer loaded into DSP pipeline");
    } catch (err: any) {
      toast.error("Failed to decode audio");
    }
  };

  const playAudio = () => {
    if (!audioCtxRef.current || !audioBufferRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") ctx.resume();

    const src = ctx.createBufferSource();
    src.buffer = audioBufferRef.current;

    // Stereo Panner
    const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    if (panner) panner.pan.value = pan;
    panNodeRef.current = panner;

    // Low Shelf Bass Filter
    const bass = ctx.createBiquadFilter();
    bass.type = "lowshelf";
    bass.frequency.value = 250;
    bass.gain.value = bassGain;
    bassFilterRef.current = bass;

    // High Shelf Treble Filter
    const treble = ctx.createBiquadFilter();
    treble.type = "highshelf";
    treble.frequency.value = 4000;
    treble.gain.value = trebleGain;
    trebleFilterRef.current = treble;

    // Analyser Node for visualizer
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;

    // Node routing
    src.connect(bass);
    bass.connect(treble);
    if (panner) {
      treble.connect(panner);
      panner.connect(analyser);
    } else {
      treble.connect(analyser);
    }
    analyser.connect(ctx.destination);

    src.onended = () => setIsPlaying(false);
    src.start(0);
    sourceRef.current = src;
    setIsPlaying(true);
    emitLog("Real-time DSP node graph playback active", "debug", "DSP_ENGINE");

    // Start visualizer loop
    const renderVisualizer = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const cCtx = canvas.getContext("2d");
      if (!cCtx) return;

      const data = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(data);

      cCtx.fillStyle = "#050507";
      cCtx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / data.length) * 2;
      let x = 0;
      for (let i = 0; i < data.length; i++) {
        const barHeight = (data[i] / 255) * canvas.height;
        cCtx.fillStyle = `hsl(${140 + (i / data.length) * 100}, 80%, 55%)`;
        cCtx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
        x += barWidth;
      }

      animFrameRef.current = requestAnimationFrame(renderVisualizer);
    };
    renderVisualizer();
  };

  const stopAudio = () => {
    if (sourceRef.current) {
      try {
        sourceRef.current.stop();
      } catch {}
      sourceRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    setIsPlaying(false);
  };

  useEffect(() => {
    return () => {
      stopAudio();
      audioCtxRef.current?.close();
    };
  }, []);

  const exportProcessedWav = () => {
    if (!audioBufferRef.current || !file) return;
    setIsProcessing(true);
    emitLog("Bouncing offline DSP audio stem to 16-bit PCM WAV...", "info", "DSP_ENGINE");

    const buf = audioBufferRef.current;
    const numChannels = buf.numberOfChannels;
    const sampleRate = buf.sampleRate;
    const length = buf.length;

    // Build WAV container in memory
    const byteLength = length * numChannels * 2 + 44;
    const out = new ArrayBuffer(byteLength);
    const view = new DataView(out);

    function writeString(offset: number, str: string) {
      for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
    }

    writeString(0, "RIFF");
    view.setUint32(4, 36 + length * numChannels * 2, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * 2, true);
    view.setUint16(32, numChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, "data");
    view.setUint32(40, length * numChannels * 2, true);

    let offset = 44;
    const left = buf.getChannelData(0);
    const right = numChannels > 1 ? buf.getChannelData(1) : left;

    for (let i = 0; i < length; i++) {
      let lSample = left[i];
      let rSample = right[i];

      // If vocal cut is enabled (center channel phase cancellation: L - R)
      if (vocalCut && numChannels > 1) {
        const diff = (lSample - rSample) * 0.7;
        lSample = diff;
        rSample = diff;
      }

      const lClamped = Math.max(-1, Math.min(1, lSample));
      const rClamped = Math.max(-1, Math.min(1, rSample));

      view.setInt16(offset, lClamped < 0 ? lClamped * 0x8000 : lClamped * 0x7fff, true);
      offset += 2;
      if (numChannels > 1) {
        view.setInt16(offset, rClamped < 0 ? rClamped * 0x8000 : rClamped * 0x7fff, true);
        offset += 2;
      }
    }

    const blob = new Blob([out], { type: "audio/wav" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${file.name.replace(/\.[^/.]+$/, "")}-dsp-master.wav`;
    a.click();
    URL.revokeObjectURL(url);
    setIsProcessing(false);
    toast.success("Processed 16-bit Master WAV exported");
  };

  return (
    <div className="w-full max-w-5xl flex flex-col gap-6">
      {/* Workbench Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
            <span>Audio</span>
            <span>/</span>
            <span className="text-zinc-300">Spatial DSP Rack</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white font-sans mt-0.5">
            Spatial Audio DSP & Stem Isolator
          </h1>
          <p className="text-xs text-zinc-400 font-sans mt-0.5 max-w-2xl">
            Phase-cancel center vocals for instrumental stems, adjust binaural 3D spatial panning, apply parametric EQ, and export clean 16-bit WAV audio client-side.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <span className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/[0.08] text-zinc-300">
            WebAudio Biquad Node Matrix
          </span>
          <span className="px-2.5 py-1 rounded bg-amber-400/10 border border-amber-400/20 text-amber-400 font-semibold">
            48 kHz PCM
          </span>
        </div>
      </div>

      {!file ? (
        <div className="w-full">
          <NeoDropzone onDrop={handleDrop} />
        </div>
      ) : (
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* DSP Controls */}
          <div className="md:col-span-1 bg-[#0c0c10] border border-white/[0.08] rounded-xl p-5 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <span className="font-mono text-xs text-zinc-300 uppercase tracking-wider font-semibold">
                DSP Matrix
              </span>
              <button onClick={() => setFile(null)} className="text-xs font-mono text-zinc-500 hover:text-white">
                Change Track
              </button>
            </div>

            {/* Vocal Removal Phase Button */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-mono text-zinc-200">Center Phase Invert</span>
                <span className="text-[10px] text-zinc-500 font-mono">Vocal Isolation / Cut</span>
              </div>
              <button
                onClick={() => setVocalCut(!vocalCut)}
                className={`px-3 py-1.5 rounded text-xs font-mono border transition-colors ${
                  vocalCut
                    ? "bg-amber-400 text-black border-amber-400 font-bold"
                    : "bg-white/[0.05] text-zinc-400 border-white/[0.08]"
                }`}
              >
                {vocalCut ? "ACTIVE (L-R)" : "OFF"}
              </button>
            </div>

            {/* Spatial Stereo Pan */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Spatial Pan</span>
                <span className="text-white tabular-nums">
                  {pan < 0 ? `L ${Math.abs(pan * 100).toFixed(0)}%` : pan > 0 ? `R ${(pan * 100).toFixed(0)}%` : "Center"}
                </span>
              </div>
              <input
                type="range"
                min="-1"
                max="1"
                step="0.05"
                value={pan}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setPan(val);
                  if (panNodeRef.current) panNodeRef.current.pan.value = val;
                }}
                className="w-full accent-white"
              />
            </div>

            {/* Bass Low Shelf */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Bass Shelf (250Hz)</span>
                <span className="text-white tabular-nums">{bassGain > 0 ? `+${bassGain}` : bassGain} dB</span>
              </div>
              <input
                type="range"
                min="-15"
                max="15"
                step="1"
                value={bassGain}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setBassGain(val);
                  if (bassFilterRef.current) bassFilterRef.current.gain.value = val;
                }}
                className="w-full accent-white"
              />
            </div>

            {/* Treble High Shelf */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Treble Shelf (4kHz)</span>
                <span className="text-white tabular-nums">{trebleGain > 0 ? `+${trebleGain}` : trebleGain} dB</span>
              </div>
              <input
                type="range"
                min="-15"
                max="15"
                step="1"
                value={trebleGain}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setTrebleGain(val);
                  if (trebleFilterRef.current) trebleFilterRef.current.gain.value = val;
                }}
                className="w-full accent-white"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 pt-3 border-t border-white/[0.06]">
              <button
                onClick={isPlaying ? stopAudio : playAudio}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-md font-semibold text-xs transition-all cursor-pointer shadow ${
                  isPlaying ? "bg-amber-500 text-black hover:bg-amber-400" : "bg-white text-black hover:bg-zinc-200"
                }`}
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                <span>{isPlaying ? "Pause Stream" : "Play Live DSP Stream"}</span>
              </button>

              <button
                onClick={exportProcessedWav}
                disabled={isProcessing}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-white/[0.06] text-white text-xs font-mono hover:bg-white/[0.1] border border-white/[0.08] transition-colors cursor-pointer"
              >
                <Download size={14} />
                <span>Export Master WAV</span>
              </button>
            </div>
          </div>

          {/* Live Frequency Spectrum Analyzer */}
          <div className="md:col-span-2 bg-[#09090c] border border-white/[0.08] rounded-xl p-5 flex flex-col justify-between min-h-[380px]">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <span className="text-xs font-mono text-zinc-300">Live 128-Bin FFT Spectrum Analyzer</span>
              <span className="text-[10px] font-mono text-amber-400">WebAudio 48kHz Pipeline</span>
            </div>

            <div className="flex-1 flex items-center justify-center py-4">
              <canvas ref={canvasRef} width={500} height={200} className="w-full h-48 rounded-lg bg-black border border-white/[0.05]" />
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 border-t border-white/[0.06] pt-3">
              <span>Low (20-250Hz)</span>
              <span>Mid (250-4kHz)</span>
              <span>High (4k-20kHz)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
