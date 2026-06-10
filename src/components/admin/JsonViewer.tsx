import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronDown, Copy, Check } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────

interface JsonViewerProps {
  data: unknown;
  className?: string;
}

interface JsonNodeProps {
  keyName?: string;
  value: unknown;
  depth: number;
  isLast: boolean;
}

// ── Syntax color tokens ────────────────────────────────────────────────────────

const tokenColor = {
  key: "text-[#e8866b]", // coral / salmon
  string: "text-[#7ec87e]", // green
  number: "text-[#e5c07b]", // gold
  boolean: "text-[#56d4dd]", // cyan
  null: "text-[#868ba5]", // muted
  bracket: "text-muted-foreground",
  comma: "text-muted-foreground/60",
} as const;

// ── Recursive node ─────────────────────────────────────────────────────────────

function JsonNode({ keyName, value, depth, isLast }: JsonNodeProps) {
  const [collapsed, setCollapsed] = useState(depth > 2);

  const isObject = value !== null && typeof value === "object" && !Array.isArray(value);
  const isArray = Array.isArray(value);
  const isExpandable = isObject || isArray;

  const indent = depth * 16;

  // Primitive rendering
  if (!isExpandable) {
    let rendered: React.ReactNode;
    let colorClass: string;

    if (value === null || value === undefined) {
      rendered = "null";
      colorClass = tokenColor.null;
    } else if (typeof value === "string") {
      rendered = `"${value}"`;
      colorClass = tokenColor.string;
    } else if (typeof value === "number") {
      rendered = String(value);
      colorClass = tokenColor.number;
    } else if (typeof value === "boolean") {
      rendered = String(value);
      colorClass = tokenColor.boolean;
    } else {
      rendered = String(value);
      colorClass = tokenColor.string;
    }

    return (
      <div className="flex items-start leading-6" style={{ paddingLeft: indent }}>
        {keyName !== undefined && (
          <>
            <span className={tokenColor.key}>"{keyName}"</span>
            <span className={tokenColor.comma}>:&nbsp;</span>
          </>
        )}
        <span className={colorClass}>{rendered}</span>
        {!isLast && <span className={tokenColor.comma}>,</span>}
      </div>
    );
  }

  // Object / Array rendering
  const entries = isArray
    ? (value as unknown[]).map((v, i) => [i, v] as const)
    : Object.entries(value as Record<string, unknown>);

  const openBracket = isArray ? "[" : "{";
  const closeBracket = isArray ? "]" : "}";

  const toggle = () => setCollapsed((c) => !c);

  return (
    <div>
      {/* Open bracket line */}
      <div
        className="flex cursor-pointer items-center leading-6 select-none hover:bg-white/[0.03] rounded-sm transition-colors"
        style={{ paddingLeft: indent }}
        onClick={toggle}
      >
        <span className="mr-1 w-4 h-4 flex items-center justify-center text-muted-foreground/60 shrink-0">
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </span>
        {keyName !== undefined && (
          <>
            <span className={tokenColor.key}>"{keyName}"</span>
            <span className={tokenColor.comma}>:&nbsp;</span>
          </>
        )}
        <span className={tokenColor.bracket}>{openBracket}</span>
        {collapsed && (
          <>
            <span className="text-muted-foreground/40 mx-1 text-xs">
              {entries.length} {isArray ? "items" : "keys"}
            </span>
            <span className={tokenColor.bracket}>{closeBracket}</span>
            {!isLast && <span className={tokenColor.comma}>,</span>}
          </>
        )}
      </div>

      {/* Children */}
      {!collapsed && (
        <>
          {entries.map(([k, v], i) => (
            <JsonNode
              key={String(k)}
              keyName={isArray ? undefined : String(k)}
              value={v}
              depth={depth + 1}
              isLast={i === entries.length - 1}
            />
          ))}
          {/* Close bracket */}
          <div className="leading-6" style={{ paddingLeft: indent }}>
            <span className="ml-5" />
            <span className={tokenColor.bracket}>{closeBracket}</span>
            {!isLast && <span className={tokenColor.comma}>,</span>}
          </div>
        </>
      )}
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────────

export function JsonViewer({ data, className }: JsonViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [data]);

  return (
    <div
      className={cn(
        "relative rounded-lg border border-white/[0.06] bg-[#0a0a12] p-4 font-mono text-xs",
        className,
      )}
    >
      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-muted-foreground hover:text-foreground hover:bg-white/[0.08] transition-colors"
        title="Copy JSON"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-green-400" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </button>

      {/* Tree */}
      <div className="overflow-x-auto pr-8">
        <JsonNode value={data} depth={0} isLast />
      </div>
    </div>
  );
}
