import { useMemo, useState, useEffect, useRef } from "react";
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
  onCellEdit?: (rowPk: string | number, field: string, newValue: unknown) => void;
  onEditingChange?: (editing: boolean) => void;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Determine columns dynamically from first row. Puts primaryKey first, then top-level keys, with nested objects shown as truncated JSON. */
function deriveColumns(rows: Record<string, unknown>[], primaryKey: string): string[] {
  if (rows.length === 0) return [primaryKey];

  const firstRow = rows[0];
  // If there's a `data` column that's an object, flatten its top-level keys
  const dataObj = firstRow.data;
  const hasDataCol = dataObj !== null && typeof dataObj === "object" && !Array.isArray(dataObj);

  const topKeys = Object.keys(firstRow).filter((k) => k !== primaryKey && k !== "data");

  const dataKeys = hasDataCol ? Object.keys(dataObj as Record<string, unknown>).slice(0, 8) : [];

  // primary key first, then direct cols, then flattened data cols
  return [primaryKey, ...topKeys, ...dataKeys.map((k) => `data.${k}`)];
}

function getCellValue(row: Record<string, unknown>, col: string): unknown {
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
  onCellEdit,
  onEditingChange,
}: DataGridProps) {
  const columns = useMemo(() => deriveColumns(rows, primaryKey), [rows, primaryKey]);

  // ── Inline Editing State ───────────────────────────────────────────────────
  const [editingCell, setEditingCell] = useState<{ rowPk: string | number; field: string } | null>(
    null,
  );
  const [editValue, setEditValue] = useState<string>("");
  const [jsonError, setJsonError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isSavingRef = useRef<boolean>(false);

  // Helper to determine if value is object or array
  const isComplexValue = (val: unknown): boolean => {
    return val !== null && typeof val === "object";
  };

  // Double click cell to enter edit mode
  const handleDoubleClick = (rowPk: string | number, field: string, currentVal: unknown) => {
    if (field === primaryKey) return;
    setEditingCell({ rowPk, field });
    setEditValue(
      currentVal === null || currentVal === undefined
        ? ""
        : typeof currentVal === "object"
          ? JSON.stringify(currentVal, null, 2)
          : String(currentVal),
    );
    setJsonError(null);
    onEditingChange?.(true);
  };

  // Live validation for JSON complex fields
  useEffect(() => {
    if (!editingCell) return;
    const targetRow = rows.find((r) => r[primaryKey] === editingCell.rowPk);
    if (!targetRow) return;
    const currentVal = getCellValue(targetRow, editingCell.field);
    if (isComplexValue(currentVal)) {
      try {
        JSON.parse(editValue);
        setJsonError(null);
      } catch (err) {
        setJsonError("Invalid JSON");
      }
    } else {
      setJsonError(null);
    }
  }, [editValue, editingCell, rows, primaryKey]);

  // Template inserter for JSON array/object chips
  const insertTemplate = (template: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setEditValue(template);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    const newValue = before + template + after;
    setEditValue(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + template.length, start + template.length);
    }, 0);
  };

  // Save the edited cell
  const handleSave = (rowPk: string | number, field: string, originalVal: unknown) => {
    if (isSavingRef.current) return;
    isSavingRef.current = true;

    let parsedValue: unknown = editValue;

    if (isComplexValue(originalVal)) {
      try {
        parsedValue = JSON.parse(editValue);
      } catch (err) {
        setJsonError("Invalid JSON format");
        return;
      }
    } else {
      const trimmed = editValue.trim();
      if (
        (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
        (trimmed.startsWith("{") && trimmed.endsWith("}"))
      ) {
        try {
          parsedValue = JSON.parse(trimmed);
        } catch (err) {
          setJsonError("Invalid JSON format");
          return;
        }
      } else if (trimmed === "true") {
        parsedValue = true;
      } else if (trimmed === "false") {
        parsedValue = false;
      } else if (trimmed === "" || trimmed === "null") {
        parsedValue = null;
      } else if (!isNaN(Number(trimmed)) && trimmed !== "") {
        parsedValue = Number(trimmed);
      } else {
        parsedValue = editValue;
      }
    }

    onCellEdit?.(rowPk, field, parsedValue);
    setEditingCell(null);
    onEditingChange?.(false);

    setTimeout(() => {
      isSavingRef.current = false;
    }, 150);
  };

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
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-muted-foreground"
                >
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
                      const isEditingThis =
                        editingCell && editingCell.rowPk === rowId && editingCell.field === col;

                      if (isEditingThis) {
                        const isComplex = isComplexValue(cellVal);
                        return (
                          <TableCell
                            key={col}
                            className="p-1 min-w-[220px]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {isComplex ? (
                              <div className="flex flex-col gap-1 rounded-md border border-[#e8866b] bg-[#060609] p-1.5 shadow-[0_0_10px_rgba(232,134,107,0.15)]">
                                <div className="flex items-center justify-between text-[9px] text-muted-foreground pb-1 border-b border-white/[0.04] mb-1 select-none">
                                  <span className="font-semibold uppercase tracking-wider">
                                    Templates:
                                  </span>
                                  <div className="flex gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => insertTemplate('["value1", "value2"]')}
                                      className="px-1.5 py-0.5 rounded bg-white/[0.04] hover:bg-[#e8866b]/20 hover:text-[#e8866b] transition-colors font-mono"
                                    >
                                      [Array]
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => insertTemplate('{"key": "value"}')}
                                      className="px-1.5 py-0.5 rounded bg-white/[0.04] hover:bg-[#e8866b]/20 hover:text-[#e8866b] transition-colors font-mono"
                                    >
                                      {`{Object}`}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => insertTemplate('[{"id": 1, "name": "val"}]')}
                                      className="px-1.5 py-0.5 rounded bg-white/[0.04] hover:bg-[#e8866b]/20 hover:text-[#e8866b] transition-colors font-mono"
                                    >
                                      [JSON List]
                                    </button>
                                  </div>
                                </div>

                                <textarea
                                  ref={textareaRef}
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Escape") {
                                      isSavingRef.current = true;
                                      setEditingCell(null);
                                      onEditingChange?.(false);
                                      setTimeout(() => {
                                        isSavingRef.current = false;
                                      }, 150);
                                    } else if (e.key === "Enter" && e.ctrlKey) {
                                      handleSave(rowId, col, cellVal);
                                    }
                                  }}
                                  className={cn(
                                    "w-full min-h-[70px] bg-white/[0.02] border border-white/[0.08] rounded p-1 text-[11px] font-mono text-foreground focus:outline-none focus:border-[#e8866b]/50 resize-y",
                                    jsonError && "border-red-500/50 focus:border-red-500",
                                  )}
                                  placeholder="Enter JSON..."
                                  autoFocus
                                />

                                {jsonError && (
                                  <span className="text-[10px] text-red-400 font-medium">
                                    {jsonError}
                                  </span>
                                )}

                                <div className="flex items-center justify-between mt-1 pt-1 border-t border-white/[0.04]">
                                  <span className="text-[9px] text-muted-foreground/60">
                                    Ctrl+Enter to save
                                  </span>
                                  <div className="flex gap-1.5">
                                    <button
                                      onClick={() => {
                                        isSavingRef.current = true;
                                        setEditingCell(null);
                                        onEditingChange?.(false);
                                        setTimeout(() => {
                                          isSavingRef.current = false;
                                        }, 150);
                                      }}
                                      className="px-2 py-0.5 rounded text-[10px] text-muted-foreground hover:bg-white/[0.04] transition-colors"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() => handleSave(rowId, col, cellVal)}
                                      disabled={!!jsonError}
                                      className="px-2 py-0.5 rounded text-[10px] bg-[#e8866b] text-white hover:brightness-110 transition-colors disabled:opacity-50"
                                    >
                                      Save
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="relative flex items-center rounded-md border border-[#e8866b] bg-[#060609] p-0.5 shadow-[0_0_10px_rgba(232,134,107,0.15)]">
                                <input
                                  type="text"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Escape") {
                                      isSavingRef.current = true;
                                      setEditingCell(null);
                                      onEditingChange?.(false);
                                      setTimeout(() => {
                                        isSavingRef.current = false;
                                      }, 150);
                                    } else if (e.key === "Enter") {
                                      handleSave(rowId, col, cellVal);
                                    }
                                  }}
                                  onBlur={() => {
                                    if (!isSavingRef.current) {
                                      handleSave(rowId, col, cellVal);
                                    }
                                  }}
                                  className="w-full bg-transparent border-0 px-2 py-1 text-xs font-mono focus:outline-none focus:ring-0 text-foreground"
                                  autoFocus
                                />
                              </div>
                            )}
                          </TableCell>
                        );
                      }

                      return (
                        <TableCell
                          key={col}
                          className={cn(
                            "whitespace-nowrap text-xs max-w-[240px] truncate select-none",
                            isPk
                              ? "font-mono font-semibold text-[#e8866b]"
                              : "text-foreground/80 hover:bg-[#e8866b]/[0.03] transition-colors cursor-pointer",
                          )}
                          title={typeof cellVal === "string" ? cellVal : display}
                          onDoubleClick={() => handleDoubleClick(rowId, col, cellVal)}
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
