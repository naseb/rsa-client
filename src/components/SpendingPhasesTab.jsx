/**
 * SpendingPhasesTab.jsx — Spending Phases & Projection
 * ======================================================
 * The main results tab. Shows:
 * - Go-Go spending banner with phase breakdowns
 * - Phase controls (start ages, spending %, smooth transitions)
 * - Spending & Portfolio charts
 * - Year-by-year projection table with expandable detail rows
 *
 * This component receives solver results from the API (via props)
 * and renders them. It contains NO solver logic.
 */

import { useState, Fragment } from "react";
import NumericInput from "./NumericInput";
import LoadingOverlay from "./LoadingOverlay";
import {
  C, FONT_BODY, FONT_MONO,
  fmtCompact, fmtFull, ssClaimingMultiplier, rmdStartAge,
  PHASE_COLORS, PHASE_BG_COLORS,
} from "../utils/theme";

export default function SpendingPhasesTab({
  inputs, setField, solverData, loading, error,
  marketReturns, setMarketReturns,
  spendingOverrides, setSpendingOverrides,
  portfolioOverrides, setPortfolioOverrides,
}) {
  const [expandedRows, setExpandedRows] = useState({});
  const [expandedWds, setExpandedWds] = useState({});

  const {
    currentAge, retirementAge, lifeExpectancy,
    ss67, ssStartAge, phases, transitionYears, smoothTransition,
    defaultReturn, targetEndBalance, accounts,
  } = inputs;

  // If no solver data yet, show loading
  if (!solverData && !error) {
    return (
      <div>
        <LoadingOverlay loading={true} />
        <div style={{ textAlign: "center", padding: 40, color: C.gray, fontSize: 14 }}>
          Waiting for solver results...
        </div>
      </div>
    );
  }

  if (error) {
    return <LoadingOverlay loading={false} error={error} />;
  }

  const le = solverData;
  const retiredYears = le.years.filter((y) => y.isRetired);
  const maxBalance = Math.max(...le.years.map((y) => y.totalEnd), targetEndBalance);
  const maxSpend = retiredYears.length > 0
    ? Math.max(...retiredYears.map((y) => y.annualSpending), le.baseSpending * 1.2)
    : le.baseSpending * 1.2;
  const ssMult = ssClaimingMultiplier(ssStartAge);
  const ssMonthly = Math.round(ss67 * ssMult);
  const rmdAge = rmdStartAge(currentAge);
  const numReturnOverrides = Object.keys(marketReturns).length;
  const numSpendingOverrides = Object.keys(spendingOverrides).length;

  // Find the most recent checkpoint that applies to a given year.
  // Returns the checkpoint year, or null if no checkpoint applies yet.
  const getActiveCheckpoint = (year) => {
    const cps = (le.checkpointYears || []).filter(cp => cp <= year);
    return cps.length > 0 ? Math.max(...cps) : null;
  };

  // Get the spending level for a year's active segment.
  // Returns: 'down' (spending reduced), 'up' (spending restored/increased), or null (no checkpoint)
  const getSegmentDirection = (year) => {
    const cp = getActiveCheckpoint(year);
    if (cp == null) return null;
    const segmentSpending = le.spendingSegments?.[cp];
    if (segmentSpending == null) return null;
    return segmentSpending < le.baseSpending * 0.999 ? 'down' : 'up';
  };

  const updatePhase = (idx, key, val) => {
    const newPhases = phases.map((p, i) => (i === idx ? { ...p, [key]: val } : p));
    setField("phases", newPhases);
  };

  const tdStyle = {
    padding: "8px 10px", textAlign: "right", fontFamily: FONT_MONO,
    fontSize: 13, borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap",
  };

  return (
    <div>
      <LoadingOverlay loading={loading} error={null} />

      {/* ===== RESULTS BANNER ===== */}
      <div style={{ background: "linear-gradient(135deg, #1c3829 0%, #2d5a47 40%, #1c3829 100%)", borderRadius: 16, padding: "28px 36px", marginBottom: 20, color: "#fff", position: "relative", overflow: "hidden", borderBottom: "2px solid #b8860b" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 250, height: 250, background: "radial-gradient(circle,rgba(184,134,11,0.15) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ fontSize: 11, color: "rgba(247,243,234,0.5)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>Go-Go Phase Base Spending</div>
        <div style={{ fontSize: 48, fontWeight: 800, fontFamily: FONT_MONO, color: C.goGo, lineHeight: 1, marginBottom: 2 }}>
          {fmtFull(le.baseSpending)}<span style={{ fontSize: 18, color: "#64748b", fontWeight: 400, marginLeft: 8 }}>/year</span>
        </div>
        <div style={{ fontSize: 16, color: "rgba(247,243,234,0.65)", marginBottom: 20 }}>
          {fmtFull(Math.floor(le.baseSpending / 12))} / month in your active years
        </div>

        {/* Phase summary cards */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {phases.map((ph, idx) => {
            const spending = Math.round(le.baseSpending * ph.pct / 100);
            const endAge = phases[idx + 1] ? phases[idx + 1].startAge - 1 : lifeExpectancy;
            return (
              <div key={idx} style={{ background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: "14px 20px", border: "1px solid rgba(255,255,255,0.08)", minWidth: 160 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: C[ph.color] }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: C[ph.color] }}>{ph.name}</span>
                  <span style={{ fontSize: 10, color: "rgba(247,243,234,0.4)" }}>Ages {idx === 0 ? retirementAge : ph.startAge}–{endAge}</span>
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, fontFamily: FONT_MONO }}>{fmtFull(spending)}<span style={{ fontSize: 11, color: "rgba(247,243,234,0.4)" }}>/yr</span></div>
                <div style={{ fontSize: 11, color: "rgba(247,243,234,0.5)" }}>{fmtFull(Math.floor(spending / 12))}/mo · {ph.pct}% of base</div>
              </div>
            );
          })}
          {/* End balance card */}
          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: "14px 20px", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: 10, color: "rgba(247,243,234,0.45)", textTransform: "uppercase", marginBottom: 4 }}>Portfolio at {lifeExpectancy}</div>
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: FONT_MONO }}>{fmtCompact(le.finalBalance)}</div>
            <div style={{ fontSize: 11, color: "rgba(247,243,234,0.5)" }}>Target: {fmtCompact(targetEndBalance)}</div>
          </div>
          {/* SS card */}
          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: "14px 20px", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: 10, color: "rgba(247,243,234,0.45)", textTransform: "uppercase", marginBottom: 4 }}>Social Security</div>
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: FONT_MONO }}>{fmtFull(ssMonthly)}<span style={{ fontSize: 11, color: "#64748b" }}>/mo</span></div>
            <div style={{ fontSize: 11, color: "rgba(247,243,234,0.5)" }}>Claiming age {ssStartAge}{ssStartAge !== 67 ? ` (${Math.round((ssMult - 1) * 100)}%)` : ""}</div>
          </div>
        </div>

        {/* Reset spending alert */}
        {le.resetSpending != null && (
          <div style={{ marginTop: 16, padding: "14px 20px", background: "rgba(239,68,68,0.1)", borderRadius: 12, border: "1px solid rgba(239,68,68,0.2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 16 }}>⚡</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#fca5a5" }}>
                {le.checkpointYears?.length > 1 ? `Spending Adjusted at ${le.checkpointYears.length} Checkpoints` : `Spending Adjusted from Age ${le.effectiveResetAge}`}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ===== PHASE CONTROLS ===== */}
      <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 24px", marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Spending Phases</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <label style={{ fontSize: 12, color: C.gray, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
              <input type="checkbox" checked={smoothTransition} onChange={(e) => setField("smoothTransition", e.target.checked)} style={{ accentColor: C.accent }} />
              Smooth transitions
            </label>
            {smoothTransition && (
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 11, color: C.gray }}>over</span>
                <input type="number" value={transitionYears} min={1} max={10}
                  onChange={(e) => { const v = parseInt(e.target.value); if (!isNaN(v) && v >= 1 && v <= 10) setField("transitionYears", v); }}
                  style={{ width: 40, textAlign: "center", fontFamily: FONT_MONO, fontSize: 12, padding: "4px", border: `1px solid ${C.border}`, borderRadius: 6 }}
                />
                <span style={{ fontSize: 11, color: C.gray }}>years</span>
              </div>
            )}
          </div>
        </div>

        {/* Phase bar */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", borderRadius: 10, overflow: "hidden", height: 48, border: `1px solid ${C.border}` }}>
            {phases.map((ph, idx) => {
              const start = idx === 0 ? retirementAge : ph.startAge;
              const end = phases[idx + 1] ? phases[idx + 1].startAge : lifeExpectancy + 1;
              const total = lifeExpectancy - retirementAge + 1;
              const pct = ((end - start) / total) * 100;
              return (
                <div key={idx} style={{ width: `${pct}%`, background: PHASE_BG_COLORS[ph.name] || "#f8fafc", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", borderRight: idx < phases.length - 1 ? `2px solid ${C.border}` : "none", transition: "width 0.3s" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: PHASE_COLORS[ph.name] || C.navy }}>{ph.name}</span>
                  <span style={{ fontSize: 10, color: C.gray }}>{start}–{end - 1} · {ph.pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Phase cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {phases.map((ph, idx) => (
            <div key={idx} style={{ background: PHASE_BG_COLORS[ph.name], borderRadius: 10, padding: 16, border: `2px solid ${PHASE_COLORS[ph.name] || C.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: PHASE_COLORS[ph.name] }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>{ph.name}</span>
              </div>
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: C.gray, marginBottom: 4 }}>Starts at Age</div>
                {idx === 0 ? (
                  <div style={{ fontFamily: FONT_MONO, fontSize: 13, color: C.navy, fontWeight: 600, padding: "6px 0" }}>
                    {retirementAge} <span style={{ fontSize: 10, color: C.ltGray }}>(retirement)</span>
                  </div>
                ) : (
                  <input type="number" value={ph.startAge} min={retirementAge + 1} max={lifeExpectancy - 1}
                    onChange={(e) => { const v = parseInt(e.target.value); if (!isNaN(v)) updatePhase(idx, "startAge", v); }}
                    style={{ fontFamily: FONT_MONO, fontSize: 13, padding: "6px 10px", border: `1px solid ${C.border}`, borderRadius: 6, width: 70, background: "#fff" }}
                  />
                )}
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: C.gray }}>Spending Level</span>
                  <span style={{ fontSize: 13, fontFamily: FONT_MONO, fontWeight: 700, color: PHASE_COLORS[ph.name] }}>{ph.pct}%</span>
                </div>
                <input type="range" min={20} max={120} value={ph.pct}
                  onChange={(e) => updatePhase(idx, "pct", parseInt(e.target.value))}
                  style={{ width: "100%", accentColor: PHASE_COLORS[ph.name] }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.ltGray }}>
                  <span>20%</span><span>120%</span>
                </div>
                <div style={{ marginTop: 6, fontSize: 12, fontFamily: FONT_MONO, fontWeight: 600, color: C.navy }}>
                  {fmtFull(Math.round(le.baseSpending * ph.pct / 100))}/yr
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== CHARTS ===== */}
      <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 24px", marginBottom: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 12 }}>Spending & Portfolio Over Time</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Spending chart */}
          <div>
            <div style={{ fontSize: 11, color: C.gray, marginBottom: 6, fontWeight: 600 }}>Annual Spending by Age</div>
            <svg viewBox="0 0 440 160" style={{ width: "100%", height: 160 }}>
              {phases.map((ph, idx) => {
                const start = idx === 0 ? retirementAge : ph.startAge;
                const end = phases[idx + 1] ? phases[idx + 1].startAge : lifeExpectancy + 1;
                const total = lifeExpectancy - retirementAge + 1;
                const x = ((start - retirementAge) / total) * 420 + 10;
                const w = ((end - start) / total) * 420;
                return <rect key={idx} x={x} y={5} width={w} height={150} fill={PHASE_BG_COLORS[ph.name]} opacity={0.7} />;
              })}
              {retiredYears.length > 1 && (
                <polyline
                  points={retiredYears.map((y, i) => {
                    const x = (i / (retiredYears.length - 1)) * 420 + 10;
                    const yPos = 155 - (y.annualSpending / maxSpend) * 140;
                    return `${x},${yPos}`;
                  }).join(" ")}
                  fill="none" stroke={C.goGo} strokeWidth={2.5}
                />
              )}
              <text x={10} y={154} fontSize="8" fill={C.gray}>{retirementAge}</text>
              <text x={425} y={154} fontSize="8" fill={C.gray} textAnchor="end">{lifeExpectancy}</text>
            </svg>
          </div>
          {/* Portfolio chart */}
          <div>
            <div style={{ fontSize: 11, color: C.gray, marginBottom: 6, fontWeight: 600 }}>Portfolio Balance</div>
            <svg viewBox="0 0 440 160" style={{ width: "100%", height: 160 }}>
              {le.years.length > 1 && (
                <>
                  <polygon
                    points={le.years.map((y, i) => {
                      const x = (i / (le.years.length - 1)) * 420 + 10;
                      const yPos = 155 - (y.totalEnd / maxBalance) * 140;
                      return `${x},${yPos}`;
                    }).join(" ") + " 430,155 10,155"}
                    fill={C.accent} opacity={0.06}
                  />
                  <polyline
                    points={le.years.map((y, i) => {
                      const x = (i / (le.years.length - 1)) * 420 + 10;
                      const yPos = 155 - (y.totalEnd / maxBalance) * 140;
                      return `${x},${yPos}`;
                    }).join(" ")}
                    fill="none" stroke={C.accent} strokeWidth={2}
                  />
                  {/* Return override dots — red = crash, green = boom */}
                  {le.years.map((y, i) => {
                    if (marketReturns[y.year] == null) return null;
                    const x    = (i / (le.years.length - 1)) * 420 + 10;
                    const yPos = 155 - (y.totalEnd / maxBalance) * 140;
                    const isCrash = y.returnPct < defaultReturn;
                    return (
                      <g key={y.year}>
                        <circle
                          cx={x} cy={yPos} r={5}
                          fill={isCrash ? C.red : C.green}
                          stroke="#fff" strokeWidth={1.5}
                        />
                      </g>
                    );
                  })}
                </>
              )}
              <text x={10} y={154} fontSize="8" fill={C.gray}>{currentAge}</text>
              <text x={425} y={154} fontSize="8" fill={C.gray} textAnchor="end">{lifeExpectancy}</text>
            </svg>
          </div>
        </div>
      </div>

      {/* ===== PROJECTION TABLE ===== */}
      <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Year-by-Year Projection</div>
            <div style={{ fontSize: 11, color: C.gray, marginTop: 2 }}>Override returns to model crashes/booms. Click rows to expand.</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {numReturnOverrides > 0 && (
              <button onClick={() => { if (window.confirm("Clear all return overrides?")) setMarketReturns({}); }}
                style={{ padding: "5px 12px", border: `1px solid ${C.border}`, borderRadius: 6, background: "#fff", color: C.gray, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: FONT_BODY }}>
                Clear Returns ({numReturnOverrides})
              </button>
            )}
            {numSpendingOverrides > 0 && (
              <button onClick={() => { if (window.confirm("Clear all spending adjustments?")) setSpendingOverrides({}); }}
                style={{ padding: "5px 12px", border: `1px solid ${C.border}`, borderRadius: 6, background: "#fff", color: C.gray, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: FONT_BODY }}>
                Clear +/- ({numSpendingOverrides})
              </button>
            )}
            {Object.keys(portfolioOverrides).length > 0 && (
              <button onClick={() => { if (window.confirm("Clear all portfolio overrides?")) setPortfolioOverrides({}); }}
                style={{ padding: "5px 12px", border: `1px solid ${C.border}`, borderRadius: 6, background: "#fff", color: C.gray, fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: FONT_BODY }}>
                Clear Portfolio ({Object.keys(portfolioOverrides).length})
              </button>
            )}
          </div>
        </div>

        <div style={{ overflowY: "auto", maxHeight: "55vh" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: C.pageBg }}>
                {["Year", "Age", "Phase", "Return", "Portfolio", "Growth", "Spending", "+/-", "SS"].map((h) => (
                  <th key={h} style={{ padding: "8px 8px", textAlign: h === "Return" || h === "+/-" ? "center" : "right", fontWeight: 700, fontSize: 11, color: C.gray, borderBottom: `2px solid ${C.border}`, position: "sticky", top: 0, background: C.pageBg, zIndex: 1, textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {le.years.map((d, rowIdx) => {
                const hasReturnOverride = marketReturns[d.year] != null;
                const vsTarget = d.totalEnd - targetEndBalance;
                const isExpanded = expandedRows[d.year];
                const phColor = PHASE_COLORS[d.phaseName] || C.gray;
                const phBg = PHASE_BG_COLORS[d.phaseName] || "#fff";

                return (
                  <Fragment key={d.year}>
                    <tr
                      style={{
                        background: getSegmentDirection(d.year) === 'down' ? "#fef2f2" : getSegmentDirection(d.year) === 'up' ? "#f0fdf4" : d.age === retirementAge ? "#e8f5e9" : hasReturnOverride ? (d.returnPct < 0 ? C.redBg : d.returnPct > defaultReturn ? C.greenBg : "#fffbeb") : rowIdx % 2 === 0 ? "#fff" : C.pageBg,
                        cursor: "pointer",
                        borderLeft: getSegmentDirection(d.year) === 'down' ? `3px solid ${C.red}` : getSegmentDirection(d.year) === 'up' ? `3px solid ${C.green}` : "3px solid transparent",
                      }}
                      onClick={() => setExpandedRows((prev) => ({ ...prev, [d.year]: !prev[d.year] }))}
                    >
                      <td style={{ ...tdStyle, fontWeight: 600, color: C.navy, textAlign: "left", paddingLeft: 14 }}>
                        <span style={{ display: "inline-block", width: 12, fontSize: 7, color: C.ltGray, transition: "transform 0.2s", transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
                        {d.year}
                      </td>
                      <td style={{ ...tdStyle, textAlign: "center" }}>
                        {d.age}
                        {d.age === retirementAge && <span style={{ fontSize: 7, color: C.accent, marginLeft: 2, fontWeight: 700 }}>RET</span>}
                        {d.age === rmdAge && <span style={{ fontSize: 7, color: C.orange, marginLeft: 2, fontWeight: 700 }}>RMD</span>}
                      </td>
                      <td style={{ ...tdStyle, textAlign: "center" }}>
                        {d.isRetired ? (
                          <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 8, background: phBg, color: phColor, fontWeight: 700, fontFamily: FONT_BODY }}>{d.phaseName}</span>
                        ) : <span style={{ color: C.ltGray }}>–</span>}
                      </td>
                      {/* Return override input */}
                      <td style={{ ...tdStyle, textAlign: "center", padding: "3px 4px" }} onClick={(e) => e.stopPropagation()}>
                        <input type="number" step="0.1"
                          value={marketReturns[d.year] != null ? marketReturns[d.year] : ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setMarketReturns((prev) => {
                              const next = { ...prev };
                              if (val === "") delete next[d.year];
                              else { const n = parseFloat(val); if (!isNaN(n)) next[d.year] = n; }
                              return next;
                            });
                          }}
                          placeholder={defaultReturn.toFixed(1)}
                          style={{ width: 56, textAlign: "center", fontFamily: FONT_MONO, fontSize: 11, padding: "3px 4px", borderRadius: 5, border: `2px solid ${hasReturnOverride ? (d.returnPct < 0 ? C.red : d.returnPct > defaultReturn ? C.green : C.orange) : C.border}`, background: hasReturnOverride ? (d.returnPct < 0 ? C.redBg : d.returnPct > defaultReturn ? C.greenBg : "#fffbeb") : "#fff", fontWeight: hasReturnOverride ? 700 : 400, color: hasReturnOverride ? (d.returnPct < 0 ? C.red : "#166534") : C.gray, outline: "none" }}
                        />
                        <span style={{ fontSize: 9, color: C.gray, marginLeft: 1 }}>%</span>
                      </td>
                      {/* Portfolio (editable in retirement) */}
                      <td style={{ ...tdStyle, padding: d.isRetired ? "3px 4px" : undefined }} onClick={(e) => d.isRetired && e.stopPropagation()}>
                        {d.isRetired ? (() => {
                          const hasOverride = portfolioOverrides[d.year] != null;
                          const displayVal = hasOverride ? portfolioOverrides[d.year] : Math.round(d.totalStart);
                          return (
                            <input
                              key={`${d.year}-${displayVal}`}
                              defaultValue={fmtCompact(displayVal)}
                              onFocus={(e) => { e.target.value = String(displayVal); e.target.select(); }}
                              onBlur={(e) => {
                                const v = parseFloat(e.target.value.replace(/[,$]/g, ""));
                                if (isNaN(v) || Math.abs(v - Math.round(d.totalStart)) < 100) {
                                  setPortfolioOverrides((prev) => { const next = { ...prev }; delete next[d.year]; return next; });
                                  e.target.value = fmtCompact(Math.round(d.totalStart));
                                } else {
                                  setPortfolioOverrides((prev) => ({ ...prev, [d.year]: v }));
                                  e.target.value = fmtCompact(v);
                                }
                              }}
                              onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
                              style={{ width: 90, textAlign: "right", fontFamily: FONT_MONO, fontSize: 11, padding: "3px 4px", borderRadius: 5, border: `2px solid ${hasOverride ? "#f87171" : C.border}`, background: hasOverride ? "#fef2f2" : "transparent", fontWeight: hasOverride ? 700 : 400, color: hasOverride ? "#991b1b" : C.navy, outline: "none", cursor: "text" }}
                            />
                          );
                        })() : fmtCompact(d.totalStart)}
                      </td>
                      <td style={{ ...tdStyle, color: d.totalGrowth >= 0 ? C.green : C.red }}>{d.totalGrowth >= 0 ? "+" : ""}{fmtCompact(d.totalGrowth)}</td>
                      <td style={{ ...tdStyle, color: d.annualSpending > 0 ? C.navy : C.ltGray, fontWeight: d.annualSpending > 0 ? 600 : 400 }}>
                        {d.annualSpending > 0 ? fmtCompact(d.annualSpending) : "–"}
                        {d.isRetired && d.multiplier < 1 && <span style={{ fontSize: 8, color: phColor, marginLeft: 2 }}>{Math.round(d.multiplier * 100)}%</span>}
                        {d.spendAdj !== 0 && <span style={{ fontSize: 7, fontWeight: 700, marginLeft: 3, padding: "1px 4px", borderRadius: 4, background: d.spendAdj > 0 ? "#dcfce7" : "#fee2e2", color: d.spendAdj > 0 ? "#166534" : "#991b1b" }}>ADJ</span>}
                      </td>
                      {/* Spending override input */}
                      <td style={{ ...tdStyle, textAlign: "center", padding: "3px 4px" }} onClick={(e) => e.stopPropagation()}>
                        {d.isRetired ? (
                          <input type="number" step="1000"
                            value={spendingOverrides[d.year] != null ? spendingOverrides[d.year] : ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setSpendingOverrides((prev) => {
                                const next = { ...prev };
                                if (val === "") delete next[d.year];
                                else { const n = parseFloat(val); if (!isNaN(n)) next[d.year] = n; }
                                return next;
                              });
                            }}
                            placeholder="0"
                            style={{ width: 64, textAlign: "center", fontFamily: FONT_MONO, fontSize: 11, padding: "3px 4px", borderRadius: 5, border: `2px solid ${spendingOverrides[d.year] != null ? (spendingOverrides[d.year] > 0 ? "#16a34a" : spendingOverrides[d.year] < 0 ? C.red : C.border) : C.border}`, background: spendingOverrides[d.year] != null ? (spendingOverrides[d.year] > 0 ? "#f0fdf4" : spendingOverrides[d.year] < 0 ? C.redBg : "#fff") : "#fff", fontWeight: spendingOverrides[d.year] != null ? 700 : 400, color: spendingOverrides[d.year] != null ? (spendingOverrides[d.year] > 0 ? "#166534" : spendingOverrides[d.year] < 0 ? "#991b1b" : C.gray) : C.gray, outline: "none" }}
                          />
                        ) : <span style={{ color: C.ltGray }}>–</span>}
                      </td>
                      <td style={{ ...tdStyle, color: d.ssIncome > 0 ? "#0d9488" : C.ltGray }}>{d.ssIncome > 0 ? fmtCompact(d.ssIncome) : "–"}</td>

                    </tr>

                    {/* Expanded detail row */}
                    {isExpanded && (
                      <tr style={{ background: C.pageBg }}>
                        <td colSpan={9} style={{ padding: "12px 20px 14px 40px", borderBottom: `2px solid ${C.border}` }}>
                          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 0.8fr", gap: 20, fontSize: 12 }}>
                            {/* Account balances */}
                            <div>
                              <div style={{ fontSize: 9, color: C.gray, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6, fontWeight: 700 }}>Account Balances (End of Year)</div>
                              {accounts.map((acct, ai) => {
                                const bal = d.acctEndBals ? d.acctEndBals[ai] : 0;
                                const bgColor = acct.taxTreatment === "Pre-tax" ? C.blueBg : acct.taxTreatment === "Tax-free" ? C.greenBg : C.goGoBg;
                                const fgColor = acct.taxTreatment === "Pre-tax" ? C.accent : acct.taxTreatment === "Tax-free" ? C.green : C.goGo;
                                return (
                                  <div key={ai} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "2px 0" }}>
                                    <span style={{ fontSize: 11, color: C.navy, display: "flex", alignItems: "center", gap: 4 }}>
                                      {acct.name}
                                      <span style={{ fontSize: 7, padding: "1px 5px", borderRadius: 5, background: bgColor, color: fgColor, fontWeight: 600 }}>
                                        {acct.taxTreatment === "Pre-tax" ? "PT" : acct.taxTreatment === "Tax-free" ? "Roth" : "Tax"}
                                      </span>
                                    </span>
                                    <strong style={{ fontFamily: FONT_MONO, fontSize: 11, color: bal > 0 ? C.navy : C.ltGray }}>{fmtCompact(bal)}</strong>
                                  </div>
                                );
                              })}
                              <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 4, paddingTop: 4, display: "flex", justifyContent: "space-between" }}>
                                <span style={{ fontSize: 11, fontWeight: 700, color: C.navy }}>Total</span>
                                <strong style={{ fontFamily: FONT_MONO, fontSize: 11, color: C.accent }}>{fmtCompact(d.totalEnd)}</strong>
                              </div>
                            </div>
                            {/* Income sources */}
                            <div>
                              <div style={{ fontSize: 9, color: C.gray, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6, fontWeight: 700 }}>Income Sources</div>
                              <div style={{ lineHeight: 1.8 }}>
                                <div>Spending: <strong style={{ fontFamily: FONT_MONO, color: phColor }}>{fmtFull(d.annualSpending)}</strong> <span style={{ fontSize: 10, color: C.ltGray }}>({d.phaseName} {Math.round(d.multiplier * 100)}%)</span></div>
                                {d.spendAdj !== 0 && <div style={{ fontSize: 11, color: d.spendAdj > 0 ? "#166534" : "#991b1b" }}>↳ Adjustment: <strong style={{ fontFamily: FONT_MONO }}>{d.spendAdj > 0 ? "+" : ""}${Math.abs(d.spendAdj).toLocaleString()}</strong></div>}
                                <div>Social Security: <strong style={{ fontFamily: FONT_MONO }}>{fmtCompact(d.ssIncome)}</strong></div>
                                <div
                                  style={{ cursor: d.portfolioWd > 0 ? 'pointer' : 'default', userSelect: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
                                  onClick={(e) => { e.stopPropagation(); d.portfolioWd > 0 && setExpandedWds(prev => ({ ...prev, [d.year]: !prev[d.year] })); }}
                                >
                                  {d.portfolioWd > 0 && (
                                    <span style={{ fontSize: 7, color: C.accent, transition: 'transform 0.2s', transform: expandedWds[d.year] ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
                                  )}
                                  <span>From Portfolio: <strong style={{ fontFamily: FONT_MONO }}>{fmtCompact(d.portfolioWd)}</strong></span>
                                  {d.portfolioWd > 0 && <span style={{ fontSize: 9, color: C.ltGray }}>(detail)</span>}
                                </div>
                                {expandedWds[d.year] && d.portfolioWd > 0 && (
                                  <div style={{ marginTop: 4, marginLeft: 10, padding: '8px 10px', background: C.cardBg, borderRadius: 8, border: `1px solid ${C.border}` }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto auto', gap: '0 8px', fontSize: 9, marginBottom: 4 }}>
                                      <span style={{ color: C.gray, fontWeight: 700 }}>Account</span>
                                      <span style={{ color: C.gray, fontWeight: 700, textAlign: 'right' }}>Avail</span>
                                      <span style={{ color: C.gray, fontWeight: 700, textAlign: 'right' }}>Drawn</span>
                                      <span style={{ color: C.gray, fontWeight: 700, textAlign: 'right' }}>Left</span>
                                      <span style={{ color: C.gray, fontWeight: 700, textAlign: 'right' }}>%</span>
                                    </div>
                                    {accounts.map((acct, ai) => {
                                      const drawn = d.acctWds[ai] || 0;
                                      const avail = d.preWdBals ? d.preWdBals[ai] : 0;
                                      const left  = d.acctEndBals ? d.acctEndBals[ai] : 0;
                                      const pct   = d.portfolioWd > 0 ? drawn / d.portfolioWd * 100 : 0;
                                      if (drawn <= 0 && avail < 100) return null;
                                      const barColor = acct.taxTreatment === 'Pre-tax' ? C.accent
                                                     : acct.taxTreatment === 'Tax-free' ? C.green
                                                     : C.goGo;
                                      return (
                                        <div key={ai} style={{ marginBottom: 4 }}>
                                          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto auto', gap: '0 8px', alignItems: 'center', fontSize: 10 }}>
                                            <span style={{ color: C.navy, fontWeight: 500 }}>
                                              {acct.name}
                                              {drawn > 0 && left < 100 && (
                                                <span style={{ fontSize: 7, color: C.red, fontWeight: 700, marginLeft: 3 }}>DEPLETED</span>
                                              )}
                                            </span>
                                            <span style={{ fontFamily: FONT_MONO, color: C.gray, textAlign: 'right' }}>{fmtCompact(avail)}</span>
                                            <span style={{ fontFamily: FONT_MONO, color: drawn > 0 ? C.red : C.ltGray, textAlign: 'right' }}>{drawn > 0 ? '-' + fmtCompact(drawn) : '–'}</span>
                                            <span style={{ fontFamily: FONT_MONO, color: left > 0 ? C.navy : C.ltGray, textAlign: 'right' }}>{fmtCompact(left)}</span>
                                            <span style={{ fontFamily: FONT_MONO, color: C.ltGray, textAlign: 'right' }}>{drawn > 0 ? pct.toFixed(0) + '%' : '–'}</span>
                                          </div>
                                          {drawn > 0 && (
                                            <div style={{ height: 3, background: '#e2e8f0', borderRadius: 2, overflow: 'hidden', marginTop: 2 }}>
                                              <div style={{ height: '100%', width: pct + '%', background: barColor, borderRadius: 2 }} />
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            </div>
                            {/* Tax impact */}
                            <div>
                              <div style={{ fontSize: 9, color: C.gray, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6, fontWeight: 700 }}>Tax Impact</div>
                              <div style={{ lineHeight: 1.8 }}>
                                <div>Federal: <strong style={{ fontFamily: FONT_MONO, color: C.red }}>{fmtCompact(d.tax)}</strong></div>
                                <div>IRMAA: <strong style={{ fontFamily: FONT_MONO }}>{fmtCompact(d.irmaa)}</strong></div>
                                <div>Bracket: <strong>{d.bracket}</strong> | Eff: <strong>{(d.effectiveRate * 100).toFixed(1)}%</strong></div>
                              </div>
                            </div>
                            {/* Key numbers */}
                            <div>
                              <div style={{ fontSize: 9, color: C.gray, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6, fontWeight: 700 }}>Key Numbers</div>
                              <div style={{ lineHeight: 1.8 }}>
                                <div>RMD: <strong style={{ fontFamily: FONT_MONO }}>{d.rmd > 0 ? fmtCompact(d.rmd) : "N/A"}</strong></div>
                                {d.excessRmd > 0 && <div style={{ color: "#0d9488" }}>↳ Excess reinvested: <strong style={{ fontFamily: FONT_MONO }}>{fmtCompact(d.excessRmd)}</strong></div>}
                                <div>After-Tax: <strong style={{ fontFamily: FONT_MONO, color: C.green }}>{fmtFull(d.afterTaxSpending)}</strong></div>
                                <div>Return: <strong style={{ fontFamily: FONT_MONO, color: d.returnPct >= 0 ? C.green : C.red }}>{d.returnPct.toFixed(1)}%</strong></div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
