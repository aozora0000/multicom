<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onMounted, onUnmounted } from "vue";
import { useChatGridStore } from "./stores/chatGrid";

const store = useChatGridStore();
const { controlsHidden, currentLayout, draggedIndex, draftValues, status, values, visibleValues } = storeToRefs(store);

onMounted(() => {
  store.initialize();
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && store.helpOpen) {
    store.closeHelp();
    return;
  }

  if (event.key === "Escape" && store.controlsHidden) {
    store.showControls();
  }
}
</script>

<template>
  <div class="app" :class="{ 'controls-hidden': controlsHidden }">
    <section class="controls">
      <div class="top-row">
        <div class="top-copy">
          <span class="title">YouTubeコメントを複数窓で見るやつ</span>
          <span class="hint">URL引数: ?l=2x2&w1=...&w2=...&w3=...&w4=...</span>
        </div>
        <a
          class="repo-link"
          href="https://github.com/aozora0000/multicom"
          target="_blank"
          rel="noreferrer"
        >
          <svg class="repo-link-icon" viewBox="0 0 16 16" aria-hidden="true">
            <path
              fill="currentColor"
              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82A7.65 7.65 0 0 1 8 3.37c.68 0 1.36.09 2 .26 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
            />
          </svg>
          GitHub
        </a>
      </div>

      <div class="button-row">
        <label class="layout-select-wrap">
          <span>レイアウト</span>
          <select v-model="currentLayout" @change="store.setLayout(currentLayout)">
            <option v-for="layout in store.layoutOptions" :key="layout" :value="layout">
              {{ layout }}
            </option>
          </select>
        </label>
        <button type="button" @click="store.applyChats">反映</button>
        <button type="button" @click="store.openHelp()">使い方</button>
        <button
          type="button"
          data-tooltip="復帰ボタンまたはEscで操作欄を表示"
          @click="store.hideControls"
        >
          操作欄を隠す
        </button>
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
        <span class="status-url">{{ store.shareUrl }}</span>
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
          <form class="placeholder-content" @submit.prevent="store.addDraftToWindow(index)">
            <p>{{ store.getPlaceholderText(index) }}</p>
            <div class="placeholder-add-row">
              <input
                v-model.trim="draftValues[index]"
                :aria-label="`w${index + 1} に追加するYouTube URLまたは動画ID`"
                placeholder="動画ID / YouTube URL"
                autocomplete="off"
              />
              <button type="submit">追加</button>
            </div>
          </form>
        </div>
      </div>
    </main>

    <Teleport to="body">
      <div v-if="store.helpOpen" class="modal-backdrop" role="presentation" @click="store.closeHelp()">
        <section
          class="help-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="help-title"
          @click.stop
        >
          <div class="help-modal-header">
            <h2 id="help-title">使い方</h2>
            <button type="button" class="modal-close" aria-label="使い方を閉じる" @click="store.closeHelp()">
              閉じる
            </button>
          </div>

          <div class="help-modal-body">
            <section>
              <h3>コメントを表示する</h3>
              <p>
                上部の w1 から w8 にYouTubeの動画IDまたはURLを入力し、反映を押します。認識できたURLは動画IDだけに変換されます。
              </p>
            </section>
            <section>
              <h3>空枠から追加する</h3>
              <p>
                空の表示枠にある入力欄へYouTube URLまたは動画IDを入れて、追加を押すとその枠にコメントを読み込みます。
              </p>
            </section>
            <section>
              <h3>配置を変える</h3>
              <p>
                レイアウトから表示形式を選べます。入力ブロックをドラッグ&ドロップすると、対応する表示枠の位置を入れ替えられます。
              </p>
            </section>
            <section>
              <h3>共有する</h3>
              <p>
                レイアウト変更、D&D、空枠からの追加でURLバーが更新されます。共有URLをクリックすると現在のURLをコピーできます。
              </p>
            </section>
            <section>
              <h3>操作欄を隠す</h3>
              <p>
                操作欄を隠すを押すと表示領域を広げられます。画面上部の復帰ボタンまたは Esc で操作欄を戻せます。
              </p>
            </section>
          </div>
        </section>
      </div>
    </Teleport>
  </div>
</template>
