/**
 * CoachSuggestions.jsx — Read-only list of plan insights.
 * Purely presentational; derivation logic lives in SpendingPhasesTab.jsx.
 */
import { C, FONT_BODY } from "../../utils/theme";

const SEVERITY_COLOR = {
  info: C.accent,
  warning: C.orange,
  alert: C.red,
};

export default function CoachSuggestions({ suggestions }) {
  return (
    <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 24px" }} className="print-card">
      <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 4 }}>Coach Suggestions</div>
      <div style={{ fontSize: 12, color: C.gray, marginBottom: 16 }}>Small adjustments worth reviewing.</div>

      {(!suggestions || suggestions.length === 0) ? (
        <div style={{ fontSize: 13, color: C.gray, fontFamily: FONT_BODY }}>
          No urgent flags — your plan looks steady.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {suggestions.map((s, i) => (
            <div key={i} style={{
              borderLeft: `3px solid ${SEVERITY_COLOR[s.severity] || C.accent}`,
              padding: "6px 12px",
              background: C.pageBg,
              borderRadius: "0 8px 8px 0",
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{s.title}</div>
              <div style={{ fontSize: 12, color: C.gray, marginTop: 2 }}>{s.detail}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
