import { CardMockup } from "./CardMockup";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="animate-fade-up">
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.25em] text-white/70 backdrop-blur">
            The Premier Marvel Card Bot on Discord
          </span>

          <h1 className="mt-6 font-display text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Build Your Ultimate{" "}
            <span className="text-gradient-hero">Marvel Squad</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">
            Summon legendary heroes, ascend cards through 5-star fusion, and command
            your squad in real-time 3v3 PvP arenas. Built for collectors, tuned for
            tacticians.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#cta"
              className="relative inline-flex items-center justify-center rounded-full bg-gradient-hero px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_40px_-10px_rgba(220,38,38,0.7)] animate-pulse-glow"
            >
              Add to Discord
            </a>
            <a
              href="#showcase"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-medium text-white/90 backdrop-blur transition-colors hover:bg-white/[0.07]"
            >
              Explore Cards
            </a>
          </div>

          <div className="mt-12 grid max-w-md grid-cols-3 gap-6 text-left">
            {[
              ["500+", "Unique Cards"],
              ["3,000+", "Active Players"],
              ["50+", "Guild Servers"],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="font-display text-2xl font-bold text-white">{n}</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-white/50">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating card */}
        <div className="relative mx-auto w-full max-w-sm" style={{ perspective: "1400px" }}>
          <div className="absolute inset-0 -z-10 blur-3xl">
            <div className="absolute left-1/4 top-1/4 h-48 w-48 rounded-full bg-marvel-red/40" />
            <div className="absolute right-1/4 bottom-1/4 h-48 w-48 rounded-full bg-cosmic-gold/30" />
          </div>
          <div className="animate-float">
            <CardMockup imageUrl="/hero-1.png" />
          </div>
          {/* Second smaller card behind */}
          <div
            className="pointer-events-none absolute -left-10 top-10 hidden w-48 opacity-60 sm:block animate-float"
            style={{ transform: "rotate(-12deg)", animationDelay: "-1.5s" }}
          >
            <CardMockup name="VOID HUNTER" role="Legendary · 4★" power={7400} hueA="#7C3AED" hueB="#F59E0B" imageUrl="/hero-2.png" />
          </div>
          <div
            className="pointer-events-none absolute -right-8 bottom-6 hidden w-44 opacity-60 sm:block animate-float"
            style={{ transform: "rotate(10deg)", animationDelay: "-3s" }}
          >
            <CardMockup name="NOVA STRIKER" role="Epic · 4★" power={6120} hueA="#0EA5E9" hueB="#DC2626" imageUrl="/hero-3.png" />
          </div>
        </div>
      </div>
    </section>
  );
}
