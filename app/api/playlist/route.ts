import { XMLParser } from "fast-xml-parser";
import { type NextRequest } from "next/server";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@",
  isArray: (name) => name === "entry" || name === "link",
});

// Playlist ID formats:
//   PL…  – regular user playlists  (PL + 32 chars, total 34)
//   UU…  – channel uploads list    (UU + 22 chars, total 24)
//   LL   – liked videos            (exactly "LL")
//   FL   – favorites               (exactly "FL")
//   RD…  – auto-generated mixes    (variable length)
const PLAYLIST_ID_RE = /^[A-Za-z]{2}[a-zA-Z0-9_-]{0,52}$/;

export async function GET(request: NextRequest) {
  const playlistId = request.nextUrl.searchParams.get("playlistId");

  if (!playlistId) {
    return Response.json(
      { error: "Missing required query parameter: playlistId" },
      { status: 400 }
    );
  }

  if (!PLAYLIST_ID_RE.test(playlistId)) {
    return Response.json(
      { error: "Invalid playlistId format" },
      { status: 400 }
    );
  }

  const feedUrl = `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`;
  const res = await fetch(feedUrl, { next: { revalidate: 3600 } });

  if (res.status === 404) {
    return Response.json(
      { error: `Playlist not found: ${playlistId}` },
      { status: 404 }
    );
  }

  if (!res.ok) {
    return Response.json(
      { error: `Failed to fetch feed (upstream ${res.status})` },
      { status: 502 }
    );
  }

  const xml = await res.text();
  const { feed } = parser.parse(xml);

  const playlistUrl =
    (feed.link as Array<{ "@rel": string; "@href": string }>)?.find(
      (l) => l["@rel"] === "alternate"
    )?.["@href"] ??
    `https://www.youtube.com/playlist?list=${playlistId}`;

  const entries: unknown[] = Array.isArray(feed.entry)
    ? feed.entry
    : feed.entry
      ? [feed.entry]
      : [];

  const videos = entries.map((entry: any) => {
    const group = entry["media:group"] ?? {};
    const community = group["media:community"] ?? {};
    const stats = community["media:statistics"] ?? {};
    const rating = community["media:starRating"] ?? {};

    return {
      id: entry["yt:videoId"],
      title: entry.title,
      url:
        (entry.link as Array<{ "@rel": string; "@href": string }>)?.find(
          (l) => l["@rel"] === "alternate"
        )?.["@href"] ??
        `https://www.youtube.com/watch?v=${entry["yt:videoId"]}`,
      published: entry.published,
      updated: entry.updated,
      thumbnail: group["media:thumbnail"]?.["@url"] ?? null,
      description: group["media:description"] ?? null,
      views: stats["@views"] ? Number(stats["@views"]) : null,
      rating:
        rating["@count"] != null
          ? {
              count: Number(rating["@count"]),
              average: Number(rating["@average"]),
            }
          : null,
    };
  });

  return Response.json({
    playlist: {
      id: playlistId,
      title: feed.title,
      url: playlistUrl,
      author: {
        name: feed.author?.name ?? null,
        channelId: feed["yt:channelId"] ?? null,
        url: feed.author?.uri ?? null,
      },
    },
    videoCount: videos.length,
    videos,
  });
}
