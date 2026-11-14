import type { ObservationEvent } from "@/types/domain";

interface EventLogProps { events: ObservationEvent[]; }

export function EventLog({ events }: EventLogProps) {
  return (
    <section className="panel lg:col-span-12">
      <div className="mb-4 flex justify-between gap-4">
        <h2 className="font-bold">Observation journal</h2>
        <span className="section-label">In-memory · Not durable</span>
      </div>
      {events.length ? (
        <ul className="space-y-2">
          {events.slice(0, 7).map((event) => (
            <li key={event.id} className="flex flex-wrap justify-between gap-2 border-t
              border-slate-800 py-2 text-xs">
              <span className="font-mono text-slate-300">{event.channel}</span>
              <span className="font-mono text-teal-300">{event.value} {event.unit}</span>
              <time className="text-slate-500">{event.recorded_at}</time>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-400">No operator observations were submitted.</p>
      )}
    </section>
  );
}
