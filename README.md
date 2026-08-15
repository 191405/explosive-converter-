# Explosive Converter & Studio Suite (v2.0)

> High-Performance In-Memory WebAssembly SIMD & Edge Streaming Media Engine

Explosive Studio Suite is an industrial-grade media processing, forensic file inspection, and data serialization suite running directly in the browser with 100% privacy and zero server exfiltration.

---

## ⚡ Core Feature Suite

### 1. Pro Engineering & Forensics
* **Forensic Metadata Scrubber & Stego Inspector (`/metadata`)**: Deep EXIF/GPS/IPTC tag inspection, 1-click surgical wipe, and Least Significant Bit (LSB) steganography bitplane analyzer.
* **Raster to SVG Vectorizer (`/vectorize`)**: High-precision edge boundary tracing with Bézier curve smoothing for logos, icons, and scanned documents.
* **Client-Side Document OCR (`/ocr`)**: Neural optical character recognition with layout bounding boxes, confidence scoring, and searchable text extraction.
* **Spatial Audio DSP & Stem Isolator (`/dsp`)**: Stereo center channel phase cancellation (vocal cut / isolation), 3D binaural spatial panner, 8-band parametric EQ, and 16-bit Master WAV export.
* **Animated WebP & GIF Diff (`/animator`)**: Video to animation transcoder with temporal frame difference deduplication and adaptive 256-color palette dithering.

### 2. Code, Archives & Documents
* **Universal Code & AST Morph (`/data-morph`)**: Bi-directional instant conversion between JSON, YAML, TOML, CSV, XML, and TypeScript Interfaces with AST schema validation.
* **Archive Studio & Repacker (`/archive`)**: In-memory ZIP/TAR directory tree inspection and multi-file batch repackaging without disk writes.
* **Video Compressor (`/compress`)**: High-efficiency H.264 video compression with Constant Rate Factor (CRF) and preset speed tuning.
* **Pro Image Transcoder (`/image`)**: Hardware-accelerated Canvas & WebP/PNG/JPEG batch transcoding with custom dimension scaling.
* **PDF Studio (`/pdf`)**: Client-side document page splitting, merging, and lossless rotation.
* **Screen & Camera Recorder (`/record`)**: High-frame-rate display and webcam capture with synchronized audio.

---

## 🛠️ System Architecture

* **WebAssembly SIMD & Web Workers**: Multi-threaded execution across client CPU cores.
* **Hybrid Server Streaming Pipeline (`/api/v1/transform`)**: Edge streaming fallback for extreme batch workloads.
* **Live Telemetry & Hardware Profiler**: Real-time stats for active worker threads, SIMD instruction availability, and WASM heap memory.
* **Live Stdout Terminal Drawer (`~`)**: Real-time FFmpeg & WASM stdout/stderr log stream.
* **Command Deck (`Cmd+K`)**: Global keyboard shortcut palette for rapid tool jumping.

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Production build with Webpack
npm run build
```
