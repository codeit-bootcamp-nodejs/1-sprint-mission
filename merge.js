function mergeSort(nums) {
  if (nums.length <= 1) return nums;

  let mid = nums.length / 2;
  let left = nums.slice(0, mid);
  let right = nums.slice(mid);

  left = mergeSort(left);
  right = mergeSort(right);

  return merge(left, right);
}

function merge(left, right) {
  let result = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }

  result = result.concat(left.slice(i)).concat(right.slice(j));
  return result;
}

const nums = [64, 25, 10, 22, 11];
const sorted = mergeSort(nums);

console.log("정렬 결과:", sorted);
