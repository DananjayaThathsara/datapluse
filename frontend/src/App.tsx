import { useState, useEffect, useCallback } from "react";
import type { DataEvent, Insight } from "./types";
import { FAKE_EVENTS } from "./constants";
import { useWebSocket } from "./hooks/useWebSocket";
import { Navbar } from "./components/Navbar";
import { StatCards } from "./components/StatCards";
import { SearchBar } from "./components/SearchBar";
import { LiveFeed } from "./components/LiveFeed";
import { AIInsightPanel } from "./components/AIInsightPanel";
import { SeverityChart } from "./components/SeverityChart";
import { createEvent, getEvents } from "./services/api";
import LoginPage from "./pages/LoginPage";

// Main application component that manages authentication state and renders either the login page or the dashboard
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    if (token && email) {
      setIsLoggedIn(true);
      setUserEmail(email);
    }
  }, []);

  const handleLogin = (token: string, email: string) => {
    setIsLoggedIn(true);
    setUserEmail(email);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setIsLoggedIn(false);
    setUserEmail("");
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <Dashboard userEmail={userEmail} onLogout={handleLogout} />;
}

// Dashboard component that displays the main interface with live event feed, AI insights, and statistics
function Dashboard({ userEmail, onLogout }: { userEmail: string; onLogout: () => void }) {
  const [events, setEvents] = useState<DataEvent[]>([]);
  const [insight, setInsight] = useState<Insight>({ text: "Waiting for first AI analysis...", generatedAt: "" });
  const [search, setSearch] = useState("");
  const [firing, setFiring] = useState(false);
  const [hourCount, setHourCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const { socket: alertSocket, connected } = useWebSocket(import.meta.env.VITE_ALERT_WS_URL || "http://localhost:3003");
  const { socket: aiSocket } = useWebSocket(import.meta.env.VITE_AI_WS_URL || "http://localhost:3004");

  // Load initial events from API on mount
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const res = await getEvents(1, 50);
        // response shape is { success: true, data: [...] }
        const data = res.data || res;
        if (Array.isArray(data)) {
          setEvents(data);
          setHourCount(data.length);
        }
      } catch (err) {
        console.error("Failed to load events:", err);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  //Live events from alert-service via WebSocket
  useEffect(() => {
    if (!alertSocket) return;
    alertSocket.on("new-alert", (event: DataEvent) => {
      setEvents((prev) => {
        if (prev.find((e) => e.id === event.id)) return prev;
        return [{ ...event, timestamp: new Date().toISOString() }, ...prev].slice(0, 100);
      });
      setHourCount((c) => c + 1);
    });
    return () => {
      alertSocket.off("new-alert");
    };
  }, [alertSocket]);

  //  AI insights from ai-service via WebSocket
  useEffect(() => {
    if (!aiSocket) return;
    aiSocket.on("ai-insight", (data: Insight) => setInsight(data));
    return () => {
      aiSocket.off("ai-insight");
    };
  }, [aiSocket]);

  // Fire Event button handler to create a new random event using the API and show a temporary loading state
  const fireEvent = useCallback(async () => {
    setFiring(true);
    const template = FAKE_EVENTS[Math.floor(Math.random() * FAKE_EVENTS.length)];
    try {
      await createEvent({
        type: template.type,
        severity: template.severity,
        source: template.source,
        message: template.message,
        metadata: { location: template.location },
      });
    } catch (err) {
      console.error("Failed to fire event:", err);
    }
    setTimeout(() => setFiring(false), 600);
  }, []);

  const critical = events.filter((e) => e.severity === "critical").length;
  const high = events.filter((e) => e.severity === "high").length;

  return (
    <div className="min-h-screen bg-[#13161f] text-white font-sans">
      <Navbar connected={connected} userEmail={userEmail} onLogout={onLogout} />
      <div className="px-6 py-5 space-y-5">
        <StatCards total={events.length} hourCount={hourCount} critical={critical} high={high} />
        <SearchBar value={search} onChange={setSearch} onFire={fireEvent} firing={firing} />

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-slate-400 text-sm animate-pulse">Loading events...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-3">
              <LiveFeed events={events} search={search} />
            </div>
            <div className="lg:col-span-2 flex flex-col gap-4">
              <AIInsightPanel insight={insight} />
              <SeverityChart events={events} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
