# yttranscriptmcp

Public MCP server for fetching full plain-text YouTube transcripts with Cloudflare Workers.

## What it does

This server exposes one MCP tool:

- `get_youtube_transcript`
  - Input: `youtube_url` (`string`)
  - Output: the full transcript as a single readable plain-text string

Behavior:

- validates the incoming YouTube URL
- fetches transcript data with `youtube-transcript`
- falls back to `youtubei.js` when needed
- strips timestamps and returns clean text only
- returns a clear tool error when a transcript is unavailable

## Tech stack

- TypeScript
- Cloudflare Workers
- Wrangler
- `@modelcontextprotocol/sdk`
- `youtube-transcript`
- `youtubei.js`

## Public endpoint

This Worker is intentionally public. No bearer token is required.

If you deploy it publicly, expect that:

- anyone can call the MCP endpoint
- abuse protection is your responsibility
- you may want Cloudflare rate limiting or Cloudflare Access later if traffic becomes abusive

## Project structure

```text
src/
  index.ts
  tools/
    getYoutubeTranscript.ts
  types/
    youtube-transcript-esm.d.ts
wrangler.toml
tsconfig.json
```

## Local development

```bash
npm install
npm run dev
```

The Worker runs locally through Wrangler.

## Typecheck

```bash
npm run typecheck
```

## Deploy

```bash
npm run deploy
```

## MCP endpoint

After deployment, the MCP endpoint is:

```text
https://<your-worker>.workers.dev/mcp
```

## Example initialize request

```bash
curl -X POST "https://<your-worker>.workers.dev/mcp" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "MCP-Protocol-Version: 2025-11-25" \
  --data '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {
      "protocolVersion": "2025-11-25",
      "capabilities": {},
      "clientInfo": {
        "name": "example-client",
        "version": "1.0.0"
      }
    }
  }'
```

## Example tool call

```bash
curl -X POST "https://<your-worker>.workers.dev/mcp" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "MCP-Protocol-Version: 2025-11-25" \
  --data '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/call",
    "params": {
      "name": "get_youtube_transcript",
      "arguments": {
        "youtube_url": "https://www.youtube.com/watch?v=jNQXAC9IVRw"
      }
    }
  }'
```

## Open source

This repository is prepared for public/open-source use with:

- MIT license
- contributor guide
- CI typecheck workflow
- public-facing README

## License

MIT
