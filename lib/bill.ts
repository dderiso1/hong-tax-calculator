export type FilingStatus = "single" | "mfj" | "mfs";
export type Regime = "current" | "ab1209";
export type TaxYear = 2025 | 2026;

export type Bracket = { from: number; rate: number };

// Indexed thresholds for taxable year 2025 (per WI DOR Schedule SB).
// Brackets 1–3 are unchanged by AB1209; only bracket 4 lower bound is
// fixed by statute (s. 71.06, as created by 2025 Wisconsin Act 15).
const BRACKETS_1_3: Record<FilingStatus, Bracket[]> = {
  single: [
    { from: 0, rate: 0.035 },
    { from: 14_680, rate: 0.044 },
    { from: 29_370, rate: 0.053 },
  ],
  mfj: [
    { from: 0, rate: 0.035 },
    { from: 19_580, rate: 0.044 },
    { from: 39_150, rate: 0.053 },
  ],
  mfs: [
    { from: 0, rate: 0.035 },
    { from: 9_790, rate: 0.044 },
    { from: 19_580, rate: 0.053 },
  ],
};

// Bracket 4 lower bound by filing status (fixed by statute, s. 71.06).
const BRACKET_4_FROM = {
  single: 323_290,
  mfj: 431_060,
  mfs: 215_530,
} as const;

// AB1209 bracket 5 lower bound by filing status (sec. 7, 9, 11).
const BRACKET_5_FROM = {
  single: 750_000,
  mfj: 1_000_000,
  mfs: 500_000,
} as const;

// AB1209, sec. 6: bracket 4 rises to 8.65% in TY2025, 8.85% in TY2026+.
function bracket4Rate(year: TaxYear, regime: Regime): number {
  if (regime === "current") return 0.0765;
  return year === 2025 ? 0.0865 : 0.0885;
}

// AB1209, sec. 7: new bracket 5 at 17.30% TY2025, 17.70% TY2026+.
function bracket5Rate(year: TaxYear): number {
  return year === 2025 ? 0.173 : 0.177;
}

function getBrackets(
  status: FilingStatus,
  year: TaxYear,
  regime: Regime,
): Bracket[] {
  const base: Bracket[] = [
    ...BRACKETS_1_3[status],
    { from: BRACKET_4_FROM[status], rate: bracket4Rate(year, regime) },
  ];
  if (regime === "ab1209") {
    base.push({ from: BRACKET_5_FROM[status], rate: bracket5Rate(year) });
  }
  return base;
}

export function computeTax(
  income: number,
  status: FilingStatus,
  year: TaxYear,
  regime: Regime,
): number {
  if (income <= 0) return 0;
  const brackets = getBrackets(status, year, regime);
  let tax = 0;
  for (let i = 0; i < brackets.length; i++) {
    const lo = brackets[i].from;
    const hi = i + 1 < brackets.length ? brackets[i + 1].from : Infinity;
    if (income <= lo) break;
    const slice = Math.min(income, hi) - lo;
    tax += slice * brackets[i].rate;
  }
  return tax;
}

export type RegimeComparison = {
  current: number;
  proposed: number;
  delta: number;
  unchanged: boolean;
};

export function compareRegimes(
  income: number,
  status: FilingStatus,
  year: TaxYear,
): RegimeComparison {
  const current = computeTax(income, status, year, "current");
  const proposed = computeTax(income, status, year, "ab1209");
  const delta = proposed - current;
  return {
    current,
    proposed,
    delta,
    unchanged: Math.abs(delta) < 0.005,
  };
}

export function bracketsFor(
  status: FilingStatus,
  year: TaxYear,
  regime: Regime,
): readonly Bracket[] {
  return getBrackets(status, year, regime);
}
