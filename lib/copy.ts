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
      small: "Not a dollar more.",
      tone: "calm",
    };
  }
  const monthly = r.delta / 12;
  return {
    big: `+${formatBigDollars(r.delta)}`,
    small: `About ${formatBigDollars(monthly)}/month — paid by you, returned to your community as schools and lower property taxes.`,
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
