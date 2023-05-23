import { store } from "./state";
import {
  clearSelection,
  getNodesInRange,
  makeSnapshot,
  normalizeTextNodes,
  processTextNode,
} from "./utils";

/* =============================================================================

Метод execCommand() считается устаревшим и не рекомендуется к использованию.

MDN: https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand
P.S. в русской версии MDN об этом не сказано

W3Schools: https://www.w3schools.com/jsref/met_document_execcommand.asp

Также execCommand() не во всех браузерах работает одинаково.

Поэтому все необходимые функции форматирования текста будут реализованы с нуля.

Весь функционал тестировался в:
  Firefox 110.0
  Chrome 110.0.5481.178
  Brave 1.48.171

============================================================================= */

function formatText(element) {
  normalizeTextNodes();

  const { range } = store;

  // если ничего не выделено
  if (!range || !range.toString()) {
    return;
  }

  makeSnapshot();

  const nodes = getNodesInRange(range);

  const textNodes = nodes.filter((node) => node.nodeType === 3);

  for (const node of textNodes) {
    const { parentElement } = node;

    if (!parentElement) {
      return;
    }

    if (node.nodeType === 3 && !node.textContent) {
      continue;
    }

    let replacements = [];

    const { childNodes } = parentElement;

    // иногда contenteditable в Firefox может на свое усмотрение обернуть несколько элементов в один общий div.
    // Например, в одном div могут оказаться текстовый узел и изображение.
    // Но это редкий случай, вызванный ручным редактированием текста, поэтому выносится в отдельное условие
    const count = childNodes.length;

    // в некоторых случаях Firefox добавляет элемент <br> в последнем div в качестве завершающего узла.
    // Он не будет считаться полноценной частью текста, поэтому его потеря при обработке текста допустима
    if (count > 1 && childNodes[count - 1].tagName !== "BR") {
      for (let childNode of childNodes) {
        if (childNode.nodeName === "IMG") {
          replacements.push(childNode);
          continue;
        }

        if (childNode.nodeType === 3) {
          if (!childNode.textContent) {
            continue;
          }

          const formattedNode = processTextNode(childNode, range, element);

          childNode.textContent = "";
          replacements.push(...formattedNode);
        }
      }
    } else {
      replacements = processTextNode(node, range, element);
    }

    if (parentElement.classList.contains("inputArea")) {
      const newFragment = document.createDocumentFragment();

      newFragment.append(...replacements);

      parentElement.replaceChild(newFragment, node);
      continue;
    }

    parentElement.replaceWith(...replacements);
  }

  clearSelection();
  makeSnapshot();
}

export default {
  makeHeader: () => formatText("h2"),
  makeParagraph: () => formatText("p"),
  insertImage: () => {
    store.isModalOpen = true;
  },
};
