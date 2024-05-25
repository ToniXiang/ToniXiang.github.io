// 點擊後跳轉頁面
function redirectToPage(url) {
    window.location.href = url;
}
// article 第一次出現在螢幕爾且還要被看到時產生淡入效果
document.addEventListener("DOMContentLoaded", function () {
    let observer = new IntersectionObserver(function (entries) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("fadeIn");
            }
        });
    });
    document.querySelectorAll("article").forEach((article) => {
        observer.observe(article);
    });
});
// 網頁都有這個效果，被按下有不同顏色且不同大小的彩色球，以圓心在半徑範圍內四散
document.body.addEventListener("click", function (event) {
    for (let i = 0; i < 10; i++) {
        let ball = document.createElement("div");
        ball.style.backgroundColor = getRandomColor();
        ball.style.position = "absolute";
        ball.style.left = `${event.pageX}px`;
        ball.style.top = `${event.pageY}px`;
        ball.style.width = "20px";
        ball.style.height = "20px";
        ball.style.borderRadius = "50%";
        ball.style.zIndex = 1000;
        ball.className = "ball";

        let angle = Math.random() * Math.PI * 2;
        let distance = Math.random() * 100;
        let x = Math.cos(angle) * distance;
        let y = Math.sin(angle) * distance;

        ball.style.setProperty('--x', `${x}px`);
        ball.style.setProperty('--y', `${y}px`);

        document.body.appendChild(ball);

        setTimeout(() => {
            document.body.removeChild(ball);
        }, 300);
    }
});
// 產生隨機顏色
function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
//點擊照片顯示在左上角
document.querySelectorAll('.img-photo').forEach((img) => {
    img.addEventListener('click', () => {
        if (img.classList.contains('enlarge')) {
            img.classList.remove('enlarge');
        } else {
            img.classList.add('enlarge');
        }
    });
});