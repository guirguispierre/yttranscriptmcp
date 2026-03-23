import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import * as z from "zod/v4";

import {
  TranscriptUnavailableError,
  getYoutubeTranscript,
} from "./tools/getYoutubeTranscript";

const MCP_PATH = "/mcp";
const HEALTH_PATH = "/";
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "Content-Type, MCP-Protocol-Version, Mcp-Session-Id, Last-Event-ID",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Expose-Headers": "MCP-Protocol-Version, Mcp-Session-Id",
};

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "OPTIONS" && url.pathname === MCP_PATH) {
      return new Response(null, {
        status: 204,
        headers: buildHeaders(),
      });
    }

    if (url.pathname === HEALTH_PATH && request.method === "GET") {
      return jsonResponse(200, {
        status: "ok",
        service: "youtube-transcript-mcp",
      });
    }

    if (url.pathname !== MCP_PATH) {
      return jsonResponse(404, {
        error: "Not Found",
        message: "The requested route does not exist.",
      });
    }

    if (request.method !== "POST") {
      return jsonResponse(
        405,
        {
          jsonrpc: "2.0",
          error: {
            code: -32000,
            message: "Method not allowed. Use POST for MCP requests.",
          },
          id: null,
        },
        {
          Allow: "POST, OPTIONS",
        },
      );
    }

    const server = createServer();
    const transport = new WebStandardStreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });

    try {
      await server.connect(transport);

      const response = await transport.handleRequest(request);

      return withHeaders(response, buildHeaders());
    } catch (error) {
      console.error("Failed to handle MCP request.", error);

      return jsonResponse(500, {
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: "Internal server error.",
        },
        id: null,
      });
    } finally {
      await transport.close();
      await server.close();
    }
  },
} satisfies ExportedHandler;

function createServer(): McpServer {
  const server = new McpServer({
    name: "youtube-transcript-mcp",
    version: "1.0.0",
  });

  server.registerTool(
    "get_youtube_transcript",
    {
      title: "Get YouTube Transcript",
      description:
        "Fetch the full plain-text transcript for a YouTube video URL.",
      inputSchema: {
        youtube_url: z
          .string()
          .url()
          .describe("A valid YouTube video URL."),
      },
    },
    async ({ youtube_url }): Promise<CallToolResult> => {
      try {
        const transcript = await getYoutubeTranscript({ youtube_url });

        return {
          content: [
            {
              type: "text",
              text: transcript,
            },
          ],
        };
      } catch (error) {
        const message =
          error instanceof TranscriptUnavailableError
            ? error.message
            : "Failed to fetch transcript.";

        return {
          content: [
            {
              type: "text",
              text: message,
            },
          ],
          isError: true,
        };
      }
    },
  );

  return server;
}
function jsonResponse(
  status: number,
  payload: unknown,
  extraHeaders?: HeadersInit,
): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: buildHeaders({
      "Content-Type": "application/json; charset=utf-8",
      ...extraHeaders,
    }),
  });
}

function buildHeaders(extraHeaders?: HeadersInit): Headers {
  const headers = new Headers({
    ...CORS_HEADERS,
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });

  if (extraHeaders) {
    new Headers(extraHeaders).forEach((value, key) => {
      headers.set(key, value);
    });
  }

  return headers;
}

function withHeaders(response: Response, extraHeaders: HeadersInit): Response {
  const headers = new Headers(response.headers);

  new Headers(extraHeaders).forEach((value, key) => {
    headers.set(key, value);
  });

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
