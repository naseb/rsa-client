/**
 * api.js — API Configuration
 * ===========================
 * Single place to configure the API server URL.
 * 
 * In development: http://localhost:3001
 * In production: Set VITE_API_URL environment variable
 * 
 * WHAT THIS DOES (plain English):
 * When the frontend needs to talk to the solver API, it imports this file
 * to know where to send requests. During development on your computer,
 * it talks to localhost:3001. When deployed, it uses whatever URL you set.
 */

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

/**
 * Call the solver API.
 * @param {string} endpoint — e.g., "/api/solve" or "/api/compare"
 * @param {Object} body — The inputs to send
 * @returns {Promise<Object>} The parsed JSON response
 */
export async function apiCall(endpoint, body) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Server error" }));
    throw new Error(error.error || `API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Check if the API server is reachable.
 */
export async function checkHealth() {
  try {
    const response = await fetch(`${API_BASE}/api/health`);
    return response.ok;
  } catch {
    return false;
  }
}
