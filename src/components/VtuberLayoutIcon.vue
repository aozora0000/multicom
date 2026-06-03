<script setup lang="ts">
import { computed } from "vue";
import { VTUBER_LAYOUTS, type VtuberLayoutId } from "../constants";

const props = defineProps<{
  layoutId: VtuberLayoutId;
}>();

const cells = computed(() => VTUBER_LAYOUTS[props.layoutId].cells);
const maxX = computed(() => Math.max(...cells.value.map((cell) => cell.x + cell.width)));
const maxY = computed(() => Math.max(...cells.value.map((cell) => cell.y + cell.height)));
const viewBox = computed(() => `0 0 ${maxX.value * 16} ${maxY.value * 16}`);
</script>

<template>
  <svg class="vtuber-layout-icon" :viewBox="viewBox" aria-hidden="true">
    <rect
      v-for="cell in cells"
      :key="cell.index"
      :x="cell.x * 16 + 1"
      :y="cell.y * 16 + 1"
      :width="cell.width * 16 - 2"
      :height="cell.height * 16 - 2"
      rx="1.5"
    />
  </svg>
</template>
