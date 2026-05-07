import type { FilingStatus, RegimeComparison } from "./bill";

export const FILING_STATUS_LABELS: Record<FilingStatus, string> = {
  single: "Single",
  mfj: "Married, joint",
  mfs: "Married, separate",
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
