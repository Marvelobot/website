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

import {
  fetchTables,
  fetchTableData,
  fetchTableSchema,
  deleteRow,
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

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate({ to: "/admin/login" });
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
              {activeTable ? (
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
            {/* Table Header */}
            {activeTable ? (
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
                      Choose a table from the PostgreSQL section in the sidebar to view and manage its records.
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
    </div>
  );
}
