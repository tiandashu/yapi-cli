# Config

The repo resolves `yapi.config.json` by walking upward from the current working directory.

## Expected shape

```json
{
  "baseUrl": "https://your-yapi.example.com",
  "projects": [
    {
      "projectId": "1437",
      "projectName": "Example Project",
      "token": "your_project_token_here"
    },
    {
      "projectId": "test",
      "projectName": "Local Test",
      "token": "test",
      "baseUrl": "http://localhost:3000"
    }
  ],
  "activeProjectIds": ["1437"]
}
```

## Notes

- `baseUrl` at the top level is the default YApi server.
- A project-level `baseUrl` overrides the top-level value and allows multiple YApi hosts in one config.
- `activeProjectIds` lists which `projectId` values the CLI, MCP, and skill may use. Implicit defaults and explicit `--project` must reference ids in this list.
- When `activeProjectIds` has exactly one entry, single-project commands (`get`, `types`, `mock`, etc.) default to that project without `--project`.
- When it has more than one entry, single-project commands require `--project <projectId>`.
- Multi-project commands (`list`, `search`, `discover`) use all ids in `activeProjectIds` when `--project` is omitted.
