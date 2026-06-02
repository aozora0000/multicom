import { describe, expect, it } from "vitest";
import { buildLiveChatUrl, extractYouTubeVideoId } from "./youtube";

describe("extractYouTubeVideoId", () => {
  it("accepts a raw video id", () => {
    expect(extractYouTubeVideoId("dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("extracts ids from common YouTube URL forms", () => {
    expect(extractYouTubeVideoId("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10")).toBe("dQw4w9WgXcQ");
    expect(extractYouTubeVideoId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(extractYouTubeVideoId("https://www.youtube.com/shorts/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(extractYouTubeVideoId("https://www.youtube.com/live/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("rejects invalid ids", () => {
    expect(extractYouTubeVideoId("not a video")).toBe("");
    expect(extractYouTubeVideoId("too-short")).toBe("");
  });
});

describe("buildLiveChatUrl", () => {
  it("builds an embedded live chat URL when id and domain are valid", () => {
    expect(buildLiveChatUrl("https://youtu.be/dQw4w9WgXcQ", "localhost")).toBe(
      "https://www.youtube.com/live_chat?v=dQw4w9WgXcQ&embed_domain=localhost",
    );
  });

  it("returns an empty string without a video id or embed domain", () => {
    expect(buildLiveChatUrl("", "localhost")).toBe("");
    expect(buildLiveChatUrl("dQw4w9WgXcQ", "")).toBe("");
  });
});
