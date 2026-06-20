/**
 * CompareTab.jsx — vs 4% Rule Comparison
 * ========================================
 * Rebuilt to match the original HTML app's rich comparison layout:
 *   - 4 headline metric cards
 *   - Side-by-side RSA vs 4% Rule detailed panels
 *   - Portfolio trajectory chart with age labels
 *   - Feature comparison table
 */

import { C, FONT_BODY, FONT_MONO, fmtCompact, fmtFull } from "../utils/theme";
import LoadingOverlay from "./LoadingOverlay";

export default function CompareTab({ compareData, loading, error, baseSpending, inputs }) {
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

  // ── Phase spending from RSA year data ──────────────────────────────────────
  const retiredYears   = rsa?.years?.filter(y => y.isRetired) || [];
  const retirementAge  = retiredYears[0]?.age || 65;
  const goGoYr         = retiredYears.find(y => y.phaseName === 'Go-Go');
  const slowGoYr       = retiredYears.find(y => y.phaseName === 'Slow-Go');
  const noGoYr         = retiredYears.find(y => y.phaseName === 'No-Go');
  const goGoSpending   = goGoYr?.annualSpending   || rsa?.baseSpending || 0;
  const slowGoSpending = slowGoYr?.annualSpending || 0;
  const noGoSpending   = noGoYr?.annualSpending   || 0;

  const goGoYears   = retiredYears.filter(y => y.phaseName === 'Go-Go').length;
  const slowGoYears = retiredYears.filter(y => y.phaseName === 'Slow-Go').length;
  const noGoYears   = retiredYears.filter(y => y.phaseName === 'No-Go').length;

  // ── Key metrics ────────────────────────────────────────────────────────────
  const fourPctTotal     = cmp?.fourPctTotalSpending  || 0;
  const rsaEndBalance    = cmp?.rsaBalances?.[cmp.rsaBalances.length - 1]         || 0;
  const fourPctEndBal    = cmp?.fourPctBalances?.[cmp.fourPctBalances.length - 1] || 0;
  const advantage        = goGoSpending - fourPctTotal;
  const advantagePct     = fourPctTotal > 0 ? (advantage / fourPctTotal) * 100 : 0;
  const withdrawalRate   = (cmp?.rsaWithdrawalRate || 0).toFixed(1);
  const retirementYears  = cmp?.retirementYears || 33;
  const lifetimeDiff     = cmp?.lifetimeDiff || 0;

  // Shared styles
  const card = (label, value, sub, color = C.navy) => (
    <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12,
      padding: "20px 22px", flex: 1 }}>
      <div style={{ fontSize: 11, color: C.gray, textTransform: "uppercase",
        letterSpacing: "0.1em", marginBottom: 8, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, fontFamily: FONT_MONO, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 13, color: C.ltGray, marginTop: 6 }}>{sub}</div>
    </div>
  );

  return (
    <div style={{ maxWidth: 960 }}>

      {/* ── Dark header ── */}
      <div style={{
        background: "linear-gradient(135deg, #1c3829 0%, #2d5a47 50%, #1c3829 100%)",
        borderRadius: 16, padding: "28px 36px", marginBottom: 20,
        borderBottom: "2px solid #b8860b",
      }}>
        <div style={{ fontSize: 12, color: "#7aaa8a", letterSpacing: "0.14em",
          textTransform: "uppercase", marginBottom: 10 }}>Your App vs The 4% Rule</div>
        <div style={{ fontSize: 26, fontWeight: 800, color: "#f7f3ea", marginBottom: 8 }}>
          <span style={{ color: "#b8860b" }}>◆</span> Retirement Spending Analyzer{" "}
          <span style={{ color: "#7aaa8a", fontWeight: 400 }}>vs</span>{" "}
          <span style={{ color: "#10b981" }}>4% Rule</span>
        </div>
        <div style={{ fontSize: 15, color: "#94a3b8", lineHeight: 1.6 }}>
          Side-by-side comparison using your actual inputs. The 4% rule assumes flat spending
          every year — your app adapts to how you actually live.
        </div>
      </div>

      {/* ── 4 metric cards ── */}
      <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
        {card(
          "RSA Go-Go Spending",
          fmtFull(goGoSpending),
          fmtCompact(goGoSpending / 12) + "/mo",
          C.goGo
        )}
        {card(
          "4% Rule Spending",
          fmtFull(fourPctTotal),
          fmtCompact(fourPctTotal / 12) + "/mo — Year 1",
          C.gray
        )}
        {card(
          "RSA Advantage (Yr 1)",
          (advantage >= 0 ? "+" : "") + fmtFull(advantage),
          (advantagePct >= 0 ? "+" : "") + advantagePct.toFixed(1) + "% more when active",
          advantage >= 0 ? C.green : C.red
        )}
        {card(
          "RSA Withdrawal Rate",
          withdrawalRate + "%",
          withdrawalRate > 4 ? "Above 4% threshold" : "Within 4% threshold",
          withdrawalRate > 4 ? C.orange : C.green
        )}
      </div>

      {/* ── Side-by-side comparison panels ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>

        {/* RSA Panel */}
        <div style={{ background: C.cardBg, border: `2px solid #2d6a4f`,
          borderRadius: 14, padding: "22px 24px", background: "#f0f8f4" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ color: C.goGo, fontSize: 18 }}>◆</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: C.navy }}>Retirement Spending Analyzer</span>
            <span style={{ fontSize: 11, background: "#2d6a4f", color: "#fff",
              padding: "2px 10px", borderRadius: 100, fontWeight: 700 }}>Dynamic</span>
          </div>

          {/* Phase spending bars */}
          <div style={{ display: "flex", gap: 6, marginBottom: 18, fontSize: 12 }}>
            {goGoSpending > 0 && (
              <div style={{ flex: goGoYears || 1, background: "#fef3c7", border: "1px solid #fcd34d",
                borderRadius: 6, padding: "6px 10px", textAlign: "center" }}>
                <div style={{ fontWeight: 700, color: C.goGo }}>Go-Go</div>
                <div style={{ color: C.navy, fontFamily: FONT_MONO, fontSize: 11 }}>{fmtCompact(goGoSpending)}</div>
              </div>
            )}
            {slowGoSpending > 0 && (
              <div style={{ flex: slowGoYears || 1, background: "#f5f3ff", border: "1px solid #c4b5fd",
                borderRadius: 6, padding: "6px 10px", textAlign: "center" }}>
                <div style={{ fontWeight: 700, color: C.slowGo }}>Slow</div>
                <div style={{ color: C.navy, fontFamily: FONT_MONO, fontSize: 11 }}>{fmtCompact(slowGoSpending)}</div>
              </div>
            )}
            {noGoSpending > 0 && (
              <div style={{ flex: noGoYears || 1, background: "#ecfeff", border: "1px solid #67e8f9",
                borderRadius: 6, padding: "6px 10px", textAlign: "center" }}>
                <div style={{ fontWeight: 700, color: C.noGo }}>No-Go</div>
                <div style={{ color: C.navy, fontFamily: FONT_MONO, fontSize: 11 }}>{fmtCompact(noGoSpending)}</div>
              </div>
            )}
          </div>

          {/* RSA spending rows */}
          {[
            { label: "Go-Go (active years)",    val: goGoSpending,   color: C.goGo },
            { label: "Slow-Go (winding down)",  val: slowGoSpending, color: C.slowGo },
            { label: "No-Go (quiet years)",     val: noGoSpending,   color: C.noGo },
          ].filter(r => r.val > 0).map(r => (
            <div key={r.label} style={{ display: "flex", justifyContent: "space-between",
              alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 15, color: C.slate }}>{r.label}</span>
              <span style={{ fontSize: 15, fontWeight: 700, fontFamily: FONT_MONO, color: r.color }}>
                {fmtFull(r.val)}/yr
              </span>
            </div>
          ))}

          <div style={{ display: "flex", justifyContent: "space-between",
            alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
            <span style={{ fontSize: 15, color: C.slate }}>Portfolio at end</span>
            <span style={{ fontSize: 15, fontWeight: 700, fontFamily: FONT_MONO, color: C.navy }}>
              {fmtFull(rsaEndBalance)}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between",
            alignItems: "center", padding: "10px 0" }}>
            <span style={{ fontSize: 15, color: C.slate }}>Lifetime total spent</span>
            <span style={{ fontSize: 17, fontWeight: 800, fontFamily: FONT_MONO, color: C.green }}>
              {fmtCompact(cmp?.rsaLifetimeSpending || 0)}
            </span>
          </div>
        </div>

        {/* 4% Rule Panel */}
        <div style={{ background: C.cardBg, border: `1px solid ${C.border}`,
          borderRadius: 14, padding: "22px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: C.navy }}>4% Rule</span>
            <span style={{ fontSize: 11, background: "#f1f5f9", color: C.gray,
              padding: "2px 10px", borderRadius: 100, fontWeight: 700 }}>Static</span>
          </div>

          {/* Flat bar */}
          <div style={{ background: "#f8fafc", border: `1px solid ${C.border}`,
            borderRadius: 6, padding: "10px 14px", marginBottom: 18, textAlign: "center",
            fontSize: 13, color: C.gray }}>
            Starts at {fmtFull(fourPctTotal)}/yr, adjusting for inflation
          </div>

          {/* 4% Rule spending rows */}
          {[
            { label: `Year 1`,                        val: cmp?.fourPctYearlySpending?.[0] || fourPctTotal },
            { label: `Year ${Math.round(retirementYears / 2)}`, val: cmp?.fourPctYearlySpending?.[Math.round(retirementYears / 2) - 1] || fourPctTotal },
            { label: `Year ${retirementYears}`,       val: cmp?.fourPctYearlySpending?.[retirementYears - 1] || fourPctTotal },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between",
              alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 15, color: C.slate }}>{r.label}</span>
              <span style={{ fontSize: 15, fontWeight: 700, fontFamily: FONT_MONO, color: C.gray }}>
                {fmtFull(r.val)}/yr
              </span>
            </div>
          ))}

          <div style={{ display: "flex", justifyContent: "space-between",
            alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
            <span style={{ fontSize: 15, color: C.slate }}>Portfolio at end</span>
            <span style={{ fontSize: 15, fontWeight: 700, fontFamily: FONT_MONO, color: C.navy }}>
              {fmtFull(fourPctEndBal)}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between",
            alignItems: "center", padding: "10px 0" }}>
            <span style={{ fontSize: 15, color: C.slate }}>Lifetime total spent</span>
            <span style={{ fontSize: 17, fontWeight: 800, fontFamily: FONT_MONO, color: C.gray }}>
              {fmtCompact(cmp?.fourPctLifetimeSpending || 0)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Lifetime spending callout ── */}
      {lifetimeDiff !== 0 && (
        <div style={{ background: lifetimeDiff > 0 ? "#f0f8f4" : "#fef2f2",
          border: `1px solid ${lifetimeDiff > 0 ? "#a7f3d0" : "#fecaca"}`,
          borderRadius: 12, padding: "16px 24px", marginBottom: 20, textAlign: "center" }}>
          <span style={{ fontSize: 16, fontWeight: 700,
            color: lifetimeDiff > 0 ? "#065f46" : C.red }}>
            RSA gives you {fmtCompact(Math.abs(lifetimeDiff))} {lifetimeDiff > 0 ? "MORE" : "LESS"} in total lifetime spending
          </span>
          <span style={{ fontSize: 14, color: C.gray, marginLeft: 10 }}>
            ({fmtCompact(cmp?.rsaLifetimeSpending || 0)} vs {fmtCompact(cmp?.fourPctLifetimeSpending || 0)})
          </span>
        </div>
      )}

      {/* ── Portfolio Trajectory chart ── */}
      {cmp?.fourPctBalances && cmp?.rsaBalances && (
        <div style={{ background: C.cardBg, border: `1px solid ${C.border}`,
          borderRadius: 12, padding: "24px 28px", marginBottom: 20 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: C.navy, marginBottom: 4 }}>
            Portfolio Trajectory
          </div>
          <div style={{ display: "flex", gap: 20, marginBottom: 12, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13 }}>
              <span style={{ display: "inline-block", width: 24, height: 3,
                background: C.green, marginRight: 6, verticalAlign: "middle" }} />
              RSA (phase-based)
            </span>
            <span style={{ fontSize: 13 }}>
              <span style={{ display: "inline-block", width: 24, height: 2,
                background: C.goGo, borderTop: `2px dashed ${C.goGo}`,
                marginRight: 6, verticalAlign: "middle" }} />
              4% rule (flat)
            </span>
          </div>
          <svg viewBox="0 0 580 250" style={{ width: "100%", height: 250 }}>
            {(() => {
              const n      = cmp.fourPctBalances.length;
              const LEFT   = 80;
              const RIGHT  = 560;
              const TOP    = 14;
              const BOTTOM = 205;
              const W      = RIGHT - LEFT;
              const H      = BOTTOM - TOP;

              // Cap Y-axis at starting balance to keep RSA line readable
              const startBal   = Math.max(cmp.rsaBalances[0] || 0, cmp.fourPctBalances[0] || 0);
              const rawMax     = Math.max(...cmp.fourPctBalances, ...cmp.rsaBalances, 1);
              const maxBal     = rawMax > startBal * 1.5 ? startBal * 1.5 : rawMax;
              const isClipped  = rawMax > maxBal;
              const clamp      = b => Math.min(b, maxBal);

              const toX = i => LEFT + (i / Math.max(n - 1, 1)) * W;
              const toY = b => BOTTOM - (clamp(b) / maxBal) * H;

              const rsaPoints     = cmp.rsaBalances.map((b, i)     => `${toX(i)},${toY(b)}`).join(" ");
              const fourPctPoints = cmp.fourPctBalances.map((b, i) => `${toX(i)},${toY(b)}`).join(" ");

              // Y gridlines
              const steps = [0, 0.25, 0.5, 0.75, 1.0];

              // Age labels every 5 years
              const ageLabels = [];
              for (let i = 0; i < n; i++) {
                const age = retirementAge + i;
                if (age === retirementAge || age % 5 === 0) ageLabels.push({ i, age });
              }

              return (
                <>
                  {steps.map(pct => {
                    const y = BOTTOM - pct * H;
                    return (
                      <g key={pct}>
                        <line x1={LEFT} y1={y} x2={RIGHT} y2={y}
                          stroke={C.border} strokeWidth={1} opacity={0.8} />
                        <text x={LEFT - 4} y={y + 4} fontSize="10"
                          fill={C.gray} textAnchor="end" fontFamily="monospace">
                          {fmtCompact(pct * maxBal)}
                        </text>
                      </g>
                    );
                  })}

                  <polyline points={fourPctPoints} fill="none" stroke={C.goGo}
                    strokeWidth={2} strokeDasharray="6,3" opacity={0.9} />
                  <polyline points={rsaPoints} fill="none" stroke={C.green} strokeWidth={2.5} />

                  {isClipped && (
                    <text x={RIGHT} y={26} fontSize="10" fill={C.goGo}
                      textAnchor="end" fontStyle="italic">
                      ↑ 4% Rule grows beyond this line
                    </text>
                  )}

                  {/* X axis */}
                  <line x1={LEFT} y1={BOTTOM} x2={RIGHT} y2={BOTTOM}
                    stroke={C.border} strokeWidth={1} />
                  {ageLabels.map(({ i, age }) => (
                    <g key={age}>
                      <line x1={toX(i)} y1={BOTTOM} x2={toX(i)} y2={BOTTOM + 4}
                        stroke={C.ltGray} strokeWidth={1} />
                      <text x={toX(i)} y={BOTTOM + 15} fontSize="11"
                        fill={C.gray} textAnchor="middle">{age}</text>
                    </g>
                  ))}
                  <text x={LEFT + W / 2} y={BOTTOM + 28} fontSize="11"
                    fill={C.ltGray} textAnchor="middle">Age</text>
                </>
              );
            })()}
          </svg>
          <div style={{ fontSize: 13, color: C.gray, marginTop: 8, lineHeight: 1.6 }}>
            Both use identical year-by-year market returns including any crash/boom years you entered.
            RSA depletes because it intentionally spends more now.
            A growing 4% Rule portfolio means money left unspent during your active years.
          </div>
        </div>
      )}



      {/* ── The Bottom Line ── */}
      {cmp && goGoSpending > 0 && (
        <div style={{
          background: "#f0f8f4", border: "1px solid #a7f3d0",
          borderRadius: 12, padding: "22px 28px", marginBottom: 8,
        }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 10 }}>
            The Bottom Line
          </div>
          <div style={{ fontSize: 15, color: C.slate, lineHeight: 1.85 }}>
            With your inputs, the RSA lets you spend{" "}
            <strong style={{ color: "#2d6a4f" }}>{fmtFull(Math.abs(advantage))} {advantage >= 0 ? "more" : "less"} per year</strong>{" "}
            in your active Go-Go years — when you actually want the money — while naturally
            tapering as your lifestyle slows down.{" "}
            {fourPctEndBal > 0 && (
              <>
                The 4% rule leaves{" "}
                <strong style={{ color: C.navy }}>{fmtCompact(fourPctEndBal)}</strong> on the
                table at the end because it never adapts.{" "}
              </>
            )}
            Over {retirementYears} years, the RSA puts{" "}
            <strong style={{ color: "#2d6a4f" }}>
              {fmtCompact(Math.abs(lifetimeDiff))} {lifetimeDiff >= 0 ? "more" : "less"} total spending
            </strong>{" "}
            in your pocket. And that is before you factor in tax optimization, RMD handling,
            crash scenario modeling, and per-account withdrawal sequencing — none of which
            the 4% rule even attempts.
          </div>
        </div>
      )}

      <div style={{ textAlign: "center", padding: "12px 0", fontSize: 13, color: C.ltGray }}>
        The 4% Rule withdraws 4% of your portfolio at retirement, adjusted for inflation each year.
        RSA optimizes spending across phases for maximum early-retirement enjoyment.
      </div>

    </div>
  );
}
