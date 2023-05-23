import { store } from "../state";

function getNextNode(node) {
  if (node.firstChild) {
    return node.firstChild;
  }

  while (node) {
    if (node.nextSibling) {
      return node.nextSibling;
    }

    // иначе перейти к поиску в родительском узле
    node = node.parentNode;
  }
}

function getNodesInside(range) {
  const { startContainer, endContainer } = range;

  const nodes = [];

  for (let node = startContainer; node; node = node.nextSibling) {
    nodes.push(node);

    if (node === endContainer) {
      break;
    }
  }

  return nodes;
}

function getNodesInRange(range) {
  const { startContainer, commonAncestorContainer } = range;

  // в Firefox при выделении двойным щелчком последнего слова в последней строке текста
  // в качестве endContainer для range устанавливается родительский контейнер,
  // что приводит к непредвиденному поведению.
  // В таком случае принято решение подставить значение startContainer в endContainer
  let { endContainer } = range;

  if (endContainer.nodeType !== 3) {
    endContainer = startContainer;
  }

  const nodes = [];

  // доходит от родительского узла начального узла до общего предка для двух конечных узлов
  for (let node = startContainer; node; node = node.parentNode) {
    if (node === commonAncestorContainer) {
      break;
    }

    nodes.push(node);
  }

  nodes.reverse();

  // проходит по всем дочерним и сиблингам от начала до конца range
  for (let node = startContainer; node; node = getNextNode(node)) {
    if (!nodes.includes(node)) {
      nodes.push(node);
    }

    if (node === endContainer) {
      break;
    }
  }

  return nodes;
}

// при редактировании текста вручную могут появиться пустые текстовые узлы
// или несколько текстовых узлов подряд, которые не слились в один общий.
// Вызов данной функции исправляет оба этих случая
function normalizeTextNodes() {
  let node = store.inputAreaRef.firstChild;

  while (true) {
    if (!node) {
      break;
    }

    if (node.nodeType === 1) {
      node.normalize();
    }

    node = getNextNode(node);
  }
}

function processTextNode(node, range, element) {
  const text = node.textContent;

  const { parentElement } = node;

  const parentTagName = parentElement.tagName;

  const replacements = [];

  let startOffset = 0;
  let endOffset = text.length;

  if (node === range.startContainer) {
    startOffset = range.startOffset;
  }

  // range.endContainer.nodeType === 3  <-- защита от ошибки выделения двойным щелчком в Firefox
  if (node === range.endContainer && range.endContainer.nodeType === 3) {
    endOffset = range.endOffset;
  }

  const textParts = [
    text.slice(0, startOffset),
    text.slice(startOffset, endOffset),
    text.slice(endOffset),
  ];

  if (textParts[0].trim().length) {
    const newNode = wrapTextWithElement(textParts[0], parentElement);
    replacements.push(newNode);
  }

  if (textParts[1].trim().length) {
    const formattedText = document.createTextNode(textParts[1]);

    const checkTag = element.toUpperCase();

    const wrapperTag = parentTagName === checkTag ? "div" : element;

    const wrapper = document.createElement(wrapperTag);

    wrapper.appendChild(formattedText);

    replacements.push(wrapper);
  }

  if (textParts[2].trim().length) {
    const newNode = wrapTextWithElement(textParts[2], parentElement);
    replacements.push(newNode);
  }

  return replacements;
}

// по умолчанию первый узел (первая строка) в Chrome не оборачивается в div
// в Firefox первый узел (первая строка) не оборачивается до тех пор, пока не появится второй узел
// метод cloneParentElement проверяет, обернут ли узел в какой-либо элемент
// и если не обернут (родительский элемент = окно редактирования), то оборачивает в div
function cloneParentElement(parent) {
  if (parent.classList.contains("inputArea")) {
    return document.createElement("div");
  }

  return parent.cloneNode(false);
}

function getSelectedNodes() {
  const { range } = store;

  // если ничего не выделено
  if (!range.toString()) {
    return;
  }

  return getNodesInRange(range);
}

function isSuccessorOf(ancestor, successor) {
  const bodyElement = document.querySelector("body");

  let parent = successor;

  while (parent !== bodyElement) {
    if (parent === ancestor) {
      return true;
    }

    parent = parent.parentElement;
  }

  return false;
}

function wrapTextWithElement(text, element) {
  const textNode = document.createTextNode(text);

  const wrapper = cloneParentElement(element);

  wrapper.appendChild(textNode);

  return wrapper;
}

export {
  cloneParentElement,
  getNodesInRange,
  getNodesInside,
  getSelectedNodes,
  normalizeTextNodes,
  wrapTextWithElement,
  processTextNode,
  isSuccessorOf,
};
