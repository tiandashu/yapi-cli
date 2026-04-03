---
name: yapi-api
description: Inspect YApi-managed HTTP interfaces through the local `yapi` and `yapi-skill` CLI wrappers. Use when Codex needs to find an endpoint, confirm request or response fields, generate TypeScript types, or generate mock data before writing frontend code, backend integrations, tests, API clients, or docs in a repo that contains `yapi.config.json`.
---

# Yapi Api

## Overview

Use the repo's CLI-first YApi toolkit instead of browsing raw YApi pages or MCP output. Start from the smallest command that can answer the question, keep responses compact, and escalate to full schemas only when needed.

## Quick Start

- Discover likely endpoints:
  `python3 skills/yapi-api/scripts/yapi_tool.py discover login`
- Inspect one endpoint:
  `python3 skills/yapi-api/scripts/yapi_tool.py inspect /user/login --project 1437`
- Generate types:
  `python3 skills/yapi-api/scripts/yapi_tool.py types /user/login --project 1437 --name Login`
- Generate mock data:
  `python3 skills/yapi-api/scripts/yapi_tool.py mock /user/login --project 1437`

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

## References

- Read `references/workflow.md` when you need the fuller decision rules.
- Read `references/config.md` when you need to confirm config shape or multi-host behavior.
- Run `scripts/yapi_tool.py --help` to inspect wrapper usage instead of guessing flags.
