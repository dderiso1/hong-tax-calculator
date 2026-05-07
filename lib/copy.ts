import type { FilingStatus, RegimeComparison } from "./bill";

export const FILING_STATUS_LABELS: Record<FilingStatus, string> = {
  single: "Single",
  mfj: "Married, joint",
  mfs: "Married, separate",
};

export const FILING_STATUS_LABELS_SHORT: Record<FilingStatus, string> = {
  single: "Single",
  mfj: "Joint",
  mfs: "Separate",
};

// Income presets for one-tap exploration. Sources noted inline in the UI.
export const INCOME_PRESETS: Array<{
  label: string;
  short: string;
  income: number;
}> = [
  { label: "WI median household", short: "Median", income: 75_000 },
  { label: "Top 10%", short: "Top 10%", income: 200_000 },
  { label: "Top 1%", short: "Top 1%", income: 500_000 },
  { label: "Millionaire", short: "$1M", income: 1_500_000 },
];

export const SHARE_TEMPLATE = (income: number, delta: number) => {
  if (delta < 0.5) {
    return `Hong's plan would change my taxes by $0. The wealthy pay the bill, schools get the funding. See yours:`;
  }
  const monthly = Math.round(delta / 12);
  return `Hong's plan would mean about $${monthly.toLocaleString()}/mo from me — and goes straight to schools and a property-tax cut. See yours:`;
};

export function verdict(r: RegimeComparison): {
  big: string;
  small: string;
  tone: "calm" | "alert";
} {
  if (r.unchanged) {
    return {
      big: "$0",
      small:
        "Not a damn dollar. Your taxes don't change — every cent comes from the people at the top.",
      tone: "calm",
    };
  }
  return {
    big: `+${formatBigDollars(r.delta)}`,
    small: `That's about ${formatBigDollars(
      r.delta / 12,
    )} a month — and every penny goes to public schools and lower property taxes for working families.`,
    tone: "alert",
  };
}

function formatBigDollars(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}
