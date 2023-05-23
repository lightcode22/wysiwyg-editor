<template>
  <button type="button" :disabled="isDisabled" @click="onClickHandler">
    {{ buttonText }}
  </button>
</template>

<script setup>
import { computed, ref } from "vue";
import { store } from "../../state";

const isDisabled = ref(false);

const buttonText = computed(() =>
  isDisabled.value ? "Скопировано в буфер" : "Скопировать HTML"
);

function onClickHandler() {
  isDisabled.value = true;

  const markup = store.inputAreaRef.innerHTML;

  navigator.clipboard.writeText(markup);

  setTimeout(() => {
    isDisabled.value = false;
  }, 1400);
}
</script>

<style lang="scss" scoped>
button {
  background: transparent;
  border: none;
  color: #639eff;
  outline: none;
  transition: color 0.5s;

  &:hover {
    color: #e5e5e5;
  }
}
</style>
