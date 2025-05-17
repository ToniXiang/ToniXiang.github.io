document.addEventListener("DOMContentLoaded", function() {
    toggleSnow();
    transformArticle();
});
//
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
    snowflake.style.opacity = Math.random() * 0.5 + 0.5;
    snowflake.style.transform = `rotate(${Math.random() * 360}deg)`;
    snowflake.style.animationDuration = (Math.random() * 2 + 3) + 's';
    snowflake.style.animationDelay = Math.random() * 2 + 's';
    document.getElementById('snowflakes').appendChild(snowflake);
    setTimeout(() => {
        snowflake.remove();
    }, 6000);
}
function getRandomNumber(n) {
  return Math.floor(Math.random() * n) + 1;
}
let snowPaused = localStorage.getItem('snowPaused') === 'true';
let snowInterval = null;
function startSnow() {
    if (!snowInterval) {
        snowInterval = setInterval(createSnowflake, 120);
    }
}
function stopSnow() {
    clearInterval(snowInterval);
    snowInterval = null;
}
function toggleSnow() {
    const btn = document.getElementById('toggleSnow');
    if (snowPaused) {
        btn.textContent = '繼續雪花';
        stopSnow();
    } else {
        btn.textContent = '暫停雪花';
        startSnow();
    }
    btn.addEventListener('click', function() {
        snowPaused = !snowPaused;
        localStorage.setItem('snowPaused', snowPaused);
        if (snowPaused) {
            stopSnow();
            this.textContent = '繼續雪花';
        } else {
            startSnow();
            this.textContent = '暫停雪花';
        }
    });
}