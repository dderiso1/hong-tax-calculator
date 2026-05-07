import { Calculator } from "@/components/Calculator";
import { HongMark } from "@/components/HongMark";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Calculator />
        <RevenueSection />
        <QuoteSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}

function SiteHeader() {
  return (
    <header className="relative z-30 bg-[var(--color-hong-paper)] border-b-2 border-[var(--color-hong-navy)]">
      <div className="max-w-[var(--container-wide)] mx-auto px-6 sm:px-10 lg:px-16 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <HongMark className="w-9 h-9" />
          <span className="display tracking-[0.18em] text-sm text-[var(--color-hong-navy)]">
            Hong for Wisconsin
          </span>
        </a>
        <nav className="hidden sm:flex items-center gap-1">
          <a
            href="https://docs.legis.wisconsin.gov/2025/related/proposals/ab1209"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            Read AB&nbsp;1209
          </a>
          <a
            href="https://secure.actblue.com/donate/website_fh?refcode=taxcalc"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary ml-3"
          >
            Donate
          </a>
        </nav>
      </div>
    </header>
  );
}

function RevenueSection() {
  return (
    <section className="relative z-10 mt-24 lg:mt-36">
      <div className="max-w-[var(--container-wide)] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="max-w-3xl">
          <p className="display text-xs tracking-[0.25em] text-[var(--color-hong-red)] mb-3">
            Where the money goes
          </p>
          <h2 className="display-xl text-[clamp(2.2rem,5.5vw,4.2rem)] text-[var(--color-hong-navy)]">
            Every new dollar
            <br />
            funds your kids&rsquo; school
            <br />
            and cuts your property tax.
          </h2>
          <p className="mt-6 text-lg text-[var(--color-hong-ink)] leading-relaxed max-w-2xl">
            AB&nbsp;1209 routes 100% of the new revenue into a dedicated{" "}
            <strong>school aid fund</strong>. It pays for what Wisconsin&rsquo;s
            broken funding formula has been pushing onto your property tax bill
            for two decades.
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-8">
          <RevenueCard
            stat="90%"
            statLabel="Special-ed reimbursement"
            note="Up from 42% today. Districts stop having to choose between special education and everything else."
            cite={{
              label: "AB 1209, sec. 26",
              href: "https://docs.legis.wisconsin.gov/2025/related/proposals/ab1209",
            }}
          />
          <RevenueCard
            stat="41–44%"
            statLabel="Property-tax cut"
            note="When the state pays its share, your school district stops asking you to pass referendums to keep the lights on."
            cite={{
              label: "Hong campaign press release",
              href: "https://www.wispolitics.com/2025/rep-madison-introduces-legislation-to-cut-property-taxes-by-44-while-increasing-funding-for-public-schools-and-local-communities/",
            }}
            featured
          />
          <RevenueCard
            stat="1.4×"
            statLabel="Funding weight"
            note="Low-income and English-language-learner students count for more in the aid formula — money follows kids who need it."
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
  const accent = featured
    ? "var(--color-hong-red)"
    : "var(--color-hong-navy)";
  return (
    <article
      className={`relative bg-[var(--color-hong-cream)] border-2 p-7 ${
        featured ? "lg:-translate-y-3" : ""
      }`}
      style={{ borderColor: accent }}
    >
      <div
        className="display tabular text-[clamp(3rem,7vw,4.5rem)] leading-none"
        style={{ color: accent }}
      >
        {stat}
      </div>
      <p className="display text-xs tracking-[0.2em] mt-2" style={{ color: accent }}>
        {statLabel}
      </p>
      <p className="mt-4 text-[var(--color-hong-ink)] leading-relaxed text-[15px]">
        {note}
      </p>
      <a
        href={cite.href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-block text-xs uppercase tracking-wider text-[var(--color-hong-blue)] hover:underline"
      >
        ↗ {cite.label}
      </a>
    </article>
  );
}

function QuoteSection() {
  return (
    <section className="relative mt-24 lg:mt-36">
      <div className="max-w-[var(--container-wide)] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="bg-[var(--color-hong-navy)] text-[var(--color-hong-cream)] p-10 sm:p-16 lg:p-20 relative overflow-hidden">
          <div
            aria-hidden
            className="absolute -top-12 -right-8 display text-[20rem] leading-none text-[var(--color-hong-red)]/30 select-none pointer-events-none"
          >
            &ldquo;
          </div>
          <blockquote className="relative max-w-3xl">
            <p className="display text-[clamp(1.6rem,3.5vw,2.8rem)] leading-tight">
              I&rsquo;m very tired of our state providing subsidies for the
              wealthiest few and the largest corporations. Tax fairness funds the
              investments where we need them — and stops working-class people from
              paying a higher share than the people at the top.
            </p>
            <footer className="mt-8 display text-xs tracking-[0.3em] text-[var(--color-hong-red)]">
              — Francesca Hong
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
      <div className="max-w-[var(--container-wide)] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-10 items-end">
          <div>
            <p className="display text-xs tracking-[0.25em] text-[var(--color-hong-red)] mb-3">
              Stand with Francesca
            </p>
            <h2 className="display-xl text-[clamp(2.2rem,5.5vw,4rem)] text-[var(--color-hong-navy)]">
              We make better
              <br />
              possible.
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <a
              href="https://secure.actblue.com/donate/website_fh?refcode=taxcalc"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary justify-center text-base"
            >
              Donate to the campaign
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
      <div className="max-w-[var(--container-wide)] mx-auto px-6 sm:px-10 lg:px-16 py-14">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-3">
              <HongMark variant="cream" className="w-10 h-10" />
              <div className="display tracking-[0.18em] text-sm">
                Hong for Wisconsin
              </div>
            </div>
            <p className="display text-[var(--color-hong-red)] text-sm tracking-[0.25em] mt-5">
              We make better possible.
            </p>
          </div>
          <div>
            <p className="display text-xs tracking-[0.2em] mb-3 text-[color:rgba(246,241,228,0.6)]">
              Sources
            </p>
            <ul className="space-y-2 text-sm">
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
                  href="https://www.wispolitics.com/2025/rep-madison-introduces-legislation-to-cut-property-taxes-by-44-while-increasing-funding-for-public-schools-and-local-communities/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ↗ Property-tax-cut press release
                </a>
              </li>
              <li>
                <a
                  className="hover:underline"
                  href="https://www.revenue.wi.gov/Pages/Individuals/home.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ↗ Wisconsin DOR current tax brackets
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="display text-xs tracking-[0.2em] mb-3 text-[color:rgba(246,241,228,0.6)]">
              About this calculator
            </p>
            <p className="text-sm leading-relaxed text-[color:rgba(246,241,228,0.8)]">
              Estimates use 2026 indexed brackets and AB&nbsp;1209&rsquo;s
              statutory rates. Results are a guide, not tax advice. Consult a
              tax professional for your specific situation.
            </p>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-[color:rgba(246,241,228,0.18)] flex flex-col sm:flex-row justify-between gap-4 text-xs text-[color:rgba(246,241,228,0.55)]">
          <p>Paid for by Hong for Wisconsin</p>
          <p>© 2026 Hong for Wisconsin. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
