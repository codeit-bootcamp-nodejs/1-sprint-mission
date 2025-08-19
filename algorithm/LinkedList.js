class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  addNode(value) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
      return;
    }
    let curr = this.head;
    while (curr.next) {
      curr = curr.next;
    }
    curr.next = newNode;
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
    newNode.next = targetNode.next;
    targetNode.next = newNode;
    return true;
  }

  removeAfter(targetValue) {
    const targetNode = this.findNode(targetValue);
    if (!targetNode || !targetNode.next) return false; 

    targetNode.next = targetNode.next.next;
    return true;
  }
}

const list = new LinkedList();

list.addNode(1);
list.addNode(2);
list.addNode(3);

console.log(list.findNode(2)); 

list.insertAfter(2, 4);  

list.removeAfter(2);       
