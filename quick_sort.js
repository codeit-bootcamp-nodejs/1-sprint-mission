// 퀵 정렬(Quick sort)
function quickSort(arr) {
  if (arr.length <= 1) {
    return arr; // 배열이 1개 이하이면 그대로 반환
  }

  const pivot = arr[arr.length - 1]; // 마지막 요소를 피벗으로 선택
  const left = []; // 피벗보다 작은 요소들
  const right = []; // 피벗보다 큰 요소들

  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]); // 피벗보다 작으면 왼쪽 배열에 추가
    } else {
      right.push(arr[i]); // 그렇지 않으면 오른쪽 배열에 추가
    }
  }

  // 왼쪽 배열, 피벗, 오른쪽 배열을 합쳐서 반환
  return [...quickSort(left), pivot, ...quickSort(right)];
}

// 테스트
console.log(quickSort([5, 2, 4, 6, 1, 3])); // [ 1, 2, 3, 4, 5, 6 ]
