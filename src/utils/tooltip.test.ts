import { describe, expect, it } from "vitest";
import { calculateTooltipPosition } from "./tooltip";

describe("calculateTooltipPosition", () => {
  it("centers the tooltip above the trigger when it fits", () => {
    expect(
      calculateTooltipPosition(
        { left: 100, right: 140, top: 80, bottom: 118, width: 40 },
        { width: 80, height: 24 },
        { width: 320, height: 240 },
      ),
    ).toEqual({ left: 80, top: 48, placement: "top" });
  });

  it("clamps the tooltip inside the left and right viewport edges", () => {
    expect(
      calculateTooltipPosition(
        { left: 300, right: 320, top: 80, bottom: 118, width: 20 },
        { width: 100, height: 24 },
        { width: 320, height: 240 },
      ).left,
    ).toBe(212);

    expect(
      calculateTooltipPosition(
        { left: 0, right: 20, top: 80, bottom: 118, width: 20 },
        { width: 100, height: 24 },
        { width: 320, height: 240 },
      ).left,
    ).toBe(8);
  });

  it("places the tooltip below the trigger when top would overflow", () => {
    expect(
      calculateTooltipPosition(
        { left: 100, right: 140, top: 10, bottom: 48, width: 40 },
        { width: 80, height: 24 },
        { width: 320, height: 240 },
      ),
    ).toEqual({ left: 80, top: 56, placement: "bottom" });
  });
});
