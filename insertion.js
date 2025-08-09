function insertionSort(nums) {
  for (i = 1; i < nums.length; i++) {
    key = nums[i];
    let j = i - 1;
    while (j >= 0 && key < nums[j]) {
      nums[j + 1] = nums[j];
      j--;
    }

    nums[j + 1] = key;
  }

  console.log("정렬완료:", nums);
  return nums;
}

const nums = [64, 25, 10, 22, 11];
insertionSort(nums);
