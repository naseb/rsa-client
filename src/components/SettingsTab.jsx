/**
 * SettingsTab.jsx — Settings & Accounts
 * =======================================
 * Personal info, Social Security, return assumptions,
 * target balance, and investment accounts.
 *
 * NEW IN THIS VERSION: Employer match fields (matchPct, matchLimit)
 * are now exposed in the UI. Previously they existed in the data model
 * but had no input fields.
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

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, maxWidth: 900 }}>
      {/* Personal */}
      <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 16 }}>👤 Personal</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { l: "Current Age", v: currentAge, k: "currentAge" },
            { l: "Retirement Age", v: retirementAge, k: "retirementAge" },
            { l: "Life Expectancy", v: lifeExpectancy, k: "lifeExpectancy" },
          ].map((item) => (
            <div key={item.k}>
              <div style={{ fontSize: 11, color: C.gray, marginBottom: 4 }}>{item.l}</div>
              <NumericInput value={item.v} onChange={(v) => v !== null && setField(item.k, v)} width={60} />
            </div>
          ))}
          <div>
            <div style={{ fontSize: 11, color: C.gray, marginBottom: 4 }}>Filing Status</div>
            <select
              value={filingStatus}
              onChange={(e) => setField("filingStatus", Number(e.target.value))}
              style={{ padding: "6px 10px", border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 12, fontFamily: FONT_BODY, background: "#fff" }}
            >
              <option value={2}>MFJ</option>
              <option value={1}>Single</option>
            </select>
          </div>
        </div>
        <div style={{ marginTop: 12, padding: "8px 12px", background: C.blueBg, borderRadius: 8, fontSize: 11, color: C.navy }}>
          Born ~{currentYear - currentAge} | RMDs at {rmdAge}
        </div>
      </div>

      {/* Income & Targets */}
      <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 16 }}>💰 Income & Targets</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: C.gray, marginBottom: 4 }}>SS at FRA (67) /mo</div>
            <NumericInput value={ss67} onChange={(v) => v !== null && setField("ss67", v)} prefix="$" width={90} />
          </div>
          <div>
            <div style={{ fontSize: 11, color: C.gray, marginBottom: 4 }}>Claim at Age</div>
            <NumericInput value={ssStartAge} onChange={(v) => v !== null && setField("ssStartAge", v)} width={60} />
            {ssStartAge !== 67 && (() => {
              const mult = ssClaimingMultiplier(ssStartAge);
              const adj = Math.round(ss67 * mult);
              const pct = Math.round((mult - 1) * 100);
              return (
                <div style={{ fontSize: 10, color: ssStartAge < 67 ? C.red : C.green, marginTop: 2 }}>
                  Adjusted: ${adj.toLocaleString()}/mo ({pct > 0 ? "+" : ""}{pct}%)
                </div>
              );
            })()}
          </div>
          <div>
            <div style={{ fontSize: 11, color: C.gray, marginBottom: 4 }}>COLA</div>
            <NumericInput value={(cola * 100).toFixed(1)} onChange={(v) => v !== null && setField("cola", v / 100)} suffix="%" width={60} step={0.1} />
          </div>
          <div>
            <div style={{ fontSize: 11, color: C.gray, marginBottom: 4 }}>Default Return</div>
            <NumericInput value={defaultReturn} onChange={(v) => v !== null && setField("defaultReturn", v)} suffix="%" width={60} step={0.1} />
          </div>
          <div>
            <div style={{ fontSize: 11, color: C.gray, marginBottom: 4 }}>Inflation</div>
            <NumericInput value={inflationRate} onChange={(v) => v !== null && setField("inflationRate", v)} suffix="%" width={60} step={0.1} />
          </div>
          <div>
            <div style={{ fontSize: 11, color: C.gray, marginBottom: 4 }}>Target at {lifeExpectancy}</div>
            <NumericInput value={targetEndBalance} onChange={(v) => v !== null && setField("targetEndBalance", v)} prefix="$" width={110} />
          </div>
        </div>
      </div>

      {/* Investment Accounts */}
      <div style={{ gridColumn: "1/-1", background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>🏦 Investment Accounts</div>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.accent, fontFamily: FONT_MONO }}>{fmtCompact(totalBalance)} total</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {accounts.map((acct, idx) => (
            <div key={idx} style={{ background: "#f8fafc", borderRadius: 10, padding: 14, border: `1px solid ${C.border}` }}>
              {/* Account header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <input
                  value={acct.name}
                  onChange={(e) => updateAccount(idx, "name", e.target.value)}
                  style={{ fontWeight: 600, fontSize: 13, border: `1px solid ${C.border}`, background: "#f8fafc", fontFamily: FONT_BODY, color: C.navy, flex: 1, padding: "4px 8px", borderRadius: 6, outline: "none" }}
                />
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 8, background: acct.taxTreatment === "Pre-tax" ? C.blueBg : acct.taxTreatment === "Tax-free" ? C.greenBg : C.goGoBg, color: C.navy, fontWeight: 600 }}>
                    {acct.taxTreatment}
                  </span>
                  {accounts.length > 1 && (
                    <button onClick={() => removeAccount(idx)} style={{ background: "none", border: "none", color: C.red, cursor: "pointer", fontSize: 14 }}>×</button>
                  )}
                </div>
              </div>

              {/* Account fields */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12 }}>
                <div>
                  <span style={{ color: C.gray, fontSize: 10 }}>Balance</span><br />
                  <NumericInput value={acct.balance} onChange={(v) => v !== null && updateAccount(idx, "balance", v)} prefix="$" width={100} />
                </div>
                <div>
                  <span style={{ color: C.gray, fontSize: 10 }}>Monthly Contrib.</span><br />
                  <NumericInput value={acct.monthlyContribution} onChange={(v) => v !== null && updateAccount(idx, "monthlyContribution", v)} prefix="$" width={90} />
                </div>
                <div>
                  <span style={{ color: C.gray, fontSize: 10 }}>Return %</span><br />
                  <NumericInput value={acct.annualReturn} onChange={(v) => v !== null && updateAccount(idx, "annualReturn", v)} suffix="%" width={60} step={0.1} />
                </div>
                <div>
                  <span style={{ color: C.gray, fontSize: 10 }}>Tax Treatment</span><br />
                  <select
                    value={acct.taxTreatment}
                    onChange={(e) => updateAccount(idx, "taxTreatment", e.target.value)}
                    style={{ padding: "6px 8px", border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 11, fontFamily: FONT_BODY, background: "#fff" }}
                  >
                    <option value="Pre-tax">Pre-tax</option>
                    <option value="Tax-free">Tax-free (Roth)</option>
                    <option value="Taxable">Taxable</option>
                  </select>
                </div>
                {/* NEW: Employer Match fields */}
                <div>
                  <span style={{ color: C.gray, fontSize: 10 }}>Match %</span><br />
                  <NumericInput value={acct.matchPct} onChange={(v) => v !== null && updateAccount(idx, "matchPct", v)} suffix="%" width={60} />
                </div>
                <div>
                  <span style={{ color: C.gray, fontSize: 10 }}>Match Limit $/yr</span><br />
                  <NumericInput value={acct.matchLimit} onChange={(v) => v !== null && updateAccount(idx, "matchLimit", v)} prefix="$" width={90} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {accounts.length < 8 && (
          <button
            onClick={addAccount}
            style={{ width: "100%", padding: 10, marginTop: 12, border: `2px dashed ${C.border}`, borderRadius: 8, background: "transparent", color: C.accent, fontWeight: 600, cursor: "pointer", fontSize: 12, fontFamily: FONT_BODY }}
          >
            + Add Account
          </button>
        )}
      </div>
    </div>
  );
}
