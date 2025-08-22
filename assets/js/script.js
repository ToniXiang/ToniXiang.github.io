document.addEventListener('DOMContentLoaded', () => {
    initializeLoadingScreens();
    loadDefaultTheme();
    loadNavigationAndFooter();
    initializeBackToTopButton();
    initializeModalEvents();
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
// 載入時加導覽欄和頁尾的資訊
function loadNavigationAndFooter() {
    const blogTitle = document.querySelector('.blogTitle');
    const foot = document.querySelector('footer');
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    blogTitle.innerHTML = `
        <div class="sidebar-header">
            <div class="brand-container">
                <div class="brand-info">
                    <h3>陳國翔</h3>
                    <span class="brand-subtitle">網頁設計作品</span>
                </div>
            </div>
        </div>
        
        <div class="nav-section">
            <div class="nav-label">導覽</div>
            <nav class="nav-item${currentPage === 'index' ? ' active' : ''}" onclick="redirectToPage('index.html')">
                <div class="nav-icon">
                    <span class="material-symbols-sharp">home</span>
                </div>
                <div class="nav-text">
                    <p>主要頁面</p>
                    <span class="nav-description">首頁介紹</span>
                </div>
                <div class="nav-indicator"></div>
            </nav>
            <nav class="nav-item${currentPage === 'project' ? ' active' : ''}" onclick="redirectToPage('project.html')">
                <div class="nav-icon">
                    <span class="material-symbols-sharp">description</span>
                </div>
                <div class="nav-text">
                    <p>作品展示</p>
                    <span class="nav-description">項目作品</span>
                </div>
                <div class="nav-indicator"></div>
            </nav>
            <nav class="nav-item${currentPage === 'about' ? ' active' : ''}" onclick="redirectToPage('about.html')">
                <div class="nav-icon">
                    <span class="material-symbols-sharp">group</span>
                </div>
                <div class="nav-text">
                    <p>關於我</p>
                    <span class="nav-description">個人簡介</span>
                </div>
                <div class="nav-indicator"></div>
            </nav>
        </div>
        
        <div class="nav-section">
            <div class="nav-label">設定</div>
            <nav class="nav-item theme" onclick="toggleTheme()" aria-label="切換主題">
                <div class="nav-icon">
                    <span class="material-symbols-sharp" id="theme-icon">dark_mode</span>
                </div>
                <div class="nav-text">
                    <p>切換主題</p>
                    <span class="nav-description">明暗模式</span>
                </div>
                <div class="nav-indicator"></div>
            </nav>
        </div>
        `;
    foot.innerHTML = `
        <div class="footer-content">
            <div class="footer-main">
                <div class="farea farea-brand">
                    <div class="footer-logo">
                        <img src="assets/images/me.png" class="footer-img" alt="個人網頁 Logo">
                        <div class="brand-info">
                            <h2>陳國翔</h2>
                            <p class="brand-subtitle">個人網頁</p>
                        </div>
                    </div>
                    <p class="author-description">
                        Hi! I'm a student at NTCUST, Taiwan.
                    </p>
                    <p class="author-description">
                        熱愛程式設計，持續學習新技術
                    </p>
                    <div class="social-links">
                        <a href="https://github.com/ChenGuoXiang940" target="_blank" aria-label="GitHub" title="ChenGuoXiang940">GitHub</a>
                        <a href="mailto:chen199940@example.com" aria-label="Email" title="chen199940@example.com">Email</a>
                    </div>
                </div>
                <div class="farea farea-nav">
                    <h3>網站導航</h3>
                    <ul>
                        <li><a href="index.html">主要頁面</a></li>
                        <li><a href="project.html">作品展示</a></li>
                        <li><a href="about.html">關於我</a></li>
                    </ul>
                </div>
                <div class="farea farea-tools">
                    <h3>開發工具</h3>
                    <ul>
                        <li><a href="https://code.visualstudio.com/" target="_blank">VSCode</a></li>
                        <li><a href="https://github.com/features/copilot" target="_blank">GitHub Copilot</a></li>
                        <li><a href="https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer" target="_blank">Live Server</a></li>
                    </ul>
                </div>
                <div class="farea farea-resources">
                    <h3>參考資源</h3>
                    <ul>
                        <li><a href="https://navnav.co" target="_blank">NavNav+</a></li>
                        <li><a href="https://bootstrapmade.com" target="_blank">Bootstrap Templates</a></li>
                    </ul>
                </div>
            </div>
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
    const navItems = blogTitle.querySelectorAll('.nav-item');
    const sidebarHeader = blogTitle.querySelector('.sidebar-header');
    const sidebarFooter = blogTitle.querySelector('.sidebar-footer');
    
    blogTitle.classList.toggle('show');
    
    if (menuIcon.textContent === 'menu') {
        blogTitle.classList.add('show');
        menuIcon.textContent = 'close';
        
        // 添加進入動畫
        setTimeout(() => {
            if (sidebarHeader) {
                sidebarHeader.style.animation = 'slideInFromTop 0.6s cubic-bezier(0.4, 0.0, 0.2, 1) forwards';
            }
            
            navItems.forEach((item, index) => {
                item.style.opacity = '0';
                item.style.transform = 'translateX(30px)';
                setTimeout(() => {
                    item.style.animation = `slideInFromRight 0.5s cubic-bezier(0.4, 0.0, 0.2, 1) ${index * 0.1}s forwards`;
                }, 100);
            });
            
            if (sidebarFooter) {
                setTimeout(() => {
                    sidebarFooter.style.animation = 'slideInFromBottom 0.6s cubic-bezier(0.4, 0.0, 0.2, 1) forwards';
                }, navItems.length * 100 + 200);
            }
        }, 100);
        
    } else {
        blogTitle.classList.remove('show');
        menuIcon.textContent = 'menu';
        
        // 重置動畫
        if (sidebarHeader) sidebarHeader.style.animation = '';
        if (sidebarFooter) sidebarFooter.style.animation = '';
        navItems.forEach(item => {
            item.style.animation = '';
            item.style.opacity = '';
            item.style.transform = '';
        });
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
// 點擊圖片後顯示它的大圖
function openModal(imgSrc, imgName) {
    const modal = document.getElementById("myModal");
    const modalImg = document.getElementById("img01");
    const captionText = document.getElementById("caption");
    
    modal.style.display = "block";
    modalImg.src = imgSrc;
    captionText.textContent = imgName;
    document.body.classList.add("no-hover-effect");
    
    document.body.style.overflow = 'hidden';
    
    document.addEventListener('keydown', handleModalKeydown);
}

// 關閉模態框
function closeModal() {
    const modal = document.getElementById("myModal");
    modal.style.display = "none";
    document.body.classList.remove("no-hover-effect");
    document.body.style.overflow = 'auto';
    document.removeEventListener('keydown', handleModalKeydown);
}

// 處理模態框的鍵盤事件
function handleModalKeydown(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
}
// 下載圖片
function downloadImage() {
    const modalImg = document.getElementById("img01");
    const captionText = document.getElementById("caption");
    const imgSrc = modalImg.src;
    const imgName = captionText.textContent || 'image';
    
    const link = document.createElement('a');
    link.href = imgSrc;
    link.download = imgName;
    link.click();
}

// 顯示提示訊息
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 1002;
        animation: toastFadeIn 0.3s ease-out;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'toastFadeOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// 初始化模態框事件監聽
function initializeModalEvents() {
    const closeBtn = document.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    const modalOverlay = document.querySelector('.modal-overlay');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadImage);
    }
}

// 為關閉按鈕添加點擊事件
const span = document.getElementsByClassName("close")[0];
if (span) {
    span.onclick = closeModal;
}
