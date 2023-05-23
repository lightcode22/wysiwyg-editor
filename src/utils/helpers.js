import { store } from "../state";
import {
  normalizeTextNodes,
  isSuccessorOf,
  wrapTextWithElement,
} from "./nodeProcessors";

function makeSnapshot() {
  const markup = store.inputAreaRef.innerHTML;

  let snapshots = store.snapshots;
  let currentSnapshotIndex = store.currentSnapshotIndex;

  // если текущий снимок не последний, то нужно удалить все последующие снимки,
  // чтобы не запутаться в хронологии изменений.
  // Например, если всего в массиве 8 снимков, а мы в данный момент переключились на 4-ый,
  // то при внесении изменений снова в 4, нужно сделать так, чтобы это изменение было последним в хронологии.
  // Поэтому уже имеющийся 5-ый снимок (и все последующие) удаляются, а новый снимок становится 5-ым и последним
  if (currentSnapshotIndex !== snapshots.length - 1) {
    snapshots.length = currentSnapshotIndex + 1;
  }

  if (snapshots[currentSnapshotIndex] === markup) {
    return;
  }

  snapshots.push(markup);

  store.snapshots = snapshots;

  currentSnapshotIndex++;

  store.currentSnapshotIndex = currentSnapshotIndex;
}

async function convertImageToString(imageFile) {
  const reader = new FileReader();

  function getString() {
    return new Promise((resolve) => {
      reader.onloadend = function () {
        resolve(reader.result);
      };

      reader.readAsDataURL(imageFile);
    });
  }

  return await getString();
}

function clearSelection() {
  store.range = null;

  const selection = window.getSelection();
  if (selection) {
    selection.removeAllRanges();
  }
}

async function insertImage(imageSource) {
  normalizeTextNodes();

  const { range } = store;

  if (!range) {
    return;
  }

  // при клике на какой-либо элемент он становится целью для вставки изображения.
  // Если кликнуть, например, на панель с кнопками (toolbar), а затем добавить изображение,
  // до изображение появится не в contenteditable, а в toolbar'е.
  // Во избежание такого поведения используется проверка, является ли элемент, на который кликнули,
  // элементом внутри contenteditable. Если нет, то изображение не будет добавлено
  const isAllowed = isSuccessorOf(
    document.querySelector(".inputArea"),
    range.startContainer
  );

  if (!isAllowed) {
    return;
  }

  const textNode = range.startContainer;

  let text = textNode.textContent;

  const image = document.createElement("img");

  image.style.width = "100%";

  if (typeof imageSource === "string") {
    image.src = imageSource;
  } else {
    image.src = await convertImageToString(imageSource);
  }

  makeSnapshot();

  // если текста внутри нет (изначально или при переводе каретки на новую строку не был введен текст)
  if (!text) {
    textNode.appendChild(image);

    makeSnapshot();
    return;
  }

  const { parentElement } = textNode;

  const { startOffset, endOffset } = range;

  const textParts = [text.slice(0, startOffset), text.slice(endOffset)];

  const replacements = [];

  if (textParts[0].trim().length) {
    const newNode = wrapTextWithElement(textParts[0], parentElement);
    replacements.push(newNode);
  }

  replacements.push(image);

  if (textParts[1].trim().length) {
    const newNode = wrapTextWithElement(textParts[1], parentElement);
    replacements.push(newNode);
  }

  if (parentElement.classList.contains("inputArea")) {
    const newFragment = document.createDocumentFragment();
    newFragment.append(...replacements);

    parentElement.replaceChild(newFragment, textNode);

    makeSnapshot();
    return;
  }

  parentElement.replaceWith(...replacements);

  makeSnapshot();
}

export { clearSelection, insertImage, makeSnapshot };
