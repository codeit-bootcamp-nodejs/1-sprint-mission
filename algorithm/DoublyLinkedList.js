class Node {
  constructor(value) {
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  addToHead(value) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = this.tail = newNode;
      return;
    }
    newNode.next = this.head;
    this.head.prev = newNode;
    this.head = newNode;
  }

  addToTail(value) {
    const newNode = new Node(value);
    if (!this.tail) {
      this.head = this.tail = newNode;
      return;
    }
    newNode.prev = this.tail;
    this.tail.next = newNode;
    this.tail = newNode;
  }

  findNode(value) {
    let curr = this.head;
    while (curr) {
      if (curr.value === value) return curr;
      curr = curr.next;
    }
    return null;
  }

  insertAfter(targetValue, newValue) {
    const targetNode = this.findNode(targetValue);
    if (!targetNode) return false;

    const newNode = new Node(newValue);

    newNode.prev = targetNode;
    newNode.next = targetNode.next;

    if (targetNode.next) {
      targetNode.next.prev = newNode;
    } else {
      this.tail = newNode;
    }

    targetNode.next = newNode;
    return true;
  }

  removeNode(value) {
    const node = this.findNode(value);
    if (!node) return false;

    if (node.prev) {
      node.prev.next = node.next;
    } else {
      this.head = node.next;
    }

    if (node.next) {
      node.next.prev = node.prev;
    } else {
      this.tail = node.prev;
    }

    node.prev = null;
    node.next = null;

    return true;
  }
}

module.exports = DoublyLinkedList;
