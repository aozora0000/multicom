import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useChatGridStore } from "./chatGrid";

function stubBrowserUrl(url = "https://example.test/") {
  const currentUrl = new URL(url);
  const pushState = vi.fn((_state: unknown, _title: string, nextUrl?: string | URL | null) => {
    if (!nextUrl) return;
    const resolved = new URL(String(nextUrl), currentUrl.href);
    currentUrl.href = resolved.href;
  });

  vi.stubGlobal("location", currentUrl);
  vi.stubGlobal("history", { pushState });

  return { pushState, currentUrl };
}

describe("chatGrid store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.unstubAllGlobals();
  });

  it("initializes from query params and normalizes loaded URLs", () => {
    stubBrowserUrl("https://example.test/?l=2x1&w1=https%3A%2F%2Fyoutu.be%2FdQw4w9WgXcQ&w2=abc123ABC-_");
    const store = useChatGridStore();

    store.initialize();

    expect(store.currentLayout).toBe("2x1");
    expect(store.values.slice(0, 2)).toEqual(["dQw4w9WgXcQ", "abc123ABC-_"]);
    expect(store.status).toBe("読み込み: 2件");
    expect(store.editMode).toBe(false);
  });

  it("starts in edit mode when all visible windows are empty", () => {
    stubBrowserUrl("https://example.test/?l=2x1");
    const store = useChatGridStore();

    store.initialize();

    expect(store.editMode).toBe(true);
    expect(store.draftValues).toEqual(store.values);
  });

  it("does not hide controls while editing", () => {
    stubBrowserUrl("https://example.test/?w1=dQw4w9WgXcQ");
    const store = useChatGridStore();
    store.initialize();
    store.toggleEditMode();

    store.hideControls();

    expect(store.editMode).toBe(true);
    expect(store.controlsHidden).toBe(false);
  });

  it("updates one draft through an action and pushes a normalized share URL", () => {
    const { pushState } = stubBrowserUrl("https://example.test/");
    const store = useChatGridStore();
    store.initialize();

    store.setDraftValue(0, "https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    store.addDraftToWindow(0);

    expect(store.values[0]).toBe("dQw4w9WgXcQ");
    expect(store.draftValues[0]).toBe("dQw4w9WgXcQ");
    expect(store.status).toBe("読み込み: 1件");
    expect(pushState).toHaveBeenLastCalledWith({ layout: "2x2" }, "", "https://example.test/?l=2x2&w1=dQw4w9WgXcQ");
  });

  it("clears one window through an empty draft", () => {
    const { pushState } = stubBrowserUrl("https://example.test/?w1=dQw4w9WgXcQ&w2=abc123ABC-_");
    const store = useChatGridStore();
    store.initialize();
    store.toggleEditMode();

    store.setDraftValue(0, "");
    store.addDraftToWindow(0);

    expect(store.values.slice(0, 2)).toEqual(["", "abc123ABC-_"]);
    expect(store.draftValues.slice(0, 2)).toEqual(["", "abc123ABC-_"]);
    expect(store.status).toBe("読み込み: 1件");
    expect(pushState).toHaveBeenLastCalledWith({ layout: "2x2" }, "", "https://example.test/?l=2x2&w2=abc123ABC-_");
  });

  it("swaps values and draft values while editing", () => {
    const { pushState } = stubBrowserUrl("https://example.test/?w1=dQw4w9WgXcQ&w2=abc123ABC-_");
    const store = useChatGridStore();
    store.initialize();
    store.toggleEditMode();

    store.startDrag(0);
    store.dropOn(1);

    expect(store.values.slice(0, 2)).toEqual(["abc123ABC-_", "dQw4w9WgXcQ"]);
    expect(store.draftValues.slice(0, 2)).toEqual(["abc123ABC-_", "dQw4w9WgXcQ"]);
    expect(store.draggedIndex).toBeNull();
    expect(pushState).toHaveBeenCalled();
  });
});
