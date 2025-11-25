## 基本概念
樹是一種重要的資料結構，具有以下特性：
- 無環連通圖
- n 個節點，n-1 條邊
- 任意兩點間有唯一路徑
### 重要術語
- 根節點（Root）：樹的頂端節點
- 葉節點（Leaf）：沒有子節點的節點
- 父節點（Parent）：有子節點的節點
- 子節點（Child）：被其他節點指向的節點
- 深度（Depth）：從根節點到該節點的路徑長度
- 高度（Height）：從該節點到最深葉節點的路徑長度
## 實作
### 節點定義
```cpp
struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};
```
### 前序走訪 (Pre-order)
```cpp
void preorder(TreeNode* root) {
    if (!root) return;
    
    cout << root->val << " ";  // 訪問根節點
    preorder(root->left);      // 走訪左子樹
    preorder(root->right);     // 走訪右子樹
}
```

### 中序走訪 (In-order)

```cpp
void inorder(TreeNode* root) {
    if (!root) return;
    
    inorder(root->left);       // 走訪左子樹
    cout << root->val << " ";  // 訪問根節點
    inorder(root->right);      // 走訪右子樹
}
```

### 後序走訪 (Post-order)

```cpp
void postorder(TreeNode* root) {
    if (!root) return;
    
    postorder(root->left);     // 走訪左子樹
    postorder(root->right);    // 走訪右子樹
    cout << root->val << " ";  // 訪問根節點
}
```

### 層序走訪 (Level-order)

```cpp
void levelorder(TreeNode* root) {
    if (!root) return;
    
    queue<TreeNode*> q;
    q.push(root);
    
    while (!q.empty()) {
        TreeNode* node = q.front();
        q.pop();
        
        cout << node->val << " ";
        
        if (node->left) q.push(node->left);
        if (node->right) q.push(node->right);
    }
}
```

## 常見應用

### 1. 樹的高度

```cpp
int maxDepth(TreeNode* root) {
    if (!root) return 0;
    return 1 + max(maxDepth(root->left), maxDepth(root->right));
}
```

### 2. 判斷平衡樹

```cpp
bool isBalanced(TreeNode* root) {
    return height(root) != -1;
}

int height(TreeNode* root) {
    if (!root) return 0;
    
    int left = height(root->left);
    int right = height(root->right);
    
    if (left == -1 || right == -1 || abs(left - right) > 1) {
        return -1;
    }
    
    return 1 + max(left, right);
}
```

### 3. 路徑總和

```cpp
bool hasPathSum(TreeNode* root, int targetSum) {
    if (!root) return false;
    
    if (!root->left && !root->right) {
        return root->val == targetSum;
    }
    
    return hasPathSum(root->left, targetSum - root->val) ||
           hasPathSum(root->right, targetSum - root->val);
}
```

## 重要概念
- 葉節點：沒有子節點的節點
- 滿二元樹：每個節點都有 0 或 2 個子節點
- 完全二元樹：除了最後一層，其他層都是滿的
- 平衡樹：左右子樹高度差不超過 1
---
競賽中的難題大量使用「樹的概念與演算法」，但很少使用 TreeNode 這種資料結構。
- 競賽樹大部分是「多叉樹」
- TreeNode 建立太慢、資料輸入複雜
