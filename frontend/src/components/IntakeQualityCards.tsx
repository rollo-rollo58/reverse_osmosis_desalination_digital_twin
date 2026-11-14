import type { OperatingPoint, TelemetrySample } from "@/types/domain";

interface IntakeQualityCardsProps {
  point: OperatingPoint;
  telemetry: TelemetrySample | null;
}

export function IntakeQualityCards({ point, telemetry }: IntakeQualityCardsProps) {
  const cards = [
    { label: "Intake salinity", value: point.feed_salinity_g_l, unit: "g/L", digits: 1 },
    { label: "Feed pressure", value: telemetry?.feed_pressure_bar ?? point.feed_pressure_bar,
      unit: "bar", digits: 1 },
    { label: "Silt density index", value: telemetry?.silt_density_index ??
      point.silt_density_index, unit: "SDI", digits: 2 },
    { label: "Feed temperature", value: telemetry?.temperature_c ?? point.temperature_c,
      unit: "°C", digits: 1 }
  ];
  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:col-span-12">
      {cards.map((item) => (
        <div className="panel" key={item.label}>
          <p className="section-label">{item.label}</p>
          <p className="metric mt-3">{item.value.toFixed(item.digits)}
            <span className="ml-2 text-sm font-normal text-slate-400">{item.unit}</span>
          </p>
        </div>
      ))}
    </section>
  );
}
