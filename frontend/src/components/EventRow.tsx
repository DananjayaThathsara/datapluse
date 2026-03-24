import type { DataEvent } from "../types";
import { SEVERITY_BORDER, SEVERITY_DOT, SEVERITY_BADGE } from "../constants";

interface EventRowProps {
  event: DataEvent;
}

export function EventRow({ event }: EventRowProps) {
  // Format timestamp — show HH:MM:SS
  const time = new Date(event.timestamp || event.createdAt || Date.now()).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div
      className={`
      border-l-[3px] ${SEVERITY_BORDER[event.severity] ?? "border-l-slate-600"}
      bg-[#181c2a] hover:bg-[#1e2333] transition-colors px-4 py-3 rounded-r-lg
    `}
    >
      <div className="flex items-start justify-between gap-2">
        {/* Left — dot + type + badge + message + meta */}
        <div className="flex items-start gap-2 min-w-0">
          <span
            className={`
            w-2 h-2 rounded-full flex-shrink-0 mt-1
            ${SEVERITY_DOT[event.severity] ?? "bg-slate-500"}
          `}
          />
          <div className="min-w-0">
            {/* type + severity badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-white capitalize">{event.type}</span>
              <span
                className={`
                text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider
                ${SEVERITY_BADGE[event.severity]}
              `}
              >
                {event.severity}
              </span>
            </div>

            {/* message — truncated */}
            <p className="text-xs text-slate-400 mt-0.5 truncate">{event.message}</p>

            {/* location + source */}
            {event.location && (
              <p className="text-[10px] text-slate-600 mt-0.5">
                {event.location} · {event.source}
              </p>
            )}
          </div>
        </div>

        {/* Right — timestamp */}
        <span className="text-[11px] text-slate-600 flex-shrink-0 font-mono mt-0.5">{time}</span>
      </div>
    </div>
  );
}
