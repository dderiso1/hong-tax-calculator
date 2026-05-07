"use client";

import { useEffect, useMemo, useState } from "react";
import {
  type FilingStatus,
  bracketsFor,
  compareRegimes,
} from "@/lib/bill";
import { FILING_STATUS_LABELS, verdict } from "@/lib/copy";
import { formatPercent, formatUSD, parseIncomeInput } from "@/lib/format";

type Props = {
  defaultIncome?: number;
};

const VALID_STATUSES: FilingStatus[] = ["single", "mfj", "mfs"];

export function Calculator({ defaultIncome = 75_000 }: Props) {
  const [income, setIncome] = useState<number>(defaultIncome);
  const [raw, setRaw] = useState<string>(
    new Intl.NumberFormat("en-US").format(defaultIncome),
  );
  const [status, setStatus] = useState<FilingStatus>("single");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const i = parseIncomeInput(params.get("income") ?? "");
    if (i > 0) {
      setIncome(i);
      setRaw(new Intl.NumberFormat("en-US").format(i));
    }
    const s = params.get("status");
    if (s && (VALID_STATUSES as string[]).includes(s)) {
      setStatus(s as FilingStatus);
    }
  }, []);

  const result = useMemo(
    () => compareRegimes(income, status, 2026),
    [income, status],
  );
  const v = verdict(result);

  const currentBrackets = bracketsFor(status, 2026, "current");
  const proposedBrackets = bracketsFor(status, 2026, "ab1209");

  return (
    <section className="relative z-10">
      {/* HERO */}
      <div className="relative overflow-hidden bg-[var(--color-hong-navy)] text-[var(--color-hong-cream)]">
        <div className="bandana-stripe" />
        <div className="relative z-10 max-w-[var(--container-wide)] mx-auto px-6 sm:px-10 lg:px-16 pt-16 pb-24 lg:pt-24 lg:pb-32">
          <p className="display text-[var(--color-hong-red)] text-sm tracking-[0.25em] mb-6">
            ★ Tax-the-Rich Calculator ★
          </p>
          <h1 className="display-xl text-4xl sm:text-6xl lg:text-8xl max-w-5xl">
            Will Hong&rsquo;s plan raise{" "}
            <em className="not-italic text-[var(--color-hong-red)]">your</em>{" "}
            taxes?
          </h1>
          <p className="mt-8 text-lg sm:text-xl max-w-2xl text-[color:rgba(246,241,228,0.85)] leading-relaxed">
            Type your Wisconsin taxable income. See your real number. For{" "}
            <span className="text-[var(--color-hong-cream)] font-semibold">
              99% of us
            </span>
            , the answer is the same.
          </p>
        </div>
      </div>

      {/* CALCULATOR CARD */}
      <div className="max-w-[var(--container-wide)] mx-auto px-4 sm:px-10 lg:px-16 -mt-16 lg:-mt-20 relative z-20">
        <div className="bg-[var(--color-hong-cream)] border-4 border-[var(--color-hong-navy)] shadow-[6px_6px_0_var(--color-hong-red)] sm:shadow-[12px_12px_0_var(--color-hong-red)] p-5 sm:p-10 lg:p-14">
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 min-w-0">
            {/* LEFT: INPUT */}
            <div className="min-w-0">
              <label
                htmlFor="income"
                className="display text-xs tracking-[0.25em] text-[var(--color-hong-navy)] block mb-3"
              >
                Your annual taxable income
              </label>
              <div className="flex items-baseline gap-2 min-w-0">
                <span className="display text-5xl sm:text-6xl text-[var(--color-hong-navy)]">
                  $
                </span>
                <input
                  id="income"
                  inputMode="numeric"
                  autoComplete="off"
                  className="income-input min-w-0 flex-1"
                  value={raw}
                  placeholder="75,000"
                  onChange={(e) => {
                    const parsed = parseIncomeInput(e.target.value);
                    setIncome(parsed);
                    setRaw(
                      e.target.value === ""
                        ? ""
                        : new Intl.NumberFormat("en-US").format(parsed),
                    );
                  }}
                  onBlur={() => {
                    if (raw === "") setRaw("0");
                  }}
                />
              </div>

              <div className="mt-6 grid grid-cols-3 gap-2">
                {(Object.keys(FILING_STATUS_LABELS) as FilingStatus[]).map(
                  (s) => (
                    <button
                      key={s}
                      type="button"
                      className="pill text-center"
                      aria-pressed={status === s}
                      onClick={() => setStatus(s)}
                    >
                      {FILING_STATUS_LABELS[s]}
                    </button>
                  ),
                )}
              </div>

              <details className="mt-8 text-sm text-[var(--color-hong-ink-soft)]">
                <summary className="cursor-pointer font-semibold uppercase tracking-wider text-xs">
                  What counts as &ldquo;taxable income&rdquo;?
                </summary>
                <p className="mt-3 leading-relaxed">
                  This is the number on{" "}
                  <strong>line&nbsp;13 of Wisconsin Form&nbsp;1</strong> &mdash;
                  your gross income after standard or itemized deductions and
                  the standard deduction phase-out. Most filers&rsquo; taxable
                  income is significantly lower than their salary.
                </p>
              </details>
            </div>

            {/* RIGHT: RESULT */}
            <div className="relative min-w-0">
              <p className="display text-xs tracking-[0.25em] text-[var(--color-hong-navy)] mb-3">
                What changes for you
              </p>
              <p
                className={`display tabular tick text-[clamp(3.5rem,11vw,7rem)] leading-none ${
                  v.tone === "calm"
                    ? "text-[var(--color-hong-navy)]"
                    : "text-[var(--color-hong-red)]"
                }`}
              >
                {v.big}
              </p>
              <p className="mt-3 max-w-md text-base sm:text-lg leading-snug text-[var(--color-hong-ink)]">
                {v.small}
              </p>

              <hr className="my-6 border-0 rule-navy" />

              <dl className="grid grid-cols-2 gap-4 sm:gap-8 tabular">
                <div>
                  <dt className="text-[10px] sm:text-xs uppercase tracking-[0.18em] text-[var(--color-hong-ink-soft)]">
                    Under current law
                  </dt>
                  <dd className="display text-2xl sm:text-3xl text-[var(--color-hong-navy)] mt-1">
                    {formatUSD(result.current)}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] sm:text-xs uppercase tracking-[0.18em] text-[var(--color-hong-ink-soft)]">
                    Under Hong&rsquo;s plan
                  </dt>
                  <dd
                    className={`display text-2xl sm:text-3xl mt-1 ${
                      v.tone === "calm"
                        ? "text-[var(--color-hong-navy)]"
                        : "text-[var(--color-hong-red)]"
                    }`}
                  >
                    {formatUSD(result.proposed)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* BRACKETS COMPARISON */}
          <div className="mt-12 pt-10 border-t-2 border-[var(--color-hong-navy)]/20">
            <h2 className="display text-2xl sm:text-3xl text-[var(--color-hong-navy)] mb-2">
              See exactly what changes.
            </h2>
            <p className="text-[var(--color-hong-ink-soft)] mb-8 max-w-2xl">
              Brackets 1 through 3 cover the income most working Wisconsinites
              earn. <strong>AB&nbsp;1209 leaves them untouched.</strong> Only
              income above $323,290 (single) or $431,060 (married-joint) sees a
              new rate.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 sm:gap-10 min-w-0">
              <BracketBlock
                title="Current law"
                rows={currentBrackets}
                income={income}
                accent="navy"
              />
              <BracketBlock
                title="AB 1209 (Hong's plan)"
                rows={proposedBrackets}
                income={income}
                accent="red"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BracketBlock({
  title,
  rows,
  income,
  accent,
}: {
  title: string;
  rows: readonly { from: number; rate: number }[];
  income: number;
  accent: "navy" | "red";
}) {
  const accentColor =
    accent === "red" ? "var(--color-hong-red)" : "var(--color-hong-navy)";
  return (
    <div>
      <h3
        className="display text-sm tracking-[0.2em] mb-3 pb-2 border-b-2"
        style={{ color: accentColor, borderColor: accentColor }}
      >
        {title}
      </h3>
      <table className="w-full text-sm tabular">
        <thead className="text-[var(--color-hong-ink-soft)]">
          <tr className="border-b border-[var(--color-hong-navy)]/20">
            <th className="text-left font-semibold uppercase tracking-wider text-[10px] py-2">
              Income above
            </th>
            <th className="text-right font-semibold uppercase tracking-wider text-[10px] py-2">
              Rate
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((b, i) => {
            const next = i + 1 < rows.length ? rows[i + 1].from : Infinity;
            const inThisBracket = income > b.from && income <= next;
            return (
              <tr
                key={`${b.from}-${b.rate}`}
                className={`border-b border-[var(--color-hong-navy)]/10 ${
                  inThisBracket
                    ? "bg-[var(--color-hong-navy)]/5"
                    : ""
                }`}
              >
                <td className="py-2.5">
                  {b.from === 0 ? (
                    <span>$0</span>
                  ) : (
                    <span>{formatUSD(b.from)}</span>
                  )}
                  {inThisBracket && (
                    <span
                      className="ml-2 text-[10px] px-1.5 py-0.5 align-middle"
                      style={{
                        background: accentColor,
                        color: "var(--color-hong-cream)",
                      }}
                    >
                      YOU
                    </span>
                  )}
                </td>
                <td
                  className="py-2.5 text-right display"
                  style={{ color: accentColor }}
                >
                  {formatPercent(b.rate)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
