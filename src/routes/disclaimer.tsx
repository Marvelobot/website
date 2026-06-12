import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title: "Disclaimer — MARVELO" },
      {
        name: "description",
        content:
          "Legal disclaimer for the Marvelo Discord bot. Marvelo is not affiliated with Marvel Entertainment or The Walt Disney Company.",
      },
    ],
  }),
  component: DisclaimerPage,
});

function DisclaimerPage() {
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
            Legal <span className="text-gradient-hero">Disclaimer</span>
          </h1>
          <p className="mt-4 text-sm text-white/40">
            Last updated: June 12, 2025
          </p>
        </div>

        <div className="mt-12 space-y-10">
          {/* Copyright Notice - Featured prominently */}
          <section
            className="relative overflow-hidden rounded-2xl border border-red-500/20 p-6 sm:p-8"
            style={{
              background:
                "radial-gradient(600px 250px at 50% 0%, rgba(220,38,38,0.12), transparent 70%), rgba(10,10,15,0.6)",
            }}
          >
            <h2 className="font-display text-lg font-bold tracking-tight text-white">
              ⚖️ Copyright Notice
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-relaxed text-white/65">
              <p className="text-white/80 font-medium">
                Marvel Characters, Names, Logos, and all related indicia are ©
                &amp; ™ Marvel Entertainment, LLC and The Walt Disney Company.
                All rights reserved.
              </p>
              <p>
                All character names, likenesses, images, storylines, and other
                elements derived from the Marvel franchise are the exclusive
                intellectual property of their respective owners. Marvelo does
                not claim ownership, authorship, or any proprietary rights over
                any Marvel intellectual property.
              </p>
            </div>
          </section>

          {/* Non-Affiliation */}
          <Section title="1. Non-Affiliation Statement">
            <p>
              <strong className="text-white/90">
                Marvelo is NOT affiliated with, endorsed by, sponsored by, or in
                any way officially connected with Marvel Entertainment, LLC, The
                Walt Disney Company, or any of their subsidiaries, parent
                companies, affiliates, or partners.
              </strong>
            </p>
            <p>
              Marvelo neither owns nor claims to own any portion of the Marvel
              franchise. This project does not represent, impersonate, or
              attempt to be mistaken for any official Marvel product, service, or
              entity.
            </p>
            <p>
              Any use of Marvel-related names, characters, or imagery within the
              Bot is made purely for fan entertainment purposes under the
              principles of fair use and is not intended to infringe upon any
              trademarks, copyrights, or other intellectual property rights held
              by the respective owners.
            </p>
          </Section>

          {/* Fan Project */}
          <Section title="2. Independent Fan Project">
            <p>
              Marvelo is an independent, fan-themed collectible card game
              designed exclusively for the Discord community. The gameplay
              mechanics, card systems, battle algorithms, progression systems,
              economy logic, and all underlying technical infrastructure are
              entirely original, fan-created systems.
            </p>
            <p>
              This project exists solely as a non-commercial, community-driven
              fan creation. It is developed and maintained by a team of
              dedicated fans who receive no compensation for their contributions.
              All developers, designers, moderators, and staff are unpaid
              volunteers dedicating their personal time and expertise to the
              community.
            </p>
          </Section>

          {/* Monetization */}
          <Section title="3. Monetization & Financial Transparency">
            <p>
              Marvelo's monetization is tied strictly to bot functionality,
              cosmetic perks, and system features that enhance the gameplay
              experience. We do{" "}
              <strong className="text-white/90">not</strong> sell, license, or
              distribute copyrighted artwork, protected character likenesses, or
              direct access to any intellectual property owned by third parties.
            </p>
            <p>
              All donations, tips, premium subscriptions, or any other form of
              financial support contributed by users go strictly toward:
            </p>
            <ul>
              <li>Server hosting and infrastructure costs</li>
              <li>Domain and service maintenance</li>
              <li>Future development and feature improvements</li>
            </ul>
            <p>
              No individual team member receives personal payment or
              compensation from any funds received.
            </p>
          </Section>

          {/* Third-Party Rights */}
          <Section title="4. Third-Party Intellectual Property">
            <p>
              All trademarks, service marks, trade names, trade dress, product
              names, logos, and other identifiers of third parties used in or in
              connection with Marvelo are the property of their respective
              owners. Their use does not imply any affiliation with or
              endorsement by the respective rights holders.
            </p>
            <p>
              If you are a rights holder and believe that any content associated
              with Marvelo infringes upon your intellectual property rights,
              please contact us through our Discord Support Server, and we will
              promptly address your concerns in good faith.
            </p>
          </Section>

          {/* No Warranty */}
          <Section title="5. Disclaimer of Warranties">
            <p>
              The Bot and all related services are provided on an{" "}
              <strong className="text-white/90">
                "AS IS" and "AS AVAILABLE"
              </strong>{" "}
              basis, without warranties of any kind, either express or implied,
              including but not limited to implied warranties of
              merchantability, fitness for a particular purpose, and
              non-infringement.
            </p>
            <p>
              We make no representations or warranties that the Bot will be
              uninterrupted, error-free, secure, or free of viruses or other
              harmful components. You use the Bot at your own risk.
            </p>
          </Section>

          {/* Limitation */}
          <Section title="6. Limitation of Liability">
            <p>
              Under no circumstances shall Marvelo, its team members,
              volunteers, contributors, or affiliates be liable for any direct,
              indirect, incidental, special, consequential, exemplary, or
              punitive damages arising out of or in connection with your use of
              or inability to use the Bot, even if we have been advised of the
              possibility of such damages.
            </p>
          </Section>

          {/* Good Faith */}
          <Section title="7. Good Faith & Compliance">
            <p>
              Marvelo operates in good faith as a fan-created project. We
              respect the intellectual property rights of all parties and are
              committed to complying with applicable laws and regulations. Should
              any rights holder request the removal or modification of any
              content, we will cooperate fully and make changes in a timely
              manner.
            </p>
            <p>
              For any legal inquiries, takedown requests, or concerns, please
              contact us through our official{" "}
              <a
                href="https://discord.gg/uFhfGjaGW9"
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
          <Link to="/privacy" className="text-white/50 hover:text-white transition-colors">
            Privacy Policy →
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
