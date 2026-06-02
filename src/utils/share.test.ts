import { describe, expect, it } from "vitest";
import { buildShareUrl } from "./share";

describe("buildShareUrl", () => {
  it("normalizes YouTube URLs to ids and keeps only visible windows", () => {
    expect(
      buildShareUrl("https://example.test/?old=1#hash", "2x1", [
        "https://youtu.be/dQw4w9WgXcQ",
        "abc123ABC-_",
        "hiddenValue",
        "alsoHidden",
      ]),
    ).toBe("https://example.test/?l=2x1&w1=dQw4w9WgXcQ&w2=abc123ABC-_");
  });

  it("keeps non-empty unrecognized values for sharing", () => {
    expect(buildShareUrl("https://example.test/path", "1x2", ["custom", ""])).toBe(
      "https://example.test/path?l=1x2&w1=custom",
    );
  });
});
