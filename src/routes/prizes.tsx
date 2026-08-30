import { createFileRoute, Link } from "@tanstack/react-router";
import { BrandMark } from "@/components/brand-mark";

export const Route = createFileRoute("/prizes")({ component: PrizesInfo });

function PrizesInfo() {
  return (
    <main className="min-h-dvh bg-ink px-4 py-8 text-paper">
      <div className="mx-auto max-w-2xl">
        <Link to="/">
          <BrandMark />
        </Link>
        <h1 className="mt-8 font-display text-5xl text-paper uppercase">The leverage ladder</h1>
        <p className="mt-3 text-sm leading-relaxed text-paper/70">
          Walk a decade. Bank a discount. Cash out and use it — or put the whole voucher on the next pair. Miss after
          you leverage, and the run burns back to 1966.
        </p>
        <div className="mt-6 grid gap-3">
          <PrizeCard title="1966 · 15%" body="The first pair. Cash out and shop, or risk 15% for 20%." />
          <PrizeCard title="1976 · 20%" body="Schoolyard wallabee. Take 20%, or stake it for 25%." />
          <PrizeCard title="1986 · 25%" body="Black leather. Take 25%, or stake it for 30%." />
          <PrizeCard title="1996 · 30%" body="Handmade heart. Take 30%, or stake it for 35%." />
          <PrizeCard title="2006 · 35%" body="Street style desert boot. Take 35%, or stake it for 40%." />
          <PrizeCard title="2016 · 40%" body="The revival. Take 40%, or stake it for 50%." />
          <PrizeCard title="2026 · 50%" body="The 60th print. Take half off — or risk it all on the finale." />
          <PrizeCard
            title="The Golden Pair · any shoe to R1 000"
            body="Sixty hops. One life. Win any Grasshopper up to R1 000. Delivery not included. Extremely hard."
            gold
          />
        </div>
        <Link
          to="/"
          className="mt-8 inline-flex h-12 items-center bg-brand px-6 font-semibold tracking-wide text-ink uppercase"
        >
          Play Hopper
        </Link>
      </div>
    </main>
  );
}

function PrizeCard({ title, body, gold }: { title: string; body: string; gold?: boolean }) {
  return (
    <article className={gold ? "border border-brand bg-surface p-5" : "border border-line bg-surface p-5"}>
      <h2 className={gold ? "font-display text-2xl text-brand uppercase" : "font-display text-2xl text-paper uppercase"}>
        {title}
      </h2>
      <p className="mt-2 text-sm text-paper/70">{body}</p>
    </article>
  );
}
