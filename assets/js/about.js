document.addEventListener('DOMContentLoaded', function() {
    // initDynamicNav(); // 已移除頂部導航
    initResumeCard();
});

/*
// 初始化動態導航 - 已移除頂部導航功能
function initDynamicNav() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('article[id]');
    
    function smoothScrollTo(target) {
        const targetElement = document.getElementById(target);
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 100;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
    
    function updateActiveNav(target) {
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-target') === target) {
                item.classList.add('active');
            }
        });
    }
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('data-target');
            updateActiveNav(target);
            smoothScrollTo(target);
        });
    });
    
    let isScrolling = false;
    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            window.requestAnimationFrame(function() {
                const scrollPosition = window.scrollY + 150;
                let currentSection = '';
                
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.offsetHeight;
                    
                    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                        currentSection = section.getAttribute('id');
                    }
                });
                
                if (currentSection) {
                    updateActiveNav(currentSection);
                }
                
                isScrolling = false;
            });
        }
        isScrolling = true;
    });
};
*/

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
};