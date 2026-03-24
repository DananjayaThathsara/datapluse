// src/components/SeverityChart.tsx
// Bar chart — event counts grouped by severity using Recharts

import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from "recharts";
import type { DataEvent } from "../types";
import { SEVERITY_CHART_COLOUR } from "../constants";

interface SeverityChartProps {
  events: DataEvent[];
}

export function SeverityChart({ events }: SeverityChartProps) {
  // Build chart data from events array
  // Count how many events of each severity level exist
  const data = [
    {
      name: "Low",
      count: events.filter((e) => e.severity === "low").length,
      colour: SEVERITY_CHART_COLOUR.low,
    },
    {
      name: "Med",
      count: events.filter((e) => e.severity === "medium").length,
      colour: SEVERITY_CHART_COLOUR.medium,
    },
    {
      name: "High",
      count: events.filter((e) => e.severity === "high").length,
      colour: SEVERITY_CHART_COLOUR.high,
    },
    {
      name: "Crit",
      count: events.filter((e) => e.severity === "critical").length,
      colour: SEVERITY_CHART_COLOUR.critical,
    },
  ];

  return (
    <div className="bg-[#1e2130] rounded-2xl border border-white/5 p-4 flex-1">
      <p className="text-xs font-semibold text-slate-400 mb-4">Events by severity (last 10 min)</p>

      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={data} barCategoryGap="20%">
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 11 }} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.colour} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
