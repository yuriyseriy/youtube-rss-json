"use client";

import { useState, useEffect, useCallback } from "react";

const DEFAULT_CHANNEL = "UCsBjURrPoezykLs9EqgamOA"; // Fireship

interface Video {
  id: string;
  title: string;
  url: string;
  published: string;
  updated: string;
  thumbnail: string | null;
  description: string | null;
  views: number | null;
  rating: { count: number; average: number } | null;
}

interface Channel {
  id: string;
  title: string;
  url: string;
  published: string;
}

interface FeedData {
  channel: Channel;
  videoCount: number;
  videos: Video[];
}

function formatViews(n: number | null): string {
  if (n === null) return "";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M views`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K views`;
  return `${n} views`;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const s = Math.floor(diff / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  const mo = Math.floor(d / 30);
  const y = Math.floor(d / 365);
  if (y >= 1) return `${y} year${y > 1 ? "s" : ""} ago`;
  if (mo >= 1) return `${mo} month${mo > 1 ? "s" : ""} ago`;
  if (d >= 1) return `${d} day${d > 1 ? "s" : ""} ago`;
  if (h >= 1) return `${h} hour${h > 1 ? "s" : ""} ago`;
  if (m >= 1) return `${m} minute${m > 1 ? "s" : ""} ago`;
  return "just now";
}

function VideoCard({ video }: { video: Video }) {
  return (
    <a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-2"
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-neutral-800">
        {video.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={video.thumbnail}
            alt={video.title}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg className="h-12 w-12 text-neutral-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10 rounded-xl" />
      </div>
      <div className="flex gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <p className="line-clamp-2 text-sm font-medium leading-snug text-neutral-100 group-hover:text-white">
            {video.title}
          </p>
          <div className="flex flex-wrap items-center gap-x-1 text-xs text-neutral-400">
            {video.views !== null && (
              <>
                <span>{formatViews(video.views)}</span>
                <span>·</span>
              </>
            )}
            <span>{timeAgo(video.published)}</span>
          </div>
        </div>
      </div>
    </a>
  );
}

function SkeletonCard() {
  return (
    <div className="flex flex-col gap-2 animate-pulse">
      <div className="aspect-video w-full rounded-xl bg-neutral-800" />
      <div className="flex flex-col gap-2 px-1">
        <div className="h-3.5 w-full rounded bg-neutral-800" />
        <div className="h-3 w-2/3 rounded bg-neutral-800" />
      </div>
    </div>
  );
}

export default function Home() {
  const [input, setInput] = useState(DEFAULT_CHANNEL);
  const [query, setQuery] = useState(DEFAULT_CHANNEL);
  const [data, setData] = useState<FeedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeed = useCallback(async (channelId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/channel?channelId=${encodeURIComponent(channelId)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? `Error ${res.status}`);
      setData(json);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed(query);
  }, [query, fetchFeed]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed) setQuery(trimmed);
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white font-sans">
      {/* Top nav */}
      <header className="sticky top-0 z-10 flex items-center gap-4 border-b border-neutral-800 bg-[#0f0f0f]/95 px-4 py-3 backdrop-blur-sm sm:px-6">
        <div className="flex items-center gap-1.5 shrink-0">
          <svg className="h-6 w-6 text-red-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-5.8z" />
            <polygon points="9.7 15.5 15.8 12 9.7 8.5 9.7 15.5" fill="white" />
          </svg>
          <span className="text-lg font-bold tracking-tight">RSS Feed</span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 items-center gap-2 max-w-xl mx-auto">
          <div className="flex flex-1 items-center rounded-full border border-neutral-700 bg-neutral-900 focus-within:border-blue-500 transition-colors">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter YouTube Channel ID (e.g. UCsBjURrPoezykLs9EqgamOA)"
              className="flex-1 bg-transparent px-4 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 outline-none min-w-0"
              spellCheck={false}
            />
            <button
              type="submit"
              className="flex items-center justify-center rounded-r-full bg-neutral-700 px-4 py-2 transition-colors hover:bg-neutral-600 border-l border-neutral-700"
            >
              <svg className="h-4 w-4 text-neutral-200" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </form>
      </header>

      <main className="mx-auto max-w-screen-xl px-4 py-6 sm:px-6">
        {/* Channel header */}
        {data && !loading && (
          <div className="mb-6 flex items-center gap-4 border-b border-neutral-800 pb-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-red-800 text-xl font-bold uppercase">
              {data.channel.title?.[0] ?? "?"}
            </div>
            <div className="min-w-0">
              <a
                href={data.channel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl font-bold hover:text-neutral-300 transition-colors truncate block"
              >
                {data.channel.title}
              </a>
              <p className="text-sm text-neutral-400">
                {data.videoCount} video{data.videoCount !== 1 ? "s" : ""} in feed
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
            <svg className="h-12 w-12 text-red-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4m0 4h.01" strokeLinecap="round" />
            </svg>
            <p className="text-lg font-medium text-neutral-300">{error}</p>
            <p className="text-sm text-neutral-500">Check the channel ID and try again.</p>
          </div>
        )}

        {/* Video grid */}
        <div className="grid grid-cols-1 gap-x-4 gap-y-7 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
            : data?.videos.map((v) => <VideoCard key={v.id} video={v} />)}
        </div>

        {!loading && data?.videos.length === 0 && (
          <div className="py-24 text-center text-neutral-500">No videos found for this channel.</div>
        )}
      </main>
    </div>
  );
}
