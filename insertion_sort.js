// 삽입 정렬(Insertion sort)
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i]; // 현재 값
    let j = i - 1; // 이전 인덱스

    // 현재 값보다 큰 값들을 오른쪽으로 이동
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }

    // 현재 값을 올바른 위치에 삽입
    arr[j + 1] = key;
  }
  return arr;
}

// 테스트
console.log(insertionSort([5, 2, 4, 6, 1, 3])); // [1, 2, 3, 4, 5, 6]
