export type Severity = "low" | "medium" | "high" | "critical";

// Shared types for events and insights used across components and services
export interface DataEvent {
  id: string;
  type: string;
  severity: Severity;
  location?: string;
  message: string;
  source: string;
  timestamp?: string;
  createdAt?: string;
}

// AI-generated insight with text and timestamp
export interface Insight {
  text: string;
  generatedAt: string;
}
