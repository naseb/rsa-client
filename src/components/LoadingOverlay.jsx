/**
 * LoadingOverlay.jsx — Solver Loading Indicator
 * ===============================================
 * Shows a subtle pulsing bar at the top of the results area
 * while waiting for the API to return. Doesn't block the UI.
 */

import { C, FONT_BODY } from "../utils/theme";

export default function LoadingOverlay({ loading, error }) {
  if (!loading && !error) return null;

  if (error) {
    return (
      <div
        style={{
          padding: "12px 20px",
          background: C.redBg,
          border: `1px solid ${C.red}`,
          borderRadius: 8,
          marginBottom: 16,
          fontFamily: FONT_BODY,
          fontSize: 13,
          color: "#991b1b",
        }}
      >
        <strong>Solver Error:</strong> {error}
        <div style={{ fontSize: 11, color: C.gray, marginTop: 4 }}>
          Make sure the API server is running on localhost:3001
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        height: 3,
        background: C.border,
        borderRadius: 2,
        overflow: "hidden",
        marginBottom: 16,
      }}
    >
      <div
        style={{
          height: "100%",
          width: "30%",
          background: `linear-gradient(90deg, ${C.accent}, ${C.goGo})`,
          borderRadius: 2,
          animation: "solverSlide 1.2s ease-in-out infinite",
        }}
      />
      <style>{`
        @keyframes solverSlide {
          0% { margin-left: 0%; }
          50% { margin-left: 70%; }
          100% { margin-left: 0%; }
        }
      `}</style>
    </div>
  );
}
