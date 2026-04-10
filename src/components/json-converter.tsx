"use client";

import { useState, useCallback, useEffect } from "react";
import { Copy, Check, RefreshCw, FileCode } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ToolEvents } from "@/lib/analytics";

// ─── Type inference engine ───────────────────────────────────────────────────

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

interface ConvertOptions {
  useInterface: boolean;
  exportTypes: boolean;
  optionalProperties: boolean;
  readonlyProperties: boolean;
  rootName: string;
}

function toPascalCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^(.)/, (c) => c.toUpperCase());
}

function inferType(
  value: JsonValue,
  key: string,
  interfaces: Map<string, string>,
  options: ConvertOptions
): string {
  if (value === null) return "null";
  if (typeof value === "string") return "string";
  if (typeof value === "number")
    return Number.isInteger(value) ? "number" : "number";
  if (typeof value === "boolean") return "boolean";

  if (Array.isArray(value)) {
    if (value.length === 0) return "unknown[]";

    const elementTypes = value.map((item) =>
      inferType(item, key, interfaces, options)
    );
    const uniqueTypes = [...new Set(elementTypes)];

    if (uniqueTypes.length === 1) {
      return `${uniqueTypes[0]}[]`;
    }
    return `(${uniqueTypes.join(" | ")})[]`;
  }

  if (typeof value === "object") {
    const interfaceName = toPascalCase(key);
    buildInterface(value as { [key: string]: JsonValue }, interfaceName, interfaces, options);
    return interfaceName;
  }

  return "unknown";
}

function buildInterface(
  obj: { [key: string]: JsonValue },
  name: string,
  interfaces: Map<string, string>,
  options: ConvertOptions
): void {
  if (interfaces.has(name)) return;

  const keyword = options.useInterface ? "interface" : "type";
  const exportKw = options.exportTypes ? "export " : "";
  const ro = options.readonlyProperties ? "readonly " : "";

  const lines: string[] = [];
  const opening =
    keyword === "interface" ? `${exportKw}interface ${name} {` : `${exportKw}type ${name} = {`;

  lines.push(opening);

  for (const [key, val] of Object.entries(obj)) {
    const propName = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)
      ? key
      : `"${key}"`;

    let typeStr: string;

    if (Array.isArray(val) && val.length > 0 && typeof val[0] === "object" && val[0] !== null) {
      // Array of objects → named sub-interface
      const subName = toPascalCase(key);
      buildInterface(
        val[0] as { [key: string]: JsonValue },
        subName,
        interfaces,
        options
      );

      if (options.optionalProperties) {
        // Check if all elements share every key
        const allKeys = new Set(val.flatMap((item) => Object.keys(item as object)));
        const requiredKeys = new Set(
          [...allKeys].filter((k) =>
            val.every((item) => Object.prototype.hasOwnProperty.call(item, k))
          )
        );
        typeStr = `${subName}[]`;
        const optional = !requiredKeys.has(key) ? "?" : "";
        lines.push(`  ${ro}${propName}${optional}: ${typeStr};`);
        continue;
      } else {
        typeStr = `${subName}[]`;
      }
    } else {
      typeStr = inferType(val, toPascalCase(key), interfaces, options);
    }

    const optional = options.optionalProperties ? "?" : "";
    lines.push(`  ${ro}${propName}${optional}: ${typeStr};`);
  }

  lines.push(keyword === "interface" ? "}" : "};");

  // Register before processing children to avoid infinite loops
  interfaces.set(name, lines.join("\n"));
}

function convertJsonToTs(jsonStr: string, options: ConvertOptions): string {
  let parsed: JsonValue;
  try {
    parsed = JSON.parse(jsonStr) as JsonValue;
  } catch {
    throw new Error("Invalid JSON — please check your input.");
  }

  const interfaces = new Map<string, string>();
  const rootName = toPascalCase(options.rootName) || "Root";

  if (Array.isArray(parsed)) {
    if (parsed.length === 0) {
      const exportKw = options.exportTypes ? "export " : "";
      return `${exportKw}type ${rootName} = unknown[];`;
    }
    const firstItem = parsed[0];
    if (typeof firstItem === "object" && firstItem !== null && !Array.isArray(firstItem)) {
      buildInterface(firstItem as { [key: string]: JsonValue }, rootName, interfaces, options);
      const exportKw = options.exportTypes ? "export " : "";
      const allInterfaces = [...interfaces.values()].reverse().join("\n\n");
      return `${allInterfaces}\n\n${exportKw}type ${rootName}Array = ${rootName}[];`;
    } else {
      const elementTypes = (parsed as JsonValue[]).map((item) =>
        inferType(item, rootName, interfaces, options)
      );
      const uniqueTypes = [...new Set(elementTypes)];
      const exportKw = options.exportTypes ? "export " : "";
      return `${exportKw}type ${rootName} = ${uniqueTypes.join(" | ")}[];`;
    }
  }

  if (typeof parsed === "object" && parsed !== null) {
    buildInterface(parsed as { [key: string]: JsonValue }, rootName, interfaces, options);
    return [...interfaces.values()].reverse().join("\n\n");
  }

  // Primitive root
  const exportKw = options.exportTypes ? "export " : "";
  const typeStr = inferType(parsed, rootName, interfaces, options);
  return `${exportKw}type ${rootName} = ${typeStr};`;
}

// ─── Sample JSON ──────────────────────────────────────────────────────────────

const SAMPLE_JSON = `{
  "id": 1,
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "isActive": true,
  "score": 98.5,
  "tags": ["admin", "user"],
  "address": {
    "street": "123 Main St",
    "city": "San Francisco",
    "zip": "94102"
  },
  "orders": [
    {
      "orderId": "ORD-001",
      "total": 149.99,
      "shipped": true
    }
  ]
}`;

// ─── Component ────────────────────────────────────────────────────────────────

export function JsonConverter() {
  const [input, setInput] = useState(SAMPLE_JSON);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState<ConvertOptions>({
    useInterface: true,
    exportTypes: true,
    optionalProperties: false,
    readonlyProperties: false,
    rootName: "Root",
  });

  const convert = useCallback(
    (json: string, opts: ConvertOptions) => {
      if (!json.trim()) {
        setOutput("");
        setError("");
        return;
      }
      try {
        const result = convertJsonToTs(json, opts);
        setOutput(result);
        setError("");
      } catch (e) {
        setError((e as Error).message);
        setOutput("");
      }
    },
    []
  );

  useEffect(() => {
    convert(input, options);
  }, [input, options, convert]);

  const handleCopy = useCallback(async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      toast.success("TypeScript types copied!");
      ToolEvents.resultCopied();
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  }, [output]);

  const handleReset = useCallback(() => {
    setInput(SAMPLE_JSON);
    ToolEvents.toolUsed("reset");
  }, []);

  const lineCount = output ? output.split("\n").length : 0;

  return (
    <div className="space-y-4">
      {/* Options Bar */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-muted/30 border border-border/50">
        <span className="text-sm font-medium text-muted-foreground mr-1">Options:</span>

        <ToggleChip
          active={options.useInterface}
          label="Interface"
          inactiveLabel="Type Alias"
          onToggle={() =>
            setOptions((o) => ({ ...o, useInterface: !o.useInterface }))
          }
        />
        <ToggleChip
          active={options.exportTypes}
          label="Export"
          onToggle={() =>
            setOptions((o) => ({ ...o, exportTypes: !o.exportTypes }))
          }
        />
        <ToggleChip
          active={options.optionalProperties}
          label="Optional Props"
          onToggle={() =>
            setOptions((o) => ({
              ...o,
              optionalProperties: !o.optionalProperties,
            }))
          }
        />
        <ToggleChip
          active={options.readonlyProperties}
          label="Readonly"
          onToggle={() =>
            setOptions((o) => ({
              ...o,
              readonlyProperties: !o.readonlyProperties,
            }))
          }
        />

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm text-muted-foreground">Root name:</span>
          <input
            value={options.rootName}
            onChange={(e) =>
              setOptions((o) => ({ ...o, rootName: e.target.value }))
            }
            className="w-24 px-2 py-1 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-brand font-mono"
            placeholder="Root"
            maxLength={40}
            spellCheck={false}
          />
        </div>
      </div>

      {/* Panels */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Input */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-sm font-medium flex items-center gap-1.5">
              <span className="text-base">📥</span> JSON Input
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-7 text-xs gap-1 text-muted-foreground"
            >
              <RefreshCw className="h-3 w-3" />
              Reset
            </Button>
          </div>
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              ToolEvents.toolUsed("input");
            }}
            spellCheck={false}
            placeholder="Paste your JSON here…"
            className="w-full h-96 font-mono text-sm p-4 rounded-xl border border-border bg-muted/20 focus:outline-none focus:ring-2 focus:ring-brand resize-none leading-relaxed"
          />
          {error && (
            <p className="text-destructive text-xs px-1 flex items-center gap-1">
              <span>⚠️</span> {error}
            </p>
          )}
        </div>

        {/* Output */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-sm font-medium flex items-center gap-1.5">
              <FileCode className="h-4 w-4 text-brand" /> TypeScript Output
              {lineCount > 0 && (
                <Badge variant="secondary" className="text-xs ml-1">
                  {lineCount} lines
                </Badge>
              )}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              disabled={!output}
              className="h-7 text-xs gap-1 text-muted-foreground"
            >
              {copied ? (
                <Check className="h-3 w-3 text-brand" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <pre
            className="w-full h-96 font-mono text-sm p-4 rounded-xl border border-border bg-muted/20 overflow-auto leading-relaxed text-left"
          >
            {output || (
              <span className="text-muted-foreground/60 italic">
                TypeScript interfaces will appear here…
              </span>
            )}
          </pre>
        </div>
      </div>

      {/* Copy CTA */}
      {output && (
        <div className="flex justify-center pt-2">
          <Button
            onClick={handleCopy}
            className="gap-2 bg-gradient-to-r from-brand to-brand-accent text-white shadow-lg shadow-brand/25 px-6"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copied ? "Copied to Clipboard!" : "Copy TypeScript Types"}
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Toggle chip ──────────────────────────────────────────────────────────────

function ToggleChip({
  active,
  label,
  inactiveLabel,
  onToggle,
}: {
  active: boolean;
  label: string;
  inactiveLabel?: string;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
        active
          ? "bg-brand/10 border-brand/30 text-brand"
          : "bg-background border-border text-muted-foreground hover:border-brand/30"
      }`}
    >
      {active ? label : (inactiveLabel ?? label)}
    </button>
  );
}
