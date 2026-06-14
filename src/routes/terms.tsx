import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — MARVELO" },
      {
        name: "description",
        content:
          "Terms of Service for the Marvelo Discord bot. Read about usage policies, user conduct, and service terms.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto mt-3 max-w-6xl px-4">
          <nav className="glass-strong flex h-14 items-center justify-between rounded-2xl px-4 sm:px-6">
            <Link
              to="/"
              className="font-display text-lg font-black tracking-[0.25em] text-white"
            >
              MARVELO
            </Link>
            <Link
              to="/"
              className="text-sm text-white/70 transition-colors hover:text-white"
            >
              ← Back to Home
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pt-32 pb-20">
        <div className="animate-fade-up">
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.25em] text-white/70 backdrop-blur">
            Legal
          </span>
          <h1 className="mt-6 font-display text-4xl font-black tracking-tight text-white sm:text-5xl">
            Terms of <span className="text-gradient-hero">Service</span>
          </h1>
          <p className="mt-4 text-sm text-white/40">
            Last updated: June 12, 2025
          </p>
        </div>

        <div className="mt-12 space-y-10">
          {/* Section 1 */}
          <Section title="1. Acceptance of Terms">
            <p>
              By accessing, using, or interacting with the Marvelo Discord bot
              ("the Bot," "Marvelo," "we," "us," or "our"), you acknowledge that
              you have read, understood, and agree to be bound by these Terms of
              Service ("Terms"). If you do not agree to these Terms, you must
              immediately cease all use of the Bot.
            </p>
            <p>
              These Terms apply to all users, including but not limited to server
              administrators who add the Bot, members who interact with its
              commands, and visitors who access our website.
            </p>
          </Section>

          {/* Section 2 */}
          <Section title="2. Description of Service">
            <p>
              Marvelo is an independent, fan-themed collectible card game
              designed exclusively for the Discord platform. The Bot provides
              entertainment features including, but not limited to:
            </p>
            <ul>
              <li>Card collecting, trading, and fusion mechanics</li>
              <li>Player-versus-player (PvP) battle arenas</li>
              <li>Squad building and progression systems</li>
              <li>In-game economy (credits, cosmic dust)</li>
              <li>Server-based leaderboards and competitions</li>
            </ul>
            <p>
              The gameplay, card systems, and technical infrastructure are
              entirely original, fan-created systems. The Bot is provided on an
              "as is" and "as available" basis.
            </p>
          </Section>

          {/* Section 3 */}
          <Section title="3. Eligibility">
            <p>
              You must meet the minimum age requirements set by Discord's own
              Terms of Service (currently 13 years of age, or the applicable age
              in your jurisdiction) to use Marvelo. By using the Bot, you
              represent and warrant that you meet these requirements.
            </p>
          </Section>

          {/* Section 4 */}
          <Section title="4. User Conduct">
            <p>You agree not to:</p>
            <ul>
              <li>
                Exploit, abuse, or manipulate the Bot through bugs, glitches, or
                unauthorized automation (including self-bots, macros, or
                scripts).
              </li>
              <li>
                Attempt to gain unauthorized access to any part of the Bot's
                systems, databases, or infrastructure.
              </li>
              <li>
                Engage in real-money trading (RMT) of in-game items, cards,
                accounts, or currency unless explicitly authorized.
              </li>
              <li>
                Use the Bot to harass, defame, threaten, or otherwise violate the
                legal rights of others.
              </li>
              <li>
                Reverse-engineer, decompile, or create derivative works based on
                the Bot's code or systems.
              </li>
              <li>
                Interfere with or disrupt the Bot's services, servers, or
                networks.
              </li>
            </ul>
          </Section>

          {/* Section 5 */}
          <Section title="5. Virtual Items & In-Game Economy">
            <p>
              All virtual items, cards, currency, and other in-game assets are
              the property of Marvelo and are licensed to you on a
              non-transferable, non-exclusive, revocable basis. Virtual items
              have no real-world monetary value and cannot be redeemed for cash
              or any form of real-world consideration.
            </p>
            <p>
              We reserve the right to modify, rebalance, remove, or reset any
              virtual items or account data at our discretion, including but not
              limited to balancing adjustments, bug fixes, or policy enforcement.
            </p>
          </Section>

          {/* Section 6 */}
          <Section title="6. Support & Monetization">
            <p>
              Our monetization is tied strictly to bot functionality, cosmetic
              perks, and system features. We do not sell copyrighted artwork or
              provide direct access to protected intellectual property.
            </p>
            <p>
              All donations, tips, or financial support go strictly toward
              server hosting costs and future development of the Bot. No member
              of the Marvelo team receives personal compensation — all
              developers, designers, and staff are unpaid fans and volunteers
              dedicating their time to the community.
            </p>
          </Section>

          {/* Section 7 */}
          <Section title="7. Termination & Suspension">
            <p>
              We reserve the right to suspend, restrict, or permanently ban any
              user or server from accessing the Bot at our sole discretion, with
              or without prior notice, for any reason including but not limited
              to violations of these Terms.
            </p>
            <p>
              Upon termination, your right to access and use the Bot ceases
              immediately. We are not obligated to maintain, return, or
              compensate for any data, virtual items, or progress associated with
              terminated accounts.
            </p>
          </Section>

          {/* Section 8 */}
          <Section title="8. Limitation of Liability">
            <p>
              To the fullest extent permitted by applicable law, Marvelo and its
              team shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages, including but not limited to
              loss of data, loss of virtual items, service interruptions, or any
              damages arising from your use or inability to use the Bot.
            </p>
          </Section>

          {/* Section 9 */}
          <Section title="9. Modifications to Terms">
            <p>
              We reserve the right to update or modify these Terms at any time.
              Continued use of the Bot following any changes constitutes your
              acceptance of the revised Terms. It is your responsibility to
              review these Terms periodically.
            </p>
          </Section>

          {/* Section 10 */}
          <Section title="10. Contact">
            <p>
              If you have any questions or concerns about these Terms, you may
              reach us through our official{" "}
              <a
                href="https://discord.gg/bGh2wh8d3U"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gradient-hero font-medium underline underline-offset-2"
              >
                Discord Support Server
              </a>
              .
            </p>
          </Section>
        </div>

        {/* Footer nav */}
        <div className="mt-16 flex flex-wrap gap-4 border-t border-white/5 pt-8 text-sm">
          <Link to="/privacy" className="text-white/50 hover:text-white transition-colors">
            Privacy Policy →
          </Link>
          <Link to="/disclaimer" className="text-white/50 hover:text-white transition-colors">
            Disclaimer →
          </Link>
        </div>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="glass-strong hairline-ring rounded-2xl p-6 sm:p-8">
      <h2 className="font-display text-lg font-bold tracking-tight text-white">
        {title}
      </h2>
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-white/65 [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_a]:text-white/80">
        {children}
      </div>
    </section>
  );
}
