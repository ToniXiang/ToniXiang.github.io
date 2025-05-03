document.addEventListener('DOMContentLoaded', () => {
    initializeLoadingScreens();
    loadDefaultTheme();
    loadNavigationAndFooter();
    initializeBackToTopButton();
    // localStorage.removeItem('notificationDismissed'); // 測試用
    const isNotificationDismissed = localStorage.getItem('notificationDismissed');
    if (!isNotificationDismissed) {
        showNotificationBar();
    }
});
// Loading 加載照片的動畫
function initializeLoadingScreens() {
    const loadingScreens = document.querySelectorAll('.loadingScreen');
    const images = document.querySelectorAll('.img-photo');
    images.forEach((image, index) => {
        const loadingScreen = loadingScreens[index];
        image.addEventListener('load', () => {
            if (loadingScreen) {
                loadingScreen.style.display = 'none';
            }
            image.style.display = 'block';
        });
        image.addEventListener('error', () => {
            if (loadingScreen) {
                loadingScreen.style.display = 'none';
            }
        });
        if (image.complete) {
            image.dispatchEvent(new Event('load'));
        }
    });
}
// 載入預設主題
function loadDefaultTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        const defaultTheme = 'dark-theme';
        applyTheme(defaultTheme);
    }
}
// 頁尾提示
function showNotificationBar() {
    const notificationBar = document.createElement('div');
    notificationBar.id = 'notificationBar';
    const message = document.createElement('span');
    message.textContent = '有新的想法會持續更新';
    message.style.flex = '1';
    const closeButton = document.createElement('button');
    closeButton.textContent = '知道了';
    closeButton.id='closeBar';
    closeButton.addEventListener('click', () => {
        localStorage.setItem('notificationDismissed', 'true');
        notificationBar.remove();
    });
    notificationBar.appendChild(message);
    notificationBar.appendChild(closeButton);
    document.body.appendChild(notificationBar);
}
// 載入時加導覽欄和頁尾的資訊
function loadNavigationAndFooter() {
    function getPageName() {
        const path = window.location.pathname;
        const page = path.split("/").pop();
        const pageName = page.split(".")[0];
        return pageName;
    }

    const names = ['index', 'project', 'about'];
    const navnames = ['主要頁面', '作品展示', '關於我'];
    const icons = ['home', 'description', 'group'];
    let index = names.indexOf(getPageName());
    if (index === -1) index = 0;
    const left = index - 1 < 0 ? 2 : index - 1;
    const right = index + 1 > 2 ? 0 : index + 1;
    const foot = document.querySelector('footer');
    const h1 = document.querySelector('h1');
    h1.innerHTML=`${navnames[index]}`;
    const blogTitle = document.querySelector('.blogTitle');
    blogTitle.innerHTML = `
        <nav class="nav-item" onclick="redirectToPage('${names[left]}.html')">
            <div class="nav-icon">
                <span class="material-symbols-sharp">${icons[left]}</span>
            </div>
            <div class="nav-text">
            <p>${navnames[left]}</p>
            </div>
        </nav>
        <nav class="nav-item" onclick="redirectToPage('${names[right]}.html')">
            <div class="nav-icon">
                <span class="material-symbols-sharp">${icons[right]}</span>
            </div>
            <div class="nav-text">
                <p>${navnames[right]}</p>
            </div>
        </nav>
        <nav class="nav-item" onclick="window.open('https://github.com/ChenGuoXiang940', '_blank')">
            <div class="nav-icon">
                <span class="material-symbols-sharp">share</span>
            </div>
            <div class="nav-text">
                <p>Github</p>
            </div>
        </nav>
        `;
    foot.innerHTML = `
        <hr>
        <div class="footer-content">
            <div class="farea farea-top">
                <div class="footer-logo">
                    <img src="assets/images/me.png" class="footer-img" alt="個人網頁 Logo">
                    <h2>個人網頁</h2>
                </div>
                <p class="author">作者：<strong>陳國翔</strong></p>
                <a class="contact" href="mailto:s1411232069@ad1.nutc.edu.tw"><span class="material-symbols-sharp">mail</span>s1411232069@ad1.nutc.edu.tw</a>
                <p class="location"><span class="material-symbols-sharp">home</span>Taiwan, Taichung</p>
            </div>
            <div class="farea">
                <h3>導航</h3>
                <ul>
                    <li><a href="index.html">主要頁面</a></li>
                    <li><a href="project.html">作品展示</a></li>
                    <li><a href="about.html">關於我</a></li>
                    <li><a href="https://github.com/ChenGuoXiang940">Github</a></li>
                </ul>
            </div>
            <div class="farea">
                <h3>社交媒體</h3>
                <ul>
                    <li><a href="#">Facebook</a></li>
                    <li><a href="#">Twitter</a></li>
                    <li><a href="#">LinkedIn</a></li>
                    <li><a href="#">Instagram</a></li>
                </ul>
            </div>
            <div class="farea">
                <h3>其他資訊</h3>
                <p>使用工具</p>
                <ul>
                    <li><a href="https://code.visualstudio.com/">VSCode</a></li>
                    <li><a href="https://github.com/features/copilot">GitHub Copilot</a></li>
                    <li><a href="https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer">Live Server</a></li>
                </ul>
                <p>參考網站</p>
                <ul>
                    <li><a href="https://navnav.co">All | NavNav+</a></li>
                    <li><a href="https://bootstrapmade.com">Bootstrap Templates</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p>© 2025 個人網頁. All rights reserved.</p>
        </div>`;
}
//  如果不在最頂就顯示"往上的標誌" 如果被按下就滑動到最頂
function initializeBackToTopButton() {
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
}
// 開啟與關閉的導航欄動畫
function toggleMenu() {
    const blogTitle = document.querySelector('.blogTitle');
    const menuIcon = document.querySelector('.menu span.material-symbols-sharp');
    blogTitle.classList.toggle('show');
    if (menuIcon.textContent === 'menu') {
        blogTitle.classList.add('show');
        menuIcon.textContent = 'close';
    } else {
        blogTitle.classList.remove('show');
        menuIcon.textContent = 'menu';
    }
}
// 點擊後跳轉頁面
function redirectToPage(url) {
    window.location.href = url;
}
// 點擊後交換主題
function toggleTheme(){
    document.body.classList.toggle('dark-theme');
    document.body.classList.toggle('light-theme');
    if (document.body.classList.contains('dark-theme')) {
        setTheme('dark-theme');
    } else {
        setTheme('light-theme');
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
// 切換主題
function applyTheme(themeName) {
    document.body.className = themeName;
    const themeIcons = document.querySelectorAll('#theme-icon'); 
    if (document.body.classList.contains('dark-theme')) {
        themeIcons.forEach(themeIcon => themeIcon.textContent = 'light_mode');
    } else {
        themeIcons.forEach(themeIcon => themeIcon.textContent = 'dark_mode');
    }
}
// 圖片點擊後顯示它的大圖
function openModal(imgSrc,imgName) {
    var modal = document.getElementById("myModal");
    var modalImg = document.getElementById("img01");
    var captionText = document.getElementById("caption");
    modal.style.display = "block";
    modalImg.src = imgSrc;
    captionText.textContent = imgName;
    document.body.classList.add("no-hover-effect");
}
// 大圖中用來關閉的按鍵
var span = document.getElementsByClassName("close")[0];
if(span){
    span.onclick = function() {
        var modal = document.getElementById("myModal");
        modal.style.display = "none";
        document.body.classList.remove("no-hover-effect");
    }
}
