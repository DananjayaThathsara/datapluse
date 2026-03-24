const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function getToken(): string {
  return localStorage.getItem("token") || "";
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

// API functions for authentication, event management, and search
export async function register(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

// Event management
export async function createEvent(data: any) {
  const res = await fetch(`${API_URL}/events`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getEvents(page = 1, limit = 20) {
  const res = await fetch(`${API_URL}/events?page=${page}&limit=${limit}`, {
    headers: authHeaders(),
  });
  return res.json();
}

export async function getStats() {
  const res = await fetch(`${API_URL}/events/stats`, {
    headers: authHeaders(),
  });
  return res.json();
}

// Search events by query (type, message, location, severity)
export async function searchEvents(query: string) {
  const res = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`, {
    headers: authHeaders(),
  });
  return res.json();
}
