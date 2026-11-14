import type { PlantBalance } from "@/types/domain";

interface EquipmentSchematicProps { balance: PlantBalance; }

export function EquipmentSchematic({ balance }: EquipmentSchematicProps) {
  const boxes = [
    { title: "Intake", sub: "Seawater", x: 16 },
    { title: "Pretreatment", sub: "SDI control", x: 184 },
    { title: "High pressure", sub: "Feed pump", x: 352 },
    { title: "RO membranes", sub: "3 stages", x: 520 }
  ];
  return (
    <section className="panel grid-paper lg:col-span-8" aria-label="Membrane process topology">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-bold">Hydraulic process topology</h2>
        <span className="section-label">PFD-001 · Synthetic</span>
      </div>
      <svg viewBox="0 0 690 235" className="w-full" role="img"
        aria-label="Intake, filtration, pump, membrane, product and brine pathways">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10" fill="#5eead4" />
          </marker>
        </defs>
        {boxes.map((box, index) => (
          <g key={box.title}>
            <rect x={box.x} y="67" width="138" height="79" rx="12"
              fill="#0c2b3c" stroke={index === 3 ? "#5eead4" : "#326274"} />
            <text x={box.x + 69} y="96" textAnchor="middle" fill="white" fontSize="13">
              {box.title}
            </text>
            <text x={box.x + 69} y="117" textAnchor="middle" fill="#94a3b8" fontSize="11">
              {box.sub}
            </text>
            {index < 3 && <path d={`M${box.x + 139} 105h27`} stroke="#5eead4"
              markerEnd="url(#arrow)" strokeWidth="2" />}
          </g>
        ))}
        <path d="M590 146v43h-230" stroke="#fb923c" strokeWidth="2"
          fill="none" strokeDasharray="5 5" />
        <path d="M590 67V32H360" stroke="#5eead4" strokeWidth="2" fill="none" />
        <text x="384" y="24" fill="#5eead4" fontSize="12">
          Product {balance.total_permeate_m3_h.toFixed(1)} m³/h
        </text>
        <text x="385" y="210" fill="#fb923c" fontSize="12">
          Brine {balance.concentrate_m3_h.toFixed(1)} m³/h
        </text>
      </svg>
    </section>
  );
}
