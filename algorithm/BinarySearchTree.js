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

  // 값 삽입
  insert(value) {
    const newNode = new Node(value);

    if (!this.root) {
      this.root = newNode;
      return;
    }

    let current = this.root;
    while (true) {
      if (value === current.value) {
        return;
      }
      if (value < current.value) {
        if (!current.left) {
          current.left = newNode;
          return;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = newNode;
          return;
        }
        current = current.right;
      }
    }
  }

  // 값 찾기
  find(value) {
    let current = this.root;
    while (current) {
      if (value === current.value) return current;
      if (value < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }
    return null; 
  }

  // 최소값 찾기 (remove에서 사용)
  _findMin(node) {
    while (node.left) {
      node = node.left;
    }
    return node;
  }

  // 값 삭제
  remove(value, node = this.root) {
    if (!node) return null;

    if (value < node.value) {
      node.left = this.remove(value, node.left);
    } else if (value > node.value) {
      node.right = this.remove(value, node.right);
    } else {
      if (!node.left && !node.right) {
        return null; 
      } else if (!node.left) {
        return node.right; 
      } else if (!node.right) {
        return node.left;
      } else {
        const minNode = this._findMin(node.right);
        node.value = minNode.value; 
        node.right = this.remove(minNode.value, node.right); 
      }
    }
    return node;
  }
}

// ===== 테스트 예시 =====
const bst = new BinarySearchTree();
bst.insert(10);
bst.insert(5);
bst.insert(15);
bst.insert(2);
bst.insert(7);
bst.insert(12);
bst.insert(20);

console.log("찾기:", bst.find(7)); // Node { value: 7, left: null, right: null }
console.log("삭제 전:"); bst.inorder(); // 2 5 7 10 12 15 20
console.log("\n");

bst.remove(10); // 루트(10) 삭제
console.log("삭제 후:"); bst.inorder(); // 2 5 7 12 15 20
console.log("\n");
