"use client";

import { useEffect, useState } from "react";
import { getEvents, getOverview, runSimulation } from "@/lib/api-client";
import { usePlantTelemetry } from "@/hooks/usePlantTelemetry";
import type { ObservationEvent, OperatingPoint, Overview } from "@/types/domain";
import { PlantHeader } from "@/components/PlantHeader";
import { EquipmentSchematic } from "@/components/EquipmentSchematic";
import { IntakeQualityCards } from "@/components/IntakeQualityCards";
import { MembraneTrainRows } from "@/components/MembraneTrainRows";
import { PressureControls } from "@/components/PressureControls";
import { StageBalanceTable } from "@/components/StageBalanceTable";
import { WaterQualityPlot } from "@/components/WaterQualityPlot";
import { EnergySankey } from "@/components/EnergySankey";
import { FoulingRadar } from "@/components/FoulingRadar";
import { AlarmTicker } from "@/components/AlarmTicker";
import { OptimizationPanel } from "@/components/OptimizationPanel";
import { EventLog } from "@/components/EventLog";

export default function ControlRoomPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [point, setPoint] = useState<OperatingPoint | null>(null);
  const [events, setEvents] = useState<ObservationEvent[]>([]);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { latest, history, connected } = usePlantTelemetry(overview?.telemetry ?? null);

  useEffect(() => {
    let live = true;
    getOverview().then((value) => {
      if (live) {
        setOverview(value);
        setPoint(value.operating);
      }
    }).catch((failure: unknown) => {
      if (live) setError(failure instanceof Error ? failure.message : "API unavailable");
    });
    getEvents().then((value) => {
      if (live) setEvents(value.items);
    }).catch(() => { if (live) setEvents([]); });
    return () => { live = false; };
  }, []);

  async function simulate() {
    if (!point || !overview) return;
    setRunning(true);
    setError(null);
    try {
      const result = await runSimulation(point);
      setOverview({ ...overview, operating: point, balance: result.balance,
        performance: result.performance });
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Simulation unavailable");
    } finally {
      setRunning(false);
    }
  }

  if (!overview || !point) {
    return (
      <main className="mx-auto max-w-7xl p-8">
        <p className="section-label">AquaFlux / Research simulation</p>
        <h1 className="mt-5 text-2xl font-bold">Connecting to process calculation API</h1>
        <p className="mt-4 text-sm text-slate-400">
          {error ?? "Loading synthetic membrane-train snapshot…"}
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1480px] px-4 pb-16 sm:px-8">
      <PlantHeader plant={overview.plant} train={overview.train} connected={connected} />
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-xl
        border border-teal-700/70 bg-teal-950/30 px-4 py-3">
        <p className="text-xs text-teal-100">
          SIMULATION ONLY — No physical sensing, automated commands, or safety certification.
        </p>
        <span className="font-mono text-xs text-teal-300">RO-01 / Research envelope</span>
      </div>
      {error && <div role="alert" className="mb-4 rounded-xl border border-rose-500
        bg-rose-950 p-4 text-sm">{error}</div>}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <IntakeQualityCards point={point} telemetry={latest} />
        <EquipmentSchematic balance={overview.balance} />
        <MembraneTrainRows stages={overview.balance.stages} />
        <PressureControls point={point} onChange={setPoint}
          onSimulate={simulate} running={running} />
        <StageBalanceTable stages={overview.balance.stages} />
        <WaterQualityPlot history={history} />
        <EnergySankey balance={overview.balance} />
        <FoulingRadar point={point} balance={overview.balance} />
        <AlarmTicker performance={overview.performance} />
        <OptimizationPanel point={point} />
        <EventLog events={events} />
      </div>
      <footer className="mt-8 text-xs leading-relaxed text-slate-500">
        AquaFlux engineering sandbox. Equations are simplified and parameters are synthetic.
        Commissioned membrane systems require independently validated design calculations.
      </footer>
    </main>
  );
}
