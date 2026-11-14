"use client";

import { useState } from "react";
import { getOptimization } from "@/lib/api-client";
import type { OperatingPoint, OptimizationResult } from "@/types/domain";

interface OptimizationPanelProps { point: OperatingPoint; }

export function OptimizationPanel({ point }: OptimizationPanelProps) {
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function compare() {
    setPending(true);
    setError(null);
    try {
      setResult(await getOptimization(point));
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Comparison unavailable");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="panel lg:col-span-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-bold">Pressure envelope search</h2>
        <button type="button" disabled={pending} onClick={compare}
          className="rounded-lg bg-slate-700 px-3 py-2 text-xs font-bold hover:bg-slate-600">
          {pending ? "Evaluating…" : "Compare"}
        </button>
      </div>
      <p className="mt-3 text-xs text-slate-400">
        Evaluates eight research pressures under salinity and recovery constraints.
      </p>
      {error && <p className="mt-4 text-xs text-rose-300" role="alert">{error}</p>}
      {result?.best ? (
        <div className="mt-5 rounded-xl border border-teal-700 bg-teal-950/30 p-4">
          <p className="section-label">Lowest modeled feasible SEC</p>
          <p className="metric mt-2">{result.best.pressure_bar.toFixed(0)} bar</p>
          <p className="mt-3 text-sm text-teal-200">
            {result.best.specific_energy_kwh_m3.toFixed(2)} kWh/m³
          </p>
        </div>
      ) : result && (
        <p className="mt-5 text-sm text-amber-300">No candidate meets both constraints.</p>
      )}
      <p className="mt-5 text-xs text-slate-500">Results are not operating setpoints.</p>
    </section>
  );
}
