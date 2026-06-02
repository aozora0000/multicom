import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { DEFAULT_LAYOUT, LAYOUT_OPTIONS, LAYOUTS, type Layout } from "../constants";
import { applyQueryParamsToSnapshot } from "../utils/query";
import { swapValues } from "../utils/reorder";
import { buildShareUrl } from "../utils/share";
import { buildLiveChatUrl, extractYouTubeVideoId } from "../utils/youtube";

export const useChatGridStore = defineStore("chatGrid", () => {
  const currentLayout = ref<Layout>(DEFAULT_LAYOUT);
  const values = ref<string[]>(["", "", "", ""]);
  const status = ref("");
  const controlsHidden = ref(false);
  const draggedIndex = ref<number | null>(null);

  const layoutOptions = LAYOUT_OPTIONS;
  const visibleValues = computed(() => values.value.slice(0, LAYOUTS[currentLayout.value]));
  const shareUrl = computed(() => buildShareUrl(location.href, currentLayout.value, values.value));

  function initialize() {
    const snapshot = applyQueryParamsToSnapshot(location.search, {
      layout: DEFAULT_LAYOUT,
      values: values.value,
    });

    currentLayout.value = snapshot.layout;
    values.value = snapshot.values;
    applyChats();
  }

  function setLayout(layout: Layout) {
    currentLayout.value = layout;
    applyChats();
  }

  function applyChats() {
    const loadedCount = visibleValues.value.filter((value) => extractYouTubeVideoId(value)).length;
    status.value = `読み込み: ${loadedCount}件`;
  }

  async function copyShareUrl() {
    const url = shareUrl.value;

    try {
      await navigator.clipboard.writeText(url);
      status.value = "共有URLをコピーしました";
    } catch {
      status.value = "共有URLをコピーできませんでした";
    }
  }

  function startDrag(index: number) {
    draggedIndex.value = index;
  }

  function dropOn(index: number) {
    if (draggedIndex.value === null) return;
    values.value = swapValues(values.value, draggedIndex.value, index);
    draggedIndex.value = null;
    applyChats();
  }

  function cancelDrag() {
    draggedIndex.value = null;
  }

  function hideControls() {
    controlsHidden.value = true;
  }

  function showControls() {
    controlsHidden.value = false;
  }

  function getIframeUrl(value: string) {
    return buildLiveChatUrl(value, getEmbedDomain());
  }

  function getPlaceholderText(index: number) {
    return getEmbedDomain()
      ? `w${index + 1} にYouTube URLまたは動画IDを入力`
      : "file://ではembed_domainを作れません。HTTPサーバー経由で開いてください。";
  }

  return {
    controlsHidden,
    currentLayout,
    draggedIndex,
    layoutOptions,
    shareUrl,
    status,
    values,
    visibleValues,
    applyChats,
    copyShareUrl,
    cancelDrag,
    getIframeUrl,
    getPlaceholderText,
    hideControls,
    initialize,
    dropOn,
    setLayout,
    showControls,
    startDrag,
  };
});

function getEmbedDomain() {
  return location.hostname || "";
}
