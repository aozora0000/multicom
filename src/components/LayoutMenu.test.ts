// @vitest-environment jsdom
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { LAYOUT_GRIDS, type Layout } from "../constants";
import LayoutMenu from "./LayoutMenu.vue";

const layoutOptions: Layout[] = ["2x1", "2x2", "1x4"];

describe("LayoutMenu", () => {
  it("renders the current layout and available options", () => {
    const wrapper = mount(LayoutMenu, {
      props: { currentLayout: "2x2", layoutOptions, layoutGrids: LAYOUT_GRIDS },
    });

    expect(wrapper.find("summary").text()).toContain("2x2");
    expect(wrapper.findAll("button.layout-option").map((button) => button.text())).toEqual(layoutOptions);
    expect(wrapper.find("button.layout-option.selected").text()).toBe("2x2");
  });

  it("emits selected layout and closes details", async () => {
    const wrapper = mount(LayoutMenu, {
      props: { currentLayout: "2x1", layoutOptions, layoutGrids: LAYOUT_GRIDS },
    });
    const details = wrapper.find("details");
    details.element.setAttribute("open", "");

    await wrapper.findAll("button.layout-option")[1].trigger("click");

    expect(wrapper.emitted("select")?.[0]).toEqual(["2x2"]);
    expect(details.attributes("open")).toBeUndefined();
  });
});
