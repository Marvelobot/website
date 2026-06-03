import { StarIcon } from "./icons";

const ranks = ["Newcomer", "Enthusiast", "Veteran", "Hero", "Avenger", "Cosmic Entity", "Living Tribunal"];
const stars = [
  { s: "1★", m: "1.0x" },
  { s: "2★", m: "1.25x" },
  { s: "3★", m: "1.5x" },
  { s: "4★", m: "1.75x" },
  { s: "5★", m: "2.0x" },
];

export function Progression() {
  return (
    <section id="progression" className="relative py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-cosmic-gold">Progression</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-5xl">
            From Newcomer to Living Tribunal
          </h2>
          <p className="mt-4 text-white/60">
            Seven collector ranks chart your ascent. Each tier unlocks new frames,
            spawn bonuses, and arena rewards.
          </p>
        </div>

        {/* Timeline */}
        <div className="mt-14">
          <div className="relative">
            <div className="absolute left-0 right-0 top-5 h-px bg-gradient-to-r from-marvel-red via-cosmic-gold to-marvel-red opacity-60" />
            <ol className="relative grid grid-cols-2 gap-y-8 sm:grid-cols-4 lg:grid-cols-7">
              {ranks.map((r, i) => (
                <li key={r} className="flex flex-col items-center text-center">
                  <span
                    className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-background font-display text-xs text-white"
                    style={{ boxShadow: `0 0 22px -8px ${i > 3 ? "#F59E0B" : "#DC2626"}` }}
                  >
                    {i + 1}
                  </span>
                  <span className="mt-3 text-[11px] uppercase tracking-widest text-white/70">{r}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Star fusion */}
        <div className="mt-20">
          <h3 className="font-display text-sm uppercase tracking-[0.3em] text-white/70">Star Fusion Multipliers</h3>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {stars.map((s, i) => (
              <div
                key={s.s}
                className="glass-panel hairline-ring p-5 text-center"
                style={{ boxShadow: i === 4 ? "0 0 32px -8px #F59E0Bcc" : undefined }}
              >
                <div className="flex items-center justify-center gap-1 text-cosmic-gold">
                  {Array.from({ length: i + 1 }).map((_, k) => (
                    <StarIcon key={k} className="h-3.5 w-3.5" />
                  ))}
                </div>
                <div className="mt-3 font-display text-3xl text-white">{s.m}</div>
                <div className="mt-1 text-[10px] uppercase tracking-widest text-white/45">
                  {i === 4 ? "Max · God Tier" : `${s.s} Tier`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
