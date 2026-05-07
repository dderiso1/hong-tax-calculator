import { describe, expect, test } from "vitest";
import { compareRegimes } from "@/lib/bill";

describe("threshold walk — bracket boundaries behave correctly", () => {
  const cases: Array<[number, boolean, string]> = [
    [0, true, "$0"],
    [75_000, true, "middle income"],
    [323_289, true, "$1 below bracket 4"],
    [323_290, true, "exactly at bracket 4 floor (no bracket-4 tax yet)"],
    [400_000, false, "well into bracket 4"],
    [750_000, false, "exactly at bracket 5 floor"],
    [750_001, false, "$1 into bracket 5"],
    [5_000_000, false, "ultra high earner"],
  ];

  for (const [income, expectedUnchanged, label] of cases) {
    test(`single, $${income.toLocaleString()} — ${label}`, () => {
      const r = compareRegimes(income, "single", 2026);
      expect(r.unchanged).toBe(expectedUnchanged);
      expect(r.delta).toBeGreaterThanOrEqual(0);
    });
  }

  test("delta at bracket-4 entry rises only at +$1 above threshold", () => {
    const at = compareRegimes(323_290, "single", 2026);
    const just = compareRegimes(323_291, "single", 2026);
    expect(at.delta).toBeCloseTo(0, 2);
    // 1 dollar × (0.0885 - 0.0765) = 0.012
    expect(just.delta).toBeCloseTo(0.012, 3);
  });

  test("delta at bracket-5 entry: $1 above $750k", () => {
    const r = compareRegimes(750_001, "single", 2026);
    // Bracket-4 delta on $426,710 (full bracket 4 width): × 0.012 = $5,120.52
    // The $1 above $750k: current = $1×0.0765, AB1209 = $1×0.177; delta = $0.1005
    expect(r.delta).toBeCloseTo(5_120.52 + 0.1005, 2);
  });
});
