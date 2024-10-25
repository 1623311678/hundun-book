# 算法

## 排序

### API 排序

```javascript
function sort(arr) {
  const newArr = arr.flat(Infinity);
  newArr.sort((a, b) => a - b);
  return newArr;
}
```

### 冒泡排序

```javascript
function bubbleSort(arr) {
  const len = arr.length;
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j + 1];
        arr[j + 1] = arr[j];
        arr[j] = temp;
      }
    }
  }
  return arr;
}
const arr = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];
console.log(bubbleSort(arr));
```

### 快速排序

```javascript
function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter((item) => item < pivot);
  const middle = arr.filter((item) => item === pivot);
  const right = arr.filter((item) => item > pivot);
  return [...quickSort(left), ...middle, ...quickSort(right)];
}

// 示例使用
const arr = [3, 6, 8, 10, 1, 2, 1];
console.log(quickSort(arr));
```
### 归并排序
```javascript
  function mergeSort(arr) {
        if (arr.length <= 1) {
          return arr;
        }
        const middle = Math.floor(arr.length / 2);
        const left = mergeSort(arr.slice(0, middle));
        const right = mergeSort(arr.slice(middle));

        return merge(left, right);
      }

      function merge(left, right) {
        let result = [];
        let leftIndex = 0;
        let rightIndex = 0;

        while (leftIndex < left.length && rightIndex < right.length) {
          if (left[leftIndex] < right[rightIndex]) {
            result.push(left[leftIndex]);
            leftIndex++;
          } else {
            result.push(right[rightIndex]);
            rightIndex++;
          }
        }

        return result
          .concat(left.slice(leftIndex))
          .concat(right.slice(rightIndex));
      }

      // 示例使用
      const arr = [10, 1, 2, 3, 4, 5];
      console.log(mergeSort(arr)); // 输
```
## 手写实现

### 实现数组的map

```javascript
const arr1 = [1, 2, 3];
    Array.prototype.myMap = function (callback) {
      const arr = this;
      const newArr = [];
      for (let i = 0; i < arr.length; i++) {
        const newVal = callback(arr[i], i, arr);
        newArr.push(newVal);
      }
      return newArr;
    };
console.log(arr1.myMap((item) => item * 2));
```
### 实现new操作符