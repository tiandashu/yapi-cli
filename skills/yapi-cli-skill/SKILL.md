---
name: yapi-cli-skill
description: Inspect YApi-managed HTTP interfaces through the local `yapi` and `yapi-skill` CLI wrappers. Use when Codex needs to find an endpoint, confirm request or response fields, generate TypeScript types, or generate mock data before writing frontend code, backend integrations, tests, API clients, or docs in a repo that contains `yapi.config.json`.
---

# yapi-cli-skill

## Overview

Use the repo's CLI-first YApi toolkit instead of browsing raw YApi pages or MCP output. Start from the smallest command that can answer the question, keep responses compact, and escalate to full schemas only when needed.

## Quick Start

From the **yapi-cli** repo root (or set `YAPI_CLI_ROOT` to that path when the skill lives elsewhere):

- Discover: `python3 skills/yapi-cli-skill/scripts/yapi_tool.py discover login`
- Inspect: `python3 skills/yapi-cli-skill/scripts/yapi_tool.py inspect /user/login --project 1437`
- Types: `python3 skills/yapi-cli-skill/scripts/yapi_tool.py types /user/login --project 1437 --name Login`
- Mock: `python3 skills/yapi-cli-skill/scripts/yapi_tool.py mock /user/login --project 1437`
- List: `python3 skills/yapi-cli-skill/scripts/yapi_tool.py list --project 1437`

If the skill is installed under `.cursor/skills/yapi-cli-skill/`, use `python3 .cursor/skills/yapi-cli-skill/scripts/yapi_tool.py ...` from the **workspace root** that contains `yapi.config.json`. When the skill files are copied into another repo, set `YAPI_CLI_ROOT` to the absolute path of the **yapi-cli** checkout so the wrapper can find `dist/skills/yapi-cli-skill/index.js` (after `npm run build` there).

Optional: `YAPI_CONFIG_CWD` overrides the directory used to resolve `yapi.config.json` (defaults to the shell/agent current working directory).

## Workflow

1. Locate the endpoint with `discover`.
2. Inspect the best match with `inspect`.
3. Generate `types` or `mock` only if the task needs them.
4. Keep only task-relevant fields in your reasoning and output.

## Command Choice

- Use `discover` for fuzzy lookup by keyword or path fragment.
- Use `inspect` for one interface's method, path, query, body, and response.
- Use `inspect --full` only when compact fields are insufficient.
- Use `types` when the task is code generation or refactoring around request and response types.
- Use `mock` when the task needs test data, fixtures, or UI scaffolding.
- Use `list` only when the user wants a project or category overview.

## Working Rules

- Prefer `projectId` over project name; the config is keyed by `projectId`.
- Prefer the skill wrapper script over ad hoc long commands so path resolution stays stable.
- If `dist/` exists, the wrapper uses compiled JS. Otherwise it falls back to `ts-node`.
- Treat `yapi.config.json` as the source of truth for which YApi host and token to use.
- If the repo has multiple matching projects, narrow locally before asking the user.
- If the command output is large, summarize it instead of pasting it verbatim.

## Testing in Cursor

1. **Install the skill** so Cursor can load it:
   - **Project-only (recommended for this repo):**
     `mkdir -p .cursor/skills && ln -sf "$(pwd)/skills/yapi-cli-skill" .cursor/skills/yapi-cli-skill`
     (from the yapi-cli repo root; adjust if you prefer a copy instead of a symlink.)
   - **Personal:** copy or symlink the `skills/yapi-cli-skill` folder to `~/.cursor/skills/yapi-cli-skill` (that directory must contain `SKILL.md` and `scripts/yapi_tool.py`).
2. **Enable Agent Skills** in Cursor Settings (wording may be “Skills” / “Agent” — ensure project skills from `.cursor/skills` are allowed).
3. **Open a folder** that has a valid `yapi.config.json` (here: yapi-cli root, or your app repo).
4. **Build once:** in the yapi-cli checkout run `npm run build` so `dist/skills/yapi-cli-skill/index.js` exists.
5. **Manual smoke test** in the integrated terminal (cwd = workspace with config):
   `python3 skills/yapi-cli-skill/scripts/yapi_tool.py discover test`
   or, if using the symlinked path:
   `python3 .cursor/skills/yapi-cli-skill/scripts/yapi_tool.py discover test`
6. **Agent test:** start a chat with Agent mode and ask something that should trigger this skill, e.g. “根据 yapi.config.json 用 discover 搜一下登录相关接口，再 inspect 最相关的一条”。Confirm the agent runs the wrapper (or `yapi-skill` / `node dist/skills/yapi-cli-skill/index.js`) and summarizes JSON instead of guessing APIs.

## References

- Read `references/workflow.md` when you need the fuller decision rules.
- Read `references/config.md` when you need to confirm config shape or multi-host behavior.
- Run `skills/yapi-cli-skill/scripts/yapi_tool.py --help` to inspect wrapper usage instead of guessing flags.
