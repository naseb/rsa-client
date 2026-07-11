/**
 * GrowthChart.jsx — Portfolio balance over time, with a time-range toggle.
 */
import { useMemo, useState } from "react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
} from "recharts";
import { C, FONT_BODY, FONT_MONO, fmtCompact, fmtFull, PHASE_COLORS } from "../../utils/theme";

function ChartTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  const phaseColor = PHASE_COLORS[d.phaseName] || C.gray;
  return (
    <div style={{
      background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 8,
      padding: "8px 12px", fontFamily: FONT_MONO, fontSize: 12, color: C.navy,
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    }}>
      <div style={{ fontFamily: FONT_BODY, fontWeight: 700, marginBottom: 4 }}>
        Age {d.age} · {d.year}
      </div>
      <div>{fmtFull(d.totalEnd)}</div>
      {d.isRetired && (
        <div style={{ fontFamily: FONT_BODY, color: phaseColor, fontSize: 11, marginTop: 2 }}>
          {d.phaseName}
        </div>
      )}
    </div>
  );
}

export default function GrowthChart({ years, currentAge, retirementAge }) {
  const [range, setRange] = useState("full");

  const horizon = years.length ? years[years.length - 1].age - currentAge : 0;

  const pills = useMemo(() => {
    const opts = [];
    if (horizon > 10) opts.push({ id: "10", label: "Next 10 Yrs" });
    if (horizon > 20) opts.push({ id: "20", label: "Next 20 Yrs" });
    opts.push({ id: "full", label: "Full Plan" });
    return opts;
  }, [horizon]);

  const filteredYears = useMemo(() => {
    if (range === "10") return years.filter((y) => y.age <= currentAge + 10);
    if (range === "20") return years.filter((y) => y.age <= currentAge + 20);
    return years;
  }, [years, range, currentAge]);

  return (
    <div style={{ background: C.cardBg, border: `1px solid ${C.border}`, borderRadius: 12, padding: "20px 24px" }} className="print-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Portfolio Growth Over Time</div>
        <div className="no-print" style={{ display: "flex", gap: 6 }}>
          {pills.map((p) => (
            <button
              key={p.id}
              onClick={() => setRange(p.id)}
              style={{
                fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 8,
                border: `1px solid ${range === p.id ? C.accent : C.border}`,
                background: range === p.id ? C.accent : "#fff",
                color: range === p.id ? "#fff" : C.gray,
                cursor: "pointer", fontFamily: FONT_BODY,
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={filteredYears} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
          <XAxis
            dataKey="age"
            tickLine={false}
            axisLine={{ stroke: C.border }}
            tick={{ fontSize: 11, fill: C.gray, fontFamily: FONT_BODY }}
          />
          <YAxis
            tickFormatter={fmtCompact}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: C.gray, fontFamily: FONT_BODY }}
            width={56}
          />
          <Tooltip content={<ChartTooltip />} />
          {retirementAge >= filteredYears[0]?.age && retirementAge <= filteredYears[filteredYears.length - 1]?.age && (
            <ReferenceLine x={retirementAge} stroke={C.orange} strokeDasharray="4 4" />
          )}
          <Area type="monotone" dataKey="totalEnd" stroke={C.accent} fill={C.accent} fillOpacity={0.12} strokeWidth={2.5} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
