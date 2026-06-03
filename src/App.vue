<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onMounted, onUnmounted } from "vue";
import ChatCell from "./components/ChatCell.vue";
import ControlPanel from "./components/ControlPanel.vue";
import HelpModal from "./components/HelpModal.vue";
import { useChatGridStore } from "./stores/chatGrid";

const repoUrl = "https://github.com/aozora0000/multicom";
const promoUrl = "https://aozora0000.github.io/multicom/";

const store = useChatGridStore();
const { controlsHidden, currentLayout, draggedIndex, draftValues, editMode, helpOpen, status, visibleValues } =
  storeToRefs(store);

onMounted(() => {
  store.initialize();
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && helpOpen.value) {
    store.closeHelp();
    return;
  }

  if (event.key === "Escape" && controlsHidden.value) {
    store.showControls();
  }
}
</script>

<template>
  <div class="app" :class="{ 'controls-hidden': controlsHidden }">
    <ControlPanel
      :current-layout="currentLayout"
      :edit-mode="editMode"
      :layout-grids="store.layoutGrids"
      :layout-options="store.layoutOptions"
      :promo-url="promoUrl"
      :repo-url="repoUrl"
      :share-url="store.shareUrl"
      :status="status"
      @copy-share-url="store.copyShareUrl"
      @hide-controls="store.hideControls"
      @open-help="store.openHelp"
      @select-layout="store.setLayout"
      @toggle-edit-mode="store.toggleEditMode"
    />

    <button
      type="button"
      class="restore-controls"
      title="操作欄を表示 / Escでも復帰"
      data-tooltip="隠した操作欄を表示"
      @click="store.showControls"
    >
      操作欄を表示
    </button>

    <main class="stage" :class="`layout-${currentLayout}`">
      <ChatCell
        v-for="(value, index) in visibleValues"
        :key="index"
        :draft-value="draftValues[index]"
        :edit-mode="editMode"
        :iframe-url="store.getIframeUrl(value)"
        :index="index"
        :is-dragging="draggedIndex === index"
        :placeholder-text="store.getPlaceholderText(index)"
        @cancel-drag="store.cancelDrag"
        @drop-on="store.dropOn"
        @start-drag="store.startDrag"
        @submit-draft="store.addDraftToWindow"
        @update-draft="store.setDraftValue"
      />
    </main>

    <HelpModal v-if="helpOpen" @close="store.closeHelp()" />
  </div>
</template>
