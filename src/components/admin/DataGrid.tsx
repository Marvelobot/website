import { useMemo } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface DataGridProps {
  rows: Record<string, unknown>[];
  primaryKey: string;
  selectedRowId: string | number | null;
  onSelectRow: (row: Record<string, unknown>) => void;
  sortField: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Determine columns dynamically from first row. Puts primaryKey first, then top-level keys, with nested objects shown as truncated JSON. */
function deriveColumns(rows: Record<string, unknown>[], primaryKey: string): string[] {
  if (rows.length === 0) return [primaryKey];

  const firstRow = rows[0];
  // If there's a `data` column that's an object, flatten its top-level keys
  const dataObj = firstRow.data;
  const hasDataCol =
    dataObj !== null && typeof dataObj === "object" && !Array.isArray(dataObj);

  const topKeys = Object.keys(firstRow).filter(
    (k) => k !== primaryKey && k !== "data",
  );

  const dataKeys = hasDataCol
    ? Object.keys(dataObj as Record<string, unknown>).slice(0, 8)
    : [];

  // primary key first, then direct cols, then flattened data cols
  return [primaryKey, ...topKeys, ...dataKeys.map((k) => `data.${k}`)];
}

function getCellValue(
  row: Record<string, unknown>,
  col: string,
): unknown {
  if (col.startsWith("data.")) {
    const key = col.slice(5);
    const data = row.data as Record<string, unknown> | undefined;
    return data?.[key];
  }
  return row[col];
}

function renderCellContent(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "object") {
    const json = JSON.stringify(value);
    return json.length > 60 ? json.slice(0, 60) + "…" : json;
  }
  return String(value);
}

function formatColumnHeader(col: string): string {
  const key = col.startsWith("data.") ? col.slice(5) : col;
  return key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// ── Component ──────────────────────────────────────────────────────────────────

export function DataGrid({
  rows,
  primaryKey,
  selectedRowId,
  onSelectRow,
  sortField,
  sortDirection,
  onSort,
  page,
  totalPages,
  total,
  onPageChange,
  loading = false,
}: DataGridProps) {
  const columns = useMemo(() => deriveColumns(rows, primaryKey), [rows, primaryKey]);

  const SortIcon = ({ col }: { col: string }) => {
    if (sortField !== col) return <ArrowUpDown className="h-3 w-3 opacity-40" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="h-3 w-3 text-[#e8866b]" />
    ) : (
      <ArrowDown className="h-3 w-3 text-[#e8866b]" />
    );
  };

  // Loading skeletons
  if (loading) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/[0.06] hover:bg-transparent">
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableHead key={i} className="h-10">
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i} className="border-white/[0.04]">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Table */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.06] hover:bg-transparent bg-white/[0.02]">
              {columns.map((col) => (
                <TableHead
                  key={col}
                  className="h-10 cursor-pointer select-none whitespace-nowrap text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => onSort(col)}
                >
                  <div className="flex items-center gap-1.5">
                    {formatColumnHeader(col)}
                    <SortIcon col={col} />
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                  No records found.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, idx) => {
                const rowId = row[primaryKey] as string | number;
                const isSelected = rowId === selectedRowId;
                return (
                  <TableRow
                    key={rowId ?? idx}
                    data-state={isSelected ? "selected" : undefined}
                    className={cn(
                      "cursor-pointer border-white/[0.04] transition-all duration-150",
                      idx % 2 === 1 && "bg-white/[0.015]",
                      isSelected
                        ? "bg-[#e8866b]/[0.08] border-l-2 border-l-[#e8866b] shadow-[inset_0_0_30px_-12px_rgba(232,134,107,0.15)]"
                        : "hover:bg-white/[0.04]",
                    )}
                    onClick={() => onSelectRow(row)}
                  >
                    {columns.map((col) => {
                      const cellVal = getCellValue(row, col);
                      const display = renderCellContent(cellVal);
                      const isPk = col === primaryKey;
                      return (
                        <TableCell
                          key={col}
                          className={cn(
                            "whitespace-nowrap text-xs max-w-[240px] truncate",
                            isPk
                              ? "font-mono font-semibold text-[#e8866b]"
                              : "text-foreground/80",
                          )}
                          title={typeof cellVal === "string" ? cellVal : display}
                        >
                          {display}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-2.5 text-xs text-muted-foreground">
        <span>
          {total.toLocaleString()} total record{total !== 1 ? "s" : ""}
        </span>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            disabled={page <= 1}
            onClick={() => onPageChange(1)}
          >
            <ChevronsLeft className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
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
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            disabled={page >= totalPages}
            onClick={() => onPageChange(totalPages)}
          >
            <ChevronsRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
