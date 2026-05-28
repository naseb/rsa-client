/**
 * InstructionsTab.jsx — Getting Started & Help
 * ==============================================
 * Static content explaining how to use the app.
 * Identical to the original app's Instructions tab.
 */

import { C, FONT_BODY } from "../utils/theme";

export default function InstructionsTab() {
  return (
    <div style={{ maxWidth: 800 }}>
      {/* Hero banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0f172a 100%)",
          borderRadius: 16,
          padding: "36px 40px",
          marginBottom: 24,
          color: "#fff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute", top: -40, right: -40, width: 250, height: 250,
            background: "radial-gradient(circle,rgba(245,158,11,0.1) 0%,transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
          <span style={{ color: C.goGo }}>◆</span> Retirement Spending Allowance
        </div>
        <div style={{ fontSize: 15, color: "#94a3b8", lineHeight: 1.6 }}>
          Spend more when you're active, less when you slow down. This tool calculates
          the maximum sustainable spending across three retirement phases while ensuring
          your portfolio lasts.
        </div>
      </div>

      {/* Getting Started */}
      <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12, padding: "24px 28px", marginBottom: 20 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 16 }}>Getting Started</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Step 1 */}
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ minWidth: 36, height: 36, borderRadius: "50%", background: C.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16 }}>1</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 4 }}>Settings & Accounts</div>
              <div style={{ fontSize: 13, color: C.slate, lineHeight: 1.6 }}>
                Start by entering your personal information — current age, retirement age, and life expectancy.
                Set your Social Security benefit at full retirement age (67), your planned claim age, and COLA assumption.
                Then add your investment accounts with current balances, monthly contributions, expected returns,
                and tax treatment (Pre-tax, Tax-free, or Taxable). Set employer match percentage and annual match limit
                for accounts with matching. Finally, set your target ending balance — the amount you want left at the end of your plan.
              </div>
            </div>
          </div>
          {/* Step 2 */}
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ minWidth: 36, height: 36, borderRadius: "50%", background: C.goGo, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16 }}>2</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 4 }}>Spending Phases</div>
              <div style={{ fontSize: 13, color: C.slate, lineHeight: 1.6 }}>
                This is where you see your results. The solver automatically calculates the maximum annual spending
                in your Go-Go (active) phase that keeps your portfolio on target. Your three phases are:
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 10, flexWrap: "wrap" }}>
                <div style={{ background: C.goGoBg, border: `1px solid ${C.goGoBorder}`, borderRadius: 8, padding: "8px 14px", fontSize: 12 }}>
                  <span style={{ fontWeight: 700, color: C.goGo }}>Go-Go</span> — Active years. Travel, hobbies, dining. Highest spending.
                </div>
                <div style={{ background: C.slowGoBg, border: `1px solid ${C.slowGoBorder}`, borderRadius: 8, padding: "8px 14px", fontSize: 12 }}>
                  <span style={{ fontWeight: 700, color: C.slowGo }}>Slow-Go</span> — Winding down. Less travel, more leisure at home.
                </div>
                <div style={{ background: C.noGoBg, border: `1px solid ${C.noGoBorder}`, borderRadius: 8, padding: "8px 14px", fontSize: 12 }}>
                  <span style={{ fontWeight: 700, color: C.noGo }}>No-Go</span> — Quiet years. Minimal activity, lower expenses.
                </div>
              </div>
              <div style={{ fontSize: 13, color: C.slate, lineHeight: 1.6, marginTop: 10 }}>
                Adjust the start age and spending percentage for each phase. Toggle smooth transitions
                to ramp spending gradually between phases instead of hard cutoffs.
              </div>
            </div>
          </div>
          {/* Step 3 */}
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ minWidth: 36, height: 36, borderRadius: "50%", background: C.green, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16 }}>3</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 4 }}>Year-by-Year Projection</div>
              <div style={{ fontSize: 13, color: C.slate, lineHeight: 1.6 }}>
                Scroll down on the Spending Phases tab to see the full projection table.
                Click any row to expand detailed breakdowns including account balances,
                withdrawal sources, tax impact, and RMD information.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Features */}
      <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12, padding: "24px 28px", marginBottom: 20 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 16 }}>Advanced Features</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ padding: "14px 18px", background: "#fffbeb", border: `1px solid ${C.goGoBorder}`, borderRadius: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 4 }}>📊 Market Return Overrides</div>
            <div style={{ fontSize: 12, color: C.slate, lineHeight: 1.5 }}>
              Model market crashes or booms by entering a return percentage for any year in the projection table's
              Return column. Enter -20 for a crash year or 18 for a boom year. The solver automatically recalculates
              a new sustainable spending level from that point forward.
            </div>
          </div>
          <div style={{ padding: "14px 18px", background: C.redBg, border: "1px solid #fecaca", borderRadius: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 4 }}>⚡ Editable Portfolio Column</div>
            <div style={{ fontSize: 12, color: C.slate, lineHeight: 1.5 }}>
              Every portfolio value during retirement is clickable. Type your actual portfolio balance,
              hit Enter, and the solver recalculates spending from that point forward based on your real number.
            </div>
          </div>
          <div style={{ padding: "14px 18px", background: C.greenBg, border: "1px solid #a7f3d0", borderRadius: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 4 }}>💰 Spending +/- Overrides</div>
            <div style={{ fontSize: 12, color: C.slate, lineHeight: 1.5 }}>
              Plan for one-time expenses or savings in specific years using the +/- column.
              Enter 50000 for a new car purchase at age 68, or -10000 for a lean year.
            </div>
          </div>
          <div style={{ padding: "14px 18px", background: C.blueBg, border: "1px solid #bfdbfe", borderRadius: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 4 }}>💾 Export & Import</div>
            <div style={{ fontSize: 12, color: C.slate, lineHeight: 1.5 }}>
              Your data auto-saves in your browser. Use the Export button to save a JSON backup file,
              and Import to restore it on another device or browser. Use Reset to clear everything and start fresh.
            </div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "16px 0", fontSize: 12, color: C.ltGray }}>
        This is a planning tool — not financial advice. Consult a qualified financial advisor for decisions about your retirement.
      </div>
    </div>
  );
}
