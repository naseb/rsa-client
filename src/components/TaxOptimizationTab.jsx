/**
 * TaxOptimizationTab.jsx — Tax Optimization Pro
 * ===============================================
 * Phase 5 Pro feature. Three layers:
 *   1. Summary banner — headline savings number
 *   2. Three engine cards — Bracket Filling, Roth Conversions, Dynamic Sequencing
 *   3. Year-by-year comparison table
 *
 * Calls POST /api/optimize when the tab is first opened.
 * Shows an upgrade prompt if the user is not on a Pro subscription.
 */

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useSubscription } from '../context/SubscriptionContext';
import { C, FONT_BODY, FONT_MONO, fmtCompact, fmtFull } from '../utils/theme';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const fmt  = (n) => n >= 1000000 ? '$' + (n/1000000).toFixed(2) + 'M' : n >= 1000 ? '$' + (n/1000).toFixed(0) + 'K' : '$' + n;
const fmtN = (n) => n >= 1000000 ? (n/1000000).toFixed(2) + 'M' : n >= 1000 ? (n/1000).toFixed(0) + 'K' : String(n);

export default function TaxOptimizationTab({ inputs }) {
  const { getToken } = useAuth();
  const { isPro, isTrialing } = useSubscription();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [activeSection, setActiveSection] = useState('roth');
  const hasFetched = useRef(false);

  // Fetch once when tab mounts (not on every input change — it's expensive)
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
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Upgrade prompt for non-Pro users ──────────────────────────────────────
  if (!isPro && !isTrialing) {
    return <UpgradePrompt />;
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0', color: C.gray }}>
        <div style={{ fontSize: 28, color: C.accent, marginBottom: 12 }}>◆</div>
        <div style={{ fontSize: 14 }}>Running tax optimization engines...</div>
        <div style={{ fontSize: 12, marginTop: 6, color: C.ltGray }}>Analyzing bracket opportunities and Roth conversion windows</div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '16px 20px', color: '#991b1b', fontSize: 13 }}>
        <strong>Optimizer Error:</strong> {error}
        <button onClick={() => { hasFetched.current = false; fetchOptimization(); }}
          style={{ marginLeft: 12, padding: '4px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  const { summary, rothConversions, bracketFilling, sequencingInsights, yearlyComparison, taxAnalysis } = data;

  const sectionBtn = (id, label) => (
    <button onClick={() => setActiveSection(id)} style={{
      padding: '8px 18px', border: 'none', borderRadius: 8,
      background: activeSection === id ? C.accent : 'transparent',
      color: activeSection === id ? '#fff' : C.gray,
      fontWeight: activeSection === id ? 700 : 500,
      fontSize: 13, cursor: 'pointer', fontFamily: FONT_BODY,
      transition: 'all 0.15s',
    }}>{label}</button>
  );

  return (
    <div>

      {/* ── SUMMARY BANNER ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0f172a 100%)',
        borderRadius: 16, padding: '28px 36px', marginBottom: 20,
        color: '#fff', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 250, height: 250,
          background: 'radial-gradient(circle,rgba(16,185,129,0.12) 0%,transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ fontSize: 11, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>
          Tax Optimization Pro
        </div>

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
              than your current unoptimized plan
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 20 }}>
          {[
            { label: 'Roth Conversions',    val: `${summary.rothConversionYears} years · ${fmt(summary.totalRothConverted)}` },
            { label: 'Bracket Fill Years',  val: `${summary.bracketFillingYears} years` },
            { label: 'Peak Bracket',        val: summary.peakBracket },
            { label: 'RMD Starts',          val: `Age ${summary.rmdStartAge}` },
            { label: 'Conversion Window',   val: `${summary.conversionWindowYears} years` },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '12px 18px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 16, fontWeight: 700, fontFamily: FONT_MONO, color: '#f8fafc' }}>{s.val}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(245,158,11,0.08)', borderRadius: 8, border: '1px solid rgba(245,158,11,0.15)', display: 'inline-block' }}>
          <span style={{ fontSize: 12, color: '#fbbf24' }}>
            ⚠ These are planning estimates. Tax law changes and individual circumstances vary.
            Validate recommendations with a qualified tax advisor.
          </span>
        </div>
      </div>

      {/* ── ENGINE SELECTOR ── */}
      <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 0 }}>
          {sectionBtn('roth',      '◆ Roth Conversion Ladder')}
          {sectionBtn('bracket',   '▣ Bracket Filling')}
          {sectionBtn('sequence',  '⇄ Dynamic Sequencing')}
          {sectionBtn('compare',   '≡ Year-by-Year')}
          {sectionBtn('diagnosis', '⊙ Tax Diagnosis')}
        </div>
      </div>

      {/* ── ENGINE B: ROTH CONVERSIONS ── */}
      {activeSection === 'roth' && (
        <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, background: '#f0fdf4' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Roth Conversion Ladder</div>
            <div style={{ fontSize: 12, color: C.gray, marginTop: 2 }}>
              Convert Pre-tax to Roth in your pre-RMD window (before age {summary.rmdStartAge}) to reduce future forced taxable income.
              {rothConversions.length === 0 && ' No conversion opportunities found with your current inputs.'}
            </div>
          </div>
          {rothConversions.length > 0 ? (
            <div style={{ overflowY: 'auto', maxHeight: '50vh' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    {['Year', 'Age', 'Convert Amount', 'Tax Cost Now', 'Marginal Rate', 'Rationale'].map(h => (
                      <th key={h} style={{ padding: '8px 12px', fontSize: 9, color: C.gray, fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'left',
                        borderBottom: `2px solid ${C.border}`, whiteSpace: 'nowrap' }}>{h}</th>
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
                      <td style={{ ...tdS, fontSize: 11, color: C.gray, maxWidth: 320 }}>{r.rationale}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: '32px 20px', textAlign: 'center', color: C.gray, fontSize: 13 }}>
              No Roth conversion opportunities found. This typically means retirement starts after RMD age,
              or Pre-tax balances are already low.
            </div>
          )}
        </div>
      )}

      {/* ── ENGINE A: BRACKET FILLING ── */}
      {activeSection === 'bracket' && (
        <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, background: '#eff6ff' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Bracket Filling</div>
            <div style={{ fontSize: 12, color: C.gray, marginTop: 2 }}>
              Years where you have unused room in your current bracket before RMDs begin.
              Pulling forward Pre-tax income now shrinks the balance that will be forced out as RMDs later.
              {bracketFilling.length === 0 && ' No bracket filling opportunities found.'}
            </div>
          </div>
          {bracketFilling.length > 0 ? (
            <div style={{ overflowY: 'auto', maxHeight: '50vh' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    {['Year', 'Age', 'Bracket', 'Room Available', 'Suggested Extra', 'Tax Cost', 'Rationale'].map(h => (
                      <th key={h} style={{ padding: '8px 12px', fontSize: 9, color: C.gray, fontWeight: 700,
                        textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'left',
                        borderBottom: `2px solid ${C.border}`, whiteSpace: 'nowrap' }}>{h}</th>
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
                      <td style={{ ...tdS, fontSize: 11, color: C.gray, maxWidth: 300 }}>{b.rationale}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: '32px 20px', textAlign: 'center', color: C.gray, fontSize: 13 }}>
              No bracket filling opportunities identified. Your income may already be near or above bracket ceilings.
            </div>
          )}
        </div>
      )}

      {/* ── ENGINE C: DYNAMIC SEQUENCING ── */}
      {activeSection === 'sequence' && (
        <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Dynamic Withdrawal Sequencing</div>
            <div style={{ fontSize: 12, color: C.gray, marginTop: 2 }}>
              Years where the standard Taxable → Roth → Pre-tax order may not be optimal.
              {sequencingInsights.length === 0 && ' Your current withdrawal sequence appears near-optimal.'}
            </div>
          </div>
          {sequencingInsights.length > 0 ? (
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {sequencingInsights.map(s => (
                <div key={s.year} style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '14px 18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontWeight: 700, color: C.navy, fontSize: 13 }}>Age {s.age} ({s.year})</span>
                    {s.recommendedSequence && (
                      <span style={{ fontSize: 11, background: '#fef3c7', color: '#92400e', padding: '2px 10px', borderRadius: 100, fontWeight: 600 }}>
                        {s.recommendedSequence}
                      </span>
                    )}
                  </div>
                  {s.insights.map((insight, i) => (
                    <div key={i} style={{ fontSize: 13, color: '#78350f', lineHeight: 1.6, marginBottom: i < s.insights.length - 1 ? 6 : 0 }}>
                      • {insight}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '32px 20px', textAlign: 'center', color: C.gray, fontSize: 13 }}>
              No sequencing issues detected. Your standard withdrawal order looks optimal given your current inputs.
            </div>
          )}
        </div>
      )}

      {/* ── YEAR-BY-YEAR COMPARISON ── */}
      {activeSection === 'compare' && (
        <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Year-by-Year Tax Comparison</div>
            <div style={{ fontSize: 12, color: C.gray, marginTop: 2 }}>Current plan vs. optimized plan — federal taxes only.</div>
          </div>
          <div style={{ overflowY: 'auto', maxHeight: '55vh' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Year', 'Age', 'Bracket', 'Current Tax', 'Optimized Tax', 'Savings', 'Roth Convert', 'Bracket Fill'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', fontSize: 9, color: C.gray, fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right',
                      borderBottom: `2px solid ${C.border}`, whiteSpace: 'nowrap',
                      ':first-child': { textAlign: 'left' } }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {yearlyComparison.map((row, i) => (
                  <tr key={row.year} style={{ background: row.savings > 0 ? '#f0fdf4' : i % 2 === 0 ? '#fff' : '#fafbfc' }}>
                    <td style={{ ...tdS, textAlign: 'left', fontWeight: 600, color: C.navy }}>{row.year}</td>
                    <td style={{ ...tdS, textAlign: 'right' }}>{row.age}</td>
                    <td style={{ ...tdS, textAlign: 'right', fontFamily: FONT_MONO }}>{row.currentBracket}</td>
                    <td style={{ ...tdS, textAlign: 'right', fontFamily: FONT_MONO, color: '#ef4444' }}>{fmtCompact(row.currentTax)}</td>
                    <td style={{ ...tdS, textAlign: 'right', fontFamily: FONT_MONO, color: '#10b981', fontWeight: row.savings > 0 ? 700 : 400 }}>{fmtCompact(row.optimizedTax)}</td>
                    <td style={{ ...tdS, textAlign: 'right', fontFamily: FONT_MONO, fontWeight: 700, color: row.savings > 0 ? '#10b981' : C.ltGray }}>
                      {row.savings > 0 ? `+${fmtCompact(row.savings)}` : '—'}
                    </td>
                    <td style={{ ...tdS, textAlign: 'right', fontFamily: FONT_MONO, color: C.accent }}>
                      {row.rothConversion > 0 ? fmtCompact(row.rothConversion) : '—'}
                    </td>
                    <td style={{ ...tdS, textAlign: 'right', fontFamily: FONT_MONO, color: '#1d4ed8' }}>
                      {row.bracketFill > 0 ? fmtCompact(row.bracketFill) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: '#f1f5f9', borderTop: `2px solid ${C.border}` }}>
                  <td style={{ ...tdS, textAlign: 'left', fontWeight: 700, color: C.navy }} colSpan={3}>Totals</td>
                  <td style={{ ...tdS, textAlign: 'right', fontFamily: FONT_MONO, fontWeight: 700, color: '#ef4444' }}>
                    {fmtCompact(yearlyComparison.reduce((s, r) => s + r.currentTax, 0))}
                  </td>
                  <td style={{ ...tdS, textAlign: 'right', fontFamily: FONT_MONO, fontWeight: 700, color: '#10b981' }}>
                    {fmtCompact(yearlyComparison.reduce((s, r) => s + r.optimizedTax, 0))}
                  </td>
                  <td style={{ ...tdS, textAlign: 'right', fontFamily: FONT_MONO, fontWeight: 800, color: '#10b981' }}>
                    +{fmtCompact(yearlyComparison.reduce((s, r) => s + r.savings, 0))}
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
            <div style={{ fontSize: 12, color: C.gray, marginTop: 2 }}>Your current (unoptimized) tax picture, year by year.</div>
          </div>
          <div style={{ overflowY: 'auto', maxHeight: '55vh' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['Year', 'Age', 'Bracket', 'Taxable Income', 'Bracket Room', 'Pre-tax Bal', 'Roth Bal', 'Eff Rate', 'In Window?'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', fontSize: 9, color: C.gray, fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right',
                      borderBottom: `2px solid ${C.border}`, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {taxAnalysis.map((row, i) => (
                  <tr key={row.year} style={{ background: row.isInConversionWindow ? '#f0fdf4' : i % 2 === 0 ? '#fff' : '#fafbfc' }}>
                    <td style={{ ...tdS, textAlign: 'left', fontWeight: 600, color: C.navy }}>{row.year}</td>
                    <td style={{ ...tdS, textAlign: 'right' }}>{row.age}</td>
                    <td style={{ ...tdS, textAlign: 'right', fontFamily: FONT_MONO, fontWeight: 700 }}>{row.currentBracketLabel}</td>
                    <td style={{ ...tdS, textAlign: 'right', fontFamily: FONT_MONO }}>{fmtCompact(row.taxableIncome)}</td>
                    <td style={{ ...tdS, textAlign: 'right', fontFamily: FONT_MONO, color: row.bracketRoom > 10000 ? '#10b981' : C.ltGray }}>
                      {row.bracketRoom > 0 ? fmtCompact(row.bracketRoom) : '—'}
                    </td>
                    <td style={{ ...tdS, textAlign: 'right', fontFamily: FONT_MONO }}>{fmtCompact(row.preTaxBalance)}</td>
                    <td style={{ ...tdS, textAlign: 'right', fontFamily: FONT_MONO }}>{fmtCompact(row.rothBalance)}</td>
                    <td style={{ ...tdS, textAlign: 'right', fontFamily: FONT_MONO }}>{(row.effectiveRate * 100).toFixed(1)}%</td>
                    <td style={{ ...tdS, textAlign: 'right' }}>
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
        This feature is available on the <strong>Pro Annual</strong> plan. Upgrade to unlock
        Roth conversion ladders, bracket filling, and dynamic withdrawal sequencing — with
        a personalized estimate of your lifetime tax savings.
      </p>
      <a href="/pricing" style={{
        display: 'inline-block', background: '#1d4ed8', color: '#fff',
        padding: '12px 28px', borderRadius: 10, textDecoration: 'none',
        fontSize: 14, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
      }}>
        Upgrade to Pro →
      </a>
    </div>
  );
}


// ── Shared table cell style ───────────────────────────────────────────────────
const tdS = {
  padding: '6px 12px',
  fontSize: 12,
  borderBottom: `1px solid #f1f5f9`,
  color: '#475569',
  whiteSpace: 'nowrap',
};
