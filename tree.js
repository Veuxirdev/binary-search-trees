import { Node } from "./node.js";
import { prettyPrint } from "./pretty-tree.js";

const Tree = (arr) => {
  let root = buildTree(clearArr(arr));

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

  // loop levelOrderTraversal

  /*
  function levelOrderTraversal(callback, queueArr = [root]) {
    const queue = queueArr;
    for (let i = queue.length - 1; i >= 0; i--) {
      if (callback) callback(queue[i].data);
      const leftRef = queue[i].left;
      const rightRef = queue[i].right;
      queue.pop();
      if (leftRef) {
        queue.push(leftRef);
        i++;
      }
      if (rightRef) {
        queue.push(rightRef);
        i++;
      }
    }
  }
*/

  // recursive levelOrderTraversal

  function levelOrderTraversal(callback, nodeQ = [root]) {
    if (nodeQ.length === 0) {
      return nodeQ;
    }

    return levelOrderTraversal(callback, nodeQ);
  }

  function deleteItem(value) {
    root = deleteNode(value, root);
  }

  return {
    buildTree: () => {
      return root;
    },
    includes,
    insert,
    deleteItem,
    levelOrderTraversal,
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

function searchInOrderSuccessor(rightNode) {
  if (rightNode.left === null) {
    return rightNode;
  }
  return searchInOrderSuccessor(rightNode.left);
}

function deleteNode(value, node) {
  if (node === null) {
    return node;
  }

  if (node.data > value) node.left = deleteNode(value, node.left);
  else if (node.data < value) node.right = deleteNode(value, node.right);
  else {
    if (node.left === null) return node.left;

    if (node.right === null) return node.right;

    const successor = searchInOrderSuccessor(node.right);
    node.data = successor.data;
    node.right = deleteNode(successor.data, node.right);
  }
  return node;
}

const tree = Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);

prettyPrint(tree.buildTree());
tree.levelOrderTraversal((nodeData) => console.log(nodeData));
