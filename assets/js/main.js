document.addEventListener("DOMContentLoaded", function() {
    toggleRain();
    transformArticle();
    initTimeline();
});
//  新增文章卡片淡入效果
function transformArticle() {
    document.querySelectorAll('.timeline-content').forEach(content => {
        observer.observe(content);
    });
}

// 時間軸交互功能
function initTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineContents = document.querySelectorAll('.timeline-content');
    const timelineContentArea = document.querySelector('.timeline-content-area');
    
    // 檢查內容是否需要滾動的函數
    function checkScrollable(content) {
        if (content && timelineContentArea) {
            const isScrollable = content.scrollHeight > content.clientHeight;
            timelineContentArea.classList.toggle('scrollable', isScrollable);
            
            // 添加滾動事件監聽器
            if (isScrollable) {
                content.addEventListener('scroll', function() {
                    const isScrolledToBottom = 
                        this.scrollTop + this.clientHeight >= this.scrollHeight - 5;
                    this.classList.toggle('scrolled-to-bottom', isScrolledToBottom);
                });
            }
        }
    }
    
    // 預設選中第一個項目 (2023年)
    if (timelineItems.length > 0) {
        timelineItems[0].classList.add('active');
        // 檢查第一個內容是否需要滾動
        const firstContent = document.getElementById('content-2023');
        setTimeout(() => checkScrollable(firstContent), 100);
    }
    
    timelineItems.forEach(item => {
        item.addEventListener('click', function() {
            const year = this.getAttribute('data-year');
            
            // 移除所有active類
            timelineItems.forEach(ti => ti.classList.remove('active'));
            timelineContents.forEach(tc => tc.classList.remove('active'));
            
            // 添加active類到選中的項目
            this.classList.add('active');
            const targetContent = document.getElementById(`content-${year}`);
            if (targetContent) {
                targetContent.classList.add('active');
                // 重置滾動位置並檢查是否需要滾動
                targetContent.scrollTop = 0;
                setTimeout(() => checkScrollable(targetContent), 100);
            }
        });
    });
}
const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });
// 新增雨滴特效(預設關閉)
function createRaindrop() {
    const raindrop = document.createElement('div');
    raindrop.classList.add('raindrop');
    raindrop.style.left = Math.random() * window.innerWidth + 'px';
    
    // 記錄雨滴創建時間（僅在 JS 中記錄，不存 localStorage）
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    
    // 更新右側時間顯示
    updateRaindropTimeDisplay(timeString);
    
    // 雨滴大小變化（更細長）
    const width = Math.random() * 3 + 2;  // 2-5px 寬度
    const height = Math.random() * 8 + 12; // 12-20px 高度
    raindrop.style.width = width + 'px';
    raindrop.style.height = height + 'px';
    
    // 透明度和速度
    raindrop.style.opacity = Math.random() * 0.3 + 0.6;
    raindrop.style.animationDuration = (Math.random() * 0.5 + 0.8) + 's'; // 更快的下落速度
    raindrop.style.animationDelay = Math.random() * 0.5 + 's';
    
    // 隨機傾斜度模擬風向
    const tilt = Math.random() * 10 - 5; // -5 到 5 度
    raindrop.style.transform = `rotate(${tilt}deg)`;
    
    raindrop.style.position = 'fixed';
    raindrop.style.zIndex = '9999';
    document.getElementById('raindrops').appendChild(raindrop);
    
    // 創建濺起效果
    setTimeout(() => {
        createSplash(raindrop);
        raindrop.remove();
    }, parseInt(raindrop.style.animationDuration) * 1000);
}

// 更新雨滴時間顯示
let lastDisplayedTime = '';
function updateRaindropTimeDisplay(timeString) {
    const timeDisplay = document.getElementById('raindropTimeDisplay');
    if (timeDisplay && timeString !== lastDisplayedTime) {
        timeDisplay.textContent = timeString;
        timeDisplay.classList.add('active');
        lastDisplayedTime = timeString;
    }
}

function createSplash(raindrop) {
    const splash = document.createElement('div');
    splash.classList.add('raindrop-splash');
    
    // 獲取雨滴落地位置
    const rect = raindrop.getBoundingClientRect();
    splash.style.left = rect.left + 'px';
    splash.style.top = (window.innerHeight - 10) + 'px';
    
    splash.style.position = 'fixed';
    document.getElementById('raindrops').appendChild(splash);
    
    setTimeout(() => {
        splash.remove();
    }, 300);
}

function getRandomNumber(n) {
  return Math.floor(Math.random() * n) + 1;
}

let rainInterval = null;
function startRain() {
    if (!rainInterval) {
        rainInterval = setInterval(createRaindrop, 100); // 更頻繁的雨滴
    }
}

function stopRain() {
    clearInterval(rainInterval);
    rainInterval = null;
    // 清空時間顯示
    const timeDisplay = document.getElementById('raindropTimeDisplay');
    if (timeDisplay) {
        timeDisplay.textContent = '';
        timeDisplay.classList.remove('active');
    }
    // 重置最後顯示的時間
    lastDisplayedTime = '';
}

function toggleRain() {
    const btn = document.getElementById('toggleRain');
    const saved = localStorage.getItem('rainStart');
    let rainStart = saved === null ? false : (saved === 'true');
    if (!btn) return;

    function setButtonText(text) {
        const textEl = btn.querySelector('.btn-text');
        if (textEl) {
            textEl.textContent = text;  
        } else {
            btn.textContent = text;
        }
    }

    if (!rainStart) {
        setButtonText('繼續雨滴');
        stopRain();
    } else {
        setButtonText('暫停雨滴');
        startRain();
    }

    btn.addEventListener('click', function() {
        rainStart = !rainStart;
        localStorage.setItem('rainStart', rainStart);
        if (!rainStart) {
            setButtonText('繼續雨滴');
            stopRain();
        } else {
            setButtonText('暫停雨滴');
            startRain();
        }
    });
}