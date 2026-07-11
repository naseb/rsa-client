/**
 * ResultCard.jsx — Headline "how is my plan doing" card.
 *
 * Shows a plain-English Plan Status (on-track / caution / at-risk, see
 * ../../utils/planStatus.js) derived from the deterministic solver, plus
 * a "vs the 4% Rule" comparison once that data loads. Deliberately NOT a
 * probability-of-success number — there's no Monte Carlo simulation
 * behind this app yet, and a fabricated percentage would overstate the
 * confidence this tool can actually offer.
 */
import { C, FONT_MONO } from "../../utils/theme";

const STATUS_META = {
  "on-track": { color: "#4ade80", label: "On Track" },
  "caution": { color: "#fbbf24", label: "Caution" },
  "at-risk": { color: "#f87171", label: "At Risk" },
};

export default function ResultCard({ status, statusDetail, vsFourPct, vsFourPctLoading, onViewComparison }) {
  const { color: statusColor, label: statusLabel } = STATUS_META[status] || STATUS_META["on-track"];

  return (
    <div className="print-banner" style={{
      background: "linear-gradient(135deg, #1c3829 0%, #2d5a47 40%, #1c3829 100%)",
      borderRadius: 16,
      padding: "28px 36px",
      marginBottom: 20,
      color: "#fff",
      position: "relative",
      overflow: "hidden",
      borderBottom: "2px solid #b8860b",
    }}>
      <div style={{ position: "absolute", top: -40, right: -40, width: 250, height: 250, background: "radial-gradient(circle,rgba(184,134,11,0.15) 0%,transparent 70%)", pointerEvents: "none" }} />

      <div style={{ fontSize: 11, color: "rgba(247,243,234,0.5)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>
        Plan Status
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 6 }}>
        <div style={{ fontSize: 44, fontWeight: 800, fontFamily: FONT_MONO, color: statusColor, lineHeight: 1 }}>
          {statusLabel}
        </div>
      </div>

      {statusDetail && (
        <div style={{ fontSize: 15, color: "rgba(247,243,234,0.75)", marginBottom: 18 }}>
          {statusDetail}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {vsFourPctLoading ? (
          <span style={{ fontSize: 13, color: "rgba(247,243,234,0.5)" }}>Comparing to the 4% Rule…</span>
        ) : vsFourPct != null ? (
          <span style={{ fontSize: 14, color: "rgba(247,243,234,0.85)" }}>
            <strong style={{ color: vsFourPct >= 0 ? "#4ade80" : "#f87171", fontFamily: FONT_MONO }}>
              {vsFourPct >= 0 ? "+" : ""}{vsFourPct.toFixed(0)}%
            </strong>{" "}
            {vsFourPct >= 0 ? "higher" : "lower"} sustainable spending than the 4% Rule
          </span>
        ) : null}
        {onViewComparison && (
          <button
            onClick={onViewComparison}
            className="no-print"
            style={{
              background: "transparent",
              border: "none",
              color: "#b8860b",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              padding: 0,
            }}
          >
            See full comparison →
          </button>
        )}
      </div>
    </div>
  );
}
