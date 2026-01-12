document.addEventListener('DOMContentLoaded', () => {
    loadNavigationAndFooter();
    loadDefaultTheme();
    setupKeyboardEvents();
    setupBackToTop();
});

// 版本檢查（手動觸發）
function checkVersion() {
    const CURRENT_VERSION = '2026.01.12';
    const savedVersion = localStorage.getItem('tonixiang_version');

    if (savedVersion !== CURRENT_VERSION) {
        // 使用命名空間式清除，只清除本站相關資料
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('tonixiang_')|| key === 'theme') {
                localStorage.removeItem(key);
            }
        });
        localStorage.setItem('tonixiang_version', CURRENT_VERSION);
        loadDefaultTheme(); // 重新載入主題設定
        alert(`當前版本：${CURRENT_VERSION}\n已更新至最新版本，網站資料已重置。`);
    } else {
        alert(`當前版本：${CURRENT_VERSION}\n版本已是最新！`);
    }
}
// 載入預設主題
function loadDefaultTheme() {
    const savedTheme = localStorage.getItem('theme') || 'auto';
    const prefersDarkMQ = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');

    function applySystemTheme() {
        const systemTheme = (prefersDarkMQ && prefersDarkMQ.matches) ? 'dark-theme' : 'light-theme';
        document.body.classList.remove('dark-theme', 'light-theme');
        document.body.classList.add(systemTheme);
    }

    if (savedTheme === 'auto') {
        applySystemTheme();
        const mqListener = () => {
            const currentTheme = localStorage.getItem('theme') || 'auto';
            if (currentTheme === 'auto') {
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
    } else if (savedTheme === 'light') {
        applyTheme('light-theme');
    } else if (savedTheme === 'dark') {
        applyTheme('dark-theme');
    }

    // 更新下拉選單的選中項
    updateThemeSelect(savedTheme);

    window.addEventListener('storage', (ev) => {
        if (ev.key === 'theme') {
            const newVal = ev.newValue || 'auto';
            if (newVal === 'auto') {
                applySystemTheme();
            } else if (newVal === 'light') {
                applyTheme('light-theme');
            } else if (newVal === 'dark') {
                applyTheme('dark-theme');
            }
            updateThemeSelect(newVal);
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
            <div class="brand-info">
                <img src="assets/images/me.jpg" class="sidebar-avatar" alt="Avatar">
                <h4>ToniXiang</h4>
                <div class="sidebar-tags">
                    <span class="tag tag-experience">10+Repos</span>
                    <span class="tag tag-leetcode">LC500+DSA</span>
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
            <div class="nav-label">主題</div>
            <div class="nav-item theme" aria-label="切換主題"  title="快捷鍵 T">
                <div class="nav-text">
                    <select id="theme-select" class="theme-select" onchange="handleThemeChange(this.value)" aria-label="選擇主題">
                        <option value="auto">隨系統主題</option>
                        <option value="light">淺色模式</option>
                        <option value="dark">深色模式</option>
                    </select>
                </div>
            </div>
        </div>
        
        <div class="nav-section">
            <div class="nav-label">系統</div>
            <nav class="nav-item" onclick="checkVersion()" title="檢查網站版本">
                <img src="assets/images/code.svg" alt="version" width="20" height="20" class="nav-icon-img" aria-hidden="true">
                <div class="nav-text">
                    <p>版本檢查</p>
                    <span class="nav-description">檢查更新</span>
                </div>
                <div class="nav-indicator"></div>
            </nav>
        </div>
        `;
    foot.innerHTML = `
        <button id="backToTop" class="back-to-top" aria-label="回到頂部" title="回到頂部">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
        </button>
        <div class="footer-content">
            <div class="footer-grid">
                <div class="footer-brand">
                    <div class="footer-brand-header">
                        <img src="assets/images/commit.svg" class="footer-avatar" alt="Avatar">
                        <p>ToniXiang</p>
                    </div>
                    <div class="footer-specialties">
                        <div class="specialty-item">
                            <span class="specialty-icon">#專長領域</span>
                            <span class="specialty-text">全端架構</span>
                        </div>
                        <div class="specialty-item">
                            <span class="specialty-icon">#技能</span>
                            <span class="specialty-text">C/C++、Flutter 前端、Django 後端</span>
                        </div>
                        <div class="specialty-item">
                            <span class="specialty-icon">#自我定位</span>
                            <span class="specialty-text">學生（持續實作不限於專題的東西）</span>
                        </div>
                    </div>
                    <span class="more-info-trigger" onclick="toggleMoreInfo()">關於我<span class="chevron">›</span>
                    </span>
                </div>
                
                <div class="footer-nav">
                    <h3>本站連結</h3>
                    <a href="index.html">主要頁面</a>
                    <a href="notes.html">學習筆記</a>
                    <a href="origin.html">關於本站</a>
                </div>
                
                <div class="footer-contact">
                    <h3>外部連結</h3>
                    <a href="https://github.com/ToniXiang" target="_blank">GitHub</a>
                    <a href="https://leetcode.com/u/chen199940/" target="_blank">Leetcode</a>
                    <a href="https://drive.google.com/drive/folders/128d_VtA-tXoIiIJfNZrQk87KNk_VWu_y?usp=sharing" target="_blank">履歷</a>
                </div>
            </div>
            <div class="footer-bottom">
                <p>Built with HTML/CSS/JS · Thanks for visiting</p>
            </div>
        </div>
        
        <!-- 更多資訊卡片 -->
        <div id="moreInfoCard" class="more-info-card">
            <div class="more-info-overlay" onclick="toggleMoreInfo()"></div>
            <div class="more-info-content">
                <button class="close-card" onclick="toggleMoreInfo()" aria-label="關閉">
                    <img src="assets/images/close.svg" alt="Close" width="20" height="20">
                </button>
                
                <div class="postcard-layout">
                    <div class="postcard-left">
                        <img src="assets/gif/CryingBlueArchive.gif" alt="https://tenor.com/zh-TW/view/blue-archive-gif-11558330212366339285" class="crying-blue-gif" style="max-width:180px; border-radius:12px; margin-bottom:1rem;" title="Why is it so hard to implement code?">
                        <p>陳國翔<span class="name-en">Guo-Xiang Chen</span></p>
                        <div class="about-section">
                            <p>從高中電子科起步，最初以硬體為主要學習方向。進入科大後接觸資安與網路相關領域。
                            課業之外，會利用時間提升資料結構與演算法能力，透過線上解題或實作專案來驗證所學。</p>
                        </div>
                    </div>
                    
                    <div class="postcard-right">
                        <div class="info-section">
                            <div class="education-list">
                                <p><img src="assets/images/school.svg" alt="school">學歷</p>
                                <div class="education-item" title="2023/9~2027/6">
                                    <div class="item-content">
                                        <div class="education-school">國立臺中科技大學</div>
                                        <div class="education-department">資訊工程系</div>
                                    </div>
                                </div>
                                <div class="education-item" title="2020/9~2023/6 家長會長獎">
                                    <div class="item-content">
                                        <div class="education-school">國立龍潭高級中學</div>
                                        <div class="education-department">電子科</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="info-section">
                            <p><img src="assets/images/license.svg" alt="license">證書(僅顯示近期)</p>
                            <div class="achievement-list">
                                <div class="achievement-item" title="序號:ACE-25-06-A003">
                                    <span class="item-badge">嵌入式</span>
                                    <span class="item-text">Andes Certified Engineer-ACE 高級</span>
                                </div>
                                <div class="achievement-item" title="序號:過了還沒收到證書">
                                    <span class="item-badge">資安</span>
                                    <span class="item-text">iPAS 資訊安全工程師 初級能力鑑定</span>
                                </div>
                                <div class="achievement-item" title="2025/07/27場次">
                                    <span class="item-badge">英文</span>
                                    <span class="item-text">TOEIC Listening and Reading Test 485</span>
                                </div>
                            </div>
                        </div>
                    </div>
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

// 設置鍵盤事件
function setupKeyboardEvents() {
    document.addEventListener('keydown', (event) => {
        // 檢查是否在輸入框或可編輯元素中（包括搜索輸入框）
        const isInInputField = document.activeElement.tagName === 'INPUT' ||
                               document.activeElement.tagName === 'TEXTAREA' ||
                               document.activeElement.isContentEditable;

        if (event.key === 'Escape') {
            closeSidebar();
        }
        // 只有在不處於輸入狀態時才觸發快捷鍵
        else if ((event.key === 'M' || event.key === 'm') && !isInInputField) {
            toggleMenu();
        }
        else if((event.key === 'T' || event.key === 't') && !isInInputField){
            const themeSelect = document.getElementById('theme-select');
            if(themeSelect){
                themeSelect.focus();
            }
        }
    });
}

// 點擊後跳轉頁面
function redirectToPage(url) {
    window.location.href = url;
}
// 處理主題變更
function handleThemeChange(value) {
    localStorage.setItem('theme', value);
    
    if (value === 'auto') {
        const prefersDarkMQ = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
        const systemTheme = (prefersDarkMQ && prefersDarkMQ.matches) ? 'dark-theme' : 'light-theme';
        document.body.classList.remove('dark-theme', 'light-theme');
        document.body.classList.add(systemTheme);
    } else if (value === 'light') {
        applyTheme('light-theme');
    } else if (value === 'dark') {
        applyTheme('dark-theme');
    }
}

// 更新下拉選單的選中項
function updateThemeSelect(value) {
    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) {
        themeSelect.value = value;
    }
}

// 切換主題
function applyTheme(themeName) {
    document.body.classList.remove('dark-theme', 'light-theme');
    document.body.classList.add(themeName);
}


// 設置回到頂部按鈕功能
function setupBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    if (!backToTopButton) return;

    // 顯示/隱藏按鈕
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    // 點擊返回頂部
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 切換更多資訊卡片
function toggleMoreInfo() {
    const card = document.getElementById('moreInfoCard');
    if (card) {
        card.classList.toggle('active');
        // 防止背景滾動
        if (card.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
}
