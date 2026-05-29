/**
 * api.js — API Configuration
 * ===========================
 * Single place to configure the API server URL and make authenticated calls.
 *
 * In development: http://localhost:3001
 * In production:  Set VITE_API_URL environment variable
 *
 * Phase 4.5 update: apiCall now accepts an auth token and includes it
 * in the Authorization header on every request. The server requires this
 * token to verify the user has an active subscription before running the solver.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Call the solver API.
 * @param {string} endpoint — e.g., "/api/solve" or "/api/compare"
 * @param {Object} body     — The inputs to send
 * @param {string|null} token — Clerk session token (required in production)
 * @returns {Promise<Object>} The parsed JSON response
 */
export async function apiCall(endpoint, body, token = null) {
  const headers = { 'Content-Type': 'application/json' };

  // Attach the Clerk auth token so the server can verify the user
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Server error' }));
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
