function selectionSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    let minIndex = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[minIndex] > arr[j]) {
        minIndex = j;
      }
    }
    let temp = arr[i];
    arr[i] = arr[minIndex];
    arr[minIndex] = temp;
  }
}

function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    for (let j = i; j > 0; j--) {
      if (arr[j] < arr[j - 1]) {
        let temp = arr[j];
        arr[j] = arr[j - 1];
        arr[j - 1] = temp;
      } else {
        break;
      }
    }
  }
}

function merge(arr, left, mid, right) {
  let i = left;
  let j = mid + 1;
  let k = left;
  while (i <= mid && j <= right) {
    if (arr[i] <= arr[j]) sorted[k++] = arr[i++];
    else sorted[k++] = arr[j++];
  }

  if (i > mid) {
    for (; j <= right; j++) sorted[k++] = arr[j];
  } else {
    for (; i <= mid; i++) sorted[k++] = arr[i];
  }

  for (let x = left; x <= right; x++) {
    arr[x] = sorted[x];
  }
}

function mergeSort(arr, left, right) {
  if (left < right) {
    let mid = parseInt((left + right) / 2);
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
  }
}

function quickSort(arr) {
  return arr.sort((a, b) => a - b);
}

function heapsort(arr) {
  const n = arr.length;

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }

  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];

    heapify(arr, i, 0);
  }
}

function heapify(arr, n, i) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }

  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }

  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}

const nums = [3, 1, 2];
console.log(nums);

const arr1 = [...nums];
selectionSort(arr1);
console.log(arr1);

const arr2 = [...nums];
insertionSort(arr2);
console.log(arr2);

const arr3 = [...nums];
sorted = Array.from({ length: arr3.length }, () => 0);
mergeSort(arr3, 0, arr3.length - 1);
console.log(arr3);

const arr4 = [...nums];
quickSort(arr4);
console.log(arr4);

const arr5 = [...nums];
heapsort(arr5);
console.log(arr5);
