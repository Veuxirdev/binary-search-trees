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

  function levelOrderTraversal(callback) {
    if (!callback) {
      throw new Error("A callback function is required");
    }
    const queue = [root];
    let currentNode = {};
    do {
      currentNode = queue[0];
      callback(currentNode.data);
      queue.shift();
      if (currentNode.left) queue.push(currentNode.left);
      if (currentNode.right) queue.push(currentNode.right);
    } while (queue.length !== 0);
  }

  // recursive levelOrderTraversal
  /*
  function levelOrderTraversal(callback, nodeQ = [root]) {
    if (!callback) {
      throw new Error("A callback function is required");
    }
    if (nodeQ.length === 0) {
      return;
    }
    const newQueue = [];
    nodeQ.forEach((node) => {
      if (node) {
        callback(node.data);
        newQueue.push(node.left, node.right);
      }
    });
    return levelOrderTraversal(callback, newQueue);
  }
*/
  function inOrderTraversal(callback, node = root) {
    if (!callback) {
      throw new Error("A callback function is required");
    }
    if (node === null) {
      return node;
    }
    node.left = inOrderTraversal(callback, node.left);
    callback(node.data);
    node.right = inOrderTraversal(callback, node.right);
    return;
  }

  function preOrderTraversal(callback, node = root) {
    if (!callback) {
      throw new Error("A callback function is required");
    }
    if (node === null) {
      return node;
    }
    callback(node.data);
    node.left = preOrderTraversal(callback, node.left);
    node.right = preOrderTraversal(callback, node.right);
    return;
  }

  function height(
    value,
    node = searchNode(value, root),
    nodeHeight = 0,
    queue,
  ) {
    if (!value) {
      return;
    }

    if (!node) return;

    let nodeQ = queue ? queue : [node];
    let newQueue = [];
    nodeQ.forEach((node) => {
      if (node.left) newQueue.push(node.left);
      if (node.right) newQueue.push(node.right);
    });
    if (newQueue.length === 0) {
      return nodeHeight;
    } else {
      return height(value, node, nodeHeight + 1, newQueue);
    }
  }

  function depth(value, node = root, depthLevel = 0) {
    if (!value) {
      return;
    }
    if (node) {
      if (value < node.data) {
        return depth(value, node.left, depthLevel + 1);
      } else if (value > node.data) {
        return depth(value, node.right, depthLevel + 1);
      } else {
        return depthLevel;
      }
    }
  }

  function postOrderTraversal(callback, node = root) {
    if (!callback) {
      throw new Error("A callback function is required");
    }
    if (node === null) {
      return node;
    }
    node.left = postOrderTraversal(callback, node.left);
    node.right = postOrderTraversal(callback, node.right);
    callback(node.data);
    return;
  }

  function deleteItem(value) {
    root = deleteNode(value, root);
  }

  function isBalanced() {
    if (root === null || (!root.left && !root.right)) {
      return true;
    }
    const queue = [root];
    let currentNode = {};
    let nodesHeightDif = 0;
    while (queue.length > 0) {
      currentNode = queue.shift();
      // get left and right nodes height difference
      nodesHeightDif =
        (currentNode.left
          ? height(currentNode.left.data, currentNode.left)
          : 0) -
        (currentNode.right
          ? height(currentNode.right.data, currentNode.right)
          : 0);
      if (nodesHeightDif > 1 || nodesHeightDif < -1) {
        return false;
      }
      if (currentNode.left) queue.push(currentNode.left);
      if (currentNode.right) queue.push(currentNode.right);
    }
    return true;
  }

  function rebalance() {
    if (isBalanced()) {
      return;
    }
    const arr = [];
    levelOrderTraversal((nodeData) => {
      arr.push(nodeData);
    });
    root = buildTree(clearArr(arr));
  }

  return {
    buildTree: () => {
      return root;
    },
    includes,
    insert,
    deleteItem,
    levelOrderTraversal,
    preOrderTraversal,
    inOrderTraversal,
    postOrderTraversal,
    height,
    depth,
    isBalanced,
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

function searchNode(value, node) {
  if (!value) {
    return;
  }
  if (node === null) return node;
  if (node.data === value) {
    return node;
  }
  if (value < node.data) {
    return searchNode(value, node.left);
  } else if (value > node.data) {
    return searchNode(value, node.right);
  }
}

const tree = Tree([1, 4, 5, 3, 6, 8, 9, 50, 60, 80, 100]);

prettyPrint(tree.buildTree());
console.log(tree.isBalanced());
tree.levelOrderTraversal((nodeData) => {
  console.log(nodeData);
});
