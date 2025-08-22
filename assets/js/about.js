document.addEventListener('DOMContentLoaded', function() {
    initResumeCard();
});

// 初始化簡歷卡片動畫
function initResumeCard() {
    const resumeCards = document.querySelectorAll('.resume-card');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationDelay = '0.1s';
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    resumeCards.forEach(card => {
        observer.observe(card);
    });
}