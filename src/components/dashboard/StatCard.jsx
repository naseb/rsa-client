/**
 * StatCard.jsx — Small stat tile (label / big value / sublabel).
 */
import { C, FONT_BODY, FONT_MONO } from "../../utils/theme";

export default function StatCard({ label, value, sublabel, accentColor = C.navy, icon }) {
  return (
    <div style={{
      background: C.cardBg,
      border: `1px solid ${C.border}`,
      borderRadius: 12,
      padding: "16px 18px",
      fontFamily: FONT_BODY,
    }}>
      <div style={{
        fontSize: 11,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: C.gray,
        marginBottom: 8,
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}>
        {icon && <span style={{ fontSize: 13 }}>{icon}</span>}
        {label}
      </div>
      <div style={{ fontFamily: FONT_MONO, fontSize: 23, fontWeight: 800, color: accentColor, lineHeight: 1.1 }}>
        {value}
      </div>
      {sublabel && (
        <div style={{ fontSize: 12, color: C.ltGray, marginTop: 4 }}>{sublabel}</div>
      )}
    </div>
  );
}
