document.addEventListener("DOMContentLoaded", function() {
    toggleSnow();
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
    
    // 預設選中第一個項目 (2023年)
    if (timelineItems.length > 0) {
        timelineItems[0].classList.add('active');
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
// 新增雪花特效(預設關閉)
function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    snowflake.style.left = Math.random() * window.innerWidth + 'px';
    const size = Math.random() * 14 + 8;
    snowflake.style.width = size + 'px';
    snowflake.style.height = size + 'px';
    snowflake.style.opacity = Math.random() * 0.5 + 0.2;
    snowflake.style.transform = `rotate(${Math.random() * 360}deg)`;
    snowflake.style.animationDuration = (Math.random() * 2 + 3) + 's';
    snowflake.style.animationDelay = Math.random() * 2 + 's';
    snowflake.style.backgroundColor = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.5})`;
    snowflake.style.boxShadow = `0 0 ${size / 2}px rgba(255, 255, 255, ${Math.random() * 0.5 + 0.5})`;
    snowflake.style.borderRadius = '50%';
    snowflake.style.position = 'fixed';
    document.getElementById('snowflakes').appendChild(snowflake);
    setTimeout(() => {
        snowflake.remove();
    }, 7000);
}
function getRandomNumber(n) {
  return Math.floor(Math.random() * n) + 1;
}
let snowInterval = null;
function startSnow() {
    if (!snowInterval) {
        snowInterval = setInterval(createSnowflake, 200);
    }
}
function stopSnow() {
    clearInterval(snowInterval);
    snowInterval = null;
}
function toggleSnow() {
    const btn = document.getElementById('toggleSnow');
    const saved = localStorage.getItem('snowStart');
    let snowStart = saved === null ? false : (saved === 'true');
    if (!btn) return;

    function setButtonText(text) {
        const textEl = btn.querySelector('.btn-text');
        if (textEl) {
            textEl.textContent = text;  
        } else {
            btn.textContent = text;
        }
    }

    if (!snowStart) {
        setButtonText('繼續雪花');
        stopSnow();
    } else {
        setButtonText('暫停雪花');
        startSnow();
    }

    btn.addEventListener('click', function() {
        snowStart = !snowStart;
        localStorage.setItem('snowStart', snowStart);
        if (!snowStart) {
            setButtonText('繼續雪花');
            stopSnow();
        } else {
            setButtonText('暫停雪花');
            startSnow();
        }
    });
}