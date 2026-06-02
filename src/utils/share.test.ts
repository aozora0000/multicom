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

  it("includes six windows for 2x3 and 3x2 layouts", () => {
    expect(buildShareUrl("https://example.test/path", "3x2", ["a", "b", "c", "d", "e", "f"])).toBe(
      "https://example.test/path?l=3x2&w1=a&w2=b&w3=c&w4=d&w5=e&w6=f",
    );
  });

  it("includes eight windows for 4x2 layouts", () => {
    expect(buildShareUrl("https://example.test/path", "4x2", ["a", "b", "c", "d", "e", "f", "g", "h"])).toBe(
      "https://example.test/path?l=4x2&w1=a&w2=b&w3=c&w4=d&w5=e&w6=f&w7=g&w8=h",
    );
  });
});
