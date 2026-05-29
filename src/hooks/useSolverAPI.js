/**
 * useSolverAPI.js — Custom React Hook for Solver API Calls
 * ==========================================================
 * Sends user inputs to the API server and returns results.
 *
 * Phase 4.5 update: uses useAuth() from Clerk to attach a session token
 * to every request. The server requires this token to verify the user
 * has a valid subscription before running the solver.
 *
 * HOW IT WORKS:
 * 1. Watches all user inputs for changes
 * 2. Waits 500ms after the last change (debouncing)
 * 3. Gets a fresh Clerk session token via getToken()
 * 4. Sends inputs + token to POST /api/solve
 * 5. Returns results (or loading/error state)
 */

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { apiCall } from '../utils/api';

/**
 * @param {Object} inputs — All user inputs (same shape as the API expects)
 * @returns {{ data: Object|null, loading: boolean, error: string|null }}
 */
export function useSolverAPI(inputs) {
  const { getToken } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);
  const abortRef = useRef(null);

  const inputsJson = JSON.stringify(inputs);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (abortRef.current) abortRef.current.abort();

    timerRef.current = setTimeout(async () => {
      if (!inputs.currentAge || !inputs.retirementAge || !inputs.lifeExpectancy) return;
      if (!inputs.accounts || inputs.accounts.length === 0) return;

      setLoading(true);
      setError(null);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        // Get a fresh Clerk session token for this request
        const token = await getToken();

        const result = await apiCall('/api/solve', {
          ...inputs,
          marketReturns:     inputs.marketReturns     || {},
          spendingOverrides: inputs.spendingOverrides || {},
          portfolioOverrides: inputs.portfolioOverrides || {},
        }, token);

        if (!controller.signal.aborted) {
          setData(result);
          setLoading(false);
        }
      } catch (err) {
        if (!controller.signal.aborted && err.name !== 'AbortError') {
          setError(err.message || 'Failed to reach the solver API.');
          setLoading(false);
        }
      }
    }, 500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [inputsJson]); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error };
}


/**
 * useCompareAPI — Fetches 4% Rule comparison data.
 * Only called when the Compare tab is active.
 */
export function useCompareAPI(inputs, active) {
  const { getToken } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  const inputsJson = JSON.stringify(inputs);

  useEffect(() => {
    if (!active) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      if (!inputs.currentAge || !inputs.retirementAge || !inputs.lifeExpectancy) return;
      if (!inputs.accounts || inputs.accounts.length === 0) return;

      setLoading(true);
      setError(null);

      try {
        const token = await getToken();

        const result = await apiCall('/api/compare', {
          ...inputs,
          marketReturns:     inputs.marketReturns     || {},
          spendingOverrides: inputs.spendingOverrides || {},
          portfolioOverrides: inputs.portfolioOverrides || {},
        }, token);

        setData(result);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Comparison failed.');
        setLoading(false);
      }
    }, 600);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [inputsJson, active]); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error };
}
