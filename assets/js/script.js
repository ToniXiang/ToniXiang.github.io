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
            <nav class="nav-item${currentPage === 'notes' ? ' active' : ''}" onclick="redirectToPage('notes.html')">
                <img src="assets/images/description.svg" alt="notes" width="20" height="20" class="nav-icon-img" aria-hidden="true">
                <div class="nav-text">
                    <p>學習筆記</p>
                    <span class="nav-description">技術筆記整理</span>
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
            <nav class="nav-item${currentPage === 'origin' ? ' active' : ''}" onclick="redirectToPage('origin.html')">
                <img src="assets/images/changelog.svg" alt="origin" width="20" height="20" class="nav-icon-img" aria-hidden="true">
                <div class="nav-text">
                    <p>關於本站</p>
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
            <div class="footer-grid">
                <div class="footer-brand">
                    <div class="footer-logo">
                        <img src="assets/images/me.png" class="footer-img" alt="Logo">
                        <h4>ToniXiang</h4>
                    </div>
                    <p class="author-desc">Student at NTCUST, Taiwan</p>
                    <p class="author-desc">熱愛程式設計，持續學習新技術</p>
                </div>
                
                <div class="footer-nav">
                    <h3>導航</h3>
                    <a href="index.html">主要頁面</a>
                    <a href="notes.html">學習筆記</a>
                    <a href="about.html">關於我</a>
                    <a href="origin.html">關於本站</a>
                </div>
                
                <div class="footer-contact">
                    <h3>聯絡</h3>
                    <a href="https://github.com/ToniXiang" target="_blank">GitHub</a>
                    <a href="https://mail.google.com/mail/?view=cm&fs=1&to=chen199940@gmail.com" target="_blank">Gmail</a>
                </div>
            </div>
            <div class="footer-bottom">
                <p>Built with HTML/CSS/JS · Hosted on GitHub Pages</p>
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
                sidebarFooter.style.animation = `slideInFromRight 0.5s cubic-bezier(0.4, 0.0, 0.2, 1) forwards`;
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
        if (menuIcon) menuIcon.setAttribute('src', 'assets/images/menu_open.svg');
        
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
        if (menuIcon) menuIcon.setAttribute('src', 'assets/images/menu_open.svg');

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
