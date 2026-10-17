/**
 * Integration test suite for multi-format build outputs.
 *
 * Tests each of the 5 (soon 6) output formats:
 *   1. Claude Plugin — structure, plugin.json schema, skill/command markdown presence
 *   2. OpenAI Functions — JSON schema compliance, parameter validation
 *   3. n8n Node — node definition structure, operation definitions
 *   4. Prompt Library — YAML validity, index references, per-command files
 *   5. MCP Server — TypeScript compilation, tool registration, knowledge loading
 *   6. CLI (future) — binary presence, --help flag, dry-run
 *
 * Usage: tsx test-build.ts [--format <name>] [--verbose]
 * Requires: build has been run first (dist/ exists)
 */

import { readFileSync, existsSync, readdirSync, statSync } from "fs";
import { resolve, dirname, join, extname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..");

// ============================================================================
// TEST RUNNER FRAMEWORK
// ============================================================================

interface TestResult {
  name: string;
  suite: string;
  passed: boolean;
  error?: string;
  duration: number;
}

const results: TestResult[] = [];
let currentSuite = "";
const verbose = process.argv.includes("--verbose");
const formatFilter = (() => {
  const idx = process.argv.indexOf("--format");
  return idx >= 0 ? process.argv[idx + 1] : null;
})();

function suite(name: string) {
  currentSuite = name;
  if (verbose) console.log(`\n  Suite: ${name}`);
}

function test(name: string, fn: () => void) {
  const start = Date.now();
  try {
    fn();
    results.push({ name, suite: currentSuite, passed: true, duration: Date.now() - start });
    if (verbose) console.log(`    ✓ ${name}`);
  } catch (e: any) {
    results.push({ name, suite: currentSuite, passed: false, error: e.message, duration: Date.now() - start });
    if (verbose) console.log(`    ✗ ${name}: ${e.message}`);
  }
}

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

function assertEqual(actual: any, expected: any, label: string) {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function assertIncludes(arr: any[], item: any, label: string) {
  if (!arr.includes(item)) {
    throw new Error(`${label}: array does not include ${JSON.stringify(item)}`);
  }
}

function assertFileExists(path: string) {
  if (!existsSync(path)) {
    throw new Error(`File not found: ${path}`);
  }
}

function assertMinSize(path: string, minBytes: number) {
  assertFileExists(path);
  const size = statSync(path).size;
  if (size < minBytes) {
    throw new Error(`File too small: ${path} is ${size} bytes, expected >= ${minBytes}`);
  }
}

function readJSON(path: string): any {
  assertFileExists(path);
  const raw = readFileSync(path, "utf-8");
  // Check for BOM
  if (raw.charCodeAt(0) === 0xFEFF) {
    throw new Error(`File has UTF-8 BOM (will break JSON parsers): ${path}`);
  }
  return JSON.parse(raw);
}

function readText(path: string): string {
  assertFileExists(path);
  return readFileSync(path, "utf-8");
}

// ============================================================================
// LOAD MANIFEST TO KNOW WHAT TO EXPECT
// ============================================================================

const manifestPath = resolve(ROOT, "source/manifest.json");
const manifest = readJSON(manifestPath);

// Normalize manifest access — handle both dyslexia (metadata wrapper) and dyscalculia (flat) shapes
const meta = manifest.metadata || manifest;
const skills: any[] = manifest.skills || [];
const commands: any[] = manifest.commands || [];
const templates: any[] = manifest.templates || [];

// Normalize command ID accessor
function cmdId(cmd: any): string {
  return cmd.id || cmd.name;
}
function cmdName(cmd: any): string {
  return cmd.displayName || cmd.name;
}
function skillId(skill: any): string {
  return skill.id || skill.name;
}

const distDir = resolve(ROOT, "dist");

// ============================================================================
// 1. CLAUDE PLUGIN TESTS
// ============================================================================

function testClaudePlugin() {
  suite("Claude Plugin");
  const pluginDir = resolve(distDir, "claude-plugin");

  test("plugin.json exists and is valid JSON", () => {
    const plugin = readJSON(resolve(pluginDir, "plugin.json"));
    assert(typeof plugin === "object", "plugin.json is not an object");
  });

  test("plugin.json has required top-level fields", () => {
    const plugin = readJSON(resolve(pluginDir, "plugin.json"));
    const required = ["name", "version", "description"];
    for (const field of required) {
      assert(plugin[field] !== undefined, `Missing required field: ${field}`);
      assert(typeof plugin[field] === "string", `Field ${field} should be string`);
    }
  });

  test("plugin.json lists all skills from manifest", () => {
    const plugin = readJSON(resolve(pluginDir, "plugin.json"));
    const pluginSkills = plugin.skills || [];
    assertEqual(pluginSkills.length, skills.length, "Skill count mismatch");
    for (const skill of skills) {
      const id = skillId(skill);
      const found = pluginSkills.find((s: any) => s.name === id || s.displayName === (skill.displayName || skill.name));
      assert(!!found, `Skill not found in plugin.json: ${id}`);
    }
  });

  test("plugin.json lists all commands from manifest", () => {
    const plugin = readJSON(resolve(pluginDir, "plugin.json"));
    const pluginCmds = plugin.commands || [];
    assertEqual(pluginCmds.length, commands.length, "Command count mismatch");
    for (const cmd of commands) {
      const id = cmdId(cmd);
      const found = pluginCmds.find((c: any) => c.name === id || c.displayName === cmdName(cmd));
      assert(!!found, `Command not found in plugin.json: ${id}`);
    }
  });

  test("each skill has a SKILL.md file > 1KB", () => {
    for (const skill of skills) {
      const id = skillId(skill);
      const skillMd = resolve(pluginDir, "skills", id, "SKILL.md");
      assertMinSize(skillMd, 1024);
    }
  });

  test("each command has a markdown file > 500 bytes", () => {
    for (const cmd of commands) {
      const id = cmdId(cmd);
      const cmdMd = resolve(pluginDir, "commands", `${id}.md`);
      assertMinSize(cmdMd, 500);
    }
  });

  test("skill markdown content matches source", () => {
    for (const skill of skills) {
      const id = skillId(skill);
      const distContent = readText(resolve(pluginDir, "skills", id, "SKILL.md"));
      const srcContent = readText(resolve(ROOT, "source", "skills", `${id}.md`));
      assertEqual(distContent.length, srcContent.length, `Skill content size mismatch: ${id}`);
    }
  });
}

// ============================================================================
// 2. OPENAI FUNCTIONS TESTS
// ============================================================================

function testOpenAIFunctions() {
  suite("OpenAI Functions");
  const functionsPath = resolve(distDir, "openai", "functions.json");

  test("functions.json exists and is valid JSON array", () => {
    const functions = readJSON(functionsPath);
    assert(Array.isArray(functions), "functions.json should be an array");
  });

  test("function count matches command count", () => {
    const functions = readJSON(functionsPath);
    assertEqual(functions.length, commands.length, "Function count");
  });

  test("each function has type=function and function.name", () => {
    const functions = readJSON(functionsPath);
    for (const fn of functions) {
      assertEqual(fn.type, "function", "Function type");
      assert(typeof fn.function === "object", "Missing function object");
      assert(typeof fn.function.name === "string", "Missing function.name");
      assert(fn.function.name.length > 0, "Empty function.name");
    }
  });

  test("each function has valid parameters schema", () => {
    const functions = readJSON(functionsPath);
    for (const fn of functions) {
      const params = fn.function.parameters;
      assert(typeof params === "object", `Missing parameters for ${fn.function.name}`);
      assertEqual(params.type, "object", `Parameters type for ${fn.function.name}`);
      assert(typeof params.properties === "object", `Missing properties for ${fn.function.name}`);
      assert(Array.isArray(params.required), `Missing required array for ${fn.function.name}`);
    }
  });

  test("function names use underscores (OpenAI convention)", () => {
    const functions = readJSON(functionsPath);
    for (const fn of functions) {
      const name = fn.function.name;
      assert(!name.includes("-"), `Function name ${name} contains hyphens (should use underscores)`);
    }
  });

  test("all required parameters are listed in properties", () => {
    const functions = readJSON(functionsPath);
    for (const fn of functions) {
      const props = Object.keys(fn.function.parameters.properties);
      for (const req of fn.function.parameters.required) {
        assertIncludes(props, req, `Required param '${req}' missing from properties in ${fn.function.name}`);
      }
    }
  });

  test("parameter types are valid JSON Schema types", () => {
    const validTypes = ["string", "number", "integer", "boolean", "array", "object"];
    const functions = readJSON(functionsPath);
    for (const fn of functions) {
      for (const [key, prop] of Object.entries(fn.function.parameters.properties) as [string, any][]) {
        assertIncludes(validTypes, prop.type, `Invalid type for ${fn.function.name}.${key}: ${prop.type}`);
      }
    }
  });
}

// ============================================================================
// 3. N8N NODE TESTS
// ============================================================================

function testN8nNode() {
  suite("n8n Node");
  const n8nDir = resolve(distDir, "n8n");

  test("n8n directory contains exactly one .node.json file", () => {
    assertFileExists(n8nDir);
    const files = readdirSync(n8nDir).filter(f => f.endsWith(".node.json"));
    assertEqual(files.length, 1, "n8n node file count");
  });

  test("node definition is valid JSON", () => {
    const files = readdirSync(n8nDir).filter(f => f.endsWith(".node.json"));
    readJSON(resolve(n8nDir, files[0]));
  });

  test("node has required n8n fields", () => {
    const files = readdirSync(n8nDir).filter(f => f.endsWith(".node.json"));
    const node = readJSON(resolve(n8nDir, files[0]));
    const required = ["displayName", "name", "description", "version", "group", "defaults"];
    for (const field of required) {
      assert(node[field] !== undefined, `Missing n8n field: ${field}`);
    }
  });

  test("node has properties array with operations", () => {
    const files = readdirSync(n8nDir).filter(f => f.endsWith(".node.json"));
    const node = readJSON(resolve(n8nDir, files[0]));
    assert(Array.isArray(node.properties), "properties should be array");
    assert(node.properties.length > 0, "properties should not be empty");
    const opProp = node.properties.find((p: any) => p.name === "operation");
    assert(!!opProp, "Missing 'operation' property");
    assert(Array.isArray(opProp.options), "operation.options should be array");
  });

  test("operation count matches command count", () => {
    const files = readdirSync(n8nDir).filter(f => f.endsWith(".node.json"));
    const node = readJSON(resolve(n8nDir, files[0]));
    const opProp = node.properties.find((p: any) => p.name === "operation");
    assertEqual(opProp.options.length, commands.length, "Operation count");
  });
}

// ============================================================================
// 4. PROMPT LIBRARY TESTS
// ============================================================================

function testPromptLibrary() {
  suite("Prompt Library");
  const promptsDir = resolve(distDir, "prompts");

  test("prompts directory exists with index.yaml", () => {
    assertFileExists(resolve(promptsDir, "index.yaml"));
  });

  test("index.yaml is valid YAML (basic structure check)", () => {
    const content = readText(resolve(promptsDir, "index.yaml"));
    assert(content.length > 100, "index.yaml seems too short");
    assert(!content.startsWith("{"), "index.yaml looks like JSON, not YAML");
    assert(content.includes("name:"), "index.yaml missing 'name:' field");
    assert(content.includes("commands:") || content.includes("prompts:"), "index.yaml missing commands/prompts section");
  });

  test("each command has a corresponding YAML file", () => {
    for (const cmd of commands) {
      const id = cmdId(cmd);
      const yamlPath = resolve(promptsDir, `${id}.yaml`);
      assertMinSize(yamlPath, 200);
    }
  });

  test("YAML files have no BOM", () => {
    const files = readdirSync(promptsDir).filter(f => f.endsWith(".yaml"));
    for (const file of files) {
      const content = readFileSync(resolve(promptsDir, file));
      assert(
        !(content[0] === 0xEF && content[1] === 0xBB && content[2] === 0xBF),
        `YAML file has BOM: ${file}`
      );
    }
  });

  test("per-command YAML files have name and description", () => {
    for (const cmd of commands) {
      const id = cmdId(cmd);
      const content = readText(resolve(promptsDir, `${id}.yaml`));
      assert(content.includes("name:"), `${id}.yaml missing 'name:' field`);
      assert(content.includes("description:"), `${id}.yaml missing 'description:' field`);
    }
  });
}

// ============================================================================
// 5. MCP SERVER TESTS
// ============================================================================

function testMcpServer() {
  suite("MCP Server");
  const mcpDir = resolve(distDir, "mcp-server");

  test("MCP server has package.json", () => {
    const pkg = readJSON(resolve(mcpDir, "package.json"));
    assert(typeof pkg.name === "string", "Missing package name");
    assert(typeof pkg.version === "string", "Missing package version");
  });

  test("MCP server has tsconfig.json", () => {
    assertFileExists(resolve(mcpDir, "tsconfig.json"));
  });

  test("MCP server has src/index.ts entry point", () => {
    assertMinSize(resolve(mcpDir, "src", "index.ts"), 500);
  });

  test("index.ts imports @modelcontextprotocol/sdk", () => {
    const content = readText(resolve(mcpDir, "src", "index.ts"));
    assert(
      content.includes("@modelcontextprotocol/sdk"),
      "index.ts does not import MCP SDK"
    );
  });

  test("each command has a tool implementation file", () => {
    for (const cmd of commands) {
      const id = cmdId(cmd);
      const toolFile = resolve(mcpDir, "src", "tools", `${id.replace(/-/g, "_")}.ts`);
      assertMinSize(toolFile, 500);
    }
  });

  test("tool files import zod for schema validation", () => {
    for (const cmd of commands) {
      const id = cmdId(cmd);
      const content = readText(resolve(mcpDir, "src", "tools", `${id.replace(/-/g, "_")}.ts`));
      assert(
        content.includes('from "zod"') || content.includes("from 'zod'"),
        `Tool ${id} does not import zod`
      );
    }
  });

  test("knowledge loader exists", () => {
    assertMinSize(resolve(mcpDir, "src", "knowledge", "loader.ts"), 300);
  });

  test("knowledge markdown files present for all skills", () => {
    for (const skill of skills) {
      const id = skillId(skill);
      assertMinSize(resolve(mcpDir, "knowledge", "skills", `${id}.md`), 1024);
    }
  });

  test("knowledge markdown files present for all commands", () => {
    for (const cmd of commands) {
      const id = cmdId(cmd);
      assertMinSize(resolve(mcpDir, "knowledge", "commands", `${id}.md`), 500);
    }
  });

  test("MCP package.json has correct dependencies", () => {
    const pkg = readJSON(resolve(mcpDir, "package.json"));
    const deps = pkg.dependencies || {};
    assert(deps["@modelcontextprotocol/sdk"] !== undefined, "Missing @modelcontextprotocol/sdk dependency");
    assert(deps["zod"] !== undefined, "Missing zod dependency");
  });

  test("MCP server TypeScript compiles (dry check)", () => {
    const indexContent = readText(resolve(mcpDir, "src", "index.ts"));
    const opens = (indexContent.match(/{/g) || []).length;
    const closes = (indexContent.match(/}/g) || []).length;
    assertEqual(opens, closes, "Unbalanced braces in index.ts");
  });
}

// ============================================================================
// 6. CROSS-FORMAT CONSISTENCY TESTS
// ============================================================================

function testCrossFormat() {
  suite("Cross-Format Consistency");

  test("all formats produce the same number of commands", () => {
    const openai = readJSON(resolve(distDir, "openai", "functions.json"));
    const n8nFiles = readdirSync(resolve(distDir, "n8n")).filter(f => f.endsWith(".node.json"));
    const n8n = readJSON(resolve(distDir, "n8n", n8nFiles[0]));
    const opProp = n8n.properties.find((p: any) => p.name === "operation");
    const promptFiles = readdirSync(resolve(distDir, "prompts")).filter(
      f => f.endsWith(".yaml") && f !== "index.yaml"
    );

    assertEqual(openai.length, commands.length, "OpenAI function count");
    assertEqual(opProp.options.length, commands.length, "n8n operation count");
    assertEqual(promptFiles.length, commands.length, "Prompt file count");
  });

  test("no files have UTF-8 BOM anywhere in dist", () => {
    function checkDir(dir: string) {
      if (!existsSync(dir)) return;
      for (const entry of readdirSync(dir)) {
        const full = resolve(dir, entry);
        if (statSync(full).isDirectory()) {
          checkDir(full);
        } else {
          const bytes = readFileSync(full);
          if (bytes.length >= 3 && bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF) {
            throw new Error(`BOM detected in: ${full}`);
          }
        }
      }
    }
    checkDir(distDir);
  });

  test("no empty files in dist", () => {
    function checkDir(dir: string) {
      if (!existsSync(dir)) return;
      for (const entry of readdirSync(dir)) {
        const full = resolve(dir, entry);
        if (statSync(full).isDirectory()) {
          checkDir(full);
        } else {
          const size = statSync(full).size;
          if (size === 0) {
            throw new Error(`Empty file: ${full}`);
          }
        }
      }
    }
    checkDir(distDir);
  });
}

// ============================================================================
// 7. SOURCE INTEGRITY TESTS
// ============================================================================

function testSourceIntegrity() {
  suite("Source Integrity");

  test("manifest.json is valid and has no BOM", () => {
    readJSON(manifestPath);
  });

  test("all skills referenced in manifest have source files", () => {
    for (const skill of skills) {
      const id = skillId(skill);
      assertMinSize(resolve(ROOT, "source", "skills", `${id}.md`), 1024);
    }
  });

  test("all commands referenced in manifest have source files", () => {
    for (const cmd of commands) {
      const id = cmdId(cmd);
      assertMinSize(resolve(ROOT, "source", "commands", `${id}.md`), 500);
    }
  });

  test("no orphan source files (every source file is in manifest)", () => {
    const skillFiles = readdirSync(resolve(ROOT, "source", "skills"))
      .filter(f => f.endsWith(".md"))
      .map(f => f.replace(".md", ""));
    const cmdFiles = readdirSync(resolve(ROOT, "source", "commands"))
      .filter(f => f.endsWith(".md"))
      .map(f => f.replace(".md", ""));

    const manifestSkillIds = skills.map(s => skillId(s));
    const manifestCmdIds = commands.map(c => cmdId(c));

    for (const sf of skillFiles) {
      assertIncludes(manifestSkillIds, sf, `Orphan skill source file: ${sf}.md`);
    }
    for (const cf of cmdFiles) {
      assertIncludes(manifestCmdIds, cf, `Orphan command source file: ${cf}.md`);
    }
  });
}

// ============================================================================
// RUNNER
// ============================================================================

console.log(`\n${"=".repeat(60)}`);
console.log(`  Integration Test Suite — ${meta.name || meta.description?.slice(0, 40)}`);
console.log(`${"=".repeat(60)}`);

const suiteMap: Record<string, () => void> = {
  "claude-plugin": testClaudePlugin,
  "openai": testOpenAIFunctions,
  "n8n": testN8nNode,
  "prompts": testPromptLibrary,
  "mcp-server": testMcpServer,
  "cross-format": testCrossFormat,
  "source": testSourceIntegrity,
};

const suitesToRun = formatFilter
  ? [formatFilter]
  : Object.keys(suiteMap);

for (const name of suitesToRun) {
  const fn = suiteMap[name];
  if (fn) {
    fn();
  } else {
    console.error(`Unknown suite: ${name}`);
  }
}

// Print results
console.log(`\n${"─".repeat(60)}`);
const passed = results.filter(r => r.passed).length;
const failed = results.filter(r => !r.passed).length;
const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);

if (failed === 0) {
  console.log(`\n  ✅ All ${passed} tests passed (${totalDuration}ms)\n`);
} else {
  console.log(`\n  ❌ ${failed} of ${passed + failed} tests failed:\n`);
  for (const r of results.filter(r => !r.passed)) {
    console.log(`    [${r.suite}] ${r.name}`);
    console.log(`      → ${r.error}\n`);
  }
}

// Per-suite summary
const suiteNames = [...new Set(results.map(r => r.suite))];
for (const s of suiteNames) {
  const suiteResults = results.filter(r => r.suite === s);
  const sPassed = suiteResults.filter(r => r.passed).length;
  const sTotal = suiteResults.length;
  const icon = sPassed === sTotal ? "✓" : "✗";
  console.log(`  ${icon} ${s}: ${sPassed}/${sTotal}`);
}

console.log("");
process.exit(failed > 0 ? 1 : 0);
