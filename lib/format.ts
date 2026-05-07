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

// Accepts: "75000", "1,500,000", "$ 200k", "1.5M", "2m". Rejects negatives.
export function parseIncomeInput(raw: string): number {
  const trimmed = raw.trim().toLowerCase();
  if (!trimmed) return 0;
  if (/^-/.test(trimmed) || /[^0-9$,.\skm]/.test(trimmed)) {
    // either leading minus or stray letters that aren't k/m → reject
    if (/^[$\s,]*-/.test(trimmed)) return 0;
    if (/[a-jln-z]/i.test(trimmed)) return 0;
  }
  // Detect a single trailing unit suffix.
  let multiplier = 1;
  let body = trimmed;
  const lastChar = body.slice(-1);
  if (lastChar === "k") {
    multiplier = 1_000;
    body = body.slice(0, -1);
  } else if (lastChar === "m") {
    multiplier = 1_000_000;
    body = body.slice(0, -1);
  }
  // Strip everything except digits and a single decimal point.
  const cleaned = body.replace(/[^0-9.]/g, "");
  if (!cleaned) return 0;
  const n = Number(cleaned);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return n * multiplier;
}

// Cubic ease-out for number ticks
export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
