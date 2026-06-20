/**
 * ExamplesTab.jsx — Interactive Demo Scenarios & Case Studies
 * ============================================================
 * Provides pre-built client scenarios (Sequence Risk, RMD Tax Bomb,
 * early retirement bridge) to let users immediately experience 
 * how the retirement analyzer and optimizer work.
 */

import { C, FONT_BODY } from "../utils/theme";

const SCENARIO_A = {
  currentAge: 57,
  retirementAge: 62,
  lifeExpectancy: 95,
  filingStatus: 2,
  ss67: 4182,
  ssStartAge: 67,
  cola: 0.025,
  defaultReturn: 5.6,
  inflationRate: 3,
  targetEndBalance: 250000,
  phases: [
    { name: "Go-Go", startAge: 65, pct: 100, color: "goGo" },
    { name: "Slow-Go", startAge: 75, pct: 70, color: "slowGo" },
    { name: "No-Go", startAge: 85, pct: 50, color: "noGo" }
  ],
  transitionYears: 3,
  smoothTransition: true,
  marketReturns: {
    "2031": -20,
    "2033": 9,
    "2036": 10,
    "2042": -10,
    "2045": 18
  },
  spendingOverrides: {},
  portfolioOverrides: {},
  accounts: [
    { name: "Traditional 401(k)", balance: 1200000, monthlyContribution: 2041, annualReturn: 5.6, taxTreatment: "Pre-tax", matchPct: 3, matchLimit: 6000 },
    { name: "Roth IRA", balance: 0, monthlyContribution: 666, annualReturn: 5.6, taxTreatment: "Tax-free", matchPct: 0, matchLimit: 0 },
    { name: "Traditional IRA", balance: 520000, monthlyContribution: 0, annualReturn: 5.6, taxTreatment: "Pre-tax", matchPct: 0, matchLimit: 0 },
    { name: "Brokerage", balance: 214000, monthlyContribution: 0, annualReturn: 5.6, taxTreatment: "Taxable", matchPct: 0, matchLimit: 0 },
    { name: "HYSA", balance: 100000, monthlyContribution: 0, annualReturn: 3.5, taxTreatment: "Taxable", matchPct: 0, matchLimit: 0 }
  ]
};

const SCENARIO_B = {
  currentAge: 55,
  retirementAge: 60,
  lifeExpectancy: 95,
  filingStatus: 1,
  ss67: 3500,
  ssStartAge: 70,
  cola: 0.025,
  defaultReturn: 7,
  inflationRate: 3,
  targetEndBalance: 250000,
  phases: [
    { name: "Go-Go", startAge: 60, pct: 100, color: "goGo" },
    { name: "Slow-Go", startAge: 75, pct: 70, color: "slowGo" },
    { name: "No-Go", startAge: 85, pct: 50, color: "noGo" }
  ],
  transitionYears: 3,
  smoothTransition: true,
  marketReturns: {},
  spendingOverrides: {},
  portfolioOverrides: {},
  accounts: [
    { name: "Traditional 401(k)", balance: 1800000, monthlyContribution: 1500, annualReturn: 7, taxTreatment: "Pre-tax", matchPct: 3, matchLimit: 6000 },
    { name: "Roth IRA", balance: 50000, monthlyContribution: 500, annualReturn: 7, taxTreatment: "Tax-free", matchPct: 0, matchLimit: 0 },
    { name: "Brokerage", balance: 300000, monthlyContribution: 0, annualReturn: 7, taxTreatment: "Taxable", matchPct: 0, matchLimit: 0 },
    { name: "HYSA", balance: 100000, monthlyContribution: 0, annualReturn: 3.5, taxTreatment: "Taxable", matchPct: 0, matchLimit: 0 }
  ]
};

const SCENARIO_C = {
  currentAge: 53,
  retirementAge: 55,
  lifeExpectancy: 95,
  filingStatus: 2,
  ss67: 4000,
  ssStartAge: 70,
  cola: 0.025,
  defaultReturn: 7,
  inflationRate: 3,
  targetEndBalance: 250000,
  phases: [
    { name: "Go-Go", startAge: 55, pct: 100, color: "goGo" },
    { name: "Slow-Go", startAge: 75, pct: 70, color: "slowGo" },
    { name: "No-Go", startAge: 85, pct: 50, color: "noGo" }
  ],
  transitionYears: 3,
  smoothTransition: true,
  marketReturns: {},
  spendingOverrides: {},
  portfolioOverrides: {},
  accounts: [
    { name: "Traditional 401(k)", balance: 2500000, monthlyContribution: 0, annualReturn: 7, taxTreatment: "Pre-tax", matchPct: 0, matchLimit: 0 },
    { name: "Brokerage", balance: 1200000, monthlyContribution: 0, annualReturn: 7, taxTreatment: "Taxable", matchPct: 0, matchLimit: 0 },
    { name: "HYSA", balance: 150000, monthlyContribution: 0, annualReturn: 3.5, taxTreatment: "Taxable", matchPct: 0, matchLimit: 0 }
  ]
};

export default function ExamplesTab({ onLoadScenario }) {
  return (
    <div style={{ maxWidth: 1000 }}>
      {/* Dynamic hover styles for premium demo cards */}
      <style dangerouslySetInnerHTML={{__html: `
        .demo-card {
          transition: transform 0.22s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.22s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.22s;
          cursor: pointer;
        }
        .demo-card:hover {
          transform: translateY(-5px);
        }
        .demo-card-a:hover {
          box-shadow: 0 12px 24px rgba(217, 119, 6, 0.12) !important;
          border-color: #f59e0b !important;
        }
        .demo-card-b:hover {
          box-shadow: 0 12px 24px rgba(29, 78, 216, 0.12) !important;
          border-color: #3b82f6 !important;
        }
        .demo-card-c:hover {
          box-shadow: 0 12px 24px rgba(5, 150, 105, 0.12) !important;
          border-color: #10b981 !important;
        }
        .demo-btn {
          transition: background-color 0.15s, transform 0.1s;
        }
        .demo-btn:active {
          transform: scale(0.98);
        }
        .demo-btn-a:hover { background-color: #b45309 !important; }
        .demo-btn-b:hover { background-color: #1e40af !important; }
        .demo-btn-c:hover { background-color: #047857 !important; }
        .metric-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }
        .metric-tag {
          font-size: 12px;
          font-weight: 500;
          color: #2d4a35;
          background: rgba(45, 74, 53, 0.06);
          padding: 3px 8px;
          border-radius: 4px;
          display: inline-block;
        }
      `}} />

      {/* Main explanation card */}
      <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12, padding: "28px 32px", marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: C.navy, marginBottom: 8 }}>💡 Interactive Demo Scenarios &amp; Case Studies</div>
        <div style={{ fontSize: 16, color: C.slate, lineHeight: 1.6 }}>
          Not sure where to start or how your accounts behave under different financial models?
          Click any of these pre-built case studies to populate the calculator's state, auto-save the values locally, 
          and jump directly to the relevant comparison or tax optimization view.
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
        
        {/* Card A */}
        <div 
          onClick={() => onLoadScenario && onLoadScenario(SCENARIO_A, "compare")}
          className="demo-card demo-card-a"
          style={{
            border: `1px solid #fde68a`, 
            background: "linear-gradient(to bottom right, #fffdf9, #fffbeb)", 
            borderRadius: 12, 
            padding: 24,
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "space-between",
            boxShadow: "0 2px 8px rgba(217, 119, 6, 0.04)",
            position: "relative"
          }}
        >
          <div>
            <div className="metric-badge" style={{ background: "#fef3c7", color: "#b45309" }}>
              📉 Sequence Risk
            </div>
            <div style={{ fontSize: 19, fontWeight: 700, color: C.navy, marginBottom: 8 }}>
              The 4% Rule Failure
            </div>
            <div style={{ fontSize: 14.5, color: C.slate, lineHeight: 1.5, marginBottom: 16 }}>
              See how a Married couple retiring at age 62 with <strong>$3.0M</strong> runs out of money by age 87 due to a first-year market crash under the static 4% Rule.
            </div>
            
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
              <span className="metric-tag">MFJ / Age 62</span>
              <span className="metric-tag">5 Accounts</span>
              <span className="metric-tag" style={{ background: "#fee2e2", color: "#dc2626" }}>-20% Crash Yr 1</span>
            </div>
          </div>
          {onLoadScenario ? (
            <div
              className="demo-btn demo-btn-a"
              style={{
                width: "100%", padding: "12px", background: "#d97706", color: "#fff",
                borderRadius: 6, fontWeight: 600, textAlign: "center",
                fontFamily: FONT_BODY, fontSize: 14,
                boxShadow: "0 2px 4px rgba(217,119,6,0.2)",
                userSelect: "none"
              }}
            >
              Load &amp; View vs 4% Rule →
            </div>
          ) : (
            <div style={{ fontSize: 12, color: C.ltGray, fontStyle: "italic", textAlign: "center" }}>Demo Mode</div>
          )}
        </div>

        {/* Card B */}
        <div 
          onClick={() => onLoadScenario && onLoadScenario(SCENARIO_B, "taxopt")}
          className="demo-card demo-card-b"
          style={{
            border: `1px solid #bfdbfe`, 
            background: "linear-gradient(to bottom right, #f8fafc, #eff6ff)", 
            borderRadius: 12, 
            padding: 24,
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "space-between",
            boxShadow: "0 2px 8px rgba(29, 78, 216, 0.04)",
            position: "relative"
          }}
        >
          <div>
            <div className="metric-badge" style={{ background: "#dbeafe", color: "#1d4ed8" }}>
              💣 Tax Bomb
            </div>
            <div style={{ fontSize: 19, fontWeight: 700, color: C.navy, marginBottom: 8 }}>
              The RMD Tax Bomb
            </div>
            <div style={{ fontSize: 14.5, color: C.slate, lineHeight: 1.5, marginBottom: 16 }}>
              See how a single retiree with a <strong>$1.8M</strong> pre-tax balance gets pushed into the 35% tax bracket by forced Required Minimum Distributions (RMDs) at age 75 — and how targeted early Roth conversions circumvent this.
            </div>
            
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
              <span className="metric-tag">Single / Age 60</span>
              <span className="metric-tag">$2.25M Portfolio</span>
              <span className="metric-tag" style={{ background: "#dbeafe", color: "#1d4ed8" }}>RMD Tax Focus</span>
            </div>
          </div>
          {onLoadScenario ? (
            <div
              className="demo-btn demo-btn-b"
              style={{
                width: "100%", padding: "12px", background: "#1d4ed8", color: "#fff",
                borderRadius: 6, fontWeight: 600, textAlign: "center",
                fontFamily: FONT_BODY, fontSize: 14,
                boxShadow: "0 2px 4px rgba(29,78,216,0.2)",
                userSelect: "none"
              }}
            >
              Load &amp; View Tax Opt Pro →
            </div>
          ) : (
            <div style={{ fontSize: 12, color: C.ltGray, fontStyle: "italic", textAlign: "center" }}>Demo Mode</div>
          )}
        </div>

        {/* Card C */}
        <div 
          onClick={() => onLoadScenario && onLoadScenario(SCENARIO_C, "taxopt")}
          className="demo-card demo-card-c"
          style={{
            border: `1px solid #a7f3d0`, 
            background: "linear-gradient(to bottom right, #f9fbf9, #f0f8f4)", 
            borderRadius: 12, 
            padding: 24,
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "space-between",
            boxShadow: "0 2px 8px rgba(5, 150, 105, 0.04)",
            position: "relative"
          }}
        >
          <div>
            <div className="metric-badge" style={{ background: "#d1fae5", color: "#065f46" }}>
              🌉 Early Bridge
            </div>
            <div style={{ fontSize: 19, fontWeight: 700, color: C.navy, marginBottom: 8 }}>
              The Brokerage Bridge
            </div>
            <div style={{ fontSize: 14.5, color: C.slate, lineHeight: 1.5, marginBottom: 16 }}>
              See how an early retiree (age 55) living off a <strong>$1.2M</strong> brokerage account saves over <strong>$150,000</strong> in taxes using a Roth conversion ladder.
            </div>
            
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
              <span className="metric-tag">MFJ / Age 55</span>
              <span className="metric-tag">$3.85M Portfolio</span>
              <span className="metric-tag" style={{ background: "#d1fae5", color: "#065f46" }}>Roth Ladder Bridge</span>
            </div>
          </div>
          {onLoadScenario ? (
            <div
              className="demo-btn demo-btn-c"
              style={{
                width: "100%", padding: "12px", background: "#059669", color: "#fff",
                borderRadius: 6, fontWeight: 600, textAlign: "center",
                fontFamily: FONT_BODY, fontSize: 14,
                boxShadow: "0 2px 4px rgba(5,150,105,0.2)",
                userSelect: "none"
              }}
            >
              Load &amp; View Tax Opt Pro →
            </div>
          ) : (
            <div style={{ fontSize: 12, color: C.ltGray, fontStyle: "italic", textAlign: "center" }}>Demo Mode</div>
          )}
        </div>

      </div>
    </div>
  );
}
