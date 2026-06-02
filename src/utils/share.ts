import { LAYOUTS, type Layout } from "../constants";
import { extractYouTubeVideoId } from "./youtube";

export function buildShareUrl(href: string, layout: Layout, values: string[]) {
  const url = new URL(href);
  url.search = "";
  url.hash = "";

  url.searchParams.set("l", layout);

  values.slice(0, LAYOUTS[layout]).forEach((value, index) => {
    if (!value) return;
    const id = extractYouTubeVideoId(value);
    url.searchParams.set(`w${index + 1}`, id || value);
  });

  return url.toString();
}
