<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  href: string;
  label?: string;
  text: string;
  tooltip?: string;
}>();

const postUrl = computed(() => {
  const url = new URL("https://twitter.com/intent/tweet");
  url.searchParams.set("text", props.text);
  url.searchParams.set("url", props.href);
  return url.toString();
});
</script>

<template>
  <a class="repo-link x-promo-link" :href="postUrl" target="_blank" rel="noreferrer" :data-tooltip="tooltip">
    <svg class="repo-link-icon" viewBox="0 0 16 16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M9.52 6.78 15.48 0h-1.41L8.89 5.88 4.76 0H0l6.25 8.9L0 16h1.41l5.87-6.67L11.24 16H16L9.52 6.78Zm-2.08 2.36-.68-.95L1.72 1.04h2.09l4.07 5.78.68.95 5.29 7.5h-2.09L7.44 9.14Z"
      />
    </svg>
    {{ label || "Xで宣伝" }}
  </a>
</template>
