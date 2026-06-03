import type { Layout } from "../../constants";
import { getCurrentHref, getLocationHostname, pushUrlIfChanged } from "../../utils/browser";
import { buildShareUrl } from "../../utils/share";

export function getEmbedDomain() {
  return getLocationHostname();
}

export function buildCurrentShareUrl(layout: Layout, values: string[]) {
  return buildShareUrl(getCurrentHref(), layout, values);
}

export function pushShareUrl(layout: Layout, url: string) {
  pushUrlIfChanged({ layout }, url);
}
