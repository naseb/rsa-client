import { fmtFull } from "./theme";

/**
 * planStatus.js — Derives a plain-English plan status from solver output.
 *
 * There is no Monte Carlo simulation yet, so this is NOT a probability —
 * it's a read of whether the deterministic solver found a spending path
 * that survives to life expectancy, plus whether that path required a
 * downward correction along the way.
 *
 * Three tiers, checked worst-first so a genuine depletion risk is never
 * masked as merely a "caution":
 *   - at-risk: the solver couldn't find a spending level that avoids
 *     running out of money (bottomed out at $0, or the portfolio hits
 *     zero before life expectancy in some retired year).
 *   - caution: `solve()`/`solveWithOverrides()` always finds *some*
 *     sustainable spending level by construction — a simulated market
 *     downturn (a return override in the Year-by-Year table) triggers a
 *     checkpoint re-solve that quietly LOWERS spending rather than
 *     failing outright. `resetSpending` is only non-null when that
 *     re-solve genuinely reduced spending (see solver/index.js's
 *     `resetSpending: ... < baseSpending ? ... : null` guard) — a boom
 *     override never lands here. This tier is the visible flag for that
 *     silent cut.
 *   - on-track: no correction needed, spending holds as originally solved.
 */
export function derivePlanStatus(solverData, lifeExpectancy) {
  if (!solverData || !solverData.years) {
    return { status: "on-track", statusDetail: "" };
  }

  const isAtRisk =
    solverData.baseSpending === 0 ||
    solverData.years.some((y) => y.isRetired && y.totalEnd <= 0 && y.age < lifeExpectancy);

  if (isAtRisk) {
    return {
      status: "at-risk",
      statusDetail: `Your portfolio is projected to run out before age ${lifeExpectancy} at current spending — consider reducing Go-Go spending or adjusting phases below.`,
    };
  }

  if (solverData.resetSpending != null) {
    return {
      status: "caution",
      statusDetail: `A market event cut sustainable spending from ${fmtFull(solverData.baseSpending)}/yr to ${fmtFull(solverData.resetSpending)}/yr at age ${solverData.effectiveResetAge} — the plan still holds, but review the change below.`,
    };
  }

  return {
    status: "on-track",
    statusDetail: `Your plan is on track to sustain spending through age ${lifeExpectancy} without running out of money.`,
  };
}
