import { describe, expect, it } from "vitest";
import { applyQueryParamsToSnapshot } from "./query";
import { normalizeValues } from "./values";

describe("applyQueryParamsToSnapshot", () => {
  it("applies layout and window values from query params", () => {
    expect(
      applyQueryParamsToSnapshot("?l=1x3&w1=a&w3=c", {
        layout: "2x2",
        values: ["old1", "old2", "old3", "old4"],
      }),
    ).toEqual({
      layout: "1x3",
      values: ["a", "old2", "c", "old4", "", "", "", ""],
    });
  });

  it("ignores invalid layouts", () => {
    expect(applyQueryParamsToSnapshot("?l=invalid&w1=a", { layout: "3x1", values: [] })).toEqual({
      layout: "3x1",
      values: ["a", "", "", "", "", "", "", ""],
    });
  });

  it("supports six-window layout query params", () => {
    expect(applyQueryParamsToSnapshot("?l=2x3&w5=e&w6=f", { values: [] })).toEqual({
      layout: "2x3",
      values: ["", "", "", "", "e", "f", "", ""],
    });
  });

  it("supports eight-window layout query params", () => {
    expect(applyQueryParamsToSnapshot("?l=4x2&w7=g&w8=h", { values: [] })).toEqual({
      layout: "4x2",
      values: ["", "", "", "", "", "", "g", "h"],
    });
  });
});

describe("normalizeValues", () => {
  it("returns exactly eight string values", () => {
    expect(normalizeValues([1, "two", null, undefined, "extra"])).toEqual([
      "1",
      "two",
      "",
      "",
      "extra",
      "",
      "",
      "",
    ]);
    expect(normalizeValues("invalid")).toEqual(["", "", "", "", "", "", "", ""]);
  });
});
