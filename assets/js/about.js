// 顯示 article
function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.style.display = 'none');
    document.getElementById(tabId).style.display = 'block';
}