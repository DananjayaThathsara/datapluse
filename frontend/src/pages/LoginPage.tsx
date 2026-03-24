import { useState } from "react";
import { login, register } from "../services/api";

interface Props {
  onLogin: (token: string, email: string) => void;
}

export default function LoginPage({ onLogin }: Props) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = tab === "login" ? await login(email, password) : await register(email, password);

      if (res.access_token) {
        localStorage.setItem("token", res.access_token);
        localStorage.setItem("email", email);
        onLogin(res.access_token, email);
      } else {
        setError(res.message || "Something went wrong");
      }
    } catch {
      setError("Could not connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#13161f] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center ">
            <img src="./src/assets/datapluse-logo.png" alt="DataPulse logo" className="h-12 w-auto object-contain shrink-1" />
          </div>
        
          <p className="text-slate-400 text-sm mt-1">Real-time event analytics platform</p>
        </div>

        {/* Card */}
        <div className="bg-[#1a1f2e] border border-slate-700/50 rounded-2xl p-8">
          {/* Tabs */}
          <div className="flex bg-[#13161f] rounded-xl p-1 mb-6">
            <button
              onClick={() => {
                setTab("login");
                setError("");
              }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                tab === "login" ? "bg-blue-300 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setTab("register");
                setError("");
              }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                tab === "register" ? "bg-blue-300 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Register
            </button>
          </div>

          {/* Error */}
          {error && <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

          {/* Email */}
          <div className="mb-4">
            <label className="block text-slate-400 text-xs font-medium mb-2 uppercase tracking-wide">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="you@example.com"
              className="w-full bg-[#13161f] border border-slate-700 rounded-xl px-4 py-3 c text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-slate-400 text-xs font-medium mb-2 uppercase tracking-wide">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="••••••••"
              className="w-full bg-[#13161f] border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-300 hover:bg-blue-400 disabled:bg-blue-600/50 cursor-pointer text-white font-medium py-3 rounded-xl transition-colors text-sm"
          >
            {loading ? "Please wait..." : tab === "login" ? "Sign In" : "Create Account"}
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-600 text-xs mt-6">DataPulse — Built for Presight AI interview</p>
      </div>
    </div>
  );
}
