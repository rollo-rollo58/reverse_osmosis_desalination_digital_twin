import type { PlantBalance } from "@/types/domain";

interface EnergySankeyProps { balance: PlantBalance; }

export function EnergySankey({ balance }: EnergySankeyProps) {
  const gross = Math.max(balance.pump_power_kw, 0.01);
  const recovered = 100 * balance.recovery_credit_kw / gross;
  const net = 100 * balance.net_power_kw / gross;
  return (
    <section className="panel lg:col-span-6">
      <h2 className="mb-2 font-bold">Pressure energy accounting</h2>
      <p className="mb-6 text-xs text-slate-400">Gross power less exchanger credit</p>
      <div className="space-y-6">
        <div>
          <div className="mb-2 flex justify-between text-sm">
            <span>High-pressure pumping</span>
            <span className="font-mono">{balance.pump_power_kw.toFixed(1)} kW</span>
          </div>
          <div className="h-4 rounded bg-slate-800">
            <div className="h-4 w-full rounded bg-cyan-400" />
          </div>
        </div>
        <div>
          <div className="mb-2 flex justify-between text-sm">
            <span>Energy recovery credit</span>
            <span className="font-mono text-teal-300">
              −{balance.recovery_credit_kw.toFixed(1)} kW
            </span>
          </div>
          <div className="h-4 rounded bg-slate-800">
            <div className="h-4 rounded bg-teal-400" style={{ width: `${recovered}%` }} />
          </div>
        </div>
        <div>
          <div className="mb-2 flex justify-between text-sm">
            <span>Net process demand</span>
            <span className="font-mono">{balance.net_power_kw.toFixed(1)} kW</span>
          </div>
          <div className="h-4 rounded bg-slate-800">
            <div className="h-4 rounded bg-orange-300" style={{ width: `${net}%` }} />
          </div>
        </div>
      </div>
      <div className="mt-7 rounded-lg bg-slate-950 p-4">
        <p className="section-label">Specific energy</p>
        <p className="metric mt-2">{balance.specific_energy_kwh_m3.toFixed(2)}
          <span className="ml-2 text-sm font-normal text-slate-400">kWh/m³</span>
        </p>
      </div>
    </section>
  );
}
