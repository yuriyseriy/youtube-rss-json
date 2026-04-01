export const dynamic = "force-static";

const docs = {
  openapi: "3.1.0",
  info: {
    title: "YouTube RSS JSON API",
    version: "1.0.0",
    description: "Converts a YouTube channel RSS feed into structured JSON.",
  },
  paths: {
    "/api/playlist": {
      get: {
        summary: "Get playlist videos",
        description:
          "Fetches the YouTube RSS feed for a given playlist and returns structured JSON with playlist metadata and the latest videos (up to 15).",
        parameters: [
          {
            name: "playlistId",
            in: "query",
            required: true,
            description:
              "YouTube playlist ID. Starts with 2 uppercase letters (PL, UU, LL, FL, RD…) followed by alphanumeric characters.",
            schema: {
              type: "string",
              pattern: "^[A-Za-z]{2}[a-zA-Z0-9_-]{0,52}$",
              example: "PLbpi6ZahtOH6Ar_3GPy3workJYXByaLq",
            },
          },
        ],
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["playlist", "videoCount", "videos"],
                  properties: {
                    playlist: {
                      type: "object",
                      required: ["id", "title", "url", "author"],
                      properties: {
                        id: { type: "string", example: "PLbpi6ZahtOH6Ar_3GPy3workJYXByaLq" },
                        title: { type: "string", example: "JavaScript Tutorials" },
                        url: { type: "string", format: "uri" },
                        author: {
                          type: "object",
                          properties: {
                            name: { type: ["string", "null"], example: "Fireship" },
                            channelId: { type: ["string", "null"], example: "UCsBjURrPoezykLs9EqgamOA" },
                            url: { type: ["string", "null"], format: "uri" },
                          },
                        },
                      },
                    },
                    videoCount: { type: "integer", example: 15 },
                    videos: {
                      type: "array",
                      description: "Same Video object as /api/channel",
                      items: { $ref: "#/components/schemas/Video" },
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Bad request — missing or invalid playlistId",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                examples: {
                  missing: { summary: "Missing parameter", value: { error: "Missing required query parameter: playlistId" } },
                  invalid: { summary: "Invalid format", value: { error: "Invalid playlistId format" } },
                },
              },
            },
          },
          "404": {
            description: "Playlist not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { error: "Playlist not found: PLbpi6ZahtOH6Ar_3GPy3workJYXByaLq" },
              },
            },
          },
          "502": {
            description: "Upstream YouTube RSS feed error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { error: "Failed to fetch feed (upstream 503)" },
              },
            },
          },
        },
      },
    },
    "/api/channel": {
      get: {
        summary: "Get channel videos",
        description:
          "Fetches the YouTube RSS feed for a given channel and returns structured JSON with channel metadata and the latest videos.",
        parameters: [
          {
            name: "channelId",
            in: "query",
            required: true,
            description:
              'YouTube channel ID. Must be 24 characters, start with "UC", and contain only alphanumeric characters, hyphens, or underscores.',
            schema: {
              type: "string",
              pattern: "^UC[a-zA-Z0-9_-]{22}$",
              example: "UCsBjURrPoezykLs9EqgamOA",
            },
          },
        ],
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["channel", "videoCount", "videos"],
                  properties: {
                    channel: {
                      type: "object",
                      required: ["id", "title", "url", "published"],
                      properties: {
                        id: {
                          type: "string",
                          description: "YouTube channel ID",
                          example: "UCsBjURrPoezykLs9EqgamOA",
                        },
                        title: {
                          type: "string",
                          description: "Channel display name",
                          example: "Fireship",
                        },
                        url: {
                          type: "string",
                          format: "uri",
                          description: "URL to the YouTube channel page",
                          example: "https://www.youtube.com/channel/UCsBjURrPoezykLs9EqgamOA",
                        },
                        published: {
                          type: "string",
                          format: "date-time",
                          description: "Channel creation date (ISO 8601)",
                          example: "2017-05-05T15:00:03+00:00",
                        },
                      },
                    },
                    videoCount: {
                      type: "integer",
                      description: "Number of videos returned (up to 15 — RSS feed limit)",
                      example: 15,
                    },
                    videos: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Video" },
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Bad request — missing or invalid channelId",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                examples: {
                  missing: {
                    summary: "Missing parameter",
                    value: { error: "Missing required query parameter: channelId" },
                  },
                  invalid: {
                    summary: "Invalid format",
                    value: { error: "Invalid channelId format" },
                  },
                },
              },
            },
          },
          "404": {
            description: "Channel not found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { error: "Channel not found: UCsBjURrPoezykLs9EqgamOA" },
              },
            },
          },
          "502": {
            description: "Upstream YouTube RSS feed error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: { error: "Failed to fetch feed (upstream 503)" },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Error: {
        type: "object",
        required: ["error"],
        properties: {
          error: { type: "string" },
        },
      },
      Video: {
        type: "object",
        required: ["id", "title", "url", "published", "updated"],
        properties: {
          id: { type: "string", example: "dQw4w9WgXcQ" },
          title: { type: "string" },
          url: { type: "string", format: "uri" },
          published: { type: "string", format: "date-time" },
          updated: { type: "string", format: "date-time" },
          thumbnail: { type: ["string", "null"], format: "uri" },
          description: { type: ["string", "null"] },
          views: { type: ["integer", "null"], example: 1240000 },
          rating: {
            oneOf: [
              {
                type: "object",
                required: ["count", "average"],
                properties: {
                  count: { type: "integer", example: 48200 },
                  average: { type: "number", example: 4.92 },
                },
              },
              { type: "null" },
            ],
          },
        },
      },
    },
  },
};

export function GET() {
  return Response.json(docs);
}
