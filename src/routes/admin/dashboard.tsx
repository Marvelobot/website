import { useState, useEffect, useCallback } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Download,
  Save,
  Bell,
  Plus,
  Filter,
  Trash2,
  Eye,
  X,
  ChevronRight,
  Table2,
} from "lucide-react";

import { AdminSidebar } from "@/components/admin/Sidebar";
import { DataGrid } from "@/components/admin/DataGrid";
import { JsonViewer } from "@/components/admin/JsonViewer";
import { AccessLogView } from "@/components/admin/AccessLogView";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  fetchTables,
  fetchTableData,
  fetchTableSchema,
  deleteRow,
  fetchSingleRow,
  pingSession,
  logoutSession,
  updateRow,
  type TableInfo,
  type TableDataResponse,
  type TableSchema,
} from "@/lib/api/admin.functions";

// ── Route ──────────────────────────────────────────────────────────────────────

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "MARVELO — Nexus Terminal" },
      {
        name: "description",
        content: "MARVELO Nexus Terminal — admin data management dashboard.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminDashboard,
});

// ── Dashboard Component ────────────────────────────────────────────────────────

function AdminDashboard() {
  const navigate = useNavigate();

  // ── Auth guard ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      navigate({ to: "/admin/login" });
    }
  }, [navigate]);

  // ── State ──────────────────────────────────────────────────────────────────
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [tablesLoading, setTablesLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const [activeTable, setActiveTable] = useState<string | null>(null);
  const [tableSchema, setTableSchema] = useState<TableSchema | null>(null);
  const [tableData, setTableData] = useState<TableDataResponse | null>(null);
  const [dataLoading, setDataLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [selectedRow, setSelectedRow] = useState<Record<string, unknown> | null>(null);

  const [activeView, setActiveView] = useState<"tables" | "access-log">("tables");
  const [isEditing, setIsEditing] = useState(false);
  const [conflict, setConflict] = useState<{
    rowPk: string | number;
    field: string;
    yourValue: unknown;
    serverValue: unknown;
    latestRow: Record<string, unknown>;
  } | null>(null);

  // ── Load tables on mount ───────────────────────────────────────────────────
  const loadTables = useCallback(async () => {
    try {
      setTablesLoading(true);
      const data = await fetchTables();
      setTables(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load tables");
    } finally {
      setTablesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTables();
  }, [loadTables]);

  // ── Load table data when active table / page / search / sort changes ───────
  const loadTableData = useCallback(async () => {
    if (!activeTable) return;
    try {
      setDataLoading(true);
      const [schema, data] = await Promise.all([
        fetchTableSchema(activeTable),
        fetchTableData(activeTable, page, 50, search, sortField, sortDirection),
      ]);
      setTableSchema(schema);
      setTableData(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setDataLoading(false);
    }
  }, [activeTable, page, search, sortField, sortDirection]);

  useEffect(() => {
    loadTableData();
  }, [loadTableData]);

  // ── Session Keep-Alive (Ping) ──────────────────────────────────────────────
  useEffect(() => {
    pingSession().catch((err) => console.error("[dashboard] Session ping failed:", err));
    const interval = setInterval(() => {
      pingSession().catch((err) => console.error("[dashboard] Session ping failed:", err));
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  // ── Auto-Refresh Polling (Active Table Only) ────────────────────────────────
  const pollTableData = useCallback(async () => {
    if (!activeTable || isEditing || document.hidden || activeView !== "tables") return;
    try {
      const [schema, data] = await Promise.all([
        fetchTableSchema(activeTable),
        fetchTableData(activeTable, page, 50, search, sortField, sortDirection),
      ]);
      setTableSchema(schema);
      setTableData(data);
    } catch (err) {
      console.error("[dashboard] Polling data failed:", err);
    }
  }, [activeTable, page, search, sortField, sortDirection, isEditing, activeView]);

  useEffect(() => {
    if (!activeTable || activeView !== "tables" || isEditing) return;

    const interval = setInterval(() => {
      pollTableData();
    }, 5000);

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        pollTableData();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [activeTable, activeView, isEditing, pollTableData]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleSelectTable = (name: string) => {
    setActiveTable(name);
    setPage(1);
    setSearch("");
    setSortField("");
    setSortDirection("asc");
    setSelectedRow(null);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleSync = async () => {
    setSyncing(true);
    await loadTables();
    if (activeTable) await loadTableData();
    setSyncing(false);
    toast.success("Sync complete");
  };

  const handleLogout = async () => {
    try {
      await logoutSession();
    } catch (err) {
      console.error("[dashboard] Session logout error:", err);
    }
    localStorage.removeItem("admin_token");
    navigate({ to: "/admin/login" });
  };

  const handleCellEdit = async (rowPk: string | number, field: string, newValue: unknown) => {
    if (!activeTable || !tableSchema || !tableData) return;
    try {
      const currentRow = tableData.rows.find((r) => r._pk === rowPk);
      if (!currentRow) return;

      // Fetch latest row from server to check for conflict
      const latestRow = await fetchSingleRow(activeTable, rowPk);
      const currentFieldValue = currentRow[field];
      const serverFieldValue = latestRow[field];

      // Check if another client has modified this cell on the server since last read
      if (JSON.stringify(currentFieldValue) !== JSON.stringify(serverFieldValue)) {
        setConflict({
          rowPk,
          field,
          yourValue: newValue,
          serverValue: serverFieldValue,
          latestRow,
        });
        return;
      }

      // No conflict, safe to update
      const updatedData = { ...latestRow };
      delete updatedData._pk;
      updatedData[field] = newValue;

      await updateRow(activeTable, rowPk, updatedData);
      toast.success("Cell updated");
      loadTableData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update cell");
    }
  };

  const handleDeleteRow = async () => {
    if (!activeTable || !selectedRow || !tableSchema) return;
    const id = selectedRow[tableSchema.primaryKey];
    if (!id) return;

    try {
      await deleteRow(activeTable, id as string | number);
      toast.success("Row deleted");
      setSelectedRow(null);
      loadTableData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleExportCSV = () => {
    if (!tableData || tableData.rows.length === 0) return;
    const rows = tableData.rows;
    const headers = Object.keys(rows[0]);
    const csv = [
      headers.join(","),
      ...rows.map((r) =>
        headers
          .map((h) => {
            const v = r[h];
            const s = typeof v === "object" ? JSON.stringify(v) : String(v ?? "");
            return `"${s.replace(/"/g, '""')}"`;
          })
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeTable}_export.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported");
  };

  const primaryKey = tableSchema?.primaryKey ?? "id";
  const selectedRowId = selectedRow ? (selectedRow[primaryKey] as string | number) : null;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen overflow-hidden bg-[#050508] text-foreground">
      <Toaster position="top-right" closeButton />

      {/* ── Left Sidebar ─────────────────────────────────────────────────── */}
      <AdminSidebar
        tables={tables}
        activeTable={activeTable}
        onSelectTable={handleSelectTable}
        onSync={handleSync}
        onLogout={handleLogout}
        syncing={syncing}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-white/[0.06] bg-[#060609] px-4">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-xs font-bold tracking-[0.15em] text-muted-foreground">
              S.H.I.E.L.D. DATA OS
            </h2>
            <Separator orientation="vertical" className="h-4 bg-white/[0.08]" />
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>Admin</span>
              <ChevronRight className="h-3 w-3" />
              {activeView === "access-log" ? (
                <span className="text-foreground font-medium">Terminal Access Log</span>
              ) : activeTable ? (
                <>
                  <span>PostgreSQL</span>
                  <ChevronRight className="h-3 w-3" />
                  <span className="text-foreground font-medium">{activeTable}</span>
                </>
              ) : (
                <span className="text-foreground font-medium">Dashboard</span>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {activeView === "tables" && (
              <>
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search records…"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="h-8 w-56 pl-8 text-xs bg-white/[0.03] border-white/[0.08] placeholder:text-muted-foreground/40 focus-visible:ring-[#e8866b]/30"
                  />
                </div>

                <Separator orientation="vertical" className="h-4 bg-white/[0.08]" />

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
                  onClick={handleExportCSV}
                  disabled={!tableData || tableData.rows.length === 0}
                >
                  <Download className="h-3.5 w-3.5" />
                  Export CSV
                </Button>

                <Separator orientation="vertical" className="h-4 bg-white/[0.08]" />
              </>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground relative"
            >
              <Bell className="h-3.5 w-3.5" />
              <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-[#e8866b]" />
            </Button>
          </div>
        </header>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Data area */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {activeView === "access-log" ? (
              <AccessLogView />
            ) : activeTable ? (
              <>
                <div className="flex shrink-0 items-center justify-between border-b border-white/[0.06] px-4 py-2.5">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Table2 className="h-4 w-4 text-[#56d4dd]" />
                      <h3 className="font-display text-sm font-bold tracking-wide text-foreground">
                        {activeTable}
                      </h3>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-[#56d4dd]/10 text-[#56d4dd] border border-[#56d4dd]/20 text-[10px] font-mono"
                    >
                      {tableData ? tableData.total.toLocaleString() : "…"} rows
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground"
                    >
                      <Filter className="h-3 w-3" />
                      Filter
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground"
                    >
                      <Plus className="h-3 w-3" />
                      Add Row
                    </Button>
                  </div>
                </div>

                {/* Data Grid */}
                <DataGrid
                  rows={tableData?.rows ?? []}
                  primaryKey={primaryKey}
                  selectedRowId={selectedRowId}
                  onSelectRow={setSelectedRow}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  page={page}
                  totalPages={tableData?.totalPages ?? 1}
                  total={tableData?.total ?? 0}
                  onPageChange={setPage}
                  loading={dataLoading}
                  onCellEdit={handleCellEdit}
                  onEditingChange={setIsEditing}
                />
              </>
            ) : (
              /* Empty / Welcome State */
              <div className="flex flex-1 items-center justify-center">
                <div className="text-center space-y-4 max-w-sm">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                    <Table2 className="h-7 w-7 text-muted-foreground/50" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-foreground mb-1">
                      Select a table
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Choose a table from the PostgreSQL section in the sidebar to view and manage
                      its records.
                    </p>
                  </div>
                  {tablesLoading && (
                    <div className="space-y-2 pt-2">
                      <Skeleton className="h-3 w-3/4 mx-auto" />
                      <Skeleton className="h-3 w-1/2 mx-auto" />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Right Panel (Row Record) ──────────────────────────────────── */}
          {selectedRow && (
            <div className="flex w-80 shrink-0 flex-col border-l border-white/[0.06] bg-[#060609] animate-in slide-in-from-right-4 duration-200">
              {/* Header */}
              <div className="flex shrink-0 items-center justify-between border-b border-white/[0.06] px-4 py-3">
                <div className="flex items-center gap-2">
                  <h4 className="font-display text-xs font-bold tracking-wide text-foreground">
                    Row Record
                  </h4>
                  <Badge
                    variant="secondary"
                    className="bg-[#e8866b]/10 text-[#e8866b] border border-[#e8866b]/20 text-[10px] font-mono"
                  >
                    {String(selectedRowId)}
                  </Badge>
                </div>
                <button
                  onClick={() => setSelectedRow(null)}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/[0.06] transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* JSON Viewer */}
              <ScrollArea className="flex-1">
                <div className="p-3">
                  <JsonViewer data={selectedRow} />
                </div>
              </ScrollArea>

              {/* Actions */}
              <div className="flex shrink-0 items-center gap-2 border-t border-white/[0.06] px-4 py-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View Logs
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 h-8 text-xs gap-1.5 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  onClick={handleDeleteRow}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete Row
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <footer className="flex h-8 shrink-0 items-center justify-between border-t border-white/[0.06] bg-[#060609] px-4 text-[10px] text-muted-foreground/60">
          <span>© 2026 MARVELO — Nexus Terminal v1.0</span>
          <span>
            {activeTable && tableData
              ? `Showing page ${page} of ${tableData.totalPages} · ${tableData.total.toLocaleString()} records`
              : "Ready"}
          </span>
        </footer>
      </div>

      {/* Conflict Resolution Modal */}
      <Dialog open={conflict !== null} onOpenChange={(open) => !open && setConflict(null)}>
        <DialogContent className="border-white/[0.08] bg-[#060609] text-foreground sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-display text-sm font-bold text-[#e8866b]">
              Concurrently Modified Record Detected
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              The cell you are editing in table{" "}
              <span className="font-mono text-[#56d4dd]">{activeTable}</span> for field{" "}
              <span className="font-mono text-[#56d4dd]">{conflict?.field}</span> has been modified
              on the server since you opened it.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 py-4 text-xs">
            <div className="rounded-lg border border-white/[0.04] bg-white/[0.01] p-3">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">
                Your Pending Change
              </span>
              <pre className="font-mono text-[#e8866b] bg-[#e8866b]/[0.04] p-2 rounded border border-[#e8866b]/15 overflow-x-auto">
                {typeof conflict?.yourValue === "object"
                  ? JSON.stringify(conflict?.yourValue, null, 2)
                  : String(conflict?.yourValue)}
              </pre>
            </div>

            <div className="rounded-lg border border-white/[0.04] bg-white/[0.01] p-3">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">
                Current Server Value
              </span>
              <pre className="font-mono text-[#56d4dd] bg-[#56d4dd]/[0.04] p-2 rounded border border-[#56d4dd]/15 overflow-x-auto">
                {typeof conflict?.serverValue === "object"
                  ? JSON.stringify(conflict?.serverValue, null, 2)
                  : String(conflict?.serverValue)}
              </pre>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConflict(null)}
              className="text-xs border-white/[0.08] hover:bg-white/[0.04]"
            >
              Cancel Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                if (!conflict || !activeTable) return;
                setConflict(null);
                toast.info("Applied server value");
                loadTableData();
              }}
              className="text-xs border-[#56d4dd]/30 text-[#56d4dd] hover:bg-[#56d4dd]/10"
            >
              Use Server's
            </Button>
            <Button
              size="sm"
              onClick={async () => {
                if (!conflict || !activeTable) return;
                try {
                  const updatedData = { ...conflict.latestRow };
                  delete updatedData._pk;
                  updatedData[conflict.field] = conflict.yourValue;
                  await updateRow(activeTable, conflict.rowPk, updatedData);
                  setConflict(null);
                  toast.success("Applied your value (overwrote conflict)");
                  loadTableData();
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : "Failed to force save");
                }
              }}
              className="text-xs bg-[#e8866b] text-white hover:bg-[#e8866b]/90"
            >
              Keep Mine
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
