---
name: yapi-cli-skill
description: Inspect YApi-managed HTTP interfaces via the same `yapi` CLI used by the MCP adapter (shared `public-api` / service layer). Use when the agent needs to find an endpoint, confirm request or response fields, generate TypeScript types, or mock data in a repo that has `yapi.config.json`.
metadata:
  requires:
    bins: ["yapi"]
  cliHelp: "yapi --help"
---

# yapi-cli-skill

## Overview

Use the **`yapi` CLI** only — no separate skill binary, no Python wrapper. MCP tools (`yapi_search`, `yapi_get`, …) call the same TypeScript core as these commands. Run from a working directory where `yapi.config.json` can be resolved (walks upward from cwd).

**CLI entry:** `yapi …` if on PATH, otherwise `node /path/to/yapi-cli/dist/cli/index.js …`.

## Quick Start

From the workspace root that contains `yapi.config.json`:

- Search: `yapi search login --json` (or `node dist/cli/index.js search login --json`)
- Interface detail: `yapi get /user/login -p 1437 --json` (add `--full` for raw schemas)
- TypeScript: `yapi types /user/login -p 1437 --name Login --json`
- Mock: `yapi mock /user/login -p 1437 --json`
- List by category: `yapi list -p 1437 --json`

If `yapi` is not on PATH but this skill bundle is available locally, use:

- `node /path/to/yapi-cli/dist/cli/index.js search login --json`

After `npm run build`, the same instructions apply using **`dist/cli/index.js`** inside the yapi-cli package.

## Workflow

1. `yapi search <keyword> --json` to locate candidates.
2. `yapi get <idOrPath> -p <projectId> --json` for one interface.
3. `yapi types … --json` or `yapi mock … --json` only when needed.
4. Summarize outputs; avoid pasting huge JSON verbatim.

## Command Choice

- **`search --json`** — match list (title, path, method, project, category, …).
- **`get`** — method, path, query, body, response fields (`--full` for raw schemas).
- **`types --json`** — JSON envelope with generated `code` string.
- **`mock --json`** — JSON envelope with `mock` payload.
- **`list --json`** — category tree for an overview.

## Working Rules

- Prefer `projectId` over project name; config is keyed by `projectId`.
- Prefer **`yapi`** / **`node …/dist/cli/index.js`** so behavior matches MCP.
- Treat `yapi.config.json` as the source of truth for host and tokens (`activeProjectIds` whitelist).
- If multiple actives, single-project commands need `-p`.

## Layout

- **Source skill docs:** `skills/yapi-cli-skill/` (`SKILL.md`, `references/`).
- **After build:** the same files are copied to `dist/skills/yapi-cli-skill/` and zipped as `dist/yapi-skills.zip` for packaging.

## Installation

1. Install the CLI so `yapi` is on PATH.
2. Run `npm run build` in yapi-cli.
3. Install the skill by extracting `dist/yapi-skills.zip` into an agent skills directory such as `.agents/skills/yapi-cli-skill`, or run `npm run install:skills` from the yapi-cli repo root.
4. Enable Agent Skills in your client.
5. In a terminal whose cwd resolves to `yapi.config.json`, run `yapi search test --json`.
6. In agent chat, ask to use `yapi search --json` / `yapi get --json` against your config.

## References

- `references/workflow.md` — decision flow.
- `references/config.md` — `yapi.config.json` shape.
- `yapi --help` and `yapi <command> --help` for flags.
