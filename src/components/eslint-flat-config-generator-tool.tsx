"use client";

import { useState, useMemo } from "react";
import { Copy, Download, Check, Settings2, Code2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ToolEvents } from "@/lib/analytics";

type Framework = "react" | "nextjs" | "vue" | "nodejs" | "vanilla";
type Preset = "recommended" | "strict" | "minimal";

interface ConfigOptions {
  framework: Framework;
  typescript: boolean;
  prettier: boolean;
  preset: Preset;
}

const FRAMEWORKS: { value: Framework; label: string; icon: string }[] = [
  { value: "vanilla", label: "Vanilla JS", icon: "🟨" },
  { value: "react", label: "React", icon: "⚛️" },
  { value: "nextjs", label: "Next.js", icon: "▲" },
  { value: "vue", label: "Vue", icon: "💚" },
  { value: "nodejs", label: "Node.js", icon: "🟩" },
];

const PRESETS: { value: Preset; label: string; description: string }[] = [
  {
    value: "recommended",
    label: "Recommended",
    description: "Safe baseline rules for most projects",
  },
  {
    value: "strict",
    label: "Strict",
    description: "Additional opinionated rules for higher quality",
  },
  {
    value: "minimal",
    label: "Minimal",
    description: "Only critical checks — great for gradual adoption",
  },
];

function generateInstallCommand(opts: ConfigOptions): string {
  const pkgs: string[] = ["@eslint/js", "globals"];

  if (opts.typescript) pkgs.push("typescript-eslint");

  if (opts.framework === "react" || opts.framework === "nextjs") {
    pkgs.push("eslint-plugin-react-hooks");
    if (opts.framework === "react") pkgs.push("eslint-plugin-react-refresh");
  }

  if (opts.framework === "nextjs") pkgs.push("@next/eslint-plugin-next");
  if (opts.framework === "vue") pkgs.push("eslint-plugin-vue");

  if (opts.prettier) pkgs.push("eslint-config-prettier");

  return `npm install --save-dev eslint ${pkgs.join(" ")}`;
}

function generateConfig(opts: ConfigOptions): string {
  const lines: string[] = [];

  // Install comment
  lines.push(`// Install dependencies first:`);
  lines.push(`// ${generateInstallCommand(opts)}`);
  lines.push("");

  // Imports
  if (opts.typescript) {
    lines.push(`import tseslint from "typescript-eslint";`);
  } else {
    lines.push(`import js from "@eslint/js";`);
  }
  lines.push(`import globals from "globals";`);

  if (opts.framework === "react") {
    lines.push(`import reactHooks from "eslint-plugin-react-hooks";`);
    lines.push(`import reactRefresh from "eslint-plugin-react-refresh";`);
  }

  if (opts.framework === "nextjs") {
    lines.push(`import reactHooks from "eslint-plugin-react-hooks";`);
    lines.push(`import next from "@next/eslint-plugin-next";`);
  }

  if (opts.framework === "vue") {
    lines.push(`import vuePlugin from "eslint-plugin-vue";`);
    lines.push(`import vueParser from "vue-eslint-parser";`);
  }

  if (opts.prettier) {
    lines.push(`import prettierConfig from "eslint-config-prettier";`);
  }

  lines.push("");

  // Determine base extends
  const buildExtends = (): string[] => {
    const ext: string[] = [];

    if (opts.typescript) {
      if (opts.preset === "strict") {
        ext.push("...tseslint.configs.strictTypeChecked");
        ext.push("...tseslint.configs.stylisticTypeChecked");
      } else if (opts.preset === "minimal") {
        ext.push("tseslint.configs.base");
      } else {
        ext.push("...tseslint.configs.recommended");
      }
    } else {
      if (opts.preset === "strict") {
        ext.push("js.configs.all");
      } else if (opts.preset === "minimal") {
        ext.push("js.configs.recommended");
      } else {
        ext.push("js.configs.recommended");
      }
    }

    if (opts.framework === "nextjs") {
      ext.push('next.configs["core-web-vitals"]');
    }

    if (opts.prettier) {
      ext.push("prettierConfig");
    }

    return ext;
  };

  const extendsArr = buildExtends();

  // Globals
  const globalsEntries: string[] = [];
  if (opts.framework === "nodejs") {
    globalsEntries.push("globals.node");
  } else if (opts.framework === "nextjs") {
    globalsEntries.push("globals.browser", "globals.node");
  } else {
    globalsEntries.push("globals.browser");
  }

  // File patterns
  const filePatterns = opts.typescript
    ? opts.framework === "vue"
      ? `["**/*.{ts,tsx,vue}"]`
      : `["**/*.{ts,tsx}"]`
    : opts.framework === "vue"
    ? `["**/*.{js,mjs,cjs,vue}"]`
    : `["**/*.{js,mjs,cjs,jsx}"]`;

  // Plugins section
  const plugins: string[] = [];
  if (opts.framework === "react" || opts.framework === "nextjs") {
    plugins.push(`      "react-hooks": reactHooks,`);
  }
  if (opts.framework === "react") {
    plugins.push(`      "react-refresh": reactRefresh,`);
  }
  if (opts.framework === "vue") {
    plugins.push(`      vue: vuePlugin,`);
  }

  // Rules section
  const rules: string[] = [];

  if (opts.framework === "react" || opts.framework === "nextjs") {
    rules.push(`      ...reactHooks.configs.recommended.rules,`);
  }

  if (opts.framework === "react") {
    rules.push(
      `      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],`
    );
  }

  if (opts.framework === "nextjs") {
    rules.push(`      "@next/next/no-img-element": "off",`);
  }

  if (opts.preset === "strict" && !opts.typescript) {
    rules.push(`      "no-console": "warn",`);
    rules.push(`      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],`);
    rules.push(`      "prefer-const": "error",`);
    rules.push(`      "no-var": "error",`);
  }

  if (opts.preset === "minimal") {
    rules.push(`      "no-console": "off",`);
    rules.push(`      "no-debugger": "error",`);
  }

  // Build config body
  if (opts.typescript) {
    lines.push(`export default tseslint.config(`);
  } else {
    lines.push(`export default [`);
  }

  // Ignores
  if (opts.typescript) {
    lines.push(`  { ignores: ["dist", ".next", "node_modules"] },`);
    lines.push(`  {`);
    lines.push(`    extends: [`);
    extendsArr.forEach((e) => lines.push(`      ${e},`));
    lines.push(`    ],`);
  } else {
    lines.push(`  // Global ignores`);
    lines.push(`  { ignores: ["dist", ".next", "node_modules"] },`);
    lines.push(`  {`);
    lines.push(`    ...${extendsArr[0]},`);
    if (extendsArr.length > 1) {
      lines.push(`    // Additional extends: ${extendsArr.slice(1).join(", ")}`);
    }
  }

  lines.push(`    files: ${filePatterns},`);

  // Language options
  if (opts.framework === "vue" && opts.typescript) {
    lines.push(`    languageOptions: {`);
    lines.push(`      ecmaVersion: 2022,`);
    lines.push(`      parser: vueParser,`);
    lines.push(`      parserOptions: {`);
    lines.push(`        parser: "@typescript-eslint/parser",`);
    lines.push(`        extraFileExtensions: [".vue"],`);
    lines.push(`        sourceType: "module",`);
    lines.push(`      },`);
    lines.push(`      globals: {`);
    globalsEntries.forEach((g) => lines.push(`        ...${g},`));
    lines.push(`      },`);
    lines.push(`    },`);
  } else {
    lines.push(`    languageOptions: {`);
    lines.push(`      ecmaVersion: 2022,`);
    lines.push(`      sourceType: "module",`);
    lines.push(`      globals: {`);
    globalsEntries.forEach((g) => lines.push(`        ...${g},`));
    lines.push(`      },`);
    if (opts.typescript) {
      lines.push(`      parserOptions: {`);
      lines.push(`        projectService: true,`);
      lines.push(`        tsconfigRootDir: import.meta.dirname,`);
      lines.push(`      },`);
    }
    lines.push(`    },`);
  }

  // Plugins
  if (plugins.length > 0) {
    lines.push(`    plugins: {`);
    plugins.forEach((p) => lines.push(`    ${p}`));
    lines.push(`    },`);
  }

  // Rules
  if (rules.length > 0) {
    lines.push(`    rules: {`);
    rules.forEach((r) => lines.push(`      ${r}`));
    lines.push(`    },`);
  }

  lines.push(`  },`);

  if (opts.typescript) {
    lines.push(`);`);
  } else {
    lines.push(`];`);
  }

  return lines.join("\n");
}

export function EslintFlatConfigGeneratorTool() {
  const [opts, setOpts] = useState<ConfigOptions>({
    framework: "react",
    typescript: true,
    prettier: true,
    preset: "recommended",
  });
  const [copied, setCopied] = useState(false);

  const config = useMemo(() => generateConfig(opts), [opts]);
  const installCmd = useMemo(() => generateInstallCommand(opts), [opts]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(config);
    setCopied(true);
    toast.success("Config copied to clipboard!");
    ToolEvents.resultCopied();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([config], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = opts.typescript ? "eslint.config.ts" : "eslint.config.js";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Config downloaded!");
    ToolEvents.resultExported("js");
  };

  const handleCopyInstall = async () => {
    await navigator.clipboard.writeText(installCmd);
    toast.success("Install command copied!");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Options Panel */}
      <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Settings2 className="h-5 w-5 text-brand" />
          <h2 className="font-semibold text-lg">Configuration Options</h2>
        </div>

        {/* Framework */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-3 block">
            Framework
          </label>
          <div className="flex flex-wrap gap-2">
            {FRAMEWORKS.map((fw) => (
              <button
                key={fw.value}
                onClick={() => {
                  setOpts((o) => ({ ...o, framework: fw.value }));
                  ToolEvents.toolUsed("framework-select");
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                  opts.framework === fw.value
                    ? "border-brand bg-brand/10 text-brand"
                    : "border-border/50 bg-muted/30 hover:border-brand/40 hover:bg-brand/5"
                }`}
              >
                <span>{fw.icon}</span>
                {fw.label}
              </button>
            ))}
          </div>
        </div>

        {/* Rule Preset */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-3 block">
            Rule Preset
          </label>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.value}
                onClick={() => {
                  setOpts((o) => ({ ...o, preset: p.value }));
                  ToolEvents.toolUsed("preset-select");
                }}
                className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                  opts.preset === p.value
                    ? "border-brand bg-brand/10 text-brand"
                    : "border-border/50 bg-muted/30 hover:border-brand/40 hover:bg-brand/5"
                }`}
                title={p.description}
              >
                {p.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {PRESETS.find((p) => p.value === opts.preset)?.description}
          </p>
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
              onClick={() => {
                setOpts((o) => ({ ...o, typescript: !o.typescript }));
                ToolEvents.toolUsed("typescript-toggle");
              }}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                opts.typescript ? "bg-brand" : "bg-muted-foreground/30"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${
                  opts.typescript ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </div>
            <span className="text-sm font-medium">TypeScript</span>
            {opts.typescript && (
              <Badge variant="secondary" className="text-xs">
                typescript-eslint
              </Badge>
            )}
          </label>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
              onClick={() => {
                setOpts((o) => ({ ...o, prettier: !o.prettier }));
                ToolEvents.toolUsed("prettier-toggle");
              }}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                opts.prettier ? "bg-brand" : "bg-muted-foreground/30"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${
                  opts.prettier ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </div>
            <span className="text-sm font-medium">Prettier Integration</span>
            {opts.prettier && (
              <Badge variant="secondary" className="text-xs">
                eslint-config-prettier
              </Badge>
            )}
          </label>
        </div>
      </div>

      {/* Install Command */}
      <div className="rounded-xl border border-border/50 bg-muted/20 px-4 py-3 flex items-center gap-3">
        <span className="text-xs text-muted-foreground font-medium shrink-0">
          Install:
        </span>
        <code className="text-xs font-mono text-foreground/80 flex-1 truncate">
          {installCmd}
        </code>
        <button
          onClick={handleCopyInstall}
          className="shrink-0 p-1.5 rounded-lg hover:bg-brand/10 text-muted-foreground hover:text-brand transition-colors"
          title="Copy install command"
        >
          <Copy className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Output */}
      <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border/50 bg-muted/20">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-brand" />
            <span className="text-sm font-medium font-mono">
              {opts.typescript ? "eslint.config.ts" : "eslint.config.js"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="gap-2 text-xs h-8"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </>
              )}
            </Button>
            <Button
              size="sm"
              onClick={handleDownload}
              className="gap-2 text-xs h-8 bg-gradient-to-r from-brand to-brand-accent text-white border-0 shadow-sm shadow-brand/20"
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </Button>
          </div>
        </div>

        {/* Code */}
        <pre className="p-5 text-xs font-mono leading-relaxed overflow-x-auto text-foreground/90 max-h-[480px] overflow-y-auto">
          <code>{config}</code>
        </pre>
      </div>
    </div>
  );
}
