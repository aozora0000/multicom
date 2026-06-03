// @vitest-environment jsdom
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import ChatCell from "./ChatCell.vue";

function mountChatCell(props = {}) {
  return mount(ChatCell, {
    props: {
      draftValue: "",
      editMode: false,
      iframeUrl: "",
      index: 0,
      isDragging: false,
      placeholderText: "w1 にYouTube URLまたは動画IDを入力",
      ...props,
    },
  });
}

describe("ChatCell", () => {
  it("renders an iframe when iframeUrl is provided", () => {
    const wrapper = mountChatCell({ iframeUrl: "https://www.youtube.com/live_chat?v=dQw4w9WgXcQ" });

    expect(wrapper.find("iframe").attributes("src")).toBe("https://www.youtube.com/live_chat?v=dQw4w9WgXcQ");
    expect(wrapper.text()).not.toContain("未設定");
  });

  it("renders placeholder text outside edit mode", () => {
    const wrapper = mountChatCell({ index: 2 });

    expect(wrapper.text()).toContain("w3 は未設定です");
  });

  it("renders editor and emits draft updates in edit mode", async () => {
    const wrapper = mountChatCell({ draftValue: "old", editMode: true, index: 1 });
    const input = wrapper.find("input");

    expect(wrapper.classes()).toContain("editing");
    expect(wrapper.text()).toContain("w2 / ドラッグで移動");

    await input.setValue("  dQw4w9WgXcQ  ");
    await wrapper.find("form").trigger("submit");

    expect(wrapper.emitted("updateDraft")?.[0]).toEqual([1, "dQw4w9WgXcQ"]);
    expect(wrapper.emitted("submitDraft")?.[0]).toEqual([1]);
  });

  it("emits drag events with its index", async () => {
    const wrapper = mountChatCell({ editMode: true, index: 3, isDragging: true });

    await wrapper.trigger("dragstart");
    await wrapper.trigger("drop");
    await wrapper.trigger("dragend");

    expect(wrapper.classes()).toContain("dragging");
    expect(wrapper.emitted("startDrag")?.[0]).toEqual([3]);
    expect(wrapper.emitted("dropOn")?.[0]).toEqual([3]);
    expect(wrapper.emitted("cancelDrag")?.[0]).toEqual([]);
  });
});
