class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  insert(value) {
    const newNode = new Node(value);

    if (!this.root) {
      this.root = newNode;
      return;
    }

    let curr = this.root;
    while (true) {
      if (value < curr.value) {
        if (!curr.left) {
          curr.left = newNode;
          return;
        }
        curr = curr.left;
      } else {
        if (!curr.right) {
          curr.right = newNode;
          return;
        }
        curr = curr.right;
      }
    }
  }

  find(value) {
    let curr = this.root;
    while (curr) {
      if (value === curr.value) return curr;
      curr = value < curr.value ? curr.left : curr.right;
    }
    return null;
  }

  remove(value) {
    this.root = this._removeNode(this.root, value);
  }

  _removeNode(node, value) {
    if (!node) return null;

    if (value < node.value) {
      node.left = this._removeNode(node.left, value);
      return node;
    } else if (value > node.value) {
      node.right = this._removeNode(node.right, value);
      return node;
    } else {

      if (!node.left && !node.right) {
        return null;
      }

      if (!node.left) return node.right;
      if (!node.right) return node.left;

      let minRight = this._findMinNode(node.right);
      node.value = minRight.value;
      node.right = this._removeNode(node.right, minRight.value);
      return node;
    }
  }

  _findMinNode(node) {
    while (node.left) {
      node = node.left;
    }
    return node;
  }
}

module.exports = BinarySearchTree;