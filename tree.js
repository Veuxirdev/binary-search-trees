import { node } from "./node";

class tree {
  constructor(arr) {
    this.root = buildTree(arr);
  }
}

function buildTree(arr, start = 0, end = arr.length() - 1) {
  if (start > end) {
    return null;
  }
  const sortedArr = arr.toSorted();
  const mid = Math.floor((start + end) / 2);
  const node = new Node();
}
