import { describe, expect, test } from "vitest";
import { compareRegimes, computeTax } from "@/lib/bill";

describe("computeTax — boundaries", () => {
  test("zero income produces zero tax under current law", () => {
    expect(computeTax(0, "single", 2026, "current")).toBe(0);
  });

  test("zero income produces zero tax under AB1209", () => {
    expect(computeTax(0, "single", 2026, "ab1209")).toBe(0);
  });
});

describe("computeTax — middle-income filer (no change under AB1209)", () => {
  // Single filer, $50,000 taxable income.
  // Brackets 1–3 only:
  //   $14,680  × 3.50% = $   513.80
  //   $14,690  × 4.40% = $   646.36
  //   $20,630  × 5.30% = $ 1,093.39
  //                       --------
  //   Total            = $ 2,253.55
  // AB1209 leaves brackets 1–3 untouched, so both regimes match.
  test("$50k single under current law", () => {
    expect(computeTax(50_000, "single", 2026, "current")).toBeCloseTo(
      2253.55,
      2,
    );
  });

  test("$50k single under AB1209 matches current law (no increase)", () => {
    const current = computeTax(50_000, "single", 2026, "current");
    const proposed = computeTax(50_000, "single", 2026, "ab1209");
    expect(proposed).toBeCloseTo(current, 2);
  });
});

describe("computeTax — bracket 4 only (high earner, not yet rich)", () => {
  // Single filer, $400,000 taxable income, year 2026.
  // Brackets 1–3:        $16,737.92
  // Current bracket 4:   ($400,000 - $323,290) × 7.65% = $5,868.315
  //   Total current:                                    = $22,606.235
  // AB1209 bracket 4 (2026+ rate 8.85%):
  //   $76,710 × 8.85% = $6,788.835
  //   Total proposed:  = $23,526.755
  test("$400k single, current law", () => {
    expect(computeTax(400_000, "single", 2026, "current")).toBeCloseTo(
      22_606.235,
      2,
    );
  });

  test("$400k single, AB1209 (2026+) raises taxes by ~$920", () => {
    const current = computeTax(400_000, "single", 2026, "current");
    const proposed = computeTax(400_000, "single", 2026, "ab1209");
    expect(proposed - current).toBeCloseTo(920.52, 2);
  });
});

describe("computeTax — bracket 5 (millionaire)", () => {
  // Single filer, $1,000,000, year 2026 (AB1209 rates: 8.85% / 17.70%).
  // Brackets 1–3:                                $ 16,737.92
  // Bracket 4 ($323,290 → $750,000) × 8.85%:      $ 37,763.835
  // Bracket 5 (> $750,000)         × 17.70%:      $ 44,250.00
  //                                              ------------
  // Total:                                        $ 98,751.755
  test("$1M single, AB1209 (2026+)", () => {
    expect(computeTax(1_000_000, "single", 2026, "ab1209")).toBeCloseTo(
      98_751.755,
      2,
    );
  });

  // Current-law $1M single:
  // Brackets 1–3:                                $ 16,737.92
  // Bracket 4 (>$323,290) × 7.65%:               $ 51,768.315
  //                                              ------------
  // Total:                                        $ 68,506.235
  test("$1M single, current law", () => {
    expect(computeTax(1_000_000, "single", 2026, "current")).toBeCloseTo(
      68_506.235,
      2,
    );
  });

  test("$1M single delta is ~$30,245.52", () => {
    const delta =
      computeTax(1_000_000, "single", 2026, "ab1209") -
      computeTax(1_000_000, "single", 2026, "current");
    expect(delta).toBeCloseTo(30_245.52, 2);
  });
});

describe("computeTax — 2025 transition rates", () => {
  // Single $1M, TY2025 AB1209: bracket 4 at 8.65%, bracket 5 at 17.30%.
  // Brackets 1–3:                      $ 16,737.92
  // Bracket 4 ($426,710) × 8.65%:       $ 36,910.415
  // Bracket 5 ($250,000) × 17.30%:      $ 43,250.00
  // Total:                              $ 96,898.335
  test("$1M single under AB1209 in TY2025 uses 8.65% / 17.30%", () => {
    expect(computeTax(1_000_000, "single", 2025, "ab1209")).toBeCloseTo(
      96_898.335,
      2,
    );
  });
});

describe("computeTax — MFJ thresholds", () => {
  // MFJ $2M, TY2026 AB1209: bracket 4 caps at $1M, bracket 5 starts at $1M.
  // MFJ brackets 1–3 (2025 indexed):
  //   $19,580  × 3.50% = $   685.30
  //   $19,570  × 4.40% = $   861.08
  //   $391,910 × 5.30% = $20,771.23
  //                       ----------
  //                      $22,317.61
  // Bracket 4 ($568,940) × 8.85%:  $50,351.19
  // Bracket 5 ($1,000,000) × 17.70%: $177,000.00
  // Total:                          $249,668.80
  test("$2M MFJ under AB1209 (2026+)", () => {
    expect(computeTax(2_000_000, "mfj", 2026, "ab1209")).toBeCloseTo(
      249_668.8,
      2,
    );
  });

  test("$2M MFJ under current law", () => {
    // Brackets 1–3: $22,317.61; bracket 4 ($1,568,940 × 7.65%) = $120,023.91
    expect(computeTax(2_000_000, "mfj", 2026, "current")).toBeCloseTo(
      142_341.52,
      2,
    );
  });

  test("$500k MFJ stays in bracket 4 only — no bracket 5 hit", () => {
    // MFJ bracket 5 starts at $1M, so a $500k MFJ filer never hits it.
    // Delta vs current is purely the bracket-4 rate change on income above $431,060.
    const current = computeTax(500_000, "mfj", 2026, "current");
    const proposed = computeTax(500_000, "mfj", 2026, "ab1209");
    // (500,000 - 431,060) × (0.0885 - 0.0765) = 68,940 × 0.012 = 827.28
    expect(proposed - current).toBeCloseTo(827.28, 2);
  });
});

describe("computeTax — MFS thresholds (halved)", () => {
  // MFS $750k under AB1209 (2026+): bracket 4 at $215,530, bracket 5 at $500k.
  // Brackets 1–3 (MFS):
  //   $9,790  × 3.50% = $   342.65
  //   $9,790  × 4.40% = $   430.76
  //   $195,950 × 5.30% = $10,385.35
  //                       ----------
  //                      $11,158.76
  // Bracket 4 ($284,470) × 8.85%:   $25,175.595
  // Bracket 5 ($250,000) × 17.70%:  $44,250.00
  // Total:                          $80,584.355
  test("$750k MFS under AB1209 (2026+)", () => {
    expect(computeTax(750_000, "mfs", 2026, "ab1209")).toBeCloseTo(
      80_584.355,
      2,
    );
  });

  test("MFS bracket 5 begins at $500k, not $750k", () => {
    // A filer at exactly $500,000 MFS should NOT yet pay bracket-5 tax.
    // Delta vs current = bracket-4 rate change only on income above $215,530.
    const current = computeTax(500_000, "mfs", 2026, "current");
    const proposed = computeTax(500_000, "mfs", 2026, "ab1209");
    // (500,000 - 215,530) × (0.0885 - 0.0765) = 284,470 × 0.012 = 3,413.64
    expect(proposed - current).toBeCloseTo(3_413.64, 2);
  });
});

describe("compareRegimes — UI-friendly delta", () => {
  test("middle-income filer: zero delta", () => {
    const r = compareRegimes(75_000, "single", 2026);
    expect(r.delta).toBeCloseTo(0, 2);
    expect(r.unchanged).toBe(true);
  });

  test("rich filer: positive delta and unchanged=false", () => {
    const r = compareRegimes(1_000_000, "single", 2026);
    expect(r.delta).toBeCloseTo(30_245.52, 2);
    expect(r.unchanged).toBe(false);
    expect(r.current).toBeCloseTo(68_506.235, 2);
    expect(r.proposed).toBeCloseTo(98_751.755, 2);
  });

  test("right at the bracket-4 threshold: still no change", () => {
    // $323,290 single: exactly the bottom of bracket 4 — no bracket-4 tax yet.
    const r = compareRegimes(323_290, "single", 2026);
    expect(r.unchanged).toBe(true);
    expect(r.delta).toBeCloseTo(0, 2);
  });
});
