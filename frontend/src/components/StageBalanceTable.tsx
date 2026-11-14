import type { StageBalance } from "@/types/domain";

interface StageBalanceTableProps { stages: StageBalance[]; }

export function StageBalanceTable({ stages }: StageBalanceTableProps) {
  return (
    <section className="panel overflow-hidden lg:col-span-8">
      <h2 className="mb-2 font-bold">Stage-by-stage water and salt balance</h2>
      <p className="mb-5 text-xs text-slate-400">
        Flow in m³/h, salinity in g/L, net driving pressure in bar
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[660px] border-collapse text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-slate-400">
            <tr className="border-b border-slate-700">
              <th className="py-3">Stage</th>
              <th>Feed</th>
              <th>Product</th>
              <th>Concentrate</th>
              <th>Product salt</th>
              <th>NDP</th>
            </tr>
          </thead>
          <tbody>
            {stages.map((stage) => (
              <tr key={stage.stage_number} className="border-b border-slate-800">
                <td className="py-4 font-bold text-teal-300">0{stage.stage_number}</td>
                <td>{stage.feed_m3_h.toFixed(2)}</td>
                <td>{stage.permeate_m3_h.toFixed(2)}</td>
                <td>{stage.concentrate_m3_h.toFixed(2)}</td>
                <td>{stage.permeate_salinity_g_l.toFixed(3)}</td>
                <td>{stage.net_driving_pressure_bar.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
