/**
 * planStatus.js — Derives a plain "on track" verdict from solver output.
 *
 * There is no Monte Carlo simulation yet, so this is NOT a probability —
 * it's a binary read of whether the deterministic solver found a spending
 * path that survives to life expectancy. `solve()`/`solveWithOverrides()`
 * always return *some* spending level (binary search), so the only real
 * failure signals are: the search bottomed out at $0, or the portfolio
 * hits zero before life expectancy in any retired year.
 */
export function derivePlanStatus(solverData, lifeExpectancy) {
  if (!solverData || !solverData.years) {
    return { status: "on-track", statusDetail: "" };
  }

  const needsAdjustment =
    solverData.baseSpending === 0 ||
    solverData.years.some((y) => y.isRetired && y.totalEnd <= 0 && y.age < lifeExpectancy);

  return {
    status: needsAdjustment ? "needs-adjustment" : "on-track",
    statusDetail: needsAdjustment
      ? `Portfolio depletes before age ${lifeExpectancy} at current spending — consider reducing Go-Go spending or adjusting phases below.`
      : `Spending sustainable through age ${lifeExpectancy}.`,
  };
}
