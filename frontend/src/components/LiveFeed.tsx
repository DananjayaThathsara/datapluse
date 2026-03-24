import type { DataEvent } from "../types";
import { EventRow } from "./EventRow";

interface LiveFeedProps {
  events: DataEvent[];
  search: string;
}

export function LiveFeed({ events, search }: LiveFeedProps) {
  // Filter events based on search term
  // Searches across type, message, location, severity
  const filtered = search.trim()
    ? events.filter(
        (e) =>
          e.type.toLowerCase().includes(search.toLowerCase()) ||
          e.message.toLowerCase().includes(search.toLowerCase()) ||
          (e.location ?? "").toLowerCase().includes(search.toLowerCase()) ||
          e.severity.toLowerCase().includes(search.toLowerCase()),
      )
    : events;

  return (
    <div className="bg-[#1e2130] rounded-2xl border border-white/5 overflow-hidden flex flex-col h-[480px]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 flex-shrink-0">
        <span className="text-sm font-semibold text-white">Live event stream</span>
        <span className="text-xs bg-[#272d42] text-slate-400 px-2.5 py-1 rounded-full">{filtered.length} events</span>
      </div>

      {/* Scrollable event list */}
      <div className="overflow-y-auto flex-1 divide-y divide-white/[0.03]">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-slate-600">{search ? "No events match your search" : 'Press "+ Fire Event" to generate events'}</p>
          </div>
        ) : (
          filtered.map((event) => <EventRow key={event.id} event={event} />)
        )}
      </div>
    </div>
  );
}
