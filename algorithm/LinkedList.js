class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  addNode(value) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
  }

  findNode(value) {
    let currentNode = this.head;
    while (currentNode) {
      if (currentNode.value === value) {
        return currentNode;
      }
      currentNode = currentNode.next;
    }
    return null;
  }

  insertAfter(targetValue, newValue) {
    const targetNode = this.findNode(targetValue);
    if (targetNode) {
      const newNode = new Node(newValue);
      newNode.next = targetNode.next;
      targetNode.next = newNode;
      if (targetNode === this.tail) {
        this.tail = newNode;
      }
    }
  }

  removeAfter(targetValue) {
    const targetNode = this.findNode(targetValue);
    if (targetNode && targetNode.next) {
      const nodeToRemove = targetNode.next;
      targetNode.next = nodeToRemove.next;
      if (nodeToRemove === this.tail) {
        this.tail = targetNode;
      }
    }
  }
}
