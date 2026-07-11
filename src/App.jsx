/**
 * App.jsx — Main Application Shell
 * ==================================
 * Top-level component: manages state, calls solver API,
 * renders header, tab bar, and active tab content.
 *
 * Updated: money color theme applied to header and tab bar.
 * NO SOLVER LOGIC LIVES HERE. The solver runs on the API server.
 */

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, UserButton } from "@clerk/react";
import { useSolverAPI, useCompareAPI } from "./hooks/useSolverAPI";
import { C, FONT_BODY, FONT_MONO, fmtCompact, STORAGE_KEY } from "./utils/theme";
import { DEFAULTS } from "./utils/defaults";
import { useSubscription } from "./context/SubscriptionContext";

import TaxOptimizationTab from "./components/TaxOptimizationTab";
import SettingsTab          from "./components/SettingsTab";
import SpendingPhasesTab    from "./components/SpendingPhasesTab";
import CompareTab           from "./components/CompareTab";

export default function App() {
  const navigate  = useNavigate();
  const { isPro, isTrialing } = useSubscription(); // kept for future Tax Optimization tab
  const { getToken } = useAuth();
  const API_URL   = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  // ── Tab state ───────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("phases");
  const [saveMsg,   setSaveMsg]   = useState("");
  const [loadedScenario, setLoadedScenario] = useState(null);

  // ── All user input state ────────────────────────────────────────────────────
  const [currentAge,       setCurrentAge]       = useState(DEFAULTS.currentAge);
  const [retirementAge,    setRetirementAge]    = useState(DEFAULTS.retirementAge);
  const [lifeExpectancy,   setLifeExpectancy]   = useState(DEFAULTS.lifeExpectancy);
  const [filingStatus,     setFilingStatus]     = useState(DEFAULTS.filingStatus);
  const [ss67,             setSs67]             = useState(DEFAULTS.ss67);
  const [ssStartAge,       setSsStartAge]       = useState(DEFAULTS.ssStartAge);
  const [pensionAmount,    setPensionAmount]    = useState(DEFAULTS.pensionAmount);
  const [pensionStartAge,  setPensionStartAge]  = useState(DEFAULTS.pensionStartAge);
  const [pensionHasCola,   setPensionHasCola]   = useState(DEFAULTS.pensionHasCola);
  const [cola,             setCola]             = useState(DEFAULTS.cola);
  const [defaultReturn,    setDefaultReturn]    = useState(DEFAULTS.defaultReturn);
  const [inflationRate,    setInflationRate]    = useState(DEFAULTS.inflationRate);
  const [targetEndBalance, setTargetEndBalance] = useState(DEFAULTS.targetEndBalance);
  const [phases,           setPhases]           = useState(DEFAULTS.phases);
  const [transitionYears,  setTransitionYears]  = useState(DEFAULTS.transitionYears);
  const [smoothTransition, setSmoothTransition] = useState(DEFAULTS.smoothTransition);
  const [marketReturns,    setMarketReturns]    = useState(DEFAULTS.marketReturns);
  const [spendingOverrides,  setSpendingOverrides]  = useState({});
  const [portfolioOverrides, setPortfolioOverrides] = useState({});
  const [accounts, setAccounts] = useState(DEFAULTS.accounts);

  // ── Load from localStorage on mount ────────────────────────────────────────
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        const setters = {
          currentAge: setCurrentAge, retirementAge: setRetirementAge,
          lifeExpectancy: setLifeExpectancy, filingStatus: setFilingStatus,
          ss67: setSs67, ssStartAge: setSsStartAge,
          pensionAmount: setPensionAmount, pensionStartAge: setPensionStartAge,
          pensionHasCola: setPensionHasCola, cola: setCola,
          defaultReturn: setDefaultReturn, inflationRate: setInflationRate,
          targetEndBalance: setTargetEndBalance, phases: setPhases,
          transitionYears: setTransitionYears, smoothTransition: setSmoothTransition,
          marketReturns: setMarketReturns, spendingOverrides: setSpendingOverrides,
          portfolioOverrides: setPortfolioOverrides, accounts: setAccounts,
          loadedScenario: setLoadedScenario,
        };
        Object.entries(setters).forEach(([key, setter]) => {
          if (data[key] != null) setter(data[key]);
        });
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
    }
  }, []);

  // ── Inputs object sent to the API ──────────────────────────────────────────
  const inputs = {
    currentAge, retirementAge, lifeExpectancy, filingStatus,
    ss67, ssStartAge, pensionAmount, pensionStartAge, pensionHasCola, cola, defaultReturn, inflationRate, targetEndBalance,
    phases, transitionYears, smoothTransition,
    marketReturns, spendingOverrides, portfolioOverrides, accounts,
    loadedScenario,
  };

  // ── Auto-save to localStorage (debounced) ──────────────────────────────────
  const saveTimer = useRef(null);
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
        setSaveMsg("Saved");
        setTimeout(() => setSaveMsg(""), 2000);
      } catch { /* ignore */ }
    }, 500);
    return () => clearTimeout(saveTimer.current);
  }, [
    currentAge, retirementAge, lifeExpectancy, filingStatus,
    ss67, ssStartAge, pensionAmount, pensionStartAge, pensionHasCola, cola, defaultReturn, inflationRate, targetEndBalance,
    phases, transitionYears, smoothTransition,
    marketReturns, spendingOverrides, accounts, portfolioOverrides, loadedScenario,
  ]);

  // ── API hooks ───────────────────────────────────────────────────────────────
  const { data: solverData,  loading: solverLoading,  error: solverError  } = useSolverAPI(inputs);
  const { data: compareData, loading: compareLoading, error: compareError } = useCompareAPI(inputs, activeTab === "compare" || activeTab === "phases");

  // ── Field setter ────────────────────────────────────────────────────────────
  const setField = (key, value) => {
    const setters = {
      currentAge: setCurrentAge, retirementAge: setRetirementAge,
      lifeExpectancy: setLifeExpectancy, filingStatus: setFilingStatus,
      ss67: setSs67, ssStartAge: setSsStartAge,
      pensionAmount: setPensionAmount, pensionStartAge: setPensionStartAge,
      pensionHasCola: setPensionHasCola, cola: setCola,
      defaultReturn: setDefaultReturn, inflationRate: setInflationRate,
      targetEndBalance: setTargetEndBalance, phases: setPhases,
      transitionYears: setTransitionYears, smoothTransition: setSmoothTransition,
    };
    if (setters[key]) setters[key](value);
  };

  // ── Manage Billing (Stripe Customer Portal) ─────────────────────────────────
  const handleManageBilling = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/create-portal-session`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Portal unavailable');
      }
      const { url } = await res.json();
      window.location.href = url;
    } catch (err) {
      alert(err.message);
    }
  };
  const handleLoadScenario = (scenarioData, targetTab, scenarioName) => {
    setCurrentAge(scenarioData.currentAge);
    setRetirementAge(scenarioData.retirementAge);
    setLifeExpectancy(scenarioData.lifeExpectancy);
    setFilingStatus(scenarioData.filingStatus);
    setSs67(scenarioData.ss67);
    setSsStartAge(scenarioData.ssStartAge);
    setPensionAmount(scenarioData.pensionAmount ?? 0);
    setPensionStartAge(scenarioData.pensionStartAge ?? 65);
    setPensionHasCola(scenarioData.pensionHasCola ?? false);
    setCola(scenarioData.cola);
    setDefaultReturn(scenarioData.defaultReturn);
    setInflationRate(scenarioData.inflationRate);
    setTargetEndBalance(scenarioData.targetEndBalance);
    setPhases(scenarioData.phases);
    setTransitionYears(scenarioData.transitionYears);
    setSmoothTransition(scenarioData.smoothTransition);
    setMarketReturns(scenarioData.marketReturns || {});
    setSpendingOverrides(scenarioData.spendingOverrides || {});
    setPortfolioOverrides(scenarioData.portfolioOverrides || {});
    setAccounts(scenarioData.accounts);
    setLoadedScenario(scenarioName || "Demo Scenario");
    setActiveTab(targetTab || "phases");
  };


  // ── Export / Import / Reset ─────────────────────────────────────────────────
  const handleExport = () => {
    if (isTrialing) {
      if (window.confirm("Exporting your data backup is a premium feature. Would you like to view our pricing plans and upgrade to unlock exports?")) {
        navigate("/pricing");
      }
      return;
    }
    const blob = new Blob([JSON.stringify(inputs, null, 2)], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = "rsa-backup.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input    = document.createElement("input");
    input.type     = "file";
    input.accept   = ".json";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          const setters = {
            currentAge: setCurrentAge, retirementAge: setRetirementAge,
            lifeExpectancy: setLifeExpectancy, filingStatus: setFilingStatus,
            ss67: setSs67, ssStartAge: setSsStartAge, cola: setCola,
            defaultReturn: setDefaultReturn, inflationRate: setInflationRate,
            targetEndBalance: setTargetEndBalance, phases: setPhases,
            transitionYears: setTransitionYears, smoothTransition: setSmoothTransition,
            marketReturns: setMarketReturns, spendingOverrides: setSpendingOverrides,
            portfolioOverrides: setPortfolioOverrides, accounts: setAccounts,
            loadedScenario: setLoadedScenario,
          };
          Object.entries(setters).forEach(([key, setter]) => {
            if (data[key] != null) setter(data[key]);
          });
          if (data.loadedScenario === undefined) {
            setLoadedScenario(null);
          }
        } catch {
          alert("Invalid file — please select a valid RSA backup.");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleReset = () => {
    if (window.confirm("Reset all data to defaults? This cannot be undone.")) {
      Object.entries(DEFAULTS).forEach(([key, val]) => {
        const setters = {
          currentAge: setCurrentAge, retirementAge: setRetirementAge,
          lifeExpectancy: setLifeExpectancy, filingStatus: setFilingStatus,
          ss67: setSs67, ssStartAge: setSsStartAge, cola: setCola,
          defaultReturn: setDefaultReturn, inflationRate: setInflationRate,
          targetEndBalance: setTargetEndBalance, phases: setPhases,
          transitionYears: setTransitionYears, smoothTransition: setSmoothTransition,
          marketReturns: setMarketReturns, accounts: setAccounts,
        };
        if (setters[key]) setters[key](val);
      });
      setSpendingOverrides({});
      setPortfolioOverrides({});
      setLoadedScenario(null);
    }
  };

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);

  // ── Header button style ─────────────────────────────────────────────────────
  // Buttons sit on the light actions header bar — use dark navy/forest-green tones
  const headerBtn = {
    padding: "6px 12px",
    border: `1px solid ${C.border}`,
    borderRadius: 7,
    background: "#ffffff",
    color: C.navy,
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: FONT_BODY,
    transition: "all 0.15s",
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: FONT_BODY, background: C.pageBg, minHeight: "100vh", display: "flex" }}>
      {/* Fonts — Source Sans 3 + JetBrains Mono */}
      <link
        href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      {/* ══════════ LEFT SIDEBAR ══════════ */}
      <div className="no-print" style={{
        width: 260,
        background: "linear-gradient(180deg, #1c3829 0%, #11261a 100%)",
        borderRight: "2px solid #b8860b",
        color: "#f7f3ea",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <div>
          {/* Logo / Branding */}
          <div onClick={() => navigate('/app')} style={{ padding: "24px 20px", borderBottom: "1px solid rgba(184, 134, 11, 0.2)", cursor: "pointer" }}>
            <div style={{ color: "#f7f3ea", fontSize: 18, fontWeight: 800, letterSpacing: "0.02em" }}>
              <span style={{ color: "#b8860b" }}>◆</span> RSA Planner
            </div>
            <div style={{ color: "rgba(247,243,234,0.5)", fontSize: 11, marginTop: 4 }}>
              Retirement Spending Analyzer
            </div>
          </div>

          {/* Navigation Links */}
          <div style={{ padding: "20px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { id: "phases",       label: "📊 Dashboard" },
              { id: "compare",      label: "📈 vs 4% Rule" },
              { id: "taxopt",       label: "⚡ Tax Optimization Pro" },
              { id: "settings",     label: "👤 Your Data" },
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "none",
                    borderRadius: 8,
                    background: active ? "rgba(184, 134, 11, 0.15)" : "transparent",
                    color: active ? "#fcd34d" : "rgba(247, 243, 234, 0.8)",
                    borderLeft: active ? "4px solid #b8860b" : "4px solid transparent",
                    fontWeight: active ? 700 : 500,
                    fontSize: 14.5,
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: FONT_BODY,
                    transition: "all 0.15s",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    outline: "none",
                  }}
                  onMouseOver={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = "rgba(247, 243, 234, 0.05)";
                      e.currentTarget.style.color = "#f7f3ea";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!active) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "rgba(247, 243, 234, 0.8)";
                    }
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer Info */}
        <div style={{ padding: 20, borderTop: "1px solid rgba(184, 134, 11, 0.1)", fontSize: 11, color: "rgba(247,243,234,0.4)" }}>
          <div>Auto-saved in browser.</div>
          <div style={{ marginTop: 4 }}>Use Export for backups.</div>
        </div>
      </div>

      {/* ══════════ RIGHT PANEL (HEADER + CONTENT + FOOTER) ══════════ */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflowY: "auto" }}>
        
        {/* ══════════ TOP ACTIONS HEADER ══════════ */}
        <div className="no-print" style={{
          background: "#ffffff",
          padding: "16px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `1px solid ${C.border}`,
          boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
        }}>
          <div>
            <div style={{ color: C.navy, fontSize: 14, fontWeight: 600 }}>
              Portfolio: <span style={{ color: C.accent, fontFamily: FONT_MONO }}>{fmtCompact(totalBalance)}</span>
              &nbsp;&nbsp;·&nbsp;&nbsp;
              Goal: <span style={{ color: C.orange, fontFamily: FONT_MONO }}>{fmtCompact(targetEndBalance)}</span> at age {lifeExpectancy}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {saveMsg && (
              <span style={{ fontSize: 11, background: "rgba(45,106,79,0.1)", color: C.accent, padding: "4px 10px", borderRadius: 10, fontWeight: 600 }}>
                {saveMsg}
              </span>
            )}
            <button onClick={() => navigate("/")} style={{ ...headerBtn, background: "rgba(45,106,79,0.05)", borderColor: "rgba(45,106,79,0.15)", color: C.accent }}>
              ⌂ Home
            </button>
            {isTrialing && (
              <button onClick={() => navigate("/pricing")} style={{
                ...headerBtn,
                background: "rgba(245,158,11,0.1)",
                borderColor: "rgba(245,158,11,0.2)",
                color: C.orange,
                fontWeight: 700,
              }}>
                ★ Upgrade to Premium
              </button>
            )}
            <button onClick={handleManageBilling} style={{ ...headerBtn, background: "rgba(184,134,11,0.05)", borderColor: "rgba(184,134,11,0.15)", color: C.orange }}>
              ⚙ Account
            </button>
            <button onClick={handleExport} style={{
              ...headerBtn,
              color: isTrialing ? C.ltGray : C.navy,
            }}>
              {isTrialing ? "🔒 Export" : "💾 Export"}
            </button>
            <button onClick={handleImport} style={headerBtn}>📂 Import</button>
            <button onClick={handleReset}  style={headerBtn}>↺ Reset</button>
            <UserButton appearance={{ elements: { avatarBox: { width: 32, height: 32 } } }} />
          </div>
        </div>

        {/* ── Demo Mode Banner ── */}
        {loadedScenario && (
          <div className="no-print" style={{
            background: "#fffbeb",
            borderBottom: "1px solid #fcd34d",
            padding: "12px 32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#92400e",
            fontSize: 14.5,
            fontWeight: 500,
            transition: "all 0.2s",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>⚠️</span>
              <span>
                <strong>Simulated Data Active:</strong> You are currently viewing the <strong>{loadedScenario}</strong> case study. To work with your own data, click <span onClick={() => setActiveTab("settings")} style={{ textDecoration: "underline", fontWeight: 700, cursor: "pointer", color: C.accent }}>Your Data</span>. To clear this demo and start fresh, click <span onClick={handleReset} style={{ textDecoration: "underline", fontWeight: 700, cursor: "pointer", color: C.accent }}>Reset</span> in the top right.
              </span>
            </div>
            <button
              onClick={() => setLoadedScenario(null)}
              style={{
                background: "transparent",
                border: "none",
                color: "#b45309",
                cursor: "pointer",
                fontSize: 18,
                fontWeight: 700,
                lineHeight: 1,
              }}
              title="Dismiss banner"
            >
              ×
            </button>
          </div>
        )}

        {/* ══════════ CONTENT AREA ══════════ */}
        <div style={{ padding: "32px", flex: 1 }}>

          {activeTab === "settings" && (
            <SettingsTab
              inputs={inputs}
              setField={setField}
              accounts={accounts}
              setAccounts={setAccounts}
              onLoadScenario={handleLoadScenario}
            />
          )}

          {activeTab === "phases" && (
            <SpendingPhasesTab
              inputs={inputs}
              setField={setField}
              solverData={solverData}
              loading={solverLoading}
              error={solverError}
              marketReturns={marketReturns}
              setMarketReturns={setMarketReturns}
              spendingOverrides={spendingOverrides}
              setSpendingOverrides={setSpendingOverrides}
              portfolioOverrides={portfolioOverrides}
              setPortfolioOverrides={setPortfolioOverrides}
              compareData={compareData}
              compareLoading={compareLoading}
              onViewComparison={() => setActiveTab("compare")}
            />
          )}

          {activeTab === "taxopt" && (
            <TaxOptimizationTab inputs={inputs} />
          )}

          {activeTab === "compare" && (
            <CompareTab
              compareData={compareData}
              loading={compareLoading}
              error={compareError}
              baseSpending={solverData?.baseSpending || 0}
              inputs={inputs}
            />
          )}

        </div>

        {/* ══════════ FOOTER ══════════ */}
        <div className="no-print" style={{
          padding: "16px 32px",
          textAlign: "center",
          fontSize: 13,
          color: C.ltGray,
          borderTop: `1px solid ${C.border}`,
          background: "#ffffff",
        }}>
          This is a planning tool — consult a financial advisor. All calculations run locally in memory.
        </div>

      </div>
    </div>
  );
}
