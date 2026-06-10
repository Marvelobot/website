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
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowLeft,
  Calendar,
  Clock,
  Globe,
  Monitor,
  Activity,
  History,
} from "lucide-react";
import {
  fetchAccessLogs,
  fetchSessionDetails,
  type AccessLogSession,
  type SessionDetails,
  type AuditChange,
} from "@/lib/api/admin.functions";
import { toast } from "sonner";

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatDuration(start: string, end: string | null, lastActive: string): string {
  const startTime = new Date(start).getTime();
  const endTime = end ? new Date(end).getTime() : new Date(lastActive).getTime();
  const diffMs = endTime - startTime;
  if (diffMs <= 0) return "0s";

  const secs = Math.floor(diffMs / 1000);
  const mins = Math.floor(secs / 60);
  const hrs = Math.floor(mins / 60);

  if (hrs > 0) {
    return `${hrs}h ${mins % 60}m`;
  }
  if (mins > 0) {
    return `${mins}m ${secs % 60}s`;
  }
  return `${secs}s`;
}

function formatTimestamp(ts: string): string {
  return new Date(ts).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

// ── Diff Viewer Component ──────────────────────────────────────────────────────

function DiffViewer({
  action,
  oldData,
  newData,
}: {
  action: string;
  oldData: Record<string, unknown> | null;
  newData: Record<string, unknown> | null;
}) {
  if (action === "DELETE") {
    return (
      <div className="rounded border border-red-500/15 bg-red-950/10 p-3 font-mono text-xs text-red-300">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-red-400 mb-1 border-b border-red-500/10 pb-1">
          Deleted Data Records
        </div>
        <pre className="overflow-x-auto whitespace-pre-wrap">
          {JSON.stringify(oldData, null, 2)}
        </pre>
      </div>
    );
  }

  const oldObj = oldData || {};
  const newObj = newData || {};

  const allKeys = Array.from(new Set([...Object.keys(oldObj), ...Object.keys(newObj)]));

  const diffs = allKeys
    .map((key) => {
      const oldVal = oldObj[key];
      const newVal = newObj[key];
      const oldStr = typeof oldVal === "object" ? JSON.stringify(oldVal) : String(oldVal ?? "");
      const newStr = typeof newVal === "object" ? JSON.stringify(newVal) : String(newVal ?? "");

      const isDifferent = JSON.stringify(oldVal) !== JSON.stringify(newVal);
      const existsInOld = key in oldObj;
      const existsInNew = key in newObj;

      return {
        key,
        oldVal,
        newVal,
        oldStr,
        newStr,
        isDifferent,
        existsInOld,
        existsInNew,
      };
    })
    .filter((d) => d.isDifferent);

  if (diffs.length === 0) {
    return (
      <div className="rounded border border-white/[0.04] bg-white/[0.01] p-3 text-xs text-muted-foreground italic">
        No fields modified (empty or identical payload).
      </div>
    );
  }

  return (
    <div className="rounded border border-white/[0.06] bg-black/40 overflow-hidden font-mono text-xs">
      <div className="grid grid-cols-12 bg-white/[0.02] border-b border-white/[0.06] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        <div className="col-span-3">Field</div>
        <div className="col-span-4 pl-2">Before</div>
        <div className="col-span-5 pl-4 border-l border-white/[0.06]">After</div>
      </div>

      <div className="divide-y divide-white/[0.04]">
        {diffs.map((d) => (
          <div
            key={d.key}
            className="grid grid-cols-12 px-3 py-2 items-start hover:bg-white/[0.01] transition-colors"
          >
            <div className="col-span-3 text-[#56d4dd] font-semibold break-all pr-2">{d.key}</div>

            {/* Old value (Before) */}
            <div className="col-span-4 pr-2 break-all font-mono text-red-400 bg-red-950/10 rounded px-1.5 py-0.5 line-through decoration-red-500/50">
              {!d.existsInOld ? (
                <span className="text-muted-foreground/30 italic">[none]</span>
              ) : d.oldVal === null ? (
                "null"
              ) : (
                d.oldStr
              )}
            </div>

            {/* New value (After) */}
            <div className="col-span-5 pl-4 border-l border-white/[0.06] break-all font-mono text-green-400 bg-green-950/10 rounded px-1.5 py-0.5">
              {!d.existsInNew ? (
                <span className="text-muted-foreground/30 italic">[deleted]</span>
              ) : d.newVal === null ? (
                "null"
              ) : (
                d.newStr
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Access Log Component ──────────────────────────────────────────────────

export function AccessLogView() {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  // List State
  const [sessions, setSessions] = useState<AccessLogSession[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Detail State
  const [sessionDetails, setSessionDetails] = useState<SessionDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Load Sessions List
  const loadSessions = async (pageNum: number) => {
    try {
      setLoading(true);
      const res = await fetchAccessLogs(pageNum, 25);
      setSessions(res.sessions);
      setTotal(res.total);
      setPage(res.page);
      setTotalPages(res.totalPages);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load access logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedSessionId) {
      loadSessions(page);
    }
  }, [page, selectedSessionId]);

  // Load Session Details
  useEffect(() => {
    if (!selectedSessionId) {
      setSessionDetails(null);
      return;
    }

    const loadDetails = async () => {
      try {
        setDetailsLoading(true);
        const res = await fetchSessionDetails(selectedSessionId);
        setSessionDetails(res);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load session details");
        setSelectedSessionId(null);
      } finally {
        setDetailsLoading(false);
      }
    };

    loadDetails();
  }, [selectedSessionId]);

  // Render Session Detail view
  if (selectedSessionId) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
        {/* Detail Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-white/[0.06] px-4 py-2.5 bg-[#060609]">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedSessionId(null)}
              className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground border border-white/[0.06]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </Button>
            <Separator orientation="vertical" className="h-4 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-[#e8866b]" />
              <h3 className="font-display text-sm font-bold tracking-wide text-foreground">
                Session Audit Trail
              </h3>
            </div>
            {sessionDetails && (
              <Badge
                variant="secondary"
                className="bg-[#e8866b]/10 text-[#e8866b] border border-[#e8866b]/20 text-[10px] font-mono"
              >
                {sessionDetails.session.username}
              </Badge>
            )}
          </div>
        </div>

        {/* Detail Body */}
        {detailsLoading || !sessionDetails ? (
          <div className="flex-1 p-4 space-y-4 overflow-auto">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-1/4" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <div className="flex-1 overflow-hidden flex flex-col">
            <ScrollArea className="flex-1">
              <div className="p-4 max-w-5xl mx-auto space-y-6">
                {/* Meta details card */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#060609] border border-white/[0.06] rounded-xl p-4 shadow-lg shadow-black/40">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground/60 flex items-center gap-1.5">
                      <Monitor className="h-3 w-3" /> User Agent
                    </span>
                    <p
                      className="text-xs font-medium text-foreground/90 truncate"
                      title={sessionDetails.session.user_agent}
                    >
                      {sessionDetails.session.user_agent}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground/60 flex items-center gap-1.5">
                      <Globe className="h-3 w-3" /> Network IP
                    </span>
                    <p className="text-xs font-mono font-medium text-foreground/90">
                      {sessionDetails.session.ip_address}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground/60 flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" /> Login Time
                    </span>
                    <p className="text-xs font-medium text-foreground/90">
                      {formatTimestamp(sessionDetails.session.login_time)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground/60 flex items-center gap-1.5">
                      <Clock className="h-3 w-3" /> Staying Duration
                    </span>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-medium text-foreground/90">
                        {formatDuration(
                          sessionDetails.session.login_time,
                          sessionDetails.session.logout_time,
                          sessionDetails.session.last_active,
                        )}
                      </p>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "h-5 text-[9px] font-semibold tracking-wide border px-1.5",
                          !sessionDetails.session.logout_time
                            ? "bg-emerald-950/25 text-emerald-400 border-emerald-500/20"
                            : "bg-white/[0.04] text-muted-foreground border-white/[0.08]",
                        )}
                      >
                        {!sessionDetails.session.logout_time ? "ACTIVE" : "ENDED"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Activity className="h-3.5 w-3.5 text-[#56d4dd]" />
                    <span>Database Mutation History</span>
                  </div>

                  {sessionDetails.changes.length === 0 ? (
                    <div className="text-center py-12 border border-white/[0.06] border-dashed rounded-xl bg-white/[0.01]">
                      <History className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">
                        No database records were created, updated, or deleted during this session.
                      </p>
                    </div>
                  ) : (
                    <div className="relative border-l-2 border-white/[0.06] ml-3 pl-6 space-y-8 py-2">
                      {sessionDetails.changes.map((change) => {
                        const isUpdate = change.action === "UPDATE";
                        return (
                          <div key={change.log_id} className="relative group">
                            {/* Timeline dot */}
                            <div
                              className={cn(
                                "absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full border-2 bg-[#050508] transition-colors duration-150 group-hover:scale-110",
                                isUpdate ? "border-amber-500" : "border-red-500",
                              )}
                            />

                            {/* Timeline Content */}
                            <div className="space-y-2.5">
                              {/* Metadata header */}
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge
                                  className={cn(
                                    "text-[9px] font-semibold px-2 py-0.5 border",
                                    isUpdate
                                      ? "bg-amber-950/20 text-amber-400 border-amber-500/20"
                                      : "bg-red-950/20 text-red-400 border-red-500/20",
                                  )}
                                >
                                  {change.action}
                                </Badge>
                                <span className="text-xs font-semibold text-foreground/90">
                                  {change.table_name}
                                </span>
                                <Separator orientation="vertical" className="h-3 bg-white/[0.08]" />
                                <span className="text-[10px] font-mono text-muted-foreground">
                                  ID: {change.row_id}
                                </span>
                                <Separator orientation="vertical" className="h-3 bg-white/[0.08]" />
                                <span className="text-[10px] text-muted-foreground/60">
                                  {formatTimestamp(change.timestamp)}
                                </span>
                              </div>

                              {/* Interactive Diff */}
                              <div className="pl-1 max-w-4xl">
                                <DiffViewer
                                  action={change.action}
                                  oldData={change.old_data}
                                  newData={change.new_data}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    );
  }

  // Render Session List View
  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-in fade-in duration-200">
      {/* List Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-white/[0.06] px-4 py-3 bg-[#060609]">
        <div>
          <h3 className="font-display text-sm font-bold tracking-wide text-foreground">
            Terminal Access Log
          </h3>
          <p className="text-[10px] text-muted-foreground/80 mt-0.5">
            Realtime security audit trail of administrator Nexus operations.
          </p>
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-auto">
        {loading ? (
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
              {Array.from({ length: 8 }).map((_, i) => (
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
                  Operator
                </TableHead>
                <TableHead className="h-10 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Session Status
                </TableHead>
                <TableHead className="h-10 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Login Time
                </TableHead>
                <TableHead className="h-10 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Stay Duration
                </TableHead>
                <TableHead className="h-10 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Mutations
                </TableHead>
                <TableHead className="h-10 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Network IP
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    No session logs found.
                  </TableCell>
                </TableRow>
              ) : (
                sessions.map((session) => {
                  const isActive = !session.logout_time;
                  return (
                    <TableRow
                      key={session.session_id}
                      onClick={() => setSelectedSessionId(session.session_id)}
                      className="cursor-pointer border-white/[0.04] hover:bg-white/[0.03] transition-colors"
                    >
                      {/* Operator Username */}
                      <TableCell className="text-xs font-semibold text-[#e8866b]">
                        {session.username}
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "h-5 text-[9px] font-semibold tracking-wide border px-1.5",
                            isActive
                              ? "bg-emerald-950/20 text-emerald-400 border-emerald-500/20"
                              : "bg-white/[0.04] text-muted-foreground/60 border-white/[0.08]",
                          )}
                        >
                          {isActive ? "ACTIVE" : "ENDED"}
                        </Badge>
                      </TableCell>

                      {/* Login Time */}
                      <TableCell className="text-xs text-foreground/80">
                        {formatTimestamp(session.login_time)}
                      </TableCell>

                      {/* Duration */}
                      <TableCell className="text-xs text-foreground/80">
                        {formatDuration(
                          session.login_time,
                          session.logout_time,
                          session.last_active,
                        )}
                      </TableCell>

                      {/* Changes Badge */}
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "h-5 min-w-[24px] justify-center text-[10px] font-mono border",
                            session.changes_count > 0
                              ? "bg-[#56d4dd]/10 text-[#56d4dd] border-[#56d4dd]/20 font-bold"
                              : "bg-white/[0.04] text-muted-foreground border-white/[0.08]",
                          )}
                        >
                          {session.changes_count}
                        </Badge>
                      </TableCell>

                      {/* IP Address */}
                      <TableCell className="text-xs font-mono text-muted-foreground/75">
                        {session.ip_address}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-2.5 text-xs text-muted-foreground bg-[#060609]">
        <span>
          {total.toLocaleString()} session log{total !== 1 ? "s" : ""}
        </span>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            disabled={page <= 1}
            onClick={() => setPage(1)}
          >
            <ChevronsLeft className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>

          <span className="px-2 text-foreground">
            Page {page} of {totalPages || 1}
          </span>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            disabled={page >= totalPages}
            onClick={() => setPage(totalPages)}
          >
            <ChevronsRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
