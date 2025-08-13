// 선택 정렬(Selection sort)
function selectionSort(arr) {
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i; // 현재 위치를 가장 작은 값이라고 가정

    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j; // 더 작은 값을 찾으면 인덱스 업데이트
      }
    }

    // 현재 위치(i)와 가장 작은 값의 위치(minIndex)를 교환
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }
  return arr;
}

// 테스트
const arr1 = [9, 4, 2, 3, 1, 8, 1];
const arr2 = [1, 2, 5, 2, 10, 16, 2];
const arr3 = [10, 8, 6, 4, 2, 1];

console.log(selectionSort(arr1));
console.log(selectionSort(arr2));
console.log(selectionSort(arr3));
