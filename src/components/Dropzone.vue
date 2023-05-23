<template>
  <div
    class="dropzone"
    @drop.prevent="dropFileHandler"
    @dragover.prevent="dragOverHandler"
    @dragenter.prevent
    @dragleave="dragLeaveHandler"
    :class="{ draggedOver: isDraggedOver }"
  >
    <input
      type="file"
      id="fileInput"
      name="fileInput"
      ref="fileInput"
      class="hiddenInput"
      @change="onChange"
      accept=".jpg,.jpeg,.png"
    />

    <label for="fileInput" class="fileLabel">
      Перетащите файл в эту область
      <span>или</span>
      кликните, чтобы загрузить
    </label>
  </div>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["file-uploaded"]);

const fileInput = ref(null);
const isDraggedOver = ref(false);

function onChange() {
  const files = fileInput.value.files;

  if (files.length) {
    emit("file-uploaded", files[0]);
  }
}

function dropFileHandler(event) {
  fileInput.value.files = event.dataTransfer.files;

  onChange();
}

function dragOverHandler() {
  if (!isDraggedOver.value) {
    isDraggedOver.value = true;
  }
}

function dragLeaveHandler() {
  isDraggedOver.value = false;
}
</script>

<style lang="scss" scoped>
.dropzone {
  width: 100%;
  height: 160px;
  background-color: #282828;
  color: white;
  border-radius: 4px;
  transition: background-color 0.4s;

  &.draggedOver {
    background-color: #242424;
  }
}
.hiddenInput {
  opacity: 0;
  overflow: hidden;
  position: absolute;
  width: 1px;
  height: 1px;
}

.fileLabel {
  text-align: center;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  cursor: pointer;

  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

span {
  display: block;
}

label {
  cursor: pointer;
}
</style>
