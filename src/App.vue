<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onMounted, onUnmounted, ref } from "vue";
import type { Layout } from "./constants";
import { useChatGridStore } from "./stores/chatGrid";

const store = useChatGridStore();
const { controlsHidden, currentLayout, draggedIndex, draftValues, editMode, status, visibleValues } =
  storeToRefs(store);
const layoutMenuRef = ref<HTMLDetailsElement | null>(null);

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

function selectLayout(layout: Layout) {
  store.setLayout(layout);
  layoutMenuRef.value?.removeAttribute("open");
}

function getLayoutIconStyle(layout: Layout) {
  const grid = store.layoutGrids[layout];
  return {
    gridTemplateColumns: `repeat(${grid.columns}, 1fr)`,
    gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
  };
}
</script>

<template>
  <div class="app" :class="{ 'controls-hidden': controlsHidden }">
    <section class="controls">
      <div class="top-row">
        <div class="top-copy">
          <span class="title">YouTubeコメントを複数窓で見るやつ</span>
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
        <div class="layout-select-wrap">
          <span>レイアウト</span>
          <details ref="layoutMenuRef" class="layout-menu">
            <summary class="layout-menu-trigger" data-tooltip="レイアウトを変更">
              <span
                class="layout-icon"
                aria-hidden="true"
                :style="getLayoutIconStyle(currentLayout)"
              >
                <span
                  v-for="cellIndex in store.layoutGrids[currentLayout].columns * store.layoutGrids[currentLayout].rows"
                  :key="cellIndex"
                ></span>
              </span>
              <span>{{ currentLayout }}</span>
            </summary>
            <div class="layout-menu-options" role="listbox" aria-label="レイアウト">
              <button
                v-for="layout in store.layoutOptions"
                :key="layout"
                type="button"
                class="layout-option"
                :class="{ selected: currentLayout === layout }"
                :aria-selected="currentLayout === layout"
                role="option"
                @click="selectLayout(layout)"
              >
                <span class="layout-icon" aria-hidden="true" :style="getLayoutIconStyle(layout)">
                  <span
                    v-for="cellIndex in store.layoutGrids[layout].columns * store.layoutGrids[layout].rows"
                    :key="cellIndex"
                  ></span>
                </span>
                <span>{{ layout }}</span>
              </button>
            </div>
          </details>
        </div>
        <button
          type="button"
          :class="{ active: editMode }"
          data-tooltip="枠内でURL変更、枠をD&Dで場所入れ替え"
          @click="store.toggleEditMode"
        >
          {{ editMode ? "編集終了" : "編集" }}
        </button>
        <button type="button" data-tooltip="操作方法をモーダルで表示" @click="store.openHelp()">使い方</button>
        <button
          type="button"
          data-tooltip="復帰ボタンまたはEscで操作欄を表示"
          @click="store.hideControls"
        >
          操作欄を隠す
        </button>
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
      data-tooltip="隠した操作欄を表示"
      @click="store.showControls"
    >
      操作欄を表示
    </button>

    <main class="stage" :class="`layout-${currentLayout}`">
      <div
        v-for="(value, index) in visibleValues"
        :key="index"
        class="cell"
        :class="{ editing: editMode, dragging: draggedIndex === index }"
        :data-tooltip="editMode ? '枠をドラッグ&ドロップで位置を入れ替え' : undefined"
        :draggable="editMode"
        @dragstart="store.startDrag(index)"
        @dragover.prevent
        @drop.prevent="store.dropOn(index)"
        @dragend="store.cancelDrag"
      >
        <iframe
          v-if="store.getIframeUrl(value)"
          :src="store.getIframeUrl(value)"
          :title="`YouTube Live Chat ${index + 1}`"
          allow="clipboard-write"
        ></iframe>
        <div v-else class="placeholder">
          <p>{{ editMode ? store.getPlaceholderText(index) : `w${index + 1} は未設定です` }}</p>
        </div>
        <div
          v-if="editMode"
          class="cell-edit-layer"
        >
          <div class="cell-drag-label">w{{ index + 1 }} / ドラッグで移動</div>
          <form
            class="cell-editor"
            @submit.prevent="store.addDraftToWindow(index)"
            @mousedown.stop
            @dragstart.stop
          >
            <label :for="`cell-w${index + 1}`">w{{ index + 1 }}</label>
            <input
              :id="`cell-w${index + 1}`"
              v-model.trim="draftValues[index]"
              :aria-label="`w${index + 1} のYouTube URLまたは動画ID`"
              placeholder="動画ID / YouTube URL"
              autocomplete="off"
              @dragstart.stop
            />
            <button type="submit" data-tooltip="この枠のURLを更新" @dragstart.stop>更新</button>
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
            <button
              type="button"
              class="modal-close"
              aria-label="使い方を閉じる"
              data-tooltip="使い方を閉じる"
              @click="store.closeHelp()"
            >
              閉じる
            </button>
          </div>

          <div class="help-modal-body">
            <section>
              <h3>コメントを表示する</h3>
              <p>
                アイコン付きのレイアウトメニューで表示形式を選び、編集を押します。各枠の入力欄にYouTubeの動画IDまたはURLを入力して更新します。
              </p>
            </section>
            <section>
              <h3>IDを変更する</h3>
              <p>
                編集モード中は各枠の半透明レイヤー上でIDやURLを変更できます。入力欄を空にして更新すると、その枠を未設定にできます。
              </p>
            </section>
            <section>
              <h3>配置を変える</h3>
              <p>
                編集モード中に枠そのものをドラッグ&ドロップすると、表示枠の位置を入れ替えられます。
              </p>
            </section>
            <section>
              <h3>共有する</h3>
              <p>
                レイアウト変更、D&D、枠内の更新でURLバーが更新されます。共有URLをクリックすると現在のURLをコピーできます。
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
