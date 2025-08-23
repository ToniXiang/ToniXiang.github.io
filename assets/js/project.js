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
    const navs = document.querySelectorAll('#dynamicNavs nav');
    const showNavsButton = document.getElementById('showNavs');
    const h2 = document.querySelector('#catalog h2');
    const catalog = document.getElementById('catalog');
    catalog.classList.add('hidden');
    catalog.classList.remove('visible');
    navs.forEach(nav => {
        nav.classList.add('hidden');
        nav.classList.remove('visible');
    });
    showNavsButton.style.display = 'block';
    h2.style.display = 'none';
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
            // 如果是 GitHub 儲存庫文章，載入表格
            if (articleId === 'github-repos') {
                loadGitHubRepos();
            }
        });
}

// ...existing code...

// Load GitHub repos as a mobile-friendly list (name left, date right, description below)
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
            // Sort by updated_at descending (newest first)
            repos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

            // Try to use a pre-generated static file (assets/js/languages.json) created by GitHub Actions
            const staticLangUrl = 'assets/js/languages.json';
            fetch(staticLangUrl)
                .then(res => res.ok ? res.json() : Promise.reject())
                .then(staticData => {
                    const languageTotals = staticData.totals || {};
                    renderLanguageSummary(languageTotals);
                })
                .catch(() => {
                    // Fallback: fetch per-repo languages (may hit rate limits)
                    const languageTotals = {};
                    const languageFetches = repos.map(r => fetch(r.languages_url)
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
                        // ignore language aggregation errors
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
                // Insert summary below the repo list (at end of the github-list container)
                const container = document.querySelector('.github-list');
                if (container) container.appendChild(summaryContainer);
            }

            // Compute total repo count
            const totalRepos = repos.length;

            repos.forEach(repo => {
                const updatedDate = new Date(repo.updated_at).toLocaleDateString(
                    selectedLanguage === 'en' ? 'en-US' : 'zh-Hant-TW',
                    { year: 'numeric', month: '2-digit', day: '2-digit' }
                );

                const li = document.createElement('li');
                li.className = 'repo-item';
                li.innerHTML = `
                    <div class="repo-row">
                        <a class="repo-name" href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name.replace(/_/g, ' ')}</a>
                        <time class="repo-updated">${updatedDate}</time>
                    </div>
                    <p class="repo-desc">${repo.description || (selectedLanguage === 'en' ? 'No description' : '沒有任何描述')}</p>
                `;
                repoList.appendChild(li);
            });

            // After rendering repos, append a small meta block with total count
            try {
                const meta = document.createElement('div');
                meta.id = 'repos-meta';
                meta.className = 'repos-meta';
                meta.innerHTML = `
                    <div class="meta-row"><span class="meta-label">${selectedLanguage === 'en' ? 'Total repos' : '倉庫總數'}:</span> <strong>${totalRepos}</strong></div>
                `;
                const container = document.querySelector('.github-list');
                if (container) container.appendChild(meta);
            } catch (e) { /* ignore DOM errors */ }
        })
        .catch(error => console.error("Error fetching GitHub repos:", error));
}
// 顯示和隱藏目錄
let catalogEventListenersAdded = false;
function displayCatalog(){
    const h2 = document.querySelector('#catalog h2');
    const showNavsButton = document.getElementById('showNavs');
    const navs = document.querySelectorAll('#dynamicNavs nav');
    const catalog = document.getElementById('catalog');
    
    if(h2&&showNavsButton&&navs&&catalog){
        catalog.classList.add('hidden');
        catalog.classList.remove('visible');
        navs.forEach(nav => {
            nav.classList.add('hidden');
            nav.classList.remove('visible');
        });
        showNavsButton.style.display = 'block';
        h2.style.display = 'none';

        // 只在第一次執行時綁定事件監聽器
        if (!catalogEventListenersAdded) {
            h2.addEventListener('click', () => {
                catalog.classList.add('hidden');
                catalog.classList.remove('visible');
                navs.forEach(nav => {
                    nav.classList.add('hidden');
                    nav.classList.remove('visible');
                });
                showNavsButton.style.display = 'block';
                h2.style.display='none';
            });
        
            showNavsButton.addEventListener('click', () => {
                catalog.classList.add('visible');
                catalog.classList.remove('hidden');
                navs.forEach(nav => {
                    nav.classList.add('visible');
                    nav.classList.remove('hidden');
                });
                showNavsButton.style.display = 'none';
                h2.style.display='block';
            });
            
            catalogEventListenersAdded = true;
        }
    }
}
// 目錄生成
const articles = [
    { id: 'home', title: { en: 'Welcome to My Project Showcase', zh: '歡迎來到我的專案展示' } },
    { id: 'OCC_myproject', title: { en: 'Simple Control Center', zh: '簡易的行控中心' } },
    { id: 'shoppingPlatform', title: { en: 'Shopping Platform', zh: '購物平台' } },
    { id: 'github-repos', title: { en: 'My GitHub Repositories', zh: '我的 GitHub 儲存庫' } }
];
function generateCatalog() {
    const catalog = document.getElementById('catalog');
    const navContainer = document.createElement('div');
    navContainer.id = 'dynamicNavs';
    const existingNavs = document.getElementById('dynamicNavs');
    if (existingNavs) {
        existingNavs.remove();
    }
    const selectedLanguage = document.getElementById('languageSwitcher').value;
    articles.forEach(article => {
        const nav = document.createElement('nav');
        nav.setAttribute('onclick', `loadArticle('${article.id}', event)`);
        nav.innerHTML = `<p>${article.title[selectedLanguage]}</p>`;
        navContainer.appendChild(nav);
    });
    catalog.appendChild(navContainer);
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
    generateCatalog();
    displayCatalog();
    loadArticle('home');
}

// 中與英的語言選擇
const translations = {
    en: {
        catalogTitle: 'Catalog'
    },
    zh: {
        catalogTitle: '目錄'
    }
};
document.getElementById('languageSwitcher').addEventListener('change', function() {
    const selectedLanguage = this.value;
    localStorage.setItem('selectedLanguage', selectedLanguage);
    document.querySelector('#catalog h2').textContent = translations[selectedLanguage].catalogTitle;
    generateCatalog();
    displayCatalog();
    if (currentArticleId === ''){
        loadArticle('home');
        return;
    }
    loadArticle(currentArticleId);
});