document.addEventListener('DOMContentLoaded', function() {
    initResumeCard();
});

// 初始化簡歷卡片動畫
function initResumeCard() {
    const resumeCards = document.querySelectorAll('.resume-card');
    
    const observer = createVisibilityObserver({
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
        className: 'animate-in',
        callback: (target) => {
            target.style.animationDelay = '0.1s';
            target.classList.add('animate-in');
        }
    });
    
    resumeCards.forEach(card => {
        observer.observe(card);
    });
}