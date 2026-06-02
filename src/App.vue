<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onMounted, onUnmounted } from "vue";
import { useChatGridStore } from "./stores/chatGrid";

const store = useChatGridStore();
const { controlsHidden, currentLayout, draggedIndex, layoutOptions, status, values, visibleValues } = storeToRefs(store);

onMounted(() => {
  store.initialize();
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && store.controlsHidden) {
    store.showControls();
  }
}
</script>

<template>
  <div class="app" :class="{ 'controls-hidden': controlsHidden }">
    <section class="controls">
      <div class="top-row">
        <span class="title">YouTubeコメントを複数窓で見るやつ</span>
        <span class="hint">URL引数: ?l=2x2&w1=...&w2=...&w3=...&w4=...</span>
      </div>

      <div class="button-row">
        <button
          v-for="layout in layoutOptions"
          :key="layout"
          type="button"
          :class="{ active: currentLayout === layout }"
          @click="store.setLayout(layout)"
        >
          {{ layout }}
        </button>
        <button type="button" @click="store.applyChats">反映</button>
        <button type="button" @click="store.hideControls">操作欄を隠す</button>
      </div>

      <div class="inputs">
        <div
          v-for="(_, index) in visibleValues"
          :key="index"
          class="input-wrap"
          :class="{ dragging: draggedIndex === index }"
          data-tooltip="ドラッグ&ドロップで位置を入れ替え"
          draggable="true"
          @dragstart="store.startDrag(index)"
          @dragover.prevent
          @drop.prevent="store.dropOn(index)"
          @dragend="store.cancelDrag"
        >
          <label :for="`w${index + 1}`">w{{ index + 1 }}</label>
          <input
            :id="`w${index + 1}`"
            v-model.trim="values[index]"
            placeholder="動画ID / YouTube URL / live_chat URL"
            autocomplete="off"
            @change="store.applyChats"
          />
        </div>
      </div>
      <div class="status">
        <span>{{ status }}</span>
        <span aria-hidden="true">/</span>
        <button
          type="button"
          class="status-share"
          data-tooltip="クリックで共有URLをコピー"
          @click="store.copyShareUrl"
        >
          共有URL
        </button>
      </div>
    </section>

    <button
      type="button"
      class="restore-controls"
      title="操作欄を表示 / Escでも復帰"
      @click="store.showControls"
    >
      操作欄を表示
    </button>

    <main class="stage" :class="`layout-${currentLayout}`">
      <div v-for="(value, index) in visibleValues" :key="index" class="cell">
        <iframe
          v-if="store.getIframeUrl(value)"
          :src="store.getIframeUrl(value)"
          :title="`YouTube Live Chat ${index + 1}`"
          allow="clipboard-write"
        ></iframe>
        <div v-else class="placeholder">
          {{ store.getPlaceholderText(index) }}
        </div>
      </div>
    </main>
  </div>
</template>
