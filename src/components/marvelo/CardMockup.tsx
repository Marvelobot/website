import { useEffect, useRef, useState } from "react";
import { BoltIcon } from "./icons";

/** Stylized abstract hero card mockup — no third-party IP. */
export function CardMockup({
  name = "COSMIC SENTINEL",
  role = "Mythic · 5★",
  power = 9820,
  hueA = "#DC2626",
  hueB = "#F59E0B",
  imageUrl = "",
  className = "",
}: {
  name?: string;
  role?: string;
  power?: number;
  hueA?: string;
  hueB?: string;
  imageUrl?: string;
  className?: string;
}) {
  return (
    <div
      className={`group relative aspect-[3/4.2] w-full overflow-hidden rounded-2xl border border-white/10 ${className}`}
      style={{
        background: `linear-gradient(160deg, ${hueA}33 0%, transparent 40%), linear-gradient(330deg, ${hueB}33 0%, transparent 50%), linear-gradient(180deg, #0b0b12 0%, #07070b 100%)`,
        boxShadow: `0 30px 80px -20px ${hueA}55, 0 0 0 1px rgba(255,255,255,0.04)`,
      }}
    >
      {/* Card Artwork / Image */}
      {imageUrl ? (
        <div className="absolute inset-0 z-0 h-full w-full overflow-hidden">
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        /* Character silhouette — abstract SVG */
        <svg
          viewBox="0 0 200 240"
          className="absolute inset-0 m-auto h-[70%] w-[80%] opacity-90"
          aria-hidden
        >
          <defs>
            <radialGradient id="figGrad" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor={hueB} stopOpacity="0.9" />
              <stop offset="60%" stopColor={hueA} stopOpacity="0.5" />
              <stop offset="100%" stopColor="#000" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="figStroke" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
              <stop offset="100%" stopColor={hueB} stopOpacity="0.6" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="90" r="70" fill="url(#figGrad)" />
          <path
            d="M100 40 L130 70 L150 110 L140 180 L100 220 L60 180 L50 110 L70 70 Z"
            fill="none"
            stroke="url(#figStroke)"
            strokeWidth="1.2"
          />
          <path d="M100 60 L100 200 M70 100 L130 100 M65 140 L135 140" stroke="url(#figStroke)" strokeWidth="0.7" opacity="0.7" />
        </svg>
      )}

      {/* Holographic sheen / shine effect */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-10">
        <div
          className="absolute -inset-y-10 left-0 w-1/3 animate-sheen group-hover:w-1/2"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)",
          }}
        />
        {/* Secondary subtle shining sweep on hover */}
        <div
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />
      </div>

      {/* Top tag */}
      {!imageUrl && (
        <div className="absolute left-3 right-3 top-3 z-20 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-white/70">
          <span className="rounded-full border border-white/10 bg-black/55 px-2 py-1 backdrop-blur">
            {role}
          </span>
          <span className="font-display text-[10px] text-cosmic-gold bg-black/40 px-2 py-1 rounded-full border border-white/5 backdrop-blur">PWR {power.toLocaleString()}</span>
        </div>
      )}

      {/* Bottom label */}
      {!imageUrl && (
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
          <div className="rounded-lg border border-white/10 bg-black/65 px-3 py-2 backdrop-blur">
            <div className="font-display text-sm tracking-widest text-white group-hover:text-gradient-hero transition-colors duration-300">{name}</div>
            <div className="mt-1 flex items-center gap-2 text-[10px] text-white/60">
              <BoltIcon className="h-3 w-3 text-cosmic-gold" />
              <span>ASCENDED · TIER V</span>
            </div>
          </div>
        </div>
      )}

      {/* Inner glow ring */}
      <div className="pointer-events-none absolute inset-0 z-20 rounded-2xl ring-1 ring-inset ring-white/10" />

    </div>
  );
}

/** Interactive tilt-on-mouse card wrapper. */
export function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      setTilt({ x: -py * 14, y: px * 18 });
    };
    const onLeave = () => setTilt({ x: 0, y: 0 });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} style={{ perspective: "1200px" }} className="w-full">
      <div
        className="transition-transform duration-200 ease-out will-change-transform"
        style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
      >
        {children}
      </div>
    </div>
  );
}
