/**
 * TaxOptimizationTab.jsx — Tax Optimization Pro
 * ===============================================
 * Phase 5 Pro feature. Shows:
 *   - How This Works instructions (collapsible)
 *   - Summary banner with savings number (or "already optimized" message)
 *   - Five sub-sections: Roth, Bracket Filling, Sequencing, Year-by-Year, Diagnosis
 */

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';
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
  const [activeSection, setSection] = useState('instructions');
  const [howOpen, setHowOpen]       = useState(true);
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
      <div style={{ fontSize: 14 }}>Running tax optimization engines...</div>
      <div style={{ fontSize: 12, marginTop: 6, color: C.ltGray }}>Analyzing bracket opportunities and Roth conversion windows</div>
    </div>
  );

  if (error) return (
    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '16px 20px', color: '#991b1b', fontSize: 13 }}>
      <strong>Optimizer Error:</strong> {error}
      <button onClick={() => { hasFetched.current = false; fetchOptimization(); }}
        style={{ marginLeft: 12, padding: '4px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
        Retry
      </button>
    </div>
  );

  const { summary, rothConversions, bracketFilling, sequencingInsights, yearlyComparison, taxAnalysis } = data || {};
  const isAlreadyOptimized = data && summary.totalSavings === 0;

  // ── Derive a plain-English reason why savings = $0 ──────────────────────
  const getZeroReason = () => {
    if (!taxAnalysis || taxAnalysis.length === 0) return null;
    const windowRows = taxAnalysis.filter(r => r.isInConversionWindow);
    const preTaxGoneEarly = windowRows.length > 0 &&
      windowRows[windowRows.length - 1].preTaxBalance < 5000;
    const alwaysAtPeakBracket = windowRows.every(r => r.currentBracketRate >= 0.24);
    const noPretax = taxAnalysis.every(r => r.preTaxBalance < 5000);

    if (noPretax) return {
      title: 'No Pre-tax balance to convert',
      body: 'Roth conversions and bracket filling only apply to Traditional 401(k)/IRA balances. Your accounts are already in Roth or Taxable — no conversion is needed.',
      positive: true,
    };
    if (preTaxGoneEarly && alwaysAtPeakBracket) return {
      title: 'Your RSA plan is already doing the work',
      body: `Your spending plan naturally depletes your entire Pre-tax balance by age ${windowRows[windowRows.length - 1].age} — during the conversion window and at the ${windowRows[0].currentBracketLabel} bracket. A Roth conversion would cost the same rate. The RSA's structured withdrawals are already the optimization.`,
      positive: true,
    };
    if (preTaxGoneEarly) return {
      title: 'Pre-tax balance fully depleted during conversion window',
      body: `Your Pre-tax accounts reach $0 by age ${windowRows[windowRows.length - 1].age}, before RMDs begin. There is no remaining balance that would generate forced RMD income, so no conversion ladder is needed.`,
      positive: true,
    };
    if (alwaysAtPeakBracket) return {
      title: 'Already at peak bracket throughout retirement',
      body: `Your income places you in the ${windowRows[0].currentBracketLabel} bracket throughout retirement. Converting to Roth would cost the same rate as your current withdrawals — no net tax saving is available.`,
      positive: false,
    };
    return {
      title: 'No optimization opportunities identified',
      body: 'Based on your current inputs, your withdrawal plan does not benefit materially from Roth conversions, bracket filling, or sequencing changes. Revisit if your account balances or retirement age change.',
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
      fontSize: 13, cursor: 'pointer', fontFamily: FONT_BODY, transition: 'all 0.15s',
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
          <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>📖 How Tax Optimization Pro Works</span>
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
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{e.title}</span>
                  </div>
                  <p style={{ fontSize: 12, color: C.gray, lineHeight: 1.7, marginBottom: 10 }}>{e.body}</p>
                  <p style={{ fontSize: 11, color: '#64748b', lineHeight: 1.6, background: '#fff',
                    borderRadius: 6, padding: '8px 10px', border: `1px solid ${C.border}`,
                    fontStyle: 'italic' }}>{e.example}</p>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 14, padding: '10px 14px', background: '#fffbeb',
              borderRadius: 8, border: '1px solid #fde68a', fontSize: 12, color: '#92400e' }}>
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

              <div style={{ fontSize: 11, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>
                Tax Optimization Pro — Results
              </div>

              {isAlreadyOptimized && zeroReason ? (
                /* ── ALREADY OPTIMIZED MESSAGE ── */
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                    <div style={{ fontSize: 48, lineHeight: 1 }}>
                      {zeroReason.positive ? '✓' : 'ℹ'}
                    </div>
                    <div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: zeroReason.positive ? '#10b981' : '#f8fafc', marginBottom: 6 }}>
                        {zeroReason.title}
                      </div>
                      <div style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.7, maxWidth: 680 }}>
                        {zeroReason.body}
                      </div>
                    </div>
                  </div>

                  {zeroReason.positive && (
                    <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
                      borderRadius: 10, padding: '14px 18px', marginTop: 8, maxWidth: 680 }}>
                      <div style={{ fontSize: 13, color: '#6ee7b7', fontWeight: 600, marginBottom: 4 }}>
                        What this means for you
                      </div>
                      <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>
                        Your RSA spending plan is already structured in a tax-efficient way. The three-phase
                        withdrawal strategy is naturally depleting your Pre-tax accounts during retirement —
                        the same outcome a Roth conversion ladder would target. You can still review the
                        Roth Conversions and Bracket Filling tabs to see what was checked, and the
                        Tax Diagnosis tab to see your full year-by-year tax picture.
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
                        <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase',
                          letterSpacing: '0.08em', marginBottom: 4 }}>{s.label}</div>
                        <div style={{ fontSize: 16, fontWeight: 700, fontFamily: FONT_MONO, color: '#f8fafc' }}>{s.val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* ── SAVINGS FOUND MESSAGE ── */
                <div>
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
                        <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase',
                          letterSpacing: '0.08em', marginBottom: 4 }}>{s.label}</div>
                        <div style={{ fontSize: 16, fontWeight: 700, fontFamily: FONT_MONO, color: '#f8fafc' }}>{s.val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(245,158,11,0.08)',
                borderRadius: 8, border: '1px solid rgba(245,158,11,0.15)', display: 'inline-block' }}>
                <span style={{ fontSize: 12, color: '#fbbf24' }}>
                  ⚠ Planning estimates only. Consult a qualified tax advisor before changing your withdrawal strategy.
                </span>
              </div>
            </div>
          )}

          {/* ── ROTH CONVERSIONS ── */}
          {activeSection === 'roth' && (
            <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, background: '#f0fdf4' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Roth Conversion Ladder</div>
                <div style={{ fontSize: 12, color: C.gray, marginTop: 4, lineHeight: 1.6, maxWidth: 700 }}>
                  Your tax picture year by year — using the <strong>exact same numbers as the Spending Phases tab</strong>.
                  <br />
                  <strong>How your bracket is calculated:</strong> Pre-tax withdrawals + 85% of Social Security
                  = Gross income. Minus the standard deduction (plus senior bonus at 65+) = Taxable income.
                  That taxable income determines your bracket.
                  <br />
                  <strong>Bracket Room</strong> = how much more taxable income before crossing into the next bracket.
                  <strong> In Window?</strong> = YES if before your RMD start age — where Roth conversions are most valuable.
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
            </div>
          )}

          {/* ── BRACKET FILLING ── */}
          {activeSection === 'bracket' && (
            <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, background: '#eff6ff' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Bracket Filling</div>
                <div style={{ fontSize: 12, color: C.gray, marginTop: 4, lineHeight: 1.6, maxWidth: 700 }}>
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
          )}

          {/* ── DYNAMIC SEQUENCING ── */}
          {activeSection === 'sequence' && (
            <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Dynamic Withdrawal Sequencing</div>
                <div style={{ fontSize: 12, color: C.gray, marginTop: 4, lineHeight: 1.6, maxWidth: 700 }}>
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
                        <span style={{ fontWeight: 700, color: C.navy, fontSize: 13 }}>Age {s.age} ({s.year})</span>
                        {s.recommendedSequence && (
                          <span style={{ fontSize: 11, background: '#fef3c7', color: '#92400e',
                            padding: '2px 10px', borderRadius: 100, fontWeight: 600 }}>
                            {s.recommendedSequence}
                          </span>
                        )}
                      </div>
                      {s.insights.map((ins, i) => (
                        <div key={i} style={{ fontSize: 13, color: '#78350f', lineHeight: 1.6,
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
          )}

          {/* ── YEAR-BY-YEAR COMPARISON ── */}
          {activeSection === 'compare' && (
            <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Year-by-Year Tax Comparison</div>
                <div style={{ fontSize: 12, color: C.gray, marginTop: 4, lineHeight: 1.6 }}>
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
          )}

          {/* ── TAX DIAGNOSIS ── */}
          {activeSection === 'diagnosis' && (
            <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Tax Diagnosis</div>
                <div style={{ fontSize: 12, color: C.gray, marginTop: 4, lineHeight: 1.6, maxWidth: 700 }}>
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
                            ? <span style={{ fontSize: 10, background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: 4, fontWeight: 700 }}>YES</span>
                            : <span style={{ fontSize: 10, color: C.ltGray }}>—</span>}
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
                borderRadius: 8, color: C.gray, fontSize: 12, fontWeight: 600,
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
      <div style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 10 }}>{title}</div>
      <div style={{ fontSize: 12, color: C.gray, marginBottom: 10 }}>This can happen for several reasons:</div>
      <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {reasons.map((r, i) => (
          <li key={i} style={{ fontSize: 12, color: C.gray, lineHeight: 1.6 }}>{r}</li>
        ))}
      </ul>
      <div style={{ marginTop: 14, padding: '10px 14px', background: '#f8fafc',
        borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 12, color: '#64748b' }}>
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
      <h2 style={{ fontSize: 22, fontWeight: 800, color: C.navy, marginBottom: 12, fontFamily: "'DM Sans', sans-serif" }}>
        Tax Optimization Pro
      </h2>
      <p style={{ fontSize: 14, color: C.gray, lineHeight: 1.7, marginBottom: 24 }}>
        Available on the <strong>Pro Annual</strong> plan. Unlock Roth conversion ladders,
        bracket filling, and dynamic withdrawal sequencing — with a personalized
        estimate of your lifetime federal tax savings.
      </p>
      <a href="/pricing" style={{ display: 'inline-block', background: '#1d4ed8', color: '#fff',
        padding: '12px 28px', borderRadius: 10, textDecoration: 'none',
        fontSize: 14, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>
        Upgrade to Pro →
      </a>
    </div>
  );
}


// ── Shared styles ─────────────────────────────────────────────────────────────
const tdS = {
  padding: '7px 12px', fontSize: 12,
  borderBottom: '1px solid #f1f5f9',
  color: '#475569', whiteSpace: 'nowrap',
};
const thS = {
  padding: '8px 12px', fontSize: 9,
  color: '#94a3b8', fontWeight: 700,
  textTransform: 'uppercase', letterSpacing: '0.04em',
  textAlign: 'left', borderBottom: '2px solid #e2e8f0',
  whiteSpace: 'nowrap', background: '#f8fafc',
  position: 'sticky', top: 0,
};
