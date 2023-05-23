<template>
  <form @submit.prevent="submitUrlForm">
    <input v-model="imageUrl" placeholder="URL изображения" />
    <button type="submit">
      <AddImageIcon color="#639eff" />
    </button>
  </form>
</template>

<script setup>
import { ref } from "vue";

import AddImageIcon from "./icons/AddImageIcon.vue";

const emit = defineEmits(["form-submitted"]);

const imageUrl = ref("");

function submitUrlForm() {
  if (imageUrl.value) {
    emit("form-submitted", imageUrl.value);
  }
}
</script>

<style lang="scss" scoped>
form {
  display: flex;
}

input {
  flex: 1;
  padding: 1px 8px;

  border-radius: 4px 0 0 4px;
  border: 1px solid #282828;
  border-right: 0;

  &:focus {
    outline: none;
  }
}

button {
  border-radius: 0 4px 4px 0;
  border: none;
  background-color: #282828;

  height: 40px;
  width: 48px;

  padding: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    border: none;
    background-color: #323232;
  }

  &:focus {
    outline: none;
  }

  &:disabled {
    opacity: 0.3;

    &:hover {
      border: none;
      background-color: #282828;
      outline: none;
    }
  }
}
</style>
