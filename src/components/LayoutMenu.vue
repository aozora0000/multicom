<script setup lang="ts">
import { ref } from "vue";
import type { Layout } from "../constants";

const props = defineProps<{
  currentLayout: Layout;
  layoutOptions: Layout[];
  layoutGrids: Record<Layout, { columns: number; rows: number }>;
}>();

const emit = defineEmits<{
  select: [layout: Layout];
}>();

const layoutMenuRef = ref<HTMLDetailsElement | null>(null);

function selectLayout(layout: Layout) {
  emit("select", layout);
  layoutMenuRef.value?.removeAttribute("open");
}

function getLayoutIconStyle(layout: Layout) {
  const grid = props.layoutGrids[layout];
  return {
    gridTemplateColumns: `repeat(${grid.columns}, 1fr)`,
    gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
  };
}
</script>

<template>
  <div class="layout-select-wrap">
    <span>レイアウト</span>
    <details ref="layoutMenuRef" class="layout-menu">
      <summary class="layout-menu-trigger" data-tooltip="レイアウトを変更">
        <span class="layout-icon" aria-hidden="true" :style="getLayoutIconStyle(currentLayout)">
          <span
            v-for="cellIndex in layoutGrids[currentLayout].columns * layoutGrids[currentLayout].rows"
            :key="cellIndex"
          ></span>
        </span>
        <span>{{ currentLayout }}</span>
      </summary>
      <div class="layout-menu-options" role="listbox" aria-label="レイアウト">
        <button
          v-for="layout in layoutOptions"
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
              v-for="cellIndex in layoutGrids[layout].columns * layoutGrids[layout].rows"
              :key="cellIndex"
            ></span>
          </span>
          <span>{{ layout }}</span>
        </button>
      </div>
    </details>
  </div>
</template>
