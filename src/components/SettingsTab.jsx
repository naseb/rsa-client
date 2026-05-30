/**
 * SettingsTab.jsx — Settings & Accounts
 * =======================================
 * Personal info, Social Security, return assumptions,
 * target balance, and investment accounts.
 *
 * Updated: font sizes increased for 50+ readability,
 * account card backgrounds updated to match money theme.
 */

import NumericInput from "./NumericInput";
import { C, FONT_BODY, FONT_MONO, fmtCompact, ssClaimingMultiplier, rmdStartAge } from "../utils/theme";

export default function SettingsTab({
  inputs, setField, accounts, setAccounts,
}) {
  const {
    currentAge, retirementAge, lifeExpectancy, filingStatus,
    ss67, ssStartAge, cola, defaultReturn, inflationRate, targetEndBalance,
  } = inputs;

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);
  const rmdAge = rmdStartAge(currentAge);
  const currentYear = new Date().getFullYear();

  const updateAccount = (idx, key, val) => {
    setAccounts((prev) => prev.map((a, i) => (i === idx ? { ...a, [key]: val } : a)));
  };

  const addAccount = () => {
    setAccounts((prev) => [
      ...prev,
      { name: `Account ${prev.length + 1}`, balance: 0, monthlyContribution: 0, annualReturn: 7, taxTreatment: "Taxable", matchPct: 0, matchLimit: 0 },
    ]);
  };

  const removeAccount = (idx) => {
    setAccounts((prev) => prev.filter((_, i) => i !== idx));
  };

  // Shared label style
  const labelStyle = { fontSize: 13, color: C.gray, marginBottom: 5, fontWeight: 500 };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, maxWidth: 960 }}>

      {/* ── Personal ── */}
      <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12, padding: 28 }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: C.navy, marginBottom: 20 }}>👤 Personal</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            { l: "Current Age",     v: currentAge,     k: "currentAge" },
            { l: "Retirement Age",  v: retirementAge,  k: "retirementAge" },
            { l: "Life Expectancy", v: lifeExpectancy, k: "lifeExpectancy" },
          ].map((item) => (
            <div key={item.k}>
              <div style={labelStyle}>{item.l}</div>
              <NumericInput value={item.v} onChange={(v) => v !== null && setField(item.k, v)} width={70} />
            </div>
          ))}
          <div>
            <div style={labelStyle}>Filing Status</div>
            <select
              value={filingStatus}
              onChange={(e) => setField("filingStatus", Number(e.target.value))}
              style={{
                padding: "8px 12px", border: `1px solid ${C.border}`, borderRadius: 6,
                fontSize: 14, fontFamily: FONT_BODY, background: "#fff", color: C.navy,
              }}
            >
              <option value={2}>Married Filing Jointly</option>
              <option value={1}>Single</option>
            </select>
          </div>
        </div>
        <div style={{ marginTop: 16, padding: "10px 14px", background: C.blueBg, borderRadius: 8, fontSize: 14, color: C.navy }}>
          Born approximately {currentYear - currentAge} · Required Minimum Distributions begin at age {rmdAge}
        </div>
      </div>

      {/* ── Income & Targets ── */}
      <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12, padding: 28 }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: C.navy, marginBottom: 20 }}>💰 Income &amp; Targets</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <div style={labelStyle}>SS Benefit at Age 67 /mo</div>
            <NumericInput value={ss67} onChange={(v) => v !== null && setField("ss67", v)} prefix="$" width={100} />
          </div>
          <div>
            <div style={labelStyle}>Claim SS at Age</div>
            <NumericInput value={ssStartAge} onChange={(v) => v !== null && setField("ssStartAge", v)} width={70} />
            {ssStartAge !== 67 && (() => {
              const mult = ssClaimingMultiplier(ssStartAge);
              const adj  = Math.round(ss67 * mult);
              const pct  = Math.round((mult - 1) * 100);
              return (
                <div style={{ fontSize: 12, color: ssStartAge < 67 ? C.red : C.green, marginTop: 4 }}>
                  Adjusted: ${adj.toLocaleString()}/mo ({pct > 0 ? "+" : ""}{pct}%)
                </div>
              );
            })()}
          </div>
          <div>
            <div style={labelStyle}>COLA (Cost of Living)</div>
            <NumericInput value={(cola * 100).toFixed(1)} onChange={(v) => v !== null && setField("cola", v / 100)} suffix="%" width={70} step={0.1} />
          </div>
          <div>
            <div style={labelStyle}>Default Annual Return</div>
            <NumericInput value={defaultReturn} onChange={(v) => v !== null && setField("defaultReturn", v)} suffix="%" width={70} step={0.1} />
          </div>
          <div>
            <div style={labelStyle}>Inflation Rate</div>
            <NumericInput value={inflationRate} onChange={(v) => v !== null && setField("inflationRate", v)} suffix="%" width={70} step={0.1} />
          </div>
          <div>
            <div style={labelStyle}>Target Balance at {lifeExpectancy}</div>
            <NumericInput value={targetEndBalance} onChange={(v) => v !== null && setField("targetEndBalance", v)} prefix="$" width={120} />
          </div>
        </div>
      </div>

      {/* ── Investment Accounts ── */}
      <div style={{ gridColumn: "1/-1", background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12, padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: C.navy }}>🏦 Investment Accounts</div>
          <span style={{ fontSize: 16, fontWeight: 700, color: C.accent, fontFamily: FONT_MONO }}>
            {fmtCompact(totalBalance)} total
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {accounts.map((acct, idx) => (
            <div key={idx} style={{
              background: C.pageBg,
              borderRadius: 10, padding: 18,
              border: `1px solid ${C.border}`,
            }}>
              {/* Account header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <input
                  value={acct.name}
                  onChange={(e) => updateAccount(idx, "name", e.target.value)}
                  style={{
                    fontWeight: 700, fontSize: 15, border: `1px solid ${C.border}`,
                    background: C.pageBg, fontFamily: FONT_BODY, color: C.navy,
                    flex: 1, padding: "5px 10px", borderRadius: 6, outline: "none",
                  }}
                />
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 10 }}>
                  <span style={{
                    fontSize: 11, padding: "3px 9px", borderRadius: 8, fontWeight: 700,
                    background: acct.taxTreatment === "Pre-tax" ? C.blueBg
                              : acct.taxTreatment === "Tax-free" ? C.greenBg
                              : C.goGoBg,
                    color: acct.taxTreatment === "Pre-tax" ? C.accentDark
                         : acct.taxTreatment === "Tax-free" ? "#065f46"
                         : "#92400e",
                  }}>
                    {acct.taxTreatment === "Tax-free" ? "Roth" : acct.taxTreatment}
                  </span>
                  {accounts.length > 1 && (
                    <button
                      onClick={() => removeAccount(idx)}
                      style={{ background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: 18, lineHeight: 1 }}
                    >×</button>
                  )}
                </div>
              </div>

              {/* Account fields */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <div style={labelStyle}>Balance</div>
                  <NumericInput value={acct.balance} onChange={(v) => v !== null && updateAccount(idx, "balance", v)} prefix="$" width={110} />
                </div>
                <div>
                  <div style={labelStyle}>Monthly Contribution</div>
                  <NumericInput value={acct.monthlyContribution} onChange={(v) => v !== null && updateAccount(idx, "monthlyContribution", v)} prefix="$" width={100} />
                </div>
                <div>
                  <div style={labelStyle}>Annual Return</div>
                  <NumericInput value={acct.annualReturn} onChange={(v) => v !== null && updateAccount(idx, "annualReturn", v)} suffix="%" width={70} step={0.1} />
                </div>
                <div>
                  <div style={labelStyle}>Tax Treatment</div>
                  <select
                    value={acct.taxTreatment}
                    onChange={(e) => updateAccount(idx, "taxTreatment", e.target.value)}
                    style={{
                      padding: "7px 10px", border: `1px solid ${C.border}`, borderRadius: 6,
                      fontSize: 13, fontFamily: FONT_BODY, background: "#fff", color: C.navy,
                    }}
                  >
                    <option value="Pre-tax">Pre-tax (401k / IRA)</option>
                    <option value="Tax-free">Tax-free (Roth)</option>
                    <option value="Taxable">Taxable (Brokerage)</option>
                  </select>
                </div>
                <div>
                  <div style={labelStyle}>Employer Match %</div>
                  <NumericInput value={acct.matchPct} onChange={(v) => v !== null && updateAccount(idx, "matchPct", v)} suffix="%" width={70} />
                </div>
                <div>
                  <div style={labelStyle}>Match Limit / Year</div>
                  <NumericInput value={acct.matchLimit} onChange={(v) => v !== null && updateAccount(idx, "matchLimit", v)} prefix="$" width={100} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {accounts.length < 8 && (
          <button
            onClick={addAccount}
            style={{
              width: "100%", padding: 12, marginTop: 16,
              border: `2px dashed ${C.border}`, borderRadius: 8,
              background: "transparent", color: C.accent,
              fontWeight: 700, cursor: "pointer", fontSize: 15,
              fontFamily: FONT_BODY, transition: "all 0.2s",
            }}
          >
            + Add Account
          </button>
        )}
      </div>

    </div>
  );
}
