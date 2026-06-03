// @vitest-environment jsdom
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { LAYOUT_GRIDS, VTUBER_LAYOUT_OPTIONS, type Layout } from "../constants";
import ControlPanel from "./ControlPanel.vue";

function mountControlPanel(props = {}) {
  return mount(ControlPanel, {
    props: {
      currentLayout: "2x2" as Layout,
      editMode: false,
      effectiveVtuberLayoutId: 6,
      layoutGrids: LAYOUT_GRIDS,
      layoutOptions: ["2x1", "2x2"] as Layout[],
      promoUrl: "https://aozora0000.github.io/multicom/",
      repoUrl: "https://github.com/aozora0000/multicom",
      shareUrl: "https://example.test/?l=2x2",
      status: "読み込み: 1件",
      vtuberLayoutOptions: VTUBER_LAYOUT_OPTIONS,
      vtuberLayoutSelection: "auto",
      vtuberUrl: "https://vtuber.neocities.org/#/l-6/1:a",
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
    expect(wrapper.find(".x-promo-link").attributes("href")).toContain("https://twitter.com/intent/tweet");
    expect(wrapper.find(".x-now-link").text()).toContain("今これ見てる");
    expect(new URL(wrapper.find(".x-now-link").attributes("href") || "").searchParams.get("url")).toBe(
      "https://example.test/?l=2x2",
    );
    expect(new URL(wrapper.find(".x-now-link").attributes("href") || "").searchParams.get("text")).toBe(
      "今これ見てる YouTubeコメントを複数窓で見るやつ",
    );
    expect(wrapper.find(".x-now-link").attributes("data-tooltip")).toBe("現在の共有URLをXに投稿");
    expect(wrapper.find(".x-promo-link:not(.x-now-link)").attributes("data-tooltip")).toBe("アプリをXで宣伝");
    expect(wrapper.find(".github-link").attributes("href")).toBe("https://github.com/aozora0000/multicom");
    expect(wrapper.find(".github-link").attributes("data-tooltip")).toBe("GitHubリポジトリを開く");
    expect(wrapper.find(".vtuber-link").attributes("href")).toBe("https://vtuber.neocities.org/#/l-6/1:a");
    expect(wrapper.find(".vtuber-link").text()).toBe("動画を開く");
    expect(wrapper.find(".vtuber-link").attributes("data-tooltip")).toBe(
      "YouTubeを複数窓でみるやつで動画を開く",
    );
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

  it("forwards vtuber layout selection", async () => {
    const wrapper = mountControlPanel();

    await wrapper.find('button[aria-label="レイアウト3"]').trigger("click");

    expect(wrapper.emitted("selectVtuberLayout")?.[0]).toEqual([3]);
  });
});
