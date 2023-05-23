<template>
  <Teleport to="body">
    <div v-if="isModalOpen" class="background" @click="closeModal">
      <div class="modal" @click.stop>
        <CloseModalButton @click="closeModal" />
        <Dropzone @file-uploaded="fileUploadHandler" />
        <AddUrlForm @form-submitted="submitUrlForm" />
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from "vue";
import { store } from "../state";
import { insertImage } from "../utils";

import CloseModalButton from "./buttons/CloseModalButton.vue";
import Dropzone from "./Dropzone.vue";
import AddUrlForm from "./AddUrlForm.vue";

const isModalOpen = computed(() => store.isModalOpen);

function closeModal() {
  store.isModalOpen = false;
}

function fileUploadHandler(file) {
  closeModal();
  insertImage(file);
}

function submitUrlForm(imageUrl) {
  closeModal();

  if (imageUrl.trim().length) {
    insertImage(imageUrl);
  }
}
</script>

<style lang="scss" scoped>
.background {
  background-color: transparent;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;

  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  position: relative;

  width: 400px;
  height: 320px;
  background-color: #eaeaea;
  color: black;

  padding: 64px 16px 16px;
  border-radius: 4px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
