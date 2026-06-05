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
              Every clash resolves across six attributes drawn from the classic hero codex. Build
              squads that outclass on Intelligence, overpower on Strength, or out-tempo on Speed.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {stats.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.name} className="glass-panel hairline-ring p-4">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-cosmic-gold" />
                      <span className="text-xs uppercase tracking-widest text-white/70">
                        {s.name}
                      </span>
                    </div>
                    <div className="mt-3 grid grid-cols-[1fr_auto] items-center gap-3 text-[11px]">
                      <div className="h-1.5 rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full bg-gradient-hero"
                          style={{ width: `${s.you}%` }}
                        />
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
              <span>yash_182</span>
              <span className="rounded-full bg-marvel-red/20 px-2 py-0.5 text-marvel-red">
                LIVE · Round 4
              </span>
              <span>krsna_14</span>
            </div>

            <div className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-black/40">
              <img
                src="/battle.png"
                alt="PvP Battle Arena"
                className="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-500"
              />
            </div>

            <div className="mt-6 rounded-lg border border-white/10 bg-black/40 p-3 font-mono text-[11px] text-white/75">
              <div>
                <span className="text-cosmic-gold">▸</span> Thanos strikes for 412 (crit)
                representing <span className="text-cosmic-gold">yash_182</span>
              </div>
              <div>
                <span className="text-marvel-red">▸</span> Mystique has been DEFEATED by Thanos!
              </div>
              <div className="text-white/45">
                Round 4 resolved · waiting for replacement card from{" "}
                <span className="text-white/70">krsna_14</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-[11px] text-white/55">
              <span>Wins 3 / 3</span>
              <span>Turn 4 · Active Combat</span>
              <span>Wins 2 / 3</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
