import { reactive } from "vue";

export const store = reactive({
  range: null,
  inputAreaRef: null,
  isModalOpen: false,
  snapshots: [""],
  currentSnapshotIndex: 0,
});
