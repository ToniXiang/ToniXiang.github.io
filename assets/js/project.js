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

// 載入 GitHub 儲存庫表格
function loadGitHubRepos() {
    const selectedLanguage = document.getElementById('languageSwitcher').value;
    const tableContainer = document.querySelector('.github-table-container');
    const tableHTML = `
        <div class="table-container">
            <table id="repo-table" class="info-table">
                <thead>
                    <tr>
                        <th>${selectedLanguage === 'en' ? 'Repository Name' : '庫名'}</th>
                        <th>${selectedLanguage === 'en' ? 'Description' : '簡介'}</th>
                        <th>${selectedLanguage === 'en' ? 'Last Updated' : '最後更新'}</th>
                    </tr>
                </thead>
                <tbody id="repo-list"></tbody>
            </table>
        </div>
    `;
    tableContainer.innerHTML = tableHTML;
    // 載入 GitHub 儲存庫資料
    fetchGitHubRepos();
}

// 獲取 GitHub 儲存庫資料
function fetchGitHubRepos() {
    const apiUrl = `https://api.github.com/users/ChenGuoXiang940/repos`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(repos => {
            let repoList = document.getElementById("repo-list");
            repoList.innerHTML = ''; // 清空現有內容
            repos.forEach(repo => {
                let row = document.createElement("tr");
                let updatedDate = new Date(repo.updated_at).toLocaleDateString('zh-Hant-TW', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                });
                row.innerHTML = `
                    <td><a href="${repo.html_url}" target="_blank">${repo.name.replace(/_/g, ' ')}</a></td>
                    <td>${repo.description || '沒有任何描述'}</td>
                    <td>${updatedDate}</td>
                `;
                repoList.appendChild(row);
            });
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
        languageSwitcher.value = 'en';
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