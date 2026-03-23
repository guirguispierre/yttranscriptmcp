import { YoutubeTranscript } from "youtube-transcript/dist/youtube-transcript.esm.js";
import type { TranscriptResponse } from "youtube-transcript";
import Innertube from "youtubei.js/cf-worker";

const YOUTUBE_VIDEO_ID_LENGTH = 11;
const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtu.be",
  "www.youtu.be",
  "youtube-nocookie.com",
  "www.youtube-nocookie.com",
]);

interface TranscriptSnippetSegment {
  type: string;
  snippet: {
    toString(): string;
  };
}

export class TranscriptUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TranscriptUnavailableError";
  }
}

export interface GetYoutubeTranscriptInput {
  youtube_url: string;
}

export async function getYoutubeTranscript({
  youtube_url,
}: GetYoutubeTranscriptInput): Promise<string> {
  const videoId = extractYouTubeVideoId(youtube_url);
  const primaryErrors: string[] = [];

  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId, {
      fetch: globalThis.fetch.bind(globalThis),
    });
    const cleanedTranscript = normalizeTranscriptText(
      transcript.map((segment: TranscriptResponse) => segment.text),
    );

    if (cleanedTranscript) {
      return cleanedTranscript;
    }

    primaryErrors.push("youtube-transcript returned an empty transcript.");
  } catch (error) {
    primaryErrors.push(formatTranscriptSourceError(error));
  }

  try {
    const innertube = await Innertube.create();
    const videoInfo = await innertube.getInfo(videoId);
    const transcriptInfo = await videoInfo.getTranscript();
    const segments = (transcriptInfo.transcript.content?.body?.initial_segments ??
      []) as TranscriptSnippetSegment[];

    const cleanedTranscript = normalizeTranscriptText(
      segments.filter(isTranscriptSegment).map((segment) => segment.snippet.toString()),
    );

    if (cleanedTranscript) {
      return cleanedTranscript;
    }

    throw new Error("youtubei.js returned an empty transcript.");
  } catch (error) {
    const fallbackError = formatTranscriptSourceError(error);

    throw new TranscriptUnavailableError(
      [
        `No transcript is available for this video (${videoId}).`,
        `Primary fetch failed: ${primaryErrors.join(" ")}`,
        `Fallback fetch failed: ${fallbackError}`,
      ].join(" "),
    );
  }
}

function extractYouTubeVideoId(youtubeUrl: string): string {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(youtubeUrl);
  } catch {
    throw new TranscriptUnavailableError(
      "youtube_url must be a valid YouTube video URL.",
    );
  }

  const hostname = parsedUrl.hostname.toLowerCase();

  if (!YOUTUBE_HOSTS.has(hostname) && !hostname.endsWith(".youtube.com")) {
    throw new TranscriptUnavailableError(
      "youtube_url must point to a YouTube video.",
    );
  }

  let candidateId: string | null = null;

  if (hostname === "youtu.be" || hostname === "www.youtu.be") {
    candidateId = parsedUrl.pathname.split("/").filter(Boolean)[0] ?? null;
  } else if (parsedUrl.searchParams.has("v")) {
    candidateId = parsedUrl.searchParams.get("v");
  } else {
    const pathSegments = parsedUrl.pathname.split("/").filter(Boolean);
    const playerRoute = pathSegments[0];

    if (
      playerRoute === "embed" ||
      playerRoute === "shorts" ||
      playerRoute === "live" ||
      playerRoute === "v"
    ) {
      candidateId = pathSegments[1] ?? null;
    }
  }

  if (!candidateId || !isValidYouTubeVideoId(candidateId)) {
    throw new TranscriptUnavailableError(
      "youtube_url must contain a valid YouTube video ID.",
    );
  }

  return candidateId;
}

function isValidYouTubeVideoId(value: string): boolean {
  return new RegExp(`^[A-Za-z0-9_-]{${YOUTUBE_VIDEO_ID_LENGTH}}$`).test(value);
}

function normalizeTranscriptText(chunks: string[]): string {
  return chunks
    .map((chunk) => chunk.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/([([{])\s+/g, "$1")
    .replace(/\s+([)\]}])/g, "$1")
    .trim();
}

function isTranscriptSegment(
  segment: TranscriptSnippetSegment,
): segment is TranscriptSnippetSegment {
  return segment.type === "TranscriptSegment";
}

function formatTranscriptSourceError(error: unknown): string {
  if (error instanceof Error) {
    const sanitizedMessage = error.message.replace(/\s+/g, " ").trim();

    if (sanitizedMessage.length > 0) {
      return sanitizedMessage;
    }
  }

  return "Unknown transcript provider error.";
}
