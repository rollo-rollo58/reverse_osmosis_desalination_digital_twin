"use client";

import { useEffect, useState } from "react";
import { connectTelemetry } from "@/lib/stream";
import type { TelemetrySample } from "@/types/domain";

export function usePlantTelemetry(seed: TelemetrySample | null) {
  const [latest, setLatest] = useState<TelemetrySample | null>(seed);
  const [history, setHistory] = useState<TelemetrySample[]>(seed ? [seed] : []);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const disconnect = connectTelemetry((sample) => {
      setLatest(sample);
      setHistory((current) => [...current.slice(-43), sample]);
      setConnected(true);
    }, () => setConnected(false));
    return disconnect;
  }, []);

  return { latest, history, connected };
}
