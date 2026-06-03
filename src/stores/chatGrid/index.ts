import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { LAYOUT_GRIDS, LAYOUT_OPTIONS, type Layout } from "../../constants";
import { getLocationSearch, writeClipboardText } from "../../utils/browser";
import { applyQueryParamsToSnapshot } from "../../utils/query";
import { swapValues } from "../../utils/reorder";
import { buildLiveChatUrl } from "../../utils/youtube";
import { buildCurrentShareUrl, getEmbedDomain, pushShareUrl } from "./browser";
import { applyDraftValue, normalizeVideoValues, setDraftValueAt } from "./mutations";
import {
  buildLoadedStatus,
  getVisibleValues,
  getWindowPlaceholderText,
  shouldStartInEditMode,
} from "./selectors";
import { createInitialChatGridState } from "./state";

export const useChatGridStore = defineStore("chatGrid", () => {
  const initialState = createInitialChatGridState();
  const currentLayout = ref<Layout>(initialState.currentLayout);
  const values = ref<string[]>(initialState.values);
  const status = ref(initialState.status);
  const controlsHidden = ref(initialState.controlsHidden);
  const helpOpen = ref(initialState.helpOpen);
  const editMode = ref(initialState.editMode);
  const draggedIndex = ref<number | null>(initialState.draggedIndex);
  const draftValues = ref<string[]>(initialState.draftValues);

  const layoutOptions = LAYOUT_OPTIONS;
  const layoutGrids = LAYOUT_GRIDS;
  const visibleValues = computed(() => getVisibleValues(currentLayout.value, values.value));
  const shareUrl = computed(() => buildCurrentShareUrl(currentLayout.value, values.value));

  function initialize() {
    const snapshot = applyQueryParamsToSnapshot(getLocationSearch(), {
      layout: initialState.currentLayout,
      values: values.value,
    });

    currentLayout.value = snapshot.layout;
    values.value = normalizeVideoValues(snapshot.values);
    applyChats();

    if (shouldStartInEditMode(currentLayout.value, values.value)) {
      draftValues.value = [...values.value];
      editMode.value = true;
    }
  }

  function setLayout(layout: Layout) {
    currentLayout.value = layout;
    applyChats();
    syncShareUrl();
  }

  function applyChats() {
    values.value = normalizeVideoValues(values.value);
    status.value = buildLoadedStatus(currentLayout.value, values.value);
  }

  async function copyShareUrl() {
    try {
      await writeClipboardText(shareUrl.value);
      status.value = "共有URLをコピーしました";
    } catch {
      status.value = "共有URLをコピーできませんでした";
    }
  }

  function setDraftValue(index: number, value: string) {
    draftValues.value = setDraftValueAt(draftValues.value, index, value);
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
    syncShareUrl();
  }

  function addDraftToWindow(index: number) {
    const result = applyDraftValue(values.value, draftValues.value, index);

    if (!result.accepted) {
      status.value = result.error;
      return;
    }

    values.value = result.values;
    draftValues.value = result.draftValues;
    applyChats();
    syncShareUrl();
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
    if (editMode.value) return;
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
    return getWindowPlaceholderText(index, Boolean(getEmbedDomain()));
  }

  function syncShareUrl() {
    pushShareUrl(currentLayout.value, shareUrl.value);
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
    setDraftValue,
    setLayout,
    showControls,
    startDrag,
    toggleEditMode,
  };
});
