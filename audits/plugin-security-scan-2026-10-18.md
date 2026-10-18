## Security Scan - topographical-disorientation-support-skill - 2026-10-18

**SHA**: ec4a4e8 (v0.1.3 plus the second audit cycle) | **Installed**: not installed; scanned from a fresh clone of the public repository | **Last updated**: 2026-10-18
**Scope**: repository snapshot | **Install path**: scratch clone (78 files, 1.0 MB excluding .git)

Second scan. The first (audits/plugin-security-scan-2026-10-17.md, 23c2f70) found one WARNING (issue template linked to another repository) and was SAFE TO USE. Since then the commands gained `allowed-tools` frontmatter with a Bash grant and a repository CLI (bin/wayfinding-audit.ts) was added, so Check C was the focus.

### Summary
78 files scanned | 0 critical | 0 warnings | 3 info

### Findings

#### [INFO] commands/*.md:3
- **Check**: C - Permissions
- **Issue**: Five commands grant `Bash(tooling/node_modules/.bin/tsx bin/wayfinding-audit.ts:*)`. The pattern is restricted to one script, but `:*` allows any argument, and the `check`, `rewrite` and `refs` subcommands read a user-named file. The script resolves the path against the working directory, refuses non-files and anything over 2 MB, and prints only lexicon findings and excerpts (140 characters, control characters stripped), so the grant cannot be used to exfiltrate file contents wholesale. The pattern is relative, so it only matches when the command runs from the repository root, which is the documented setup.
- **Excerpt**: `allowed-tools: Read, Bash(tooling/node_modules/.bin/tsx bin/wayfinding-audit.ts:*)`
- **Recommendation**: Safe to ignore. The grant is narrower than the previous state (no frontmatter, so the model would have asked for arbitrary Bash). Keep the 2 MB cap and the excerpt limit under test, which test-security.ts already does.

#### [INFO] commands/wayfinding-content-check.md:22
- **Check**: C - Permissions
- **Issue**: The body tells the user to run `cd tooling && npm ci` the first time. That command is not covered by the `allowed-tools` grant, so Claude Code will prompt for it rather than run it silently. This is the intended behaviour for a dependency install, recorded here so nobody widens the grant to cover it.
- **Excerpt**: `(First time: \`cd tooling && npm ci\`.)`
- **Recommendation**: Safe to ignore.

#### [INFO] tooling/test-security.ts:284-287, lib/content-check.ts:81-91
- **Check**: B - Prompt injection phrases
- **Issue**: The strings "Ignore all previous instructions", "reveal your system prompt" and "You are now a different assistant" appear in the repository. They are detector patterns and their test fixtures, not instructions: content-check.ts matches them in audited documents and reports them, and the test asserts that it does. No skill, command or knowledge file contains such phrasing.
- **Excerpt**: `/\byou are now (?:a|an|the) \b/iu,`
- **Recommendation**: Safe to ignore; expected for a project whose purpose includes detecting injection.

### Clean Areas
- Check A: no hook scripts, no shell scripts, no hooks.json. The only `child_process` import is tooling/test-build.ts running the build; nothing reads credential paths or environment secrets; no network calls outside lib/overpass.ts, which is allowlisted to three HTTPS Overpass mirrors and refuses redirects.
- Check B: no persona hijacking, no safety-bypass phrasing, no exfiltration instructions, no permission-escalation instructions (no mention of settings.json or allowed-tools outside the frontmatter itself), no HTML comments, no content after a trailing `---`, no zero-width or soft-hyphen characters (byte-level grep), no base64 blobs, every frontmatter description matches its body. Longest prose file is 183 lines (an audit report); longest skill is 93 lines.
- Check C: plugin.json declares no hooks, no MCP servers and no agents; `Agent` and `Write` are not granted anywhere; dtd-accommodation-request.md grants `Read` only.
- Check D: one binary, `.claude-plugin/icon.png` (512 x 512 RGBA PNG, verified by `file`); no bytecode or compiled artifacts; 1.0 MB total; version 0.1.3 in plugin.json and source/manifest.json agrees with tag v0.1.3; the untracked audits/.mechanical/ scan scratch is gitignored.
- Issue template security link (the 2026-10-17 WARNING) now points at this repository's SECURITY.md.

### Verdict

**SAFE TO USE**

The new Bash grant is scoped to one repository script whose file reads are stat-checked, size-capped and excerpt-limited, and the only network access remains the allowlisted Overpass fetch inside that script. No prompt-injection content, hooks, hidden text or permission escalation was found.
