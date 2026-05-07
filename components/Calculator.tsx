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
    <section id="calculator" className="relative z-10">
      {/* HERO */}
      <div className="relative bg-[var(--color-hong-navy)] text-[var(--color-hong-cream)]">
        <div className="stripe-tape" aria-hidden />
        <div className="relative z-10 max-w-[var(--container-wide)] mx-auto px-5 sm:px-10 lg:px-16 pt-16 pb-28 lg:pt-24 lg:pb-36">
          <p className="eyebrow text-[var(--color-hong-yellow)] mb-6">
            ★ The Tax-the-Rich Calculator ★
          </p>
          <h1 className="poster-mega text-[clamp(3.4rem,12vw,8.5rem)] text-[var(--color-hong-yellow)] uppercase">
            Tax the
            <br />
            <span className="text-[var(--color-hong-cream)]">rich.</span>
          </h1>
          <p className="type-h3 mt-8 max-w-3xl text-[color:rgba(250,246,232,0.92)]">
            It&rsquo;s about damn time the wealthiest Wisconsinites paid their
            share. Type your income — see exactly what Hong&rsquo;s plan does
            for <em className="not-italic hl-yellow text-[var(--color-hong-navy)]">you.</em>
          </p>
          <p className="type-subheading mt-5 max-w-2xl text-[color:rgba(250,246,232,0.7)]">
            For 99 out of 100 of us, the answer is{" "}
            <strong className="text-[var(--color-hong-yellow)]">$0</strong>.
            Every new dollar comes from the people at the top — and goes
            straight back to your kid&rsquo;s school and your property tax
            bill.
          </p>
        </div>
      </div>

      {/* CALCULATOR CARD */}
      <div className="max-w-[var(--container-wide)] mx-auto px-4 sm:px-10 lg:px-16 -mt-20 lg:-mt-24 relative z-20">
        <div className="bg-[var(--color-hong-cream)] border-4 border-[var(--color-hong-navy)] shadow-[6px_6px_0_var(--color-hong-yellow)] sm:shadow-[12px_12px_0_var(--color-hong-yellow)] p-5 sm:p-10 lg:p-14">
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 min-w-0">
            {/* LEFT: INPUT */}
            <div className="min-w-0">
              <label
                htmlFor="income"
                className="eyebrow text-[var(--color-hong-navy)] block mb-3"
              >
                Your annual taxable income
              </label>
              <div className="flex items-baseline gap-2 min-w-0">
                <span className="poster text-5xl sm:text-6xl text-[var(--color-hong-navy)]">
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
                      className="pill"
                      aria-pressed={status === s}
                      onClick={() => setStatus(s)}
                    >
                      {FILING_STATUS_LABELS[s]}
                    </button>
                  ),
                )}
              </div>

              <details className="mt-8 type-small-body text-[var(--color-hong-slate)]">
                <summary className="cursor-pointer eyebrow text-[var(--color-hong-navy)]">
                  What counts as &ldquo;taxable income&rdquo;?
                </summary>
                <p className="mt-3 leading-relaxed">
                  This is the number on{" "}
                  <strong>line&nbsp;13 of Wisconsin Form&nbsp;1</strong> &mdash;
                  your gross income after deductions. Most people&rsquo;s
                  taxable income is meaningfully lower than their salary.
                </p>
              </details>
            </div>

            {/* RIGHT: RESULT */}
            <div className="relative min-w-0">
              <p className="eyebrow text-[var(--color-hong-navy)] mb-3">
                What changes for you
              </p>
              <p
                className={`poster-mega tabular tick text-[clamp(3.5rem,11vw,6.5rem)] ${
                  v.tone === "calm"
                    ? "text-[var(--color-hong-navy)]"
                    : "text-[var(--color-hong-navy)]"
                }`}
              >
                {v.big}
              </p>
              <p className="mt-3 max-w-md type-body-16 text-[var(--color-hong-ink)]">
                {v.small}
              </p>

              <hr className="my-6 border-0 border-t-2 border-[var(--color-hong-navy)]/30" />

              <dl className="grid grid-cols-2 gap-4 sm:gap-8 tabular">
                <div>
                  <dt className="eyebrow text-[10px] sm:text-xs text-[var(--color-hong-slate)]">
                    Under current law
                  </dt>
                  <dd className="poster text-2xl sm:text-3xl text-[var(--color-hong-navy)] mt-1">
                    {formatUSD(result.current)}
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow text-[10px] sm:text-xs text-[var(--color-hong-slate)]">
                    Under Hong&rsquo;s plan
                  </dt>
                  <dd className="poster text-2xl sm:text-3xl mt-1 text-[var(--color-hong-navy)]">
                    {formatUSD(result.proposed)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* BRACKETS COMPARISON */}
          <div className="mt-12 pt-10 border-t-2 border-[var(--color-hong-navy)]/20">
            <h2 className="type-h3 text-[var(--color-hong-navy)] mb-2">
              Here&rsquo;s the deal.
            </h2>
            <p className="type-body-16 text-[var(--color-hong-slate)] mb-8 max-w-2xl">
              Brackets&nbsp;1&ndash;3 cover what working Wisconsinites
              actually earn. <strong>AB&nbsp;1209 doesn&rsquo;t touch them.</strong>{" "}
              Only income above $323,290 (single) or $431,060 (married joint)
              starts to pay closer to a fair share.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 sm:gap-10 min-w-0">
              <BracketBlock
                title="Current law"
                rows={currentBrackets}
                income={income}
                accent="navy"
              />
              <BracketBlock
                title="AB 1209 — Hong's plan"
                rows={proposedBrackets}
                income={income}
                accent="yellow"
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
  accent: "navy" | "yellow";
}) {
  const accentColor =
    accent === "yellow" ? "var(--color-hong-navy)" : "var(--color-hong-navy)";
  const highlightBg =
    accent === "yellow"
      ? "var(--color-hong-yellow)"
      : "rgba(30, 41, 87, 0.08)";
  return (
    <div>
      <h3
        className="eyebrow mb-3 pb-2 border-b-2"
        style={{ color: accentColor, borderColor: accentColor }}
      >
        {title}
      </h3>
      <table className="w-full type-small-body tabular">
        <thead>
          <tr className="border-b border-[var(--color-hong-navy)]/20">
            <th className="text-left eyebrow text-[10px] py-2">
              Income above
            </th>
            <th className="text-right eyebrow text-[10px] py-2">Rate</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((b, i) => {
            const next = i + 1 < rows.length ? rows[i + 1].from : Infinity;
            const inThisBracket = income > b.from && income <= next;
            return (
              <tr
                key={`${b.from}-${b.rate}`}
                className="border-b border-[var(--color-hong-navy)]/10"
                style={
                  inThisBracket
                    ? { background: highlightBg }
                    : undefined
                }
              >
                <td className="py-2.5">
                  {b.from === 0 ? (
                    <span>$0</span>
                  ) : (
                    <span>{formatUSD(b.from)}</span>
                  )}
                  {inThisBracket && (
                    <span
                      className="ml-2 text-[10px] px-1.5 py-0.5 align-middle font-bold"
                      style={{
                        background: "var(--color-hong-navy)",
                        color: "var(--color-hong-yellow)",
                        letterSpacing: "0.1em",
                      }}
                    >
                      YOU
                    </span>
                  )}
                </td>
                <td
                  className="py-2.5 text-right poster"
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
