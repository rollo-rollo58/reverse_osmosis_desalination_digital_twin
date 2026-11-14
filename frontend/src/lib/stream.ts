import { API_BASE } from "@/lib/api-client";
import type { TelemetrySample } from "@/types/domain";

export function connectTelemetry(
  onMessage: (sample: TelemetrySample) => void,
  onError: () => void
): () => void {
  const stream = new EventSource(`${API_BASE}/api/v1/stream`);
  stream.onmessage = (event: MessageEvent<string>) => {
    try {
      const observation = JSON.parse(event.data) as TelemetrySample;
      if (observation.simulated && Number.isFinite(observation.feed_pressure_bar)) {
        onMessage(observation);
      }
    } catch {
      onError();
    }
  };
  stream.onerror = onError;
  return () => stream.close();
}
