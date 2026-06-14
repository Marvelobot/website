import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — MARVELO" },
      {
        name: "description",
        content:
          "Privacy Policy for the Marvelo Discord bot. Learn what data we collect, how we use it, and your rights.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
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
            Privacy <span className="text-gradient-hero">Policy</span>
          </h1>
          <p className="mt-4 text-sm text-white/40">
            Last updated: June 12, 2025
          </p>
        </div>

        <div className="mt-12 space-y-10">
          {/* Section 1 */}
          <Section title="1. Information We Collect">
            <p>
              Marvelo does <strong className="text-white/90">not</strong> store
              any personal or sensitive information. We only collect and store
              the following data necessary for the Bot's core functionality:
            </p>
            <ul>
              <li>
                <strong className="text-white/80">Discord User ID</strong> — A
                unique numerical identifier provided by Discord's API. This is
                not your username, email, password, or any personally
                identifiable information.
              </li>
              <li>
                <strong className="text-white/80">Discord Server (Guild) ID</strong> — Used
                to associate server-specific configurations, leaderboards, and
                settings.
              </li>
              <li>
                <strong className="text-white/80">In-Game Data</strong> — Data
                generated exclusively through your interaction with the Bot,
                including but not limited to: card collections, credits, cosmic
                dust, PvP statistics, squad compositions, trade history, and
                progression data.
              </li>
            </ul>
          </Section>

          {/* Section 2 */}
          <Section title="2. Information We Do NOT Collect">
            <p>
              We want to be explicitly clear about what we do{" "}
              <strong className="text-white/90">not</strong> collect, access, or
              store:
            </p>
            <ul>
              <li>Email addresses or phone numbers</li>
              <li>Passwords or authentication tokens</li>
              <li>Message content or chat history</li>
              <li>IP addresses or device information</li>
              <li>Real names, locations, or demographic data</li>
              <li>Direct messages or private conversations</li>
              <li>Voice or video data</li>
              <li>Financial or payment information</li>
            </ul>
          </Section>

          {/* Section 3 */}
          <Section title="3. How We Use Your Data">
            <p>The data we collect is used solely for:</p>
            <ul>
              <li>
                Providing and maintaining the Bot's core gameplay features
                (card drops, collections, battles, trading, etc.)
              </li>
              <li>
                Tracking in-game progress, leaderboards, and player statistics
              </li>
              <li>
                Enabling server-specific configurations and customization
              </li>
              <li>
                Debugging, improving, and maintaining the Bot's performance
              </li>
            </ul>
            <p>
              We do <strong className="text-white/90">not</strong> sell, rent,
              share, or distribute your data to any third parties for commercial
              purposes, advertising, analytics, or any other reason.
            </p>
          </Section>

          {/* Section 4 */}
          <Section title="4. Data Storage & Security">
            <p>
              Your data is stored on secured, access-controlled servers. We
              employ reasonable technical and organizational measures to protect
              your data against unauthorized access, alteration, disclosure, or
              destruction.
            </p>
            <p>
              However, no method of electronic transmission or storage is 100%
              secure. While we strive to use commercially acceptable means to
              protect your data, we cannot guarantee its absolute security.
            </p>
          </Section>

          {/* Section 5 */}
          <Section title="5. Data Retention & Deletion">
            <p>
              Your in-game data is retained for as long as the Bot remains
              operational and your account is active. If you wish to request
              deletion of your data, you may contact us through our Discord
              Support Server.
            </p>
            <p>
              Upon receiving a valid deletion request, we will remove all
              associated data within a reasonable timeframe. Please note that
              certain anonymized or aggregated data may be retained for
              analytical purposes and cannot be linked back to individual users.
            </p>
          </Section>

          {/* Section 6 */}
          <Section title="6. Third-Party Services">
            <p>
              Marvelo operates within the Discord platform and is subject to{" "}
              <a
                href="https://discord.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gradient-hero font-medium underline underline-offset-2"
              >
                Discord's Privacy Policy
              </a>
              . We encourage you to review Discord's privacy practices, as they
              govern the platform through which you interact with the Bot.
            </p>
            <p>
              We do not integrate with any third-party analytics, tracking, or
              advertising services.
            </p>
          </Section>

          {/* Section 7 */}
          <Section title="7. Children's Privacy">
            <p>
              Marvelo does not knowingly collect data from children under the
              age of 13 (or the applicable minimum age in your jurisdiction). If
              we become aware that a child under the minimum age has provided us
              with data, we will take steps to delete such information promptly.
            </p>
          </Section>

          {/* Section 8 */}
          <Section title="8. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. Any changes
              will be reflected on this page with an updated "Last updated"
              date. Continued use of the Bot following any modifications
              constitutes your acceptance of the revised policy.
            </p>
          </Section>

          {/* Section 9 */}
          <Section title="9. Contact Us">
            <p>
              If you have any questions, concerns, or data deletion requests,
              please reach out through our official{" "}
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
          <Link to="/terms" className="text-white/50 hover:text-white transition-colors">
            Terms of Service →
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
