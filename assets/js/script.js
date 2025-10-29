document.addEventListener('DOMContentLoaded', () => {
    loadNavigationAndFooter();
    loadDefaultTheme();
    setupMenuHover();
    setupKeyboardEvents();
});
// 載入預設主題
function loadDefaultTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkMQ = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');

    function applySystemTheme() {
        const systemTheme = (prefersDarkMQ && prefersDarkMQ.matches) ? 'dark-theme' : 'light-theme';
        document.body.classList.remove('dark-theme', 'light-theme');
        document.body.classList.add(systemTheme);

        const themeIconImg = document.getElementById('theme-icon');
        if (themeIconImg) {
            themeIconImg.setAttribute('src', 'assets/images/desktop_windows.svg');
            themeIconImg.setAttribute('alt', 'system preference');
        }
    }

    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        applySystemTheme();
        const mqListener = () => {
            if (!localStorage.getItem('theme')) {
                applySystemTheme();
            }
        };

        // Add listener with proper error handling
        if (prefersDarkMQ && typeof prefersDarkMQ.addEventListener === 'function') {
            try {
                prefersDarkMQ.addEventListener('change', mqListener);
            } catch (error) {
                console.warn('Failed to add media query listener:', error);
            }
        }
    }

    window.addEventListener('storage', (ev) => {
        if (ev.key === 'theme') {
            const newVal = ev.newValue;
            if (newVal) {
                applyTheme(newVal);
            } else {
                applySystemTheme();
            }
        }
    });
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
                    <h3>側邊欄</h3>
                </div>
            </div>
        </div>
        
        <div class="nav-section">
            <div class="nav-label">導覽</div>
            <nav class="nav-item${currentPage === 'index'||currentPage==='' ? ' active' : ''}" onclick="redirectToPage('index.html')">
                <div class="nav-icon">
                    <img src="assets/images/home.svg" alt="home" width="20" height="20" class="nav-icon-img" aria-hidden="true">
                </div>
                <div class="nav-text">
                    <p>主要頁面</p>
                    <span class="nav-description">首頁介紹</span>
                </div>
                <div class="nav-indicator"></div>
            </nav>
            <nav class="nav-item${currentPage === 'project' ? ' active' : ''}" onclick="redirectToPage('project.html')">
                <img src="assets/images/description.svg" alt="project" width="20" height="20" class="nav-icon-img" aria-hidden="true">
                <div class="nav-text">
                    <p>作品展示</p>
                    <span class="nav-description">項目作品</span>
                </div>
                <div class="nav-indicator"></div>
            </nav>
            <nav class="nav-item${currentPage === 'about' ? ' active' : ''}" onclick="redirectToPage('about.html')">
                <img src="assets/images/person.svg" alt="about" width="20" height="20" class="nav-icon-img" aria-hidden="true">
                <div class="nav-text">
                    <p>關於我</p>
                    <span class="nav-description">個人簡介</span>
                </div>
                <div class="nav-indicator"></div>
            </nav>
            <nav class="nav-item${currentPage === 'changelog' ? ' active' : ''}" onclick="redirectToPage('changelog.html')">
                <img src="assets/images/changelog.svg" alt="changelog" width="20" height="20" class="nav-icon-img" aria-hidden="true">
                <div class="nav-text">
                    <p>更新日誌</p>
                    <span class="nav-description">版本變更紀錄</span>
                </div>
                <div class="nav-indicator"></div>
            </nav>
        </div>
        
        <div class="nav-section">
            <div class="nav-label">設定</div>
            <nav class="nav-item theme" onclick="toggleTheme()" aria-label="切換主題">
                <div class="nav-icon">
                    <img id="theme-icon" src="assets/images/desktop_windows.svg" alt="theme" width="20" height="20" class="nav-icon-img" aria-hidden="true">
                </div>
                <div class="nav-text">
                    <p>切換主題</p>
                    <span class="nav-description">明暗模式</span>
                </div>
                <div class="nav-indicator"></div>
            </nav>
        </div>
        <div class="nav-section">
            <div class="nav-label">資訊</div>
            <div class="sidebar-footer">
                <p>ToniXiang</p>
                <p>網頁設計作品</p>
            </div>
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
                        <a href="https://github.com/ToniXiang" target="_blank" aria-label="GitHub" title="ToniXiang">GitHub</a>
                        <a href="mailto:chen199940@example.com" aria-label="Email" title="chen199940@example.com">Email</a>
                    </div>
                </div>
                <div class="farea farea-nav">
                    <h3>網站導航</h3>
                    <ul>
                        <li><a href="index.html">主要頁面</a></li>
                        <li><a href="project.html">作品展示</a></li>
                        <li><a href="about.html">關於我</a></li>
                        <li><a href="changelog.html">更新日誌</a></li>
                    </ul>
                </div>
                <div class="farea farea-tools">
                    <h3>開發工具</h3>
                    <ul>
                        <li><a href="https://www.jetbrains.com/webstorm/" target="_blank">WebStorm</a></li>
                        <li><a href="https://code.visualstudio.com/" target="_blank">Visual Studio Code</a> </li>
                        <li><a href="https://github.com/features/copilot" target="_blank">GitHub Copilot</a></li>
                    </ul>
                </div>
                <div class="farea farea-resources">
                    <h3>參考資源</h3>
                    <ul>
                        <li><a href="https://navnav.co" target="_blank">NavNav+</a></li>
                        <li><a href="https://bootstrapmade.com" target="_blank">Bootstrap Templates</a></li>
                        <li><a href="https://dribbble.com/" target="_blank">Dribbble</a></li>
                    </ul>
                </div>
            </div>
        </div>`;
    
    // 創建背景遮罩
    if (!document.querySelector('.sidebar-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        overlay.onclick = closeSidebar;
        document.body.appendChild(overlay);
    }
    
    // 防止點擊側邊欄時關閉側邊欄
    if (blogTitle) {
        blogTitle.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
}
// 添加側邊欄進入動畫的共用函數
function playSidebarEnterAnimation() {
    const blogTitle = document.querySelector('.blogTitle');
    if (!blogTitle) return;
    
    const navItems = blogTitle.querySelectorAll('.nav-item');
    const sidebarHeader = blogTitle.querySelector('.sidebar-header');
    const sidebarFooter = blogTitle.querySelector('.sidebar-footer');
    
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
}

// 開啟與關閉的導航欄動畫
function toggleMenu() {
    const blogTitle = document.querySelector('.blogTitle');
    const menuIcon = document.querySelector('.menu img.icon');
    const navItems = blogTitle.querySelectorAll('.nav-item');
    const sidebarHeader = blogTitle.querySelector('.sidebar-header');
    const sidebarFooter = blogTitle.querySelector('.sidebar-footer');
    const overlay = document.querySelector('.sidebar-overlay');
    
    blogTitle.classList.toggle('show');
    
    const currentSrc = menuIcon ? menuIcon.getAttribute('src') : '';
    if (currentSrc && currentSrc.indexOf('menu.svg') !== -1) {
        blogTitle.classList.add('show');
        if (overlay) overlay.classList.add('show');
        if (menuIcon) menuIcon.setAttribute('src', 'assets/images/close.svg');
        
        // 添加進入動畫
        playSidebarEnterAnimation();
        
    } else {
        blogTitle.classList.remove('show');
        if (overlay) overlay.classList.remove('show');
        if (menuIcon) menuIcon.setAttribute('src', 'assets/images/menu.svg');
        
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

// 關閉側邊欄函數
function closeSidebar() {
    const blogTitle = document.querySelector('.blogTitle');
    const menuIcon = document.querySelector('.menu img.icon');
    const overlay = document.querySelector('.sidebar-overlay');
    const navItems = blogTitle.querySelectorAll('.nav-item');
    const sidebarHeader = blogTitle.querySelector('.sidebar-header');
    const sidebarFooter = blogTitle.querySelector('.sidebar-footer');
    
    if (blogTitle && blogTitle.classList.contains('show')) {
        blogTitle.classList.remove('show');
        if (overlay) overlay.classList.remove('show');
        if (menuIcon) menuIcon.setAttribute('src', 'assets/images/menu.svg');
        
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

// 在非觸控裝置上啟用滑鼠移入顯示、移出隱藏的行為（手機仍以點擊為主）
function setupMenuHover(){
    const isTouchDevice = (('ontouchstart' in window) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 0));
    if(isTouchDevice) return; // 觸控裝置不綁定 hover

    const menuEl = document.querySelector('.menu');
    const blogTitle = document.querySelector('.blogTitle');
    const menuIcon = document.querySelector('.menu img.icon');
    const overlay = document.querySelector('.sidebar-overlay');

    if(!menuEl || !blogTitle) return;

    menuEl.addEventListener('mouseenter', ()=>{
        if(blogTitle.classList.contains('show')) return;
        blogTitle.classList.add('show');
        if (overlay) overlay.classList.add('show');
        if (menuIcon) menuIcon.setAttribute('src', 'assets/images/close.svg');

        // 添加進入動畫
        playSidebarEnterAnimation();
    });
}

// 設置鍵盤事件
function setupKeyboardEvents() {
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeSidebar();
        }
    });
}

// 點擊後跳轉頁面
function redirectToPage(url) {
    window.location.href = url;
}
// 點擊後交換主題
function toggleTheme(){
    const themeIconImg = document.getElementById('theme-icon');
    const currentSrc = themeIconImg ? themeIconImg.getAttribute('src') : '';

    if (currentSrc && currentSrc.indexOf('desktop_windows.svg') !== -1) {
        setTheme('light-theme');
        return;
    }

    if (document.body.classList.contains('dark-theme')) {
        setTheme('light-theme');
    } else {
        setTheme('dark-theme');
    }
}
// 紀錄使用者選擇的主題
function setTheme(themeName) {
    localStorage.setItem('theme', themeName);
    applyTheme(themeName);
}
// 切換主題
function applyTheme(themeName) {
    document.body.classList.remove('dark-theme', 'light-theme');
    document.body.classList.add(themeName);
    const themeIconImg = document.getElementById('theme-icon');
    if (themeIconImg) {
        if (document.body.classList.contains('dark-theme')) {
            themeIconImg.setAttribute('src', 'assets/images/light_mode.svg');
            themeIconImg.setAttribute('alt', 'light mode');
        } else {
            themeIconImg.setAttribute('src', 'assets/images/dark_mode.svg');
            themeIconImg.setAttribute('alt', 'dark mode');
        }
    }
}

// 創建可重用的 IntersectionObserver 工具函數
function createVisibilityObserver(options = {}) {
    const {
        threshold = 0.2,
        rootMargin = '0px',
        className = 'visible',
        callback = null,
        unobserveAfter = true
    } = options;

    const observerOptions = {
        threshold,
        rootMargin
    };

    return new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (callback) {
                    callback(entry.target);
                } else {
                    entry.target.classList.add(className);
                }
                if (unobserveAfter) {
                    obs.unobserve(entry.target);
                }
            }
        });
    }, observerOptions);
}
