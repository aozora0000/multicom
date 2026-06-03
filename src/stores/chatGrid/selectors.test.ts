import { describe, expect, it } from "vitest";
import {
  buildLoadedStatus,
  countLoadedChats,
  getVisibleValues,
  getWindowPlaceholderText,
  shouldStartInEditMode,
} from "./selectors";

describe("chatGrid selectors", () => {
  it("returns only values visible in the current layout", () => {
    expect(getVisibleValues("2x1", ["a", "b", "c", "d"])).toEqual(["a", "b"]);
    expect(getVisibleValues("4x2", ["a", "b", "c", "d", "e", "f", "g", "h", "i"])).toEqual([
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
    ]);
  });

  it("counts only recognized visible video ids", () => {
    const values = ["dQw4w9WgXcQ", "custom", "abc123ABC-_", "hidden"];

    expect(countLoadedChats("2x1", values)).toBe(1);
    expect(buildLoadedStatus("2x2", values)).toBe("読み込み: 2件");
  });

  it("checks empty visible windows for initial edit mode", () => {
    expect(shouldStartInEditMode("2x1", ["", "", "dQw4w9WgXcQ"])).toBe(true);
    expect(shouldStartInEditMode("2x1", ["", "dQw4w9WgXcQ"])).toBe(false);
  });

  it("builds placeholder text from index and embed-domain availability", () => {
    expect(getWindowPlaceholderText(2, true)).toBe("w3 にYouTube URLまたは動画IDを入力");
    expect(getWindowPlaceholderText(0, false)).toContain("file://ではembed_domainを作れません");
  });
});
