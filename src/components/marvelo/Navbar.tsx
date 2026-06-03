import { useEffect, useState } from "react";
import { CloseIcon, MenuIcon } from "./icons";

const links = [
  { label: "Features", href: "#features" },
  { label: "Showcase", href: "#showcase" },
  { label: "PvP Arena", href: "#arena" },
  { label: "How It Works", href: "#how" },
  { label: "Progression", href: "#progression" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto mt-3 max-w-6xl px-4">
        <nav className="glass-strong flex h-14 items-center justify-between rounded-2xl px-4 sm:px-6">
          <a href="#top" className="font-display text-lg font-black tracking-[0.25em] text-white">
            MARVELO
          </a>

          <ul className="hidden items-center gap-7 md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-sm text-white/70 transition-colors hover:text-white"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden md:block">
            <a
              href="#cta"
              className={`inline-flex items-center rounded-full bg-gradient-hero px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-500 ${
                scrolled ? "opacity-100 translate-y-0" : "pointer-events-none -translate-y-2 opacity-0"
              }`}
            >
              Add to Discord
            </a>
          </div>

          <button
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="md:hidden text-white/80"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
        </nav>
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-50 md:hidden ${open ? "" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />
        <aside
          className={`absolute right-0 top-0 h-full w-80 max-w-[85%] glass-strong border-l border-white/10 p-6 transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-display tracking-[0.25em] text-white">MARVELO</span>
            <button aria-label="Close menu" onClick={() => setOpen(false)} className="text-white/80">
              <CloseIcon className="h-6 w-6" />
            </button>
          </div>
          <ul className="mt-8 space-y-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-3 text-white/80 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#cta"
            onClick={() => setOpen(false)}
            className="mt-6 block rounded-full bg-gradient-hero px-4 py-3 text-center text-sm font-semibold text-white"
          >
            Add to Discord
          </a>
        </aside>
      </div>
    </header>
  );
}
