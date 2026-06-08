import { Node } from "./node.js";
import { prettyPrint } from "./pretty-tree.js";

const Tree = (arr) => {
  const root = buildTree(clearArr(arr));

  function clearArr(arrToClear) {
    const sortedArr = [...new Set(arrToClear)].sort((a, b) => a - b);
    return sortedArr;
  }

  function includes(value, node = root) {
    if (node === null) {
      return false;
    }
    if (value === node.data) {
      return true;
    }

    return includes(value, node.left) || includes(value, node.right);
  }

  function insert(value, node = root) {
    if (typeof value !== "number" || Number.isNaN(value)) {
      throw new Error("The value is not a number");
    }

    if (node === null) {
      return new Node(value);
    }

    if (value === node.data) {
      return node;
    }

    if (value > node.data) {
      node.right = insert(value, node.right);
    } else {
      node.left = insert(value, node.left);
    }
    return node;
  }

  return {
    buildTree: () => {
      return root;
    },
    includes,
    insert,
  };
};

function buildTree(sortedArr, start = 0, end = sortedArr.length - 1) {
  if (start > end) {
    return null;
  }
  const mid = Math.floor((start + end) / 2);
  const root = new Node(sortedArr[mid]);

  root.left = buildTree(sortedArr, start, mid - 1);
  root.right = buildTree(sortedArr, mid + 1, end);

  return root;
}

const tree = Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);

prettyPrint(tree.buildTree());
tree.insert(100);
prettyPrint(tree.buildTree());
