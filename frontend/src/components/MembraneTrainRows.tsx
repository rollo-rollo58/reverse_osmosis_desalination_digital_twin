import type { StageBalance } from "@/types/domain";

interface MembraneTrainRowsProps { stages: StageBalance[]; }

export function MembraneTrainRows({ stages }: MembraneTrainRowsProps) {
  const maxFlux = Math.max(1, ...stages.map((stage) => stage.flux_lmh));
  return (
    <section className="panel lg:col-span-4">
      <h2 className="mb-1 font-bold">Membrane element ladder</h2>
      <p className="mb-6 text-xs text-slate-400">Feed-to-concentrate direction · LMH</p>
      <div className="space-y-5">
        {stages.map((stage) => (
          <div key={stage.stage_number}>
            <div className="mb-2 flex items-baseline justify-between">
              <span className="text-sm font-semibold">Stage {stage.stage_number}</span>
              <span className="font-mono text-sm text-teal-300">
                {stage.flux_lmh.toFixed(2)} LMH
              </span>
            </div>
            <div className="h-4 rounded-md border border-teal-800 bg-slate-950 p-0.5">
              <div className="h-full rounded-sm bg-gradient-to-r from-teal-700 to-teal-300"
                style={{ width: `${100 * stage.flux_lmh / maxFlux}%` }} />
            </div>
            <p className="mt-2 text-xs text-slate-400">
              {stage.permeate_m3_h.toFixed(1)} m³/h product
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
