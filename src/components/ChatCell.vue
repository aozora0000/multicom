<script setup lang="ts">
defineProps<{
  draftValue: string;
  iframeUrl: string;
  index: number;
  isDragging: boolean;
  editMode: boolean;
  placeholderText: string;
}>();

const emit = defineEmits<{
  cancelDrag: [];
  dropOn: [index: number];
  startDrag: [index: number];
  submitDraft: [index: number];
  updateDraft: [index: number, value: string];
}>();
</script>

<template>
  <div
    class="cell"
    :class="{ editing: editMode, dragging: isDragging }"
    :data-tooltip="editMode ? '枠をドラッグ&ドロップで位置を入れ替え' : undefined"
    :draggable="editMode"
    @dragstart="emit('startDrag', index)"
    @dragover.prevent
    @drop.prevent="emit('dropOn', index)"
    @dragend="emit('cancelDrag')"
  >
    <iframe
      v-if="iframeUrl"
      :src="iframeUrl"
      :title="`YouTube Live Chat ${index + 1}`"
      allow="clipboard-write"
    ></iframe>
    <div v-else class="placeholder">
      <p>{{ editMode ? placeholderText : `w${index + 1} は未設定です` }}</p>
    </div>
    <div v-if="editMode" class="cell-edit-layer">
      <div class="cell-drag-label">w{{ index + 1 }} / ドラッグで移動</div>
      <form
        class="cell-editor"
        @submit.prevent="emit('submitDraft', index)"
        @mousedown.stop
        @dragstart.stop
      >
        <label :for="`cell-w${index + 1}`">w{{ index + 1 }}</label>
        <input
          :id="`cell-w${index + 1}`"
          :value="draftValue"
          :aria-label="`w${index + 1} のYouTube URLまたは動画ID`"
          placeholder="動画ID / YouTube URL"
          autocomplete="off"
          @input="emit('updateDraft', index, ($event.target as HTMLInputElement).value.trim())"
          @dragstart.stop
        />
        <button type="submit" data-tooltip="この枠のURLを更新" @dragstart.stop>更新</button>
      </form>
    </div>
  </div>
</template>
