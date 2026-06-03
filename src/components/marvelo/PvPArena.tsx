import { BoltIcon, BrainIcon, FistIcon, ShieldIcon, SparkIcon, SpeedIcon } from "./icons";

const stats = [
  { name: "Intelligence", icon: BrainIcon, you: 88, foe: 72 },
  { name: "Strength", icon: FistIcon, you: 92, foe: 80 },
  { name: "Speed", icon: SpeedIcon, you: 76, foe: 85 },
  { name: "Durability", icon: ShieldIcon, you: 81, foe: 78 },
  { name: "Power", icon: BoltIcon, you: 95, foe: 88 },
  { name: "Combat", icon: SparkIcon, you: 84, foe: 79 },
];

export function PvPArena() {
  return (
    <section id="arena" className="relative py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cosmic-gold">PvP Arena</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-5xl">
              Six-stat combat. Zero luck.
            </h2>
            <p className="mt-4 max-w-lg text-white/60">
              Every clash resolves across six attributes drawn from the classic
              hero codex. Build squads that outclass on Intelligence, overpower on
              Strength, or out-tempo on Speed.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {stats.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.name} className="glass-panel hairline-ring p-4">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-cosmic-gold" />
                      <span className="text-xs uppercase tracking-widest text-white/70">{s.name}</span>
                    </div>
                    <div className="mt-3 grid grid-cols-[1fr_auto] items-center gap-3 text-[11px]">
                      <div className="h-1.5 rounded-full bg-white/5">
                        <div className="h-full rounded-full bg-gradient-hero" style={{ width: `${s.you}%` }} />
                      </div>
                      <span className="font-display text-white">{s.you}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Battle simulator mockup */}
          <div className="glass-strong relative overflow-hidden rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-white/60">
              <span>Squad Alpha</span>
              <span className="rounded-full bg-marvel-red/20 px-2 py-0.5 text-marvel-red">LIVE · Round 3</span>
              <span>Squad Vex</span>
            </div>

            <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[3/4] rounded-md border border-marvel-red/40"
                    style={{
                      background: "linear-gradient(160deg, #DC262655, #0b0b12)",
                      boxShadow: i === 1 ? "0 0 30px -6px #DC2626aa" : "0 0 14px -8px #DC262666",
                    }}
                  />
                ))}
              </div>

              <div className="flex flex-col items-center font-display text-white">
                <span className="text-2xl">VS</span>
                <div className="mt-2 h-16 w-px bg-gradient-to-b from-marvel-red to-cosmic-gold" />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[3/4] rounded-md border border-cosmic-gold/40"
                    style={{
                      background: "linear-gradient(160deg, #F59E0B44, #0b0b12)",
                      boxShadow: i === 0 ? "0 0 30px -6px #F59E0Baa" : "0 0 14px -8px #F59E0B66",
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-white/10 bg-black/40 p-3 font-mono text-[11px] text-white/75">
              <div><span className="text-cosmic-gold">▸</span> Star Ascendant strikes for 412 (crit)</div>
              <div><span className="text-marvel-red">▸</span> Void Hunter counters · 286</div>
              <div className="text-white/45">Round resolved · advantage Alpha +126</div>
            </div>

            <div className="mt-4 flex items-center justify-between text-[11px] text-white/55">
              <span>HP 2,840 / 3,200</span>
              <span>Turn 7 · Combo x3</span>
              <span>HP 2,180 / 3,000</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
