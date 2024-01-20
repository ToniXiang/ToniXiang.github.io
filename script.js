//點擊後跳轉頁面
function redirectToPage(url) {
  window.location.href = url;
}

document.addEventListener('DOMContentLoaded', function() {
  //如果頁面在最上方，你可以更改h1元素的透明度、顯示按鈕
  var h1 = document.getElementById('main-page');
  var bn1=document.querySelectorAll('.turnpage-item');
  window.addEventListener('scroll', function() {
    if (window.scrollY === 0) {
        h1.style.opacity = 1;
        bn1.forEach(bn=>bn.hidden=false);
    } else {
        h1.style.opacity = 0.2;
        bn1.forEach(bn=>bn.hidden=true);
    }
  });
});