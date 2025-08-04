// 선택 정렬
function selection(data){
  for(let i=0; i < data.length - 1; i++){
    let minIndex = i;
    for(let j = i+1; j< data.length; j++){
      if(data[j] < data[minIndex]){
        minIndex = j;
      }
    }
    if (minIndex !== i) {
  let temp = data[i];
  data[i] = data[minIndex];
  data[minIndex] = temp;
}
  }
  return data;
}
const nums = [1,5,2,8,6]
console.log(selection(nums));

// 삽입 정렬
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let current = arr[i];
    let j = i - 1;

    while (j >= 0 && arr[j] > current) {
      arr[j + 1] = arr[j];
      j--;
    }

    arr[j + 1] = current;
  }

  return arr;
}

const nums1 = [5, 2, 4, 6, 1, 3];
console.log(insertionSort(nums1)); 

// 병합 정렬
function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left, right) {
  const result = [];

  while (left.length && right.length) {
    if (left[0] < right[0]) result.push(left.shift());
    else result.push(right.shift());
  }

  return result.concat(left, right);
}

const nums2 = [9, 7, 5, 3, 1];
console.log(mergeSort(nums2));

// 퀵 정렬
function quickSort(arr, start = 0, end = arr.length - 1) {
  if (start >= end) return;

  const pivotIndex = partition(arr, start, end);
  quickSort(arr, start, pivotIndex - 1);
  quickSort(arr, pivotIndex + 1, end);

  return arr;
}

function partition(arr, start, end) {
  const pivot = arr[end];
  let i = start;

  for (let j = start; j < end; j++) {
    if (arr[j] <= pivot) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
    }
  }

  [arr[i], arr[end]] = [arr[end], arr[i]];
  return i;
}

const nums3 = [8, 4, 2, 9, 1];
console.log(quickSort(nums3));