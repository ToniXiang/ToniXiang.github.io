// Loading 加載照片的動畫
document.addEventListener('DOMContentLoaded', () => {
    const loadingScreens = document.querySelectorAll('.loadingScreen');
    const images = document.querySelectorAll('.img-photo');
    images.forEach((image,index)=>{
        const loadingScreen=loadingScreens[index];
        image.addEventListener('load',()=>{
            if(loadingScreen){
                loadingScreen.style.display='none';
            }
            image.style.display='block';
        })
        image.addEventListener('error',()=>{
            if(loadingScreen){
                loadingScreen.style.display='none';
            }
        })
        if(image.complete){
            image.dispatchEvent(new Event('load'));
        }
    });
});
// 開啟手機的導航欄
function toggleMenu() {
    const Navs = document.querySelectorAll('.navigation');
    const h1 = document.querySelector('.blogTitle h1');
    if (window.getComputedStyle(h1).display === 'none'){
        h1.style.display = 'block';
    }
    else{
        h1.style.display = 'none';
    }
    Navs.forEach((Nav)=>{
        if (window.getComputedStyle(Nav).display === 'none') {
            Nav.style.display = 'flex';
        } else {
            Nav.style.display = 'none';
        }
    });
}
// 點擊後跳轉頁面
function redirectToPage(url) {
    window.location.href = url;
}
document.addEventListener("DOMContentLoaded", function () {
    // 設定頁尾的文字
    var rootStyle = getComputedStyle(document.documentElement);
    const footerTexts = ['--about1-text', '--about2-text'];
    footerTexts.forEach((textVar, index) => {
        const aboutText = rootStyle.getPropertyValue(textVar).trim();
        document.querySelector(`footer .about${index + 1}`).textContent = aboutText;
    });
    // article 第一次出現在螢幕而且還要被看到時產生淡入效果
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
});
//如果不在最頂就顯示"往上的標誌" 如果被按下就滑動到最頂
document.addEventListener('DOMContentLoaded', () => {
    const backToTopButton = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            backToTopButton.classList.add('show');
            backToTopButton.classList.remove('hide');
        } else {
            backToTopButton.classList.add('hide');
            backToTopButton.classList.remove('show');
        }
    });
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
// 點擊後交換主題
function toggleTheme(){
    document.body.classList.toggle('dark-theme');
    document.body.classList.toggle('light-theme');
    if (document.body.classList.contains('dark-theme')) {
        setTheme('dark-theme');
        document.getElementById('prismTheme').setAttribute('href', 'prism_dark.css');
    } else {
        setTheme('light-theme');
        document.getElementById('prismTheme').setAttribute('href', 'prism_light.css');
    }
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    }
}
// 紀錄使用者選擇的主題
function setTheme(themeName) {
    localStorage.setItem('theme', themeName);
    applyTheme(themeName);
}
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    }
});
// 切換 github-readme-stats 主題
function setStats(action) {
    document.querySelectorAll('.stats').forEach(item => {
        let src = item.getAttribute('src');
        if (action==="add"&&!src.includes('tokyonight')) {
            src = `${src}&theme=tokyonight`;
        }
        else if(action==="remove"&&src.includes('tokyonight')){
            src = src.replace('&theme=tokyonight', '');
        }
        item.setAttribute('src', src);
    });
}
// 切換主題
function applyTheme(themeName) {
    document.body.className = themeName;
    const themeIcons = document.querySelectorAll('#theme-icon');
    const themePs = document.querySelectorAll('#theme-p');
    if(document.body.classList.contains('light-theme')){
        setStats("remove");
        themeIcons.forEach(themeIcon=>{
            themeIcon.textContent='light_mode';
        });
        themePs.forEach(themeP=>{
            themeP.textContent='亮色';
        });
        document.getElementById('prismTheme').setAttribute('href', 'prism_light.css');
    }
    else{
        setStats("add");
        themeIcons.forEach(themeIcon=>{
            themeIcon.textContent='dark_mode';
        });
        themePs.forEach(themeP=>{
            themeP.textContent='暗色';
        });
        document.getElementById('prismTheme').setAttribute('href', 'prism_dark.css');
    }
}
// 點擊後跳轉頁面
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('#catalog nav');
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            document.querySelector(`#catalog nav[onclick="toArticle('#${id}')"]`).classList.add('active');
        } else {
            const id = entry.target.getAttribute('id');
            document.querySelector(`#catalog nav[onclick="toArticle('#${id}')"]`).classList.remove('active');
        }
    });
});
sections.forEach((section) => {
    observer.observe(section);
});
function toArticle(selector) {                
    const element = document.querySelector(selector);
    if (element) {
        const top = element.getBoundingClientRect().top + window.scrollY -70;
        if(top<0)top=0;
        window.scrollTo({
            top: top,
            behavior: "smooth"
        });
    }
}
// 顯示和隱藏目錄
document.addEventListener('DOMContentLoaded', () => {
    const h2 = document.querySelector('#catalog h2');
    const showNavsButton = document.getElementById('showNavs');
    const navs = document.querySelectorAll('#catalog nav');
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
});
// 圖片點擊後占滿整個螢幕大小
function openModal(imgSrc,imgName) {
    var modal = document.getElementById("myModal");
    var modalImg = document.getElementById("img01");
    var captionText = document.getElementById("caption");
    modal.style.display = "block";
    modalImg.src = imgSrc;
    captionText.textContent = imgName;
    document.body.classList.add("no-hover-effect");
}
var span = document.getElementsByClassName("close")[0];
span.onclick = function() {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
    document.body.classList.remove("no-hover-effect");
}
