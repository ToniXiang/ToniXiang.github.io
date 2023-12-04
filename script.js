//超連結URL
function redirectToPage(url) {
  window.location.href = url;
}
//展開/摺疊效果
document.addEventListener("DOMContentLoaded", function() {
  const articles = document.querySelectorAll("#news .news-article");
  articles.forEach(article => {
      article.addEventListener("click", function() {
          this.classList.toggle("expanded");
      });
  });
});