// @vitest-environment jsdom
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import GithubLink from "./GithubLink.vue";

describe("GithubLink", () => {
  it("renders an external GitHub link with an icon", () => {
    const wrapper = mount(GithubLink, { props: { href: "https://github.com/aozora0000/multicom" } });

    expect(wrapper.text()).toContain("GitHub");
    expect(wrapper.attributes("href")).toBe("https://github.com/aozora0000/multicom");
    expect(wrapper.attributes("target")).toBe("_blank");
    expect(wrapper.find("svg").exists()).toBe(true);
  });

  it("renders a tooltip when provided", () => {
    const wrapper = mount(GithubLink, {
      props: { href: "https://github.com/aozora0000/multicom", tooltip: "GitHubリポジトリを開く" },
    });

    expect(wrapper.attributes("data-tooltip")).toBe("GitHubリポジトリを開く");
  });
});
