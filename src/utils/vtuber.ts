import {
  AUTO_VTUBER_LAYOUT_BY_LAYOUT,
  LAYOUTS,
  VTUBER_LAYOUTS,
  type Layout,
  type VtuberLayoutId,
} from "../constants";
import { extractYouTubeVideoId } from "./youtube";

export const VTUBER_BASE_URL = "https://vtuber.neocities.org/";

export function getAutoVtuberLayoutId(layout: Layout) {
  return AUTO_VTUBER_LAYOUT_BY_LAYOUT[layout];
}

export function buildVtuberUrl(layout: Layout, values: string[], layoutId = getAutoVtuberLayoutId(layout)) {
  const slots = VTUBER_LAYOUTS[layoutId].slots;
  const entries = values
    .slice(0, Math.min(LAYOUTS[layout], slots))
    .map((value, index) => {
      if (!value) return "";
      const id = extractYouTubeVideoId(value) || value;
      return `${index + 1}:${encodeURIComponent(id)}`;
    })
    .filter(Boolean);

  return `${VTUBER_BASE_URL}#/l-${layoutId}/${entries.join(",")}`;
}
