## Commit Message 格式規範
```txt
<type>(<scope>):<subject>
<type>:<subject>
```
- type：修改類型
- scope（可選）：影響的範圍（模組、功能、檔案等）
- subject：一句話概述，不超過 50 字元
- 同一個 commit message 不建議同時出現兩個 type
- subject 不應以大寫字母開頭，也不應以句號結尾
- subject 應使用祈使句語氣
### 常見的 type 類型
- feat：新增功能
- fix：修復 bug
- docs：文件修改
- style：程式碼格式修改（不影響邏輯）
- refactor：重構程式碼（不新增功能或修復 bug）
- test：新增或修改測試
- chore：其他修改（如建構流程、依賴管理等）
- perf：性能優化
- ci：持續整合相關修改
- build：建構系統相關修改
- revert：回滾先前的提交
- wip：進行中的工作
### 範例
使用項目符號可以把一次 commit 中的多個修改點分開列出。例如：
```txt
feat(auth): add user login feature
- Implement login API endpoint
- Create login form UI
- Add validation for user input
```

- 這樣的 commit message 清楚地說明了這次提交新增了一個用戶登入功能，並列出了具體的修改點，方便團隊成員理解和追蹤變更內容。
- 許多 CI/CD 工具可以更容易解析這種結構化的訊息，進而自動產生版本更新記錄。

## 常用 Git Commit 指令

- git commit -m "commit message"：提交修改並附上簡短的 commit message
- git commit -am "commit message"：將所有已追蹤的檔案的修改加入暫存區並提交，附上 commit message
- git commit --amend -m "new commit message"：修改最後一次提交的 commit message
- git push origin main：將本地的 main 分支推送到遠端 main 分支
## 專案中的 Git 指令

- git pull --rebase origin main：先把遠端更新抓下來（不覆蓋你現在的改動）
- git checkout -b feature/new-feature：建立並切換到一個新的分支 feature/new-feature
- git merge feature/new-feature：將 feature/new-feature 分支合併到當前分支
- git reset --hard HEAD：回到遠端最後一次提交，丟棄所有未提交的修改
- git reset --soft HEAD~1：回到遠端最後一次提交，但還保留目前的程式碼
- git reset --hard <commit-hash>：想回到某個特定的提交
- git remote set-url origin <url>：修改遠端倉庫的 URL

