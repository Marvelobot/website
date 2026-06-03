import {
  CollectionIcon, DustIcon, EventIcon, LevelIcon, MarketIcon, TradeIcon,
} from "./icons";

const tiles = [
  {
    title: "Card Collection",
    desc: "Curate frames, character grids, and ascended editions in one elegant gallery.",
    icon: CollectionIcon,
    span: "lg:col-span-2 lg:row-span-2",
    visual: "grid",
  },
  {
    title: "Player Market",
    desc: "Dynamic trade fees, reputation tiers, and live pricing curves.",
    icon: MarketIcon,
    span: "lg:col-span-1",
    visual: "chart",
  },
  {
    title: "Progression Levels",
    desc: "Climb from level 1 to 100, unlocking achievements and exclusive frames.",
    icon: LevelIcon,
    span: "lg:col-span-1",
    visual: "bars",
  },
  {
    title: "Events & Editions",
    desc: "Gold-bordered limited drops timed to seasonal sagas.",
    icon: EventIcon,
    span: "lg:col-span-2",
    visual: "event",
  },
  {
    title: "Trading & Gifting",
    desc: "Secure two-sided trade menus and persistent wishlists.",
    icon: TradeIcon,
    span: "lg:col-span-1",
    visual: "trade",
  },
  {
    title: "Cosmic Dust Packs",
    desc: "Dismantle duplicates, refine cosmic dust, and crack open premium packs.",
    icon: DustIcon,
    span: "lg:col-span-1",
    visual: "pack",
  },
];

function Visual({ kind }: { kind: string }) {
  switch (kind) {
    case "grid":
      return (
        <div className="mt-6 grid grid-cols-4 gap-2 sm:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] rounded-md border border-white/10"
              style={{
                background:
                  i % 5 === 0
                    ? "linear-gradient(160deg, #DC262644, #F59E0B22)"
                    : i % 3 === 0
                      ? "linear-gradient(160deg, #7C3AED33, #0ea5e922)"
                      : "linear-gradient(160deg, #ffffff08, #ffffff03)",
              }}
            />
          ))}
        </div>
      );
    case "chart":
      return (
        <svg viewBox="0 0 200 80" className="mt-6 h-20 w-full">
          <defs>
            <linearGradient id="ch" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 60 Q40 30 70 40 T140 25 T200 15 L200 80 L0 80 Z" fill="url(#ch)" />
          <path d="M0 60 Q40 30 70 40 T140 25 T200 15" stroke="#F59E0B" strokeWidth="1.5" fill="none" />
        </svg>
      );
    case "bars":
      return (
        <div className="mt-6 space-y-2">
          {[80, 64, 48].map((w, i) => (
            <div key={i} className="h-2 rounded-full bg-white/5">
              <div className="h-full rounded-full bg-gradient-hero" style={{ width: `${w}%` }} />
            </div>
          ))}
          <div className="pt-2 font-display text-2xl text-white">LVL 87<span className="text-white/40 text-base">/100</span></div>
        </div>
      );
    case "event":
      return (
        <div className="mt-6 grid grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] rounded-md"
              style={{
                background: "linear-gradient(160deg, #1a1a22, #0b0b12)",
                border: "1px solid #F59E0B66",
                boxShadow: "0 0 24px -8px #F59E0B55",
              }}
            />
          ))}
        </div>
      );
    case "trade":
      return (
        <div className="mt-6 flex items-center justify-between gap-2">
          <div className="h-16 w-12 rounded border border-white/10 bg-gradient-to-br from-marvel-red/30 to-transparent" />
          <svg className="h-6 w-6 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="1.5" d="M4 8h13l-3-3M20 16H7l3 3" /></svg>
          <div className="h-16 w-12 rounded border border-white/10 bg-gradient-to-br from-cosmic-gold/30 to-transparent" />
        </div>
      );
    case "pack":
      return (
        <div className="mt-6 flex items-center justify-center">
          <div className="relative h-20 w-14 rounded-md border border-white/15 bg-gradient-to-b from-marvel-red/40 to-black">
            <div className="absolute inset-x-2 top-2 h-1 rounded-full bg-cosmic-gold/60" />
            <div className="absolute inset-x-2 top-5 h-1 rounded-full bg-cosmic-gold/30" />
          </div>
        </div>
      );
  }
  return null;
}

export function FeaturesBento() {
  return (
    <section id="features" className="relative py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-cosmic-gold">Capabilities</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-5xl">
            Everything a collector needs
          </h2>
          <p className="mt-4 text-white/60">
            A complete card-game economy living natively inside Discord — built for
            speed, depth, and obsession.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-4 lg:auto-rows-[240px]">
          {tiles.map((t) => {
            const Icon = t.icon;
            return (
              <article
                key={t.title}
                className={`glass-panel hairline-ring relative flex flex-col overflow-hidden p-6 transition-colors hover:bg-white/[0.05] ${t.span}`}
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-cosmic-gold">
                    <Icon className="h-4 w-4" />
                  </span>
                  <h3 className="font-display text-sm uppercase tracking-widest text-white">
                    {t.title}
                  </h3>
                </div>
                <p className="mt-3 max-w-md text-sm text-white/60">{t.desc}</p>
                <Visual kind={t.visual} />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
