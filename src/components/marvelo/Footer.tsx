import { DiscordIcon, GithubIcon, XIcon } from "./icons";

const cols = [
  {
    title: "Marvelo",
    links: [["About", "#"], ["Changelog", "#"], ["Status", "#"]],
  },
  {
    title: "Quick Links",
    links: [["Features", "#features"], ["Showcase", "#showcase"], ["PvP Arena", "#arena"]],
  },
  {
    title: "Community",
    links: [["Discord Server", "#"], ["Guild Directory", "#"], ["Support", "#"]],
  },
  {
    title: "Legal",
    links: [["Terms", "#"], ["Privacy", "#"], ["Fair Play", "#"]],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          <div>
            <div className="font-display text-xl font-black tracking-[0.25em] text-white">MARVELO</div>
            <p className="mt-4 max-w-xs text-sm text-white/55">
              The premier Marvel-themed card collecting and battle experience built
              for Discord communities.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[
                { Icon: DiscordIcon, label: "Discord" },
                { Icon: GithubIcon, label: "GitHub" },
                { Icon: XIcon, label: "X" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="font-display text-xs uppercase tracking-[0.25em] text-white/80">{c.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {c.links.map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className="text-sm text-white/55 transition-colors hover:text-white">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 text-xs text-white/40 sm:flex-row">
          <span>© {new Date().getFullYear()} Marvelo. All rights reserved.</span>
          <span>Not affiliated with Marvel Entertainment, LLC.</span>
        </div>
      </div>
    </footer>
  );
}
