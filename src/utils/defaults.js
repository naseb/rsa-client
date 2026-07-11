/**
 * defaults.js — Default Input Values
 * ====================================
 * These are the initial values shown when a user opens the app
 * for the first time (before localStorage has anything saved).
 */

export const DEFAULTS = {
  currentAge: 50,
  retirementAge: 65,
  lifeExpectancy: 95,
  filingStatus: 2, // 1 = Single, 2 = MFJ
  state: null,     // USPS state code, or null = no state selected → $0 state tax
  ss67: 0,         // Monthly SS benefit at FRA (67)
  ssStartAge: 67,
  pensionAmount: 0, // Monthly pension benefit
  pensionStartAge: 65,
  pensionHasCola: false,
  cola: 0.025,     // 2.5%
  defaultReturn: 7,
  inflationRate: 3,
  targetEndBalance: 0,
  phases: [
    { name: "Go-Go",  startAge: 65, pct: 100, color: "goGo" },
    { name: "Slow-Go", startAge: 75, pct: 70,  color: "slowGo" },
    { name: "No-Go",  startAge: 85, pct: 50,  color: "noGo" },
  ],
  transitionYears: 3,
  smoothTransition: true,
  marketReturns: {},
  spendingOverrides: {},
  portfolioOverrides: {},
  accounts: [
    { name: "Traditional 401(k)", balance: 0, monthlyContribution: 0, annualReturn: 7, taxTreatment: "Pre-tax", matchPct: 0, matchLimit: 0 },
    { name: "Roth IRA",           balance: 0, monthlyContribution: 0, annualReturn: 7, taxTreatment: "Tax-free", matchPct: 0, matchLimit: 0 },
    { name: "Traditional IRA",    balance: 0, monthlyContribution: 0, annualReturn: 7, taxTreatment: "Pre-tax", matchPct: 0, matchLimit: 0 },
    { name: "Brokerage",          balance: 0, monthlyContribution: 0, annualReturn: 7, taxTreatment: "Taxable", matchPct: 0, matchLimit: 0 },
  ],
};
