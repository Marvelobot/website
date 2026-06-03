import { useState, useEffect } from "react";
import { DiscordIcon, GithubIcon } from "./icons";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  discordId: string;
  githubUrl?: string;
  discordTag?: string;
}

const initialTeam: TeamMember[] = [
  {
    id: "1203044941669081149",
    name: "Yogeswar",
    role: "Lead Developer & Creator",
    bio: "Core architect behind MARVELO, crafting the ultimate Discord card collection and clash experience. Passionate about card battle systems, scalable architectures, and gaming communities.",
    discordId: "1203044941669081149",
    discordTag: "yogeswar",
    githubUrl: "https://github.com/yogeswar142",
  }
];

export function Team() {
  return (
    <section id="team" className="relative py-24 border-t border-white/[0.04]">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-marvel-red/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-cosmic-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 relative">
        <div className="text-center mb-16">
          <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
            THE CREATORS
          </span>
          <h2 className="mt-4 font-display text-4xl font-black tracking-tight text-white sm:text-5xl">
            Meet the <span className="text-gradient-hero">Team</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-white/60">
            The builders, designers, and thinkers behind the premier Marvel card bot on Discord.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {initialTeam.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MemberCard({ member }: { member: TeamMember }) {
  // Safe default Discord avatar calculation
  const defaultIndex = Number((BigInt(member.discordId) >> 22n) % 6n);
  const [avatarUrl, setAvatarUrl] = useState<string>(
    `https://cdn.discordapp.com/embed/avatars/${defaultIndex}.png`
  );
  const [presenceStatus, setPresenceStatus] = useState<"online" | "idle" | "dnd" | "offline" | null>(null);

  useEffect(() => {
    fetch(`https://api.lanyard.rest/v1/users/${member.discordId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          const { discord_user, discord_status } = json.data;
          if (discord_user?.avatar) {
            const isAnimated = discord_user.avatar.startsWith("a_");
            setAvatarUrl(
              `https://cdn.discordapp.com/avatars/${member.discordId}/${discord_user.avatar}.${isAnimated ? "gif" : "png"}?size=256`
            );
          }
          if (discord_status) {
            setPresenceStatus(discord_status);
          }
        }
      })
      .catch(() => {});
  }, [member.discordId]);

  const getStatusColor = () => {
    switch (presenceStatus) {
      case "online":
        return "bg-emerald-500 ring-emerald-500/20";
      case "idle":
        return "bg-amber-500 ring-amber-500/20";
      case "dnd":
        return "bg-rose-500 ring-rose-500/20";
      default:
        return "bg-zinc-500 ring-zinc-500/20";
    }
  };

  return (
    <div className="group glass-panel hairline-ring relative overflow-hidden rounded-3xl p-8 w-full max-w-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-white/15 hover:shadow-marvel-red/5">
      {/* Decorative Card Header */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-hero opacity-80 group-hover:opacity-100 transition-opacity" />

      <div className="flex flex-col items-center text-center">
        {/* Avatar Circle Container */}
        <div className="relative mb-6">
          <div className="absolute -inset-1 rounded-full bg-gradient-hero blur opacity-40 group-hover:opacity-75 transition duration-500" />
          <div className="relative h-28 w-28 rounded-full border-2 border-white/10 bg-surface p-1">
            <img
              src={avatarUrl}
              alt={member.name}
              className="h-full w-full rounded-full object-cover"
            />
          </div>

          {/* Discord Presence Indicator */}
          {presenceStatus && (
            <span className={`absolute bottom-1 right-1 flex h-4 w-4 rounded-full ring-4 ring-surface ${getStatusColor()}`} />
          )}
        </div>

        {/* Identity */}
        <h3 className="font-display text-xl font-bold text-white group-hover:text-gradient-hero transition-colors duration-300">
          {member.name}
        </h3>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-accent">
          {member.role}
        </p>

        {/* Bio */}
        <p className="mt-4 text-sm leading-relaxed text-white/70">
          {member.bio}
        </p>

        {/* Action Links */}
        <div className="mt-6 flex items-center gap-4">
          {member.githubUrl && (
            <a
              href={member.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-white/60 hover:text-white hover:border-white/20 transition-all hover:bg-white/[0.06]"
              aria-label="GitHub"
            >
              <GithubIcon className="h-5 w-5" />
            </a>
          )}
          <a
            href={`https://discord.com/users/${member.discordId}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.02] text-white/60 hover:text-white hover:border-white/20 transition-all hover:bg-white/[0.06] text-xs font-medium"
          >
            <DiscordIcon className="h-4 w-4" />
            <span>@{member.discordTag || member.name.toLowerCase()}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
