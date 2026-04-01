"use client";

import { useState } from "react";

const EXAMPLE_CHANNEL = "UCsBjURrPoezykLs9EqgamOA";
const EXAMPLE_PLAYLIST = "PLbpi6ZahtOH6Ar_3GPy3workJYXByaLq";

// ── primitives ────────────────────────────────────────────────────────────────

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold ${color}`}>
      {children}
    </span>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-neutral-800 px-1.5 py-0.5 font-mono text-xs text-emerald-400">
      {children}
    </code>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 rounded bg-neutral-800 px-2.5 py-1 text-xs text-neutral-400 transition hover:bg-neutral-700 hover:text-white"
    >
      {copied ? (
        <>
          <svg className="h-3.5 w-3.5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-emerald-400">Copied</span>
        </>
      ) : (
        <>
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" strokeLinecap="round" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

// ── schema tables ─────────────────────────────────────────────────────────────

interface FieldDef { type: string; desc: string; example?: string }

function SchemaTable({ fields }: { fields: Record<string, FieldDef> }) {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-700 bg-neutral-900 text-xs uppercase tracking-wider text-neutral-500">
            <th className="px-4 py-3 text-left font-medium w-52">Field</th>
            <th className="px-4 py-3 text-left font-medium w-36">Type</th>
            <th className="px-4 py-3 text-left font-medium">Description</th>
            <th className="px-4 py-3 text-left font-medium">Example</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800 bg-neutral-950">
          {Object.entries(fields).map(([field, def]) => (
            <tr key={field}>
              <td className="px-4 py-2.5"><Code>{field}</Code></td>
              <td className="px-4 py-2.5 font-mono text-xs text-purple-300">{def.type}</td>
              <td className="px-4 py-2.5 text-xs text-neutral-400">{def.desc}</td>
              <td className="px-4 py-2.5 text-xs text-neutral-500 font-mono">{def.example ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── data ──────────────────────────────────────────────────────────────────────

const SHARED_VIDEO_FIELDS: Record<string, FieldDef> = {
  "videos[].id":              { type: "string",           desc: "YouTube video ID",                       example: "dQw4w9WgXcQ" },
  "videos[].title":           { type: "string",           desc: "Video title" },
  "videos[].url":             { type: "string (uri)",     desc: "YouTube watch page URL" },
  "videos[].published":       { type: "string (date-time)", desc: "Publish date (ISO 8601)" },
  "videos[].updated":         { type: "string (date-time)", desc: "Last updated date (ISO 8601)" },
  "videos[].thumbnail":       { type: "string | null",    desc: "Thumbnail URL (hqdefault)" },
  "videos[].description":     { type: "string | null",    desc: "Video description (may be truncated)" },
  "videos[].views":           { type: "integer | null",   desc: "View count; null if unavailable in feed" },
  "videos[].rating.count":    { type: "integer | null",   desc: "Number of ratings" },
  "videos[].rating.average":  { type: "number | null",    desc: "Avg star rating (1–5 scale)" },
};

const CHANNEL_RESPONSE_FIELDS: Record<string, FieldDef> = {
  "channel.id":        { type: "string",           desc: "YouTube channel ID",         example: "UCsBjURrPoezykLs9EqgamOA" },
  "channel.title":     { type: "string",           desc: "Channel display name",        example: "Fireship" },
  "channel.url":       { type: "string (uri)",     desc: "URL to the YouTube channel page" },
  "channel.published": { type: "string (date-time)", desc: "Channel creation date (ISO 8601)" },
  "videoCount":        { type: "integer",          desc: "Number of videos returned (RSS cap: 15)", example: "15" },
  ...SHARED_VIDEO_FIELDS,
};

const PLAYLIST_RESPONSE_FIELDS: Record<string, FieldDef> = {
  "playlist.id":             { type: "string",       desc: "Playlist ID",                               example: "PLbpi6ZahtOH6Ar_3GPy3workJYXByaLq" },
  "playlist.title":          { type: "string",       desc: "Playlist display name",                     example: "JavaScript Tutorials" },
  "playlist.url":            { type: "string (uri)", desc: "URL to the YouTube playlist page" },
  "playlist.author.name":    { type: "string | null", desc: "Channel name that owns the playlist",      example: "Fireship" },
  "playlist.author.channelId": { type: "string | null", desc: "Channel ID that owns the playlist",     example: "UCsBjURrPoezykLs9EqgamOA" },
  "playlist.author.url":     { type: "string | null", desc: "Channel URL" },
  "videoCount":              { type: "integer",      desc: "Number of videos returned (RSS cap: 15)",   example: "15" },
  ...SHARED_VIDEO_FIELDS,
};

const CHANNEL_ERROR_RESPONSES = [
  { status: "400", color: "bg-yellow-900/60 text-yellow-300", title: "Bad request", examples: [
    { label: "Missing param",  body: `{ "error": "Missing required query parameter: channelId" }` },
    { label: "Invalid format", body: `{ "error": "Invalid channelId format" }` },
  ]},
  { status: "404", color: "bg-orange-900/60 text-orange-300", title: "Not found", examples: [
    { label: "Unknown channel", body: `{ "error": "Channel not found: UCsBjURrPoezykLs9EqgamOA" }` },
  ]},
  { status: "502", color: "bg-red-900/60 text-red-300", title: "Upstream error", examples: [
    { label: "YouTube unavailable", body: `{ "error": "Failed to fetch feed (upstream 503)" }` },
  ]},
];

const PLAYLIST_ERROR_RESPONSES = [
  { status: "400", color: "bg-yellow-900/60 text-yellow-300", title: "Bad request", examples: [
    { label: "Missing param",  body: `{ "error": "Missing required query parameter: playlistId" }` },
    { label: "Invalid format", body: `{ "error": "Invalid playlistId format" }` },
  ]},
  { status: "404", color: "bg-orange-900/60 text-orange-300", title: "Not found", examples: [
    { label: "Unknown playlist", body: `{ "error": "Playlist not found: PLbpi6ZahtOH6Ar_3GPy3workJYXByaLq" }` },
  ]},
  { status: "502", color: "bg-red-900/60 text-red-300", title: "Upstream error", examples: [
    { label: "YouTube unavailable", body: `{ "error": "Failed to fetch feed (upstream 503)" }` },
  ]},
];

const TS_TYPES = `// shared
interface Rating {
  count:   number;
  average: number;
}

interface Video {
  id:          string;
  title:       string;
  url:         string;
  published:   string;        // ISO 8601
  updated:     string;        // ISO 8601
  thumbnail:   string | null;
  description: string | null;
  views:       number | null;
  rating:      Rating | null;
}

// GET /api/channel?channelId=UC…
interface Channel {
  id:        string;
  title:     string;
  url:       string;
  published: string;          // ISO 8601
}

interface ChannelFeedResponse {
  channel:    Channel;
  videoCount: number;
  videos:     Video[];
}

// GET /api/playlist?playlistId=PL…
interface PlaylistAuthor {
  name:      string | null;
  channelId: string | null;
  url:       string | null;
}

interface Playlist {
  id:     string;
  title:  string;
  url:    string;
  author: PlaylistAuthor;
}

interface PlaylistFeedResponse {
  playlist:   Playlist;
  videoCount: number;
  videos:     Video[];
}

// error shape (4xx / 5xx)
interface ErrorResponse {
  error: string;
}`;

// ── endpoint block ────────────────────────────────────────────────────────────

function ErrorBlock({ errors }: { errors: typeof CHANNEL_ERROR_RESPONSES }) {
  return (
    <div className="flex flex-col gap-3">
      {errors.map((err) => (
        <div key={err.status} className="overflow-hidden rounded-xl border border-neutral-700 bg-neutral-950">
          <div className="flex items-center gap-3 border-b border-neutral-800 bg-neutral-900 px-4 py-2.5">
            <Badge color={err.color}>{err.status}</Badge>
            <span className="text-sm text-neutral-300">{err.title}</span>
          </div>
          <div className="divide-y divide-neutral-800">
            {err.examples.map((ex) => (
              <div key={ex.label} className="flex items-start gap-4 px-4 py-3">
                <span className="w-28 shrink-0 pt-0.5 text-xs text-neutral-500">{ex.label}</span>
                <pre className="font-mono text-xs text-neutral-300">{ex.body}</pre>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── playground ────────────────────────────────────────────────────────────────

type FetchState = "idle" | "loading" | "ok" | "error";
type EndpointTab = "channel" | "playlist";

function Playground() {
  const [tab, setTab] = useState<EndpointTab>("channel");
  const [channelId, setChannelId] = useState(EXAMPLE_CHANNEL);
  const [playlistId, setPlaylistId] = useState(EXAMPLE_PLAYLIST);
  const [state, setState] = useState<FetchState>("idle");
  const [result, setResult] = useState<string>("");
  const [status, setStatus] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState<number | null>(null);

  const isChannel = tab === "channel";
  const url = isChannel
    ? `/api/channel?channelId=${encodeURIComponent(channelId.trim())}`
    : `/api/playlist?playlistId=${encodeURIComponent(playlistId.trim())}`;

  async function run() {
    setState("loading");
    setResult("");
    setStatus(null);
    setElapsed(null);
    const t0 = performance.now();
    try {
      const res = await fetch(url);
      const json = await res.json();
      setStatus(res.status);
      setElapsed(Math.round(performance.now() - t0));
      setResult(JSON.stringify(json, null, 2));
      setState(res.ok ? "ok" : "error");
    } catch (e: unknown) {
      setElapsed(Math.round(performance.now() - t0));
      setResult(e instanceof Error ? e.message : "Network error");
      setState("error");
    }
  }

  const statusColor =
    status === null ? "" :
    status < 300 ? "text-emerald-400" :
    status < 500 ? "text-yellow-400" : "text-red-400";

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-neutral-700 bg-neutral-900 p-5">
      {/* tabs */}
      <div className="flex gap-1 rounded-lg bg-neutral-800 p-1 self-start">
        {(["channel", "playlist"] as EndpointTab[]).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setState("idle"); setResult(""); }}
            className={`rounded-md px-4 py-1.5 text-xs font-medium transition-colors ${
              tab === t
                ? "bg-neutral-950 text-white shadow"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            /api/{t}
          </button>
        ))}
      </div>

      {/* input */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center overflow-hidden rounded-lg border border-neutral-700 bg-neutral-800 focus-within:border-blue-500 transition-colors">
          <span className="shrink-0 border-r border-neutral-700 bg-neutral-900 px-3 py-2.5 font-mono text-xs text-emerald-400">GET</span>
          <span className="shrink-0 px-2 font-mono text-xs text-neutral-500">
            {isChannel ? "/api/channel?channelId=" : "/api/playlist?playlistId="}
          </span>
          <input
            key={tab}
            type="text"
            value={isChannel ? channelId : playlistId}
            onChange={(e) => isChannel ? setChannelId(e.target.value) : setPlaylistId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && run()}
            className="flex-1 bg-transparent py-2.5 pr-3 font-mono text-xs text-neutral-100 outline-none min-w-0"
            spellCheck={false}
          />
        </div>
        <button
          onClick={run}
          disabled={state === "loading"}
          className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {state === "loading" ? (
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
          Send
        </button>
      </div>

      {/* response */}
      {result && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 text-xs text-neutral-400">
            <span>Status: <span className={`font-semibold ${statusColor}`}>{status}</span></span>
            {elapsed !== null && <span>· {elapsed} ms</span>}
          </div>
          <div className="relative">
            <pre className="max-h-[480px] overflow-auto rounded-lg bg-neutral-950 p-4 text-xs leading-relaxed text-neutral-300">
              <code>{result}</code>
            </pre>
            <button
              onClick={() => navigator.clipboard.writeText(result)}
              title="Copy response"
              className="absolute right-3 top-3 rounded bg-neutral-800 p-1.5 text-neutral-400 transition hover:bg-neutral-700 hover:text-white"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── endpoint section ──────────────────────────────────────────────────────────

function EndpointSection({
  id,
  path,
  description,
  paramName,
  paramDesc,
  paramPattern,
  exampleValue,
  responseFields,
  errorResponses,
}: {
  id: string;
  path: string;
  description: string;
  paramName: string;
  paramDesc: React.ReactNode;
  paramPattern: string;
  exampleValue: string;
  responseFields: Record<string, FieldDef>;
  errorResponses: typeof CHANNEL_ERROR_RESPONSES;
}) {
  return (
    <div id={id} className="flex flex-col gap-8 scroll-mt-20">
      {/* header */}
      <div className="flex flex-col gap-2 border-b border-neutral-800 pb-6">
        <div className="flex items-center gap-3 rounded-xl border border-neutral-700 bg-neutral-900 px-5 py-4">
          <Badge color="bg-emerald-900/60 text-emerald-300">GET</Badge>
          <code className="font-mono text-sm text-neutral-100">{path}</code>
        </div>
        <p className="text-sm text-neutral-400 pt-1">{description}</p>
      </div>

      {/* request */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Request</h3>
        <div className="overflow-hidden rounded-xl border border-neutral-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-700 bg-neutral-900 text-xs uppercase tracking-wider text-neutral-500">
                <th className="px-4 py-3 text-left font-medium">Parameter</th>
                <th className="px-4 py-3 text-left font-medium">In</th>
                <th className="px-4 py-3 text-left font-medium">Type</th>
                <th className="px-4 py-3 text-left font-medium">Required</th>
                <th className="px-4 py-3 text-left font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800 bg-neutral-950">
              <tr>
                <td className="px-4 py-3"><Code>{paramName}</Code></td>
                <td className="px-4 py-3 text-xs text-neutral-400">query</td>
                <td className="px-4 py-3 font-mono text-xs text-neutral-400">string</td>
                <td className="px-4 py-3"><Badge color="bg-red-900/50 text-red-300">required</Badge></td>
                <td className="px-4 py-3 text-xs leading-relaxed text-neutral-400">
                  {paramDesc}
                  <br />
                  <span className="text-neutral-500">Pattern: </span>
                  <Code>{paramPattern}</Code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="rounded-xl border border-neutral-700 bg-neutral-950 p-4">
          <p className="mb-2 text-xs uppercase tracking-wider text-neutral-500">Example request</p>
          <pre className="font-mono text-sm text-emerald-400">GET {path}?{paramName}={exampleValue}</pre>
        </div>
      </div>

      {/* response 200 */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Response · 200 OK</h3>
        <SchemaTable fields={responseFields} />
      </div>

      {/* errors */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Response · Errors</h3>
        <ErrorBlock errors={errorResponses} />
      </div>
    </div>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { href: "#channel",   label: "/api/channel" },
  { href: "#playlist",  label: "/api/playlist" },
  { href: "#types",     label: "TypeScript types" },
  { href: "#playground", label: "Try it live" },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white font-sans">
      {/* nav */}
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-neutral-800 bg-[#0f0f0f]/95 px-6 py-3 backdrop-blur-sm">
        <a href="/" className="flex items-center gap-1.5">
          <svg className="h-5 w-5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-5.8z" />
            <polygon points="9.7 15.5 15.8 12 9.7 8.5 9.7 15.5" fill="white" />
          </svg>
          <span className="text-sm font-semibold text-neutral-300">RSS JSON</span>
        </a>
        <span className="text-neutral-700">/</span>
        <span className="text-sm text-neutral-400">API Docs</span>
        <div className="ml-auto flex items-center gap-2">
          <a
            href="/api/docs"
            target="_blank"
            className="rounded-lg border border-neutral-700 px-3 py-1.5 text-xs text-neutral-400 transition hover:border-neutral-500 hover:text-neutral-200"
          >
            OpenAPI JSON ↗
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex gap-10 py-10">

          {/* sidebar */}
          <aside className="hidden lg:flex flex-col gap-1 w-44 shrink-0 pt-1">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-neutral-600">Endpoints</p>
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-lg px-3 py-1.5 text-sm text-neutral-400 transition hover:bg-neutral-800 hover:text-neutral-200 font-mono"
              >
                {l.label}
              </a>
            ))}
          </aside>

          {/* main */}
          <main className="flex flex-1 flex-col gap-16 min-w-0">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">API Reference</h1>
              <p className="text-neutral-400 text-sm">
                Two endpoints — channel feed and playlist feed. No auth required.
              </p>
            </div>

            <EndpointSection
              id="channel"
              path="/api/channel"
              description="Fetches the YouTube RSS feed for a channel and returns structured JSON with channel metadata and up to 15 latest videos."
              paramName="channelId"
              paramDesc={<>YouTube channel ID. 24 chars, starts with <Code>UC</Code>, alphanumeric / <Code>_</Code> / <Code>-</Code>.</>}
              paramPattern="^UC[a-zA-Z0-9_-]{22}$"
              exampleValue={EXAMPLE_CHANNEL}
              responseFields={CHANNEL_RESPONSE_FIELDS}
              errorResponses={CHANNEL_ERROR_RESPONSES}
            />

            <EndpointSection
              id="playlist"
              path="/api/playlist"
              description="Fetches the YouTube RSS feed for a playlist and returns structured JSON with playlist metadata (title, author) and up to 15 videos."
              paramName="playlistId"
              paramDesc={<>YouTube playlist ID. Starts with 2 uppercase letters (<Code>PL</Code>, <Code>UU</Code>, <Code>LL</Code>, <Code>RD</Code>…) followed by alphanumeric chars.</>}
              paramPattern="^[A-Za-z]{2}[a-zA-Z0-9_-]{0,52}$"
              exampleValue={EXAMPLE_PLAYLIST}
              responseFields={PLAYLIST_RESPONSE_FIELDS}
              errorResponses={PLAYLIST_ERROR_RESPONSES}
            />

            {/* typescript types */}
            <div id="types" className="flex flex-col gap-4 scroll-mt-20">
              <h2 className="text-base font-semibold uppercase tracking-widest text-neutral-100">TypeScript types</h2>
              <p className="text-sm text-neutral-400 -mt-2">
                Copy-paste ready interfaces for both endpoints.
              </p>
              <div className="overflow-hidden rounded-xl border border-neutral-700">
                <div className="flex items-center justify-between border-b border-neutral-700 bg-neutral-900 px-4 py-2.5">
                  <span className="font-mono text-xs text-sky-400">typescript</span>
                  <CopyButton text={TS_TYPES} />
                </div>
                <pre className="overflow-x-auto bg-neutral-950 p-5 text-sm leading-relaxed font-mono text-neutral-300">
                  <code>{TS_TYPES}</code>
                </pre>
              </div>
            </div>

            {/* playground */}
            <div id="playground" className="flex flex-col gap-4 scroll-mt-20">
              <h2 className="text-base font-semibold uppercase tracking-widest text-neutral-100">Try it live</h2>
              <p className="text-sm text-neutral-400 -mt-2">
                Switch between endpoints, edit the ID, and hit Send.
              </p>
              <Playground />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
