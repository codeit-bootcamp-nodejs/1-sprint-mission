// 노드 클래스: 데이터와 다음 노드를 가리키는 포인터를 가짐
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

// 리스트 끝에 새 노드를 추가
  addNode(value) {
    const newNode = new Node(value);

    if (!this.head) {
      this.head = newNode;
      return;
    }

    let current = this.head;
    while (current.next) {
      current = current.next;
    }

    current.next = newNode;
  }

// 주어진 값을 가지는 노드 찾기
  findNode(value) {
    let current = this.head;

    while (current) {
      if (current.value === value) {
        return current;
      }
      current = current.next;
    }

    return null; 
  }

// 특정 값을 가진 노드 뒤에 새 노드 추가
  insertAfter(targetValue, newValue) {
    const targetNode = this.findNode(targetValue);

    if (!targetNode) {
      console.log(`값 ${targetValue} 를 가진 노드를 찾을 수 없습니다.`);
      return;
    }

    const newNode = new Node(newValue);
    newNode.next = targetNode.next; 
    targetNode.next = newNode; 
  }

// 특정 값을 가진 노드 뒤의 노드를 삭제
  removeAfter(targetValue) {
    const targetNode = this.findNode(targetValue);

    if (!targetNode) {
      console.log(`값 ${targetValue} 를 가진 노드를 찾을 수 없습니다.`);
      return;
    }

    if (!targetNode.next) {
      console.log(`값 ${targetValue} 뒤에는 노드가 없습니다.`);
      return;
    }

    targetNode.next = targetNode.next.next;
  }

// 테스트 코드
const list = new LinkedList();
list.addNode(1);
list.addNode(2);
list.addNode(3);
list.printList(); // 1 -> 2 -> 3 -> null

list.insertAfter(2, 2.5);
list.printList(); // 1 -> 2 -> 2.5 -> 3 -> null

list.removeAfter(2);
list.printList(); // 1 -> 2 -> 3 -> null
