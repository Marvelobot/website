import { useState } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Shield,
  Database,
  Table2,
  ChevronRight,
  ChevronDown,
  Settings,
  LogOut,
  RefreshCw,
  LayoutDashboard,
  ScrollText,
  PanelLeftClose,
  PanelLeft,
  Terminal,
} from "lucide-react";
import type { TableInfo } from "@/lib/api/admin.functions";

// ── Types ──────────────────────────────────────────────────────────────────────

interface SidebarProps {
  tables: TableInfo[];
  activeTable: string | null;
  onSelectTable: (name: string) => void;
  onSync: () => void;
  onLogout: () => void;
  syncing?: boolean;
  activeView?: "tables" | "access-log" | "analytics";
  onViewChange?: (view: "tables" | "access-log" | "analytics") => void;
}

// ── Component ──────────────────────────────────────────────────────────────────

export function AdminSidebar({
  tables,
  activeTable,
  onSelectTable,
  onSync,
  onLogout,
  syncing = false,
  activeView = "tables",
  onViewChange,
}: SidebarProps) {
  const [pgExpanded, setPgExpanded] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  // Collapsed mini-sidebar
  if (collapsed) {
    return (
      <TooltipProvider delayDuration={100}>
        <aside className="flex h-full w-14 flex-col border-r border-white/[0.06] bg-[#060609]">
          {/* Toggle */}
          <div className="flex h-14 items-center justify-center">
            <button
              onClick={() => setCollapsed(false)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-white/[0.04]"
            >
              <PanelLeft className="h-4 w-4" />
            </button>
          </div>

          <Separator className="bg-white/[0.06]" />

          {/* Icons */}
          <div className="flex flex-1 flex-col items-center gap-1 pt-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onViewChange?.("analytics")}
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    activeView === "analytics"
                      ? "text-[#e8866b] bg-[#e8866b]/[0.12]"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]",
                  )}
                >
                  <LayoutDashboard className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Dashboard</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setPgExpanded(!pgExpanded)}
                  className="p-2 rounded-md text-[#56d4dd] hover:bg-white/[0.04] transition-colors"
                >
                  <Database className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">PostgreSQL</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-colors">
                  <ScrollText className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">System Logs</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onViewChange?.("access-log")}
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    activeView === "access-log"
                      ? "text-[#e8866b] bg-[#e8866b]/[0.12]"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]",
                  )}
                >
                  <Terminal className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Terminal Access Log</TooltipContent>
            </Tooltip>
          </div>

          <div className="flex flex-col items-center gap-1 pb-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-colors">
                  <Settings className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onLogout}
                  className="p-2 rounded-md text-muted-foreground hover:text-red-400 hover:bg-white/[0.04] transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Logout</TooltipContent>
            </Tooltip>
          </div>
        </aside>
      </TooltipProvider>
    );
  }

  // Full sidebar
  return (
    <aside className="flex h-full w-60 flex-col border-r border-white/[0.06] bg-[#060609]">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#dc2626] to-[#f59e0b] shadow-lg shadow-red-900/30">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="font-display text-sm font-bold tracking-wider text-foreground">
              MARVELO
            </h1>
            <p className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
              Nexus Terminal
            </p>
          </div>
        </div>
        <button
          onClick={() => setCollapsed(true)}
          className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-white/[0.04]"
        >
          <PanelLeftClose className="h-3.5 w-3.5" />
        </button>
      </div>

      <Separator className="bg-white/[0.06]" />

      {/* Sync Button */}
      <div className="px-3 py-3">
        <button
          onClick={onSync}
          disabled={syncing}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all",
            "bg-gradient-to-r from-[#dc2626] to-[#e8866b] text-white",
            "hover:shadow-lg hover:shadow-red-900/30 hover:brightness-110",
            "disabled:opacity-60 disabled:cursor-not-allowed",
          )}
        >
          <RefreshCw className={cn("h-3.5 w-3.5", syncing && "animate-spin")} />
          {syncing ? "Syncing…" : "Initialize Sync"}
        </button>
      </div>

      <Separator className="bg-white/[0.06]" />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2 py-2">
        {/* Dashboard */}
        <div className="mb-1">
          <button
            onClick={() => onViewChange?.("analytics")}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-xs transition-colors",
              activeView === "analytics"
                ? "bg-[#e8866b]/[0.12] text-[#e8866b] font-medium border border-[#e8866b]/20"
                : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]",
            )}
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span className="font-medium">Dashboard</span>
          </button>
        </div>

        {/* PostgreSQL Section */}
        <div className="mb-1">
          <button
            onClick={() => setPgExpanded(!pgExpanded)}
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium text-[#56d4dd] hover:bg-white/[0.04] transition-colors"
          >
            {pgExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
            <Database className="h-3.5 w-3.5" />
            <span>PostgreSQL</span>
          </button>

          {/* Table list */}
          {pgExpanded && (
            <div className="ml-3 mt-0.5 space-y-0.5 border-l border-white/[0.06] pl-2">
              {tables.map((t) => (
                <button
                  key={t.name}
                  onClick={() => {
                    onSelectTable(t.name);
                    onViewChange?.("tables");
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs transition-all duration-150",
                    activeView === "tables" && activeTable === t.name
                      ? "bg-[#e8866b]/[0.12] text-[#e8866b] font-medium border border-[#e8866b]/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <Table2 className="h-3 w-3" />
                    {t.name}
                  </span>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "h-5 min-w-[28px] justify-center px-1.5 text-[10px] font-mono",
                      activeView === "tables" && activeTable === t.name
                        ? "bg-[#e8866b]/20 text-[#e8866b] border-[#e8866b]/30"
                        : "bg-white/[0.06] text-muted-foreground",
                    )}
                  >
                    {t.count.toLocaleString()}
                  </Badge>
                </button>
              ))}
              {tables.length === 0 && (
                <p className="px-2.5 py-2 text-[10px] text-muted-foreground italic">
                  No tables found
                </p>
              )}
            </div>
          )}
        </div>

        {/* System Logs */}
        <div className="mb-1">
          <button className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-colors">
            <ScrollText className="h-3.5 w-3.5" />
            <span className="font-medium">System Logs</span>
          </button>
        </div>

        {/* Terminal Access Log */}
        <div className="mb-1">
          <button
            onClick={() => onViewChange?.("access-log")}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-xs transition-colors",
              activeView === "access-log"
                ? "bg-[#e8866b]/[0.12] text-[#e8866b] font-medium border border-[#e8866b]/20"
                : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]",
            )}
          >
            <Terminal className="h-3.5 w-3.5" />
            <span className="font-medium">Terminal Access Log</span>
          </button>
        </div>
      </ScrollArea>

      <Separator className="bg-white/[0.06]" />

      {/* Bottom */}
      <div className="px-2 py-2 space-y-0.5">
        <button className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-colors">
          <Settings className="h-3.5 w-3.5" />
          <span className="font-medium">Settings</span>
        </button>
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-xs text-muted-foreground hover:text-red-400 hover:bg-white/[0.04] transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
