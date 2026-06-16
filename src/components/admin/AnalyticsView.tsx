import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  Layers,
  Repeat,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Activity,
  UserPlus,
  Terminal,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Zap,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  CartesianGrid,
} from "recharts";
import {
  fetchAnalyticsOverview,
  fetchHighRarityDrops,
  fetchBotLogs,
  type AnalyticsOverview,
  type HighRarityDrop,
  type BotUserAction,
} from "@/lib/api/admin.functions";
import { toast } from "sonner";

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatTimestamp(ts: string): string {
  return new Date(ts).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

// ── Component ──────────────────────────────────────────────────────────────────

export function AnalyticsView() {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [drops, setDrops] = useState<HighRarityDrop[]>([]);
  const [logs, setLogs] = useState<BotUserAction[]>([]);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [dropsLoading, setDropsLoading] = useState(true);
  
  // Logs Pagination & Search
  const [logsLoading, setLogsLoading] = useState(true);
  const [logsPage, setLogsPage] = useState(1);
  const [logsTotalPages, setLogsTotalPages] = useState(1);
  const [logsTotal, setLogsTotal] = useState(0);
  const [search, setSearch] = useState("");

  const loadOverview = async () => {
    try {
      setOverviewLoading(true);
      const data = await fetchAnalyticsOverview();
      setOverview(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load overview analytics");
    } finally {
      setOverviewLoading(false);
    }
  };

  const loadDrops = async () => {
    try {
      setDropsLoading(true);
      const data = await fetchHighRarityDrops(12);
      setDrops(data);
    } catch (err) {
      console.error(err);
    } finally {
      setDropsLoading(false);
    }
  };

  const loadLogs = async (pageVal: number, searchVal: string) => {
    try {
      setLogsLoading(true);
      const res = await fetchBotLogs(pageVal, 15, searchVal);
      setLogs(res.data);
      setLogsTotal(res.meta.total);
      setLogsTotalPages(res.meta.totalPages);
      setLogsPage(res.meta.page);
    } catch (err) {
      console.error(err);
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
    loadDrops();
    loadLogs(1, "");
  }, []);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    loadLogs(1, val);
  };

  // Process data for charts
  const dauChartData = overview?.dau.map((d) => ({
    date: formatDateLabel(d.date),
    ActiveUsers: d.count,
  })) || [];

  const commandsChartData = overview?.dailyCommands.map((d) => ({
    date: formatDateLabel(d.date),
    Executions: d.count,
  })) || [];

  const growthChartData = overview?.dailyRegistrations.map((d) => ({
    date: formatDateLabel(d.date),
    NewRegistrations: d.count,
  })) || [];

  const popularChartData = overview?.popularCommands.map((c) => ({
    command: `/${c.command_name}`,
    Uses: c.count,
  })) || [];

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-white/[0.06] px-4 py-3 bg-[#060609]">
        <div>
          <h3 className="font-display text-sm font-bold tracking-wide text-foreground">
            Bot Performance & Analytics
          </h3>
          <p className="text-[10px] text-muted-foreground/80 mt-0.5">
            Overview of bot growth, command traffic, high rarity card drops, and realtime audit logs.
          </p>
        </div>
        <Button
          onClick={() => {
            loadOverview();
            loadDrops();
            loadLogs(1, search);
            toast.success("Analytics refreshed");
          }}
          variant="ghost"
          size="sm"
          className="h-8 text-xs gap-1 border border-white/[0.06] text-muted-foreground hover:text-foreground"
        >
          <Activity className="h-3.5 w-3.5" />
          Refresh Stats
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6 max-w-[1600px] mx-auto pb-12">
          {/* ── KPI Grid ──────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Total Users */}
            <div className="bg-[#060609] border border-white/[0.06] rounded-xl p-4 flex items-center justify-between shadow-lg shadow-black/30">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground/60 flex items-center gap-1.5">
                  <Users className="h-3 w-3 text-sky-400" /> Total Players
                </span>
                <h4 className="text-xl font-bold font-mono tracking-tight text-foreground/90">
                  {overviewLoading ? "…" : overview?.counts.totalUsers.toLocaleString()}
                </h4>
              </div>
              <div className="h-10 w-10 rounded-lg bg-sky-500/10 flex items-center justify-center border border-sky-500/20">
                <Users className="h-5 w-5 text-sky-400" />
              </div>
            </div>

            {/* Total Cards */}
            <div className="bg-[#060609] border border-white/[0.06] rounded-xl p-4 flex items-center justify-between shadow-lg shadow-black/30">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground/60 flex items-center gap-1.5">
                  <Layers className="h-3 w-3 text-emerald-400" /> Total Cards
                </span>
                <h4 className="text-xl font-bold font-mono tracking-tight text-foreground/90">
                  {overviewLoading ? "…" : overview?.counts.totalCards.toLocaleString()}
                </h4>
              </div>
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <Layers className="h-5 w-5 text-emerald-400" />
              </div>
            </div>

            {/* Total Trades */}
            <div className="bg-[#060609] border border-white/[0.06] rounded-xl p-4 flex items-center justify-between shadow-lg shadow-black/30">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground/60 flex items-center gap-1.5">
                  <Repeat className="h-3 w-3 text-purple-400" /> Total Trades
                </span>
                <h4 className="text-xl font-bold font-mono tracking-tight text-foreground/90">
                  {overviewLoading ? "…" : overview?.counts.totalTrades.toLocaleString()}
                </h4>
              </div>
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                <Repeat className="h-5 w-5 text-purple-400" />
              </div>
            </div>

            {/* Total Listings */}
            <div className="bg-[#060609] border border-white/[0.06] rounded-xl p-4 flex items-center justify-between shadow-lg shadow-black/30">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground/60 flex items-center gap-1.5">
                  <ShoppingBag className="h-3 w-3 text-amber-400" /> Active listings
                </span>
                <h4 className="text-xl font-bold font-mono tracking-tight text-foreground/90">
                  {overviewLoading ? "…" : overview?.counts.totalMarket.toLocaleString()}
                </h4>
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                <ShoppingBag className="h-5 w-5 text-amber-400" />
              </div>
            </div>

            {/* Total High Rarity Drops */}
            <div className="bg-[#060609] border border-white/[0.06] rounded-xl p-4 flex items-center justify-between shadow-lg shadow-black/30">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground/60 flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-[#f59e0b]" /> High Rarity Drops
                </span>
                <h4 className="text-xl font-bold font-mono tracking-tight text-foreground/90">
                  {overviewLoading ? "…" : overview?.counts.totalHighRarityDrops.toLocaleString()}
                </h4>
              </div>
              <div className="h-10 w-10 rounded-lg bg-[#f59e0b]/10 flex items-center justify-center border border-[#f59e0b]/20">
                <Sparkles className="h-5 w-5 text-[#f59e0b]" />
              </div>
            </div>
          </div>

          {/* ── Vote Analytics Panel ───────────────────────────────────────── */}
          <div className="bg-[#060609] border border-white/[0.06] rounded-xl p-4 shadow-lg shadow-black/30">
            <div className="flex items-center gap-2 mb-4 border-b border-white/[0.06] pb-3">
              <Zap className="h-4 w-4 text-amber-400" />
              <h4 className="text-xs font-bold font-display uppercase tracking-wider text-foreground">
                🗳️ Vote Analytics & Top.gg / DBL Activity
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-black/30 rounded-lg p-3 border border-white/[0.04]">
                <p className="text-[10px] text-muted-foreground uppercase font-semibold">Total Unique Voters</p>
                <h5 className="text-lg font-bold font-mono text-foreground mt-1">
                  {overviewLoading ? "…" : overview?.votes?.totalVoters.toLocaleString() ?? "0"}
                </h5>
              </div>
              <div className="bg-black/30 rounded-lg p-3 border border-white/[0.04]">
                <p className="text-[10px] text-muted-foreground uppercase font-semibold">Total Votes Registered</p>
                <h5 className="text-lg font-bold font-mono text-emerald-400 mt-1">
                  {overviewLoading ? "…" : overview?.votes?.totalVotes.toLocaleString() ?? "0"}
                </h5>
              </div>
              <div className="bg-black/30 rounded-lg p-3 border border-white/[0.04]">
                <p className="text-[10px] text-muted-foreground uppercase font-semibold">DBL (Discord Bot List) Votes</p>
                <h5 className="text-lg font-bold font-mono text-sky-400 mt-1">
                  {overviewLoading ? "…" : overview?.votes?.totalDblVotes.toLocaleString() ?? "0"}
                </h5>
              </div>
              <div className="bg-black/30 rounded-lg p-3 border border-white/[0.04]">
                <p className="text-[10px] text-muted-foreground uppercase font-semibold">Top.gg Votes</p>
                <h5 className="text-lg font-bold font-mono text-pink-400 mt-1">
                  {overviewLoading ? "…" : overview?.votes?.totalTopggVotes.toLocaleString() ?? "0"}
                </h5>
              </div>
            </div>
          </div>

          {/* ── Charts Grid ───────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Daily Traffic Area Chart */}
            <div className="lg:col-span-8 bg-[#060609] border border-white/[0.06] rounded-xl p-4 shadow-lg shadow-black/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-[#e8866b]" />
                  <h4 className="text-xs font-bold font-display uppercase tracking-wider text-foreground">
                    Traffic Activity (Command Executions)
                  </h4>
                </div>
              </div>
              <div className="h-[220px]">
                {overviewLoading ? (
                  <Skeleton className="w-full h-full" />
                ) : commandsChartData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-xs italic">
                    No traffic data logged yet.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={commandsChartData}>
                      <defs>
                        <linearGradient id="colorExec" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#e8866b" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#e8866b" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                      <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" fontSize={9} tickLine={false} />
                      <YAxis stroke="rgba(255,255,255,0.4)" fontSize={9} tickLine={false} axisLine={false} />
                      <ChartTooltip
                        contentStyle={{
                          backgroundColor: "#060609",
                          borderColor: "rgba(255,255,255,0.08)",
                          borderRadius: "8px",
                          fontSize: "11px",
                          color: "#fff",
                        }}
                      />
                      <Area type="monotone" dataKey="Executions" stroke="#e8866b" strokeWidth={2} fillOpacity={1} fill="url(#colorExec)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Popular Commands Bar Chart */}
            <div className="lg:col-span-4 bg-[#060609] border border-white/[0.06] rounded-xl p-4 shadow-lg shadow-black/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-[#56d4dd]" />
                  <h4 className="text-xs font-bold font-display uppercase tracking-wider text-foreground">
                    Most Active Commands
                  </h4>
                </div>
              </div>
              <div className="h-[220px]">
                {overviewLoading ? (
                  <Skeleton className="w-full h-full" />
                ) : popularChartData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-xs italic">
                    No command execution data available.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={popularChartData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" horizontal={false} />
                      <XAxis type="number" stroke="rgba(255,255,255,0.4)" fontSize={9} tickLine={false} axisLine={false} />
                      <YAxis dataKey="command" type="category" stroke="rgba(255,255,255,0.5)" fontSize={10} tickLine={false} width={80} />
                      <ChartTooltip
                        contentStyle={{
                          backgroundColor: "#060609",
                          borderColor: "rgba(255,255,255,0.08)",
                          borderRadius: "8px",
                          fontSize: "11px",
                          color: "#fff",
                        }}
                      />
                      <Bar dataKey="Uses" fill="#56d4dd" radius={[0, 4, 4, 0]} barSize={10} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Active Users Chart */}
            <div className="bg-[#060609] border border-white/[0.06] rounded-xl p-4 shadow-lg shadow-black/30">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-4 w-4 text-emerald-400" />
                <h4 className="text-xs font-bold font-display uppercase tracking-wider text-foreground">
                  Daily Active Users (DAU)
                </h4>
              </div>
              <div className="h-[180px]">
                {overviewLoading ? (
                  <Skeleton className="w-full h-full" />
                ) : dauChartData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-xs italic">
                    No activity logs recorded.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dauChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                      <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" fontSize={9} tickLine={false} />
                      <YAxis stroke="rgba(255,255,255,0.4)" fontSize={9} tickLine={false} axisLine={false} />
                      <ChartTooltip
                        contentStyle={{
                          backgroundColor: "#060609",
                          borderColor: "rgba(255,255,255,0.08)",
                          borderRadius: "8px",
                          fontSize: "11px",
                          color: "#fff",
                        }}
                      />
                      <Bar dataKey="ActiveUsers" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Daily Growth registrations */}
            <div className="bg-[#060609] border border-white/[0.06] rounded-xl p-4 shadow-lg shadow-black/30">
              <div className="flex items-center gap-2 mb-4">
                <UserPlus className="h-4 w-4 text-sky-400" />
                <h4 className="text-xs font-bold font-display uppercase tracking-wider text-foreground">
                  Bot Player Growth (New Registrations)
                </h4>
              </div>
              <div className="h-[180px]">
                {overviewLoading ? (
                  <Skeleton className="w-full h-full" />
                ) : growthChartData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-xs italic">
                    No new registrations logged yet.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={growthChartData}>
                      <defs>
                        <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                      <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" fontSize={9} tickLine={false} />
                      <YAxis stroke="rgba(255,255,255,0.4)" fontSize={9} tickLine={false} axisLine={false} />
                      <ChartTooltip
                        contentStyle={{
                          backgroundColor: "#060609",
                          borderColor: "rgba(255,255,255,0.08)",
                          borderRadius: "8px",
                          fontSize: "11px",
                          color: "#fff",
                        }}
                      />
                      <Area type="monotone" dataKey="NewRegistrations" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#colorGrowth)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          {/* ── High Rarity Drops Feed ────────────────────────────────────── */}
          <div className="bg-[#060609] border border-white/[0.06] rounded-xl p-4 shadow-lg shadow-black/30">
            <div className="flex items-center gap-2 mb-4 border-b border-white/[0.06] pb-3">
              <Sparkles className="h-4 w-4 text-[#f59e0b]" />
              <h4 className="text-xs font-bold font-display uppercase tracking-wider text-foreground">
                Recent High Rarity Drops Showcase
              </h4>
            </div>
            {dropsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-xl" />
                ))}
              </div>
            ) : drops.length === 0 ? (
              <p className="text-xs text-muted-foreground italic text-center py-6">
                No Legendary or Mythic drops recorded in database.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {drops.map((drop) => {
                  const isMythic = drop.rarity.toLowerCase() === "mythic";
                  return (
                    <div
                      key={drop.id}
                      className={cn(
                        "relative bg-black/40 rounded-xl p-3 border hover:brightness-110 transition-all flex flex-col justify-between h-28 shadow-lg",
                        isMythic
                          ? "border-[#d946ef]/20 shadow-[#d946ef]/5 hover:shadow-[#d946ef]/15"
                          : "border-[#f59e0b]/20 shadow-[#f59e0b]/5 hover:shadow-[#f59e0b]/15",
                      )}
                    >
                      {/* Top Rarity Badge */}
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-mono text-muted-foreground/60">
                          ID: {drop.user_id}
                        </span>
                        <Badge
                          className={cn(
                            "text-[8px] font-bold px-1.5 py-0 border",
                            isMythic
                              ? "bg-fuchsia-950/20 text-fuchsia-400 border-fuchsia-500/20"
                              : "bg-amber-950/20 text-amber-400 border-amber-500/20",
                          )}
                        >
                          {drop.rarity.toUpperCase()}
                        </Badge>
                      </div>

                      {/* Username Detail */}
                      {drop.username && (
                        <div className="text-[9px] text-sky-400/95 font-semibold truncate mt-0.5 leading-none">
                          @{drop.username}
                        </div>
                      )}

                      {/* Character Details */}
                      <div className="my-1.5">
                        <p className="text-xs font-bold text-foreground/90 truncate">
                          {drop.character_name}
                        </p>
                        <p className="text-[9px] font-mono text-muted-foreground truncate">
                          Code: {drop.card_id}
                        </p>
                      </div>

                      {/* Source & Time */}
                      <div className="flex items-center justify-between text-[8px] text-muted-foreground/60 border-t border-white/[0.04] pt-1">
                        <span className="truncate max-w-[65px]">{drop.source.replace("_", " ")}</span>
                        <span>{formatTimestamp(drop.timestamp).split(",")[0]}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Searchable Bot Audit Logs ─────────────────────────────────── */}
          <div className="bg-[#060609] border border-white/[0.06] rounded-xl p-4 shadow-lg shadow-black/30 flex flex-col min-h-[450px]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/[0.06] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-sky-400" />
                <h4 className="text-xs font-bold font-display uppercase tracking-wider text-foreground">
                  Player Interaction Audit Logs
                </h4>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/50" />
                <Input
                  placeholder="Filter by command or player ID…"
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="h-8 pl-8 text-xs bg-white/[0.03] border-white/[0.08] placeholder:text-muted-foreground/30 focus-visible:ring-[#38bdf8]/30"
                />
              </div>
            </div>

            {/* Logs Table */}
            <div className="flex-1 overflow-auto">
              {logsLoading ? (
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/[0.06] hover:bg-transparent">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <TableHead key={i} className="h-10">
                          <Skeleton className="h-4 w-24" />
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i} className="border-white/[0.04]">
                        {Array.from({ length: 6 }).map((_, j) => (
                          <TableCell key={j}>
                            <Skeleton className="h-4 w-full" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/[0.06] hover:bg-transparent bg-white/[0.02]">
                      <TableHead className="h-10 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Player ID
                      </TableHead>
                      <TableHead className="h-10 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Action Command
                      </TableHead>
                      <TableHead className="h-10 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Target Table
                      </TableHead>
                      <TableHead className="h-10 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Mutation Type
                      </TableHead>
                      <TableHead className="h-10 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Payload Details
                      </TableHead>
                      <TableHead className="h-10 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Timestamp
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-32 text-center text-muted-foreground italic text-xs">
                          No interaction audit logs found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      logs.map((log) => {
                        const isDelete = log.action_type === "DELETE";
                        const isInsert = log.action_type === "INSERT";
                        return (
                          <TableRow
                            key={log.id}
                            className="border-white/[0.04] hover:bg-white/[0.01] transition-colors"
                          >
                            <TableCell className="text-xs font-mono font-medium text-foreground/80">
                              {log.user_id}
                            </TableCell>
                            <TableCell className="text-xs font-semibold text-[#e8866b]">
                              /{log.command_name}
                            </TableCell>
                            <TableCell className="text-xs font-mono text-muted-foreground">
                              {log.affected_table}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="secondary"
                                className={cn(
                                  "text-[9px] font-bold px-1.5 py-0.5 border",
                                  isDelete
                                    ? "bg-red-950/20 text-red-400 border-red-500/20"
                                    : isInsert
                                    ? "bg-emerald-950/20 text-emerald-400 border-emerald-500/20"
                                    : "bg-blue-950/20 text-blue-400 border-blue-500/20",
                                )}
                              >
                                {log.action_type}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-[10px] font-mono text-muted-foreground/90 max-w-[280px] truncate" title={JSON.stringify(log.details)}>
                              {JSON.stringify(log.details)}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground/60 font-mono">
                              {formatTimestamp(log.timestamp)}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              )}
            </div>

            {/* Pagination Controls */}
            {logsTotalPages > 1 && (
              <div className="flex items-center justify-between border-t border-white/[0.06] pt-3 mt-4 text-xs text-muted-foreground bg-[#060609]">
                <span>
                  {logsTotal.toLocaleString()} bot audit log{logsTotal !== 1 ? "s" : ""}
                </span>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    disabled={logsPage <= 1}
                    onClick={() => {
                      setLogsPage(1);
                      loadLogs(1, search);
                    }}
                  >
                    <ChevronsLeft className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    disabled={logsPage <= 1}
                    onClick={() => {
                      const prevPage = logsPage - 1;
                      setLogsPage(prevPage);
                      loadLogs(prevPage, search);
                    }}
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </Button>

                  <span className="px-2 text-foreground font-mono">
                    Page {logsPage} of {logsTotalPages || 1}
                  </span>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    disabled={logsPage >= logsTotalPages}
                    onClick={() => {
                      const nextPage = logsPage + 1;
                      setLogsPage(nextPage);
                      loadLogs(nextPage, search);
                    }}
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    disabled={logsPage >= logsTotalPages}
                    onClick={() => {
                      setLogsPage(logsTotalPages);
                      loadLogs(logsTotalPages, search);
                    }}
                  >
                    <ChevronsRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
