"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Trash2, FileCode2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ToolEvents } from "@/lib/analytics";

// ─── Conversion Engine ───────────────────────────────────────────────

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function sanitizeKey(key: string): string {
  // If key is not a valid JS identifier, wrap in quotes
  if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)) return key;
  return `"${key.replace(/"/g, '\\"')}"`;
}

function toPascalCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]/g, " ")
    .split(" ")
    .filter(Boolean)
    .map(capitalize)
    .join("");
}

interface ConversionContext {
  interfaces: Map<string, string>;
  nameCounter: Map<string, number>;
}

function getUniqueName(ctx: ConversionContext, baseName: string): string {
  const count = ctx.nameCounter.get(baseName) || 0;
  ctx.nameCounter.set(baseName, count + 1);
  return count === 0 ? baseName : `${baseName}${count + 1}`;
}

function inferType(
  value: unknown,
  name: string,
  ctx: ConversionContext
): string {
  if (value === null) return "null";
  if (value === undefined) return "undefined";

  const type = typeof value;

  if (type === "string") return "string";
  if (type === "number") return "number";
  if (type === "boolean") return "boolean";

  if (Array.isArray(value)) {
    if (value.length === 0) return "unknown[]";

    const elementTypes = new Set<string>();
    value.forEach((item, i) => {
      elementTypes.add(inferType(item, `${name}Item`, ctx));
    });

    const types = Array.from(elementTypes);
    if (types.length === 1) return `${types[0]}[]`;
    return `(${types.join(" | ")})[]`;
  }

  if (type === "object") {
    return generateInterface(value as Record<string, unknown>, name, ctx);
  }

  return "unknown";
}

function generateInterface(
  obj: Record<string, unknown>,
  name: string,
  ctx: ConversionContext
): string {
  const interfaceName = getUniqueName(ctx, toPascalCase(name));
  const keys = Object.keys(obj);

  const lines = keys.map((key) => {
    const childName =
      toPascalCase(key) || `Property${keys.indexOf(key)}`;
    const tsType = inferType(obj[key], childName, ctx);
    const safeKey = sanitizeKey(key);
    return `  ${safeKey}: ${tsType};`;
  });

  const interfaceStr = `interface ${interfaceName} {\n${lines.join("\n")}\n}`;
  ctx.interfaces.set(interfaceName, interfaceStr);

  return interfaceName;
}

function convertJsonToTypescript(jsonStr: string, rootName: string): string {
  const parsed = JSON.parse(jsonStr);

  const ctx: ConversionContext = {
    interfaces: new Map(),
    nameCounter: new Map(),
  };

  if (Array.isArray(parsed)) {
    if (parsed.length === 0) {
      return `type ${toPascalCase(rootName)} = unknown[];`;
    }
    const elementType = inferType(parsed[0], rootName, ctx);
    const interfaces = Array.from(ctx.interfaces.values()).reverse();
    const result = interfaces.join("\n\n");
    const rootType = `type ${toPascalCase(rootName)}List = ${elementType}[];`;
    return result ? `${result}\n\n${rootType}` : rootType;
  }

  if (typeof parsed === "object" && parsed !== null) {
    inferType(parsed, rootName, ctx);
    const interfaces = Array.from(ctx.interfaces.values()).reverse();
    return interfaces.join("\n\n");
  }

  // Primitive root
  const tsType = inferType(parsed, rootName, ctx);
  return `type ${toPascalCase(rootName)} = ${tsType};`;
}

// ─── Sample JSON ─────────────────────────────────────────────────────

const SAMPLE_JSON = `{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "isActive": true,
  "address": {
    "street": "123 Main St",
    "city": "Springfield",
    "zipCode": "62701",
    "coordinates": {
      "lat": 39.7817,
      "lng": -89.6501
    }
  },
  "roles": ["admin", "editor"],
  "projects": [
    {
      "id": 101,
      "title": "Website Redesign",
      "status": "in_progress",
      "tags": ["frontend", "design"]
    }
  ],
  "metadata": null
}`;

// ─── Component ───────────────────────────────────────────────────────

export function JsonToTs() {
  const [input, setInput] = useState(SAMPLE_JSON);
  const [output, setOutput] = useState("");
  const [rootName, setRootName] = useState("Root");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const convert = useCallback(() => {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      return;
    }
    try {
      const result = convertJsonToTypescript(input, rootName);
      setOutput(result);
      setError(null);
    } catch (e) {
      setError(e instanceof SyntaxError ? `Invalid JSON: ${e.message}` : "Failed to convert");
      setOutput("");
    }
  }, [input, rootName]);

  // Auto-convert on input change
  useEffect(() => {
    convert();
  }, [convert]);

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      toast.success("TypeScript copied to clipboard!");
      ToolEvents.resultCopied();
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
      ToolEvents.toolUsed("paste");
    } catch {
      toast.error("Failed to read clipboard");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="w-full max-w-7xl mx-auto"
    >
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <label
            htmlFor="rootName"
            className="text-sm font-medium text-muted-foreground"
          >
            Root interface name:
          </label>
          <input
            id="rootName"
            type="text"
            value={rootName}
            onChange={(e) => setRootName(e.target.value || "Root")}
            className="h-8 w-36 rounded-md border border-border bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
            placeholder="Root"
          />
        </div>
        <div className="flex gap-2 ml-auto">
          <Button variant="outline" size="sm" onClick={handlePaste}>
            <FileCode2 className="h-3.5 w-3.5 mr-1.5" />
            Paste
          </Button>
          <Button variant="outline" size="sm" onClick={handleClear}>
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
            Clear
          </Button>
        </div>
      </div>

      {/* Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* JSON Input */}
        <div className="relative group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              JSON Input
            </span>
            {error && (
              <span className="flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="h-3 w-3" />
                {error}
              </span>
            )}
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Paste your JSON here...\n{\n  "key": "value"\n}'
            className="w-full h-[500px] rounded-lg border border-border bg-muted/30 p-4 font-mono text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-brand/50 transition-shadow"
            spellCheck={false}
          />
        </div>

        {/* TypeScript Output */}
        <div className="relative group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              TypeScript Output
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              disabled={!output}
              className="h-7 text-xs"
            >
              {copied ? (
                <Check className="h-3 w-3 mr-1 text-green-500" />
              ) : (
                <Copy className="h-3 w-3 mr-1" />
              )}
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <div className="w-full h-[500px] rounded-lg border border-border bg-muted/30 p-4 overflow-auto">
            <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
              <code className={output ? "text-foreground" : "text-muted-foreground"}>
                {output || "// TypeScript interfaces will appear here..."}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
