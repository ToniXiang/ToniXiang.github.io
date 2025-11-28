## 基本概念

Binary Search 是一種在已排序陣列中查找特定元素的高效演算法，時間複雜度為 O(log n)。

## 實作

### 常用變體與回傳值

- lower_bound | return left;  | 第一個 ≥ key |
- upper_bound | return left;  | 第一個 > key |
- 找最後一個 ≤ key | return index 或 right; | 基本 |
- 找某個等於 key 的 index | return index 或 -1 | 基本 |

### 基本模板

### 標準二分搜尋模板
```cpp
auto=[&](int left, int right, int key) -> int {
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (/* condition to move left */) {
            right = mid - 1;
        } else if (/* condition to move right */) {
            left = mid + 1;
        } else {
            return mid; // Found the key
        }
    }
    return -1; // Key not found
};
```
### lower_bound 模板
```cpp
auto =[&](int left, int right, int key) -> int {
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] >= key) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    return left; // First position where arr[left] >= key
};
```
### upper_bound 模板
```cpp
auto =[&](int left, int right, int key) -> int {
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] > key) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    return left; // First position where arr[left] > key
};
```
快速使用
```cpp
#include <algorithm>
namespace std;
void example() {
    vector<int> arr = {1, 2, 2, 3, 4, 5};
    int key = 2;
    // lower_bound 回傳迭代器
    auto lb = lower_bound(arr.begin(), arr.end(), key);
    // upper_bound 回傳迭代器
    auto ub = upper_bound(arr.begin(), arr.end(), key);
    // binary_search 回傳 bool
    bool found = binary_search(arr.begin(), arr.end(), key);
    cout << "Lower Bound Index: " << (lb - arr.begin()) << endl;
    cout << "Upper Bound Index: " << (ub - arr.begin()) << endl;
    cout << "Element Found: " << (found ? "Yes" : "No") << endl;
}
```
## 實戰應用
- 找元素在排序陣列中的位置
- 找插入位置以保持排序
- 找排序陣列中某個值的範圍
- 在數學問題中使用二分搜尋逼近解
## 使用場景
- 在排序陣列中查找元素
- 查找插入位置
- 範圍查詢（找到區間的左右邊界）
- 最值問題的二分搜索

## 注意事項
- 陣列必須已排序
- 注意邊界條件
- 選擇正確的變體
