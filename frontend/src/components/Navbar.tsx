interface NavbarProps {
  connected: boolean;
  userEmail?: string;
  onLogout?: () => void;
}

export function Navbar({ connected, userEmail, onLogout }: NavbarProps) {
  return (
    <nav className="border-b border-slate-700/50 bg-[#1a1f2e] px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img src="./src/assets/datapluse-logo.png" alt="DataPulse logo" className="h-12 w-auto object-contain shrink-1" />

        <span className={`ml-2 w-2 h-2 rounded-full ${connected ? "bg-green-400" : "bg-slate-600"}`} />
        <span className="text-xs text-slate-500">{connected ? "live" : "offline"}</span>
      </div>

      <div className="flex items-center gap-4">
        {userEmail && <span className="text-slate-400 text-sm">{userEmail}</span>}
        {onLogout && (
          <button
            onClick={onLogout}
            className="text-xs text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-3 py-1.5 rounded-lg transition-colors"
          >
            Sign out
          </button>
        )}
      </div>
    </nav>
  );
}
