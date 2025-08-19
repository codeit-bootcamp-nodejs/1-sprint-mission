class Stack {
  constructor() {
    this.items = []; 
  }

  // 스택의 맨 위에 값 추가
  push(value) {
    this.items.push(value);
  }

  // 스택의 맨 위 값을 제거 후 리턴
  pop() {
    if (this.isEmpty()) {
      console.warn("스택이 비어 있습니다.");
      return null;
    }
    return this.items.pop();
  }

  // 스택의 맨 위 값 확인 (삭제 X)
  peek() {
    if (this.isEmpty()) {
      console.warn("스택이 비어 있습니다.");
      return null;
    }
    return this.items[this.items.length - 1];
  }

  // 스택이 비어 있는지 확인
  isEmpty() {
    return this.items.length === 0;
  }

  // (선택) 스택 크기 반환
  size() {
    return this.items.length;
  }

  // (선택) 디버깅용 출력
  print() {
    console.log(this.items.join(" -> "));
  }
}

// ===== 테스트 예시 =====
const stack = new Stack();

stack.push(10);
stack.push(20);
stack.push(30);
stack.print(); // 10 -> 20 -> 30

console.log(stack.peek());  // 30
console.log(stack.pop());   // 30
stack.print(); // 10 -> 20

console.log(stack.isEmpty()); // false
stack.pop();
stack.pop();
console.log(stack.isEmpty()); // true
