document.addEventListener('DOMContentLoaded', function() {
    initResumeCard();
    initTimeline();
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

// 初始化時間軸功能
function initTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineContents = document.querySelectorAll('.timeline-content');
    
    // 為每個時間軸項目添加點擊事件
    timelineItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetYear = this.getAttribute('data-year');
            
            // 移除所有active類
            timelineItems.forEach(ti => ti.classList.remove('active'));
            timelineContents.forEach(tc => tc.classList.remove('active'));
            
            // 添加active類到當前項目
            this.classList.add('active');
            const targetContent = document.getElementById(`content-${targetYear}`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
    
    // 設置初始active狀態 (2025年)
    const initialYear = '2025';
    const initialItem = document.querySelector(`[data-year="${initialYear}"]`);
    const initialContent = document.getElementById(`content-${initialYear}`);
    
    if (initialItem && initialContent) {
        initialItem.classList.add('active');
        initialContent.classList.add('active');
    }
}