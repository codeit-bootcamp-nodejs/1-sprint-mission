// 병합 정렬 (Merge Sort) - 안정성 보장 버전
function mergeSort(arr, compare = (a, b) => a - b) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid), compare);
  const right = mergeSort(arr.slice(mid), compare);

  return merge(left, right, compare);
}

function merge(left, right, compare) {
  const result = [];
  let i = 0,
    j = 0;

  while (i < left.length && j < right.length) {
    // 안정성 보장: 같으면 왼쪽을 먼저 넣음
    if (compare(left[i], right[j]) <= 0) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }

  // 남은 요소들 이어붙이기
  return result.concat(left.slice(i), right.slice(j));
}

// 테스트
console.log(mergeSort([3, 1, 2, 2, 1])); // [1, 1, 2, 2, 3]

console.log(mergeSort(["banana", "apple", "cherry"])); // ["apple", "banana", "cherry"]

// 객체 배열 정렬 (키 값 기준)
const data = [
  { k: 1, i: 0 },
  { k: 1, i: 1 },
  { k: 1, i: 2 },
];
console.log(mergeSort(data, (a, b) => a.k - b.k)); // i 순서 0, 1, 2 유지 → 안정성 확인
