import type { Insight } from "../types";

interface AIInsightPanelProps {
  insight: Insight;
}

export function AIInsightPanel({ insight }: AIInsightPanelProps) {
  // Helper to render insight text with highlighted keywords
  const renderText = (text: string) => {
    if (text === "Waiting for first AI analysis...") {
      return <span className="text-slate-500">{text}</span>;
    }

    return text.split(/\b(normal|critical|high|warning|spike|alert|unusual|elevated)\b/gi).map((part, i) =>
      /^(normal|critical|high|warning|spike|alert|unusual|elevated)$/i.test(part) ? (
        <span key={i} className={/normal/i.test(part) ? "text-green-400 font-medium" : "text-amber-400 font-medium"}>
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  return (
    <div className="bg-[#1e2130] rounded-2xl border border-white/5 p-4">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-3">
        <div
          className="w-8 h-8 rounded-full bg-green-900/50 border border-green-700/40
          flex items-center justify-center text-xs font-bold text-green-400"
        >
          AI
        </div>
        <span className="text-sm font-semibold text-white">AI insight</span>

        {/* Pulse dot when data is available */}
        {insight.generatedAt && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />}
      </div>

      {/* Insight text with highlighted keywords */}
      <p className="text-sm text-slate-300 leading-relaxed">{renderText(insight.text)}</p>

      {/* Updated timestamp */}
      {insight.generatedAt && (
        <p className="text-[11px] text-slate-600 mt-3">
          Updated at{" "}
          {new Date(insight.generatedAt).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </p>
      )}
    </div>
  );
}
