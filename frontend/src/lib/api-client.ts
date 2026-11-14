import type {
  OperatingPoint,
  OptimizationResult,
  Overview,
  SimulationResponse,
  ObservationEvent
} from "@/types/domain";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
    cache: "no-store"
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(`API ${response.status}: ${message.slice(0, 200)}`);
  }
  return (await response.json()) as T;
}

export function getOverview(): Promise<Overview> {
  return request<Overview>("/api/v1/overview");
}

export function runSimulation(point: OperatingPoint): Promise<SimulationResponse> {
  return request<SimulationResponse>("/api/v1/simulate", {
    method: "POST",
    body: JSON.stringify(point)
  });
}

export function getOptimization(point: OperatingPoint): Promise<OptimizationResult> {
  return request<OptimizationResult>("/api/v1/optimize", {
    method: "POST",
    body: JSON.stringify({ ...point, minimum_recovery: 0.2 })
  });
}

export function getEvents(): Promise<{ items: ObservationEvent[]; durable: boolean }> {
  return request<{ items: ObservationEvent[]; durable: boolean }>("/api/v1/events");
}

export { API_BASE };
