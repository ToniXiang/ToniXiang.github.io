document.addEventListener("DOMContentLoaded", function() {
    toggleSnow();
    transformArticle();
    initScrollAnimation();
    initCardDetails();
});
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
// 初始化語言卡片動畫
function initLanguageCards() {
    const cards = document.querySelectorAll('.lang-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px) scale(0.8)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
        }, index * 100 + 300);
    });
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            cards.forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.style.animationPlayState = 'paused';
                }
            });
        });
        card.addEventListener('mouseleave', function() {
            cards.forEach(otherCard => {
                otherCard.style.animationPlayState = 'running';
            });
        });
    });
}
// 語言卡片技能等級動畫
function animateSkillLevels() {
    const skillLevels = document.querySelectorAll('.level-indicator');
    skillLevels.forEach(level => {
        const stars = level.textContent;
        level.textContent = '';      
        // 逐個顯示星星
        for (let i = 0; i < stars.length; i++) {
            setTimeout(() => {
                level.textContent += stars[i];
            }, i * 150);
        }
    });
}
// 語言卡片詳細信息動畫
function initCardDetails() {
    const cards = document.querySelectorAll('.lang-card');
    cards.forEach(card => {
        const details = card.querySelector('.card-details');
        const listItems = details.querySelectorAll('li'); 
        card.addEventListener('mouseenter', function() {
            listItems.forEach((item, index) => {
                item.style.opacity = '0';
                item.style.transform = 'translateX(-20px)';
                
                setTimeout(() => {
                    item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                }, index * 50 + 200);
            });
        });
        card.addEventListener('mouseleave', function() {
            // 重置動畫狀態
            listItems.forEach(item => {
                item.style.transition = 'none';
                item.style.opacity = '';
                item.style.transform = '';
            });
        });
    });
}
// 滾動觸發的語言卡片動畫
function initScrollAnimation() {
    const languageSection = document.querySelector('.language-cards');
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                initLanguageCards();
                setTimeout(() => {
                    animateSkillLevels();
                }, 800);
                scrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    if (languageSection) {
        scrollObserver.observe(languageSection);
    }
}
// 視窗大小變化時重新調整動畫
window.addEventListener('resize', function() {
    const cards = document.querySelectorAll('.lang-card');
    cards.forEach(card => {
        card.style.transition = 'none';
        setTimeout(() => {
            card.style.transition = '';
        }, 10);
    });
});