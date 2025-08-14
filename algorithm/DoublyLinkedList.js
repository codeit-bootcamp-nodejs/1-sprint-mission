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
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
    }
  }

  addToTail(value) {
    const newNode = new Node(value);
    if (!this.tail) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail.next = newNode;
      this.tail = newNode;
    }
  }

  insertAfter(targetValue, newValue) {
    const targetNode = this.findNode(targetValue);
    if (targetNode) {
      const newNode = new Node(newValue);
      newNode.prev = targetNode;
      newNode.next = targetNode.next;
      if (targetNode.next) {
        targetNode.next.prev = newNode;
      }
      targetNode.next = newNode;
      if (targetNode === this.tail) {
        this.tail = newNode;
      }
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

  removeNode(value) {
    const nodeToRemove = this.findNode(value);
    if (nodeToRemove) {
      if (nodeToRemove === this.head && nodeToRemove === this.tail) {
        this.head = null;
        this.tail = null;
      } else if (nodeToRemove === this.head) {
        this.head = nodeToRemove.next;
        this.head.prev = null;
      } else if (nodeToRemove === this.tail) {
        this.tail = nodeToRemove.prev;
        this.tail.next = null;
      } else {
        nodeToRemove.prev.next = nodeToRemove.next;
        nodeToRemove.next.prev = nodeToRemove.prev;
      }
    }
  }
}
