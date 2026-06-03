import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/marvelo/Navbar";
import { Hero } from "@/components/marvelo/Hero";
import { FeaturesBento } from "@/components/marvelo/FeaturesBento";
import { CardShowcase } from "@/components/marvelo/CardShowcase";
import { PvPArena } from "@/components/marvelo/PvPArena";
import { HowItWorks } from "@/components/marvelo/HowItWorks";
import { Progression } from "@/components/marvelo/Progression";
import { StatsCounter } from "@/components/marvelo/StatsCounter";
import { Team } from "@/components/marvelo/Team";
import { FinalCTA } from "@/components/marvelo/FinalCTA";
import { Footer } from "@/components/marvelo/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MARVELO — The Premier Marvel Card Bot on Discord" },
      {
        name: "description",
        content:
          "Collect, fuse, and battle Marvel-themed cards on Discord. Build your ultimate squad and clash in 3v3 PvP arenas.",
      },
      { property: "og:title", content: "MARVELO — Marvel Card Bot on Discord" },
      {
        property: "og:description",
        content:
          "Collect, fuse, and battle Marvel-themed cards on Discord. Build your ultimate squad and clash in 3v3 PvP arenas.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <FeaturesBento />
        <CardShowcase />
        <PvPArena />
        <HowItWorks />
        <Progression />
        <StatsCounter />
        <Team />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
