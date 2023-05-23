<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    version="1.1"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    :fill="color"
  >
    <slot></slot>
  </svg>
</template>

<script setup>
defineProps({
  color: {
    type: String,
    default: "#000",
  },
  size: {
    type: String,
    default: "24",
  },
});
</script>
