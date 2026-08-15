/**
 * Hardware Capability & WebAssembly Telemetry Profiler
 * Probes client capabilities, SIMD support, SharedArrayBuffer availability, and heap memory.
 */

export interface SystemCapabilities {
  hardwareConcurrency: number;
  simdSupported: boolean;
  sharedArrayBufferSupported: boolean;
  deviceMemoryGB?: number;
  webCodecsSupported: boolean;
  webAudioSupported: boolean;
  wasmMemoryLimitMB: number;
  tier: "high-performance" | "standard" | "constrained";
}

export interface TelemetrySnapshot {
  activeWorkers: number;
  wasmHeapAllocatedMB: number;
  simdActive: boolean;
  throughputMBps: number;
  engineStatus: "idle" | "processing" | "streaming" | "standby";
  activeJobName: string | null;
}

// Global telemetry state listeners
type TelemetryListener = (snapshot: TelemetrySnapshot) => void;
const listeners = new Set<TelemetryListener>();

let currentSnapshot: TelemetrySnapshot = {
  activeWorkers: 0,
  wasmHeapAllocatedMB: 0,
  simdActive: false,
  throughputMBps: 0,
  engineStatus: "idle",
  activeJobName: null,
};

export function updateTelemetry(patch: Partial<TelemetrySnapshot>) {
  currentSnapshot = { ...currentSnapshot, ...patch };
  listeners.forEach((listener) => listener(currentSnapshot));
}

export function subscribeTelemetry(listener: TelemetryListener): () => void {
  listeners.add(listener);
  listener(currentSnapshot);
  return () => {
    listeners.delete(listener);
  };
}

export function getTelemetrySnapshot(): TelemetrySnapshot {
  return currentSnapshot;
}

/**
 * Check if WebAssembly SIMD (Single Instruction Multiple Data) is supported in current runtime
 */
export async function checkWasmSIMD(): Promise<boolean> {
  try {
    // Standard WASM SIMD probe bytecode
    const simdBytecode = new Uint8Array([
      0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10,
      10, 1, 8, 0, 125, 0, 253, 15, 253, 98, 11,
    ]);
    return WebAssembly.validate(simdBytecode);
  } catch {
    return false;
  }
}

/**
 * Probes all system hardware capabilities
 */
export async function probeSystemCapabilities(): Promise<SystemCapabilities> {
  const isBrowser = typeof window !== "undefined";
  const hardwareConcurrency = isBrowser ? navigator.hardwareConcurrency || 4 : 4;
  const simdSupported = isBrowser ? await checkWasmSIMD() : true;
  const sharedArrayBufferSupported = isBrowser && typeof SharedArrayBuffer !== "undefined";
  const webCodecsSupported = isBrowser && "VideoEncoder" in window;
  const webAudioSupported = isBrowser && ("AudioContext" in window || "webkitAudioContext" in window);
  
  // Estimate available memory
  const nav = isBrowser ? (navigator as any) : null;
  const deviceMemoryGB = nav?.deviceMemory || (hardwareConcurrency >= 8 ? 8 : 4);
  const wasmMemoryLimitMB = Math.min(deviceMemoryGB * 1024 * 0.6, 2048);

  let tier: "high-performance" | "standard" | "constrained" = "standard";
  if (hardwareConcurrency >= 8 && simdSupported && deviceMemoryGB >= 8) {
    tier = "high-performance";
  } else if (hardwareConcurrency < 4 || !simdSupported || deviceMemoryGB < 4) {
    tier = "constrained";
  }

  updateTelemetry({ simdActive: simdSupported });

  return {
    hardwareConcurrency,
    simdSupported,
    sharedArrayBufferSupported,
    deviceMemoryGB,
    webCodecsSupported,
    webAudioSupported,
    wasmMemoryLimitMB,
    tier,
  };
}
