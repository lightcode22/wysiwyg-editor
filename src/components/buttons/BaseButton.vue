<template>
  <button type="button">
    <component :is="icon" v-bind="{ color, size }" />
  </button>
</template>

<script setup>
defineProps({
  icon: { required: true },
  color: { required: false },
  size: { required: false },
});
</script>

<style lang="scss" scoped>
button {
  width: 42px;
  height: 38px;
  margin: 0 6px;

  padding: 0;

  background-color: #282828;
  border-radius: 4px;

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
