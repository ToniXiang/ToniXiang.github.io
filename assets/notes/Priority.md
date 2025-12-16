## 基本概念
priority_queue 是一種優先隊列，底層通常用 堆（heap） 實現，特性是：
- 最大堆（max-heap）：預設行為，堆頂元素是最大值
- 最小堆（min-heap）：自訂比較函數後，堆頂元素是最小值

## 實作
### 基本用法
```cpp
#include <queue>
#include <vector>
#include <functional> // std::greater

// 1. 最大堆（預設）
std::priority_queue<int> maxHeap;  
maxHeap.push(5);
maxHeap.push(1);
maxHeap.push(10);
// maxHeap.top() = 10 (最大值在頂部)

// 2. 最小堆
std::priority_queue<int, std::vector<int>, std::greater<int>> minHeap; 
minHeap.push(5);
minHeap.push(1);
minHeap.push(10);
// minHeap.top() = 1 (最小值在頂部)

// 3. 基本操作
// push(element): 插入元素
// top(): 訪問堆頂元素
// pop(): 移除堆頂元素
// empty(): 檢查是否為空
// size(): 返回堆的大小
```

## 自訂比較
用於複雜類型或多條件排序

### 方法一：使用 struct
**適用場景**：需要複雜比較邏輯，可重複使用的比較器
```cpp
struct Student {
    std::string name;
    int score;
    int age;
};

struct CompareStudent {
    bool operator()(const Student& a, const Student& b) {
        // 重要：回傳 true 表示 a 的優先級「低於」 b
        // 優先級：分數高的優先，分數相同時年齡小的優先
        if (a.score != b.score) {
            return a.score < b.score;  // 分數低的優先級較低（分數高的在頂部）
        }
        return a.age > b.age;  // 年齡大的優先級較低（年齡小的在頂部）
    }
};

std::priority_queue<Student, std::vector<Student>, CompareStudent> studentHeap;

// 使用範例
studentHeap.push({"Alice", 85, 20});
studentHeap.push({"Bob", 90, 22});
studentHeap.push({"Carol", 85, 19});
// 結果順序：Bob(90,22) -> Carol(85,19) -> Alice(85,20)
```

### 方法二：使用 lambda
**適用場景**：簡潔的一次性比較邏輯
```cpp
auto cmp = [](const Student& a, const Student& b) {
    // 相同的比較邏輯
    if (a.score != b.score) {
        return a.score < b.score;  // 分數高的優先
    }
    return a.age > b.age;  // 年齡小的優先
};

std::priority_queue<Student, std::vector<Student>, decltype(cmp)> studentHeap2(cmp);

// 或者直接在定義時使用
auto studentHeap3 = std::priority_queue<Student, std::vector<Student>, decltype(cmp)>(cmp);
```

### 方法三：使用 pair
**適用場景**：簡單的雙條件排序
```cpp
// 預設行為：先比較 first，再比較 second（都是最大堆）
std::priority_queue<std::pair<int, int>> pairHeap;  
pairHeap.push({5, 100});
pairHeap.push({5, 200});
pairHeap.push({3, 50});
// 結果順序：(5,200) -> (5,100) -> (3,50)

// 混合比較：第一個元素最大堆，第二個元素最小堆
auto mixedCmp = [](const std::pair<int, int>& a, const std::pair<int, int>& b) {
    if (a.first != b.first) {
        return a.first < b.first;   // 第一個元素：大的優先
    }
    return a.second > b.second;     // 第二個元素：小的優先
};
std::priority_queue<std::pair<int, int>, std::vector<std::pair<int, int>>, decltype(mixedCmp)> mixedHeap(mixedCmp);
```

### 方法四：使用 tuple
**適用場景**：需要三個或更多條件的排序，比 struct 更靈活
```cpp
#include <tuple>

// 使用 typedef 或 using 別名簡化語法
typedef std::tuple<int, int, int> tiii;

// tuple<int, int, int> 代表 (score, age, id)
// 預設行為：按順序比較每個元素（都是最大堆）
std::priority_queue<tiii> tupleHeap;
tupleHeap.push({85, 20, 1001});
tupleHeap.push({90, 22, 1002});
tupleHeap.push({85, 19, 1003});
tupleHeap.push({85, 20, 1004});
// 結果順序：(90,22,1002) -> (85,20,1004) -> (85,20,1001) -> (85,19,1003)

// 使用 tie 簡化 tuple 操作
int score, age, id;
std::tie(score, age, id) = tupleHeap.top();  // 解包 tuple
tupleHeap.push(std::make_tuple(95, 18, 1005)); // 建立 tuple
```

## 實戰應用
- Top K 題型 → 優先熟悉最小堆維護 Top K（heap size = K）
- 流式/中位數題型 → 雙堆：最大堆 + 最小堆
- 合併排序 / 矩陣 / 多序列 → 最小堆維護當前最小值
- 事件模擬 → 最大堆或最小堆模擬優先級，常用 pair 或 struct

