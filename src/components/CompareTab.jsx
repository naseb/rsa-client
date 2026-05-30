/**
 * CompareTab.jsx — vs 4% Rule Comparison
 * ========================================
 * Fix: features is an array of [name, rsaBool, fourPctBool] tuples.
 * Updated: money theme colors, larger fonts for 50+ readability.
 */

import { C, FONT_BODY, FONT_MONO, fmtCompact, fmtFull } from "../utils/theme";
import LoadingOverlay from "./LoadingOverlay";

export default function CompareTab({ compareData, loading, error, baseSpending }) {
  if (loading) {
    return (
      <div>
        <LoadingOverlay loading={true} />
        <div style={{ textAlign: "center", padding: 40, color: C.gray, fontSize: 16 }}>
          Calculating 4% Rule comparison...
        </div>
      </div>
    );
  }

  if (error) return <LoadingOverlay loading={false} error={error} />;

  if (!compareData) {
    return (
      <div style={{ textAlign: "center", padding: 40, color: C.gray, fontSize: 16 }}>
        Loading comparison data...
      </div>
    );
  }

  const { rsa, comparison: cmp } = compareData;

  return (
    <div style={{ maxWidth: 900 }}>

      {/* ── Summary banner ── */}
      <div style={{
        background: "linear-gradient(135deg, #1c3829 0%, #2d5a47 40%, #1c3829 100%)",
        borderRadius: 16, padding: "28px 36px", marginBottom: 20,
        color: "#fff", position: "relative", overflow: "hidden",
        borderBottom: "2px solid #b8860b",
      }}>
        <div style={{
          position: "absolute", top: -40, right: -40, width: 250, height: 250,
          background: "radial-gradient(circle,rgba(184,134,11,0.12) 0%,transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ fontSize: 13, color: "#7aaa8a", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
          RSA Phased Approach vs Traditional 4% Rule
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* RSA side */}
          <div style={{ background: "rgba(245,158,11,0.1)", borderRadius: 12, padding: "18px 22px", border: "1px solid rgba(245,158,11,0.25)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: C.goGo }} />
              <span style={{ fontSize: 15, fontWeight: 700, color: C.goGo }}>RSA Phased Approach</span>
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, fontFamily: FONT_MONO, color: C.goGo, lineHeight: 1 }}>
              {fmtFull(rsa?.baseSpending || baseSpending)}
              <span style={{ fontSize: 16, color: "#94a3b8", fontWeight: 400 }}>/yr</span>
            </div>
            <div style={{ fontSize: 14, color: "#94a3b8", marginTop: 6 }}>
              Go-Go phase · Scales down in later phases
            </div>
            {cmp?.rsaLifetimeSpending != null && (
              <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 10 }}>
                Lifetime total:{' '}
                <strong style={{ fontFamily: FONT_MONO, color: "#fff" }}>
                  {fmtCompact(cmp.rsaLifetimeSpending)}
                </strong>
              </div>
            )}
          </div>

          {/* 4% Rule side */}
          <div style={{ background: "rgba(45,106,79,0.1)", borderRadius: 12, padding: "18px 22px", border: "1px solid rgba(45,106,79,0.25)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: C.green }} />
              <span style={{ fontSize: 15, fontWeight: 700, color: C.green }}>Traditional 4% Rule</span>
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, fontFamily: FONT_MONO, color: C.green, lineHeight: 1 }}>
              {fmtFull(cmp?.fourPctWithdrawal || 0)}
              <span style={{ fontSize: 16, color: "#94a3b8", fontWeight: 400 }}>/yr</span>
            </div>
            <div style={{ fontSize: 14, color: "#94a3b8", marginTop: 6 }}>
              Fixed 4% of portfolio at retirement
            </div>
            {cmp?.fourPctLifetimeSpending != null && (
              <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 10 }}>
                Lifetime total:{' '}
                <strong style={{ fontFamily: FONT_MONO, color: "#fff" }}>
                  {fmtCompact(cmp.fourPctLifetimeSpending)}
                </strong>
              </div>
            )}
          </div>
        </div>

        {cmp?.diff != null && (
          <div style={{ marginTop: 18, textAlign: "center" }}>
            <span style={{ fontSize: 16, color: cmp.diff > 0 ? C.goGo : C.green, fontWeight: 700 }}>
              RSA gives you {fmtFull(Math.abs(cmp.diff))} {cmp.diff > 0 ? "MORE" : "LESS"} per year in Go-Go
              {cmp.diffPct != null && ` (${cmp.diff > 0 ? "+" : ""}${cmp.diffPct.toFixed(0)}%)`}
            </span>
          </div>
        )}

        {cmp?.lifetimeDiff != null && (
          <div style={{ marginTop: 8, textAlign: "center" }}>
            <span style={{ fontSize: 14, color: "#94a3b8" }}>
              Lifetime difference:{' '}
              <strong style={{ color: cmp.lifetimeDiff > 0 ? C.goGo : C.green, fontFamily: FONT_MONO }}>
                {cmp.lifetimeDiff > 0 ? "+" : ""}{fmtCompact(cmp.lifetimeDiff)}
              </strong>{' '}
              total spending with RSA
            </span>
          </div>
        )}
      </div>

      {/* ── Feature comparison ── */}
      {cmp?.features && (
        <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12, padding: "24px 28px", marginBottom: 20 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: C.navy, marginBottom: 18 }}>Feature Comparison</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: C.pageBg }}>
                <th style={{ padding: "11px 16px", textAlign: "left",   fontSize: 13, color: C.gray,  fontWeight: 700, borderBottom: `2px solid ${C.border}` }}>Feature</th>
                <th style={{ padding: "11px 16px", textAlign: "center", fontSize: 13, color: C.goGo,  fontWeight: 700, borderBottom: `2px solid ${C.border}` }}>RSA Phased</th>
                <th style={{ padding: "11px 16px", textAlign: "center", fontSize: 13, color: C.green, fontWeight: 700, borderBottom: `2px solid ${C.border}` }}>4% Rule</th>
              </tr>
            </thead>
            <tbody>
              {/*
                features is an array of tuples: [featureName, rsaHas, fourPctHas]
                where rsaHas and fourPctHas are booleans.
              */}
              {cmp.features.map(([featureName, rsaHas, fourPctHas], idx) => (
                <tr key={featureName} style={{
                  borderBottom: `1px solid ${C.border}`,
                  background: idx % 2 === 0 ? "#fff" : C.pageBg,
                }}>
                  <td style={{ padding: "11px 16px", fontSize: 15, color: C.navy, fontWeight: 500 }}>
                    {featureName}
                  </td>
                  <td style={{ padding: "11px 16px", textAlign: "center", fontSize: 18 }}>
                    {rsaHas
                      ? <span style={{ color: "#2d6a4f", fontWeight: 800 }}>✓</span>
                      : <span style={{ color: C.xltGray }}>✗</span>}
                  </td>
                  <td style={{ padding: "11px 16px", textAlign: "center", fontSize: 18 }}>
                    {fourPctHas
                      ? <span style={{ color: "#2d6a4f", fontWeight: 800 }}>✓</span>
                      : <span style={{ color: C.xltGray }}>✗</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Portfolio balance chart ── */}
      {cmp?.fourPctBalances && cmp?.rsaBalances && (
        <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12, padding: "24px 28px", marginBottom: 20 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: C.navy, marginBottom: 14 }}>Portfolio Balance Over Time</div>
          <svg viewBox="0 0 500 200" style={{ width: "100%", height: 200 }}>
            {(() => {
              const allBals = [...cmp.fourPctBalances, ...cmp.rsaBalances];
              const maxBal  = Math.max(...allBals, 1);
              const n       = cmp.fourPctBalances.length;

              const rsaPoints = cmp.rsaBalances.map((b, i) => {
                const x = (i / Math.max(n - 1, 1)) * 460 + 20;
                const y = 185 - (b / maxBal) * 170;
                return `${x},${y}`;
              }).join(" ");

              const fourPctPoints = cmp.fourPctBalances.map((b, i) => {
                const x = (i / Math.max(n - 1, 1)) * 460 + 20;
                const y = 185 - (b / maxBal) * 170;
                return `${x},${y}`;
              }).join(" ");

              return (
                <>
                  <polyline points={fourPctPoints} fill="none" stroke={C.green} strokeWidth={2} strokeDasharray="6,3" opacity={0.8} />
                  <polyline points={rsaPoints}     fill="none" stroke={C.goGo}  strokeWidth={2.5} />
                  <line x1={20}  y1={10} x2={44}  y2={10} stroke={C.goGo}  strokeWidth={2.5} />
                  <text x={48}  y={14} fontSize="11" fill={C.navy} fontWeight="600">RSA</text>
                  <line x1={90}  y1={10} x2={114} y2={10} stroke={C.green} strokeWidth={2} strokeDasharray="6,3" />
                  <text x={118} y={14} fontSize="11" fill={C.navy} fontWeight="600">4% Rule</text>
                  <text x={20}  y={198} fontSize="10" fill={C.gray}>Year 1</text>
                  <text x={480} y={198} fontSize="10" fill={C.gray} textAnchor="end">Year {n}</text>
                </>
              );
            })()}
          </svg>
        </div>
      )}

      <div style={{ textAlign: "center", padding: "16px 0", fontSize: 14, color: C.ltGray }}>
        The 4% Rule withdraws 4% of your portfolio at retirement, adjusted for inflation each year.
        RSA optimizes spending across phases for maximum early-retirement enjoyment.
      </div>

    </div>
  );
}
