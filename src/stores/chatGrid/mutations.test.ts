import { describe, expect, it } from "vitest";
import { applyDraftValue, normalizeVideoValues, setDraftValueAt } from "./mutations";

describe("chatGrid mutations", () => {
  it("normalizes YouTube URLs to ids and pads window values", () => {
    expect(normalizeVideoValues([" https://youtu.be/dQw4w9WgXcQ ", "custom"])).toEqual([
      "dQw4w9WgXcQ",
      "custom",
      "",
      "",
      "",
      "",
      "",
      "",
    ]);
  });

  it("sets one draft value without mutating the source array", () => {
    const draftValues = ["a", "b"];

    expect(setDraftValueAt(draftValues, 1, "next")).toEqual(["a", "next", "", "", "", "", "", ""]);
    expect(draftValues).toEqual(["a", "b"]);
  });

  it("applies a valid draft without mutating source arrays", () => {
    const values = ["", "old"];
    const draftValues = ["https://www.youtube.com/watch?v=dQw4w9WgXcQ", "old"];

    expect(applyDraftValue(values, draftValues, 0)).toEqual({
      accepted: true,
      values: ["dQw4w9WgXcQ", "old", "", "", "", "", "", ""],
      draftValues: ["dQw4w9WgXcQ", "old", "", "", "", "", "", ""],
    });
    expect(values).toEqual(["", "old"]);
    expect(draftValues).toEqual(["https://www.youtube.com/watch?v=dQw4w9WgXcQ", "old"]);
  });

  it("keeps the previous value when a draft is invalid", () => {
    expect(applyDraftValue(["old"], ["not a video"], 0)).toEqual({
      accepted: false,
      values: ["old", "", "", "", "", "", "", ""],
      draftValues: ["not a video", "", "", "", "", "", "", ""],
      error: "w1 のURLを認識できませんでした",
    });
  });

  it("clears a window when the draft is empty", () => {
    expect(applyDraftValue(["dQw4w9WgXcQ"], [""], 0)).toEqual({
      accepted: true,
      values: ["", "", "", "", "", "", "", ""],
      draftValues: ["", "", "", "", "", "", "", ""],
    });
  });
});
