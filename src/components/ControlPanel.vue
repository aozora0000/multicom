<script setup lang="ts">
import type { Layout } from "../constants";
import GithubLink from "./GithubLink.vue";
import LayoutMenu from "./LayoutMenu.vue";

defineProps<{
  currentLayout: Layout;
  editMode: boolean;
  layoutGrids: Record<Layout, { columns: number; rows: number }>;
  layoutOptions: Layout[];
  repoUrl: string;
  shareUrl: string;
  status: string;
}>();

const emit = defineEmits<{
  copyShareUrl: [];
  hideControls: [];
  openHelp: [];
  selectLayout: [layout: Layout];
  toggleEditMode: [];
}>();
</script>

<template>
  <section class="controls">
    <div class="top-row">
      <div class="top-copy">
        <span class="title">YouTubeコメントを複数窓で見るやつ</span>
      </div>
      <GithubLink :href="repoUrl" />
    </div>

    <div class="button-row">
      <LayoutMenu
        :current-layout="currentLayout"
        :layout-options="layoutOptions"
        :layout-grids="layoutGrids"
        @select="emit('selectLayout', $event)"
      />
      <button
        type="button"
        :class="{ active: editMode }"
        data-tooltip="枠内でURL変更、枠をD&Dで場所入れ替え"
        @click="emit('toggleEditMode')"
      >
        {{ editMode ? "編集終了" : "編集" }}
      </button>
      <button type="button" data-tooltip="操作方法をモーダルで表示" @click="emit('openHelp')">使い方</button>
      <button
        type="button"
        :disabled="editMode"
        :data-tooltip="editMode ? '編集中は操作欄を隠せません' : '復帰ボタンまたはEscで操作欄を表示'"
        @click="emit('hideControls')"
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
        @click="emit('copyShareUrl')"
      >
        共有URL
      </button>
      <span class="status-url">{{ shareUrl }}</span>
    </div>
  </section>
</template>
