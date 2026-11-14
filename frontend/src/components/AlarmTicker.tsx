import type { PerformanceIndicators } from "@/types/domain";

interface AlarmTickerProps { performance: PerformanceIndicators; }

export function AlarmTicker({ performance }: AlarmTickerProps) {
  const alerts = performance.alerts.length > 0 ? performance.alerts : ["NO_SIMULATED_THRESHOLDS_CROSSED"];
  return (
    <section className="panel lg:col-span-4" aria-live="polite">
      <h2 className="mb-5 font-bold">Engineering exception feed</h2>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert} className="flex items-start gap-3 rounded-lg border border-slate-700 p-3">
            <span className={`mt-1 h-2.5 w-2.5 rounded-full ${performance.alerts.length
              ? "bg-amber-400" : "bg-teal-300"}`} />
            <div>
              <p className="break-all font-mono text-xs text-slate-200">{alert}</p>
              <p className="mt-1 text-[11px] text-slate-500">Research model classification</p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-5 text-xs text-slate-400">
        This feed cannot trigger physical trips, actuators or control signals.
      </p>
    </section>
  );
}
