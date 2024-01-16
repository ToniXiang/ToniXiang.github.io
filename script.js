//展開/摺疊效果
document.addEventListener("DOMContentLoaded", function() {
  const articles = document.querySelectorAll("#news .news-article");
  articles.forEach(article => {
      article.addEventListener("click", function() {
          this.classList.toggle("expanded");
      });
  });
});
//點擊後跳轉頁面
function redirectToPage(url) {
  window.location.href = url;
}