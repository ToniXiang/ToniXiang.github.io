document.addEventListener("DOMContentLoaded", function() {
    // localStorage.removeItem('snowStart'); // 測試用
    toggleSnow();
    transformArticle();
});
// 下拉選單功能
function toggleRegin() {
    const reginContent = document.querySelector('.regin-content');
    const welcomeMessage = document.querySelector('.welcome-message');

    if (reginContent.style.display === 'none') {
        reginContent.style.display = 'block';
        welcomeMessage.style.display = 'none';
    } else {
        reginContent.style.display = 'none';
        welcomeMessage.style.display = 'block';
    }
}
//  新增文章卡片淡入效果
function transformArticle() {
    document.querySelectorAll('.year-card').forEach(card => {
        observer.observe(card);
    });
    document.querySelectorAll('.lang-card').forEach(card => {
        observer.observe(card);
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
// 新增雪花特效
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
    let snowStart = localStorage.getItem('snowStart') === 'true';
    const btn = document.getElementById('toggleSnow');
    snowInterval = null;
    if (!snowStart) {
        btn.textContent = '繼續雪花';
        stopSnow();
    } else {
        btn.textContent = '暫停雪花';
        startSnow();
    }
    btn.addEventListener('click', function() {
        snowStart = !snowStart;
        localStorage.setItem('snowStart', snowStart);
        if (!snowStart) {
            this.textContent = '繼續雪花';
            stopSnow();
        } else {
            this.textContent = '暫停雪花';
            startSnow();
        }
    });
}