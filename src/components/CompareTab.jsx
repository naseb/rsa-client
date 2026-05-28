/**
 * CompareTab.jsx — vs 4% Rule Comparison
 * ========================================
 * Shows a side-by-side comparison of the RSA phased approach
 * vs the traditional 4% withdrawal rule.
 *
 * Fetches comparison data from POST /api/compare when the tab
 * becomes active (lazy loading — no API call until you click the tab).
 */

import { C, FONT_BODY, FONT_MONO, fmtCompact, fmtFull } from "../utils/theme";
import LoadingOverlay from "./LoadingOverlay";

export default function CompareTab({ compareData, loading, error, baseSpending }) {
  if (loading) {
    return (
      <div>
        <LoadingOverlay loading={true} />
        <div style={{ textAlign: "center", padding: 40, color: C.gray, fontSize: 14 }}>
          Calculating 4% Rule comparison...
        </div>
      </div>
    );
  }

  if (error) {
    return <LoadingOverlay loading={false} error={error} />;
  }

  if (!compareData) {
    return (
      <div style={{ textAlign: "center", padding: 40, color: C.gray, fontSize: 14 }}>
        Loading comparison data...
      </div>
    );
  }

  const { rsa, comparison: cmp } = compareData;

  return (
    <div style={{ maxWidth: 900 }}>
      {/* Summary banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0f172a 100%)",
          borderRadius: 16,
          padding: "28px 36px",
          marginBottom: 20,
          color: "#fff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute", top: -40, right: -40, width: 250, height: 250,
            background: "radial-gradient(circle,rgba(59,130,246,0.1) 0%,transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ fontSize: 11, color: "#64748b", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>
          RSA Phased Approach vs Traditional 4% Rule
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* RSA side */}
          <div style={{ background: "rgba(245,158,11,0.08)", borderRadius: 12, padding: "16px 20px", border: "1px solid rgba(245,158,11,0.2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: C.goGo }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: C.goGo }}>RSA Phased Approach</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, fontFamily: FONT_MONO, color: C.goGo, lineHeight: 1 }}>
              {fmtFull(rsa?.baseSpending || baseSpending)}
              <span style={{ fontSize: 14, color: "#64748b", fontWeight: 400 }}>/yr</span>
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
              Go-Go phase · Scales down in later phases
            </div>
            {cmp?.rsaLifetimeSpending != null && (
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 8 }}>
                Lifetime total: <strong style={{ fontFamily: FONT_MONO, color: "#fff" }}>{fmtCompact(cmp.rsaLifetimeSpending)}</strong>
              </div>
            )}
          </div>

          {/* 4% side */}
          <div style={{ background: "rgba(59,130,246,0.08)", borderRadius: 12, padding: "16px 20px", border: "1px solid rgba(59,130,246,0.2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: C.accent }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: C.accent }}>Traditional 4% Rule</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, fontFamily: FONT_MONO, color: C.accent, lineHeight: 1 }}>
              {fmtFull(cmp?.fourPctWithdrawal || 0)}
              <span style={{ fontSize: 14, color: "#64748b", fontWeight: 400 }}>/yr</span>
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
              Fixed 4% of portfolio at retirement
            </div>
            {cmp?.fourPctLifetimeSpending != null && (
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 8 }}>
                Lifetime total: <strong style={{ fontFamily: FONT_MONO, color: "#fff" }}>{fmtCompact(cmp.fourPctLifetimeSpending)}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Difference callout */}
        {cmp?.diff != null && (
          <div style={{ marginTop: 16, textAlign: "center" }}>
            <span style={{ fontSize: 14, color: cmp.diff > 0 ? C.goGo : C.accent, fontWeight: 700 }}>
              RSA gives you {cmp.diff > 0 ? fmtFull(cmp.diff) : fmtFull(Math.abs(cmp.diff))} {cmp.diff > 0 ? "MORE" : "LESS"} per year in Go-Go
              {cmp.diffPct != null && ` (${cmp.diff > 0 ? "+" : ""}${cmp.diffPct.toFixed(0)}%)`}
            </span>
          </div>
        )}

        {/* Lifetime difference */}
        {cmp?.lifetimeDiff != null && (
          <div style={{ marginTop: 8, textAlign: "center" }}>
            <span style={{ fontSize: 12, color: "#94a3b8" }}>
              Lifetime difference: <strong style={{ color: cmp.lifetimeDiff > 0 ? C.goGo : C.accent, fontFamily: FONT_MONO }}>
                {cmp.lifetimeDiff > 0 ? "+" : ""}{fmtCompact(cmp.lifetimeDiff)}
              </strong> total spending with RSA
            </span>
          </div>
        )}
      </div>

      {/* Feature comparison */}
      {cmp?.features && (
        <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 24px", marginBottom: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 16 }}>Feature Comparison</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, color: C.gray, fontWeight: 700, borderBottom: `2px solid ${C.border}` }}>Feature</th>
                <th style={{ padding: "10px 14px", textAlign: "center", fontSize: 11, color: C.goGo, fontWeight: 700, borderBottom: `2px solid ${C.border}` }}>RSA Phased</th>
                <th style={{ padding: "10px 14px", textAlign: "center", fontSize: 11, color: C.accent, fontWeight: 700, borderBottom: `2px solid ${C.border}` }}>4% Rule</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(cmp.features).map(([feature, values]) => (
                <tr key={feature} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: "10px 14px", fontSize: 12, color: C.navy, fontWeight: 500 }}>{feature}</td>
                  <td style={{ padding: "10px 14px", textAlign: "center", fontSize: 12, fontFamily: FONT_MONO, color: C.navy }}>
                    {typeof values.rsa === "number" ? fmtFull(values.rsa) : values.rsa}
                  </td>
                  <td style={{ padding: "10px 14px", textAlign: "center", fontSize: 12, fontFamily: FONT_MONO, color: C.navy }}>
                    {typeof values.fourPct === "number" ? fmtFull(values.fourPct) : values.fourPct}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Balance comparison chart */}
      {cmp?.fourPctBalances && cmp?.rsaBalances && (
        <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 24px", marginBottom: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 12 }}>Portfolio Balance Over Time</div>
          <svg viewBox="0 0 500 200" style={{ width: "100%", height: 200 }}>
            {(() => {
              const allBals = [...cmp.fourPctBalances, ...cmp.rsaBalances];
              const maxBal = Math.max(...allBals, 1);
              const n = cmp.fourPctBalances.length;

              const rsaPoints = cmp.rsaBalances.map((b, i) => {
                const x = (i / (n - 1)) * 460 + 20;
                const y = 185 - (b / maxBal) * 170;
                return `${x},${y}`;
              }).join(" ");

              const fourPctPoints = cmp.fourPctBalances.map((b, i) => {
                const x = (i / (n - 1)) * 460 + 20;
                const y = 185 - (b / maxBal) * 170;
                return `${x},${y}`;
              }).join(" ");

              return (
                <>
                  <polyline points={fourPctPoints} fill="none" stroke={C.accent} strokeWidth={2} strokeDasharray="6,3" opacity={0.7} />
                  <polyline points={rsaPoints} fill="none" stroke={C.goGo} strokeWidth={2.5} />
                  {/* Legend */}
                  <line x1={20} y1={10} x2={40} y2={10} stroke={C.goGo} strokeWidth={2.5} />
                  <text x={44} y={14} fontSize="10" fill={C.navy} fontWeight="600">RSA</text>
                  <line x1={80} y1={10} x2={100} y2={10} stroke={C.accent} strokeWidth={2} strokeDasharray="6,3" />
                  <text x={104} y={14} fontSize="10" fill={C.navy} fontWeight="600">4% Rule</text>
                  <text x={20} y={198} fontSize="8" fill={C.gray}>Year 1</text>
                  <text x={470} y={198} fontSize="8" fill={C.gray} textAnchor="end">Year {n}</text>
                </>
              );
            })()}
          </svg>
        </div>
      )}

      <div style={{ textAlign: "center", padding: "16px 0", fontSize: 12, color: C.ltGray }}>
        The 4% Rule withdraws 4% of your portfolio at retirement, adjusted for inflation each year.
        RSA optimizes spending across phases for maximum early-retirement enjoyment.
      </div>
    </div>
  );
}
