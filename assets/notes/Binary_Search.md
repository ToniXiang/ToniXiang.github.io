## 基本概念
Binary Search 是一種在已排序陣列中查找特定元素的高效演算法，時間複雜度為 O(log n)。
## 實作
### 常用變體
STL 已實作: lower_bound, upper_bound, binary_search
- 第一個 ≥ key → lower_bound
- 第一個 > key → upper_bound
- 是否存在 key → binary_search
- 找最後一個 ≤ key → upper_bound - 1
- 找最後一個 < key → lower_bound - 1
### 基本模板
### 標準二分搜尋模板
```cpp
auto bs=[&](int left, int right, int key) -> bool {
    if(left>right)return false;
    int mid=(left+right)>>1;
    if(arr[mid]==key)return true;
    else if(arr[mid]<key)return self(self, mid+1, right, key);
    else return self(self, left, mid-1, key);
};
```
### 標準 lower_bound 模板
```cpp
auto lower_bound=[&](int left, int right, int key) -> int {
    if(left>=right) return left;
    int mid=(left+right)>>1;
    if(arr[mid]<key)return self(self, mid+1, right, key);
    else return self(self, left, mid, key);
};
```
### 標準 upper_bound 模板
```cpp
auto upper_bound=[&](int left, int right, int key) -> int {
    if(left>=right) return left;
    int mid=(left+right)>>1;
    if(arr[mid]<=key)return self(self, mid+1, right, key);
    else return self(self, left, mid, key);
};
```
### 快速使用
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
- 在數學問題中使用二分搜尋逼近解
## 注意事項
- 陣列必須已排序
- 注意邊界條件、看「規律」是否成立
- 二分不是找「mid 是不是答案」而是找「答案在左邊還是右邊」
- 永遠結束在 left == right
