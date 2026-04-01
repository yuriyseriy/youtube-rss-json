import { XMLParser } from "fast-xml-parser";
import { type NextRequest } from "next/server";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@",
  isArray: (name) => name === "entry" || name === "link",
});

// if videos is empty
// if 1 video
// cache 1 hour

export async function GET(request: NextRequest) {
  const channelId = request.nextUrl.searchParams.get("channelId");

  if (!channelId) {
    return Response.json(
      { error: "Missing required query parameter: channelId" },
      { status: 400 }
    );
  }

  // Basic channelId format validation: Must be 24 characters, alphanumeric, start with "UC"
  if (
    typeof channelId !== "string" ||
    !/^UC[a-zA-Z0-9_-]{22}$/.test(channelId)
  ) {
    return Response.json(
      { error: "Invalid channelId format" },
      { status: 400 }
    );
  }

  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  const res = await fetch(feedUrl);

  if (res.status === 404) {
    return Response.json(
      { error: `Channel not found: ${channelId}` },
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

  const channelUrl =
    (feed.link as Array<{ "@rel": string; "@href": string }>)?.find(
      (l) => l["@rel"] === "alternate"
    )?.["@href"] ?? `https://www.youtube.com/channel/${channelId}`;

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
        )?.["@href"] ?? `https://www.youtube.com/watch?v=${entry["yt:videoId"]}`,
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
    channel: {
      id: feed["yt:channelId"],
      title: feed.title,
      url: channelUrl,
      published: feed.published,
    },
    videoCount: videos.length,
    videos,
  });
}
