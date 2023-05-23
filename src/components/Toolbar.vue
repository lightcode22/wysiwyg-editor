<template>
  <div class="toolbar">
    <HistoryButton actionType="undo" color="#639eff" />
    <HistoryButton actionType="redo" color="#639eff" />
    <BaseButton
      v-for="tool in tools"
      :icon="tool.icon"
      :title="tool.title"
      :key="tool.title"
      color="#639eff"
      size="24"
      @click="actions[tool.actionType]"
    />
    <CopyButton />
  </div>
</template>

<script setup>
import BaseButton from "./buttons/BaseButton.vue";
import HistoryButton from "./buttons/HistoryButton.vue";
import CopyButton from "./buttons/CopyButton.vue";
import actions from "../buttonActions";

import HeaderIcon from "./icons/HeaderIcon.vue";
import ParagraphIcon from "./icons/ParagraphIcon.vue";
import ImageIcon from "./icons/ImageIcon.vue";

const tools = [
  { actionType: "makeHeader", title: "Сделать заголовком", icon: HeaderIcon },
  {
    actionType: "makeParagraph",
    title: "Сделать параграфом",
    icon: ParagraphIcon,
  },
  { actionType: "insertImage", title: "Добавить изображение", icon: ImageIcon },
];
</script>

<style scoped>
.toolbar {
  width: 100%;
  height: 64px;

  padding-bottom: 16px;

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
</style>
