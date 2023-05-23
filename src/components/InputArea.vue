<template>
  <div
    id="inputArea"
    class="inputArea"
    contenteditable
    spellcheck="false"
    ref="inputAreaRef"
    @blur.prevent="onInputBlur"
  ></div>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import { store } from "../state";

const inputAreaRef = ref(null);

store.inputAreaRef = inputAreaRef;

watchEffect(() => {
  let currentText = store.snapshots[store.currentSnapshotIndex];

  if (inputAreaRef.value) {
    inputAreaRef.value.innerHTML = currentText;
  }
});

function onInputBlur() {
  const selection = window.getSelection();

  if (selection) {
    // в store записывается именно range, а не selection,
    // так как значение selection "живое" (по типу live collection).
    // Т.е. значение selection непостоянно и может изменяться при клике на другие элементы,
    // которые могут содержать текст (input, span, др.). Изменение selection нельзя предотвратить
    // или валидировать - а это мешает сохранить последнее положение курсора в окне редактора
    store.range = selection.getRangeAt(0);
  }
}
</script>

<style lang="scss" scoped>
.inputArea {
  width: 100%;
  flex: 1;
  padding: 16px;

  border: 2px solid #639eff;
  border-radius: 4px;
  color: #eaeaea;

  text-align: left;
  overflow-y: auto;

  &:focus {
    outline: none;
  }
}
</style>
