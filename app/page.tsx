import Image from "next/image";
import { Calculator } from "@/components/Calculator";
import type { FilingStatus } from "@/lib/bill";
import { parseIncomeInput } from "@/lib/format";

const VALID_STATUSES: FilingStatus[] = ["single", "mfj", "mfs"];

type SearchParams = Promise<{ income?: string; status?: string }>;

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const parsedIncome = parseIncomeInput(sp.income ?? "");
  const initialIncome = parsedIncome > 0 ? parsedIncome : 75_000;
  const initialStatus: FilingStatus =
    sp.status && (VALID_STATUSES as string[]).includes(sp.status)
      ? (sp.status as FilingStatus)
      : "single";

  return (
    <>
      <SiteHeader />
      <main>
        <Calculator
          defaultIncome={initialIncome}
          defaultStatus={initialStatus}
        />
        <UnequalSection />
        <RevenueSection />
        <FrancescaSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}

function SiteHeader() {
  return (
    <header className="relative z-30 bg-[var(--color-hong-navy)]">
      <div className="max-w-[var(--container-wide)] mx-auto px-5 sm:px-10 lg:px-16 h-24 sm:h-28 flex items-center justify-between gap-4">
        <a href="https://francescahong.com/" target="_blank" rel="noopener noreferrer" className="flex items-center shrink-0">
          <Image
            src="/hong-wordmark.webp"
            alt="Francesca Hong for Governor"
            width={2000}
            height={1070}
            priority
            className="h-16 sm:h-20 w-auto"
          />
        </a>
        <nav className="flex items-center gap-2 sm:gap-3 shrink-0">
          <a
            href="https://docs.legis.wisconsin.gov/2025/related/proposals/ab1209"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary btn-on-navy hidden sm:inline-flex"
          >
            Read AB&nbsp;1209
          </a>
          <a
            href="https://secure.actblue.com/donate/website_fh?refcode=taxcalc"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary !py-2.5 !px-4 sm:!py-3.5 sm:!px-6"
          >
            Chip in
          </a>
        </nav>
      </div>
    </header>
  );
}

function UnequalSection() {
  return (
    <section className="relative z-10 mt-24 lg:mt-36">
      <div className="max-w-[var(--container-wide)] mx-auto px-5 sm:px-10 lg:px-16">
        <p className="eyebrow text-[var(--color-hong-navy)] mb-4">
          ★ The system is rigged ★
        </p>
        <h2 className="poster text-[clamp(2.6rem,6.5vw,4.5rem)] text-[var(--color-hong-navy)] uppercase max-w-5xl">
          Working people
          <br />
          pay their fair share.
          <br />
          <span className="hl-yellow">The wealthy don&rsquo;t.</span>
        </h2>
        <p className="type-body mt-8 max-w-3xl text-[var(--color-hong-ink)]">
          Right now in Wisconsin, a teacher pulling double shifts pays a higher
          effective rate than a millionaire collecting capital gains. A nurse
          pays referendum after referendum to keep her kids&rsquo; school open
          while billion-dollar corporations get tax breaks. Our state cuts
          subsidy checks to the wealthiest few while working families do the
          actual work of building Wisconsin.
        </p>
        <p className="type-body mt-5 max-w-3xl text-[var(--color-hong-ink)]">
          <strong className="text-[var(--color-hong-navy)]">
            Francesca&rsquo;s plan ends that.
          </strong>{" "}
          A single new top tax bracket on income above $1 million. A modest bump
          on income above $323k. <strong>That&rsquo;s it.</strong>{" "}
          Brackets 1, 2,
          and 3 — where almost every Wisconsinite lives — don&rsquo;t move a
          basis point.
        </p>

        <div className="mt-14 grid sm:grid-cols-3 gap-4 sm:gap-6">
          <Stat big="99%" label="of Wisconsinites pay $0 more" />
          <Stat big="$1M+" label="where the new top rate kicks in" featured />
          <Stat big="100%" label="of revenue routed to schools" />
        </div>
      </div>
    </section>
  );
}

function Stat({
  big,
  label,
  featured,
}: {
  big: string;
  label: string;
  featured?: boolean;
}) {
  return (
    <div
      className={`p-7 ${
        featured
          ? "bg-[var(--color-hong-yellow)] text-[var(--color-hong-navy)]"
          : "bg-[var(--color-hong-navy)] text-[var(--color-hong-yellow)]"
      }`}
    >
      <div className="poster-mega tabular text-[clamp(3.2rem,7vw,5rem)]">
        {big}
      </div>
      <p
        className={`eyebrow mt-2 ${
          featured
            ? "text-[var(--color-hong-navy)]"
            : "text-[var(--color-hong-yellow)]"
        }`}
      >
        {label}
      </p>
    </div>
  );
}

function RevenueSection() {
  return (
    <section className="relative z-10 mt-24 lg:mt-36">
      <div className="max-w-[var(--container-wide)] mx-auto px-5 sm:px-10 lg:px-16">
        <p className="eyebrow text-[var(--color-hong-navy)] mb-4">
          ★ Where every new dollar goes ★
        </p>
        <h2 className="poster text-[clamp(2.6rem,6.5vw,4.5rem)] text-[var(--color-hong-navy)] uppercase max-w-5xl">
          Money the wealthy
          <br />
          were keeping.
          <br />
          <span className="hl-yellow">Now it goes to your kid&rsquo;s school.</span>
        </h2>

        <div className="mt-14 grid md:grid-cols-3 gap-8">
          <RevenueCard
            stat="90%"
            statLabel="Special-ed reimbursement"
            note="Up from 42%. Districts stop having to choose between special education and everything else. Money the state was leaving to your property tax bill."
            cite={{
              label: "AB 1209, sec. 26",
              href: "https://docs.legis.wisconsin.gov/2025/related/proposals/ab1209",
            }}
          />
          <RevenueCard
            stat="41–44%"
            statLabel="Property-tax cut"
            note="When the state pays its share, your school district stops asking you to pass referendums to keep the lights on. The wealthy pay. You pay less."
            cite={{
              label: "Hong on property taxes",
              href: "https://www.facebook.com/FrancescaHongWI/posts/property-taxes-in-wisconsin-are-too-damn-high-full-stopwe-ask-more-of-homeowners/1253221483283857/",
            }}
            featured
          />
          <RevenueCard
            stat="1.4×"
            statLabel="Funding weight"
            note="Low-income and English-learner students count for more in the aid formula. Every kid, every district, every neighborhood — counted, funded, supported."
            cite={{
              label: "AB 1209, sec. 31",
              href: "https://docs.legis.wisconsin.gov/2025/related/proposals/ab1209",
            }}
          />
        </div>
      </div>
    </section>
  );
}

function RevenueCard({
  stat,
  statLabel,
  note,
  cite,
  featured,
}: {
  stat: string;
  statLabel: string;
  note: string;
  cite: { label: string; href: string };
  featured?: boolean;
}) {
  if (featured) {
    return (
      <article className="relative bg-[var(--color-hong-yellow)] border-2 border-[var(--color-hong-navy)] p-7 lg:-translate-y-3">
        <div className="poster-mega tabular text-[clamp(3rem,7vw,4.5rem)] text-[var(--color-hong-navy)]">
          {stat}
        </div>
        <p className="eyebrow mt-2 text-[var(--color-hong-navy)]">{statLabel}</p>
        <p className="mt-4 type-body-16 text-[var(--color-hong-ink)]">{note}</p>
        <a
          href={cite.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block type-caption text-[var(--color-hong-navy)] hover:underline"
        >
          ↗ {cite.label}
        </a>
      </article>
    );
  }
  return (
    <article className="relative bg-[var(--color-hong-cream)] border-2 border-[var(--color-hong-navy)] p-7">
      <div className="poster-mega tabular text-[clamp(3rem,7vw,4.5rem)] text-[var(--color-hong-navy)]">
        {stat}
      </div>
      <p className="eyebrow mt-2 text-[var(--color-hong-navy)]">{statLabel}</p>
      <p className="mt-4 type-body-16 text-[var(--color-hong-ink)]">{note}</p>
      <a
        href={cite.href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-block type-caption text-[var(--color-hong-navy)] hover:underline"
      >
        ↗ {cite.label}
      </a>
    </article>
  );
}

function FrancescaSection() {
  return (
    <section className="relative mt-24 lg:mt-36">
      <div className="max-w-[var(--container-wide)] mx-auto px-5 sm:px-10 lg:px-16">
        <div className="bg-[var(--color-hong-navy)] text-[var(--color-hong-cream)] p-8 sm:p-14 lg:p-20 relative overflow-hidden">
          <div
            aria-hidden
            className="absolute -top-12 -right-8 poster text-[14rem] sm:text-[20rem] leading-none text-[var(--color-hong-yellow)]/40 select-none pointer-events-none"
          >
            &ldquo;
          </div>
          <p className="eyebrow text-[var(--color-hong-yellow)] mb-5">
            ★ Francesca, in her own words ★
          </p>
          <blockquote className="relative max-w-4xl space-y-6">
            <p className="type-h3 leading-tight">
              I&rsquo;m very tired of our state providing subsidies for the
              wealthiest few and the largest corporations.
            </p>
            <p className="type-h3 leading-tight">
              Tax fairness is going to{" "}
              <span className="text-[var(--color-hong-yellow)]">
                generate the revenue
              </span>{" "}
              we need — and stop the working class from paying a higher
              percentage than the people at the top.
            </p>
            <p className="type-subheading text-[color:rgba(250,246,232,0.85)]">
              I&rsquo;m a single mom juggling two jobs. From the State Capitol
              to night shifts behind the bar, I know what working people are up
              against. That&rsquo;s why we&rsquo;re reclaiming the power of
              sewer socialism — investing in clean water, public schools, and
              the things that built Wisconsin in the first place.
            </p>
            <footer className="pt-2 eyebrow text-[var(--color-hong-yellow)]">
              — Rep. Francesca Hong, Wisconsin Assembly District 76
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="relative mt-24 lg:mt-32 mb-24">
      <div className="max-w-[var(--container-wide)] mx-auto px-5 sm:px-10 lg:px-16">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 items-end">
          <div>
            <p className="eyebrow text-[var(--color-hong-navy)] mb-4">
              ★ Stand with Francesca ★
            </p>
            <h2 className="poster text-[clamp(2.6rem,6.5vw,4.5rem)] uppercase text-[var(--color-hong-navy)]">
              We make
              <br />
              <span className="hl-yellow">better possible.</span>
            </h2>
            <p className="type-body mt-6 max-w-xl text-[var(--color-hong-ink)]">
              The wealthy already have a movement. It&rsquo;s called every
              tax break of the last forty years. Time for ours.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <a
              href="https://secure.actblue.com/donate/website_fh?refcode=taxcalc"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary justify-center"
            >
              Chip in to Hong
            </a>
            <a
              href="https://francescahong.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary justify-center"
            >
              Visit campaign site
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="relative z-10 bg-[var(--color-hong-navy)] text-[var(--color-hong-cream)]">
      <div className="stripe-tape" aria-hidden />
      <div className="max-w-[var(--container-wide)] mx-auto px-5 sm:px-10 lg:px-16 py-14">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <Image
              src="/hong-wordmark.webp"
              alt="Francesca Hong for Governor"
              width={2000}
              height={1070}
              className="h-24 sm:h-28 w-auto"
            />
            <p className="poster text-[var(--color-hong-yellow)] uppercase mt-7 text-[22px] tracking-[0.05em]">
              We make better possible.
            </p>
          </div>
          <div>
            <p className="eyebrow text-[color:rgba(250,246,232,0.6)] mb-3">
              Sources
            </p>
            <ul className="space-y-2 type-small-body">
              <li>
                <a
                  className="hover:underline"
                  href="https://docs.legis.wisconsin.gov/2025/related/proposals/ab1209"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ↗ Full text of AB 1209
                </a>
              </li>
              <li>
                <a
                  className="hover:underline"
                  href="https://francescahong.com/policy/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ↗ Hong&rsquo;s policy platform
                </a>
              </li>
              <li>
                <a
                  className="hover:underline"
                  href="https://www.revenue.wi.gov/Pages/Individuals/home.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ↗ Wisconsin DOR — current tax brackets
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="eyebrow text-[color:rgba(250,246,232,0.6)] mb-3">
              About this calculator
            </p>
            <p className="type-small-body text-[color:rgba(250,246,232,0.8)] leading-relaxed">
              Estimates use 2026 indexed brackets and AB&nbsp;1209&rsquo;s
              statutory rates. A guide, not tax advice — see your situation
              with a tax professional.
            </p>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-[color:rgba(250,246,232,0.18)] flex flex-col sm:flex-row justify-between gap-4 type-caption text-[color:rgba(250,246,232,0.55)]">
          <p>Paid for by Hong for Wisconsin</p>
          <p>© 2026 Hong for Wisconsin. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
