import { LAYOUTS, type Layout } from "../../constants";
import { extractYouTubeVideoId } from "../../utils/youtube";

export function getVisibleValues(layout: Layout, values: string[]) {
  return values.slice(0, LAYOUTS[layout]);
}

export function countLoadedChats(layout: Layout, values: string[]) {
  return getVisibleValues(layout, values).filter((value) => extractYouTubeVideoId(value)).length;
}

export function buildLoadedStatus(layout: Layout, values: string[]) {
  return `読み込み: ${countLoadedChats(layout, values)}件`;
}

export function shouldStartInEditMode(layout: Layout, values: string[]) {
  return getVisibleValues(layout, values).every((value) => !value);
}

export function getWindowPlaceholderText(index: number, hasEmbedDomain: boolean) {
  return hasEmbedDomain
    ? `w${index + 1} にYouTube URLまたは動画IDを入力`
    : "file://ではembed_domainを作れません。HTTPサーバー経由で開いてください。";
}
