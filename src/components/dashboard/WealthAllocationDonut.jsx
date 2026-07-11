/**
 * WealthAllocationDonut.jsx — Current portfolio balance grouped by tax treatment.
 */
import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { C, FONT_BODY, FONT_MONO, fmtCompact } from "../../utils/theme";

const BUCKET_META = {
  "Pre-tax": { label: "Pre-tax", color: C.accent },
  "Tax-free": { label: "Roth", color: C.green },
  "Taxable": { label: "Taxable", color: C.goGo },
};

export default function WealthAllocationDonut({ accounts }) {
  const buckets = useMemo(() => {
    const sums = { "Pre-tax": 0, "Tax-free": 0, "Taxable": 0 };
    (accounts || []).forEach((a) => {
      if (sums[a.taxTreatment] != null) sums[a.taxTreatment] += a.balance;
    });
    return Object.entries(sums)
      .map(([key, value]) => ({ key, value, ...BUCKET_META[key] }))
      .filter((b) => b.value > 0);
  }, [accounts]);

  const total = buckets.reduce((s, b) => s + b.value, 0);

  return (
    <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 24px" }} className="print-card">
      <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 16 }}>Wealth Allocation</div>

      {buckets.length === 0 ? (
        <div style={{ fontSize: 13, color: C.gray, padding: "20px 0" }}>No account balances yet.</div>
      ) : (
        <>
          <div style={{ position: "relative", height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={buckets}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  stroke="none"
                >
                  {buckets.map((b) => (
                    <Cell key={b.key} fill={b.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => fmtCompact(value)} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{
              position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
              textAlign: "center", pointerEvents: "none",
            }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 18, fontWeight: 800, color: C.navy }}>{fmtCompact(total)}</div>
              <div style={{ fontSize: 10, color: C.gray, textTransform: "uppercase", letterSpacing: "0.06em" }}>Total</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
            {buckets.map((b) => (
              <div key={b.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: FONT_BODY, fontSize: 12 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6, color: C.navy }}>
                  <span style={{ width: 9, height: 9, borderRadius: "50%", background: b.color, display: "inline-block" }} />
                  {b.label}
                </span>
                <span style={{ fontFamily: FONT_MONO, color: C.gray }}>
                  {fmtCompact(b.value)} <span style={{ color: C.ltGray }}>({total > 0 ? Math.round((b.value / total) * 100) : 0}%)</span>
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
