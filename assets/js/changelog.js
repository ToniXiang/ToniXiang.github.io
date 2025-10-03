document.addEventListener('DOMContentLoaded', function () {
    loadChangelog();
    setupEventListeners();
});

let allCommits = [];
let filteredCommits = [];

function setupEventListeners() {
    const typeFilter = document.getElementById('typeFilter');
    const showAllCommits = document.getElementById('showAllCommits');

    if (typeFilter) {
        typeFilter.addEventListener('change', filterCommits);
    }

    if (showAllCommits) {
        showAllCommits.addEventListener('change', filterCommits);
    }
}

async function loadChangelog() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    const changelogContent = document.getElementById('changelogContent');
    const errorMessage = document.getElementById('errorMessage');

    showLoading(true);
    hideError();

    try {
        // 先嘗試使用快取的資料
        let commits = [];
        let dataTimestamp = null;

        const cachedData = getCachedCommits();
        if (cachedData) {
            commits = cachedData.commits;
            dataTimestamp = cachedData.timestamp;
        }

        if (!commits || commits.length === 0) {
            // 從文件或 API 載入
            const result = await fetchCommitsFromGitHub();
            commits = result.commits || result;
            dataTimestamp = result.timestamp || new Date().toISOString();

            // 快取資料
            setCachedCommits(commits, dataTimestamp);
        }

        allCommits = commits;
        filterCommits();

    } catch (error) {
        console.error('Error loading changelog:', error);
        showError();
    } finally {
        showLoading(false);
    }
}

async function fetchCommitsFromGitHub() {
    // 首先嘗試載入預生成的 commits.json
    try {
        const response = await fetch('assets/js/commits.json?t=' + Date.now());
        if (response.ok) {
            const data = await response.json();
            if (data.commits && Array.isArray(data.commits)) {
                console.log('Loaded commits from static file');
                return {
                    commits: data.commits,
                    timestamp: data.timestamp || new Date().toISOString()
                };
            }
        }
    } catch (error) {
        console.log('Static commits file not available, falling back to API');
    }

    // 備用方案：直接從 GitHub API 載入
    const owner = 'ChenGuoXiang940';
    const repo = 'ChenGuoXiang940.github.io';
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/commits`;

    // 請求最近 100 筆 commits
    const response = await fetch(`${apiUrl}?per_page=100&page=1`);

    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
    }

    const commits = await response.json();

    return {
        commits: commits,
        timestamp: new Date().toISOString()
    };
}

function getCachedCommits() {
    try {
        const cached = localStorage.getItem('github_commits_cache');
        if (!cached) return null;

        const data = JSON.parse(cached);
        const now = new Date().getTime();
        const cacheTime = new Date(data.timestamp).getTime();
        const fiveMinutes = 5 * 60 * 1000;

        if (now - cacheTime < fiveMinutes) {
            return data;
        }

        // 快取過期，清除
        localStorage.removeItem('github_commits_cache');
        return null;
    } catch (error) {
        console.error('Error reading cache:', error);
        return null;
    }
}

function setCachedCommits(commits, timestamp = null) {
    try {
        const data = {
            timestamp: timestamp || new Date().toISOString(),
            commits: commits
        };
        localStorage.setItem('github_commits_cache', JSON.stringify(data));
    } catch (error) {
        console.error('Error setting cache:', error);
    }
}

function filterCommits() {
    const typeFilter = document.getElementById('typeFilter');
    const showAllCommits = document.getElementById('showAllCommits');
    const selectedType = typeFilter ? typeFilter.value : '';
    const showAll = showAllCommits ? showAllCommits.checked : true;

    let baseCommits = allCommits;

    // 如果不顯示所有commit，則過濾掉自動化commit
    if (!showAll) {
        baseCommits = allCommits.filter(commit => {
            const message = commit.commit.message.toLowerCase();
            return !message.includes('chore(ci): update languages.json') &&
                !message.includes('chore(ci): update commits.json') &&
                !message.includes('update languages.json') &&
                !message.includes('update commits.json');
        });
    }

    // 根據類型過濾
    if (!selectedType) {
        filteredCommits = baseCommits;
    } else {
        filteredCommits = baseCommits.filter(commit => {
            const message = commit.commit.message.toLowerCase();
            return message.startsWith(selectedType + ':') ||
                message.startsWith(selectedType + '(');
        });
    }

    renderCommits();
}

function renderCommits() {
    const changelogContent = document.getElementById('changelogContent');

    if (!changelogContent) return;

    if (filteredCommits.length === 0) {
        changelogContent.innerHTML = `
            <div class="empty-state">
                <p><strong>暫無更新記錄</strong></p>
                <p>沒有找到符合條件的提交記錄</p>
            </div>
        `;
        return;
    }

    const commitsHtml = filteredCommits.map(commit => {
        const message = commit.commit.message;
        const type = extractCommitType(message);
        const shortSha = commit.sha.substring(0, 7);
        const date = new Date(commit.commit.author.date);

        return `
            <div class="commit-item">
                <div class="commit-header">
                    <span class="commit-type ${type}">${getTypeLabel(type)}</span>
                    <div class="commit-meta">
                        <span class="commit-date">${formatDate(date)}</span>
                        <span class="commit-sha" onclick="copyToClipboard('${commit.sha}')" title="點擊複製完整 SHA">${shortSha}</span>
                    </div>
                </div>
                <div class="commit-message">${escapeHtml(formatCommitMessage(message))}</div>
            </div>
        `;
    }).join('');

    changelogContent.innerHTML = commitsHtml;
}

function extractCommitType(message) {
    const match = message.match(/^(\w+)(?:\(.*?\))?:/);
    if (match) {
        return match[1].toLowerCase();
    }
    return 'other';
}

function getTypeLabel(type) {
    const labels = {
        feat: '新功能',
        fix: '修復',
        docs: '文檔',
        style: '樣式',
        refactor: '重構',
        perf: '性能',
        test: '測試',
        build: '構建',
        ci: 'CI/CD',
        chore: '雜項',
        other: '其他'
    };
    return labels[type] || labels.other;
}

function formatCommitMessage(message) {
    // 移除 type 前綴，只保留主要訊息
    const cleanMessage = message.replace(/^(\w+)(?:\(.*?\))?:\s*/, '');

    // 限制長度並添加省略號
    if (cleanMessage.length > 100) {
        return cleanMessage.substring(0, 100) + '...';
    }

    return cleanMessage;
}

function formatDate(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 60) {
        return `${diffMinutes} 分鐘前`;
    } else if (diffHours < 24) {
        return `${diffHours} 小時前`;
    } else if (diffDays < 7) {
        return `${diffDays} 天前`;
    } else {
        return date.toLocaleDateString('zh-Hant-TW', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}


function showLoading(show) {
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) {
        if (show) {
            loadingIndicator.classList.remove('hidden');
        } else {
            loadingIndicator.classList.add('hidden');
        }
    }
}

function showError() {
    const errorMessage = document.getElementById('errorMessage');
    const changelogContent = document.getElementById('changelogContent');

    if (errorMessage) {
        errorMessage.style.display = 'block';
    }

    if (changelogContent) {
        changelogContent.innerHTML = '';
    }
}

function hideError() {
    const errorMessage = document.getElementById('errorMessage');
    if (errorMessage) {
        errorMessage.style.display = 'none';
    }
}

function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('SHA 已複製到剪貼板');
        }).catch(err => {
            console.error('Failed to copy: ', err);
            fallbackCopyTextToClipboard(text);
        });
    } else {
        fallbackCopyTextToClipboard(text);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showToast('SHA 已複製到剪貼板');
        }
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}

function showToast(message) {
    // 檢查是否已有 toast 功能，如果沒有就創建簡單的提示
    const existingToast = document.querySelector('.changelog-toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'changelog-toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s ease;
    `;

    document.body.appendChild(toast);

    // 觸發動畫
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 10);

    // 自動移除
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function (m) { return map[m]; });
}

// 移除自動刷新功能，改為只在用戶手動操作時才刷新
// 可以通過點擊刷新按鈕或重新載入頁面來更新資料
