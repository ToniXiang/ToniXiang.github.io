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
    const backdrop = document.getElementById('menuBackdrop');
    // 隱藏下拉目錄與 backdrop，確保點選後背景回復
    catalog.classList.add('hidden');
    catalog.classList.remove('visible');
    if (backdrop) {
        backdrop.classList.remove('visible');
        backdrop.setAttribute('aria-hidden', 'true');
    }
    if (showNavsButton) showNavsButton.setAttribute('aria-expanded', 'false');
    if (catalog) catalog.setAttribute('aria-hidden', 'true');
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
            // 依 updated_at 降冪排序（最新在前）
            repos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

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

            // 計算倉庫總數
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
// 顯示和隱藏目錄
let catalogEventListenersAdded = false;
function displayCatalog(){
    const showNavsButton = document.getElementById('showNavs');
    const navs = document.querySelectorAll('#dynamicNavs nav');
    const catalog = document.getElementById('catalog');
    const backdrop = document.getElementById('menuBackdrop');
    const menuAnchor = document.getElementById('menuAnchor');
    
    if(showNavsButton&&navs&&catalog){
        catalog.classList.remove('visible');
        catalog.classList.add('hidden');
        backdrop && backdrop.classList.remove('visible');
        showNavsButton.setAttribute('aria-expanded','false');
        catalog.setAttribute('aria-hidden','true');
        navs.forEach(nav => {
            nav.classList.remove('visible');
            nav.classList.add('hidden');
        });

        // 只在第一次執行時綁定事件監聽器
        if (!catalogEventListenersAdded) {
                // 點擊切換顯示/隱藏
            showNavsButton.addEventListener('click', (e)=>{
                const isOpen = catalog.classList.contains('visible');
                if(isOpen){
                    catalog.classList.remove('visible');
                    catalog.classList.add('hidden');
                    backdrop && backdrop.classList.remove('visible');
                    showNavsButton.setAttribute('aria-expanded','false');
                    catalog.setAttribute('aria-hidden','true');
                } else {
                    catalog.classList.add('visible');
                    catalog.classList.remove('hidden');
                    backdrop && backdrop.classList.add('visible');
                    showNavsButton.setAttribute('aria-expanded','true');
                    catalog.setAttribute('aria-hidden','false');
                }
            });

            // 滑鼠懸停：滑鼠移入顯示，但不在移出時自動隱藏
            // 僅在非觸控裝置上綁定 hover 開啟 (關閉仍保留關閉按鈕與背景遮罩點擊)
            const isTouchDevice = (('ontouchstart' in window) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 0));
            if (!isTouchDevice) {
                // 只綁定 mouseover / enter 用於開啟 catalog。使用者可透過目錄內的關閉按鈕或點擊 backdrop 來關閉。
                menuAnchor && menuAnchor.addEventListener('mouseover', ()=>{
                    catalog.classList.add('visible');
                    catalog.classList.remove('hidden');
                    backdrop && backdrop.classList.add('visible');
                    showNavsButton.setAttribute('aria-expanded','true');
                    catalog.setAttribute('aria-hidden','false');
                });
                // 不再自動在 mouseleave 時關閉，避免滑鼠短暫移開導致目錄被誤關閉。
            }

            // 點擊背景遮罩關閉
            backdrop && backdrop.addEventListener('click', ()=>{
                catalog.classList.remove('visible');
                catalog.classList.add('hidden');
                backdrop.classList.remove('visible');
                showNavsButton.setAttribute('aria-expanded','false');
                catalog.setAttribute('aria-hidden','true');
            });

            // 目錄內的關閉按鈕
            const closeBtn = document.getElementById('closeCatalog');
            if(closeBtn){
                closeBtn.addEventListener('click', ()=>{
                    catalog.classList.remove('visible');
                    catalog.classList.add('hidden');
                    backdrop && backdrop.classList.remove('visible');
                    showNavsButton.setAttribute('aria-expanded','false');
                    catalog.setAttribute('aria-hidden','true');
                });
            }

            // 按 ESC 鍵關閉
            document.addEventListener('keydown',(ev)=>{
                if(ev.key === 'Escape'){
                    catalog.classList.remove('visible');
                    catalog.classList.add('hidden');
                    backdrop && backdrop.classList.remove('visible');
                    showNavsButton.setAttribute('aria-expanded','false');
                    catalog.setAttribute('aria-hidden','true');
                }
            });

            catalogEventListenersAdded = true;
        }
    }
}
// 目錄生成
const articles = [
    { id: 'home', title: { en: 'Welcome to My Project Showcase', zh: '歡迎來到我的專案展示' } },
    { id: 'OCC_myproject', title: { en: 'Simple Control Center', zh: '簡易的行控中心' } },
    { id: 'shoppingPlatform', title: { en: 'Shopping Platform', zh: '購物平台' } }
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
        nav.setAttribute('role','menuitem');
        nav.setAttribute('tabindex','0');
        nav.addEventListener('click', (e)=> loadArticle(article.id, e));
        nav.addEventListener('keydown', (e)=>{ if(e.key === 'Enter') loadArticle(article.id, e); });
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