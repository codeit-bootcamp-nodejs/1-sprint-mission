//insertionSort
function insertionSort(array) {
  const n = array.length;
  for (let i = 1; i < n; i++) {
    const key = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > key) {
      array[j + 1] = array[j];
      j--;
    }
    array[j + 1] = key;
  }
  return array;
}

//selectionSort
function selectionSort(array) {
  const n = array.length;
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
    }
    if (minIndex !== i) {
      [array[i], array[minIndex]] = [array[minIndex], array[i]];
    }
  }
  return array;
}

//mergeSort
function mergeSort(array) {
  if (array.length <= 1) return array;

  const mid = Math.floor(array.length / 2);
  const left = mergeSort(array.slice(0, mid));
  const right = mergeSort(array.slice(mid));

  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }

  return result.concat(left.slice(i)).concat(right.slice(j));
}

//quickSort
function quickSort(numbers) {
  if (numbers.length <= 1) {
    return numbers;
  }
  const pivot = numbers[numbers.length - 1];
  const left = [];
  const right = [];

  for (let i = 0; i < numbers.length - 1; i++) {
    if (numbers[i] > pivot) {
      right.push(numbers[i]);
    } else {
      left.push(numbers[i]);
    }
  }

  return [...quickSort(left), pivot, ...quickSort(right)];
}

const nums1 = [7, 1, 2, 4];
insertionSort(nums1);
console.log("InsertionSort:", nums1); // [1, 2, 4, 7]

const nums2 = [3, 1, 2, 6];
selectionSort(nums2);
console.log("SelectionSort:", nums2); // [1, 2, 3, 6]

const nums3 = [5, 7, 4, 1];
const sortedMerge = mergeSort(nums3);
console.log("MergeSort:", sortedMerge); // [1, 4, 5, 7]

const nums4 = [11, 3, 8, 4];
const sortedQuick = quickSort(nums4);
console.log("QuickSort:", sortedQuick); // [3, 4, 8, 11]
