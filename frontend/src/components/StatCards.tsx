// src/components/StatCards.tsx
// 4 metric cards at the top — Total, Critical, High, Active services

interface StatCardProps {
  label: string;
  value: string | number;
  sub: string;
  subColour: string;
}

// Single card — reused 4 times
function StatCard({ label, value, sub, subColour }: StatCardProps) {
  return (
    <div className="bg-[#1e2130] rounded-2xl p-4 border border-white/5 flex flex-col gap-1">
      <span className="text-xs text-slate-500 font-medium">{label}</span>
      <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
      <span className={`text-xs font-medium ${subColour}`}>{sub}</span>
    </div>
  );
}

interface StatCardsProps {
  total: number;
  hourCount: number;
  critical: number;
  high: number;
}

export function StatCards({ total, hourCount, critical, high }: StatCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <StatCard label="Total events today" value={total} sub={`+${hourCount} this hour`} subColour="text-green-400" />
      <StatCard label="Critical alerts" value={critical} sub={critical > 0 ? `${critical} active` : "none active"} subColour="text-red-400" />
      <StatCard label="High severity" value={high} sub="needs attention" subColour="text-amber-400" />
      <StatCard label="Active services" value={4} sub="all healthy" subColour="text-green-400" />
    </div>
  );
}
