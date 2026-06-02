import { describe, expect, it } from "vitest";
import { swapValues } from "./reorder";

describe("swapValues", () => {
  it("swaps two values without mutating the original array", () => {
    const values = ["a", "b", "c", "d"];

    expect(swapValues(values, 0, 2)).toEqual(["c", "b", "a", "d"]);
    expect(values).toEqual(["a", "b", "c", "d"]);
  });

  it("returns a copy for no-op or invalid indexes", () => {
    const values = ["a", "b", "c", "d"];

    expect(swapValues(values, 1, 1)).toEqual(values);
    expect(swapValues(values, -1, 2)).toEqual(values);
    expect(swapValues(values, 1, 9)).toEqual(values);
  });
});
