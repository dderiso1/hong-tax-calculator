"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  type FilingStatus,
  bracketsFor,
  compareRegimes,
} from "@/lib/bill";
import {
  FILING_STATUS_LABELS,
  FILING_STATUS_LABELS_SHORT,
  INCOME_PRESETS,
  SHARE_TEMPLATE,
  verdict,
} from "@/lib/copy";
import {
  easeOutCubic,
  formatPercent,
  formatUSD,
  parseIncomeInput,
} from "@/lib/format";

type Props = {
  defaultIncome?: number;
};

const VALID_STATUSES: FilingStatus[] = ["single", "mfj", "mfs"];
const STORAGE_KEY = "hong-calc:v1";

export function Calculator({ defaultIncome = 75_000 }: Props) {
  const [income, setIncome] = useState<number>(defaultIncome);
  const [raw, setRaw] = useState<string>(
    new Intl.NumberFormat("en-US").format(defaultIncome),
  );
  const [status, setStatus] = useState<FilingStatus>("single");
  const [toast, setToast] = useState<string | null>(null);

  // URL params win; localStorage is a fallback for return visitors
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let nextIncome: number | null = null;
    let nextStatus: FilingStatus | null = null;
    const i = parseIncomeInput(params.get("income") ?? "");
    if (i > 0) nextIncome = i;
    const s = params.get("status");
    if (s && (VALID_STATUSES as string[]).includes(s)) {
      nextStatus = s as FilingStatus;
    }
    if (nextIncome === null || nextStatus === null) {
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
        if (saved && typeof saved === "object") {
          if (
            nextIncome === null &&
            typeof saved.income === "number" &&
            saved.income > 0
          ) {
            nextIncome = saved.income;
          }
          if (
            nextStatus === null &&
            typeof saved.status === "string" &&
            (VALID_STATUSES as string[]).includes(saved.status)
          ) {
            nextStatus = saved.status as FilingStatus;
          }
        }
      } catch {
        /* ignore */
      }
    }
    if (nextIncome !== null) {
      setIncome(nextIncome);
      setRaw(new Intl.NumberFormat("en-US").format(nextIncome));
    }
    if (nextStatus !== null) setStatus(nextStatus);
  }, []);

  // Persist on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ income, status }));
    } catch {
      /* ignore */
    }
  }, [income, status]);

  const result = useMemo(
    () => compareRegimes(income, status, 2026),
    [income, status],
  );
  const v = verdict(result);

  const currentBrackets = bracketsFor(status, 2026, "current");
  const proposedBrackets = bracketsFor(status, 2026, "ab1209");

  // Apply a preset
  function applyPreset(amount: number) {
    setIncome(amount);
    setRaw(new Intl.NumberFormat("en-US").format(amount));
  }

  // Share / copy current state
  async function share() {
    const url = new URL(window.location.href);
    url.searchParams.set("income", String(income));
    url.searchParams.set("status", status);
    const text = SHARE_TEMPLATE(income, result.delta);
    const shareData = {
      title: "Tax the Rich — Hong for Wisconsin",
      text,
      url: url.toString(),
    };
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        /* fall through to clipboard */
      }
    }
    try {
      await navigator.clipboard.writeText(`${text} ${url.toString()}`);
      setToast("Link copied — text it to anyone who asks.");
      setTimeout(() => setToast(null), 2400);
    } catch {
      setToast("Couldn't copy — long-press the URL bar.");
      setTimeout(() => setToast(null), 2400);
    }
  }

  return (
    <section id="calculator" className="relative z-10">
      {/* HERO */}
      <div className="relative bg-[var(--color-hong-navy)] text-[var(--color-hong-cream)]">
        <div className="stripe-tape" aria-hidden />
        <div className="relative z-10 max-w-[var(--container-wide)] mx-auto px-5 sm:px-10 lg:px-16 pt-14 pb-24 sm:pt-20 sm:pb-32 lg:pt-24 lg:pb-36">
          <p className="eyebrow text-[var(--color-hong-yellow)] mb-5 sm:mb-6">
            ★ The Tax-the-Rich Calculator ★
          </p>
          <h1 className="poster-mega text-[clamp(3rem,12vw,8.5rem)] text-[var(--color-hong-yellow)] uppercase">
            Tax the
            <br />
            <span className="text-[var(--color-hong-cream)]">rich.</span>
          </h1>
          <p className="mt-6 sm:mt-8 max-w-3xl text-[19px] sm:text-[24px] lg:text-[33px] leading-snug font-display font-medium text-[color:rgba(250,246,232,0.92)]">
            It&rsquo;s about damn time the wealthiest Wisconsinites paid their
            share. Type your income — see exactly what Hong&rsquo;s plan does
            for{" "}
            <em className="not-italic hl-yellow text-[var(--color-hong-navy)]">
              you.
            </em>
          </p>
          <p className="mt-4 sm:mt-5 max-w-2xl text-[15px] sm:text-[18px] leading-snug text-[color:rgba(250,246,232,0.7)]">
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

              {/* Filing status pills */}
              <div className="mt-5 grid grid-cols-3 gap-2">
                {(Object.keys(FILING_STATUS_LABELS) as FilingStatus[]).map(
                  (s) => (
                    <button
                      key={s}
                      type="button"
                      className="pill"
                      aria-pressed={status === s}
                      onClick={() => setStatus(s)}
                    >
                      <span className="sm:hidden">
                        {FILING_STATUS_LABELS_SHORT[s]}
                      </span>
                      <span className="hidden sm:inline">
                        {FILING_STATUS_LABELS[s]}
                      </span>
                    </button>
                  ),
                )}
              </div>

              {/* Income presets */}
              <div className="mt-6">
                <p className="eyebrow text-[10px] text-[var(--color-hong-slate)] mb-2">
                  Or try someone&rsquo;s income
                </p>
                <div className="flex flex-wrap gap-2">
                  {INCOME_PRESETS.map((p) => (
                    <button
                      key={p.income}
                      type="button"
                      onClick={() => applyPreset(p.income)}
                      className={`pill !py-2 !px-3 !text-[11px] ${
                        income === p.income ? "" : ""
                      }`}
                      aria-pressed={income === p.income}
                    >
                      <span className="sm:hidden">{p.short}</span>
                      <span className="hidden sm:inline">{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <details className="mt-7 type-small-body text-[var(--color-hong-slate)]">
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
            <div
              className="relative min-w-0"
              aria-live="polite"
              aria-atomic="true"
            >
              <p className="eyebrow text-[var(--color-hong-navy)] mb-3">
                What changes for you
              </p>
              <AnimatedNumber
                value={result.delta}
                unchanged={result.unchanged}
                className="poster-mega tabular tick text-[clamp(3.5rem,11vw,6.5rem)] text-[var(--color-hong-navy)]"
              />
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

              <button
                type="button"
                onClick={share}
                className="btn-primary mt-7 w-full justify-center"
              >
                ↗ Share my number
              </button>
              {toast && (
                <p
                  role="status"
                  className="mt-3 text-center type-small-body text-[var(--color-hong-navy)]"
                >
                  {toast}
                </p>
              )}
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

            {/* Mobile: combined 3-column table */}
            <div className="sm:hidden">
              <CombinedBracketTable
                current={currentBrackets}
                proposed={proposedBrackets}
                income={income}
              />
            </div>

            {/* Tablet+: two side-by-side tables */}
            <div className="hidden sm:grid sm:grid-cols-2 gap-10 min-w-0">
              <BracketBlock
                title="Current law"
                rows={currentBrackets}
                income={income}
              />
              <BracketBlock
                title="AB 1209 — Hong's plan"
                rows={proposedBrackets}
                income={income}
                accent
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- helpers ---------- */

function AnimatedNumber({
  value,
  unchanged,
  className,
}: {
  value: number;
  unchanged: boolean;
  className?: string;
}) {
  const [display, setDisplay] = useState<number>(value);
  const displayRef = useRef<number>(value);
  const startVal = useRef<number>(value);
  const startTime = useRef<number | null>(null);
  const raf = useRef<number | null>(null);
  const mounted = useRef<boolean>(false);

  // keep ref in sync so the next animation reads the current shown value
  useEffect(() => {
    displayRef.current = display;
  }, [display]);

  useEffect(() => {
    // First render after props settle: snap to value, no animation.
    if (!mounted.current) {
      mounted.current = true;
      displayRef.current = value;
      setDisplay(value);
      return;
    }
    if (raf.current !== null) cancelAnimationFrame(raf.current);
    startVal.current = displayRef.current;
    startTime.current = null;
    const target = value;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDisplay(target);
      displayRef.current = target;
      return;
    }
    const duration = 320;
    const tick = (t: number) => {
      if (startTime.current === null) startTime.current = t;
      const elapsed = t - startTime.current;
      const p = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(p);
      const next = startVal.current + (target - startVal.current) * eased;
      setDisplay(next);
      displayRef.current = next;
      if (p < 1) {
        raf.current = requestAnimationFrame(tick);
      }
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (unchanged) {
    return <p className={className}>$0</p>;
  }
  const rounded = Math.round(display);
  const sign = rounded > 0 ? "+" : "";
  return (
    <p className={className}>
      {sign}
      {formatUSD(rounded)}
    </p>
  );
}

function CombinedBracketTable({
  current,
  proposed,
  income,
}: {
  current: readonly { from: number; rate: number }[];
  proposed: readonly { from: number; rate: number }[];
  income: number;
}) {
  // Build a unified row set keyed on threshold.
  const thresholds = Array.from(
    new Set([...current.map((b) => b.from), ...proposed.map((b) => b.from)]),
  ).sort((a, b) => a - b);

  function rateAt(rows: readonly { from: number; rate: number }[], v: number) {
    let r: number | null = null;
    for (const row of rows) {
      if (v >= row.from) r = row.rate;
    }
    return r;
  }

  return (
    <table className="w-full type-small-body tabular table-fixed">
      <thead>
        <tr className="border-b border-[var(--color-hong-navy)]/20">
          <th className="text-left eyebrow text-[10px] py-2 w-[44%]">
            Income above
          </th>
          <th className="text-right eyebrow text-[10px] py-2 w-[28%]">Now</th>
          <th className="text-right eyebrow text-[10px] py-2 w-[28%]">
            AB 1209
          </th>
        </tr>
      </thead>
      <tbody>
        {thresholds.map((from, i) => {
          const next = thresholds[i + 1] ?? Infinity;
          const inThis = income > from && income <= next;
          const cur = rateAt(current, from);
          const prop = rateAt(proposed, from);
          const changed = cur !== null && prop !== null && cur !== prop;
          return (
            <tr
              key={from}
              className="border-b border-[var(--color-hong-navy)]/10"
              style={
                inThis
                  ? { background: "var(--color-hong-yellow)" }
                  : undefined
              }
            >
              <td className="py-2.5 text-[13px]">
                {from === 0 ? "$0" : formatUSD(from)}
                {inThis && (
                  <span
                    className="ml-2 text-[9px] px-1.5 py-0.5 align-middle font-bold"
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
              <td className="py-2.5 text-right poster text-[15px] text-[var(--color-hong-slate)]">
                {cur !== null ? formatPercent(cur) : "—"}
              </td>
              <td
                className="py-2.5 text-right poster text-[15px]"
                style={{
                  color: changed
                    ? "var(--color-hong-navy)"
                    : "var(--color-hong-slate)",
                  fontWeight: changed ? 800 : 600,
                }}
              >
                {prop !== null ? formatPercent(prop) : "—"}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
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
  accent?: boolean;
}) {
  const accentColor = "var(--color-hong-navy)";
  const highlightBg = accent
    ? "var(--color-hong-yellow)"
    : "rgba(30, 41, 87, 0.08)";
  return (
    <div className="min-w-0">
      <h3
        className="eyebrow mb-3 pb-2 border-b-2"
        style={{ color: accentColor, borderColor: accentColor }}
      >
        {title}
      </h3>
      <table className="w-full type-small-body tabular table-fixed">
        <thead>
          <tr className="border-b border-[var(--color-hong-navy)]/20">
            <th className="text-left eyebrow text-[10px] py-2 w-[65%]">
              Income above
            </th>
            <th className="text-right eyebrow text-[10px] py-2 w-[35%]">
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
                className="border-b border-[var(--color-hong-navy)]/10"
                style={inThisBracket ? { background: highlightBg } : undefined}
              >
                <td className="py-2.5">
                  {b.from === 0 ? "$0" : formatUSD(b.from)}
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
