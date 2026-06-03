import { CardMockup, TiltCard } from "./CardMockup";
import { StarIcon } from "./icons";

const rarities = [
  { name: "Common", color: "#94A3B8", pwr: 1200 },
  { name: "Uncommon", color: "#22C55E", pwr: 2400 },
  { name: "Rare", color: "#3B82F6", pwr: 3800 },
  { name: "Epic", color: "#A855F7", pwr: 5600 },
  { name: "Legendary", color: "#F59E0B", pwr: 7800 },
  { name: "Mythic", color: "#DC2626", pwr: 9800 },
];

export function CardShowcase() {
  return (
    <section id="showcase" className="relative py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-cosmic-gold">Showcase</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-5xl">
            Cards crafted with cinematic detail
          </h2>
          <p className="mt-4 text-white/60">
            Holographic finishes, animated rarity frames, and a dynamic tilt that
            reacts to every move you make.
          </p>
        </div>

        <div className="mt-14 grid items-start gap-8 lg:grid-cols-[1fr_1.2fr_1fr]">
          {/* Spawner drop preview */}
          <aside className="glass-panel hairline-ring p-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.25em] text-cosmic-gold">Live Drop</span>
              <span className="h-2 w-2 animate-pulse rounded-full bg-marvel-red" />
            </div>
            <p className="mt-2 text-sm text-white/70">A card has appeared in #general</p>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] rounded-md border border-white/10"
                  style={{
                    background:
                      i === 1
                        ? "linear-gradient(160deg, #DC262655, #F59E0B33)"
                        : "linear-gradient(160deg, #ffffff08, #ffffff02)",
                    boxShadow: i === 1 ? "0 0 24px -6px #DC2626aa" : undefined,
                  }}
                />
              ))}
            </div>
            <div className="mt-4 rounded-lg border border-white/10 bg-black/40 p-3 font-mono text-[11px] text-white/70">
              <div><span className="text-cosmic-gold">@you</span> claim 2</div>
              <div className="mt-1 text-white/50">Card #2 claimed — +1 Legendary</div>
            </div>
          </aside>

          {/* Center tilt card */}
          <div className="mx-auto w-full max-w-xs">
            <TiltCard>
              <CardMockup name="STAR ASCENDANT" role="Mythic · 5★" power={9820} />
            </TiltCard>
            <p className="mt-4 text-center text-xs text-white/40">Move your cursor across the card</p>
          </div>

          {/* Stats sidebar */}
          <aside className="glass-panel hairline-ring p-6">
            <span className="text-[10px] uppercase tracking-[0.25em] text-cosmic-gold">Top Collector</span>
            <div className="mt-3 font-display text-xl text-white">@orion.delta</div>
            <div className="mt-1 text-xs text-white/50">Cosmic Entity · Lv. 94</div>
            <dl className="mt-5 space-y-3 text-sm">
              {[
                ["Cards owned", "1,284"],
                ["Mythics", "27"],
                ["Win rate", "78%"],
                ["Squad rating", "9,140"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between border-b border-white/5 pb-2 last:border-0">
                  <dt className="text-white/55">{k}</dt>
                  <dd className="font-display text-white">{v}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>

        {/* Rarity ladder */}
        <div className="mt-16">
          <h3 className="font-display text-sm uppercase tracking-[0.3em] text-white/70">Rarity Ladder</h3>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {rarities.map((r) => (
              <div
                key={r.name}
                className="glass-panel hairline-ring relative p-4"
                style={{ boxShadow: `0 0 28px -10px ${r.color}` }}
              >
                <div className="flex items-center justify-between">
                  <StarIcon className="h-4 w-4" style={{ color: r.color }} />
                  <span className="text-[10px] uppercase tracking-widest text-white/50">{r.name}</span>
                </div>
                <div className="mt-3 font-display text-2xl text-white">{r.pwr.toLocaleString()}</div>
                <div className="mt-1 text-[10px] uppercase tracking-widest text-white/40">Avg Power</div>
                <div className="mt-3 h-1 w-full rounded-full bg-white/5">
                  <div className="h-full rounded-full" style={{ width: `${(r.pwr / 9800) * 100}%`, background: r.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
