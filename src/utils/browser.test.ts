import { afterEach, describe, expect, it, vi } from "vitest";
import { getCurrentHref, getLocationHostname, getLocationSearch, pushUrlIfChanged, writeClipboardText } from "./browser";

function stubBrowser(url = "https://example.test/?l=2x1") {
  const currentUrl = new URL(url);
  const pushState = vi.fn((_state: unknown, _title: string, nextUrl?: string | URL | null) => {
    if (!nextUrl) return;
    currentUrl.href = new URL(String(nextUrl), currentUrl.href).href;
  });
  const writeText = vi.fn();

  vi.stubGlobal("location", currentUrl);
  vi.stubGlobal("history", { pushState });
  vi.stubGlobal("navigator", { clipboard: { writeText } });

  return { pushState, writeText };
}

describe("browser utilities", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("reads current URL parts", () => {
    stubBrowser("https://example.test/path?l=2x1");

    expect(getCurrentHref()).toBe("https://example.test/path?l=2x1");
    expect(getLocationSearch()).toBe("?l=2x1");
    expect(getLocationHostname()).toBe("example.test");
  });

  it("pushes a URL only when it differs from the current URL", () => {
    const { pushState } = stubBrowser("https://example.test/");

    pushUrlIfChanged({ layout: "2x1" }, "https://example.test/?l=2x1");
    pushUrlIfChanged({ layout: "2x1" }, "https://example.test/?l=2x1");

    expect(pushState).toHaveBeenCalledTimes(1);
    expect(pushState).toHaveBeenCalledWith({ layout: "2x1" }, "", "https://example.test/?l=2x1");
  });

  it("writes text to clipboard", async () => {
    const { writeText } = stubBrowser();

    await writeClipboardText("https://example.test/");

    expect(writeText).toHaveBeenCalledWith("https://example.test/");
  });
});
