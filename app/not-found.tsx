import Image from "next/image";

export default function NotFound() {
  return (
    <>
      <header className="relative z-30 bg-[var(--color-hong-navy)]">
        <div className="max-w-[var(--container-wide)] mx-auto px-5 sm:px-10 lg:px-16 h-20 flex items-center">
          <a
            href="/"
            className="flex items-center shrink-0"
            aria-label="Hong for Wisconsin — back to calculator"
          >
            <Image
              src="/hong-wordmark.webp"
              alt="Francesca Hong for Governor"
              width={2000}
              height={1070}
              priority
              className="h-12 sm:h-14 w-auto"
            />
          </a>
        </div>
      </header>
      <main className="bg-[var(--color-hong-navy)] text-[var(--color-hong-cream)] flex-1">
        <div className="stripe-tape" aria-hidden />
        <div className="max-w-[var(--container-wide)] mx-auto px-5 sm:px-10 lg:px-16 py-24 sm:py-32">
          <p className="eyebrow text-[var(--color-hong-yellow)] mb-6">
            ★ 404 — page not found ★
          </p>
          <h1 className="poster-mega text-[clamp(3rem,12vw,8rem)] uppercase text-[var(--color-hong-yellow)]">
            Wrong
            <br />
            <span className="text-[var(--color-hong-cream)]">page.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-[19px] sm:text-[24px] font-display font-medium text-[color:rgba(250,246,232,0.92)] leading-snug">
            The thing you&rsquo;re looking for moved or never existed. The tax
            calculator hasn&rsquo;t.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="/" className="btn-primary">
              ↗ Back to the calculator
            </a>
            <a
              href="https://francescahong.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary btn-on-navy"
            >
              Hong for Wisconsin
            </a>
          </div>
        </div>
      </main>
      <footer className="bg-[var(--color-hong-navy)] text-[color:rgba(250,246,232,0.55)] text-xs py-6">
        <div className="max-w-[var(--container-wide)] mx-auto px-5 sm:px-10 lg:px-16 flex flex-col sm:flex-row justify-between gap-2">
          <p>Paid for by Hong for Wisconsin</p>
          <p>© 2026 Hong for Wisconsin</p>
        </div>
      </footer>
    </>
  );
}
