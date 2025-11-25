## 基本概念
priority_queue 是一種優先隊列，底層通常用 堆（heap） 實現，特性是：
- 最大堆（max-heap）：預設行為，堆頂元素是最大值。
- 最小堆（min-heap）：自訂比較函數後，堆頂元素是最小值。

## 實作
```cpp
#include <queue>
#include <vector>
#include <functional> // std::greater
std::priority_queue<int> maxHeap;  // 預設最大堆
std::priority_queue<int, std::vector<int>, std::greater<int>> minHeap; // 最小堆
```

## 自訂比較
複雜類型、多條件排序
### 使用 struct
```cpp
struct Student {
    std::string name;
    int score;
    int age;
};

// 方法1：定義比較函數
struct CompareStudent {
    bool operator()(const Student& a, const Student& b) {
        // 優先級：分數高的優先，分數相同時年齡小的優先
        if (a.score != b.score) {
            return a.score < b.score;  // 分數高的優先（最大堆）
        }
        return a.age > b.age;  // 年齡小的優先
    }
};

std::priority_queue<Student, std::vector<Student>, CompareStudent> studentHeap;
```

### 使用 lambda 表達式
```cpp
auto cmp = [](const Student& a, const Student& b) {
    if (a.score != b.score) {
        return a.score < b.score;
    }
    return a.age > b.age;
};

std::priority_queue<Student, std::vector<Student>, decltype(cmp)> studentHeap2(cmp);
```

### 使用 pair 進行多條件排序
```cpp
// pair<int, int> 代表 (priority, id)
// 預設按第一個元素排序，相同時按第二個元素排序
std::priority_queue<std::pair<int, int>> pairHeap;  // 最大堆

// 自訂 pair 比較（最小堆）
std::priority_queue<std::pair<int, int>, 
                    std::vector<std::pair<int, int>>, 
                    std::greater<std::pair<int, int>>> pairMinHeap;
```

## 實戰應用
- Top K 題型 → 優先熟悉最小堆維護 Top K（heap size = K）
- 流式/中位數題型 → 雙堆：最大堆 + 最小堆
- 合併排序 / 矩陣 / 多序列 → 最小堆維護當前最小值
- 事件模擬 → 最大堆或最小堆模擬優先級，常用 pair 或 struct

