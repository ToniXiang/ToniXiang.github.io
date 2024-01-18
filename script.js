//點擊後跳轉頁面
function redirectToPage(url) {
  window.location.href = url;
}

document.addEventListener('DOMContentLoaded', function() {
  //如果頁面在最上方，你可以更改h1元素的透明度
  window.addEventListener('scroll', function() {
    var h1 = document.getElementById('main-page');
    if (window.scrollY === 0) {
        h1.style.opacity = 1;
    } else {
        h1.style.opacity = 0.2;
    }
  });
});