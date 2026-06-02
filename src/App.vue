<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";

const LAYOUTS = {
  "2x1": 2,
  "3x1": 3,
  "4x1": 4,
  "2x2": 4,
  "1x2": 2,
  "1x3": 3,
  "1x4": 4,
} as const;

type Layout = keyof typeof LAYOUTS;

const DEFAULT_LAYOUT: Layout = "2x2";
const STORAGE_KEY = "youtube-live-chat-grid-tool-v2";
const layoutOptions = Object.keys(LAYOUTS) as Layout[];

const currentLayout = ref<Layout>(DEFAULT_LAYOUT);
const values = ref<string[]>(["", "", "", ""]);
const status = ref("");
const controlsHidden = ref(false);

const visibleValues = computed(() => values.value.slice(0, LAYOUTS[currentLayout.value]));
const shareUrl = computed(() => buildShareUrl());

onMounted(() => {
  const fromStorage = readStorage();
  currentLayout.value = isLayout(fromStorage.layout) ? fromStorage.layout : DEFAULT_LAYOUT;
  values.value = normalizeValues(fromStorage.values);

  applyQueryParams();
  applyChats();
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});

function setLayout(layout: Layout) {
  currentLayout.value = layout;
  saveStorage();
  applyChats();
}

function applyChats() {
  saveStorage();
  const loadedCount = visibleValues.value.filter((value) => extractYouTubeVideoId(value)).length;
  status.value = loadedCount
    ? `読み込み: ${loadedCount}件 / 共有URL: ${shareUrl.value}`
    : `共有URL: ${shareUrl.value}`;
}

async function copyShareUrl() {
  saveStorage();
  const url = shareUrl.value;

  try {
    await navigator.clipboard.writeText(url);
    status.value = `共有URLをコピーしました: ${url}`;
  } catch {
    status.value = `コピーできませんでした。手動でコピーしてください: ${url}`;
  }
}

function hideControls() {
  controlsHidden.value = true;
}

function showControls() {
  controlsHidden.value = false;
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && controlsHidden.value) {
    showControls();
  }
}

function applyQueryParams() {
  const params = new URLSearchParams(location.search);
  const layout = params.get("layout") || params.get("l");

  if (isLayout(layout)) {
    currentLayout.value = layout;
  }

  for (let i = 1; i <= 4; i += 1) {
    const value = params.get(`w${i}`);
    if (value !== null) values.value[i - 1] = value;
  }
}

function getIframeUrl(value: string) {
  const videoId = extractYouTubeVideoId(value);
  const domain = getEmbedDomain();

  if (!videoId || !domain) return "";

  return `https://www.youtube.com/live_chat?v=${encodeURIComponent(videoId)}&embed_domain=${encodeURIComponent(domain)}`;
}

function getPlaceholderText(index: number) {
  return getEmbedDomain()
    ? `w${index + 1} にYouTube URLまたは動画IDを入力`
    : "file://ではembed_domainを作れません。HTTPサーバー経由で開いてください。";
}

function getEmbedDomain() {
  return location.hostname || "";
}

function buildShareUrl() {
  const url = new URL(location.href);
  url.search = "";
  url.hash = "";

  url.searchParams.set("l", currentLayout.value);

  visibleValues.value.forEach((value, index) => {
    if (!value) return;
    const id = extractYouTubeVideoId(value);
    url.searchParams.set(`w${index + 1}`, id || value);
  });

  return url.toString();
}

function extractYouTubeVideoId(raw: string) {
  const value = String(raw || "").trim();
  if (!value) return "";

  if (/^[a-zA-Z0-9_-]{11}$/.test(value)) return value;

  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return cleanId(url.pathname.split("/").filter(Boolean)[0]);
    }

    if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      const fromV = cleanId(url.searchParams.get("v"));
      if (fromV) return fromV;

      const parts = url.pathname.split("/").filter(Boolean);
      if (["embed", "shorts", "live"].includes(parts[0])) {
        return cleanId(parts[1]);
      }
    }
  } catch {
    // URLでない場合は下の緩い抽出に進む
  }

  const loose = value.match(/(?:v=|youtu\.be\/|embed\/|shorts\/|live\/)([a-zA-Z0-9_-]{11})/);
  return cleanId(loose?.[1]);
}

function cleanId(value: string | null | undefined) {
  const id = String(value || "").trim();
  return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : "";
}

function normalizeValues(input: unknown) {
  const arr = Array.isArray(input) ? input : [];
  return [0, 1, 2, 3].map((i) => String(arr[i] || ""));
}

function readStorage(): { layout?: unknown; values?: unknown } {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveStorage() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      layout: currentLayout.value,
      values: values.value,
    }),
  );
}

function isLayout(value: unknown): value is Layout {
  return typeof value === "string" && value in LAYOUTS;
}
</script>

<template>
  <div class="app" :class="{ 'controls-hidden': controlsHidden }">
    <section class="controls">
      <div class="top-row">
        <span class="title">YouTube Live Chat Grid</span>
        <span class="hint">URL引数: ?l=2x2&w1=...&w2=...&w3=...&w4=...</span>
      </div>

      <div class="button-row">
        <button
          v-for="layout in layoutOptions"
          :key="layout"
          type="button"
          :class="{ active: currentLayout === layout }"
          @click="setLayout(layout)"
        >
          {{ layout }}
        </button>
        <button type="button" @click="applyChats">反映</button>
        <button type="button" @click="copyShareUrl">共有URLをコピー</button>
        <button type="button" @click="hideControls">操作欄を隠す</button>
      </div>

      <div class="inputs">
        <div v-for="(_, index) in visibleValues" :key="index" class="input-wrap">
          <label :for="`w${index + 1}`">w{{ index + 1 }}</label>
          <input
            :id="`w${index + 1}`"
            v-model.trim="values[index]"
            placeholder="動画ID / YouTube URL / live_chat URL"
            autocomplete="off"
            @change="saveStorage"
          />
        </div>
      </div>
      <div class="status">{{ status }}</div>
    </section>

    <button
      type="button"
      class="restore-controls"
      title="操作欄を表示 / Escでも復帰"
      @click="showControls"
    >
      操作欄を表示
    </button>

    <main class="stage" :class="`layout-${currentLayout}`">
      <div v-for="(value, index) in visibleValues" :key="index" class="cell">
        <iframe
          v-if="getIframeUrl(value)"
          :src="getIframeUrl(value)"
          :title="`YouTube Live Chat ${index + 1}`"
          allow="clipboard-write"
        ></iframe>
        <div v-else class="placeholder">
          {{ getPlaceholderText(index) }}
        </div>
      </div>
    </main>
  </div>
</template>
