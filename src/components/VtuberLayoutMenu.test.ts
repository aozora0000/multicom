// @vitest-environment jsdom
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { VTUBER_LAYOUT_OPTIONS } from "../constants";
import VtuberLayoutMenu from "./VtuberLayoutMenu.vue";

describe("VtuberLayoutMenu", () => {
  it("renders auto and icon-based vtuber layout options", () => {
    const wrapper = mount(VtuberLayoutMenu, {
      props: { effectiveLayoutId: 6, layoutOptions: VTUBER_LAYOUT_OPTIONS, selection: "auto" },
    });

    expect(wrapper.find("summary").text()).toContain("自動");
    expect(wrapper.findAll("button.vtuber-layout-option")).toHaveLength(13);
    expect(wrapper.findAll("svg.vtuber-layout-icon").length).toBeGreaterThan(1);
    expect(wrapper.find("button.vtuber-layout-option.selected").text()).toContain("自動");
    expect(wrapper.findAll("button.vtuber-layout-option").some((button) => button.text() === "3")).toBe(false);
  });

  it("emits selected layout and closes details", async () => {
    const wrapper = mount(VtuberLayoutMenu, {
      props: { effectiveLayoutId: 6, layoutOptions: VTUBER_LAYOUT_OPTIONS, selection: "auto" },
    });
    const details = wrapper.find("details");
    details.element.setAttribute("open", "");

    await wrapper.find('button[aria-label="レイアウト3"]').trigger("click");

    expect(wrapper.emitted("select")?.[0]).toEqual([3]);
    expect(details.attributes("open")).toBeUndefined();
  });
});
