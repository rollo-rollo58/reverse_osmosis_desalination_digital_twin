interface PlantHeaderProps {
  plant: string;
  train: string;
  connected: boolean;
}

export function PlantHeader({ plant, train, connected }: PlantHeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-5 py-7">
      <div className="flex items-center gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-teal-300 text-slate-950">
          <svg viewBox="0 0 32 32" fill="none" className="h-8 w-8" aria-hidden="true">
            <path d="M4 20c5-10 7 8 12-2s8 4 12-6" stroke="currentColor" strokeWidth="2.3" />
            <path d="M5 25h22M5 7h22" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>
        <div>
          <p className="section-label">Aquaflux / Process engineering</p>
          <h1 className="text-xl font-extrabold tracking-tight md:text-2xl">{plant}</h1>
          <p className="mt-1 text-sm text-slate-400">Train {train} · Research simulation</p>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-full border border-slate-700 px-4 py-2">
        <span className={`h-2.5 w-2.5 rounded-full ${connected ? "bg-teal-300" : "bg-amber-400"}`} />
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-200">
          {connected ? "Synthetic stream active" : "Connecting to stream"}
        </span>
      </div>
    </header>
  );
}
