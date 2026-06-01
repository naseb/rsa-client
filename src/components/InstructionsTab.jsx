/**
 * InstructionsTab.jsx — Getting Started & Help
 * ==============================================
 * Static content explaining how to use the app.
 * Font sizes increased throughout for 50+ readability.
 */

import { C, FONT_BODY } from "../utils/theme";

export default function InstructionsTab() {
  return (
    <div style={{ maxWidth: 820 }}>

      {/* Hero banner */}
      <div style={{
        background: "linear-gradient(135deg, #1c3829 0%, #2d5a47 40%, #1c3829 100%)",
        borderRadius: 16, padding: "40px 44px", marginBottom: 28,
        color: "#fff", position: "relative", overflow: "hidden", borderBottom: "2px solid #b8860b",
      }}>
        <div style={{
          position: "absolute", top: -40, right: -40, width: 250, height: 250,
          background: "radial-gradient(circle,rgba(184,134,11,0.15) 0%,transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ fontSize: 30, fontWeight: 800, marginBottom: 12 }}>
          <span style={{ color: "#b8860b" }}>◆</span> Retirement Spending Analyzer
        </div>
        <div style={{ fontSize: 18, color: "rgba(247,243,234,0.75)", lineHeight: 1.7 }}>
          Spend more when you're active, less when you slow down. This tool calculates
          the maximum sustainable spending across three retirement phases while ensuring
          your portfolio lasts.
        </div>
      </div>

      {/* Getting Started */}
      <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12, padding: "28px 32px", marginBottom: 24 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: C.navy, marginBottom: 24 }}>Getting Started</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

          {/* Step 1 */}
          <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
            <div style={{ minWidth: 40, height: 40, borderRadius: "50%", background: C.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18, flexShrink: 0 }}>1</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.navy, marginBottom: 8 }}>Settings &amp; Accounts</div>
              <div style={{ fontSize: 16, color: C.slate, lineHeight: 1.75 }}>
                Start by entering your personal information — current age, retirement age, and life expectancy.
                Set your Social Security benefit at full retirement age (67), your planned claim age, and COLA assumption.
                Then add your investment accounts with current balances, monthly contributions, expected returns,
                and tax treatment (Pre-tax, Tax-free, or Taxable). Set employer match percentage and annual match limit
                for accounts with matching. Finally, set your target ending balance — the amount you want left at the end of your plan.
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
            <div style={{ minWidth: 40, height: 40, borderRadius: "50%", background: C.goGo, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18, flexShrink: 0 }}>2</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.navy, marginBottom: 8 }}>Spending Phases</div>
              <div style={{ fontSize: 16, color: C.slate, lineHeight: 1.75 }}>
                This is where you see your results. The solver automatically calculates the maximum annual spending
                in your Go-Go (active) phase that keeps your portfolio on target. Your three phases are:
              </div>
              <div style={{ display: "flex", gap: 14, marginTop: 14, flexWrap: "wrap" }}>
                <div style={{ background: C.goGoBg, border: `1px solid ${C.goGoBorder}`, borderRadius: 10, padding: "10px 18px", fontSize: 15 }}>
                  <span style={{ fontWeight: 700, color: C.goGo }}>Go-Go</span> — Active years. Travel, hobbies, dining. Highest spending.
                </div>
                <div style={{ background: C.slowGoBg, border: `1px solid ${C.slowGoBorder}`, borderRadius: 10, padding: "10px 18px", fontSize: 15 }}>
                  <span style={{ fontWeight: 700, color: C.slowGo }}>Slow-Go</span> — Winding down. Less travel, more leisure at home.
                </div>
                <div style={{ background: C.noGoBg, border: `1px solid ${C.noGoBorder}`, borderRadius: 10, padding: "10px 18px", fontSize: 15 }}>
                  <span style={{ fontWeight: 700, color: C.noGo }}>No-Go</span> — Quiet years. Minimal activity, lower expenses.
                </div>
              </div>
              <div style={{ fontSize: 16, color: C.slate, lineHeight: 1.75, marginTop: 14 }}>
                Adjust the start age and spending percentage for each phase. Toggle smooth transitions
                to ramp spending gradually between phases instead of hard cutoffs.
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
            <div style={{ minWidth: 40, height: 40, borderRadius: "50%", background: C.green, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18, flexShrink: 0 }}>3</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.navy, marginBottom: 8 }}>Year-by-Year Projection &amp; Annual Review</div>
              <div style={{ fontSize: 16, color: C.slate, lineHeight: 1.75 }}>
                Scroll down on the Spending Phases tab to see the full projection table.
                Click any row to expand detailed breakdowns including account balances,
                withdrawal sources, tax impact, and RMD information.
              </div>
              <div style={{ marginTop: 14, background: "#f8fafc", borderRadius: 10, padding: "16px 20px", border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 8 }}>🔄 Annual Review Workflow (Keep Your Plan Up-to-Date)</div>
                <div style={{ fontSize: 15, color: C.slate, lineHeight: 1.65 }}>
                  Return to this portal once a year (e.g., every January) to update your numbers with actual data and see how the market has impacted your future:
                  <ul style={{ margin: "8px 0 0 0", paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
                    <li><strong>Option A (Simple &amp; Fast):</strong> Locate the current year row and type your actual total portfolio balance directly in the <strong>Portfolio</strong> column. The solver will automatically recalculate a new sustainable spending corridor forward from this new real balance.</li>
                    <li><strong>Option B (Historical Return %):</strong> Enter the actual investment return percentage you achieved for the past year in the <strong>Return</strong> column. The system will compound this change and adjust your spending plan.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Advanced Features */}
      <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12, padding: "28px 32px", marginBottom: 24 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: C.navy, marginBottom: 24 }}>Advanced Features</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

          <div style={{ padding: "18px 22px", background: "#fffbeb", border: `1px solid ${C.goGoBorder}`, borderRadius: 10 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: C.navy, marginBottom: 8 }}>📊 Market Return Overrides</div>
            <div style={{ fontSize: 16, color: C.slate, lineHeight: 1.75 }}>
              Model market crashes or booms by entering a return percentage for any year in the projection table's
              Return column. Enter <strong>-20</strong> for a crash year or <strong>18</strong> for a boom year. The solver automatically recalculates
              a new sustainable spending level from that point forward.
            </div>
          </div>

          <div style={{ padding: "18px 22px", background: C.redBg, border: "1px solid #fecaca", borderRadius: 10 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: C.navy, marginBottom: 8 }}>⚡ Editable Portfolio Column</div>
            <div style={{ fontSize: 16, color: C.slate, lineHeight: 1.75 }}>
              Every portfolio value during retirement is clickable. Type your actual portfolio balance,
              hit Enter, and the solver recalculates spending from that point forward based on your real number.
            </div>
          </div>

          <div style={{ padding: "18px 22px", background: C.greenBg, border: "1px solid #a7f3d0", borderRadius: 10 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: C.navy, marginBottom: 8 }}>💰 Spending +/- Overrides</div>
            <div style={{ fontSize: 16, color: C.slate, lineHeight: 1.75 }}>
              Plan for one-time expenses or savings in specific years using the +/- column.
              Enter <strong>50000</strong> for a new car purchase at age 68, or <strong>-10000</strong> for a lean year.
            </div>
          </div>

          <div style={{ padding: "18px 22px", background: C.blueBg, border: "1px solid #bfdbfe", borderRadius: 10 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: C.navy, marginBottom: 8 }}>💾 Export &amp; Import</div>
            <div style={{ fontSize: 16, color: C.slate, lineHeight: 1.75 }}>
              Your data auto-saves in your browser. Use the <strong>Export</strong> button to save a JSON backup file,
              and <strong>Import</strong> to restore it on another device or browser. Use <strong>Reset</strong> to clear everything and start fresh.
            </div>
          </div>

        </div>
      </div>

      {/* Tax Optimization note */}
      <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12, padding: "28px 32px", marginBottom: 24 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: C.navy, marginBottom: 16 }}>Tax Optimization Pro</div>
        <div style={{ fontSize: 16, color: C.slate, lineHeight: 1.75 }}>
          The <strong>Tax Optimization Pro</strong> tab (available on the Pro Annual plan) analyzes your retirement
          projection and identifies three types of tax-saving opportunities:
        </div>
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { icon: "◆", label: "Bracket Filling", desc: "Pull more Pre-tax income in years where your bracket has unused room, reducing future RMDs." },
            { icon: "⟳", label: "Roth Conversion Ladder", desc: "Convert Pre-tax to Roth during your pre-RMD window to lock in lower tax rates now." },
            { icon: "⇄", label: "Dynamic Withdrawal Sequencing", desc: "Flag years where changing the standard withdrawal order (Taxable → Roth → Pre-tax) saves money." },
          ].map(f => (
            <div key={f.label} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "12px 16px", background: "#f8fafc", borderRadius: 8, border: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{f.icon}</span>
              <div>
                <span style={{ fontSize: 16, fontWeight: 700, color: C.navy }}>{f.label} — </span>
                <span style={{ fontSize: 16, color: C.slate }}>{f.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "16px 0", fontSize: 15, color: C.ltGray }}>
        This is a planning tool — not financial advice. Consult a qualified financial advisor for decisions about your retirement.
      </div>

    </div>
  );
}
