# Tasks Done

---

## [slice-001] — Initialize package.json
**Epic:** E1 | **Size:** XS | **Depends on:** none
**Completed:** 2026-03-23
**Files changed:** `package.json`
**Self-validated:** PASS

**User Story**
As a developer, I want a valid `package.json` so that the package can be published to npm and invoked via `npx timectx install`.

**Acceptance Criteria**
- [x] `name` is `timectx`, `version` is `0.1.0`, `license` is `MIT`
- [x] `bin` entry maps `timectx` to `./bin/install.js`
- [x] `engines` field specifies `"node": ">=16"`
- [x] `main` is not set (this is a CLI-only package)
- [x] `files` field includes `["bin"]` to keep the published package lean
- [x] `npm pack --dry-run` lists only `bin/install.js` and `package.json`

---

## [slice-002] — Create bin/install.js entry file (stub)
**Epic:** E1 | **Size:** XS | **Depends on:** slice-001
**Completed:** 2026-03-23
**Files changed:** `bin/install.js`
**Self-validated:** PASS

**User Story**
As a developer, I want a working `bin/install.js` stub so that `node bin/install.js` runs without crashing before core logic is added.

**Acceptance Criteria**
- [x] File exists at `bin/install.js`
- [x] First line is `#!/usr/bin/env node`
- [x] File is executable (`chmod +x` or confirmed executable bit set)
- [x] Running `node bin/install.js` prints `timectx — running install...` and exits 0
- [x] No TypeScript, no imports from node_modules

---

## [slice-003] — Detect Claude Desktop config path by OS
**Epic:** E2 | **Size:** S | **Depends on:** slice-002
**Completed:** 2026-03-23
**Files changed:** `src/detect-config-path.js`
**Self-validated:** PASS

**User Story**
As a user on any supported OS, I want the tool to automatically find my Claude Desktop config file so I don't have to provide a path manually.

**Acceptance Criteria**
- [x] Module lives at `src/detect-config-path.js` and exports a single function `detectConfigPath()`
- [x] Returns the correct absolute path for macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- [x] Returns the correct absolute path for Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- [x] Returns the correct absolute path for Linux: `~/.config/Claude/claude_desktop_config.json`
- [x] Uses `os.homedir()` and `process.env` — no hardcoded usernames
- [x] If the OS is not recognised, throws an `Error` with message `Unsupported OS: <platform>`
- [x] Unit-testable: accepts an optional `platform` parameter (defaults to `process.platform`) so tests can pass `'darwin'`, `'win32'`, `'linux'`

---

## [slice-004] — Read and parse the Claude Desktop config
**Epic:** E3 | **Size:** S | **Depends on:** slice-003
**Completed:** 2026-03-23
**Files changed:** `src/read-config.js`
**Self-validated:** PASS

**User Story**
As the CLI, I want to read and parse the Claude Desktop config JSON so I can inspect and modify it.

**Acceptance Criteria**
- [x] Module lives at `src/read-config.js` and exports `readConfig(filePath)`
- [x] Returns the parsed JSON object if the file exists and is valid JSON
- [x] If the file does not exist, returns `null` (not an error — first-time install)
- [x] If the file exists but contains invalid JSON, throws an `Error` with message `Config file is not valid JSON: <filePath>`
- [x] Uses `fs.readFileSync` — no async needed at this scale
- [x] No mutation of the returned object

---

## [slice-005] — Inject or update currentDate in config
**Epic:** E3 | **Size:** S | **Depends on:** slice-004
**Completed:** 2026-03-23
**Files changed:** `src/patch-config.js`
**Self-validated:** PASS

**User Story**
As a user, I want the tool to inject a `currentDate` system prompt entry into my Claude config so Claude always knows today's date, and I want re-running the tool to update the date rather than duplicate the entry.

**Acceptance Criteria**
- [x] Module lives at `src/patch-config.js` and exports two functions: `patchConfig(config)` and `writeConfig(filePath, config)`
- [x] `patchConfig(config)` accepts a parsed config object (or `null` for first install) and returns a new object with the `currentDate` entry injected
- [x] The injected value is a string in the format `Today's date is YYYY-MM-DD.` using the real current date at time of execution
- [x] If a `currentDate` key already exists anywhere in the config, it is updated in place (not duplicated)
- [x] The function does not mutate the input object — returns a new object
- [x] `writeConfig(filePath, config)` writes the patched config as pretty-printed JSON (2-space indent) using an atomic write pattern: write to `<filePath>.tmp` first, then `fs.renameSync` to final path
- [x] `writeConfig` creates parent directories if they do not exist (`fs.mkdirSync` with `recursive: true`)
- [x] Returns `{ status: 'injected' }` for a first install, `{ status: 'updated' }` if a prior value was replaced, `{ status: 'unchanged' }` if the existing value already matches today's date

---

## [slice-006] — Wire CLI entry point with clear output
**Epic:** E4 | **Size:** S | **Depends on:** slice-003, slice-004, slice-005
**Completed:** 2026-03-23
**Files changed:** `bin/install.js`
**Self-validated:** PASS

**User Story**
As a user running `npx timectx install`, I want to see clear, helpful output telling me what happened so I know the tool worked or why it failed.

**Acceptance Criteria**
- [x] `bin/install.js` imports and calls `detectConfigPath`, `readConfig`, `patchConfig`, and `writeConfig` in sequence
- [x] Prints `timectx — injecting currentDate into Claude config...` at start
- [x] On `status: 'injected'`: prints `Done. currentDate injected into <path>` and exits 0
- [x] On `status: 'updated'`: prints `Done. currentDate updated in <path>` and exits 0
- [x] On `status: 'unchanged'`: prints `Already up to date. No changes made to <path>` and exits 0
- [x] On any thrown error: prints `Error: <message>` to stderr and exits 1
- [x] No stack traces printed to the user — clean one-liner error messages only
- [x] Manual end-to-end test: run `node bin/install.js` on the dev machine, confirm Claude Desktop config is patched correctly
