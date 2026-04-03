# Workflow

Use this skill when an agent needs YApi context before generating code, tests, mocks, or request payloads.

## Default flow

1. Run `yapi search <keyword> --json` (or `node <yapi-cli>/dist/cli/index.js search <keyword> --json`) to narrow candidates.
2. Pick one result and run `yapi get <idOrPath> -p <projectId> --json` (add `--full` if compact fields are insufficient).
3. Run `yapi types <idOrPath> -p <projectId> --json` only when the task needs TypeScript declarations.
4. Run `yapi mock <idOrPath> -p <projectId> --json` only when the task needs sample response data.

## Selection rules

- Prefer `search --json` over `list --json` unless the user explicitly asks for a full category dump.
- Prefer exact `projectId` whenever the user or repo context makes it obvious.
- Use `get --full` only when the compact field list is not enough.
- Rely on `activeProjectIds`: one id means single-project commands default without `-p`; several ids mean multi-project commands use them all when `-p` is omitted, and single-project commands need an explicit `-p` from that list.
- If multiple projects match, keep the shortlist small and ask for disambiguation only after local narrowing fails.

## Output handling

- Keep only the fields needed for the task in final reasoning.
- Do not paste full large schemas when a few path/query/body/response fields are enough.
- When generating code, treat YApi as the source of truth for method, path, query params, body shape, and response shape.
