<template>
  <button
    type="button"
    class="closeModalButton"
    @mouseenter="mouseEnterHandler"
    @mouseleave="mouseLeaveHandler"
  >
    <CloseIcon :color="iconColor" size="32" />
  </button>
</template>

<script setup>
import { ref } from "vue";
import CloseIcon from "../icons/CloseIcon.vue";

const iconColor = ref("#282828");

function mouseEnterHandler() {
  iconColor.value = "#639eff";
}

function mouseLeaveHandler() {
  iconColor.value = "#282828";
}
</script>

<style lang="scss" scoped>
.closeModalButton {
  border: none;
  background-color: transparent;
  padding: 12px;

  position: absolute;
  top: 0;
  right: 0;

  &:focus {
    outline: none;
  }

  &:hover {
    border: none;
  }
}
</style>
