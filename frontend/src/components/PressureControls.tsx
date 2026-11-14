"use client";

import type { OperatingPoint } from "@/types/domain";

interface PressureControlsProps {
  point: OperatingPoint;
  onChange: (next: OperatingPoint) => void;
  onSimulate: () => void;
  running: boolean;
}

export function PressureControls({ point, onChange, onSimulate, running }: PressureControlsProps) {
  const items: Array<{ key: keyof OperatingPoint; label: string; min: number;
    max: number; step: number; suffix: string }> = [
    { key: "feed_pressure_bar", label: "Feed pressure", min: 25, max: 85,
      step: 1, suffix: "bar" },
    { key: "feed_m3_h", label: "Intake flow", min: 30, max: 180,
      step: 5, suffix: "m³/h" },
    { key: "silt_density_index", label: "Pretreatment SDI", min: 0, max: 7,
      step: 0.1, suffix: "SDI" },
    { key: "runtime_hours", label: "Membrane runtime", min: 0, max: 10000,
      step: 100, suffix: "h" }
  ];
  return (
    <section className="panel lg:col-span-4">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 className="font-bold">Operating scenario</h2>
        <span className="section-label">No live actuation</span>
      </div>
      <div className="space-y-5">
        {items.map(({ key, label, min, max, step, suffix }) => (
          <label key={key} className="block">
            <span className="mb-2 flex items-center justify-between text-sm">
              <span className="text-slate-300">{label}</span>
              <span className="font-mono text-teal-300">{point[key]} {suffix}</span>
            </span>
            <input type="range" min={min} max={max} step={step} value={point[key]}
              onChange={(event) => onChange({ ...point, [key]: Number(event.target.value) })}
              className="w-full accent-teal-400" />
          </label>
        ))}
        <button type="button" disabled={running} onClick={onSimulate}
          className="w-full rounded-xl bg-teal-300 px-5 py-3 text-sm font-bold text-slate-950
            transition hover:bg-teal-200 disabled:cursor-not-allowed disabled:opacity-50">
          {running ? "Computing mass balance…" : "Run synthetic scenario"}
        </button>
      </div>
    </section>
  );
}
