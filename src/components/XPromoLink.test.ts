// @vitest-environment jsdom
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import XPromoLink from "./XPromoLink.vue";

describe("XPromoLink", () => {
  it("renders an external X intent link with promotion text and app URL", () => {
    const wrapper = mount(XPromoLink, {
      props: { href: "https://aozora0000.github.io/multicom/", text: "YouTubeコメントを複数窓で見るやつ" },
    });
    const href = wrapper.attributes("href") || "";
    const url = new URL(href);

    expect(wrapper.text()).toContain("Xで宣伝");
    expect(url.origin + url.pathname).toBe("https://twitter.com/intent/tweet");
    expect(url.searchParams.get("text")).toBe("YouTubeコメントを複数窓で見るやつ");
    expect(url.searchParams.get("url")).toBe("https://aozora0000.github.io/multicom/");
    expect(wrapper.attributes("target")).toBe("_blank");
    expect(wrapper.find("svg").exists()).toBe(true);
  });

  it("renders a custom label and share text", async () => {
    const wrapper = mount(XPromoLink, {
      props: { href: "https://example.test/?l=2x2&w1=abc123ABC-_", label: "今これ見てる", text: "今これ見てる" },
    });
    const url = new URL(wrapper.attributes("href") || "");

    expect(wrapper.text()).toContain("今これ見てる");
    expect(url.searchParams.get("text")).toBe("今これ見てる");
    expect(url.searchParams.get("url")).toBe("https://example.test/?l=2x2&w1=abc123ABC-_");

    await wrapper.setProps({ href: "https://example.test/?l=1x2&w1=changed" });

    expect(new URL(wrapper.attributes("href") || "").searchParams.get("url")).toBe(
      "https://example.test/?l=1x2&w1=changed",
    );
  });
});
