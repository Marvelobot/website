const steps = [
  { n: "01", title: "Card Spawn", desc: "Chat activity triggers a hero drop into your channel." },
  {
    n: "02",
    title: "Guess & Claim",
    desc: "Fastest correct guess locks the card to your collection.",
  },
  {
    n: "03",
    title: "Fuse & Level",
    desc: "Combine duplicates to ascend cards toward their 5-star peak.",
  },
  {
    n: "04",
    title: "Clash in PvP",
    desc: "Field a 3v3 squad and climb the seasonal arena ladder.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-cosmic-gold">How It Works</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-5xl">
            Four steps. Infinite replay.
          </h2>
        </div>

        <div className="relative mt-14">
          {/* dashed gradient connector */}
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-8 hidden h-px w-full md:block"
            preserveAspectRatio="none"
            viewBox="0 0 100 1"
          >
            <defs>
              <linearGradient id="dash" x1="0" x2="1">
                <stop offset="0%" stopColor="#DC2626" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
            </defs>
            <line
              x1="6"
              y1="0.5"
              x2="94"
              y2="0.5"
              stroke="url(#dash)"
              strokeWidth="0.6"
              strokeDasharray="1.5 1.5"
            />
          </svg>

          <ol className="grid gap-6 md:grid-cols-4">
            {steps.map((s) => (
              <li key={s.n} className="glass-panel hairline-ring relative p-6">
                <div className="grid h-16 w-16 place-items-center rounded-full border border-white/10 bg-black/60 font-display text-xl text-white shadow-[0_0_32px_-10px_rgba(245,158,11,0.55)]">
                  {s.n}
                </div>
                <h3 className="mt-5 font-display text-lg text-white">{s.title}</h3>
                <p className="mt-2 text-sm text-white/60">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
