import { useEffect, useRef, useState } from "react";

const metrics = [
  { value: 500, suffix: "+", label: "Unique Cards" },
  { value: 3000, suffix: "+", label: "Active Players" },
  { value: 50, suffix: "+", label: "Guild Servers" },
  { value: 100000, suffix: "+", label: "Battles Fought" },
];

function useCountUp(target: number, run: boolean, duration = 1600) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      // spring-like ease-out
      const e = 1 - Math.pow(1 - p, 4);
      setN(Math.floor(target * e));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target, duration]);
  return n;
}

function Metric({ m, run }: { m: (typeof metrics)[number]; run: boolean }) {
  const n = useCountUp(m.value, run);
  const display = m.value >= 1000 ? n.toLocaleString() : n.toString();
  return (
    <div className="text-center">
      <div className="font-display text-4xl font-bold text-white sm:text-5xl">
        {display}
        <span className="text-gradient-hero">{m.suffix}</span>
      </div>
      <div className="mt-2 text-[11px] uppercase tracking-[0.25em] text-white/55">{m.label}</div>
    </div>
  );
}

export function StatsCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => entry.isIntersecting && setRun(true), {
      threshold: 0.3,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="py-20">
      <div ref={ref} className="mx-auto max-w-5xl px-4">
        <div className="glass-strong hairline-ring rounded-2xl p-10">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {metrics.map((m) => (
              <Metric key={m.label} m={m} run={run} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
