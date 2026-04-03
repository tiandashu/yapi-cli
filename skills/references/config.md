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
  "defaultProjectId": "1437",
  "defaultProjectIds": ["1437"]
}
```

## Notes

- `baseUrl` at the top level is the default YApi server.
- A project-level `baseUrl` overrides the top-level value and allows multiple YApi hosts in one config.
- `defaultProjectId` is the single-project default for commands like `inspect`, `types`, and `mock`.
- `defaultProjectIds` is the multi-project default for commands like `discover` and `list`.
- `discover` and `list` can work across multiple projects.
- `inspect`, `types`, and `mock` require a single project selection.
