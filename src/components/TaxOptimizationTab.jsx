/**
 * TaxOptimizationTab.jsx — Tax Optimization Pro
 * ===============================================
 * Phase 5 Pro feature. Shows:
 *   - How This Works instructions (collapsible)
 *   - Summary banner with savings number (or "already optimized" message)
 *   - Five sub-sections: Roth, Bracket Filling, Sequencing, Year-by-Year, Diagnosis
 */

import { useState, useEffect, useRef } from 'react';
import { useAuth } from "@clerk/react";
import { useSubscription } from '../context/SubscriptionContext';
import { C, FONT_BODY, FONT_MONO, fmtCompact, fmtFull } from '../utils/theme';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const fmt = (n) => n >= 1000000 ? '$' + (n/1000000).toFixed(2) + 'M' : n >= 1000 ? '$' + (n/1000).toFixed(0) + 'K' : '$' + n;

export default function TaxOptimizationTab({ inputs }) {
  const { getToken } = useAuth();
  const { isPro, isTrialing } = useSubscription();
  const [data, setData]             = useState(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);
  const [activeSection, setSection]   = useState('instructions');
  const [howOpen, setHowOpen]         = useState(true);
  const [inputsAtRun, setInputsAtRun] = useState(null);
  const [rmdGuideOpen, setRmdGuideOpen] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    if (!inputs.currentAge || !inputs.accounts?.length) return;
    hasFetched.current = true;
    fetchOptimization();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchOptimization = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...inputs,
          marketReturns:      inputs.marketReturns      || {},
          spendingOverrides:  inputs.spendingOverrides  || {},
          portfolioOverrides: inputs.portfolioOverrides || {},
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Server error' }));
        throw new Error(err.error || `Error ${res.status}`);
      }
      setData(await res.json());
      setInputsAtRun(JSON.stringify(inputs));
      setSection('summary');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isPro && !isTrialing) return <UpgradePrompt />;

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px 0', color: C.gray }}>
      <div style={{ fontSize: 28, color: C.accent, marginBottom: 12 }}>◆</div>
      <div style={{ fontSize: 17 }}>Running tax optimization engines...</div>
      <div style={{ fontSize: 15, marginTop: 8, color: C.ltGray }}>Analyzing bracket opportunities and Roth conversion windows</div>
    </div>
  );

  if (error) return (
    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '16px 20px', color: '#991b1b', fontSize: 16 }}>
      <strong>Optimizer Error:</strong> {error}
      <button onClick={() => { hasFetched.current = false; fetchOptimization(); }}
        style={{ marginLeft: 12, padding: '4px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14 }}>
        Retry
      </button>
    </div>
  );

  const { summary, rothConversions, bracketFilling, sequencingInsights, yearlyComparison, taxAnalysis } = data || {};
  const isAlreadyOptimized = data && summary.totalSavings === 0;

  // Calculate cumulative taxes for comparison chart
  let cumulativeCurrent = 0;
  let cumulativeOptimized = 0;
  const cumulativeComparison = (yearlyComparison || []).map(row => {
    cumulativeCurrent += (row.currentTax || 0);
    cumulativeOptimized += (row.optimizedTax || 0);
    return {
      year: row.year,
      age: row.age,
      cumulativeCurrent,
      cumulativeOptimized,
    };
  });
  const maxTax = Math.max(...cumulativeComparison.map(r => Math.max(r.cumulativeCurrent, r.cumulativeOptimized)), 1000);

  // ── Derive a plain-English reason why savings = $0 ──────────────────────
  const getZeroReason = () => {
    if (!taxAnalysis || taxAnalysis.length === 0) return null;
    const windowRows = taxAnalysis.filter(r => r.isInConversionWindow);
    const lastWindowRow = windowRows[windowRows.length - 1];
    const preTaxGoneByEndOfWindow = lastWindowRow && lastWindowRow.preTaxBalance < 5000;
    const alwaysAtPeakBracket = windowRows.every(r => r.currentBracketRate >= 0.24);
    const noPretax = taxAnalysis.every(r => r.preTaxBalance < 5000);

    if (noPretax) return {
      title: 'No Pre-tax balance to convert',
      body: 'Roth conversions and bracket filling only apply to Traditional 401(k) and Traditional IRA balances. Your accounts are already in Roth or Taxable accounts — no conversion action is needed.',
      positive: true,
    };
    if (preTaxGoneByEndOfWindow && alwaysAtPeakBracket) return {
      title: 'Pre-tax balance depletes during retirement at your peak bracket',
      body: `Your spending plan withdraws your entire Pre-tax balance by age ${lastWindowRow.age} at the ${windowRows[0].currentBracketLabel} bracket. A Roth conversion would cost the same ${windowRows[0].currentBracketLabel} rate — so there is no tax saving from converting. Your withdrawal sequence is already efficient.`,
      tip: 'If you want to shift more into Roth for estate planning or flexibility reasons, you can still convert — just know it will not reduce your lifetime tax bill at your current income level.',
      positive: true,
    };
    if (preTaxGoneByEndOfWindow) return {
      title: 'Pre-tax balance depletes before RMDs begin',
      body: `Your current spending plan withdraws your entire Pre-tax balance by age ${lastWindowRow.age}, before your RMD start age of ${summary.rmdStartAge}. This means RMDs will not create unexpected taxable income later — which is exactly the goal a Roth conversion ladder is designed to achieve.`,
      tip: 'Your spending plan is accomplishing the same outcome as a Roth conversion ladder — no forced RMDs. The difference: conversions move money to Roth (tax-free growth) rather than spending it. If leaving a tax-free inheritance matters to you, targeted Roth conversions are still worth considering even with $0 net tax savings.',
      positive: true,
    };
    if (alwaysAtPeakBracket) return {
      title: 'Income is at your peak bracket throughout retirement',
      body: `Your income places you in the ${windowRows[0].currentBracketLabel} bracket throughout retirement. Since Roth conversions would also cost ${windowRows[0].currentBracketLabel}, there is no rate arbitrage available — converting does not reduce your lifetime tax bill.`,
      tip: 'This can change if your income drops in later years. Check the Tax Diagnosis tab to see if any low-income years appear after your Pre-tax balance depletes.',
      positive: false,
    };
    return {
      title: 'No optimization opportunities found with current inputs',
      body: 'Based on your current account balances, retirement age, and return assumptions, the optimizer did not find Roth conversions or bracket-filling strategies that would reduce your lifetime taxes. This can change if your inputs change.',
      tip: 'Try adjusting your retirement age, account balances, or return assumptions — different scenarios may reveal opportunities.',
      positive: false,
    };
  };

  const zeroReason = isAlreadyOptimized ? getZeroReason() : null;

  const sBtn = (id, label) => (
    <button onClick={() => setSection(id)} style={{
      padding: '8px 16px', border: 'none', borderRadius: 8,
      background: activeSection === id ? C.accent : 'transparent',
      color: activeSection === id ? '#fff' : C.gray,
      fontWeight: activeSection === id ? 700 : 500,
      fontSize: 15, cursor: 'pointer', fontFamily: FONT_BODY, transition: 'all 0.15s',
    }}>{label}</button>
  );

  return (
    <div>
      {/* ── HOW THIS WORKS (collapsible) ── */}
      <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 16, overflow: 'hidden' }}>
        <button onClick={() => setHowOpen(o => !o)}
          style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '14px 20px', background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: FONT_BODY, textAlign: 'left' }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: C.navy }}>📖 How Tax Optimization Pro Works</span>
          <span style={{ fontSize: 12, color: C.gray, transition: 'transform 0.2s', display: 'inline-block',
            transform: howOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
        </button>
        {howOpen && (
          <div style={{ padding: '0 20px 20px', borderTop: `1px solid ${C.border}` }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 16 }}>
              {[
                {
                  icon: '◆',
                  color: '#10b981',
                  title: 'Engine A — Bracket Filling',
                  body: 'Federal tax brackets are "use it or lose it." If your taxable income sits below the top of your current bracket, you have room to pull additional Pre-tax money this year at that same rate. Doing so shrinks the Pre-tax balance, which reduces the size of future Required Minimum Distributions — potentially keeping you in a lower bracket later in retirement.',
                  example: 'Example: You are in the 22% bracket with $40,000 of room. Withdrawing $30,000 more from your 401(k) this year costs $6,600 in tax now — but avoids that same $30,000 becoming a forced RMD at 24% or higher later.',
                },
                {
                  icon: '⟳',
                  color: '#1d4ed8',
                  title: 'Engine B — Roth Conversion Ladder',
                  body: 'The window between your retirement date and the year RMDs begin is your best opportunity to convert Traditional 401(k)/IRA money into a Roth account. You pay tax on the converted amount now — but at your current (often lower) rate. The converted balance then grows tax-free forever, generates no RMDs, and is never taxed again.',
                  example: 'Example: You retire at 62 and RMDs begin at 73. That is an 11-year window where your income may be lower than your RMD years. Converting $50,000/year at 22% avoids that same money being withdrawn at 32% later.',
                },
                {
                  icon: '⇄',
                  color: '#d97706',
                  title: 'Engine C — Dynamic Sequencing',
                  body: 'The standard withdrawal order (Taxable → Roth → Pre-tax) is a good default, but not always optimal. This engine flags specific years where a different order saves money — for example, pulling from Roth when you are near an IRMAA Medicare surcharge threshold, or pulling from Pre-tax when you happen to be in a temporarily low bracket.',
                  example: 'Example: One year your income is unusually low because of reduced Social Security. That year, pulling from Pre-tax instead of Roth is cheaper — you pay 12% instead of saving Roth for later when rates might be higher.',
                },
              ].map(e => (
                <div key={e.title} style={{ background: '#f8fafc', borderRadius: 10, padding: 16, border: `1px solid ${C.border}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: `${e.color}20`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, color: e.color, fontWeight: 700 }}>{e.icon}</div>
                    <span style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>{e.title}</span>
                  </div>
                  <p style={{ fontSize: 15, color: C.gray, lineHeight: 1.75, marginBottom: 12 }}>{e.body}</p>
                  <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, background: '#fff',
                    borderRadius: 6, padding: '8px 10px', border: `1px solid ${C.border}`,
                    fontStyle: 'italic' }}>{e.example}</p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 14, padding: '10px 14px', background: '#fffbeb',
              borderRadius: 8, border: '1px solid #fde68a', fontSize: 14, color: '#92400e' }}>
              <strong>Important:</strong> These are planning estimates, not guarantees. Tax law changes over time.
              The savings numbers shown are illustrative of the potential benefit. Always validate
              recommendations with a qualified tax advisor before making changes to your withdrawal strategy.
            </div>
          </div>
        )}
      </div>
      {/* ── Only show tabs and content if data loaded ── */}
      {data && (
        <>
          {/* ── STALE WARNING ── */}
      {inputsAtRun && inputsAtRun !== JSON.stringify(inputs) && (
        <div style={{
          background: '#fffbeb', border: '1px solid #fde68a',
          borderRadius: 10, padding: '10px 16px', marginBottom: 12,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: 15, color: '#92400e' }}>
            ⚠ Your inputs have changed since this analysis was run — results may be outdated.
          </span>
          <button onClick={() => { hasFetched.current = false; fetchOptimization(); }}
            style={{ padding: '5px 14px', background: '#d97706', color: '#fff',
              border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 700,
              cursor: 'pointer', fontFamily: FONT_BODY, marginLeft: 12, whiteSpace: 'nowrap' }}>
            Re-run Now
          </button>
        </div>
      )}

      {/* ── TAB BAR ── */}
          <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12,
            padding: '12px 16px', marginBottom: 16, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {sBtn('summary',   '⊕ Summary')}
            {sBtn('roth',      '◆ Roth Conversions')}
            {sBtn('bracket',   '▣ Bracket Filling')}
            {sBtn('sequence',  '⇄ Sequencing')}
            {sBtn('compare',   '≡ Year-by-Year')}
            {sBtn('diagnosis', '⊙ Tax Diagnosis')}
          </div>

          {/* ── SUMMARY ── */}
          {activeSection === 'summary' && (
            <div style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0f172a 100%)',
              borderRadius: 16, padding: '28px 36px', color: '#fff', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: -40, right: -40, width: 250, height: 250,
                background: `radial-gradient(circle,rgba(${isAlreadyOptimized ? '16,185,129' : '16,185,129'},0.12) 0%,transparent 70%)`,
                pointerEvents: 'none' }} />

              <div style={{ fontSize: 13, color: '#64748b', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>
                Tax Optimization Pro — Results
              </div>

              {isAlreadyOptimized && zeroReason ? (
                /* ── ALREADY OPTIMIZED MESSAGE ── */
                (<div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                    <div style={{ fontSize: 48, lineHeight: 1 }}>
                      {zeroReason.positive ? '✓' : 'ℹ'}
                    </div>
                    <div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: zeroReason.positive ? '#10b981' : '#f8fafc', marginBottom: 6 }}>
                        {zeroReason.title}
                      </div>
                      <div style={{ fontSize: 17, color: '#94a3b8', lineHeight: 1.75, maxWidth: 680 }}>
                        {zeroReason.body}
                      </div>
                    </div>
                  </div>
                  {zeroReason.tip && (
                        <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
                          borderRadius: 10, padding: '14px 18px', marginTop: 12, maxWidth: 680 }}>
                          <div style={{ fontSize: 14, color: '#6ee7b7', fontWeight: 700, marginBottom: 4 }}>
                            💡 Worth knowing
                          </div>
                          <div style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.75 }}>
                            {zeroReason.tip}
                          </div>
                        </div>
                      )}
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 20 }}>
                    {[
                      { label: 'Peak Bracket',        val: summary.peakBracket },
                      { label: 'RMD Start Age',       val: `Age ${summary.rmdStartAge}` },
                      { label: 'Conversion Window',   val: `${summary.conversionWindowYears} years` },
                      { label: 'Roth Opps Found',     val: `${summary.rothConversionYears}` },
                      { label: 'Bracket Fill Opps',   val: `${summary.bracketFillingYears}` },
                    ].map(s => (
                      <div key={s.label} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 10,
                        padding: '12px 18px', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase',
                          letterSpacing: '0.08em', marginBottom: 4 }}>{s.label}</div>
                        <div style={{ fontSize: 16, fontWeight: 700, fontFamily: FONT_MONO, color: '#f8fafc' }}>{s.val}</div>
                      </div>
                    ))}
                  </div>
                </div>)
              ) : (
                /* ── SAVINGS FOUND MESSAGE ── */
                (<div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: 8, flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontSize: 48, fontWeight: 800, fontFamily: FONT_MONO, color: '#10b981', lineHeight: 1 }}>
                        {fmt(summary.totalSavings)}
                      </div>
                      <div style={{ fontSize: 14, color: '#94a3b8', marginTop: 4 }}>
                        estimated lifetime federal tax savings
                      </div>
                    </div>
                    <div style={{ fontSize: 28, color: '#475569', marginBottom: 4 }}>≈</div>
                    <div>
                      <div style={{ fontSize: 24, fontWeight: 700, fontFamily: FONT_MONO, color: '#f8fafc' }}>
                        {summary.savingsPct}% less
                      </div>
                      <div style={{ fontSize: 14, color: '#94a3b8', marginTop: 4 }}>
                        than your unoptimized plan
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 20 }}>
                    {[
                      { label: 'Roth Conv. Years',    val: `${summary.rothConversionYears} years` },
                      { label: 'Total Roth Converted',val: fmt(summary.totalRothConverted) },
                      { label: 'Bracket Fill Years',  val: `${summary.bracketFillingYears} years` },
                      { label: 'Peak Bracket',        val: summary.peakBracket },
                      { label: 'Conversion Window',   val: `${summary.conversionWindowYears} years` },
                    ].map(s => (
                      <div key={s.label} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 10,
                        padding: '12px 18px', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase',
                          letterSpacing: '0.08em', marginBottom: 4 }}>{s.label}</div>
                        <div style={{ fontSize: 16, fontWeight: 700, fontFamily: FONT_MONO, color: '#f8fafc' }}>{s.val}</div>
                      </div>
                    ))}
                  </div>
                </div>)
              )}

              <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(245,158,11,0.08)',
                borderRadius: 8, border: '1px solid rgba(245,158,11,0.15)', display: 'inline-block' }}>
                <span style={{ fontSize: 14, color: '#fbbf24' }}>
                  ⚠ Planning estimates only. Consult a qualified tax advisor before changing your withdrawal strategy.
                </span>
              </div>
            </div>
          )}

          {/* ── ROTH CONVERSIONS ── */}
          {activeSection === 'roth' && (
            isTrialing ? (
              <LockedOverlay
                title="Roth Conversion Ladder"
                desc="Unlock your custom year-by-year Roth conversion plan. Learn exactly how much to convert each year to grow your wealth tax-free and avoid forced RMDs."
              />
            ) : (
              <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, background: '#f0fdf4' }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: C.navy }}>Roth Conversion Ladder</div>
                  <div style={{ fontSize: 15, color: C.gray, marginTop: 8, lineHeight: 1.75, maxWidth: 700 }}>
                    Your custom year-by-year Roth conversion plan based on your spending phase parameters.
                    <br />
                    <strong>Convert Amount</strong> = pre-tax amount to convert to Roth.
                    <strong> Tax Cost Now</strong> = estimated tax on the conversion.
                    <strong> Marginal Rate</strong> = tax bracket for the conversion.
                    <strong> Recommendation</strong> = rationale for the conversion.
                  </div>
                </div>
                {rothConversions.length > 0 ? (
                  <div style={{ overflowY: 'auto', maxHeight: '50vh' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc' }}>
                          {['Year', 'Age', 'Convert Amount', 'Tax Cost Now', 'Marginal Rate', 'Recommendation'].map(h => (
                            <th key={h} style={thS}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {rothConversions.map((r, i) => (
                          <tr key={r.year} style={{ background: i % 2 === 0 ? '#fff' : '#f0fdf4' }}>
                            <td style={tdS}>{r.year}</td>
                            <td style={tdS}>{r.age}</td>
                            <td style={{ ...tdS, fontFamily: FONT_MONO, fontWeight: 700, color: '#10b981' }}>{fmtFull(r.conversionAmount)}</td>
                            <td style={{ ...tdS, fontFamily: FONT_MONO, color: '#ef4444' }}>{fmtFull(r.taxCost)}</td>
                            <td style={{ ...tdS, fontFamily: FONT_MONO }}>{(r.marginalRate * 100).toFixed(0)}%</td>
                            <td style={{ ...tdS, fontSize: 11, color: C.gray }}>{r.rationale}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <EmptyState
                    title="No Roth conversion opportunities found"
                    reasons={[
                      'Your Pre-tax balance depletes naturally during the conversion window through your spending plan',
                      'Your income is already at or above the target conversion bracket (22%) — converting would not reduce your rate',
                      'Your Pre-tax balance is already low or $0',
                    ]}
                  />
                )}

                {/* Educational circumvention panel */}
                <div style={{ marginTop: 24, background: '#fefaf0', border: '1px solid #fde8c4', borderRadius: 10, padding: 20 }}>
                  <div 
                    onClick={() => setRmdGuideOpen(!rmdGuideOpen)}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}
                  >
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#b8860b', display: 'flex', alignItems: 'center', gap: 8 }}>
                      💡 How to Defuse the RMD Tax Bomb (Action Guide)
                    </div>
                    <span style={{ fontSize: 18, color: '#b8860b', fontWeight: 'bold' }}>{rmdGuideOpen ? '−' : '+'}</span>
                  </div>

                  {rmdGuideOpen && (
                    <div style={{ marginTop: 16, borderTop: '1px solid #fde8c4', paddingTop: 16 }}>
                      <div style={{ fontSize: 14.5, color: C.slate, lineHeight: 1.6, marginBottom: 16 }}>
                        When you have large pre-tax balances (like <strong>Scenario B's $1.8M Traditional 401(k)</strong>), forced Required Minimum Distributions (RMDs) starting at age 73 or 75 can push your income into much higher tax brackets (up to 35% for single filers). Here are the key actions to circumvent this:
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
                        <div style={{ background: '#fff', borderRadius: 8, padding: 14, border: '1px solid #f3ebd7' }}>
                          <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 4 }}>1. Targeted Roth Conversions in "Gap Years"</div>
                          <div style={{ fontSize: 13.5, color: C.slate, lineHeight: 1.5 }}>
                            Move assets from Traditional accounts to a Roth IRA during low-income "gap years" (between retirement and age 73/75). You pay tax now at lower rates (e.g. 10% or 12%), drawing down the pre-tax balance early so future RMDs are small and safe.
                          </div>
                        </div>

                        <div style={{ background: '#fff', borderRadius: 8, padding: 14, border: '1px solid #f3ebd7' }}>
                          <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 4 }}>2. Delay Social Security Claiming</div>
                          <div style={{ fontSize: 13.5, color: C.slate, lineHeight: 1.5 }}>
                            Delaying Social Security to age 70 increases your benefit by 8% per year and keeps your taxable income very low in your early 60s. This creates a wider, cleaner "gap window" to perform larger, low-tax Roth conversions.
                          </div>
                        </div>

                        <div style={{ background: '#fff', borderRadius: 8, padding: 14, border: '1px solid #f3ebd7' }}>
                          <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 4 }}>3. Qualified Charitable Distributions (QCDs)</div>
                          <div style={{ fontSize: 13.5, color: C.slate, lineHeight: 1.5 }}>
                            If you are charitably inclined, once you reach age 70½, you can direct up to $105,000/year of your RMD directly from your Traditional IRA to charity. The amount counts toward your RMD but is excluded from your taxable income.
                          </div>
                        </div>

                        <div style={{ background: '#fff', borderRadius: 8, padding: 14, border: '1px solid #f3ebd7' }}>
                          <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 4 }}>4. Qualified Longevity Annuity Contracts (QLACs)</div>
                          <div style={{ fontSize: 13.5, color: C.slate, lineHeight: 1.5 }}>
                            Invest up to $200,000 of your pre-tax IRA into a QLAC. The amount invested is excluded from your RMD calculations, and payouts can be deferred until age 85, giving your traditional assets an extra 10 years of tax-free deferral.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          )}

          {/* ── BRACKET FILLING ── */}
          {activeSection === 'bracket' && (
            isTrialing ? (
              <LockedOverlay
                title="Bracket Filling Strategy"
                desc="Unlock your bracket filling opportunities. See exactly how much Traditional IRA/401(k) money to pull forward each year at your lowest tax rates."
              />
            ) : (
              <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, background: '#eff6ff' }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: C.navy }}>Bracket Filling</div>
                  <div style={{ fontSize: 15, color: C.gray, marginTop: 8, lineHeight: 1.75, maxWidth: 700 }}>
                    <strong>What this shows:</strong> Years where your taxable income is below the ceiling of your
                    current bracket — meaning you could pull more from Pre-tax at the same rate.
                    The "Room Available" column shows how much more you could withdraw before hitting
                    the next bracket. The "Suggested Extra" is 80% of that room — a conservative recommendation
                    that leaves a buffer for unexpected income.
                  </div>
                </div>
                {bracketFilling.length > 0 ? (
                  <div style={{ overflowY: 'auto', maxHeight: '50vh' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc' }}>
                          {['Year', 'Age', 'Bracket', 'Room Available', 'Suggested Extra', 'Tax Cost', 'Notes'].map(h => (
                            <th key={h} style={thS}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {bracketFilling.map((b, i) => (
                          <tr key={b.year} style={{ background: i % 2 === 0 ? '#fff' : '#eff6ff' }}>
                            <td style={tdS}>{b.year}</td>
                            <td style={tdS}>{b.age}</td>
                            <td style={{ ...tdS, fontFamily: FONT_MONO }}>{b.currentBracket}</td>
                            <td style={{ ...tdS, fontFamily: FONT_MONO, color: C.accent }}>{fmtFull(b.bracketRoom)}</td>
                            <td style={{ ...tdS, fontFamily: FONT_MONO, fontWeight: 700, color: '#1d4ed8' }}>{fmtFull(b.additionalWithdrawal)}</td>
                            <td style={{ ...tdS, fontFamily: FONT_MONO, color: '#ef4444' }}>{fmtFull(b.taxCost)}</td>
                            <td style={{ ...tdS, fontSize: 11, color: C.gray }}>{b.rationale}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <EmptyState
                    title="No bracket filling opportunities found"
                    reasons={[
                      'Your income is near or above the current bracket ceiling in most years',
                      'Your Pre-tax balance reaches $0 during the withdrawal window — no balance remains to fill with',
                      'Pulling more Pre-tax would push you into the next higher bracket, costing more not less',
                    ]}
                  />
                )}
              </div>
            )
          )}

          {/* ── DYNAMIC SEQUENCING ── */}
          {activeSection === 'sequence' && (
            isTrialing ? (
              <LockedOverlay
                title="Dynamic Withdrawal Sequencing"
                desc="Unlock sequencing optimizations. Get specific alerts for when to deviate from the standard withdrawal order to stay below IRMAA thresholds and optimize tax rates."
              />
            ) : (
              <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: C.navy }}>Dynamic Withdrawal Sequencing</div>
                  <div style={{ fontSize: 15, color: C.gray, marginTop: 8, lineHeight: 1.75, maxWidth: 700 }}>
                    <strong>What this shows:</strong> Specific years where changing the standard withdrawal order
                    (Taxable → Roth → Pre-tax) could reduce taxes. Common triggers include being near an
                    IRMAA Medicare surcharge threshold, having an unusually low-income year, or approaching
                    RMD start age with a large Pre-tax balance.
                  </div>
                </div>
                {sequencingInsights.length > 0 ? (
                  <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {sequencingInsights.map(s => (
                      <div key={s.year} style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '14px 18px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <span style={{ fontWeight: 700, color: C.navy, fontSize: 16 }}>Age {s.age} ({s.year})</span>
                          {s.recommendedSequence && (
                            <span style={{ fontSize: 13, background: '#fef3c7', color: '#92400e',
                              padding: '2px 10px', borderRadius: 100, fontWeight: 600 }}>
                              {s.recommendedSequence}
                            </span>
                          )}
                        </div>
                        {s.insights.map((ins, i) => (
                          <div key={i} style={{ fontSize: 15, color: '#78350f', lineHeight: 1.75,
                            marginBottom: i < s.insights.length - 1 ? 6 : 0 }}>
                            • {ins}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No sequencing adjustments needed"
                    reasons={[
                      'Your income does not approach IRMAA Medicare surcharge thresholds',
                      'No unusually low-income years were identified where Pre-tax withdrawals would be cheaper',
                      'Your standard withdrawal sequence appears near-optimal for your income profile',
                    ]}
                  />
                )}
              </div>
            )
          )}

          {/* ── YEAR-BY-YEAR COMPARISON ── */}
          {activeSection === 'compare' && (
            isTrialing ? (
              <LockedOverlay
                title="Year-by-Year Comparison"
                desc="Unlock the cumulative tax trajectory chart and detailed year-by-year comparison table showing exactly when and where you save on taxes."
              />
            ) : (
              <div>
                {/* ── SVG Chart ── */}
                <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12, padding: "24px 28px", marginBottom: 20 }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: C.navy, marginBottom: 4 }}>
                    Cumulative Tax Trajectory
                  </div>
                  <div style={{ fontSize: 14, color: C.gray, marginBottom: 12, lineHeight: 1.6 }}>
                    Visualize how early Roth conversions cost more tax up front, but result in much lower lifetime taxes later in retirement.
                  </div>
                  <div style={{ display: "flex", gap: 20, marginBottom: 12, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13 }}>
                      <span style={{ display: "inline-block", width: 24, height: 2,
                        background: '#ef4444', borderTop: `2px dashed #ef4444`, marginRight: 6, verticalAlign: "middle" }} />
                      Current Plan (Unoptimized)
                    </span>
                    <span style={{ fontSize: 13 }}>
                      <span style={{ display: "inline-block", width: 24, height: 3,
                        background: '#10b981', marginRight: 6, verticalAlign: "middle" }} />
                      Optimized Plan (Pro Strategy)
                    </span>
                  </div>
                  <svg viewBox="0 0 580 250" style={{ width: "100%", height: 250 }}>
                    {(() => {
                      const LEFT   = 80;
                      const RIGHT  = 560;
                      const TOP    = 14;
                      const BOTTOM = 205;
                      const W      = RIGHT - LEFT;
                      const H      = BOTTOM - TOP;
                      const n      = cumulativeComparison.length;
                      
                      const retirementAge = cumulativeComparison[0]?.age || 65;

                      const toX = i => LEFT + (i / Math.max(n - 1, 1)) * W;
                      const toY = b => BOTTOM - (b / maxTax) * H;

                      const currentPoints   = cumulativeComparison.map((r, i) => `${toX(i)},${toY(r.cumulativeCurrent)}`).join(" ");
                      const optimizedPoints = cumulativeComparison.map((r, i) => `${toX(i)},${toY(r.cumulativeOptimized)}`).join(" ");

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
                                  {fmtCompact(pct * maxTax)}
                                </text>
                              </g>
                            );
                          })}

                          <polyline points={currentPoints} fill="none" stroke="#ef4444"
                            strokeWidth={2} strokeDasharray="6,3" opacity={0.9} />
                          <polyline points={optimizedPoints} fill="none" stroke="#10b981" strokeWidth={2.5} />

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
                </div>

                {/* ── Details Table ── */}
                <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
                  <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: 17, fontWeight: 700, color: C.navy }}>Year-by-Year Tax Comparison</div>
                    <div style={{ fontSize: 15, color: C.gray, marginTop: 8, lineHeight: 1.75 }}>
                      <strong>Current Tax</strong> = what you pay under your existing plan.{' '}
                      <strong>Optimized Tax</strong> = estimated tax after applying recommendations.{' '}
                      <strong>Savings</strong> = the net benefit in that year. Rows highlighted green have identified savings.
                      <br />
                      <em>Note: Roth conversions cost more tax now but save more later — the "Savings" column shows the net lifetime benefit allocated to each year.</em>
                    </div>
                  </div>
                  <div style={{ overflowY: 'auto', maxHeight: '55vh' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#f8fafc' }}>
                          {['Year', 'Age', 'Bracket', 'Current Tax', 'Optimized Tax', 'Savings', 'Roth Convert', 'Bracket Fill'].map(h => (
                            <th key={h} style={thS}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {yearlyComparison.map((row, i) => (
                          <tr key={row.year} style={{ background: row.savings > 0 ? '#f0fdf4' : i % 2 === 0 ? '#fff' : '#fafbfc' }}>
                            <td style={{ ...tdS, fontWeight: 600, color: C.navy }}>{row.year}</td>
                            <td style={tdS}>{row.age}</td>
                            <td style={{ ...tdS, fontFamily: FONT_MONO }}>{row.currentBracket}</td>
                            <td style={{ ...tdS, fontFamily: FONT_MONO, color: '#ef4444' }}>{fmtCompact(row.currentTax)}</td>
                            <td style={{ ...tdS, fontFamily: FONT_MONO, color: '#10b981', fontWeight: row.savings > 0 ? 700 : 400 }}>{fmtCompact(row.optimizedTax)}</td>
                            <td style={{ ...tdS, fontFamily: FONT_MONO, fontWeight: 700, color: row.savings > 0 ? '#10b981' : C.ltGray }}>
                              {row.savings > 0 ? `+${fmtCompact(row.savings)}` : '—'}
                            </td>
                            <td style={{ ...tdS, fontFamily: FONT_MONO, color: C.accent }}>
                              {row.rothConversion > 0 ? fmtCompact(row.rothConversion) : '—'}
                            </td>
                            <td style={{ ...tdS, fontFamily: FONT_MONO, color: '#1d4ed8' }}>
                              {row.bracketFill > 0 ? fmtCompact(row.bracketFill) : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr style={{ background: '#f1f5f9', borderTop: `2px solid ${C.border}` }}>
                          <td style={{ ...tdS, fontWeight: 700, color: C.navy }} colSpan={3}>Totals</td>
                          <td style={{ ...tdS, fontFamily: FONT_MONO, fontWeight: 700, color: '#ef4444' }}>
                            {fmtCompact(yearlyComparison.reduce((s, r) => s + r.currentTax, 0))}
                          </td>
                          <td style={{ ...tdS, fontFamily: FONT_MONO, fontWeight: 700, color: '#10b981' }}>
                            {fmtCompact(yearlyComparison.reduce((s, r) => s + r.optimizedTax, 0))}
                          </td>
                          <td style={{ ...tdS, fontFamily: FONT_MONO, fontWeight: 800, color: '#10b981' }}>
                            {(() => { const s = yearlyComparison.reduce((a, r) => a + r.savings, 0); return s > 0 ? `+${fmtCompact(s)}` : '—'; })()}
                          </td>
                          <td style={tdS} colSpan={2} />
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            )
          )}

          {/* ── TAX DIAGNOSIS ── */}
          {activeSection === 'diagnosis' && (
            <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 17, fontWeight: 700, color: C.navy }}>Tax Diagnosis</div>
                <div style={{ fontSize: 15, color: C.gray, marginTop: 8, lineHeight: 1.75, maxWidth: 700 }}>
                  Your tax picture year by year under your current plan — before any optimization.
                  <strong> Bracket Room</strong> = how much more income you could have before crossing into the next bracket.
                  <strong> In Window?</strong> = YES if you are before your RMD start age — the window where conversions are most valuable.
                  Green rows are in the conversion window.
                </div>
              </div>
              <div style={{ overflowY: 'auto', maxHeight: '55vh' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
					  {['Year', 'Age', 'Bracket', 'Gross Income', 'Taxable Income', 'Bracket Room', 'Pre-tax Bal', 'Roth Bal', 'Eff Rate', 'In Window?'].map(h => (
                        <th key={h} style={thS}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {taxAnalysis.map((row, i) => (
                      <tr key={row.year} style={{ background: row.isInConversionWindow ? '#f0fdf4' : i % 2 === 0 ? '#fff' : '#fafbfc' }}>
                        <td style={{ ...tdS, fontWeight: 600, color: C.navy }}>{row.year}</td>
                        <td style={tdS}>{row.age}</td>
                        <td style={{ ...tdS, fontFamily: FONT_MONO, fontWeight: 700 }}>{row.currentBracketLabel}</td>
                        <td style={{ ...tdS, fontFamily: FONT_MONO, color: '#64748b' }}>{fmtCompact(row.grossIncome || 0)}</td>
                        <td style={{ ...tdS, fontFamily: FONT_MONO }}>{fmtCompact(row.taxableIncome)}</td>
                        <td style={{ ...tdS, fontFamily: FONT_MONO, color: row.bracketRoom > 10000 ? '#10b981' : C.ltGray }}>
                          {row.bracketRoom > 0 ? fmtCompact(row.bracketRoom) : '—'}
                        </td>
                        <td style={{ ...tdS, fontFamily: FONT_MONO }}>{fmtCompact(row.preTaxBalance)}</td>
                        <td style={{ ...tdS, fontFamily: FONT_MONO }}>{fmtCompact(row.rothBalance)}</td>
                        <td style={{ ...tdS, fontFamily: FONT_MONO }}>{(row.effectiveRate * 100).toFixed(1)}%</td>
                        <td style={{ ...tdS }}>
                          {row.isInConversionWindow
                            ? <span style={{ fontSize: 12, background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>YES</span>
                            : <span style={{ fontSize: 12, color: C.ltGray }}>—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Re-run button */}
          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <button onClick={() => { hasFetched.current = false; fetchOptimization(); }}
              style={{ padding: '8px 18px', background: C.cardBg, border: `1px solid ${C.border}`,
                borderRadius: 8, color: C.gray, fontSize: 14, fontWeight: 600,
                cursor: 'pointer', fontFamily: FONT_BODY }}>
              ↺ Re-run with current inputs
            </button>
          </div>
        </>
      )}
    </div>
  );
}


// ── Empty state component ─────────────────────────────────────────────────────
function EmptyState({ title, reasons }) {
  return (
    <div style={{ padding: '28px 24px' }}>
      <div style={{ fontSize: 17, fontWeight: 700, color: C.navy, marginBottom: 12 }}>{title}</div>
      <div style={{ fontSize: 15, color: C.gray, marginBottom: 12 }}>This can happen for several reasons:</div>
      <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {reasons.map((r, i) => (
          <li key={i} style={{ fontSize: 15, color: C.gray, lineHeight: 1.75 }}>{r}</li>
        ))}
      </ul>
      <div style={{ marginTop: 14, padding: '10px 14px', background: '#f8fafc',
        borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 15, color: '#64748b' }}>
        💡 Try adjusting your retirement age or account balances in Settings — different inputs
        may reveal optimization opportunities.
      </div>
    </div>
  );
}


// ── Upgrade prompt ────────────────────────────────────────────────────────────
function UpgradePrompt() {
  return (
    <div style={{ textAlign: 'center', padding: '60px 40px', maxWidth: 520, margin: '0 auto' }}>
      <div style={{ fontSize: 36, color: '#1d4ed8', marginBottom: 16 }}>🔒</div>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: C.navy, marginBottom: 12, fontFamily: "'DM Sans', sans-serif" }}>
        Tax Optimization Pro
      </h2>
      <p style={{ fontSize: 17, color: C.gray, lineHeight: 1.75, marginBottom: 28 }}>
        Available on the <strong>Pro Annual</strong> plan. Unlock Roth conversion ladders,
        bracket filling, and dynamic withdrawal sequencing — with a personalized
        estimate of your lifetime federal tax savings.
      </p>
      <a href="/pricing" style={{ display: 'inline-block', background: '#1d4ed8', color: '#fff',
        padding: '12px 28px', borderRadius: 10, textDecoration: 'none',
        fontSize: 17, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>
        Upgrade to Pro →
      </a>
    </div>
  );
}


// ── Locked paywall overlay ───────────────────────────────────────────────────
function LockedOverlay({ title, desc }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      border: '1px solid #334155',
      borderRadius: 16,
      padding: '44px 36px',
      color: '#fff',
      textAlign: 'center',
      maxWidth: 580,
      margin: '32px auto',
      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3), 0 8px 10px -6px rgba(0,0,0,0.3)',
    }}>
      <div style={{ fontSize: 44, marginBottom: 18, filter: 'drop-shadow(0 2px 8px rgba(245,158,11,0.2))' }}>🔒</div>
      <h3 style={{ fontSize: 21, fontWeight: 800, color: '#f8fafc', marginBottom: 14, fontFamily: "'DM Sans', sans-serif" }}>
        {title} is a Pro Feature
      </h3>
      <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.7, marginBottom: 28, maxWidth: 440, margin: '0 auto 28px' }}>
        {desc}
      </p>
      <a href="/pricing" style={{
        display: 'inline-block',
        background: '#2d6a4f',
        color: '#fff',
        padding: '11px 26px',
        borderRadius: 8,
        textDecoration: 'none',
        fontSize: 15,
        fontWeight: 700,
        fontFamily: "'DM Sans', sans-serif",
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.15)',
        transition: 'background 0.2s',
      }}>
        Upgrade to Pro & Unlock →
      </a>
    </div>
  );
}


// ── Shared styles ─────────────────────────────────────────────────────────────
const tdS = {
  padding: '9px 14px', fontSize: 14,
  borderBottom: '1px solid #f1f5f9',
  color: '#374151', whiteSpace: 'nowrap',
};
const thS = {
  padding: '10px 14px', fontSize: 11,
  color: '#6b7280', fontWeight: 700,
  textTransform: 'uppercase', letterSpacing: '0.04em',
  textAlign: 'left', borderBottom: '2px solid #e2e8f0',
  whiteSpace: 'nowrap', background: '#f8fafc',
  position: 'sticky', top: 0,
};
