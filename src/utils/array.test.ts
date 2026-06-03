import { describe, expect, it } from "vitest";
import { replaceAt } from "./array";

describe("replaceAt", () => {
  it("replaces one value without mutating the original array", () => {
    const values = ["a", "b", "c"];

    expect(replaceAt(values, 1, "next")).toEqual(["a", "next", "c"]);
    expect(values).toEqual(["a", "b", "c"]);
  });
});
