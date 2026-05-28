/**
 * useSolverAPI.js — Custom React Hook for Solver API Calls
 * ==========================================================
 * THIS IS THE KEY CHANGE FROM THE ORIGINAL APP.
 *
 * WHAT IT REPLACES:
 * The original app had a giant useMemo() block (~200 lines) that ran
 * the binary search solver directly in the browser. Now, this hook
 * sends the inputs to the API server and returns the results.
 *
 * WHAT IT DOES (plain English):
 * 1. Watches all user inputs for changes
 * 2. Waits 500ms after the last change (debouncing — so we don't
 *    flood the server while the user is still typing)
 * 3. Sends the inputs to POST /api/solve
 * 4. Returns the results (or loading/error state)
 *
 * The return value has the exact same shape as the old useMemo result,
 * so the rest of the UI doesn't need to change.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { apiCall } from "../utils/api";

/**
 * @param {Object} inputs — All user inputs (same shape as the API expects)
 * @returns {{ data: Object|null, loading: boolean, error: string|null }}
 */
export function useSolverAPI(inputs) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);
  const abortRef = useRef(null);

  // Serialize inputs for comparison (detect actual changes)
  const inputsJson = JSON.stringify(inputs);

  useEffect(() => {
    // Clear any pending debounce timer
    if (timerRef.current) clearTimeout(timerRef.current);

    // Abort any in-flight request
    if (abortRef.current) abortRef.current.abort();

    // Debounce: wait 500ms after last change before calling API
    timerRef.current = setTimeout(async () => {
      // Validate we have minimum viable inputs before calling
      if (!inputs.currentAge || !inputs.retirementAge || !inputs.lifeExpectancy) {
        return;
      }
      if (!inputs.accounts || inputs.accounts.length === 0) {
        return;
      }

      setLoading(true);
      setError(null);

      // Create an AbortController so we can cancel if inputs change again
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        // Determine which endpoint to call based on whether portfolio overrides exist
        const hasOverrides =
          inputs.portfolioOverrides &&
          Object.keys(inputs.portfolioOverrides).length > 0;

        const result = await apiCall("/api/solve", {
          ...inputs,
          // Ensure these are always objects, not undefined
          marketReturns: inputs.marketReturns || {},
          spendingOverrides: inputs.spendingOverrides || {},
          portfolioOverrides: inputs.portfolioOverrides || {},
        });

        // Only update if this request wasn't aborted
        if (!controller.signal.aborted) {
          setData(result);
          setLoading(false);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          // Don't show abort errors
          if (err.name !== "AbortError") {
            setError(err.message || "Failed to reach solver. Is the API server running?");
            setLoading(false);
          }
        }
      }
    }, 500);

    // Cleanup on unmount or re-render
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [inputsJson]);

  return { data, loading, error };
}


/**
 * useCompareAPI — Fetches 4% Rule comparison data.
 * Only called when the Compare tab is active.
 */
export function useCompareAPI(inputs, active) {
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
        const result = await apiCall("/api/compare", {
          ...inputs,
          marketReturns: inputs.marketReturns || {},
          spendingOverrides: inputs.spendingOverrides || {},
          portfolioOverrides: inputs.portfolioOverrides || {},
        });
        setData(result);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Comparison failed");
        setLoading(false);
      }
    }, 600);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [inputsJson, active]);

  return { data, loading, error };
}
