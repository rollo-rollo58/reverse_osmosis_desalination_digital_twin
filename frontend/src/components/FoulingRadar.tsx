import type { OperatingPoint, PlantBalance } from "@/types/domain";

interface FoulingRadarProps { point: OperatingPoint; balance: PlantBalance; }

export function FoulingRadar({ point, balance }: FoulingRadarProps) {
  const fouling = Math.min(1, point.runtime_hours * point.silt_density_index / 50000);
  const salt = Math.min(1, balance.concentrate_salinity_g_l / 90);
  const energy = Math.min(1, balance.specific_energy_kwh_m3 / 8);
  const values = [fouling, salt, energy];
  const angles = [-Math.PI / 2, Math.PI / 6, Math.PI * 5 / 6];
  const polygon = values.map((value, index) => {
    const radius = 78 * value;
    return `${120 + radius * Math.cos(angles[index])},${108 + radius * Math.sin(angles[index])}`;
  }).join(" ");
  return (
    <section className="panel lg:col-span-4">
      <h2 className="mb-3 font-bold">Operating envelope review</h2>
      <svg viewBox="0 0 240 220" className="mx-auto w-full max-w-[250px]" role="img"
        aria-label="Relative fouling, brine salinity and energy proxy metrics">
        {[30, 54, 78].map((r) => (
          <polygon key={r} fill="none" stroke="#29485a"
            points={angles.map((a) => `${120 + r * Math.cos(a)},${108 + r * Math.sin(a)}`).join(" ")} />
        ))}
        <polygon points={polygon} fill="#2dd4bf33" stroke="#5eead4" strokeWidth="2" />
        <text x="120" y="12" textAnchor="middle" fill="#cbd5e1" fontSize="11">Fouling</text>
        <text x="220" y="182" textAnchor="end" fill="#cbd5e1" fontSize="11">Brine</text>
        <text x="20" y="182" fill="#cbd5e1" fontSize="11">Energy</text>
      </svg>
      <p className="text-xs leading-relaxed text-slate-400">
        Relative, uncalibrated indicators for scenario comparison only.
      </p>
    </section>
  );
}
