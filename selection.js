function selectionSort(nums) {
  let temp = 0;
  let min_index = 0;

  for (i = 0; i < nums.length; i++) {
    min_index = i;

    for (j = i + 1; j < nums.length; j++) {
      if (nums[min_index] > nums[j]) {
        min_index = j;
      }
    }
    temp = nums[min_index];
    nums[min_index] = nums[i];
    nums[i] = temp;
  }

  console.log("정렬 완료:", nums);

  return nums;
}

const nums = [64, 25, 10, 22, 11];
selectionSort(nums);
