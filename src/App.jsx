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

import InstructionsTab      from "./components/InstructionsTab";
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
  const [activeTab, setActiveTab] = useState("instructions");
  const [saveMsg,   setSaveMsg]   = useState("");

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
    marketReturns, spendingOverrides, accounts, portfolioOverrides,
  ]);

  // ── API hooks ───────────────────────────────────────────────────────────────
  const { data: solverData,  loading: solverLoading,  error: solverError  } = useSolverAPI(inputs);
  const { data: compareData, loading: compareLoading, error: compareError } = useCompareAPI(inputs, activeTab === "compare");

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
          };
          Object.entries(setters).forEach(([key, setter]) => {
            if (data[key] != null) setter(data[key]);
          });
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
    }
  };

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);

  // ── Header button style ─────────────────────────────────────────────────────
  // Buttons sit on the dark forest-green header — use cream/ivory tones
  const headerBtn = {
    padding: "5px 11px",
    border: "1px solid rgba(247,243,234,0.18)",
    borderRadius: 7,
    background: "rgba(247,243,234,0.08)",
    color: "#f7f3ea",
    fontSize: 11,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: FONT_BODY,
    transition: "background 0.15s",
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: FONT_BODY, background: C.pageBg, minHeight: "100vh" }}>
      {/* Fonts — Source Sans 3 + JetBrains Mono */}
      <link
        href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      {/* ══════════ HEADER ══════════ */}
      <div className="no-print" style={{
        background: "linear-gradient(135deg,#1c3829 0%,#2d5a47 50%,#1c3829 100%)",
        padding: "13px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "2px solid #b8860b",
      }}>
        <div>
          <div onClick={() => navigate('/')} style={{ color: "#f7f3ea", fontSize: 20, fontWeight: 800, cursor: "pointer" }}>
            <span style={{ color: "#b8860b" }}>◆</span> Retirement Spending Analyzer
          </div>
          <div style={{ color: "rgba(247,243,234,0.55)", fontSize: 13, marginTop: 2 }}>
            Spend more when you're active, less when you slow down
            &nbsp;·&nbsp; Portfolio: {fmtCompact(totalBalance)}
            &nbsp;·&nbsp; Goal: {fmtCompact(targetEndBalance)} at {lifeExpectancy}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {saveMsg && (
            <span style={{ fontSize: 11, background: "rgba(45,106,79,0.3)", color: "#a7f3d0", padding: "3px 10px", borderRadius: 10, fontWeight: 600 }}>
              {saveMsg}
            </span>
          )}
          <button onClick={() => navigate("/")} style={{ ...headerBtn, background: "rgba(45,106,79,0.2)", borderColor: "rgba(45,106,79,0.4)", color: "#a7f3d0" }}>
            ⌂ Home
          </button>
          {isTrialing && (
            <button onClick={() => navigate("/pricing")} style={{
              ...headerBtn,
              background: "rgba(245,158,11,0.25)",
              borderColor: "rgba(245,158,11,0.5)",
              color: "#fcd34d",
              fontWeight: 700,
            }}>
              ★ Upgrade to Premium
            </button>
          )}
          <button onClick={handleManageBilling} style={{ ...headerBtn, background: "rgba(184,134,11,0.2)", borderColor: "rgba(184,134,11,0.4)", color: "#fcd34d" }}>
            ⚙ Account
          </button>
          <button onClick={handleExport} style={{
            ...headerBtn,
            color: isTrialing ? "rgba(247,243,234,0.6)" : "#f7f3ea",
          }}>
            {isTrialing ? "🔒 Export" : "💾 Export"}
          </button>
          <button onClick={handleImport} style={headerBtn}>📂 Import</button>
          <button onClick={handleReset}  style={headerBtn}>↺ Reset</button>
          <UserButton appearance={{ elements: { avatarBox: { width: 32, height: 32 } } }} />
        </div>
      </div>
      {/* ══════════ TAB BAR ══════════ */}
      <div className="no-print" style={{
        background: "#f7f3ea",
        borderBottom: "2px solid #b8860b",
        padding: "0 32px",
        display: "flex",
        gap: 4,
      }}>
        {[
          { id: "instructions", label: "Instructions" },
          { id: "settings",     label: "Settings & Accounts" },
          { id: "phases",       label: "Spending Phases" },
          { id: "compare",      label: "vs 4% Rule" },
          { id: "taxopt", label: "⚡ Tax Optimization Pro" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.comingSoon && setActiveTab(tab.id)}
            title={tab.comingSoon ? "Coming Soon" : undefined}
            style={{
              padding: "13px 20px",
              border: "none",
              borderBottom: activeTab === tab.id ? `3px solid #2d6a4f` : "3px solid transparent",
              background: "transparent",
              color: tab.comingSoon ? C.ltGray : activeTab === tab.id ? "#2d6a4f" : C.gray,
              fontWeight: activeTab === tab.id ? 700 : 500,
              fontSize: 15,
              cursor: tab.comingSoon ? "default" : "pointer",
              fontFamily: FONT_BODY,
              transition: "all 0.2s",
              opacity: tab.comingSoon ? 0.65 : 1,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {tab.label}
            {tab.comingSoon && (
              <span style={{
                fontSize: 9, fontWeight: 700, letterSpacing: "0.06em",
                textTransform: "uppercase", padding: "2px 7px", borderRadius: 100,
                background: "#b8860b", color: "#fff", whiteSpace: "nowrap",
              }}>Soon</span>
            )}
          </button>
        ))}
      </div>
      {/* ══════════ TAB CONTENT ══════════ */}
      <div style={{ padding: "24px 32px", maxWidth: 1200, margin: "0 auto" }}>

        {activeTab === "instructions" && <InstructionsTab />}

        {activeTab === "settings" && (
          <SettingsTab
            inputs={inputs}
            setField={setField}
            accounts={accounts}
            setAccounts={setAccounts}
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
        padding: "12px 32px",
        textAlign: "center",
        fontSize: 14,
        color: C.ltGray,
        borderTop: `1px solid ${C.border}`,
      }}>
        Auto-saved in browser. Use Export for backups. This is a planning tool — consult a financial advisor.
      </div>
    </div>
  );
}
