function createSnowflake() {
  const snowflake = document.createElement('div');
  snowflake.classList.add('snowflake');
  snowflake.style.left = window.innerWidth/100*getRandomNumber(100) + 'px'; // 雪花始終在視窗的中央生成
  snowflake.style.animationDuration = getRandomNumber(3) + 2 + 's';
  snowflake.style.width = getRandomNumber(10) + 10 + 'px';
  snowflake.style.height = snowflake.style.width;

  document.getElementById('snowflakes').appendChild(snowflake);

  setTimeout(() => {
    snowflake.remove();
  }, 5000);
}
setInterval(createSnowflake, 100);
function redirectToPage(url) {
  window.location.href = url;
}
function getRandomNumber(n) {
  return Math.floor(Math.random() * n) + 1;
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