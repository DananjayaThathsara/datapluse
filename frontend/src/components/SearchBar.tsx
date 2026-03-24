// src/components/SearchBar.tsx
// Search input + Fire Event button on the same row

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onFire: () => void;
  firing: boolean;
}

export function SearchBar({ value, onChange, onFire, firing }: SearchBarProps) {
  return (
    <div className="flex gap-3">
      {/* Search input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search events... e.g. 'traffic Dubai' or 'power critical'"
        className="
          flex-1 bg-[#1e2130] border border-white/10 rounded-xl
          px-4 py-3 text-sm text-slate-300 placeholder-slate-600
          focus:outline-none focus:border-slate-500 focus:bg-[#232741]
          transition-colors
        "
      />

      {/* Fire Event button */}
      <button
        onClick={onFire}
        disabled={firing}
        className={`
          px-5 py-3 rounded-xl text-sm font-semibold transition-all flex-shrink-0
          flex items-center gap-2
          ${
            firing
              ? "bg-green-600/30 text-green-400 border border-green-600/40 scale-95"
              : "bg-[#1e2130] border border-white/15 text-white hover:bg-[#272d42] hover:border-white/25 active:scale-95"
          }
        `}
      >
        {firing ? "✓ Fired!" : "+ Fire Event"}
      </button>
    </div>
  );
}
