/**
 * Unified Engine Orchestrator
 * Coordinates Client-Side WebAssembly workers and Server-Side streaming fallback.
 * Emits live stdout telemetry logs to the Pro Console Drawer.
 */

import { updateTelemetry } from "./telemetry";

export interface LogEntry {
  id: string;
  timestamp: string;
  level: "info" | "warn" | "error" | "debug" | "stdout";
  source: "WASM_CORE" | "WORKER_THREAD" | "SERVER_STREAM" | "DSP_ENGINE" | "ORCHESTRATOR";
  message: string;
}

export type ExecutionMode = "wasm-auto" | "wasm-client" | "server-stream";

export interface TransformJobOptions {
  jobName: string;
  mode?: ExecutionMode;
  onProgress?: (progress: number, stage: string) => void;
  signal?: AbortSignal;
}

type LogListener = (logs: LogEntry[]) => void;
const logListeners = new Set<LogListener>();
const logHistory: LogEntry[] = [];
const MAX_LOGS = 500;

export function emitLog(
  message: string,
  level: LogEntry["level"] = "info",
  source: LogEntry["source"] = "ORCHESTRATOR"
) {
  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}.${now
    .getMilliseconds()
    .toString()
    .padStart(3, "0")}`;

  const entry: LogEntry = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    timestamp: timeStr,
    level,
    source,
    message,
  };

  logHistory.push(entry);
  if (logHistory.length > MAX_LOGS) {
    logHistory.shift();
  }

  logListeners.forEach((fn) => fn([...logHistory]));
}

export function subscribeLogs(listener: LogListener): () => void {
  logListeners.add(listener);
  listener([...logHistory]);
  return () => {
    logListeners.delete(listener);
  };
}

export function clearLogs() {
  logHistory.length = 0;
  logListeners.forEach((fn) => fn([]));
}

export class EngineOrchestrator {
  private static instance: EngineOrchestrator;

  public static getInstance(): EngineOrchestrator {
    if (!EngineOrchestrator.instance) {
      EngineOrchestrator.instance = new EngineOrchestrator();
    }
    return EngineOrchestrator.instance;
  }

  /**
   * Dispatches a transform job through either client WASM worker or streaming server API
   */
  public async executeJob<TInput, TOutput>(
    job: {
      type: string;
      input: TInput;
      clientExecutor: (signal?: AbortSignal) => Promise<TOutput>;
      serverEndpoint?: string;
      serverPayload?: FormData | object;
    },
    options: TransformJobOptions
  ): Promise<TOutput> {
    const startTime = performance.now();
    const mode = options.mode || "wasm-auto";

    emitLog(`Initiating job [${options.jobName}] | Mode: ${mode}`, "info", "ORCHESTRATOR");
    updateTelemetry({
      engineStatus: "processing",
      activeJobName: options.jobName,
      activeWorkers: 1,
    });

    try {
      let result: TOutput;

      if (mode === "server-stream" && job.serverEndpoint) {
        emitLog(`Routing to Server Streaming Engine at ${job.serverEndpoint}`, "info", "SERVER_STREAM");
        result = await this.executeServerStream<TOutput>(job.serverEndpoint, job.serverPayload, options);
      } else {
        emitLog(`Executing inside Client WebAssembly Sandbox`, "debug", "WASM_CORE");
        result = await job.clientExecutor(options.signal);
      }

      const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
      emitLog(`Job [${options.jobName}] completed in ${elapsed}s`, "info", "ORCHESTRATOR");

      updateTelemetry({
        engineStatus: "idle",
        activeJobName: null,
        activeWorkers: 0,
      });

      return result;
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      emitLog(`Job [${options.jobName}] failed: ${errMsg}`, "error", "ORCHESTRATOR");
      updateTelemetry({
        engineStatus: "idle",
        activeJobName: null,
        activeWorkers: 0,
      });
      throw err;
    }
  }

  private async executeServerStream<TOutput>(
    endpoint: string,
    payload: any,
    options: TransformJobOptions
  ): Promise<TOutput> {
    const isFormData = payload instanceof FormData;
    const res = await fetch(endpoint, {
      method: "POST",
      body: isFormData ? payload : JSON.stringify(payload),
      headers: isFormData ? undefined : { "Content-Type": "application/json" },
      signal: options.signal,
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Server Pipeline Error (${res.status}): ${errText}`);
    }

    // Read streamed chunks if streaming response
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return (await res.json()) as TOutput;
    }

    const blob = await res.blob();
    return blob as unknown as TOutput;
  }
}
