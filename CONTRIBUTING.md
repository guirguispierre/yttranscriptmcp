# Contributing

## Development

```bash
npm install
npm run typecheck
npm run dev
```

## Guidelines

- keep the MCP surface small and explicit
- preserve Cloudflare Workers compatibility
- prefer plain text transcript output with no timestamps
- keep error messages clear for MCP clients

## Pull requests

- keep changes scoped
- include a short explanation of behavior changes
- run `npm run typecheck` before opening the PR
