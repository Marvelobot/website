import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Footer } from "../components/marvelo/Footer";

export const Route = createFileRoute("/premium")({
  head: () => ({
    meta: [
      { title: "Premium Plans — MARVELO" },
      {
        name: "description",
        content:
          "Upgrade your Marvelo experience with User Premium and Server Premium subscriptions. Lower cooldowns, more spawns, and exclusive cosmetics.",
      },
    ],
  }),
  component: PremiumPage,
});

function PremiumPage() {
  const [activeTab, setActiveTab] = useState<"user" | "server">("user");

  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col justify-between">
      <div>
        {/* Navigation Bar */}
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

        {/* Hero Section */}
        <main className="mx-auto max-w-6xl px-4 pt-32 pb-20">
          <div className="text-center animate-fade-up">
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.25em] text-white/70 backdrop-blur">
              Subscribers
            </span>
            <h1 className="mt-6 font-display text-4xl font-black tracking-tight text-white sm:text-6xl">
              Unleash the Power of <span className="text-gradient-hero">Premium</span>
            </h1>
            <p className="mt-4 mx-auto max-w-2xl text-base text-white/55">
              Support the bot and level up your card collecting experience. Pick a subscription plan that suits your gameplay.
            </p>

            {/* Google-style Switcher Bar */}
            <div className="mt-12 flex justify-center">
              <div className="inline-flex rounded-full bg-white/[0.03] border border-white/10 p-1 backdrop-blur-md">
                <button
                  onClick={() => setActiveTab("user")}
                  className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${
                    activeTab === "user"
                      ? "bg-white text-black shadow-lg"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  👤 User Premium
                </button>
                <button
                  onClick={() => setActiveTab("server")}
                  className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${
                    activeTab === "server"
                      ? "bg-white text-black shadow-lg"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  🏛️ Server Premium
                </button>
              </div>
            </div>
          </div>

          {/* User Premium Tab */}
          {activeTab === "user" && (
            <div className="mt-16 space-y-16 animate-fade-in">
              <div className="grid gap-8 md:grid-cols-3">
                {/* Basic Tier */}
                <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-8 transition-transform duration-300 hover:scale-[1.02] flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-2xl font-bold text-white">Basic Tier</h3>
                    <p className="mt-2 text-sm text-white/50">Great for casual players looking for a slight edge.</p>
                    <div className="mt-6">
                      <span className="text-4xl font-black text-white">$3</span>
                      <span className="text-sm text-white/50"> / month</span>
                    </div>
                    <ul className="mt-8 space-y-4">
                      {["⏱️ 45-minute drop cooldown (instead of 1 hour)", "⚡ 1.2x Coins & Cosmic Dust from /daily", "📈 +15% XP Boost from all activities", "🪙 Marketplace transaction tax reduced to 8%", "🎫 Exclusive Basic Profile Badge & 1 background"].map((p, idx) => (
                        <li key={idx} className="flex items-start text-sm text-white/80">
                          <span className="mr-2.5">{p.slice(0, 2)}</span>
                          <span>{p.slice(3)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button className="mt-8 w-full py-3 px-4 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/15 transition-colors">
                    Subscribe
                  </button>
                </div>

                {/* Elite Tier */}
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl transition-transform duration-300 hover:scale-[1.02] flex flex-col justify-between"
                  style={{
                    background: "radial-gradient(400px 300px at 50% 0%, rgba(255,230,0,0.08), transparent 70%), rgba(10,10,15,0.6)",
                    borderColor: "rgba(255,184,0,0.25)"
                  }}
                >
                  <div className="absolute top-4 right-4 bg-gradient-hero text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full">
                    Recommended
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-white">Elite Tier</h3>
                    <p className="mt-2 text-sm text-white/50">Ideal for active collectors and traders.</p>
                    <div className="mt-6">
                      <span className="text-4xl font-black text-white">$6</span>
                      <span className="text-sm text-white/50"> / month</span>
                    </div>
                    <ul className="mt-8 space-y-4">
                      {["⏱️ 30-minute drop cooldown", "⚡ 1.5x Coins & Cosmic Dust from /daily", "📈 +30% XP Boost from all activities", "🎫 1 daily Battle Credit to reset ranked PVP limits", "🖼️ 2 extra Showcase Slots & Premium Profile Themes", "🪙 Marketplace transaction tax reduced to 5%", "🔥 Exclusive Elite Profile Badge"].map((p, idx) => (
                        <li key={idx} className="flex items-start text-sm text-white/80">
                          <span className="mr-2.5">{p.slice(0, 2)}</span>
                          <span>{p.slice(3)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button className="mt-8 w-full py-3 px-4 rounded-xl bg-gradient-hero text-white font-semibold hover:opacity-90 transition-opacity">
                    Subscribe
                  </button>
                </div>

                {/* Cosmic Champion Tier */}
                <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-8 transition-transform duration-300 hover:scale-[1.02] flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-2xl font-bold text-white">Cosmic Champion</h3>
                    <p className="mt-2 text-sm text-white/50">For the hardcore competitive players & sponsors.</p>
                    <div className="mt-6">
                      <span className="text-4xl font-black text-white">$12</span>
                      <span className="text-sm text-white/50"> / month</span>
                    </div>
                    <ul className="mt-8 space-y-4">
                      {["⏱️ 20-minute drop cooldown", "⚡ 2.0x Coins & Cosmic Dust from /daily", "📈 +50% XP Boost from all activities", "✨ 500 Cosmic Dust & 2 Battle Credits monthly", "🌐 1 Server Boost Slot to sponsor a premium server", "🪙 0% Marketplace Transaction Tax", "🌌 Cosmic Profile Badge & card border glow"].map((p, idx) => (
                        <li key={idx} className="flex items-start text-sm text-white/80">
                          <span className="mr-2.5">{p.slice(0, 2)}</span>
                          <span>{p.slice(3)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button className="mt-8 w-full py-3 px-4 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/15 transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>

              {/* Yearly Plan Featured Section */}
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8"
                style={{
                  background: "radial-gradient(800px 300px at 0% 100%, rgba(59,164,255,0.12), transparent 70%), rgba(10,10,15,0.6)"
                }}
              >
                <div className="max-w-2xl">
                  <span className="inline-flex items-center rounded-full bg-blue-500/10 text-blue-400 text-xs px-3 py-1 font-semibold uppercase tracking-wider">
                    Best Value Option
                  </span>
                  <h3 className="mt-4 font-display text-3xl font-bold text-white">Yearly Basic Membership</h3>
                  <p className="mt-3 text-sm text-white/60 leading-relaxed">
                    Commit to the journey and get massive bonuses! Get the full Basic Tier premium privileges for an entire year at a heavily discounted rate.
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="flex items-center text-sm text-white/80">
                      <span className="mr-2">🎁</span>
                      <span>Instant 250 Cosmic Dust reward</span>
                    </div>
                    <div className="flex items-center text-sm text-white/80">
                      <span className="mr-2">🎫</span>
                      <span>Instant 3 Battle Credits bonus</span>
                    </div>
                    <div className="flex items-center text-sm text-white/80">
                      <span className="mr-2">✨</span>
                      <span>10% Cosmic Dust Level-up Cost discount</span>
                    </div>
                    <div className="flex items-center text-sm text-white/80">
                      <span className="mr-2">🛡️</span>
                      <span>Founding Supporter Profile Badge</span>
                    </div>
                  </div>
                </div>
                <div className="text-center md:text-right min-w-[200px]">
                  <div className="text-4xl font-black text-white">$25</div>
                  <div className="text-sm text-white/50 mt-1">/ year (Save over 30%)</div>
                  <button className="mt-6 w-full md:w-auto py-3 px-8 rounded-xl bg-white text-black font-bold hover:bg-white/95 transition-colors shadow-lg">
                    Claim Yearly
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Server Premium Tab */}
          {activeTab === "server" && (
            <div className="mt-16 grid gap-8 md:grid-cols-3 animate-fade-in">
              {/* Guild Tier 1 */}
              <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-8 transition-transform duration-300 hover:scale-[1.02] flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-2xl font-bold text-white">Guild Tier 1</h3>
                  <p className="mt-2 text-sm text-white/50">Perfect for small Discord servers seeking more engagement.</p>
                  <div className="mt-6">
                    <span className="text-4xl font-black text-white">$8</span>
                    <span className="text-sm text-white/50"> / month</span>
                  </div>
                  <ul className="mt-8 space-y-4">
                    {["⏱️ Auto spawns cards every 45 minutes", "📦 Spawns 4 cards per event (instead of 3)", "🍀 Passive +3% lucky bonus on drop rarities", "📢 Spawner activity threshold requirement reduced by 30%"].map((p, idx) => (
                      <li key={idx} className="flex items-start text-sm text-white/80">
                        <span className="mr-2.5">{p.slice(0, 2)}</span>
                        <span>{p.slice(3)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button className="mt-8 w-full py-3 px-4 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/15 transition-colors">
                  Upgrade Guild
                </button>
              </div>

              {/* Guild Tier 2 */}
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl transition-transform duration-300 hover:scale-[1.02] flex flex-col justify-between"
                style={{
                  background: "radial-gradient(400px 300px at 50% 0%, rgba(255,0,85,0.06), transparent 70%), rgba(10,10,15,0.6)",
                  borderColor: "rgba(255,61,110,0.25)"
                }}
              >
                <div className="absolute top-4 right-4 bg-gradient-hero text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full">
                  Recommended
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold text-white">Guild Tier 2</h3>
                  <p className="mt-2 text-sm text-white/50">Ideal for highly active Discord communities.</p>
                  <div className="mt-6">
                    <span className="text-4xl font-black text-white">$15</span>
                    <span className="text-sm text-white/50"> / month</span>
                  </div>
                  <ul className="mt-8 space-y-4">
                    {["⏱️ Auto spawns cards every 30 minutes", "📦 Spawns 5 cards per event for the server", "🍀 Passive +5% lucky bonus on drop rarities", "⏰ Weekly 2-hour server happy hour (+50% XP & +20% Coins)", "🖼️ Unlocks custom backgrounds/logo templates for spawners"].map((p, idx) => (
                      <li key={idx} className="flex items-start text-sm text-white/80">
                        <span className="mr-2.5">{p.slice(0, 2)}</span>
                        <span>{p.slice(3)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button className="mt-8 w-full py-3 px-4 rounded-xl bg-gradient-hero text-white font-semibold hover:opacity-90 transition-opacity">
                  Upgrade Guild
                </button>
              </div>

              {/* Guild Tier 3 */}
              <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-8 transition-transform duration-300 hover:scale-[1.02] flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-2xl font-bold text-white">Guild Tier 3</h3>
                  <p className="mt-2 text-sm text-white/50">Best for massive servers and gaming networks.</p>
                  <div className="mt-6">
                    <span className="text-4xl font-black text-white">$25</span>
                    <span className="text-sm text-white/50"> / month</span>
                  </div>
                  <ul className="mt-8 space-y-4">
                    {["⏱️ Auto spawns cards every 20 minutes", "📦 Spawns 6 cards per event for the server", "🍀 Passive +8% lucky bonus on drop rarities", "⏰ 2 Server-Wide Happy Hours weekly", "🖼️ Fully custom spawner branding and logo configs", "🔒 Role locks for high-rarity spawns (e.g. VIP/Booster locks)"].map((p, idx) => (
                      <li key={idx} className="flex items-start text-sm text-white/80">
                        <span className="mr-2.5">{p.slice(0, 2)}</span>
                        <span>{p.slice(3)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button className="mt-8 w-full py-3 px-4 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/15 transition-colors">
                  Upgrade Guild
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
