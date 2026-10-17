import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync, watch, copyFileSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..");

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ParameterProperty {
  type: string;
  description: string;
  default?: string | boolean;
  items?: { type: string };
}

interface CommandParameters {
  type: string;
  properties: Record<string, ParameterProperty>;
  required: string[];
}

interface Command {
  name: string;
  displayName: string;
  description: string;
  path: string;
  parameters: CommandParameters;
  keywords: string[];
}

interface Skill {
  name: string;
  displayName: string;
  description: string;
  path: string;
  keywords: string[];
}

interface Template {
  name: string;
  displayName: string;
  description: string;
  path: string;
}

interface Metadata {
  name: string;
  version: string;
  description: string;
  author: string;
  license: string;
  repository: string;
  keywords: string[];
}

interface Manifest {
  metadata: Metadata;
  skills: Skill[];
  commands: Command[];
  templates: Template[];
}

// ============================================================================
// SIMPLE YAML STRINGIFIER (no external deps)
// ============================================================================

function stringifyYaml(obj: unknown, indent: number = 2): string {
  function stringify(val: unknown, depth: number = 0): string {
    const spaces = " ".repeat(depth * indent);

    if (val === null || val === undefined) return "null";

    if (typeof val === "string") {
      if (val.includes("\n") || val.includes(":") || val.includes("#")) {
        return "'" + val.replace(/'/g, "''") + "'";
      }
      return val;
    }

    if (typeof val === "number" || typeof val === "boolean") return String(val);

    if (Array.isArray(val)) {
      if (val.length === 0) return "[]";
      const items: string[] = [];
      for (const item of val) {
        items.push("- " + stringify(item, depth + 1));
      }
      return items.join("\n" + spaces);
    }

    if (typeof val === "object") {
      const entries = Object.entries(val);
      if (entries.length === 0) return "{}";
      const items: string[] = [];
      for (const [key, value] of entries) {
        if (typeof value === "object" && value !== null) {
          items.push(key + ":");
          const nested = stringify(value, depth + 1);
          for (const line of nested.split("\n")) {
            items.push("  " + line);
          }
        } else {
          items.push(key + ": " + stringify(value, depth + 1));
        }
      }
      return items.join("\n" + spaces);
    }

    return String(val);
  }

  return stringify(obj);
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function ensureDir(dirPath: string): void {
  mkdirSync(dirPath, { recursive: true });
}

function readMarkdown(filePath: string): string {
  try {
    return readFileSync(filePath, "utf-8");
  } catch {
    console.warn("Warning: Could not read " + filePath);
    return "";
  }
}

function log(message: string): void {
  console.log("[build] " + message);
}

function logSuccess(message: string): void {
  console.log("\u2713 " + message);
}

function logError(message: string): void {
  console.error("\u2717 " + message);
}

// ============================================================================
// LOAD SOURCE FILES
// ============================================================================

function loadManifest(): Manifest {
  log("Loading manifest.json...");
  const manifestPath = resolve(ROOT, "source/manifest.json");
  const raw = JSON.parse(readFileSync(manifestPath, "utf-8"));
  logSuccess("Manifest loaded (" + raw.commands.length + " commands, " + raw.skills.length + " skills)");
  return raw as Manifest;
}

function loadSkillMarkdown(skillName: string): string {
  return readMarkdown(resolve(ROOT, "source/skills/" + skillName + ".md"));
}

function loadCommandMarkdown(commandName: string): string {
  return readMarkdown(resolve(ROOT, "source/commands/" + commandName + ".md"));
}

// ============================================================================
// CLAUDE PLUGIN GENERATION
// ============================================================================

function generateClaudePlugin(manifest: Manifest): void {
  log("Generating Claude Code plugin...");
  ensureDir(resolve(ROOT, "dist/claude-plugin"));
  ensureDir(resolve(ROOT, "dist/claude-plugin/skills"));
  ensureDir(resolve(ROOT, "dist/claude-plugin/commands"));

  const plugin = {
    name: manifest.metadata.name.toLowerCase().replace(/\s+/g, "-"),
    version: manifest.metadata.version,
    description: manifest.metadata.description,
    author: manifest.metadata.author,
    license: manifest.metadata.license,
    keywords: manifest.metadata.keywords,
    skills: manifest.skills.map((s) => ({
      name: s.name,
      description: s.description,
      path: "skills/" + s.name,
    })),
    commands: manifest.commands.map((c) => ({
      name: c.name,
      description: c.description,
      path: "commands/" + c.name + ".md",
    })),
  };

  writeFileSync(
    resolve(ROOT, "dist/claude-plugin/plugin.json"),
    JSON.stringify(plugin, null, 2)
  );

  // Copy skill files
  for (const skill of manifest.skills) {
    ensureDir(resolve(ROOT, "dist/claude-plugin/skills/" + skill.name));
    const content = loadSkillMarkdown(skill.name);
    writeFileSync(
      resolve(ROOT, "dist/claude-plugin/skills/" + skill.name + "/SKILL.md"),
      content
    );
  }

  // Copy command files
  for (const cmd of manifest.commands) {
    const content = loadCommandMarkdown(cmd.name);
    writeFileSync(
      resolve(ROOT, "dist/claude-plugin/commands/" + cmd.name + ".md"),
      content
    );
  }

  logSuccess("Claude plugin generated");
}

// ============================================================================
// OPENAI FUNCTION GENERATION
// ============================================================================

function generateOpenAIFunctions(manifest: Manifest): void {
  log("Generating OpenAI function schemas...");
  ensureDir(resolve(ROOT, "dist/openai"));

  const functions = manifest.commands.map((cmd) => {
    const properties: Record<string, unknown> = {};
    const required: string[] = cmd.parameters.required || [];

    for (const [paramName, paramDef] of Object.entries(cmd.parameters.properties)) {
      const prop: Record<string, unknown> = {
        type: paramDef.type === "array" ? "array" : paramDef.type,
        description: paramDef.description,
      };
      if (paramDef.items) prop.items = paramDef.items;
      if (paramDef.default !== undefined) prop.default = paramDef.default;
      properties[paramName] = prop;
    }

    return {
      type: "function",
      function: {
        name: cmd.name.replace(/-/g, "_"),
        description: cmd.description,
        parameters: {
          type: "object",
          properties,
          required,
        },
      },
    };
  });

  writeFileSync(
    resolve(ROOT, "dist/openai/functions.json"),
    JSON.stringify(functions, null, 2)
  );
  logSuccess("OpenAI functions generated");
}

// ============================================================================
// N8N NODE GENERATION
// ============================================================================

function generateN8nNode(manifest: Manifest): void {
  log("Generating n8n node definition...");
  ensureDir(resolve(ROOT, "dist/n8n"));

  const operations = manifest.commands.map((cmd) => ({
    name: cmd.displayName,
    value: cmd.name.replace(/-/g, "_"),
    description: cmd.description,
  }));

  const paramFields = manifest.commands.flatMap((cmd) =>
    Object.entries(cmd.parameters.properties).map(([paramName, paramDef]) => ({
      displayName: paramName.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      name: paramName,
      type: paramDef.type === "array" ? "string" : paramDef.type === "boolean" ? "boolean" : "string",
      required: (cmd.parameters.required || []).includes(paramName),
      default: paramDef.default || "",
      description: paramDef.description,
      displayOptions: {
        show: {
          operation: [cmd.name.replace(/-/g, "_")],
        },
      },
    }))
  );

  const node = {
    displayName: "Topographical Disorientation Support",
    name: "topographicalDisorientationSupport",
    icon: "file:wayfinding.svg",
    group: ["transform"],
    version: 1,
    description: manifest.metadata.description,
    defaults: { name: "Topographical Disorientation Support" },
    inputs: ["main"],
    outputs: ["main"],
    properties: [
      {
        displayName: "Operation",
        name: "operation",
        type: "options",
        options: operations,
        default: operations[0]?.value || "",
      },
      ...paramFields,
    ],
  };

  writeFileSync(
    resolve(ROOT, "dist/n8n/TopographicalDisorientationSupport.node.json"),
    JSON.stringify(node, null, 2)
  );
  logSuccess("n8n node definition generated");
}

// ============================================================================
// PROMPT LIBRARY GENERATION
// ============================================================================

function generatePromptLibrary(manifest: Manifest): void {
  log("Generating prompt library...");
  ensureDir(resolve(ROOT, "dist/prompts"));

  const promptIndex = {
    name: "Topographical Disorientation Support Prompts",
    version: manifest.metadata.version,
    description: manifest.metadata.description,
    author: manifest.metadata.author,
    prompts: manifest.commands.map((cmd) => ({
      id: cmd.name,
      name: cmd.displayName,
      description: cmd.description,
      file: cmd.name + ".yaml",
    })),
  };

  writeFileSync(
    resolve(ROOT, "dist/prompts/index.yaml"),
    stringifyYaml(promptIndex, 2)
  );

  for (const cmd of manifest.commands) {
    const prompt = {
      name: cmd.displayName,
      id: cmd.name,
      description: cmd.description,
      models: ["gpt-4", "gpt-4-turbo", "claude-3-opus", "claude-3-sonnet"],
      context: {
        role: "You are a spatial-cognition accessibility specialist supporting people with developmental topographical disorientation (DTD, also called atopia). You rewrite directional instructions into landmark form, enforce heading-up map rules, provide stress-mode fallbacks, and draft accommodation documents for US, French, and Spanish contexts, labelling the evidence grade of every recommendation.",
        expertise: [
          "Developmental topographical disorientation (DTD / atopia) phenotype and heritability",
          "Direction-word binding failure and left-right confusion",
          "Landmark-based route instruction design",
          "Map alignment effects and heading-up rendering",
          "Acute stress effects on spatial planning",
          "ADA Title I, MDPH/RQTH, and Ley 1/2013 accommodation framing by analogy",
          "Universal Design and cognitive prosthetics",
        ],
      },
      parameters: Object.entries(cmd.parameters.properties).map(([name, def]) => ({
        name,
        type: def.type,
        required: (cmd.parameters.required || []).includes(name),
        description: def.description,
        default: def.default,
      })),
      output: {
        format: "markdown",
        description: "Comprehensive " + cmd.displayName.toLowerCase() + " document",
      },
    };

    writeFileSync(
      resolve(ROOT, "dist/prompts/" + cmd.name + ".yaml"),
      stringifyYaml(prompt, 2)
    );
  }

  logSuccess("Prompt library generated");
}

// ============================================================================
// MCP SERVER GENERATION
// ============================================================================

function generateMcpServer(manifest: Manifest): void {
  log("Generating MCP server...");
  ensureDir(resolve(ROOT, "dist/mcp-server/src/tools"));
  ensureDir(resolve(ROOT, "dist/mcp-server/src/knowledge"));

  generateMcpTools(manifest);
  generateMcpKnowledgeLoader();
  generateMcpIndex(manifest);
  generateMcpPackageJson(manifest);
  generateMcpTsConfig();

  // Copy skill/command knowledge files
  ensureDir(resolve(ROOT, "dist/mcp-server/knowledge/skills"));
  ensureDir(resolve(ROOT, "dist/mcp-server/knowledge/commands"));

  for (const skill of manifest.skills) {
    const content = loadSkillMarkdown(skill.name);
    writeFileSync(
      resolve(ROOT, "dist/mcp-server/knowledge/skills/" + skill.name + ".md"),
      content
    );
  }

  for (const cmd of manifest.commands) {
    const content = loadCommandMarkdown(cmd.name);
    writeFileSync(
      resolve(ROOT, "dist/mcp-server/knowledge/commands/" + cmd.name + ".md"),
      content
    );
  }

  logSuccess("MCP server generated");
}

function generateMcpTools(manifest: Manifest): void {
  for (const cmd of manifest.commands) {
    const toolName = cmd.name.replace(/-/g, "_");
    const requiredParams = cmd.parameters.required || [];

    const zodFields: string[] = [];
    const jsonSchemaProps: string[] = [];

    for (const [paramName, paramDef] of Object.entries(cmd.parameters.properties)) {
      // Zod field
      let zField = "  " + paramName + ": z.";
      if (paramDef.type === "array") {
        zField += "array(z.string())";
      } else if (paramDef.type === "boolean") {
        zField += "boolean()";
      } else {
        zField += "string()";
      }
      if (!requiredParams.includes(paramName)) zField += ".optional()";
      zField += ",";
      zodFields.push(zField);

      // JSON Schema prop
      let jsProp = '      ' + paramName + ': { type: "' + paramDef.type + '"';
      jsProp += ', description: "' + paramDef.description.replace(/"/g, '\\"') + '"';
      jsProp += " }";
      jsonSchemaProps.push(jsProp);
    }

    const lines: string[] = [
      'import { z } from "zod";',
      'import { loadSkillContent } from "../knowledge/loader.js";',
      "",
      "export const " + toolName + "Schema = z.object({",
      ...zodFields,
      "});",
      "",
      "export const " + toolName + "Description = \"" + cmd.description.replace(/"/g, '\\"') + "\";",
      "",
      "export async function handle(input: z.infer<typeof " + toolName + "Schema>): Promise<string> {",
      "  const validated = " + toolName + "Schema.parse(input);",
      '  const skillContent = await loadSkillContent("' + cmd.name + '");',
      "",
      "  return JSON.stringify({",
      '    status: "success",',
      '    command: "' + cmd.name + '",',
      '    message: "Tool implementation pending. Knowledge loaded.",',
      "    skillPreview: skillContent.slice(0, 200),",
      "    input: validated,",
      "  }, null, 2);",
      "}",
    ];

    writeFileSync(
      resolve(ROOT, "dist/mcp-server/src/tools/" + toolName + ".ts"),
      lines.join("\n")
    );
  }
}

function generateMcpKnowledgeLoader(): void {
  const lines: string[] = [
    'import { readFileSync } from "fs";',
    'import { resolve, dirname } from "path";',
    'import { fileURLToPath } from "url";',
    "",
    "const __filename = fileURLToPath(import.meta.url);",
    "const __dirname = dirname(__filename);",
    "",
    "const CACHE = new Map<string, string>();",
    "",
    "export async function loadSkillContent(skillId: string): Promise<string> {",
    "  if (CACHE.has(skillId)) return CACHE.get(skillId)!;",
    "  try {",
    '    const p = resolve(__dirname, "../../knowledge/skills/" + skillId + ".md");',
    '    const content = readFileSync(p, "utf-8");',
    "    CACHE.set(skillId, content);",
    "    return content;",
    "  } catch {",
    '    return "";',
    "  }",
    "}",
    "",
    "export async function loadCommandContent(commandId: string): Promise<string> {",
    "  try {",
    '    return readFileSync(resolve(__dirname, "../../knowledge/commands/" + commandId + ".md"), "utf-8");',
    "  } catch {",
    '    return "";',
    "  }",
    "}",
  ];

  writeFileSync(
    resolve(ROOT, "dist/mcp-server/src/knowledge/loader.ts"),
    lines.join("\n")
  );
}

function generateMcpIndex(manifest: Manifest): void {
  const toolImports: string[] = [];
  const toolRegistrations: string[] = [];

  for (const cmd of manifest.commands) {
    const toolName = cmd.name.replace(/-/g, "_");
    toolImports.push(
      'import { ' + toolName + 'Schema, ' + toolName + 'Description, handle as handle_' + toolName + ' } from "./tools/' + toolName + '.js";'
    );
    toolRegistrations.push(
      '  server.tool("' + toolName + '", ' + toolName + 'Description, ' + toolName + 'Schema.shape, async (args) => {',
      '    const result = await handle_' + toolName + '(args as any);',
      '    return { content: [{ type: "text" as const, text: result }] };',
      '  });'
    );
  }

  const lines: string[] = [
    'import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";',
    'import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";',
    "",
    ...toolImports,
    "",
    "async function main(): Promise<void> {",
    "  const server = new McpServer({",
    '    name: "topographical-disorientation-support-mcp",',
    '    version: "' + manifest.metadata.version + '",',
    "  });",
    "",
    "  // Register tools",
    ...toolRegistrations,
    "",
    "  const transport = new StdioServerTransport();",
    "  await server.connect(transport);",
    '  console.error("Topographical Disorientation Support MCP Server running on stdio");',
    "}",
    "",
    "main().catch((error) => {",
    '  console.error("Fatal error:", error);',
    "  process.exit(1);",
    "});",
  ];

  writeFileSync(
    resolve(ROOT, "dist/mcp-server/src/index.ts"),
    lines.join("\n")
  );
}

function generateMcpPackageJson(manifest: Manifest): void {
  const pkg = {
    name: "@topographical-disorientation/support-mcp-server",
    version: manifest.metadata.version,
    description: manifest.metadata.description,
    author: manifest.metadata.author,
    license: manifest.metadata.license,
    type: "module",
    main: "src/index.ts",
    scripts: {
      start: "tsx src/index.ts",
      build: "tsc",
      "type-check": "tsc --noEmit",
    },
    dependencies: {
      "@modelcontextprotocol/sdk": "^1.6.0",
      zod: "^3.22.4",
    },
    devDependencies: {
      "@types/node": "^20.10.0",
      typescript: "^5.3.3",
      tsx: "^4.7.0",
    },
  };

  writeFileSync(
    resolve(ROOT, "dist/mcp-server/package.json"),
    JSON.stringify(pkg, null, 2)
  );
}

function generateMcpTsConfig(): void {
  const tsconfig = {
    compilerOptions: {
      target: "ES2020",
      module: "ESNext",
      lib: ["ES2020"],
      moduleResolution: "bundler",
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      resolveJsonModule: true,
      declaration: true,
      outDir: "./dist",
      rootDir: "./src",
    },
    include: ["src/**/*"],
    exclude: ["node_modules"],
  };

  writeFileSync(
    resolve(ROOT, "dist/mcp-server/tsconfig.json"),
    JSON.stringify(tsconfig, null, 2)
  );
}

// ============================================================================
// ============================================================================
// CLI AUDIT TOOL GENERATION (6th output format)
// ============================================================================

function copyDirRecursive(src: string, dest: string): void {
  ensureDir(dest);
  const entries = readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = resolve(src, entry.name);
    const destPath = resolve(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

function generateCliAudit(manifest: Manifest): void {
  const cliDir = resolve(ROOT, "dist/cli");
  const templateDir = resolve(__dirname, "cli-template");
  copyDirRecursive(templateDir, cliDir);

  const meta = manifest.metadata;
  const pkg = {
    name: "wayfinding-audit-cli",
    version: meta.version,
    description: "CLI tool for auditing directions, maps, and content for developmental topographical disorientation (DTD) accessibility",
    bin: { "wayfinding-audit": "./bin/audit.js" },
    main: "./src/index.js",
    scripts: { build: "tsc", start: "node bin/audit.js" },
    keywords: ["topographical-disorientation", "DTD", "wayfinding", "accessibility", "audit", "a11y", "cli"],
    author: meta.author, license: meta.license,
    dependencies: {},
    devDependencies: { typescript: "^5.4.0", "@types/node": "^20.0.0" },
  };
  writeFileSync(resolve(cliDir, "package.json"), JSON.stringify(pkg, null, 2));

  const tsconfig = {
    compilerOptions: { target: "ES2022", module: "commonjs", lib: ["ES2022"],
      outDir: ".", rootDir: ".", strict: true, esModuleInterop: true,
      skipLibCheck: true, resolveJsonModule: true, declaration: false },
    include: ["bin/**/*.ts", "src/**/*.ts"], exclude: ["node_modules"],
  };
  writeFileSync(resolve(cliDir, "tsconfig.json"), JSON.stringify(tsconfig, null, 2));

  // Bundle the deterministic library so the CLI has no runtime dependencies.
  copyDirRecursive(resolve(ROOT, "lib"), resolve(cliDir, "src/lib"));
  const knowledgeDir = resolve(cliDir, "knowledge");
  ensureDir(knowledgeDir);
  for (const skill of manifest.skills) {
    const srcFile = resolve(ROOT, "source/skills/" + skill.name + ".md");
    if (existsSync(srcFile)) copyFileSync(srcFile, resolve(knowledgeDir, skill.name + ".md"));
  }
  for (const cmd of manifest.commands) {
    const srcFile = resolve(ROOT, "source/commands/" + cmd.name + ".md");
    if (existsSync(srcFile)) copyFileSync(srcFile, resolve(knowledgeDir, cmd.name + ".md"));
  }

  logSuccess("CLI audit tool generated");
}

function parseRootFrontmatter(text: string): { fm: string | null; body: string } {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) return { fm: null, body: text };
  return { fm: m[1], body: m[2] };
}

function parseFmFields(fm: string): Record<string, string> {
  const out: Record<string, string> = {};
  let current: string | null = null;
  for (const line of fm.split(/\r?\n/)) {
    const kv = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (kv) {
      current = kv[1];
      out[current] = kv[2];
    } else if (current && /^\s+/.test(line)) {
      out[current] += "\n" + line;
    }
  }
  return out;
}

function renderFm(fields: Record<string, string>, order: string[]): string {
  const lines = ["---"];
  for (const k of order) {
    if (fields[k] !== undefined) lines.push(k + ": " + fields[k]);
  }
  lines.push("---");
  return lines.join("\n");
}

function syncRootCanonical(manifest: Manifest): void {
  for (const cmd of manifest.commands) {
    const srcPath = resolve(ROOT, "source/commands/" + cmd.name + ".md");
    const rootPath = resolve(ROOT, "commands/" + cmd.name + ".md");
    if (!existsSync(srcPath)) continue;
    const srcBody = readMarkdown(srcPath);
    const existing = existsSync(rootPath) ? readMarkdown(rootPath) : "";
    const { fm } = parseRootFrontmatter(existing);
    const fields = fm ? parseFmFields(fm) : {};
    fields.description = cmd.description;
    const order = ["description", "argument-hint", "allowed-tools"];
    const newFm = renderFm(fields, order);
    const newContent = newFm + "\n" + srcBody.replace(/^\n+/, "");
    writeFileSync(rootPath, newContent);
  }

  for (const skill of manifest.skills) {
    const srcPath = resolve(ROOT, "source/skills/" + skill.name + ".md");
    const rootPath = resolve(ROOT, "skills/" + skill.name + "/SKILL.md");
    if (!existsSync(srcPath)) continue;
    const srcBody = readMarkdown(srcPath);
    const existing = existsSync(rootPath) ? readMarkdown(rootPath) : "";
    const { fm } = parseRootFrontmatter(existing);
    const fields = fm ? parseFmFields(fm) : {};
    fields.name = skill.name;
    fields.description = skill.description;
    const order = ["name", "description"];
    const newFm = renderFm(fields, order);
    ensureDir(dirname(rootPath));
    const newContent = newFm + "\n" + srcBody.replace(/^\n+/, "");
    writeFileSync(rootPath, newContent);
  }

  logSuccess("Root canonical files synced from source");
}

// CLI ARGUMENT PARSING
// ============================================================================

interface CliOptions {
  format?: string;
  clean: boolean;
  validateOnly: boolean;
  watch: boolean;
  help: boolean;
}

function parseArgs(): CliOptions {
  const args = process.argv.slice(2);
  const opts: CliOptions = {
    clean: false,
    validateOnly: false,
    watch: false,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--format":
      case "-f":
        opts.format = args[++i];
        break;
      case "--clean":
        opts.clean = true;
        break;
      case "--validate-only":
      case "--validate":
        opts.validateOnly = true;
        break;
      case "--watch":
      case "-w":
        opts.watch = true;
        break;
      case "--help":
      case "-h":
        opts.help = true;
        break;
    }
  }
  return opts;
}

function printHelp(): void {
  console.log(`
Usage: tsx build.ts [options]

Options:
  --format, -f <name>   Build only one format:
                          claude-plugin, openai, n8n, prompts, mcp-server
  --clean               Delete dist/ before building
  --validate-only       Validate manifest without generating outputs
  --watch, -w           Watch source/ for changes and rebuild
  --help, -h            Show this help message

Examples:
  tsx build.ts                           # Build all formats
  tsx build.ts --format openai           # Build only OpenAI functions
  tsx build.ts --clean                   # Clean build
  tsx build.ts --validate-only           # Just validate manifest
  tsx build.ts --watch                   # Watch mode (rebuilds on change)
  tsx build.ts --clean -f mcp-server     # Clean + single format
`);
}

const VALID_FORMATS = [
  "claude-plugin",
  "openai",
  "n8n",
  "prompts",
  "mcp-server",
  "cli",
  "root-canonical",
] as const;

type BuildFormat = (typeof VALID_FORMATS)[number];

const generators: Record<BuildFormat, (m: Manifest) => void> = {
  "claude-plugin": generateClaudePlugin,
  openai: generateOpenAIFunctions,
  n8n: generateN8nNode,
  prompts: generatePromptLibrary,
  "mcp-server": generateMcpServer,
  cli: generateCliAudit,
  "root-canonical": syncRootCanonical,
};

function cleanDist(): void {
  const distPath = resolve(ROOT, "dist");
  if (existsSync(distPath)) {
    rmSync(distPath, { recursive: true, force: true });
    log("Cleaned dist/");
  }
}

function runBuild(opts: CliOptions): void {
  log("Starting build...");
  log("Output directory: " + resolve(ROOT, "dist"));

  const manifest = loadManifest();

  if (opts.validateOnly) {
    logSuccess("Manifest validated successfully!");
    log(
      "  " +
        manifest.commands.length +
        " commands, " +
        manifest.skills.length +
        " skills"
    );
    return;
  }

  if (opts.format) {
    if (!VALID_FORMATS.includes(opts.format as BuildFormat)) {
      logError("Unknown format: " + opts.format);
      log("Valid formats: " + VALID_FORMATS.join(", "));
      process.exit(1);
    }
    generators[opts.format as BuildFormat](manifest);
    log("");
    logSuccess("Built format: " + opts.format);
  } else {
    generateClaudePlugin(manifest);
    generateOpenAIFunctions(manifest);
    generateN8nNode(manifest);
    generatePromptLibrary(manifest);
    generateMcpServer(manifest);
    generateCliAudit(manifest);
    syncRootCanonical(manifest);

    log("");
    logSuccess("Build completed successfully!");
    log("Generated artifacts:");
    log("  - dist/claude-plugin/plugin.json + skills/ + commands/");
    log("  - dist/openai/functions.json");
    log("  - dist/n8n/TopographicalDisorientationSupport.node.json");
    log("  - dist/prompts/*.yaml");
    log("  - dist/mcp-server/ (full TypeScript MCP server)");
    log("  - dist/cli/ (standalone audit CLI tool)");
    log("  - commands/*.md, skills/*/SKILL.md (root canonical, synced from source)");
  }
}

function watchSource(): void {
  const sourceDir = resolve(ROOT, "source");
  log("Watching " + sourceDir + " for changes...");
  log("Press Ctrl+C to stop.\n");

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  watch(sourceDir, { recursive: true }, (_event, filename) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      log("\n--- Change detected: " + (filename || "unknown") + " ---");
      try {
        const opts = parseArgs();
        opts.watch = false; // prevent recursion
        runBuild(opts);
      } catch (err) {
        logError("Rebuild failed: " + (err instanceof Error ? err.message : String(err)));
      }
    }, 250);
  });
}

// ============================================================================
// MAIN BUILD
// ============================================================================

async function main(): Promise<void> {
  const opts = parseArgs();

  if (opts.help) {
    printHelp();
    return;
  }

  try {
    if (opts.clean) {
      cleanDist();
    }

    runBuild(opts);

    if (opts.watch) {
      watchSource();
    }
  } catch (error) {
    logError("Build failed!");
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Build failed:", err);
  process.exit(1);
});
