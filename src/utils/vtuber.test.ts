import { describe, expect, it } from "vitest";
import { buildVtuberUrl, getAutoVtuberLayoutId } from "./vtuber";

describe("vtuber link helpers", () => {
  it("maps app layouts to close vtuber layout ids", () => {
    expect(getAutoVtuberLayoutId("2x1")).toBe(3);
    expect(getAutoVtuberLayoutId("1x2")).toBe(2);
    expect(getAutoVtuberLayoutId("2x2")).toBe(6);
    expect(getAutoVtuberLayoutId("2x3")).toBe(7);
    expect(getAutoVtuberLayoutId("3x2")).toBe(8);
    expect(getAutoVtuberLayoutId("4x2")).toBe(9);
  });

  it("builds a vtuber.neocities URL from the visible ids", () => {
    expect(buildVtuberUrl("2x1", ["WQMUTodrjYs", "https://youtu.be/aRg-vU-Ghes"])).toBe(
      "https://vtuber.neocities.org/#/l-3/1:WQMUTodrjYs,2:aRg-vU-Ghes",
    );
  });

  it("uses the selected layout id and omits ids beyond its slot count", () => {
    expect(buildVtuberUrl("2x2", ["a", "b", "c", "d"], 3)).toBe(
      "https://vtuber.neocities.org/#/l-3/1:a,2:b",
    );
  });

  it("keeps only visible app windows", () => {
    expect(buildVtuberUrl("2x1", ["a", "", "hidden"], 9)).toBe("https://vtuber.neocities.org/#/l-9/1:a");
  });
});
