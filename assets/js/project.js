document.addEventListener('DOMContentLoaded', () => {
    displayCatalog();
    displayArticle();
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
    const navs = document.querySelectorAll('#catalog nav');
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
    const navs = document.querySelectorAll('#catalog nav');
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
// 中與英的語言選擇
document.getElementById('languageSwitcher').addEventListener('change', function() {
    if(currentArticleId==='')return;
    loadArticle(currentArticleId);
});
// article 第一次出現在螢幕而且還要被看到時產生淡入效果
function displayArticle(){
    let observer = new IntersectionObserver(function (entries) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("fadeIn");
            }
        });
    });
    document.querySelectorAll("article").forEach((article) => {
        observer.observe(article);
    });
}