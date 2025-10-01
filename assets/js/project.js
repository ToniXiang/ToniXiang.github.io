document.addEventListener('DOMContentLoaded', () => {
    checkLanguage();
});
// 載入文章
let currentArticleId = '';
function loadArticle(articleId, event) {
    window.scrollTo(0, 0);
    currentArticleId = articleId;
    const selectedLanguage = document.getElementById('languageSwitcher').value;
    const repositoryLinkText = {
        en: "Repository Link",
        zh: "儲存庫連結"
    };

    fetch('assets/js/project.json')
        .then(response => response.json())
        .then(data => {
            const article = data.articles[articleId];
            const articleContent = document.getElementById('articleContent');
            
            let articleHTML = `
                <header>
                    <h2>${article.title[selectedLanguage]}</h2>
                    ${article.tags[selectedLanguage].map(tag => `<span class="message-tags">${tag}</span>`).join('')}
                    ${article.repositoryLink ? `<span class="message-tags"><a href="${article.repositoryLink}" target="_blank" class="link">${repositoryLinkText[selectedLanguage]}</a></span>` : ''}
                </header>
                ${article.sections.map(section => `
                    <section>
                        <h3>${section.title[selectedLanguage]}</h3>
                        <div>${section.content[selectedLanguage]}</div>
                    </section>
                `).join('')}
            `;
            articleContent.innerHTML = articleHTML;
            // 如果是 home 頁面，載入 GitHub 儲存庫表格
            if (articleId === 'home') {
                loadGitHubRepos();
            }
        });
}

// 以手機友善的方式載入 GitHub 倉庫列表（名稱左、日期右、描述在下）
function loadGitHubRepos() {
    const selectedLanguage = document.getElementById('languageSwitcher').value;
    const tableContainer = document.querySelector('.github-table-container');
    const headerName = selectedLanguage === 'en' ? 'Repository' : '\u5132\u5b58\u5eab';
    const headerUpdated = selectedLanguage === 'en' ? 'Last Updated' : '\u6700\u5f8c\u66f4\u65b0';
    const listHTML = `
        <div class="github-list" aria-live="polite">
            <div class="list-header">
                <span class="header-name">${headerName}</span>
                <span class="header-updated">${headerUpdated}</span>
            </div>
            <ul id="repo-list" class="repo-list"></ul>
        </div>
    `;
    tableContainer.innerHTML = listHTML;
    fetchGitHubRepos();
}

// 獲取 GitHub 儲存庫資料
function fetchGitHubRepos() {
    const selectedLanguage = document.getElementById('languageSwitcher').value;
    const apiUrl = `https://api.github.com/users/ToniXiang/repos`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(repos => {
            const repoList = document.getElementById("repo-list");
            repoList.innerHTML = '';
            if (!Array.isArray(repos)) return;
            
            // 過濾掉 fork 的庫，只保留原始庫
            const originalRepos = repos.filter(repo => !repo.fork);
            
            // 依 updated_at 降冪排序（最新在前）
            originalRepos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

        // 嘗試使用由 GitHub Actions 預先產生的靜態檔案 (assets/js/languages.json)
            const staticLangUrl = 'assets/js/languages.json';
            fetch(staticLangUrl)
                .then(res => res.ok ? res.json() : Promise.reject())
                .then(staticData => {
                    const languageTotals = staticData.totals || {};
                    renderLanguageSummary(languageTotals);
                })
                .catch(() => {
            // 備援：逐倉庫抓取語言（可能遇到 API 速率限制）
                    const languageTotals = {};
                    const languageFetches = originalRepos.map(r => fetch(r.languages_url)
                        .then(res => res.ok ? res.json() : {})
                        .catch(() => ({}))
                    );

                    Promise.all(languageFetches).then(languageResults => {
                        languageResults.forEach((langObj) => {
                            if (!langObj) return;
                            Object.entries(langObj).forEach(([lang, bytes]) => {
                                languageTotals[lang] = (languageTotals[lang] || 0) + (bytes || 0);
                            });
                        });
                        renderLanguageSummary(languageTotals);
                    }).catch(() => {
                        // 忽略語言彙總錯誤
                    });
                });

            function renderLanguageSummary(languageTotals) {
                const summaryContainer = document.createElement('div');
                summaryContainer.id = 'language-summary';
                summaryContainer.className = 'language-summary';
                const totalBytes = Object.values(languageTotals).reduce((s, v) => s + v, 0) || 0;
                const topLanguages = Object.entries(languageTotals).sort((a, b) => b[1] - a[1]);
                summaryContainer.innerHTML = `<h4>${document.getElementById('languageSwitcher').value === 'en' ? 'Languages (all repos)' : '所有倉庫語言分佈'}</h4>`;
                const list = document.createElement('div');
                list.className = 'language-list';
                topLanguages.forEach(([lang, bytes]) => {
                    const pct = totalBytes ? Math.round((bytes / totalBytes) * 100) : 0;
                    const item = document.createElement('div');
                    item.className = 'lang-item';
                    item.innerHTML = `
                        <div class="lang-label"><span class="lang-name">${lang}</span><span class="lang-pct">${pct}%</span></div>
                        <div class="lang-bar-wrap"><div class="lang-bar" style="width:${pct}%"></div></div>
                    `;
                    list.appendChild(item);
                });
                summaryContainer.appendChild(list);
                const container = document.querySelector('.github-list');
                if (container) container.appendChild(summaryContainer);
            }

            // 計算原始倉庫總數（不包含 fork）
            const totalRepos = originalRepos.length;

            originalRepos.forEach(repo => {
                const updatedDate = new Date(repo.updated_at).toLocaleDateString(
                    selectedLanguage === 'en' ? 'en-US' : 'zh-Hant-TW',
                    { year: 'numeric', month: '2-digit', day: '2-digit' }
                );

                const li = document.createElement('li');
                li.className = 'repo-item';
                li.innerHTML = `
                    <div class="repo-row">
                        <a class="repo-name" href="${repo.html_url}" target="_blank" rel="noopener noreferrer" title="${repo.name.replace(/_/g, ' ')}">${repo.name.replace(/_/g, ' ')}</a>
                        <time class="repo-updated">${updatedDate}</time>
                    </div>
                    <p class="repo-desc">${repo.description || (selectedLanguage === 'en' ? 'No description' : '沒有任何描述')}</p>
                `;
                repoList.appendChild(li);
            });
            try {
                const meta = document.createElement('div');
                meta.id = 'repos-meta';
                meta.className = 'repos-meta';
                meta.innerHTML = `
                    <div class="meta-row"><span class="meta-label">${selectedLanguage === 'en' ? 'Total repos' : '倉庫總數'}:</span> <strong>${totalRepos}</strong></div>
                `;
                const container = document.querySelector('.github-list');
                if (container) container.appendChild(meta);
            } catch (e) { /* 忽略 DOM 錯誤 */ }
        })
        .catch(error => console.error("Error fetching GitHub repos:", error));
}
// 頁面加載時檢查語言選擇
function checkLanguage(){
    let savedLanguage = localStorage.getItem('selectedLanguage');
    const languageSwitcher = document.getElementById('languageSwitcher');
    if (savedLanguage) {
        languageSwitcher.value = savedLanguage;
    }
    else{
        languageSwitcher.value = 'zh';
    }
    loadArticle('home');
}

// 中與英的語言選擇
document.getElementById('languageSwitcher').addEventListener('change', function() {
    const selectedLanguage = this.value;
    localStorage.setItem('selectedLanguage', selectedLanguage);
    if (currentArticleId === ''){
        loadArticle('home');
        return;
    }
    loadArticle(currentArticleId);
});