import { afterEach, describe, expect, it, vi } from "vitest";
import { buildCurrentShareUrl, getEmbedDomain, pushShareUrl } from "./browser";

function stubBrowser(url = "https://example.test/") {
  const currentUrl = new URL(url);
  const pushState = vi.fn((_state: unknown, _title: string, nextUrl?: string | URL | null) => {
    if (!nextUrl) return;
    currentUrl.href = new URL(String(nextUrl), currentUrl.href).href;
  });

  vi.stubGlobal("location", currentUrl);
  vi.stubGlobal("history", { pushState });

  return { pushState };
}

describe("chatGrid browser helpers", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns the embed domain", () => {
    stubBrowser("https://example.test/");

    expect(getEmbedDomain()).toBe("example.test");
  });

  it("builds and pushes chatGrid share URLs", () => {
    const { pushState } = stubBrowser("https://example.test/");
    const url = buildCurrentShareUrl("2x1", ["dQw4w9WgXcQ", ""]);

    expect(url).toBe("https://example.test/?l=2x1&w1=dQw4w9WgXcQ");

    pushShareUrl("2x1", url);

    expect(pushState).toHaveBeenCalledWith({ layout: "2x1" }, "", url);
  });
});
