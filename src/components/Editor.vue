<template>
  <div class="editor">
    <Toolbar />
    <InputArea ref="inputAreaRef" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import Toolbar from "./Toolbar.vue";
import InputArea from "./InputArea.vue";

const inputAreaRef = ref();
</script>

<style scoped>
.editor {
  width: 720px;
  height: 640px;
  display: flex;
  flex-direction: column;
}
</style>
