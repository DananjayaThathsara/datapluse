// src/constants/index.ts
// Severity colour maps + fake demo events
// IMPORTANT: always write FULL Tailwind class names here
// Never build dynamically like `border-l-${severity}` — Tailwind purges dynamic strings

import type { Severity, DataEvent } from "../types";

// Left border colour per severity — used in EventRow
export const SEVERITY_BORDER: Record<Severity, string> = {
  critical: "border-l-red-500",
  high: "border-l-orange-400",
  medium: "border-l-blue-400",
  low: "border-l-slate-600",
};

// Dot colour per severity — used in EventRow
export const SEVERITY_DOT: Record<Severity, string> = {
  critical: "bg-red-500",
  high: "bg-orange-400",
  medium: "bg-blue-400",
  low: "bg-slate-500",
};

// Badge style per severity — used in EventRow
export const SEVERITY_BADGE: Record<Severity, string> = {
  critical: "bg-red-500/20 text-red-400 border border-red-500/30",
  high: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
  medium: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  low: "bg-slate-600/40 text-slate-400 border border-slate-600/40",
};

// Chart bar fill colour per severity — used in SeverityChart
export const SEVERITY_CHART_COLOUR: Record<Severity, string> = {
  low: "#6b7280",
  medium: "#3b82f6",
  high: "#f59e0b",
  critical: "#ef4444",
};

// Fake UAE events — fired by "+ Fire Event" demo button
// Omit<DataEvent, 'id' | 'timestamp'> because we generate those at fire-time
export const FAKE_EVENTS: Omit<DataEvent, "id" | "timestamp" | "createdAt">[] = [
  {
    type: "Traffic congestion",
    severity: "medium",
    location: "Al Khail Road, Dubai",
    message: "Slow traffic due to construction — 15 min delay",
    source: "rta_sensor_34",
  },
  {
    type: "Power outage",
    severity: "critical",
    location: "Deira, Dubai",
    message: "Partial outage affecting 3 city blocks — 1,200 units",
    source: "dewa_grid_d4",
  },
  {
    type: "Server error",
    severity: "critical",
    location: "Data Centre 1, Abu Dhabi",
    message: "Government portal returning 503 errors — 87% failure rate",
    source: "apm_agent_dc1",
  },
  {
    type: "Traffic incident",
    severity: "high",
    location: "Sheikh Zayed Road, Dubai",
    message: "3-car accident blocking 2 lanes near interchange 5",
    source: "rta_sensor_12",
  },
  {
    type: "Energy spike",
    severity: "high",
    location: "Zone 3, Abu Dhabi",
    message: "Power consumption 43% above weekly average",
    source: "addc_monitor_z3",
  },
  {
    type: "Citizen complaint",
    severity: "medium",
    location: "Al Reem Island, Abu Dhabi",
    message: "Noise complaints surge — 38 in last 30 mins",
    source: "aderp_portal",
  },
  {
    type: "Network spike",
    severity: "low",
    location: "Internet Exchange, Dubai",
    message: "Traffic 18% above baseline — within acceptable range",
    source: "de-cix_monitor",
  },
  { type: "Security alert", severity: "high", location: "ADGM, Abu Dhabi", message: "15 failed access attempts in 5 mins", source: "waf_monitor" },
  {
    type: "App latency",
    severity: "high",
    location: "Cloud Region UAE",
    message: "Payment gateway response exceeding 5s — threshold 1s",
    source: "apm_payments",
  },
  {
    type: "Queue surge",
    severity: "medium",
    location: "DLD Office, Dubai",
    message: "Property registration queue exceeding 2 hours",
    source: "dld_queue",
  },
];
