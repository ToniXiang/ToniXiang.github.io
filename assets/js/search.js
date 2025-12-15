// Search functionality for notes
class NotesSearch {
    constructor() {
        this.notes = [];
        this.searchInput = document.getElementById('searchInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.searchStats = document.getElementById('searchStats');
        this.notesGrid = document.getElementById('notesGrid');
        this.searchLoading = document.getElementById('searchLoading');
        this.originalNotesLayout = document.querySelector('.notes-layout');
        this.searchContainer = document.querySelector('.search-container');

        // 将实例保存到全局变量，供openNote函数使用
        window.notesSearchInstance = this;

        this.init();
    }

    async init() {
        // 確保搜索容器初始隱藏
        if (this.searchContainer) {
            this.searchContainer.style.display = 'none';
        }

        await this.loadNotes();
        this.bindEvents();
        this.addSearchToggle();
        this.toggleLayouts(false); // Initially hide search results and show original layout
    }

    addSearchToggle() {
        // Create search toggle button
        const notesContainer = document.querySelector('.notes-container');
        if (notesContainer) {
            const searchToggleBtn = document.createElement('button');
            searchToggleBtn.innerHTML = '搜尋筆記';
            searchToggleBtn.className = 'search-toggle-btn';
            searchToggleBtn.onclick = () => this.showSearchMode();

            // Insert at the beginning of notes container
            const firstChild = notesContainer.firstElementChild;
            if (firstChild) {
                notesContainer.insertBefore(searchToggleBtn, firstChild);
            }
        }

        // Add close search button to search container
        if (this.searchContainer) {
            const closeSearchBtn = document.createElement('button');
            closeSearchBtn.innerHTML = '✕ 返回筆記列表';
            closeSearchBtn.className = 'close-search-btn';
            closeSearchBtn.onclick = () => this.hideSearchMode();

            const searchHeader = this.searchContainer.querySelector('.search-header');
            if (searchHeader) {
                searchHeader.appendChild(closeSearchBtn);
            }
        }
    }

    showSearchMode() {
        this.toggleLayouts(true);
        this.searchInput.focus();
    }

    hideSearchMode() {
        this.toggleLayouts(false);
        this.searchInput.value = '';
    }

    async loadNotes() {
        // 定義所有筆記檔案及其對應標題
        const noteFiles = [
            { filename: 'Binary_Search.md', title: '二分搜尋演算法' },
            { filename: 'Leetcode.md', title: 'LeetCode 演算法解題' },
            { filename: 'Priority.md', title: '堆積與優先佇列' },
            { filename: 'Tree.md', title: '樹與圖論演算法' },
            { filename: 'Unordered.md', title: '雜湊表應用' },
            { filename: '後端整合.md', title: '後端系統整合' },
        ];

        this.showLoading(true);

        try {
            const promises = noteFiles.map(async (noteFile) => {
                try {
                    const response = await fetch(`assets/notes/${noteFile.filename}`);
                    if (response.ok) {
                        const content = await response.text();
                        return {
                            filename: noteFile.filename,
                            title: noteFile.title,
                            content: content,
                            preview: this.generatePreview(content),
                        };
                    }
                } catch (error) {
                    console.warn(`Failed to load ${noteFile.filename}:`, error);
                }
                return null;
            });

            const results = await Promise.all(promises);
            this.notes = results.filter(note => note !== null);

            console.log(`Loaded ${this.notes.length} notes`);

        } catch (error) {
            console.error('Error loading notes:', error);
            this.showError('載入筆記時發生錯誤');
        }

        this.showLoading(false);
    }

    generatePreview(content) {
        // 移除 Markdown 語法
        let preview = content
            .replace(/^#{1,6}\s+/gm, '') // 移除標題
            .replace(/\*\*(.*?)\*\*/g, '$1') // 移除粗體
            .replace(/\*(.*?)\*/g, '$1') // 移除斜體
            .replace(/`{1,3}[^`]*`{1,3}/g, '') // 移除程式碼
            .replace(/\[([^\]]+)]\([^)]+\)/g, '$1') // 移除連結，保留文字
            .replace(/^\s*[-*+]\s+/gm, '') // 移除列表符號
            .replace(/^\s*\d+\.\s+/gm, '') // 移除數字列表
            .trim();

        // 取前200個字符作為預覽
        return preview.length > 200 ? preview.substring(0, 200) + '...' : preview;
    }



    bindEvents() {
        // 搜尋按鈕點擊
        this.searchBtn.addEventListener('click', () => {
            this.performSearch();
        });

        // 輸入框回車搜尋
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });

        // 即時搜尋（輸入時搜尋）
        let debounceTimer;
        this.searchInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                this.performSearch();
            }, 300);
        });
    }

    toggleLayouts(showSearch) {
        if (this.searchContainer && this.originalNotesLayout) {
            if (showSearch) {
                this.searchContainer.style.display = 'block';
                this.searchContainer.classList.add('active');
                this.originalNotesLayout.style.display = 'none';
            } else {
                this.searchContainer.style.display = 'none';
                this.searchContainer.classList.remove('active');
                this.originalNotesLayout.style.display = 'block';
            }
        }
    }

    performSearch() {
        const query = this.searchInput.value.trim().toLowerCase();

        this.toggleLayouts(true); // Always show search results when in search mode
        this.showLoading(true);

        // 模擬搜尋延遲
        setTimeout(() => {
            if (query === '') {
                // 當搜索框為空時，顯示所有筆記
                this.displayResults(this.notes, query);
            } else {
                const results = this.searchNotes(query);
                this.displayResults(results, query);
            }
            this.showLoading(false);
        }, 200);
    }

    searchNotes(query) {
        const results = [];

        for (const note of this.notes) {
            let score = 0;
            let titleMatch = false;
            let contentMatch = false;

            // 標題搜尋（權重更高）
            if (note.title.toLowerCase().includes(query)) {
                score += 10;
                titleMatch = true;
            }

            // 內容搜尋
            if (note.content.toLowerCase().includes(query)) {
                score += 5;
                contentMatch = true;
            }

            // 檔名搜尋
            if (note.filename.toLowerCase().includes(query)) {
                score += 3;
            }

            if (score > 0) {
                results.push({
                    ...note,
                    score: score,
                    titleMatch: titleMatch,
                    contentMatch: contentMatch
                });
            }
        }

        // 按分數排序
        return results.sort((a, b) => b.score - a.score);
    }

    displayResults(results, query) {
        if (results.length === 0) {
            this.showNoResults(query);
            return;
        }

        this.searchStats.textContent = query ?
            `找到 ${results.length} 個相關結果` :
            `共 ${results.length} 篇筆記`;

        this.notesGrid.innerHTML = results.map(note =>
            this.createNoteCard(note, query)
        ).join('');
    }

    createNoteCard(note, query) {
        const highlightedTitle = this.highlightText(note.title, query);
        const highlightedPreview = this.highlightText(note.preview, query);

        // 生成筆記ID以供打開筆記使用
        const noteId = note.filename.replace('.md', '').replace('.txt', '');
        const escapedNoteId = noteId.replace(/'/g, "\\'");

        return `
            <div class="note-card" onclick="openNote('${escapedNoteId}')">
                <h3 class="note-title">${highlightedTitle}</h3>
                <p class="note-preview">${highlightedPreview}</p>
                <div class="note-meta">
                    <span class="note-filename">${note.filename}</span>
                </div>
            </div>
        `;
    }

    highlightText(text, query) {
        if (!query) return text;

        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
    }

    showNoResults(query) {
        this.searchStats.textContent = '沒有找到相關結果';
        this.notesGrid.innerHTML = `
            <div class="no-results">
                <h3>找不到相關筆記</h3>
                <p>嘗試使用不同的關鍵字或檢查拼寫</p>
                ${query ? `<p>搜尋詞：「${query}」</p>` : ''}
            </div>
        `;
    }

    showLoading(show) {
        this.searchLoading.style.display = show ? 'flex' : 'none';
    }

    showError(message) {
        this.notesGrid.innerHTML = `
            <div class="no-results">
                <h3>載入失敗</h3>
                <p>${message}</p>
            </div>
        `;
    }
}

// 開啟筆記的函數
function openNote(noteId) {
    console.log(`正在打開筆記: ${noteId}`);

    // 检查是否在notes.html页面
    if (window.location.pathname.includes('notes.html') || window.location.pathname.endsWith('/notes.html')) {
        // 在当前页面打开笔记
        const searchInstance = window.notesSearchInstance;
        if (searchInstance) {
            // 关闭搜索模式，显示原始笔记布局
            searchInstance.hideSearchMode();
        }

        // 使用hash来打开笔记（这会触发notes.js中的handleUrlHash）
        window.location.hash = `#${encodeURIComponent(noteId)}`;

        // 如果notes.js已加载，直接调用showNoteModal
        if (typeof showNoteModal === 'function') {
            setTimeout(() => {
                showNoteModal(noteId);
            }, 100);
        }
    } else {
        // 如果不在notes页面，则跳转到notes页面
        window.location.href = `notes.html#${encodeURIComponent(noteId)}`;
    }
}

// 當頁面載入完成時初始化搜尋功能
document.addEventListener('DOMContentLoaded', () => {
    new NotesSearch();
});

// 添加一些實用的搜尋快捷鍵
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K 快速聚焦搜尋框
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('searchInput').focus();
    }

    // ESC 清除搜尋
    if (e.key === 'Escape') {
        const searchInput = document.getElementById('searchInput');
        if (document.activeElement === searchInput) {
            searchInput.value = '';
            searchInput.blur();
            // 觸發搜尋以顯示所有筆記
            searchInput.dispatchEvent(new Event('input'));
        }
    }
});

