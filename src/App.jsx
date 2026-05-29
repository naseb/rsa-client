/**
 * App.jsx — Main Application Shell
 * ==================================
 * This is the top-level component that:
 * - Manages all user input state
 * - Calls the solver API via the useSolverAPI hook
 * - Renders the header, tab bar, and active tab content
 * - Handles localStorage save/load, export, import, reset
 *
 * NO SOLVER LOGIC LIVES HERE. The solver runs on the API server.
 */

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSolverAPI, useCompareAPI } from "./hooks/useSolverAPI";
import { C, FONT_BODY, FONT_MONO, fmtCompact, STORAGE_KEY } from "./utils/theme";
import { DEFAULTS } from "./utils/defaults";

import InstructionsTab from "./components/InstructionsTab";
import TaxOptimizationTab from "./components/TaxOptimizationTab";
import { useSubscription } from "./context/SubscriptionContext";
import SettingsTab from "./components/SettingsTab";
import SpendingPhasesTab from "./components/SpendingPhasesTab";
import CompareTab from "./components/CompareTab";

export default function App() {
  const navigate = useNavigate();
  const { isPro } = useSubscription();

  // --- Tab state ---
  const [activeTab, setActiveTab] = useState("instructions");
  const [saveMsg, setSaveMsg] = useState("");

  // --- All user input state ---
  const [currentAge, setCurrentAge] = useState(DEFAULTS.currentAge);
  const [retirementAge, setRetirementAge] = useState(DEFAULTS.retirementAge);
  const [lifeExpectancy, setLifeExpectancy] = useState(DEFAULTS.lifeExpectancy);
  const [filingStatus, setFilingStatus] = useState(DEFAULTS.filingStatus);
  const [ss67, setSs67] = useState(DEFAULTS.ss67);
  const [ssStartAge, setSsStartAge] = useState(DEFAULTS.ssStartAge);
  const [cola, setCola] = useState(DEFAULTS.cola);
  const [defaultReturn, setDefaultReturn] = useState(DEFAULTS.defaultReturn);
  const [inflationRate, setInflationRate] = useState(DEFAULTS.inflationRate);
  const [targetEndBalance, setTargetEndBalance] = useState(DEFAULTS.targetEndBalance);
  const [phases, setPhases] = useState(DEFAULTS.phases);
  const [transitionYears, setTransitionYears] = useState(DEFAULTS.transitionYears);
  const [smoothTransition, setSmoothTransition] = useState(DEFAULTS.smoothTransition);
  const [marketReturns, setMarketReturns] = useState(DEFAULTS.marketReturns);
  const [spendingOverrides, setSpendingOverrides] = useState({});
  const [portfolioOverrides, setPortfolioOverrides] = useState({});
  const [accounts, setAccounts] = useState(DEFAULTS.accounts);

  // --- Load from localStorage on mount ---
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
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
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
    }
  }, []);

  // --- Build the inputs object that gets sent to the API ---
  const inputs = {
    currentAge, retirementAge, lifeExpectancy, filingStatus,
    ss67, ssStartAge, cola, defaultReturn, inflationRate, targetEndBalance,
    phases, transitionYears, smoothTransition,
    marketReturns, spendingOverrides, portfolioOverrides, accounts,
  };

  // --- Auto-save to localStorage (debounced) ---
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
    ss67, ssStartAge, cola, defaultReturn, inflationRate, targetEndBalance,
    phases, transitionYears, smoothTransition,
    marketReturns, spendingOverrides, accounts, portfolioOverrides,
  ]);

  // --- Call the Solver API (debounced) ---
  const { data: solverData, loading: solverLoading, error: solverError } = useSolverAPI(inputs);

  // --- Call the Compare API (only when tab is active) ---
  const { data: compareData, loading: compareLoading, error: compareError } = useCompareAPI(inputs, activeTab === "compare");

  // --- Helper to update a single field ---
  const setField = (key, value) => {
    const setters = {
      currentAge: setCurrentAge, retirementAge: setRetirementAge,
      lifeExpectancy: setLifeExpectancy, filingStatus: setFilingStatus,
      ss67: setSs67, ssStartAge: setSsStartAge, cola: setCola,
      defaultReturn: setDefaultReturn, inflationRate: setInflationRate,
      targetEndBalance: setTargetEndBalance, phases: setPhases,
      transitionYears: setTransitionYears, smoothTransition: setSmoothTransition,
    };
    if (setters[key]) setters[key](value);
  };

  // --- Export/Import/Reset ---
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(inputs, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "spending-phases-backup.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
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
          alert("Invalid file");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleReset = () => {
    if (window.confirm("Reset all data to defaults?")) {
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

  // --- Button style helper ---
  const headerBtn = {
    padding: "5px 11px",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 7,
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    fontSize: 11,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: FONT_BODY,
  };

  return (
    <div style={{ fontFamily: FONT_BODY, background: C.pageBg, minHeight: "100vh" }}>
      {/* Google Fonts (loaded in index.html, but also here as fallback) */}
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      {/* ===== HEADER ===== */}
      <div
        style={{
          background: "linear-gradient(135deg,#0f172a 0%,#1e3a5f 50%,#0f172a 100%)",
          padding: "12px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ color: "#fff", fontSize: 20, fontWeight: 800 }}>
            <span style={{ color: C.goGo }}>◆</span> Retirement Spending Allowance
          </div>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, marginTop: 2 }}>
            Spend more when you're active, less when you slow down | Portfolio: {fmtCompact(totalBalance)} | Goal: {fmtCompact(targetEndBalance)} at {lifeExpectancy}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {saveMsg && (
            <span style={{ fontSize: 11, background: "rgba(39,174,96,0.2)", color: "#a9dfbf", padding: "3px 10px", borderRadius: 10, fontWeight: 600 }}>
              {saveMsg}
            </span>
          )}
          <button onClick={() => navigate("/")} style={{ ...headerBtn, background: "rgba(16,185,129,0.15)", borderColor: "rgba(16,185,129,0.3)", color: "#10b981" }}>⌂ Home</button>
          <button onClick={handleExport} style={headerBtn}>💾 Export</button>
          <button onClick={handleImport} style={headerBtn}>📂 Import</button>
          <button onClick={handleReset} style={headerBtn}>↺ Reset</button>
        </div>
      </div>

      {/* ===== TAB BAR ===== */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${C.border}`, padding: "0 32px", display: "flex", gap: 4 }}>
        {[
          { id: "instructions", label: "Instructions" },
          { id: "settings", label: "Settings & Accounts" },
          { id: "phases", label: "Spending Phases" },
          { id: "compare", label: "vs 4% Rule" },
          { id: "taxopt", label: isPro ? "⚡ Tax Optimization" : "🔒 Tax Optimization Pro" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "13px 20px",
              border: "none",
              borderBottom: activeTab === tab.id ? `3px solid ${C.accent}` : "3px solid transparent",
              background: "transparent",
              color: activeTab === tab.id ? C.accent : C.gray,
              fontWeight: activeTab === tab.id ? 700 : 500,
              fontSize: 14,
              cursor: "pointer",
              fontFamily: FONT_BODY,
              transition: "all 0.2s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===== TAB CONTENT ===== */}
      <div style={{ padding: "20px 32px", maxWidth: 1200, margin: "0 auto" }}>
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
          />
        )}
      </div>

      {/* ===== FOOTER ===== */}
      <div style={{ padding: "10px 32px", textAlign: "center", fontSize: 11, color: "#94a3b8", borderTop: `1px solid ${C.border}` }}>
        Auto-saved in browser. Use Export for backups. This is a planning tool — consult a financial advisor.
      </div>
    </div>
  );
}
