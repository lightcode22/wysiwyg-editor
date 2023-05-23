<template>
  <BaseButton
    :disabled="isDisabled"
    v-bind="{ title, icon }"
    @click="makeStep"
  />
</template>

<script setup>
import { store } from "../../state";
import { computed } from "vue";

import BaseButton from "./BaseButton.vue";

import undoIcon from "../icons/UndoIcon.vue";
import redoIcon from "../icons/RedoIcon.vue";

const { actionType } = defineProps(["actionType"]);

const title = actionType === "undo" ? "Предыдущий" : "Следующий";

const icon = actionType === "undo" ? undoIcon : redoIcon;

const totalSnaps = computed(() => store.snapshots.length);
const currentSnap = computed(() => store.currentSnapshotIndex);

const isDisabled = computed(() => {
  if (actionType === "undo" && currentSnap.value === 0) {
    return true;
  }

  const isLastSnap =
    totalSnaps.value === 0 || currentSnap.value >= totalSnaps.value - 1;

  if (actionType === "redo" && isLastSnap) {
    return true;
  }

  return false;
});

function undo() {
  // если currentSnapshot каким-либо образом станет меньше 0, max предотвратит присваивание отрицательного числа
  store.currentSnapshotIndex = Math.max(0, currentSnap.value - 1);
}

function redo() {
  // min также предотвратит выход за пределы возможного диапазона
  store.currentSnapshotIndex = Math.min(
    totalSnaps.value - 1,
    currentSnap.value + 1
  );
}

const makeStep = actionType === "undo" ? undo : redo;
</script>
