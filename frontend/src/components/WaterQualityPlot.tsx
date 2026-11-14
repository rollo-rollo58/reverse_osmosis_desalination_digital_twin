import type { TelemetrySample } from "@/types/domain";

interface WaterQualityPlotProps { history: TelemetrySample[]; }

export function WaterQualityPlot({ history }: WaterQualityPlotProps) {
  const values = history.map((item) => item.product_conductivity_us_cm);
  const series = values.length >= 2 ? values : [405, 410, 407, 414, 409, 412];
  const minimum = Math.min(...series) - 6;
  const maximum = Math.max(...series) + 6;
  const points = series.map((value, index) => {
    const x = 10 + index * 500 / Math.max(1, series.length - 1);
    const y = 145 - ((value - minimum) / (maximum - minimum)) * 118;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  return (
    <section className="panel lg:col-span-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-bold">Permeate conductivity trace</h2>
        <span className="section-label">μS/cm · Simulated</span>
      </div>
      <svg viewBox="0 0 520 170" className="w-full" role="img"
        aria-label="Line graph of simulated permeate electrical conductivity">
        {[35, 75, 115, 155].map((y) => (
          <path key={y} d={`M10 ${y}H510`} stroke="#244454" strokeDasharray="3 5" />
        ))}
        <polyline points={points} fill="none" stroke="#5eead4" strokeWidth="3"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <p className="mt-3 text-xs text-slate-400">
        Sensor preview uses synthetic waveforms; not calibrated laboratory conductivity.
      </p>
    </section>
  );
}
