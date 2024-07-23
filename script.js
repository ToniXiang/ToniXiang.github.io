// 點擊後跳轉頁面
function redirectToPage(url) {
    window.location.href = url;
}
document.addEventListener("DOMContentLoaded", function () {
    // 設定頁尾的文字
    var rootStyle = getComputedStyle(document.documentElement);
    var aboutText = rootStyle.getPropertyValue('--about-text').trim();
    document.querySelector('footer .about').textContent = aboutText;
    // article 第一次出現在螢幕爾且還要被看到時產生淡入效果
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
// 網頁都有這個效果，被按下有不同顏色且不同大小的彩色球，以圓心在半徑範圍內四散
document.body.addEventListener("click", function (event) {
    for (let i = 0; i < 10; i++) {
        let ball = document.createElement("div");
        ball.style.backgroundColor = getRandomColor();
        ball.style.position = "absolute";
        ball.style.left = `${event.pageX}px`;
        ball.style.top = `${event.pageY}px`;
        ball.style.width = "20px";
        ball.style.height = "20px";
        ball.style.borderRadius = "50%";
        ball.style.zIndex = 1000;
        ball.className = "ball";

        let angle = Math.random() * Math.PI * 2;
        let distance = Math.random() * 100;
        let x = Math.cos(angle) * distance;
        let y = Math.sin(angle) * distance;

        ball.style.setProperty('--x', `${x}px`);
        ball.style.setProperty('--y', `${y}px`);

        document.body.appendChild(ball);

        setTimeout(() => {
            document.body.removeChild(ball);
        }, 300);
    }
});
// 產生隨機顏色
function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
// 點擊後切換深色模式和淺色模式
document.getElementById('themeToggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-theme');
    document.body.classList.toggle('light-theme');
    if (document.body.classList.contains('dark-theme')) {
        setTheme('dark-theme');
    } else {
        setTheme('light-theme');
    }
});
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
// 切換主題
function applyTheme(themeName) {
    document.body.className = themeName;
    if(document.body.classList.contains('light-theme')){
        document.getElementById('prismTheme').setAttribute('href', 'prism_light.css');
    }
    else{
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
        const top = element.getBoundingClientRect().top + window.pageYOffset-70;
        if(top<0)top=0;
        window.scrollTo({
            top: top,
            behavior: "smooth"
        });
    }
}