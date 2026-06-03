export function FinalCTA() {
  return (
    <section id="cta" className="relative py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div
          className="glass-strong hairline-ring relative overflow-hidden rounded-3xl px-8 py-16 text-center sm:px-16"
          style={{
            background:
              "radial-gradient(900px 400px at 50% -10%, rgba(220,38,38,0.25), transparent 60%), radial-gradient(700px 300px at 50% 120%, rgba(245,158,11,0.22), transparent 60%), rgba(10,10,15,0.6)",
          }}
        >
          <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-white/70">
            Free · Public Release
          </span>
          <h2 className="mt-6 font-display text-4xl font-black tracking-tight text-white sm:text-6xl">
            Your Collection <span className="text-gradient-hero">Awaits</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-white/65">
            Add MARVELO to your server in seconds. The drop you've been waiting for
            is one command away.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-full bg-gradient-hero px-8 py-3.5 text-sm font-semibold text-white animate-pulse-glow"
            >
              Add to Discord
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-8 py-3.5 text-sm font-medium text-white/90 backdrop-blur transition-colors hover:bg-white/[0.08]"
            >
              Join Our Server
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
