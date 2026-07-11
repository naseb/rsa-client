/**
 * SettingsTab.jsx — Settings & Accounts
 * =======================================
 * Personal info, Social Security, return assumptions,
 * target balance, and investment accounts.
 *
 * Updated: font sizes increased for 50+ readability,
 * account card backgrounds updated to match money theme.
 */

import { useState } from "react";
import NumericInput from "./NumericInput";
import { C, FONT_BODY, FONT_MONO, fmtCompact, ssClaimingMultiplier, rmdStartAge } from "../utils/theme";
import { DEFAULTS } from "../utils/defaults";
import { US_STATES } from "../utils/states";
import InstructionsTab from "./InstructionsTab";
import ExamplesTab from "./ExamplesTab";

export default function SettingsTab({
  inputs, setField, accounts, setAccounts, onLoadScenario,
}) {
  const [subView, setSubView] = useState("settings");
  const {
    currentAge, retirementAge, lifeExpectancy, filingStatus, state,
    ss67, ssStartAge, pensionAmount, pensionStartAge, pensionHasCola, cola, defaultReturn,
    inflationRate, targetEndBalance,
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

  if (subView === "instructions") {
    return (
      <div>
        <div style={{ marginBottom: 20, display: "flex", alignItems: "center" }}>
          <button
            onClick={() => setSubView("settings")}
            style={{
              padding: "8px 16px",
              background: C.accent,
              color: "#fff",
              border: "none",
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontFamily: FONT_BODY,
            }}
          >
            ← Back to Your Data
          </button>
        </div>
        <InstructionsTab />
      </div>
    );
  }

  if (subView === "examples") {
    return (
      <div>
        <div style={{ marginBottom: 20, display: "flex", alignItems: "center" }}>
          <button
            onClick={() => setSubView("settings")}
            style={{
              padding: "8px 16px",
              background: C.accent,
              color: "#fff",
              border: "none",
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontFamily: FONT_BODY,
            }}
          >
            ← Back to Your Data
          </button>
        </div>
        <ExamplesTab onLoadScenario={onLoadScenario} />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 960 }}>
      {/* ── Help & Demo Navigation Banners ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 20,
        background: C.blueBg,
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: 20,
      }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: C.navy, marginBottom: 8 }}>
              📖 Setup &amp; Usage Instructions
            </div>
            <div style={{ fontSize: 13, color: C.slate, marginBottom: 12 }}>
              Learn how the planner models spending phases, inflation, and tax optimization.
            </div>
          </div>
          <button
            onClick={() => setSubView("instructions")}
            style={{
              alignSelf: "flex-start",
              padding: "8px 14px",
              background: "transparent",
              color: C.accent,
              border: `1px solid ${C.accent}`,
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: FONT_BODY,
              transition: "background 0.15s",
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = "rgba(45, 106, 79, 0.05)"; }}
            onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            Read Instructions →
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", borderLeft: `1px dashed ${C.border}`, paddingLeft: 20 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: C.navy, marginBottom: 8 }}>
              💡 Interactive Demo Scenarios
            </div>
            <div style={{ fontSize: 13, color: C.slate, marginBottom: 12 }}>
              Load pre-built financial profiles (Sequence Risk, RMD Tax Bomb) to see the app in action.
            </div>
          </div>
          <button
            onClick={() => setSubView("examples")}
            style={{
              alignSelf: "flex-start",
              padding: "8px 14px",
              background: "transparent",
              color: C.accent,
              border: `1px solid ${C.accent}`,
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: FONT_BODY,
              transition: "background 0.15s",
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = "rgba(45, 106, 79, 0.05)"; }}
            onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            Explore Case Studies →
          </button>
        </div>
      </div>

      {/* Main Settings Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

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
              <NumericInput value={item.v} onChange={(v) => setField(item.k, v ?? DEFAULTS[item.k])} width={70} />
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
          <div>
            <div style={labelStyle}>State of Residence</div>
            <select
              value={state ?? ""}
              onChange={(e) => setField("state", e.target.value || null)}
              style={{
                padding: "8px 12px", border: `1px solid ${C.border}`, borderRadius: 6,
                fontSize: 14, fontFamily: FONT_BODY, background: "#fff", color: C.navy,
              }}
            >
              <option value="">Select a state (optional)</option>
              {US_STATES.map((s) => (
                <option key={s.code} value={s.code}>{s.name}</option>
              ))}
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
          {/* Guaranteed Income Streams */}
          <div>
            <div style={labelStyle}>SS Benefit at Age 67 /mo</div>
            <NumericInput value={ss67} onChange={(v) => setField("ss67", v ?? 0)} prefix="$" width={100} />
          </div>
          <div>
            <div style={labelStyle}>Claim SS at Age</div>
            <NumericInput value={ssStartAge} onChange={(v) => setField("ssStartAge", v ?? DEFAULTS.ssStartAge)} width={70} />
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
            <div style={labelStyle}>Pension Benefit /mo</div>
            <NumericInput value={pensionAmount} onChange={(v) => setField("pensionAmount", v ?? 0)} prefix="$" width={100} />
          </div>
          <div>
            <div style={labelStyle}>Claim Pension at Age</div>
            <NumericInput value={pensionStartAge} onChange={(v) => setField("pensionStartAge", v ?? DEFAULTS.pensionStartAge)} width={70} />
          </div>
          <div>
            <div style={labelStyle}>Pension inflation-adjusted?</div>
            <select
              value={pensionHasCola ? "true" : "false"}
              onChange={(e) => setField("pensionHasCola", e.target.value === "true")}
              style={{
                padding: "8px 12px", border: `1px solid ${C.border}`, borderRadius: 6,
                fontSize: 14, fontFamily: FONT_BODY, background: "#fff", color: C.navy,
                width: "100%", maxWidth: 150,
              }}
            >
              <option value="false">No (Fixed Pension)</option>
              <option value="true">Yes (Adjusts/COLA)</option>
            </select>
          </div>
          <div /> {/* spacing alignment */}

          {/* Section Divider */}
          <div style={{ gridColumn: "1/-1", borderTop: `1px dashed ${C.border}`, margin: "4px 0" }} />

          {/* Planning Assumptions */}
          <div>
            <div style={labelStyle}>COLA (Cost of Living)</div>
            <NumericInput value={(cola * 100).toFixed(1)} onChange={(v) => setField("cola", v !== null ? v / 100 : DEFAULTS.cola)} suffix="%" width={70} step={0.1} />
          </div>
          <div>
            <div style={labelStyle}>Default Annual Return</div>
            <NumericInput value={defaultReturn} onChange={(v) => setField("defaultReturn", v ?? DEFAULTS.defaultReturn)} suffix="%" width={70} step={0.1} />
          </div>
          <div>
            <div style={labelStyle}>Inflation Rate</div>
            <NumericInput value={inflationRate} onChange={(v) => setField("inflationRate", v ?? DEFAULTS.inflationRate)} suffix="%" width={70} step={0.1} />
          </div>
          <div>
            <div style={labelStyle}>Target Balance at {lifeExpectancy}</div>
            <NumericInput value={targetEndBalance} onChange={(v) => setField("targetEndBalance", v ?? 0)} prefix="$" width={120} />
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
                  <NumericInput value={acct.balance} onChange={(v) => updateAccount(idx, "balance", v ?? 0)} prefix="$" width={110} />
                </div>
                <div>
                  <div style={labelStyle}>Monthly Contribution</div>
                  <NumericInput value={acct.monthlyContribution} onChange={(v) => updateAccount(idx, "monthlyContribution", v ?? 0)} prefix="$" width={100} />
                </div>
                <div>
                  <div style={labelStyle}>Annual Return</div>
                  <NumericInput value={acct.annualReturn} onChange={(v) => updateAccount(idx, "annualReturn", v ?? 0)} suffix="%" width={70} step={0.1} />
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
                  <NumericInput value={acct.matchPct} onChange={(v) => updateAccount(idx, "matchPct", v ?? 0)} suffix="%" width={70} />
                </div>
                <div>
                  <div style={labelStyle}>Match Limit / Year</div>
                  <NumericInput value={acct.matchLimit} onChange={(v) => updateAccount(idx, "matchLimit", v ?? 0)} prefix="$" width={100} />
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

    </div>
  );
}
