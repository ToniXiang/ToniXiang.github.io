document.addEventListener('DOMContentLoaded', () => {
    initializeLoadingScreens();
    loadNavigationAndFooter();
    loadDefaultTheme();
    initializeModalEvents();
    setupMenuHover();
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
        const mqListener = (e) => {
            if (!localStorage.getItem('theme')) {
                applySystemTheme();
            }
        };
        if (prefersDarkMQ) {
            if (typeof prefersDarkMQ.addEventListener === 'function') {
                prefersDarkMQ.addEventListener('change', mqListener);
            } else if (typeof prefersDarkMQ.addListener === 'function') {
                prefersDarkMQ.addListener(mqListener);
            }
        }
    }

    window.addEventListener('storage', (ev) => {
        if (ev.key === 'theme') {
            const newVal = ev.newValue;
            if (newVal) {
                applyTheme(newVal);
            } else {
                const prefers = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
                const sysTheme = (prefers && prefers.matches) ? 'dark-theme' : 'light-theme';
                document.body.classList.remove('dark-theme', 'light-theme');
                document.body.classList.add(sysTheme);
                const themeIconImg = document.getElementById('theme-icon');
                if (themeIconImg) {
                    themeIconImg.setAttribute('src', 'assets/images/desktop_windows.svg');
                    themeIconImg.setAttribute('alt', 'system preference');
                }
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
                    <h3>陳國翔</h3>
                    <span class="brand-subtitle">網頁設計作品</span>
                </div>
            </div>
        </div>
        
        <div class="nav-section">
            <div class="nav-label">導覽</div>
            <nav class="nav-item${currentPage === 'index' ? ' active' : ''}" onclick="redirectToPage('index.html')">
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
// 開啟與關閉的導航欄動畫
function toggleMenu() {
    const blogTitle = document.querySelector('.blogTitle');
    const menuIcon = document.querySelector('.menu img.icon');
    const navItems = blogTitle.querySelectorAll('.nav-item');
    const sidebarHeader = blogTitle.querySelector('.sidebar-header');
    const sidebarFooter = blogTitle.querySelector('.sidebar-footer');
    
    blogTitle.classList.toggle('show');
    
    const currentSrc = menuIcon ? menuIcon.getAttribute('src') : '';
    if (currentSrc && currentSrc.indexOf('menu.svg') !== -1) {
        blogTitle.classList.add('show');
        if (menuIcon) menuIcon.setAttribute('src', 'assets/images/close.svg');
        
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
    const navItems = blogTitle ? blogTitle.querySelectorAll('.nav-item') : [];
    const sidebarHeader = blogTitle ? blogTitle.querySelector('.sidebar-header') : null;
    const sidebarFooter = blogTitle ? blogTitle.querySelector('.sidebar-footer') : null;

    if(!menuEl || !blogTitle) return;

    menuEl.addEventListener('mouseenter', ()=>{
        if(blogTitle.classList.contains('show')) return;
        blogTitle.classList.add('show');
        if (menuIcon) menuIcon.setAttribute('src', 'assets/images/close.svg');

        // 添加進入動畫（複製 toggleMenu 中的動畫段落）
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
// 點擊圖片後顯示它的大圖
function openModal(imgSrc, imgName) {
    const modal = document.getElementById("myModal");
    const modalImg = document.getElementById("img01");
    const captionText = document.getElementById("caption");
    
    // use class toggling so CSS animations handle visibility
    modal.classList.add('show');
    modalImg.src = imgSrc;
    captionText.textContent = imgName;
    document.body.classList.add("no-hover-effect");
    
    document.body.style.overflow = 'hidden';
    
    document.addEventListener('keydown', handleModalKeydown);
}

// 關閉模態框
function closeModal() {
    const modal = document.getElementById("myModal");
    modal.classList.remove('show');
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
    document.addEventListener('click', function (e) {
        const closeEl = e.target.closest && e.target.closest('.modal-close');
        if (closeEl) {
            closeModal();
            return;
        }
        const overlayEl = e.target.closest && e.target.closest('.modal-overlay');
        if (overlayEl) {
            closeModal();
            return;
        }
    });

    // 在非觸控裝置上，允許滑鼠移上圖片時開啟 modal（但仍保留點擊行為）
    const isTouchDevice = (('ontouchstart' in window) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 0));
    if (!isTouchDevice) {
        document.addEventListener('mouseover', function (e) {
            const img = e.target.closest && e.target.closest('.centered-image');
            if (!img) return;
            // 如果 modal 已顯示，不重複開啟
            const modal = document.getElementById('myModal');
            if (modal && modal.classList.contains('show')) return;

            const src = img.getAttribute('src') || img.dataset.src;
            const name = img.getAttribute('alt') || '';
            if (src) {
                openModal(src, name);
            }
        });
    }
}
