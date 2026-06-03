// @vitest-environment jsdom
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { LAYOUT_GRIDS, type Layout } from "../constants";
import ControlPanel from "./ControlPanel.vue";

function mountControlPanel(props = {}) {
  return mount(ControlPanel, {
    props: {
      currentLayout: "2x2" as Layout,
      editMode: false,
      layoutGrids: LAYOUT_GRIDS,
      layoutOptions: ["2x1", "2x2"] as Layout[],
      repoUrl: "https://github.com/aozora0000/multicom",
      shareUrl: "https://example.test/?l=2x2",
      status: "読み込み: 1件",
      ...props,
    },
  });
}

describe("ControlPanel", () => {
  it("renders status, share URL, repo link, and edit label", () => {
    const wrapper = mountControlPanel();

    expect(wrapper.text()).toContain("YouTubeコメントを複数窓で見るやつ");
    expect(wrapper.text()).toContain("読み込み: 1件");
    expect(wrapper.text()).toContain("https://example.test/?l=2x2");
    expect(wrapper.find(".repo-link").attributes("href")).toBe("https://github.com/aozora0000/multicom");
    expect(wrapper.findAll("button").some((button) => button.text() === "編集")).toBe(true);
  });

  it("renders edit end label while editing", () => {
    const wrapper = mountControlPanel({ editMode: true });

    expect(wrapper.findAll("button").some((button) => button.text() === "編集終了")).toBe(true);
  });

  it("disables hiding controls while editing", async () => {
    const wrapper = mountControlPanel({ editMode: true });
    const hideButton = wrapper.findAll("button").find((button) => button.text() === "操作欄を隠す");

    expect(hideButton?.attributes("disabled")).toBeDefined();
    expect(hideButton?.attributes("data-tooltip")).toBe("編集中は操作欄を隠せません");

    await hideButton?.trigger("click");

    expect(wrapper.emitted("hideControls")).toBeUndefined();
  });

  it("emits control actions", async () => {
    const wrapper = mountControlPanel();

    await wrapper.findAll("button").find((button) => button.text() === "編集")?.trigger("click");
    await wrapper.findAll("button").find((button) => button.text() === "使い方")?.trigger("click");
    await wrapper.findAll("button").find((button) => button.text() === "操作欄を隠す")?.trigger("click");
    await wrapper.find("button.status-share").trigger("click");

    expect(wrapper.emitted("toggleEditMode")).toHaveLength(1);
    expect(wrapper.emitted("openHelp")).toHaveLength(1);
    expect(wrapper.emitted("hideControls")).toHaveLength(1);
    expect(wrapper.emitted("copyShareUrl")).toHaveLength(1);
  });

  it("forwards layout selection", async () => {
    const wrapper = mountControlPanel();

    await wrapper.findAll("button.layout-option")[0].trigger("click");

    expect(wrapper.emitted("selectLayout")?.[0]).toEqual(["2x1"]);
  });
});
