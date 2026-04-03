# Workflow

Use this skill when an agent needs YApi context before generating code, tests, mocks, or request payloads.

## Default flow

1. Run `scripts/yapi_tool.py discover <keyword>` to narrow the candidate endpoints.
2. Pick one result and run `scripts/yapi_tool.py inspect <idOrPath> --project <projectId>`.
3. Run `scripts/yapi_tool.py types ...` only when the task needs TypeScript declarations.
4. Run `scripts/yapi_tool.py mock ...` only when the task needs sample response data.

## Selection rules

- Prefer `discover` over `list` unless the user explicitly asks for a full category dump.
- Prefer exact `projectId` whenever the user or repo context makes it obvious.
- Use `inspect --full` only when the compact field list is not enough.
- Rely on `defaultProjectId` for single-project commands and `defaultProjectIds` for multi-project commands when explicit project IDs are absent.
- If multiple projects match, keep the shortlist small and ask for disambiguation only after local narrowing fails.

## Output handling

- Keep only the fields needed for the task in final reasoning.
- Do not paste full large schemas when a few path/query/body/response fields are enough.
- When generating code, treat YApi as the source of truth for method, path, query params, body shape, and response shape.
