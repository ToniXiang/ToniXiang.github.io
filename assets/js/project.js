document.addEventListener('DOMContentLoaded', () => {
    checkLanguage();
});
// 載入文章
let currentArticleId = '';
function loadArticle(articleId, event) {
    currentArticleId = articleId;
    const selectedLanguage = document.getElementById('languageSwitcher').value;
    const repositoryLinkText = {
        en: "Repository Link",
        zh: "儲存庫連結"
    };
    const navs = document.querySelectorAll('#dynamicNavs nav');
    const showNavsButton = document.getElementById('showNavs');
    const h2 = document.querySelector('#catalog h2');
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
            articleContent.innerHTML = `
                <header>
                    <h2>${article.title[selectedLanguage]}</h2>
                    ${article.tags[selectedLanguage].map(tag => `<span class="message-tags">${tag}</span>`).join('')}
                    ${article.repositoryLink ? `<span class="message-tags"><a href="${article.repositoryLink}" target="_blank" class="link">${repositoryLinkText[selectedLanguage]}</a></span>` : ''}
                </header>
                ${article.sections.map(section => `
                    <section>
                        <h3>${section.title[selectedLanguage]}</h3>
                        <p>${section.content[selectedLanguage]}</p>
                    </section>
                `).join('')}
            `;
        });
}
// 顯示和隱藏目錄
function displayCatalog(){
    const h2 = document.querySelector('#catalog h2');
    const showNavsButton = document.getElementById('showNavs');
    const navs = document.querySelectorAll('#dynamicNavs nav');
    if(h2&&showNavsButton&&navs){
        h2.addEventListener('click', () => {
            navs.forEach(nav => {
                nav.classList.add('hidden');
                nav.classList.remove('visible');
            });
            showNavsButton.style.display = 'block';
            h2.style.display='none';
        });
    
        showNavsButton.addEventListener('click', () => {
            navs.forEach(nav => {
                nav.classList.add('visible');
                nav.classList.remove('hidden');
            });
            showNavsButton.style.display = 'none';
            h2.style.display='block';
        });
    }
}
// 目錄生成
const articles = [
    { id: 'OCC_myproject', title: { en: 'Simple Control Center', zh: '簡易的行控中心' } },
    { id: 'shoppingPlatform', title: { en: 'Shopping Platform', zh: '購物平台' } },
    { id: 'realTimeVoiceTranslationApp', title: { en: 'Real-Time Voice Translation Application', zh: '即時語音翻譯應用程式' } }
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
    setDefalutMsg();
}

// 中與英的語言選擇
const translations = {
    en: {
        catalogTitle: 'Catalog',
        defaultMessage: 'Explore my project showcase',
        guide: [
            'Explore different projects to understand my work and interests',
            'Each project has detailed descriptions and related links',
            'Feel free to contact me with any questions or suggestions',
            'Supports English and Chinese'
        ]
    },
    zh: {
        catalogTitle: '目錄',
        defaultMessage: '探索我的作品展示',
        guide: [
            '探索不同的專案，了解我的工作和興趣',
            '每個專案都有詳細的描述和相關連結',
            '如果有任何問題或建議，歡迎聯繫我',
            '支持中英語言'
        ]
    }
};
document.getElementById('languageSwitcher').addEventListener('change', function() {
    const selectedLanguage = this.value;
    localStorage.setItem('selectedLanguage', selectedLanguage);
    document.querySelector('#catalog h2').textContent = translations[selectedLanguage].catalogTitle;
    generateCatalog();
    displayCatalog();
    if (currentArticleId === ''){
        setDefalutMsg();
        return;
    }
    loadArticle(currentArticleId);
});
// Project 預設的介紹訊息
function setDefalutMsg(){
    const Language = document.getElementById('languageSwitcher').value;
    document.querySelector('.default-message h2').textContent = translations[Language].defaultMessage;
    const guideList = document.querySelector('.default-message ul');
    guideList.innerHTML = ''; // 清空列表
    translations[Language].guide.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        guideList.appendChild(li);
    });
}