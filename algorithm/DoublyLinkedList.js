// 내부 노드 클래스: 값 + 양방향 포인터(prev, next)
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
    this.length = 0; 
  }

  // O(1) — 리스트 앞(head)에 삽입
  addToHead(value) {
    const node = new Node(value);

    if (!this.head) {
      this.head = this.tail = node;
    } else {
      node.next = this.head;
      this.head.prev = node;
      this.head = node;
    }

    this.length++;
    return node;
  }

  // O(1) — 리스트 뒤(tail)에 삽입
  addToTail(value) {
    const node = new Node(value);

    if (!this.tail) {
      this.head = this.tail = node;
    } else {
      node.prev = this.tail;
      this.tail.next = node;
      this.tail = node;
    }

    this.length++;
    return node;
  }

  // O(n) — 값으로 노드 탐색(첫 매칭만 반환)
  findNode(value) {
    let cur = this.head;
    while (cur) {
      if (cur.value === value) return cur;
      cur = cur.next;
    }
    return null;
  }

  // O(n) — 특정 값(targetValue)을 가진 노드 '뒤'에 새 노드 삽입
  insertAfter(targetValue, newValue) {
    const target = this.findNode(targetValue);
    if (!target) {
      console.warn(`값 ${targetValue} 를 가진 노드를 찾을 수 없습니다.`);
      return null;
    }

    const node = new Node(newValue);
    node.prev = target;
    node.next = target.next;

    if (target.next) {
      target.next.prev = node;
    } else {
      // target이 tail이었다면 tail 갱신
      this.tail = node;
    }
    target.next = node;

    this.length++;
    return node;
  }

  // O(n) — 특정 값을 가진 '첫 번째' 노드를 삭제
  removeNode(value) {
    const node = this.findNode(value);
    if (!node) {
      console.warn(`값 ${value} 를 가진 노드를 찾을 수 없습니다.`);
      return null;
    }

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

    this.length--;
    return value;
  }

// ===== 테스트 예시 ===== //

const dll = new DoublyLinkedList();
dll.addToHead(2);         // 2
dll.addToHead(1);         // 1 <-> 2
dll.addToTail(3);         // 1 <-> 2 <-> 3
dll.insertAfter(2, 2.5);  // 1 <-> 2 <-> 2.5 <-> 3
dll.printForward();

dll.removeNode(1);        // 2 <-> 2.5 <-> 3
dll.removeNode(3);        // 2 <-> 2.5
dll.printForward();
dll.printBackward();

