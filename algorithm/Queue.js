class Queue {
  constructor() {
    this.items = []; 
  }

  // 큐의 맨 뒤에 값 추가 (enqueue)
  enqueue(value) {
    this.items.push(value);
  }

  // 큐의 앞에서 값 제거 후 리턴 (dequeue)
  dequeue() {
    if (this.isEmpty()) {
      console.warn("큐가 비어 있습니다.");
      return null;
    }
    return this.items.shift(); 
  }

  // 큐의 앞에 있는 값 확인 (제거하지 않음)
  peek() {
    if (this.isEmpty()) {
      console.warn("큐가 비어 있습니다.");
      return null;
    }
    return this.items[0];
  }

  // 큐가 비어 있는지 확인
  isEmpty() {
    return this.items.length === 0;
  }

// ===== 테스트 예시 =====

const queue = new Queue();

queue.enqueue(1);
queue.enqueue(2);
queue.enqueue(3);
queue.print(); // 1 <- 2 <- 3

console.log(queue.peek());   // 1
console.log(queue.dequeue()); // 1
queue.print(); // 2 <- 3

console.log(queue.isEmpty()); // false
queue.dequeue();
queue.dequeue();
console.log(queue.isEmpty()); // true
