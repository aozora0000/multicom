<script setup lang="ts">
import { ref } from "vue";
import type { VtuberLayoutId, VtuberLayoutSelection } from "../constants";
import VtuberLayoutIcon from "./VtuberLayoutIcon.vue";

defineProps<{
  effectiveLayoutId: VtuberLayoutId;
  layoutOptions: VtuberLayoutId[];
  selection: VtuberLayoutSelection;
}>();

const emit = defineEmits<{
  select: [layout: VtuberLayoutSelection];
}>();

const menuRef = ref<HTMLDetailsElement | null>(null);

function selectLayout(layout: VtuberLayoutSelection) {
  emit("select", layout);
  menuRef.value?.removeAttribute("open");
}
</script>

<template>
  <div class="layout-select-wrap">
    <span>外部レイアウト</span>
    <details ref="menuRef" class="layout-menu vtuber-layout-menu">
      <summary class="layout-menu-trigger" data-tooltip="vtuber.neocities.org に渡すレイアウトID">
        <VtuberLayoutIcon :layout-id="effectiveLayoutId" />
        <span v-if="selection === 'auto'">自動</span>
      </summary>
      <div class="layout-menu-options vtuber-layout-options" role="listbox" aria-label="外部レイアウト">
        <button
          type="button"
          class="layout-option vtuber-layout-option"
          :class="{ selected: selection === 'auto' }"
          :aria-selected="selection === 'auto'"
          :aria-label="`自動 レイアウト${effectiveLayoutId}`"
          role="option"
          @click="selectLayout('auto')"
        >
          <VtuberLayoutIcon :layout-id="effectiveLayoutId" />
          <span>自動</span>
        </button>
        <button
          v-for="layoutId in layoutOptions"
          :key="layoutId"
          type="button"
          class="layout-option vtuber-layout-option"
          :class="{ selected: selection === layoutId }"
          :aria-selected="selection === layoutId"
          :aria-label="`レイアウト${layoutId}`"
          role="option"
          @click="selectLayout(layoutId)"
        >
          <VtuberLayoutIcon :layout-id="layoutId" />
        </button>
      </div>
    </details>
  </div>
</template>
