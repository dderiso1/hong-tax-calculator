const usdFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const usdCentsFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const pctFmt = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 2,
});

export function formatUSD(amount: number, withCents = false): string {
  return (withCents ? usdCentsFmt : usdFmt).format(amount);
}

export function formatPercent(rate: number): string {
  return pctFmt.format(rate);
}

export function parseIncomeInput(raw: string): number {
  const cleaned = raw.replace(/[^0-9.]/g, "");
  if (!cleaned) return 0;
  const n = Number(cleaned);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

// Cubic ease-out for number ticks
export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
