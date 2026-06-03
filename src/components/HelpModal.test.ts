// @vitest-environment jsdom
import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it } from "vitest";
import HelpModal from "./HelpModal.vue";

describe("HelpModal", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders usage sections in a teleported dialog", () => {
    mount(HelpModal, { attachTo: document.body });

    expect(document.body.textContent).toContain("使い方");
    expect(document.body.textContent).toContain("コメントを表示する");
    expect(document.body.textContent).toContain("現在ライブ中の配信");
    expect(document.body.textContent).toContain("共有する");
    expect(document.body.textContent).toContain("外部ツールで開く");
    expect(document.body.textContent).toContain("リンク先サイトとは無関係");
  });

  it("emits close from the close button and backdrop", async () => {
    const wrapper = mount(HelpModal, { attachTo: document.body });

    await document.body.querySelector<HTMLButtonElement>(".modal-close")?.click();
    await document.body.querySelector<HTMLElement>(".modal-backdrop")?.click();

    expect(wrapper.emitted("close")).toHaveLength(2);
  });
});
