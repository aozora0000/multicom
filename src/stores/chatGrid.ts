import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { DEFAULT_LAYOUT, LAYOUT_GRIDS, LAYOUT_OPTIONS, LAYOUTS, type Layout } from "../constants";
import { applyQueryParamsToSnapshot } from "../utils/query";
import { swapValues } from "../utils/reorder";
import { buildShareUrl } from "../utils/share";
import { normalizeValues } from "../utils/values";
import { buildLiveChatUrl, extractYouTubeVideoId, normalizeYouTubeInput } from "../utils/youtube";

export const useChatGridStore = defineStore("chatGrid", () => {
  const currentLayout = ref<Layout>(DEFAULT_LAYOUT);
  const values = ref<string[]>(normalizeValues([]));
  const status = ref("");
  const controlsHidden = ref(false);
  const helpOpen = ref(false);
  const editMode = ref(false);
  const draggedIndex = ref<number | null>(null);
  const draftValues = ref<string[]>(normalizeValues([]));

  const layoutOptions = LAYOUT_OPTIONS;
  const layoutGrids = LAYOUT_GRIDS;
  const visibleValues = computed(() => values.value.slice(0, LAYOUTS[currentLayout.value]));
  const shareUrl = computed(() => buildShareUrl(location.href, currentLayout.value, values.value));

  function initialize() {
    const snapshot = applyQueryParamsToSnapshot(location.search, {
      layout: DEFAULT_LAYOUT,
      values: values.value,
    });

    currentLayout.value = snapshot.layout;
    values.value = normalizeVideoValues(snapshot.values);
    applyChats();
  }

  function setLayout(layout: Layout) {
    currentLayout.value = layout;
    applyChats();
    pushShareUrl();
  }

  function applyChats() {
    values.value = normalizeVideoValues(values.value);
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
    if (!editMode.value) return;
    draggedIndex.value = index;
  }

  function dropOn(index: number) {
    if (!editMode.value || draggedIndex.value === null) return;
    values.value = swapValues(values.value, draggedIndex.value, index);
    draftValues.value = swapValues(draftValues.value, draggedIndex.value, index);
    draggedIndex.value = null;
    applyChats();
    pushShareUrl();
  }

  function addDraftToWindow(index: number) {
    const value = String(draftValues.value[index] || "").trim();
    if (!value) {
      values.value[index] = "";
      applyChats();
      pushShareUrl();
      return;
    }

    if (!extractYouTubeVideoId(value)) {
      status.value = `w${index + 1} のURLを認識できませんでした`;
      return;
    }

    const normalizedValue = normalizeYouTubeInput(value);
    values.value[index] = normalizedValue;
    draftValues.value[index] = normalizedValue;
    applyChats();
    pushShareUrl();
  }

  function toggleEditMode() {
    if (editMode.value) {
      editMode.value = false;
      draggedIndex.value = null;
      return;
    }

    draftValues.value = [...values.value];
    editMode.value = true;
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

  function openHelp() {
    helpOpen.value = true;
  }

  function closeHelp() {
    helpOpen.value = false;
  }

  function getIframeUrl(value: string) {
    return buildLiveChatUrl(value, getEmbedDomain());
  }

  function getPlaceholderText(index: number) {
    return getEmbedDomain()
      ? `w${index + 1} にYouTube URLまたは動画IDを入力`
      : "file://ではembed_domainを作れません。HTTPサーバー経由で開いてください。";
  }

  function pushShareUrl() {
    const url = shareUrl.value;
    if (url !== location.href) {
      history.pushState({ layout: currentLayout.value }, "", url);
    }
  }

  return {
    controlsHidden,
    currentLayout,
    draggedIndex,
    draftValues,
    editMode,
    helpOpen,
    layoutOptions,
    layoutGrids,
    shareUrl,
    status,
    values,
    visibleValues,
    addDraftToWindow,
    applyChats,
    copyShareUrl,
    cancelDrag,
    closeHelp,
    getIframeUrl,
    getPlaceholderText,
    hideControls,
    initialize,
    openHelp,
    dropOn,
    setLayout,
    showControls,
    startDrag,
    toggleEditMode,
  };
});

function getEmbedDomain() {
  return location.hostname || "";
}

function normalizeVideoValues(values: string[]) {
  return normalizeValues(values).map((value) => normalizeYouTubeInput(value));
}
