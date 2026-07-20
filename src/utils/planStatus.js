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
 *     sustainable spending level by construction, so a modeled crash or
 *     a one-time expense never fails outright — it quietly lowers
 *     spending instead. `solverData.cleanBaseline` (solved with every
 *     override type stripped) vs the actual current spending is the
 *     honest before/after: `baseSpending` itself is NOT a clean "before"
 *     number, since the binary search sees marketReturns/spendingOverrides
 *     in every year it tests — comparing baseSpending to resetSpending
 *     alone regularly understates or misses the real impact (see
 *     solver/index.js's cleanBaseline doc comment).
 *   - on-track: no meaningful gap between the clean baseline and the
 *     current plan.
 */
export function derivePlanStatus(solverData, lifeExpectancy, modeledCauseLabel = "the scenario you modeled") {
  if (!solverData || !solverData.years) {
    return { status: "on-track", statusDetail: "" };
  }

  const isAtRisk =
    solverData.baseSpending === 0 ||
    solverData.years.some((y) => y.isRetired && y.totalEnd <= 0 && y.age < lifeExpectancy);

  if (isAtRisk) {
    return {
      status: "at-risk",
      statusDetail: `Your portfolio is projected to run out before age ${lifeExpectancy} at current spending. You need to act — lower Go-Go spending, delay retirement, or adjust phases below — or this plan will not meet your goal.`,
    };
  }

  // Current effective spending: whatever a checkpoint re-solved going
  // forward (resetSpending), or baseSpending if no checkpoint changed it.
  const currentSpending = solverData.resetSpending ?? solverData.baseSpending;
  const cleanBaseline = solverData.cleanBaseline;
  const hasMeaningfulImpact =
    cleanBaseline != null && Math.floor(cleanBaseline) > Math.floor(currentSpending);

  if (hasMeaningfulImpact) {
    const impactPct = Math.round((1 - currentSpending / cleanBaseline) * 100);
    const startingClause = solverData.effectiveResetAge != null ? ` starting age ${solverData.effectiveResetAge}` : "";
    return {
      status: "caution",
      statusDetail: `Because you're modeling ${modeledCauseLabel}, this lowers your sustainable spending by ${impactPct}% — from ${fmtFull(cleanBaseline)}/yr to ${fmtFull(currentSpending)}/yr${startingClause}. Sticking to this lower amount keeps your plan on track through age ${lifeExpectancy}.`,
    };
  }

  return {
    status: "on-track",
    statusDetail: `Your plan is on track to sustain spending through age ${lifeExpectancy} without running out of money.`,
  };
}
