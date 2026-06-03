<script setup lang="ts">
import type { Layout, VtuberLayoutId, VtuberLayoutSelection } from "../constants";
import GithubLink from "./GithubLink.vue";
import LayoutMenu from "./LayoutMenu.vue";
import VtuberLayoutMenu from "./VtuberLayoutMenu.vue";
import XPromoLink from "./XPromoLink.vue";

defineProps<{
  currentLayout: Layout;
  editMode: boolean;
  effectiveVtuberLayoutId: VtuberLayoutId;
  layoutGrids: Record<Layout, { columns: number; rows: number }>;
  layoutOptions: Layout[];
  promoUrl: string;
  repoUrl: string;
  shareUrl: string;
  status: string;
  vtuberLayoutOptions: VtuberLayoutId[];
  vtuberLayoutSelection: VtuberLayoutSelection;
  vtuberUrl: string;
}>();

const emit = defineEmits<{
  copyShareUrl: [];
  hideControls: [];
  openHelp: [];
  selectLayout: [layout: Layout];
  selectVtuberLayout: [layout: VtuberLayoutSelection];
  toggleEditMode: [];
}>();
</script>

<template>
  <section class="controls">
    <div class="top-row">
      <div class="top-copy">
        <span class="title">YouTubeコメントを複数窓で見るやつ</span>
      </div>
      <div class="top-links">
        <XPromoLink
          :href="shareUrl"
          class="x-now-link"
          text="今これ見てる YouTubeコメントを複数窓で見るやつ"
          label="今これ見てる"
          tooltip="現在の共有URLをXに投稿"
        />
        <XPromoLink
          :href="promoUrl"
          text="YouTubeコメントを複数窓で見るやつ"
          tooltip="アプリをXで宣伝"
        />
        <GithubLink :href="repoUrl" tooltip="GitHubリポジトリを開く" />
      </div>
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
      <div class="external-actions">
        <VtuberLayoutMenu
          :effective-layout-id="effectiveVtuberLayoutId"
          :layout-options="vtuberLayoutOptions"
          :selection="vtuberLayoutSelection"
          @select="emit('selectVtuberLayout', $event)"
        />
        <a
          class="repo-link vtuber-link"
          :href="vtuberUrl"
          target="_blank"
          rel="noreferrer"
          data-tooltip="YouTubeを複数窓でみるやつで動画を開く"
        >
          動画を開く
        </a>
      </div>
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
